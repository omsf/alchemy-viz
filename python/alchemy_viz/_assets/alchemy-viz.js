function Cc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Vt = { exports: {} }, gr = {}, Ue = {}, rt = {}, yr = {}, $r = {}, br = {}, Fo;
function Jn() {
  return Fo || (Fo = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class n extends t {
      constructor(h) {
        if (super(), !e.IDENTIFIER.test(h))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = h;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = n;
    class r extends t {
      constructor(h) {
        super(), this._items = typeof h == "string" ? [h] : h;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const h = this._items[0];
        return h === "" || h === '""';
      }
      get str() {
        var h;
        return (h = this._str) !== null && h !== void 0 ? h : this._str = this._items.reduce((_, S) => `${_}${S}`, "");
      }
      get names() {
        var h;
        return (h = this._names) !== null && h !== void 0 ? h : this._names = this._items.reduce((_, S) => (S instanceof n && (_[S.str] = (_[S.str] || 0) + 1), _), {});
      }
    }
    e._Code = r, e.nil = new r("");
    function s(g, ...h) {
      const _ = [g[0]];
      let S = 0;
      for (; S < h.length; )
        a(_, h[S]), _.push(g[++S]);
      return new r(_);
    }
    e._ = s;
    const o = new r("+");
    function i(g, ...h) {
      const _ = [v(g[0])];
      let S = 0;
      for (; S < h.length; )
        _.push(o), a(_, h[S]), _.push(o, v(g[++S]));
      return c(_), new r(_);
    }
    e.str = i;
    function a(g, h) {
      h instanceof r ? g.push(...h._items) : h instanceof n ? g.push(h) : g.push(m(h));
    }
    e.addCodeArg = a;
    function c(g) {
      let h = 1;
      for (; h < g.length - 1; ) {
        if (g[h] === o) {
          const _ = l(g[h - 1], g[h + 1]);
          if (_ !== void 0) {
            g.splice(h - 1, 3, _);
            continue;
          }
          g[h++] = "+";
        }
        h++;
      }
    }
    function l(g, h) {
      if (h === '""')
        return g;
      if (g === '""')
        return h;
      if (typeof g == "string")
        return h instanceof n || g[g.length - 1] !== '"' ? void 0 : typeof h != "string" ? `${g.slice(0, -1)}${h}"` : h[0] === '"' ? g.slice(0, -1) + h.slice(1) : void 0;
      if (typeof h == "string" && h[0] === '"' && !(g instanceof n))
        return `"${g}${h.slice(1)}`;
    }
    function d(g, h) {
      return h.emptyStr() ? g : g.emptyStr() ? h : i`${g}${h}`;
    }
    e.strConcat = d;
    function m(g) {
      return typeof g == "number" || typeof g == "boolean" || g === null ? g : v(Array.isArray(g) ? g.join(",") : g);
    }
    function b(g) {
      return new r(v(g));
    }
    e.stringify = b;
    function v(g) {
      return JSON.stringify(g).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = v;
    function $(g) {
      return typeof g == "string" && e.IDENTIFIER.test(g) ? new r(`.${g}`) : s`[${g}]`;
    }
    e.getProperty = $;
    function w(g) {
      if (typeof g == "string" && e.IDENTIFIER.test(g))
        return new r(`${g}`);
      throw new Error(`CodeGen: invalid export name: ${g}, use explicit $id name mapping`);
    }
    e.getEsmExportName = w;
    function u(g) {
      return new r(g.toString());
    }
    e.regexpCode = u;
  })(br)), br;
}
var vr = {}, zo;
function jo() {
  return zo || (zo = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = /* @__PURE__ */ Jn();
    class n extends Error {
      constructor(l) {
        super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
      }
    }
    var r;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(r || (e.UsedValueState = r = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class s {
      constructor({ prefixes: l, parent: d } = {}) {
        this._names = {}, this._prefixes = l, this._parent = d;
      }
      toName(l) {
        return l instanceof t.Name ? l : this.name(l);
      }
      name(l) {
        return new t.Name(this._newName(l));
      }
      _newName(l) {
        const d = this._names[l] || this._nameGroup(l);
        return `${l}${d.index++}`;
      }
      _nameGroup(l) {
        var d, m;
        if (!((m = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || m === void 0) && m.has(l) || this._prefixes && !this._prefixes.has(l))
          throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
        return this._names[l] = { prefix: l, index: 0 };
      }
    }
    e.Scope = s;
    class o extends t.Name {
      constructor(l, d) {
        super(d), this.prefix = l;
      }
      setValue(l, { property: d, itemIndex: m }) {
        this.value = l, this.scopePath = (0, t._)`.${new t.Name(d)}[${m}]`;
      }
    }
    e.ValueScopeName = o;
    const i = (0, t._)`\n`;
    class a extends s {
      constructor(l) {
        super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? i : t.nil };
      }
      get() {
        return this._scope;
      }
      name(l) {
        return new o(l, this._newName(l));
      }
      value(l, d) {
        var m;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const b = this.toName(l), { prefix: v } = b, $ = (m = d.key) !== null && m !== void 0 ? m : d.ref;
        let w = this._values[v];
        if (w) {
          const h = w.get($);
          if (h)
            return h;
        } else
          w = this._values[v] = /* @__PURE__ */ new Map();
        w.set($, b);
        const u = this._scope[v] || (this._scope[v] = []), g = u.length;
        return u[g] = d.ref, b.setValue(d, { property: v, itemIndex: g }), b;
      }
      getValue(l, d) {
        const m = this._values[l];
        if (m)
          return m.get(d);
      }
      scopeRefs(l, d = this._values) {
        return this._reduceValues(d, (m) => {
          if (m.scopePath === void 0)
            throw new Error(`CodeGen: name "${m}" has no value`);
          return (0, t._)`${l}${m.scopePath}`;
        });
      }
      scopeCode(l = this._values, d, m) {
        return this._reduceValues(l, (b) => {
          if (b.value === void 0)
            throw new Error(`CodeGen: name "${b}" has no value`);
          return b.value.code;
        }, d, m);
      }
      _reduceValues(l, d, m = {}, b) {
        let v = t.nil;
        for (const $ in l) {
          const w = l[$];
          if (!w)
            continue;
          const u = m[$] = m[$] || /* @__PURE__ */ new Map();
          w.forEach((g) => {
            if (u.has(g))
              return;
            u.set(g, r.Started);
            let h = d(g);
            if (h) {
              const _ = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              v = (0, t._)`${v}${_} ${g} = ${h};${this.opts._n}`;
            } else if (h = b?.(g))
              v = (0, t._)`${v}${h}${this.opts._n}`;
            else
              throw new n(g);
            u.set(g, r.Completed);
          });
        }
        return v;
      }
    }
    e.ValueScope = a;
  })(vr)), vr;
}
var Io;
function ie() {
  return Io || (Io = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = /* @__PURE__ */ Jn(), n = /* @__PURE__ */ jo();
    var r = /* @__PURE__ */ Jn();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return r.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return r.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return r.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } });
    var s = /* @__PURE__ */ jo();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class o {
      optimizeNodes() {
        return this;
      }
      optimizeNames(k, E) {
        return this;
      }
    }
    class i extends o {
      constructor(k, E, D) {
        super(), this.varKind = k, this.name = E, this.rhs = D;
      }
      render({ es5: k, _n: E }) {
        const D = k ? n.varKinds.var : this.varKind, te = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${D} ${this.name}${te};` + E;
      }
      optimizeNames(k, E) {
        if (k[this.name.str])
          return this.rhs && (this.rhs = I(this.rhs, k, E)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends o {
      constructor(k, E, D) {
        super(), this.lhs = k, this.rhs = E, this.sideEffects = D;
      }
      render({ _n: k }) {
        return `${this.lhs} = ${this.rhs};` + k;
      }
      optimizeNames(k, E) {
        if (!(this.lhs instanceof t.Name && !k[this.lhs.str] && !this.sideEffects))
          return this.rhs = I(this.rhs, k, E), this;
      }
      get names() {
        const k = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return L(k, this.rhs);
      }
    }
    class c extends a {
      constructor(k, E, D, te) {
        super(k, D, te), this.op = E;
      }
      render({ _n: k }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + k;
      }
    }
    class l extends o {
      constructor(k) {
        super(), this.label = k, this.names = {};
      }
      render({ _n: k }) {
        return `${this.label}:` + k;
      }
    }
    class d extends o {
      constructor(k) {
        super(), this.label = k, this.names = {};
      }
      render({ _n: k }) {
        return `break${this.label ? ` ${this.label}` : ""};` + k;
      }
    }
    class m extends o {
      constructor(k) {
        super(), this.error = k;
      }
      render({ _n: k }) {
        return `throw ${this.error};` + k;
      }
      get names() {
        return this.error.names;
      }
    }
    class b extends o {
      constructor(k) {
        super(), this.code = k;
      }
      render({ _n: k }) {
        return `${this.code};` + k;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(k, E) {
        return this.code = I(this.code, k, E), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class v extends o {
      constructor(k = []) {
        super(), this.nodes = k;
      }
      render(k) {
        return this.nodes.reduce((E, D) => E + D.render(k), "");
      }
      optimizeNodes() {
        const { nodes: k } = this;
        let E = k.length;
        for (; E--; ) {
          const D = k[E].optimizeNodes();
          Array.isArray(D) ? k.splice(E, 1, ...D) : D ? k[E] = D : k.splice(E, 1);
        }
        return k.length > 0 ? this : void 0;
      }
      optimizeNames(k, E) {
        const { nodes: D } = this;
        let te = D.length;
        for (; te--; ) {
          const ne = D[te];
          ne.optimizeNames(k, E) || (Q(k, ne.names), D.splice(te, 1));
        }
        return D.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((k, E) => R(k, E.names), {});
      }
    }
    class $ extends v {
      render(k) {
        return "{" + k._n + super.render(k) + "}" + k._n;
      }
    }
    class w extends v {
    }
    class u extends $ {
    }
    u.kind = "else";
    class g extends $ {
      constructor(k, E) {
        super(E), this.condition = k;
      }
      render(k) {
        let E = `if(${this.condition})` + super.render(k);
        return this.else && (E += "else " + this.else.render(k)), E;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const k = this.condition;
        if (k === !0)
          return this.nodes;
        let E = this.else;
        if (E) {
          const D = E.optimizeNodes();
          E = this.else = Array.isArray(D) ? new u(D) : D;
        }
        if (E)
          return k === !1 ? E instanceof g ? E : E.nodes : this.nodes.length ? this : new g(V(k), E instanceof g ? [E] : E.nodes);
        if (!(k === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(k, E) {
        var D;
        if (this.else = (D = this.else) === null || D === void 0 ? void 0 : D.optimizeNames(k, E), !!(super.optimizeNames(k, E) || this.else))
          return this.condition = I(this.condition, k, E), this;
      }
      get names() {
        const k = super.names;
        return L(k, this.condition), this.else && R(k, this.else.names), k;
      }
    }
    g.kind = "if";
    class h extends $ {
    }
    h.kind = "for";
    class _ extends h {
      constructor(k) {
        super(), this.iteration = k;
      }
      render(k) {
        return `for(${this.iteration})` + super.render(k);
      }
      optimizeNames(k, E) {
        if (super.optimizeNames(k, E))
          return this.iteration = I(this.iteration, k, E), this;
      }
      get names() {
        return R(super.names, this.iteration.names);
      }
    }
    class S extends h {
      constructor(k, E, D, te) {
        super(), this.varKind = k, this.name = E, this.from = D, this.to = te;
      }
      render(k) {
        const E = k.es5 ? n.varKinds.var : this.varKind, { name: D, from: te, to: ne } = this;
        return `for(${E} ${D}=${te}; ${D}<${ne}; ${D}++)` + super.render(k);
      }
      get names() {
        const k = L(super.names, this.from);
        return L(k, this.to);
      }
    }
    class f extends h {
      constructor(k, E, D, te) {
        super(), this.loop = k, this.varKind = E, this.name = D, this.iterable = te;
      }
      render(k) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(k);
      }
      optimizeNames(k, E) {
        if (super.optimizeNames(k, E))
          return this.iterable = I(this.iterable, k, E), this;
      }
      get names() {
        return R(super.names, this.iterable.names);
      }
    }
    class p extends $ {
      constructor(k, E, D) {
        super(), this.name = k, this.args = E, this.async = D;
      }
      render(k) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(k);
      }
    }
    p.kind = "func";
    class y extends v {
      render(k) {
        return "return " + super.render(k);
      }
    }
    y.kind = "return";
    class C extends $ {
      render(k) {
        let E = "try" + super.render(k);
        return this.catch && (E += this.catch.render(k)), this.finally && (E += this.finally.render(k)), E;
      }
      optimizeNodes() {
        var k, E;
        return super.optimizeNodes(), (k = this.catch) === null || k === void 0 || k.optimizeNodes(), (E = this.finally) === null || E === void 0 || E.optimizeNodes(), this;
      }
      optimizeNames(k, E) {
        var D, te;
        return super.optimizeNames(k, E), (D = this.catch) === null || D === void 0 || D.optimizeNames(k, E), (te = this.finally) === null || te === void 0 || te.optimizeNames(k, E), this;
      }
      get names() {
        const k = super.names;
        return this.catch && R(k, this.catch.names), this.finally && R(k, this.finally.names), k;
      }
    }
    class A extends $ {
      constructor(k) {
        super(), this.error = k;
      }
      render(k) {
        return `catch(${this.error})` + super.render(k);
      }
    }
    A.kind = "catch";
    class P extends $ {
      render(k) {
        return "finally" + super.render(k);
      }
    }
    P.kind = "finally";
    class T {
      constructor(k, E = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...E, _n: E.lines ? `
` : "" }, this._extScope = k, this._scope = new n.Scope({ parent: k }), this._nodes = [new w()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(k) {
        return this._scope.name(k);
      }
      // reserves unique name in the external scope
      scopeName(k) {
        return this._extScope.name(k);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(k, E) {
        const D = this._extScope.value(k, E);
        return (this._values[D.prefix] || (this._values[D.prefix] = /* @__PURE__ */ new Set())).add(D), D;
      }
      getScopeValue(k, E) {
        return this._extScope.getValue(k, E);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(k) {
        return this._extScope.scopeRefs(k, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(k, E, D, te) {
        const ne = this._scope.toName(E);
        return D !== void 0 && te && (this._constants[ne.str] = D), this._leafNode(new i(k, ne, D)), ne;
      }
      // `const` declaration (`var` in es5 mode)
      const(k, E, D) {
        return this._def(n.varKinds.const, k, E, D);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(k, E, D) {
        return this._def(n.varKinds.let, k, E, D);
      }
      // `var` declaration with optional assignment
      var(k, E, D) {
        return this._def(n.varKinds.var, k, E, D);
      }
      // assignment code
      assign(k, E, D) {
        return this._leafNode(new a(k, E, D));
      }
      // `+=` code
      add(k, E) {
        return this._leafNode(new c(k, e.operators.ADD, E));
      }
      // appends passed SafeExpr to code or executes Block
      code(k) {
        return typeof k == "function" ? k() : k !== t.nil && this._leafNode(new b(k)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...k) {
        const E = ["{"];
        for (const [D, te] of k)
          E.length > 1 && E.push(","), E.push(D), (D !== te || this.opts.es5) && (E.push(":"), (0, t.addCodeArg)(E, te));
        return E.push("}"), new t._Code(E);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(k, E, D) {
        if (this._blockNode(new g(k)), E && D)
          this.code(E).else().code(D).endIf();
        else if (E)
          this.code(E).endIf();
        else if (D)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(k) {
        return this._elseNode(new g(k));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new u());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(g, u);
      }
      _for(k, E) {
        return this._blockNode(k), E && this.code(E).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(k, E) {
        return this._for(new _(k), E);
      }
      // `for` statement for a range of values
      forRange(k, E, D, te, ne = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
        const oe = this._scope.toName(k);
        return this._for(new S(ne, oe, E, D), () => te(oe));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(k, E, D, te = n.varKinds.const) {
        const ne = this._scope.toName(k);
        if (this.opts.es5) {
          const oe = E instanceof t.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, t._)`${oe}.length`, (W) => {
            this.var(ne, (0, t._)`${oe}[${W}]`), D(ne);
          });
        }
        return this._for(new f("of", te, ne, E), () => D(ne));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(k, E, D, te = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(k, (0, t._)`Object.keys(${E})`, D);
        const ne = this._scope.toName(k);
        return this._for(new f("in", te, ne, E), () => D(ne));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(h);
      }
      // `label` statement
      label(k) {
        return this._leafNode(new l(k));
      }
      // `break` statement
      break(k) {
        return this._leafNode(new d(k));
      }
      // `return` statement
      return(k) {
        const E = new y();
        if (this._blockNode(E), this.code(k), E.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(y);
      }
      // `try` statement
      try(k, E, D) {
        if (!E && !D)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const te = new C();
        if (this._blockNode(te), this.code(k), E) {
          const ne = this.name("e");
          this._currNode = te.catch = new A(ne), E(ne);
        }
        return D && (this._currNode = te.finally = new P(), this.code(D)), this._endBlockNode(A, P);
      }
      // `throw` statement
      throw(k) {
        return this._leafNode(new m(k));
      }
      // start self-balancing block
      block(k, E) {
        return this._blockStarts.push(this._nodes.length), k && this.code(k).endBlock(E), this;
      }
      // end the current self-balancing block
      endBlock(k) {
        const E = this._blockStarts.pop();
        if (E === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const D = this._nodes.length - E;
        if (D < 0 || k !== void 0 && D !== k)
          throw new Error(`CodeGen: wrong number of nodes: ${D} vs ${k} expected`);
        return this._nodes.length = E, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(k, E = t.nil, D, te) {
        return this._blockNode(new p(k, E, D)), te && this.code(te).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(p);
      }
      optimize(k = 1) {
        for (; k-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(k) {
        return this._currNode.nodes.push(k), this;
      }
      _blockNode(k) {
        this._currNode.nodes.push(k), this._nodes.push(k);
      }
      _endBlockNode(k, E) {
        const D = this._currNode;
        if (D instanceof k || E && D instanceof E)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${E ? `${k.kind}/${E.kind}` : k.kind}"`);
      }
      _elseNode(k) {
        const E = this._currNode;
        if (!(E instanceof g))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = E.else = k, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const k = this._nodes;
        return k[k.length - 1];
      }
      set _currNode(k) {
        const E = this._nodes;
        E[E.length - 1] = k;
      }
    }
    e.CodeGen = T;
    function R(z, k) {
      for (const E in k)
        z[E] = (z[E] || 0) + (k[E] || 0);
      return z;
    }
    function L(z, k) {
      return k instanceof t._CodeOrName ? R(z, k.names) : z;
    }
    function I(z, k, E) {
      if (z instanceof t.Name)
        return D(z);
      if (!te(z))
        return z;
      return new t._Code(z._items.reduce((ne, oe) => (oe instanceof t.Name && (oe = D(oe)), oe instanceof t._Code ? ne.push(...oe._items) : ne.push(oe), ne), []));
      function D(ne) {
        const oe = E[ne.str];
        return oe === void 0 || k[ne.str] !== 1 ? ne : (delete k[ne.str], oe);
      }
      function te(ne) {
        return ne instanceof t._Code && ne._items.some((oe) => oe instanceof t.Name && k[oe.str] === 1 && E[oe.str] !== void 0);
      }
    }
    function Q(z, k) {
      for (const E in k)
        z[E] = (z[E] || 0) - (k[E] || 0);
    }
    function V(z) {
      return typeof z == "boolean" || typeof z == "number" || z === null ? !z : (0, t._)`!${H(z)}`;
    }
    e.not = V;
    const q = O(e.operators.AND);
    function Y(...z) {
      return z.reduce(q);
    }
    e.and = Y;
    const re = O(e.operators.OR);
    function U(...z) {
      return z.reduce(re);
    }
    e.or = U;
    function O(z) {
      return (k, E) => k === t.nil ? E : E === t.nil ? k : (0, t._)`${H(k)} ${z} ${H(E)}`;
    }
    function H(z) {
      return z instanceof t.Name ? z : (0, t._)`(${z})`;
    }
  })($r)), $r;
}
var ce = {}, Do;
function de() {
  if (Do) return ce;
  Do = 1, Object.defineProperty(ce, "__esModule", { value: !0 }), ce.checkStrictMode = ce.getErrorPath = ce.Type = ce.useFunc = ce.setEvaluated = ce.evaluatedPropsToName = ce.mergeEvaluated = ce.eachItem = ce.unescapeJsonPointer = ce.escapeJsonPointer = ce.escapeFragment = ce.unescapeFragment = ce.schemaRefOrVal = ce.schemaHasRulesButRef = ce.schemaHasRules = ce.checkUnknownRules = ce.alwaysValidSchema = ce.toHash = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ Jn();
  function n(f) {
    const p = {};
    for (const y of f)
      p[y] = !0;
    return p;
  }
  ce.toHash = n;
  function r(f, p) {
    return typeof p == "boolean" ? p : Object.keys(p).length === 0 ? !0 : (s(f, p), !o(p, f.self.RULES.all));
  }
  ce.alwaysValidSchema = r;
  function s(f, p = f.schema) {
    const { opts: y, self: C } = f;
    if (!y.strictSchema || typeof p == "boolean")
      return;
    const A = C.RULES.keywords;
    for (const P in p)
      A[P] || S(f, `unknown keyword: "${P}"`);
  }
  ce.checkUnknownRules = s;
  function o(f, p) {
    if (typeof f == "boolean")
      return !f;
    for (const y in f)
      if (p[y])
        return !0;
    return !1;
  }
  ce.schemaHasRules = o;
  function i(f, p) {
    if (typeof f == "boolean")
      return !f;
    for (const y in f)
      if (y !== "$ref" && p.all[y])
        return !0;
    return !1;
  }
  ce.schemaHasRulesButRef = i;
  function a({ topSchemaRef: f, schemaPath: p }, y, C, A) {
    if (!A) {
      if (typeof y == "number" || typeof y == "boolean")
        return y;
      if (typeof y == "string")
        return (0, e._)`${y}`;
    }
    return (0, e._)`${f}${p}${(0, e.getProperty)(C)}`;
  }
  ce.schemaRefOrVal = a;
  function c(f) {
    return m(decodeURIComponent(f));
  }
  ce.unescapeFragment = c;
  function l(f) {
    return encodeURIComponent(d(f));
  }
  ce.escapeFragment = l;
  function d(f) {
    return typeof f == "number" ? `${f}` : f.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  ce.escapeJsonPointer = d;
  function m(f) {
    return f.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  ce.unescapeJsonPointer = m;
  function b(f, p) {
    if (Array.isArray(f))
      for (const y of f)
        p(y);
    else
      p(f);
  }
  ce.eachItem = b;
  function v({ mergeNames: f, mergeToName: p, mergeValues: y, resultToName: C }) {
    return (A, P, T, R) => {
      const L = T === void 0 ? P : T instanceof e.Name ? (P instanceof e.Name ? f(A, P, T) : p(A, P, T), T) : P instanceof e.Name ? (p(A, T, P), P) : y(P, T);
      return R === e.Name && !(L instanceof e.Name) ? C(A, L) : L;
    };
  }
  ce.mergeEvaluated = {
    props: v({
      mergeNames: (f, p, y) => f.if((0, e._)`${y} !== true && ${p} !== undefined`, () => {
        f.if((0, e._)`${p} === true`, () => f.assign(y, !0), () => f.assign(y, (0, e._)`${y} || {}`).code((0, e._)`Object.assign(${y}, ${p})`));
      }),
      mergeToName: (f, p, y) => f.if((0, e._)`${y} !== true`, () => {
        p === !0 ? f.assign(y, !0) : (f.assign(y, (0, e._)`${y} || {}`), w(f, y, p));
      }),
      mergeValues: (f, p) => f === !0 ? !0 : { ...f, ...p },
      resultToName: $
    }),
    items: v({
      mergeNames: (f, p, y) => f.if((0, e._)`${y} !== true && ${p} !== undefined`, () => f.assign(y, (0, e._)`${p} === true ? true : ${y} > ${p} ? ${y} : ${p}`)),
      mergeToName: (f, p, y) => f.if((0, e._)`${y} !== true`, () => f.assign(y, p === !0 ? !0 : (0, e._)`${y} > ${p} ? ${y} : ${p}`)),
      mergeValues: (f, p) => f === !0 ? !0 : Math.max(f, p),
      resultToName: (f, p) => f.var("items", p)
    })
  };
  function $(f, p) {
    if (p === !0)
      return f.var("props", !0);
    const y = f.var("props", (0, e._)`{}`);
    return p !== void 0 && w(f, y, p), y;
  }
  ce.evaluatedPropsToName = $;
  function w(f, p, y) {
    Object.keys(y).forEach((C) => f.assign((0, e._)`${p}${(0, e.getProperty)(C)}`, !0));
  }
  ce.setEvaluated = w;
  const u = {};
  function g(f, p) {
    return f.scopeValue("func", {
      ref: p,
      code: u[p.code] || (u[p.code] = new t._Code(p.code))
    });
  }
  ce.useFunc = g;
  var h;
  (function(f) {
    f[f.Num = 0] = "Num", f[f.Str = 1] = "Str";
  })(h || (ce.Type = h = {}));
  function _(f, p, y) {
    if (f instanceof e.Name) {
      const C = p === h.Num;
      return y ? C ? (0, e._)`"[" + ${f} + "]"` : (0, e._)`"['" + ${f} + "']"` : C ? (0, e._)`"/" + ${f}` : (0, e._)`"/" + ${f}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return y ? (0, e.getProperty)(f).toString() : "/" + d(f);
  }
  ce.getErrorPath = _;
  function S(f, p, y = f.opts.strictSchema) {
    if (y) {
      if (p = `strict mode: ${p}`, y === !0)
        throw new Error(p);
      f.self.logger.warn(p);
    }
  }
  return ce.checkStrictMode = S, ce;
}
var Ut = {}, Lo;
function De() {
  if (Lo) return Ut;
  Lo = 1, Object.defineProperty(Ut, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Ut.default = t, Ut;
}
var Bo;
function er() {
  return Bo || (Bo = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ de(), r = /* @__PURE__ */ De();
    e.keywordError = {
      message: ({ keyword: u }) => (0, t.str)`must pass "${u}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: u, schemaType: g }) => g ? (0, t.str)`"${u}" keyword must be ${g} ($data)` : (0, t.str)`"${u}" keyword is invalid ($data)`
    };
    function s(u, g = e.keywordError, h, _) {
      const { it: S } = u, { gen: f, compositeRule: p, allErrors: y } = S, C = m(u, g, h);
      _ ?? (p || y) ? c(f, C) : l(S, (0, t._)`[${C}]`);
    }
    e.reportError = s;
    function o(u, g = e.keywordError, h) {
      const { it: _ } = u, { gen: S, compositeRule: f, allErrors: p } = _, y = m(u, g, h);
      c(S, y), f || p || l(_, r.default.vErrors);
    }
    e.reportExtraError = o;
    function i(u, g) {
      u.assign(r.default.errors, g), u.if((0, t._)`${r.default.vErrors} !== null`, () => u.if(g, () => u.assign((0, t._)`${r.default.vErrors}.length`, g), () => u.assign(r.default.vErrors, null)));
    }
    e.resetErrorsCount = i;
    function a({ gen: u, keyword: g, schemaValue: h, data: _, errsCount: S, it: f }) {
      if (S === void 0)
        throw new Error("ajv implementation error");
      const p = u.name("err");
      u.forRange("i", S, r.default.errors, (y) => {
        u.const(p, (0, t._)`${r.default.vErrors}[${y}]`), u.if((0, t._)`${p}.instancePath === undefined`, () => u.assign((0, t._)`${p}.instancePath`, (0, t.strConcat)(r.default.instancePath, f.errorPath))), u.assign((0, t._)`${p}.schemaPath`, (0, t.str)`${f.errSchemaPath}/${g}`), f.opts.verbose && (u.assign((0, t._)`${p}.schema`, h), u.assign((0, t._)`${p}.data`, _));
      });
    }
    e.extendErrors = a;
    function c(u, g) {
      const h = u.const("err", g);
      u.if((0, t._)`${r.default.vErrors} === null`, () => u.assign(r.default.vErrors, (0, t._)`[${h}]`), (0, t._)`${r.default.vErrors}.push(${h})`), u.code((0, t._)`${r.default.errors}++`);
    }
    function l(u, g) {
      const { gen: h, validateName: _, schemaEnv: S } = u;
      S.$async ? h.throw((0, t._)`new ${u.ValidationError}(${g})`) : (h.assign((0, t._)`${_}.errors`, g), h.return(!1));
    }
    const d = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function m(u, g, h) {
      const { createErrors: _ } = u.it;
      return _ === !1 ? (0, t._)`{}` : b(u, g, h);
    }
    function b(u, g, h = {}) {
      const { gen: _, it: S } = u, f = [
        v(S, h),
        $(u, h)
      ];
      return w(u, g, f), _.object(...f);
    }
    function v({ errorPath: u }, { instancePath: g }) {
      const h = g ? (0, t.str)`${u}${(0, n.getErrorPath)(g, n.Type.Str)}` : u;
      return [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, h)];
    }
    function $({ keyword: u, it: { errSchemaPath: g } }, { schemaPath: h, parentSchema: _ }) {
      let S = _ ? g : (0, t.str)`${g}/${u}`;
      return h && (S = (0, t.str)`${S}${(0, n.getErrorPath)(h, n.Type.Str)}`), [d.schemaPath, S];
    }
    function w(u, { params: g, message: h }, _) {
      const { keyword: S, data: f, schemaValue: p, it: y } = u, { opts: C, propertyName: A, topSchemaRef: P, schemaPath: T } = y;
      _.push([d.keyword, S], [d.params, typeof g == "function" ? g(u) : g || (0, t._)`{}`]), C.messages && _.push([d.message, typeof h == "function" ? h(u) : h]), C.verbose && _.push([d.schema, p], [d.parentSchema, (0, t._)`${P}${T}`], [r.default.data, f]), A && _.push([d.propertyName, A]);
    }
  })(yr)), yr;
}
var qo;
function Ec() {
  if (qo) return rt;
  qo = 1, Object.defineProperty(rt, "__esModule", { value: !0 }), rt.boolOrEmptySchema = rt.topBoolOrEmptySchema = void 0;
  const e = /* @__PURE__ */ er(), t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ De(), r = {
    message: "boolean schema is false"
  };
  function s(a) {
    const { gen: c, schema: l, validateName: d } = a;
    l === !1 ? i(a, !1) : typeof l == "object" && l.$async === !0 ? c.return(n.default.data) : (c.assign((0, t._)`${d}.errors`, null), c.return(!0));
  }
  rt.topBoolOrEmptySchema = s;
  function o(a, c) {
    const { gen: l, schema: d } = a;
    d === !1 ? (l.var(c, !1), i(a)) : l.var(c, !0);
  }
  rt.boolOrEmptySchema = o;
  function i(a, c) {
    const { gen: l, data: d } = a, m = {
      gen: l,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, e.reportError)(m, r, void 0, c);
  }
  return rt;
}
var we = {}, ot = {}, Vo;
function ra() {
  if (Vo) return ot;
  Vo = 1, Object.defineProperty(ot, "__esModule", { value: !0 }), ot.getRules = ot.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function n(s) {
    return typeof s == "string" && t.has(s);
  }
  ot.isJSONType = n;
  function r() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return ot.getRules = r, ot;
}
var He = {}, Uo;
function oa() {
  if (Uo) return He;
  Uo = 1, Object.defineProperty(He, "__esModule", { value: !0 }), He.shouldUseRule = He.shouldUseGroup = He.schemaHasRulesForType = void 0;
  function e({ schema: r, self: s }, o) {
    const i = s.RULES.types[o];
    return i && i !== !0 && t(r, i);
  }
  He.schemaHasRulesForType = e;
  function t(r, s) {
    return s.rules.some((o) => n(r, o));
  }
  He.shouldUseGroup = t;
  function n(r, s) {
    var o;
    return r[s.keyword] !== void 0 || ((o = s.definition.implements) === null || o === void 0 ? void 0 : o.some((i) => r[i] !== void 0));
  }
  return He.shouldUseRule = n, He;
}
var Ho;
function Yn() {
  if (Ho) return we;
  Ho = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.reportTypeError = we.checkDataTypes = we.checkDataType = we.coerceAndCheckDataType = we.getJSONTypes = we.getSchemaTypes = we.DataType = void 0;
  const e = /* @__PURE__ */ ra(), t = /* @__PURE__ */ oa(), n = /* @__PURE__ */ er(), r = /* @__PURE__ */ ie(), s = /* @__PURE__ */ de();
  var o;
  (function(h) {
    h[h.Correct = 0] = "Correct", h[h.Wrong = 1] = "Wrong";
  })(o || (we.DataType = o = {}));
  function i(h) {
    const _ = a(h.type);
    if (_.includes("null")) {
      if (h.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!_.length && h.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      h.nullable === !0 && _.push("null");
    }
    return _;
  }
  we.getSchemaTypes = i;
  function a(h) {
    const _ = Array.isArray(h) ? h : h ? [h] : [];
    if (_.every(e.isJSONType))
      return _;
    throw new Error("type must be JSONType or JSONType[]: " + _.join(","));
  }
  we.getJSONTypes = a;
  function c(h, _) {
    const { gen: S, data: f, opts: p } = h, y = d(_, p.coerceTypes), C = _.length > 0 && !(y.length === 0 && _.length === 1 && (0, t.schemaHasRulesForType)(h, _[0]));
    if (C) {
      const A = $(_, f, p.strictNumbers, o.Wrong);
      S.if(A, () => {
        y.length ? m(h, _, y) : u(h);
      });
    }
    return C;
  }
  we.coerceAndCheckDataType = c;
  const l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(h, _) {
    return _ ? h.filter((S) => l.has(S) || _ === "array" && S === "array") : [];
  }
  function m(h, _, S) {
    const { gen: f, data: p, opts: y } = h, C = f.let("dataType", (0, r._)`typeof ${p}`), A = f.let("coerced", (0, r._)`undefined`);
    y.coerceTypes === "array" && f.if((0, r._)`${C} == 'object' && Array.isArray(${p}) && ${p}.length == 1`, () => f.assign(p, (0, r._)`${p}[0]`).assign(C, (0, r._)`typeof ${p}`).if($(_, p, y.strictNumbers), () => f.assign(A, p))), f.if((0, r._)`${A} !== undefined`);
    for (const T of S)
      (l.has(T) || T === "array" && y.coerceTypes === "array") && P(T);
    f.else(), u(h), f.endIf(), f.if((0, r._)`${A} !== undefined`, () => {
      f.assign(p, A), b(h, A);
    });
    function P(T) {
      switch (T) {
        case "string":
          f.elseIf((0, r._)`${C} == "number" || ${C} == "boolean"`).assign(A, (0, r._)`"" + ${p}`).elseIf((0, r._)`${p} === null`).assign(A, (0, r._)`""`);
          return;
        case "number":
          f.elseIf((0, r._)`${C} == "boolean" || ${p} === null
              || (${C} == "string" && ${p} && ${p} == +${p})`).assign(A, (0, r._)`+${p}`);
          return;
        case "integer":
          f.elseIf((0, r._)`${C} === "boolean" || ${p} === null
              || (${C} === "string" && ${p} && ${p} == +${p} && !(${p} % 1))`).assign(A, (0, r._)`+${p}`);
          return;
        case "boolean":
          f.elseIf((0, r._)`${p} === "false" || ${p} === 0 || ${p} === null`).assign(A, !1).elseIf((0, r._)`${p} === "true" || ${p} === 1`).assign(A, !0);
          return;
        case "null":
          f.elseIf((0, r._)`${p} === "" || ${p} === 0 || ${p} === false`), f.assign(A, null);
          return;
        case "array":
          f.elseIf((0, r._)`${C} === "string" || ${C} === "number"
              || ${C} === "boolean" || ${p} === null`).assign(A, (0, r._)`[${p}]`);
      }
    }
  }
  function b({ gen: h, parentData: _, parentDataProperty: S }, f) {
    h.if((0, r._)`${_} !== undefined`, () => h.assign((0, r._)`${_}[${S}]`, f));
  }
  function v(h, _, S, f = o.Correct) {
    const p = f === o.Correct ? r.operators.EQ : r.operators.NEQ;
    let y;
    switch (h) {
      case "null":
        return (0, r._)`${_} ${p} null`;
      case "array":
        y = (0, r._)`Array.isArray(${_})`;
        break;
      case "object":
        y = (0, r._)`${_} && typeof ${_} == "object" && !Array.isArray(${_})`;
        break;
      case "integer":
        y = C((0, r._)`!(${_} % 1) && !isNaN(${_})`);
        break;
      case "number":
        y = C();
        break;
      default:
        return (0, r._)`typeof ${_} ${p} ${h}`;
    }
    return f === o.Correct ? y : (0, r.not)(y);
    function C(A = r.nil) {
      return (0, r.and)((0, r._)`typeof ${_} == "number"`, A, S ? (0, r._)`isFinite(${_})` : r.nil);
    }
  }
  we.checkDataType = v;
  function $(h, _, S, f) {
    if (h.length === 1)
      return v(h[0], _, S, f);
    let p;
    const y = (0, s.toHash)(h);
    if (y.array && y.object) {
      const C = (0, r._)`typeof ${_} != "object"`;
      p = y.null ? C : (0, r._)`!${_} || ${C}`, delete y.null, delete y.array, delete y.object;
    } else
      p = r.nil;
    y.number && delete y.integer;
    for (const C in y)
      p = (0, r.and)(p, v(C, _, S, f));
    return p;
  }
  we.checkDataTypes = $;
  const w = {
    message: ({ schema: h }) => `must be ${h}`,
    params: ({ schema: h, schemaValue: _ }) => typeof h == "string" ? (0, r._)`{type: ${h}}` : (0, r._)`{type: ${_}}`
  };
  function u(h) {
    const _ = g(h);
    (0, n.reportError)(_, w);
  }
  we.reportTypeError = u;
  function g(h) {
    const { gen: _, data: S, schema: f } = h, p = (0, s.schemaRefOrVal)(h, f, "type");
    return {
      gen: _,
      keyword: "type",
      data: S,
      schema: f.type,
      schemaCode: p,
      schemaValue: p,
      parentSchema: f,
      params: {},
      it: h
    };
  }
  return we;
}
var Pt = {}, Ko;
function xc() {
  if (Ko) return Pt;
  Ko = 1, Object.defineProperty(Pt, "__esModule", { value: !0 }), Pt.assignDefaults = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de();
  function n(s, o) {
    const { properties: i, items: a } = s.schema;
    if (o === "object" && i)
      for (const c in i)
        r(s, c, i[c].default);
    else o === "array" && Array.isArray(a) && a.forEach((c, l) => r(s, l, c.default));
  }
  Pt.assignDefaults = n;
  function r(s, o, i) {
    const { gen: a, compositeRule: c, data: l, opts: d } = s;
    if (i === void 0)
      return;
    const m = (0, e._)`${l}${(0, e.getProperty)(o)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${m}`);
      return;
    }
    let b = (0, e._)`${m} === undefined`;
    d.useDefaults === "empty" && (b = (0, e._)`${b} || ${m} === null || ${m} === ""`), a.if(b, (0, e._)`${m} = ${(0, e.stringify)(i)}`);
  }
  return Pt;
}
var je = {}, he = {}, Go;
function Le() {
  if (Go) return he;
  Go = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.validateUnion = he.validateArray = he.usePattern = he.callValidateCode = he.schemaProperties = he.allSchemaProperties = he.noPropertyInData = he.propertyInData = he.isOwnProperty = he.hasPropFunc = he.reportMissingProp = he.checkMissingProp = he.checkReportMissingProp = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ De(), r = /* @__PURE__ */ de();
  function s(h, _) {
    const { gen: S, data: f, it: p } = h;
    S.if(d(S, f, _, p.opts.ownProperties), () => {
      h.setParams({ missingProperty: (0, e._)`${_}` }, !0), h.error();
    });
  }
  he.checkReportMissingProp = s;
  function o({ gen: h, data: _, it: { opts: S } }, f, p) {
    return (0, e.or)(...f.map((y) => (0, e.and)(d(h, _, y, S.ownProperties), (0, e._)`${p} = ${y}`)));
  }
  he.checkMissingProp = o;
  function i(h, _) {
    h.setParams({ missingProperty: _ }, !0), h.error();
  }
  he.reportMissingProp = i;
  function a(h) {
    return h.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  he.hasPropFunc = a;
  function c(h, _, S) {
    return (0, e._)`${a(h)}.call(${_}, ${S})`;
  }
  he.isOwnProperty = c;
  function l(h, _, S, f) {
    const p = (0, e._)`${_}${(0, e.getProperty)(S)} !== undefined`;
    return f ? (0, e._)`${p} && ${c(h, _, S)}` : p;
  }
  he.propertyInData = l;
  function d(h, _, S, f) {
    const p = (0, e._)`${_}${(0, e.getProperty)(S)} === undefined`;
    return f ? (0, e.or)(p, (0, e.not)(c(h, _, S))) : p;
  }
  he.noPropertyInData = d;
  function m(h) {
    return h ? Object.keys(h).filter((_) => _ !== "__proto__") : [];
  }
  he.allSchemaProperties = m;
  function b(h, _) {
    return m(_).filter((S) => !(0, t.alwaysValidSchema)(h, _[S]));
  }
  he.schemaProperties = b;
  function v({ schemaCode: h, data: _, it: { gen: S, topSchemaRef: f, schemaPath: p, errorPath: y }, it: C }, A, P, T) {
    const R = T ? (0, e._)`${h}, ${_}, ${f}${p}` : _, L = [
      [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, y)],
      [n.default.parentData, C.parentData],
      [n.default.parentDataProperty, C.parentDataProperty],
      [n.default.rootData, n.default.rootData]
    ];
    C.opts.dynamicRef && L.push([n.default.dynamicAnchors, n.default.dynamicAnchors]);
    const I = (0, e._)`${R}, ${S.object(...L)}`;
    return P !== e.nil ? (0, e._)`${A}.call(${P}, ${I})` : (0, e._)`${A}(${I})`;
  }
  he.callValidateCode = v;
  const $ = (0, e._)`new RegExp`;
  function w({ gen: h, it: { opts: _ } }, S) {
    const f = _.unicodeRegExp ? "u" : "", { regExp: p } = _.code, y = p(S, f);
    return h.scopeValue("pattern", {
      key: y.toString(),
      ref: y,
      code: (0, e._)`${p.code === "new RegExp" ? $ : (0, r.useFunc)(h, p)}(${S}, ${f})`
    });
  }
  he.usePattern = w;
  function u(h) {
    const { gen: _, data: S, keyword: f, it: p } = h, y = _.name("valid");
    if (p.allErrors) {
      const A = _.let("valid", !0);
      return C(() => _.assign(A, !1)), A;
    }
    return _.var(y, !0), C(() => _.break()), y;
    function C(A) {
      const P = _.const("len", (0, e._)`${S}.length`);
      _.forRange("i", 0, P, (T) => {
        h.subschema({
          keyword: f,
          dataProp: T,
          dataPropType: t.Type.Num
        }, y), _.if((0, e.not)(y), A);
      });
    }
  }
  he.validateArray = u;
  function g(h) {
    const { gen: _, schema: S, keyword: f, it: p } = h;
    if (!Array.isArray(S))
      throw new Error("ajv implementation error");
    if (S.some((P) => (0, t.alwaysValidSchema)(p, P)) && !p.opts.unevaluated)
      return;
    const C = _.let("valid", !1), A = _.name("_valid");
    _.block(() => S.forEach((P, T) => {
      const R = h.subschema({
        keyword: f,
        schemaProp: T,
        compositeRule: !0
      }, A);
      _.assign(C, (0, e._)`${C} || ${A}`), h.mergeValidEvaluated(R, A) || _.if((0, e.not)(C));
    })), h.result(C, () => h.reset(), () => h.error(!0));
  }
  return he.validateUnion = g, he;
}
var Wo;
function Ac() {
  if (Wo) return je;
  Wo = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.validateKeywordUsage = je.validSchemaType = je.funcKeywordCode = je.macroKeywordCode = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ De(), n = /* @__PURE__ */ Le(), r = /* @__PURE__ */ er();
  function s(b, v) {
    const { gen: $, keyword: w, schema: u, parentSchema: g, it: h } = b, _ = v.macro.call(h.self, u, g, h), S = l($, w, _);
    h.opts.validateSchema !== !1 && h.self.validateSchema(_, !0);
    const f = $.name("valid");
    b.subschema({
      schema: _,
      schemaPath: e.nil,
      errSchemaPath: `${h.errSchemaPath}/${w}`,
      topSchemaRef: S,
      compositeRule: !0
    }, f), b.pass(f, () => b.error(!0));
  }
  je.macroKeywordCode = s;
  function o(b, v) {
    var $;
    const { gen: w, keyword: u, schema: g, parentSchema: h, $data: _, it: S } = b;
    c(S, v);
    const f = !_ && v.compile ? v.compile.call(S.self, g, h, S) : v.validate, p = l(w, u, f), y = w.let("valid");
    b.block$data(y, C), b.ok(($ = v.valid) !== null && $ !== void 0 ? $ : y);
    function C() {
      if (v.errors === !1)
        T(), v.modifying && i(b), R(() => b.error());
      else {
        const L = v.async ? A() : P();
        v.modifying && i(b), R(() => a(b, L));
      }
    }
    function A() {
      const L = w.let("ruleErrs", null);
      return w.try(() => T((0, e._)`await `), (I) => w.assign(y, !1).if((0, e._)`${I} instanceof ${S.ValidationError}`, () => w.assign(L, (0, e._)`${I}.errors`), () => w.throw(I))), L;
    }
    function P() {
      const L = (0, e._)`${p}.errors`;
      return w.assign(L, null), T(e.nil), L;
    }
    function T(L = v.async ? (0, e._)`await ` : e.nil) {
      const I = S.opts.passContext ? t.default.this : t.default.self, Q = !("compile" in v && !_ || v.schema === !1);
      w.assign(y, (0, e._)`${L}${(0, n.callValidateCode)(b, p, I, Q)}`, v.modifying);
    }
    function R(L) {
      var I;
      w.if((0, e.not)((I = v.valid) !== null && I !== void 0 ? I : y), L);
    }
  }
  je.funcKeywordCode = o;
  function i(b) {
    const { gen: v, data: $, it: w } = b;
    v.if(w.parentData, () => v.assign($, (0, e._)`${w.parentData}[${w.parentDataProperty}]`));
  }
  function a(b, v) {
    const { gen: $ } = b;
    $.if((0, e._)`Array.isArray(${v})`, () => {
      $.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${v} : ${t.default.vErrors}.concat(${v})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, r.extendErrors)(b);
    }, () => b.error());
  }
  function c({ schemaEnv: b }, v) {
    if (v.async && !b.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(b, v, $) {
    if ($ === void 0)
      throw new Error(`keyword "${v}" failed to compile`);
    return b.scopeValue("keyword", typeof $ == "function" ? { ref: $ } : { ref: $, code: (0, e.stringify)($) });
  }
  function d(b, v, $ = !1) {
    return !v.length || v.some((w) => w === "array" ? Array.isArray(b) : w === "object" ? b && typeof b == "object" && !Array.isArray(b) : typeof b == w || $ && typeof b > "u");
  }
  je.validSchemaType = d;
  function m({ schema: b, opts: v, self: $, errSchemaPath: w }, u, g) {
    if (Array.isArray(u.keyword) ? !u.keyword.includes(g) : u.keyword !== g)
      throw new Error("ajv implementation error");
    const h = u.dependencies;
    if (h?.some((_) => !Object.prototype.hasOwnProperty.call(b, _)))
      throw new Error(`parent schema must have dependencies of ${g}: ${h.join(",")}`);
    if (u.validateSchema && !u.validateSchema(b[g])) {
      const S = `keyword "${g}" value is invalid at path "${w}": ` + $.errorsText(u.validateSchema.errors);
      if (v.validateSchema === "log")
        $.logger.error(S);
      else
        throw new Error(S);
    }
  }
  return je.validateKeywordUsage = m, je;
}
var Ke = {}, Jo;
function Pc() {
  if (Jo) return Ke;
  Jo = 1, Object.defineProperty(Ke, "__esModule", { value: !0 }), Ke.extendSubschemaMode = Ke.extendSubschemaData = Ke.getSubschema = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de();
  function n(o, { keyword: i, schemaProp: a, schema: c, schemaPath: l, errSchemaPath: d, topSchemaRef: m }) {
    if (i !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const b = o.schema[i];
      return a === void 0 ? {
        schema: b,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${o.errSchemaPath}/${i}`
      } : {
        schema: b[a],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${o.errSchemaPath}/${i}/${(0, t.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (l === void 0 || d === void 0 || m === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: l,
        topSchemaRef: m,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ke.getSubschema = n;
  function r(o, i, { dataProp: a, dataPropType: c, data: l, dataTypes: d, propertyName: m }) {
    if (l !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: b } = i;
    if (a !== void 0) {
      const { errorPath: $, dataPathArr: w, opts: u } = i, g = b.let("data", (0, e._)`${i.data}${(0, e.getProperty)(a)}`, !0);
      v(g), o.errorPath = (0, e.str)`${$}${(0, t.getErrorPath)(a, c, u.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${a}`, o.dataPathArr = [...w, o.parentDataProperty];
    }
    if (l !== void 0) {
      const $ = l instanceof e.Name ? l : b.let("data", l, !0);
      v($), m !== void 0 && (o.propertyName = m);
    }
    d && (o.dataTypes = d);
    function v($) {
      o.data = $, o.dataLevel = i.dataLevel + 1, o.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), o.parentData = i.data, o.dataNames = [...i.dataNames, $];
    }
  }
  Ke.extendSubschemaData = r;
  function s(o, { jtdDiscriminator: i, jtdMetadata: a, compositeRule: c, createErrors: l, allErrors: d }) {
    c !== void 0 && (o.compositeRule = c), l !== void 0 && (o.createErrors = l), d !== void 0 && (o.allErrors = d), o.jtdDiscriminator = i, o.jtdMetadata = a;
  }
  return Ke.extendSubschemaMode = s, Ke;
}
var Se = {}, wr, Yo;
function sa() {
  return Yo || (Yo = 1, wr = function e(t, n) {
    if (t === n) return !0;
    if (t && n && typeof t == "object" && typeof n == "object") {
      if (t.constructor !== n.constructor) return !1;
      var r, s, o;
      if (Array.isArray(t)) {
        if (r = t.length, r != n.length) return !1;
        for (s = r; s-- !== 0; )
          if (!e(t[s], n[s])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
      if (o = Object.keys(t), r = o.length, r !== Object.keys(n).length) return !1;
      for (s = r; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, o[s])) return !1;
      for (s = r; s-- !== 0; ) {
        var i = o[s];
        if (!e(t[i], n[i])) return !1;
      }
      return !0;
    }
    return t !== t && n !== n;
  }), wr;
}
var _r = { exports: {} }, Xo;
function Rc() {
  if (Xo) return _r.exports;
  Xo = 1;
  var e = _r.exports = function(r, s, o) {
    typeof s == "function" && (o = s, s = {}), o = s.cb || o;
    var i = typeof o == "function" ? o : o.pre || function() {
    }, a = o.post || function() {
    };
    t(s, i, a, r, "", r);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(r, s, o, i, a, c, l, d, m, b) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      s(i, a, c, l, d, m, b);
      for (var v in i) {
        var $ = i[v];
        if (Array.isArray($)) {
          if (v in e.arrayKeywords)
            for (var w = 0; w < $.length; w++)
              t(r, s, o, $[w], a + "/" + v + "/" + w, c, a, v, i, w);
        } else if (v in e.propsKeywords) {
          if ($ && typeof $ == "object")
            for (var u in $)
              t(r, s, o, $[u], a + "/" + v + "/" + n(u), c, a, v, i, u);
        } else (v in e.keywords || r.allKeys && !(v in e.skipKeywords)) && t(r, s, o, $, a + "/" + v, c, a, v, i);
      }
      o(i, a, c, l, d, m, b);
    }
  }
  function n(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return _r.exports;
}
var Zo;
function tr() {
  if (Zo) return Se;
  Zo = 1, Object.defineProperty(Se, "__esModule", { value: !0 }), Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
  const e = /* @__PURE__ */ de(), t = sa(), n = Rc(), r = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s(w, u = !0) {
    return typeof w == "boolean" ? !0 : u === !0 ? !i(w) : u ? a(w) <= u : !1;
  }
  Se.inlineRef = s;
  const o = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function i(w) {
    for (const u in w) {
      if (o.has(u))
        return !0;
      const g = w[u];
      if (Array.isArray(g) && g.some(i) || typeof g == "object" && i(g))
        return !0;
    }
    return !1;
  }
  function a(w) {
    let u = 0;
    for (const g in w) {
      if (g === "$ref")
        return 1 / 0;
      if (u++, !r.has(g) && (typeof w[g] == "object" && (0, e.eachItem)(w[g], (h) => u += a(h)), u === 1 / 0))
        return 1 / 0;
    }
    return u;
  }
  function c(w, u = "", g) {
    g !== !1 && (u = m(u));
    const h = w.parse(u);
    return l(w, h);
  }
  Se.getFullPath = c;
  function l(w, u) {
    return w.serialize(u).split("#")[0] + "#";
  }
  Se._getFullPath = l;
  const d = /#\/?$/;
  function m(w) {
    return w ? w.replace(d, "") : "";
  }
  Se.normalizeId = m;
  function b(w, u, g) {
    return g = m(g), w.resolve(u, g);
  }
  Se.resolveUrl = b;
  const v = /^[a-z_][-a-z0-9._]*$/i;
  function $(w, u) {
    if (typeof w == "boolean")
      return {};
    const { schemaId: g, uriResolver: h } = this.opts, _ = m(w[g] || u), S = { "": _ }, f = c(h, _, !1), p = {}, y = /* @__PURE__ */ new Set();
    return n(w, { allKeys: !0 }, (P, T, R, L) => {
      if (L === void 0)
        return;
      const I = f + T;
      let Q = S[L];
      typeof P[g] == "string" && (Q = V.call(this, P[g])), q.call(this, P.$anchor), q.call(this, P.$dynamicAnchor), S[T] = Q;
      function V(Y) {
        const re = this.opts.uriResolver.resolve;
        if (Y = m(Q ? re(Q, Y) : Y), y.has(Y))
          throw A(Y);
        y.add(Y);
        let U = this.refs[Y];
        return typeof U == "string" && (U = this.refs[U]), typeof U == "object" ? C(P, U.schema, Y) : Y !== m(I) && (Y[0] === "#" ? (C(P, p[Y], Y), p[Y] = P) : this.refs[Y] = I), Y;
      }
      function q(Y) {
        if (typeof Y == "string") {
          if (!v.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          V.call(this, `#${Y}`);
        }
      }
    }), p;
    function C(P, T, R) {
      if (T !== void 0 && !t(P, T))
        throw A(R);
    }
    function A(P) {
      return new Error(`reference "${P}" resolves to more than one schema`);
    }
  }
  return Se.getSchemaRefs = $, Se;
}
var Qo;
function nr() {
  if (Qo) return Ue;
  Qo = 1, Object.defineProperty(Ue, "__esModule", { value: !0 }), Ue.getData = Ue.KeywordCxt = Ue.validateFunctionCode = void 0;
  const e = /* @__PURE__ */ Ec(), t = /* @__PURE__ */ Yn(), n = /* @__PURE__ */ oa(), r = /* @__PURE__ */ Yn(), s = /* @__PURE__ */ xc(), o = /* @__PURE__ */ Ac(), i = /* @__PURE__ */ Pc(), a = /* @__PURE__ */ ie(), c = /* @__PURE__ */ De(), l = /* @__PURE__ */ tr(), d = /* @__PURE__ */ de(), m = /* @__PURE__ */ er();
  function b(M) {
    if (f(M) && (y(M), S(M))) {
      u(M);
      return;
    }
    v(M, () => (0, e.topBoolOrEmptySchema)(M));
  }
  Ue.validateFunctionCode = b;
  function v({ gen: M, validateName: x, schema: F, schemaEnv: B, opts: J }, Z) {
    J.code.es5 ? M.func(x, (0, a._)`${c.default.data}, ${c.default.valCxt}`, B.$async, () => {
      M.code((0, a._)`"use strict"; ${h(F, J)}`), w(M, J), M.code(Z);
    }) : M.func(x, (0, a._)`${c.default.data}, ${$(J)}`, B.$async, () => M.code(h(F, J)).code(Z));
  }
  function $(M) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${M.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function w(M, x) {
    M.if(c.default.valCxt, () => {
      M.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), M.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), M.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), M.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), x.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      M.var(c.default.instancePath, (0, a._)`""`), M.var(c.default.parentData, (0, a._)`undefined`), M.var(c.default.parentDataProperty, (0, a._)`undefined`), M.var(c.default.rootData, c.default.data), x.dynamicRef && M.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function u(M) {
    const { schema: x, opts: F, gen: B } = M;
    v(M, () => {
      F.$comment && x.$comment && L(M), P(M), B.let(c.default.vErrors, null), B.let(c.default.errors, 0), F.unevaluated && g(M), C(M), I(M);
    });
  }
  function g(M) {
    const { gen: x, validateName: F } = M;
    M.evaluated = x.const("evaluated", (0, a._)`${F}.evaluated`), x.if((0, a._)`${M.evaluated}.dynamicProps`, () => x.assign((0, a._)`${M.evaluated}.props`, (0, a._)`undefined`)), x.if((0, a._)`${M.evaluated}.dynamicItems`, () => x.assign((0, a._)`${M.evaluated}.items`, (0, a._)`undefined`));
  }
  function h(M, x) {
    const F = typeof M == "object" && M[x.schemaId];
    return F && (x.code.source || x.code.process) ? (0, a._)`/*# sourceURL=${F} */` : a.nil;
  }
  function _(M, x) {
    if (f(M) && (y(M), S(M))) {
      p(M, x);
      return;
    }
    (0, e.boolOrEmptySchema)(M, x);
  }
  function S({ schema: M, self: x }) {
    if (typeof M == "boolean")
      return !M;
    for (const F in M)
      if (x.RULES.all[F])
        return !0;
    return !1;
  }
  function f(M) {
    return typeof M.schema != "boolean";
  }
  function p(M, x) {
    const { schema: F, gen: B, opts: J } = M;
    J.$comment && F.$comment && L(M), T(M), R(M);
    const Z = B.const("_errs", c.default.errors);
    C(M, Z), B.var(x, (0, a._)`${Z} === ${c.default.errors}`);
  }
  function y(M) {
    (0, d.checkUnknownRules)(M), A(M);
  }
  function C(M, x) {
    if (M.opts.jtd)
      return V(M, [], !1, x);
    const F = (0, t.getSchemaTypes)(M.schema), B = (0, t.coerceAndCheckDataType)(M, F);
    V(M, F, !B, x);
  }
  function A(M) {
    const { schema: x, errSchemaPath: F, opts: B, self: J } = M;
    x.$ref && B.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(x, J.RULES) && J.logger.warn(`$ref: keywords ignored in schema at path "${F}"`);
  }
  function P(M) {
    const { schema: x, opts: F } = M;
    x.default !== void 0 && F.useDefaults && F.strictSchema && (0, d.checkStrictMode)(M, "default is ignored in the schema root");
  }
  function T(M) {
    const x = M.schema[M.opts.schemaId];
    x && (M.baseId = (0, l.resolveUrl)(M.opts.uriResolver, M.baseId, x));
  }
  function R(M) {
    if (M.schema.$async && !M.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function L({ gen: M, schemaEnv: x, schema: F, errSchemaPath: B, opts: J }) {
    const Z = F.$comment;
    if (J.$comment === !0)
      M.code((0, a._)`${c.default.self}.logger.log(${Z})`);
    else if (typeof J.$comment == "function") {
      const ae = (0, a.str)`${B}/$comment`, se = M.scopeValue("root", { ref: x.root });
      M.code((0, a._)`${c.default.self}.opts.$comment(${Z}, ${ae}, ${se}.schema)`);
    }
  }
  function I(M) {
    const { gen: x, schemaEnv: F, validateName: B, ValidationError: J, opts: Z } = M;
    F.$async ? x.if((0, a._)`${c.default.errors} === 0`, () => x.return(c.default.data), () => x.throw((0, a._)`new ${J}(${c.default.vErrors})`)) : (x.assign((0, a._)`${B}.errors`, c.default.vErrors), Z.unevaluated && Q(M), x.return((0, a._)`${c.default.errors} === 0`));
  }
  function Q({ gen: M, evaluated: x, props: F, items: B }) {
    F instanceof a.Name && M.assign((0, a._)`${x}.props`, F), B instanceof a.Name && M.assign((0, a._)`${x}.items`, B);
  }
  function V(M, x, F, B) {
    const { gen: J, schema: Z, data: ae, allErrors: se, opts: fe, self: me } = M, { RULES: pe } = me;
    if (Z.$ref && (fe.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(Z, pe))) {
      J.block(() => te(M, "$ref", pe.all.$ref.definition));
      return;
    }
    fe.jtd || Y(M, x), J.block(() => {
      for (const ye of pe.rules)
        be(ye);
      be(pe.post);
    });
    function be(ye) {
      (0, n.shouldUseGroup)(Z, ye) && (ye.type ? (J.if((0, r.checkDataType)(ye.type, ae, fe.strictNumbers)), q(M, ye), x.length === 1 && x[0] === ye.type && F && (J.else(), (0, r.reportTypeError)(M)), J.endIf()) : q(M, ye), se || J.if((0, a._)`${c.default.errors} === ${B || 0}`));
    }
  }
  function q(M, x) {
    const { gen: F, schema: B, opts: { useDefaults: J } } = M;
    J && (0, s.assignDefaults)(M, x.type), F.block(() => {
      for (const Z of x.rules)
        (0, n.shouldUseRule)(B, Z) && te(M, Z.keyword, Z.definition, x.type);
    });
  }
  function Y(M, x) {
    M.schemaEnv.meta || !M.opts.strictTypes || (re(M, x), M.opts.allowUnionTypes || U(M, x), O(M, M.dataTypes));
  }
  function re(M, x) {
    if (x.length) {
      if (!M.dataTypes.length) {
        M.dataTypes = x;
        return;
      }
      x.forEach((F) => {
        z(M.dataTypes, F) || E(M, `type "${F}" not allowed by context "${M.dataTypes.join(",")}"`);
      }), k(M, x);
    }
  }
  function U(M, x) {
    x.length > 1 && !(x.length === 2 && x.includes("null")) && E(M, "use allowUnionTypes to allow union type keyword");
  }
  function O(M, x) {
    const F = M.self.RULES.all;
    for (const B in F) {
      const J = F[B];
      if (typeof J == "object" && (0, n.shouldUseRule)(M.schema, J)) {
        const { type: Z } = J.definition;
        Z.length && !Z.some((ae) => H(x, ae)) && E(M, `missing type "${Z.join(",")}" for keyword "${B}"`);
      }
    }
  }
  function H(M, x) {
    return M.includes(x) || x === "number" && M.includes("integer");
  }
  function z(M, x) {
    return M.includes(x) || x === "integer" && M.includes("number");
  }
  function k(M, x) {
    const F = [];
    for (const B of M.dataTypes)
      z(x, B) ? F.push(B) : x.includes("integer") && B === "number" && F.push("integer");
    M.dataTypes = F;
  }
  function E(M, x) {
    const F = M.schemaEnv.baseId + M.errSchemaPath;
    x += ` at "${F}" (strictTypes)`, (0, d.checkStrictMode)(M, x, M.opts.strictTypes);
  }
  class D {
    constructor(x, F, B) {
      if ((0, o.validateKeywordUsage)(x, F, B), this.gen = x.gen, this.allErrors = x.allErrors, this.keyword = B, this.data = x.data, this.schema = x.schema[B], this.$data = F.$data && x.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(x, this.schema, B, this.$data), this.schemaType = F.schemaType, this.parentSchema = x.schema, this.params = {}, this.it = x, this.def = F, this.$data)
        this.schemaCode = x.gen.const("vSchema", W(this.$data, x));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, F.schemaType, F.allowUndefined))
        throw new Error(`${B} value must be ${JSON.stringify(F.schemaType)}`);
      ("code" in F ? F.trackErrors : F.errors !== !1) && (this.errsCount = x.gen.const("_errs", c.default.errors));
    }
    result(x, F, B) {
      this.failResult((0, a.not)(x), F, B);
    }
    failResult(x, F, B) {
      this.gen.if(x), B ? B() : this.error(), F ? (this.gen.else(), F(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(x, F) {
      this.failResult((0, a.not)(x), void 0, F);
    }
    fail(x) {
      if (x === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(x), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(x) {
      if (!this.$data)
        return this.fail(x);
      const { schemaCode: F } = this;
      this.fail((0, a._)`${F} !== undefined && (${(0, a.or)(this.invalid$data(), x)})`);
    }
    error(x, F, B) {
      if (F) {
        this.setParams(F), this._error(x, B), this.setParams({});
        return;
      }
      this._error(x, B);
    }
    _error(x, F) {
      (x ? m.reportExtraError : m.reportError)(this, this.def.error, F);
    }
    $dataError() {
      (0, m.reportError)(this, this.def.$dataError || m.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, m.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(x) {
      this.allErrors || this.gen.if(x);
    }
    setParams(x, F) {
      F ? Object.assign(this.params, x) : this.params = x;
    }
    block$data(x, F, B = a.nil) {
      this.gen.block(() => {
        this.check$data(x, B), F();
      });
    }
    check$data(x = a.nil, F = a.nil) {
      if (!this.$data)
        return;
      const { gen: B, schemaCode: J, schemaType: Z, def: ae } = this;
      B.if((0, a.or)((0, a._)`${J} === undefined`, F)), x !== a.nil && B.assign(x, !0), (Z.length || ae.validateSchema) && (B.elseIf(this.invalid$data()), this.$dataError(), x !== a.nil && B.assign(x, !1)), B.else();
    }
    invalid$data() {
      const { gen: x, schemaCode: F, schemaType: B, def: J, it: Z } = this;
      return (0, a.or)(ae(), se());
      function ae() {
        if (B.length) {
          if (!(F instanceof a.Name))
            throw new Error("ajv implementation error");
          const fe = Array.isArray(B) ? B : [B];
          return (0, a._)`${(0, r.checkDataTypes)(fe, F, Z.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function se() {
        if (J.validateSchema) {
          const fe = x.scopeValue("validate$data", { ref: J.validateSchema });
          return (0, a._)`!${fe}(${F})`;
        }
        return a.nil;
      }
    }
    subschema(x, F) {
      const B = (0, i.getSubschema)(this.it, x);
      (0, i.extendSubschemaData)(B, this.it, x), (0, i.extendSubschemaMode)(B, x);
      const J = { ...this.it, ...B, items: void 0, props: void 0 };
      return _(J, F), J;
    }
    mergeEvaluated(x, F) {
      const { it: B, gen: J } = this;
      B.opts.unevaluated && (B.props !== !0 && x.props !== void 0 && (B.props = d.mergeEvaluated.props(J, x.props, B.props, F)), B.items !== !0 && x.items !== void 0 && (B.items = d.mergeEvaluated.items(J, x.items, B.items, F)));
    }
    mergeValidEvaluated(x, F) {
      const { it: B, gen: J } = this;
      if (B.opts.unevaluated && (B.props !== !0 || B.items !== !0))
        return J.if(F, () => this.mergeEvaluated(x, a.Name)), !0;
    }
  }
  Ue.KeywordCxt = D;
  function te(M, x, F, B) {
    const J = new D(M, F, x);
    "code" in F ? F.code(J, B) : J.$data && F.validate ? (0, o.funcKeywordCode)(J, F) : "macro" in F ? (0, o.macroKeywordCode)(J, F) : (F.compile || F.validate) && (0, o.funcKeywordCode)(J, F);
  }
  const ne = /^\/(?:[^~]|~0|~1)*$/, oe = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function W(M, { dataLevel: x, dataNames: F, dataPathArr: B }) {
    let J, Z;
    if (M === "")
      return c.default.rootData;
    if (M[0] === "/") {
      if (!ne.test(M))
        throw new Error(`Invalid JSON-pointer: ${M}`);
      J = M, Z = c.default.rootData;
    } else {
      const me = oe.exec(M);
      if (!me)
        throw new Error(`Invalid JSON-pointer: ${M}`);
      const pe = +me[1];
      if (J = me[2], J === "#") {
        if (pe >= x)
          throw new Error(fe("property/index", pe));
        return B[x - pe];
      }
      if (pe > x)
        throw new Error(fe("data", pe));
      if (Z = F[x - pe], !J)
        return Z;
    }
    let ae = Z;
    const se = J.split("/");
    for (const me of se)
      me && (Z = (0, a._)`${Z}${(0, a.getProperty)((0, d.unescapeJsonPointer)(me))}`, ae = (0, a._)`${ae} && ${Z}`);
    return ae;
    function fe(me, pe) {
      return `Cannot access ${me} ${pe} levels up, current level is ${x}`;
    }
  }
  return Ue.getData = W, Ue;
}
var Ht = {}, es;
function to() {
  if (es) return Ht;
  es = 1, Object.defineProperty(Ht, "__esModule", { value: !0 });
  class e extends Error {
    constructor(n) {
      super("validation failed"), this.errors = n, this.ajv = this.validation = !0;
    }
  }
  return Ht.default = e, Ht;
}
var Kt = {}, ts;
function rr() {
  if (ts) return Kt;
  ts = 1, Object.defineProperty(Kt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ tr();
  class t extends Error {
    constructor(r, s, o, i) {
      super(i || `can't resolve reference ${o} from id ${s}`), this.missingRef = (0, e.resolveUrl)(r, s, o), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(r, this.missingRef));
    }
  }
  return Kt.default = t, Kt;
}
var xe = {}, ns;
function or() {
  if (ns) return xe;
  ns = 1, Object.defineProperty(xe, "__esModule", { value: !0 }), xe.resolveSchema = xe.getCompilingSchema = xe.resolveRef = xe.compileSchema = xe.SchemaEnv = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ to(), n = /* @__PURE__ */ De(), r = /* @__PURE__ */ tr(), s = /* @__PURE__ */ de(), o = /* @__PURE__ */ nr();
  class i {
    constructor(g) {
      var h;
      this.refs = {}, this.dynamicAnchors = {};
      let _;
      typeof g.schema == "object" && (_ = g.schema), this.schema = g.schema, this.schemaId = g.schemaId, this.root = g.root || this, this.baseId = (h = g.baseId) !== null && h !== void 0 ? h : (0, r.normalizeId)(_?.[g.schemaId || "$id"]), this.schemaPath = g.schemaPath, this.localRefs = g.localRefs, this.meta = g.meta, this.$async = _?.$async, this.refs = {};
    }
  }
  xe.SchemaEnv = i;
  function a(u) {
    const g = d.call(this, u);
    if (g)
      return g;
    const h = (0, r.getFullPath)(this.opts.uriResolver, u.root.baseId), { es5: _, lines: S } = this.opts.code, { ownProperties: f } = this.opts, p = new e.CodeGen(this.scope, { es5: _, lines: S, ownProperties: f });
    let y;
    u.$async && (y = p.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const C = p.scopeName("validate");
    u.validateName = C;
    const A = {
      gen: p,
      allErrors: this.opts.allErrors,
      data: n.default.data,
      parentData: n.default.parentData,
      parentDataProperty: n.default.parentDataProperty,
      dataNames: [n.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: p.scopeValue("schema", this.opts.code.source === !0 ? { ref: u.schema, code: (0, e.stringify)(u.schema) } : { ref: u.schema }),
      validateName: C,
      ValidationError: y,
      schema: u.schema,
      schemaEnv: u,
      rootId: h,
      baseId: u.baseId || h,
      schemaPath: e.nil,
      errSchemaPath: u.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let P;
    try {
      this._compilations.add(u), (0, o.validateFunctionCode)(A), p.optimize(this.opts.code.optimize);
      const T = p.toString();
      P = `${p.scopeRefs(n.default.scope)}return ${T}`, this.opts.code.process && (P = this.opts.code.process(P, u));
      const L = new Function(`${n.default.self}`, `${n.default.scope}`, P)(this, this.scope.get());
      if (this.scope.value(C, { ref: L }), L.errors = null, L.schema = u.schema, L.schemaEnv = u, u.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: C, validateCode: T, scopeValues: p._values }), this.opts.unevaluated) {
        const { props: I, items: Q } = A;
        L.evaluated = {
          props: I instanceof e.Name ? void 0 : I,
          items: Q instanceof e.Name ? void 0 : Q,
          dynamicProps: I instanceof e.Name,
          dynamicItems: Q instanceof e.Name
        }, L.source && (L.source.evaluated = (0, e.stringify)(L.evaluated));
      }
      return u.validate = L, u;
    } catch (T) {
      throw delete u.validate, delete u.validateName, P && this.logger.error("Error compiling schema, function code:", P), T;
    } finally {
      this._compilations.delete(u);
    }
  }
  xe.compileSchema = a;
  function c(u, g, h) {
    var _;
    h = (0, r.resolveUrl)(this.opts.uriResolver, g, h);
    const S = u.refs[h];
    if (S)
      return S;
    let f = b.call(this, u, h);
    if (f === void 0) {
      const p = (_ = u.localRefs) === null || _ === void 0 ? void 0 : _[h], { schemaId: y } = this.opts;
      p && (f = new i({ schema: p, schemaId: y, root: u, baseId: g }));
    }
    if (f !== void 0)
      return u.refs[h] = l.call(this, f);
  }
  xe.resolveRef = c;
  function l(u) {
    return (0, r.inlineRef)(u.schema, this.opts.inlineRefs) ? u.schema : u.validate ? u : a.call(this, u);
  }
  function d(u) {
    for (const g of this._compilations)
      if (m(g, u))
        return g;
  }
  xe.getCompilingSchema = d;
  function m(u, g) {
    return u.schema === g.schema && u.root === g.root && u.baseId === g.baseId;
  }
  function b(u, g) {
    let h;
    for (; typeof (h = this.refs[g]) == "string"; )
      g = h;
    return h || this.schemas[g] || v.call(this, u, g);
  }
  function v(u, g) {
    const h = this.opts.uriResolver.parse(g), _ = (0, r._getFullPath)(this.opts.uriResolver, h);
    let S = (0, r.getFullPath)(this.opts.uriResolver, u.baseId, void 0);
    if (Object.keys(u.schema).length > 0 && _ === S)
      return w.call(this, h, u);
    const f = (0, r.normalizeId)(_), p = this.refs[f] || this.schemas[f];
    if (typeof p == "string") {
      const y = v.call(this, u, p);
      return typeof y?.schema != "object" ? void 0 : w.call(this, h, y);
    }
    if (typeof p?.schema == "object") {
      if (p.validate || a.call(this, p), f === (0, r.normalizeId)(g)) {
        const { schema: y } = p, { schemaId: C } = this.opts, A = y[C];
        return A && (S = (0, r.resolveUrl)(this.opts.uriResolver, S, A)), new i({ schema: y, schemaId: C, root: u, baseId: S });
      }
      return w.call(this, h, p);
    }
  }
  xe.resolveSchema = v;
  const $ = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function w(u, { baseId: g, schema: h, root: _ }) {
    var S;
    if (((S = u.fragment) === null || S === void 0 ? void 0 : S[0]) !== "/")
      return;
    for (const y of u.fragment.slice(1).split("/")) {
      if (typeof h == "boolean")
        return;
      const C = h[(0, s.unescapeFragment)(y)];
      if (C === void 0)
        return;
      h = C;
      const A = typeof h == "object" && h[this.opts.schemaId];
      !$.has(y) && A && (g = (0, r.resolveUrl)(this.opts.uriResolver, g, A));
    }
    let f;
    if (typeof h != "boolean" && h.$ref && !(0, s.schemaHasRulesButRef)(h, this.RULES)) {
      const y = (0, r.resolveUrl)(this.opts.uriResolver, g, h.$ref);
      f = v.call(this, _, y);
    }
    const { schemaId: p } = this.opts;
    if (f = f || new i({ schema: h, schemaId: p, root: _, baseId: g }), f.schema !== f.root.schema)
      return f;
  }
  return xe;
}
const Mc = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Nc = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Oc = "object", Tc = ["$data"], Fc = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, zc = !1, jc = {
  $id: Mc,
  description: Nc,
  type: Oc,
  required: Tc,
  properties: Fc,
  additionalProperties: zc
};
var Gt = {}, Rt = { exports: {} }, Sr, rs;
function ia() {
  if (rs) return Sr;
  rs = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), t = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), n = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), r = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), s = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
  function o(f) {
    let p = "", y = 0, C = 0;
    for (C = 0; C < f.length; C++)
      if (y = f[C].charCodeAt(0), y !== 48) {
        if (!(y >= 48 && y <= 57 || y >= 65 && y <= 70 || y >= 97 && y <= 102))
          return "";
        p += f[C];
        break;
      }
    for (C += 1; C < f.length; C++) {
      if (y = f[C].charCodeAt(0), !(y >= 48 && y <= 57 || y >= 65 && y <= 70 || y >= 97 && y <= 102))
        return "";
      p += f[C];
    }
    return p;
  }
  const i = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function a(f) {
    return f.length = 0, !0;
  }
  function c(f, p, y) {
    if (f.length) {
      const C = o(f);
      if (C !== "")
        p.push(C);
      else
        return y.error = !0, !1;
      f.length = 0;
    }
    return !0;
  }
  function l(f) {
    let p = 0;
    const y = { error: !1, address: "", zone: "" }, C = [], A = [];
    let P = !1, T = !1, R = c;
    for (let L = 0; L < f.length; L++) {
      const I = f[L];
      if (!(I === "[" || I === "]"))
        if (I === ":") {
          if (P === !0 && (T = !0), !R(A, C, y))
            break;
          if (++p > 7) {
            y.error = !0;
            break;
          }
          L > 0 && f[L - 1] === ":" && (P = !0), C.push(":");
          continue;
        } else if (I === "%") {
          if (!R(A, C, y))
            break;
          R = a;
        } else {
          A.push(I);
          continue;
        }
    }
    return A.length && (R === a ? y.zone = A.join("") : T ? C.push(A.join("")) : C.push(o(A))), y.address = C.join(""), y;
  }
  function d(f) {
    if (m(f, ":") < 2)
      return { host: f, isIPV6: !1 };
    const p = l(f);
    if (p.error)
      return { host: f, isIPV6: !1 };
    {
      let y = p.address, C = p.address;
      return p.zone && (y += "%" + p.zone, C += "%25" + p.zone), { host: y, isIPV6: !0, escapedHost: C };
    }
  }
  function m(f, p) {
    let y = 0;
    for (let C = 0; C < f.length; C++)
      f[C] === p && y++;
    return y;
  }
  function b(f) {
    let p = f;
    const y = [];
    let C = -1, A = 0;
    for (; A = p.length; ) {
      if (A === 1) {
        if (p === ".")
          break;
        if (p === "/") {
          y.push("/");
          break;
        } else {
          y.push(p);
          break;
        }
      } else if (A === 2) {
        if (p[0] === ".") {
          if (p[1] === ".")
            break;
          if (p[1] === "/") {
            p = p.slice(2);
            continue;
          }
        } else if (p[0] === "/" && (p[1] === "." || p[1] === "/")) {
          y.push("/");
          break;
        }
      } else if (A === 3 && p === "/..") {
        y.length !== 0 && y.pop(), y.push("/");
        break;
      }
      if (p[0] === ".") {
        if (p[1] === ".") {
          if (p[2] === "/") {
            p = p.slice(3);
            continue;
          }
        } else if (p[1] === "/") {
          p = p.slice(2);
          continue;
        }
      } else if (p[0] === "/" && p[1] === ".") {
        if (p[2] === "/") {
          p = p.slice(2);
          continue;
        } else if (p[2] === "." && p[3] === "/") {
          p = p.slice(3), y.length !== 0 && y.pop();
          continue;
        }
      }
      if ((C = p.indexOf("/", 1)) === -1) {
        y.push(p);
        break;
      } else
        y.push(p.slice(0, C)), p = p.slice(C);
    }
    return y.join("");
  }
  const v = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, $ = /[@/?#:]/g, w = /[@/?#]/g;
  function u(f, p) {
    const y = p ? w : $;
    return y.lastIndex = 0, f.replace(y, (C) => v[C]);
  }
  function g(f, p = !1) {
    if (f.indexOf("%") === -1)
      return f;
    let y = "";
    for (let C = 0; C < f.length; C++) {
      if (f[C] === "%" && C + 2 < f.length) {
        const A = f.slice(C + 1, C + 3);
        if (n(A)) {
          const P = A.toUpperCase(), T = String.fromCharCode(parseInt(P, 16));
          p && r(T) ? y += T : y += "%" + P, C += 2;
          continue;
        }
      }
      y += f[C];
    }
    return y;
  }
  function h(f) {
    let p = "";
    for (let y = 0; y < f.length; y++) {
      if (f[y] === "%" && y + 2 < f.length) {
        const C = f.slice(y + 1, y + 3);
        if (n(C)) {
          const A = C.toUpperCase(), P = String.fromCharCode(parseInt(A, 16));
          P !== "." && r(P) ? p += P : p += "%" + A, y += 2;
          continue;
        }
      }
      s(f[y]) ? p += f[y] : p += escape(f[y]);
    }
    return p;
  }
  function _(f) {
    let p = "";
    for (let y = 0; y < f.length; y++) {
      if (f[y] === "%" && y + 2 < f.length) {
        const C = f.slice(y + 1, y + 3);
        if (n(C)) {
          p += "%" + C.toUpperCase(), y += 2;
          continue;
        }
      }
      p += escape(f[y]);
    }
    return p;
  }
  function S(f) {
    const p = [];
    if (f.userinfo !== void 0 && (p.push(f.userinfo), p.push("@")), f.host !== void 0) {
      let y = unescape(f.host);
      if (!t(y)) {
        const C = d(y);
        C.isIPV6 === !0 ? y = `[${C.escapedHost}]` : y = u(y, !1);
      }
      p.push(y);
    }
    return (typeof f.port == "number" || typeof f.port == "string") && (p.push(":"), p.push(String(f.port))), p.length ? p.join("") : void 0;
  }
  return Sr = {
    nonSimpleDomain: i,
    recomposeAuthority: S,
    reescapeHostDelimiters: u,
    normalizePercentEncoding: g,
    normalizePathEncoding: h,
    escapePreservingEscapes: _,
    removeDotSegments: b,
    isIPv4: t,
    isUUID: e,
    normalizeIPv6: d,
    stringArrayToHexStripped: o
  }, Sr;
}
var kr, os;
function Ic() {
  if (os) return kr;
  os = 1;
  const { isUUID: e } = ia(), t = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, n = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function r(f) {
    return n.indexOf(
      /** @type {*} */
      f
    ) !== -1;
  }
  function s(f) {
    return f.secure === !0 ? !0 : f.secure === !1 ? !1 : f.scheme ? f.scheme.length === 3 && (f.scheme[0] === "w" || f.scheme[0] === "W") && (f.scheme[1] === "s" || f.scheme[1] === "S") && (f.scheme[2] === "s" || f.scheme[2] === "S") : !1;
  }
  function o(f) {
    return f.host || (f.error = f.error || "HTTP URIs must have a host."), f;
  }
  function i(f) {
    const p = String(f.scheme).toLowerCase() === "https";
    return (f.port === (p ? 443 : 80) || f.port === "") && (f.port = void 0), f.path || (f.path = "/"), f;
  }
  function a(f) {
    return f.secure = s(f), f.resourceName = (f.path || "/") + (f.query ? "?" + f.query : ""), f.path = void 0, f.query = void 0, f;
  }
  function c(f) {
    if ((f.port === (s(f) ? 443 : 80) || f.port === "") && (f.port = void 0), typeof f.secure == "boolean" && (f.scheme = f.secure ? "wss" : "ws", f.secure = void 0), f.resourceName) {
      const [p, y] = f.resourceName.split("?");
      f.path = p && p !== "/" ? p : void 0, f.query = y, f.resourceName = void 0;
    }
    return f.fragment = void 0, f;
  }
  function l(f, p) {
    if (!f.path)
      return f.error = "URN can not be parsed", f;
    const y = f.path.match(t);
    if (y) {
      const C = p.scheme || f.scheme || "urn";
      f.nid = y[1].toLowerCase(), f.nss = y[2];
      const A = `${C}:${p.nid || f.nid}`, P = S(A);
      f.path = void 0, P && (f = P.parse(f, p));
    } else
      f.error = f.error || "URN can not be parsed.";
    return f;
  }
  function d(f, p) {
    if (f.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const y = p.scheme || f.scheme || "urn", C = f.nid.toLowerCase(), A = `${y}:${p.nid || C}`, P = S(A);
    P && (f = P.serialize(f, p));
    const T = f, R = f.nss;
    return T.path = `${C || p.nid}:${R}`, p.skipEscape = !0, T;
  }
  function m(f, p) {
    const y = f;
    return y.uuid = y.nss, y.nss = void 0, !p.tolerant && (!y.uuid || !e(y.uuid)) && (y.error = y.error || "UUID is not valid."), y;
  }
  function b(f) {
    const p = f;
    return p.nss = (f.uuid || "").toLowerCase(), p;
  }
  const v = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: o,
      serialize: i
    }
  ), $ = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: v.domainHost,
      parse: o,
      serialize: i
    }
  ), w = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: a,
      serialize: c
    }
  ), u = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: w.domainHost,
      parse: w.parse,
      serialize: w.serialize
    }
  ), _ = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: v,
      https: $,
      ws: w,
      wss: u,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: l,
          serialize: d,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: m,
          serialize: b,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(_, null);
  function S(f) {
    return f && (_[
      /** @type {SchemeName} */
      f
    ] || _[
      /** @type {SchemeName} */
      f.toLowerCase()
    ]) || void 0;
  }
  return kr = {
    wsIsSecure: s,
    SCHEMES: _,
    isValidSchemeName: r,
    getSchemeHandler: S
  }, kr;
}
var ss;
function Dc() {
  if (ss) return Rt.exports;
  ss = 1;
  const { normalizeIPv6: e, removeDotSegments: t, recomposeAuthority: n, normalizePercentEncoding: r, normalizePathEncoding: s, escapePreservingEscapes: o, reescapeHostDelimiters: i, isIPv4: a, nonSimpleDomain: c } = ia(), { SCHEMES: l, getSchemeHandler: d } = Ic();
  function m(A, P) {
    return typeof A == "string" ? A = /** @type {T} */
    f(A, P) : typeof A == "object" && (A = /** @type {T} */
    S(w(A, P), P)), A;
  }
  function b(A, P, T) {
    const R = T ? Object.assign({ scheme: "null" }, T) : { scheme: "null" }, L = v(S(A, R), S(P, R), R, !0);
    return R.skipEscape = !0, w(L, R);
  }
  function v(A, P, T, R) {
    const L = {};
    return R || (A = S(w(A, T), T), P = S(w(P, T), T)), T = T || {}, !T.tolerant && P.scheme ? (L.scheme = P.scheme, L.userinfo = P.userinfo, L.host = P.host, L.port = P.port, L.path = t(P.path || ""), L.query = P.query) : (P.userinfo !== void 0 || P.host !== void 0 || P.port !== void 0 ? (L.userinfo = P.userinfo, L.host = P.host, L.port = P.port, L.path = t(P.path || ""), L.query = P.query) : (P.path ? (P.path[0] === "/" ? L.path = t(P.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? L.path = "/" + P.path : A.path ? L.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + P.path : L.path = P.path, L.path = t(L.path)), L.query = P.query) : (L.path = A.path, P.query !== void 0 ? L.query = P.query : L.query = A.query), L.userinfo = A.userinfo, L.host = A.host, L.port = A.port), L.scheme = A.scheme), L.fragment = P.fragment, L;
  }
  function $(A, P, T) {
    const R = y(A, T), L = y(P, T);
    return R !== void 0 && L !== void 0 && R.toLowerCase() === L.toLowerCase();
  }
  function w(A, P) {
    const T = {
      host: A.host,
      scheme: A.scheme,
      userinfo: A.userinfo,
      port: A.port,
      path: A.path,
      query: A.query,
      nid: A.nid,
      nss: A.nss,
      uuid: A.uuid,
      fragment: A.fragment,
      reference: A.reference,
      resourceName: A.resourceName,
      secure: A.secure,
      error: ""
    }, R = Object.assign({}, P), L = [], I = d(R.scheme || T.scheme);
    I && I.serialize && I.serialize(T, R), T.path !== void 0 && (R.skipEscape ? T.path = r(T.path) : (T.path = o(T.path), T.scheme !== void 0 && (T.path = T.path.split("%3A").join(":")))), R.reference !== "suffix" && T.scheme && L.push(T.scheme, ":");
    const Q = n(T);
    if (Q !== void 0 && (R.reference !== "suffix" && L.push("//"), L.push(Q), T.path && T.path[0] !== "/" && L.push("/")), T.path !== void 0) {
      let V = T.path;
      !R.absolutePath && (!I || !I.absolutePath) && (V = t(V)), Q === void 0 && V[0] === "/" && V[1] === "/" && (V = "/%2F" + V.slice(2)), L.push(V);
    }
    return T.query !== void 0 && L.push("?", T.query), T.fragment !== void 0 && L.push("#", T.fragment), L.join("");
  }
  const u = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u, g = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
  function h(A, P) {
    if (P[2] !== void 0 && A.path && A.path[0] !== "/")
      return 'URI path must start with "/" when authority is present.';
    if (typeof A.port == "number" && (A.port < 0 || A.port > 65535))
      return "URI port is malformed.";
  }
  function _(A, P) {
    const T = Object.assign({}, P), R = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let L = !1, I = !1;
    T.reference === "suffix" && (T.scheme ? A = T.scheme + ":" + A : A = "//" + A);
    const Q = A.match(g);
    Q !== null && Q[1].indexOf("\\") !== -1 && (R.error = "URI authority must not contain a literal backslash.", L = !0);
    const V = A.match(u);
    if (V) {
      R.scheme = V[1], R.userinfo = V[3], R.host = V[4], R.port = parseInt(V[5], 10), R.path = V[6] || "", R.query = V[7], R.fragment = V[8], isNaN(R.port) && (R.port = V[5]);
      const q = h(R, V);
      if (q !== void 0 && (R.error = R.error || q, L = !0), R.host)
        if (a(R.host) === !1) {
          const U = e(R.host);
          R.host = U.host.toLowerCase(), I = U.isIPV6;
        } else
          I = !0;
      R.scheme === void 0 && R.userinfo === void 0 && R.host === void 0 && R.port === void 0 && R.query === void 0 && !R.path ? R.reference = "same-document" : R.scheme === void 0 ? R.reference = "relative" : R.fragment === void 0 ? R.reference = "absolute" : R.reference = "uri", T.reference && T.reference !== "suffix" && T.reference !== R.reference && (R.error = R.error || "URI is not a " + T.reference + " reference.");
      const Y = d(T.scheme || R.scheme);
      if (!T.unicodeSupport && (!Y || !Y.unicodeSupport) && R.host && (T.domainHost || Y && Y.domainHost) && I === !1 && c(R.host))
        try {
          R.host = new URL("http://" + R.host).hostname;
        } catch (re) {
          R.error = R.error || "Host's domain name can not be converted to ASCII: " + re;
        }
      if ((!Y || Y && !Y.skipNormalize) && (A.indexOf("%") !== -1 && (R.scheme !== void 0 && (R.scheme = unescape(R.scheme)), R.host !== void 0 && (R.host = i(unescape(R.host), I))), R.path && (R.path = s(R.path)), R.fragment))
        try {
          R.fragment = encodeURI(decodeURIComponent(R.fragment));
        } catch {
          R.error = R.error || "URI malformed";
        }
      Y && Y.parse && Y.parse(R, T);
    } else
      R.error = R.error || "URI can not be parsed.";
    return { parsed: R, malformedAuthorityOrPort: L };
  }
  function S(A, P) {
    return _(A, P).parsed;
  }
  function f(A, P) {
    return p(A, P).normalized;
  }
  function p(A, P) {
    const { parsed: T, malformedAuthorityOrPort: R } = _(A, P);
    return {
      normalized: R ? A : w(T, P),
      malformedAuthorityOrPort: R
    };
  }
  function y(A, P) {
    if (typeof A == "string") {
      const { normalized: T, malformedAuthorityOrPort: R } = p(A, P);
      return R ? void 0 : T;
    }
    if (typeof A == "object")
      return w(A, P);
  }
  const C = {
    SCHEMES: l,
    normalize: m,
    resolve: b,
    resolveComponent: v,
    equal: $,
    serialize: w,
    parse: S
  };
  return Rt.exports = C, Rt.exports.default = C, Rt.exports.fastUri = C, Rt.exports;
}
var is;
function Lc() {
  if (is) return Gt;
  is = 1, Object.defineProperty(Gt, "__esModule", { value: !0 });
  const e = Dc();
  return e.code = 'require("ajv/dist/runtime/uri").default', Gt.default = e, Gt;
}
var as;
function Bc() {
  return as || (as = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = /* @__PURE__ */ nr();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var n = /* @__PURE__ */ ie();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return n.CodeGen;
    } });
    const r = /* @__PURE__ */ to(), s = /* @__PURE__ */ rr(), o = /* @__PURE__ */ ra(), i = /* @__PURE__ */ or(), a = /* @__PURE__ */ ie(), c = /* @__PURE__ */ tr(), l = /* @__PURE__ */ Yn(), d = /* @__PURE__ */ de(), m = jc, b = /* @__PURE__ */ Lc(), v = (U, O) => new RegExp(U, O);
    v.code = "new RegExp";
    const $ = ["removeAdditional", "useDefaults", "coerceTypes"], w = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), u = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, g = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, h = 200;
    function _(U) {
      var O, H, z, k, E, D, te, ne, oe, W, M, x, F, B, J, Z, ae, se, fe, me, pe, be, ye, xt, hr;
      const At = U.strict, mr = (O = U.code) === null || O === void 0 ? void 0 : O.optimize, Oo = mr === !0 || mr === void 0 ? 1 : mr || 0, To = (z = (H = U.code) === null || H === void 0 ? void 0 : H.regExp) !== null && z !== void 0 ? z : v, kc = (k = U.uriResolver) !== null && k !== void 0 ? k : b.default;
      return {
        strictSchema: (D = (E = U.strictSchema) !== null && E !== void 0 ? E : At) !== null && D !== void 0 ? D : !0,
        strictNumbers: (ne = (te = U.strictNumbers) !== null && te !== void 0 ? te : At) !== null && ne !== void 0 ? ne : !0,
        strictTypes: (W = (oe = U.strictTypes) !== null && oe !== void 0 ? oe : At) !== null && W !== void 0 ? W : "log",
        strictTuples: (x = (M = U.strictTuples) !== null && M !== void 0 ? M : At) !== null && x !== void 0 ? x : "log",
        strictRequired: (B = (F = U.strictRequired) !== null && F !== void 0 ? F : At) !== null && B !== void 0 ? B : !1,
        code: U.code ? { ...U.code, optimize: Oo, regExp: To } : { optimize: Oo, regExp: To },
        loopRequired: (J = U.loopRequired) !== null && J !== void 0 ? J : h,
        loopEnum: (Z = U.loopEnum) !== null && Z !== void 0 ? Z : h,
        meta: (ae = U.meta) !== null && ae !== void 0 ? ae : !0,
        messages: (se = U.messages) !== null && se !== void 0 ? se : !0,
        inlineRefs: (fe = U.inlineRefs) !== null && fe !== void 0 ? fe : !0,
        schemaId: (me = U.schemaId) !== null && me !== void 0 ? me : "$id",
        addUsedSchema: (pe = U.addUsedSchema) !== null && pe !== void 0 ? pe : !0,
        validateSchema: (be = U.validateSchema) !== null && be !== void 0 ? be : !0,
        validateFormats: (ye = U.validateFormats) !== null && ye !== void 0 ? ye : !0,
        unicodeRegExp: (xt = U.unicodeRegExp) !== null && xt !== void 0 ? xt : !0,
        int32range: (hr = U.int32range) !== null && hr !== void 0 ? hr : !0,
        uriResolver: kc
      };
    }
    class S {
      constructor(O = {}) {
        this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), O = this.opts = { ...O, ..._(O) };
        const { es5: H, lines: z } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: w, es5: H, lines: z }), this.logger = R(O.logger);
        const k = O.validateFormats;
        O.validateFormats = !1, this.RULES = (0, o.getRules)(), f.call(this, u, O, "NOT SUPPORTED"), f.call(this, g, O, "DEPRECATED", "warn"), this._metaOpts = P.call(this), O.formats && C.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), O.keywords && A.call(this, O.keywords), typeof O.meta == "object" && this.addMetaSchema(O.meta), y.call(this), O.validateFormats = k;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: O, meta: H, schemaId: z } = this.opts;
        let k = m;
        z === "id" && (k = { ...m }, k.id = k.$id, delete k.$id), H && O && this.addMetaSchema(k, k[z], !1);
      }
      defaultMeta() {
        const { meta: O, schemaId: H } = this.opts;
        return this.opts.defaultMeta = typeof O == "object" ? O[H] || O : void 0;
      }
      validate(O, H) {
        let z;
        if (typeof O == "string") {
          if (z = this.getSchema(O), !z)
            throw new Error(`no schema with key or ref "${O}"`);
        } else
          z = this.compile(O);
        const k = z(H);
        return "$async" in z || (this.errors = z.errors), k;
      }
      compile(O, H) {
        const z = this._addSchema(O, H);
        return z.validate || this._compileSchemaEnv(z);
      }
      compileAsync(O, H) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: z } = this.opts;
        return k.call(this, O, H);
        async function k(W, M) {
          await E.call(this, W.$schema);
          const x = this._addSchema(W, M);
          return x.validate || D.call(this, x);
        }
        async function E(W) {
          W && !this.getSchema(W) && await k.call(this, { $ref: W }, !0);
        }
        async function D(W) {
          try {
            return this._compileSchemaEnv(W);
          } catch (M) {
            if (!(M instanceof s.default))
              throw M;
            return te.call(this, M), await ne.call(this, M.missingSchema), D.call(this, W);
          }
        }
        function te({ missingSchema: W, missingRef: M }) {
          if (this.refs[W])
            throw new Error(`AnySchema ${W} is loaded but ${M} cannot be resolved`);
        }
        async function ne(W) {
          const M = await oe.call(this, W);
          this.refs[W] || await E.call(this, M.$schema), this.refs[W] || this.addSchema(M, W, H);
        }
        async function oe(W) {
          const M = this._loading[W];
          if (M)
            return M;
          try {
            return await (this._loading[W] = z(W));
          } finally {
            delete this._loading[W];
          }
        }
      }
      // Adds schema to the instance
      addSchema(O, H, z, k = this.opts.validateSchema) {
        if (Array.isArray(O)) {
          for (const D of O)
            this.addSchema(D, void 0, z, k);
          return this;
        }
        let E;
        if (typeof O == "object") {
          const { schemaId: D } = this.opts;
          if (E = O[D], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${D} must be string`);
        }
        return H = (0, c.normalizeId)(H || E), this._checkUnique(H), this.schemas[H] = this._addSchema(O, z, H, k, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(O, H, z = this.opts.validateSchema) {
        return this.addSchema(O, H, !0, z), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(O, H) {
        if (typeof O == "boolean")
          return !0;
        let z;
        if (z = O.$schema, z !== void 0 && typeof z != "string")
          throw new Error("$schema must be a string");
        if (z = z || this.opts.defaultMeta || this.defaultMeta(), !z)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const k = this.validate(z, O);
        if (!k && H) {
          const E = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(E);
          else
            throw new Error(E);
        }
        return k;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(O) {
        let H;
        for (; typeof (H = p.call(this, O)) == "string"; )
          O = H;
        if (H === void 0) {
          const { schemaId: z } = this.opts, k = new i.SchemaEnv({ schema: {}, schemaId: z });
          if (H = i.resolveSchema.call(this, k, O), !H)
            return;
          this.refs[O] = H;
        }
        return H.validate || this._compileSchemaEnv(H);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(O) {
        if (O instanceof RegExp)
          return this._removeAllSchemas(this.schemas, O), this._removeAllSchemas(this.refs, O), this;
        switch (typeof O) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const H = p.call(this, O);
            return typeof H == "object" && this._cache.delete(H.schema), delete this.schemas[O], delete this.refs[O], this;
          }
          case "object": {
            const H = O;
            this._cache.delete(H);
            let z = O[this.opts.schemaId];
            return z && (z = (0, c.normalizeId)(z), delete this.schemas[z], delete this.refs[z]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(O) {
        for (const H of O)
          this.addKeyword(H);
        return this;
      }
      addKeyword(O, H) {
        let z;
        if (typeof O == "string")
          z = O, typeof H == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), H.keyword = z);
        else if (typeof O == "object" && H === void 0) {
          if (H = O, z = H.keyword, Array.isArray(z) && !z.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (I.call(this, z, H), !H)
          return (0, d.eachItem)(z, (E) => Q.call(this, E)), this;
        q.call(this, H);
        const k = {
          ...H,
          type: (0, l.getJSONTypes)(H.type),
          schemaType: (0, l.getJSONTypes)(H.schemaType)
        };
        return (0, d.eachItem)(z, k.type.length === 0 ? (E) => Q.call(this, E, k) : (E) => k.type.forEach((D) => Q.call(this, E, k, D))), this;
      }
      getKeyword(O) {
        const H = this.RULES.all[O];
        return typeof H == "object" ? H.definition : !!H;
      }
      // Remove keyword
      removeKeyword(O) {
        const { RULES: H } = this;
        delete H.keywords[O], delete H.all[O];
        for (const z of H.rules) {
          const k = z.rules.findIndex((E) => E.keyword === O);
          k >= 0 && z.rules.splice(k, 1);
        }
        return this;
      }
      // Add format
      addFormat(O, H) {
        return typeof H == "string" && (H = new RegExp(H)), this.formats[O] = H, this;
      }
      errorsText(O = this.errors, { separator: H = ", ", dataVar: z = "data" } = {}) {
        return !O || O.length === 0 ? "No errors" : O.map((k) => `${z}${k.instancePath} ${k.message}`).reduce((k, E) => k + H + E);
      }
      $dataMetaSchema(O, H) {
        const z = this.RULES.all;
        O = JSON.parse(JSON.stringify(O));
        for (const k of H) {
          const E = k.split("/").slice(1);
          let D = O;
          for (const te of E)
            D = D[te];
          for (const te in z) {
            const ne = z[te];
            if (typeof ne != "object")
              continue;
            const { $data: oe } = ne.definition, W = D[te];
            oe && W && (D[te] = re(W));
          }
        }
        return O;
      }
      _removeAllSchemas(O, H) {
        for (const z in O) {
          const k = O[z];
          (!H || H.test(z)) && (typeof k == "string" ? delete O[z] : k && !k.meta && (this._cache.delete(k.schema), delete O[z]));
        }
      }
      _addSchema(O, H, z, k = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let D;
        const { schemaId: te } = this.opts;
        if (typeof O == "object")
          D = O[te];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof O != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let ne = this._cache.get(O);
        if (ne !== void 0)
          return ne;
        z = (0, c.normalizeId)(D || z);
        const oe = c.getSchemaRefs.call(this, O, z);
        return ne = new i.SchemaEnv({ schema: O, schemaId: te, meta: H, baseId: z, localRefs: oe }), this._cache.set(ne.schema, ne), E && !z.startsWith("#") && (z && this._checkUnique(z), this.refs[z] = ne), k && this.validateSchema(O, !0), ne;
      }
      _checkUnique(O) {
        if (this.schemas[O] || this.refs[O])
          throw new Error(`schema with key or id "${O}" already exists`);
      }
      _compileSchemaEnv(O) {
        if (O.meta ? this._compileMetaSchema(O) : i.compileSchema.call(this, O), !O.validate)
          throw new Error("ajv implementation error");
        return O.validate;
      }
      _compileMetaSchema(O) {
        const H = this.opts;
        this.opts = this._metaOpts;
        try {
          i.compileSchema.call(this, O);
        } finally {
          this.opts = H;
        }
      }
    }
    S.ValidationError = r.default, S.MissingRefError = s.default, e.default = S;
    function f(U, O, H, z = "error") {
      for (const k in U) {
        const E = k;
        E in O && this.logger[z](`${H}: option ${k}. ${U[E]}`);
      }
    }
    function p(U) {
      return U = (0, c.normalizeId)(U), this.schemas[U] || this.refs[U];
    }
    function y() {
      const U = this.opts.schemas;
      if (U)
        if (Array.isArray(U))
          this.addSchema(U);
        else
          for (const O in U)
            this.addSchema(U[O], O);
    }
    function C() {
      for (const U in this.opts.formats) {
        const O = this.opts.formats[U];
        O && this.addFormat(U, O);
      }
    }
    function A(U) {
      if (Array.isArray(U)) {
        this.addVocabulary(U);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const O in U) {
        const H = U[O];
        H.keyword || (H.keyword = O), this.addKeyword(H);
      }
    }
    function P() {
      const U = { ...this.opts };
      for (const O of $)
        delete U[O];
      return U;
    }
    const T = { log() {
    }, warn() {
    }, error() {
    } };
    function R(U) {
      if (U === !1)
        return T;
      if (U === void 0)
        return console;
      if (U.log && U.warn && U.error)
        return U;
      throw new Error("logger must implement log, warn and error methods");
    }
    const L = /^[a-z_$][a-z0-9_$:-]*$/i;
    function I(U, O) {
      const { RULES: H } = this;
      if ((0, d.eachItem)(U, (z) => {
        if (H.keywords[z])
          throw new Error(`Keyword ${z} is already defined`);
        if (!L.test(z))
          throw new Error(`Keyword ${z} has invalid name`);
      }), !!O && O.$data && !("code" in O || "validate" in O))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function Q(U, O, H) {
      var z;
      const k = O?.post;
      if (H && k)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let D = k ? E.post : E.rules.find(({ type: ne }) => ne === H);
      if (D || (D = { type: H, rules: [] }, E.rules.push(D)), E.keywords[U] = !0, !O)
        return;
      const te = {
        keyword: U,
        definition: {
          ...O,
          type: (0, l.getJSONTypes)(O.type),
          schemaType: (0, l.getJSONTypes)(O.schemaType)
        }
      };
      O.before ? V.call(this, D, te, O.before) : D.rules.push(te), E.all[U] = te, (z = O.implements) === null || z === void 0 || z.forEach((ne) => this.addKeyword(ne));
    }
    function V(U, O, H) {
      const z = U.rules.findIndex((k) => k.keyword === H);
      z >= 0 ? U.rules.splice(z, 0, O) : (U.rules.push(O), this.logger.warn(`rule ${H} is not defined`));
    }
    function q(U) {
      let { metaSchema: O } = U;
      O !== void 0 && (U.$data && this.opts.$data && (O = re(O)), U.validateSchema = this.compile(O, !0));
    }
    const Y = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function re(U) {
      return { anyOf: [U, Y] };
    }
  })(gr)), gr;
}
var Wt = {}, Jt = {}, Yt = {}, cs;
function qc() {
  if (cs) return Yt;
  cs = 1, Object.defineProperty(Yt, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Yt.default = e, Yt;
}
var Xe = {}, ls;
function no() {
  if (ls) return Xe;
  ls = 1, Object.defineProperty(Xe, "__esModule", { value: !0 }), Xe.callRef = Xe.getValidate = void 0;
  const e = /* @__PURE__ */ rr(), t = /* @__PURE__ */ Le(), n = /* @__PURE__ */ ie(), r = /* @__PURE__ */ De(), s = /* @__PURE__ */ or(), o = /* @__PURE__ */ de(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(l) {
      const { gen: d, schema: m, it: b } = l, { baseId: v, schemaEnv: $, validateName: w, opts: u, self: g } = b, { root: h } = $;
      if ((m === "#" || m === "#/") && v === h.baseId)
        return S();
      const _ = s.resolveRef.call(g, h, v, m);
      if (_ === void 0)
        throw new e.default(b.opts.uriResolver, v, m);
      if (_ instanceof s.SchemaEnv)
        return f(_);
      return p(_);
      function S() {
        if ($ === h)
          return c(l, w, $, $.$async);
        const y = d.scopeValue("root", { ref: h });
        return c(l, (0, n._)`${y}.validate`, h, h.$async);
      }
      function f(y) {
        const C = a(l, y);
        c(l, C, y, y.$async);
      }
      function p(y) {
        const C = d.scopeValue("schema", u.code.source === !0 ? { ref: y, code: (0, n.stringify)(y) } : { ref: y }), A = d.name("valid"), P = l.subschema({
          schema: y,
          dataTypes: [],
          schemaPath: n.nil,
          topSchemaRef: C,
          errSchemaPath: m
        }, A);
        l.mergeEvaluated(P), l.ok(A);
      }
    }
  };
  function a(l, d) {
    const { gen: m } = l;
    return d.validate ? m.scopeValue("validate", { ref: d.validate }) : (0, n._)`${m.scopeValue("wrapper", { ref: d })}.validate`;
  }
  Xe.getValidate = a;
  function c(l, d, m, b) {
    const { gen: v, it: $ } = l, { allErrors: w, schemaEnv: u, opts: g } = $, h = g.passContext ? r.default.this : n.nil;
    b ? _() : S();
    function _() {
      if (!u.$async)
        throw new Error("async schema referenced by sync schema");
      const y = v.let("valid");
      v.try(() => {
        v.code((0, n._)`await ${(0, t.callValidateCode)(l, d, h)}`), p(d), w || v.assign(y, !0);
      }, (C) => {
        v.if((0, n._)`!(${C} instanceof ${$.ValidationError})`, () => v.throw(C)), f(C), w || v.assign(y, !1);
      }), l.ok(y);
    }
    function S() {
      l.result((0, t.callValidateCode)(l, d, h), () => p(d), () => f(d));
    }
    function f(y) {
      const C = (0, n._)`${y}.errors`;
      v.assign(r.default.vErrors, (0, n._)`${r.default.vErrors} === null ? ${C} : ${r.default.vErrors}.concat(${C})`), v.assign(r.default.errors, (0, n._)`${r.default.vErrors}.length`);
    }
    function p(y) {
      var C;
      if (!$.opts.unevaluated)
        return;
      const A = (C = m?.validate) === null || C === void 0 ? void 0 : C.evaluated;
      if ($.props !== !0)
        if (A && !A.dynamicProps)
          A.props !== void 0 && ($.props = o.mergeEvaluated.props(v, A.props, $.props));
        else {
          const P = v.var("props", (0, n._)`${y}.evaluated.props`);
          $.props = o.mergeEvaluated.props(v, P, $.props, n.Name);
        }
      if ($.items !== !0)
        if (A && !A.dynamicItems)
          A.items !== void 0 && ($.items = o.mergeEvaluated.items(v, A.items, $.items));
        else {
          const P = v.var("items", (0, n._)`${y}.evaluated.items`);
          $.items = o.mergeEvaluated.items(v, P, $.items, n.Name);
        }
    }
  }
  return Xe.callRef = c, Xe.default = i, Xe;
}
var ds;
function Vc() {
  if (ds) return Jt;
  ds = 1, Object.defineProperty(Jt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ qc(), t = /* @__PURE__ */ no(), n = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return Jt.default = n, Jt;
}
var Xt = {}, Zt = {}, us;
function Uc() {
  if (us) return Zt;
  us = 1, Object.defineProperty(Zt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = e.operators, n = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, r = {
    message: ({ keyword: o, schemaCode: i }) => (0, e.str)`must be ${n[o].okStr} ${i}`,
    params: ({ keyword: o, schemaCode: i }) => (0, e._)`{comparison: ${n[o].okStr}, limit: ${i}}`
  }, s = {
    keyword: Object.keys(n),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(o) {
      const { keyword: i, data: a, schemaCode: c } = o;
      o.fail$data((0, e._)`${a} ${n[i].fail} ${c} || isNaN(${a})`);
    }
  };
  return Zt.default = s, Zt;
}
var Qt = {}, fs;
function Hc() {
  if (fs) return Qt;
  fs = 1, Object.defineProperty(Qt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), n = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, e.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, e._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: s, data: o, schemaCode: i, it: a } = r, c = a.opts.multipleOfPrecision, l = s.let("res"), d = c ? (0, e._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${c}` : (0, e._)`${l} !== parseInt(${l})`;
      r.fail$data((0, e._)`(${i} === 0 || (${l} = ${o}/${i}, ${d}))`);
    }
  };
  return Qt.default = n, Qt;
}
var en = {}, tn = {}, ps;
function Kc() {
  if (ps) return tn;
  ps = 1, Object.defineProperty(tn, "__esModule", { value: !0 });
  function e(t) {
    const n = t.length;
    let r = 0, s = 0, o;
    for (; s < n; )
      r++, o = t.charCodeAt(s++), o >= 55296 && o <= 56319 && s < n && (o = t.charCodeAt(s), (o & 64512) === 56320 && s++);
    return r;
  }
  return tn.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', tn;
}
var hs;
function Gc() {
  if (hs) return en;
  hs = 1, Object.defineProperty(en, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ Kc(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: o, schemaCode: i }) {
        const a = o === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${i} characters`;
      },
      params: ({ schemaCode: o }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { keyword: i, data: a, schemaCode: c, it: l } = o, d = i === "maxLength" ? e.operators.GT : e.operators.LT, m = l.opts.unicode === !1 ? (0, e._)`${a}.length` : (0, e._)`${(0, t.useFunc)(o.gen, n.default)}(${a})`;
      o.fail$data((0, e._)`${m} ${d} ${c}`);
    }
  };
  return en.default = s, en;
}
var nn = {}, ms;
function Wc() {
  if (ms) return nn;
  ms = 1, Object.defineProperty(nn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Le(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ ie(), s = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: o }) => (0, n.str)`must match pattern "${o}"`,
      params: ({ schemaCode: o }) => (0, n._)`{pattern: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schema: l, schemaCode: d, it: m } = o, b = m.opts.unicodeRegExp ? "u" : "";
      if (c) {
        const { regExp: v } = m.opts.code, $ = v.code === "new RegExp" ? (0, n._)`new RegExp` : (0, t.useFunc)(i, v), w = i.let("valid");
        i.try(() => i.assign(w, (0, n._)`${$}(${d}, ${b}).test(${a})`), () => i.assign(w, !1)), o.fail$data((0, n._)`!${w}`);
      } else {
        const v = (0, e.usePattern)(o, l);
        o.fail$data((0, n._)`!${v}.test(${a})`);
      }
    }
  };
  return nn.default = s, nn;
}
var rn = {}, gs;
function Jc() {
  if (gs) return rn;
  gs = 1, Object.defineProperty(rn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), n = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: s }) {
        const o = r === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${s} properties`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: s, data: o, schemaCode: i } = r, a = s === "maxProperties" ? e.operators.GT : e.operators.LT;
      r.fail$data((0, e._)`Object.keys(${o}).length ${a} ${i}`);
    }
  };
  return rn.default = n, rn;
}
var on = {}, ys;
function Yc() {
  if (ys) return on;
  ys = 1, Object.defineProperty(on, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Le(), t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ de(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: o } }) => (0, t.str)`must have required property '${o}'`,
      params: ({ params: { missingProperty: o } }) => (0, t._)`{missingProperty: ${o}}`
    },
    code(o) {
      const { gen: i, schema: a, schemaCode: c, data: l, $data: d, it: m } = o, { opts: b } = m;
      if (!d && a.length === 0)
        return;
      const v = a.length >= b.loopRequired;
      if (m.allErrors ? $() : w(), b.strictRequired) {
        const h = o.parentSchema.properties, { definedProperties: _ } = o.it;
        for (const S of a)
          if (h?.[S] === void 0 && !_.has(S)) {
            const f = m.schemaEnv.baseId + m.errSchemaPath, p = `required property "${S}" is not defined at "${f}" (strictRequired)`;
            (0, n.checkStrictMode)(m, p, m.opts.strictRequired);
          }
      }
      function $() {
        if (v || d)
          o.block$data(t.nil, u);
        else
          for (const h of a)
            (0, e.checkReportMissingProp)(o, h);
      }
      function w() {
        const h = i.let("missing");
        if (v || d) {
          const _ = i.let("valid", !0);
          o.block$data(_, () => g(h, _)), o.ok(_);
        } else
          i.if((0, e.checkMissingProp)(o, a, h)), (0, e.reportMissingProp)(o, h), i.else();
      }
      function u() {
        i.forOf("prop", c, (h) => {
          o.setParams({ missingProperty: h }), i.if((0, e.noPropertyInData)(i, l, h, b.ownProperties), () => o.error());
        });
      }
      function g(h, _) {
        o.setParams({ missingProperty: h }), i.forOf(h, c, () => {
          i.assign(_, (0, e.propertyInData)(i, l, h, b.ownProperties)), i.if((0, t.not)(_), () => {
            o.error(), i.break();
          });
        }, t.nil);
      }
    }
  };
  return on.default = s, on;
}
var sn = {}, $s;
function Xc() {
  if ($s) return sn;
  $s = 1, Object.defineProperty(sn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), n = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: s }) {
        const o = r === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${s} items`;
      },
      params: ({ schemaCode: r }) => (0, e._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: s, data: o, schemaCode: i } = r, a = s === "maxItems" ? e.operators.GT : e.operators.LT;
      r.fail$data((0, e._)`${o}.length ${a} ${i}`);
    }
  };
  return sn.default = n, sn;
}
var an = {}, cn = {}, bs;
function ro() {
  if (bs) return cn;
  bs = 1, Object.defineProperty(cn, "__esModule", { value: !0 });
  const e = sa();
  return e.code = 'require("ajv/dist/runtime/equal").default', cn.default = e, cn;
}
var vs;
function Zc() {
  if (vs) return an;
  vs = 1, Object.defineProperty(an, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Yn(), t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ de(), r = /* @__PURE__ */ ro(), o = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i, j: a } }) => (0, t.str)`must NOT have duplicate items (items ## ${a} and ${i} are identical)`,
      params: ({ params: { i, j: a } }) => (0, t._)`{i: ${i}, j: ${a}}`
    },
    code(i) {
      const { gen: a, data: c, $data: l, schema: d, parentSchema: m, schemaCode: b, it: v } = i;
      if (!l && !d)
        return;
      const $ = a.let("valid"), w = m.items ? (0, e.getSchemaTypes)(m.items) : [];
      i.block$data($, u, (0, t._)`${b} === false`), i.ok($);
      function u() {
        const S = a.let("i", (0, t._)`${c}.length`), f = a.let("j");
        i.setParams({ i: S, j: f }), a.assign($, !0), a.if((0, t._)`${S} > 1`, () => (g() ? h : _)(S, f));
      }
      function g() {
        return w.length > 0 && !w.some((S) => S === "object" || S === "array");
      }
      function h(S, f) {
        const p = a.name("item"), y = (0, e.checkDataTypes)(w, p, v.opts.strictNumbers, e.DataType.Wrong), C = a.const("indices", (0, t._)`{}`);
        a.for((0, t._)`;${S}--;`, () => {
          a.let(p, (0, t._)`${c}[${S}]`), a.if(y, (0, t._)`continue`), w.length > 1 && a.if((0, t._)`typeof ${p} == "string"`, (0, t._)`${p} += "_"`), a.if((0, t._)`typeof ${C}[${p}] == "number"`, () => {
            a.assign(f, (0, t._)`${C}[${p}]`), i.error(), a.assign($, !1).break();
          }).code((0, t._)`${C}[${p}] = ${S}`);
        });
      }
      function _(S, f) {
        const p = (0, n.useFunc)(a, r.default), y = a.name("outer");
        a.label(y).for((0, t._)`;${S}--;`, () => a.for((0, t._)`${f} = ${S}; ${f}--;`, () => a.if((0, t._)`${p}(${c}[${S}], ${c}[${f}])`, () => {
          i.error(), a.assign($, !1).break(y);
        })));
      }
    }
  };
  return an.default = o, an;
}
var ln = {}, ws;
function Qc() {
  if (ws) return ln;
  ws = 1, Object.defineProperty(ln, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ ro(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValue: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schemaCode: l, schema: d } = o;
      c || d && typeof d == "object" ? o.fail$data((0, e._)`!${(0, t.useFunc)(i, n.default)}(${a}, ${l})`) : o.fail((0, e._)`${d} !== ${a}`);
    }
  };
  return ln.default = s, ln;
}
var dn = {}, _s;
function el() {
  if (_s) return dn;
  _s = 1, Object.defineProperty(dn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ ro(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValues: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schema: l, schemaCode: d, it: m } = o;
      if (!c && l.length === 0)
        throw new Error("enum must have non-empty array");
      const b = l.length >= m.opts.loopEnum;
      let v;
      const $ = () => v ?? (v = (0, t.useFunc)(i, n.default));
      let w;
      if (b || c)
        w = i.let("valid"), o.block$data(w, u);
      else {
        if (!Array.isArray(l))
          throw new Error("ajv implementation error");
        const h = i.const("vSchema", d);
        w = (0, e.or)(...l.map((_, S) => g(h, S)));
      }
      o.pass(w);
      function u() {
        i.assign(w, !1), i.forOf("v", d, (h) => i.if((0, e._)`${$()}(${a}, ${h})`, () => i.assign(w, !0).break()));
      }
      function g(h, _) {
        const S = l[_];
        return typeof S == "object" && S !== null ? (0, e._)`${$()}(${a}, ${h}[${_}])` : (0, e._)`${a} === ${S}`;
      }
    }
  };
  return dn.default = s, dn;
}
var Ss;
function tl() {
  if (Ss) return Xt;
  Ss = 1, Object.defineProperty(Xt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Uc(), t = /* @__PURE__ */ Hc(), n = /* @__PURE__ */ Gc(), r = /* @__PURE__ */ Wc(), s = /* @__PURE__ */ Jc(), o = /* @__PURE__ */ Yc(), i = /* @__PURE__ */ Xc(), a = /* @__PURE__ */ Zc(), c = /* @__PURE__ */ Qc(), l = /* @__PURE__ */ el(), d = [
    // number
    e.default,
    t.default,
    // string
    n.default,
    r.default,
    // object
    s.default,
    o.default,
    // array
    i.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    l.default
  ];
  return Xt.default = d, Xt;
}
var un = {}, pt = {}, ks;
function aa() {
  if (ks) return pt;
  ks = 1, Object.defineProperty(pt, "__esModule", { value: !0 }), pt.validateAdditionalItems = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, e.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { parentSchema: i, it: a } = o, { items: c } = i;
      if (!Array.isArray(c)) {
        (0, t.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(o, c);
    }
  };
  function s(o, i) {
    const { gen: a, schema: c, data: l, keyword: d, it: m } = o;
    m.items = !0;
    const b = a.const("len", (0, e._)`${l}.length`);
    if (c === !1)
      o.setParams({ len: i.length }), o.pass((0, e._)`${b} <= ${i.length}`);
    else if (typeof c == "object" && !(0, t.alwaysValidSchema)(m, c)) {
      const $ = a.var("valid", (0, e._)`${b} <= ${i.length}`);
      a.if((0, e.not)($), () => v($)), o.ok($);
    }
    function v($) {
      a.forRange("i", i.length, b, (w) => {
        o.subschema({ keyword: d, dataProp: w, dataPropType: t.Type.Num }, $), m.allErrors || a.if((0, e.not)($), () => a.break());
      });
    }
  }
  return pt.validateAdditionalItems = s, pt.default = r, pt;
}
var fn = {}, ht = {}, Cs;
function ca() {
  if (Cs) return ht;
  Cs = 1, Object.defineProperty(ht, "__esModule", { value: !0 }), ht.validateTuple = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ Le(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(o) {
      const { schema: i, it: a } = o;
      if (Array.isArray(i))
        return s(o, "additionalItems", i);
      a.items = !0, !(0, t.alwaysValidSchema)(a, i) && o.ok((0, n.validateArray)(o));
    }
  };
  function s(o, i, a = o.schema) {
    const { gen: c, parentSchema: l, data: d, keyword: m, it: b } = o;
    w(l), b.opts.unevaluated && a.length && b.items !== !0 && (b.items = t.mergeEvaluated.items(c, a.length, b.items));
    const v = c.name("valid"), $ = c.const("len", (0, e._)`${d}.length`);
    a.forEach((u, g) => {
      (0, t.alwaysValidSchema)(b, u) || (c.if((0, e._)`${$} > ${g}`, () => o.subschema({
        keyword: m,
        schemaProp: g,
        dataProp: g
      }, v)), o.ok(v));
    });
    function w(u) {
      const { opts: g, errSchemaPath: h } = b, _ = a.length, S = _ === u.minItems && (_ === u.maxItems || u[i] === !1);
      if (g.strictTuples && !S) {
        const f = `"${m}" is ${_}-tuple, but minItems or maxItems/${i} are not specified or different at path "${h}"`;
        (0, t.checkStrictMode)(b, f, g.strictTuples);
      }
    }
  }
  return ht.validateTuple = s, ht.default = r, ht;
}
var Es;
function nl() {
  if (Es) return fn;
  Es = 1, Object.defineProperty(fn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ca(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (n) => (0, e.validateTuple)(n, "items")
  };
  return fn.default = t, fn;
}
var pn = {}, xs;
function rl() {
  if (xs) return pn;
  xs = 1, Object.defineProperty(pn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ Le(), r = /* @__PURE__ */ aa(), o = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { schema: a, parentSchema: c, it: l } = i, { prefixItems: d } = c;
      l.items = !0, !(0, t.alwaysValidSchema)(l, a) && (d ? (0, r.validateAdditionalItems)(i, d) : i.ok((0, n.validateArray)(i)));
    }
  };
  return pn.default = o, pn;
}
var hn = {}, As;
function ol() {
  if (As) return hn;
  As = 1, Object.defineProperty(hn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: o } }) => o === void 0 ? (0, e.str)`must contain at least ${s} valid item(s)` : (0, e.str)`must contain at least ${s} and no more than ${o} valid item(s)`,
      params: ({ params: { min: s, max: o } }) => o === void 0 ? (0, e._)`{minContains: ${s}}` : (0, e._)`{minContains: ${s}, maxContains: ${o}}`
    },
    code(s) {
      const { gen: o, schema: i, parentSchema: a, data: c, it: l } = s;
      let d, m;
      const { minContains: b, maxContains: v } = a;
      l.opts.next ? (d = b === void 0 ? 1 : b, m = v) : d = 1;
      const $ = o.const("len", (0, e._)`${c}.length`);
      if (s.setParams({ min: d, max: m }), m === void 0 && d === 0) {
        (0, t.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (m !== void 0 && d > m) {
        (0, t.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(l, i)) {
        let _ = (0, e._)`${$} >= ${d}`;
        m !== void 0 && (_ = (0, e._)`${_} && ${$} <= ${m}`), s.pass(_);
        return;
      }
      l.items = !0;
      const w = o.name("valid");
      m === void 0 && d === 1 ? g(w, () => o.if(w, () => o.break())) : d === 0 ? (o.let(w, !0), m !== void 0 && o.if((0, e._)`${c}.length > 0`, u)) : (o.let(w, !1), u()), s.result(w, () => s.reset());
      function u() {
        const _ = o.name("_valid"), S = o.let("count", 0);
        g(_, () => o.if(_, () => h(S)));
      }
      function g(_, S) {
        o.forRange("i", 0, $, (f) => {
          s.subschema({
            keyword: "contains",
            dataProp: f,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, _), S();
        });
      }
      function h(_) {
        o.code((0, e._)`${_}++`), m === void 0 ? o.if((0, e._)`${_} >= ${d}`, () => o.assign(w, !0).break()) : (o.if((0, e._)`${_} > ${m}`, () => o.assign(w, !1).break()), d === 1 ? o.assign(w, !0) : o.if((0, e._)`${_} >= ${d}`, () => o.assign(w, !0)));
      }
    }
  };
  return hn.default = r, hn;
}
var Cr = {}, Ps;
function oo() {
  return Ps || (Ps = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ de(), r = /* @__PURE__ */ Le();
    e.error = {
      message: ({ params: { property: c, depsCount: l, deps: d } }) => {
        const m = l === 1 ? "property" : "properties";
        return (0, t.str)`must have ${m} ${d} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: l, deps: d, missingProperty: m } }) => (0, t._)`{property: ${c},
    missingProperty: ${m},
    depsCount: ${l},
    deps: ${d}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(c) {
        const [l, d] = o(c);
        i(c, l), a(c, d);
      }
    };
    function o({ schema: c }) {
      const l = {}, d = {};
      for (const m in c) {
        if (m === "__proto__")
          continue;
        const b = Array.isArray(c[m]) ? l : d;
        b[m] = c[m];
      }
      return [l, d];
    }
    function i(c, l = c.schema) {
      const { gen: d, data: m, it: b } = c;
      if (Object.keys(l).length === 0)
        return;
      const v = d.let("missing");
      for (const $ in l) {
        const w = l[$];
        if (w.length === 0)
          continue;
        const u = (0, r.propertyInData)(d, m, $, b.opts.ownProperties);
        c.setParams({
          property: $,
          depsCount: w.length,
          deps: w.join(", ")
        }), b.allErrors ? d.if(u, () => {
          for (const g of w)
            (0, r.checkReportMissingProp)(c, g);
        }) : (d.if((0, t._)`${u} && (${(0, r.checkMissingProp)(c, w, v)})`), (0, r.reportMissingProp)(c, v), d.else());
      }
    }
    e.validatePropertyDeps = i;
    function a(c, l = c.schema) {
      const { gen: d, data: m, keyword: b, it: v } = c, $ = d.name("valid");
      for (const w in l)
        (0, n.alwaysValidSchema)(v, l[w]) || (d.if(
          (0, r.propertyInData)(d, m, w, v.opts.ownProperties),
          () => {
            const u = c.subschema({ keyword: b, schemaProp: w }, $);
            c.mergeValidEvaluated(u, $);
          },
          () => d.var($, !0)
          // TODO var
        ), c.ok($));
    }
    e.validateSchemaDeps = a, e.default = s;
  })(Cr)), Cr;
}
var mn = {}, Rs;
function sl() {
  if (Rs) return mn;
  Rs = 1, Object.defineProperty(mn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, e._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: o, schema: i, data: a, it: c } = s;
      if ((0, t.alwaysValidSchema)(c, i))
        return;
      const l = o.name("valid");
      o.forIn("key", a, (d) => {
        s.setParams({ propertyName: d }), s.subschema({
          keyword: "propertyNames",
          data: d,
          dataTypes: ["string"],
          propertyName: d,
          compositeRule: !0
        }, l), o.if((0, e.not)(l), () => {
          s.error(!0), c.allErrors || o.break();
        });
      }), s.ok(l);
    }
  };
  return mn.default = r, mn;
}
var gn = {}, Ms;
function la() {
  if (Ms) return gn;
  Ms = 1, Object.defineProperty(gn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Le(), t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ De(), r = /* @__PURE__ */ de(), o = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: i }) => (0, t._)`{additionalProperty: ${i.additionalProperty}}`
    },
    code(i) {
      const { gen: a, schema: c, parentSchema: l, data: d, errsCount: m, it: b } = i;
      if (!m)
        throw new Error("ajv implementation error");
      const { allErrors: v, opts: $ } = b;
      if (b.props = !0, $.removeAdditional !== "all" && (0, r.alwaysValidSchema)(b, c))
        return;
      const w = (0, e.allSchemaProperties)(l.properties), u = (0, e.allSchemaProperties)(l.patternProperties);
      g(), i.ok((0, t._)`${m} === ${n.default.errors}`);
      function g() {
        a.forIn("key", d, (p) => {
          !w.length && !u.length ? S(p) : a.if(h(p), () => S(p));
        });
      }
      function h(p) {
        let y;
        if (w.length > 8) {
          const C = (0, r.schemaRefOrVal)(b, l.properties, "properties");
          y = (0, e.isOwnProperty)(a, C, p);
        } else w.length ? y = (0, t.or)(...w.map((C) => (0, t._)`${p} === ${C}`)) : y = t.nil;
        return u.length && (y = (0, t.or)(y, ...u.map((C) => (0, t._)`${(0, e.usePattern)(i, C)}.test(${p})`))), (0, t.not)(y);
      }
      function _(p) {
        a.code((0, t._)`delete ${d}[${p}]`);
      }
      function S(p) {
        if ($.removeAdditional === "all" || $.removeAdditional && c === !1) {
          _(p);
          return;
        }
        if (c === !1) {
          i.setParams({ additionalProperty: p }), i.error(), v || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(b, c)) {
          const y = a.name("valid");
          $.removeAdditional === "failing" ? (f(p, y, !1), a.if((0, t.not)(y), () => {
            i.reset(), _(p);
          })) : (f(p, y), v || a.if((0, t.not)(y), () => a.break()));
        }
      }
      function f(p, y, C) {
        const A = {
          keyword: "additionalProperties",
          dataProp: p,
          dataPropType: r.Type.Str
        };
        C === !1 && Object.assign(A, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), i.subschema(A, y);
      }
    }
  };
  return gn.default = o, gn;
}
var yn = {}, Ns;
function il() {
  if (Ns) return yn;
  Ns = 1, Object.defineProperty(yn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ nr(), t = /* @__PURE__ */ Le(), n = /* @__PURE__ */ de(), r = /* @__PURE__ */ la(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: i, schema: a, parentSchema: c, data: l, it: d } = o;
      d.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new e.KeywordCxt(d, r.default, "additionalProperties"));
      const m = (0, t.allSchemaProperties)(a);
      for (const u of m)
        d.definedProperties.add(u);
      d.opts.unevaluated && m.length && d.props !== !0 && (d.props = n.mergeEvaluated.props(i, (0, n.toHash)(m), d.props));
      const b = m.filter((u) => !(0, n.alwaysValidSchema)(d, a[u]));
      if (b.length === 0)
        return;
      const v = i.name("valid");
      for (const u of b)
        $(u) ? w(u) : (i.if((0, t.propertyInData)(i, l, u, d.opts.ownProperties)), w(u), d.allErrors || i.else().var(v, !0), i.endIf()), o.it.definedProperties.add(u), o.ok(v);
      function $(u) {
        return d.opts.useDefaults && !d.compositeRule && a[u].default !== void 0;
      }
      function w(u) {
        o.subschema({
          keyword: "properties",
          schemaProp: u,
          dataProp: u
        }, v);
      }
    }
  };
  return yn.default = s, yn;
}
var $n = {}, Os;
function al() {
  if (Os) return $n;
  Os = 1, Object.defineProperty($n, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Le(), t = /* @__PURE__ */ ie(), n = /* @__PURE__ */ de(), r = /* @__PURE__ */ de(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: i, schema: a, data: c, parentSchema: l, it: d } = o, { opts: m } = d, b = (0, e.allSchemaProperties)(a), v = b.filter((S) => (0, n.alwaysValidSchema)(d, a[S]));
      if (b.length === 0 || v.length === b.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const $ = m.strictSchema && !m.allowMatchingProperties && l.properties, w = i.name("valid");
      d.props !== !0 && !(d.props instanceof t.Name) && (d.props = (0, r.evaluatedPropsToName)(i, d.props));
      const { props: u } = d;
      g();
      function g() {
        for (const S of b)
          $ && h(S), d.allErrors ? _(S) : (i.var(w, !0), _(S), i.if(w));
      }
      function h(S) {
        for (const f in $)
          new RegExp(S).test(f) && (0, n.checkStrictMode)(d, `property ${f} matches pattern ${S} (use allowMatchingProperties)`);
      }
      function _(S) {
        i.forIn("key", c, (f) => {
          i.if((0, t._)`${(0, e.usePattern)(o, S)}.test(${f})`, () => {
            const p = v.includes(S);
            p || o.subschema({
              keyword: "patternProperties",
              schemaProp: S,
              dataProp: f,
              dataPropType: r.Type.Str
            }, w), d.opts.unevaluated && u !== !0 ? i.assign((0, t._)`${u}[${f}]`, !0) : !p && !d.allErrors && i.if((0, t.not)(w), () => i.break());
          });
        });
      }
    }
  };
  return $n.default = s, $n;
}
var bn = {}, Ts;
function cl() {
  if (Ts) return bn;
  Ts = 1, Object.defineProperty(bn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ de(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(n) {
      const { gen: r, schema: s, it: o } = n;
      if ((0, e.alwaysValidSchema)(o, s)) {
        n.fail();
        return;
      }
      const i = r.name("valid");
      n.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), n.failResult(i, () => n.reset(), () => n.error());
    },
    error: { message: "must NOT be valid" }
  };
  return bn.default = t, bn;
}
var vn = {}, Fs;
function ll() {
  if (Fs) return vn;
  Fs = 1, Object.defineProperty(vn, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: (/* @__PURE__ */ Le()).validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return vn.default = t, vn;
}
var wn = {}, zs;
function dl() {
  if (zs) return wn;
  zs = 1, Object.defineProperty(wn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, e._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: o, schema: i, parentSchema: a, it: c } = s;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && a.discriminator)
        return;
      const l = i, d = o.let("valid", !1), m = o.let("passing", null), b = o.name("_valid");
      s.setParams({ passing: m }), o.block(v), s.result(d, () => s.reset(), () => s.error(!0));
      function v() {
        l.forEach(($, w) => {
          let u;
          (0, t.alwaysValidSchema)(c, $) ? o.var(b, !0) : u = s.subschema({
            keyword: "oneOf",
            schemaProp: w,
            compositeRule: !0
          }, b), w > 0 && o.if((0, e._)`${b} && ${d}`).assign(d, !1).assign(m, (0, e._)`[${m}, ${w}]`).else(), o.if(b, () => {
            o.assign(d, !0), o.assign(m, w), u && s.mergeEvaluated(u, e.Name);
          });
        });
      }
    }
  };
  return wn.default = r, wn;
}
var _n = {}, js;
function ul() {
  if (js) return _n;
  js = 1, Object.defineProperty(_n, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ de(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(n) {
      const { gen: r, schema: s, it: o } = n;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const i = r.name("valid");
      s.forEach((a, c) => {
        if ((0, e.alwaysValidSchema)(o, a))
          return;
        const l = n.subschema({ keyword: "allOf", schemaProp: c }, i);
        n.ok(i), n.mergeEvaluated(l);
      });
    }
  };
  return _n.default = t, _n;
}
var Sn = {}, Is;
function fl() {
  if (Is) return Sn;
  Is = 1, Object.defineProperty(Sn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: o }) => (0, e.str)`must match "${o.ifClause}" schema`,
      params: ({ params: o }) => (0, e._)`{failingKeyword: ${o.ifClause}}`
    },
    code(o) {
      const { gen: i, parentSchema: a, it: c } = o;
      a.then === void 0 && a.else === void 0 && (0, t.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const l = s(c, "then"), d = s(c, "else");
      if (!l && !d)
        return;
      const m = i.let("valid", !0), b = i.name("_valid");
      if (v(), o.reset(), l && d) {
        const w = i.let("ifClause");
        o.setParams({ ifClause: w }), i.if(b, $("then", w), $("else", w));
      } else l ? i.if(b, $("then")) : i.if((0, e.not)(b), $("else"));
      o.pass(m, () => o.error(!0));
      function v() {
        const w = o.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, b);
        o.mergeEvaluated(w);
      }
      function $(w, u) {
        return () => {
          const g = o.subschema({ keyword: w }, b);
          i.assign(m, b), o.mergeValidEvaluated(g, m), u ? i.assign(u, (0, e._)`${w}`) : o.setParams({ ifClause: w });
        };
      }
    }
  };
  function s(o, i) {
    const a = o.schema[i];
    return a !== void 0 && !(0, t.alwaysValidSchema)(o, a);
  }
  return Sn.default = r, Sn;
}
var kn = {}, Ds;
function pl() {
  if (Ds) return kn;
  Ds = 1, Object.defineProperty(kn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ de(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: n, parentSchema: r, it: s }) {
      r.if === void 0 && (0, e.checkStrictMode)(s, `"${n}" without "if" is ignored`);
    }
  };
  return kn.default = t, kn;
}
var Ls;
function hl() {
  if (Ls) return un;
  Ls = 1, Object.defineProperty(un, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ aa(), t = /* @__PURE__ */ nl(), n = /* @__PURE__ */ ca(), r = /* @__PURE__ */ rl(), s = /* @__PURE__ */ ol(), o = /* @__PURE__ */ oo(), i = /* @__PURE__ */ sl(), a = /* @__PURE__ */ la(), c = /* @__PURE__ */ il(), l = /* @__PURE__ */ al(), d = /* @__PURE__ */ cl(), m = /* @__PURE__ */ ll(), b = /* @__PURE__ */ dl(), v = /* @__PURE__ */ ul(), $ = /* @__PURE__ */ fl(), w = /* @__PURE__ */ pl();
  function u(g = !1) {
    const h = [
      // any
      d.default,
      m.default,
      b.default,
      v.default,
      $.default,
      w.default,
      // object
      i.default,
      a.default,
      o.default,
      c.default,
      l.default
    ];
    return g ? h.push(t.default, r.default) : h.push(e.default, n.default), h.push(s.default), h;
  }
  return un.default = u, un;
}
var Cn = {}, mt = {}, Bs;
function da() {
  if (Bs) return mt;
  Bs = 1, Object.defineProperty(mt, "__esModule", { value: !0 }), mt.dynamicAnchor = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ De(), n = /* @__PURE__ */ or(), r = /* @__PURE__ */ no(), s = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (a) => o(a, a.schema)
  };
  function o(a, c) {
    const { gen: l, it: d } = a;
    d.schemaEnv.root.dynamicAnchors[c] = !0;
    const m = (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(c)}`, b = d.errSchemaPath === "#" ? d.validateName : i(a);
    l.if((0, e._)`!${m}`, () => l.assign(m, b));
  }
  mt.dynamicAnchor = o;
  function i(a) {
    const { schemaEnv: c, schema: l, self: d } = a.it, { root: m, baseId: b, localRefs: v, meta: $ } = c.root, { schemaId: w } = d.opts, u = new n.SchemaEnv({ schema: l, schemaId: w, root: m, baseId: b, localRefs: v, meta: $ });
    return n.compileSchema.call(d, u), (0, r.getValidate)(a, u);
  }
  return mt.default = s, mt;
}
var gt = {}, qs;
function ua() {
  if (qs) return gt;
  qs = 1, Object.defineProperty(gt, "__esModule", { value: !0 }), gt.dynamicRef = void 0;
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ De(), n = /* @__PURE__ */ no(), r = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (o) => s(o, o.schema)
  };
  function s(o, i) {
    const { gen: a, keyword: c, it: l } = o;
    if (i[0] !== "#")
      throw new Error(`"${c}" only supports hash fragment reference`);
    const d = i.slice(1);
    if (l.allErrors)
      m();
    else {
      const v = a.let("valid", !1);
      m(v), o.ok(v);
    }
    function m(v) {
      if (l.schemaEnv.root.dynamicAnchors[d]) {
        const $ = a.let("_v", (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(d)}`);
        a.if($, b($, v), b(l.validateName, v));
      } else
        b(l.validateName, v)();
    }
    function b(v, $) {
      return $ ? () => a.block(() => {
        (0, n.callRef)(o, v), a.let($, !0);
      }) : () => (0, n.callRef)(o, v);
    }
  }
  return gt.dynamicRef = s, gt.default = r, gt;
}
var En = {}, Vs;
function ml() {
  if (Vs) return En;
  Vs = 1, Object.defineProperty(En, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ da(), t = /* @__PURE__ */ de(), n = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(r) {
      r.schema ? (0, e.dynamicAnchor)(r, "") : (0, t.checkStrictMode)(r.it, "$recursiveAnchor: false is ignored");
    }
  };
  return En.default = n, En;
}
var xn = {}, Us;
function gl() {
  if (Us) return xn;
  Us = 1, Object.defineProperty(xn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ua(), t = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (n) => (0, e.dynamicRef)(n, n.schema)
  };
  return xn.default = t, xn;
}
var Hs;
function yl() {
  if (Hs) return Cn;
  Hs = 1, Object.defineProperty(Cn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ da(), t = /* @__PURE__ */ ua(), n = /* @__PURE__ */ ml(), r = /* @__PURE__ */ gl(), s = [e.default, t.default, n.default, r.default];
  return Cn.default = s, Cn;
}
var An = {}, Pn = {}, Ks;
function $l() {
  if (Ks) return Pn;
  Ks = 1, Object.defineProperty(Pn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ oo(), t = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: e.error,
    code: (n) => (0, e.validatePropertyDeps)(n)
  };
  return Pn.default = t, Pn;
}
var Rn = {}, Gs;
function bl() {
  if (Gs) return Rn;
  Gs = 1, Object.defineProperty(Rn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ oo(), t = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (n) => (0, e.validateSchemaDeps)(n)
  };
  return Rn.default = t, Rn;
}
var Mn = {}, Ws;
function vl() {
  if (Ws) return Mn;
  Ws = 1, Object.defineProperty(Mn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ de(), t = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword: n, parentSchema: r, it: s }) {
      r.contains === void 0 && (0, e.checkStrictMode)(s, `"${n}" without "contains" is ignored`);
    }
  };
  return Mn.default = t, Mn;
}
var Js;
function wl() {
  if (Js) return An;
  Js = 1, Object.defineProperty(An, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ $l(), t = /* @__PURE__ */ bl(), n = /* @__PURE__ */ vl(), r = [e.default, t.default, n.default];
  return An.default = r, An;
}
var Nn = {}, On = {}, Ys;
function _l() {
  if (Ys) return On;
  Ys = 1, Object.defineProperty(On, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), n = /* @__PURE__ */ De(), s = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: !0,
    error: {
      message: "must NOT have unevaluated properties",
      params: ({ params: o }) => (0, e._)`{unevaluatedProperty: ${o.unevaluatedProperty}}`
    },
    code(o) {
      const { gen: i, schema: a, data: c, errsCount: l, it: d } = o;
      if (!l)
        throw new Error("ajv implementation error");
      const { allErrors: m, props: b } = d;
      b instanceof e.Name ? i.if((0, e._)`${b} !== true`, () => i.forIn("key", c, (u) => i.if($(b, u), () => v(u)))) : b !== !0 && i.forIn("key", c, (u) => b === void 0 ? v(u) : i.if(w(b, u), () => v(u))), d.props = !0, o.ok((0, e._)`${l} === ${n.default.errors}`);
      function v(u) {
        if (a === !1) {
          o.setParams({ unevaluatedProperty: u }), o.error(), m || i.break();
          return;
        }
        if (!(0, t.alwaysValidSchema)(d, a)) {
          const g = i.name("valid");
          o.subschema({
            keyword: "unevaluatedProperties",
            dataProp: u,
            dataPropType: t.Type.Str
          }, g), m || i.if((0, e.not)(g), () => i.break());
        }
      }
      function $(u, g) {
        return (0, e._)`!${u} || !${u}[${g}]`;
      }
      function w(u, g) {
        const h = [];
        for (const _ in u)
          u[_] === !0 && h.push((0, e._)`${g} !== ${_}`);
        return (0, e.and)(...h);
      }
    }
  };
  return On.default = s, On;
}
var Tn = {}, Xs;
function Sl() {
  if (Xs) return Tn;
  Xs = 1, Object.defineProperty(Tn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ de(), r = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error: {
      message: ({ params: { len: s } }) => (0, e.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, e._)`{limit: ${s}}`
    },
    code(s) {
      const { gen: o, schema: i, data: a, it: c } = s, l = c.items || 0;
      if (l === !0)
        return;
      const d = o.const("len", (0, e._)`${a}.length`);
      if (i === !1)
        s.setParams({ len: l }), s.fail((0, e._)`${d} > ${l}`);
      else if (typeof i == "object" && !(0, t.alwaysValidSchema)(c, i)) {
        const b = o.var("valid", (0, e._)`${d} <= ${l}`);
        o.if((0, e.not)(b), () => m(b, l)), s.ok(b);
      }
      c.items = !0;
      function m(b, v) {
        o.forRange("i", v, d, ($) => {
          s.subschema({ keyword: "unevaluatedItems", dataProp: $, dataPropType: t.Type.Num }, b), c.allErrors || o.if((0, e.not)(b), () => o.break());
        });
      }
    }
  };
  return Tn.default = r, Tn;
}
var Zs;
function kl() {
  if (Zs) return Nn;
  Zs = 1, Object.defineProperty(Nn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _l(), t = /* @__PURE__ */ Sl(), n = [e.default, t.default];
  return Nn.default = n, Nn;
}
var Fn = {}, zn = {}, Qs;
function Cl() {
  if (Qs) return zn;
  Qs = 1, Object.defineProperty(zn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), n = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, e.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, e._)`{format: ${r}}`
    },
    code(r, s) {
      const { gen: o, data: i, $data: a, schema: c, schemaCode: l, it: d } = r, { opts: m, errSchemaPath: b, schemaEnv: v, self: $ } = d;
      if (!m.validateFormats)
        return;
      a ? w() : u();
      function w() {
        const g = o.scopeValue("formats", {
          ref: $.formats,
          code: m.code.formats
        }), h = o.const("fDef", (0, e._)`${g}[${l}]`), _ = o.let("fType"), S = o.let("format");
        o.if((0, e._)`typeof ${h} == "object" && !(${h} instanceof RegExp)`, () => o.assign(_, (0, e._)`${h}.type || "string"`).assign(S, (0, e._)`${h}.validate`), () => o.assign(_, (0, e._)`"string"`).assign(S, h)), r.fail$data((0, e.or)(f(), p()));
        function f() {
          return m.strictSchema === !1 ? e.nil : (0, e._)`${l} && !${S}`;
        }
        function p() {
          const y = v.$async ? (0, e._)`(${h}.async ? await ${S}(${i}) : ${S}(${i}))` : (0, e._)`${S}(${i})`, C = (0, e._)`(typeof ${S} == "function" ? ${y} : ${S}.test(${i}))`;
          return (0, e._)`${S} && ${S} !== true && ${_} === ${s} && !${C}`;
        }
      }
      function u() {
        const g = $.formats[c];
        if (!g) {
          f();
          return;
        }
        if (g === !0)
          return;
        const [h, _, S] = p(g);
        h === s && r.pass(y());
        function f() {
          if (m.strictSchema === !1) {
            $.logger.warn(C());
            return;
          }
          throw new Error(C());
          function C() {
            return `unknown format "${c}" ignored in schema at path "${b}"`;
          }
        }
        function p(C) {
          const A = C instanceof RegExp ? (0, e.regexpCode)(C) : m.code.formats ? (0, e._)`${m.code.formats}${(0, e.getProperty)(c)}` : void 0, P = o.scopeValue("formats", { key: c, ref: C, code: A });
          return typeof C == "object" && !(C instanceof RegExp) ? [C.type || "string", C.validate, (0, e._)`${P}.validate`] : ["string", C, P];
        }
        function y() {
          if (typeof g == "object" && !(g instanceof RegExp) && g.async) {
            if (!v.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${S}(${i})`;
          }
          return typeof _ == "function" ? (0, e._)`${S}(${i})` : (0, e._)`${S}.test(${i})`;
        }
      }
    }
  };
  return zn.default = n, zn;
}
var ei;
function El() {
  if (ei) return Fn;
  ei = 1, Object.defineProperty(Fn, "__esModule", { value: !0 });
  const t = [(/* @__PURE__ */ Cl()).default];
  return Fn.default = t, Fn;
}
var st = {}, ti;
function xl() {
  return ti || (ti = 1, Object.defineProperty(st, "__esModule", { value: !0 }), st.contentVocabulary = st.metadataVocabulary = void 0, st.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], st.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), st;
}
var ni;
function Al() {
  if (ni) return Wt;
  ni = 1, Object.defineProperty(Wt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Vc(), t = /* @__PURE__ */ tl(), n = /* @__PURE__ */ hl(), r = /* @__PURE__ */ yl(), s = /* @__PURE__ */ wl(), o = /* @__PURE__ */ kl(), i = /* @__PURE__ */ El(), a = /* @__PURE__ */ xl(), c = [
    r.default,
    e.default,
    t.default,
    (0, n.default)(!0),
    i.default,
    a.metadataVocabulary,
    a.contentVocabulary,
    s.default,
    o.default
  ];
  return Wt.default = c, Wt;
}
var jn = {}, Mt = {}, ri;
function Pl() {
  if (ri) return Mt;
  ri = 1, Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (Mt.DiscrError = e = {})), Mt;
}
var oi;
function Rl() {
  if (oi) return jn;
  oi = 1, Object.defineProperty(jn, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ie(), t = /* @__PURE__ */ Pl(), n = /* @__PURE__ */ or(), r = /* @__PURE__ */ rr(), s = /* @__PURE__ */ de(), i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === t.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: l } }) => (0, e._)`{error: ${a}, tag: ${l}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: l, schema: d, parentSchema: m, it: b } = a, { oneOf: v } = m;
      if (!b.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const $ = d.propertyName;
      if (typeof $ != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!v)
        throw new Error("discriminator: requires oneOf keyword");
      const w = c.let("valid", !1), u = c.const("tag", (0, e._)`${l}${(0, e.getProperty)($)}`);
      c.if((0, e._)`typeof ${u} == "string"`, () => g(), () => a.error(!1, { discrError: t.DiscrError.Tag, tag: u, tagName: $ })), a.ok(w);
      function g() {
        const S = _();
        c.if(!1);
        for (const f in S)
          c.elseIf((0, e._)`${u} === ${f}`), c.assign(w, h(S[f]));
        c.else(), a.error(!1, { discrError: t.DiscrError.Mapping, tag: u, tagName: $ }), c.endIf();
      }
      function h(S) {
        const f = c.name("valid"), p = a.subschema({ keyword: "oneOf", schemaProp: S }, f);
        return a.mergeEvaluated(p, e.Name), f;
      }
      function _() {
        var S;
        const f = {}, p = C(m);
        let y = !0;
        for (let T = 0; T < v.length; T++) {
          let R = v[T];
          if (R?.$ref && !(0, s.schemaHasRulesButRef)(R, b.self.RULES)) {
            const I = R.$ref;
            if (R = n.resolveRef.call(b.self, b.schemaEnv.root, b.baseId, I), R instanceof n.SchemaEnv && (R = R.schema), R === void 0)
              throw new r.default(b.opts.uriResolver, b.baseId, I);
          }
          const L = (S = R?.properties) === null || S === void 0 ? void 0 : S[$];
          if (typeof L != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${$}"`);
          y = y && (p || C(R)), A(L, T);
        }
        if (!y)
          throw new Error(`discriminator: "${$}" must be required`);
        return f;
        function C({ required: T }) {
          return Array.isArray(T) && T.includes($);
        }
        function A(T, R) {
          if (T.const)
            P(T.const, R);
          else if (T.enum)
            for (const L of T.enum)
              P(L, R);
          else
            throw new Error(`discriminator: "properties/${$}" must have "const" or "enum"`);
        }
        function P(T, R) {
          if (typeof T != "string" || T in f)
            throw new Error(`discriminator: "${$}" values must be unique strings`);
          f[T] = R;
        }
      }
    }
  };
  return jn.default = i, jn;
}
var In = {};
const Ml = "https://json-schema.org/draft/2020-12/schema", Nl = "https://json-schema.org/draft/2020-12/schema", Ol = { "https://json-schema.org/draft/2020-12/vocab/core": !0, "https://json-schema.org/draft/2020-12/vocab/applicator": !0, "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0, "https://json-schema.org/draft/2020-12/vocab/validation": !0, "https://json-schema.org/draft/2020-12/vocab/meta-data": !0, "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0, "https://json-schema.org/draft/2020-12/vocab/content": !0 }, Tl = "meta", Fl = "Core and Validation specifications meta-schema", zl = [{ $ref: "meta/core" }, { $ref: "meta/applicator" }, { $ref: "meta/unevaluated" }, { $ref: "meta/validation" }, { $ref: "meta/meta-data" }, { $ref: "meta/format-annotation" }, { $ref: "meta/content" }], jl = ["object", "boolean"], Il = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Dl = { definitions: { $comment: '"definitions" has been replaced by "$defs".', type: "object", additionalProperties: { $dynamicRef: "#meta" }, deprecated: !0, default: {} }, dependencies: { $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.', type: "object", additionalProperties: { anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }] }, deprecated: !0, default: {} }, $recursiveAnchor: { $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".', $ref: "meta/core#/$defs/anchorString", deprecated: !0 }, $recursiveRef: { $comment: '"$recursiveRef" has been replaced by "$dynamicRef".', $ref: "meta/core#/$defs/uriReferenceString", deprecated: !0 } }, Ll = {
  $schema: Ml,
  $id: Nl,
  $vocabulary: Ol,
  $dynamicAnchor: Tl,
  title: Fl,
  allOf: zl,
  type: jl,
  $comment: Il,
  properties: Dl
}, Bl = "https://json-schema.org/draft/2020-12/schema", ql = "https://json-schema.org/draft/2020-12/meta/applicator", Vl = { "https://json-schema.org/draft/2020-12/vocab/applicator": !0 }, Ul = "meta", Hl = "Applicator vocabulary meta-schema", Kl = ["object", "boolean"], Gl = { prefixItems: { $ref: "#/$defs/schemaArray" }, items: { $dynamicRef: "#meta" }, contains: { $dynamicRef: "#meta" }, additionalProperties: { $dynamicRef: "#meta" }, properties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, propertyNames: { format: "regex" }, default: {} }, dependentSchemas: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, propertyNames: { $dynamicRef: "#meta" }, if: { $dynamicRef: "#meta" }, then: { $dynamicRef: "#meta" }, else: { $dynamicRef: "#meta" }, allOf: { $ref: "#/$defs/schemaArray" }, anyOf: { $ref: "#/$defs/schemaArray" }, oneOf: { $ref: "#/$defs/schemaArray" }, not: { $dynamicRef: "#meta" } }, Wl = { schemaArray: { type: "array", minItems: 1, items: { $dynamicRef: "#meta" } } }, Jl = {
  $schema: Bl,
  $id: ql,
  $vocabulary: Vl,
  $dynamicAnchor: Ul,
  title: Hl,
  type: Kl,
  properties: Gl,
  $defs: Wl
}, Yl = "https://json-schema.org/draft/2020-12/schema", Xl = "https://json-schema.org/draft/2020-12/meta/unevaluated", Zl = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0 }, Ql = "meta", ed = "Unevaluated applicator vocabulary meta-schema", td = ["object", "boolean"], nd = { unevaluatedItems: { $dynamicRef: "#meta" }, unevaluatedProperties: { $dynamicRef: "#meta" } }, rd = {
  $schema: Yl,
  $id: Xl,
  $vocabulary: Zl,
  $dynamicAnchor: Ql,
  title: ed,
  type: td,
  properties: nd
}, od = "https://json-schema.org/draft/2020-12/schema", sd = "https://json-schema.org/draft/2020-12/meta/content", id = { "https://json-schema.org/draft/2020-12/vocab/content": !0 }, ad = "meta", cd = "Content vocabulary meta-schema", ld = ["object", "boolean"], dd = { contentEncoding: { type: "string" }, contentMediaType: { type: "string" }, contentSchema: { $dynamicRef: "#meta" } }, ud = {
  $schema: od,
  $id: sd,
  $vocabulary: id,
  $dynamicAnchor: ad,
  title: cd,
  type: ld,
  properties: dd
}, fd = "https://json-schema.org/draft/2020-12/schema", pd = "https://json-schema.org/draft/2020-12/meta/core", hd = { "https://json-schema.org/draft/2020-12/vocab/core": !0 }, md = "meta", gd = "Core vocabulary meta-schema", yd = ["object", "boolean"], $d = { $id: { $ref: "#/$defs/uriReferenceString", $comment: "Non-empty fragments not allowed.", pattern: "^[^#]*#?$" }, $schema: { $ref: "#/$defs/uriString" }, $ref: { $ref: "#/$defs/uriReferenceString" }, $anchor: { $ref: "#/$defs/anchorString" }, $dynamicRef: { $ref: "#/$defs/uriReferenceString" }, $dynamicAnchor: { $ref: "#/$defs/anchorString" }, $vocabulary: { type: "object", propertyNames: { $ref: "#/$defs/uriString" }, additionalProperties: { type: "boolean" } }, $comment: { type: "string" }, $defs: { type: "object", additionalProperties: { $dynamicRef: "#meta" } } }, bd = { anchorString: { type: "string", pattern: "^[A-Za-z_][-A-Za-z0-9._]*$" }, uriString: { type: "string", format: "uri" }, uriReferenceString: { type: "string", format: "uri-reference" } }, vd = {
  $schema: fd,
  $id: pd,
  $vocabulary: hd,
  $dynamicAnchor: md,
  title: gd,
  type: yd,
  properties: $d,
  $defs: bd
}, wd = "https://json-schema.org/draft/2020-12/schema", _d = "https://json-schema.org/draft/2020-12/meta/format-annotation", Sd = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0 }, kd = "meta", Cd = "Format vocabulary meta-schema for annotation results", Ed = ["object", "boolean"], xd = { format: { type: "string" } }, Ad = {
  $schema: wd,
  $id: _d,
  $vocabulary: Sd,
  $dynamicAnchor: kd,
  title: Cd,
  type: Ed,
  properties: xd
}, Pd = "https://json-schema.org/draft/2020-12/schema", Rd = "https://json-schema.org/draft/2020-12/meta/meta-data", Md = { "https://json-schema.org/draft/2020-12/vocab/meta-data": !0 }, Nd = "meta", Od = "Meta-data vocabulary meta-schema", Td = ["object", "boolean"], Fd = { title: { type: "string" }, description: { type: "string" }, default: !0, deprecated: { type: "boolean", default: !1 }, readOnly: { type: "boolean", default: !1 }, writeOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 } }, zd = {
  $schema: Pd,
  $id: Rd,
  $vocabulary: Md,
  $dynamicAnchor: Nd,
  title: Od,
  type: Td,
  properties: Fd
}, jd = "https://json-schema.org/draft/2020-12/schema", Id = "https://json-schema.org/draft/2020-12/meta/validation", Dd = { "https://json-schema.org/draft/2020-12/vocab/validation": !0 }, Ld = "meta", Bd = "Validation vocabulary meta-schema", qd = ["object", "boolean"], Vd = { type: { anyOf: [{ $ref: "#/$defs/simpleTypes" }, { type: "array", items: { $ref: "#/$defs/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, const: !0, enum: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/$defs/nonNegativeInteger" }, minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, maxItems: { $ref: "#/$defs/nonNegativeInteger" }, minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, maxContains: { $ref: "#/$defs/nonNegativeInteger" }, minContains: { $ref: "#/$defs/nonNegativeInteger", default: 1 }, maxProperties: { $ref: "#/$defs/nonNegativeInteger" }, minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, required: { $ref: "#/$defs/stringArray" }, dependentRequired: { type: "object", additionalProperties: { $ref: "#/$defs/stringArray" } } }, Ud = { nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { $ref: "#/$defs/nonNegativeInteger", default: 0 }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Hd = {
  $schema: jd,
  $id: Id,
  $vocabulary: Dd,
  $dynamicAnchor: Ld,
  title: Bd,
  type: qd,
  properties: Vd,
  $defs: Ud
};
var si;
function Kd() {
  if (si) return In;
  si = 1, Object.defineProperty(In, "__esModule", { value: !0 });
  const e = Ll, t = Jl, n = rd, r = ud, s = vd, o = Ad, i = zd, a = Hd, c = ["/properties"];
  function l(d) {
    return [
      e,
      t,
      n,
      r,
      s,
      m(this, o),
      i,
      m(this, a)
    ].forEach((b) => this.addMetaSchema(b, void 0, !1)), this;
    function m(b, v) {
      return d ? b.$dataMetaSchema(v, c) : v;
    }
  }
  return In.default = l, In;
}
var ii;
function Gd() {
  return ii || (ii = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
    const n = /* @__PURE__ */ Bc(), r = /* @__PURE__ */ Al(), s = /* @__PURE__ */ Rl(), o = /* @__PURE__ */ Kd(), i = "https://json-schema.org/draft/2020-12/schema";
    class a extends n.default {
      constructor(v = {}) {
        super({
          ...v,
          dynamicRef: !0,
          next: !0,
          unevaluated: !0
        });
      }
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data: v, meta: $ } = this.opts;
        $ && (o.default.call(this, v), this.refs["http://json-schema.org/schema"] = i);
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
      }
    }
    t.Ajv2020 = a, e.exports = t = a, e.exports.Ajv2020 = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
    var c = /* @__PURE__ */ nr();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return c.KeywordCxt;
    } });
    var l = /* @__PURE__ */ ie();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return l._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return l.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return l.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return l.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return l.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return l.CodeGen;
    } });
    var d = /* @__PURE__ */ to();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return d.default;
    } });
    var m = /* @__PURE__ */ rr();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return m.default;
    } });
  })(Vt, Vt.exports)), Vt.exports;
}
var Wd = /* @__PURE__ */ Gd();
const Jd = /* @__PURE__ */ Cc(Wd), Yd = "https://json-schema.org/draft/2020-12/schema", Xd = "https://raw.githubusercontent.com/omsf/alchemy-viz/main/schema/alchemy-viz.schema.json", Zd = "alchemy-viz payload", Qd = "Python-to-TypeScript contract bridge for gufe visualizations. Source of truth both languages are downstream of it. This schema is not strictly versioned or published as it is only internally consumed by this codebase. Schema description: one schema object per gufe class: every $def named *Viz is the visualization form of exactly one GufeTokenizable, it carries that object's `gufe-key`. Every reference from one gufe object to another is that object's gufe key, and the objects themselves live in the `registry` on the root payload. So a ligand network's nodes are keys, a chemical system's components and a transformation's protocol are keys and each one resolves to a complete, drawable object. An alchemical network whose forty systems share one protein carries that PDB once and points at it forty times, and the browser can still drill into it, because what it points at is a whole ProteinComponentViz. This is a single-shot dump rather than a conversation with a server, so the registry travels with the payload.", eu = [{ $ref: "#/$defs/SmallMoleculeComponentViz" }, { $ref: "#/$defs/ProteinComponentViz" }, { $ref: "#/$defs/SolvatedPDBComponentViz" }, { $ref: "#/$defs/ProteinMembraneComponentViz" }, { $ref: "#/$defs/SolventComponentViz" }, { $ref: "#/$defs/UnknownComponentViz" }, { $ref: "#/$defs/ProtocolViz" }, { $ref: "#/$defs/LigandAtomMappingViz" }, { $ref: "#/$defs/LigandNetworkViz" }, { $ref: "#/$defs/ChemicalSystemViz" }, { $ref: "#/$defs/TransformationViz" }, { $ref: "#/$defs/AlchemicalNetworkViz" }], tu = /* @__PURE__ */ JSON.parse('{"GufeKey":{"title":"GufeKey","description":"A gufe key: the identity of a GufeTokenizable, of the form \'ClassName-<hex digest>\'. It is deterministic and repeatable within a software environment. Only its non-emptiness is checked","type":"string","minLength":1},"ComponentKey":{"title":"ComponentKey","description":"A gufe key naming a ComponentViz in the registry. Identical to GufeKey at validation time: JSON Schema has no way to say \'this string is the gufe-key of an entry in that array, and that entry has this type\', because that is a join across two parts of the document. What the name buys is that the referent\'s type is stated in the contract and carried into the generated TypeScript, instead of living only in a test and a view.","$ref":"#/$defs/GufeKey"},"SmallMoleculeComponentKey":{"title":"SmallMoleculeComponentKey","description":"A gufe key naming a SmallMoleculeComponentViz in the registry. Resolving it yields the whole molecule, SDF included. See ComponentKey for what the schema can and cannot check about that.","$ref":"#/$defs/GufeKey"},"ChemicalSystemKey":{"title":"ChemicalSystemKey","description":"A gufe key naming a ChemicalSystemViz in the registry. See ComponentKey for what the schema can and cannot check about that.","$ref":"#/$defs/GufeKey"},"ProtocolKey":{"title":"ProtocolKey","description":"A gufe key naming a ProtocolViz in the registry. Every transformation of a network usually names the same one. See ComponentKey for what the schema can and cannot check about that.","$ref":"#/$defs/GufeKey"},"Registry":{"title":"Registry","description":"The pool of gufe objects this payload refers to by key, each a complete payload object in its own right. Entries are unique by `gufe-key` and sorted by (type, gufe-key) so a committed fixture is byte-stable. JSON Schema cannot express \'unique by a property\' or \'every reference resolves\', so both are covered by tests on the Python side and degraded over by the views.","type":"array","items":{"oneOf":[{"$ref":"#/$defs/ComponentViz"},{"$ref":"#/$defs/ProtocolViz"},{"$ref":"#/$defs/ChemicalSystemViz"}]}},"ComponentViz":{"title":"ComponentViz","description":"Any single chemical-system component","oneOf":[{"$ref":"#/$defs/SmallMoleculeComponentViz"},{"$ref":"#/$defs/ProteinComponentViz"},{"$ref":"#/$defs/SolvatedPDBComponentViz"},{"$ref":"#/$defs/ProteinMembraneComponentViz"},{"$ref":"#/$defs/SolventComponentViz"},{"$ref":"#/$defs/UnknownComponentViz"}]},"SmallMoleculeComponentViz":{"title":"SmallMoleculeComponentViz","description":"A small molecule, carried as a complete SDF record.","type":"object","properties":{"type":{"const":"SmallMoleculeComponentViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"sdf":{"type":"string","minLength":1,"description":"Complete inline SDF record, including the conformer."},"smiles":{"type":"string"},"total_charge":{"type":"integer","description":"Net formal charge. Displayed, never recomputed from the SDF."}},"required":["type","gufe-key","name","sdf","smiles","total_charge"],"additionalProperties":false},"ProteinComponentViz":{"title":"ProteinComponentViz","description":"A protein, carried as a complete PDB record.","type":"object","properties":{"type":{"const":"ProteinComponentViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"pdb":{"type":"string","minLength":1,"description":"Complete inline PDB representation."}},"required":["type","gufe-key","name","pdb"],"additionalProperties":false},"SolvatedPDBComponentViz":{"title":"SolvatedPDBComponentViz","description":"A protein with explicit solvent. A distinct type rather than a flag on ProteinComponentViz, because the discriminator is what a view dispatches on and the presence of waters changes what a sensible default representation is.","type":"object","properties":{"type":{"const":"SolvatedPDBComponentViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"pdb":{"type":"string","minLength":1,"description":"Complete inline PDB representation, including explicit solvent."}},"required":["type","gufe-key","name","pdb"],"additionalProperties":false},"ProteinMembraneComponentViz":{"title":"ProteinMembraneComponentViz","description":"A protein embedded in a membrane.","type":"object","properties":{"type":{"const":"ProteinMembraneComponentViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"pdb":{"type":"string","minLength":1,"description":"Complete inline PDB representation of the protein and membrane system."}},"required":["type","gufe-key","name","pdb"],"additionalProperties":false},"SolventComponentViz":{"title":"SolventComponentViz","description":"Bulk solvent settings. There is no structure to draw, so these are flat fields suitable for rendering as a settings card.","type":"object","properties":{"type":{"const":"SolventComponentViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"smiles":{"type":"string","minLength":1},"positive_ion":{"type":"string"},"negative_ion":{"type":"string"},"neutralize":{"type":"boolean"},"ion_concentration":{"type":"string","description":"Display-form concentration with units, for example \'0.15 molar\'. A string rather than a number because the unit is part of the value and the view only ever prints it."}},"required":["type","gufe-key","name","smiles","positive_ion","negative_ion","neutralize","ion_concentration"],"additionalProperties":false},"UnknownComponentViz":{"title":"UnknownComponentViz","description":"The graceful fallback for a component type this build does not recognize. gufe supports custom Component subclasses, so meeting one is an expected outcome rather than an error, and the browser answers it with \'sorry, there is no visualization for this\'. This covers an unrecognized type only: a recognized component whose serializer fails is a bug, and raises in Python rather than arriving here wearing a disguise.","type":"object","properties":{"type":{"const":"UnknownComponentViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"gufe_type":{"type":"string","minLength":1,"description":"The gufe class name, so the panel can say which type it could not draw."}},"required":["type","gufe-key","name","gufe_type"],"additionalProperties":false},"ProtocolViz":{"title":"ProtocolViz","description":"A gufe Protocol, named. Every transformation in an alchemical network usually shares one, so this is a registry entry that many edges point at rather than a class name repeated per edge. Settings are deliberately absent for now: they are large, deeply nested, and nothing draws them yet, adding a `settings` field later is additive and breaks nothing.","type":"object","properties":{"type":{"const":"ProtocolViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"gufe_type":{"type":"string","minLength":1,"description":"The Protocol\'s class name, which is what identifies it to a reader, a Protocol has no name of its own, so `name` is usually empty."}},"required":["type","gufe-key","name","gufe_type"],"additionalProperties":false},"ChemicalSystemViz":{"title":"ChemicalSystemViz","description":"A gufe ChemicalSystem: labels mapped to the gufe keys of its components.","type":"object","properties":{"type":{"const":"ChemicalSystemViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"components":{"type":"object","description":"ChemicalSystem labels mapped to the gufe keys of the components in the registry.","additionalProperties":{"$ref":"#/$defs/ComponentKey"}},"registry":{"$ref":"#/$defs/Registry"}},"required":["type","gufe-key","name","components"],"additionalProperties":false},"AtomMapping":{"title":"AtomMapping","description":"Atom index correspondence from molecule A to molecule B, as a list of index pairs. A list rather than an object keyed by A\'s index, because JSON object keys can only be strings: keying by index would put decimal strings such as \'12\' in the payload and leave both languages casting them back to integers, and it is Python\'s dict-of-int shape only by resemblance. As a list, both indices stay integers, and \'an entry has a B index for every A index\' becomes a `required` the schema states rather than a convention a reader has to trust. Pairs are ordered by `index_A` so a committed fixture is byte-stable.","type":"array","items":{"type":"object","properties":{"index_A":{"type":"integer","minimum":0,"description":"An atom index in molecule A."},"index_B":{"type":"integer","minimum":0,"description":"The atom index in molecule B that it maps to."}},"required":["index_A","index_B"],"additionalProperties":false}},"Annotations":{"title":"Annotations","description":"Free-form mapping metadata. gufe puts nothing here by design and every mapper picks its own keys, so this is deliberately open. Values are whatever survived being made JSON-safe. Displayed but never interpreted, with the single exception of \'score\'.","type":"object"},"LigandAtomMappingViz":{"title":"LigandAtomMappingViz","description":"One atom mapping between two small molecules. This is also what an edge of a ligand network is because the two endpoints are gufe keys either way: standalone they resolve in this object\'s own registry, and in a network they resolve in the network\'s, where they are the same entries the nodes name. `componentA` and `componentB` are the molecules the two sides of `componentA_to_componentB` index into: an `index_A` is an atom of the SmallMoleculeComponentViz that `componentA` names, and an `index_B` an atom of `componentB`\'s.","type":"object","properties":{"type":{"const":"LigandAtomMappingViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"componentA":{"$ref":"#/$defs/SmallMoleculeComponentKey"},"componentB":{"$ref":"#/$defs/SmallMoleculeComponentKey"},"componentA_to_componentB":{"$ref":"#/$defs/AtomMapping"},"score":{"type":["number","null"],"description":"The \'score\' annotation when it is a plain number, otherwise null. This is the one annotation key that is interpreted rather than displayed: it drives the edge colouring and the force layout\'s link distance."},"annotations":{"$ref":"#/$defs/Annotations"},"registry":{"$ref":"#/$defs/Registry"}},"required":["type","gufe-key","name","componentA","componentB","componentA_to_componentB","score","annotations"],"additionalProperties":false},"LigandNetworkViz":{"title":"LigandNetworkViz","description":"A ligand network: the ligands in the registry, the nodes as keys into it, and the mappings as edges. Deliberately not gufe\'s GraphML: that format embeds a gufe to_json moldict per node, so forwarding it would relocate the decoding problem into the browser rather than avoid it.","type":"object","properties":{"type":{"const":"LigandNetworkViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"registry":{"$ref":"#/$defs/Registry"},"nodes":{"type":"array","description":"The gufe key of each ligand, resolved in `registry`.","items":{"$ref":"#/$defs/SmallMoleculeComponentKey"}},"edges":{"type":"array","description":"The mappings, whose `componentA` and `componentB` name nodes of this network. JSON Schema cannot express that referential constraint, so a Python test covers it, and the view drops a dangling edge with a banner rather than failing.","items":{"$ref":"#/$defs/LigandAtomMappingViz"}}},"required":["type","gufe-key","name","registry","nodes","edges"],"additionalProperties":false},"TransformationViz":{"title":"TransformationViz","description":"A transformation between two chemical systems, both named by gufe key, as is its protocol: `stateA` is the system it starts from, `stateB` the one it ends at, and every edge of a network usually names the same protocol. This is also what an edge of an alchemical network is (there is no separate edge type) because `stateA` and `stateB` are keys either way, and in a network they are the keys the nodes name. NonTransformation uses this type too: it exposes the same stateA and stateB properties, both its single system, so it renders as a diff with no differences.","type":"object","properties":{"type":{"const":"TransformationViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"protocol":{"$ref":"#/$defs/ProtocolKey"},"stateA":{"$ref":"#/$defs/ChemicalSystemKey"},"stateB":{"$ref":"#/$defs/ChemicalSystemKey"},"mappings":{"type":"array","items":{"$ref":"#/$defs/LigandAtomMappingViz"}},"registry":{"$ref":"#/$defs/Registry"}},"required":["type","gufe-key","name","protocol","stateA","stateB","mappings"],"additionalProperties":false},"AlchemicalNetworkViz":{"title":"AlchemicalNetworkViz","description":"A graph of chemical systems joined by transformations. What repeats here is not the nodes and edges themselves but what they are made of: in practice every system shares one protein and every transformation shares one protocol. Both live in the registry, once, as whole objects so this view can show composition and topology while still letting a reader open a node and see the protein.","type":"object","properties":{"type":{"const":"AlchemicalNetworkViz"},"gufe-key":{"$ref":"#/$defs/GufeKey"},"name":{"type":"string"},"registry":{"$ref":"#/$defs/Registry"},"nodes":{"type":"array","description":"The gufe key of each ChemicalSystem, resolved in `registry`.","items":{"$ref":"#/$defs/ChemicalSystemKey"}},"edges":{"type":"array","description":"The transformations, whose `stateA` and `stateB` name nodes of this network.","items":{"$ref":"#/$defs/TransformationViz"}}},"required":["type","gufe-key","name","registry","nodes","edges"],"additionalProperties":false}}'), so = {
  $schema: Yd,
  $id: Xd,
  title: Zd,
  description: Qd,
  oneOf: eu,
  $defs: tu
}, Zm = [
  "AlchemicalNetworkViz",
  "ChemicalSystemViz",
  "LigandAtomMappingViz",
  "LigandNetworkViz",
  "ProteinComponentViz",
  "ProteinMembraneComponentViz",
  "ProtocolViz",
  "SmallMoleculeComponentViz",
  "SolvatedPDBComponentViz",
  "SolventComponentViz",
  "TransformationViz",
  "UnknownComponentViz"
], io = so.$id, ao = new Jd({ allErrors: !0, strict: !1 });
ao.addSchema(so, io);
const ai = ao.getSchema(io), nu = Object.entries(so.$defs).filter(
  ([e, t]) => t.properties?.type?.const === e
).map(([e]) => e).sort(), fa = /* @__PURE__ */ new Map();
for (const e of nu) {
  const t = ao.getSchema(`${io}#/$defs/${e}`);
  t && fa.set(e, t);
}
const ci = { valid: !0, issues: [] };
function li(e) {
  return (e ?? []).map((t) => ({
    path: t.instancePath || "",
    message: t.keyword === "additionalProperties" ? `unknown property ${JSON.stringify(t.params.additionalProperty)}` : t.message ?? "is invalid"
  }));
}
function ru(e) {
  if (e == null || typeof e != "object" || Array.isArray(e))
    return {
      valid: !1,
      issues: [{ path: "", message: "must be a JSON object" }]
    };
  const t = e.type, n = typeof t == "string" ? fa.get(t) : void 0;
  return n ? n(e) ? ci : { valid: !1, issues: li(n.errors) } : ai(e) ? ci : { valid: !1, issues: li(ai.errors) };
}
function ou(e, t = 8) {
  const n = e.slice(0, t).map((r) => `${r.path || "(root)"}: ${r.message}`);
  return e.length > t && n.push(`... and ${e.length - t} more`), n.join(`
`);
}
function N(e, t, n) {
  const r = document.createElement(e);
  return t && (r.style.cssText = t), n != null && (r.textContent = n), r;
}
function Ie(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function ve(e) {
  if (e == null) return "unknown error";
  const t = e.message;
  if (typeof t == "string" && t) return t;
  const n = String(e);
  return n === "[object Object]" ? e.name || "unknown error" : n;
}
const Nt = (e) => e.toLocaleString("en-US"), Qe = "-", Kn = (e, t) => e.length > t ? `${e.slice(0, t - 1)}...` : e;
function pa(e, t) {
  if (t(e.clientWidth), typeof ResizeObserver > "u") return () => {
  };
  const n = new ResizeObserver(() => t(e.clientWidth));
  return n.observe(e), () => n.disconnect();
}
const su = 460;
function co(e, t, n = su) {
  let r = null;
  return pa(e, (s) => {
    const o = s > 0 && s < n;
    o !== r && (r = o, t(o));
  });
}
const iu = ["debug", "gufe-debug"], au = "debug", cu = "ALCHEMY_VIZ_DEBUG";
function lu() {
  return !!globalThis[cu];
}
function du() {
  try {
    const e = globalThis.location?.search;
    if (!e) return !1;
    const t = new URLSearchParams(e);
    return iu.some((n) => t.has(n));
  } catch {
    return !1;
  }
}
function uu(e) {
  return e?.hasAttribute?.(au) ? !0 : lu() || du();
}
function fu(e) {
  try {
    return JSON.stringify(e, null, 2) ?? String(e);
  } catch (t) {
    return `<could not be stringified: ${ve(t)}>`;
  }
}
function pu(e, t, n) {
  if (!uu(n)) return;
  const r = fu(t), s = t?.type, o = `[alchemy-viz] ${e}${typeof s == "string" ? ` ${s}` : ""} (${r.length} chars)`, i = typeof console.groupCollapsed == "function";
  i ? console.groupCollapsed(o) : console.log(o), console.log(r), console.log(t), i && console.groupEnd?.();
}
const Je = {
  dark: {
    appBg: "#2b2b40",
    panelBg: "#33334d",
    cardBg: "#33334d",
    cardBgHover: "#3d3d5c",
    cardBgActive: "#1f3a63",
    cardBorder: "#45455e",
    cardBorderActive: "#4182e4",
    splitBorder: "#45455e",
    toolbarBg: "#33334d",
    toolbarBorder: "#45455e",
    tooltipBg: "#33334d",
    tooltipBorder: "#45455e",
    titleColor: "#51cbee",
    textPrimary: "#f2f3f7",
    textMuted: "#b9bccb",
    textMuted2: "#8f93a6",
    selectBg: "#2b2b40",
    selectBorder: "#45455e",
    labelBg: "#33334d",
    labelFg: "#51cbee",
    badgeBg: "#1f3a63",
    badgeFg: "#51cbee",
    switcherBg: "rgba(43,43,64,0.94)",
    btnBg: "#33334d",
    btnBgHover: "#3d3d5c",
    btnBgActive: "#4182e4",
    btnFg: "#f2f3f7",
    btnBorder: "#45455e",
    okBg: "#14532d",
    okFg: "#86efac",
    warnBg: "#3b1d1d",
    warnFg: "#ffb4b4",
    warnBorder: "#7f2a2a",
    errorFg: "#ff8080",
    viewerBg: "0x2b2b40",
    canvas2DBg: "#2b2b40",
    diffUnchanged: "#64748b",
    diffChanged: "#d9a300",
    diffAdded: "#2a9d4a",
    diffRemoved: "#d62828",
    netCanvasBg: "#2b2b40",
    netNodeFill: "#33334d",
    netNodeStroke: "#6a6c82",
    netNodeLabel: "#f2f3f7",
    netMol2dBg: "#2b2b40",
    netNodeCaption: "#b9bccb",
    netMol2dCaption: "#b9bccb",
    netInitials: "#51cbee",
    netMatchFill: "#4a3c22",
    netMatchStroke: "#e69f00",
    netMatchAtom: "#e69f00",
    netEdgeRamp: ["#45455e", "#51cbee"],
    netEdgeLine: "#8f93a6",
    netEdgeLabel: "#f2f3f7",
    netHaloColor: "#51cbee",
    netEdgeSelect: "#e0457e",
    netGroupFill: ["#1f3a63", "#12403c", "#3a1f37", "#4a3c22", "#243a5e"],
    netGroupStroke: ["#4182e4", "#00bdaa", "#c060b8", "#e69f00", "#8f93a6"],
    netProtocolStroke: [
      "#4182e4",
      "#00bdaa",
      "#c060b8",
      "#e69f00",
      "#5ec26a",
      "#f4714e",
      "#9d8df1",
      "#ef6f9b",
      "#b5c94a",
      "#c7cbdd"
    ]
  },
  light: {
    appBg: "#ffffff",
    panelBg: "#f7f8fa",
    cardBg: "#ffffff",
    cardBgHover: "#f0f4fb",
    cardBgActive: "#e6effc",
    cardBorder: "#eeeeee",
    cardBorderActive: "#4182e4",
    splitBorder: "#eeeeee",
    toolbarBg: "#f7f8fa",
    toolbarBorder: "#eeeeee",
    tooltipBg: "#ffffff",
    tooltipBorder: "#cccccc",
    titleColor: "#4182e4",
    textPrimary: "#333333",
    textMuted: "#666666",
    textMuted2: "#999999",
    selectBg: "#ffffff",
    selectBorder: "#cccccc",
    labelBg: "#f7f8fa",
    labelFg: "#4182e4",
    badgeBg: "#e6effc",
    badgeFg: "#4182e4",
    switcherBg: "rgba(255,255,255,0.94)",
    btnBg: "#ffffff",
    btnBgHover: "#f0f4fb",
    btnBgActive: "#4182e4",
    btnFg: "#333333",
    btnBorder: "#cccccc",
    okBg: "#dcfce7",
    okFg: "#166534",
    warnBg: "#fee2e2",
    warnFg: "#991b1b",
    warnBorder: "#fecaca",
    errorFg: "#c33",
    viewerBg: "0xffffff",
    canvas2DBg: "#ffffff",
    diffUnchanged: "#94a3b8",
    diffChanged: "#b45309",
    diffAdded: "#2a9d4a",
    diffRemoved: "#d62828",
    netCanvasBg: "#ffffff",
    netNodeFill: "#ffffff",
    netNodeStroke: "#cccccc",
    netNodeLabel: "#333333",
    netMol2dBg: "#ffffff",
    netNodeCaption: "#666666",
    netMol2dCaption: "#666666",
    netInitials: "#4182e4",
    netMatchFill: "#fdf1d8",
    netMatchStroke: "#e69f00",
    netMatchAtom: "#c07d00",
    netEdgeRamp: ["#e8eaef", "#4182e4"],
    netEdgeLine: "#999999",
    netEdgeLabel: "#333333",
    netHaloColor: "#51cbee",
    netEdgeSelect: "#c2185b",
    netGroupFill: ["#e6effc", "#d9f5f2", "#f6e7f4", "#fdf1d8", "#eef0f4"],
    netGroupStroke: ["#4182e4", "#009e8f", "#8a2283", "#c07d00", "#666666"],
    netProtocolStroke: [
      "#2f6fd0",
      "#009e8f",
      "#8a2283",
      "#c07d00",
      "#2e8b3d",
      "#d1441c",
      "#6a4fd0",
      "#b3306a",
      "#6f7d1c",
      "#4a5160"
    ]
  }
};
function hu() {
  try {
    return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ?? !1;
  } catch {
    return !1;
  }
}
const di = "data-gufe-theme";
function lo() {
  return hu() ? "dark" : "light";
}
let ue = Je[lo()];
const ha = "--gufe-", ma = Object.keys(Je.light).filter(
  (e) => e !== "viewerBg" && typeof Je.light[e] == "string"
), j = Object.fromEntries(ma.map((e) => [e, `var(${ha}${e})`])), Er = (e) => ma.map((t) => `${ha}${t}:${e[t]};`).join("");
function mu() {
  return [
    `:root{color-scheme:light dark;${Er(Je.light)}}`,
    `@media (prefers-color-scheme:dark){:root:not([${di}="light"]){${Er(Je.dark)}}}`,
    `:root[${di}="dark"]{${Er(Je.dark)}}`,
    // A button's three states, in one place. Every button in the codebase is
    // built from `BUTTON.base`, which deliberately sets no background: these do,
    // so that hovering is a stylesheet rule rather than a pair of handlers on
    // every button, written slightly differently each time.
    `.gufe-btn{background:${j.btnBg};}`,
    `.gufe-btn:hover:not(:disabled){background:${j.btnBgHover};}`,
    `.gufe-btn[aria-pressed="true"],.gufe-btn[aria-expanded="true"],.gufe-btn[data-gufe-on="1"]{background:${j.btnBgActive};}`,
    ".gufe-btn:disabled{opacity:.5;cursor:default;}",
    // The same for a pickable card or row, whose selected state is `aria-pressed`
    // for the same reason: it is the accessible fact, so styling from it cannot
    // drift out of step with what a screen reader is told.
    `.gufe-pick{background:${j.cardBg};border-color:${j.cardBorder};}`,
    `.gufe-pick:hover{background:${j.cardBgHover};}`,
    `.gufe-pick[aria-pressed="true"]{background:${j.cardBgActive};border-color:${j.cardBorderActive};}`,
    // A chip that selects what it counts. Its resting state is no background at
    // all - it is a count in a row of counts, not a control asking to be pressed
    // - so it is its own rule rather than a `gufe-pick` with the ground removed.
    ".gufe-chip{background:none;}",
    `.gufe-chip:hover{background:${j.cardBgHover};}`,
    `.gufe-chip[aria-pressed="true"]{background:${j.cardBgActive};color:${j.textPrimary};}`
  ].join(`
`);
}
const ui = "alchemy-viz-theme";
function ga() {
  if (typeof document > "u" || document.getElementById(ui)) return;
  const e = document.createElement("style");
  e.id = ui, e.textContent = mu(), document.head.appendChild(e);
}
const ee = {
  family: "'Inter',system-ui,sans-serif",
  mono: "ui-monospace,SFMono-Regular,Menlo,monospace",
  /** Label captions and dense readouts. */
  tiny: "10px",
  /** The default for chrome: chips, legends, list rows. */
  small: "11px",
  /** Body text, toolbars, form controls. */
  body: "12px",
  /** Pane labels and anything heading a section of a view. */
  heading: "13px",
  /** A view's title. */
  title: "15px",
  /**
   * The one value a card is built around: a formula, a concentration. Large
   * enough that a reader takes it from the shape of the card rather than from
   * reading a row, which is the only reason to use it - a card with two of
   * these has no hierarchy left.
   */
  display: "26px"
}, ge = {
  normal: "400",
  bold: "700"
}, X = {
  xs: "2px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "10px",
  xxl: "14px"
}, Ee = {
  sm: "3px",
  md: "6px",
  lg: "8px",
  xl: "10px",
  pill: "999px"
}, ke = {
  title: j.titleColor,
  primary: j.textPrimary,
  muted: j.textMuted,
  faint: j.textMuted2,
  error: j.errorFg
}, Lt = {
  card: j.cardBg,
  /**
   * Where a 3D engine draws. Interface, not chemistry: it is the paper.
   *
   * The one literal here, and a function so it is read when a viewer is built
   * rather than when this module loads. 3Dmol wants `0x2b2b40`, which is not a
   * colour CSS has ever heard of, so this is the one surface a custom property
   * cannot carry.
   */
  viewer: () => ue.viewerBg
}, fi = {
  // `max-width` and `box-sizing` are what keep a button inside whatever holds
  // it. A label wider than the menu column would otherwise run out over the
  // picture, and `width:100%` on a padded, bordered button means 100% plus the
  // padding and the border - twenty pixels past the edge of the panel.
  base: `color:${j.btnFg};border:1px solid ${j.btnBorder};padding:${X.sm} 9px;font-size:${ee.small};font-weight:${ge.bold};border-radius:${Ee.sm};cursor:pointer;font-family:inherit;max-width:100%;box-sizing:border-box;`,
  /** What the stylesheet in `theme.ts` paints. */
  className: "gufe-btn"
}, ya = `background:${j.selectBg};color:${j.textPrimary};border:1px solid ${j.selectBorder};border-radius:${Ee.md};padding:${X.sm} ${X.lg};font-size:${ee.body};cursor:pointer;font-family:inherit;`, $a = `${ya}width:100%;box-sizing:border-box;cursor:text;`, ba = "24px", gu = `display:flex;align-items:flex-start;gap:12px;padding:9px ${X.xxl};flex-shrink:0;line-height:${ba};background:${j.toolbarBg};border-bottom:1px solid ${j.toolbarBorder};`, Xn = { min: "236px", max: "340px" }, et = {
  min: "--gufe-menu-min",
  max: "--gufe-menu-max",
  ruleX: "--gufe-menu-rule-x",
  ruleY: "--gufe-menu-rule-y"
}, va = `display:flex;flex-direction:column;gap:${X.lg};flex:1;min-width:var(${et.min},${Xn.min});max-width:var(${et.max},${Xn.max});box-sizing:border-box;padding:${X.xl};min-height:0;overflow-y:auto;background:${j.panelBg};border:0 solid ${j.splitBorder};border-right-width:var(${et.ruleX},1px);border-bottom-width:var(${et.ruleY},0);`, yu = "45%", $u = "flex:1 1 auto;min-height:84px;overflow:auto;display:flex;flex-direction:column;gap:3px;", pi = `display:flex;align-items:center;gap:${X.xl};flex-wrap:wrap;padding:${X.lg} ${X.xxl};flex-shrink:0;background:${j.toolbarBg};border-top:1px solid ${j.toolbarBorder};`, bu = `flex-shrink:0;padding:${X.sm} ${X.xl};font-size:${ee.heading};font-weight:${ge.bold};color:${j.labelFg};background:${j.labelBg};`, uo = `position:absolute;top:${X.md};left:${X.md};z-index:10;pointer-events:none;max-width:calc(100% - ${X.xxl} - ${X.xxl});white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:${X.xs} ${X.lg};border-radius:${Ee.md};font-size:${ee.heading};font-weight:${ge.bold};color:${j.labelFg};background:${j.labelBg};`, vu = `padding:${X.xs} ${X.lg};border-radius:${Ee.md};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${j.labelFg};background:${j.labelBg};`, wu = `position:absolute;top:${X.lg};left:${X.lg};z-index:15;display:flex;align-items:center;gap:${X.md};min-width:0;max-width:calc(100% - ${X.xxl} - ${X.xxl});`, _u = "42px", Su = `display:flex;flex-direction:column;gap:${X.xs};padding:${X.xxl} 18px;border-radius:${Ee.xl};background:${j.cardBg};border:1px solid ${j.cardBorder};`, fo = {
  card: `display:flex;flex-direction:column;align-items:flex-start;gap:${X.sm};padding:${X.lg} ${X.xl};text-align:left;border-radius:${Ee.lg};border:1px solid;cursor:pointer;font-family:inherit;font-size:${ee.body};width:100%;`,
  /** The compact form: one line in a network menu's list rather than a card. */
  row: `display:flex;align-items:center;gap:${X.md};padding:5px ${X.lg};border:1px solid;border-radius:${X.md};text-align:left;font-family:inherit;font-size:${ee.small};cursor:pointer;width:100%;min-width:0;color:${j.textPrimary};`,
  className: "gufe-pick"
}, ku = `position:absolute;z-index:30;pointer-events:none;opacity:0;transition:opacity .12s ease;padding:7px ${X.xl};border-radius:${Ee.md};font-size:${ee.small};line-height:1.5;max-width:260px;background:${j.tooltipBg};border:1px solid ${j.tooltipBorder};color:${j.textPrimary};box-shadow:0 4px 14px rgba(0,0,0,0.28);`, wa = `position:absolute;bottom:${X.xl};right:${X.xl};display:flex;gap:${X.sm};padding:${X.sm};border-radius:${Ee.md};z-index:10;background:${j.switcherBg};box-shadow:0 2px 8px rgba(0,0,0,0.25);`, Cu = `font-family:${ee.mono};font-size:${ee.small};line-height:1.7;color:${j.textMuted};`, qr = `font-size:${ee.small};font-weight:${ge.bold};letter-spacing:.08em;text-transform:uppercase;color:${j.textMuted2};`, Pe = {
  row: `display:flex;flex-wrap:wrap;align-items:center;gap:${X.xs} ${X.sm};font-size:${ee.small};`,
  plain: `display:inline-flex;align-items:center;padding:${X.xs} ${X.md};border:1px solid transparent;border-radius:${Ee.pill};font-family:inherit;font-size:${ee.small};color:${j.textMuted};`,
  /**
   * A chip that selects what it counts.
   *
   * Deliberately sets no `background`: like `BUTTON` and `PICK`, resting, hover
   * and picked are one stylesheet rule keyed off `aria-pressed`, and an inline
   * background would beat it. Pair it with `CHIP.className`.
   */
  button: `cursor:pointer;border-color:${j.btnBorder};`,
  /**
   * A chip that is read rather than clicked: a value the card is quoting, in a
   * box that says so. Drawn like a button and deliberately not one, so it does
   * not invite the click a `button` chip answers.
   */
  outline: `background:${j.btnBg};border-color:${j.btnBorder};color:${j.textPrimary};`,
  /**
   * What a `button` chip's border goes back to.
   *
   * The same value `button` sets, named so that a chip which overrides its
   * border to say something - the alchemical network's protocol chips, where the
   * picked one takes the colour its lines are drawn in - has a resting value to
   * put back without reaching into the palette for it.
   */
  restBorder: j.btnBorder,
  className: "gufe-chip"
}, Eu = `font-size:${ee.small};line-height:1.6;color:${j.textMuted2};`;
function Ve(e, t, n) {
  const r = N("span", "display:inline-flex;align-items:center;gap:5px;white-space:nowrap;");
  n && r.appendChild(
    N("span", `width:8px;height:8px;border-radius:50%;background:${n};display:inline-block;`)
  );
  const s = N("span");
  return s.innerHTML = `${Ie(e)} <b style="color:${ke.primary};">${Ie(t)}</b>`, r.appendChild(s), r;
}
function lt(e, t) {
  const n = N("div", "", `⚠ ${t}`);
  return n.style.cssText = `position:absolute;top:${X.xl};left:50%;transform:translateX(-50%);max-width:90%;z-index:20;padding:${X.md} ${X.xxl};border-radius:${Ee.md};font-size:${ee.body};background:${j.warnBg};color:${j.warnFg};border:1px solid ${j.warnBorder};`, e.appendChild(n), n;
}
function $e(e, t = !1) {
  return N(
    "div",
    `flex:1;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:${ee.heading};color:${t ? ke.error : ke.faint};`,
    e
  );
}
function sr(e, t = "") {
  const n = N("div", gu);
  return n.className = "gufe-header", n.titleEl = N(
    "span",
    `font-weight:${ge.bold};font-size:${ee.title};color:${ke.title};letter-spacing:.02em;`,
    e
  ), n.statsEl = N(
    "div",
    `display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-left:auto;font-size:${ee.small};color:${ke.muted};`
  ), n.textEl = N("div", "display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;flex:1;min-width:0;"), n.toggleEl = N("div", `display:flex;align-items:center;height:${ba};flex-shrink:0;`), n.appendChild(n.toggleEl), n.textEl.appendChild(n.titleEl), t && (n.sourceEl = N(
    "span",
    `font-family:${ee.mono};font-size:${ee.small};color:${ke.faint};min-width:0;overflow-wrap:anywhere;`,
    t
  ), n.sourceEl.className = "gufe-header-source", n.sourceEl.title = `Generated from ${t}`, n.textEl.appendChild(n.sourceEl)), n.textEl.appendChild(n.statsEl), n.appendChild(n.textEl), n;
}
function Zn(e, t, n = !1) {
  const r = N("div", "display:flex;gap:12px;align-items:baseline;padding:5px 0;min-width:0;");
  r.appendChild(
    N(
      "span",
      `flex:0 0 128px;font-size:${ee.tiny};font-weight:${ge.bold};letter-spacing:.08em;text-transform:uppercase;color:${ke.faint};`,
      e
    )
  );
  const s = N(
    "span",
    `flex:1;min-width:0;user-select:text;cursor:text;overflow-wrap:anywhere;color:${ke.primary};` + (n ? `font-family:${ee.mono};font-size:${ee.small};` : `font-size:${ee.body};`),
    t
  );
  return s.title = t, r.appendChild(s), r;
}
function ir(e) {
  return N(
    "span",
    `padding:1px 7px;border-radius:${Ee.xl};font-size:${ee.tiny};font-weight:${ge.bold};letter-spacing:.04em;white-space:nowrap;background:${j.badgeBg};color:${j.badgeFg};`,
    e
  );
}
function po() {
  return N("div", Su);
}
function _a() {
  const e = N("div", "flex:1;position:relative;min-height:0;min-width:0;"), t = N("div", "position:absolute;inset:0;");
  return t.dataset.gufeViewer = "", e.appendChild(t), { wrap: e, container: t };
}
const Vr = "data-gufe-hide-name";
function ho(e) {
  return !e.closest(`[${Vr}]`);
}
const Sa = "ALCHEMY_VIZ_VIEW_STATE";
function ka(e) {
  const t = globalThis[Sa];
  if (!t || typeof t != "object") return null;
  const n = t, r = n[e];
  return delete n[e], r ?? null;
}
function mo() {
  let e = 0, t = !0;
  return {
    start() {
      const n = ++e;
      return () => t && n === e;
    },
    stop() {
      t = !1, e++;
    }
  };
}
const xu = 150, hi = "data-gufe-shell";
class Fe extends HTMLElement {
  #e = null;
  #t = null;
  #n = null;
  #r = null;
  #o = null;
  /**
   * Bumped by every teardown. A render captures it and refuses to adopt its
   * handle if it has moved on - which is what stops a slow view (3Dmol behind a
   * CDN fetch) from installing itself into an element that has since been given
   * a different payload, or removed from the document entirely.
   */
  #s = 0;
  /** The message shown before any payload arrives. */
  placeholder() {
    return "Waiting for data...";
  }
  set payload(t) {
    this.#e = t, this.isConnected && this.#a();
  }
  get payload() {
    return this.#e;
  }
  connectedCallback() {
    ga(), this.style.display = "flex", this.style.flexDirection = "column", this.style.width = this.style.width || "100%";
    const t = this.style.height;
    this.style.height = t || "100%", !t && !this.parentElement?.closest(`[${hi}]`) && this.#d() && (this.style.maxHeight = "100vh"), this.style.background = j.appBg, this.style.color = j.textPrimary, this.style.fontFamily = ee.family, typeof ResizeObserver < "u" && !this.#r && (this.#r = new ResizeObserver(() => {
      this.#o && clearTimeout(this.#o), this.#o = setTimeout(() => this.#t?.onResize?.(), xu);
    }), this.#r.observe(this)), this.#a();
  }
  disconnectedCallback() {
    this.#i(), this.#r?.disconnect(), this.#r = null;
  }
  /** Release whatever the mounted view owns and empty the element. */
  #i() {
    if (this.#s++, this.#o && (clearTimeout(this.#o), this.#o = null), this.#t?.cleanup)
      try {
        this.#t.cleanup();
      } catch (t) {
        console.warn("[alchemy-viz] cleanup failed:", t);
      }
    this.#t = null, this.replaceChildren(), this.#n = null;
  }
  /**
   * Whether nothing has given this element a `max-height` already - inline, or
   * in a stylesheet, which is how a page raises the ceiling above.
   */
  #d() {
    if (typeof getComputedStyle != "function") return !0;
    const t = getComputedStyle(this).maxHeight;
    return !t || t === "none";
  }
  /** Tear the mounted view down and hand back a fresh, empty shell. */
  #u() {
    return this.#i(), this.#n = N(
      "div",
      // `flex:1;min-height:0` and not height alone: inside a host clamped by the
      // ceiling above, the shell has to be shrinkable or it overflows it.
      `width:100%;height:100%;flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:hidden;background:${j.appBg};`
    ), this.#n.setAttribute(hi, ""), this.appendChild(this.#n), this.#n;
  }
  /**
   * Build the view for the current payload.
   *
   * Deliberately *not* an `async` method. A synchronous `renderView` - which is
   * what the current views are - must install its handle before this returns,
   * or two `payload` assignments in a row would tear down nothing the first
   * time and leak the first view's viewer. An `await` here would defer that
   * assignment by a microtask and do exactly that.
   */
  #a() {
    const t = this.#u(), n = this.#s;
    if (this.#e == null) {
      t.appendChild($e(this.placeholder()));
      return;
    }
    let r;
    try {
      r = this.renderView(t, this.#e);
    } catch (s) {
      this.#l(t, n, s);
      return;
    }
    r instanceof Promise ? r.then(
      (s) => this.#c(s, n),
      (s) => this.#l(t, n, s)
    ) : this.#c(r, n);
  }
  /** Take ownership of a view's handle, unless it belongs to a dead render. */
  #c(t, n) {
    if (n !== this.#s || !this.isConnected) {
      try {
        t?.cleanup?.();
      } catch (r) {
        console.warn("[alchemy-viz] cleanup of a superseded view failed:", r);
      }
      return;
    }
    this.#t = t || null;
  }
  #l(t, n, r) {
    n === this.#s && (console.warn("[alchemy-viz] render failed:", r), t.replaceChildren($e(`Failed to render: ${ve(r)}`, !0)));
  }
  /** Force a resize pass - for hosts that know they resized us. */
  resize() {
    this.#t?.onResize?.();
  }
  /**
   * What the mounted view would need to be restored as it is now, or null when
   * it has nothing to say. See `ViewHandle.viewState`.
   */
  viewState() {
    return this.#t?.viewState?.() ?? null;
  }
}
function ze(e, t) {
  typeof customElements > "u" || customElements.get(e) || customElements.define(e, t);
}
const Ca = "source", Au = "ALCHEMY_VIZ_SOURCE";
function Bt(e) {
  const t = e?.getAttribute?.(Ca);
  if (t && t.trim()) return t.trim();
  const n = globalThis[Au];
  return typeof n == "string" ? n.trim() : "";
}
const go = {
  AlchemicalNetworkViz: "gufe-alchemical-network",
  SmallMoleculeComponentViz: "gufe-small-molecule",
  ProteinComponentViz: "gufe-protein",
  ProteinMembraneComponentViz: "gufe-protein",
  ProtocolViz: "gufe-protocol",
  SolvatedPDBComponentViz: "gufe-protein",
  LigandNetworkViz: "gufe-ligand-network",
  ChemicalSystemViz: "gufe-chemical-system",
  LigandAtomMappingViz: "gufe-atom-mapping",
  TransformationViz: "gufe-transformation",
  SolventComponentViz: "gufe-solvent",
  UnknownComponentViz: "gufe-unknown-component"
};
function Pu(e) {
  if (e == null || typeof e != "object" || Array.isArray(e))
    return {
      message: "This does not look like an alchemy-viz payload (expected a JSON object)."
    };
  const { type: t } = e;
  if (typeof t != "string" || !t)
    return {
      message: "This payload has no `type`, so there is nothing to say what it is."
    };
  if (!go[t]) return Ru(t);
  const { valid: n, issues: r } = ru(e);
  return n ? null : {
    message: `This payload says it is a ${t}, but it does not match the alchemy-viz schema.`,
    detail: ou(r)
  };
}
function Ru(e) {
  const t = Object.keys(go).sort().join(", ");
  return {
    message: `Sorry, there is no visualization for ${e} yet. This build can draw: ${t}.`
  };
}
class Mu extends Fe {
  placeholder() {
    return "Waiting for data...";
  }
  renderView(t, n) {
    pu("payload", n, this);
    const r = Pu(n);
    if (r)
      return t.appendChild(Nu(r, n)), {};
    const s = n.type, o = go[s], i = document.createElement(o);
    i.style.cssText = "flex:1;min-height:0;min-width:0;";
    const a = Bt(this);
    return a && i.setAttribute(Ca, a), i.payload = n, t.appendChild(i), {
      onResize: () => i.resize?.(),
      // Removing the child fires its own `disconnectedCallback`, which is where
      // its viewers and observers are released
      cleanup: () => i.remove()
    };
  }
}
function Nu(e, t) {
  const n = N(
    "div",
    "flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:32px;"
  );
  n.appendChild($e(e.message));
  const r = (o, i) => N(
    "div",
    "max-width:640px;padding:8px 12px;border-radius:6px;font-size:11px;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere;" + (i ? `background:${j.warnBg};color:${j.warnFg};border:1px solid ${j.warnBorder};` : `background:${j.panelBg};color:${j.textMuted2};border:1px solid ${j.cardBorder};`),
    o
  );
  e.detail && n.appendChild(r(e.detail, !0));
  const s = Ou(t);
  return s && n.appendChild(r(s, !1)), n;
}
function Ou(e) {
  if (e == null || typeof e != "object") return null;
  const t = e, n = [];
  typeof t.type == "string" && n.push(`type: ${t.type}`), typeof t.name == "string" && t.name && n.push(`name: ${t.name}`);
  const r = Object.keys(e);
  return r.length && n.push(
    `keys: ${r.slice(0, 12).join(", ")}${r.length > 12 ? ", ..." : ""}`
  ), n.length ? n.join(`
`) : null;
}
ze("alchemy-view", Mu);
function ft(e = "", t) {
  const n = N("button", fi.base + e, t);
  return n.className = fi.className, n.type = "button", n;
}
function Ur(e, t) {
  e.setAttribute("aria-pressed", String(t));
}
function qt(e, t = fo.className) {
  const n = N("button", e);
  return n.className = t, n.type = "button", n.setAttribute("aria-pressed", "false"), n;
}
function Ct(e, t, n, r) {
  if (r) {
    const i = r.get();
    e.some((a) => a.id === i) && (t = i);
  }
  const s = N("div", "display:flex;flex-wrap:wrap;gap:4px;min-width:0;"), o = e.map((i) => {
    const a = ft("", i.label);
    return a.title = i.title || i.label, a.onclick = () => {
      s.setActive(i.id), r?.set(i.id), n(i.id);
    }, s.appendChild(a), { id: i.id, btn: a };
  });
  return s.setActive = (i) => {
    t = i;
    for (const a of o) Ur(a.btn, a.id === t);
  }, s.setActive(t), s;
}
const Tu = parseFloat(X.xl) * 2;
function Ea(e, t, n, r = {}) {
  const { remember: s } = r;
  if (s) {
    const m = s.get();
    e.some((b) => b.id === m) && (t = m);
  }
  const o = N("div", "display:flex;min-width:0;"), i = (m) => {
    o.setActive(m), s?.set(m), n(m);
  }, a = Ct(e, t, i), c = yo(e, t, i);
  c.style.display = "none", o.appendChild(a), o.appendChild(c), o.buttons = a, o.setActive = (m) => {
    t = m, a.setActive(m), c.value = m;
  };
  let l = !1;
  o.setCompact = (m) => {
    m !== l && (l = m, a.style.display = l ? "none" : "flex", c.style.display = l ? "" : "none", r.onLayout?.(l));
  };
  let d = () => {
  };
  if (r.fit) {
    const { pane: m, bar: b } = r.fit;
    let v = 0;
    d = pa(m, ($) => {
      l || (v = b.offsetWidth || v), v && o.setCompact(v > $ - Tu);
    });
  }
  return o.cleanup = () => d(), o;
}
function yo(e, t, n, r) {
  const s = N("select", ya);
  for (const i of e) {
    const a = N("option", "", i.label);
    a.value = i.id, s.appendChild(a);
  }
  let o = t;
  if (r) {
    const i = r.get();
    e.some((a) => a.id === i) && (o = i);
  }
  return s.value = o, s.onchange = () => {
    r?.set(s.value), n(s.value);
  }, s;
}
function xa(e, t, n, r = {}) {
  let s = r.remember ? r.remember.get() : t;
  const o = ft("", e);
  return o.title = r.title || e, Ur(o, s), o.onclick = () => {
    s = !s, Ur(o, s), r.remember?.set(s), n(s);
  }, o;
}
const Ye = "alchemy-viz:", kt = /* @__PURE__ */ new Map();
let Dn = null;
function Fu() {
  const e = globalThis.localStorage;
  return e || globalThis.window?.localStorage;
}
function ar() {
  if (Dn === !1) return null;
  const e = Fu();
  if (!e)
    return Dn = !1, null;
  try {
    const t = `${Ye}__probe`;
    return e.setItem(t, "1"), e.removeItem(t), Dn = !0, e;
  } catch {
    return Dn = !1, null;
  }
}
function zu(e) {
  const t = ar();
  if (!t) return kt.get(Ye + e) ?? null;
  try {
    return t.getItem(Ye + e);
  } catch {
    return null;
  }
}
function ju(e, t) {
  const n = ar();
  if (!n) {
    kt.set(Ye + e, t);
    return;
  }
  try {
    n.setItem(Ye + e, t);
  } catch {
    kt.set(Ye + e, t);
  }
}
function cr(e, t, n) {
  return {
    key: e,
    get() {
      const r = zu(e);
      if (r === null) return t;
      try {
        const s = JSON.parse(r);
        return n(s) ? s : t;
      } catch {
        return t;
      }
    },
    set(r) {
      try {
        ju(e, JSON.stringify(r));
      } catch {
      }
    }
  };
}
function ut(e, t, n) {
  return cr(e, t, (r) => typeof r == "string" && n.includes(r));
}
function ct(e, t) {
  return cr(e, t, (n) => typeof n == "boolean");
}
function Dt(e, t, n = -1 / 0, r = 1 / 0) {
  return cr(
    e,
    t,
    (s) => typeof s == "number" && Number.isFinite(s) && s >= n && s <= r
  );
}
function Hr(e, t = "") {
  return cr(e, t, (n) => typeof n == "string");
}
function $o() {
  const e = ar(), t = e ? Array.from({ length: e.length }, (r, s) => e.key(s)).filter((r) => typeof r == "string") : Array.from(kt.keys()), n = [];
  for (const r of t) {
    if (!r.startsWith(Ye)) continue;
    const s = e ? e.getItem(r) : kt.get(r) ?? null;
    s !== null && n.push([r, s]);
  }
  return n;
}
function Iu() {
  const e = {};
  for (const [t, n] of $o()) {
    const r = t.slice(Ye.length);
    try {
      e[r] = JSON.parse(n);
    } catch {
      e[r] = n;
    }
  }
  return e;
}
function Du() {
  return Object.fromEntries($o());
}
function Lu() {
  const e = ar();
  if (e)
    for (const [t] of $o())
      try {
        e.removeItem(t);
      } catch {
      }
  kt.clear();
}
const bo = {
  // pinned versions
  threeDmol: "https://unpkg.com/3dmol@2.5.5/build/3Dmol-min.js",
  rdkit: "https://unpkg.com/@rdkit/rdkit@2025.3.4-1.0.0/dist/RDKit_minimal.js",
  d3Force: "https://cdn.jsdelivr.net/npm/d3-force@3.0.0/+esm"
};
function vo(e) {
  const t = globalThis.__gufeEngines?.[e];
  return t ? Promise.resolve(t) : null;
}
function Aa(e, t) {
  return new Promise((n, r) => {
    const s = document.createElement("script");
    s.src = e, s.onload = () => n(), s.onerror = () => r(new Error(`Failed to load ${t}`)), document.head.appendChild(s);
  });
}
let nt = null, yt = null;
function lr() {
  if (yt) return yt;
  const e = vo("threeDmol");
  return e ? (yt = e.then((t) => nt = t || window.$3Dmol), yt) : (yt = (async () => {
    if (window.$3Dmol) return nt = window.$3Dmol;
    if (await Aa(bo.threeDmol, "3Dmol.js"), !window.$3Dmol) throw new Error("3Dmol.js loaded but $3Dmol is undefined");
    return nt = window.$3Dmol;
  })(), yt);
}
let $t = null;
function wo() {
  if ($t) return $t;
  const e = vo("rdkit");
  return e ? ($t = e.then((t) => window.RDKit = t), $t) : ($t = (async () => {
    if (window.RDKit) return window.RDKit;
    if (await Aa(bo.rdkit, "RDKit"), !window.initRDKitModule) throw new Error("RDKit loaded but initRDKitModule is undefined");
    return window.RDKit = await window.initRDKitModule();
  })(), $t);
}
let Bu = null;
function Pa() {
  return Bu ??= wo().catch((e) => (console.warn("[alchemy-viz] RDKit failed to load:", e instanceof Error ? e.message : String(e)), null));
}
let xr = null;
function qu() {
  if (!xr) {
    const e = bo.d3Force;
    xr = vo("d3Force") ?? import(
      /* @vite-ignore */
      e
    );
  }
  return xr;
}
function _o(e) {
  if (e) {
    e.spin(!1);
    try {
      e.clear();
    } catch {
    }
  }
}
function Ra(e, t) {
  let n = !1, r = !1;
  const s = () => {
    n = !0;
  }, o = () => {
    n = !1;
  }, i = (a) => {
    a.stopPropagation();
    const c = a.ctrlKey || a.metaKey;
    if (n || c) {
      (t.onZoom(a) !== !1 || c) && a.preventDefault();
      return;
    }
    t.hint && !r && (r = !0, Hu(e, t.hint));
  };
  return e.addEventListener("wheel", i, { passive: !1, capture: !0 }), e.addEventListener("pointerdown", s), e.addEventListener("pointerenter", s), e.addEventListener("pointerleave", o), {
    cleanup() {
      e.removeEventListener("wheel", i, { capture: !0 }), e.removeEventListener("pointerdown", s), e.removeEventListener("pointerenter", s), e.removeEventListener("pointerleave", o);
    }
  };
}
function Vu(e) {
  const t = (s) => s.preventDefault(), n = (s) => {
    s.touches?.length > 1 && s.preventDefault();
  }, r = ["gesturestart", "gesturechange", "gestureend"];
  for (const s of r) e.addEventListener(s, t, { passive: !1 });
  return e.addEventListener("touchmove", n, { passive: !1 }), {
    cleanup() {
      for (const s of r) e.removeEventListener(s, t);
      e.removeEventListener("touchmove", n);
    }
  };
}
const Uu = 1600;
function Hu(e, t) {
  const n = N(
    "div",
    "position:absolute;bottom:12px;left:50%;transform:translateX(-50%);z-index:30;pointer-events:none;padding:5px 12px;border-radius:6px;font-size:11px;white-space:nowrap;background:rgba(0,0,0,0.72);color:#ffffff;transition:opacity .3s ease;",
    t
  );
  e.appendChild(n), setTimeout(() => {
    n.style.opacity = "0", setTimeout(() => n.remove(), 300);
  }, Uu);
}
const Ku = { min: 0.25, max: 12 }, Gu = 150;
function mi(e) {
  const t = e.getView?.()?.[3];
  return typeof t != "number" || !Number.isFinite(t) ? NaN : (e.CAMERA_Z ?? Gu) - t;
}
function Wu(e, t = Ku) {
  const n = mi(e), r = Number.isFinite(n) && n > 0;
  r && e.setZoomLimits?.(n / t.max, n / t.min);
  let s = 1;
  const o = () => {
    if (!r) return s;
    const i = mi(e);
    return Number.isFinite(i) && i > 0 ? n / i : s;
  };
  return {
    zoomBy(i) {
      const a = o(), c = Math.min(t.max, Math.max(t.min, a * i)), l = c / a;
      return !Number.isFinite(l) || Math.abs(l - 1) < 1e-9 ? !1 : (s = c, e.zoom(l), e.render(), !0);
    },
    reset() {
      s = 1, e.zoomTo(), e.render();
    },
    level: o
  };
}
const Ju = 2e-3;
function Ma(e) {
  return Math.exp(-e.deltaY * Ju);
}
function dr(e, t, n = {}) {
  const r = Wu(t, n.bounds), s = Ra(e, {
    hint: n.hint ?? "Click or hold Ctrl to zoom",
    onZoom: (o) => r.zoomBy(Ma(o))
  });
  return { ...r, cleanup: s.cleanup };
}
function Na(e, t = "Reset view") {
  const n = ft("", "Reset");
  return n.title = t, n.setAttribute("aria-label", t), n.onclick = e, n;
}
function Oa(e, t, n = "Reset view") {
  const r = Na(t, n);
  return r.style.cssText += `position:absolute;left:${X.xl};bottom:${X.xl};z-index:10;`, e.appendChild(r), r;
}
let _t = null;
function Yu(e) {
  const t = e.getView?.();
  if (!Array.isArray(t) || t.length < 8) return null;
  const n = t.slice(4, 8);
  return n.every((r) => typeof r == "number" && Number.isFinite(r)) ? n : null;
}
function Ta(e, t) {
  if (!e) return;
  const n = Yu(e);
  if (!n) return;
  const r = t?.level();
  _t = {
    rotation: n,
    zoom: typeof r == "number" && Number.isFinite(r) && r > 0 ? r : _t?.zoom ?? 1
  };
}
function Fa(e, t) {
  if (!_t || !e) return !1;
  const n = e.getView?.();
  return !Array.isArray(n) || n.length < 8 ? !1 : (e.setView([n[0], n[1], n[2], n[3], ..._t.rotation]), t && Math.abs(_t.zoom - 1) > 1e-9 && t.zoomBy(_t.zoom), e.render(), !0);
}
const Ar = {
  elementChange: "#005AB5",
  uniqueAtom: "#DC3220"
}, Xu = [
  "#FF0000",
  "#FF0C00",
  "#FF1800",
  "#FF2300",
  "#FF2F00",
  "#FF3B00",
  "#FF4700",
  "#FF5300",
  "#FF5F00",
  "#FF6A00",
  "#FF7600",
  "#FF8200",
  "#FF8E00",
  "#FF9A00",
  "#FFA500",
  "#FFB100",
  "#FFBD00",
  "#FFC900",
  "#FFD500",
  "#FFE000",
  "#FFEC00",
  "#FCF500",
  "#F8FD00",
  "#EEFF00",
  "#E2FF00",
  "#D7FF00",
  "#CBFF00",
  "#BFFF00",
  "#B3FF00",
  "#A7FF00",
  "#9CFF00",
  "#90FF00",
  "#84FF00",
  "#78FF00",
  "#6CFF00",
  "#61FF00",
  "#55FF00",
  "#49FF00",
  "#3DFF00",
  "#31FF00",
  "#25FF00",
  "#1AFF00",
  "#0EFF00",
  "#06FF04",
  "#02FF0C",
  "#00FF16",
  "#00FF21",
  "#00FF2D",
  "#00FF39",
  "#00FF45",
  "#00FF51",
  "#00FF5C",
  "#00FF68",
  "#00FF74",
  "#00FF80",
  "#00FF8C",
  "#00FF97",
  "#00FFA3",
  "#00FFAF",
  "#00FFBB",
  "#00FFC7",
  "#00FFD3",
  "#00FFDE",
  "#00FFEA",
  "#00FFFC",
  "#00F6FF",
  "#00EAFF",
  "#00DFFF",
  "#00D3FF",
  "#00C7FF",
  "#00BBFF",
  "#00AFFF",
  "#00A4FF",
  "#0098FF",
  "#008CFF",
  "#0080FF",
  "#0074FF",
  "#0069FF",
  "#005DFF",
  "#0051FF",
  "#0045FF",
  "#0039FF",
  "#002DFF",
  "#0022FF",
  "#0016FF",
  "#020CFF",
  "#0604FF",
  "#0E00FF",
  "#1900FF",
  "#2500FF",
  "#3100FF",
  "#3D00FF",
  "#4900FF",
  "#5400FF",
  "#6000FF",
  "#6C00FF",
  "#7800FF",
  "#8400FF",
  "#9000FF",
  "#9B00FF",
  "#A700FF",
  "#B300FF",
  "#BF00FF",
  "#CB00FF",
  "#D600FF",
  "#E200FF",
  "#EE00FF",
  "#F800FD",
  "#FC00F5",
  "#FF00ED",
  "#FF00E1",
  "#FF00D5",
  "#FF00C9",
  "#FF00BD",
  "#FF00B1",
  "#FF00A6",
  "#FF009A",
  "#FF008E",
  "#FF0082",
  "#FF0076",
  "#FF006B",
  "#FF005F",
  "#FF0053",
  "#FF0047",
  "#FF003B",
  "#FF0030",
  "#FF0024",
  "#FF0018"
], G = [0, 0, 0], Zu = {
  0: G,
  1: G,
  2: G,
  3: G,
  4: G,
  5: G,
  6: G,
  7: G,
  8: G,
  9: G,
  10: G,
  11: G,
  12: G,
  13: G,
  14: G,
  15: G,
  16: G,
  17: G,
  18: G,
  19: G,
  20: G,
  21: G,
  22: G,
  23: G,
  24: G,
  25: G,
  26: G,
  27: G,
  28: G,
  29: G,
  30: G,
  31: G,
  32: G,
  33: G,
  34: G,
  35: G,
  36: G,
  37: G,
  38: G,
  39: G,
  40: G,
  41: G,
  42: G,
  43: G,
  44: G,
  45: G,
  46: G,
  47: G,
  48: G,
  49: G,
  50: G,
  51: G,
  52: G,
  53: G,
  54: G,
  55: G,
  56: G,
  57: G,
  58: G,
  59: G,
  60: G,
  61: G,
  62: G,
  63: G,
  64: G,
  65: G,
  66: G,
  67: G,
  68: G,
  69: G,
  70: G,
  71: G,
  72: G,
  73: G,
  74: G,
  75: G,
  76: G,
  77: G,
  78: G,
  79: G,
  80: G,
  81: G,
  82: G,
  83: G,
  84: G,
  85: G,
  86: G,
  87: G,
  88: G,
  89: G,
  90: G,
  91: G,
  92: G,
  93: G,
  94: G,
  95: G,
  96: G,
  97: G,
  98: G,
  99: G,
  100: G,
  101: G,
  102: G,
  103: G,
  104: G,
  105: G,
  106: G,
  107: G,
  108: G,
  109: G,
  110: G,
  111: G,
  112: G,
  113: G,
  114: G,
  115: G,
  116: G,
  117: G,
  118: G
}, K = [0.9, 0.9, 0.9], Qu = {
  "-1": [0.8, 0.8, 0.8],
  0: [0.9, 0.9, 0.9],
  1: [0.9, 0.9, 0.9],
  6: [0.9, 0.9, 0.9],
  7: [0.33, 0.41, 0.92],
  8: [1, 0.2, 0.2],
  9: [0.2, 0.8, 0.8],
  15: [1, 0.5, 0],
  16: [0.8, 0.8, 0],
  17: [0, 0.802, 0],
  35: [0.71, 0.4, 0.07],
  53: [0.89, 4e-3, 1],
  201: [0.68, 0.85, 0.9]
}, ef = {
  "-1": K,
  0: K,
  1: K,
  2: K,
  3: K,
  4: K,
  5: K,
  6: K,
  7: K,
  8: K,
  9: K,
  10: K,
  11: K,
  12: K,
  13: K,
  14: K,
  15: K,
  16: K,
  17: K,
  18: K,
  19: K,
  20: K,
  21: K,
  22: K,
  23: K,
  24: K,
  25: K,
  26: K,
  27: K,
  28: K,
  29: K,
  30: K,
  31: K,
  32: K,
  33: K,
  34: K,
  35: K,
  36: K,
  37: K,
  38: K,
  39: K,
  40: K,
  41: K,
  42: K,
  43: K,
  44: K,
  45: K,
  46: K,
  47: K,
  48: K,
  49: K,
  50: K,
  51: K,
  52: K,
  53: K,
  54: K,
  55: K,
  56: K,
  57: K,
  58: K,
  59: K,
  60: K,
  61: K,
  62: K,
  63: K,
  64: K,
  65: K,
  66: K,
  67: K,
  68: K,
  69: K,
  70: K,
  71: K,
  72: K,
  73: K,
  74: K,
  75: K,
  76: K,
  77: K,
  78: K,
  79: K,
  80: K,
  81: K,
  82: K,
  83: K,
  84: K,
  85: K,
  86: K,
  87: K,
  88: K,
  89: K,
  90: K,
  91: K,
  92: K,
  93: K,
  94: K,
  95: K,
  96: K,
  97: K,
  98: K,
  99: K,
  100: K,
  101: K,
  102: K,
  103: K,
  104: K,
  105: K,
  106: K,
  107: K,
  108: K,
  109: K,
  110: K,
  111: K,
  112: K,
  113: K,
  114: K,
  115: K,
  116: K,
  117: K,
  118: K,
  201: K
}, tf = {
  backgroundColour: [0, 0, 0, 0],
  annotationColour: [0.9, 0.9, 0.9, 1],
  atomNoteColour: [0.9, 0.9, 0.9, 1],
  legendColour: [0.9, 0.9, 0.9, 1],
  symbolColour: [0.9, 0.9, 0.9, 1],
  variableAttachmentColour: [0.3, 0.3, 0.3, 1]
};
function ur() {
  return lo() === "dark";
}
function za() {
  return Je[ur() ? "dark" : "light"].canvas2DBg;
}
function Kr() {
  return Je[ur() ? "dark" : "light"].netMol2dBg;
}
function nf() {
  return Je[ur() ? "dark" : "light"].netMol2dCaption;
}
function fr(e) {
  return ur() ? {
    ...tf,
    atomColourPalette: e === "mono" ? ef : Qu
  } : e === "mono" ? { atomColourPalette: Zu } : {};
}
const rf = "rdkit", of = !0, sf = !0, af = !0, cf = !0, lf = "rdkit", df = "filled", uf = 0.42, ff = 1.5, pf = !0, hf = "show", mf = "mono", gf = 0.51, yf = 0.74, $f = 1.6, bf = 1.7, vf = 5, wf = 0.3, _f = "#d62828", Sf = "#d62828", kf = "#015ab5", Cf = !1, Ef = "", xf = "#7c3aed", Af = {
  layout: rf,
  alignPair: of,
  atomNumbers: sf,
  createdDestroyed: af,
  modified: cf,
  style: lf,
  circles: df,
  circleRadius: uf,
  circleStroke: ff,
  boundary: pf,
  hydrogens: hf,
  elementColors: mf,
  numScale: gf,
  labelScale: yf,
  bondWidth: $f,
  markWidth: bf,
  haloWidth: vf,
  haloOpacity: wf,
  destroyedColor: _f,
  createdColor: Sf,
  modifiedColor: kf,
  stereo: Cf,
  customSpec: Ef,
  customColor: xf
}, Pf = {
  layout: "rdkit",
  alignPair: !0,
  style: "rdkit",
  createdDestroyed: !0,
  modified: !0,
  destroyedColor: Ar.uniqueAtom,
  createdColor: Ar.uniqueAtom,
  modifiedColor: Ar.elementChange,
  boundary: !0,
  circles: "outline",
  circleRadius: 0.3,
  circleStroke: 1.2,
  hydrogens: "show",
  elementColors: "mono",
  atomNumbers: !0,
  stereo: !1,
  numScale: 0.5,
  labelScale: 0.6,
  bondWidth: 2,
  markWidth: 2,
  haloWidth: 10,
  haloOpacity: 0.35,
  customSpec: "",
  customColor: "#7C3AED"
}, Rf = ["rdkit", "coordgen", "conformer"], Mf = ["rdkit", "recolor", "halo"], Nf = ["outline", "filled", "off"], Of = ["show", "dim", "hide"], Tf = ["cpk", "mono"], Ff = {
  circleRadius: [0.12, 0.6],
  circleStroke: [0.4, 4],
  numScale: [0.15, 0.9],
  labelScale: [0.3, 0.9],
  bondWidth: [0.5, 5],
  markWidth: [0.5, 6],
  haloWidth: [2, 26],
  haloOpacity: [0.1, 1]
}, zf = /^#[0-9a-fA-F]{6}$/;
function Ot(e, t, n) {
  return typeof e == "string" && t.includes(e) ? e : n;
}
function Ze(e, t, n) {
  if (typeof e != "number" || !isFinite(e)) return n;
  const r = Ff[t];
  return r ? Math.min(r[1], Math.max(r[0], e)) : e;
}
const bt = (e, t) => typeof e == "boolean" ? e : t, Ln = (e, t) => typeof e == "string" && zf.test(e) ? e : t;
function jf(e) {
  const t = e && typeof e == "object" ? e : {}, n = Pf;
  return {
    version: 1,
    layout: Ot(t.layout, Rf, n.layout),
    alignPair: bt(t.alignPair, n.alignPair),
    style: Ot(t.style, Mf, n.style),
    createdDestroyed: bt(t.createdDestroyed, n.createdDestroyed),
    modified: bt(t.modified, n.modified),
    destroyedColor: Ln(t.destroyedColor, n.destroyedColor),
    createdColor: Ln(t.createdColor, n.createdColor),
    modifiedColor: Ln(t.modifiedColor, n.modifiedColor),
    boundary: bt(t.boundary, n.boundary),
    circles: Ot(t.circles, Nf, n.circles),
    circleRadius: Ze(t.circleRadius, "circleRadius", n.circleRadius),
    circleStroke: Ze(t.circleStroke, "circleStroke", n.circleStroke),
    hydrogens: Ot(t.hydrogens, Of, n.hydrogens),
    elementColors: Ot(t.elementColors, Tf, n.elementColors),
    atomNumbers: bt(t.atomNumbers, n.atomNumbers),
    stereo: bt(t.stereo, n.stereo),
    numScale: Ze(t.numScale, "numScale", n.numScale),
    labelScale: Ze(t.labelScale, "labelScale", n.labelScale),
    bondWidth: Ze(t.bondWidth, "bondWidth", n.bondWidth),
    markWidth: Ze(t.markWidth, "markWidth", n.markWidth),
    haloWidth: Ze(t.haloWidth, "haloWidth", n.haloWidth),
    haloOpacity: Ze(t.haloOpacity, "haloOpacity", n.haloOpacity),
    customSpec: typeof t.customSpec == "string" ? t.customSpec : n.customSpec,
    customColor: Ln(t.customColor, n.customColor)
  };
}
const Te = jf(Af);
function If(e) {
  const t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = 5e3;
  for (const s of String(e || "").split(/[,\s;]+/).filter(Boolean)) {
    const o = /^([LlRr])[:=](.*)$/.exec(s), i = o ? o[1].toLowerCase() === "l" ? "left" : "right" : "both", a = o ? o[2] : s, c = (d) => {
      i !== "right" && t.add(d), i !== "left" && n.add(d);
    }, l = /^(\d+)-(\d+)$/.exec(a);
    if (l) {
      const d = Math.min(+l[1], +l[2]), m = Math.min(Math.max(+l[1], +l[2]), d + r - 1);
      for (let b = d; b <= m; b++) c(b);
    } else /^\d+$/.test(a) && c(+a);
  }
  return { left: t, right: n };
}
function Pr(e, t, n) {
  const r = [];
  for (let s = 0; s < e.bonds.length; s++) {
    const [o, i] = e.bonds[s], a = t.has(o), c = t.has(i);
    (n ? a || c : a && c) && r.push(s);
  }
  return r;
}
function gi(e) {
  return `0x${e.replace("#", "")}`;
}
function Gr(e) {
  const t = e.replace("#", "");
  return [
    parseInt(t.slice(0, 2), 16) / 255,
    parseInt(t.slice(2, 4), 16) / 255,
    parseInt(t.slice(4, 6), 16) / 255
  ];
}
function Df(e, t) {
  return [
    1 - (1 - e[0]) * (1 - t),
    1 - (1 - e[1]) * (1 - t),
    1 - (1 - e[2]) * (1 - t)
  ];
}
function Lf(e, t, n) {
  const r = new Set(t.atoms), s = new Set(Pr(e, r, !0));
  return {
    deletions: Pr(e, r, n),
    changes: Pr(e, new Set(t.elements), n).filter((o) => !s.has(o))
  };
}
function ja(e, t, n, r) {
  const s = Lf(t, n, e.boundary), o = [];
  return e.createdDestroyed && n.atoms.length && o.push({
    atoms: new Set(n.atoms),
    bonds: s.deletions,
    color: r === "left" ? e.destroyedColor : e.createdColor,
    blackLabelOnFill: !0,
    edgeOnFill: !1
  }), e.modified && n.elements.length && o.push({
    atoms: new Set(n.elements),
    bonds: s.changes,
    color: e.modifiedColor,
    blackLabelOnFill: !1,
    edgeOnFill: !0
  }), o;
}
let vt = null;
function Bf(e) {
  if (vt !== null) return vt;
  vt = !1;
  let t = null;
  try {
    t = e.get_mol("CC"), t && (vt = /class\s*=\s*['"][^'"]*bond-0/.test(t.get_svg(60, 60)));
  } catch {
  } finally {
    if (t)
      try {
        t.delete();
      } catch {
      }
  }
  return vt || console.warn("[alchemy-viz] this RDKit build emits no bond/atom classes - drawing without bond marking"), vt;
}
function qf(e, t) {
  return e.style === "rdkit" ? "rdkit" : Bf(t) ? e.style : "rdkit";
}
function Vf(e, t, n, r, s, o) {
  const i = {
    width: t,
    height: t,
    addAtomIndices: e.atomNumbers,
    addStereoAnnotation: e.stereo,
    annotationFontScale: e.numScale,
    baseFontSize: e.labelScale,
    bondLineWidth: e.bondWidth,
    scaleBondWidth: !1
  };
  Object.assign(i, fr(e.elementColors)), s === "rdkit" && (i.continuousHighlight = !1);
  const a = {}, c = {}, l = {};
  for (const v of n) {
    const $ = Gr(v.color);
    if (s === "rdkit") for (const u of v.bonds) l[u] = $;
    if (s === "recolor" && e.circles === "off") continue;
    const w = s === "recolor" && e.circles === "filled" ? Df($, 0.7) : $;
    for (const u of v.atoms)
      a[u] = w, c[u] = e.circleRadius;
  }
  const d = Gr(e.customColor);
  for (const v of r)
    v < o && (a[v] = d, c[v] = e.circleRadius);
  const m = Object.keys(a).map(Number);
  m.length && (i.atoms = m, i.highlightAtomColors = a, i.highlightAtomRadii = c);
  const b = Object.keys(l).map(Number);
  return b.length && (i.bonds = b, i.highlightBondColors = l), i;
}
function Uf(e, t, n, r) {
  let s = null;
  try {
    return s = e.get_mol(t, JSON.stringify({ removeHs: !1 })), s ? s.get_svg_with_highlights ? s.get_svg_with_highlights(JSON.stringify(r)) || null : s.get_svg(n, n) || null : null;
  } catch (o) {
    return console.warn("[alchemy-viz] mol2dStyledSVG threw -", ve(o)), null;
  } finally {
    if (s)
      try {
        s.delete();
      } catch {
      }
  }
}
const Hf = "http://www.w3.org/2000/svg";
function Ia(e, t) {
  return Array.from(e.querySelectorAll(`[class~="bond-${t}"]`));
}
function So(e, t, n) {
  const r = [];
  for (const s of Array.from(e.querySelectorAll(`[class~="atom-${t}"]`))) {
    if (/(^|\s)bond-\d+(\s|$)/.test(s.getAttribute("class") || "")) continue;
    const o = s.tagName.toLowerCase();
    (o === "ellipse" || o === "circle" || o === "rect") === n && r.push(s);
  }
  return r;
}
function Da(e) {
  const n = e.style?.fill || e.getAttribute("fill") || "";
  return !!n && n !== "none";
}
function yi(e, t, n, r, s, o) {
  for (const i of r)
    for (const a of Ia(e, i)) {
      const c = a.style;
      Da(a) ? c.fill = s : (c.stroke = s, c.strokeWidth = `${t.markWidth}px`);
    }
  if (o)
    for (const i of n)
      for (const a of So(e, i, !1)) a.style.fill = o;
}
function Kf(e, t, n, r) {
  const s = e.ownerDocument;
  if (!s) return;
  const o = s.createElementNS(Hf, "g");
  o.setAttribute("data-gufe-halo", "1"), o.style.opacity = String(t.haloOpacity);
  for (const a of n)
    for (const c of Ia(e, a)) {
      if (Da(c)) continue;
      const l = c.cloneNode(!0);
      l.removeAttribute("class"), l.style.fill = "none", l.style.stroke = r, l.style.strokeWidth = `${t.haloWidth}px`, l.style.strokeLinecap = "round", l.style.strokeLinejoin = "round", l.style.strokeOpacity = "1", o.appendChild(l);
    }
  if (!o.childNodes.length) return;
  const i = e.querySelector("rect");
  i?.nextSibling ? e.insertBefore(o, i.nextSibling) : i ? e.appendChild(o) : e.insertBefore(o, e.firstChild);
}
function Gf(e, t, n, r, s) {
  for (const o of n)
    if (!r.has(o))
      for (const i of So(e, o, !0)) {
        const a = i.style;
        a.fill = "none", a.stroke = s, a.strokeWidth = `${t.circleStroke}px`;
      }
}
function Wf(e, t, n, r, s) {
  for (const o of n)
    if (!r.has(o))
      for (const i of So(e, o, !0)) {
        const a = i.style;
        a.stroke = s, a.strokeWidth = `${t.circleStroke}px`;
      }
}
function Jf(e, t, n) {
  if (n.hydrogens !== "show") {
    for (let r = 0; r < t.symbols.length; r++)
      if (t.symbols[r] === "H")
        for (const s of Array.from(e.querySelectorAll(`[class~="atom-${r}"]`))) {
          const o = s.style;
          n.hydrogens === "hide" ? o.display = "none" : o.opacity = "0.22";
        }
  }
}
function Yf(e, t, n, r, s, o) {
  if (o !== "rdkit")
    for (const i of r)
      if (o === "recolor") {
        const a = n.circles === "filled";
        yi(
          e,
          n,
          i.atoms,
          i.bonds,
          i.color,
          a && i.blackLabelOnFill ? "#000000" : i.color
        ), n.circles === "outline" ? Gf(e, n, i.atoms, s, i.color) : a && i.edgeOnFill && Wf(e, n, i.atoms, s, i.color);
      } else
        Kf(e, n, i.bonds, i.color), yi(e, n, i.atoms, i.bonds, i.color, null);
  Jf(e, t, n);
}
const pr = `
`, Wr = "$$$$";
function Jr(e, t) {
  if (!e || !e.trim()) throw new Error("empty SDF");
  const n = e.replace(/\r/g, "").split(pr);
  if (n.length < 4) throw new Error("SDF too short");
  const r = n[3];
  if (r.indexOf("V3000") !== -1) throw new Error("V3000 molfiles are not supported");
  const s = parseInt(r.substring(0, 3), 10), o = parseInt(r.substring(3, 6), 10);
  if (!isFinite(s) || s <= 0) throw new Error(`bad counts line: ${r}`);
  const i = [], a = [];
  for (let d = 0; d < s; d++) {
    const m = n[4 + d];
    if (m == null) throw new Error("truncated atom block");
    i.push([
      parseFloat(m.substring(0, 10)) || 0,
      parseFloat(m.substring(10, 20)) || 0,
      parseFloat(m.substring(20, 30)) || 0
    ]), a.push(m.substring(31, 34).trim() || "X");
  }
  const c = [];
  for (let d = 0; d < (isFinite(o) ? o : 0); d++) {
    const m = n[4 + s + d];
    if (m == null) break;
    const b = parseInt(m.substring(0, 3), 10), v = parseInt(m.substring(3, 6), 10), $ = parseInt(m.substring(6, 9), 10);
    !isFinite(b) || !isFinite(v) || c.push([b - 1, v - 1, isFinite($) ? $ : 1]);
  }
  return { name: (n[0] || "").trim() || t || "molecule", symbols: a, bonds: c, coords: i };
}
function Xf(e) {
  const t = e.symbols.length, n = e.bonds.length, r = [
    e.name || "",
    "  Generated",
    "",
    `${String(t).padStart(3)}${String(n).padStart(3)}  0  0  0  0  0  0  0  0999 V2000`
  ];
  for (let s = 0; s < t; s++) {
    const o = e.coords[s];
    r.push(
      o[0].toFixed(4).padStart(10) + o[1].toFixed(4).padStart(10) + o[2].toFixed(4).padStart(10) + ` ${e.symbols[s].padEnd(3)} 0  0  0  0  0  0  0  0  0  0  0  0`
    );
  }
  for (let s = 0; s < n; s++) {
    const o = e.bonds[s], i = o[2] === 12 ? 4 : o[2];
    r.push(
      String(o[0] + 1).padStart(3) + String(o[1] + 1).padStart(3) + String(i).padStart(3) + "  0  0  0  0"
    );
  }
  return r.push("M  END"), r.join(pr);
}
const Zf = (e) => `${Xf(e)}${pr}${Wr}`, La = (e) => e.indexOf(Wr) >= 0 ? e : `${e}${pr}${Wr}`;
function ko(e) {
  const t = String(e).split(/\r?\n/);
  if (t.length < 4) return null;
  const n = parseInt(t[3].slice(0, 3), 10), r = parseInt(t[3].slice(3, 6), 10);
  return isNaN(n) || isNaN(r) ? null : { atoms: n, bonds: r };
}
function Co(e, t, n, r, s, o) {
  let i = null;
  try {
    if (i = e.get_mol(t, JSON.stringify({ removeHs: !0 })), !i) return null;
    if (r !== "conformer")
      try {
        i.set_new_coords(r === "coordgen");
      } catch {
      }
    const a = s?.atoms.length ? s : null, c = !!o && Object.keys(o).length > 0;
    if ((a || c) && i.get_svg_with_highlights) {
      const l = { width: n, height: n, ...o };
      if (a) {
        const d = {}, m = {};
        for (const b of a.atoms)
          d[b] = a.color, m[b] = a.radius;
        l.atoms = [...a.atoms], l.highlightAtomColors = d, l.highlightAtomRadii = m;
      }
      return i.get_svg_with_highlights(JSON.stringify(l)) || null;
    }
    return i.get_svg(n, n) || null;
  } catch (a) {
    return console.warn("[alchemy-viz] mol2dSVG threw -", ve(a)), null;
  } finally {
    if (i)
      try {
        i.delete();
      } catch {
      }
  }
}
function Ba(e, t, n) {
  e.innerHTML = t;
  const r = e.querySelector("svg");
  r && (r.removeAttribute("width"), r.removeAttribute("height"), r.getAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${n} ${n}`), r.setAttribute("preserveAspectRatio", "xMidYMid meet"), r.setAttribute("style", "width:100%;height:100%;max-width:100%;max-height:100%;"));
}
const $i = [
  { id: "2d", label: "2D", title: "The 2D depiction" },
  { id: "stick", label: "Stick", title: "Sticks only" },
  { id: "ball", label: "Ball+Stick", title: "Ball and stick" },
  { id: "sphere", label: "Sphere", title: "Space-filling spheres" },
  { id: "info", label: "Info", title: "Name, SMILES, charge and the counts" }
], Yr = {
  stick: { stick: { radius: 0.15, colorscheme: "Jmol" } },
  ball: { stick: { radius: 0.12, colorscheme: "Jmol" }, sphere: { scale: 0.28, colorscheme: "Jmol" } },
  sphere: { sphere: { scale: 1, colorscheme: "Jmol" } }
}, wt = (e) => e in Yr, bi = 400, Rr = "position:absolute;inset:0;min-width:0;min-height:0;";
class Qf extends Fe {
  placeholder() {
    return "Waiting for a SmallMoleculeComponent payload...";
  }
  renderView(t, n) {
    const r = n.sdf, s = n.name ?? "", o = n.smiles, i = n.total_charge, a = N("div", "flex:1;position:relative;min-height:0;overflow:hidden;");
    t.appendChild(a);
    const c = N(
      "div",
      `${Rr}display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8px;background:${za()};`
    );
    a.appendChild(c);
    const l = _a();
    l.wrap.style.cssText = Rr, a.appendChild(l.wrap);
    const d = N(
      "div",
      `${Rr}overflow:auto;padding:16px 20px;background:${j.panelBg};color:${j.textPrimary};font-size:${ee.body};`
    );
    a.appendChild(d);
    const m = r ? ko(r) : null, b = [
      ["Name", s || Qe, !1],
      ["SMILES", o || Qe, !0],
      ["Charge", i == null ? Qe : String(i), !1],
      ["Atoms", m ? String(m.atoms) : Qe, !1],
      ["Bonds", m ? String(m.bonds) : Qe, !1]
    ], v = N("div", `display:grid;grid-template-columns:auto minmax(0,1fr);gap:${X.xl} 20px;align-items:baseline;`);
    d.appendChild(v);
    for (const [R, L, I] of b) {
      v.appendChild(
        N(
          "div",
          `font-size:${ee.tiny};font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;color:${j.textMuted2};`,
          R
        )
      );
      const Q = N(
        "div",
        `user-select:text;cursor:text;overflow-wrap:anywhere;color:${j.textPrimary}` + (I ? `;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:${ee.small};` : ""),
        L
      );
      Q.title = L, v.appendChild(Q);
    }
    const $ = ho(t), w = N("div", uo, s || "Unnamed molecule");
    $ && a.appendChild(w);
    const u = ut(
      "small-molecule.mode",
      "2d",
      $i.map((R) => R.id)
    ), g = ct("small-molecule.spin", !1);
    let h = u.get(), _ = g.get(), S = null, f = null;
    const p = () => {
      try {
        S?.spin(_ && wt(h) ? "y" : !1);
      } catch {
      }
    }, y = (R) => {
      h = R, c.style.visibility = h === "2d" ? "visible" : "hidden", l.wrap.style.visibility = wt(h) ? "visible" : "hidden", d.style.visibility = h === "info" ? "visible" : "hidden", w.style.display = h === "info" || !$ ? "none" : "block", A.disabled = !wt(h), A.style.opacity = wt(h) ? "1" : "0.5", wt(h) && S && (S.setStyle({}, Yr[h]), S.resize(), S.render()), p();
    }, C = N("div", wa), A = xa(
      "Spin",
      _,
      (R) => {
        _ = R, p();
      },
      { title: "Toggle continuous rotation", remember: g }
    ), P = (R) => {
      R ? C.insertBefore(A, C.firstChild) : T.buttons.insertBefore(A, T.buttons.lastElementChild);
    }, T = Ea($i, h, (R) => y(R), {
      remember: u,
      onLayout: P,
      fit: { pane: a, bar: C }
    });
    return C.appendChild(T), P(!1), a.appendChild(C), y(h), !r || !r.trim() ? (c.appendChild($e("No molecule provided")), l.container.appendChild($e("No molecule provided")), { cleanup: () => T.cleanup() }) : (c.appendChild($e("Loading 2D depiction...")), wo().then((R) => {
      const L = fr("cpk"), I = Co(R, r, bi, Te.layout, void 0, L);
      I ? Ba(c, I, bi) : c.replaceChildren($e("Failed to parse molecule", !0));
    }).catch((R) => {
      c.replaceChildren($e(`RDKit failed to load: ${ve(R)}`, !0));
    }), l.container.appendChild($e("Loading 3D viewer...")), lr().then(() => {
      l.container.replaceChildren(), S = nt.createViewer(l.container, { backgroundColor: Lt.viewer() }), S.addModel(La(r), "sdf"), S.setStyle({}, Yr[wt(h) ? h : "stick"]), S.zoomTo(), S.render(), f = dr(l.container, S), Fa(S, f), p();
    }).catch((R) => {
      l.container.replaceChildren($e(`3D render failed: ${ve(R)}`, !0));
    }), {
      onResize() {
        S && (S.resize(), S.render());
      },
      cleanup() {
        T.cleanup(), Ta(S, f), f?.cleanup(), f = null, _o(S), S = null;
      }
    });
  }
}
ze("gufe-small-molecule", Qf);
const qa = ["HOH", "WAT", "SOL", "TIP3"], vi = { hetflag: !1 }, ep = { hetflag: !0 }, tp = { resn: qa }, qe = {
  stick: { radius: 0.15 },
  sphere: { scale: 0.3 },
  hetero: { stickRadius: 0.2, sphereScale: 0.28 },
  water: { stickRadius: 0.05, sphereScale: 0.18 },
  /**
   * A bound ligand, drawn thicker than the protein's own hetero atoms.
   *
   * It is the subject of the picture and everything around it is context, so
   * it is the one thing in a complex allowed to be heavier than the rest. The
   * colours stay `Jmol`, as everywhere else in this project - a ligand that
   * changed what its atom colours meant on the way into a pocket would be
   * worse, not clearer.
   */
  ligand: { stickRadius: 0.24, sphereScale: 0.32 },
  surfaceOpacity: 0.85,
  /** Above this many atoms a surface is slow enough to be worth warning about. */
  surfaceAtomWarn: 4e4
};
function Va(e) {
  const t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  let r = 0, s = 0, o = 0, i = 1 / 0, a = -1 / 0;
  for (const c of e.split(/\r?\n/)) {
    const l = c.slice(0, 6);
    if (l === "ENDMDL") break;
    if (l !== "ATOM  " && l !== "HETATM") continue;
    r++, l === "HETATM" && s++;
    const d = c.slice(17, 20).trim(), m = c.slice(21, 22).trim() || "_", b = c.slice(22, 26).trim(), v = c.slice(26, 27).trim();
    qa.indexOf(d) !== -1 && o++, t.add(m), n.add(`${m}|${b}${v}|${d}`);
    const $ = parseInt(b, 10);
    isNaN($) || ($ < i && (i = $), $ > a && (a = $));
  }
  return {
    chains: t.size,
    residues: n.size,
    atoms: r,
    hetatms: s,
    waters: o,
    resiMin: i === 1 / 0 ? 0 : i,
    resiMax: a === -1 / 0 ? 0 : a
  };
}
function Ua(e) {
  return [
    `${Nt(e.chains)} chains`,
    `${Nt(e.residues)} residues`,
    `${Nt(e.atoms)} atoms`,
    `${Nt(e.hetatms)} HETATM` + (e.waters > 0 ? ` (${Nt(e.waters)} water)` : "")
  ];
}
function np(e, t) {
  return e === "chain" ? { colorscheme: "chain" } : e === "ss" ? { colorscheme: "ssJmol" } : e === "spectrum" && t && t.resiMax > t.resiMin ? { colorscheme: { prop: "resi", gradient: "roygb", min: t.resiMin, max: t.resiMax } } : { colorscheme: "Jmol" };
}
function Xr(e, t, n, r, s, o = () => !0) {
  const i = r || (() => {
  }), a = np(t.color, n), c = (l) => s ? { ...l, ...s } : l;
  try {
    e.removeAllSurfaces();
  } catch {
  }
  if (e.setStyle(c({}), {}), e.setStyle(
    c(vi),
    t.rep === "stick" ? { stick: { radius: qe.stick.radius, ...a } } : t.rep === "sphere" ? { sphere: { scale: qe.sphere.scale, ...a } } : (
      // For 'surface' the shell is added separately; leave the atoms bare so
      // it is not cluttered from the inside.
      t.rep === "surface" ? {} : { cartoon: { ...a } }
    )
  ), e.setStyle(
    c(ep),
    t.hetero ? {
      stick: { radius: qe.hetero.stickRadius, colorscheme: "Jmol" },
      sphere: { scale: qe.hetero.sphereScale, colorscheme: "Jmol" }
    } : {}
  ), e.setStyle(
    c(tp),
    t.waters ? {
      stick: { radius: qe.water.stickRadius, colorscheme: "Jmol" },
      sphere: { scale: qe.water.sphereScale, colorscheme: "Jmol" }
    } : {}
  ), t.rep !== "surface") {
    i(null), e.render();
    return;
  }
  i(
    n && n.atoms > qe.surfaceAtomWarn ? "Computing surface (large structure, this may take a while)..." : "Computing surface..."
  ), e.render(), setTimeout(() => {
    if (o())
      try {
        Promise.resolve(
          e.addSurface(
            nt.SurfaceType.VDW,
            { opacity: qe.surfaceOpacity, ...a },
            c(vi)
          )
        ).then(() => {
          o() && (i(null), e.render());
        }).catch((l) => i(`Surface failed: ${ve(l)}`, "error"));
      } catch (l) {
        i(`Surface failed: ${ve(l)}`, "error");
      }
  }, 30);
}
function rp(e, t) {
  e.setStyle(t, {
    stick: { radius: qe.ligand.stickRadius, colorscheme: "Jmol" },
    sphere: { scale: qe.ligand.sphereScale, colorscheme: "Jmol" }
  });
}
const wi = { min: 0.2, max: 0.8 }, Ha = 5, Mr = { min: 130, max: 560, maxShare: "60%" };
function Ka(e, t, n, r = {}) {
  const s = r.min ?? wi.min, o = r.max ?? wi.max, i = N(
    "div",
    `flex:0 0 ${Ha}px;align-self:stretch;touch-action:none;background:${j.splitBorder};`
  );
  i.setAttribute("role", "separator"), i.setAttribute("aria-label", "Resize the panes");
  let a = !1;
  const c = ($) => {
    a = $, e.style.flexDirection = a ? "column" : "row", i.style.cursor = a ? "row-resize" : "col-resize", i.setAttribute("aria-orientation", a ? "horizontal" : "vertical"), r.onOrient?.(a);
  }, l = () => {
    const $ = e.getBoundingClientRect();
    return $.height > $.width;
  };
  let d = Math.min(o, Math.max(s, r.remember?.get() ?? 0.5));
  const m = () => {
    t.style.flex = `1 1 ${(d * 100).toFixed(2)}%`, n.style.flex = `1 1 ${((1 - d) * 100).toFixed(2)}%`;
  };
  m(), c(l()), typeof ResizeObserver < "u" && new ResizeObserver(() => {
    const w = l();
    w !== a && (c(w), r.onResize?.(d));
  }).observe(e);
  let b = !1;
  i.addEventListener("pointerdown", ($) => {
    b = !0, i.setPointerCapture($.pointerId), $.preventDefault();
  }), i.addEventListener("pointermove", ($) => {
    if (!b) return;
    const w = e.getBoundingClientRect(), u = a ? w.height : w.width;
    if (u <= 0) return;
    const g = a ? $.clientY - w.top : $.clientX - w.left;
    d = Math.min(o, Math.max(s, g / u)), m();
  });
  const v = ($) => {
    b && (b = !1, i.releasePointerCapture($.pointerId), r.remember?.set(d), r.onResize?.(d));
  };
  return i.addEventListener("pointerup", v), i.addEventListener("pointercancel", v), i;
}
function Ga(e, t) {
  const n = t.min ?? Mr.min, r = t.max ?? Mr.max, s = t.maxShare ?? Mr.maxShare, o = (b) => Math.min(r, Math.max(n, b));
  let i = o(t.remember?.get() ?? t.initial), a = !1;
  const c = N(
    "div",
    `flex:0 0 ${Ha}px;align-self:stretch;touch-action:none;cursor:col-resize;background:${j.splitBorder};`
  );
  c.setAttribute("role", "separator"), c.setAttribute("aria-orientation", "vertical"), c.setAttribute("aria-label", t.label ?? "Resize the panel");
  const l = () => {
    e.style.flex = a ? "0 0 auto" : `0 0 ${Math.round(i)}px`, e.style.maxWidth = a ? "none" : s, c.style.display = a ? "none" : "block";
  };
  l();
  let d = !1;
  c.addEventListener("pointerdown", (b) => {
    a || (d = !0, c.setPointerCapture(b.pointerId), b.preventDefault());
  }), c.addEventListener("pointermove", (b) => {
    d && (i = o(b.clientX - e.getBoundingClientRect().left), l());
  });
  const m = (b) => {
    d && (d = !1, c.releasePointerCapture(b.pointerId), t.remember?.set(Math.round(i)), t.onResize?.());
  };
  return c.addEventListener("pointerup", m), c.addEventListener("pointercancel", m), {
    element: c,
    orient(b) {
      b !== a && (a = b, l());
    }
  };
}
function Eo(e, t) {
  e.style.setProperty(et.min, t ? "0" : Xn.min), e.style.setProperty(et.max, t ? "none" : Xn.max), e.style.setProperty(et.ruleX, t ? "0" : "1px"), e.style.setProperty(et.ruleY, t ? "1px" : "0"), e.style.maxHeight = t ? yu : "";
}
const op = !1, xo = ".menuOpen";
function sp() {
  const e = N("span", `display:inline-flex;flex-direction:column;gap:${X.xs};justify-content:center;`);
  for (let t = 0; t < 3; t++)
    e.appendChild(N("span", `display:block;width:11px;height:1.5px;border-radius:1px;background:${j.btnFg};`));
  return e;
}
const ip = {
  /** Three bars: the generic form, and the one that reads as a menu. */
  hamburger: sp
}, ap = ip.hamburger;
function Ao(e, t, n = {}) {
  let r = n.remember ? n.remember.get() : n.open ?? op, s = !1;
  const o = N("div", "flex-shrink:0;display:flex;flex-direction:column;min-height:0;"), i = ft(`display:inline-flex;align-items:center;padding:${X.sm};`);
  i.appendChild(ap());
  const a = n.label || "Toggle menu";
  i.setAttribute("aria-label", a), i.title = a;
  const c = () => {
    if (r && !s) {
      s = !0;
      const m = t();
      o.appendChild(m), n.extras?.(m);
    }
    o.style.display = r ? "flex" : "none", i.setAttribute("aria-expanded", String(r));
  }, l = (m) => {
    m !== r && (r = m, c(), n.remember?.set(r), n.onToggle?.(r));
  };
  i.onclick = () => l(!r);
  const d = "toggleEl" in e ? e : null;
  return d && (d.toggleEl.style.marginRight = "2px"), (d ? d.toggleEl : e).appendChild(i), c(), {
    panel: o,
    isOpen: () => r,
    setOpen: l
  };
}
const Wa = "https://framejs.app", Ja = 1e4;
function cp(e) {
  for (let t = e; t; t = t.parentElement)
    if (t.payload != null) return t;
  return null;
}
const lp = "/alchemy-dev-bundle.js";
function dp() {
  let e = "";
  for (const t of document.querySelectorAll("script[type=module]")) {
    const n = t.textContent || "";
    n.length > e.length && (e = n);
  }
  return e.length >= Ja ? e : null;
}
async function up() {
  const e = dp();
  if (e) return { js: e, note: "" };
  try {
    const t = await fetch(lp);
    if (!t.ok) return null;
    const n = await t.text();
    return n.length < Ja ? null : {
      js: n,
      note: "Built from the last `pixi run build`, not from the sources on screen."
    };
  } catch {
    return null;
  }
}
function fp() {
  const e = new Uint8Array(16);
  crypto.getRandomValues(e);
  const t = Date.now();
  for (let n = 0; n < 6; n++) e[n] = Math.floor(t / 2 ** (40 - n * 8)) & 255;
  return e[6] = e[6] & 15 | 112, e[8] = e[8] & 63 | 128, Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("");
}
function pp(e) {
  const t = [];
  return t.push(
    "// A frame opens with its menus closed. Left behind rather than restored:",
    "// which menus one reader had open is where they had got to, not something",
    "// true of the view. The loop is for menus an earlier frame on this origin",
    "// left open, which no setting written below would close.",
    "try {",
    `  const prefix = ${JSON.stringify(Ye)};`,
    `  const menuOpen = ${JSON.stringify(xo)};`,
    "  for (const key of Object.keys(localStorage)) {",
    "    if (key.startsWith(prefix) && key.endsWith(menuOpen)) localStorage.removeItem(key);",
    "  }",
    "} catch (e) {",
    '  console.warn("[alchemy-viz] could not clear menu state:", e);',
    "}"
  ), Object.keys(e.settings).length && t.push(
    "// The settings the page had, written where `settings.ts` looks for them.",
    "try {",
    `  const stored = ${JSON.stringify(e.settings)};`,
    "  for (const key of Object.keys(stored)) localStorage.setItem(key, stored[key]);",
    "} catch (e) {",
    '  console.warn("[alchemy-viz] could not restore settings:", e);',
    "}"
  ), Object.keys(e.views).length && t.push(
    "// Where the camera was, what was selected, where the layout settled.",
    `globalThis[${JSON.stringify(Sa)}] = ${JSON.stringify(e.views)};`
  ), t.length ? [...t, ""] : t;
}
function hp(e, t, n) {
  const r = JSON.stringify(JSON.stringify(t));
  return [
    ...pp(n),
    "// Built by alchemy-viz's share button from a generated page. The bundle below is",
    "// that page's own script, unchanged; everything above it exists so the",
    "// bootstrap at the end of it finds the three elements it looks up.",
    'root.innerHTML = "";',
    'const gufeError = document.createElement("div");',
    'gufeError.id = "gufe-error";',
    'gufeError.style.cssText = "display:none;padding:12px 16px;white-space:pre-wrap;font-family:ui-monospace,monospace;color:#991b1b;background:#fee2e2;";',
    "root.appendChild(gufeError);",
    'const gufePayload = document.createElement("script");',
    'gufePayload.type = "application/json";',
    'gufePayload.id = "gufe-payload";',
    `gufePayload.textContent = ${r};`,
    "root.appendChild(gufePayload);",
    'const alchemyView = document.createElement("alchemy-view");',
    'alchemyView.style.cssText = "display:block;width:100%;height:100%;";',
    "root.appendChild(alchemyView);",
    "",
    e,
    "",
    "// A generated page's bootstrap has drawn the payload by now. A bundle on its",
    "// own ends at `export` and has not, so this is what draws it there. Reading",
    "// the property rather than tracking which case we are in keeps the two from",
    "// having to agree about anything.",
    "if (alchemyView.payload == null) {",
    "  alchemyView.payload = JSON.parse(gufePayload.textContent);",
    "}"
  ].join(`
`);
}
function mp(e) {
  const t = {}, n = e.viewState?.();
  n != null && (t[e.tagName.toLowerCase().replace(/^gufe-/, "")] = n);
  const r = {};
  for (const [s, o] of Object.entries(Du()))
    s.endsWith(xo) || (r[s] = o);
  return { settings: r, views: t };
}
const gp = (e) => `${Wa}/j/${e}`, yp = (e) => `${Wa}/j/${e}.json`;
async function $p(e, t, n, r) {
  await fetch(yp(e), {
    method: "POST",
    mode: "no-cors",
    // Not `application/json`: that would make the request preflighted, and
    // framejs.app serves no OPTIONS. `text/plain` is CORS-simple and the server
    // parses the body regardless.
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({
      js: t,
      og: { title: n, description: r }
    })
  });
}
function bp() {
  const e = N("span", "display:inline-flex;flex:0 0 auto;width:14px;height:14px;");
  return e.innerHTML = '<svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="6" fill="#fbfaf7"/><rect x="6.4" y="6.4" width="19.2" height="19.2" rx="3.6" fill="none" stroke="#1f2edb" stroke-width="2.2"/></svg>', e;
}
function Po(e) {
  const t = N(
    "div",
    `display:flex;flex-direction:column;gap:${X.md};padding-top:${X.lg};border-top:1px solid ${j.splitBorder};`
  ), n = ft(`width:100%;display:inline-flex;align-items:center;justify-content:center;gap:${X.md};`);
  n.appendChild(bp()), n.appendChild(N("span", "", "Share to the web")), n.title = "Upload this view as a framejs app and open it in a new tab", t.appendChild(n);
  const r = N("div", `font-size:${ee.tiny};line-height:1.5;color:${j.textMuted2};overflow-wrap:anywhere;`);
  t.appendChild(r);
  const s = (i, a = !1) => {
    r.replaceChildren(i), r.style.color = a ? j.errorFg : j.textMuted2;
  }, o = (i, a) => {
    const c = N("a", `color:${j.textPrimary};`, i);
    c.href = i, c.target = "_blank", c.rel = "noreferrer", r.replaceChildren(c), a && r.appendChild(N("div", `padding-top:${X.sm};`, a)), r.style.color = j.textMuted2;
  };
  n.onclick = () => {
    const i = cp(e);
    if (!i || i.payload == null) {
      s("Could not find the payload for this view.", !0);
      return;
    }
    const a = i.payload, c = mp(i), l = window.open("", "_blank"), d = fp(), b = String(a.type || "alchemy-viz"), v = `${b}. Shared from alchemy-viz`, $ = () => {
      n.disabled = !1;
    };
    n.disabled = !0, s("Uploading..."), up().then((w) => {
      if (!w) {
        l?.close(), $(), s(
          "No bundle to send: this page has none inlined, and the dev server did not answer either. Export the page with to_html, or run `pixi run build`.",
          !0
        );
        return;
      }
      return $p(d, hp(w.js, a, c), b, v).then(() => {
        $();
        const u = gp(d);
        l && (l.location.href = u), o(u, w.note);
      });
    }).catch((w) => {
      $(), l?.close(), s(`Upload failed: ${w instanceof Error ? w.message : String(w)}`, !0);
    });
  }, t.appendChild(
    N(
      "div",
      `font-size:${ee.tiny};line-height:1.5;color:${j.textMuted2};`,
      "Uploads the page to framejs.app. Unclaimed frames expire."
    )
  ), e.appendChild(t);
}
const _i = [
  { id: "cartoon", label: "Cartoon", title: "Ribbon / cartoon backbone" },
  { id: "surface", label: "Surface", title: "Molecular (VDW) surface" },
  { id: "stick", label: "Stick", title: "All-atom sticks" },
  { id: "sphere", label: "Sphere", title: "Space-filling spheres" }
], Si = [
  { id: "chain", label: "Chain" },
  { id: "spectrum", label: "Spectrum" },
  { id: "ss", label: "Secondary structure" },
  { id: "element", label: "Element" }
], ki = /* @__PURE__ */ new Map();
function Zr(e) {
  return !Array.isArray(e) || e.length < 4 ? null : e.every((t) => typeof t == "number" && Number.isFinite(t)) ? e.slice() : null;
}
function vp(e) {
  const t = e.tagName.toLowerCase().replace(/^gufe-/, ""), n = ka(t);
  return !n || typeof n != "object" ? null : Zr(n.camera);
}
function Ya(e) {
  const t = ut(
    "protein.representation",
    e.rep ?? "cartoon",
    _i.map((C) => C.id)
  ), n = ut(
    "protein.color",
    "chain",
    Si.map((C) => C.id)
  ), r = ct("protein.waters", e.waters), s = ct("protein.hetero", !1), o = ct("protein.spin", !1), i = {
    rep: t.get(),
    color: n.get(),
    waters: r.get(),
    hetero: s.get(),
    spin: o.get()
  };
  let a = vp(e.element), c = null, l = null, d = !0;
  const m = N("div", "flex:1;min-height:0;position:relative;display:flex;flex-direction:row;");
  e.host.appendChild(m);
  const b = N("div", wu);
  m.appendChild(b);
  const v = ({ label: C, controls: A }) => {
    const P = N("div", "display:flex;flex-direction:column;gap:6px;min-width:0;flex-shrink:0;");
    P.appendChild(
      N(
        "span",
        `font-size:${ee.tiny};font-weight:${ge.bold};letter-spacing:.08em;text-transform:uppercase;color:${j.textMuted};`,
        C
      )
    );
    for (const T of A) P.appendChild(T);
    return P;
  }, $ = N("div", `display:flex;flex-direction:column;gap:2px;font-size:${ee.small};color:${j.textMuted};`), w = v({ label: "Contents", controls: [$] });
  w.style.display = "none";
  const g = Ao(b, () => {
    const C = N("div", `${va}padding-top:${_u};`), A = Ct(
      _i,
      i.rep,
      (I) => {
        i.rep = I, e.restyle();
      },
      t
    );
    C.appendChild(v({ label: "Style", controls: [A] }));
    const P = yo(
      Si,
      i.color,
      (I) => {
        i.color = I, e.restyle();
      },
      n
    );
    P.style.cssText += "width:100%;box-sizing:border-box;", C.appendChild(v({ label: "Color", controls: [P] }));
    const T = N("div", "display:flex;flex-wrap:wrap;gap:4px;"), R = [
      ["waters", "Waters", "Show water molecules", r, () => e.restyle()],
      ["hetero", "Hetero", e.heteroTitle, s, () => e.restyle()],
      ["spin", "Spin", "Rotate the view continuously", o, () => c?.spin(i.spin ? "y" : !1)]
    ];
    for (const [I, Q, V, q, Y] of R)
      T.appendChild(
        xa(
          Q,
          i[I],
          (re) => {
            i[I] = re, Y();
          },
          { title: V, remember: q }
        )
      );
    C.appendChild(v({ label: "Show", controls: [T] }));
    const L = Na(() => e.reset ? e.reset() : l?.reset());
    return L.style.cssText += "width:100%;box-sizing:border-box;", C.appendChild(v({ label: "Camera", controls: [...e.camera?.() ?? [], L] })), C.appendChild(w), C;
  }, {
    label: e.menuLabel,
    // Where one reader had got to rather than a preference about structures -
    // hence the `.menuOpen` key, which is what tells the two apart. Shared
    // between the views for the same reason the controls are.
    remember: ct(`protein${xo}`, !1),
    // Toggling changes how wide the viewer is, and 3Dmol sizes its canvas once:
    // without this the molecule is drawn at the old width, stretched.
    onToggle: () => {
      c?.resize(), c?.render();
    },
    extras: Po
  }), h = ho(e.element) ? e.title || e.fallbackTitle : "";
  h && b.appendChild(
    N("div", `${vu}pointer-events:none;font-size:${ee.heading};font-weight:${ge.bold};`, h)
  ), m.appendChild(g.panel);
  const _ = _a();
  m.appendChild(_.wrap);
  const S = co(m, (C) => {
    m.style.flexDirection = C ? "column" : "row", Eo(g.panel, C), c?.resize(), c?.render();
  }), f = N(
    "div",
    `position:absolute;top:12px;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:6px;font-size:${ee.body};z-index:20;display:none;pointer-events:none;`
  );
  _.wrap.appendChild(f);
  const p = (C, A) => {
    if (C == null) {
      f.style.display = "none";
      return;
    }
    f.textContent = C, f.style.display = "block";
    const P = A === "error";
    f.style.background = P ? j.warnBg : j.toolbarBg, f.style.color = P ? j.warnFg : j.textMuted, f.style.border = `1px solid ${P ? j.warnBorder : j.toolbarBorder}`;
  }, y = () => {
    if (!e.cameraKey || !c) return;
    const C = Zr(c.getView?.());
    C && ki.set(e.cameraKey, C);
  };
  return {
    opts: i,
    pane: _,
    menu: g,
    showStatus: p,
    setStats: (C) => {
      $.replaceChildren(...C.map((A) => N("div", "overflow-wrap:anywhere;", A))), w.style.display = C.length ? "" : "none";
    },
    restoreCamera: () => {
      const C = a;
      a = null;
      const A = C ?? (e.cameraKey ? ki.get(e.cameraKey) : void 0);
      return !A || !c ? !1 : (c.setView(A.slice()), c.render(), !0);
    },
    viewer: () => c,
    stillWanted: () => d,
    setViewer: (C) => {
      c = C;
    },
    interaction: () => l,
    setInteraction: (C) => {
      l = C;
    },
    handle: {
      onResize() {
        c && (c.resize(), c.render());
      },
      // What the share button sends, so a link opens on the structure as it is
      // on screen: the same angle, the same distance, the same thing centred.
      // Null while the viewer is still loading, which a frame reads as "frame it
      // yourself" rather than as an error.
      viewState() {
        const C = Zr(c?.getView?.());
        return C ? { camera: C } : null;
      },
      cleanup() {
        d = !1, S(), y(), l?.cleanup(), l = null, _o(c), c = null;
      }
    }
  };
}
class wp extends Fe {
  placeholder() {
    return "Waiting for a ProteinComponent payload...";
  }
  renderView(t, n) {
    const r = n.pdb;
    let s = null;
    function o() {
      const a = i.viewer();
      a && Xr(a, i.opts, s, i.showStatus, void 0, i.stillWanted);
    }
    const i = Ya({
      element: this,
      host: t,
      title: n.name ?? "",
      fallbackTitle: "Protein",
      // A solvated or membrane system is defined by what surrounds the protein,
      // so it opens with that shown; a bare protein does not, because a few
      // thousand crystallographic waters would bury it.
      waters: n.type !== "ProteinComponentViz",
      heteroTitle: "Show hetero atoms / ligands / ions / lipids",
      menuLabel: "Representation, colouring and display options",
      // This view draws one structure, so the payload's own key is the
      // structure's key.
      cameraKey: n["gufe-key"],
      restyle: o
    });
    if (!r || !r.trim())
      return i.showStatus("No protein data - waiting for a PDB payload."), {};
    try {
      s = Va(r), i.setStats(Ua(s));
    } catch (a) {
      i.showStatus(`PDB parse error: ${ve(a)}`, "error");
    }
    return i.showStatus("Loading 3D viewer..."), lr().then(() => {
      const a = nt.createViewer(i.pane.container, { backgroundColor: Lt.viewer() });
      i.setViewer(a), a.addModel(r, "pdb"), Xr(a, i.opts, s, i.showStatus, void 0, i.stillWanted), i.restoreCamera() || a.zoomTo(), a.spin(i.opts.spin ? "y" : !1), a.render(), i.setInteraction(dr(i.pane.container, a));
    }).catch((a) => {
      i.showStatus(`Failed to render structure: ${ve(a)}`, "error");
    }), i.handle;
  }
}
ze("gufe-protein", wp);
const Xa = "http://www.w3.org/2000/svg";
function le(e, t = {}) {
  const n = document.createElementNS(Xa, e);
  for (const [r, s] of Object.entries(t)) n.setAttribute(r, String(s));
  return n;
}
function Nr(e, t) {
  const n = document.createElementNS(Xa, "title");
  return n.textContent = t, e.appendChild(n), e;
}
const Za = 3, _p = 24;
function Qa(e, t, n = t) {
  if (!e.length) return null;
  let r = 1 / 0, s = 1 / 0, o = -1 / 0, i = -1 / 0;
  for (const a of e)
    r = Math.min(r, a.x), s = Math.min(s, a.y), o = Math.max(o, a.x), i = Math.max(i, a.y);
  return !Number.isFinite(r) || !Number.isFinite(s) ? null : { minX: r - t, minY: s - n, maxX: o + t, maxY: i + n };
}
const Sp = { min: 0.15, max: 5 }, kp = 1e-9;
function ec(e, t, n) {
  const r = n.margin ?? _p, s = n.zoom ?? Sp;
  let o = 1, i = 0, a = 0;
  const c = () => {
    t.setAttribute("transform", `translate(${i},${a}) scale(${o})`), n.onTransform?.(o, i, a);
  }, l = () => {
    const I = e.getBoundingClientRect();
    return {
      width: I.width || Number(e.getAttribute("width")) || e.clientWidth || 800,
      height: I.height || Number(e.getAttribute("height")) || e.clientHeight || 600
    };
  }, d = (I, Q, V) => Math.min(1, Q / (I.maxX - I.minX + r * 2), V / (I.maxY - I.minY + r * 2)), m = () => {
    const I = n.bounds();
    if (!I) return s.min;
    const { width: Q, height: V } = l();
    return Math.min(s.min, d(I, Q, V));
  }, b = (I) => Math.min(s.max, Math.max(m(), o * I)), v = () => {
    o = 1, i = 0, a = 0;
    const I = n.bounds();
    if (!I) {
      c();
      return;
    }
    const { width: Q, height: V } = l();
    o = d(I, Q, V), i = Q / 2 - (I.minX + I.maxX) / 2 * o, a = V / 2 - (I.minY + I.maxY) / 2 * o, c();
  }, w = Ra(e, {
    onZoom: (I) => {
      const Q = e.getBoundingClientRect(), V = I.clientX - Q.left, q = I.clientY - Q.top, Y = b(Ma(I)), re = Y / o;
      return i = V - (V - i) * re, a = q - (q - a) * re, o = Y, c(), Math.abs(re - 1) > kp;
    },
    hint: n.hint ?? "Click the graph or hold Ctrl to zoom"
  }), u = /* @__PURE__ */ new Map();
  let g = null, h = null, _ = !1, S = null;
  const f = (I) => ({
    x: I.clientX - i,
    y: I.clientY - a,
    from: { x: I.clientX, y: I.clientY }
  }), p = (I) => {
    I.pointerType === "touch" && u.size > 1 || (h = f(I), _ = !1);
  }, y = (I) => {
    g || (S && I.pointerType === "touch" && (h = { x: S.x - i, y: S.y - a, from: S }, S = null), h && (Math.hypot(I.clientX - h.from.x, I.clientY - h.from.y) > Za && (_ = !0), i = I.clientX - h.x, a = I.clientY - h.y, c()));
  }, C = () => {
    h = null;
  };
  e.addEventListener("pointerdown", p), e.addEventListener("pointermove", y), e.addEventListener("pointerup", C), e.addEventListener("pointercancel", C), e.addEventListener("pointerleave", C);
  const A = () => {
    const [I, Q] = [...u.values()];
    return { cx: (I.x + Q.x) / 2, cy: (I.y + Q.y) / 2, span: Math.max(1, Math.hypot(I.x - Q.x, I.y - Q.y)) };
  }, P = (I) => {
    if (I.pointerType === "touch") {
      if (u.set(I.pointerId, { x: I.clientX, y: I.clientY }), u.size !== 2) {
        g = null;
        return;
      }
      g = A(), h = null, _ = !0;
    }
  }, T = (I) => {
    if (I.pointerType !== "touch" || !u.has(I.pointerId) || (u.set(I.pointerId, { x: I.clientX, y: I.clientY }), !g || u.size !== 2)) return;
    I.preventDefault(), I.stopPropagation();
    const Q = A(), V = e.getBoundingClientRect(), q = b(Q.span / g.span), Y = q / o;
    i = Q.cx - V.left - (g.cx - V.left - i) * Y, a = Q.cy - V.top - (g.cy - V.top - a) * Y, o = q, g = Q, c();
  }, R = (I) => {
    if (I.pointerType !== "touch") return;
    if (u.delete(I.pointerId), u.size === 2) {
      g = A();
      return;
    }
    g = null;
    const [Q] = [...u.values()];
    S = u.size === 1 && Q ? { ...Q } : null;
  };
  e.addEventListener("pointerdown", P, !0), e.addEventListener("pointermove", T, { capture: !0, passive: !1 }), e.addEventListener("pointerup", R, !0), e.addEventListener("pointercancel", R, !0);
  const L = Vu(e);
  return {
    fit: v,
    // An identity transform would be "reset" only in the sense that a blank
    // canvas is.
    reset: v,
    centreOn(I, Q, V = 1) {
      const { width: q, height: Y } = l();
      o = Math.max(o, V), i = q / 2 - I * o, a = Y / 2 - Q * o, c();
    },
    transform: () => ({ scale: o, tx: i, ty: a }),
    wasPan: () => _,
    gesturing: () => u.size > 1,
    // Deliberately unclamped, unlike the wheel. It is not a gesture: it is a
    // camera being put back exactly where it was, and a limit applied here
    // would quietly move it.
    setTransform(I, Q, V) {
      o = I, i = Q, a = V, c();
    },
    cleanup() {
      w.cleanup(), L.cleanup(), e.removeEventListener("pointerdown", p), e.removeEventListener("pointermove", y), e.removeEventListener("pointerup", C), e.removeEventListener("pointercancel", C), e.removeEventListener("pointerleave", C), e.removeEventListener("pointerdown", P, !0), e.removeEventListener("pointermove", T, { capture: !0 }), e.removeEventListener("pointerup", R, !0), e.removeEventListener("pointercancel", R, !0);
    }
  };
}
const Cp = ["x", "y", "vx", "vy", "fx", "fy", "index"];
function tc(e) {
  const t = { ...e };
  for (const n of Cp) delete t[n];
  return t;
}
async function nc(e) {
  let t;
  try {
    if (t = await qu(), typeof t?.forceSimulation != "function") return !1;
  } catch {
    return !1;
  }
  const n = t.forceSimulation(e.nodes);
  for (const [s, o] of e.forces(t, e.links)) n.force(s, o);
  n.stop();
  const r = Math.ceil(Math.log(n.alphaMin()) / Math.log(1 - n.alphaDecay()));
  for (let s = 0; s < r * e.tickMultiplier; s++) n.tick();
  return !0;
}
function Et(e) {
  const t = /* @__PURE__ */ new Map();
  return Qr(e, t, /* @__PURE__ */ new Set()), t;
}
function Qr(e, t, n) {
  if (e == null || typeof e != "object" || n.has(e)) return;
  if (n.add(e), Array.isArray(e)) {
    for (const s of e) Qr(s, t, n);
    return;
  }
  const r = e.registry;
  if (Array.isArray(r))
    for (const s of r) {
      const o = s["gufe-key"];
      typeof o == "string" && o && !t.has(o) && t.set(o, s);
    }
  for (const s of Object.values(e)) Qr(s, t, n);
}
function Ne(e, t) {
  return t ? e.get(t) : void 0;
}
function Ce(e, t, n) {
  const r = Ne(e, t);
  return r?.type === n ? r : void 0;
}
function Ro(e, t) {
  const n = [], r = /* @__PURE__ */ new Set();
  for (const s of t) {
    if (!s || r.has(s)) continue;
    const o = e.get(s);
    o && (r.add(s), n.push(o));
  }
  return n;
}
function _e(e) {
  return e.name ? e.name : (e["gufe-key"].split("-").pop() ?? e["gufe-key"]).slice(0, 6);
}
function rc(e) {
  const t = e.gufe_type || e.name || "Protocol";
  return (t.endsWith("Protocol") ? t.slice(0, -8) : t) || t;
}
function oc(e) {
  const t = [];
  let n = 0;
  for (const i of e.keys) {
    const a = Ce(e.registry, i, e.nodeType);
    if (!a) {
      n++;
      continue;
    }
    t.push({ ...a, x: 0, y: 0 });
  }
  const r = new Map(t.map((i) => [i["gufe-key"], i])), s = [];
  let o = 0;
  for (const i of e.edges) {
    const [a, c] = e.ends(i), l = a === void 0 ? void 0 : r.get(a), d = c === void 0 ? void 0 : r.get(c);
    if (!l || !d) {
      o++;
      continue;
    }
    s.push({ ...i, index: s.length, from: l, to: d });
  }
  return { nodes: t, edges: s, unresolved: n, dangling: o };
}
const Ep = 8, xp = 64, Ap = () => new Promise((e) => setTimeout(e, 0));
function eo(e) {
  if (e)
    try {
      e.delete();
    } catch {
    }
}
function Pp(e, t, n, r) {
  let s = null;
  try {
    if (s = e.get_mol(n, JSON.stringify({ removeHs: r })), !s || !s.get_substruct_matches) return null;
    const o = s.get_substruct_matches(t), i = JSON.parse(o || "[]");
    if (!Array.isArray(i)) return [];
    const a = /* @__PURE__ */ new Set();
    for (const c of i) {
      const l = c.atoms;
      if (Array.isArray(l))
        for (const d of l) typeof d == "number" && a.add(d);
    }
    return [...a].sort((c, l) => c - l);
  } catch (o) {
    return console.warn("[alchemy-viz] SMARTS match threw -", ve(o)), null;
  } finally {
    eo(s);
  }
}
function sc(e, t, n = !0) {
  const r = /* @__PURE__ */ new Map();
  let s = 0;
  return { run: async (i) => {
    const a = i.trim(), c = ++s;
    if (!a) return { status: "cleared" };
    const l = r.get(a);
    if (l) return { status: "ok", matched: l, unreadable: 0 };
    const d = await e();
    if (c !== s) return { status: "superseded" };
    if (!d) return { status: "unsupported" };
    if (!d.get_qmol) return { status: "unsupported" };
    let m = null;
    try {
      m = d.get_qmol(a);
    } catch {
      m = null;
    }
    if (!m) return { status: "invalid" };
    if (!m.get_substruct_matches)
      return eo(m), { status: "unsupported" };
    const b = /* @__PURE__ */ new Map();
    let v = 0;
    try {
      let $ = performance.now(), w = 0;
      for (let u = 0; u < t.length; u++) {
        const g = t[u] ? Pp(d, m, t[u], n) : null;
        if (g ? g.length && b.set(u, g) : v++, !(++w < xp && performance.now() - $ < Ep)) {
          if (await Ap(), c !== s) return { status: "superseded" };
          w = 0, $ = performance.now();
        }
      }
    } finally {
      eo(m);
    }
    return r.set(a, b), { status: "ok", matched: b, unreadable: v };
  }, cancel: () => void ++s };
}
const Rp = 250;
function Mp(e) {
  const t = N("div", "display:flex;flex-direction:column;gap:8px;"), n = N("input", $a);
  n.type = "text", n.placeholder = e.placeholder, n.value = e.remember.get(), n.spellcheck = !1, n.setAttribute("aria-label", e.label), t.appendChild(n);
  const r = N("div", `font-size:${ee.tiny};line-height:1.5;min-height:1.5em;color:${j.textMuted2};`);
  t.appendChild(r);
  const s = (a) => {
    switch (a.status) {
      case "ok":
        return e.describe(a);
      case "invalid":
        return "RDKit does not accept that as a SMARTS pattern.";
      case "unsupported":
        return "This RDKit build cannot match SMARTS.";
      default:
        return "";
    }
  }, o = (a) => {
    r.textContent = a.trim() ? "Matching..." : "", e.run(a).then(
      (c) => {
        c.status !== "superseded" && (r.textContent = s(c));
      },
      () => {
        r.textContent = "Matching failed.";
      }
    );
  };
  let i = 0;
  return n.oninput = () => {
    e.remember.set(n.value), window.clearTimeout(i), i = window.setTimeout(() => {
      n.isConnected && o(n.value);
    }, Rp);
  }, {
    element: t,
    apply: () => {
      n.value.trim() && o(n.value);
    }
  };
}
const ic = "Cmd/Ctrl-click to select several.";
function Np(e, t, n, r, s) {
  const o = (i) => s === "keys" ? i["gufe-key"] : _e(i);
  return r === "nodes" ? e.filter((i) => n.has(i["gufe-key"])).map(o).join(`
`) : t.filter((i) => n.has(i.from["gufe-key"]) && n.has(i.to["gufe-key"])).map((i) => `${o(i.from)}, ${o(i.to)}`).join(`
`);
}
async function Op(e) {
  try {
    if (navigator.clipboard)
      return await navigator.clipboard.writeText(e), !0;
  } catch {
  }
  return Tp(e);
}
function Tp(e) {
  const t = N(
    "textarea",
    "position:fixed;top:-1000px;left:-1000px;opacity:0;"
  );
  t.value = e, t.readOnly = !0, document.body.appendChild(t), t.select();
  try {
    return document.execCommand("copy");
  } catch {
    return !1;
  } finally {
    t.remove();
  }
}
function Fp(e, t) {
  const n = URL.createObjectURL(new Blob([e], { type: "text/plain" })), r = N("a", "display:none;");
  r.href = n, r.download = t, document.body.appendChild(r), r.click(), r.remove(), URL.revokeObjectURL(n);
}
function zp(e) {
  const { words: t } = e, n = ut(e.setting, "names", ["names", "keys"]), r = N("div", "display:flex;flex-direction:column;gap:6px;"), s = N("div", `display:flex;align-items:center;gap:6px;font-size:${ee.small};color:${j.textMuted};`);
  s.appendChild(N("span", "", "copy as"));
  const o = yo(
    [
      { id: "names", label: "names" },
      { id: "keys", label: "gufe keys" }
    ],
    n.get(),
    () => {
    },
    n
  );
  o.style.flex = "1", s.appendChild(o), r.appendChild(s);
  const i = N("div", `font-size:${ee.tiny};line-height:1.5;color:${j.textMuted2};`), a = (d) => {
    i.textContent = d;
  }, c = ft("width:100%;"), l = () => {
    const d = e.what();
    c.textContent = "Copy", c.title = d === "nodes" ? `Copy the selected ${t.nodes.plural}, one per line` : `Copy the ${t.edges.plural} between the selected ${t.nodes.plural}, one pair per line`;
  };
  return l(), c.onclick = (d) => {
    const m = e.what(), b = m === "nodes" ? t.nodes : t.edges, v = o.value, $ = Np(e.nodes, e.edges, e.selected, m, v);
    if (!$) {
      a(
        e.selected.size === 0 ? `Nothing selected. Click one of the ${t.nodes.plural} above.` : m === "edges" ? `No ${t.edges.plural} between the ${e.selected.size} selected ${t.nodes.plural}. ${ic}` : "Nothing to copy."
      );
      return;
    }
    const w = $.split(`
`).length;
    if (d.shiftKey) {
      Fp($, `selected-${b.plural}.txt`), a(`Saved ${w} ${b.plural} to a file.`);
      return;
    }
    Op($).then((u) => {
      if (!u) {
        a("Could not reach the clipboard. Shift-click to save as a file instead.");
        return;
      }
      a(
        m === "edges" ? `Copied ${w} ${t.edges.plural}.` : `Copied ${e.selected.size} ${t.nodes.plural}.`
      );
    });
  }, r.appendChild(c), r.appendChild(i), r.appendChild(N("div", `font-size:${ee.tiny};color:${j.textMuted2};`, "Shift-click to save as a file instead.")), { box: r, clearNote: () => a(""), relabel: l };
}
const Ci = new Intl.Collator(void 0, { numeric: !0, sensitivity: "base" });
function ac(e) {
  const t = Hr(`${e.namespace}.query`), n = ut(`${e.namespace}.tab`, "nodes", ["nodes", "edges"]);
  let r = n.get();
  const s = N("div", va), o = Ct(
    [
      { id: "nodes", label: e.words.nodes.tab, title: `List the ${e.words.nodes.plural}` },
      { id: "edges", label: e.words.edges.tab, title: `List the ${e.words.edges.plural}` }
    ],
    r,
    (u) => {
      r = u, n.set(r), w();
    }
  );
  for (const u of Array.from(o.children)) u.style.flex = "1";
  o.style.gap = "0", s.appendChild(o);
  const i = N("input", $a);
  s.appendChild(i);
  const a = Mp({
    placeholder: e.smarts.placeholder,
    label: e.smarts.label,
    remember: Hr(`${e.namespace}.smarts`),
    run: (u) => e.match(u),
    describe: (u) => e.smarts.describe(u)
  });
  s.appendChild(a.element);
  for (const u of e.filters?.(() => w()) ?? []) s.appendChild(u);
  const c = N("div", `font-size:${ee.small};color:${j.textMuted2};`);
  s.appendChild(c);
  const l = N("div", $u);
  s.appendChild(l), s.appendChild(N("div", `font-size:${ee.tiny};line-height:1.5;color:${j.textMuted2};`, ic));
  const d = zp({
    nodes: e.nodes,
    edges: e.edges,
    selected: e.selected,
    words: e.words,
    setting: `${e.namespace}.exportAs`,
    what: () => r
  });
  s.appendChild(d.box);
  const m = ft("width:100%;", "Clear selection");
  m.title = "Clear the selection and put the filters back", m.onclick = () => {
    e.selected.clear(), e.resetFilters?.(), w(), e.refresh();
  }, s.appendChild(m);
  function b(u, g, h) {
    const _ = qt(fo.row), S = g.every((p) => e.selected.has(p));
    _.setAttribute("aria-pressed", String(S)), u.before && _.appendChild(u.before);
    const f = N("span", "flex:1;min-width:0;overflow-wrap:anywhere;", u.name);
    return f.title = u.title, _.appendChild(f), _.onclick = (p) => {
      if (p.shiftKey || p.metaKey || p.ctrlKey) {
        const y = g.every((C) => e.selected.has(C));
        for (const C of g)
          y ? e.selected.delete(C) : e.selected.add(C);
      } else {
        e.selected.clear();
        for (const y of g) e.selected.add(y);
        h();
      }
      w(), e.refresh();
    }, l.appendChild(_), S;
  }
  function v() {
    const u = e.nodes.map((h, _) => ({ node: h, index: _ })).filter(({ node: h, index: _ }) => e.shows(h, _)).map(({ node: h, index: _ }) => ({ node: h, index: _, parts: e.row(h, _) }));
    u.sort((h, _) => Ci.compare(h.parts.name, _.parts.name));
    let g = 0;
    for (const { node: h, index: _, parts: S } of u)
      b(S, [h["gufe-key"]], () => e.focus(_)) && g++;
    return { shown: u.length, picked: g };
  }
  function $() {
    const u = e.edges.map((h, _) => ({ edge: h, index: _ })).filter(({ edge: h, index: _ }) => e.edgeShows(h, _)).map(({ edge: h, index: _ }) => ({ edge: h, index: _, parts: e.edgeRow(h, _) }));
    u.sort((h, _) => Ci.compare(h.parts.name, _.parts.name));
    let g = 0;
    for (const { edge: h, index: _, parts: S } of u)
      b(S, [h.from["gufe-key"], h.to["gufe-key"]], () => e.focusEdge(_)) && g++;
    return { shown: u.length, picked: g };
  }
  function w() {
    d.clearNote(), d.relabel(), o.setActive(r), l.replaceChildren();
    const u = r === "nodes" ? e.words.nodes : e.words.edges, g = r === "nodes" ? e.nodes.length : e.edges.length, { shown: h, picked: _ } = r === "nodes" ? v() : $();
    c.textContent = `showing ${h} of ${g} ${u.plural}` + (_ ? `, ${_} selected` : ""), h || l.appendChild(N("div", `font-size:${ee.small};padding:${X.lg};color:${j.textMuted2};`, "Nothing matches."));
  }
  return i.type = "search", i.placeholder = e.search.placeholder, i.value = t.get(), e.query.text = i.value, i.setAttribute("aria-label", e.search.label), i.oninput = () => {
    e.query.text = i.value, t.set(i.value), w(), e.refresh();
  }, w(), e.mounted?.(w), a.apply(), s;
}
function cc(e, t) {
  return e.find((n) => t >= n.from) ?? e[e.length - 1];
}
function jp(e, t) {
  return e[Math.min(e.indexOf(t) + 1, e.length - 1)];
}
const It = { node: 0.12, edge: 0.06 };
function lc(e, t, n, r) {
  e.forEach((s, o) => {
    let i = null, a = !1;
    s.addEventListener("pointerdown", (l) => {
      l.stopPropagation();
      const { scale: d } = n.transform();
      i = { x: l.clientX - t[o].x * d, y: l.clientY - t[o].y * d }, a = !1, s.setPointerCapture(l.pointerId);
    }), s.addEventListener("pointermove", (l) => {
      if (!i) return;
      if (n.gesturing()) {
        i = null, a = !0;
        return;
      }
      const { scale: d } = n.transform(), m = (l.clientX - i.x) / d, b = (l.clientY - i.y) / d;
      Math.hypot(m - t[o].x, b - t[o].y) * d > Za && (a = !0), t[o].x = t[o].fx = m, t[o].y = t[o].fy = b, r.moved(o);
    });
    const c = () => {
      i = null;
    };
    s.addEventListener("pointerup", c), s.addEventListener("pointercancel", c), s.addEventListener("click", (l) => {
      l.stopPropagation(), a || r.clicked(o);
    });
  });
}
class dc {
  #e = /* @__PURE__ */ new Set();
  #t = /* @__PURE__ */ new Set();
  #n = [];
  /** Whether a structure is on screen for this node. */
  has(t) {
    return this.#e.has(t);
  }
  /** Whether it is worth trying: not drawn, and not already refused. */
  wants(t) {
    return !this.#e.has(t) && !this.#t.has(t);
  }
  drew(t, n = "") {
    this.#e.add(t), this.#n[t] = n;
  }
  refused(t) {
    this.#t.add(t);
  }
  /**
   * Drop the structures `keyOf` no longer agrees with, and only those.
   *
   * A structure is expensive and a new pattern usually changes a handful of
   * nodes, so redrawing every one of them would make typing a pattern cost more
   * than drawing the network did. A dropped structure is rebuilt by the next
   * pass, and only if it is on screen.
   */
  forget(t, n) {
    for (const r of [...this.#e])
      this.#n[r] !== t(r) && (n(r), this.#e.delete(r));
  }
}
const Bn = 200;
function uc(e, t, n, r) {
  const { scale: s, tx: o, ty: i } = t, a = [];
  return e.forEach((c, l) => {
    if (!r(l)) return;
    const d = c.x * s + o, m = c.y * s + i;
    d < -Bn || m < -Bn || d > n.width + Bn || m > n.height + Bn || a.push(l);
  }), a;
}
function fc(e) {
  const t = N("div", "flex:1;min-height:0;display:flex;flex-direction:column;");
  e.appendChild(t);
  const n = document.createElement("alchemy-view");
  return n.style.cssText = "flex:1;min-width:0;min-height:0;display:flex;", {
    show(r) {
      n.payload = r, n.parentNode !== t && t.replaceChildren(n);
    },
    content(r) {
      t.replaceChildren(r);
    },
    message(r) {
      t.replaceChildren($e(r));
    },
    // Removing the nested view fires its own `disconnectedCallback`, which is
    // where whatever it mounted releases its viewers.
    cleanup() {
      n.remove();
    }
  };
}
function at(e) {
  return e > 0 ? `+${e}` : String(e);
}
function Ei(e, t) {
  return (t.total_charge ?? 0) - (e.total_charge ?? 0);
}
const Ip = (e) => (e.getAttribute("fill") ?? /(?:^|;)\s*fill\s*:\s*([^;]+)/i.exec(e.getAttribute("style") ?? "")?.[1] ?? "").toLowerCase().replace(/\s+/g, ""), Dp = /* @__PURE__ */ new Set(["#fff", "#ffffff", "white", "rgb(255,255,255)"]), Lp = (e) => e === "none" || e === "transparent" ? !0 : /^#[0-9a-f]{8}$/.test(e) ? e.slice(7) === "00" : /^#[0-9a-f]{4}$/.test(e) ? e[4] === "0" : !1, Bp = (e) => {
  const t = Ip(e);
  return Dp.has(t) || Lp(t);
};
function pc(e, t, n, r) {
  const s = new DOMParser().parseFromString(t, "image/svg+xml").documentElement;
  if (!s || s.nodeName.toLowerCase() === "parsererror") return !1;
  e.setAttribute("transform", `translate(${-r / 2},${-r / 2}) scale(${r / n})`);
  let o = 0;
  for (const i of Array.from(s.childNodes)) {
    if (i.nodeType !== 1) continue;
    const a = i.nodeName.toLowerCase();
    a === "defs" || a === "metadata" || a === "title" || a === "rect" && Bp(i) || (e.appendChild(document.importNode(i, !0)), o++);
  }
  return o ? !0 : (e.replaceChildren(), !1);
}
const qp = 1e-6;
function qn(e, t) {
  const n = new Array(9);
  for (let r = 0; r < 3; r++)
    for (let s = 0; s < 3; s++)
      n[r * 3 + s] = e[r * 3] * t[s] + e[r * 3 + 1] * t[3 + s] + e[r * 3 + 2] * t[6 + s];
  return n;
}
function xi(e) {
  return [e[0], e[3], e[6], e[1], e[4], e[7], e[2], e[5], e[8]];
}
function Vp(e) {
  return e[0] * (e[4] * e[8] - e[5] * e[7]) - e[1] * (e[3] * e[8] - e[5] * e[6]) + e[2] * (e[3] * e[7] - e[4] * e[6]);
}
function Ai(e) {
  const t = e.slice(), n = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let r = 0; r < 50 && !(Math.abs(t[1]) + Math.abs(t[2]) + Math.abs(t[5]) < 1e-12); r++) {
    const o = [[0, 1], [0, 2], [1, 2]];
    for (let i = 0; i < 3; i++) {
      const a = o[i][0], c = o[i][1], l = t[a * 3 + c];
      if (Math.abs(l) < 1e-14) continue;
      const d = t[a * 3 + a], m = t[c * 3 + c], b = (m - d) / (2 * l);
      let v;
      Math.abs(b) > 1e10 ? v = 1 / (2 * b) : v = (b >= 0 ? 1 : -1) / (Math.abs(b) + Math.sqrt(b * b + 1));
      const $ = 1 / Math.sqrt(1 + v * v), w = v * $;
      t[a * 3 + a] = d - v * l, t[c * 3 + c] = m + v * l, t[a * 3 + c] = 0, t[c * 3 + a] = 0;
      for (let u = 0; u < 3; u++)
        if (u !== a && u !== c) {
          const g = t[u * 3 + a], h = t[u * 3 + c];
          t[u * 3 + a] = $ * g - w * h, t[a * 3 + u] = t[u * 3 + a], t[u * 3 + c] = w * g + $ * h, t[c * 3 + u] = t[u * 3 + c];
        }
      for (let u = 0; u < 3; u++) {
        const g = n[u * 3 + a], h = n[u * 3 + c];
        n[u * 3 + a] = $ * g - w * h, n[u * 3 + c] = w * g + $ * h;
      }
    }
  }
  return { values: [t[0], t[4], t[8]], vectors: n };
}
function Up(e, t) {
  const n = Math.min(e.length, t.length);
  if (n < 1) return null;
  const r = [0, 0, 0], s = [0, 0, 0];
  for (let S = 0; S < n; S++)
    r[0] += e[S][0], r[1] += e[S][1], r[2] += e[S][2], s[0] += t[S][0], s[1] += t[S][1], s[2] += t[S][2];
  if (r[0] /= n, r[1] /= n, r[2] /= n, s[0] /= n, s[1] /= n, s[2] /= n, n < 3)
    return { R: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [r[0] - s[0], r[1] - s[1], r[2] - s[2]], determined: !1 };
  const o = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let S = 0; S < n; S++) {
    const f = e[S][0] - r[0], p = e[S][1] - r[1], y = e[S][2] - r[2], C = t[S][0] - s[0], A = t[S][1] - s[1], P = t[S][2] - s[2];
    o[0] += f * C, o[1] += f * A, o[2] += f * P, o[3] += p * C, o[4] += p * A, o[5] += p * P, o[6] += y * C, o[7] += y * A, o[8] += y * P;
  }
  const i = xi(o), a = qn(i, o), c = qn(o, i);
  let l = Ai(a), d = Ai(c);
  function m(S) {
    const f = [0, 1, 2].sort((y, C) => S.values[C] - S.values[y]), p = new Array(9);
    for (let y = 0; y < 3; y++) {
      const C = f[y];
      p[y] = S.vectors[C], p[3 + y] = S.vectors[3 + C], p[6 + y] = S.vectors[6 + C];
    }
    return {
      values: [S.values[f[0]], S.values[f[1]], S.values[f[2]]],
      vectors: p
    };
  }
  l = m(l), d = m(d);
  const b = l.vectors, v = d.vectors;
  for (let S = 0; S < 3; S++) {
    const f = b[S], p = b[3 + S], y = b[6 + S], C = o[0] * f + o[1] * p + o[2] * y, A = o[3] * f + o[4] * p + o[5] * y, P = o[6] * f + o[7] * p + o[8] * y, T = v[S], R = v[3 + S], L = v[6 + S];
    C * T + A * R + P * L < 0 && (v[S] = -T, v[3 + S] = -R, v[6 + S] = -L);
  }
  const $ = xi(b);
  let w = qn(v, $);
  Vp(w) < 0 && (v[2] = -v[2], v[5] = -v[5], v[8] = -v[8], w = qn(v, $));
  const u = w[0] * s[0] + w[1] * s[1] + w[2] * s[2], g = w[3] * s[0] + w[4] * s[1] + w[5] * s[2], h = w[6] * s[0] + w[7] * s[1] + w[8] * s[2], _ = l.values[1] > qp * l.values[0];
  return { R: w, t: [r[0] - u, r[1] - g, r[2] - h], determined: _ };
}
function Hp(e, t, n) {
  const r = e[0], s = e[1], o = e[2];
  return [
    t[0] * r + t[1] * s + t[2] * o + n[0],
    t[3] * r + t[4] * s + t[5] * o + n[1],
    t[6] * r + t[7] * s + t[8] * o + n[2]
  ];
}
function Kp(e, t) {
  const n = N("div", "flex:1;display:flex;flex-direction:column;min-height:0;");
  e.appendChild(n);
  let r = [], s = 0, o = !0, i = !1;
  const a = () => {
    s && cancelAnimationFrame(s), s = 0, i && Ta(r[0]?.viewer ?? null, r[0]?.interaction ?? null), i = !1;
    for (const c of r)
      c.interaction?.cleanup(), _o(c.viewer);
    r = [], n.replaceChildren();
  };
  return {
    element: n,
    named: t,
    clear: a,
    box(c) {
      const l = N("div", "flex:1;display:flex;flex-direction:column;position:relative;min-height:0;"), d = N("div", "flex:1;position:relative;min-height:0;");
      d.dataset.gufeViewer = "", l.appendChild(d), t && l.appendChild(N("div", uo, c)), n.appendChild(l);
      const m = { container: d, viewer: null, interaction: null };
      return r.push(m), m;
    },
    open(c, l) {
      const d = nt.createViewer(c.container, { backgroundColor: Lt.viewer() });
      for (const m of l) d.addModel(Zf(m), "sdf");
      return c.viewer = d, d;
    },
    settle(c) {
      c.viewer && (c.interaction = dr(c.container, c.viewer));
    },
    pose(c) {
      Fa(c.viewer, c.interaction), i = !0;
    },
    sync() {
      if (r.length < 2) return;
      const c = r.map(() => "");
      let l = !1;
      const d = () => {
        if (o) {
          if (!l)
            for (let m = 0; m < r.length; m++) {
              const b = r[m].viewer;
              if (!b) continue;
              const v = JSON.stringify(b.getView());
              if (v !== c[m]) {
                l = !0;
                for (let $ = 0; $ < r.length; $++)
                  $ !== m && r[$].viewer && (r[$].viewer.setView(b.getView()), r[$].viewer.render()), c[$] = v;
                l = !1;
                break;
              }
            }
          s = requestAnimationFrame(d);
        }
      };
      s = requestAnimationFrame(d);
    },
    resize() {
      for (const c of r)
        c.viewer && (c.viewer.resize(), c.viewer.render());
    },
    cleanup() {
      o = !1, a();
    }
  };
}
const Pi = `
`, Or = 4;
function Ri(e, t, n) {
  if (n === "conformer") return t;
  let r = null;
  try {
    return r = e.get_mol(t, JSON.stringify({ removeHs: !1 })), !r || !r.get_molblock ? t : (r.set_new_coords(n === "coordgen"), r.get_molblock() || t);
  } catch (s) {
    return console.warn("[alchemy-viz] could not lay out a molecule in 2D -", ve(s)), t;
  } finally {
    if (r)
      try {
        r.delete();
      } catch {
      }
  }
}
function Gp(e, t, n) {
  const r = [], s = [];
  for (const [d, m] of n) {
    const b = e[m], v = t[d];
    !b || !v || (r.push(b), s.push(v));
  }
  if (r.length < 2) return null;
  const o = (d) => {
    let m = 0, b = 0;
    for (const v of d)
      m += v[0], b += v[1];
    return [m / d.length, b / d.length];
  }, i = o(r), a = o(s);
  let c = null, l = -1 / 0;
  for (const d of [!1, !0]) {
    let m = 0, b = 0;
    for (let h = 0; h < r.length; h++) {
      const _ = (d ? -1 : 1) * (r[h][0] - i[0]), S = r[h][1] - i[1], f = s[h][0] - a[0], p = s[h][1] - a[1];
      m += _ * p - S * f, b += _ * f + S * p;
    }
    const v = Math.hypot(m, b);
    if (v <= l) continue;
    l = v;
    const $ = Math.atan2(m, b), w = Math.cos($), u = Math.sin($), g = (d ? -1 : 1) * i[0];
    c = {
      cos: w,
      sin: u,
      mirror: d,
      tx: a[0] - (w * g - u * i[1]),
      ty: a[1] - (u * g + w * i[1])
    };
  }
  return c;
}
function Wp(e, t) {
  const n = (e.mirror ? -1 : 1) * t[0], r = t[1];
  return [e.cos * n - e.sin * r + e.tx, e.sin * n + e.cos * r + e.ty];
}
function Jp(e, t, n) {
  const r = ko(e);
  if (!r) return e;
  const s = e.replace(/\r/g, "").split(Pi);
  if (s[3].indexOf("V3000") !== -1) return e;
  for (let o = 0; o < r.atoms; o++) {
    const i = s[Or + o], a = t[o];
    if (i == null || !a) return e;
    s[Or + o] = a[0].toFixed(4).padStart(10) + a[1].toFixed(4).padStart(10) + 0 .toFixed(4).padStart(10) + i.substring(30);
  }
  if (n)
    for (let a = 0; a < r.bonds; a++) {
      const c = Or + r.atoms + a, l = s[c];
      if (l == null) break;
      const d = parseInt(l.substring(9, 12), 10);
      d !== 1 && d !== 6 || (s[c] = l.substring(0, 9) + String(d === 1 ? 6 : 1).padStart(3) + l.substring(12));
    }
  return s.join(Pi);
}
function Yp(e, t, n) {
  try {
    const r = (i) => Jr(i).coords.map((a) => [a[0], a[1]]), s = r(t), o = Gp(s, r(e), n);
    return o ? Jp(
      t,
      s.map((i) => Wp(o, i)),
      o.mirror
    ) : t;
  } catch (r) {
    return console.warn("[alchemy-viz] could not align a depiction to its partner -", ve(r)), t;
  }
}
function Xp(e, t, n, r, s) {
  const o = Ri(e, t, r), i = Ri(e, n, r);
  return !s || r === "conformer" ? { left: o, right: i } : { left: o, right: Yp(o, i, s) };
}
const Zp = {
  core: "0xaaaaaa",
  pairLine: "0xffee55"
}, Qp = {
  core: "0x888888",
  pairLine: "0xd9a300"
}, hc = () => lo() === "dark" ? Zp : Qp, Tr = 420, We = {
  stick: 0.15,
  sphere: 0.25,
  markStick: 0.18,
  markSphere: 0.32,
  pairSphere: 0.22,
  lineRadius: 0.04
}, Fr = { gap: 2.5, minLiftFraction: 0.6 }, eh = 24, Mi = {
  sphereRadius: 0.6,
  sphereAlpha: 0.8
}, th = {
  mapped: null,
  element: Te.modifiedColor,
  uniqueA: Te.destroyedColor,
  uniqueB: Te.createdColor
}, nh = 132;
function Ni(e) {
  const t = [1 / 0, 1 / 0, 1 / 0], n = [-1 / 0, -1 / 0, -1 / 0];
  for (const r of e)
    for (let s = 0; s < 3; s++)
      r[s] < t[s] && (t[s] = r[s]), r[s] > n[s] && (n[s] = r[s]);
  return { min: t, max: n, span: [n[0] - t[0], n[1] - t[1], n[2] - t[2]] };
}
function rh(e, t) {
  const n = Ni(e), r = Ni(t);
  let s = 0;
  n.span[1] < n.span[s] && (s = 1), n.span[2] < n.span[s] && (s = 2);
  const o = Math.max(n.span[0], n.span[1], n.span[2]), i = n.max[s] - r.min[s] + Fr.gap, a = Fr.minLiftFraction * o + Fr.gap;
  return { axis: s, lift: Math.max(i, a) };
}
function mc(e) {
  const t = If(Te.customSpec);
  return [
    { mol: e.molA, uniques: e.uniquesA, side: "left", custom: t.left },
    { mol: e.molB, uniques: e.uniquesB, side: "right", custom: t.right }
  ];
}
function oh(e, t) {
  for (const n of [t.molA, t.molB]) {
    const r = e.box(n.name), s = e.open(r, [n]);
    s.setStyle(
      {},
      { stick: { radius: We.stick, colorscheme: "Jmol" }, sphere: { scale: We.sphere, colorscheme: "Jmol" } }
    ), s.zoomTo(), s.render(), e.settle(r), e.pose(r);
  }
  e.sync();
}
function sh(e, t) {
  const n = Te, r = hc();
  for (const s of mc(t)) {
    const o = e.box(s.mol.name), i = e.open(o, [s.mol]);
    i.setStyle(
      {},
      { stick: { radius: We.stick, color: r.core }, sphere: { scale: We.sphere, color: r.core } }
    );
    const a = (c, l) => {
      i.addStyle(
        { serial: c },
        {
          stick: { radius: We.markStick, color: gi(l) },
          sphere: { scale: We.markSphere, color: gi(l) }
        }
      );
    };
    for (const c of ja(n, s.mol, s.uniques, s.side))
      for (const l of c.atoms) a(l, c.color);
    for (const c of s.custom)
      c < s.mol.symbols.length && a(c, n.customColor);
    i.zoomTo(), i.render(), e.settle(o), e.pose(o);
  }
  e.sync();
}
function ih(e, t) {
  const { molA: n, molB: r, nameA: s, nameB: o, pairs: i } = t, a = e.box(`${s} (left), both overlaid (middle), ${o} (right)`), c = ph(n.coords, r.coords), l = (g, h) => ({
    ...g,
    coords: g.coords.map(([_, S, f]) => [_ + h, S, f])
  }), d = l(n, -c), m = l(r, c), b = e.open(a, [d, m, n, r]);
  b.setStyle({}, { stick: {} });
  const v = Array.from(i);
  v.forEach(([g, h], _) => {
    const S = d.coords[g], f = m.coords[h];
    if (!S || !f) return;
    const p = hh(_, v.length);
    for (const [y, C, A] of [S, f])
      b.addSphere({
        center: { x: y, y: C, z: A },
        radius: Mi.sphereRadius,
        color: p,
        alpha: Mi.sphereAlpha
      });
  }), b.zoomTo();
  const { clientWidth: $, clientHeight: w } = a.container, u = $ - 2 * eh;
  u > 0 && u < w && b.zoom(u / w), b.render(), e.settle(a);
}
function ah(e, t) {
  const { molA: n, molB: r, nameA: s, nameB: o, pairs: i } = t, a = e.box(`${s} to ${o}  (${i.size} mapped pairs)`), { axis: c, lift: l } = rh(n.coords, r.coords), d = {
    ...r,
    coords: r.coords.map((v) => {
      const $ = [v[0], v[1], v[2]];
      return $[c] += l, $;
    })
  }, m = e.open(a, [n, d]), b = {
    stick: { radius: We.stick, colorscheme: "Jmol" },
    sphere: { scale: We.pairSphere, colorscheme: "Jmol" }
  };
  m.setStyle({ model: 0 }, b), m.setStyle({ model: 1 }, b);
  for (const [v, $] of i) {
    const w = n.coords[v], u = d.coords[$];
    !w || !u || m.addCylinder({
      start: { x: w[0], y: w[1], z: w[2] },
      end: { x: u[0], y: u[1], z: u[2] },
      radius: We.lineRadius,
      dashed: !0,
      fromCap: "round",
      toCap: "round",
      color: hc().pairLine
    });
  }
  m.zoomTo(), c === 2 ? m.rotate(90, "x") : c === 0 && m.rotate(-90, "z"), m.render(), e.settle(a);
}
function ch(e, t) {
  const n = Te, r = mc(t).map((s) => {
    const o = N("div", "flex:1;display:flex;flex-direction:column;position:relative;min-height:0;"), i = N(
      "div",
      `flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px;background:${za()};`
    );
    return i.appendChild($e("Loading 2D depiction...")), o.appendChild(i), e.named && o.appendChild(N("div", uo, s.mol.name)), e.element.appendChild(o), { box: i, side: s };
  });
  wo().then((s) => {
    const o = qf(n, s), i = Xp(s, t.from.sdf, t.to.sdf, n.layout, n.alignPair ? t.pairs : null);
    for (const { box: a, side: c } of r) {
      const l = ja(n, c.mol, c.uniques, c.side), d = Vf(n, Tr, l, c.custom, o, c.mol.symbols.length), m = Uf(s, c.side === "left" ? i.left : i.right, Tr, d);
      if (a.replaceChildren(), !m) {
        a.appendChild($e("Failed to parse molecule", !0));
        continue;
      }
      Ba(a, m, Tr);
      const b = a.querySelector("svg");
      b && Yf(b, c.mol, n, l, c.custom, o);
    }
  }).catch((s) => {
    for (const { box: o } of r)
      o.replaceChildren($e(`RDKit failed to load: ${ve(s)}`, !0));
  });
}
function lh(e, t, n) {
  const { nameA: r, nameB: s, pairs: o, molA: i, molB: a, uniquesA: c, uniquesB: l } = t, d = N(
    "div",
    "flex:1;min-width:0;min-height:0;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:14px;"
  );
  e.element.appendChild(d), d.appendChild(
    N(
      "div",
      `font-size:${ee.title};font-weight:${ge.bold};color:${ke.title};`,
      n.name || `${r} to ${s}`
    )
  );
  const m = uh(o, i.symbols, a.symbols), b = N("div", Pe.row), v = [];
  let $ = null;
  const w = (P, T, R, L) => {
    const I = qt(`${Pe.plain}${Pe.button}`, Pe.className);
    I.appendChild(Ve(P, String(T), L)), I.onclick = () => {
      $ = $ === R ? null : R, y();
    }, v.push({ node: I, kinds: R }), b.appendChild(I);
  }, u = (P, T) => {
    const R = N("span", Pe.plain);
    R.appendChild(Ve(P, T)), b.appendChild(R);
  };
  w("mapped atoms", o.size, ["mapped", "element"]), w("element changes", c.elements.length, ["element"], Te.modifiedColor), w(`unique to ${r}`, c.atoms.length, ["uniqueA"], Te.destroyedColor), w(`unique to ${s}`, l.atoms.length, ["uniqueB"], Te.createdColor), u(`atoms in ${r}`, String(i.symbols.length)), u(`atoms in ${s}`, String(a.symbols.length)), u("score", n.score == null ? Qe : n.score.toFixed(3)), d.appendChild(b), d.appendChild(N("div", qr, "Correspondence"));
  const g = N("div", `font-size:${ee.small};line-height:1.6;color:${ke.faint};`);
  d.appendChild(g);
  const h = N(
    "div",
    `display:grid;grid-template-columns:repeat(auto-fill,minmax(${nh}px,1fr));gap:${X.xs} ${X.md};font-family:${ee.mono};font-size:${ee.small};color:${ke.primary};`
  );
  d.appendChild(h);
  const _ = String(Math.max(i.symbols.length, a.symbols.length, 1) - 1).length, S = (P, T) => `${(P == null ? Qe : String(P)).padStart(_)} ${T.padEnd(2)}`, f = (P) => {
    if (P.kind === "uniqueA") return `${r} atom ${P.a} ${P.symbolA} maps to nothing`;
    if (P.kind === "uniqueB") return `${s} atom ${P.b} ${P.symbolB} maps to nothing`;
    const T = P.kind === "element" ? ", an element change" : "";
    return `${r} atom ${P.a} ${P.symbolA} maps to ${s} atom ${P.b} ${P.symbolB}${T}`;
  }, p = (P) => {
    const T = N(
      "div",
      `white-space:pre;padding:${X.xs} ${X.md};border-radius:${Ee.sm};background:${Lt.card};border-left:3px solid ${th[P.kind] ?? "transparent"};`,
      `${S(P.a, P.symbolA)} -> ${S(P.b, P.symbolB)}`
    );
    return T.title = f(P), T.dataset.gufeRelation = P.kind, T;
  }, y = () => {
    const P = $, T = P ? m.filter((R) => P.includes(R.kind)) : m;
    h.replaceChildren(...T.map(p)), T.length || h.appendChild(
      N(
        "div",
        `font-size:${ee.small};line-height:1.6;color:${ke.faint};grid-column:1/-1;`,
        $ ? "No atoms of that kind." : "This mapping has no atoms."
      )
    ), g.textContent = (o.size ? "" : "This mapping relates no atoms at all. ") + `${r} -> ${s}, by atom index and element` + ($ ? "; click the chip again for all of them" : "");
    for (const R of v) {
      const L = R.kinds === $;
      R.node.setAttribute("aria-pressed", String(L)), R.node.title = L ? "Show every atom" : "Show only these atoms";
    }
  };
  y();
  const C = Object.entries(n.annotations ?? {}).filter(([P]) => P !== "score");
  if (!C.length) return;
  d.appendChild(N("div", qr, "Annotations"));
  const A = N("div", `${Cu}color:${ke.faint};`);
  for (const [P, T] of C)
    A.appendChild(N("div", "", `${P}: ${String(T)}`));
  d.appendChild(A);
}
const Oi = [
  { id: "2d", label: "2D", title: "2D depictions with highlights" },
  { id: "plain", label: "3D", title: "Plain 3D view" },
  { id: "colored", label: "3D-Map", title: "The 2D mapping colours, on the structures" },
  { id: "openfe", label: "3D Overlay", title: "What LigandAtomMapping.view_3d() draws" },
  { id: "lines", label: "Pairs", title: "Dashed lines between mapped atoms" },
  { id: "info", label: "Info", title: "The mapping in numbers" }
], zr = {
  /** The smallest separation gufe will use, whatever the molecules measure. */
  minSpread: 5,
  /** What gufe multiplies that separation by before shifting each side. */
  spreadFactor: 1.5
};
function Ti(e, t, n) {
  const r = [], s = [], o = [];
  for (let i = 0; i < t.length; i++) {
    const a = e.get(i);
    a === void 0 ? r.push(i) : t[i] !== n[a] ? s.push(i) : o.push(i);
  }
  return { atoms: r, elements: s, mapped: o };
}
function dh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.componentA_to_componentB ?? [])
    Number.isInteger(n?.index_A) && Number.isInteger(n?.index_B) && t.set(n.index_A, n.index_B);
  return t;
}
function uh(e, t, n) {
  const r = [];
  for (let o = 0; o < t.length; o++) {
    const i = t[o] ?? "", a = e.get(o);
    if (a === void 0) {
      r.push({ kind: "uniqueA", a: o, b: null, symbolA: i, symbolB: "" });
      continue;
    }
    const c = n[a] ?? "";
    r.push({ kind: i === c ? "mapped" : "element", a: o, b: a, symbolA: i, symbolB: c });
  }
  const s = new Set(e.values());
  for (let o = 0; o < n.length; o++)
    s.has(o) || r.push({ kind: "uniqueB", a: null, b: o, symbolA: "", symbolB: n[o] ?? "" });
  return r;
}
function gc(e, t) {
  const n = Ce(t, e.componentA, "SmallMoleculeComponentViz"), r = Ce(t, e.componentB, "SmallMoleculeComponentViz");
  return !n || !r ? null : { ...e, registry: Ro(t, [e.componentA, e.componentB]) };
}
function fh(e, t, n) {
  const r = [], s = [];
  for (const [i, a] of n) {
    const c = e.coords[i], l = t.coords[a];
    c && l && (r.push(c), s.push(l));
  }
  const o = Up(r, s);
  return o?.determined ? { ...t, coords: t.coords.map((i) => Hp(i, o.R, o.t)) } : t;
}
function ph(e, t) {
  let n = 0;
  for (const s of [e, t]) {
    let o = 1 / 0;
    for (const i of s)
      i[0] < o && (o = i[0]), i[0] - o > n && (n = i[0] - o);
  }
  const r = Math.round(n * 10) / 10;
  return (r > zr.minSpread ? r : zr.minSpread) * zr.spreadFactor;
}
function hh(e, t) {
  const n = Xu, s = (t > 1 ? Math.min(Math.max(e / (t - 1), 0), 1) : 0) * (n.length - 1), o = Math.floor(s), i = Math.min(o + 1, n.length - 1), a = s - o;
  let c = "0x";
  for (let l = 0; l < 3; l++) {
    const d = (b) => parseInt(b.slice(1 + l * 2, 3 + l * 2), 16), m = Math.round(d(n[o]) + (d(n[i]) - d(n[o])) * a);
    c += m.toString(16).padStart(2, "0");
  }
  return c;
}
function mh(e, t) {
  const n = Ce(t, e.componentA, "SmallMoleculeComponentViz"), r = Ce(t, e.componentB, "SmallMoleculeComponentViz");
  if (!n || !r)
    return {
      problem: "This mapping names two molecules, and its registry does not hold them.",
      isError: !1
    };
  const s = _e(n), o = _e(r), i = dh(e);
  let a, c;
  try {
    a = Jr(n.sdf, s), c = Jr(r.sdf, o);
  } catch (d) {
    return { problem: `Could not read a molecule: ${ve(d)}`, isError: !0 };
  }
  c = fh(a, c, i);
  const l = /* @__PURE__ */ new Map();
  for (const [d, m] of i) l.set(m, d);
  return {
    pair: {
      from: n,
      to: r,
      nameA: s,
      nameB: o,
      pairs: i,
      molA: a,
      molB: c,
      uniquesA: Ti(i, a.symbols, c.symbols),
      uniquesB: Ti(l, c.symbols, a.symbols)
    }
  };
}
class gh extends Fe {
  placeholder() {
    return "Waiting for a LigandAtomMapping payload...";
  }
  renderView(t, n) {
    const r = mh(n, Et(n));
    if ("problem" in r)
      return t.appendChild($e(r.problem, r.isError)), {};
    const s = r.pair, o = N("div", "position:relative;flex:1;min-height:0;display:flex;flex-direction:column;");
    t.appendChild(o);
    const i = Kp(o, ho(t)), a = ut("atom-mapping.mode", "plain", Oi.map(($) => $.id));
    let c = a.get();
    const l = N("div", wa), d = Ea(
      Oi,
      c,
      ($) => {
        c = $, v();
      },
      { remember: a, fit: { pane: o, bar: l } }
    );
    l.appendChild(d), o.appendChild(l);
    const m = mo(), b = {
      plain: oh,
      colored: sh,
      openfe: ih,
      lines: ah
    }, v = () => {
      const $ = m.start();
      if (i.clear(), c === "info") return lh(i, s, n);
      if (c === "2d") return ch(i, s);
      const w = b[c];
      i.element.appendChild($e("Loading 3D viewer...")), lr().then(() => {
        $() && (i.element.replaceChildren(), w(i, s));
      }).catch((u) => {
        $() && i.element.replaceChildren($e(`3D render failed: ${ve(u)}`, !0));
      });
    };
    return v(), {
      onResize: () => i.resize(),
      cleanup: () => {
        m.stop(), d.cleanup(), i.cleanup();
      }
    };
  }
}
ze("gufe-atom-mapping", gh);
const yh = "ligand-network", $h = "Click a ligand or an edge to see it.";
function bh(e) {
  const { index: t, from: n, to: r, ...s } = e;
  return s;
}
function vh(e) {
  return tc(e);
}
const Fi = (e) => Math.round(e * 100) / 100;
function wh(e, t) {
  if (!e || typeof e != "object") return null;
  const n = e, r = (i) => typeof i == "number" && Number.isFinite(i);
  if (!r(n.scale) || n.scale <= 0 || !r(n.tx) || !r(n.ty) || !Array.isArray(n.nodes) || n.nodes.length !== t || !n.nodes.every((i) => Array.isArray(i) && i.length === 2 && i.every(r))) return null;
  const s = r(n.selected) ? Math.trunc(n.selected) : -1, o = n.selectedKind === "ligand" ? "ligand" : "edge";
  return { nodes: n.nodes, scale: n.scale, tx: n.tx, ty: n.ty, selected: s, selectedKind: o };
}
function _h(e, t) {
  e.forEach((n, r) => {
    n.x = t[r][0], n.y = t[r][1], n.fx !== void 0 && (n.fx = n.x), n.fy !== void 0 && (n.fy = n.y);
  });
}
const Tt = { initial: 0.58, min: 0.25, max: 0.8 }, Oe = 38, zi = 1.5, jr = {
  /** Where the charge sits while the structure has the middle of the node, as a fraction of the radius. */
  at: 0.55,
  fontSize: 22,
  /**
   * The charge on the zooms that draw no structure: bigger, and across the top
   * of the node rather than in the corner of it.
   *
   * Out there a node is a disc with a name in it, and the charge is the only
   * other thing about a ligand this view still knows. At the corner size it
   * would be a dot on a dot; this is the second thing a reader can still make
   * out, which is what a level of detail is for.
   *
   * It stays in the corner rather than moving to the middle, because the middle
   * is where that name is drawn: a charge over it makes two unreadable things
   * out of one readable one, and at this zoom the node is small enough that the
   * corner is beside it rather than far from it.
   */
  bigFontSize: 30
}, Sh = "6 4", ji = 200, kh = 2, Ch = Math.SQRT2 * (Oe - kh), Eh = 14, xh = 18, Ae = {
  fontSize: 11,
  below: Oe + 12,
  minFontSize: 7,
  insideWidth: (Oe - 6) * 2
}, jt = { captionPadX: 4, captionPadY: 1, captionRadius: 3 }, Ii = 1.5, Ah = 6.5, Ph = 0.9, Rh = 14, Ir = { size: 8, clearance: 8 }, Mh = { fontSize: 10 }, Nh = 0.4, Oh = () => Gr(ue.netMatchAtom), Dr = { padding: 4, opacity: 0.95 }, Vn = { gap: 2, rail: 1, opacity: 1 }, yc = [
  { id: "structures", from: 0.4, disc: !1, structure: !0, name: "below", initials: !1, edgeScores: !0 },
  { id: "names", from: 0.25, disc: !0, structure: !1, name: "inside", initials: !1, edgeScores: !0 },
  { id: "shape", from: 0, disc: !0, structure: !1, name: "none", initials: !0, edgeScores: !1 }
], Th = (e) => cc(yc, e), Fh = (e) => jp(yc, e), zh = 1.8, Di = 2 * Oe + 68, Re = {
  /** What a perfectly scored mapping asks for. A poor one asks for the bonus on top. */
  linkBaseDistance: Di,
  linkScoreBonus: 90,
  linkStrength: 0.45,
  // Repulsion is local rather than the width of the graph. Reaching further
  // does not move neighbours apart, it only inflates the whole layout, and a
  // graph spread over thousands of units is one that is both too small to read
  // as a whole and too crowded to read up close. `chargeDistanceMax` is what
  // holds that line, and widening it past this buys nothing measurable.
  //
  // What does move neighbours apart is the strength inside that range, and
  // collision alone is not enough of it: a ligand only ever pushed at the
  // moment its circle touches another settles hard against that contact, which
  // leaves a knot of ligands at arm's length from each other and the mappings
  // between them crossing over and running under circles they have nothing to
  // do with. Repulsion that is already firm before anything touches is what
  // spreads a crowded neighbourhood out enough to follow a line through it.
  // Past roughly this the layout stops untangling and only grows, framing every
  // ligand smaller for no clearer a picture.
  chargeStrength: -2400,
  chargeDistanceMin: 20,
  chargeDistanceMax: 900,
  centerStrength: 0.08,
  /** Holds a pair exactly `NODE_SPACING` apart, so links settle at their distance rather than against this. */
  collisionPadding: Di / 2 - Oe,
  collisionIterations: 4,
  drift: 0.04,
  tickMultiplier: 2
};
function jh(e) {
  const t = N("div", ku);
  return e.appendChild(t), {
    show(n, r, s) {
      t.innerHTML = n, t.style.left = `${r + 14}px`, t.style.top = `${s - 10}px`, t.style.opacity = "1";
    },
    hide() {
      t.style.opacity = "0";
    },
    remove() {
      t.remove();
    }
  };
}
function Ih(e) {
  const t = /* @__PURE__ */ new Map();
  return (n) => {
    const r = t.get(n);
    if (r) return r;
    const s = `arrow-${n.replace(/[^a-zA-Z0-9]/g, "")}`;
    t.set(n, s);
    const o = le("marker", {
      id: s,
      viewBox: "0 -5 10 10",
      // Pushes the head back along the line so it stops at the node's edge
      // rather than under it.
      refX: Oe + Ir.clearance,
      refY: 0,
      markerUnits: "userSpaceOnUse",
      markerWidth: Ir.size,
      markerHeight: Ir.size,
      orient: "auto"
    });
    return o.appendChild(le("path", { d: "M0,-5L10,0L0,5", fill: n })), e.appendChild(o), s;
  };
}
function Dh(e) {
  const t = parseInt(e.replace("#", ""), 16);
  return [t >> 16 & 255, t >> 8 & 255, t & 255];
}
function Lh(e) {
  const [t, n] = ue.netEdgeRamp.map(Dh), r = Math.max(0, Math.min(1, e ?? 0.5));
  return `rgb(${t.map((o, i) => Math.round(o + (n[i] - o) * r)).join(",")})`;
}
const Me = _e;
function Gn(e, t) {
  return t ? Me(e).toLowerCase().includes(t) || (e.smiles ?? "").toLowerCase().includes(t) || e["gufe-key"].toLowerCase().includes(t) : !0;
}
function Bh(e, t, n, r, s) {
  const o = r.trim().toLowerCase(), i = n.size > 0 || o.length > 0;
  if (!i && s <= 0) return null;
  const a = /* @__PURE__ */ new Set();
  for (const l of e) {
    const d = l["gufe-key"];
    (!i || n.has(d) || o.length > 0 && Gn(l, o)) && a.add(d);
  }
  const c = /* @__PURE__ */ new Set();
  return t.forEach((l, d) => {
    (l.score ?? 0) < s || !a.has(l.from["gufe-key"]) || !a.has(l.to["gufe-key"]) || c.add(d);
  }), { nodes: a, edges: c };
}
function qh(e) {
  const t = new dc(), n = fr("cpk"), r = Oh(), s = ($) => (e.matched().get($) ?? []).join(","), o = ($, w) => {
    if (!t.wants(w)) return;
    const u = e.nodes[w], g = e.matched().get(w), h = u.sdf && Co(
      $,
      u.sdf,
      ji,
      Te.layout,
      g && { atoms: g, color: r, radius: Nh },
      n
    );
    if (!h) {
      t.refused(w);
      return;
    }
    if (!pc(e.depictionGroups[w], h, ji, Ch)) {
      t.refused(w);
      return;
    }
    t.drew(w, s(w));
  }, i = () => t.forget(s, ($) => e.depictionGroups[$].replaceChildren()), a = [], c = ($, w) => {
    if (a[$]) return a[$];
    w.setAttribute("font-size", String(Ae.fontSize));
    let u = 0;
    try {
      u = w.getBBox().width;
    } catch {
      return Ae.fontSize;
    }
    if (!u) return Ae.fontSize;
    const g = Ae.fontSize * Ae.insideWidth / u;
    return a[$] = Math.max(Ae.minFontSize, Math.min(Ae.fontSize, g)), a[$];
  }, l = [], d = ($) => {
    const w = e.captionPlates[$];
    if (l[$] === Ae.below) {
      w.setAttribute("display", "inline");
      return;
    }
    let u = null;
    try {
      u = e.captions[$].getBBox();
    } catch {
      u = null;
    }
    if (!u?.width) {
      w.setAttribute("display", "none");
      return;
    }
    w.setAttribute("x", String(u.x - jt.captionPadX)), w.setAttribute("y", String(u.y - jt.captionPadY)), w.setAttribute("width", String(u.width + jt.captionPadX * 2)), w.setAttribute("height", String(u.height + jt.captionPadY * 2)), w.setAttribute("display", "inline"), l[$] = Ae.below;
  }, m = ($, w) => {
    const u = w.structure && !t.has($) ? Fh(w) : w;
    e.depictionGroups[$].setAttribute("display", u.structure ? "inline" : "none");
    const g = e.plates[$];
    g.setAttribute("display", u.structure ? "inline" : "none");
    const h = e.matched().has($);
    g.setAttribute("stroke", h ? ue.netMatchStroke : ue.netNodeStroke);
    const _ = e.circles[$];
    _.setAttribute("fill", u.disc ? h ? ue.netMatchFill : ue.netNodeFill : "none"), _.setAttribute("stroke", u.disc ? h ? ue.netMatchStroke : ue.netNodeStroke : "none"), e.initials[$].setAttribute("display", u.initials ? "inline" : "none");
    const S = e.charges[$];
    if (S) {
      const C = !u.structure, A = Oe * jr.at;
      S.setAttribute("x", String(A)), S.setAttribute("y", String(-A)), S.setAttribute("font-size", String(C ? jr.bigFontSize : jr.fontSize)), S.setAttribute("font-weight", C ? ge.bold : ge.normal);
    }
    const f = e.captions[$], p = u.name === "below";
    if (f.setAttribute("fill", h ? ue.netMatchStroke : p ? nf() : ue.netNodeCaption), f.setAttribute("display", u.name === "none" ? "none" : "inline"), p || e.captionPlates[$].setAttribute("display", "none"), u.name === "none") return;
    const y = u.name === "inside";
    f.setAttribute("y", y ? "0" : String(Ae.below)), f.setAttribute("dominant-baseline", y ? "middle" : "auto"), f.setAttribute("font-size", String(y ? c($, f) : Ae.fontSize)), p && d($);
  };
  let b = null;
  return { apply: ($, w, u) => {
    const g = Th($);
    b = g, e.stage.setAttribute("data-detail", g.id), e.edgeLabels.setAttribute("display", g.edgeScores ? "inline" : "none");
    for (let _ = 0; _ < e.nodes.length; _++) m(_, g);
    if (!g.structure) return;
    const h = uc(e.nodes, { scale: $, tx: w, ty: u }, e.viewport(), (_) => t.wants(_));
    h.length && e.rdkit().then((_) => {
      if (!(!_ || b !== g))
        for (const S of h)
          o(_, S), m(S, g);
    }).catch(() => {
    });
  }, forget: i };
}
function Vh(e, t, n) {
  const r = e["gufe-key"];
  return t.some(
    (s) => (s.score ?? 0) >= n && (s.from["gufe-key"] === r || s.to["gufe-key"] === r)
  );
}
function Uh(e) {
  const t = e.score.setting;
  let n = () => {
  };
  return ac({
    namespace: "ligand-network",
    nodes: e.nodes,
    edges: e.edges,
    selected: e.selected,
    query: e.query,
    search: {
      placeholder: "Search",
      label: "Search ligands by name, SMILES or gufe key"
    },
    // The SMARTS box sits below the search and does the opposite thing: the
    // search narrows the list, and this hides nothing at all. Asked for that way
    // on purpose - which ligands do *not* contain the scaffold is the half of
    // the answer a filter throws away.
    smarts: {
      placeholder: "Colour by SMARTS",
      label: "Colour the ligands matching this SMARTS pattern",
      describe: (r) => {
        const s = r.unreadable ? `, ${r.unreadable} could not be read` : "";
        return `${r.matched.size} of ${e.nodes.length} ligands match${s}`;
      }
    },
    match: (r) => e.match(r),
    resetFilters: () => n(),
    filters: (r) => {
      const s = N("div", `display:flex;align-items:center;gap:${X.lg};font-size:${ee.small};color:${j.textMuted};`), o = N("span", `min-width:28px;color:${j.textPrimary};`, "0.00"), i = N("input", "flex:1;");
      i.type = "range", i.min = "0", i.max = "1", i.step = "0.01", i.setAttribute("aria-label", "Hide mappings scoring below this");
      const a = (c) => {
        i.value = String(c), o.textContent = c.toFixed(2), e.filter.minScore = c, t.set(c);
      };
      return a(t.get()), i.oninput = () => {
        a(Number(i.value)), r(), e.refresh();
      }, n = () => a(0), e.score.onReset(() => {
        n(), r(), e.refresh();
      }), s.appendChild(N("span", "", "score >=")), s.appendChild(i), s.appendChild(o), [s];
    },
    // The threshold reaches this list too. A ligand whose every mapping scores
    // below it has nothing left in the network being asked about, so listing it
    // under a count that says how many survived was read as the filter not
    // working. Zero is "no threshold", where every ligand is listed however it
    // is connected - including one with no mappings at all.
    shows: (r) => Gn(r, e.query.text.trim().toLowerCase()) && (e.filter.minScore <= 0 || Vh(r, e.edges, e.filter.minScore)),
    row: (r) => ({
      name: Me(r),
      title: `${Me(r)}
${r.smiles ?? ""}`
    }),
    // The threshold first, because a mapping below it is one this view is being
    // told not to show at all; then either end against the search, because a
    // search for one ligand is asking which mappings it has.
    edgeShows: (r) => {
      if ((r.score ?? 0) < e.filter.minScore) return !1;
      const s = e.query.text.trim().toLowerCase();
      return Gn(r.from, s) || Gn(r.to, s);
    },
    edgeRow: (r) => ({
      // The score before the name, where the alchemical network puts its
      // colour swatch: it is what the slider above the list acts on, and a
      // threshold with no scores in sight is a control with nothing to aim at.
      before: Hh(r.score),
      name: `${Me(r.from)} to ${Me(r.to)}`,
      title: `${Me(r.from)} to ${Me(r.to)}
${r.score == null ? "no score" : `score ${r.score.toFixed(3)}`}`
    }),
    words: {
      // Named "mappings" rather than "edges": on this canvas an edge is a
      // mapping, and the panel says so everywhere else.
      nodes: { tab: "Ligands", plural: "ligands" },
      edges: { tab: "Mappings", plural: "mappings" }
    },
    refresh: e.refresh,
    focus: e.focus,
    focusEdge: e.focusEdge
  });
}
function Hh(e) {
  return N(
    "span",
    `flex-shrink:0;min-width:26px;font-variant-numeric:tabular-nums;color:${j.textMuted2};`,
    e == null ? "--" : e.toFixed(2)
  );
}
class Kh extends Fe {
  placeholder() {
    return "Waiting for a LigandNetwork payload...";
  }
  renderView(t, n) {
    const r = Et(n), { nodes: s, edges: o, unresolved: i, dangling: a } = oc({
      registry: r,
      keys: n.nodes ?? [],
      nodeType: "SmallMoleculeComponentViz",
      edges: n.edges ?? [],
      ends: (E) => [E.componentA, E.componentB]
    }), c = sr(n.name || "Ligand network", Bt(this));
    c.statsEl.appendChild(Ve("ligands", String(s.length))), c.statsEl.appendChild(Ve("mappings", String(o.length))), t.appendChild(c);
    const l = N("div", "flex:1;display:flex;flex-direction:row;min-height:0;overflow:hidden;");
    t.appendChild(l);
    const d = /* @__PURE__ */ new Set(), m = { minScore: 0 }, b = { text: "" }, v = Dt("ligand-network.minScore", 0, 0, 1);
    let $ = () => {
    };
    const w = () => Pa(), u = sc(
      w,
      s.map((E) => E.sdf ?? "")
    );
    let g = /* @__PURE__ */ new Map();
    const h = async (E) => {
      const D = await u.run(E);
      return D.status === "superseded" || (g = D.status === "ok" ? D.matched : /* @__PURE__ */ new Map(), z()), D;
    }, _ = Ao(
      c,
      () => Uh({
        nodes: s,
        edges: o,
        selected: d,
        filter: m,
        query: b,
        score: {
          setting: v,
          onReset: (E) => {
            $ = E;
          }
        },
        refresh: () => H(),
        // Jumping to a ligand and opening it are one action: the list is
        // how you find one you cannot see, and finding it is not the point.
        focus: (E) => {
          T?.focusOn(E), O({ kind: "ligand", index: E });
        },
        // The same for a mapping, which the pane can draw as well as a
        // ligand: the list is how a reader reaches one of nine hundred edges.
        focusEdge: (E) => {
          T?.focusOnEdge(E), O({ kind: "edge", index: E });
        },
        match: (E) => h(E)
      }),
      {
        label: "Search, filter and select ligands",
        onToggle: () => k(),
        remember: ct("ligand-network.menuOpen", !1),
        extras: Po
      }
    );
    l.appendChild(_.panel);
    let S = () => {
    };
    const f = N("div", `min-width:0;min-height:0;display:flex;flex-direction:column;background:${j.netCanvasBg};`), p = N("div", `min-width:0;min-height:0;display:flex;flex-direction:column;background:${j.appBg};`);
    l.appendChild(f), l.appendChild(
      Ka(l, f, p, {
        min: Tt.min,
        max: Tt.max,
        // How much of the width goes to the mapping rather than to the graph is
        // a preference about how someone reads a network, so it is kept.
        remember: Dt("ligand-network.canvasShare", Tt.initial, Tt.min, Tt.max),
        // The graph is drawn to a size, so a divider that moved is a graph that
        // has to be drawn again - at the end of the drag rather than during it,
        // because on the far side of this is a force simulation.
        onResize: () => S(),
        onOrient: (E) => Eo(_.panel, E)
      })
    ), l.appendChild(p);
    const y = N("div", `flex:1;position:relative;overflow:hidden;min-height:0;background:${j.netCanvasBg};`);
    f.appendChild(y), this.#e(y, o.some((E) => Ei(E.from, E.to) !== 0)), Oa(
      y,
      () => {
        v.set(0), m.minScore = 0, $(), T?.reset();
      },
      "Reset pan, zoom and the score filter"
    );
    const C = this.#t(p, r);
    if (!s.length)
      return y.appendChild(
        $e(
          i ? "None of this network's ligands are in its registry." : "This network has no ligands."
        )
      ), C.message("Nothing to show."), {};
    i && lt(
      y,
      `${i} ligand${i === 1 ? "" : "s"} named by this network are not in its registry`
    ), a && lt(y, `${a} mapping${a === 1 ? "" : "s"} name a ligand this network does not contain`);
    const A = w(), P = jh(y);
    let T = null;
    const R = wh(ka(yh), s.length);
    let L = R && { scale: R.scale, tx: R.tx, ty: R.ty };
    const I = R ? R.nodes : null;
    let Q = !1, V = o.length ? { kind: "edge", index: 0 } : null;
    if (R && R.selected >= 0) {
      const E = R.selectedKind ?? "edge";
      R.selected < (E === "ligand" ? s.length : o.length) && (V = { kind: E, index: R.selected });
    }
    const q = () => T?.transform() ?? { scale: 1, tx: 0, ty: 0 };
    let Y = !1;
    const re = mo(), U = () => {
      if (!V) {
        C.message(o.length ? $h : "Click a ligand to see it.");
        return;
      }
      V.kind === "edge" ? C.showMapping(o[V.index]) : C.showLigand(s[V.index]);
    }, O = (E) => {
      V = E, U(), T?.setSelected(V);
    }, H = () => {
      const E = Bh(s, o, d, b.text, m.minScore);
      T?.setEmphasis(E?.nodes ?? null, E?.edges ?? null);
    }, z = () => T?.setMatches(g), k = () => {
      const E = T?.transform() ?? null, D = re.start();
      T?.cleanup(), T = null, y.querySelectorAll("svg").forEach((W) => W.remove());
      const te = y.clientWidth || 800, ne = y.clientHeight || 600;
      Q || (Gh(s, te, ne), I && (_h(s, I), Q = !0));
      const oe = () => {
        if (!D()) return;
        const W = this.#n(y, s, o, te, ne, O, A, P);
        T = W, W.setSelected(V), H(), z();
        const M = L ?? E;
        M ? (W.setTransform(M.scale, M.tx, M.ty), L = null) : W.fit();
      };
      if (Y || Q) {
        oe();
        return;
      }
      Wh(s, o, te, ne).then((W) => {
        if (D()) {
          if (W) {
            Q = !0, oe();
            return;
          }
          Y = !0, lt(y, "d3 could not be loaded - showing the ligands in a ring instead"), k();
        }
      }, oe);
    };
    return S = () => k(), k(), U(), {
      onResize: () => k(),
      cleanup: () => {
        re.stop(), u.cancel(), P.remove(), T?.cleanup(), T = null, C.cleanup();
      },
      viewState: () => ({
        nodes: s.map((E) => [Fi(E.x), Fi(E.y)]),
        ...q(),
        selected: V ? V.index : -1,
        selectedKind: V ? V.kind : "edge"
      })
    };
  }
  /**
   * The key to the edge colours, floating over the bottom right of the canvas.
   *
   * A row under the graph costs every network a strip of height for something
   * most readers consult once; over the picture it costs nothing, and bottom
   * right is the corner the reset control does not already sit in. No card
   * behind it - a panel over the canvas reads as another thing to look at, and
   * the key is not one. It takes no pointer events, so a drag that starts on it
   * still reaches the network.
   */
  #e(t, n) {
    const r = N(
      "div",
      `position:absolute;right:${X.xl};bottom:${X.xl};z-index:10;pointer-events:none;display:flex;align-items:center;gap:${X.xxl};flex-wrap:wrap;justify-content:flex-end;max-width:calc(100% - ${X.xl} - ${X.xl});font-size:${ee.tiny};color:${j.textMuted};`
    ), s = N("div", `display:flex;align-items:center;gap:${X.md};`);
    if (s.appendChild(N("span", "", "score")), s.appendChild(
      N(
        "span",
        // The literal ramp rather than a custom property: the edges it is a key
        // to are SVG attributes, which cannot resolve one, so the key is drawn
        // from the same two colours the lines were.
        `width:40px;height:4px;border-radius:2px;background:linear-gradient(to right,${ue.netEdgeRamp.join(",")});`
      )
    ), s.appendChild(N("span", "", "0 -> 1")), r.appendChild(s), n) {
      const o = N("div", `display:flex;align-items:center;gap:${X.md};`);
      o.appendChild(
        N(
          "span",
          `width:24px;height:0;border-top:2px dashed ${j.netEdgeLine};display:inline-block;`
        )
      ), o.appendChild(N("span", "", "net charge change")), r.appendChild(o);
    }
    t.appendChild(r);
  }
  /**
   * The right-hand pane, and what this view puts in it.
   *
   * The pane itself is `detailPane`, shared with the alchemical network. What is
   * here is the one thing that is this view's: an edge is a mapping, so it opens
   * `<gufe-atom-mapping>`; a node is one ligand, so it opens
   * `<gufe-small-molecule>` - and both have to be cut loose from the network
   * first, because an edge carries this view's index and both endpoints
   * resolved, a node carries wherever the layout put it, and a payload handed on
   * is a payload someone may validate.
   *
   * Neither picture is drawn twice, so the in-context one and the standalone one
   * cannot drift apart, and clicking either half of the graph puts the reader in
   * front of a view they have already met.
   */
  #t(t, n) {
    const r = fc(t);
    return {
      ...r,
      showMapping: (s) => r.show(gc(bh(s), n)),
      showLigand: (s) => r.show(vh(s))
    };
  }
  /** Build the SVG for the current node positions. Returns the handles the
   * caller needs afterwards: selection, depictions, and teardown. */
  #n(t, n, r, s, o, i, a, c) {
    const l = le("svg", {
      class: "gufe-graph",
      width: s,
      height: o,
      style: "display:block;touch-action:none;"
    }), d = le("g");
    l.appendChild(d), t.appendChild(l);
    const m = le("defs"), b = Ih(m);
    l.appendChild(m);
    const v = [], $ = [], w = le("g"), u = le("g"), g = le("g", { "pointer-events": "none" }), h = le("g");
    d.append(w, u, g, h);
    for (const V of r) {
      const q = Lh(V.score), Y = Ii + (V.score ?? 0.5) * (Ah - Ii), re = le("line", {
        class: "gufe-edge-select",
        stroke: ue.netEdgeSelect,
        "stroke-width": Y + (Vn.gap + Vn.rail) * 2,
        "stroke-linecap": "butt",
        opacity: 0,
        "pointer-events": "none"
      }), U = le("line", {
        class: "gufe-edge-select-gap",
        stroke: ue.netCanvasBg,
        "stroke-width": Y + Vn.gap * 2,
        "stroke-linecap": "butt",
        opacity: 0,
        "pointer-events": "none"
      }), O = Ei(V.from, V.to), H = le("line", {
        stroke: q,
        "stroke-width": Y,
        "stroke-opacity": Ph,
        // A mapping runs from A to B, and the arrow is what says which is which.
        "marker-end": `url(#${b(q)})`,
        "pointer-events": "none",
        ...O ? { "stroke-dasharray": Sh } : {}
      }), z = le("line", { stroke: "transparent", "stroke-width": Rh, style: "cursor:pointer;" });
      z.addEventListener("click", (D) => {
        D.stopPropagation(), i({ kind: "edge", index: V.index });
      }), z.addEventListener("mousemove", (D) => {
        c.show(
          `<div style="font-weight:700;color:${j.titleColor};">${Ie(Me(V.from))} -&gt; ${Ie(Me(V.to))}</div>` + (V.score == null ? `<div style="color:${j.textMuted2};">no score</div>` : `<div style="margin-top:4px;">score <b>${V.score.toFixed(3)}</b></div>`) + (O ? `<div style="margin-top:4px;">net charge <b>${Ie(at(O))}</b> <span style="color:${j.textMuted2};">(${Ie(at(V.from.total_charge ?? 0))} to ${Ie(at(V.to.total_charge ?? 0))})</span></div>` : "") + `<div style="margin-top:4px;font-size:${ee.tiny};color:${j.textMuted2};">Click to see the mapping</div>`,
          D.offsetX,
          D.offsetY
        );
      }), z.addEventListener("mouseleave", () => c.hide()), v.push({ outer: re, inner: U }), $.push(H), w.append(re, U, H), u.appendChild(z);
      const k = le("text", {
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        "font-size": Mh.fontSize,
        "font-weight": 600,
        fill: ue.netEdgeLabel
      });
      k.textContent = V.score == null ? "" : V.score.toFixed(2);
      const E = le("g", { class: "gufe-edge-label" });
      E.appendChild(k), g.appendChild(E);
    }
    const _ = [], S = [], f = [], p = [], y = [], C = [], A = [], P = [], T = n.map((V) => {
      const q = le("g", { class: "gufe-node", style: "cursor:grab;" });
      q.addEventListener("mousemove", (E) => {
        c.show(
          `<div style="font-weight:700;color:${j.titleColor};">${Ie(Me(V))}</div>` + (V.smiles ? `<div style="margin-top:3px;font-family:ui-monospace,Menlo,monospace;overflow-wrap:anywhere;">${Ie(V.smiles)}</div>` : "") + (V.total_charge ? `<div style="margin-top:3px;">formal charge <b>${Ie(at(V.total_charge))}</b></div>` : "") + `<div style="margin-top:3px;font-size:${ee.tiny};color:${j.textMuted2};overflow-wrap:anywhere;">${Ie(V["gufe-key"])}</div><div style="margin-top:4px;font-size:${ee.tiny};color:${j.textMuted2};">Click to see the ligand</div>`,
          E.offsetX,
          E.offsetY
        );
      }), q.addEventListener("mouseleave", () => c.hide());
      const Y = le("circle", {
        class: "gufe-node-halo",
        r: Oe + Dr.padding,
        fill: "none",
        stroke: ue.netHaloColor,
        "stroke-width": Dr.padding * 2,
        opacity: 0,
        "pointer-events": "none"
      });
      q.appendChild(Y), y.push(Y);
      const re = le("circle", {
        class: "gufe-node-disc",
        r: Oe,
        fill: ue.netNodeFill,
        stroke: ue.netNodeStroke,
        "stroke-width": zi,
        "pointer-events": "all"
      });
      q.appendChild(re), S.push(re);
      const U = le("circle", {
        class: "gufe-node-plate",
        r: Oe,
        fill: Kr(),
        stroke: ue.netNodeStroke,
        "stroke-width": zi,
        display: "none",
        "pointer-events": "none"
      });
      q.appendChild(U), f.push(U);
      const O = le("g", { class: "gufe-node-depiction", "pointer-events": "none" });
      q.appendChild(O), _.push(O);
      const H = le("text", {
        class: "gufe-node-initials",
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        "font-size": xh,
        "font-weight": 700,
        fill: ue.netInitials,
        "pointer-events": "none"
      });
      if (H.textContent = Me(V).slice(0, 2).toUpperCase(), q.appendChild(H), C.push(H), V.total_charge) {
        const E = le("text", {
          class: "gufe-node-charge",
          "text-anchor": "middle",
          "dominant-baseline": "central",
          fill: ue.badgeFg,
          "pointer-events": "none"
        });
        E.textContent = at(V.total_charge), q.appendChild(E), P.push(E);
      } else
        P.push(null);
      const z = le("text", {
        class: "gufe-node-caption",
        "text-anchor": "middle",
        y: Ae.below,
        "font-size": Ae.fontSize,
        "font-weight": 600,
        fill: ue.netNodeCaption,
        "pointer-events": "none"
      });
      z.textContent = Kn(Me(V), Eh), z.setAttribute("display", "none"), A.push(z);
      const k = le("rect", {
        class: "gufe-node-caption-plate",
        rx: jt.captionRadius,
        fill: Kr(),
        display: "none",
        "pointer-events": "none"
      });
      return p.push(k), q.appendChild(k), q.appendChild(z), h.appendChild(q), q;
    }), R = () => {
      r.forEach((V, q) => {
        for (const re of [v[q].outer, v[q].inner, $[q], u.children[q]]) {
          const U = re;
          U.setAttribute("x1", String(V.from.x)), U.setAttribute("y1", String(V.from.y)), U.setAttribute("x2", String(V.to.x)), U.setAttribute("y2", String(V.to.y));
        }
        g.children[q].setAttribute(
          "transform",
          `translate(${(V.from.x + V.to.x) / 2},${(V.from.y + V.to.y) / 2 - 8})`
        );
      }), n.forEach((V, q) => T[q].setAttribute("transform", `translate(${V.x},${V.y})`));
    };
    R();
    let L = /* @__PURE__ */ new Map();
    const I = qh({
      nodes: n,
      circles: S,
      plates: f,
      captionPlates: p,
      matched: () => L,
      captions: A,
      initials: C,
      charges: P,
      depictionGroups: _,
      edgeLabels: g,
      stage: l,
      rdkit: () => a,
      viewport: () => ({ width: s, height: o })
    }), Q = this.#r(
      l,
      d,
      n,
      T,
      R,
      I.apply,
      (V) => i({ kind: "ligand", index: V })
    );
    return {
      setSelected(V) {
        const q = V?.kind === "edge" ? V.index : -1, Y = V?.kind === "ligand" ? V.index : -1;
        v.forEach(({ outer: re, inner: U }, O) => {
          const H = O === q ? String(Vn.opacity) : "0";
          re.setAttribute("opacity", H), U.setAttribute("opacity", H);
        }), y.forEach((re, U) => re.setAttribute("opacity", U === Y ? String(Dr.opacity) : "0"));
      },
      /**
       * Colour the ligands a SMARTS pattern matched.
       *
       * Colour rather than filter, and deliberately a different channel from
       * `setEmphasis`: dimming answers "which ones did I ask for", colouring
       * answers "which ones contain this" - and the whole point of the second
       * question is seeing the ones that do not. So the two compose, and
       * neither hides anything.
       */
      setMatches(V) {
        L = V, I.forget();
        const { scale: q, tx: Y, ty: re } = Q.transform();
        I.apply(q, Y, re);
      },
      /**
       * Dim what is not emphasised rather than hiding it.
       *
       * Asked for directly: you want to see what is *not* selected too, because
       * a filter that removes the rest answers a different question from one
       * that fades it.
       */
      setEmphasis(V, q) {
        T.forEach((Y, re) => {
          const U = !V || V.has(n[re]["gufe-key"]);
          Y.setAttribute("opacity", U ? "1" : String(It.node));
        }), r.forEach((Y, re) => {
          const U = !q || q.has(re), O = U ? "0.9" : String(It.edge);
          $[re].setAttribute("stroke-opacity", O), g.children[re].setAttribute("opacity", U ? "1" : String(It.edge));
        });
      },
      focusOn(V) {
        const q = n[V];
        q && Q.centreOn(q.x, q.y);
      },
      focusOnEdge(V) {
        const q = r[V];
        q && Q.centreOn((q.from.x + q.to.x) / 2, (q.from.y + q.to.y) / 2);
      },
      fit: Q.fit,
      reset: Q.reset,
      transform: Q.transform,
      setTransform: Q.setTransform,
      cleanup: Q.cleanup
    };
  }
  /**
   * The camera this view moves on, with its nodes made draggable.
   *
   * The camera - wheel zoom, background pan, framing - is `sceneCamera`; the
   * drag and the click-versus-drag rule are `draggableNodes`. Both are shared
   * with the alchemical network. What is left here is the two things that are
   * about a *ligand* network rather than about a canvas: how far a node reaches
   * from its position, and how close `focus` lands.
   */
  #r(t, n, r, s, o, i, a) {
    const c = ec(t, n, {
      // A node is a disc with a caption under it, so its position is not its
      // extent.
      bounds: () => Qa(r, Oe),
      onTransform: i,
      hint: "Click the graph or hold Ctrl to zoom"
    });
    return lc(s, r, c, { moved: () => o(), clicked: a }), {
      ...c,
      /** Bring a ligand to the middle, zoomed in enough to read its structure. */
      centreOn: (l, d) => c.centreOn(l, d, zh)
    };
  }
}
function Gh(e, t, n) {
  const r = t / 2, s = n / 2, o = Math.min(t, n) * 0.34;
  e.forEach((i, a) => {
    const c = 2 * Math.PI * a / Math.max(1, e.length) - Math.PI / 2;
    i.x = r + o * Math.cos(c), i.y = s + o * Math.sin(c), i.fx = void 0, i.fy = void 0;
  });
}
function Wh(e, t, n, r) {
  return nc({
    nodes: e,
    // d3-force rewrites link endpoints in place, so it gets its own objects.
    links: t.map((s) => ({
      source: s.from["gufe-key"],
      target: s.to["gufe-key"],
      score: s.score
    })),
    tickMultiplier: Re.tickMultiplier,
    forces: (s, o) => [
      [
        "link",
        s.forceLink(o).id((i) => i["gufe-key"]).distance((i) => Re.linkBaseDistance + (1 - (i.score ?? 0.5)) * Re.linkScoreBonus).strength(Re.linkStrength)
      ],
      [
        "charge",
        s.forceManyBody().strength(Re.chargeStrength).distanceMin(Re.chargeDistanceMin).distanceMax(Re.chargeDistanceMax)
      ],
      ["center", s.forceCenter(n / 2, r / 2).strength(Re.centerStrength)],
      ["collision", s.forceCollide(Oe + Re.collisionPadding).iterations(Re.collisionIterations)],
      ["x", s.forceX(n / 2).strength(Re.drift)],
      ["y", s.forceY(r / 2).strength(Re.drift)]
    ]
  });
}
ze("gufe-ligand-network", Kh);
function Mo(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of Object.values(e.components ?? {})) {
    const s = Ne(t, r);
    if (!s) {
      n.add("missing");
      continue;
    }
    n.add(
      s.type === "UnknownComponentViz" ? s.gufe_type : s.type.replace(/(?:Component)?Viz$/, "")
    );
  }
  return [...n].sort();
}
const Qn = (e, t) => Mo(e, t).join(" + "), Li = ["Protein", "ProteinMembrane", "SolvatedPDB"];
function Jh(e) {
  const t = e.split(" + ").filter(Boolean);
  return t.filter((r) => r !== "SmallMolecule" && r !== "Solvent" && !Li.includes(r)).length ? e : t.some((r) => Li.includes(r)) ? "complex" : t.some((r) => r === "Solvent") ? "solvent" : "vacuum";
}
function $c(e) {
  const t = e.map(Jh), n = /* @__PURE__ */ new Map();
  for (const r of t) n.set(r, (n.get(r) ?? 0) + 1);
  return t.map((r, s) => n.get(r) > 1 ? e[s] : r);
}
function Yh(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of [e.stateA, e.stateB]) {
    const s = r === void 0 ? null : Ce(t, r, "ChemicalSystemViz");
    if (s)
      for (const o of Mo(s, t)) n.add(o);
  }
  return [...n].sort().join(" + ");
}
function Xh(e, t) {
  const n = e.map((o) => Yh(o, t)), r = [...new Set(n)].sort(
    (o, i) => o.split(" + ").length - i.split(" + ").length || o.localeCompare(i)
  ), s = new Map(r.map((o, i) => [o, i]));
  return { signatures: r, names: $c(r), ofEdge: n.map((o) => s.get(o)) };
}
function bc(e, t) {
  const n = Object.values(e.components ?? {}).filter(
    (r) => Ce(t, r, "SmallMoleculeComponentViz")
  );
  return [...new Set(n)].sort();
}
function vc(e, t) {
  const n = $c(e), r = /* @__PURE__ */ new Map();
  for (const s of n) r.set(s, (r.get(s) ?? 0) + 1);
  return n.map((s, o) => r.get(s) > 1 ? t[o] : s);
}
function Zh(e, t) {
  return vc(
    e.map((n) => Qn(n, t)),
    e.map((n) => _e(n))
  );
}
function wc(e) {
  let t = e[0] ?? "";
  for (const n of e.slice(1)) {
    let r = 0;
    for (; r < t.length && r < n.length && t[r] === n[r]; ) r++;
    t = t.slice(0, r);
  }
  return t = t.replace(/[\s_\-.:,;([{]+$/, ""), t.length >= 3 ? t : "";
}
function Qh(e, t) {
  if (e.length === 1) return e[0].name;
  const n = bc(e[0], t);
  if (n.length === 1) {
    const r = Ne(t, n[0]);
    if (r) return _e(r);
  }
  return wc(e.map((r) => _e(r))) || e[0].name;
}
function em(e, t, n) {
  const r = /* @__PURE__ */ new Map(), s = [];
  for (const o of e) {
    const i = bc(o, t), a = i.length ? i.join("+") : o["gufe-key"], c = r.get(a);
    if (c) {
      c.push(o);
      continue;
    }
    r.set(a, [o]), s.push(a);
  }
  return s.map((o) => {
    const a = r.get(o).map((c, l) => ({ system: c, index: l, rank: n(c) })).sort((c, l) => c.rank - l.rank || c.index - l.index).map(({ system: c }) => c);
    return {
      "gufe-key": a[0]["gufe-key"],
      name: Qh(a, t),
      systems: a,
      legs: Zh(a, t)
    };
  });
}
function tm(e) {
  if (e.systems.length === 1) return e.systems[0];
  const t = {}, n = /* @__PURE__ */ new Map();
  return e.systems.forEach((r, s) => {
    for (const [o, i] of Object.entries(r.components ?? {})) {
      const a = n.get(o);
      if (a === void 0) {
        n.set(o, { key: i, at: s }), t[o] = i;
        continue;
      }
      a.key !== i && (o in t && (t[`${o} (${e.legs[a.at]})`] = a.key, delete t[o]), t[`${o} (${e.legs[s]})`] = i);
    }
  }), {
    type: "ChemicalSystemViz",
    "gufe-key": e["gufe-key"],
    name: _e(e),
    components: t
  };
}
const nm = ["ProteinComponentViz", "SolvatedPDBComponentViz", "ProteinMembraneComponentViz"];
function _c(e, t) {
  const n = [], r = [];
  for (const s of Object.values(e.components ?? {})) {
    const o = Ne(t, s);
    o && (nm.includes(o.type) ? n.push(o) : o.type === "SmallMoleculeComponentViz" && r.push(o));
  }
  return { structures: n, ligands: r };
}
function rm(e) {
  return e.structures.length > 0 && e.ligands.length > 0;
}
const Bi = [
  { id: "site", label: "Site", title: "Frame the ligand and the site around it" },
  { id: "whole", label: "Whole", title: "Frame the entire complex" }
], om = 0.4;
class sm extends Fe {
  /**
   * Which ligands are in the scene, by their index in `complexPartsFor`'s own
   * `ligands` - or null to let the element decide, which is the first alone.
   *
   * Set by whatever mounts this, before the payload, and owned by it. The
   * control that edits it is the component strip of `<gufe-chemical-system>`,
   * for two reasons: that strip already names every ligand, so a second list of
   * the same names over the picture was the same word twice with two states to
   * keep in step; and the strip outlives this element, which is torn down and
   * rebuilt every time a reader clicks to another pane and back. A set held out
   * there is what makes the choice survive that round trip.
   *
   * Mounted on its own - no strip, nobody to hand one over - the element opens
   * on the first ligand and stays there, which is the safe half of the reason
   * this defaults the way it does.
   */
  ligandsShown = null;
  /**
   * Redraw after the host has edited `ligandsShown`.
   *
   * Assigned by `renderView`, so a call before the first render or after a
   * teardown does nothing rather than throwing - which is what a host holding a
   * detached element and a live set needs it to do.
   */
  refreshLigands = () => {
  };
  placeholder() {
    return "Waiting for a ChemicalSystem payload...";
  }
  renderView(t, n) {
    const r = _c(n, Et(n)), s = r.structures.map((u, g) => g), o = r.ligands.map((u, g) => r.structures.length + g), i = this.ligandsShown ?? new Set(r.ligands.length ? [0] : []);
    this.ligandsShown = i;
    const a = () => o.filter((u, g) => i.has(g)), c = ut(
      "complex.focus",
      "site",
      Bi.map((u) => u.id)
    );
    let l = c.get(), d = null;
    const m = Ya({
      element: this,
      host: t,
      title: n.name ?? "",
      fallbackTitle: "Complex",
      // The exception the protein view makes for its own reason and this one
      // makes for another: in a complex the waters sit between the eye and the
      // site.
      waters: !1,
      // The complex opens on the surface: what a reader wants from this pane is
      // the shape of the pocket the ligand sits in, which a backbone ribbon does
      // not show. The protein view, where the structure is the subject, still
      // opens on the cartoon.
      rep: "surface",
      heteroTitle: "Show hetero atoms / ions / lipids in the structure",
      menuLabel: "Representation, colouring, framing and display options",
      // The structure's key, not this system's: every leg of a campaign is a
      // different chemical system holding the same protein, and the camera
      // belongs to the protein. So clicking along the legs keeps the site in
      // front of the reader instead of re-framing on each one.
      cameraKey: r.structures[0]?.["gufe-key"] ?? null,
      restyle: b,
      // The framing belongs beside the reset, which is the other control that
      // moves the camera rather than what is in front of it.
      camera: () => [
        Ct(
          Bi,
          l,
          (u) => {
            l = u, v();
          },
          c
        )
      ],
      // Back to the framing in force, not to the whole scene: someone reading a
      // site who has spun the camera off it wants the site back.
      reset: () => v()
    });
    function b() {
      const u = m.viewer();
      if (!u) return;
      Xr(u, m.opts, d, m.showStatus, { model: s }, m.stillWanted);
      const g = a(), h = o.filter((_, S) => !i.has(S));
      g.length && rp(u, { model: g }), h.length && u.setStyle({ model: h }, {}), u.render();
    }
    function v() {
      const u = m.viewer();
      if (!u) return;
      const g = a();
      l === "site" && g.length ? (u.zoomTo({ model: g }), u.zoom(om)) : u.zoomTo(), u.render(), $();
    }
    function $() {
      const u = m.viewer();
      u && (m.interaction()?.cleanup(), m.setInteraction(dr(m.pane.container, u)));
    }
    if (!r.structures.length || !r.ligands.length)
      return m.showStatus("This system has no ligand and structure to draw together."), {};
    const w = () => m.setStats(im(r, i, d));
    w();
    try {
      d = Va(r.structures[0].pdb), w();
    } catch (u) {
      m.showStatus(`PDB parse error: ${ve(u)}`, "error");
    }
    return this.refreshLigands = () => {
      b(), w();
    }, m.showStatus("Loading 3D viewer..."), lr().then(() => {
      const u = nt.createViewer(m.pane.container, { backgroundColor: Lt.viewer() });
      m.setViewer(u);
      for (const g of r.structures) u.addModel(g.pdb, "pdb");
      for (const g of r.ligands) u.addModel(La(g.sdf), "sdf");
      b(), m.restoreCamera() ? $() : v(), u.spin(m.opts.spin ? "y" : !1), u.render();
    }).catch((u) => {
      m.showStatus(`Failed to render structure: ${ve(u)}`, "error");
    }), m.handle;
  }
}
function im(e, t, n) {
  const r = e.ligands.filter((i, a) => t.has(a)), s = r.reduce((i, a) => {
    const c = ko(a.sdf);
    return c ? i + c.atoms : i;
  }, 0), o = e.ligands.length === 1 ? `ligand ${s} atoms` : `${r.length} of ${e.ligands.length} ligands shown, ${s} atoms`;
  return n ? [o, ...Ua(n)] : [o];
}
ze("gufe-complex", sm);
function am(e, t) {
  return {
    ...e,
    registry: Ro(t, Object.values(e.components ?? {}))
  };
}
const cm = "chemical-system.component", qi = 0, Vi = 200, Un = { min: 140, max: 420 }, lm = "45%", dm = "35%";
function um(e) {
  return e.name ? e.name : e.type === "UnknownComponentViz" ? e.gufe_type : "(unnamed)";
}
function fm(e) {
  return e.type === "UnknownComponentViz" ? ir(e.gufe_type) : null;
}
function pm(e) {
  const t = N("span", "display:inline-flex;");
  return t.innerHTML = '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1.6 8C3.3 5.3 5.5 4 8 4C10.5 4 12.7 5.3 14.4 8C12.7 10.7 10.5 12 8 12C5.5 12 3.3 10.7 1.6 8Z"/><circle cx="8" cy="8" r="2.1"/>' + (e ? "" : '<path d="M3.2 12.8L12.8 3.2"/>') + "</svg>", t;
}
function hm() {
  return qt(
    `display:flex;align-items:center;justify-content:center;flex-shrink:0;width:30px;border:1px solid;border-radius:${Ee.lg};cursor:pointer;color:${j.textMuted};`
  );
}
function mm(e, t, n) {
  e.setAttribute("aria-pressed", String(n)), e.title = n ? `Hide ${t} in the complex` : `Show ${t} in the complex`, e.setAttribute("aria-label", e.title), e.replaceChildren(pm(n));
}
function Ui(e) {
  return N(
    "div",
    `padding:10px 10px 16px;font-weight:${ge.bold};font-size:${ee.title};color:${j.titleColor};letter-spacing:.02em;line-height:1.3;overflow-wrap:anywhere;flex-shrink:0;`,
    e
  );
}
class gm extends Fe {
  placeholder() {
    return "Waiting for a ChemicalSystem payload...";
  }
  renderView(t, n) {
    const r = Et(n), s = [], o = [];
    for (const [q, Y] of Object.entries(n.components ?? {})) {
      const re = Ne(r, Y);
      re ? s.push([q, re]) : o.push(q);
    }
    const i = n.name || "Chemical system";
    if (!s.length)
      return t.appendChild(Ui(i)), t.appendChild(
        $e(
          o.length ? "None of this system's components are in its registry." : "This chemical system has no components."
        )
      ), {};
    const a = N(
      "div",
      "flex:1;min-height:0;position:relative;display:flex;flex-direction:row;"
    );
    t.appendChild(a), o.length && lt(
      a,
      `${o.length} component${o.length === 1 ? "" : "s"} named by this system (${o.join(", ")}) are not in its registry`
    );
    const c = N(
      "div",
      `min-width:0;min-height:0;display:flex;flex-direction:column;background:${j.panelBg};`
    );
    c.className = "gufe-components", a.appendChild(c), c.appendChild(Ui(i));
    const l = N(
      "div",
      "min-width:0;min-height:0;overflow-y:auto;display:flex;gap:6px;padding:0 10px 10px;"
    );
    c.appendChild(l);
    const d = Ga(c, {
      initial: Vi,
      min: Un.min,
      max: Un.max,
      maxShare: lm,
      remember: Dt("chemical-system.stripWidth", Vi, Un.min, Un.max),
      label: "Resize the component list",
      // What is mounted was drawn to the old shape, and a 3D viewer sizes its
      // canvas once.
      onResize: () => p?.resize?.()
    });
    a.appendChild(d.element);
    const m = N(
      "div",
      "flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;"
    );
    a.appendChild(m);
    const b = N(
      "div",
      "flex:1;min-height:0;display:flex;"
    );
    m.appendChild(b);
    const v = document.createElement("alchemy-view");
    v.style.cssText = "flex:1;min-width:0;min-height:0;", v.setAttribute(Vr, ""), b.appendChild(v);
    const $ = _c(n, r), w = rm($), u = (q) => w && $.structures.some(
      (Y) => Y === q
    ), g = new Set(w && $.ligands.length ? [0] : []), h = (q) => {
      const Y = $.ligands.indexOf(q);
      return Y < 0 ? void 0 : Y;
    }, _ = w && $.ligands.length > 1, S = s.filter(([, q]) => !u(q)).map(([q, Y]) => ({
      key: q,
      title: q,
      subtitle: um(Y),
      badge: fm(Y),
      element: v,
      ligand: _ ? h(Y) : void 0,
      point: () => {
        v.payload = Y;
      }
    }));
    let f = null;
    if (w) {
      const q = document.createElement("gufe-complex");
      q.style.cssText = "flex:1;min-width:0;min-height:0;", q.setAttribute(Vr, ""), q.ligandsShown = g, q.payload = n, f = q, S.unshift({
        // Reserved rather than a plain word: this shares a namespace with the
        // system's own component labels, and those come from a user's Python.
        key: "#complex",
        title: "Complex",
        subtitle: `${$.ligands.length === 1 ? $.ligands[0].name || "ligand" : "ligands"} in ${$.structures[0].name || "structure"}`,
        badge: null,
        element: q,
        point: () => {
        }
      });
    }
    let p = null;
    const y = (q) => {
      p !== q && (b.replaceChildren(q), p = q);
    }, C = Hr(cm), A = [];
    let P = 0;
    const T = (q) => {
      A.forEach((Y, re) => Y.setAttribute("aria-pressed", String(re === q))), P = q, S[q].point(), y(S[q].element);
    }, R = (q) => {
      C.set(S[q].key), T(q);
    }, L = [], I = () => {
      for (const q of L) mm(q.node, q.name, g.has(q.ligand));
    };
    S.forEach((q, Y) => {
      const re = N(
        "div",
        `display:flex;align-items:stretch;gap:${X.sm};width:auto;flex-shrink:0;max-width:100%;min-width:0;`
      ), U = qt(`${fo.card}flex:1;width:auto;min-width:0;box-sizing:border-box;`);
      if (U.appendChild(
        N("span", `font-weight:700;color:${j.textPrimary};overflow-wrap:anywhere;`, q.title)
      ), U.appendChild(
        N(
          "span",
          `font-size:${ee.small};color:${j.textMuted};overflow-wrap:anywhere;`,
          q.subtitle
        )
      ), q.badge && U.appendChild(q.badge), U.onclick = () => R(Y), A.push(U), re.appendChild(U), q.ligand !== void 0) {
        const O = q.ligand, H = hm();
        H.onclick = () => {
          g.has(O) ? g.delete(O) : g.add(O), I(), f?.refreshLigands(), P !== qi && R(qi);
        }, L.push({ node: H, ligand: O, name: q.subtitle }), re.appendChild(H);
      }
      l.appendChild(re);
    }), I();
    const Q = S.findIndex((q) => q.key === C.get());
    T(Q < 0 ? 0 : Q);
    const V = co(a, (q) => {
      a.style.flexDirection = q ? "column" : "row", d.orient(q), c.style.maxHeight = q ? dm : "none", c.style.borderBottom = q ? `1px solid ${j.splitBorder}` : "none", l.style.flexDirection = q ? "row" : "column", l.style.flexWrap = q ? "wrap" : "nowrap", p?.resize?.();
    });
    return {
      onResize: () => p?.resize?.(),
      // Removing whatever is mounted fires its own `disconnectedCallback`,
      // which is where it releases its viewers. Only one pane is ever in the
      // document, and the panes that are not are already torn down.
      cleanup: () => {
        V(), p?.remove();
      }
    };
  }
}
ze("gufe-chemical-system", gm);
const Hi = 210, ym = "42%", Hn = { min: 150, max: 460 };
function $m(e, t) {
  const n = Ce(t, e.stateA, "ChemicalSystemViz"), r = Ce(t, e.stateB, "ChemicalSystemViz");
  if (!n || !r) return null;
  const s = [e.stateA, e.stateB, e.protocol];
  for (const o of [n, r]) s.push(...Object.values(o.components ?? {}));
  for (const o of e.mappings ?? []) s.push(o.componentA, o.componentB);
  return { ...e, registry: Ro(t, s) };
}
const No = {
  unchanged: j.diffUnchanged,
  changed: j.diffChanged,
  added: j.diffAdded,
  removed: j.diffRemoved
};
function Ki(e, t) {
  return e && !t ? "removed" : !e && t ? "added" : e === t ? "unchanged" : "changed";
}
function bm(e, t) {
  return [.../* @__PURE__ */ new Set([...Object.keys(e.components ?? {}), ...Object.keys(t.components ?? {})])].sort();
}
function vm(e) {
  if (!e) return null;
  const t = e.type === "UnknownComponentViz" ? e.gufe_type : null;
  return { name: e.name || "(unnamed)", type: t };
}
function Lr(e, t, n) {
  const r = N(
    "div",
    `min-width:0;display:flex;align-items:baseline;gap:${X.md};padding:5px ${X.lg};border-radius:${Ee.md};background:${j.cardBg};border:1px solid ${j.cardBorder};`
  );
  n && r.appendChild(
    N(
      "span",
      `flex:0 0 auto;font-size:${ee.tiny};font-weight:${ge.bold};letter-spacing:.08em;color:${j.textMuted2};`,
      n
    )
  );
  const s = vm(e);
  if (!s)
    return r.style.background = "transparent", r.style.borderStyle = "dashed", r.appendChild(N("span", `font-size:${ee.body};color:${j.textMuted2};`, "absent")), r;
  r.style.borderColor = t === "unchanged" ? j.cardBorder : No[t];
  const o = N(
    "span",
    `min-width:0;font-size:${ee.body};font-weight:600;color:${j.textPrimary};overflow-wrap:anywhere;`,
    s.name
  );
  return o.title = s.name, r.appendChild(o), s.type && r.appendChild(ir(s.type)), r;
}
function wm(e, t, n, r) {
  const s = N("div", `display:flex;flex-direction:column;gap:${X.sm};min-width:0;`), o = N("div", `display:flex;align-items:center;gap:${X.md};min-width:0;`);
  o.appendChild(
    N("span", `width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${No[t]};`)
  );
  const i = N(
    "span",
    `min-width:0;font-size:${ee.body};font-weight:${ge.bold};color:${j.textPrimary};overflow-wrap:anywhere;`,
    e
  );
  return i.title = t, o.appendChild(i), s.appendChild(o), t === "unchanged" ? (s.appendChild(Lr(n, t, null)), s) : (s.appendChild(Lr(n, t, "A")), s.appendChild(Lr(r, t, "B")), s);
}
function _m(e, t) {
  const n = N(
    "div",
    `display:flex;align-items:center;gap:8px;padding:6px 10px;flex-shrink:0;font-size:${ee.small};background:${j.toolbarBg};border-bottom:1px solid ${j.toolbarBorder};color:${j.textMuted};`
  );
  return n.appendChild(Ct(e, e[0].id, (r) => t(Number(r)))), n;
}
const Sm = (e) => e.side ? `${e.label} (${e.side})` : e.label;
function km(e, t) {
  const n = Ne(t, e.componentA), r = Ne(t, e.componentB);
  return `${n ? _e(n) : "A"} to ${r ? _e(r) : "B"}`;
}
function Gi(e) {
  return N(
    "div",
    `font-weight:${ge.bold};font-size:${ee.heading};color:${j.titleColor};letter-spacing:.02em;line-height:1.35;overflow-wrap:anywhere;flex-shrink:0;`,
    e
  );
}
function Wi(e, t) {
  const n = N("div", `display:flex;align-items:baseline;gap:${X.md};min-width:0;font-size:${ee.small};`);
  return n.appendChild(N("span", `flex:0 0 auto;color:${j.textMuted};`, e)), n.appendChild(
    N("span", `min-width:0;font-weight:${ge.bold};color:${j.textPrimary};overflow-wrap:anywhere;`, t)
  ), n;
}
class Cm extends Fe {
  placeholder() {
    return "Waiting for a Transformation payload...";
  }
  renderView(t, n) {
    const r = Et(n), s = Ce(r, n.stateA, "ChemicalSystemViz"), o = Ce(r, n.stateB, "ChemicalSystemViz"), i = Ce(r, n.protocol, "ProtocolViz"), a = n.mappings ?? [], c = n.name || "Transformation";
    if (!s || !o) {
      const p = N("div", "padding:12px 14px;flex-shrink:0;");
      return p.appendChild(Gi(c)), t.appendChild(p), t.appendChild(
        $e("This transformation names two chemical systems, and its registry does not hold them.")
      ), {};
    }
    const l = bm(s, o), d = N("div", "flex:1;min-width:0;min-height:0;display:flex;overflow:hidden;");
    t.appendChild(d);
    const m = N(
      "div",
      `min-width:0;min-height:0;overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:12px;background:${j.panelBg};`
    );
    d.appendChild(m);
    let b = null;
    const v = Ga(m, {
      initial: Hi,
      min: Hn.min,
      max: Hn.max,
      maxShare: ym,
      remember: Dt("transformation.statesWidth", Hi, Hn.min, Hn.max),
      label: "Resize the state diff",
      // The mapping is two 3D viewers, and a viewer sizes its canvas once.
      onResize: () => b?.resize?.()
    });
    d.appendChild(v.element);
    const $ = N("div", "flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;");
    d.appendChild($);
    const w = N("div", `display:flex;flex-direction:column;gap:${X.md};min-width:0;`);
    w.appendChild(Gi(c)), w.appendChild(Wi("protocol", i ? rc(i) : Qe)), w.appendChild(Wi("mappings", String(a.length))), m.appendChild(w);
    const u = N("div", `display:flex;flex-direction:column;gap:${X.xs};`);
    for (const [p, y] of [
      ["State A", s],
      ["State B", o]
    ])
      u.appendChild(
        N(
          "div",
          `min-width:0;font-size:${ee.small};font-weight:${ge.bold};letter-spacing:.06em;text-transform:uppercase;color:${j.textMuted2};overflow-wrap:anywhere;`,
          `${p}${y.name ? ` - ${y.name}` : ""}`
        )
      );
    m.appendChild(u);
    const g = /* @__PURE__ */ new Set();
    for (const p of l) {
      const y = s.components?.[p], C = o.components?.[p], A = Ki(y, C);
      g.add(A), m.appendChild(
        wm(
          p,
          A,
          Ne(r, y),
          Ne(r, C)
        )
      );
    }
    if (g.size > 1) {
      const p = N(
        "div",
        `display:flex;flex-wrap:wrap;gap:${X.lg} 12px;padding-top:${X.sm};font-size:${ee.small};color:${j.textMuted};`
      );
      for (const y of ["unchanged", "changed", "added", "removed"])
        g.has(y) && p.appendChild(Ve(y, "", No[y]));
      m.appendChild(p);
    }
    const h = N("div", bu, a.length ? "Atom mapping" : "What changes");
    $.appendChild(h);
    const _ = co(t, (p) => {
      d.style.flexDirection = p ? "column" : "row", v.orient(p), m.style.maxHeight = p ? "45%" : "none", m.style.borderBottom = p ? `1px solid ${j.splitBorder}` : "none", h.style.display = p ? "block" : "none";
    }), S = (p, y, C) => (C(0), y.length > 1 && $.appendChild(_m(y, C)), $.appendChild(p), b = p, {
      onResize: () => p.resize?.(),
      cleanup: () => {
        _(), p.remove();
      }
    });
    if (!a.length) {
      const p = [];
      for (const C of l) {
        const A = s.components?.[C], P = o.components?.[C];
        if (Ki(A, P) === "unchanged") continue;
        const T = A !== void 0 && P !== void 0, R = Ne(r, A), L = Ne(r, P);
        R && p.push({ label: C, side: T ? "A" : null, component: R }), L && p.push({ label: C, side: T ? "B" : null, component: L });
      }
      if (!p.length)
        return $.appendChild(
          $e(
            "This transformation carries no atom mapping, and its two states hold the same components - there is nothing here to draw."
          )
        ), { cleanup: _ };
      const y = document.createElement("alchemy-view");
      return y.style.cssText = "flex:1;min-height:0;min-width:0;", S(
        y,
        p.map((C, A) => ({ id: String(A), label: Sm(C) })),
        (C) => {
          y.payload = p[C].component;
        }
      );
    }
    const f = document.createElement("gufe-atom-mapping");
    return f.style.cssText = "flex:1;min-height:0;min-width:0;", S(
      f,
      a.map((p, y) => ({
        id: String(y),
        label: p.name || km(p, r)
      })),
      // Cut loose with a registry of its own, so the embedded element resolves
      // its endpoints exactly as it would if the mapping were the whole payload.
      (p) => {
        f.payload = gc(a[p], r);
      }
    );
  }
}
ze("gufe-transformation", Cm);
const Em = () => ({ fill: ue.netNodeFill, stroke: ue.netNodeStroke }), dt = { width: 176, height: 54, depictedHeight: 176, radius: 10 }, Ji = (e) => e ? dt.depictedHeight : dt.height, Be = { pad: 6, size: 122, radius: 6, inset: 4 }, Yi = 200, Ft = {
  /** How far in from the box's top corner the charge is written. */
  inset: 22,
  fontSize: 26,
  /**
   * The charge on the zooms that draw no ligand: bigger, and across the upper
   * part of the box rather than in its corner.
   *
   * Out there a box is a rectangle with a name in it, and the charge is the
   * only other thing this view still knows about the system. At the corner size
   * it would be a mark on a block; this is the second thing a reader can still
   * make out. `bigAt` is a fraction of the box's height and keeps it off the
   * two lines of writing, which sit in the middle once there is no picture for
   * them to sit under.
   */
  bigAt: 0.28,
  bigFontSize: 64
}, xm = "6 4", Ge = { nameSize: 12, subSize: 10, gap: 13, bottom: 9, nameChars: 20, subChars: 24 }, Am = 7, Pm = [
  { id: "structures", from: 0.18, structure: !0 },
  { id: "boxes", from: 0, structure: !1 }
], Rm = (e) => cc(Pm, e), St = {
  width: 2,
  selectedWidth: 3.5,
  min: 1,
  hit: 20,
  rail: 5,
  /**
   * What the protocol lens multiplies a line's weight by.
   *
   * A multiplier rather than a width of its own, so a lens line doubles whatever
   * the zoom and the selection had already settled on: the lens has to read at
   * every distance, and a fixed weight would be the whole canvas up close and a
   * hairline on a campaign framed at a third.
   */
  lensScale: 2
}, Mm = (e) => St.rail / 2 / Math.max(e, 1e-3), Xi = (e, t) => {
  const n = t ? St.selectedWidth : St.width;
  return Math.max(St.min, Math.min(n, n * e));
}, Br = { width: 3, selectedWidth: 4.5, min: 1.25 }, Zi = (e, t) => {
  const n = t ? Br.selectedWidth : Br.width;
  return Math.max(Br.min, Math.min(n, n * e));
}, it = {
  linkDistance: 252,
  linkStrength: 0.4,
  chargeStrength: -3600,
  /** Repulsion is local. Past this, boxes are already out of each other's way. */
  chargeDistanceMax: 1200,
  collisionRadius: 126,
  collisionIterations: 3,
  tickMultiplier: 2
}, zt = { initial: 0.56, min: 0.25, max: 0.78 }, Qi = { x: dt.width / 2, y: dt.depictedHeight / 2 }, ea = 1.4;
function Nm(e, t, n, r, s, o) {
  const i = s.trim().toLowerCase();
  if (!r.size && !i && o === null) return null;
  const a = i.length > 0 || o !== null, c = /* @__PURE__ */ new Set();
  e.forEach((d, m) => {
    const b = a && (!i || n[m].includes(i)) && (!o || o.has(m));
    (r.has(d["gufe-key"]) || b) && c.add(d["gufe-key"]);
  });
  const l = /* @__PURE__ */ new Set();
  return t.forEach((d, m) => {
    c.has(d.from["gufe-key"]) && c.has(d.to["gufe-key"]) && l.add(m);
  }), { nodes: c, edges: l };
}
const tt = _e;
function Om(e, t) {
  const n = [e.name ?? "", e["gufe-key"]];
  for (const [r, s] of Object.entries(e.components ?? {})) {
    n.push(r);
    const o = Ne(t, s);
    if (!o) continue;
    n.push(_e(o), o["gufe-key"]);
    const i = o.smiles;
    i && n.push(i);
  }
  return n.join(" ").toLowerCase();
}
function Tm(e, t) {
  return [tt(e), ...e.systems.map((r) => Om(r, t))].join(" ").toLowerCase();
}
function Fm(e, t) {
  const n = [], r = [], s = /* @__PURE__ */ new Map(), o = e.map((i) => {
    const a = /* @__PURE__ */ new Set();
    for (const c of i.systems)
      for (const l of Object.values(c.components ?? {})) {
        const d = Ce(t, l, "SmallMoleculeComponentViz");
        if (!d) continue;
        let m = s.get(l);
        m === void 0 && (m = n.length, s.set(l, m), n.push(d.sdf ?? ""), r.push(d.total_charge ?? 0)), a.add(m);
      }
    return [...a];
  });
  return { sources: n, charges: r, perNode: o };
}
function zm(e, t, n) {
  if (!t || n !== 1) return e.join(" + ");
  const r = e.filter((s) => s !== "SmallMolecule");
  return (r.length ? r : e).join(" + ");
}
function jm(e, t, n, r) {
  if (e.systems.length > 1) {
    const s = e.legs.join(", ");
    return { composition: s, besides: s };
  }
  return { composition: t.join(" + "), besides: zm(t, n, r) };
}
function Im(e, t, n) {
  const r = /* @__PURE__ */ new Map(), s = [];
  return e.forEach((o, i) => {
    const a = t.get(o.from["gufe-key"]), c = t.get(o.to["gufe-key"]), l = [a["gufe-key"], c["gufe-key"]].sort().join(" "), d = r.get(l);
    if (d) {
      d.at.push(i);
      return;
    }
    r.set(l, { from: a, to: c, at: [i] }), s.push(l);
  }), s.map((o, i) => {
    const { from: a, to: c, at: l } = r.get(o), d = [...l].sort(($, w) => n.ofEdge[$] - n.ofEdge[w] || $ - w), m = d.map(($) => {
      const { index: w, from: u, to: g, ...h } = e[$];
      return h;
    }), b = m.map(($) => _e($)), v = vc(
      d.map(($) => n.signatures[n.ofEdge[$]]),
      b
    );
    return { index: i, from: a, to: c, legs: m, labels: v, name: wc(b) || b[0] };
  });
}
function Dm(e, t) {
  if (e.systems.length === 1) return `${tt(e)} - ${Qn(e.systems[0], t)}`;
  const n = e.systems.map(
    (r, s) => `${e.legs[s]}: ${_e(r)} - ${Qn(r, t)}`
  );
  return [tt(e), ...n].join(`
`);
}
function Lm(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e) {
    const i = Ce(t, o.protocol, "ProtocolViz");
    if (!i) continue;
    const a = n.get(i["gufe-key"]);
    if (a) {
      a.count++;
      continue;
    }
    n.set(i["gufe-key"], {
      protocol: i,
      label: rc(i),
      count: 1,
      // Assigned below, once the entries are in the order they are read in.
      color: ue.netEdgeLine
    });
  }
  const r = [...n.values()], s = /* @__PURE__ */ new Map();
  for (const o of r) s.set(o.label, (s.get(o.label) ?? 0) + 1);
  for (const o of r)
    (s.get(o.label) ?? 0) > 1 && (o.label = `${o.label} ${_e(o.protocol)}`);
  return r.sort((o, i) => o.label < i.label ? -1 : o.label > i.label ? 1 : 0), r.forEach((o, i) => {
    o.color = ue.netProtocolStroke[i % ue.netProtocolStroke.length];
  }), r;
}
function Bm(e) {
  const t = Ve("protocol", e.label);
  return t.title = `${e.label} - ${Sc(e.count)}`, t;
}
function qm(e, t) {
  const n = N("div", `display:inline-flex;align-items:center;flex-wrap:wrap;gap:${X.xs};`);
  n.className = "gufe-protocols", n.appendChild(N("span", "", "protocols"));
  let r = null;
  const s = e.map((i) => {
    const a = qt(`${Pe.plain}${Pe.button}gap:5px;`, Pe.className);
    return a.setAttribute("aria-pressed", "false"), a.appendChild(
      N("span", `width:8px;height:8px;border-radius:50%;background:${i.color};flex-shrink:0;`)
    ), a.appendChild(N("b", `color:${ke.primary};`, i.label)), a.title = `${i.label} - ${Sc(i.count)}`, a;
  }), o = () => {
    e.forEach((i, a) => {
      const c = r === i;
      s[a].setAttribute("aria-pressed", c ? "true" : "false"), s[a].style.borderColor = c ? i.color : Pe.restBorder;
    }), t(r);
  };
  return e.forEach((i, a) => {
    s[a].onclick = () => {
      r = r === i ? null : i, o();
    }, n.appendChild(s[a]);
  }), n;
}
function Vm(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    for (const s of n.legs) {
      const o = t.get(s.protocol) ?? /* @__PURE__ */ new Set();
      o.add(r), t.set(s.protocol, o);
    }
  }), t;
}
function Sc(e) {
  return `${e} transformation${e === 1 ? "" : "s"}`;
}
function Um(e) {
  const t = new Map(e.nodes.map((s, o) => [s["gufe-key"], o])), n = (s) => {
    const o = e.query.text.trim().toLowerCase();
    if (o && !e.haystacks[s].includes(o)) return !1;
    const i = e.matched();
    return !(i && !i.has(s));
  }, r = (s) => [s.from, s.to].map((o) => t.get(o["gufe-key"]) ?? -1).filter((o) => o >= 0);
  return ac({
    namespace: "alchemical-network",
    nodes: e.nodes,
    edges: e.edges,
    selected: e.selected,
    query: e.query,
    search: {
      placeholder: "Search",
      label: "Search ligands by name, component, system or gufe key"
    },
    smarts: {
      placeholder: "Filter by SMARTS",
      label: "Show only the ligands whose structures match this SMARTS pattern",
      describe: (s) => {
        const o = s.unreadable ? `, ${s.unreadable} could not be read` : "";
        return `${e.matched()?.size ?? e.nodes.length} of ${e.nodes.length} ligands contain it${o}`;
      }
    },
    match: (s) => e.match(s),
    shows: (s, o) => n(o),
    row: (s, o) => ({
      name: tt(s),
      title: `${tt(s)}
${e.captions[o]}`
    }),
    // Either end rather than both, because a line is listed for each of the
    // ligands it runs to: narrowing to one ligand and being shown none of its
    // transformations would be the opposite of what the search was for.
    edgeShows: (s) => r(s).some(n),
    edgeRow: (s) => ({
      name: s.name,
      title: [
        `${tt(s.from)} to ${tt(s.to)}`,
        // What the line bundles, which is the one thing a row cannot show: the
        // legs are a pane's tabs, and the row is one line of text.
        s.legs.length > 1 ? `${s.legs.length} legs: ${s.labels.join(", ")}` : s.labels[0]
      ].join(`
`)
    }),
    words: {
      nodes: { tab: "Ligands", plural: "ligands" },
      edges: { tab: "Transformations", plural: "transformations" }
    },
    refresh: e.refresh,
    focus: e.focus,
    focusEdge: e.focusEdge,
    mounted: e.mounted
  });
}
function Hm(e, t, n) {
  const r = Math.max(90, Math.min(t, n) * 0.36);
  e.forEach((s, o) => {
    if (s.fx !== void 0 && s.fy !== void 0) {
      s.x = s.fx, s.y = s.fy;
      return;
    }
    const i = 2 * Math.PI * o / Math.max(1, e.length) - Math.PI / 2;
    s.x = t / 2 + r * Math.cos(i), s.y = n / 2 + r * Math.sin(i);
  });
}
function Km(e, t, n, r) {
  const s = /* @__PURE__ */ new Map();
  for (const o of t) {
    const i = o.from["gufe-key"], a = o.to["gufe-key"], c = [i, a].sort().join(" ");
    s.has(c) || s.set(c, { source: i, target: a });
  }
  return nc({
    nodes: e,
    // d3-force rewrites link endpoints in place, so it gets its own objects.
    links: [...s.values()],
    tickMultiplier: it.tickMultiplier,
    forces: (o, i) => [
      [
        "link",
        o.forceLink(i).id((a) => a["gufe-key"]).distance(it.linkDistance).strength(it.linkStrength)
      ],
      ["charge", o.forceManyBody().strength(it.chargeStrength).distanceMax(it.chargeDistanceMax)],
      ["center", o.forceCenter(n / 2, r / 2)],
      ["collision", o.forceCollide(it.collisionRadius).iterations(it.collisionIterations)]
    ]
  });
}
class Gm extends Fe {
  placeholder() {
    return "Waiting for an AlchemicalNetwork payload...";
  }
  renderView(t, n) {
    const r = Et(n), {
      nodes: s,
      edges: o,
      unresolved: i,
      dangling: a
    } = oc({
      registry: r,
      keys: n.nodes ?? [],
      nodeType: "ChemicalSystemViz",
      edges: n.edges ?? [],
      ends: (W) => [W.stateA, W.stateB]
    }), c = Xh(o, r), l = (W) => {
      const M = c.signatures.indexOf(Qn(W, r));
      return M < 0 ? c.signatures.length : M;
    }, d = em(
      s.map((W) => tc(W)),
      r,
      l
    ).map((W) => ({ ...W, x: 0, y: 0 })), m = /* @__PURE__ */ new Map();
    for (const W of d) for (const M of W.systems) m.set(M["gufe-key"], W);
    const b = Im(o, m, c), v = Lm(o, r), $ = Vm(b);
    let w = null;
    const u = () => {
      const W = w ? $.get(w.protocol["gufe-key"]) : void 0;
      p?.setProtocol(W ?? null, w?.color ?? ue.netEdgeLine);
    }, g = sr(n.name || "Alchemical network", Bt(this));
    d.length !== s.length && g.statsEl.appendChild(Ve("ligands", String(d.length))), g.statsEl.appendChild(Ve("systems", String(s.length))), g.statsEl.appendChild(Ve("transformations", String(o.length))), c.signatures.length > 1 && g.statsEl.appendChild(Ve("legs", c.names.join(", "))), v.length === 1 && g.statsEl.appendChild(Bm(v[0])), v.length > 1 && g.statsEl.appendChild(
      qm(v, (W) => {
        w = W, u();
      })
    );
    const h = N("div", "flex:1;display:flex;flex-direction:row;min-height:0;overflow:hidden;");
    t.appendChild(h);
    let _ = () => {
    };
    const S = /* @__PURE__ */ new Set(), f = { text: "" };
    let p = null;
    const y = () => {
      const W = Nm(d, b, C, S, f.text, L);
      p?.setEmphasis(W?.nodes ?? null, W?.edges ?? null);
    }, C = d.map((W) => Tm(W, r)), A = () => Pa(), P = Fm(d, r), T = sc(A, P.sources), R = d.map((W, M) => {
      const x = P.perNode[M].find((Z) => P.sources[Z]), F = x === void 0 ? null : P.sources[x], B = [...new Set(W.systems.flatMap((Z) => Mo(Z, r)))].sort(), J = jm(W, B, F !== null, P.perNode[M].length);
      return {
        composition: J.composition,
        besides: J.besides,
        sdf: F,
        charge: x === void 0 ? 0 : P.charges[x],
        title: Dm(W, r)
      };
    });
    let L = null, I = () => {
    };
    const Q = async (W) => {
      const M = await T.run(W);
      return M.status === "superseded" || (L = M.status === "ok" ? new Set(d.flatMap((x, F) => P.perNode[F].some((B) => M.matched.has(B)) ? [F] : [])) : null, I(), y()), M;
    }, V = Ao(
      g,
      () => Um({
        nodes: d,
        edges: b,
        haystacks: C,
        captions: R.map((W) => W.composition),
        selected: S,
        query: f,
        refresh: () => y(),
        matched: () => L,
        match: (W) => Q(W),
        mounted: (W) => {
          I = W;
        },
        // Finding a ligand in the list and opening it are one action: the
        // list is how you reach one you cannot see on the canvas, and
        // reaching it is not the point.
        focus: (W) => {
          p?.focusOn(W), ne("node", W);
        },
        // The same action for a line: reaching it is not the point, and a
        // transformation the reader cannot see on the canvas is exactly the
        // one they came to the list for.
        focusEdge: (W) => {
          p?.focusOnEdge(W), ne("edge", W);
        }
      }),
      {
        label: "Search, filter and select ligands",
        onToggle: () => _(),
        remember: ct("alchemical-network.menuOpen", !1),
        extras: Po
      }
    ), q = N("div", `min-width:0;min-height:0;display:flex;flex-direction:column;background:${j.netCanvasBg};`), Y = N("div", `min-width:0;min-height:0;display:flex;flex-direction:column;background:${j.appBg};`), re = N("div", `flex:1;min-height:0;position:relative;overflow:hidden;background:${j.netCanvasBg};`), U = N("div", "flex:1;min-width:0;min-height:0;display:flex;flex-direction:row;overflow:hidden;");
    U.appendChild(V.panel), U.appendChild(re), q.appendChild(g), q.appendChild(U), h.appendChild(q), h.appendChild(
      Ka(h, q, Y, {
        min: zt.min,
        max: zt.max,
        // How wide someone wants the structures is a preference about how they
        // read a network, not something about this network, so it is kept.
        remember: Dt("alchemical-network.canvasShare", zt.initial, zt.min, zt.max),
        // The graph is drawn to a size, so a divider that moved is a canvas
        // that has to be drawn again. Only at the end of the drag: on the far
        // side of this is a force simulation.
        onResize: () => _(),
        onOrient: (W) => {
          U.style.flexDirection = W ? "column" : "row", Eo(V.panel, W);
        }
      })
    ), h.appendChild(Y);
    const O = this.#t(Y, r);
    if (!d.length)
      return re.appendChild(
        $e(
          i ? "None of this network's chemical systems are in its registry." : "This network has no chemical systems."
        )
      ), O.message("Nothing to show."), { cleanup: () => O.cleanup() };
    i && lt(
      re,
      `${i} chemical system${i === 1 ? "" : "s"} named by this network are not in its registry`
    ), a && lt(
      re,
      `${a} transformation${a === 1 ? "" : "s"} name a system this network does not contain`
    );
    let H = !1, z = !1, k = null;
    const E = mo(), D = new Map(d.map((W, M) => [W["gufe-key"], R[M].charge])), te = b.some(
      (W) => (D.get(W.to["gufe-key"]) ?? 0) !== (D.get(W.from["gufe-key"]) ?? 0)
    );
    Oa(re, () => p?.reset(), "Reset pan and zoom"), te && q.appendChild(this.#e());
    const ne = (W, M) => {
      k = { kind: W, index: M }, O.show(W === "node" ? d[M] : b[M], W), p?.setSelected(k);
    }, oe = () => {
      const W = E.start(), M = re.clientWidth || 800, x = re.clientHeight || 600;
      z || Hm(d, M, x);
      const F = () => {
        W() && (p?.cleanup(), re.querySelectorAll("svg").forEach((B) => B.remove()), p = this.#n(re, d, b, M, x, R, A, ne), p.setSelected(k), y(), u());
      };
      if (H || z) {
        F();
        return;
      }
      Km(d, b, M, x).then((B) => {
        W() && (B ? z = !0 : (H = !0, lt(re, "d3 could not be loaded - showing the circular layout instead")), F());
      }, F);
    };
    return _ = oe, oe(), ne("node", 0), {
      onResize: () => oe(),
      cleanup: () => {
        E.stop(), p?.cleanup(), p = null, O.cleanup();
      }
    };
  }
  /**
   * The strip under the canvas: what the dashes mean, where there are any.
   *
   * The reset is not here. It floats over the bottom left of the canvas, so a
   * network the reader has flung off the edge still has one control always in
   * the same place without every network paying a row of height for it; a
   * network whose transformations all keep the charge then draws no strip at
   * all.
   *
   * There is no key for the legs. A line is every transformation between its two
   * ligands, so it belongs to no one leg and there is no colour on this canvas
   * for a legend to explain - which leg is a question the pane answers, about
   * one line at a time.
   */
  #e() {
    const t = N("div", pi), n = N("div", "display:flex;align-items:center;gap:6px;min-width:0;");
    return n.appendChild(N("span", `width:24px;height:0;border-top:2px dashed ${j.netEdgeLine};flex-shrink:0;`)), n.appendChild(N("span", `font-size:${ee.small};color:${j.textMuted};`, "net charge change")), t.appendChild(n), t;
  }
  /**
   * The right-hand pane, and what this view puts in it.
   *
   * The pane itself is `detailPane`, shared with the ligand network. What is
   * here is this view's own half: what a box and a line stand for, and which of
   * it to draw.
   *
   * ## A box is drawn as one system
   *
   * A box holds every leg of its ligand, and the legs of a campaign are the same
   * components twice over - the ligand and the solvent in both, the protein in
   * one - so choosing between them was a control over a list that was mostly
   * itself repeated. `mergedSystem` is the merge, and the only thing it has to
   * be careful about is a label naming two different components.
   *
   * ## A line is drawn as one of its transformations
   *
   * A line is every transformation between two ligands, and they really are
   * different calculations: different states, different mapping, a different
   * picture in the pane. So this is where the choice lives, as a row of legs
   * above the pane, and it is only there on a line that has more than one.
   *
   * Which leg is remembered across lines rather than reset per line. Reading a
   * campaign is going along one leg - clicking six edges to see each one in the
   * protein - and a switch that went back to the solvent leg on every click
   * would make that six clicks longer. A line without the remembered leg opens
   * on its first, which is the leg the header names first.
   *
   * Either way what is handed on has to be cut loose from the network first: the
   * graph staples an index and two endpoints onto a line, and the schema allows
   * neither. A box's systems need no cleaning - a box carries its own position,
   * so the systems inside it were never laid out.
   *
   * ## A protocol is not in here
   *
   * The pane shows what is on the canvas, and a protocol is not on it: it is
   * what runs the lines rather than something drawn. So the protocols are on the
   * header - named by `protocolReadout`, or picked out by `protocolChips`, which
   * colours their lines and leaves whatever this pane is showing alone - and
   * never opened in here.
   */
  #t(t, n) {
    const r = N("div", `${pi}border-top:none;border-bottom:1px solid ${j.toolbarBorder};display:none;`);
    t.appendChild(r);
    const s = fc(t);
    let o = "";
    const i = () => {
      r.style.display = "none", r.replaceChildren();
    };
    return {
      ...s,
      show(a, c) {
        if (c === "node") {
          i(), s.show(am(tm(a), n));
          return;
        }
        const l = a, d = (b) => {
          o = l.labels[b] ?? "";
          const v = $m(l.legs[b], n);
          if (!v) {
            s.message("This transformation names two chemical systems, and its registry does not hold them.");
            return;
          }
          s.show(v);
        }, m = Math.max(0, l.labels.indexOf(o));
        l.legs.length > 1 ? (r.replaceChildren(), r.appendChild(N("span", `font-size:${ee.small};color:${j.textMuted};flex-shrink:0;`, "leg")), r.appendChild(
          Ct(
            l.labels.map((b, v) => ({
              id: String(v),
              label: b,
              title: _e(l.legs[v])
            })),
            String(m),
            (b) => d(Number(b))
          )
        ), r.style.display = "") : i(), d(m);
      }
    };
  }
  /** Build the SVG for the current positions, and hand back the selection hook. */
  #n(t, n, r, s, o, i, a, c) {
    const l = le("svg", { class: "gufe-graph", width: s, height: o, style: "display:block;touch-action:none;" });
    t.appendChild(l);
    const d = le("g");
    l.appendChild(d);
    const m = le("g"), b = le("g");
    d.append(m, b);
    let v = () => {
    };
    const $ = ec(l, d, {
      bounds: () => Qa(n, Qi.x, Qi.y),
      hint: "Click the graph or hold Ctrl to zoom",
      onTransform: (x, F, B) => v(x, F, B)
    }), w = (x, F) => {
      $.wasPan() || c(x, F);
    };
    let u = 1;
    const g = [], h = [], _ = [], S = [], f = new Map(n.map((x, F) => [x["gufe-key"], i[F].charge])), p = (x) => (f.get(x.to["gufe-key"]) ?? 0) - (f.get(x.from["gufe-key"]) ?? 0);
    r.forEach((x, F) => {
      const B = p(x), J = {
        stroke: ue.netEdgeLine,
        "stroke-width": Xi(1, !1),
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke",
        ...B ? { "stroke-dasharray": xm } : {}
      }, Z = [
        x.name || "transformation",
        ...x.legs.map((fe, me) => `${x.labels[me]}: ${_e(fe)}`),
        B && `net charge change ${at(B)}`
      ].filter(Boolean).join(`
`), ae = le("line", { class: "gufe-edge", ...J, style: "cursor:pointer;" });
      if (Nr(ae, Z), ae.addEventListener("click", () => w("edge", F)), m.appendChild(ae), g.push(ae), x.legs.length > 1) {
        const fe = le("line", { class: "gufe-edge-rail", ...J, "pointer-events": "none" });
        m.appendChild(fe), h.push(fe), S.push(F);
      } else
        h.push(null);
      const se = le("line", {
        class: "gufe-edge-hit",
        stroke: "transparent",
        "stroke-width": St.hit,
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke",
        style: "cursor:pointer;"
      });
      Nr(se, Z), se.addEventListener("click", () => w("edge", F)), m.appendChild(se), _.push(se);
    });
    const y = (x) => {
      const { from: F, to: B } = r[x], J = (pe, be, ye) => {
        pe.setAttribute("x1", String(F.x + be)), pe.setAttribute("y1", String(F.y + ye)), pe.setAttribute("x2", String(B.x + be)), pe.setAttribute("y2", String(B.y + ye));
      };
      J(_[x], 0, 0);
      const Z = h[x], ae = Z ? Math.hypot(B.x - F.x, B.y - F.y) : 0;
      if (!Z || !ae) {
        J(g[x], 0, 0), Z?.setAttribute("display", "none");
        return;
      }
      Z.removeAttribute("display");
      const se = Mm(u), fe = -(B.y - F.y) / ae * se, me = (B.x - F.x) / ae * se;
      J(g[x], fe, me), J(Z, -fe, -me);
    };
    r.forEach((x, F) => y(F));
    const C = n.map(() => []), A = new Map(n.map((x, F) => [x, F]));
    r.forEach((x, F) => {
      const B = A.get(x.from), J = A.get(x.to);
      B !== void 0 && C[B].push(F), J !== void 0 && J !== B && C[J].push(F);
    });
    const P = [], T = [], R = [], L = [], I = [], Q = [], V = [], q = [], Y = [], re = Em();
    n.forEach((x, F) => {
      const B = i[F], J = Ji(B.sdf), Z = le("g", {
        class: "gufe-node",
        style: "cursor:pointer;",
        transform: `translate(${x.x},${x.y})`
      });
      R.push(Z);
      const ae = le("rect", {
        class: "gufe-node-box",
        x: -176 / 2,
        y: -J / 2,
        width: dt.width,
        height: J,
        rx: dt.radius,
        fill: re.fill,
        stroke: re.stroke,
        "stroke-width": Zi(1, !1),
        // The border is a line in screen pixels, like an edge. See `BOX_STROKE`.
        "vector-effect": "non-scaling-stroke"
      });
      if (Z.appendChild(ae), P.push(ae), T.push(re.stroke), B.sdf) {
        const me = le("rect", {
          class: "gufe-node-plate",
          x: -61,
          y: -J / 2 + Be.pad,
          width: Be.size,
          height: Be.size,
          rx: Be.radius,
          fill: Kr(),
          display: "none",
          "pointer-events": "none"
        });
        if (Z.appendChild(me), Q.push(me), B.charge) {
          const ye = le("text", {
            class: "gufe-node-charge",
            "text-anchor": "middle",
            "dominant-baseline": "central",
            fill: ue.badgeFg,
            "pointer-events": "none"
          });
          ye.textContent = at(B.charge), Z.appendChild(ye), V.push(ye);
        } else
          V.push(null);
        const pe = le("g", { transform: `translate(0,${-J / 2 + Be.pad + Be.size / 2})` }), be = le("g", { class: "gufe-node-depiction", display: "none", "pointer-events": "none" });
        pe.appendChild(be), Z.appendChild(pe), q.push(pe), Y.push(be);
      } else
        Q.push(null), q.push(null), Y.push(null), V.push(null);
      const se = le("text", {
        class: "gufe-node-label",
        x: 0,
        y: -2,
        "text-anchor": "middle",
        fill: ue.netNodeLabel,
        "font-size": Ge.nameSize,
        "font-weight": 700,
        "font-family": "ui-sans-serif,system-ui,sans-serif"
      });
      se.textContent = Kn(tt(x), Ge.nameChars), Z.appendChild(se), L.push(se);
      const fe = le("text", {
        class: "gufe-node-composition",
        x: 0,
        y: 14,
        "text-anchor": "middle",
        fill: ue.netInitials,
        "font-size": Ge.subSize,
        "font-family": "ui-sans-serif,system-ui,sans-serif"
      });
      fe.textContent = Kn(B.composition, Ge.subChars), Z.appendChild(fe), I.push(fe), Nr(Z, B.title), b.appendChild(Z);
    });
    const U = (x) => {
      const F = n[x];
      R[x].setAttribute("transform", `translate(${F.x},${F.y})`);
      for (const B of C[x]) y(B);
    }, O = new dc(), H = fr("cpk"), z = (x, F) => {
      if (!O.wants(F)) return;
      const B = Y[F], J = i[F].sdf;
      if (!B || !J) return;
      const Z = Co(x, J, Yi, Te.layout, void 0, H);
      if (!Z || !pc(B, Z, Yi, Be.size - Be.inset * 2)) {
        O.refused(F);
        return;
      }
      O.drew(F);
    }, k = (x, F, B) => {
      const J = i[x], Z = F && O.has(x), ae = (xt) => xt * B >= Am, se = ae(Ge.nameSize), fe = ae(Ge.subSize);
      L[x].setAttribute("display", se ? "inline" : "none"), I[x].setAttribute("display", fe ? "inline" : "none"), Q[x]?.setAttribute("display", Z ? "inline" : "none"), Y[x]?.setAttribute("display", Z ? "inline" : "none");
      const me = Ji(J.sdf), pe = -me / 2 + Be.pad, be = V[x];
      be && (be.setAttribute("x", String(Z ? dt.width / 2 - Ft.inset : 0)), be.setAttribute(
        "y",
        String(Z ? -me / 2 + Ft.inset : -me * Ft.bigAt)
      ), be.setAttribute("font-size", String(Z ? Ft.fontSize : Ft.bigFontSize)), be.setAttribute("font-weight", Z ? ge.normal : ge.bold)), Q[x]?.setAttribute("y", String(pe)), q[x]?.setAttribute("transform", `translate(0,${pe + Be.size / 2})`);
      const ye = me / 2 - Ge.bottom;
      L[x].setAttribute("y", String(Z ? ye - (fe ? Ge.gap : 0) : -2)), I[x].setAttribute("y", String(Z ? ye : 14)), I[x].textContent = Kn(Z ? J.besides : J.composition, Ge.subChars);
    };
    let E = null, D = null, te = null, ne = null, oe = ue.netEdgeLine;
    const W = () => {
      P.forEach((x, F) => {
        const B = D === F;
        x.setAttribute("stroke", B ? ue.cardBorderActive : T[F]), x.setAttribute("stroke-width", String(Zi(u, B)));
      }), g.forEach((x, F) => {
        const B = te === F, J = ne?.has(F) ?? !1, Z = B ? ue.netHaloColor : J ? oe : ue.netEdgeLine, ae = String(Xi(u, B) * (J ? St.lensScale : 1));
        for (const se of [x, h[F]])
          se && (se.setAttribute("stroke", Z), se.setAttribute("stroke-width", ae));
      });
    };
    return v = (x, F, B) => {
      const J = Rm(x);
      E = J, l.setAttribute("data-detail", J.id);
      const Z = u !== x;
      if (u = x, W(), Z) for (const se of S) y(se);
      for (let se = 0; se < n.length; se++) k(se, J.structure, x);
      if (!J.structure) return;
      const ae = uc(
        n,
        { scale: x, tx: F, ty: B },
        { width: s, height: o },
        (se) => !!i[se].sdf && O.wants(se)
      );
      ae.length && a().then((se) => {
        if (!(!se || E !== J))
          for (const fe of ae)
            z(se, fe), k(fe, !0, x);
      }).catch(() => {
      });
    }, lc(R, n, $, { moved: U, clicked: (x) => c("node", x) }), $.fit(), {
      setSelected(x) {
        D = x?.kind === "node" ? x.index : null, te = x?.kind === "edge" ? x.index : null, W();
      },
      setProtocol(x, F) {
        ne = x, oe = F, W();
      },
      /**
       * Dim what is not lit rather than hiding it.
       *
       * Which ones a filter left out is half of what a filter is for: on a
       * campaign graph, seeing that the complex leg has a transformation the
       * solvent leg does not is the whole point, and removing the rest would
       * take that picture away.
       */
      setEmphasis(x, F) {
        R.forEach((B, J) => {
          const Z = !x || x.has(n[J]["gufe-key"]);
          B.setAttribute("opacity", Z ? "1" : String(It.node));
        }), g.forEach((B, J) => {
          const Z = !F || F.has(J);
          for (const ae of [B, h[J]]) ae?.setAttribute("opacity", Z ? "1" : String(It.edge));
        });
      },
      focusOn(x) {
        const F = n[x];
        F && $.centreOn(F.x, F.y, ea);
      },
      focusOnEdge(x) {
        const F = r[x];
        F && $.centreOn((F.from.x + F.to.x) / 2, (F.from.y + F.to.y) / 2, ea);
      },
      reset: $.reset,
      cleanup: $.cleanup
    };
  }
}
ze("gufe-alchemical-network", Gm);
class Wm extends Fe {
  placeholder() {
    return "Waiting for a Protocol payload...";
  }
  renderView(t, n) {
    const r = sr(n.gufe_type || n.name || "Protocol", Bt(this));
    r.statsEl.appendChild(ir(n.gufe_type)), t.appendChild(r);
    const s = N(
      "div",
      "flex:1;min-height:0;overflow:auto;display:flex;align-items:center;justify-content:center;padding:24px;"
    );
    t.appendChild(s);
    const o = po();
    return o.style.maxWidth = "460px", o.appendChild(Zn("gufe class", n.gufe_type, !0)), n.name && o.appendChild(Zn("Name", n.name)), o.appendChild(
      N(
        "div",
        `padding-top:10px;font-size:${ee.small};line-height:1.6;color:${j.textMuted2};`,
        "A Protocol's settings are not carried in this payload: they are large, deeply nested, and nothing draws them yet."
      )
    ), s.appendChild(o), {};
  }
}
ze("gufe-protocol", Wm);
function Jm(e) {
  const t = /^\s*([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)\s*(.*)$/.exec(e || "");
  return t ? { value: t[1], unit: t[2].trim() } : { value: (e || "").trim(), unit: "" };
}
function ta(e, t = !1) {
  const n = N(
    "div",
    `display:flex;flex-direction:column;gap:${X.xl};padding:${X.xxl} 0;` + (t ? "padding-top:0;" : `border-top:1px solid ${j.splitBorder};`)
  );
  return n.appendChild(N("div", qr, e)), n;
}
function Wn(e) {
  return N(
    "div",
    `font-size:${ee.tiny};font-weight:${ge.bold};letter-spacing:.08em;text-transform:uppercase;color:${j.textMuted2};`,
    e
  );
}
function na(e, t) {
  const n = N("div", `display:flex;flex-direction:column;align-items:center;gap:${X.sm};`);
  return n.appendChild(
    N(
      "span",
      `${Pe.plain}${Pe.outline}font-family:${ee.mono};font-size:${ee.body};`,
      e
    )
  ), n.appendChild(Wn(t)), n;
}
class Ym extends Fe {
  placeholder() {
    return "Waiting for a SolventComponent payload...";
  }
  renderView(t, n) {
    const r = N(
      "div",
      "flex:1;min-height:0;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:24px;"
    );
    t.appendChild(r);
    const s = po();
    s.style.maxWidth = "560px", s.style.width = "100%", s.style.gap = "0";
    const o = ta("Solvent", !0), i = N("div", "display:flex;align-items:flex-end;gap:18px;flex-wrap:wrap;"), a = N("div", "display:flex;flex-direction:column;gap:5px;min-width:0;"), c = N(
      "div",
      `font-family:${ee.mono};font-size:${ee.display};font-weight:${ge.bold};line-height:1.1;color:${j.textPrimary};user-select:text;cursor:text;overflow-wrap:anywhere;`,
      n.smiles
    );
    a.appendChild(c), a.appendChild(Wn("SMILES")), i.appendChild(a);
    const l = n.name || "";
    if (l && l !== n.smiles) {
      const g = N("div", "display:flex;flex-direction:column;gap:5px;margin-left:auto;text-align:right;min-width:0;");
      g.appendChild(
        N(
          "div",
          `font-size:${ee.body};color:${j.textPrimary};user-select:text;cursor:text;overflow-wrap:anywhere;`,
          l
        )
      ), g.appendChild(Wn("Name")), i.appendChild(g);
    }
    o.appendChild(i), s.appendChild(o);
    const d = ta("Ions"), m = N("div", `display:flex;align-items:flex-end;gap:${X.xxl};flex-wrap:wrap;`);
    n.positive_ion && m.appendChild(na(n.positive_ion, "cation")), n.negative_ion && m.appendChild(na(n.negative_ion, "anion"));
    const { value: b, unit: v } = Jm(n.ion_concentration), $ = N("div", "display:flex;flex-direction:column;gap:5px;margin-left:auto;text-align:right;"), w = N("div", `display:flex;align-items:baseline;gap:${X.md};justify-content:flex-end;`);
    w.appendChild(
      N(
        "div",
        `font-size:${ee.display};font-weight:${ge.bold};line-height:1;color:${j.titleColor};`,
        b
      )
    ), v && (w.appendChild(document.createTextNode(" ")), w.appendChild(N("div", `font-size:${ee.body};color:${j.textMuted};`, v))), $.appendChild(w), $.appendChild(Wn("Ion concentration")), m.appendChild($), d.appendChild(m);
    const u = n.neutralize;
    return d.appendChild(
      N(
        "span",
        `${Pe.plain}align-self:flex-start;font-weight:${ge.bold};` + (u ? `background:${j.okBg};color:${j.okFg};` : `${Pe.outline}color:${j.textMuted};`),
        u ? "Neutralized" : "Not neutralized"
      )
    ), d.appendChild(
      N(
        "div",
        Eu,
        u ? "Counter-ions are added on top of the concentration above, enough to cancel whatever net charge the rest of the system carries." : "Only the concentration above: nothing is added to cancel the net charge the rest of the system carries."
      )
    ), s.appendChild(d), r.appendChild(s), {};
  }
}
ze("gufe-solvent", Ym);
class Xm extends Fe {
  placeholder() {
    return "Waiting for a component payload...";
  }
  renderView(t, n) {
    const r = sr(n.name || "Unnamed component", Bt(this));
    r.statsEl.appendChild(ir(n.gufe_type)), t.appendChild(r);
    const s = N("div", "flex:1;min-height:0;overflow:auto;display:flex;align-items:center;justify-content:center;padding:24px;");
    t.appendChild(s);
    const o = po();
    return o.style.maxWidth = "460px", o.appendChild(
      N(
        "div",
        `font-size:${ee.heading};font-weight:600;padding-bottom:6px;color:${j.textPrimary};`,
        `There is no visualization for ${n.gufe_type}.`
      )
    ), o.appendChild(
      N(
        "div",
        `font-size:${ee.body};line-height:1.6;padding-bottom:10px;color:${j.textMuted};`,
        "gufe lets a project define its own Component subclasses, so this is a component this build has never been taught to draw - not a broken payload. Everything gufe knows about it that survives serialization is below."
      )
    ), o.appendChild(Zn("Name", n.name || "(unnamed)")), o.appendChild(Zn("gufe class", n.gufe_type, !0)), s.appendChild(o), {};
  }
}
ze("gufe-unknown-component", Xm);
ga();
typeof globalThis < "u" && (globalThis.alchemyViz = { settings: Iu, reset: Lu });
export {
  Zm as PAYLOAD_TYPES,
  go as VIEW_TAGS
};
