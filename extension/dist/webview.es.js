var Er = Array.isArray, mr = Array.from, wr = Object.defineProperty, K = Object.getOwnPropertyDescriptor;
const H = 2, rr = 4, tr = 8, gr = 16, A = 32, L = 64, q = 128, I = 256, w = 512, U = 1024, P = 2048, nr = 4096, V = 8192, xr = 16384, Tr = 1 << 18, yr = 1 << 19;
function Nr(r) {
  return r === this.v;
}
function Cr() {
  throw new Error("effect_update_depth_exceeded");
}
let er = !1;
function Dr() {
  er = !0;
}
function Sr(r) {
  return {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: r,
    reactions: null,
    equals: Nr,
    version: 0
  };
}
const Fr = 1, kr = 2;
var G, lr, ur;
function Ar() {
  if (G === void 0) {
    G = window;
    var r = Element.prototype, t = Node.prototype;
    lr = K(t, "firstChild").get, ur = K(t, "nextSibling").get, r.__click = void 0, r.__className = "", r.__attributes = null, r.__styles = null, r.__e = void 0, Text.prototype.__t = void 0;
  }
}
function Or(r = "") {
  return document.createTextNode(r);
}
// @__NO_SIDE_EFFECTS__
function z(r) {
  return lr.call(r);
}
// @__NO_SIDE_EFFECTS__
function Rr(r) {
  return ur.call(r);
}
function or(r) {
  var t = r.children;
  if (t !== null) {
    r.children = null;
    for (var n = 0; n < t.length; n += 1) {
      var e = t[n];
      e.f & H ? ar(
        /** @type {Derived} */
        e
      ) : O(
        /** @type {Effect} */
        e
      );
    }
  }
}
function br(r) {
  var t, n = E;
  D(r.parent);
  try {
    or(r), t = cr(r);
  } finally {
    D(n);
  }
  return t;
}
function Ir(r) {
  var t = br(r), n = (y || r.f & q) && r.deps !== null ? P : w;
  S(r, n), r.equals(t) || (r.v = t, r.version = Br());
}
function ar(r) {
  or(r), k(r, 0), S(r, V), r.v = r.children = r.deps = r.ctx = r.reactions = null;
}
function Mr(r, t) {
  var n = t.last;
  n === null ? t.last = t.first = r : (n.next = r, r.prev = n, t.last = r);
}
function Y(r, t, n, e = !0) {
  var l = (r & L) !== 0, u = E, o = {
    ctx: m,
    deps: null,
    deriveds: null,
    nodes_start: null,
    nodes_end: null,
    f: r | U,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: l ? null : u,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (n) {
    var i = N;
    try {
      J(!0), W(o), o.f |= xr;
    } catch (c) {
      throw O(o), c;
    } finally {
      J(i);
    }
  } else
    t !== null && Kr(o);
  var a = n && o.deps === null && o.first === null && o.nodes_start === null && o.teardown === null && (o.f & yr) === 0;
  if (!a && !l && e && (u !== null && Mr(o, u), h !== null && h.f & H)) {
    var s = (
      /** @type {Derived} */
      h
    );
    (s.children ?? (s.children = [])).push(o);
  }
  return o;
}
function Lr(r) {
  const t = Y(L, r, !0);
  return () => {
    O(t);
  };
}
function qr(r) {
  return Y(rr, r, !1);
}
function Pr(r, t = !0) {
  return Y(tr | A, r, !0, t);
}
function ir(r) {
  var t = r.teardown;
  if (t !== null) {
    const n = h;
    C(null);
    try {
      t.call(null);
    } finally {
      C(n);
    }
  }
}
function sr(r) {
  var t = r.deriveds;
  if (t !== null) {
    r.deriveds = null;
    for (var n = 0; n < t.length; n += 1)
      ar(t[n]);
  }
}
function fr(r, t = !1) {
  var n = r.first;
  for (r.first = r.last = null; n !== null; ) {
    var e = n.next;
    O(n, t), n = e;
  }
}
function Vr(r) {
  for (var t = r.first; t !== null; ) {
    var n = t.next;
    t.f & A || O(t), t = n;
  }
}
function O(r, t = !0) {
  var n = !1;
  if ((t || r.f & Tr) && r.nodes_start !== null) {
    for (var e = r.nodes_start, l = r.nodes_end; e !== null; ) {
      var u = e === l ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Rr(e)
      );
      e.remove(), e = u;
    }
    n = !0;
  }
  fr(r, t && !n), sr(r), k(r, 0), S(r, V);
  var o = r.transitions;
  if (o !== null)
    for (const a of o)
      a.stop();
  ir(r);
  var i = r.parent;
  i !== null && i.first !== null && _r(r), r.next = r.prev = r.teardown = r.ctx = r.deps = r.parent = r.fn = r.nodes_start = r.nodes_end = null;
}
function _r(r) {
  var t = r.parent, n = r.prev, e = r.next;
  n !== null && (n.next = e), e !== null && (e.prev = n), t !== null && (t.first === r && (t.first = e), t.last === r && (t.last = n));
}
let M = !1, N = !1;
function J(r) {
  N = r;
}
let B = [], F = 0;
let h = null;
function C(r) {
  h = r;
}
let E = null;
function D(r) {
  E = r;
}
let p = null, d = 0, vr = 0, y = !1, m = null;
function Br() {
  return ++vr;
}
function j(r) {
  var o, i;
  var t = r.f;
  if (t & U)
    return !0;
  if (t & P) {
    var n = r.deps, e = (t & q) !== 0;
    if (n !== null) {
      var l;
      if (t & I) {
        for (l = 0; l < n.length; l++)
          ((o = n[l]).reactions ?? (o.reactions = [])).push(r);
        r.f ^= I;
      }
      for (l = 0; l < n.length; l++) {
        var u = n[l];
        if (j(
          /** @type {Derived} */
          u
        ) && Ir(
          /** @type {Derived} */
          u
        ), e && E !== null && !y && !((i = u == null ? void 0 : u.reactions) != null && i.includes(r)) && (u.reactions ?? (u.reactions = [])).push(r), u.version > r.version)
          return !0;
      }
    }
    e || S(r, w);
  }
  return !1;
}
function Hr(r, t, n) {
  throw r;
}
function cr(r) {
  var c;
  var t = p, n = d, e = h, l = y, u = m, o = r.f;
  p = /** @type {null | Value[]} */
  null, d = 0, h = o & (A | L) ? null : r, y = !N && (o & q) !== 0, m = r.ctx;
  try {
    var i = (
      /** @type {Function} */
      (0, r.fn)()
    ), a = r.deps;
    if (p !== null) {
      var s;
      if (k(r, d), a !== null && d > 0)
        for (a.length = d + p.length, s = 0; s < p.length; s++)
          a[d + s] = p[s];
      else
        r.deps = a = p;
      if (!y)
        for (s = d; s < a.length; s++)
          ((c = a[s]).reactions ?? (c.reactions = [])).push(r);
    } else
      a !== null && d < a.length && (k(r, d), a.length = d);
    return i;
  } finally {
    p = t, d = n, h = e, y = l, m = u;
  }
}
function Ur(r, t) {
  let n = t.reactions;
  if (n !== null) {
    var e = n.indexOf(r);
    if (e !== -1) {
      var l = n.length - 1;
      l === 0 ? n = t.reactions = null : (n[e] = n[l], n.pop());
    }
  }
  n === null && t.f & H && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (p === null || !p.includes(t)) && (S(t, P), t.f & (q | I) || (t.f ^= I), k(
    /** @type {Derived} **/
    t,
    0
  ));
}
function k(r, t) {
  var n = r.deps;
  if (n !== null)
    for (var e = t; e < n.length; e++)
      Ur(r, n[e]);
}
function W(r) {
  var t = r.f;
  if (!(t & V)) {
    S(r, w);
    var n = E;
    E = r;
    try {
      t & gr ? Vr(r) : fr(r), sr(r), ir(r);
      var e = cr(r);
      r.teardown = typeof e == "function" ? e : null, r.version = vr;
    } catch (l) {
      Hr(
        /** @type {Error} */
        l
      );
    } finally {
      E = n;
    }
  }
}
function Yr() {
  F > 1e3 && (F = 0, Cr()), F++;
}
function jr(r) {
  var t = r.length;
  if (t !== 0) {
    Yr();
    var n = N;
    N = !0;
    try {
      for (var e = 0; e < t; e++) {
        var l = r[e];
        l.f & w || (l.f ^= w);
        var u = [];
        dr(l, u), Wr(u);
      }
    } finally {
      N = n;
    }
  }
}
function Wr(r) {
  var t = r.length;
  if (t !== 0)
    for (var n = 0; n < t; n++) {
      var e = r[n];
      !(e.f & (V | nr)) && j(e) && (W(e), e.deps === null && e.first === null && e.nodes_start === null && (e.teardown === null ? _r(e) : e.fn = null));
    }
}
function $r() {
  if (M = !1, F > 1001)
    return;
  const r = B;
  B = [], jr(r), M || (F = 0);
}
function Kr(r) {
  M || (M = !0, queueMicrotask($r));
  for (var t = r; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (n & (L | A)) {
      if (!(n & w))
        return;
      t.f ^= w;
    }
  }
  B.push(t);
}
function dr(r, t) {
  var n = r.first, e = [];
  r:
    for (; n !== null; ) {
      var l = n.f, u = (l & A) !== 0, o = u && (l & w) !== 0;
      if (!o && !(l & nr))
        if (l & tr) {
          u ? n.f ^= w : j(n) && W(n);
          var i = n.first;
          if (i !== null) {
            n = i;
            continue;
          }
        } else
          l & rr && e.push(n);
      var a = n.next;
      if (a === null) {
        let _ = n.parent;
        for (; _ !== null; ) {
          if (r === _)
            break r;
          var s = _.next;
          if (s !== null) {
            n = s;
            continue r;
          }
          _ = _.parent;
        }
      }
      n = a;
    }
  for (var c = 0; c < e.length; c++)
    i = e[c], t.push(i), dr(i, t);
}
const Gr = ~(U | P | w);
function S(r, t) {
  r.f = r.f & Gr | t;
}
function zr(r, t = !1, n) {
  m = {
    p: m,
    c: null,
    e: null,
    m: !1,
    s: r,
    x: null,
    l: null
  }, er && !t && (m.l = {
    s: null,
    u: null,
    r1: [],
    r2: Sr(!1)
  });
}
function Jr(r) {
  const t = m;
  if (t !== null) {
    r !== void 0 && (t.x = r);
    const o = t.e;
    if (o !== null) {
      var n = E, e = h;
      t.e = null;
      try {
        for (var l = 0; l < o.length; l++) {
          var u = o[l];
          D(u.effect), C(u.reaction), qr(u.fn);
        }
      } finally {
        D(n), C(e);
      }
    }
    m = t.p, t.m = !0;
  }
  return r || /** @type {T} */
  {};
}
const Qr = /* @__PURE__ */ new Set(), Q = /* @__PURE__ */ new Set();
function b(r) {
  var $;
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), e = r.type, l = (($ = r.composedPath) == null ? void 0 : $.call(r)) || [], u = (
    /** @type {null | Element} */
    l[0] || r.target
  ), o = 0, i = r.__root;
  if (i) {
    var a = l.indexOf(i);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      r.__root = t;
      return;
    }
    var s = l.indexOf(t);
    if (s === -1)
      return;
    a <= s && (o = a);
  }
  if (u = /** @type {Element} */
  l[o] || r.target, u !== t) {
    wr(r, "currentTarget", {
      configurable: !0,
      get() {
        return u || n;
      }
    });
    var c = h, _ = E;
    C(null), D(null);
    try {
      for (var f, v = []; u !== null; ) {
        var g = u.assignedSlot || u.parentNode || /** @type {any} */
        u.host || null;
        try {
          var x = u["__" + e];
          if (x !== void 0 && !/** @type {any} */
          u.disabled)
            if (Er(x)) {
              var [pr, ...hr] = x;
              pr.apply(u, [r, ...hr]);
            } else
              x.call(u, r);
        } catch (R) {
          f ? v.push(R) : f = R;
        }
        if (r.cancelBubble || g === t || g === null)
          break;
        u = g;
      }
      if (f) {
        for (let R of v)
          queueMicrotask(() => {
            throw R;
          });
        throw f;
      }
    } finally {
      r.__root = t, delete r.currentTarget, C(c), D(_);
    }
  }
}
function Xr(r) {
  var t = document.createElement("template");
  return t.innerHTML = r, t.content;
}
function X(r, t) {
  var n = (
    /** @type {Effect} */
    E
  );
  n.nodes_start === null && (n.nodes_start = r, n.nodes_end = t);
}
// @__NO_SIDE_EFFECTS__
function Zr(r, t) {
  var n = (t & Fr) !== 0, e = (t & kr) !== 0, l, u = !r.startsWith("<!>");
  return () => {
    l === void 0 && (l = Xr(u ? r : "<!>" + r), n || (l = /** @type {Node} */
    /* @__PURE__ */ z(l)));
    var o = (
      /** @type {TemplateNode} */
      e ? document.importNode(l, !0) : l.cloneNode(!0)
    );
    if (n) {
      var i = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ z(o)
      ), a = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      X(i, a);
    } else
      X(o, o);
    return o;
  };
}
function rt(r, t) {
  r !== null && r.before(
    /** @type {Node} */
    t
  );
}
const tt = ["touchstart", "touchmove"];
function nt(r) {
  return tt.includes(r);
}
function et(r, t) {
  return lt(r, t);
}
const T = /* @__PURE__ */ new Map();
function lt(r, { target: t, anchor: n, props: e = {}, events: l, context: u, intro: o = !0 }) {
  Ar();
  var i = /* @__PURE__ */ new Set(), a = (_) => {
    for (var f = 0; f < _.length; f++) {
      var v = _[f];
      if (!i.has(v)) {
        i.add(v);
        var g = nt(v);
        t.addEventListener(v, b, { passive: g });
        var x = T.get(v);
        x === void 0 ? (document.addEventListener(v, b, { passive: g }), T.set(v, 1)) : T.set(v, x + 1);
      }
    }
  };
  a(mr(Qr)), Q.add(a);
  var s = void 0, c = Lr(() => {
    var _ = n ?? t.appendChild(Or());
    return Pr(() => {
      if (u) {
        zr({});
        var f = (
          /** @type {ComponentContext} */
          m
        );
        f.c = u;
      }
      l && (e.$$events = l), s = r(_, e) || {}, u && Jr();
    }), () => {
      var g;
      for (var f of i) {
        t.removeEventListener(f, b);
        var v = (
          /** @type {number} */
          T.get(f)
        );
        --v === 0 ? (document.removeEventListener(f, b), T.delete(f)) : T.set(f, v);
      }
      Q.delete(a), Z.delete(s), _ !== n && ((g = _.parentNode) == null || g.removeChild(_));
    };
  });
  return Z.set(s, c), s;
}
let Z = /* @__PURE__ */ new WeakMap();
const ut = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(ut);
Dr();
var ot = /* @__PURE__ */ Zr('<div class="h-full flex justify-center items-center text-2xl">Hello from Svelte.</div>');
function at(r) {
  var t = ot();
  rt(r, t);
}
const it = et(at, { target: document.getElementById("app") });
export {
  it as default
};
