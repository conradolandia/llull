import { mount } from "svelte";
import App from "./components/App.svelte";
import "./app.css";

// @ts-ignore
if (__APP_ENV__ === "development") {
  import("./dev.css");
}

const app = mount(App, { target: document.getElementById("app")! });

export default app;