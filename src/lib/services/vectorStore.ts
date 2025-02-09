import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

interface MemoryEntry {
  id: string;          // Added for better tracking
  text: string;        // Full text instead of summary
  keywords: string[];
  timestamp: number;
  role: 'user' | 'assistant';  // Added to differentiate message types
}

export class VectorStore {
  private initialized: boolean = false;
  private memories: MemoryEntry[] = [];
  private storageFile: string;
  private readonly MAX_MEMORIES = 20;  // Increased from 10
  private readonly MAX_TEXT_LENGTH = 500;  // Increased from 200
  private readonly SAVE_INTERVAL = 2000;  // Added debounced save interval
  private saveTimeout: NodeJS.Timeout | null = null;

  // Common words to filter out
  private readonly STOP_WORDS = new Set([
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
    'have', 'has', 'had', 'does', 'did', 'doing', 'would', 'should', 'could',
    'will', 'shall', 'might', 'must', 'that', 'this', 'these', 'those', 'then'
  ]);

  constructor(private context: vscode.ExtensionContext) {
    this.storageFile = path.join(context.globalStorageUri.fsPath, 'memory_store.json');
    this.initializeStore().catch(console.error);
  }

  private async initializeStore() {
    try {
      await fs.mkdir(path.dirname(this.storageFile), { recursive: true });
      try {
        const data = await fs.readFile(this.storageFile, 'utf-8');
        this.memories = JSON.parse(data);
        console.log(`Loaded ${this.memories.length} memories from storage`);
      } catch {
        this.memories = [];
        await this.saveToFile();
        console.log('Created new memory store');
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize memory store:', error);
      throw error;
    }
  }

  private async saveToFile() {
    try {
      await fs.writeFile(this.storageFile, JSON.stringify(this.memories, null, 2));
    } catch (error) {
      console.error('Failed to save memories:', error);
    }
  }

  private debouncedSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveToFile();
      this.saveTimeout = null;
    }, this.SAVE_INTERVAL);
  }

  private extractKeywords(text: string): string[] {
    return text.toLowerCase()
      .split(/\W+/)
      .filter(word =>
        word.length > 3 &&
        !this.STOP_WORDS.has(word) &&
        !/^\d+$/.test(word)  // Filter out pure numbers
      )
      .slice(0, 10);  // Keep more keywords
  }

  async addToMemory(text: string) {
    if (!this.initialized) {
      console.warn('Memory store not initialized yet');
      return;
    }

    // Parse user and assistant parts
    const [userPart, assistantPart] = text.split('\nAssistant: ');
    const userText = userPart.replace('User: ', '');

    // Create separate entries for user and assistant
    const entries: MemoryEntry[] = [
      {
        id: `u_${Date.now()}`,
        text: userText.slice(0, this.MAX_TEXT_LENGTH),
        keywords: this.extractKeywords(userText),
        timestamp: Date.now(),
        role: 'user'
      }
    ];

    if (assistantPart) {
      entries.push({
        id: `a_${Date.now()}`,
        text: assistantPart.slice(0, this.MAX_TEXT_LENGTH),
        keywords: this.extractKeywords(assistantPart),
        timestamp: Date.now(),
        role: 'assistant'
      });
    }

    this.memories.push(...entries);

    // Keep only latest memories
    if (this.memories.length > this.MAX_MEMORIES) {
      this.memories = this.memories.slice(-this.MAX_MEMORIES);
    }

    this.debouncedSave();
  }

  async getRelevantContext(query: string): Promise<string> {
    if (!this.initialized) {
      console.warn('Memory store not initialized yet');
      return '';
    }

    const queryKeywords = this.extractKeywords(query);
    if (queryKeywords.length === 0) return '';

    // Find memories with matching keywords
    const relevant = this.memories
      .map(memory => ({
        memory,
        score: this.calculateRelevanceScore(memory, queryKeywords)
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)  // Get top 3 most relevant memories
      .map(({ memory }) => memory.text);

    return relevant.join('\n');
  }

  private calculateRelevanceScore(memory: MemoryEntry, queryKeywords: string[]): number {
    const keywordMatches = memory.keywords.filter(k => queryKeywords.includes(k)).length;
    const recency = 1 - Math.min((Date.now() - memory.timestamp) / (24 * 60 * 60 * 1000), 1);

    // Weight recent matches more heavily
    return keywordMatches * (0.7 + 0.3 * recency);
  }
}
