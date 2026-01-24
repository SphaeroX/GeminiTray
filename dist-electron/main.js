var FE = Object.defineProperty;
var xh = (e) => {
  throw TypeError(e);
};
var LE = (e, t, r) => t in e ? FE(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var fs = (e, t, r) => LE(e, typeof t != "symbol" ? t + "" : t, r), Jc = (e, t, r) => t.has(e) || xh("Cannot " + r);
var ae = (e, t, r) => (Jc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), dr = (e, t, r) => t.has(e) ? xh("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), kt = (e, t, r, n) => (Jc(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), Or = (e, t, r) => (Jc(e, t, "access private method"), r);
import jr, { app as Ur, BrowserWindow as Uu, globalShortcut as _e, ipcMain as We, BrowserView as jE, nativeImage as UE, Tray as ME, Menu as xE, screen as Mu, desktopCapturer as VE, clipboard as qE } from "electron";
import Sn from "fs";
import BE from "constants";
import ia from "stream";
import xu from "util";
import cy from "assert";
import ke from "path";
import rc from "child_process";
import ly from "events";
import sa from "crypto";
import uy from "tty";
import nc from "os";
import bn from "url";
import fy from "zlib";
import GE from "http";
import * as Ui from "node:fs";
import oe from "node:fs";
import * as dy from "node:os";
import hy from "node:os";
import { fileURLToPath as HE } from "node:url";
import se from "node:path";
import Ie from "node:process";
import { promisify as nt, isDeepStrictEqual as Vh } from "node:util";
import Cn from "node:crypto";
import qh from "node:assert";
import "node:events";
import "node:stream";
var gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function py(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var nn = {}, ni = {}, vt = {};
vt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, s) => i != null ? n(i) : r(s)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
vt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var zr = BE, zE = process.cwd, $o = null, KE = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return $o || ($o = zE.call(process)), $o;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Bh = process.chdir;
  process.chdir = function(e) {
    $o = null, Bh.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Bh);
}
var WE = YE;
function YE(e) {
  zr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = o(e.stat), e.fstat = o(e.fstat), e.lstat = o(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, u, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, u, h, p) {
    p && process.nextTick(p);
  }, e.lchownSync = function() {
  }), KE === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function u(h, p, _) {
      var g = Date.now(), v = 0;
      l(h, p, function m(w) {
        if (w && (w.code === "EACCES" || w.code === "EPERM" || w.code === "EBUSY") && Date.now() - g < 6e4) {
          setTimeout(function() {
            e.stat(p, function(N, C) {
              N && N.code === "ENOENT" ? l(h, p, m) : _(w);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        _ && _(w);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, l), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function u(h, p, _, g, v, m) {
      var w;
      if (m && typeof m == "function") {
        var N = 0;
        w = function(C, M, z) {
          if (C && C.code === "EAGAIN" && N < 10)
            return N++, l.call(e, h, p, _, g, v, w);
          m.apply(this, arguments);
        };
      }
      return l.call(e, h, p, _, g, v, w);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, l), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(u, h, p, _, g) {
      for (var v = 0; ; )
        try {
          return l.call(e, u, h, p, _, g);
        } catch (m) {
          if (m.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw m;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(u, h, p) {
      l.open(
        u,
        zr.O_WRONLY | zr.O_SYMLINK,
        h,
        function(_, g) {
          if (_) {
            p && p(_);
            return;
          }
          l.fchmod(g, h, function(v) {
            l.close(g, function(m) {
              p && p(v || m);
            });
          });
        }
      );
    }, l.lchmodSync = function(u, h) {
      var p = l.openSync(u, zr.O_WRONLY | zr.O_SYMLINK, h), _ = !0, g;
      try {
        g = l.fchmodSync(p, h), _ = !1;
      } finally {
        if (_)
          try {
            l.closeSync(p);
          } catch {
          }
        else
          l.closeSync(p);
      }
      return g;
    };
  }
  function r(l) {
    zr.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(u, h, p, _) {
      l.open(u, zr.O_SYMLINK, function(g, v) {
        if (g) {
          _ && _(g);
          return;
        }
        l.futimes(v, h, p, function(m) {
          l.close(v, function(w) {
            _ && _(m || w);
          });
        });
      });
    }, l.lutimesSync = function(u, h, p) {
      var _ = l.openSync(u, zr.O_SYMLINK), g, v = !0;
      try {
        g = l.futimesSync(_, h, p), v = !1;
      } finally {
        if (v)
          try {
            l.closeSync(_);
          } catch {
          }
        else
          l.closeSync(_);
      }
      return g;
    }) : l.futimes && (l.lutimes = function(u, h, p, _) {
      _ && process.nextTick(_);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(u, h, p) {
      return l.call(e, u, h, function(_) {
        f(_) && (_ = null), p && p.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(u, h) {
      try {
        return l.call(e, u, h);
      } catch (p) {
        if (!f(p)) throw p;
      }
    };
  }
  function s(l) {
    return l && function(u, h, p, _) {
      return l.call(e, u, h, p, function(g) {
        f(g) && (g = null), _ && _.apply(this, arguments);
      });
    };
  }
  function a(l) {
    return l && function(u, h, p) {
      try {
        return l.call(e, u, h, p);
      } catch (_) {
        if (!f(_)) throw _;
      }
    };
  }
  function o(l) {
    return l && function(u, h, p) {
      typeof h == "function" && (p = h, h = null);
      function _(g, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), p && p.apply(this, arguments);
      }
      return h ? l.call(e, u, h, _) : l.call(e, u, _);
    };
  }
  function c(l) {
    return l && function(u, h) {
      var p = h ? l.call(e, u, h) : l.call(e, u);
      return p && (p.uid < 0 && (p.uid += 4294967296), p.gid < 0 && (p.gid += 4294967296)), p;
    };
  }
  function f(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var Gh = ia.Stream, XE = JE;
function JE(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Gh.call(this);
    var s = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), o = 0, c = a.length; o < c; o++) {
      var f = a[o];
      this[f] = i[f];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        s._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, u) {
      if (l) {
        s.emit("error", l), s.readable = !1;
        return;
      }
      s.fd = u, s.emit("open", u), s._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Gh.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var s = Object.keys(i), a = 0, o = s.length; a < o; a++) {
      var c = s[a];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var QE = ew, ZE = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function ew(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: ZE(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var De = Sn, tw = WE, rw = XE, nw = QE, Ia = xu, Ze, Co;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ze = Symbol.for("graceful-fs.queue"), Co = Symbol.for("graceful-fs.previous")) : (Ze = "___graceful-fs.queue", Co = "___graceful-fs.previous");
function iw() {
}
function my(e, t) {
  Object.defineProperty(e, Ze, {
    get: function() {
      return t;
    }
  });
}
var Yn = iw;
Ia.debuglog ? Yn = Ia.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Yn = function() {
  var e = Ia.format.apply(Ia, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!De[Ze]) {
  var sw = gt[Ze] || [];
  my(De, sw), De.close = function(e) {
    function t(r, n) {
      return e.call(De, r, function(i) {
        i || Hh(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Co, {
      value: e
    }), t;
  }(De.close), De.closeSync = function(e) {
    function t(r) {
      e.apply(De, arguments), Hh();
    }
    return Object.defineProperty(t, Co, {
      value: e
    }), t;
  }(De.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Yn(De[Ze]), cy.equal(De[Ze].length, 0);
  });
}
gt[Ze] || my(gt, De[Ze]);
var _t = Vu(nw(De));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !De.__patched && (_t = Vu(De), De.__patched = !0);
function Vu(e) {
  tw(e), e.gracefulify = Vu, e.createReadStream = M, e.createWriteStream = z;
  var t = e.readFile;
  e.readFile = r;
  function r(I, Z, B) {
    return typeof Z == "function" && (B = Z, Z = null), G(I, Z, B);
    function G(Q, k, D, x) {
      return t(Q, k, function(L) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? ci([G, [Q, k, D], L, x || Date.now(), Date.now()]) : typeof D == "function" && D.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(I, Z, B, G) {
    return typeof B == "function" && (G = B, B = null), Q(I, Z, B, G);
    function Q(k, D, x, L, V) {
      return n(k, D, x, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? ci([Q, [k, D, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = a);
  function a(I, Z, B, G) {
    return typeof B == "function" && (G = B, B = null), Q(I, Z, B, G);
    function Q(k, D, x, L, V) {
      return s(k, D, x, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? ci([Q, [k, D, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var o = e.copyFile;
  o && (e.copyFile = c);
  function c(I, Z, B, G) {
    return typeof B == "function" && (G = B, B = 0), Q(I, Z, B, G);
    function Q(k, D, x, L, V) {
      return o(k, D, x, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? ci([Q, [k, D, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var f = e.readdir;
  e.readdir = u;
  var l = /^v[0-5]\./;
  function u(I, Z, B) {
    typeof Z == "function" && (B = Z, Z = null);
    var G = l.test(process.version) ? function(D, x, L, V) {
      return f(D, Q(
        D,
        x,
        L,
        V
      ));
    } : function(D, x, L, V) {
      return f(D, x, Q(
        D,
        x,
        L,
        V
      ));
    };
    return G(I, Z, B);
    function Q(k, D, x, L) {
      return function(V, U) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ci([
          G,
          [k, D, x],
          V,
          L || Date.now(),
          Date.now()
        ]) : (U && U.sort && U.sort(), typeof x == "function" && x.call(this, V, U));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = rw(e);
    m = h.ReadStream, N = h.WriteStream;
  }
  var p = e.ReadStream;
  p && (m.prototype = Object.create(p.prototype), m.prototype.open = w);
  var _ = e.WriteStream;
  _ && (N.prototype = Object.create(_.prototype), N.prototype.open = C), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return m;
    },
    set: function(I) {
      m = I;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return N;
    },
    set: function(I) {
      N = I;
    },
    enumerable: !0,
    configurable: !0
  });
  var g = m;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return g;
    },
    set: function(I) {
      g = I;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = N;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(I) {
      v = I;
    },
    enumerable: !0,
    configurable: !0
  });
  function m(I, Z) {
    return this instanceof m ? (p.apply(this, arguments), this) : m.apply(Object.create(m.prototype), arguments);
  }
  function w() {
    var I = this;
    pe(I.path, I.flags, I.mode, function(Z, B) {
      Z ? (I.autoClose && I.destroy(), I.emit("error", Z)) : (I.fd = B, I.emit("open", B), I.read());
    });
  }
  function N(I, Z) {
    return this instanceof N ? (_.apply(this, arguments), this) : N.apply(Object.create(N.prototype), arguments);
  }
  function C() {
    var I = this;
    pe(I.path, I.flags, I.mode, function(Z, B) {
      Z ? (I.destroy(), I.emit("error", Z)) : (I.fd = B, I.emit("open", B));
    });
  }
  function M(I, Z) {
    return new e.ReadStream(I, Z);
  }
  function z(I, Z) {
    return new e.WriteStream(I, Z);
  }
  var K = e.open;
  e.open = pe;
  function pe(I, Z, B, G) {
    return typeof B == "function" && (G = B, B = null), Q(I, Z, B, G);
    function Q(k, D, x, L, V) {
      return K(k, D, x, function(U, R) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? ci([Q, [k, D, x, L], U, V || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  return e;
}
function ci(e) {
  Yn("ENQUEUE", e[0].name, e[1]), De[Ze].push(e), qu();
}
var Ca;
function Hh() {
  for (var e = Date.now(), t = 0; t < De[Ze].length; ++t)
    De[Ze][t].length > 2 && (De[Ze][t][3] = e, De[Ze][t][4] = e);
  qu();
}
function qu() {
  if (clearTimeout(Ca), Ca = void 0, De[Ze].length !== 0) {
    var e = De[Ze].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      Yn("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Yn("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var o = Date.now() - s, c = Math.max(s - i, 1), f = Math.min(c * 1.2, 100);
      o >= f ? (Yn("RETRY", t.name, r), t.apply(null, r.concat([i]))) : De[Ze].push(e);
    }
    Ca === void 0 && (Ca = setTimeout(qu, 0));
  }
}
(function(e) {
  const t = vt.fromCallback, r = _t, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, s) {
    return typeof s == "function" ? r.exists(i, s) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, s, a, o, c, f) {
    return typeof f == "function" ? r.read(i, s, a, o, c, f) : new Promise((l, u) => {
      r.read(i, s, a, o, c, (h, p, _) => {
        if (h) return u(h);
        l({ bytesRead: p, buffer: _ });
      });
    });
  }, e.write = function(i, s, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, s, ...a) : new Promise((o, c) => {
      r.write(i, s, ...a, (f, l, u) => {
        if (f) return c(f);
        o({ bytesWritten: l, buffer: u });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, s, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, s, ...a) : new Promise((o, c) => {
      r.writev(i, s, ...a, (f, l, u) => {
        if (f) return c(f);
        o({ bytesWritten: l, buffers: u });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(ni);
var Bu = {}, gy = {};
const aw = ke;
gy.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(aw.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const yy = ni, { checkPath: $y } = gy, vy = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Bu.makeDir = async (e, t) => ($y(e), yy.mkdir(e, {
  mode: vy(t),
  recursive: !0
}));
Bu.makeDirSync = (e, t) => ($y(e), yy.mkdirSync(e, {
  mode: vy(t),
  recursive: !0
}));
const ow = vt.fromPromise, { makeDir: cw, makeDirSync: Qc } = Bu, Zc = ow(cw);
var wr = {
  mkdirs: Zc,
  mkdirsSync: Qc,
  // alias
  mkdirp: Zc,
  mkdirpSync: Qc,
  ensureDir: Zc,
  ensureDirSync: Qc
};
const lw = vt.fromPromise, _y = ni;
function uw(e) {
  return _y.access(e).then(() => !0).catch(() => !1);
}
var ii = {
  pathExists: lw(uw),
  pathExistsSync: _y.existsSync
};
const Ii = _t;
function fw(e, t, r, n) {
  Ii.open(e, "r+", (i, s) => {
    if (i) return n(i);
    Ii.futimes(s, t, r, (a) => {
      Ii.close(s, (o) => {
        n && n(a || o);
      });
    });
  });
}
function dw(e, t, r) {
  const n = Ii.openSync(e, "r+");
  return Ii.futimesSync(n, t, r), Ii.closeSync(n);
}
var Ey = {
  utimesMillis: fw,
  utimesMillisSync: dw
};
const Mi = ni, He = ke, hw = xu;
function pw(e, t, r) {
  const n = r.dereference ? (i) => Mi.stat(i, { bigint: !0 }) : (i) => Mi.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function mw(e, t, r) {
  let n;
  const i = r.dereference ? (a) => Mi.statSync(a, { bigint: !0 }) : (a) => Mi.lstatSync(a, { bigint: !0 }), s = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: s, destStat: null };
    throw a;
  }
  return { srcStat: s, destStat: n };
}
function gw(e, t, r, n, i) {
  hw.callbackify(pw)(e, t, n, (s, a) => {
    if (s) return i(s);
    const { srcStat: o, destStat: c } = a;
    if (c) {
      if (aa(o, c)) {
        const f = He.basename(e), l = He.basename(t);
        return r === "move" && f !== l && f.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: o, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (o.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!o.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return o.isDirectory() && Gu(e, t) ? i(new Error(ic(e, t, r))) : i(null, { srcStat: o, destStat: c });
  });
}
function yw(e, t, r, n) {
  const { srcStat: i, destStat: s } = mw(e, t, n);
  if (s) {
    if (aa(i, s)) {
      const a = He.basename(e), o = He.basename(t);
      if (r === "move" && a !== o && a.toLowerCase() === o.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Gu(e, t))
    throw new Error(ic(e, t, r));
  return { srcStat: i, destStat: s };
}
function wy(e, t, r, n, i) {
  const s = He.resolve(He.dirname(e)), a = He.resolve(He.dirname(r));
  if (a === s || a === He.parse(a).root) return i();
  Mi.stat(a, { bigint: !0 }, (o, c) => o ? o.code === "ENOENT" ? i() : i(o) : aa(t, c) ? i(new Error(ic(e, r, n))) : wy(e, t, a, n, i));
}
function Sy(e, t, r, n) {
  const i = He.resolve(He.dirname(e)), s = He.resolve(He.dirname(r));
  if (s === i || s === He.parse(s).root) return;
  let a;
  try {
    a = Mi.statSync(s, { bigint: !0 });
  } catch (o) {
    if (o.code === "ENOENT") return;
    throw o;
  }
  if (aa(t, a))
    throw new Error(ic(e, r, n));
  return Sy(e, t, s, n);
}
function aa(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Gu(e, t) {
  const r = He.resolve(e).split(He.sep).filter((i) => i), n = He.resolve(t).split(He.sep).filter((i) => i);
  return r.reduce((i, s, a) => i && n[a] === s, !0);
}
function ic(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Ki = {
  checkPaths: gw,
  checkPathsSync: yw,
  checkParentPaths: wy,
  checkParentPathsSync: Sy,
  isSrcSubdir: Gu,
  areIdentical: aa
};
const Rt = _t, Vs = ke, $w = wr.mkdirs, vw = ii.pathExists, _w = Ey.utimesMillis, qs = Ki;
function Ew(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), qs.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: a, destStat: o } = s;
    qs.checkParentPaths(e, a, t, "copy", (c) => c ? n(c) : r.filter ? by(zh, o, e, t, r, n) : zh(o, e, t, r, n));
  });
}
function zh(e, t, r, n, i) {
  const s = Vs.dirname(r);
  vw(s, (a, o) => {
    if (a) return i(a);
    if (o) return Do(e, t, r, n, i);
    $w(s, (c) => c ? i(c) : Do(e, t, r, n, i));
  });
}
function by(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, s) : s(), (a) => s(a));
}
function ww(e, t, r, n, i) {
  return n.filter ? by(Do, e, t, r, n, i) : Do(e, t, r, n, i);
}
function Do(e, t, r, n, i) {
  (n.dereference ? Rt.stat : Rt.lstat)(t, (a, o) => a ? i(a) : o.isDirectory() ? Rw(o, e, t, r, n, i) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? Sw(o, e, t, r, n, i) : o.isSymbolicLink() ? Cw(e, t, r, n, i) : o.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Sw(e, t, r, n, i, s) {
  return t ? bw(e, r, n, i, s) : Py(e, r, n, i, s);
}
function bw(e, t, r, n, i) {
  if (n.overwrite)
    Rt.unlink(r, (s) => s ? i(s) : Py(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Py(e, t, r, n, i) {
  Rt.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? Pw(e.mode, t, r, i) : sc(r, e.mode, i));
}
function Pw(e, t, r, n) {
  return Tw(e) ? Nw(r, e, (i) => i ? n(i) : Kh(e, t, r, n)) : Kh(e, t, r, n);
}
function Tw(e) {
  return (e & 128) === 0;
}
function Nw(e, t, r) {
  return sc(e, t | 128, r);
}
function Kh(e, t, r, n) {
  Aw(t, r, (i) => i ? n(i) : sc(r, e, n));
}
function sc(e, t, r) {
  return Rt.chmod(e, t, r);
}
function Aw(e, t, r) {
  Rt.stat(e, (n, i) => n ? r(n) : _w(t, i.atime, i.mtime, r));
}
function Rw(e, t, r, n, i, s) {
  return t ? Ty(r, n, i, s) : Ow(e.mode, r, n, i, s);
}
function Ow(e, t, r, n, i) {
  Rt.mkdir(r, (s) => {
    if (s) return i(s);
    Ty(t, r, n, (a) => a ? i(a) : sc(r, e, i));
  });
}
function Ty(e, t, r, n) {
  Rt.readdir(e, (i, s) => i ? n(i) : Ny(s, e, t, r, n));
}
function Ny(e, t, r, n, i) {
  const s = e.pop();
  return s ? Iw(e, s, t, r, n, i) : i();
}
function Iw(e, t, r, n, i, s) {
  const a = Vs.join(r, t), o = Vs.join(n, t);
  qs.checkPaths(a, o, "copy", i, (c, f) => {
    if (c) return s(c);
    const { destStat: l } = f;
    ww(l, a, o, i, (u) => u ? s(u) : Ny(e, r, n, i, s));
  });
}
function Cw(e, t, r, n, i) {
  Rt.readlink(t, (s, a) => {
    if (s) return i(s);
    if (n.dereference && (a = Vs.resolve(process.cwd(), a)), e)
      Rt.readlink(r, (o, c) => o ? o.code === "EINVAL" || o.code === "UNKNOWN" ? Rt.symlink(a, r, i) : i(o) : (n.dereference && (c = Vs.resolve(process.cwd(), c)), qs.isSrcSubdir(a, c) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && qs.isSrcSubdir(c, a) ? i(new Error(`Cannot overwrite '${c}' with '${a}'.`)) : Dw(a, r, i)));
    else
      return Rt.symlink(a, r, i);
  });
}
function Dw(e, t, r) {
  Rt.unlink(t, (n) => n ? r(n) : Rt.symlink(e, t, r));
}
var kw = Ew;
const lt = _t, Bs = ke, Fw = wr.mkdirsSync, Lw = Ey.utimesMillisSync, Gs = Ki;
function jw(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Gs.checkPathsSync(e, t, "copy", r);
  return Gs.checkParentPathsSync(e, n, t, "copy"), Uw(i, e, t, r);
}
function Uw(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Bs.dirname(r);
  return lt.existsSync(i) || Fw(i), Ay(e, t, r, n);
}
function Mw(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Ay(e, t, r, n);
}
function Ay(e, t, r, n) {
  const s = (n.dereference ? lt.statSync : lt.lstatSync)(t);
  if (s.isDirectory()) return zw(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return xw(s, e, t, r, n);
  if (s.isSymbolicLink()) return Yw(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function xw(e, t, r, n, i) {
  return t ? Vw(e, r, n, i) : Ry(e, r, n, i);
}
function Vw(e, t, r, n) {
  if (n.overwrite)
    return lt.unlinkSync(r), Ry(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Ry(e, t, r, n) {
  return lt.copyFileSync(t, r), n.preserveTimestamps && qw(e.mode, t, r), Hu(r, e.mode);
}
function qw(e, t, r) {
  return Bw(e) && Gw(r, e), Hw(t, r);
}
function Bw(e) {
  return (e & 128) === 0;
}
function Gw(e, t) {
  return Hu(e, t | 128);
}
function Hu(e, t) {
  return lt.chmodSync(e, t);
}
function Hw(e, t) {
  const r = lt.statSync(e);
  return Lw(t, r.atime, r.mtime);
}
function zw(e, t, r, n, i) {
  return t ? Oy(r, n, i) : Kw(e.mode, r, n, i);
}
function Kw(e, t, r, n) {
  return lt.mkdirSync(r), Oy(t, r, n), Hu(r, e);
}
function Oy(e, t, r) {
  lt.readdirSync(e).forEach((n) => Ww(n, e, t, r));
}
function Ww(e, t, r, n) {
  const i = Bs.join(t, e), s = Bs.join(r, e), { destStat: a } = Gs.checkPathsSync(i, s, "copy", n);
  return Mw(a, i, s, n);
}
function Yw(e, t, r, n) {
  let i = lt.readlinkSync(t);
  if (n.dereference && (i = Bs.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = lt.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return lt.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (s = Bs.resolve(process.cwd(), s)), Gs.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if (lt.statSync(r).isDirectory() && Gs.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return Xw(i, r);
  } else
    return lt.symlinkSync(i, r);
}
function Xw(e, t) {
  return lt.unlinkSync(t), lt.symlinkSync(e, t);
}
var Jw = jw;
const Qw = vt.fromCallback;
var zu = {
  copy: Qw(kw),
  copySync: Jw
};
const Wh = _t, Iy = ke, Pe = cy, Hs = process.platform === "win32";
function Cy(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Wh[r], r = r + "Sync", e[r] = e[r] || Wh[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Ku(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), Pe(e, "rimraf: missing path"), Pe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Pe.strictEqual(typeof r, "function", "rimraf: callback function required"), Pe(t, "rimraf: invalid options argument provided"), Pe.strictEqual(typeof t, "object", "rimraf: options should be object"), Cy(t), Yh(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => Yh(e, t, i), a);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function Yh(e, t, r) {
  Pe(e), Pe(t), Pe(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Hs)
      return Xh(e, t, n, r);
    if (i && i.isDirectory())
      return vo(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return Hs ? Xh(e, t, s, r) : vo(e, t, s, r);
        if (s.code === "EISDIR")
          return vo(e, t, s, r);
      }
      return r(s);
    });
  });
}
function Xh(e, t, r, n) {
  Pe(e), Pe(t), Pe(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, a) => {
      s ? n(s.code === "ENOENT" ? null : r) : a.isDirectory() ? vo(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Jh(e, t, r) {
  let n;
  Pe(e), Pe(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? _o(e, t, r) : t.unlinkSync(e);
}
function vo(e, t, r, n) {
  Pe(e), Pe(t), Pe(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Zw(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Zw(e, t, r) {
  Pe(e), Pe(t), Pe(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, a;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((o) => {
      Ku(Iy.join(e, o), t, (c) => {
        if (!a) {
          if (c) return r(a = c);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Dy(e, t) {
  let r;
  t = t || {}, Cy(t), Pe(e, "rimraf: missing path"), Pe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Pe(t, "rimraf: missing options"), Pe.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Hs && Jh(e, t, n);
  }
  try {
    r && r.isDirectory() ? _o(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Hs ? Jh(e, t, n) : _o(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    _o(e, t, n);
  }
}
function _o(e, t, r) {
  Pe(e), Pe(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      eS(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function eS(e, t) {
  if (Pe(e), Pe(t), t.readdirSync(e).forEach((r) => Dy(Iy.join(e, r), t)), Hs) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var tS = Ku;
Ku.sync = Dy;
const ko = _t, rS = vt.fromCallback, ky = tS;
function nS(e, t) {
  if (ko.rm) return ko.rm(e, { recursive: !0, force: !0 }, t);
  ky(e, t);
}
function iS(e) {
  if (ko.rmSync) return ko.rmSync(e, { recursive: !0, force: !0 });
  ky.sync(e);
}
var ac = {
  remove: rS(nS),
  removeSync: iS
};
const sS = vt.fromPromise, Fy = ni, Ly = ke, jy = wr, Uy = ac, Qh = sS(async function(t) {
  let r;
  try {
    r = await Fy.readdir(t);
  } catch {
    return jy.mkdirs(t);
  }
  return Promise.all(r.map((n) => Uy.remove(Ly.join(t, n))));
});
function Zh(e) {
  let t;
  try {
    t = Fy.readdirSync(e);
  } catch {
    return jy.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Ly.join(e, r), Uy.removeSync(r);
  });
}
var aS = {
  emptyDirSync: Zh,
  emptydirSync: Zh,
  emptyDir: Qh,
  emptydir: Qh
};
const oS = vt.fromCallback, My = ke, un = _t, xy = wr;
function cS(e, t) {
  function r() {
    un.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  un.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = My.dirname(e);
    un.stat(s, (a, o) => {
      if (a)
        return a.code === "ENOENT" ? xy.mkdirs(s, (c) => {
          if (c) return t(c);
          r();
        }) : t(a);
      o.isDirectory() ? r() : un.readdir(s, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function lS(e) {
  let t;
  try {
    t = un.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = My.dirname(e);
  try {
    un.statSync(r).isDirectory() || un.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") xy.mkdirsSync(r);
    else throw n;
  }
  un.writeFileSync(e, "");
}
var uS = {
  createFile: oS(cS),
  createFileSync: lS
};
const fS = vt.fromCallback, Vy = ke, on = _t, qy = wr, dS = ii.pathExists, { areIdentical: By } = Ki;
function hS(e, t, r) {
  function n(i, s) {
    on.link(i, s, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  on.lstat(t, (i, s) => {
    on.lstat(e, (a, o) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (s && By(o, s)) return r(null);
      const c = Vy.dirname(t);
      dS(c, (f, l) => {
        if (f) return r(f);
        if (l) return n(e, t);
        qy.mkdirs(c, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function pS(e, t) {
  let r;
  try {
    r = on.lstatSync(t);
  } catch {
  }
  try {
    const s = on.lstatSync(e);
    if (r && By(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = Vy.dirname(t);
  return on.existsSync(n) || qy.mkdirsSync(n), on.linkSync(e, t);
}
var mS = {
  createLink: fS(hS),
  createLinkSync: pS
};
const fn = ke, Ns = _t, gS = ii.pathExists;
function yS(e, t, r) {
  if (fn.isAbsolute(e))
    return Ns.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = fn.dirname(t), i = fn.join(n, e);
    return gS(i, (s, a) => s ? r(s) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : Ns.lstat(e, (o) => o ? (o.message = o.message.replace("lstat", "ensureSymlink"), r(o)) : r(null, {
      toCwd: e,
      toDst: fn.relative(n, e)
    })));
  }
}
function $S(e, t) {
  let r;
  if (fn.isAbsolute(e)) {
    if (r = Ns.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = fn.dirname(t), i = fn.join(n, e);
    if (r = Ns.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Ns.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: fn.relative(n, e)
    };
  }
}
var vS = {
  symlinkPaths: yS,
  symlinkPathsSync: $S
};
const Gy = _t;
function _S(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Gy.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function ES(e, t) {
  let r;
  if (t) return t;
  try {
    r = Gy.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var wS = {
  symlinkType: _S,
  symlinkTypeSync: ES
};
const SS = vt.fromCallback, Hy = ke, er = ni, zy = wr, bS = zy.mkdirs, PS = zy.mkdirsSync, Ky = vS, TS = Ky.symlinkPaths, NS = Ky.symlinkPathsSync, Wy = wS, AS = Wy.symlinkType, RS = Wy.symlinkTypeSync, OS = ii.pathExists, { areIdentical: Yy } = Ki;
function IS(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, er.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      er.stat(e),
      er.stat(t)
    ]).then(([a, o]) => {
      if (Yy(a, o)) return n(null);
      ep(e, t, r, n);
    }) : ep(e, t, r, n);
  });
}
function ep(e, t, r, n) {
  TS(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, AS(s.toCwd, r, (a, o) => {
      if (a) return n(a);
      const c = Hy.dirname(t);
      OS(c, (f, l) => {
        if (f) return n(f);
        if (l) return er.symlink(e, t, o, n);
        bS(c, (u) => {
          if (u) return n(u);
          er.symlink(e, t, o, n);
        });
      });
    });
  });
}
function CS(e, t, r) {
  let n;
  try {
    n = er.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const o = er.statSync(e), c = er.statSync(t);
    if (Yy(o, c)) return;
  }
  const i = NS(e, t);
  e = i.toDst, r = RS(i.toCwd, r);
  const s = Hy.dirname(t);
  return er.existsSync(s) || PS(s), er.symlinkSync(e, t, r);
}
var DS = {
  createSymlink: SS(IS),
  createSymlinkSync: CS
};
const { createFile: tp, createFileSync: rp } = uS, { createLink: np, createLinkSync: ip } = mS, { createSymlink: sp, createSymlinkSync: ap } = DS;
var kS = {
  // file
  createFile: tp,
  createFileSync: rp,
  ensureFile: tp,
  ensureFileSync: rp,
  // link
  createLink: np,
  createLinkSync: ip,
  ensureLink: np,
  ensureLinkSync: ip,
  // symlink
  createSymlink: sp,
  createSymlinkSync: ap,
  ensureSymlink: sp,
  ensureSymlinkSync: ap
};
function FS(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const s = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + s;
}
function LS(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Wu = { stringify: FS, stripBom: LS };
let xi;
try {
  xi = _t;
} catch {
  xi = Sn;
}
const oc = vt, { stringify: Xy, stripBom: Jy } = Wu;
async function jS(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || xi, n = "throws" in t ? t.throws : !0;
  let i = await oc.fromCallback(r.readFile)(e, t);
  i = Jy(i);
  let s;
  try {
    s = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return s;
}
const US = oc.fromPromise(jS);
function MS(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || xi, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Jy(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function xS(e, t, r = {}) {
  const n = r.fs || xi, i = Xy(t, r);
  await oc.fromCallback(n.writeFile)(e, i, r);
}
const VS = oc.fromPromise(xS);
function qS(e, t, r = {}) {
  const n = r.fs || xi, i = Xy(t, r);
  return n.writeFileSync(e, i, r);
}
var BS = {
  readFile: US,
  readFileSync: MS,
  writeFile: VS,
  writeFileSync: qS
};
const Da = BS;
var GS = {
  // jsonfile exports
  readJson: Da.readFile,
  readJsonSync: Da.readFileSync,
  writeJson: Da.writeFile,
  writeJsonSync: Da.writeFileSync
};
const HS = vt.fromCallback, As = _t, Qy = ke, Zy = wr, zS = ii.pathExists;
function KS(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Qy.dirname(e);
  zS(i, (s, a) => {
    if (s) return n(s);
    if (a) return As.writeFile(e, t, r, n);
    Zy.mkdirs(i, (o) => {
      if (o) return n(o);
      As.writeFile(e, t, r, n);
    });
  });
}
function WS(e, ...t) {
  const r = Qy.dirname(e);
  if (As.existsSync(r))
    return As.writeFileSync(e, ...t);
  Zy.mkdirsSync(r), As.writeFileSync(e, ...t);
}
var Yu = {
  outputFile: HS(KS),
  outputFileSync: WS
};
const { stringify: YS } = Wu, { outputFile: XS } = Yu;
async function JS(e, t, r = {}) {
  const n = YS(t, r);
  await XS(e, n, r);
}
var QS = JS;
const { stringify: ZS } = Wu, { outputFileSync: eb } = Yu;
function tb(e, t, r) {
  const n = ZS(t, r);
  eb(e, n, r);
}
var rb = tb;
const nb = vt.fromPromise, $t = GS;
$t.outputJson = nb(QS);
$t.outputJsonSync = rb;
$t.outputJSON = $t.outputJson;
$t.outputJSONSync = $t.outputJsonSync;
$t.writeJSON = $t.writeJson;
$t.writeJSONSync = $t.writeJsonSync;
$t.readJSON = $t.readJson;
$t.readJSONSync = $t.readJsonSync;
var ib = $t;
const sb = _t, ru = ke, ab = zu.copy, e0 = ac.remove, ob = wr.mkdirp, cb = ii.pathExists, op = Ki;
function lb(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  op.checkPaths(e, t, "move", r, (s, a) => {
    if (s) return n(s);
    const { srcStat: o, isChangingCase: c = !1 } = a;
    op.checkParentPaths(e, o, t, "move", (f) => {
      if (f) return n(f);
      if (ub(t)) return cp(e, t, i, c, n);
      ob(ru.dirname(t), (l) => l ? n(l) : cp(e, t, i, c, n));
    });
  });
}
function ub(e) {
  const t = ru.dirname(e);
  return ru.parse(t).root === t;
}
function cp(e, t, r, n, i) {
  if (n) return el(e, t, r, i);
  if (r)
    return e0(t, (s) => s ? i(s) : el(e, t, r, i));
  cb(t, (s, a) => s ? i(s) : a ? i(new Error("dest already exists.")) : el(e, t, r, i));
}
function el(e, t, r, n) {
  sb.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : fb(e, t, r, n) : n());
}
function fb(e, t, r, n) {
  ab(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : e0(e, n));
}
var db = lb;
const t0 = _t, nu = ke, hb = zu.copySync, r0 = ac.removeSync, pb = wr.mkdirpSync, lp = Ki;
function mb(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = lp.checkPathsSync(e, t, "move", r);
  return lp.checkParentPathsSync(e, i, t, "move"), gb(t) || pb(nu.dirname(t)), yb(e, t, n, s);
}
function gb(e) {
  const t = nu.dirname(e);
  return nu.parse(t).root === t;
}
function yb(e, t, r, n) {
  if (n) return tl(e, t, r);
  if (r)
    return r0(t), tl(e, t, r);
  if (t0.existsSync(t)) throw new Error("dest already exists.");
  return tl(e, t, r);
}
function tl(e, t, r) {
  try {
    t0.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return $b(e, t, r);
  }
}
function $b(e, t, r) {
  return hb(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), r0(e);
}
var vb = mb;
const _b = vt.fromCallback;
var Eb = {
  move: _b(db),
  moveSync: vb
}, Pn = {
  // Export promiseified graceful-fs:
  ...ni,
  // Export extra methods:
  ...zu,
  ...aS,
  ...kS,
  ...ib,
  ...wr,
  ...Eb,
  ...Yu,
  ...ii,
  ...ac
}, si = {}, $n = {}, Be = {}, vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.CancellationError = vn.CancellationToken = void 0;
const wb = ly;
class Sb extends wb.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new iu());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, s) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          s(new iu());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, s, (o) => {
        a = o;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
vn.CancellationToken = Sb;
class iu extends Error {
  constructor() {
    super("cancelled");
  }
}
vn.CancellationError = iu;
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.newError = bb;
function bb(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var yt = {}, su = { exports: {} }, ka = { exports: {} }, rl, up;
function Pb() {
  if (up) return rl;
  up = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  rl = function(l, u) {
    u = u || {};
    var h = typeof l;
    if (h === "string" && l.length > 0)
      return a(l);
    if (h === "number" && isFinite(l))
      return u.long ? c(l) : o(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function a(l) {
    if (l = String(l), !(l.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (u) {
        var h = parseFloat(u[1]), p = (u[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * s;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function o(l) {
    var u = Math.abs(l);
    return u >= n ? Math.round(l / n) + "d" : u >= r ? Math.round(l / r) + "h" : u >= t ? Math.round(l / t) + "m" : u >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var u = Math.abs(l);
    return u >= n ? f(l, u, n, "day") : u >= r ? f(l, u, r, "hour") : u >= t ? f(l, u, t, "minute") : u >= e ? f(l, u, e, "second") : l + " ms";
  }
  function f(l, u, h, p) {
    var _ = u >= h * 1.5;
    return Math.round(l / h) + " " + p + (_ ? "s" : "");
  }
  return rl;
}
var nl, fp;
function n0() {
  if (fp) return nl;
  fp = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = f, n.disable = o, n.enable = s, n.enabled = c, n.humanize = Pb(), n.destroy = l, Object.keys(t).forEach((u) => {
      n[u] = t[u];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(u) {
      let h = 0;
      for (let p = 0; p < u.length; p++)
        h = (h << 5) - h + u.charCodeAt(p), h |= 0;
      return n.colors[Math.abs(h) % n.colors.length];
    }
    n.selectColor = r;
    function n(u) {
      let h, p = null, _, g;
      function v(...m) {
        if (!v.enabled)
          return;
        const w = v, N = Number(/* @__PURE__ */ new Date()), C = N - (h || N);
        w.diff = C, w.prev = h, w.curr = N, h = N, m[0] = n.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
        let M = 0;
        m[0] = m[0].replace(/%([a-zA-Z%])/g, (K, pe) => {
          if (K === "%%")
            return "%";
          M++;
          const I = n.formatters[pe];
          if (typeof I == "function") {
            const Z = m[M];
            K = I.call(w, Z), m.splice(M, 1), M--;
          }
          return K;
        }), n.formatArgs.call(w, m), (w.log || n.log).apply(w, m);
      }
      return v.namespace = u, v.useColors = n.useColors(), v.color = n.selectColor(u), v.extend = i, v.destroy = n.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (_ !== n.namespaces && (_ = n.namespaces, g = n.enabled(u)), g),
        set: (m) => {
          p = m;
        }
      }), typeof n.init == "function" && n.init(v), v;
    }
    function i(u, h) {
      const p = n(this.namespace + (typeof h > "u" ? ":" : h) + u);
      return p.log = this.log, p;
    }
    function s(u) {
      n.save(u), n.namespaces = u, n.names = [], n.skips = [];
      const h = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of h)
        p[0] === "-" ? n.skips.push(p.slice(1)) : n.names.push(p);
    }
    function a(u, h) {
      let p = 0, _ = 0, g = -1, v = 0;
      for (; p < u.length; )
        if (_ < h.length && (h[_] === u[p] || h[_] === "*"))
          h[_] === "*" ? (g = _, v = p, _++) : (p++, _++);
        else if (g !== -1)
          _ = g + 1, v++, p = v;
        else
          return !1;
      for (; _ < h.length && h[_] === "*"; )
        _++;
      return _ === h.length;
    }
    function o() {
      const u = [
        ...n.names,
        ...n.skips.map((h) => "-" + h)
      ].join(",");
      return n.enable(""), u;
    }
    function c(u) {
      for (const h of n.skips)
        if (a(u, h))
          return !1;
      for (const h of n.names)
        if (a(u, h))
          return !0;
      return !1;
    }
    function f(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return nl = e, nl;
}
var dp;
function Tb() {
  return dp || (dp = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = s, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const f = "color: " + this.color;
      c.splice(1, 0, f, "color: inherit");
      let l = 0, u = 0;
      c[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (l++, h === "%c" && (u = l));
      }), c.splice(u, 0, f);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = n0()(t);
    const { formatters: o } = e.exports;
    o.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (f) {
        return "[UnexpectedJSONParseError]: " + f.message;
      }
    };
  }(ka, ka.exports)), ka.exports;
}
var Fa = { exports: {} }, il, hp;
function Nb() {
  return hp || (hp = 1, il = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), il;
}
var sl, pp;
function Ab() {
  if (pp) return sl;
  pp = 1;
  const e = nc, t = uy, r = Nb(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function a(c, f) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (c && !f && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const u = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function o(c) {
    const f = a(c, c && c.isTTY);
    return s(f);
  }
  return sl = {
    supportsColor: o,
    stdout: s(a(!0, t.isatty(1))),
    stderr: s(a(!0, t.isatty(2)))
  }, sl;
}
var mp;
function Rb() {
  return mp || (mp = 1, function(e, t) {
    const r = uy, n = xu;
    t.init = l, t.log = o, t.formatArgs = s, t.save = c, t.load = f, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Ab();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, p) => {
      const _ = p.substring(6).toLowerCase().replace(/_([a-z])/g, (v, m) => m.toUpperCase());
      let g = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(g) ? g = !0 : /^(no|off|false|disabled)$/i.test(g) ? g = !1 : g === "null" ? g = null : g = Number(g), h[_] = g, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function s(h) {
      const { namespace: p, useColors: _ } = this;
      if (_) {
        const g = this.color, v = "\x1B[3" + (g < 8 ? g : "8;5;" + g), m = `  ${v};1m${p} \x1B[0m`;
        h[0] = m + h[0].split(`
`).join(`
` + m), h.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + p + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function o(...h) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function c(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function f() {
      return process.env.DEBUG;
    }
    function l(h) {
      h.inspectOpts = {};
      const p = Object.keys(t.inspectOpts);
      for (let _ = 0; _ < p.length; _++)
        h.inspectOpts[p[_]] = t.inspectOpts[p[_]];
    }
    e.exports = n0()(t);
    const { formatters: u } = e.exports;
    u.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, u.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(Fa, Fa.exports)), Fa.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? su.exports = Tb() : su.exports = Rb();
var Ob = su.exports, oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.ProgressCallbackTransform = void 0;
const Ib = ia;
class Cb extends Ib.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
oa.ProgressCallbackTransform = Cb;
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.DigestTransform = yt.HttpExecutor = yt.HttpError = void 0;
yt.createHttpError = ou;
yt.parseJson = xb;
yt.configureRequestOptionsFromUrl = s0;
yt.configureRequestUrl = Ju;
yt.safeGetHeader = Ci;
yt.configureRequestOptions = Fo;
yt.safeStringifyJson = Lo;
const Db = sa, kb = Ob, Fb = Sn, Lb = ia, au = bn, jb = vn, gp = Wi, Ub = oa, Dn = (0, kb.default)("electron-builder");
function ou(e, t = null) {
  return new Xu(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Lo(e.headers), t);
}
const Mb = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Xu extends Error {
  constructor(t, r = `HTTP error: ${Mb.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
yt.HttpError = Xu;
function xb(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class wi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new jb.CancellationToken(), n) {
    Fo(t);
    const i = n == null ? void 0 : JSON.stringify(n), s = i ? Buffer.from(i) : void 0;
    if (s != null) {
      Dn(i);
      const { headers: a, ...o } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": s.length,
          ...a
        },
        ...o
      };
    }
    return this.doApiRequest(t, r, (a) => a.end(s));
  }
  doApiRequest(t, r, n, i = 0) {
    return Dn.enabled && Dn(`Request: ${Lo(t)}`), r.createPromise((s, a, o) => {
      const c = this.createRequest(t, (f) => {
        try {
          this.handleResponse(f, t, r, s, a, i, n);
        } catch (l) {
          a(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, a, t.timeout), this.addRedirectHandlers(c, t, a, i, (f) => {
        this.doApiRequest(f, r, n, i).then(s).catch(a);
      }), n(c, a), o(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, s) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, s, a, o) {
    var c;
    if (Dn.enabled && Dn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Lo(r)}`), t.statusCode === 404) {
      s(ou(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const f = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = f >= 300 && f < 400, u = Ci(t, "location");
    if (l && u != null) {
      if (a > this.maxRedirects) {
        s(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(wi.prepareRedirectUrlOptions(u, r), n, o, a).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", s), t.on("data", (p) => h += p), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const p = Ci(t, "content-type"), _ = p != null && (Array.isArray(p) ? p.find((g) => g.includes("json")) != null : p.includes("json"));
          s(ou(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${_ ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (p) {
        s(p);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, s) => {
      const a = [], o = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Ju(t, o), Fo(o), this.doDownload(o, {
        destination: null,
        options: r,
        onCancel: s,
        callback: (c) => {
          c == null ? n(Buffer.concat(a)) : i(c);
        },
        responseHandler: (c, f) => {
          let l = 0;
          c.on("data", (u) => {
            if (l += u.length, l > 524288e3) {
              f(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(u);
          }), c.on("end", () => {
            f(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (s) => {
      if (s.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${s.statusCode}: ${s.statusMessage}`));
        return;
      }
      s.on("error", r.callback);
      const a = Ci(s, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(wi.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? qb(r, s) : r.responseHandler(s, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (s) => {
      this.doDownload(s, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = s0(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const s = wi.reconstructOriginalUrl(r), a = i0(t, r);
      wi.isCrossOriginRedirect(s, a) && (Dn.enabled && Dn(`Given the cross-origin redirect (from ${s.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new au.URL(`${r}//${n}${i}${s}`);
  }
  static isCrossOriginRedirect(t, r) {
    if (t.hostname.toLowerCase() !== r.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && r.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(r.port))
      return !1;
    if (t.protocol !== r.protocol)
      return !0;
    const n = t.port, i = r.port;
    return n !== i;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof Xu && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
yt.HttpExecutor = wi;
function i0(e, t) {
  try {
    return new au.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new au.URL(e, s);
  }
}
function s0(e, t) {
  const r = Fo(t), n = i0(e, t);
  return Ju(n, r), r;
}
function Ju(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class cu extends Lb.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Db.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, gp.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, gp.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
yt.DigestTransform = cu;
function Vb(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Ci(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function qb(e, t) {
  if (!Vb(Ci(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = Ci(t, "content-length");
    a != null && r.push(new Ub.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new cu(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new cu(e.options.sha2, "sha256", "hex"));
  const i = (0, Fb.createWriteStream)(e.destination);
  r.push(i);
  let s = t;
  for (const a of r)
    a.on("error", (o) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(o);
    }), s = s.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Fo(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Lo(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var cc = {};
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.MemoLazy = void 0;
class Bb {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && a0(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
cc.MemoLazy = Bb;
function a0(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((a) => a0(e[a], t[a]));
  }
  return e === t;
}
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
ca.githubUrl = Gb;
ca.githubTagPrefix = Hb;
ca.getS3LikeProviderBaseUrl = zb;
function Gb(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Hb(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function zb(e) {
  const t = e.provider;
  if (t === "s3")
    return Kb(e);
  if (t === "spaces")
    return Wb(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Kb(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return o0(t, e.path);
}
function o0(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Wb(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return o0(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Qu = {};
Object.defineProperty(Qu, "__esModule", { value: !0 });
Qu.retry = c0;
const Yb = vn;
async function c0(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: a = 0, shouldRetry: o, cancellationToken: c = new Yb.CancellationToken() } = t;
  try {
    return await e();
  } catch (f) {
    if (await Promise.resolve((r = o == null ? void 0 : o(f)) !== null && r !== void 0 ? r : !0) && n > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * a)), await c0(e, { ...t, retries: n - 1, attempt: a + 1 });
    throw f;
  }
}
var Zu = {};
Object.defineProperty(Zu, "__esModule", { value: !0 });
Zu.parseDn = Xb;
function Xb(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const s = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && s.set(r, n);
      break;
    }
    const o = e[a];
    if (t) {
      if (o === '"') {
        t = !1;
        continue;
      }
    } else {
      if (o === '"') {
        t = !0;
        continue;
      }
      if (o === "\\") {
        a++;
        const c = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(c) ? n += e[a] : (a++, n += String.fromCharCode(c));
        continue;
      }
      if (r === null && o === "=") {
        r = n, n = "";
        continue;
      }
      if (o === "," || o === ";" || o === "+") {
        r !== null && s.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (o === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let c = a;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += o;
  }
  return s;
}
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.nil = Vi.UUID = void 0;
const l0 = sa, u0 = Wi, Jb = "options.name must be either a string or a Buffer", yp = (0, l0.randomBytes)(16);
yp[0] = yp[0] | 1;
const Eo = {}, ye = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Eo[t] = e, ye[e] = t;
}
class Qn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Qn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return Qb(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Zb(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Eo[t[14] + t[15]] & 240) >> 4,
        variant: $p((Eo[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: $p((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, u0.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Eo[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Vi.UUID = Qn;
Qn.OID = Qn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function $p(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Rs;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Rs || (Rs = {}));
function Qb(e, t, r, n, i = Rs.ASCII) {
  const s = (0, l0.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, u0.newError)(Jb, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const o = s.digest();
  let c;
  switch (i) {
    case Rs.BINARY:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, c = o;
      break;
    case Rs.OBJECT:
      o[6] = o[6] & 15 | r, o[8] = o[8] & 63 | 128, c = new Qn(o);
      break;
    default:
      c = ye[o[0]] + ye[o[1]] + ye[o[2]] + ye[o[3]] + "-" + ye[o[4]] + ye[o[5]] + "-" + ye[o[6] & 15 | r] + ye[o[7]] + "-" + ye[o[8] & 63 | 128] + ye[o[9]] + "-" + ye[o[10]] + ye[o[11]] + ye[o[12]] + ye[o[13]] + ye[o[14]] + ye[o[15]];
      break;
  }
  return c;
}
function Zb(e) {
  return ye[e[0]] + ye[e[1]] + ye[e[2]] + ye[e[3]] + "-" + ye[e[4]] + ye[e[5]] + "-" + ye[e[6]] + ye[e[7]] + "-" + ye[e[8]] + ye[e[9]] + "-" + ye[e[10]] + ye[e[11]] + ye[e[12]] + ye[e[13]] + ye[e[14]] + ye[e[15]];
}
Vi.nil = new Qn("00000000-0000-0000-0000-000000000000");
var la = {}, f0 = {};
(function(e) {
  (function(t) {
    t.parser = function(E, y) {
      return new n(E, y);
    }, t.SAXParser = n, t.SAXStream = l, t.createStream = f, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(E, y) {
      if (!(this instanceof n))
        return new n(E, y);
      var j = this;
      s(j), j.q = j.c = "", j.bufferCheckPosition = t.MAX_BUFFER_LENGTH, j.opt = y || {}, j.opt.lowercase = j.opt.lowercase || j.opt.lowercasetags, j.looseCase = j.opt.lowercase ? "toLowerCase" : "toUpperCase", j.tags = [], j.closed = j.closedRoot = j.sawRoot = !1, j.tag = j.error = null, j.strict = !!E, j.noscript = !!(E || j.opt.noscript), j.state = I.BEGIN, j.strictEntities = j.opt.strictEntities, j.ENTITIES = j.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), j.attribList = [], j.opt.xmlns && (j.ns = Object.create(g)), j.opt.unquotedAttributeValues === void 0 && (j.opt.unquotedAttributeValues = !E), j.trackPosition = j.opt.position !== !1, j.trackPosition && (j.position = j.line = j.column = 0), B(j, "onready");
    }
    Object.create || (Object.create = function(E) {
      function y() {
      }
      y.prototype = E;
      var j = new y();
      return j;
    }), Object.keys || (Object.keys = function(E) {
      var y = [];
      for (var j in E) E.hasOwnProperty(j) && y.push(j);
      return y;
    });
    function i(E) {
      for (var y = Math.max(t.MAX_BUFFER_LENGTH, 10), j = 0, O = 0, Y = r.length; O < Y; O++) {
        var he = E[r[O]].length;
        if (he > y)
          switch (r[O]) {
            case "textNode":
              Q(E);
              break;
            case "cdata":
              G(E, "oncdata", E.cdata), E.cdata = "";
              break;
            case "script":
              G(E, "onscript", E.script), E.script = "";
              break;
            default:
              D(E, "Max buffer length exceeded: " + r[O]);
          }
        j = Math.max(j, he);
      }
      var $e = t.MAX_BUFFER_LENGTH - j;
      E.bufferCheckPosition = $e + E.position;
    }
    function s(E) {
      for (var y = 0, j = r.length; y < j; y++)
        E[r[y]] = "";
    }
    function a(E) {
      Q(E), E.cdata !== "" && (G(E, "oncdata", E.cdata), E.cdata = ""), E.script !== "" && (G(E, "onscript", E.script), E.script = "");
    }
    n.prototype = {
      end: function() {
        x(this);
      },
      write: A,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var o;
    try {
      o = require("stream").Stream;
    } catch {
      o = function() {
      };
    }
    o || (o = function() {
    });
    var c = t.EVENTS.filter(function(E) {
      return E !== "error" && E !== "end";
    });
    function f(E, y) {
      return new l(E, y);
    }
    function l(E, y) {
      if (!(this instanceof l))
        return new l(E, y);
      o.apply(this), this._parser = new n(E, y), this.writable = !0, this.readable = !0;
      var j = this;
      this._parser.onend = function() {
        j.emit("end");
      }, this._parser.onerror = function(O) {
        j.emit("error", O), j._parser.error = null;
      }, this._decoder = null, c.forEach(function(O) {
        Object.defineProperty(j, "on" + O, {
          get: function() {
            return j._parser["on" + O];
          },
          set: function(Y) {
            if (!Y)
              return j.removeAllListeners(O), j._parser["on" + O] = Y, Y;
            j.on(O, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    l.prototype = Object.create(o.prototype, {
      constructor: {
        value: l
      }
    }), l.prototype.write = function(E) {
      return typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(E) && (this._decoder || (this._decoder = new TextDecoder("utf8")), E = this._decoder.decode(E, { stream: !0 })), this._parser.write(E.toString()), this.emit("data", E), !0;
    }, l.prototype.end = function(E) {
      if (E && E.length && this.write(E), this._decoder) {
        var y = this._decoder.decode();
        y && (this._parser.write(y), this.emit("data", y));
      }
      return this._parser.end(), !0;
    }, l.prototype.on = function(E, y) {
      var j = this;
      return !j._parser["on" + E] && c.indexOf(E) !== -1 && (j._parser["on" + E] = function() {
        var O = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        O.splice(0, 0, E), j.emit.apply(j, O);
      }), o.prototype.on.call(j, E, y);
    };
    var u = "[CDATA[", h = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", _ = "http://www.w3.org/2000/xmlns/", g = { xml: p, xmlns: _ }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, w = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function C(E) {
      return E === " " || E === `
` || E === "\r" || E === "	";
    }
    function M(E) {
      return E === '"' || E === "'";
    }
    function z(E) {
      return E === ">" || C(E);
    }
    function K(E, y) {
      return E.test(y);
    }
    function pe(E, y) {
      return !K(E, y);
    }
    var I = 0;
    t.STATE = {
      BEGIN: I++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: I++,
      // leading whitespace
      TEXT: I++,
      // general stuff
      TEXT_ENTITY: I++,
      // &amp and such.
      OPEN_WAKA: I++,
      // <
      SGML_DECL: I++,
      // <!BLARG
      SGML_DECL_QUOTED: I++,
      // <!BLARG foo "bar
      DOCTYPE: I++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: I++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: I++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: I++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: I++,
      // <!-
      COMMENT: I++,
      // <!--
      COMMENT_ENDING: I++,
      // <!-- blah -
      COMMENT_ENDED: I++,
      // <!-- blah --
      CDATA: I++,
      // <![CDATA[ something
      CDATA_ENDING: I++,
      // ]
      CDATA_ENDING_2: I++,
      // ]]
      PROC_INST: I++,
      // <?hi
      PROC_INST_BODY: I++,
      // <?hi there
      PROC_INST_ENDING: I++,
      // <?hi "there" ?
      OPEN_TAG: I++,
      // <strong
      OPEN_TAG_SLASH: I++,
      // <strong /
      ATTRIB: I++,
      // <a
      ATTRIB_NAME: I++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: I++,
      // <a foo _
      ATTRIB_VALUE: I++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: I++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: I++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: I++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: I++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: I++,
      // <foo bar=&quot
      CLOSE_TAG: I++,
      // </a
      CLOSE_TAG_SAW_WHITE: I++,
      // </a   >
      SCRIPT: I++,
      // <script> ...
      SCRIPT_ENDING: I++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(E) {
      var y = t.ENTITIES[E], j = typeof y == "number" ? String.fromCharCode(y) : y;
      t.ENTITIES[E] = j;
    });
    for (var Z in t.STATE)
      t.STATE[t.STATE[Z]] = Z;
    I = t.STATE;
    function B(E, y, j) {
      E[y] && E[y](j);
    }
    function G(E, y, j) {
      E.textNode && Q(E), B(E, y, j);
    }
    function Q(E) {
      E.textNode = k(E.opt, E.textNode), E.textNode && B(E, "ontext", E.textNode), E.textNode = "";
    }
    function k(E, y) {
      return E.trim && (y = y.trim()), E.normalize && (y = y.replace(/\s+/g, " ")), y;
    }
    function D(E, y) {
      return Q(E), E.trackPosition && (y += `
Line: ` + E.line + `
Column: ` + E.column + `
Char: ` + E.c), y = new Error(y), E.error = y, B(E, "onerror", y), E;
    }
    function x(E) {
      return E.sawRoot && !E.closedRoot && L(E, "Unclosed root tag"), E.state !== I.BEGIN && E.state !== I.BEGIN_WHITESPACE && E.state !== I.TEXT && D(E, "Unexpected end"), Q(E), E.c = "", E.closed = !0, B(E, "onend"), n.call(E, E.strict, E.opt), E;
    }
    function L(E, y) {
      if (typeof E != "object" || !(E instanceof n))
        throw new Error("bad call to strictFail");
      E.strict && D(E, y);
    }
    function V(E) {
      E.strict || (E.tagName = E.tagName[E.looseCase]());
      var y = E.tags[E.tags.length - 1] || E, j = E.tag = { name: E.tagName, attributes: {} };
      E.opt.xmlns && (j.ns = y.ns), E.attribList.length = 0, G(E, "onopentagstart", j);
    }
    function U(E, y) {
      var j = E.indexOf(":"), O = j < 0 ? ["", E] : E.split(":"), Y = O[0], he = O[1];
      return y && E === "xmlns" && (Y = "xmlns", he = ""), { prefix: Y, local: he };
    }
    function R(E) {
      if (E.strict || (E.attribName = E.attribName[E.looseCase]()), E.attribList.indexOf(E.attribName) !== -1 || E.tag.attributes.hasOwnProperty(E.attribName)) {
        E.attribName = E.attribValue = "";
        return;
      }
      if (E.opt.xmlns) {
        var y = U(E.attribName, !0), j = y.prefix, O = y.local;
        if (j === "xmlns")
          if (O === "xml" && E.attribValue !== p)
            L(
              E,
              "xml: prefix must be bound to " + p + `
Actual: ` + E.attribValue
            );
          else if (O === "xmlns" && E.attribValue !== _)
            L(
              E,
              "xmlns: prefix must be bound to " + _ + `
Actual: ` + E.attribValue
            );
          else {
            var Y = E.tag, he = E.tags[E.tags.length - 1] || E;
            Y.ns === he.ns && (Y.ns = Object.create(he.ns)), Y.ns[O] = E.attribValue;
          }
        E.attribList.push([E.attribName, E.attribValue]);
      } else
        E.tag.attributes[E.attribName] = E.attribValue, G(E, "onattribute", {
          name: E.attribName,
          value: E.attribValue
        });
      E.attribName = E.attribValue = "";
    }
    function S(E, y) {
      if (E.opt.xmlns) {
        var j = E.tag, O = U(E.tagName);
        j.prefix = O.prefix, j.local = O.local, j.uri = j.ns[O.prefix] || "", j.prefix && !j.uri && (L(
          E,
          "Unbound namespace prefix: " + JSON.stringify(E.tagName)
        ), j.uri = O.prefix);
        var Y = E.tags[E.tags.length - 1] || E;
        j.ns && Y.ns !== j.ns && Object.keys(j.ns).forEach(function(Ut) {
          G(E, "onopennamespace", {
            prefix: Ut,
            uri: j.ns[Ut]
          });
        });
        for (var he = 0, $e = E.attribList.length; he < $e; he++) {
          var Te = E.attribList[he], Oe = Te[0], tt = Te[1], we = U(Oe, !0), xe = we.prefix, Ht = we.local, jt = xe === "" ? "" : j.ns[xe] || "", It = {
            name: Oe,
            value: tt,
            prefix: xe,
            local: Ht,
            uri: jt
          };
          xe && xe !== "xmlns" && !jt && (L(
            E,
            "Unbound namespace prefix: " + JSON.stringify(xe)
          ), It.uri = xe), E.tag.attributes[Oe] = It, G(E, "onattribute", It);
        }
        E.attribList.length = 0;
      }
      E.tag.isSelfClosing = !!y, E.sawRoot = !0, E.tags.push(E.tag), G(E, "onopentag", E.tag), y || (!E.noscript && E.tagName.toLowerCase() === "script" ? E.state = I.SCRIPT : E.state = I.TEXT, E.tag = null, E.tagName = ""), E.attribName = E.attribValue = "", E.attribList.length = 0;
    }
    function P(E) {
      if (!E.tagName) {
        L(E, "Weird empty close tag."), E.textNode += "</>", E.state = I.TEXT;
        return;
      }
      if (E.script) {
        if (E.tagName !== "script") {
          E.script += "</" + E.tagName + ">", E.tagName = "", E.state = I.SCRIPT;
          return;
        }
        G(E, "onscript", E.script), E.script = "";
      }
      var y = E.tags.length, j = E.tagName;
      E.strict || (j = j[E.looseCase]());
      for (var O = j; y--; ) {
        var Y = E.tags[y];
        if (Y.name !== O)
          L(E, "Unexpected close tag");
        else
          break;
      }
      if (y < 0) {
        L(E, "Unmatched closing tag: " + E.tagName), E.textNode += "</" + E.tagName + ">", E.state = I.TEXT;
        return;
      }
      E.tagName = j;
      for (var he = E.tags.length; he-- > y; ) {
        var $e = E.tag = E.tags.pop();
        E.tagName = E.tag.name, G(E, "onclosetag", E.tagName);
        var Te = {};
        for (var Oe in $e.ns)
          Te[Oe] = $e.ns[Oe];
        var tt = E.tags[E.tags.length - 1] || E;
        E.opt.xmlns && $e.ns !== tt.ns && Object.keys($e.ns).forEach(function(we) {
          var xe = $e.ns[we];
          G(E, "onclosenamespace", { prefix: we, uri: xe });
        });
      }
      y === 0 && (E.closedRoot = !0), E.tagName = E.attribValue = E.attribName = "", E.attribList.length = 0, E.state = I.TEXT;
    }
    function b(E) {
      var y = E.entity, j = y.toLowerCase(), O, Y = "";
      return E.ENTITIES[y] ? E.ENTITIES[y] : E.ENTITIES[j] ? E.ENTITIES[j] : (y = j, y.charAt(0) === "#" && (y.charAt(1) === "x" ? (y = y.slice(2), O = parseInt(y, 16), Y = O.toString(16)) : (y = y.slice(1), O = parseInt(y, 10), Y = O.toString(10))), y = y.replace(/^0+/, ""), isNaN(O) || Y.toLowerCase() !== y || O < 0 || O > 1114111 ? (L(E, "Invalid character entity"), "&" + E.entity + ";") : String.fromCodePoint(O));
    }
    function d(E, y) {
      y === "<" ? (E.state = I.OPEN_WAKA, E.startTagPosition = E.position) : C(y) || (L(E, "Non-whitespace before first tag."), E.textNode = y, E.state = I.TEXT);
    }
    function $(E, y) {
      var j = "";
      return y < E.length && (j = E.charAt(y)), j;
    }
    function A(E) {
      var y = this;
      if (this.error)
        throw this.error;
      if (y.closed)
        return D(
          y,
          "Cannot write after close. Assign an onready handler."
        );
      if (E === null)
        return x(y);
      typeof E == "object" && (E = E.toString());
      for (var j = 0, O = ""; O = $(E, j++), y.c = O, !!O; )
        switch (y.trackPosition && (y.position++, O === `
` ? (y.line++, y.column = 0) : y.column++), y.state) {
          case I.BEGIN:
            if (y.state = I.BEGIN_WHITESPACE, O === "\uFEFF")
              continue;
            d(y, O);
            continue;
          case I.BEGIN_WHITESPACE:
            d(y, O);
            continue;
          case I.TEXT:
            if (y.sawRoot && !y.closedRoot) {
              for (var he = j - 1; O && O !== "<" && O !== "&"; )
                O = $(E, j++), O && y.trackPosition && (y.position++, O === `
` ? (y.line++, y.column = 0) : y.column++);
              y.textNode += E.substring(he, j - 1);
            }
            O === "<" && !(y.sawRoot && y.closedRoot && !y.strict) ? (y.state = I.OPEN_WAKA, y.startTagPosition = y.position) : (!C(O) && (!y.sawRoot || y.closedRoot) && L(y, "Text data outside of root node."), O === "&" ? y.state = I.TEXT_ENTITY : y.textNode += O);
            continue;
          case I.SCRIPT:
            O === "<" ? y.state = I.SCRIPT_ENDING : y.script += O;
            continue;
          case I.SCRIPT_ENDING:
            O === "/" ? y.state = I.CLOSE_TAG : (y.script += "<" + O, y.state = I.SCRIPT);
            continue;
          case I.OPEN_WAKA:
            if (O === "!")
              y.state = I.SGML_DECL, y.sgmlDecl = "";
            else if (!C(O)) if (K(v, O))
              y.state = I.OPEN_TAG, y.tagName = O;
            else if (O === "/")
              y.state = I.CLOSE_TAG, y.tagName = "";
            else if (O === "?")
              y.state = I.PROC_INST, y.procInstName = y.procInstBody = "";
            else {
              if (L(y, "Unencoded <"), y.startTagPosition + 1 < y.position) {
                var Y = y.position - y.startTagPosition;
                O = new Array(Y).join(" ") + O;
              }
              y.textNode += "<" + O, y.state = I.TEXT;
            }
            continue;
          case I.SGML_DECL:
            if (y.sgmlDecl + O === "--") {
              y.state = I.COMMENT, y.comment = "", y.sgmlDecl = "";
              continue;
            }
            y.doctype && y.doctype !== !0 && y.sgmlDecl ? (y.state = I.DOCTYPE_DTD, y.doctype += "<!" + y.sgmlDecl + O, y.sgmlDecl = "") : (y.sgmlDecl + O).toUpperCase() === u ? (G(y, "onopencdata"), y.state = I.CDATA, y.sgmlDecl = "", y.cdata = "") : (y.sgmlDecl + O).toUpperCase() === h ? (y.state = I.DOCTYPE, (y.doctype || y.sawRoot) && L(
              y,
              "Inappropriately located doctype declaration"
            ), y.doctype = "", y.sgmlDecl = "") : O === ">" ? (G(y, "onsgmldeclaration", y.sgmlDecl), y.sgmlDecl = "", y.state = I.TEXT) : (M(O) && (y.state = I.SGML_DECL_QUOTED), y.sgmlDecl += O);
            continue;
          case I.SGML_DECL_QUOTED:
            O === y.q && (y.state = I.SGML_DECL, y.q = ""), y.sgmlDecl += O;
            continue;
          case I.DOCTYPE:
            O === ">" ? (y.state = I.TEXT, G(y, "ondoctype", y.doctype), y.doctype = !0) : (y.doctype += O, O === "[" ? y.state = I.DOCTYPE_DTD : M(O) && (y.state = I.DOCTYPE_QUOTED, y.q = O));
            continue;
          case I.DOCTYPE_QUOTED:
            y.doctype += O, O === y.q && (y.q = "", y.state = I.DOCTYPE);
            continue;
          case I.DOCTYPE_DTD:
            O === "]" ? (y.doctype += O, y.state = I.DOCTYPE) : O === "<" ? (y.state = I.OPEN_WAKA, y.startTagPosition = y.position) : M(O) ? (y.doctype += O, y.state = I.DOCTYPE_DTD_QUOTED, y.q = O) : y.doctype += O;
            continue;
          case I.DOCTYPE_DTD_QUOTED:
            y.doctype += O, O === y.q && (y.state = I.DOCTYPE_DTD, y.q = "");
            continue;
          case I.COMMENT:
            O === "-" ? y.state = I.COMMENT_ENDING : y.comment += O;
            continue;
          case I.COMMENT_ENDING:
            O === "-" ? (y.state = I.COMMENT_ENDED, y.comment = k(y.opt, y.comment), y.comment && G(y, "oncomment", y.comment), y.comment = "") : (y.comment += "-" + O, y.state = I.COMMENT);
            continue;
          case I.COMMENT_ENDED:
            O !== ">" ? (L(y, "Malformed comment"), y.comment += "--" + O, y.state = I.COMMENT) : y.doctype && y.doctype !== !0 ? y.state = I.DOCTYPE_DTD : y.state = I.TEXT;
            continue;
          case I.CDATA:
            for (var he = j - 1; O && O !== "]"; )
              O = $(E, j++), O && y.trackPosition && (y.position++, O === `
` ? (y.line++, y.column = 0) : y.column++);
            y.cdata += E.substring(he, j - 1), O === "]" && (y.state = I.CDATA_ENDING);
            continue;
          case I.CDATA_ENDING:
            O === "]" ? y.state = I.CDATA_ENDING_2 : (y.cdata += "]" + O, y.state = I.CDATA);
            continue;
          case I.CDATA_ENDING_2:
            O === ">" ? (y.cdata && G(y, "oncdata", y.cdata), G(y, "onclosecdata"), y.cdata = "", y.state = I.TEXT) : O === "]" ? y.cdata += "]" : (y.cdata += "]]" + O, y.state = I.CDATA);
            continue;
          case I.PROC_INST:
            O === "?" ? y.state = I.PROC_INST_ENDING : C(O) ? y.state = I.PROC_INST_BODY : y.procInstName += O;
            continue;
          case I.PROC_INST_BODY:
            if (!y.procInstBody && C(O))
              continue;
            O === "?" ? y.state = I.PROC_INST_ENDING : y.procInstBody += O;
            continue;
          case I.PROC_INST_ENDING:
            O === ">" ? (G(y, "onprocessinginstruction", {
              name: y.procInstName,
              body: y.procInstBody
            }), y.procInstName = y.procInstBody = "", y.state = I.TEXT) : (y.procInstBody += "?" + O, y.state = I.PROC_INST_BODY);
            continue;
          case I.OPEN_TAG:
            K(m, O) ? y.tagName += O : (V(y), O === ">" ? S(y) : O === "/" ? y.state = I.OPEN_TAG_SLASH : (C(O) || L(y, "Invalid character in tag name"), y.state = I.ATTRIB));
            continue;
          case I.OPEN_TAG_SLASH:
            O === ">" ? (S(y, !0), P(y)) : (L(
              y,
              "Forward-slash in opening tag not followed by >"
            ), y.state = I.ATTRIB);
            continue;
          case I.ATTRIB:
            if (C(O))
              continue;
            O === ">" ? S(y) : O === "/" ? y.state = I.OPEN_TAG_SLASH : K(v, O) ? (y.attribName = O, y.attribValue = "", y.state = I.ATTRIB_NAME) : L(y, "Invalid attribute name");
            continue;
          case I.ATTRIB_NAME:
            O === "=" ? y.state = I.ATTRIB_VALUE : O === ">" ? (L(y, "Attribute without value"), y.attribValue = y.attribName, R(y), S(y)) : C(O) ? y.state = I.ATTRIB_NAME_SAW_WHITE : K(m, O) ? y.attribName += O : L(y, "Invalid attribute name");
            continue;
          case I.ATTRIB_NAME_SAW_WHITE:
            if (O === "=")
              y.state = I.ATTRIB_VALUE;
            else {
              if (C(O))
                continue;
              L(y, "Attribute without value"), y.tag.attributes[y.attribName] = "", y.attribValue = "", G(y, "onattribute", {
                name: y.attribName,
                value: ""
              }), y.attribName = "", O === ">" ? S(y) : K(v, O) ? (y.attribName = O, y.state = I.ATTRIB_NAME) : (L(y, "Invalid attribute name"), y.state = I.ATTRIB);
            }
            continue;
          case I.ATTRIB_VALUE:
            if (C(O))
              continue;
            M(O) ? (y.q = O, y.state = I.ATTRIB_VALUE_QUOTED) : (y.opt.unquotedAttributeValues || D(y, "Unquoted attribute value"), y.state = I.ATTRIB_VALUE_UNQUOTED, y.attribValue = O);
            continue;
          case I.ATTRIB_VALUE_QUOTED:
            if (O !== y.q) {
              O === "&" ? y.state = I.ATTRIB_VALUE_ENTITY_Q : y.attribValue += O;
              continue;
            }
            R(y), y.q = "", y.state = I.ATTRIB_VALUE_CLOSED;
            continue;
          case I.ATTRIB_VALUE_CLOSED:
            C(O) ? y.state = I.ATTRIB : O === ">" ? S(y) : O === "/" ? y.state = I.OPEN_TAG_SLASH : K(v, O) ? (L(y, "No whitespace between attributes"), y.attribName = O, y.attribValue = "", y.state = I.ATTRIB_NAME) : L(y, "Invalid attribute name");
            continue;
          case I.ATTRIB_VALUE_UNQUOTED:
            if (!z(O)) {
              O === "&" ? y.state = I.ATTRIB_VALUE_ENTITY_U : y.attribValue += O;
              continue;
            }
            R(y), O === ">" ? S(y) : y.state = I.ATTRIB;
            continue;
          case I.CLOSE_TAG:
            if (y.tagName)
              O === ">" ? P(y) : K(m, O) ? y.tagName += O : y.script ? (y.script += "</" + y.tagName + O, y.tagName = "", y.state = I.SCRIPT) : (C(O) || L(y, "Invalid tagname in closing tag"), y.state = I.CLOSE_TAG_SAW_WHITE);
            else {
              if (C(O))
                continue;
              pe(v, O) ? y.script ? (y.script += "</" + O, y.state = I.SCRIPT) : L(y, "Invalid tagname in closing tag.") : y.tagName = O;
            }
            continue;
          case I.CLOSE_TAG_SAW_WHITE:
            if (C(O))
              continue;
            O === ">" ? P(y) : L(y, "Invalid characters in closing tag");
            continue;
          case I.TEXT_ENTITY:
          case I.ATTRIB_VALUE_ENTITY_Q:
          case I.ATTRIB_VALUE_ENTITY_U:
            var $e, Te;
            switch (y.state) {
              case I.TEXT_ENTITY:
                $e = I.TEXT, Te = "textNode";
                break;
              case I.ATTRIB_VALUE_ENTITY_Q:
                $e = I.ATTRIB_VALUE_QUOTED, Te = "attribValue";
                break;
              case I.ATTRIB_VALUE_ENTITY_U:
                $e = I.ATTRIB_VALUE_UNQUOTED, Te = "attribValue";
                break;
            }
            if (O === ";") {
              var Oe = b(y);
              y.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Oe) ? (y.entity = "", y.state = $e, y.write(Oe)) : (y[Te] += Oe, y.entity = "", y.state = $e);
            } else K(y.entity.length ? N : w, O) ? y.entity += O : (L(y, "Invalid character in entity name"), y[Te] += "&" + y.entity + O, y.entity = "", y.state = $e);
            continue;
          default:
            throw new Error(y, "Unknown state: " + y.state);
        }
      return y.position >= y.bufferCheckPosition && i(y), y;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var E = String.fromCharCode, y = Math.floor, j = function() {
        var O = 16384, Y = [], he, $e, Te = -1, Oe = arguments.length;
        if (!Oe)
          return "";
        for (var tt = ""; ++Te < Oe; ) {
          var we = Number(arguments[Te]);
          if (!isFinite(we) || // `NaN`, `+Infinity`, or `-Infinity`
          we < 0 || // not a valid Unicode code point
          we > 1114111 || // not a valid Unicode code point
          y(we) !== we)
            throw RangeError("Invalid code point: " + we);
          we <= 65535 ? Y.push(we) : (we -= 65536, he = (we >> 10) + 55296, $e = we % 1024 + 56320, Y.push(he, $e)), (Te + 1 === Oe || Y.length > O) && (tt += E.apply(null, Y), Y.length = 0);
        }
        return tt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: j,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = j;
    }();
  })(e);
})(f0);
Object.defineProperty(la, "__esModule", { value: !0 });
la.XElement = void 0;
la.parseXml = nP;
const eP = f0, La = Wi;
class d0 {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, La.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!rP(t))
      throw (0, La.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, La.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, La.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (vp(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => vp(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
la.XElement = d0;
const tP = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function rP(e) {
  return tP.test(e);
}
function vp(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function nP(e) {
  let t = null;
  const r = eP.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new d0(i.name);
    if (s.attributes = i.attributes, t === null)
      t = s;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(s);
    }
    n.push(s);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const s = n[n.length - 1];
    s.value = i, s.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = u;
  var t = vn;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Wi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = yt;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = cc;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var s = oa;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return s.ProgressCallbackTransform;
  } });
  var a = ca;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var o = Qu;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return o.retry;
  } });
  var c = Zu;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var f = Vi;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return f.UUID;
  } });
  var l = la;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(Be);
var et = {}, ef = {}, ar = {};
function h0(e) {
  return typeof e > "u" || e === null;
}
function iP(e) {
  return typeof e == "object" && e !== null;
}
function sP(e) {
  return Array.isArray(e) ? e : h0(e) ? [] : [e];
}
function aP(e, t) {
  var r, n, i, s;
  if (t)
    for (s = Object.keys(t), r = 0, n = s.length; r < n; r += 1)
      i = s[r], e[i] = t[i];
  return e;
}
function oP(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function cP(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
ar.isNothing = h0;
ar.isObject = iP;
ar.toArray = sP;
ar.repeat = oP;
ar.isNegativeZero = cP;
ar.extend = aP;
function p0(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function zs(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = p0(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
zs.prototype = Object.create(Error.prototype);
zs.prototype.constructor = zs;
zs.prototype.toString = function(t) {
  return this.name + ": " + p0(this, t);
};
var ua = zs, ws = ar;
function al(e, t, r, n, i) {
  var s = "", a = "", o = Math.floor(i / 2) - 1;
  return n - t > o && (s = " ... ", t = n - o + s.length), r - n > o && (a = " ...", r = n + o - a.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + s.length
    // relative position
  };
}
function ol(e, t) {
  return ws.repeat(" ", t - e.length) + e;
}
function lP(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], s, a = -1; s = r.exec(e.buffer); )
    i.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var o = "", c, f, l = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(a - c < 0); c++)
    f = al(
      e.buffer,
      n[a - c],
      i[a - c],
      e.position - (n[a] - n[a - c]),
      u
    ), o = ws.repeat(" ", t.indent) + ol((e.line - c + 1).toString(), l) + " | " + f.str + `
` + o;
  for (f = al(e.buffer, n[a], i[a], e.position, u), o += ws.repeat(" ", t.indent) + ol((e.line + 1).toString(), l) + " | " + f.str + `
`, o += ws.repeat("-", t.indent + l + 3 + f.pos) + `^
`, c = 1; c <= t.linesAfter && !(a + c >= i.length); c++)
    f = al(
      e.buffer,
      n[a + c],
      i[a + c],
      e.position - (n[a] - n[a + c]),
      u
    ), o += ws.repeat(" ", t.indent) + ol((e.line + c + 1).toString(), l) + " | " + f.str + `
`;
  return o.replace(/\n$/, "");
}
var uP = lP, _p = ua, fP = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], dP = [
  "scalar",
  "sequence",
  "mapping"
];
function hP(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function pP(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (fP.indexOf(r) === -1)
      throw new _p('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = hP(t.styleAliases || null), dP.indexOf(this.kind) === -1)
    throw new _p('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Et = pP, ds = ua, cl = Et;
function Ep(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(s, a) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function mP() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function lu(e) {
  return this.extend(e);
}
lu.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof cl)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new ds("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof cl))
      throw new ds("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new ds("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new ds("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof cl))
      throw new ds("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(lu.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Ep(i, "implicit"), i.compiledExplicit = Ep(i, "explicit"), i.compiledTypeMap = mP(i.compiledImplicit, i.compiledExplicit), i;
};
var m0 = lu, gP = Et, g0 = new gP("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), yP = Et, y0 = new yP("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), $P = Et, $0 = new $P("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), vP = m0, v0 = new vP({
  explicit: [
    g0,
    y0,
    $0
  ]
}), _P = Et;
function EP(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function wP() {
  return null;
}
function SP(e) {
  return e === null;
}
var _0 = new _P("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: EP,
  construct: wP,
  predicate: SP,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), bP = Et;
function PP(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function TP(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function NP(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var E0 = new bP("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: PP,
  construct: TP,
  predicate: NP,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), AP = ar, RP = Et;
function OP(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function IP(e) {
  return 48 <= e && e <= 55;
}
function CP(e) {
  return 48 <= e && e <= 57;
}
function DP(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!OP(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!IP(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!CP(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function kP(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function FP(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !AP.isNegativeZero(e);
}
var w0 = new RP("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: DP,
  construct: kP,
  predicate: FP,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), S0 = ar, LP = Et, jP = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function UP(e) {
  return !(e === null || !jP.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function MP(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var xP = /^[-+]?[0-9]+e/;
function VP(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (S0.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), xP.test(r) ? r.replace("e", ".e") : r;
}
function qP(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || S0.isNegativeZero(e));
}
var b0 = new LP("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: UP,
  construct: MP,
  predicate: qP,
  represent: VP,
  defaultStyle: "lowercase"
}), P0 = v0.extend({
  implicit: [
    _0,
    E0,
    w0,
    b0
  ]
}), T0 = P0, BP = Et, N0 = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), A0 = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function GP(e) {
  return e === null ? !1 : N0.exec(e) !== null || A0.exec(e) !== null;
}
function HP(e) {
  var t, r, n, i, s, a, o, c = 0, f = null, l, u, h;
  if (t = N0.exec(e), t === null && (t = A0.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (s = +t[4], a = +t[5], o = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], u = +(t[11] || 0), f = (l * 60 + u) * 6e4, t[9] === "-" && (f = -f)), h = new Date(Date.UTC(r, n, i, s, a, o, c)), f && h.setTime(h.getTime() - f), h;
}
function zP(e) {
  return e.toISOString();
}
var R0 = new BP("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: GP,
  construct: HP,
  instanceOf: Date,
  represent: zP
}), KP = Et;
function WP(e) {
  return e === "<<" || e === null;
}
var O0 = new KP("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: WP
}), YP = Et, tf = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function XP(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, s = tf;
  for (r = 0; r < i; r++)
    if (t = s.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function JP(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, s = tf, a = 0, o = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)), a = a << 6 | s.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)) : r === 18 ? (o.push(a >> 10 & 255), o.push(a >> 2 & 255)) : r === 12 && o.push(a >> 4 & 255), new Uint8Array(o);
}
function QP(e) {
  var t = "", r = 0, n, i, s = e.length, a = tf;
  for (n = 0; n < s; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = s % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function ZP(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var I0 = new YP("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: XP,
  construct: JP,
  predicate: ZP,
  represent: QP
}), e1 = Et, t1 = Object.prototype.hasOwnProperty, r1 = Object.prototype.toString;
function n1(e) {
  if (e === null) return !0;
  var t = [], r, n, i, s, a, o = e;
  for (r = 0, n = o.length; r < n; r += 1) {
    if (i = o[r], a = !1, r1.call(i) !== "[object Object]") return !1;
    for (s in i)
      if (t1.call(i, s))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(s) === -1) t.push(s);
    else return !1;
  }
  return !0;
}
function i1(e) {
  return e !== null ? e : [];
}
var C0 = new e1("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: n1,
  construct: i1
}), s1 = Et, a1 = Object.prototype.toString;
function o1(e) {
  if (e === null) return !0;
  var t, r, n, i, s, a = e;
  for (s = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], a1.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    s[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function c1(e) {
  if (e === null) return [];
  var t, r, n, i, s, a = e;
  for (s = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), s[t] = [i[0], n[i[0]]];
  return s;
}
var D0 = new s1("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: o1,
  construct: c1
}), l1 = Et, u1 = Object.prototype.hasOwnProperty;
function f1(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (u1.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function d1(e) {
  return e !== null ? e : {};
}
var k0 = new l1("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: f1,
  construct: d1
}), rf = T0.extend({
  implicit: [
    R0,
    O0
  ],
  explicit: [
    I0,
    C0,
    D0,
    k0
  ]
}), Un = ar, F0 = ua, h1 = uP, p1 = rf, _n = Object.prototype.hasOwnProperty, jo = 1, L0 = 2, j0 = 3, Uo = 4, ll = 1, m1 = 2, wp = 3, g1 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, y1 = /[\x85\u2028\u2029]/, $1 = /[,\[\]\{\}]/, U0 = /^(?:!|!!|![a-z\-]+!)$/i, M0 = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Sp(e) {
  return Object.prototype.toString.call(e);
}
function Er(e) {
  return e === 10 || e === 13;
}
function Xn(e) {
  return e === 9 || e === 32;
}
function Ot(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Si(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function v1(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function _1(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function E1(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function bp(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function w1(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function x0(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var V0 = new Array(256), q0 = new Array(256);
for (var li = 0; li < 256; li++)
  V0[li] = bp(li) ? 1 : 0, q0[li] = bp(li);
function S1(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || p1, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function B0(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = h1(r), new F0(t, r);
}
function re(e, t) {
  throw B0(e, t);
}
function Mo(e, t) {
  e.onWarning && e.onWarning.call(null, B0(e, t));
}
var Pp = {
  YAML: function(t, r, n) {
    var i, s, a;
    t.version !== null && re(t, "duplication of %YAML directive"), n.length !== 1 && re(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && re(t, "ill-formed argument of the YAML directive"), s = parseInt(i[1], 10), a = parseInt(i[2], 10), s !== 1 && re(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Mo(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, s;
    n.length !== 2 && re(t, "TAG directive accepts exactly two arguments"), i = n[0], s = n[1], U0.test(i) || re(t, "ill-formed tag handle (first argument) of the TAG directive"), _n.call(t.tagMap, i) && re(t, 'there is a previously declared suffix for "' + i + '" tag handle'), M0.test(s) || re(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      s = decodeURIComponent(s);
    } catch {
      re(t, "tag prefix is malformed: " + s);
    }
    t.tagMap[i] = s;
  }
};
function mn(e, t, r, n) {
  var i, s, a, o;
  if (t < r) {
    if (o = e.input.slice(t, r), n)
      for (i = 0, s = o.length; i < s; i += 1)
        a = o.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || re(e, "expected valid JSON character");
    else g1.test(o) && re(e, "the stream contains non-printable characters");
    e.result += o;
  }
}
function Tp(e, t, r, n) {
  var i, s, a, o;
  for (Un.isObject(r) || re(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, o = i.length; a < o; a += 1)
    s = i[a], _n.call(t, s) || (x0(t, s, r[s]), n[s] = !0);
}
function bi(e, t, r, n, i, s, a, o, c) {
  var f, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), f = 0, l = i.length; f < l; f += 1)
      Array.isArray(i[f]) && re(e, "nested arrays are not supported inside keys"), typeof i == "object" && Sp(i[f]) === "[object Object]" && (i[f] = "[object Object]");
  if (typeof i == "object" && Sp(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s))
      for (f = 0, l = s.length; f < l; f += 1)
        Tp(e, t, s[f], r);
    else
      Tp(e, t, s, r);
  else
    !e.json && !_n.call(r, i) && _n.call(t, i) && (e.line = a || e.line, e.lineStart = o || e.lineStart, e.position = c || e.position, re(e, "duplicated mapping key")), x0(t, i, s), delete r[i];
  return t;
}
function nf(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : re(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Ue(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Xn(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Er(i))
      for (nf(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Mo(e, "deficient indentation"), n;
}
function lc(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ot(r)));
}
function sf(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Un.repeat(`
`, t - 1));
}
function b1(e, t, r) {
  var n, i, s, a, o, c, f, l, u = e.kind, h = e.result, p;
  if (p = e.input.charCodeAt(e.position), Ot(p) || Si(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), Ot(i) || r && Si(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", s = a = e.position, o = !1; p !== 0; ) {
    if (p === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ot(i) || r && Si(i))
        break;
    } else if (p === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ot(n))
        break;
    } else {
      if (e.position === e.lineStart && lc(e) || r && Si(p))
        break;
      if (Er(p))
        if (c = e.line, f = e.lineStart, l = e.lineIndent, Ue(e, !1, -1), e.lineIndent >= t) {
          o = !0, p = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = c, e.lineStart = f, e.lineIndent = l;
          break;
        }
    }
    o && (mn(e, s, a, !1), sf(e, e.line - c), s = a = e.position, o = !1), Xn(p) || (a = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return mn(e, s, a, !1), e.result ? !0 : (e.kind = u, e.result = h, !1);
}
function P1(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (mn(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Er(r) ? (mn(e, n, i, !0), sf(e, Ue(e, !1, t)), n = i = e.position) : e.position === e.lineStart && lc(e) ? re(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  re(e, "unexpected end of the stream within a single quoted scalar");
}
function T1(e, t) {
  var r, n, i, s, a, o;
  if (o = e.input.charCodeAt(e.position), o !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (o = e.input.charCodeAt(e.position)) !== 0; ) {
    if (o === 34)
      return mn(e, r, e.position, !0), e.position++, !0;
    if (o === 92) {
      if (mn(e, r, e.position, !0), o = e.input.charCodeAt(++e.position), Er(o))
        Ue(e, !1, t);
      else if (o < 256 && V0[o])
        e.result += q0[o], e.position++;
      else if ((a = _1(o)) > 0) {
        for (i = a, s = 0; i > 0; i--)
          o = e.input.charCodeAt(++e.position), (a = v1(o)) >= 0 ? s = (s << 4) + a : re(e, "expected hexadecimal character");
        e.result += w1(s), e.position++;
      } else
        re(e, "unknown escape sequence");
      r = n = e.position;
    } else Er(o) ? (mn(e, r, n, !0), sf(e, Ue(e, !1, t)), r = n = e.position) : e.position === e.lineStart && lc(e) ? re(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  re(e, "unexpected end of the stream within a double quoted scalar");
}
function N1(e, t) {
  var r = !0, n, i, s, a = e.tag, o, c = e.anchor, f, l, u, h, p, _ = /* @__PURE__ */ Object.create(null), g, v, m, w;
  if (w = e.input.charCodeAt(e.position), w === 91)
    l = 93, p = !1, o = [];
  else if (w === 123)
    l = 125, p = !0, o = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), w = e.input.charCodeAt(++e.position); w !== 0; ) {
    if (Ue(e, !0, t), w = e.input.charCodeAt(e.position), w === l)
      return e.position++, e.tag = a, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = o, !0;
    r ? w === 44 && re(e, "expected the node content, but found ','") : re(e, "missed comma between flow collection entries"), v = g = m = null, u = h = !1, w === 63 && (f = e.input.charCodeAt(e.position + 1), Ot(f) && (u = h = !0, e.position++, Ue(e, !0, t))), n = e.line, i = e.lineStart, s = e.position, qi(e, t, jo, !1, !0), v = e.tag, g = e.result, Ue(e, !0, t), w = e.input.charCodeAt(e.position), (h || e.line === n) && w === 58 && (u = !0, w = e.input.charCodeAt(++e.position), Ue(e, !0, t), qi(e, t, jo, !1, !0), m = e.result), p ? bi(e, o, _, v, g, m, n, i, s) : u ? o.push(bi(e, null, _, v, g, m, n, i, s)) : o.push(g), Ue(e, !0, t), w = e.input.charCodeAt(e.position), w === 44 ? (r = !0, w = e.input.charCodeAt(++e.position)) : r = !1;
  }
  re(e, "unexpected end of the stream within a flow collection");
}
function A1(e, t) {
  var r, n, i = ll, s = !1, a = !1, o = t, c = 0, f = !1, l, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    n = !1;
  else if (u === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      ll === i ? i = u === 43 ? wp : m1 : re(e, "repeat of a chomping mode identifier");
    else if ((l = E1(u)) >= 0)
      l === 0 ? re(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? re(e, "repeat of an indentation width identifier") : (o = t + l - 1, a = !0);
    else
      break;
  if (Xn(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Xn(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!Er(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (nf(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!a || e.lineIndent < o) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > o && (o = e.lineIndent), Er(u)) {
      c++;
      continue;
    }
    if (e.lineIndent < o) {
      i === wp ? e.result += Un.repeat(`
`, s ? 1 + c : c) : i === ll && s && (e.result += `
`);
      break;
    }
    for (n ? Xn(u) ? (f = !0, e.result += Un.repeat(`
`, s ? 1 + c : c)) : f ? (f = !1, e.result += Un.repeat(`
`, c + 1)) : c === 0 ? s && (e.result += " ") : e.result += Un.repeat(`
`, c) : e.result += Un.repeat(`
`, s ? 1 + c : c), s = !0, a = !0, c = 0, r = e.position; !Er(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    mn(e, r, e.position, !1);
  }
  return !0;
}
function Np(e, t) {
  var r, n = e.tag, i = e.anchor, s = [], a, o = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, re(e, "tab characters must not be used in indentation")), !(c !== 45 || (a = e.input.charCodeAt(e.position + 1), !Ot(a)))); ) {
    if (o = !0, e.position++, Ue(e, !0, -1) && e.lineIndent <= t) {
      s.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, qi(e, t, j0, !1, !0), s.push(e.result), Ue(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      re(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return o ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = s, !0) : !1;
}
function R1(e, t, r) {
  var n, i, s, a, o, c, f = e.tag, l = e.anchor, u = {}, h = /* @__PURE__ */ Object.create(null), p = null, _ = null, g = null, v = !1, m = !1, w;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), w = e.input.charCodeAt(e.position); w !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, re(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), s = e.line, (w === 63 || w === 58) && Ot(n))
      w === 63 ? (v && (bi(e, u, h, p, _, null, a, o, c), p = _ = g = null), m = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : re(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, w = n;
    else {
      if (a = e.line, o = e.lineStart, c = e.position, !qi(e, r, L0, !1, !0))
        break;
      if (e.line === s) {
        for (w = e.input.charCodeAt(e.position); Xn(w); )
          w = e.input.charCodeAt(++e.position);
        if (w === 58)
          w = e.input.charCodeAt(++e.position), Ot(w) || re(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (bi(e, u, h, p, _, null, a, o, c), p = _ = g = null), m = !0, v = !1, i = !1, p = e.tag, _ = e.result;
        else if (m)
          re(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = f, e.anchor = l, !0;
      } else if (m)
        re(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = f, e.anchor = l, !0;
    }
    if ((e.line === s || e.lineIndent > t) && (v && (a = e.line, o = e.lineStart, c = e.position), qi(e, t, Uo, !0, i) && (v ? _ = e.result : g = e.result), v || (bi(e, u, h, p, _, g, a, o, c), p = _ = g = null), Ue(e, !0, -1), w = e.input.charCodeAt(e.position)), (e.line === s || e.lineIndent > t) && w !== 0)
      re(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && bi(e, u, h, p, _, null, a, o, c), m && (e.tag = f, e.anchor = l, e.kind = "mapping", e.result = u), m;
}
function O1(e) {
  var t, r = !1, n = !1, i, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && re(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (s = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : re(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Ot(a); )
      a === 33 && (n ? re(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), U0.test(i) || re(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    s = e.input.slice(t, e.position), $1.test(s) && re(e, "tag suffix cannot contain flow indicator characters");
  }
  s && !M0.test(s) && re(e, "tag name cannot contain such characters: " + s);
  try {
    s = decodeURIComponent(s);
  } catch {
    re(e, "tag name is malformed: " + s);
  }
  return r ? e.tag = s : _n.call(e.tagMap, i) ? e.tag = e.tagMap[i] + s : i === "!" ? e.tag = "!" + s : i === "!!" ? e.tag = "tag:yaml.org,2002:" + s : re(e, 'undeclared tag handle "' + i + '"'), !0;
}
function I1(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && re(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ot(r) && !Si(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && re(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function C1(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ot(n) && !Si(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && re(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), _n.call(e.anchorMap, r) || re(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Ue(e, !0, -1), !0;
}
function qi(e, t, r, n, i) {
  var s, a, o, c = 1, f = !1, l = !1, u, h, p, _, g, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, s = a = o = Uo === r || j0 === r, n && Ue(e, !0, -1) && (f = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; O1(e) || I1(e); )
      Ue(e, !0, -1) ? (f = !0, o = s, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : o = !1;
  if (o && (o = f || i), (c === 1 || Uo === r) && (jo === r || L0 === r ? g = t : g = t + 1, v = e.position - e.lineStart, c === 1 ? o && (Np(e, v) || R1(e, v, g)) || N1(e, g) ? l = !0 : (a && A1(e, g) || P1(e, g) || T1(e, g) ? l = !0 : C1(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && re(e, "alias node should not have any properties")) : b1(e, g, jo === r) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = o && Np(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && re(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, h = e.implicitTypes.length; u < h; u += 1)
      if (_ = e.implicitTypes[u], _.resolve(e.result)) {
        e.result = _.construct(e.result), e.tag = _.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (_n.call(e.typeMap[e.kind || "fallback"], e.tag))
      _ = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (_ = null, p = e.typeMap.multi[e.kind || "fallback"], u = 0, h = p.length; u < h; u += 1)
        if (e.tag.slice(0, p[u].tag.length) === p[u].tag) {
          _ = p[u];
          break;
        }
    _ || re(e, "unknown tag !<" + e.tag + ">"), e.result !== null && _.kind !== e.kind && re(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + _.kind + '", not "' + e.kind + '"'), _.resolve(e.result, e.tag) ? (e.result = _.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : re(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || l;
}
function D1(e) {
  var t = e.position, r, n, i, s = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (Ue(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (s = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !Ot(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && re(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Xn(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Er(a));
        break;
      }
      if (Er(a)) break;
      for (r = e.position; a !== 0 && !Ot(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && nf(e), _n.call(Pp, n) ? Pp[n](e, n, i) : Mo(e, 'unknown document directive "' + n + '"');
  }
  if (Ue(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Ue(e, !0, -1)) : s && re(e, "directives end mark is expected"), qi(e, e.lineIndent - 1, Uo, !1, !0), Ue(e, !0, -1), e.checkLineBreaks && y1.test(e.input.slice(t, e.position)) && Mo(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && lc(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Ue(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    re(e, "end of the stream or a document separator is expected");
  else
    return;
}
function G0(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new S1(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, re(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    D1(r);
  return r.documents;
}
function k1(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = G0(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function F1(e, t) {
  var r = G0(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new F0("expected a single document in the stream, but found more");
  }
}
ef.loadAll = k1;
ef.load = F1;
var H0 = {}, uc = ar, fa = ua, L1 = rf, z0 = Object.prototype.toString, K0 = Object.prototype.hasOwnProperty, af = 65279, j1 = 9, Ks = 10, U1 = 13, M1 = 32, x1 = 33, V1 = 34, uu = 35, q1 = 37, B1 = 38, G1 = 39, H1 = 42, W0 = 44, z1 = 45, xo = 58, K1 = 61, W1 = 62, Y1 = 63, X1 = 64, Y0 = 91, X0 = 93, J1 = 96, J0 = 123, Q1 = 124, Q0 = 125, ut = {};
ut[0] = "\\0";
ut[7] = "\\a";
ut[8] = "\\b";
ut[9] = "\\t";
ut[10] = "\\n";
ut[11] = "\\v";
ut[12] = "\\f";
ut[13] = "\\r";
ut[27] = "\\e";
ut[34] = '\\"';
ut[92] = "\\\\";
ut[133] = "\\N";
ut[160] = "\\_";
ut[8232] = "\\L";
ut[8233] = "\\P";
var Z1 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], eT = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function tT(e, t) {
  var r, n, i, s, a, o, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, s = n.length; i < s; i += 1)
    a = n[i], o = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), c = e.compiledTypeMap.fallback[a], c && K0.call(c.styleAliases, o) && (o = c.styleAliases[o]), r[a] = o;
  return r;
}
function rT(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new fa("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + uc.repeat("0", n - t.length) + t;
}
var nT = 1, Ws = 2;
function iT(e) {
  this.schema = e.schema || L1, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = uc.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = tT(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Ws : nT, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ap(e, t) {
  for (var r = uc.repeat(" ", t), n = 0, i = -1, s = "", a, o = e.length; n < o; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = o) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (s += r), s += a;
  return s;
}
function fu(e, t) {
  return `
` + uc.repeat(" ", e.indent * t);
}
function sT(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Vo(e) {
  return e === M1 || e === j1;
}
function Ys(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== af || 65536 <= e && e <= 1114111;
}
function Rp(e) {
  return Ys(e) && e !== af && e !== U1 && e !== Ks;
}
function Op(e, t, r) {
  var n = Rp(e), i = n && !Vo(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== W0 && e !== Y0 && e !== X0 && e !== J0 && e !== Q0) && e !== uu && !(t === xo && !i) || Rp(t) && !Vo(t) && e === uu || t === xo && i
  );
}
function aT(e) {
  return Ys(e) && e !== af && !Vo(e) && e !== z1 && e !== Y1 && e !== xo && e !== W0 && e !== Y0 && e !== X0 && e !== J0 && e !== Q0 && e !== uu && e !== B1 && e !== H1 && e !== x1 && e !== Q1 && e !== K1 && e !== W1 && e !== G1 && e !== V1 && e !== q1 && e !== X1 && e !== J1;
}
function oT(e) {
  return !Vo(e) && e !== xo;
}
function Ss(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Z0(e) {
  var t = /^\n* /;
  return t.test(e);
}
var e$ = 1, du = 2, t$ = 3, r$ = 4, $i = 5;
function cT(e, t, r, n, i, s, a, o) {
  var c, f = 0, l = null, u = !1, h = !1, p = n !== -1, _ = -1, g = aT(Ss(e, 0)) && oT(Ss(e, e.length - 1));
  if (t || a)
    for (c = 0; c < e.length; f >= 65536 ? c += 2 : c++) {
      if (f = Ss(e, c), !Ys(f))
        return $i;
      g = g && Op(f, l, o), l = f;
    }
  else {
    for (c = 0; c < e.length; f >= 65536 ? c += 2 : c++) {
      if (f = Ss(e, c), f === Ks)
        u = !0, p && (h = h || // Foldable line = too long, and not more-indented.
        c - _ - 1 > n && e[_ + 1] !== " ", _ = c);
      else if (!Ys(f))
        return $i;
      g = g && Op(f, l, o), l = f;
    }
    h = h || p && c - _ - 1 > n && e[_ + 1] !== " ";
  }
  return !u && !h ? g && !a && !i(e) ? e$ : s === Ws ? $i : du : r > 9 && Z0(e) ? $i : a ? s === Ws ? $i : du : h ? r$ : t$;
}
function lT(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Ws ? '""' : "''";
    if (!e.noCompatMode && (Z1.indexOf(t) !== -1 || eT.test(t)))
      return e.quotingType === Ws ? '"' + t + '"' : "'" + t + "'";
    var s = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), o = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(f) {
      return sT(e, f);
    }
    switch (cT(
      t,
      o,
      e.indent,
      a,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case e$:
        return t;
      case du:
        return "'" + t.replace(/'/g, "''") + "'";
      case t$:
        return "|" + Ip(t, e.indent) + Cp(Ap(t, s));
      case r$:
        return ">" + Ip(t, e.indent) + Cp(Ap(uT(t, a), s));
      case $i:
        return '"' + fT(t) + '"';
      default:
        throw new fa("impossible error: invalid scalar style");
    }
  }();
}
function Ip(e, t) {
  var r = Z0(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), s = i ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function Cp(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function uT(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var f = e.indexOf(`
`);
    return f = f !== -1 ? f : e.length, r.lastIndex = f, Dp(e.slice(0, f), t);
  }(), i = e[0] === `
` || e[0] === " ", s, a; a = r.exec(e); ) {
    var o = a[1], c = a[2];
    s = c[0] === " ", n += o + (!i && !s && c !== "" ? `
` : "") + Dp(c, t), i = s;
  }
  return n;
}
function Dp(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, s, a = 0, o = 0, c = ""; n = r.exec(e); )
    o = n.index, o - i > t && (s = a > i ? a : o, c += `
` + e.slice(i, s), i = s + 1), a = o;
  return c += `
`, e.length - i > t && a > i ? c += e.slice(i, a) + `
` + e.slice(a + 1) : c += e.slice(i), c.slice(1);
}
function fT(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Ss(e, i), n = ut[r], !n && Ys(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || rT(r);
  return t;
}
function dT(e, t, r) {
  var n = "", i = e.tag, s, a, o;
  for (s = 0, a = r.length; s < a; s += 1)
    o = r[s], e.replacer && (o = e.replacer.call(r, String(s), o)), (Mr(e, t, o, !1, !1) || typeof o > "u" && Mr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function kp(e, t, r, n) {
  var i = "", s = e.tag, a, o, c;
  for (a = 0, o = r.length; a < o; a += 1)
    c = r[a], e.replacer && (c = e.replacer.call(r, String(a), c)), (Mr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Mr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += fu(e, t)), e.dump && Ks === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = s, e.dump = i || "[]";
}
function hT(e, t, r) {
  var n = "", i = e.tag, s = Object.keys(r), a, o, c, f, l;
  for (a = 0, o = s.length; a < o; a += 1)
    l = "", n !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = s[a], f = r[c], e.replacer && (f = e.replacer.call(r, c, f)), Mr(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Mr(e, t, f, !1, !1) && (l += e.dump, n += l));
  e.tag = i, e.dump = "{" + n + "}";
}
function pT(e, t, r, n) {
  var i = "", s = e.tag, a = Object.keys(r), o, c, f, l, u, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new fa("sortKeys must be a boolean or a function");
  for (o = 0, c = a.length; o < c; o += 1)
    h = "", (!n || i !== "") && (h += fu(e, t)), f = a[o], l = r[f], e.replacer && (l = e.replacer.call(r, f, l)), Mr(e, t + 1, f, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Ks === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, u && (h += fu(e, t)), Mr(e, t + 1, l, !0, u) && (e.dump && Ks === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = s, e.dump = i || "{}";
}
function Fp(e, t, r) {
  var n, i, s, a, o, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, s = 0, a = i.length; s < a; s += 1)
    if (o = i[s], (o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        if (c = e.styleMap[o.tag] || o.defaultStyle, z0.call(o.represent) === "[object Function]")
          n = o.represent(t, c);
        else if (K0.call(o.represent, c))
          n = o.represent[c](t, c);
        else
          throw new fa("!<" + o.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function Mr(e, t, r, n, i, s, a) {
  e.tag = null, e.dump = r, Fp(e, r, !1) || Fp(e, r, !0);
  var o = z0.call(e.dump), c = n, f;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var l = o === "[object Object]" || o === "[object Array]", u, h;
  if (l && (u = e.duplicates.indexOf(r), h = u !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (l && h && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), o === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (pT(e, t, e.dump, i), h && (e.dump = "&ref_" + u + e.dump)) : (hT(e, t, e.dump), h && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? kp(e, t - 1, e.dump, i) : kp(e, t, e.dump, i), h && (e.dump = "&ref_" + u + e.dump)) : (dT(e, t, e.dump), h && (e.dump = "&ref_" + u + " " + e.dump));
    else if (o === "[object String]")
      e.tag !== "?" && lT(e, e.dump, t, s, c);
    else {
      if (o === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new fa("unacceptable kind of an object to dump " + o);
    }
    e.tag !== null && e.tag !== "?" && (f = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? f = "!" + f : f.slice(0, 18) === "tag:yaml.org,2002:" ? f = "!!" + f.slice(18) : f = "!<" + f + ">", e.dump = f + " " + e.dump);
  }
  return !0;
}
function mT(e, t) {
  var r = [], n = [], i, s;
  for (hu(e, r, n), i = 0, s = n.length; i < s; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(s);
}
function hu(e, t, r) {
  var n, i, s;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, s = e.length; i < s; i += 1)
        hu(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, s = n.length; i < s; i += 1)
        hu(e[n[i]], t, r);
}
function gT(e, t) {
  t = t || {};
  var r = new iT(t);
  r.noRefs || mT(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), Mr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
H0.dump = gT;
var n$ = ef, yT = H0;
function of(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
et.Type = Et;
et.Schema = m0;
et.FAILSAFE_SCHEMA = v0;
et.JSON_SCHEMA = P0;
et.CORE_SCHEMA = T0;
et.DEFAULT_SCHEMA = rf;
et.load = n$.load;
et.loadAll = n$.loadAll;
et.dump = yT.dump;
et.YAMLException = ua;
et.types = {
  binary: I0,
  float: b0,
  map: $0,
  null: _0,
  pairs: D0,
  set: k0,
  timestamp: R0,
  bool: E0,
  int: w0,
  merge: O0,
  omap: C0,
  seq: y0,
  str: g0
};
et.safeLoad = of("safeLoad", "load");
et.safeLoadAll = of("safeLoadAll", "loadAll");
et.safeDump = of("safeDump", "dump");
var fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
fc.Lazy = void 0;
class $T {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
fc.Lazy = $T;
var pu = { exports: {} };
const vT = "2.0.0", i$ = 256, _T = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, ET = 16, wT = i$ - 6, ST = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var dc = {
  MAX_LENGTH: i$,
  MAX_SAFE_COMPONENT_LENGTH: ET,
  MAX_SAFE_BUILD_LENGTH: wT,
  MAX_SAFE_INTEGER: _T,
  RELEASE_TYPES: ST,
  SEMVER_SPEC_VERSION: vT,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const bT = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var hc = bT;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = dc, s = hc;
  t = e.exports = {};
  const a = t.re = [], o = t.safeRe = [], c = t.src = [], f = t.safeSrc = [], l = t.t = {};
  let u = 0;
  const h = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", i],
    [h, n]
  ], _ = (v) => {
    for (const [m, w] of p)
      v = v.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return v;
  }, g = (v, m, w) => {
    const N = _(m), C = u++;
    s(v, C, m), l[v] = C, c[C] = m, f[C] = N, a[C] = new RegExp(m, w ? "g" : void 0), o[C] = new RegExp(N, w ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), g("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${h}+`), g("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), g("FULL", `^${c[l.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), g("LOOSE", `^${c[l.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), g("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", c[l.COERCE], !0), g("COERCERTLFULL", c[l.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(pu, pu.exports);
var da = pu.exports;
const PT = Object.freeze({ loose: !0 }), TT = Object.freeze({}), NT = (e) => e ? typeof e != "object" ? PT : e : TT;
var cf = NT;
const Lp = /^[0-9]+$/, s$ = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Lp.test(e), n = Lp.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, AT = (e, t) => s$(t, e);
var a$ = {
  compareIdentifiers: s$,
  rcompareIdentifiers: AT
};
const ja = hc, { MAX_LENGTH: jp, MAX_SAFE_INTEGER: Ua } = dc, { safeRe: Ma, t: xa } = da, RT = cf, { compareIdentifiers: ul } = a$;
let OT = class hr {
  constructor(t, r) {
    if (r = RT(r), t instanceof hr) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > jp)
      throw new TypeError(
        `version is longer than ${jp} characters`
      );
    ja("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ma[xa.LOOSE] : Ma[xa.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ua || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ua || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ua || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < Ua)
          return s;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (ja("SemVer.compare", this.version, this.options, t), !(t instanceof hr)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new hr(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof hr || (t = new hr(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof hr || (t = new hr(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (ja("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return ul(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof hr || (t = new hr(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (ja("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return ul(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Ma[xa.PRERELEASELOOSE] : Ma[xa.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let s = [r, i];
          n === !1 && (s = [r]), ul(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var wt = OT;
const Up = wt, IT = (e, t, r = !1) => {
  if (e instanceof Up)
    return e;
  try {
    return new Up(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Yi = IT;
const CT = Yi, DT = (e, t) => {
  const r = CT(e, t);
  return r ? r.version : null;
};
var kT = DT;
const FT = Yi, LT = (e, t) => {
  const r = FT(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var jT = LT;
const Mp = wt, UT = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Mp(
      e instanceof Mp ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var MT = UT;
const xp = Yi, xT = (e, t) => {
  const r = xp(e, null, !0), n = xp(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, a = s ? r : n, o = s ? n : r, c = !!a.prerelease.length;
  if (!!o.prerelease.length && !c) {
    if (!o.patch && !o.minor)
      return "major";
    if (o.compareMain(a) === 0)
      return o.minor && !o.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var VT = xT;
const qT = wt, BT = (e, t) => new qT(e, t).major;
var GT = BT;
const HT = wt, zT = (e, t) => new HT(e, t).minor;
var KT = zT;
const WT = wt, YT = (e, t) => new WT(e, t).patch;
var XT = YT;
const JT = Yi, QT = (e, t) => {
  const r = JT(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var ZT = QT;
const Vp = wt, eN = (e, t, r) => new Vp(e, r).compare(new Vp(t, r));
var or = eN;
const tN = or, rN = (e, t, r) => tN(t, e, r);
var nN = rN;
const iN = or, sN = (e, t) => iN(e, t, !0);
var aN = sN;
const qp = wt, oN = (e, t, r) => {
  const n = new qp(e, r), i = new qp(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var lf = oN;
const cN = lf, lN = (e, t) => e.sort((r, n) => cN(r, n, t));
var uN = lN;
const fN = lf, dN = (e, t) => e.sort((r, n) => fN(n, r, t));
var hN = dN;
const pN = or, mN = (e, t, r) => pN(e, t, r) > 0;
var pc = mN;
const gN = or, yN = (e, t, r) => gN(e, t, r) < 0;
var uf = yN;
const $N = or, vN = (e, t, r) => $N(e, t, r) === 0;
var o$ = vN;
const _N = or, EN = (e, t, r) => _N(e, t, r) !== 0;
var c$ = EN;
const wN = or, SN = (e, t, r) => wN(e, t, r) >= 0;
var ff = SN;
const bN = or, PN = (e, t, r) => bN(e, t, r) <= 0;
var df = PN;
const TN = o$, NN = c$, AN = pc, RN = ff, ON = uf, IN = df, CN = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return TN(e, r, n);
    case "!=":
      return NN(e, r, n);
    case ">":
      return AN(e, r, n);
    case ">=":
      return RN(e, r, n);
    case "<":
      return ON(e, r, n);
    case "<=":
      return IN(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var l$ = CN;
const DN = wt, kN = Yi, { safeRe: Va, t: qa } = da, FN = (e, t) => {
  if (e instanceof DN)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Va[qa.COERCEFULL] : Va[qa.COERCE]);
  else {
    const c = t.includePrerelease ? Va[qa.COERCERTLFULL] : Va[qa.COERCERTL];
    let f;
    for (; (f = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || f.index + f[0].length !== r.index + r[0].length) && (r = f), c.lastIndex = f.index + f[1].length + f[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return kN(`${n}.${i}.${s}${a}${o}`, t);
};
var LN = FN;
let jN = class {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
};
var UN = jN, fl, Bp;
function cr() {
  if (Bp) return fl;
  Bp = 1;
  const e = /\s+/g;
  class t {
    constructor(D, x) {
      if (x = i(x), D instanceof t)
        return D.loose === !!x.loose && D.includePrerelease === !!x.includePrerelease ? D : new t(D.raw, x);
      if (D instanceof s)
        return this.raw = D.value, this.set = [[D]], this.formatted = void 0, this;
      if (this.options = x, this.loose = !!x.loose, this.includePrerelease = !!x.includePrerelease, this.raw = D.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((V) => !g(V[0])), this.set.length === 0)
          this.set = [L];
        else if (this.set.length > 1) {
          for (const V of this.set)
            if (V.length === 1 && v(V[0])) {
              this.set = [V];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let D = 0; D < this.set.length; D++) {
          D > 0 && (this.formatted += "||");
          const x = this.set[D];
          for (let L = 0; L < x.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += x[L].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(D) {
      const L = ((this.options.includePrerelease && p) | (this.options.loose && _)) + ":" + D, V = n.get(L);
      if (V)
        return V;
      const U = this.options.loose, R = U ? c[f.HYPHENRANGELOOSE] : c[f.HYPHENRANGE];
      D = D.replace(R, G(this.options.includePrerelease)), a("hyphen replace", D), D = D.replace(c[f.COMPARATORTRIM], l), a("comparator trim", D), D = D.replace(c[f.TILDETRIM], u), a("tilde trim", D), D = D.replace(c[f.CARETTRIM], h), a("caret trim", D);
      let S = D.split(" ").map(($) => w($, this.options)).join(" ").split(/\s+/).map(($) => B($, this.options));
      U && (S = S.filter(($) => (a("loose invalid filter", $, this.options), !!$.match(c[f.COMPARATORLOOSE])))), a("range list", S);
      const P = /* @__PURE__ */ new Map(), b = S.map(($) => new s($, this.options));
      for (const $ of b) {
        if (g($))
          return [$];
        P.set($.value, $);
      }
      P.size > 1 && P.has("") && P.delete("");
      const d = [...P.values()];
      return n.set(L, d), d;
    }
    intersects(D, x) {
      if (!(D instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => m(L, x) && D.set.some((V) => m(V, x) && L.every((U) => V.every((R) => U.intersects(R, x)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(D) {
      if (!D)
        return !1;
      if (typeof D == "string")
        try {
          D = new o(D, this.options);
        } catch {
          return !1;
        }
      for (let x = 0; x < this.set.length; x++)
        if (Q(this.set[x], D, this.options))
          return !0;
      return !1;
    }
  }
  fl = t;
  const r = UN, n = new r(), i = cf, s = mc(), a = hc, o = wt, {
    safeRe: c,
    t: f,
    comparatorTrimReplace: l,
    tildeTrimReplace: u,
    caretTrimReplace: h
  } = da, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: _ } = dc, g = (k) => k.value === "<0.0.0-0", v = (k) => k.value === "", m = (k, D) => {
    let x = !0;
    const L = k.slice();
    let V = L.pop();
    for (; x && L.length; )
      x = L.every((U) => V.intersects(U, D)), V = L.pop();
    return x;
  }, w = (k, D) => (k = k.replace(c[f.BUILD], ""), a("comp", k, D), k = z(k, D), a("caret", k), k = C(k, D), a("tildes", k), k = pe(k, D), a("xrange", k), k = Z(k, D), a("stars", k), k), N = (k) => !k || k.toLowerCase() === "x" || k === "*", C = (k, D) => k.trim().split(/\s+/).map((x) => M(x, D)).join(" "), M = (k, D) => {
    const x = D.loose ? c[f.TILDELOOSE] : c[f.TILDE];
    return k.replace(x, (L, V, U, R, S) => {
      a("tilde", k, L, V, U, R, S);
      let P;
      return N(V) ? P = "" : N(U) ? P = `>=${V}.0.0 <${+V + 1}.0.0-0` : N(R) ? P = `>=${V}.${U}.0 <${V}.${+U + 1}.0-0` : S ? (a("replaceTilde pr", S), P = `>=${V}.${U}.${R}-${S} <${V}.${+U + 1}.0-0`) : P = `>=${V}.${U}.${R} <${V}.${+U + 1}.0-0`, a("tilde return", P), P;
    });
  }, z = (k, D) => k.trim().split(/\s+/).map((x) => K(x, D)).join(" "), K = (k, D) => {
    a("caret", k, D);
    const x = D.loose ? c[f.CARETLOOSE] : c[f.CARET], L = D.includePrerelease ? "-0" : "";
    return k.replace(x, (V, U, R, S, P) => {
      a("caret", k, V, U, R, S, P);
      let b;
      return N(U) ? b = "" : N(R) ? b = `>=${U}.0.0${L} <${+U + 1}.0.0-0` : N(S) ? U === "0" ? b = `>=${U}.${R}.0${L} <${U}.${+R + 1}.0-0` : b = `>=${U}.${R}.0${L} <${+U + 1}.0.0-0` : P ? (a("replaceCaret pr", P), U === "0" ? R === "0" ? b = `>=${U}.${R}.${S}-${P} <${U}.${R}.${+S + 1}-0` : b = `>=${U}.${R}.${S}-${P} <${U}.${+R + 1}.0-0` : b = `>=${U}.${R}.${S}-${P} <${+U + 1}.0.0-0`) : (a("no pr"), U === "0" ? R === "0" ? b = `>=${U}.${R}.${S}${L} <${U}.${R}.${+S + 1}-0` : b = `>=${U}.${R}.${S}${L} <${U}.${+R + 1}.0-0` : b = `>=${U}.${R}.${S} <${+U + 1}.0.0-0`), a("caret return", b), b;
    });
  }, pe = (k, D) => (a("replaceXRanges", k, D), k.split(/\s+/).map((x) => I(x, D)).join(" ")), I = (k, D) => {
    k = k.trim();
    const x = D.loose ? c[f.XRANGELOOSE] : c[f.XRANGE];
    return k.replace(x, (L, V, U, R, S, P) => {
      a("xRange", k, L, V, U, R, S, P);
      const b = N(U), d = b || N(R), $ = d || N(S), A = $;
      return V === "=" && A && (V = ""), P = D.includePrerelease ? "-0" : "", b ? V === ">" || V === "<" ? L = "<0.0.0-0" : L = "*" : V && A ? (d && (R = 0), S = 0, V === ">" ? (V = ">=", d ? (U = +U + 1, R = 0, S = 0) : (R = +R + 1, S = 0)) : V === "<=" && (V = "<", d ? U = +U + 1 : R = +R + 1), V === "<" && (P = "-0"), L = `${V + U}.${R}.${S}${P}`) : d ? L = `>=${U}.0.0${P} <${+U + 1}.0.0-0` : $ && (L = `>=${U}.${R}.0${P} <${U}.${+R + 1}.0-0`), a("xRange return", L), L;
    });
  }, Z = (k, D) => (a("replaceStars", k, D), k.trim().replace(c[f.STAR], "")), B = (k, D) => (a("replaceGTE0", k, D), k.trim().replace(c[D.includePrerelease ? f.GTE0PRE : f.GTE0], "")), G = (k) => (D, x, L, V, U, R, S, P, b, d, $, A) => (N(L) ? x = "" : N(V) ? x = `>=${L}.0.0${k ? "-0" : ""}` : N(U) ? x = `>=${L}.${V}.0${k ? "-0" : ""}` : R ? x = `>=${x}` : x = `>=${x}${k ? "-0" : ""}`, N(b) ? P = "" : N(d) ? P = `<${+b + 1}.0.0-0` : N($) ? P = `<${b}.${+d + 1}.0-0` : A ? P = `<=${b}.${d}.${$}-${A}` : k ? P = `<${b}.${d}.${+$ + 1}-0` : P = `<=${P}`, `${x} ${P}`.trim()), Q = (k, D, x) => {
    for (let L = 0; L < k.length; L++)
      if (!k[L].test(D))
        return !1;
    if (D.prerelease.length && !x.includePrerelease) {
      for (let L = 0; L < k.length; L++)
        if (a(k[L].semver), k[L].semver !== s.ANY && k[L].semver.prerelease.length > 0) {
          const V = k[L].semver;
          if (V.major === D.major && V.minor === D.minor && V.patch === D.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return fl;
}
var dl, Gp;
function mc() {
  if (Gp) return dl;
  Gp = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, u) {
      if (u = r(u), l instanceof t) {
        if (l.loose === !!u.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, u), this.options = u, this.loose = !!u.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const u = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = l.match(u);
      if (!h)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new o(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new o(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, u) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, u).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, u).test(l.semver) : (u = r(u), u.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !u.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, u) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, u) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  dl = t;
  const r = cf, { safeRe: n, t: i } = da, s = l$, a = hc, o = wt, c = cr();
  return dl;
}
const MN = cr(), xN = (e, t, r) => {
  try {
    t = new MN(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var gc = xN;
const VN = cr(), qN = (e, t) => new VN(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var BN = qN;
const GN = wt, HN = cr(), zN = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new HN(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new GN(n, r));
  }), n;
};
var KN = zN;
const WN = wt, YN = cr(), XN = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new YN(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new WN(n, r));
  }), n;
};
var JN = XN;
const hl = wt, QN = cr(), Hp = pc, ZN = (e, t) => {
  e = new QN(e, t);
  let r = new hl("0.0.0");
  if (e.test(r) || (r = new hl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((a) => {
      const o = new hl(a.semver.version);
      switch (a.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!s || Hp(o, s)) && (s = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), s && (!r || Hp(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var eA = ZN;
const tA = cr(), rA = (e, t) => {
  try {
    return new tA(e, t).range || "*";
  } catch {
    return null;
  }
};
var nA = rA;
const iA = wt, u$ = mc(), { ANY: sA } = u$, aA = cr(), oA = gc, zp = pc, Kp = uf, cA = df, lA = ff, uA = (e, t, r, n) => {
  e = new iA(e, n), t = new aA(t, n);
  let i, s, a, o, c;
  switch (r) {
    case ">":
      i = zp, s = cA, a = Kp, o = ">", c = ">=";
      break;
    case "<":
      i = Kp, s = lA, a = zp, o = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (oA(e, t, n))
    return !1;
  for (let f = 0; f < t.set.length; ++f) {
    const l = t.set[f];
    let u = null, h = null;
    if (l.forEach((p) => {
      p.semver === sA && (p = new u$(">=0.0.0")), u = u || p, h = h || p, i(p.semver, u.semver, n) ? u = p : a(p.semver, h.semver, n) && (h = p);
    }), u.operator === o || u.operator === c || (!h.operator || h.operator === o) && s(e, h.semver))
      return !1;
    if (h.operator === c && a(e, h.semver))
      return !1;
  }
  return !0;
};
var hf = uA;
const fA = hf, dA = (e, t, r) => fA(e, t, ">", r);
var hA = dA;
const pA = hf, mA = (e, t, r) => pA(e, t, "<", r);
var gA = mA;
const Wp = cr(), yA = (e, t, r) => (e = new Wp(e, r), t = new Wp(t, r), e.intersects(t, r));
var $A = yA;
const vA = gc, _A = or;
var EA = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const a = e.sort((l, u) => _A(l, u, r));
  for (const l of a)
    vA(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [l, u] of n)
    l === u ? o.push(l) : !u && l === a[0] ? o.push("*") : u ? l === a[0] ? o.push(`<=${u}`) : o.push(`${l} - ${u}`) : o.push(`>=${l}`);
  const c = o.join(" || "), f = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < f.length ? c : t;
};
const Yp = cr(), pf = mc(), { ANY: pl } = pf, hs = gc, mf = or, wA = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Yp(e, r), t = new Yp(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const a = bA(i, s, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, SA = [new pf(">=0.0.0-0")], Xp = [new pf(">=0.0.0")], bA = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === pl) {
    if (t.length === 1 && t[0].semver === pl)
      return !0;
    r.includePrerelease ? e = SA : e = Xp;
  }
  if (t.length === 1 && t[0].semver === pl) {
    if (r.includePrerelease)
      return !0;
    t = Xp;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = Jp(i, p, r) : p.operator === "<" || p.operator === "<=" ? s = Qp(s, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && s) {
    if (a = mf(i.semver, s.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (i && !hs(p, String(i), r) || s && !hs(p, String(s), r))
      return null;
    for (const _ of t)
      if (!hs(p, String(_), r))
        return !1;
    return !0;
  }
  let o, c, f, l, u = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && s.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const p of t) {
    if (l = l || p.operator === ">" || p.operator === ">=", f = f || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (o = Jp(i, p, r), o === p && o !== i)
          return !1;
      } else if (i.operator === ">=" && !hs(i.semver, String(p), r))
        return !1;
    }
    if (s) {
      if (u && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === u.major && p.semver.minor === u.minor && p.semver.patch === u.patch && (u = !1), p.operator === "<" || p.operator === "<=") {
        if (c = Qp(s, p, r), c === p && c !== s)
          return !1;
      } else if (s.operator === "<=" && !hs(s.semver, String(p), r))
        return !1;
    }
    if (!p.operator && (s || i) && a !== 0)
      return !1;
  }
  return !(i && f && !s && a !== 0 || s && l && !i && a !== 0 || h || u);
}, Jp = (e, t, r) => {
  if (!e)
    return t;
  const n = mf(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Qp = (e, t, r) => {
  if (!e)
    return t;
  const n = mf(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var PA = wA;
const ml = da, Zp = dc, TA = wt, em = a$, NA = Yi, AA = kT, RA = jT, OA = MT, IA = VT, CA = GT, DA = KT, kA = XT, FA = ZT, LA = or, jA = nN, UA = aN, MA = lf, xA = uN, VA = hN, qA = pc, BA = uf, GA = o$, HA = c$, zA = ff, KA = df, WA = l$, YA = LN, XA = mc(), JA = cr(), QA = gc, ZA = BN, eR = KN, tR = JN, rR = eA, nR = nA, iR = hf, sR = hA, aR = gA, oR = $A, cR = EA, lR = PA;
var f$ = {
  parse: NA,
  valid: AA,
  clean: RA,
  inc: OA,
  diff: IA,
  major: CA,
  minor: DA,
  patch: kA,
  prerelease: FA,
  compare: LA,
  rcompare: jA,
  compareLoose: UA,
  compareBuild: MA,
  sort: xA,
  rsort: VA,
  gt: qA,
  lt: BA,
  eq: GA,
  neq: HA,
  gte: zA,
  lte: KA,
  cmp: WA,
  coerce: YA,
  Comparator: XA,
  Range: JA,
  satisfies: QA,
  toComparators: ZA,
  maxSatisfying: eR,
  minSatisfying: tR,
  minVersion: rR,
  validRange: nR,
  outside: iR,
  gtr: sR,
  ltr: aR,
  intersects: oR,
  simplifyRange: cR,
  subset: lR,
  SemVer: TA,
  re: ml.re,
  src: ml.src,
  tokens: ml.t,
  SEMVER_SPEC_VERSION: Zp.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Zp.RELEASE_TYPES,
  compareIdentifiers: em.compareIdentifiers,
  rcompareIdentifiers: em.rcompareIdentifiers
}, ha = {}, qo = { exports: {} };
qo.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, a = 9007199254740991, o = "[object Arguments]", c = "[object Array]", f = "[object AsyncFunction]", l = "[object Boolean]", u = "[object Date]", h = "[object Error]", p = "[object Function]", _ = "[object GeneratorFunction]", g = "[object Map]", v = "[object Number]", m = "[object Null]", w = "[object Object]", N = "[object Promise]", C = "[object Proxy]", M = "[object RegExp]", z = "[object Set]", K = "[object String]", pe = "[object Symbol]", I = "[object Undefined]", Z = "[object WeakMap]", B = "[object ArrayBuffer]", G = "[object DataView]", Q = "[object Float32Array]", k = "[object Float64Array]", D = "[object Int8Array]", x = "[object Int16Array]", L = "[object Int32Array]", V = "[object Uint8Array]", U = "[object Uint8ClampedArray]", R = "[object Uint16Array]", S = "[object Uint32Array]", P = /[\\^$.*+?()[\]{}|]/g, b = /^\[object .+?Constructor\]$/, d = /^(?:0|[1-9]\d*)$/, $ = {};
  $[Q] = $[k] = $[D] = $[x] = $[L] = $[V] = $[U] = $[R] = $[S] = !0, $[o] = $[c] = $[B] = $[l] = $[G] = $[u] = $[h] = $[p] = $[g] = $[v] = $[w] = $[M] = $[z] = $[K] = $[Z] = !1;
  var A = typeof gt == "object" && gt && gt.Object === Object && gt, E = typeof self == "object" && self && self.Object === Object && self, y = A || E || Function("return this")(), j = t && !t.nodeType && t, O = j && !0 && e && !e.nodeType && e, Y = O && O.exports === j, he = Y && A.process, $e = function() {
    try {
      return he && he.binding && he.binding("util");
    } catch {
    }
  }(), Te = $e && $e.isTypedArray;
  function Oe(T, F) {
    for (var q = -1, J = T == null ? 0 : T.length, Ne = 0, le = []; ++q < J; ) {
      var Fe = T[q];
      F(Fe, q, T) && (le[Ne++] = Fe);
    }
    return le;
  }
  function tt(T, F) {
    for (var q = -1, J = F.length, Ne = T.length; ++q < J; )
      T[Ne + q] = F[q];
    return T;
  }
  function we(T, F) {
    for (var q = -1, J = T == null ? 0 : T.length; ++q < J; )
      if (F(T[q], q, T))
        return !0;
    return !1;
  }
  function xe(T, F) {
    for (var q = -1, J = Array(T); ++q < T; )
      J[q] = F(q);
    return J;
  }
  function Ht(T) {
    return function(F) {
      return T(F);
    };
  }
  function jt(T, F) {
    return T.has(F);
  }
  function It(T, F) {
    return T == null ? void 0 : T[F];
  }
  function Ut(T) {
    var F = -1, q = Array(T.size);
    return T.forEach(function(J, Ne) {
      q[++F] = [Ne, J];
    }), q;
  }
  function br(T, F) {
    return function(q) {
      return T(F(q));
    };
  }
  function Pr(T) {
    var F = -1, q = Array(T.size);
    return T.forEach(function(J) {
      q[++F] = J;
    }), q;
  }
  var Tr = Array.prototype, Ct = Function.prototype, Mt = Object.prototype, Nr = y["__core-js_shared__"], qr = Ct.toString, bt = Mt.hasOwnProperty, Sh = function() {
    var T = /[^.]+$/.exec(Nr && Nr.keys && Nr.keys.IE_PROTO || "");
    return T ? "Symbol(src)_1." + T : "";
  }(), bh = Mt.toString, j_ = RegExp(
    "^" + qr.call(bt).replace(P, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ph = Y ? y.Buffer : void 0, ba = y.Symbol, Th = y.Uint8Array, Nh = Mt.propertyIsEnumerable, U_ = Tr.splice, Nn = ba ? ba.toStringTag : void 0, Ah = Object.getOwnPropertySymbols, M_ = Ph ? Ph.isBuffer : void 0, x_ = br(Object.keys, Object), Hc = oi(y, "DataView"), os = oi(y, "Map"), zc = oi(y, "Promise"), Kc = oi(y, "Set"), Wc = oi(y, "WeakMap"), cs = oi(Object, "create"), V_ = On(Hc), q_ = On(os), B_ = On(zc), G_ = On(Kc), H_ = On(Wc), Rh = ba ? ba.prototype : void 0, Yc = Rh ? Rh.valueOf : void 0;
  function An(T) {
    var F = -1, q = T == null ? 0 : T.length;
    for (this.clear(); ++F < q; ) {
      var J = T[F];
      this.set(J[0], J[1]);
    }
  }
  function z_() {
    this.__data__ = cs ? cs(null) : {}, this.size = 0;
  }
  function K_(T) {
    var F = this.has(T) && delete this.__data__[T];
    return this.size -= F ? 1 : 0, F;
  }
  function W_(T) {
    var F = this.__data__;
    if (cs) {
      var q = F[T];
      return q === n ? void 0 : q;
    }
    return bt.call(F, T) ? F[T] : void 0;
  }
  function Y_(T) {
    var F = this.__data__;
    return cs ? F[T] !== void 0 : bt.call(F, T);
  }
  function X_(T, F) {
    var q = this.__data__;
    return this.size += this.has(T) ? 0 : 1, q[T] = cs && F === void 0 ? n : F, this;
  }
  An.prototype.clear = z_, An.prototype.delete = K_, An.prototype.get = W_, An.prototype.has = Y_, An.prototype.set = X_;
  function Ar(T) {
    var F = -1, q = T == null ? 0 : T.length;
    for (this.clear(); ++F < q; ) {
      var J = T[F];
      this.set(J[0], J[1]);
    }
  }
  function J_() {
    this.__data__ = [], this.size = 0;
  }
  function Q_(T) {
    var F = this.__data__, q = Ta(F, T);
    if (q < 0)
      return !1;
    var J = F.length - 1;
    return q == J ? F.pop() : U_.call(F, q, 1), --this.size, !0;
  }
  function Z_(T) {
    var F = this.__data__, q = Ta(F, T);
    return q < 0 ? void 0 : F[q][1];
  }
  function eE(T) {
    return Ta(this.__data__, T) > -1;
  }
  function tE(T, F) {
    var q = this.__data__, J = Ta(q, T);
    return J < 0 ? (++this.size, q.push([T, F])) : q[J][1] = F, this;
  }
  Ar.prototype.clear = J_, Ar.prototype.delete = Q_, Ar.prototype.get = Z_, Ar.prototype.has = eE, Ar.prototype.set = tE;
  function Rn(T) {
    var F = -1, q = T == null ? 0 : T.length;
    for (this.clear(); ++F < q; ) {
      var J = T[F];
      this.set(J[0], J[1]);
    }
  }
  function rE() {
    this.size = 0, this.__data__ = {
      hash: new An(),
      map: new (os || Ar)(),
      string: new An()
    };
  }
  function nE(T) {
    var F = Na(this, T).delete(T);
    return this.size -= F ? 1 : 0, F;
  }
  function iE(T) {
    return Na(this, T).get(T);
  }
  function sE(T) {
    return Na(this, T).has(T);
  }
  function aE(T, F) {
    var q = Na(this, T), J = q.size;
    return q.set(T, F), this.size += q.size == J ? 0 : 1, this;
  }
  Rn.prototype.clear = rE, Rn.prototype.delete = nE, Rn.prototype.get = iE, Rn.prototype.has = sE, Rn.prototype.set = aE;
  function Pa(T) {
    var F = -1, q = T == null ? 0 : T.length;
    for (this.__data__ = new Rn(); ++F < q; )
      this.add(T[F]);
  }
  function oE(T) {
    return this.__data__.set(T, n), this;
  }
  function cE(T) {
    return this.__data__.has(T);
  }
  Pa.prototype.add = Pa.prototype.push = oE, Pa.prototype.has = cE;
  function Br(T) {
    var F = this.__data__ = new Ar(T);
    this.size = F.size;
  }
  function lE() {
    this.__data__ = new Ar(), this.size = 0;
  }
  function uE(T) {
    var F = this.__data__, q = F.delete(T);
    return this.size = F.size, q;
  }
  function fE(T) {
    return this.__data__.get(T);
  }
  function dE(T) {
    return this.__data__.has(T);
  }
  function hE(T, F) {
    var q = this.__data__;
    if (q instanceof Ar) {
      var J = q.__data__;
      if (!os || J.length < r - 1)
        return J.push([T, F]), this.size = ++q.size, this;
      q = this.__data__ = new Rn(J);
    }
    return q.set(T, F), this.size = q.size, this;
  }
  Br.prototype.clear = lE, Br.prototype.delete = uE, Br.prototype.get = fE, Br.prototype.has = dE, Br.prototype.set = hE;
  function pE(T, F) {
    var q = Aa(T), J = !q && RE(T), Ne = !q && !J && Xc(T), le = !q && !J && !Ne && Uh(T), Fe = q || J || Ne || le, Ge = Fe ? xe(T.length, String) : [], Ke = Ge.length;
    for (var Ce in T)
      bt.call(T, Ce) && !(Fe && // Safari 9 has enumerable `arguments.length` in strict mode.
      (Ce == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Ne && (Ce == "offset" || Ce == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      le && (Ce == "buffer" || Ce == "byteLength" || Ce == "byteOffset") || // Skip index properties.
      bE(Ce, Ke))) && Ge.push(Ce);
    return Ge;
  }
  function Ta(T, F) {
    for (var q = T.length; q--; )
      if (kh(T[q][0], F))
        return q;
    return -1;
  }
  function mE(T, F, q) {
    var J = F(T);
    return Aa(T) ? J : tt(J, q(T));
  }
  function ls(T) {
    return T == null ? T === void 0 ? I : m : Nn && Nn in Object(T) ? wE(T) : AE(T);
  }
  function Oh(T) {
    return us(T) && ls(T) == o;
  }
  function Ih(T, F, q, J, Ne) {
    return T === F ? !0 : T == null || F == null || !us(T) && !us(F) ? T !== T && F !== F : gE(T, F, q, J, Ih, Ne);
  }
  function gE(T, F, q, J, Ne, le) {
    var Fe = Aa(T), Ge = Aa(F), Ke = Fe ? c : Gr(T), Ce = Ge ? c : Gr(F);
    Ke = Ke == o ? w : Ke, Ce = Ce == o ? w : Ce;
    var Dt = Ke == w, zt = Ce == w, rt = Ke == Ce;
    if (rt && Xc(T)) {
      if (!Xc(F))
        return !1;
      Fe = !0, Dt = !1;
    }
    if (rt && !Dt)
      return le || (le = new Br()), Fe || Uh(T) ? Ch(T, F, q, J, Ne, le) : _E(T, F, Ke, q, J, Ne, le);
    if (!(q & i)) {
      var xt = Dt && bt.call(T, "__wrapped__"), Vt = zt && bt.call(F, "__wrapped__");
      if (xt || Vt) {
        var Hr = xt ? T.value() : T, Rr = Vt ? F.value() : F;
        return le || (le = new Br()), Ne(Hr, Rr, q, J, le);
      }
    }
    return rt ? (le || (le = new Br()), EE(T, F, q, J, Ne, le)) : !1;
  }
  function yE(T) {
    if (!jh(T) || TE(T))
      return !1;
    var F = Fh(T) ? j_ : b;
    return F.test(On(T));
  }
  function $E(T) {
    return us(T) && Lh(T.length) && !!$[ls(T)];
  }
  function vE(T) {
    if (!NE(T))
      return x_(T);
    var F = [];
    for (var q in Object(T))
      bt.call(T, q) && q != "constructor" && F.push(q);
    return F;
  }
  function Ch(T, F, q, J, Ne, le) {
    var Fe = q & i, Ge = T.length, Ke = F.length;
    if (Ge != Ke && !(Fe && Ke > Ge))
      return !1;
    var Ce = le.get(T);
    if (Ce && le.get(F))
      return Ce == F;
    var Dt = -1, zt = !0, rt = q & s ? new Pa() : void 0;
    for (le.set(T, F), le.set(F, T); ++Dt < Ge; ) {
      var xt = T[Dt], Vt = F[Dt];
      if (J)
        var Hr = Fe ? J(Vt, xt, Dt, F, T, le) : J(xt, Vt, Dt, T, F, le);
      if (Hr !== void 0) {
        if (Hr)
          continue;
        zt = !1;
        break;
      }
      if (rt) {
        if (!we(F, function(Rr, In) {
          if (!jt(rt, In) && (xt === Rr || Ne(xt, Rr, q, J, le)))
            return rt.push(In);
        })) {
          zt = !1;
          break;
        }
      } else if (!(xt === Vt || Ne(xt, Vt, q, J, le))) {
        zt = !1;
        break;
      }
    }
    return le.delete(T), le.delete(F), zt;
  }
  function _E(T, F, q, J, Ne, le, Fe) {
    switch (q) {
      case G:
        if (T.byteLength != F.byteLength || T.byteOffset != F.byteOffset)
          return !1;
        T = T.buffer, F = F.buffer;
      case B:
        return !(T.byteLength != F.byteLength || !le(new Th(T), new Th(F)));
      case l:
      case u:
      case v:
        return kh(+T, +F);
      case h:
        return T.name == F.name && T.message == F.message;
      case M:
      case K:
        return T == F + "";
      case g:
        var Ge = Ut;
      case z:
        var Ke = J & i;
        if (Ge || (Ge = Pr), T.size != F.size && !Ke)
          return !1;
        var Ce = Fe.get(T);
        if (Ce)
          return Ce == F;
        J |= s, Fe.set(T, F);
        var Dt = Ch(Ge(T), Ge(F), J, Ne, le, Fe);
        return Fe.delete(T), Dt;
      case pe:
        if (Yc)
          return Yc.call(T) == Yc.call(F);
    }
    return !1;
  }
  function EE(T, F, q, J, Ne, le) {
    var Fe = q & i, Ge = Dh(T), Ke = Ge.length, Ce = Dh(F), Dt = Ce.length;
    if (Ke != Dt && !Fe)
      return !1;
    for (var zt = Ke; zt--; ) {
      var rt = Ge[zt];
      if (!(Fe ? rt in F : bt.call(F, rt)))
        return !1;
    }
    var xt = le.get(T);
    if (xt && le.get(F))
      return xt == F;
    var Vt = !0;
    le.set(T, F), le.set(F, T);
    for (var Hr = Fe; ++zt < Ke; ) {
      rt = Ge[zt];
      var Rr = T[rt], In = F[rt];
      if (J)
        var Mh = Fe ? J(In, Rr, rt, F, T, le) : J(Rr, In, rt, T, F, le);
      if (!(Mh === void 0 ? Rr === In || Ne(Rr, In, q, J, le) : Mh)) {
        Vt = !1;
        break;
      }
      Hr || (Hr = rt == "constructor");
    }
    if (Vt && !Hr) {
      var Ra = T.constructor, Oa = F.constructor;
      Ra != Oa && "constructor" in T && "constructor" in F && !(typeof Ra == "function" && Ra instanceof Ra && typeof Oa == "function" && Oa instanceof Oa) && (Vt = !1);
    }
    return le.delete(T), le.delete(F), Vt;
  }
  function Dh(T) {
    return mE(T, CE, SE);
  }
  function Na(T, F) {
    var q = T.__data__;
    return PE(F) ? q[typeof F == "string" ? "string" : "hash"] : q.map;
  }
  function oi(T, F) {
    var q = It(T, F);
    return yE(q) ? q : void 0;
  }
  function wE(T) {
    var F = bt.call(T, Nn), q = T[Nn];
    try {
      T[Nn] = void 0;
      var J = !0;
    } catch {
    }
    var Ne = bh.call(T);
    return J && (F ? T[Nn] = q : delete T[Nn]), Ne;
  }
  var SE = Ah ? function(T) {
    return T == null ? [] : (T = Object(T), Oe(Ah(T), function(F) {
      return Nh.call(T, F);
    }));
  } : DE, Gr = ls;
  (Hc && Gr(new Hc(new ArrayBuffer(1))) != G || os && Gr(new os()) != g || zc && Gr(zc.resolve()) != N || Kc && Gr(new Kc()) != z || Wc && Gr(new Wc()) != Z) && (Gr = function(T) {
    var F = ls(T), q = F == w ? T.constructor : void 0, J = q ? On(q) : "";
    if (J)
      switch (J) {
        case V_:
          return G;
        case q_:
          return g;
        case B_:
          return N;
        case G_:
          return z;
        case H_:
          return Z;
      }
    return F;
  });
  function bE(T, F) {
    return F = F ?? a, !!F && (typeof T == "number" || d.test(T)) && T > -1 && T % 1 == 0 && T < F;
  }
  function PE(T) {
    var F = typeof T;
    return F == "string" || F == "number" || F == "symbol" || F == "boolean" ? T !== "__proto__" : T === null;
  }
  function TE(T) {
    return !!Sh && Sh in T;
  }
  function NE(T) {
    var F = T && T.constructor, q = typeof F == "function" && F.prototype || Mt;
    return T === q;
  }
  function AE(T) {
    return bh.call(T);
  }
  function On(T) {
    if (T != null) {
      try {
        return qr.call(T);
      } catch {
      }
      try {
        return T + "";
      } catch {
      }
    }
    return "";
  }
  function kh(T, F) {
    return T === F || T !== T && F !== F;
  }
  var RE = Oh(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Oh : function(T) {
    return us(T) && bt.call(T, "callee") && !Nh.call(T, "callee");
  }, Aa = Array.isArray;
  function OE(T) {
    return T != null && Lh(T.length) && !Fh(T);
  }
  var Xc = M_ || kE;
  function IE(T, F) {
    return Ih(T, F);
  }
  function Fh(T) {
    if (!jh(T))
      return !1;
    var F = ls(T);
    return F == p || F == _ || F == f || F == C;
  }
  function Lh(T) {
    return typeof T == "number" && T > -1 && T % 1 == 0 && T <= a;
  }
  function jh(T) {
    var F = typeof T;
    return T != null && (F == "object" || F == "function");
  }
  function us(T) {
    return T != null && typeof T == "object";
  }
  var Uh = Te ? Ht(Te) : $E;
  function CE(T) {
    return OE(T) ? pE(T) : vE(T);
  }
  function DE() {
    return [];
  }
  function kE() {
    return !1;
  }
  e.exports = IE;
})(qo, qo.exports);
var uR = qo.exports;
Object.defineProperty(ha, "__esModule", { value: !0 });
ha.DownloadedUpdateHelper = void 0;
ha.createTempUpdateFile = mR;
const fR = sa, dR = Sn, tm = uR, Ln = Pn, Os = ke;
class hR {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Os.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return tm(this.versionInfo, r) && tm(this.fileInfo.info, n.info) && await (0, Ln.pathExists)(t) ? t : null;
    const s = await this.getValidCachedUpdateFile(n, i);
    return s === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = s, s);
  }
  async setDownloadedFile(t, r, n, i, s, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: s,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Ln.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Ln.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Ln.pathExists)(n))
      return null;
    let s;
    try {
      s = await (0, Ln.readJson)(n);
    } catch (f) {
      let l = "No cached update info available";
      return f.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${f.message})`), r.info(l), null;
    }
    if (!((s == null ? void 0 : s.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== s.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${s.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const o = Os.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, Ln.pathExists)(o))
      return r.info("Cached update file doesn't exist"), null;
    const c = await pR(o);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, o);
  }
  getUpdateInfoFile() {
    return Os.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
ha.DownloadedUpdateHelper = hR;
function pR(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const a = (0, fR.createHash)(t);
    a.on("error", s).setEncoding(r), (0, dR.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function mR(e, t, r) {
  let n = 0, i = Os.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, Ln.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Os.join(t, `${n++}-${e}`);
    }
  return i;
}
var yc = {}, gf = {};
Object.defineProperty(gf, "__esModule", { value: !0 });
gf.getAppCacheDir = yR;
const gl = ke, gR = nc;
function yR() {
  const e = (0, gR.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || gl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = gl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || gl.join(e, ".cache"), t;
}
Object.defineProperty(yc, "__esModule", { value: !0 });
yc.ElectronAppAdapter = void 0;
const rm = ke, $R = gf;
class vR {
  constructor(t = jr.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? rm.join(process.resourcesPath, "app-update.yml") : rm.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, $R.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
yc.ElectronAppAdapter = vR;
var d$ = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Be;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return jr.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(s) {
      super(), this.proxyLoginCallback = s, this.cachedSession = null;
    }
    async download(s, a, o) {
      return await o.cancellationToken.createPromise((c, f, l) => {
        const u = {
          headers: o.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(s, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: a,
          options: o,
          onCancel: l,
          callback: (h) => {
            h == null ? c(a) : f(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(s, a) {
      s.headers && s.headers.Host && (s.host = s.headers.Host, delete s.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const o = jr.net.request({
        ...s,
        session: this.cachedSession
      });
      return o.on("response", a), this.proxyLoginCallback != null && o.on("login", this.proxyLoginCallback), o;
    }
    addRedirectHandlers(s, a, o, c, f) {
      s.on("redirect", (l, u, h) => {
        s.abort(), c > this.maxRedirects ? o(this.createMaxRedirectError()) : f(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(d$);
var pa = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.newBaseUrl = _R;
lr.newUrlFromBase = ER;
lr.getChannelFilename = wR;
const h$ = bn;
function _R(e) {
  const t = new h$.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function ER(e, t, r = !1) {
  const n = new h$.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function wR(e) {
  return `${e}.yml`;
}
var Me = {}, SR = "[object Symbol]", p$ = /[\\^$.*+?()[\]{}|]/g, bR = RegExp(p$.source), PR = typeof gt == "object" && gt && gt.Object === Object && gt, TR = typeof self == "object" && self && self.Object === Object && self, NR = PR || TR || Function("return this")(), AR = Object.prototype, RR = AR.toString, nm = NR.Symbol, im = nm ? nm.prototype : void 0, sm = im ? im.toString : void 0;
function OR(e) {
  if (typeof e == "string")
    return e;
  if (CR(e))
    return sm ? sm.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function IR(e) {
  return !!e && typeof e == "object";
}
function CR(e) {
  return typeof e == "symbol" || IR(e) && RR.call(e) == SR;
}
function DR(e) {
  return e == null ? "" : OR(e);
}
function kR(e) {
  return e = DR(e), e && bR.test(e) ? e.replace(p$, "\\$&") : e;
}
var m$ = kR;
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.Provider = void 0;
Me.findFile = MR;
Me.parseUpdateInfo = xR;
Me.getFileList = g$;
Me.resolveFiles = VR;
const En = Be, FR = et, LR = bn, Bo = lr, jR = m$;
class UR {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, Bo.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, Bo.newUrlFromBase)(`${t.pathname.replace(new RegExp(jR(n), "g"), r)}.blockmap`, i ? new LR.URL(i) : t), s];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, En.configureRequestUrl)(t, n), n;
  }
}
Me.Provider = UR;
function MR(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, En.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((a) => [a.url.pathname, a.info.url].some((o) => o.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((a) => !r.some((o) => a.url.pathname.toLowerCase().endsWith(`.${o.toLowerCase()}`))));
}
function xR(e, t, r) {
  if (e == null)
    throw (0, En.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, FR.load)(e);
  } catch (i) {
    throw (0, En.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function g$(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, En.newError)(`No files provided: ${(0, En.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function VR(e, t, r = (n) => n) {
  const i = g$(e).map((o) => {
    if (o.sha2 == null && o.sha512 == null)
      throw (0, En.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, En.safeStringifyJson)(o)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Bo.newUrlFromBase)(r(o.url), t),
      info: o
    };
  }), s = e.packages, a = s == null ? null : s[process.arch] || s.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, Bo.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.GenericProvider = void 0;
const am = Be, yl = lr, $l = Me;
class qR extends $l.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, yl.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, yl.getChannelFilename)(this.channel), r = (0, yl.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, $l.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof am.HttpError && i.statusCode === 404)
          throw (0, am.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((s, a) => {
            try {
              setTimeout(s, 1e3 * n);
            } catch (o) {
              a(o);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, $l.resolveFiles)(t, this.baseUrl);
  }
}
pa.GenericProvider = qR;
var $c = {}, vc = {};
Object.defineProperty(vc, "__esModule", { value: !0 });
vc.BitbucketProvider = void 0;
const om = Be, vl = lr, _l = Me;
class BR extends _l.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, vl.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new om.CancellationToken(), r = (0, vl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, vl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, _l.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, om.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, _l.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
vc.BitbucketProvider = BR;
var wn = {};
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.GitHubProvider = wn.BaseGitHubProvider = void 0;
wn.computeReleaseNotes = $$;
const Cr = Be, Pi = f$, GR = bn, Ti = lr, mu = Me, El = /\/tag\/([^/]+)$/;
class y$ extends mu.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Ti.newBaseUrl)((0, Cr.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Ti.newBaseUrl)((0, Cr.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
wn.BaseGitHubProvider = y$;
class HR extends y$ {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const a = new Cr.CancellationToken(), o = await this.httpRequest((0, Ti.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), c = (0, Cr.parseXml)(o);
    let f = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Pi.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (v === null)
          l = El.exec(f.element("link").attribute("href"))[1];
        else
          for (const m of c.getElements("entry")) {
            const w = El.exec(m.element("link").attribute("href"));
            if (w === null)
              continue;
            const N = w[1], C = ((n = Pi.prerelease(N)) === null || n === void 0 ? void 0 : n[0]) || null, M = !v || ["alpha", "beta"].includes(v), z = C !== null && !["alpha", "beta"].includes(String(C));
            if (M && !z && !(v === "beta" && C === "alpha")) {
              l = N;
              break;
            }
            if (C && C === v) {
              l = N;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(a);
        for (const v of c.getElements("entry"))
          if (El.exec(v.element("link").attribute("href"))[1] === l) {
            f = v;
            break;
          }
      }
    } catch (v) {
      throw (0, Cr.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${o}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Cr.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, h = "", p = "";
    const _ = async (v) => {
      h = (0, Ti.getChannelFilename)(v), p = (0, Ti.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const m = this.createRequestOptions(p);
      try {
        return await this.executor.request(m, a);
      } catch (w) {
        throw w instanceof Cr.HttpError && w.statusCode === 404 ? (0, Cr.newError)(`Cannot find ${h} in the latest release artifacts (${p}): ${w.stack || w.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : w;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = Pi.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((s = Pi.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), u = await _(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        u = await _(this.getDefaultChannelName());
      else
        throw v;
    }
    const g = (0, mu.parseUpdateInfo)(u, h, p);
    return g.releaseName == null && (g.releaseName = f.elementValueOrEmpty("title")), g.releaseNotes == null && (g.releaseNotes = $$(this.updater.currentVersion, this.updater.fullChangelog, c, f)), {
      tag: l,
      ...g
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Ti.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new GR.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Cr.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, mu.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
wn.GitHubProvider = HR;
function cm(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function $$(e, t, r, n) {
  if (!t)
    return cm(n);
  const i = [];
  for (const s of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(s.element("link").attribute("href"))[1];
    Pi.lt(e, a) && i.push({
      version: a,
      note: cm(s)
    });
  }
  return i.sort((s, a) => Pi.rcompare(s.version, a.version));
}
var _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
_c.GitLabProvider = void 0;
const ft = Be, wl = bn, zR = m$, Ba = lr, Sl = Me;
class KR extends Sl.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, r, n) {
    super({
      ...n,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = r, this.cachedLatestVersion = null;
    const s = t.host || "gitlab.com";
    this.baseApiUrl = (0, Ba.newBaseUrl)(`https://${s}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new ft.CancellationToken(), r = (0, Ba.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, p = await this.httpRequest(r, h, t);
      if (!p)
        throw (0, ft.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(p);
    } catch (h) {
      throw (0, ft.newError)(`Unable to find latest release on GitLab (${r}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let s = null, a = "", o = null;
    const c = async (h) => {
      a = (0, Ba.getChannelFilename)(h);
      const p = n.assets.links.find((g) => g.name === a);
      if (!p)
        throw (0, ft.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      o = new wl.URL(p.direct_asset_url);
      const _ = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const g = await this.httpRequest(o, _, t);
        if (!g)
          throw (0, ft.newError)(`Empty response from ${o}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return g;
      } catch (g) {
        throw g instanceof ft.HttpError && g.statusCode === 404 ? (0, ft.newError)(`Cannot find ${a} in the latest release artifacts (${o}): ${g.stack || g.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : g;
      }
    };
    try {
      s = await c(this.channel);
    } catch (h) {
      if (this.channel !== this.getDefaultChannelName())
        s = await c(this.getDefaultChannelName());
      else
        throw h;
    }
    if (!s)
      throw (0, ft.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const f = (0, Sl.parseUpdateInfo)(s, a, o);
    f.releaseName == null && (f.releaseName = n.name), f.releaseNotes == null && (f.releaseNotes = n.description || null);
    const l = /* @__PURE__ */ new Map();
    for (const h of n.assets.links)
      l.set(this.normalizeFilename(h.name), h.direct_asset_url);
    const u = {
      tag: i,
      assets: l,
      ...f
    };
    return this.cachedLatestVersion = u, u;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const r = /* @__PURE__ */ new Map();
    for (const n of t.links)
      r.set(this.normalizeFilename(n.name), n.direct_asset_url);
    return r;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, r) {
    const n = [`${r}.blockmap`, `${this.normalizeFilename(r)}.blockmap`];
    for (const i of n) {
      const s = t.get(i);
      if (s)
        return new wl.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new ft.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, Ba.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, o = await this.httpRequest(s, a, r);
        if (o)
          return JSON.parse(o);
      } catch (a) {
        if (a instanceof ft.HttpError && a.statusCode === 404)
          continue;
        throw (0, ft.newError)(`Unable to find release ${i} on GitLab (${s}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, ft.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const r = {};
    return t != null && (t.startsWith("Bearer") ? r.authorization = t : r["PRIVATE-TOKEN"] = t), r;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const r = await this.fetchReleaseInfoByVersion(t);
    return r && r.assets ? this.convertAssetsToMap(r.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, r, n) {
    let i = null, s = null;
    const a = await this.getVersionInfoForBlockMap(r);
    a && (i = this.findBlockMapInAssets(a, n));
    const o = await this.getVersionInfoForBlockMap(t);
    if (o) {
      const c = n.replace(new RegExp(zR(r), "g"), t);
      s = this.findBlockMapInAssets(o, c);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [a, o] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!o)
        throw (0, ft.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, ft.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, o];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, Sl.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, ft.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new wl.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
_c.GitLabProvider = KR;
var Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
Ec.KeygenProvider = void 0;
const lm = Be, bl = lr, Pl = Me;
class WR extends Pl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, bl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new lm.CancellationToken(), r = (0, bl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, bl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Pl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, lm.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Pl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Ec.KeygenProvider = WR;
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
wc.PrivateGitHubProvider = void 0;
const ui = Be, YR = et, XR = ke, um = bn, fm = lr, JR = wn, QR = Me;
class ZR extends JR.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new ui.CancellationToken(), r = (0, fm.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((o) => o.name === r);
    if (i == null)
      throw (0, ui.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new um.URL(i.url);
    let a;
    try {
      a = (0, YR.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
    } catch (o) {
      throw o instanceof ui.HttpError && o.statusCode === 404 ? (0, ui.newError)(`Cannot find ${r} in the latest release artifacts (${s}): ${o.stack || o.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : o;
    }
    return a.assets = n.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, fm.newUrlFromBase)(n, this.baseUrl);
    try {
      const s = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? s.find((a) => a.prerelease) || s[0] : s;
    } catch (s) {
      throw (0, ui.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, QR.getFileList)(t).map((r) => {
      const n = XR.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, ui.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new um.URL(i.url),
        info: r
      };
    });
  }
}
wc.PrivateGitHubProvider = ZR;
Object.defineProperty($c, "__esModule", { value: !0 });
$c.isUrlProbablySupportMultiRangeRequests = v$;
$c.createClient = sO;
const Ga = Be, eO = vc, dm = pa, tO = wn, rO = _c, nO = Ec, iO = wc;
function v$(e) {
  return !e.includes("s3.amazonaws.com");
}
function sO(e, t, r) {
  if (typeof e == "string")
    throw (0, Ga.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new tO.GitHubProvider(i, t, r) : new iO.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new eO.BitbucketProvider(e, t, r);
    case "gitlab":
      return new rO.GitLabProvider(e, t, r);
    case "keygen":
      return new nO.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new dm.GenericProvider({
        provider: "generic",
        url: (0, Ga.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new dm.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && v$(i.url)
      });
    }
    case "custom": {
      const i = e, s = i.updateProvider;
      if (!s)
        throw (0, Ga.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new s(i, t, r);
    }
    default:
      throw (0, Ga.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Sc = {}, ma = {}, Xi = {}, ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
ai.OperationKind = void 0;
ai.computeOperations = aO;
var zn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(zn || (ai.OperationKind = zn = {}));
function aO(e, t, r) {
  const n = pm(e.files), i = pm(t.files);
  let s = null;
  const a = t.files[0], o = [], c = a.name, f = n.get(c);
  if (f == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let u = 0;
  const { checksumToOffset: h, checksumToOldSize: p } = cO(n.get(c), f.offset, r);
  let _ = a.offset;
  for (let g = 0; g < l.checksums.length; _ += l.sizes[g], g++) {
    const v = l.sizes[g], m = l.checksums[g];
    let w = h.get(m);
    w != null && p.get(m) !== v && (r.warn(`Checksum ("${m}") matches, but size differs (old: ${p.get(m)}, new: ${v})`), w = void 0), w === void 0 ? (u++, s != null && s.kind === zn.DOWNLOAD && s.end === _ ? s.end += v : (s = {
      kind: zn.DOWNLOAD,
      start: _,
      end: _ + v
      // oldBlocks: null,
    }, hm(s, o, m, g))) : s != null && s.kind === zn.COPY && s.end === w ? s.end += v : (s = {
      kind: zn.COPY,
      start: w,
      end: w + v
      // oldBlocks: [checksum]
    }, hm(s, o, m, g));
  }
  return u > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${u} changed blocks`), o;
}
const oO = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function hm(e, t, r, n) {
  if (oO && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const s = [i.start, i.end, e.start, e.end].reduce((a, o) => a < o ? a : o);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${zn[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - s} until ${i.end - s} and ${e.start - s} until ${e.end - s}`);
    }
  }
  t.push(e);
}
function cO(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let s = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const o = e.checksums[a], c = e.sizes[a], f = i.get(o);
    if (f === void 0)
      n.set(o, s), i.set(o, c);
    else if (r.debug != null) {
      const l = f === c ? "(same size)" : `(size: ${f}, this size: ${c})`;
      r.debug(`${o} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    s += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function pm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.DataSplitter = void 0;
Xi.copyData = _$;
const Ha = Be, lO = Sn, uO = ia, fO = ai, mm = Buffer.from(`\r
\r
`);
var sn;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(sn || (sn = {}));
function _$(e, t, r, n, i) {
  const s = (0, lO.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  s.on("error", n), s.once("end", i), s.pipe(t, {
    end: !1
  });
}
class dO extends uO.Writable {
  constructor(t, r, n, i, s, a) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = s, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = sn.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Ha.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === sn.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = sn.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === sn.BODY)
          this.readState = sn.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Ha.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const o = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (o < a)
            await this.copyExistingData(o, a);
          else if (o > a)
            throw (0, Ha.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = sn.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, s = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, s), this.remainingPartDataCount = n - (s - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const s = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== fO.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        _$(a, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(mm, r);
    if (n !== -1)
      return n + mm.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Ha.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((s, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), s();
      });
    });
  }
}
Xi.DataSplitter = dO;
var bc = {};
Object.defineProperty(bc, "__esModule", { value: !0 });
bc.executeTasksUsingMultipleRangeRequests = hO;
bc.checkIsRangesSupported = yu;
const gu = Be, gm = Xi, ym = ai;
function hO(e, t, r, n, i) {
  const s = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const o = a + 1e3;
    pO(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, o),
      oldFileFd: n
    }, r, () => s(o), i);
  };
  return s;
}
function pO(e, t, r, n, i) {
  let s = "bytes=", a = 0;
  const o = /* @__PURE__ */ new Map(), c = [];
  for (let u = t.start; u < t.end; u++) {
    const h = t.tasks[u];
    h.kind === ym.OperationKind.DOWNLOAD && (s += `${h.start}-${h.end - 1}, `, o.set(a, u), a++, c.push(h.end - h.start));
  }
  if (a <= 1) {
    const u = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const p = t.tasks[h++];
      if (p.kind === ym.OperationKind.COPY)
        (0, gm.copyData)(p, r, t.oldFileFd, i, () => u(h));
      else {
        const _ = e.createRequestOptions();
        _.headers.Range = `bytes=${p.start}-${p.end - 1}`;
        const g = e.httpExecutor.createRequest(_, (v) => {
          v.on("error", i), yu(v, i) && (v.pipe(r, {
            end: !1
          }), v.once("end", () => u(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(g, i), g.end();
      }
    };
    u(t.start);
    return;
  }
  const f = e.createRequestOptions();
  f.headers.Range = s.substring(0, s.length - 2);
  const l = e.httpExecutor.createRequest(f, (u) => {
    if (!yu(u, i))
      return;
    const h = (0, gu.safeGetHeader)(u, "content-type"), p = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(h);
    if (p == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const _ = new gm.DataSplitter(r, t, o, p[1] || p[2], c, n);
    _.on("error", i), u.pipe(_), u.on("end", () => {
      setTimeout(() => {
        l.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(l, i), l.end();
}
function yu(e, t) {
  if (e.statusCode >= 400)
    return t((0, gu.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, gu.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Pc = {};
Object.defineProperty(Pc, "__esModule", { value: !0 });
Pc.ProgressDifferentialDownloadCallbackTransform = void 0;
const mO = ia;
var Ni;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Ni || (Ni = {}));
class gO extends mO.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Ni.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Ni.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = Ni.COPY;
  }
  beginRangeDownload() {
    this.operationType = Ni.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Pc.ProgressDifferentialDownloadCallbackTransform = gO;
Object.defineProperty(ma, "__esModule", { value: !0 });
ma.DifferentialDownloader = void 0;
const ps = Be, Tl = Pn, yO = Sn, $O = Xi, vO = bn, za = ai, $m = bc, _O = Pc;
class EO {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, ps.configureRequestUrl)(this.options.newUrl, t), (0, ps.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, za.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let s = 0, a = 0;
    for (const c of i) {
      const f = c.end - c.start;
      c.kind === za.OperationKind.DOWNLOAD ? s += f : a += f;
    }
    const o = this.blockAwareFileInfo.size;
    if (s + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o)
      throw new Error(`Internal error, size mismatch: downloadSize: ${s}, copySize: ${a}, newSize: ${o}`);
    return n.info(`Full: ${vm(o)}, To download: ${vm(s)} (${Math.round(s / (o / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Tl.close)(i.descriptor).catch((s) => {
      this.logger.error(`cannot close file "${i.path}": ${s}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((s) => {
      try {
        this.logger.error(`cannot close files: ${s}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, Tl.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Tl.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, yO.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, o) => {
      const c = [];
      let f;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const m = [];
        let w = 0;
        for (const C of t)
          C.kind === za.OperationKind.DOWNLOAD && (m.push(C.end - C.start), w += C.end - C.start);
        const N = {
          expectedByteCounts: m,
          grandTotal: w
        };
        f = new _O.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), c.push(f);
      }
      const l = new ps.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), s.on("finish", () => {
        s.close(() => {
          r.splice(1, 1);
          try {
            l.validate();
          } catch (m) {
            o(m);
            return;
          }
          a(void 0);
        });
      }), c.push(s);
      let u = null;
      for (const m of c)
        m.on("error", o), u == null ? u = m : u = u.pipe(m);
      const h = c[0];
      let p;
      if (this.options.isUseMultipleRangeRequest) {
        p = (0, $m.executeTasksUsingMultipleRangeRequests)(this, t, h, n, o), p(0);
        return;
      }
      let _ = 0, g = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", p = (m) => {
        var w, N;
        if (m >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const C = t[m++];
        if (C.kind === za.OperationKind.COPY) {
          f && f.beginFileCopy(), (0, $O.copyData)(C, h, n, o, () => p(m));
          return;
        }
        const M = `bytes=${C.start}-${C.end - 1}`;
        v.headers.range = M, (N = (w = this.logger) === null || w === void 0 ? void 0 : w.debug) === null || N === void 0 || N.call(w, `download range: ${M}`), f && f.beginRangeDownload();
        const z = this.httpExecutor.createRequest(v, (K) => {
          K.on("error", o), K.on("aborted", () => {
            o(new Error("response has been aborted by the server"));
          }), K.statusCode >= 400 && o((0, ps.createHttpError)(K)), K.pipe(h, {
            end: !1
          }), K.once("end", () => {
            f && f.endRangeDownload(), ++_ === 100 ? (_ = 0, setTimeout(() => p(m), 1e3)) : p(m);
          });
        });
        z.on("redirect", (K, pe, I) => {
          this.logger.info(`Redirect to ${wO(I)}`), g = I, (0, ps.configureRequestUrl)(new vO.URL(g), v), z.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(z, o), z.end();
      }, p(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let s = 0;
    if (await this.request(i, (a) => {
      a.copy(n, s), s += a.length;
    }), s !== n.length)
      throw new Error(`Received data length ${s} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const s = this.httpExecutor.createRequest(t, (a) => {
        (0, $m.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
ma.DifferentialDownloader = EO;
function vm(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function wO(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Sc, "__esModule", { value: !0 });
Sc.GenericDifferentialDownloader = void 0;
const SO = ma;
class bO extends SO.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Sc.GenericDifferentialDownloader = bO;
var Tn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Be;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(s) {
      this.emitter = s;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(s) {
      n(this.emitter, "login", s);
    }
    progress(s) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, s);
    }
    updateDownloaded(s) {
      n(this.emitter, e.UPDATE_DOWNLOADED, s);
    }
    updateCancelled(s) {
      n(this.emitter, "update-cancelled", s);
    }
  }
  e.UpdaterSignal = r;
  function n(i, s, a) {
    i.on(s, a);
  }
})(Tn);
Object.defineProperty($n, "__esModule", { value: !0 });
$n.NoOpLogger = $n.AppUpdater = void 0;
const dt = Be, PO = sa, TO = nc, NO = ly, Kt = Pn, AO = et, Nl = fc, Wt = ke, jn = f$, _m = ha, RO = yc, Em = d$, OO = pa, Al = $c, Rl = fy, IO = Sc, fi = Tn;
class yf extends NO.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, dt.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, dt.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Em.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new E$();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Nl.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new fi.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new Nl.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Nl.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new RO.ElectronAppAdapter(), this.httpExecutor = new Em.ElectronHttpExecutor((s, a) => this.emit("login", s, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, jn.parse)(n);
    if (i == null)
      throw (0, dt.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = CO(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new OO.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Al.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Al.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = yf.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new jr.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = dt.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, jn.parse)(t.version);
    if (r == null)
      throw (0, dt.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, jn.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const s = (0, jn.gt)(r, n), a = (0, jn.lt)(r, n);
    return s ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, TO.release)();
    if (r)
      try {
        if ((0, jn.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Al.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new dt.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, dt.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new dt.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, dt.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof dt.CancellationError))
        try {
          this.dispatchError(i);
        } catch (s) {
          this._logger.warn(`Cannot dispatch error event: ${s.stack || s}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(fi.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, AO.load)(await (0, Kt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Wt.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Kt.readFile)(t, "utf-8");
      if (dt.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = dt.UUID.v5((0, PO.randomBytes)(4096), dt.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Kt.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Wt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new _m.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(fi.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (w) => this.emit(fi.DOWNLOAD_PROGRESS, w));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, s = i.version, a = r.packageInfo;
    function o() {
      const w = decodeURIComponent(t.fileInfo.url.pathname);
      return w.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Wt.basename(w) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), f = c.cacheDirForPendingUpdate;
    await (0, Kt.mkdir)(f, { recursive: !0 });
    const l = o();
    let u = Wt.join(f, l);
    const h = a == null ? null : Wt.join(f, `package-${s}${Wt.extname(a.path) || ".7z"}`), p = async (w) => {
      await c.setDownloadedFile(u, h, i, r, l, w), await t.done({
        ...i,
        downloadedFile: u
      });
      const N = Wt.join(f, "current.blockmap");
      return await (0, Kt.pathExists)(N) && await (0, Kt.copyFile)(N, Wt.join(c.cacheDir, "current.blockmap")), h == null ? [u] : [u, h];
    }, _ = this._logger, g = await c.validateDownloadedPath(u, i, r, _);
    if (g != null)
      return u = g, await p(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, Kt.unlink)(u).catch(() => {
    })), m = await (0, _m.createTempUpdateFile)(`temp-${l}`, f, _);
    try {
      await t.task(m, n, h, v), await (0, dt.retry)(() => (0, Kt.rename)(m, u), {
        retries: 60,
        interval: 500,
        shouldRetry: (w) => w instanceof Error && /^EBUSY:/.test(w.message) ? !0 : (_.warn(`Cannot rename temp file to final file: ${w.message || w.stack}`), !1)
      });
    } catch (w) {
      throw await v(), w instanceof dt.CancellationError && (_.info("cancelled"), this.emit("update-cancelled", i)), w;
    }
    return _.info(`New version ${s} has been downloaded to ${u}`), await p(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, s) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = r.updateInfoAndProvider.provider, o = await a.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${o[0]}", new: ${o[1]})`);
      const c = async (_) => {
        const g = await this.httpExecutor.downloadToBuffer(_, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (g == null || g.length === 0)
          throw new Error(`Blockmap "${_.href}" is empty`);
        try {
          return JSON.parse((0, Rl.gunzipSync)(g).toString());
        } catch (v) {
          throw new Error(`Cannot parse blockmap "${_.href}", error: ${v}`);
        }
      }, f = {
        newUrl: t.url,
        oldFile: Wt.join(this.downloadedUpdateHelper.cacheDir, s),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(fi.DOWNLOAD_PROGRESS) > 0 && (f.onProgress = (_) => this.emit(fi.DOWNLOAD_PROGRESS, _));
      const l = async (_, g) => {
        const v = Wt.join(g, "current.blockmap");
        await (0, Kt.outputFile)(v, (0, Rl.gzipSync)(JSON.stringify(_)));
      }, u = async (_) => {
        const g = Wt.join(_, "current.blockmap");
        try {
          if (await (0, Kt.pathExists)(g))
            return JSON.parse((0, Rl.gunzipSync)(await (0, Kt.readFile)(g)).toString());
        } catch (v) {
          this._logger.warn(`Cannot parse blockmap "${g}", error: ${v}`);
        }
        return null;
      }, h = await c(o[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let p = await u(this.downloadedUpdateHelper.cacheDir);
      return p == null && (p = await c(o[0])), await new IO.GenericDifferentialDownloader(t.info, this.httpExecutor, f).download(p, h), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
$n.AppUpdater = yf;
function CO(e) {
  const t = (0, jn.prerelease)(e);
  return t != null && t.length > 0;
}
class E$ {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
$n.NoOpLogger = E$;
Object.defineProperty(si, "__esModule", { value: !0 });
si.BaseUpdater = void 0;
const wm = rc, DO = $n;
class kO extends DO.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      jr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, s = n == null ? null : n.downloadedFileInfo;
    if (i == null || s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: s.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, wm.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: s, status: a, stdout: o, stderr: c } = i;
    if (s != null)
      throw this._logger.error(c), s;
    if (a != null && a !== 0)
      throw this._logger.error(c), new Error(`Command ${t} exited with code ${a}`);
    return o.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((s, a) => {
      try {
        const o = { stdio: i, env: n, detached: !0 }, c = (0, wm.spawn)(t, r, o);
        c.on("error", (f) => {
          a(f);
        }), c.unref(), c.pid !== void 0 && s(!0);
      } catch (o) {
        a(o);
      }
    });
  }
}
si.BaseUpdater = kO;
var Xs = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
ga.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const di = Pn, FO = ma, LO = fy;
class jO extends FO.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = w$(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await UO(this.options.oldFile), i);
  }
}
ga.FileWithEmbeddedBlockMapDifferentialDownloader = jO;
function w$(e) {
  return JSON.parse((0, LO.inflateRawSync)(e).toString());
}
async function UO(e) {
  const t = await (0, di.open)(e, "r");
  try {
    const r = (await (0, di.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, di.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, di.read)(t, i, 0, i.length, r - n.length - i.length), await (0, di.close)(t), w$(i);
  } catch (r) {
    throw await (0, di.close)(t), r;
  }
}
Object.defineProperty(Xs, "__esModule", { value: !0 });
Xs.AppImageUpdater = void 0;
const Sm = Be, bm = rc, MO = Pn, xO = Sn, ms = ke, VO = si, qO = ga, BO = Me, Pm = Tn;
class GO extends VO.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, BO.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Sm.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, MO.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, s) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: s.requestHeaders,
        cancellationToken: s.cancellationToken
      };
      return this.listenerCount(Pm.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (o) => this.emit(Pm.DOWNLOAD_PROGRESS, o)), await new qO.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Sm.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, xO.unlinkSync)(r);
    let n;
    const i = ms.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    ms.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = ms.join(ms.dirname(r), ms.basename(s)), (0, bm.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, bm.execFileSync)(n, [], { env: a })), !0;
  }
}
Xs.AppImageUpdater = GO;
var Js = {}, Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.LinuxUpdater = void 0;
const HO = si;
class zO extends HO.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: r } = this.app, n = `"${r} would like to update"`, i = this.sudoWithArgs(n);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let s = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (s = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${s}/bin/bash`, "-c", `'${t.join(" ")}'${s}`]);
  }
  sudoWithArgs(t) {
    const r = this.determineSudoCommand(), n = [r];
    return /kdesudo/i.test(r) ? (n.push("--comment", t), n.push("-c")) : /gksudo/i.test(r) ? n.push("--message", t) : /pkexec/i.test(r) && n.push("--disable-internal-agent"), n;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const r of t)
      if (this.hasCommand(r))
        return r;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var r;
    const n = (r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || r === void 0 ? void 0 : r.trim();
    if (n)
      return n;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
Ji.LinuxUpdater = zO;
Object.defineProperty(Js, "__esModule", { value: !0 });
Js.DebUpdater = void 0;
const KO = Me, Tm = Tn, WO = Ji;
class $f extends WO.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, KO.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Tm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Tm.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      $f.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    var s;
    if (t === "dpkg")
      try {
        n(["dpkg", "-i", r]);
      } catch (a) {
        i.warn((s = a.message) !== null && s !== void 0 ? s : a), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        r
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Js.DebUpdater = $f;
var Qs = {};
Object.defineProperty(Qs, "__esModule", { value: !0 });
Qs.PacmanUpdater = void 0;
const Nm = Tn, YO = Me, XO = Ji;
class vf extends XO.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, YO.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Nm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Nm.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      vf.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (n) {
      return this.dispatchError(n), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n) {
    var i;
    try {
      r(["pacman", "-U", "--noconfirm", t]);
    } catch (s) {
      n.warn((i = s.message) !== null && i !== void 0 ? i : s), n.warn("pacman installation failed, attempting to update package database and retry");
      try {
        r(["pacman", "-Sy", "--noconfirm"]), r(["pacman", "-U", "--noconfirm", t]);
      } catch (a) {
        throw n.error("Retry after pacman -Sy failed"), a;
      }
    }
  }
}
Qs.PacmanUpdater = vf;
var Zs = {};
Object.defineProperty(Zs, "__esModule", { value: !0 });
Zs.RpmUpdater = void 0;
const Am = Tn, JO = Me, QO = Ji;
class _f extends QO.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, JO.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Am.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Am.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      _f.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    if (t === "zypper")
      return n(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", r]);
    if (t === "dnf")
      return n(["dnf", "install", "--nogpgcheck", "-y", r]);
    if (t === "yum")
      return n(["yum", "install", "--nogpgcheck", "-y", r]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), n(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", r]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Zs.RpmUpdater = _f;
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.MacUpdater = void 0;
const Rm = Be, Ol = Pn, ZO = Sn, Om = ke, eI = GE, tI = $n, rI = Me, Im = rc, Cm = sa;
class nI extends tI.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = jr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let s = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), s = (0, Im.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (u) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Im.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (u) {
      n.warn(`uname shell command to check for arm64 failed: ${u}`);
    }
    a = a || process.arch === "arm64" || s;
    const o = (u) => {
      var h;
      return u.url.pathname.includes("arm64") || ((h = u.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && r.some(o) ? r = r.filter((u) => a === o(u)) : r = r.filter((u) => !o(u));
    const c = (0, rI.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, Rm.newError)(`ZIP file not provided: ${(0, Rm.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const f = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (u, h) => {
        const p = Om.join(this.downloadedUpdateHelper.cacheDir, l), _ = () => (0, Ol.pathExistsSync)(p) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let g = !0;
        _() && (g = await this.differentialDownloadInstaller(c, t, u, f, l)), g && await this.httpExecutor.download(c.url, u, h);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Om.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, Ol.copyFile)(u.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, u);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ol.stat)(i)).size, a = this._logger, o = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${o})`), this.server = (0, eI.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${o})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${o})`);
    });
    const c = (f) => {
      const l = f.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((f, l) => {
      const u = (0, Cm.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${u}`, "ascii"), p = `/${(0, Cm.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (_, g) => {
        const v = _.url;
        if (a.info(`${v} requested`), v === "/") {
          if (!_.headers.authorization || _.headers.authorization.indexOf("Basic ") === -1) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), a.warn("No authenthication info");
            return;
          }
          const N = _.headers.authorization.split(" ")[1], C = Buffer.from(N, "base64").toString("ascii"), [M, z] = C.split(":");
          if (M !== "autoupdater" || z !== u) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const K = Buffer.from(`{ "url": "${c(this.server)}${p}" }`);
          g.writeHead(200, { "Content-Type": "application/json", "Content-Length": K.length }), g.end(K);
          return;
        }
        if (!v.startsWith(p)) {
          a.warn(`${v} requested, but not supported`), g.writeHead(404), g.end();
          return;
        }
        a.info(`${p} requested by Squirrel.Mac, pipe ${i}`);
        let m = !1;
        g.on("finish", () => {
          m || (this.nativeUpdater.removeListener("error", l), f([]));
        });
        const w = (0, ZO.createReadStream)(i);
        w.on("error", (N) => {
          try {
            g.end();
          } catch (C) {
            a.warn(`cannot end response: ${C}`);
          }
          m = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${N}`));
        }), g.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": s
        }), w.pipe(g);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${o})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${o})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : f([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
ea.MacUpdater = nI;
var ta = {}, Ef = {};
Object.defineProperty(Ef, "__esModule", { value: !0 });
Ef.verifySignature = sI;
const Dm = Be, S$ = rc, iI = nc, km = ke;
function b$(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function sI(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, S$.execFile)(...b$(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, o, c) => {
      var f;
      try {
        if (a != null || c) {
          Il(r, a, c, i), n(null);
          return;
        }
        const l = aI(o);
        if (l.Status === 0) {
          try {
            const _ = km.normalize(l.Path), g = km.normalize(t);
            if (r.info(`LiteralPath: ${_}. Update Path: ${g}`), _ !== g) {
              Il(r, new Error(`LiteralPath of ${_} is different than ${g}`), c, i), n(null);
              return;
            }
          } catch (_) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(f = _.message) !== null && f !== void 0 ? f : _.stack}`);
          }
          const h = (0, Dm.parseDn)(l.SignerCertificate.Subject);
          let p = !1;
          for (const _ of e) {
            const g = (0, Dm.parseDn)(_);
            if (g.size ? p = Array.from(g.keys()).every((m) => g.get(m) === h.get(m)) : _ === h.get("CN") && (r.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), p = !0), p) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, p) => h === "RawData" ? void 0 : p, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (l) {
        Il(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function aI(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Il(e, t, r, n) {
  if (oI()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, S$.execFileSync)(...b$("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function oI() {
  const e = iI.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ta, "__esModule", { value: !0 });
ta.NsisUpdater = void 0;
const Ka = Be, Fm = ke, cI = si, lI = ga, Lm = Tn, uI = Me, fI = Pn, dI = Ef, jm = bn;
class hI extends cI.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, dI.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, uI.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, s, a, o) => {
        const c = n.packageInfo, f = c != null && a != null;
        if (f && t.disableWebInstaller)
          throw (0, Ka.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !f && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (f || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Ka.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, s);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await o(), (0, Ka.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (f && await this.differentialDownloadWebPackage(t, c, a, r))
          try {
            await this.httpExecutor.download(new jm.URL(c.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (u) {
            try {
              await (0, fI.unlink)(a);
            } catch {
            }
            throw u;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const s = () => {
      this.spawnLog(Fm.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), s(), !0) : (this.spawnLog(r, n).catch((a) => {
      const o = a.code;
      this._logger.info(`Cannot run installer: error code: ${o}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), o === "UNKNOWN" || o === "EACCES" ? s() : o === "ENOENT" ? jr.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const s = {
        newUrl: new jm.URL(r.path),
        oldFile: Fm.join(this.downloadedUpdateHelper.cacheDir, Ka.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Lm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Lm.DOWNLOAD_PROGRESS, a)), await new lI.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
ta.NsisUpdater = hI;
(function(e) {
  var t = gt && gt.__createBinding || (Object.create ? function(v, m, w, N) {
    N === void 0 && (N = w);
    var C = Object.getOwnPropertyDescriptor(m, w);
    (!C || ("get" in C ? !m.__esModule : C.writable || C.configurable)) && (C = { enumerable: !0, get: function() {
      return m[w];
    } }), Object.defineProperty(v, N, C);
  } : function(v, m, w, N) {
    N === void 0 && (N = w), v[N] = m[w];
  }), r = gt && gt.__exportStar || function(v, m) {
    for (var w in v) w !== "default" && !Object.prototype.hasOwnProperty.call(m, w) && t(m, v, w);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Pn, i = ke;
  var s = si;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return s.BaseUpdater;
  } });
  var a = $n;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var o = Me;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return o.Provider;
  } });
  var c = Xs;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var f = Js;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return f.DebUpdater;
  } });
  var l = Qs;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var u = Zs;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var h = ea;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var p = ta;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return p.NsisUpdater;
  } }), r(Tn, e);
  let _;
  function g() {
    if (process.platform === "win32")
      _ = new ta.NsisUpdater();
    else if (process.platform === "darwin")
      _ = new ea.MacUpdater();
    else {
      _ = new Xs.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(v))
          return _;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const m = (0, n.readFileSync)(v).toString().trim();
        switch (console.info("Found package-type:", m), m) {
          case "deb":
            _ = new Js.DebUpdater();
            break;
          case "rpm":
            _ = new Zs.RpmUpdater();
            break;
          case "pacman":
            _ = new Qs.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return _;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => _ || g()
  });
})(nn);
const Zn = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, P$ = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), T$ = 1e6, pI = (e) => e >= "0" && e <= "9";
function N$(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= T$;
  }
  return !1;
}
function Cl(e, t) {
  return P$.has(e) ? !1 : (e && N$(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function mI(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", i = !1, s = 0;
  for (const a of e) {
    if (s++, i) {
      r += a, i = !1;
      continue;
    }
    if (a === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${a}' in an index at position ${s}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${a}' after an index at position ${s}`);
      i = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (a) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${s}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Cl(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${a}' in an index at position ${s}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Cl(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const o = Number.parseInt(r, 10);
            !Number.isNaN(o) && Number.isFinite(o) && o >= 0 && o <= Number.MAX_SAFE_INTEGER && o <= T$ && r === String(o) ? t.push(o) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${s}`);
        r += a;
        break;
      }
      default: {
        if (n === "index" && !pI(a))
          throw new Error(`Invalid character '${a}' in an index at position ${s}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${a}' after an index at position ${s}`);
        n === "start" && (n = "property"), r += a;
      }
    }
  }
  switch (i && (r += "\\"), n) {
    case "property": {
      if (!Cl(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function Tc(e) {
  if (typeof e == "string")
    return mI(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (P$.has(n))
        return [];
      typeof n == "string" && N$(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Um(e, t, r) {
  if (!Zn(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = Tc(t);
  if (n.length === 0)
    return r;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (e = e[s], e == null) {
      if (i !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function Wa(e, t, r) {
  if (!Zn(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, i = Tc(t);
  if (i.length === 0)
    return e;
  for (let s = 0; s < i.length; s++) {
    const a = i[s];
    if (s === i.length - 1)
      e[a] = r;
    else if (!Zn(e[a])) {
      const c = typeof i[s + 1] == "number";
      e[a] = c ? [] : {};
    }
    e = e[a];
  }
  return n;
}
function gI(e, t) {
  if (!Zn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Tc(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !Zn(e))
      return !1;
  }
}
function Dl(e, t) {
  if (!Zn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Tc(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Zn(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const cn = hy.homedir(), wf = hy.tmpdir(), { env: Ai } = Ie, yI = (e) => {
  const t = se.join(cn, "Library");
  return {
    data: se.join(t, "Application Support", e),
    config: se.join(t, "Preferences", e),
    cache: se.join(t, "Caches", e),
    log: se.join(t, "Logs", e),
    temp: se.join(wf, e)
  };
}, $I = (e) => {
  const t = Ai.APPDATA || se.join(cn, "AppData", "Roaming"), r = Ai.LOCALAPPDATA || se.join(cn, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: se.join(r, e, "Data"),
    config: se.join(t, e, "Config"),
    cache: se.join(r, e, "Cache"),
    log: se.join(r, e, "Log"),
    temp: se.join(wf, e)
  };
}, vI = (e) => {
  const t = se.basename(cn);
  return {
    data: se.join(Ai.XDG_DATA_HOME || se.join(cn, ".local", "share"), e),
    config: se.join(Ai.XDG_CONFIG_HOME || se.join(cn, ".config"), e),
    cache: se.join(Ai.XDG_CACHE_HOME || se.join(cn, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: se.join(Ai.XDG_STATE_HOME || se.join(cn, ".local", "state"), e),
    temp: se.join(wf, t, e)
  };
};
function _I(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ie.platform === "darwin" ? yI(e) : Ie.platform === "win32" ? $I(e) : vI(e);
}
const Kr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(r);
  };
}, Ir = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (s) {
      return r(s);
    }
  };
}, EI = 250, Wr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, a = i.interval ?? EI, o = Date.now() + s;
    return function c(...f) {
      return e.apply(void 0, f).catch((l) => {
        if (!r(l) || Date.now() >= o)
          throw l;
        const u = Math.round(a * Math.random());
        return u > 0 ? new Promise((p) => setTimeout(p, u)).then(() => c.apply(void 0, f)) : c.apply(void 0, f);
      });
    };
  };
}, Yr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, a = Date.now() + s;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (f) {
          if (!r(f) || Date.now() >= a)
            throw f;
          continue;
        }
    };
  };
}, Ri = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Ri.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !wI && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Ri.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Ri.isNodeError(e))
      throw e;
    if (!Ri.isChangeErrorOk(e))
      throw e;
  }
}, Ya = {
  onError: Ri.onChangeError
}, Ft = {
  onError: () => {
  }
}, wI = Ie.getuid ? !Ie.getuid() : !1, it = {
  isRetriable: Ri.isRetriableError
}, ot = {
  attempt: {
    /* ASYNC */
    chmod: Kr(nt(oe.chmod), Ya),
    chown: Kr(nt(oe.chown), Ya),
    close: Kr(nt(oe.close), Ft),
    fsync: Kr(nt(oe.fsync), Ft),
    mkdir: Kr(nt(oe.mkdir), Ft),
    realpath: Kr(nt(oe.realpath), Ft),
    stat: Kr(nt(oe.stat), Ft),
    unlink: Kr(nt(oe.unlink), Ft),
    /* SYNC */
    chmodSync: Ir(oe.chmodSync, Ya),
    chownSync: Ir(oe.chownSync, Ya),
    closeSync: Ir(oe.closeSync, Ft),
    existsSync: Ir(oe.existsSync, Ft),
    fsyncSync: Ir(oe.fsync, Ft),
    mkdirSync: Ir(oe.mkdirSync, Ft),
    realpathSync: Ir(oe.realpathSync, Ft),
    statSync: Ir(oe.statSync, Ft),
    unlinkSync: Ir(oe.unlinkSync, Ft)
  },
  retry: {
    /* ASYNC */
    close: Wr(nt(oe.close), it),
    fsync: Wr(nt(oe.fsync), it),
    open: Wr(nt(oe.open), it),
    readFile: Wr(nt(oe.readFile), it),
    rename: Wr(nt(oe.rename), it),
    stat: Wr(nt(oe.stat), it),
    write: Wr(nt(oe.write), it),
    writeFile: Wr(nt(oe.writeFile), it),
    /* SYNC */
    closeSync: Yr(oe.closeSync, it),
    fsyncSync: Yr(oe.fsyncSync, it),
    openSync: Yr(oe.openSync, it),
    readFileSync: Yr(oe.readFileSync, it),
    renameSync: Yr(oe.renameSync, it),
    statSync: Yr(oe.statSync, it),
    writeSync: Yr(oe.writeSync, it),
    writeFileSync: Yr(oe.writeFileSync, it)
  }
}, SI = "utf8", Mm = 438, bI = 511, PI = {}, TI = Ie.geteuid ? Ie.geteuid() : -1, NI = Ie.getegid ? Ie.getegid() : -1, AI = 1e3, RI = !!Ie.getuid;
Ie.getuid && Ie.getuid();
const xm = 128, OI = (e) => e instanceof Error && "code" in e, Vm = (e) => typeof e == "string", kl = (e) => e === void 0, II = Ie.platform === "linux", A$ = Ie.platform === "win32", Sf = ["SIGHUP", "SIGINT", "SIGTERM"];
A$ || Sf.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
II && Sf.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class CI {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (A$ && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ie.kill(Ie.pid, "SIGTERM") : Ie.kill(Ie.pid, t));
      }
    }, this.hook = () => {
      Ie.once("exit", () => this.exit());
      for (const t of Sf)
        try {
          Ie.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const DI = new CI(), kI = DI.register, ct = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, r = !0) => {
    const n = ct.truncate(t(e));
    return n in ct.store ? ct.get(e, t, r) : (ct.store[n] = r, [n, () => delete ct.store[n]]);
  },
  purge: (e) => {
    ct.store[e] && (delete ct.store[e], ot.attempt.unlink(e));
  },
  purgeSync: (e) => {
    ct.store[e] && (delete ct.store[e], ot.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in ct.store)
      ct.purgeSync(e);
  },
  truncate: (e) => {
    const t = se.basename(e);
    if (t.length <= xm)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - xm;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
kI(ct.purgeSyncAll);
function R$(e, t, r = PI) {
  if (Vm(r))
    return R$(e, t, { encoding: r });
  const i = { timeout: r.timeout ?? AI };
  let s = null, a = null, o = null;
  try {
    const c = ot.attempt.realpathSync(e), f = !!c;
    e = c || e, [a, s] = ct.get(e, r.tmpCreate || ct.create, r.tmpPurge !== !1);
    const l = RI && kl(r.chown), u = kl(r.mode);
    if (f && (l || u)) {
      const h = ot.attempt.statSync(e);
      h && (r = { ...r }, l && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!f) {
      const h = se.dirname(e);
      ot.attempt.mkdirSync(h, {
        mode: bI,
        recursive: !0
      });
    }
    o = ot.retry.openSync(i)(a, "w", r.mode || Mm), r.tmpCreated && r.tmpCreated(a), Vm(t) ? ot.retry.writeSync(i)(o, t, 0, r.encoding || SI) : kl(t) || ot.retry.writeSync(i)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? ot.retry.fsyncSync(i)(o) : ot.attempt.fsync(o)), ot.retry.closeSync(i)(o), o = null, r.chown && (r.chown.uid !== TI || r.chown.gid !== NI) && ot.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Mm && ot.attempt.chmodSync(a, r.mode);
    try {
      ot.retry.renameSync(i)(a, e);
    } catch (h) {
      if (!OI(h) || h.code !== "ENAMETOOLONG")
        throw h;
      ot.retry.renameSync(i)(a, ct.truncate(e));
    }
    s(), a = null;
  } finally {
    o && ot.attempt.closeSync(o), a && ct.purge(a);
  }
}
var $u = { exports: {} }, O$ = {}, ir = {}, Bi = {}, ya = {}, ce = {}, ra = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
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
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((N, C) => `${N}${C}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((N, C) => (C instanceof r && (N[C.str] = (N[C.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(m, ...w) {
    const N = [m[0]];
    let C = 0;
    for (; C < w.length; )
      o(N, w[C]), N.push(m[++C]);
    return new n(N);
  }
  e._ = i;
  const s = new n("+");
  function a(m, ...w) {
    const N = [p(m[0])];
    let C = 0;
    for (; C < w.length; )
      N.push(s), o(N, w[C]), N.push(s, p(m[++C]));
    return c(N), new n(N);
  }
  e.str = a;
  function o(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(u(w));
  }
  e.addCodeArg = o;
  function c(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === s) {
        const N = f(m[w - 1], m[w + 1]);
        if (N !== void 0) {
          m.splice(w - 1, 3, N);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function f(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function l(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : a`${m}${w}`;
  }
  e.strConcat = l;
  function u(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : p(Array.isArray(m) ? m.join(",") : m);
  }
  function h(m) {
    return new n(p(m));
  }
  e.stringify = h;
  function p(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = p;
  function _(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : i`[${m}]`;
  }
  e.getProperty = _;
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function v(m) {
    return new n(m.toString());
  }
  e.regexpCode = v;
})(ra);
var vu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = ra;
  class r extends Error {
    constructor(f) {
      super(`CodeGen: "code" for ${f} not defined`), this.value = f.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: f, parent: l } = {}) {
      this._names = {}, this._prefixes = f, this._parent = l;
    }
    toName(f) {
      return f instanceof t.Name ? f : this.name(f);
    }
    name(f) {
      return new t.Name(this._newName(f));
    }
    _newName(f) {
      const l = this._names[f] || this._nameGroup(f);
      return `${f}${l.index++}`;
    }
    _nameGroup(f) {
      var l, u;
      if (!((u = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || u === void 0) && u.has(f) || this._prefixes && !this._prefixes.has(f))
        throw new Error(`CodeGen: prefix "${f}" is not allowed in this scope`);
      return this._names[f] = { prefix: f, index: 0 };
    }
  }
  e.Scope = i;
  class s extends t.Name {
    constructor(f, l) {
      super(l), this.prefix = f;
    }
    setValue(f, { property: l, itemIndex: u }) {
      this.value = f, this.scopePath = (0, t._)`.${new t.Name(l)}[${u}]`;
    }
  }
  e.ValueScopeName = s;
  const a = (0, t._)`\n`;
  class o extends i {
    constructor(f) {
      super(f), this._values = {}, this._scope = f.scope, this.opts = { ...f, _n: f.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(f) {
      return new s(f, this._newName(f));
    }
    value(f, l) {
      var u;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const h = this.toName(f), { prefix: p } = h, _ = (u = l.key) !== null && u !== void 0 ? u : l.ref;
      let g = this._values[p];
      if (g) {
        const w = g.get(_);
        if (w)
          return w;
      } else
        g = this._values[p] = /* @__PURE__ */ new Map();
      g.set(_, h);
      const v = this._scope[p] || (this._scope[p] = []), m = v.length;
      return v[m] = l.ref, h.setValue(l, { property: p, itemIndex: m }), h;
    }
    getValue(f, l) {
      const u = this._values[f];
      if (u)
        return u.get(l);
    }
    scopeRefs(f, l = this._values) {
      return this._reduceValues(l, (u) => {
        if (u.scopePath === void 0)
          throw new Error(`CodeGen: name "${u}" has no value`);
        return (0, t._)`${f}${u.scopePath}`;
      });
    }
    scopeCode(f = this._values, l, u) {
      return this._reduceValues(f, (h) => {
        if (h.value === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return h.value.code;
      }, l, u);
    }
    _reduceValues(f, l, u = {}, h) {
      let p = t.nil;
      for (const _ in f) {
        const g = f[_];
        if (!g)
          continue;
        const v = u[_] = u[_] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let w = l(m);
          if (w) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            p = (0, t._)`${p}${N} ${m} = ${w};${this.opts._n}`;
          } else if (w = h == null ? void 0 : h(m))
            p = (0, t._)`${p}${w}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return p;
    }
  }
  e.ValueScope = o;
})(vu);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = ra, r = vu;
  var n = ra;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = vu;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
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
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, $) {
      return this;
    }
  }
  class a extends s {
    constructor(d, $, A) {
      super(), this.varKind = d, this.name = $, this.rhs = A;
    }
    render({ es5: d, _n: $ }) {
      const A = d ? r.varKinds.var : this.varKind, E = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${A} ${this.name}${E};` + $;
    }
    optimizeNames(d, $) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = k(this.rhs, d, $)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class o extends s {
    constructor(d, $, A) {
      super(), this.lhs = d, this.rhs = $, this.sideEffects = A;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, $) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = k(this.rhs, d, $), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(d, this.rhs);
    }
  }
  class c extends o {
    constructor(d, $, A, E) {
      super(d, A, E), this.op = $;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class f extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class u extends s {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class h extends s {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, $) {
      return this.code = k(this.code, d, $), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class p extends s {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce(($, A) => $ + A.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let $ = d.length;
      for (; $--; ) {
        const A = d[$].optimizeNodes();
        Array.isArray(A) ? d.splice($, 1, ...A) : A ? d[$] = A : d.splice($, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, $) {
      const { nodes: A } = this;
      let E = A.length;
      for (; E--; ) {
        const y = A[E];
        y.optimizeNames(d, $) || (D(d, y.names), A.splice(E, 1));
      }
      return A.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, $) => G(d, $.names), {});
    }
  }
  class _ extends p {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class g extends p {
  }
  class v extends _ {
  }
  v.kind = "else";
  class m extends _ {
    constructor(d, $) {
      super($), this.condition = d;
    }
    render(d) {
      let $ = `if(${this.condition})` + super.render(d);
      return this.else && ($ += "else " + this.else.render(d)), $;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let $ = this.else;
      if ($) {
        const A = $.optimizeNodes();
        $ = this.else = Array.isArray(A) ? new v(A) : A;
      }
      if ($)
        return d === !1 ? $ instanceof m ? $ : $.nodes : this.nodes.length ? this : new m(x(d), $ instanceof m ? [$] : $.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, $) {
      var A;
      if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(d, $), !!(super.optimizeNames(d, $) || this.else))
        return this.condition = k(this.condition, d, $), this;
    }
    get names() {
      const d = super.names;
      return Q(d, this.condition), this.else && G(d, this.else.names), d;
    }
  }
  m.kind = "if";
  class w extends _ {
  }
  w.kind = "for";
  class N extends w {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, $) {
      if (super.optimizeNames(d, $))
        return this.iteration = k(this.iteration, d, $), this;
    }
    get names() {
      return G(super.names, this.iteration.names);
    }
  }
  class C extends w {
    constructor(d, $, A, E) {
      super(), this.varKind = d, this.name = $, this.from = A, this.to = E;
    }
    render(d) {
      const $ = d.es5 ? r.varKinds.var : this.varKind, { name: A, from: E, to: y } = this;
      return `for(${$} ${A}=${E}; ${A}<${y}; ${A}++)` + super.render(d);
    }
    get names() {
      const d = Q(super.names, this.from);
      return Q(d, this.to);
    }
  }
  class M extends w {
    constructor(d, $, A, E) {
      super(), this.loop = d, this.varKind = $, this.name = A, this.iterable = E;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, $) {
      if (super.optimizeNames(d, $))
        return this.iterable = k(this.iterable, d, $), this;
    }
    get names() {
      return G(super.names, this.iterable.names);
    }
  }
  class z extends _ {
    constructor(d, $, A) {
      super(), this.name = d, this.args = $, this.async = A;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  z.kind = "func";
  class K extends p {
    render(d) {
      return "return " + super.render(d);
    }
  }
  K.kind = "return";
  class pe extends _ {
    render(d) {
      let $ = "try" + super.render(d);
      return this.catch && ($ += this.catch.render(d)), this.finally && ($ += this.finally.render(d)), $;
    }
    optimizeNodes() {
      var d, $;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), ($ = this.finally) === null || $ === void 0 || $.optimizeNodes(), this;
    }
    optimizeNames(d, $) {
      var A, E;
      return super.optimizeNames(d, $), (A = this.catch) === null || A === void 0 || A.optimizeNames(d, $), (E = this.finally) === null || E === void 0 || E.optimizeNames(d, $), this;
    }
    get names() {
      const d = super.names;
      return this.catch && G(d, this.catch.names), this.finally && G(d, this.finally.names), d;
    }
  }
  class I extends _ {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  I.kind = "catch";
  class Z extends _ {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  Z.kind = "finally";
  class B {
    constructor(d, $ = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...$, _n: $.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, $) {
      const A = this._extScope.value(d, $);
      return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
    }
    getScopeValue(d, $) {
      return this._extScope.getValue(d, $);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, $, A, E) {
      const y = this._scope.toName($);
      return A !== void 0 && E && (this._constants[y.str] = A), this._leafNode(new a(d, y, A)), y;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, $, A) {
      return this._def(r.varKinds.const, d, $, A);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, $, A) {
      return this._def(r.varKinds.let, d, $, A);
    }
    // `var` declaration with optional assignment
    var(d, $, A) {
      return this._def(r.varKinds.var, d, $, A);
    }
    // assignment code
    assign(d, $, A) {
      return this._leafNode(new o(d, $, A));
    }
    // `+=` code
    add(d, $) {
      return this._leafNode(new c(d, e.operators.ADD, $));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new h(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const $ = ["{"];
      for (const [A, E] of d)
        $.length > 1 && $.push(","), $.push(A), (A !== E || this.opts.es5) && ($.push(":"), (0, t.addCodeArg)($, E));
      return $.push("}"), new t._Code($);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, $, A) {
      if (this._blockNode(new m(d)), $ && A)
        this.code($).else().code(A).endIf();
      else if ($)
        this.code($).endIf();
      else if (A)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new m(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(d, $) {
      return this._blockNode(d), $ && this.code($).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, $) {
      return this._for(new N(d), $);
    }
    // `for` statement for a range of values
    forRange(d, $, A, E, y = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const j = this._scope.toName(d);
      return this._for(new C(y, j, $, A), () => E(j));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, $, A, E = r.varKinds.const) {
      const y = this._scope.toName(d);
      if (this.opts.es5) {
        const j = $ instanceof t.Name ? $ : this.var("_arr", $);
        return this.forRange("_i", 0, (0, t._)`${j}.length`, (O) => {
          this.var(y, (0, t._)`${j}[${O}]`), A(y);
        });
      }
      return this._for(new M("of", E, y, $), () => A(y));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, $, A, E = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${$})`, A);
      const y = this._scope.toName(d);
      return this._for(new M("in", E, y, $), () => A(y));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new f(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const $ = new K();
      if (this._blockNode($), this.code(d), $.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(K);
    }
    // `try` statement
    try(d, $, A) {
      if (!$ && !A)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const E = new pe();
      if (this._blockNode(E), this.code(d), $) {
        const y = this.name("e");
        this._currNode = E.catch = new I(y), $(y);
      }
      return A && (this._currNode = E.finally = new Z(), this.code(A)), this._endBlockNode(I, Z);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new u(d));
    }
    // start self-balancing block
    block(d, $) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock($), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const $ = this._blockStarts.pop();
      if ($ === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const A = this._nodes.length - $;
      if (A < 0 || d !== void 0 && A !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${d} expected`);
      return this._nodes.length = $, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, $ = t.nil, A, E) {
      return this._blockNode(new z(d, $, A)), E && this.code(E).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, $) {
      const A = this._currNode;
      if (A instanceof d || $ && A instanceof $)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${$ ? `${d.kind}/${$.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const $ = this._currNode;
      if (!($ instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = $.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const $ = this._nodes;
      $[$.length - 1] = d;
    }
  }
  e.CodeGen = B;
  function G(b, d) {
    for (const $ in d)
      b[$] = (b[$] || 0) + (d[$] || 0);
    return b;
  }
  function Q(b, d) {
    return d instanceof t._CodeOrName ? G(b, d.names) : b;
  }
  function k(b, d, $) {
    if (b instanceof t.Name)
      return A(b);
    if (!E(b))
      return b;
    return new t._Code(b._items.reduce((y, j) => (j instanceof t.Name && (j = A(j)), j instanceof t._Code ? y.push(...j._items) : y.push(j), y), []));
    function A(y) {
      const j = $[y.str];
      return j === void 0 || d[y.str] !== 1 ? y : (delete d[y.str], j);
    }
    function E(y) {
      return y instanceof t._Code && y._items.some((j) => j instanceof t.Name && d[j.str] === 1 && $[j.str] !== void 0);
    }
  }
  function D(b, d) {
    for (const $ in d)
      b[$] = (b[$] || 0) - (d[$] || 0);
  }
  function x(b) {
    return typeof b == "boolean" || typeof b == "number" || b === null ? !b : (0, t._)`!${P(b)}`;
  }
  e.not = x;
  const L = S(e.operators.AND);
  function V(...b) {
    return b.reduce(L);
  }
  e.and = V;
  const U = S(e.operators.OR);
  function R(...b) {
    return b.reduce(U);
  }
  e.or = R;
  function S(b) {
    return (d, $) => d === t.nil ? $ : $ === t.nil ? d : (0, t._)`${P(d)} ${b} ${P($)}`;
  }
  function P(b) {
    return b instanceof t.Name ? b : (0, t._)`(${b})`;
  }
})(ce);
var W = {};
Object.defineProperty(W, "__esModule", { value: !0 });
W.checkStrictMode = W.getErrorPath = W.Type = W.useFunc = W.setEvaluated = W.evaluatedPropsToName = W.mergeEvaluated = W.eachItem = W.unescapeJsonPointer = W.escapeJsonPointer = W.escapeFragment = W.unescapeFragment = W.schemaRefOrVal = W.schemaHasRulesButRef = W.schemaHasRules = W.checkUnknownRules = W.alwaysValidSchema = W.toHash = void 0;
const Se = ce, FI = ra;
function LI(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
W.toHash = LI;
function jI(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (I$(e, t), !C$(t, e.self.RULES.all));
}
W.alwaysValidSchema = jI;
function I$(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || F$(e, `unknown keyword: "${s}"`);
}
W.checkUnknownRules = I$;
function C$(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
W.schemaHasRules = C$;
function UI(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
W.schemaHasRulesButRef = UI;
function MI({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, Se._)`${r}`;
  }
  return (0, Se._)`${e}${t}${(0, Se.getProperty)(n)}`;
}
W.schemaRefOrVal = MI;
function xI(e) {
  return D$(decodeURIComponent(e));
}
W.unescapeFragment = xI;
function VI(e) {
  return encodeURIComponent(bf(e));
}
W.escapeFragment = VI;
function bf(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
W.escapeJsonPointer = bf;
function D$(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
W.unescapeJsonPointer = D$;
function qI(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
W.eachItem = qI;
function qm({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, a, o) => {
    const c = a === void 0 ? s : a instanceof Se.Name ? (s instanceof Se.Name ? e(i, s, a) : t(i, s, a), a) : s instanceof Se.Name ? (t(i, a, s), s) : r(s, a);
    return o === Se.Name && !(c instanceof Se.Name) ? n(i, c) : c;
  };
}
W.mergeEvaluated = {
  props: qm({
    mergeNames: (e, t, r) => e.if((0, Se._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, Se._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, Se._)`${r} || {}`).code((0, Se._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, Se._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, Se._)`${r} || {}`), Pf(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: k$
  }),
  items: qm({
    mergeNames: (e, t, r) => e.if((0, Se._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, Se._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, Se._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, Se._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function k$(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, Se._)`{}`);
  return t !== void 0 && Pf(e, r, t), r;
}
W.evaluatedPropsToName = k$;
function Pf(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, Se._)`${t}${(0, Se.getProperty)(n)}`, !0));
}
W.setEvaluated = Pf;
const Bm = {};
function BI(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Bm[t.code] || (Bm[t.code] = new FI._Code(t.code))
  });
}
W.useFunc = BI;
var _u;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(_u || (W.Type = _u = {}));
function GI(e, t, r) {
  if (e instanceof Se.Name) {
    const n = t === _u.Num;
    return r ? n ? (0, Se._)`"[" + ${e} + "]"` : (0, Se._)`"['" + ${e} + "']"` : n ? (0, Se._)`"/" + ${e}` : (0, Se._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, Se.getProperty)(e).toString() : "/" + bf(e);
}
W.getErrorPath = GI;
function F$(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
W.checkStrictMode = F$;
var Lt = {};
Object.defineProperty(Lt, "__esModule", { value: !0 });
const st = ce, HI = {
  // validation function arguments
  data: new st.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new st.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new st.Name("instancePath"),
  parentData: new st.Name("parentData"),
  parentDataProperty: new st.Name("parentDataProperty"),
  rootData: new st.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new st.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new st.Name("vErrors"),
  // null or array of validation errors
  errors: new st.Name("errors"),
  // counter of validation errors
  this: new st.Name("this"),
  // "globals"
  self: new st.Name("self"),
  scope: new st.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new st.Name("json"),
  jsonPos: new st.Name("jsonPos"),
  jsonLen: new st.Name("jsonLen"),
  jsonPart: new st.Name("jsonPart")
};
Lt.default = HI;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ce, r = W, n = Lt;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, m = e.keywordError, w, N) {
    const { it: C } = v, { gen: M, compositeRule: z, allErrors: K } = C, pe = u(v, m, w);
    N ?? (z || K) ? c(M, pe) : f(C, (0, t._)`[${pe}]`);
  }
  e.reportError = i;
  function s(v, m = e.keywordError, w) {
    const { it: N } = v, { gen: C, compositeRule: M, allErrors: z } = N, K = u(v, m, w);
    c(C, K), M || z || f(N, n.default.vErrors);
  }
  e.reportExtraError = s;
  function a(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function o({ gen: v, keyword: m, schemaValue: w, data: N, errsCount: C, it: M }) {
    if (C === void 0)
      throw new Error("ajv implementation error");
    const z = v.name("err");
    v.forRange("i", C, n.default.errors, (K) => {
      v.const(z, (0, t._)`${n.default.vErrors}[${K}]`), v.if((0, t._)`${z}.instancePath === undefined`, () => v.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, M.errorPath))), v.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${M.errSchemaPath}/${m}`), M.opts.verbose && (v.assign((0, t._)`${z}.schema`, w), v.assign((0, t._)`${z}.data`, N));
    });
  }
  e.extendErrors = o;
  function c(v, m) {
    const w = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function f(v, m) {
    const { gen: w, validateName: N, schemaEnv: C } = v;
    C.$async ? w.throw((0, t._)`new ${v.ValidationError}(${m})`) : (w.assign((0, t._)`${N}.errors`, m), w.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function u(v, m, w) {
    const { createErrors: N } = v.it;
    return N === !1 ? (0, t._)`{}` : h(v, m, w);
  }
  function h(v, m, w = {}) {
    const { gen: N, it: C } = v, M = [
      p(C, w),
      _(v, w)
    ];
    return g(v, m, M), N.object(...M);
  }
  function p({ errorPath: v }, { instancePath: m }) {
    const w = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function _({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: N }) {
    let C = N ? m : (0, t.str)`${m}/${v}`;
    return w && (C = (0, t.str)`${C}${(0, r.getErrorPath)(w, r.Type.Str)}`), [l.schemaPath, C];
  }
  function g(v, { params: m, message: w }, N) {
    const { keyword: C, data: M, schemaValue: z, it: K } = v, { opts: pe, propertyName: I, topSchemaRef: Z, schemaPath: B } = K;
    N.push([l.keyword, C], [l.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), pe.messages && N.push([l.message, typeof w == "function" ? w(v) : w]), pe.verbose && N.push([l.schema, z], [l.parentSchema, (0, t._)`${Z}${B}`], [n.default.data, M]), I && N.push([l.propertyName, I]);
  }
})(ya);
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.boolOrEmptySchema = Bi.topBoolOrEmptySchema = void 0;
const zI = ya, KI = ce, WI = Lt, YI = {
  message: "boolean schema is false"
};
function XI(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? L$(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(WI.default.data) : (t.assign((0, KI._)`${n}.errors`, null), t.return(!0));
}
Bi.topBoolOrEmptySchema = XI;
function JI(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), L$(e)) : r.var(t, !0);
}
Bi.boolOrEmptySchema = JI;
function L$(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, zI.reportError)(i, YI, void 0, t);
}
var Ve = {}, ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.getRules = ei.isJSONType = void 0;
const QI = ["string", "number", "integer", "boolean", "null", "object", "array"], ZI = new Set(QI);
function eC(e) {
  return typeof e == "string" && ZI.has(e);
}
ei.isJSONType = eC;
function tC() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ei.getRules = tC;
var Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.shouldUseRule = Dr.shouldUseGroup = Dr.schemaHasRulesForType = void 0;
function rC({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && j$(e, n);
}
Dr.schemaHasRulesForType = rC;
function j$(e, t) {
  return t.rules.some((r) => U$(e, r));
}
Dr.shouldUseGroup = j$;
function U$(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Dr.shouldUseRule = U$;
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.reportTypeError = Ve.checkDataTypes = Ve.checkDataType = Ve.coerceAndCheckDataType = Ve.getJSONTypes = Ve.getSchemaTypes = Ve.DataType = void 0;
const nC = ei, iC = Dr, sC = ya, ue = ce, M$ = W;
var Di;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Di || (Ve.DataType = Di = {}));
function aC(e) {
  const t = x$(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Ve.getSchemaTypes = aC;
function x$(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(nC.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ve.getJSONTypes = x$;
function oC(e, t) {
  const { gen: r, data: n, opts: i } = e, s = cC(t, i.coerceTypes), a = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, iC.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const o = Tf(t, n, i.strictNumbers, Di.Wrong);
    r.if(o, () => {
      s.length ? lC(e, t, s) : Nf(e);
    });
  }
  return a;
}
Ve.coerceAndCheckDataType = oC;
const V$ = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function cC(e, t) {
  return t ? e.filter((r) => V$.has(r) || t === "array" && r === "array") : [];
}
function lC(e, t, r) {
  const { gen: n, data: i, opts: s } = e, a = n.let("dataType", (0, ue._)`typeof ${i}`), o = n.let("coerced", (0, ue._)`undefined`);
  s.coerceTypes === "array" && n.if((0, ue._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, ue._)`${i}[0]`).assign(a, (0, ue._)`typeof ${i}`).if(Tf(t, i, s.strictNumbers), () => n.assign(o, i))), n.if((0, ue._)`${o} !== undefined`);
  for (const f of r)
    (V$.has(f) || f === "array" && s.coerceTypes === "array") && c(f);
  n.else(), Nf(e), n.endIf(), n.if((0, ue._)`${o} !== undefined`, () => {
    n.assign(i, o), uC(e, o);
  });
  function c(f) {
    switch (f) {
      case "string":
        n.elseIf((0, ue._)`${a} == "number" || ${a} == "boolean"`).assign(o, (0, ue._)`"" + ${i}`).elseIf((0, ue._)`${i} === null`).assign(o, (0, ue._)`""`);
        return;
      case "number":
        n.elseIf((0, ue._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(o, (0, ue._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, ue._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(o, (0, ue._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, ue._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(o, !1).elseIf((0, ue._)`${i} === "true" || ${i} === 1`).assign(o, !0);
        return;
      case "null":
        n.elseIf((0, ue._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(o, null);
        return;
      case "array":
        n.elseIf((0, ue._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(o, (0, ue._)`[${i}]`);
    }
  }
}
function uC({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ue._)`${t} !== undefined`, () => e.assign((0, ue._)`${t}[${r}]`, n));
}
function Eu(e, t, r, n = Di.Correct) {
  const i = n === Di.Correct ? ue.operators.EQ : ue.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, ue._)`${t} ${i} null`;
    case "array":
      s = (0, ue._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, ue._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = a((0, ue._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = a();
      break;
    default:
      return (0, ue._)`typeof ${t} ${i} ${e}`;
  }
  return n === Di.Correct ? s : (0, ue.not)(s);
  function a(o = ue.nil) {
    return (0, ue.and)((0, ue._)`typeof ${t} == "number"`, o, r ? (0, ue._)`isFinite(${t})` : ue.nil);
  }
}
Ve.checkDataType = Eu;
function Tf(e, t, r, n) {
  if (e.length === 1)
    return Eu(e[0], t, r, n);
  let i;
  const s = (0, M$.toHash)(e);
  if (s.array && s.object) {
    const a = (0, ue._)`typeof ${t} != "object"`;
    i = s.null ? a : (0, ue._)`!${t} || ${a}`, delete s.null, delete s.array, delete s.object;
  } else
    i = ue.nil;
  s.number && delete s.integer;
  for (const a in s)
    i = (0, ue.and)(i, Eu(a, t, r, n));
  return i;
}
Ve.checkDataTypes = Tf;
const fC = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ue._)`{type: ${e}}` : (0, ue._)`{type: ${t}}`
};
function Nf(e) {
  const t = dC(e);
  (0, sC.reportError)(t, fC);
}
Ve.reportTypeError = Nf;
function dC(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, M$.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Nc = {};
Object.defineProperty(Nc, "__esModule", { value: !0 });
Nc.assignDefaults = void 0;
const hi = ce, hC = W;
function pC(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      Gm(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => Gm(e, s, i.default));
}
Nc.assignDefaults = pC;
function Gm(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: a } = e;
  if (r === void 0)
    return;
  const o = (0, hi._)`${s}${(0, hi.getProperty)(t)}`;
  if (i) {
    (0, hC.checkStrictMode)(e, `default is ignored for: ${o}`);
    return;
  }
  let c = (0, hi._)`${o} === undefined`;
  a.useDefaults === "empty" && (c = (0, hi._)`${c} || ${o} === null || ${o} === ""`), n.if(c, (0, hi._)`${o} = ${(0, hi.stringify)(r)}`);
}
var $r = {}, me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.validateUnion = me.validateArray = me.usePattern = me.callValidateCode = me.schemaProperties = me.allSchemaProperties = me.noPropertyInData = me.propertyInData = me.isOwnProperty = me.hasPropFunc = me.reportMissingProp = me.checkMissingProp = me.checkReportMissingProp = void 0;
const Ae = ce, Af = W, Xr = Lt, mC = W;
function gC(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(Of(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Ae._)`${t}` }, !0), e.error();
  });
}
me.checkReportMissingProp = gC;
function yC({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Ae.or)(...n.map((s) => (0, Ae.and)(Of(e, t, s, r.ownProperties), (0, Ae._)`${i} = ${s}`)));
}
me.checkMissingProp = yC;
function $C(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
me.reportMissingProp = $C;
function q$(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Ae._)`Object.prototype.hasOwnProperty`
  });
}
me.hasPropFunc = q$;
function Rf(e, t, r) {
  return (0, Ae._)`${q$(e)}.call(${t}, ${r})`;
}
me.isOwnProperty = Rf;
function vC(e, t, r, n) {
  const i = (0, Ae._)`${t}${(0, Ae.getProperty)(r)} !== undefined`;
  return n ? (0, Ae._)`${i} && ${Rf(e, t, r)}` : i;
}
me.propertyInData = vC;
function Of(e, t, r, n) {
  const i = (0, Ae._)`${t}${(0, Ae.getProperty)(r)} === undefined`;
  return n ? (0, Ae.or)(i, (0, Ae.not)(Rf(e, t, r))) : i;
}
me.noPropertyInData = Of;
function B$(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
me.allSchemaProperties = B$;
function _C(e, t) {
  return B$(t).filter((r) => !(0, Af.alwaysValidSchema)(e, t[r]));
}
me.schemaProperties = _C;
function EC({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: a }, o, c, f) {
  const l = f ? (0, Ae._)`${e}, ${t}, ${n}${i}` : t, u = [
    [Xr.default.instancePath, (0, Ae.strConcat)(Xr.default.instancePath, s)],
    [Xr.default.parentData, a.parentData],
    [Xr.default.parentDataProperty, a.parentDataProperty],
    [Xr.default.rootData, Xr.default.rootData]
  ];
  a.opts.dynamicRef && u.push([Xr.default.dynamicAnchors, Xr.default.dynamicAnchors]);
  const h = (0, Ae._)`${l}, ${r.object(...u)}`;
  return c !== Ae.nil ? (0, Ae._)`${o}.call(${c}, ${h})` : (0, Ae._)`${o}(${h})`;
}
me.callValidateCode = EC;
const wC = (0, Ae._)`new RegExp`;
function SC({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Ae._)`${i.code === "new RegExp" ? wC : (0, mC.useFunc)(e, i)}(${r}, ${n})`
  });
}
me.usePattern = SC;
function bC(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, s = t.name("valid");
  if (i.allErrors) {
    const o = t.let("valid", !0);
    return a(() => t.assign(o, !1)), o;
  }
  return t.var(s, !0), a(() => t.break()), s;
  function a(o) {
    const c = t.const("len", (0, Ae._)`${r}.length`);
    t.forRange("i", 0, c, (f) => {
      e.subschema({
        keyword: n,
        dataProp: f,
        dataPropType: Af.Type.Num
      }, s), t.if((0, Ae.not)(s), o);
    });
  }
}
me.validateArray = bC;
function PC(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Af.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const a = t.let("valid", !1), o = t.name("_valid");
  t.block(() => r.forEach((c, f) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: f,
      compositeRule: !0
    }, o);
    t.assign(a, (0, Ae._)`${a} || ${o}`), e.mergeValidEvaluated(l, o) || t.if((0, Ae.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
me.validateUnion = PC;
Object.defineProperty($r, "__esModule", { value: !0 });
$r.validateKeywordUsage = $r.validSchemaType = $r.funcKeywordCode = $r.macroKeywordCode = void 0;
const ht = ce, Mn = Lt, TC = me, NC = ya;
function AC(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: a } = e, o = t.macro.call(a.self, i, s, a), c = G$(r, n, o);
  a.opts.validateSchema !== !1 && a.self.validateSchema(o, !0);
  const f = r.name("valid");
  e.subschema({
    schema: o,
    schemaPath: ht.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, f), e.pass(f, () => e.error(!0));
}
$r.macroKeywordCode = AC;
function RC(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: a, $data: o, it: c } = e;
  IC(c, t);
  const f = !o && t.compile ? t.compile.call(c.self, s, a, c) : t.validate, l = G$(n, i, f), u = n.let("valid");
  e.block$data(u, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : u);
  function h() {
    if (t.errors === !1)
      g(), t.modifying && Hm(e), v(() => e.error());
    else {
      const m = t.async ? p() : _();
      t.modifying && Hm(e), v(() => OC(e, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => g((0, ht._)`await `), (w) => n.assign(u, !1).if((0, ht._)`${w} instanceof ${c.ValidationError}`, () => n.assign(m, (0, ht._)`${w}.errors`), () => n.throw(w))), m;
  }
  function _() {
    const m = (0, ht._)`${l}.errors`;
    return n.assign(m, null), g(ht.nil), m;
  }
  function g(m = t.async ? (0, ht._)`await ` : ht.nil) {
    const w = c.opts.passContext ? Mn.default.this : Mn.default.self, N = !("compile" in t && !o || t.schema === !1);
    n.assign(u, (0, ht._)`${m}${(0, TC.callValidateCode)(e, l, w, N)}`, t.modifying);
  }
  function v(m) {
    var w;
    n.if((0, ht.not)((w = t.valid) !== null && w !== void 0 ? w : u), m);
  }
}
$r.funcKeywordCode = RC;
function Hm(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ht._)`${n.parentData}[${n.parentDataProperty}]`));
}
function OC(e, t) {
  const { gen: r } = e;
  r.if((0, ht._)`Array.isArray(${t})`, () => {
    r.assign(Mn.default.vErrors, (0, ht._)`${Mn.default.vErrors} === null ? ${t} : ${Mn.default.vErrors}.concat(${t})`).assign(Mn.default.errors, (0, ht._)`${Mn.default.vErrors}.length`), (0, NC.extendErrors)(e);
  }, () => e.error());
}
function IC({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function G$(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ht.stringify)(r) });
}
function CC(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
$r.validSchemaType = CC;
function DC({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const a = i.dependencies;
  if (a != null && a.some((o) => !Object.prototype.hasOwnProperty.call(e, o)))
    throw new Error(`parent schema must have dependencies of ${s}: ${a.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[s])) {
    const c = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
$r.validateKeywordUsage = DC;
var gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.extendSubschemaMode = gn.extendSubschemaData = gn.getSubschema = void 0;
const gr = ce, H$ = W;
function kC(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const o = e.schema[t];
    return r === void 0 ? {
      schema: o,
      schemaPath: (0, gr._)`${e.schemaPath}${(0, gr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: o[r],
      schemaPath: (0, gr._)`${e.schemaPath}${(0, gr.getProperty)(t)}${(0, gr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, H$.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: a,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
gn.getSubschema = kC;
function FC(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: a }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: o } = t;
  if (r !== void 0) {
    const { errorPath: f, dataPathArr: l, opts: u } = t, h = o.let("data", (0, gr._)`${t.data}${(0, gr.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, gr.str)`${f}${(0, H$.getErrorPath)(r, n, u.jsPropertySyntax)}`, e.parentDataProperty = (0, gr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const f = i instanceof gr.Name ? i : o.let("data", i, !0);
    c(f), a !== void 0 && (e.propertyName = a);
  }
  s && (e.dataTypes = s);
  function c(f) {
    e.data = f, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, f];
  }
}
gn.extendSubschemaData = FC;
function LC(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
gn.extendSubschemaMode = LC;
var Je = {}, Ac = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, i, s;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (i = n; i-- !== 0; )
        if (!e(t[i], r[i])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (s = Object.keys(t), n = s.length, n !== Object.keys(r).length) return !1;
    for (i = n; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, s[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var a = s[i];
      if (!e(t[a], r[a])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, z$ = { exports: {} }, dn = z$.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  wo(t, n, i, e, "", e);
};
dn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
dn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
dn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
dn.skipKeywords = {
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
function wo(e, t, r, n, i, s, a, o, c, f) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, a, o, c, f);
    for (var l in n) {
      var u = n[l];
      if (Array.isArray(u)) {
        if (l in dn.arrayKeywords)
          for (var h = 0; h < u.length; h++)
            wo(e, t, r, u[h], i + "/" + l + "/" + h, s, i, l, n, h);
      } else if (l in dn.propsKeywords) {
        if (u && typeof u == "object")
          for (var p in u)
            wo(e, t, r, u[p], i + "/" + l + "/" + jC(p), s, i, l, n, p);
      } else (l in dn.keywords || e.allKeys && !(l in dn.skipKeywords)) && wo(e, t, r, u, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, a, o, c, f);
  }
}
function jC(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var UC = z$.exports;
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.getSchemaRefs = Je.resolveUrl = Je.normalizeId = Je._getFullPath = Je.getFullPath = Je.inlineRef = void 0;
const MC = W, xC = Ac, VC = UC, qC = /* @__PURE__ */ new Set([
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
function BC(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !wu(e) : t ? K$(e) <= t : !1;
}
Je.inlineRef = BC;
const GC = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function wu(e) {
  for (const t in e) {
    if (GC.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(wu) || typeof r == "object" && wu(r))
      return !0;
  }
  return !1;
}
function K$(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !qC.has(r) && (typeof e[r] == "object" && (0, MC.eachItem)(e[r], (n) => t += K$(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function W$(e, t = "", r) {
  r !== !1 && (t = ki(t));
  const n = e.parse(t);
  return Y$(e, n);
}
Je.getFullPath = W$;
function Y$(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Je._getFullPath = Y$;
const HC = /#\/?$/;
function ki(e) {
  return e ? e.replace(HC, "") : "";
}
Je.normalizeId = ki;
function zC(e, t, r) {
  return r = ki(r), e.resolve(t, r);
}
Je.resolveUrl = zC;
const KC = /^[a-z_][-a-z0-9._]*$/i;
function WC(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = ki(e[r] || t), s = { "": i }, a = W$(n, i, !1), o = {}, c = /* @__PURE__ */ new Set();
  return VC(e, { allKeys: !0 }, (u, h, p, _) => {
    if (_ === void 0)
      return;
    const g = a + h;
    let v = s[_];
    typeof u[r] == "string" && (v = m.call(this, u[r])), w.call(this, u.$anchor), w.call(this, u.$dynamicAnchor), s[h] = v;
    function m(N) {
      const C = this.opts.uriResolver.resolve;
      if (N = ki(v ? C(v, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let M = this.refs[N];
      return typeof M == "string" && (M = this.refs[M]), typeof M == "object" ? f(u, M.schema, N) : N !== ki(g) && (N[0] === "#" ? (f(u, o[N], N), o[N] = u) : this.refs[N] = g), N;
    }
    function w(N) {
      if (typeof N == "string") {
        if (!KC.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), o;
  function f(u, h, p) {
    if (h !== void 0 && !xC(u, h))
      throw l(p);
  }
  function l(u) {
    return new Error(`reference "${u}" resolves to more than one schema`);
  }
}
Je.getSchemaRefs = WC;
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.getData = ir.KeywordCxt = ir.validateFunctionCode = void 0;
const X$ = Bi, zm = Ve, If = Dr, Go = Ve, YC = Nc, Is = $r, Fl = gn, ee = ce, ne = Lt, XC = Je, kr = W, gs = ya;
function JC(e) {
  if (Z$(e) && (ev(e), Q$(e))) {
    eD(e);
    return;
  }
  J$(e, () => (0, X$.topBoolOrEmptySchema)(e));
}
ir.validateFunctionCode = JC;
function J$({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, ee._)`${ne.default.data}, ${ne.default.valCxt}`, n.$async, () => {
    e.code((0, ee._)`"use strict"; ${Km(r, i)}`), ZC(e, i), e.code(s);
  }) : e.func(t, (0, ee._)`${ne.default.data}, ${QC(i)}`, n.$async, () => e.code(Km(r, i)).code(s));
}
function QC(e) {
  return (0, ee._)`{${ne.default.instancePath}="", ${ne.default.parentData}, ${ne.default.parentDataProperty}, ${ne.default.rootData}=${ne.default.data}${e.dynamicRef ? (0, ee._)`, ${ne.default.dynamicAnchors}={}` : ee.nil}}={}`;
}
function ZC(e, t) {
  e.if(ne.default.valCxt, () => {
    e.var(ne.default.instancePath, (0, ee._)`${ne.default.valCxt}.${ne.default.instancePath}`), e.var(ne.default.parentData, (0, ee._)`${ne.default.valCxt}.${ne.default.parentData}`), e.var(ne.default.parentDataProperty, (0, ee._)`${ne.default.valCxt}.${ne.default.parentDataProperty}`), e.var(ne.default.rootData, (0, ee._)`${ne.default.valCxt}.${ne.default.rootData}`), t.dynamicRef && e.var(ne.default.dynamicAnchors, (0, ee._)`${ne.default.valCxt}.${ne.default.dynamicAnchors}`);
  }, () => {
    e.var(ne.default.instancePath, (0, ee._)`""`), e.var(ne.default.parentData, (0, ee._)`undefined`), e.var(ne.default.parentDataProperty, (0, ee._)`undefined`), e.var(ne.default.rootData, ne.default.data), t.dynamicRef && e.var(ne.default.dynamicAnchors, (0, ee._)`{}`);
  });
}
function eD(e) {
  const { schema: t, opts: r, gen: n } = e;
  J$(e, () => {
    r.$comment && t.$comment && rv(e), sD(e), n.let(ne.default.vErrors, null), n.let(ne.default.errors, 0), r.unevaluated && tD(e), tv(e), cD(e);
  });
}
function tD(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, ee._)`${r}.evaluated`), t.if((0, ee._)`${e.evaluated}.dynamicProps`, () => t.assign((0, ee._)`${e.evaluated}.props`, (0, ee._)`undefined`)), t.if((0, ee._)`${e.evaluated}.dynamicItems`, () => t.assign((0, ee._)`${e.evaluated}.items`, (0, ee._)`undefined`));
}
function Km(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, ee._)`/*# sourceURL=${r} */` : ee.nil;
}
function rD(e, t) {
  if (Z$(e) && (ev(e), Q$(e))) {
    nD(e, t);
    return;
  }
  (0, X$.boolOrEmptySchema)(e, t);
}
function Q$({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Z$(e) {
  return typeof e.schema != "boolean";
}
function nD(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && rv(e), aD(e), oD(e);
  const s = n.const("_errs", ne.default.errors);
  tv(e, s), n.var(t, (0, ee._)`${s} === ${ne.default.errors}`);
}
function ev(e) {
  (0, kr.checkUnknownRules)(e), iD(e);
}
function tv(e, t) {
  if (e.opts.jtd)
    return Wm(e, [], !1, t);
  const r = (0, zm.getSchemaTypes)(e.schema), n = (0, zm.coerceAndCheckDataType)(e, r);
  Wm(e, r, !n, t);
}
function iD(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, kr.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function sD(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, kr.checkStrictMode)(e, "default is ignored in the schema root");
}
function aD(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, XC.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function oD(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function rv({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, ee._)`${ne.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const a = (0, ee.str)`${n}/$comment`, o = e.scopeValue("root", { ref: t.root });
    e.code((0, ee._)`${ne.default.self}.opts.$comment(${s}, ${a}, ${o}.schema)`);
  }
}
function cD(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, ee._)`${ne.default.errors} === 0`, () => t.return(ne.default.data), () => t.throw((0, ee._)`new ${i}(${ne.default.vErrors})`)) : (t.assign((0, ee._)`${n}.errors`, ne.default.vErrors), s.unevaluated && lD(e), t.return((0, ee._)`${ne.default.errors} === 0`));
}
function lD({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof ee.Name && e.assign((0, ee._)`${t}.props`, r), n instanceof ee.Name && e.assign((0, ee._)`${t}.items`, n);
}
function Wm(e, t, r, n) {
  const { gen: i, schema: s, data: a, allErrors: o, opts: c, self: f } = e, { RULES: l } = f;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, kr.schemaHasRulesButRef)(s, l))) {
    i.block(() => sv(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || uD(e, t), i.block(() => {
    for (const h of l.rules)
      u(h);
    u(l.post);
  });
  function u(h) {
    (0, If.shouldUseGroup)(s, h) && (h.type ? (i.if((0, Go.checkDataType)(h.type, a, c.strictNumbers)), Ym(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, Go.reportTypeError)(e)), i.endIf()) : Ym(e, h), o || i.if((0, ee._)`${ne.default.errors} === ${n || 0}`));
  }
}
function Ym(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, YC.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, If.shouldUseRule)(n, s) && sv(e, s.keyword, s.definition, t.type);
  });
}
function uD(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (fD(e, t), e.opts.allowUnionTypes || dD(e, t), hD(e, e.dataTypes));
}
function fD(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      nv(e.dataTypes, r) || Cf(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), mD(e, t);
  }
}
function dD(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Cf(e, "use allowUnionTypes to allow union type keyword");
}
function hD(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, If.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((a) => pD(t, a)) && Cf(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function pD(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function nv(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function mD(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    nv(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Cf(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, kr.checkStrictMode)(e, t, e.opts.strictTypes);
}
let iv = class {
  constructor(t, r, n) {
    if ((0, Is.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, kr.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", av(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Is.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", ne.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, ee.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, ee.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, ee._)`${r} !== undefined && (${(0, ee.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? gs.reportExtraError : gs.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, gs.reportError)(this, this.def.$dataError || gs.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, gs.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = ee.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = ee.nil, r = ee.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: a } = this;
    n.if((0, ee.or)((0, ee._)`${i} === undefined`, r)), t !== ee.nil && n.assign(t, !0), (s.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== ee.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: s } = this;
    return (0, ee.or)(a(), o());
    function a() {
      if (n.length) {
        if (!(r instanceof ee.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, ee._)`${(0, Go.checkDataTypes)(c, r, s.opts.strictNumbers, Go.DataType.Wrong)}`;
      }
      return ee.nil;
    }
    function o() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, ee._)`!${c}(${r})`;
      }
      return ee.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Fl.getSubschema)(this.it, t);
    (0, Fl.extendSubschemaData)(n, this.it, t), (0, Fl.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return rD(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = kr.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = kr.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, ee.Name)), !0;
  }
};
ir.KeywordCxt = iv;
function sv(e, t, r, n) {
  const i = new iv(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, Is.funcKeywordCode)(i, r) : "macro" in r ? (0, Is.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, Is.funcKeywordCode)(i, r);
}
const gD = /^\/(?:[^~]|~0|~1)*$/, yD = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function av(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return ne.default.rootData;
  if (e[0] === "/") {
    if (!gD.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = ne.default.rootData;
  } else {
    const f = yD.exec(e);
    if (!f)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +f[1];
    if (i = f[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (s = r[t - l], !i)
      return s;
  }
  let a = s;
  const o = i.split("/");
  for (const f of o)
    f && (s = (0, ee._)`${s}${(0, ee.getProperty)((0, kr.unescapeJsonPointer)(f))}`, a = (0, ee._)`${a} && ${s}`);
  return a;
  function c(f, l) {
    return `Cannot access ${f} ${l} levels up, current level is ${t}`;
  }
}
ir.getData = av;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
let $D = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
$a.default = $D;
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
const Ll = Je;
let vD = class extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ll.resolveUrl)(t, r, n), this.missingSchema = (0, Ll.normalizeId)((0, Ll.getFullPath)(t, this.missingRef));
  }
};
Qi.default = vD;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.resolveSchema = mt.getCompilingSchema = mt.resolveRef = mt.compileSchema = mt.SchemaEnv = void 0;
const Yt = ce, _D = $a, kn = Lt, tr = Je, Xm = W, ED = ir;
let Rc = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, tr.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
mt.SchemaEnv = Rc;
function Df(e) {
  const t = ov.call(this, e);
  if (t)
    return t;
  const r = (0, tr.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, a = new Yt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let o;
  e.$async && (o = a.scopeValue("Error", {
    ref: _D.default,
    code: (0, Yt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const f = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: kn.default.data,
    parentData: kn.default.parentData,
    parentDataProperty: kn.default.parentDataProperty,
    dataNames: [kn.default.data],
    dataPathArr: [Yt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Yt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: o,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Yt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Yt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, ED.validateFunctionCode)(f), a.optimize(this.opts.code.optimize);
    const u = a.toString();
    l = `${a.scopeRefs(kn.default.scope)}return ${u}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${kn.default.self}`, `${kn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: u, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: _, items: g } = f;
      p.evaluated = {
        props: _ instanceof Yt.Name ? void 0 : _,
        items: g instanceof Yt.Name ? void 0 : g,
        dynamicProps: _ instanceof Yt.Name,
        dynamicItems: g instanceof Yt.Name
      }, p.source && (p.source.evaluated = (0, Yt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (u) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), u;
  } finally {
    this._compilations.delete(e);
  }
}
mt.compileSchema = Df;
function wD(e, t, r) {
  var n;
  r = (0, tr.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = PD.call(this, e, r);
  if (s === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: o } = this.opts;
    a && (s = new Rc({ schema: a, schemaId: o, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = SD.call(this, s);
}
mt.resolveRef = wD;
function SD(e) {
  return (0, tr.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Df.call(this, e);
}
function ov(e) {
  for (const t of this._compilations)
    if (bD(t, e))
      return t;
}
mt.getCompilingSchema = ov;
function bD(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function PD(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Oc.call(this, e, t);
}
function Oc(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, tr._getFullPath)(this.opts.uriResolver, r);
  let i = (0, tr.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return jl.call(this, r, e);
  const s = (0, tr.normalizeId)(n), a = this.refs[s] || this.schemas[s];
  if (typeof a == "string") {
    const o = Oc.call(this, e, a);
    return typeof (o == null ? void 0 : o.schema) != "object" ? void 0 : jl.call(this, r, o);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || Df.call(this, a), s === (0, tr.normalizeId)(t)) {
      const { schema: o } = a, { schemaId: c } = this.opts, f = o[c];
      return f && (i = (0, tr.resolveUrl)(this.opts.uriResolver, i, f)), new Rc({ schema: o, schemaId: c, root: e, baseId: i });
    }
    return jl.call(this, r, a);
  }
}
mt.resolveSchema = Oc;
const TD = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function jl(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const o of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Xm.unescapeFragment)(o)];
    if (c === void 0)
      return;
    r = c;
    const f = typeof r == "object" && r[this.opts.schemaId];
    !TD.has(o) && f && (t = (0, tr.resolveUrl)(this.opts.uriResolver, t, f));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, Xm.schemaHasRulesButRef)(r, this.RULES)) {
    const o = (0, tr.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = Oc.call(this, n, o);
  }
  const { schemaId: a } = this.opts;
  if (s = s || new Rc({ schema: r, schemaId: a, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const ND = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", AD = "Meta-schema for $data reference (JSON AnySchema extension proposal)", RD = "object", OD = [
  "$data"
], ID = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, CD = !1, DD = {
  $id: ND,
  description: AD,
  type: RD,
  required: OD,
  properties: ID,
  additionalProperties: CD
};
var kf = {}, Ic = { exports: {} };
const kD = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), cv = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function lv(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const FD = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Jm(e) {
  return e.length = 0, !0;
}
function LD(e, t, r) {
  if (e.length) {
    const n = lv(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function jD(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, a = !1, o = LD;
  for (let c = 0; c < e.length; c++) {
    const f = e[c];
    if (!(f === "[" || f === "]"))
      if (f === ":") {
        if (s === !0 && (a = !0), !o(i, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (s = !0), n.push(":");
        continue;
      } else if (f === "%") {
        if (!o(i, n, r))
          break;
        o = Jm;
      } else {
        i.push(f);
        continue;
      }
  }
  return i.length && (o === Jm ? r.zone = i.join("") : a ? n.push(i.join("")) : n.push(lv(i))), r.address = n.join(""), r;
}
function uv(e) {
  if (UD(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = jD(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function UD(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function MD(e) {
  let t = e;
  const r = [];
  let n = -1, i = 0;
  for (; i = t.length; ) {
    if (i === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (i === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (i === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function xD(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function VD(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!cv(r)) {
      const n = uv(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var fv = {
  nonSimpleDomain: FD,
  recomposeAuthority: VD,
  normalizeComponentEncoding: xD,
  removeDotSegments: MD,
  isIPv4: cv,
  isUUID: kD,
  normalizeIPv6: uv
};
const { isUUID: qD } = fv, BD = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function dv(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function hv(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function pv(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function GD(e) {
  return e.secure = dv(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function HD(e) {
  if ((e.port === (dv(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function zD(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(BD);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const i = `${n}:${t.nid || e.nid}`, s = Ff(i);
    e.path = void 0, s && (e = s.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function KD(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), i = `${r}:${t.nid || n}`, s = Ff(i);
  s && (e = s.serialize(e, t));
  const a = e, o = e.nss;
  return a.path = `${n || t.nid}:${o}`, t.skipEscape = !0, a;
}
function WD(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !qD(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function YD(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const mv = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: hv,
    serialize: pv
  }
), XD = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: mv.domainHost,
    parse: hv,
    serialize: pv
  }
), So = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: GD,
    serialize: HD
  }
), JD = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: So.domainHost,
    parse: So.parse,
    serialize: So.serialize
  }
), QD = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: zD,
    serialize: KD,
    skipNormalize: !0
  }
), ZD = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: WD,
    serialize: YD,
    skipNormalize: !0
  }
), Ho = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: mv,
    https: XD,
    ws: So,
    wss: JD,
    urn: QD,
    "urn:uuid": ZD
  }
);
Object.setPrototypeOf(Ho, null);
function Ff(e) {
  return e && (Ho[
    /** @type {SchemeName} */
    e
  ] || Ho[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var ek = {
  SCHEMES: Ho,
  getSchemeHandler: Ff
};
const { normalizeIPv6: tk, removeDotSegments: bs, recomposeAuthority: rk, normalizeComponentEncoding: Xa, isIPv4: nk, nonSimpleDomain: ik } = fv, { SCHEMES: sk, getSchemeHandler: gv } = ek;
function ak(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  vr(xr(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  xr(vr(e, t), t)), e;
}
function ok(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, i = yv(xr(e, n), xr(t, n), n, !0);
  return n.skipEscape = !0, vr(i, n);
}
function yv(e, t, r, n) {
  const i = {};
  return n || (e = xr(vr(e, r), r), t = xr(vr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = bs(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = bs(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = bs(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = bs(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function ck(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = vr(Xa(xr(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = vr(Xa(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = vr(Xa(xr(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = vr(Xa(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function vr(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), i = [], s = gv(n.scheme || r.scheme);
  s && s.serialize && s.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && i.push(r.scheme, ":");
  const a = rk(r);
  if (a !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(a), r.path && r.path[0] !== "/" && i.push("/")), r.path !== void 0) {
    let o = r.path;
    !n.absolutePath && (!s || !s.absolutePath) && (o = bs(o)), a === void 0 && o[0] === "/" && o[1] === "/" && (o = "/%2F" + o.slice(2)), i.push(o);
  }
  return r.query !== void 0 && i.push("?", r.query), r.fragment !== void 0 && i.push("#", r.fragment), i.join("");
}
const lk = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function xr(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let i = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const s = e.match(lk);
  if (s) {
    if (n.scheme = s[1], n.userinfo = s[3], n.host = s[4], n.port = parseInt(s[5], 10), n.path = s[6] || "", n.query = s[7], n.fragment = s[8], isNaN(n.port) && (n.port = s[5]), n.host)
      if (nk(n.host) === !1) {
        const c = tk(n.host);
        n.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const a = gv(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!a || !a.unicodeSupport) && n.host && (r.domainHost || a && a.domainHost) && i === !1 && ik(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (o) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + o;
      }
    (!a || a && !a.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), a && a.parse && a.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Lf = {
  SCHEMES: sk,
  normalize: ak,
  resolve: ok,
  resolveComponent: yv,
  equal: ck,
  serialize: vr,
  parse: xr
};
Ic.exports = Lf;
Ic.exports.default = Lf;
Ic.exports.fastUri = Lf;
var $v = Ic.exports;
Object.defineProperty(kf, "__esModule", { value: !0 });
const vv = $v;
vv.code = 'require("ajv/dist/runtime/uri").default';
kf.default = vv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = ir;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ce;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = $a, i = Qi, s = ei, a = mt, o = ce, c = Je, f = Ve, l = W, u = DD, h = kf, p = (R, S) => new RegExp(R, S);
  p.code = "new RegExp";
  const _ = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
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
  ]), v = {
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
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function N(R) {
    var S, P, b, d, $, A, E, y, j, O, Y, he, $e, Te, Oe, tt, we, xe, Ht, jt, It, Ut, br, Pr, Tr;
    const Ct = R.strict, Mt = (S = R.code) === null || S === void 0 ? void 0 : S.optimize, Nr = Mt === !0 || Mt === void 0 ? 1 : Mt || 0, qr = (b = (P = R.code) === null || P === void 0 ? void 0 : P.regExp) !== null && b !== void 0 ? b : p, bt = (d = R.uriResolver) !== null && d !== void 0 ? d : h.default;
    return {
      strictSchema: (A = ($ = R.strictSchema) !== null && $ !== void 0 ? $ : Ct) !== null && A !== void 0 ? A : !0,
      strictNumbers: (y = (E = R.strictNumbers) !== null && E !== void 0 ? E : Ct) !== null && y !== void 0 ? y : !0,
      strictTypes: (O = (j = R.strictTypes) !== null && j !== void 0 ? j : Ct) !== null && O !== void 0 ? O : "log",
      strictTuples: (he = (Y = R.strictTuples) !== null && Y !== void 0 ? Y : Ct) !== null && he !== void 0 ? he : "log",
      strictRequired: (Te = ($e = R.strictRequired) !== null && $e !== void 0 ? $e : Ct) !== null && Te !== void 0 ? Te : !1,
      code: R.code ? { ...R.code, optimize: Nr, regExp: qr } : { optimize: Nr, regExp: qr },
      loopRequired: (Oe = R.loopRequired) !== null && Oe !== void 0 ? Oe : w,
      loopEnum: (tt = R.loopEnum) !== null && tt !== void 0 ? tt : w,
      meta: (we = R.meta) !== null && we !== void 0 ? we : !0,
      messages: (xe = R.messages) !== null && xe !== void 0 ? xe : !0,
      inlineRefs: (Ht = R.inlineRefs) !== null && Ht !== void 0 ? Ht : !0,
      schemaId: (jt = R.schemaId) !== null && jt !== void 0 ? jt : "$id",
      addUsedSchema: (It = R.addUsedSchema) !== null && It !== void 0 ? It : !0,
      validateSchema: (Ut = R.validateSchema) !== null && Ut !== void 0 ? Ut : !0,
      validateFormats: (br = R.validateFormats) !== null && br !== void 0 ? br : !0,
      unicodeRegExp: (Pr = R.unicodeRegExp) !== null && Pr !== void 0 ? Pr : !0,
      int32range: (Tr = R.int32range) !== null && Tr !== void 0 ? Tr : !0,
      uriResolver: bt
    };
  }
  class C {
    constructor(S = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), S = this.opts = { ...S, ...N(S) };
      const { es5: P, lines: b } = this.opts.code;
      this.scope = new o.ValueScope({ scope: {}, prefixes: g, es5: P, lines: b }), this.logger = G(S.logger);
      const d = S.validateFormats;
      S.validateFormats = !1, this.RULES = (0, s.getRules)(), M.call(this, v, S, "NOT SUPPORTED"), M.call(this, m, S, "DEPRECATED", "warn"), this._metaOpts = Z.call(this), S.formats && pe.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), S.keywords && I.call(this, S.keywords), typeof S.meta == "object" && this.addMetaSchema(S.meta), K.call(this), S.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: S, meta: P, schemaId: b } = this.opts;
      let d = u;
      b === "id" && (d = { ...u }, d.id = d.$id, delete d.$id), P && S && this.addMetaSchema(d, d[b], !1);
    }
    defaultMeta() {
      const { meta: S, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof S == "object" ? S[P] || S : void 0;
    }
    validate(S, P) {
      let b;
      if (typeof S == "string") {
        if (b = this.getSchema(S), !b)
          throw new Error(`no schema with key or ref "${S}"`);
      } else
        b = this.compile(S);
      const d = b(P);
      return "$async" in b || (this.errors = b.errors), d;
    }
    compile(S, P) {
      const b = this._addSchema(S, P);
      return b.validate || this._compileSchemaEnv(b);
    }
    compileAsync(S, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: b } = this.opts;
      return d.call(this, S, P);
      async function d(O, Y) {
        await $.call(this, O.$schema);
        const he = this._addSchema(O, Y);
        return he.validate || A.call(this, he);
      }
      async function $(O) {
        O && !this.getSchema(O) && await d.call(this, { $ref: O }, !0);
      }
      async function A(O) {
        try {
          return this._compileSchemaEnv(O);
        } catch (Y) {
          if (!(Y instanceof i.default))
            throw Y;
          return E.call(this, Y), await y.call(this, Y.missingSchema), A.call(this, O);
        }
      }
      function E({ missingSchema: O, missingRef: Y }) {
        if (this.refs[O])
          throw new Error(`AnySchema ${O} is loaded but ${Y} cannot be resolved`);
      }
      async function y(O) {
        const Y = await j.call(this, O);
        this.refs[O] || await $.call(this, Y.$schema), this.refs[O] || this.addSchema(Y, O, P);
      }
      async function j(O) {
        const Y = this._loading[O];
        if (Y)
          return Y;
        try {
          return await (this._loading[O] = b(O));
        } finally {
          delete this._loading[O];
        }
      }
    }
    // Adds schema to the instance
    addSchema(S, P, b, d = this.opts.validateSchema) {
      if (Array.isArray(S)) {
        for (const A of S)
          this.addSchema(A, void 0, b, d);
        return this;
      }
      let $;
      if (typeof S == "object") {
        const { schemaId: A } = this.opts;
        if ($ = S[A], $ !== void 0 && typeof $ != "string")
          throw new Error(`schema ${A} must be string`);
      }
      return P = (0, c.normalizeId)(P || $), this._checkUnique(P), this.schemas[P] = this._addSchema(S, b, P, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(S, P, b = this.opts.validateSchema) {
      return this.addSchema(S, P, !0, b), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(S, P) {
      if (typeof S == "boolean")
        return !0;
      let b;
      if (b = S.$schema, b !== void 0 && typeof b != "string")
        throw new Error("$schema must be a string");
      if (b = b || this.opts.defaultMeta || this.defaultMeta(), !b)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(b, S);
      if (!d && P) {
        const $ = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error($);
        else
          throw new Error($);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(S) {
      let P;
      for (; typeof (P = z.call(this, S)) == "string"; )
        S = P;
      if (P === void 0) {
        const { schemaId: b } = this.opts, d = new a.SchemaEnv({ schema: {}, schemaId: b });
        if (P = a.resolveSchema.call(this, d, S), !P)
          return;
        this.refs[S] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(S) {
      if (S instanceof RegExp)
        return this._removeAllSchemas(this.schemas, S), this._removeAllSchemas(this.refs, S), this;
      switch (typeof S) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = z.call(this, S);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[S], delete this.refs[S], this;
        }
        case "object": {
          const P = S;
          this._cache.delete(P);
          let b = S[this.opts.schemaId];
          return b && (b = (0, c.normalizeId)(b), delete this.schemas[b], delete this.refs[b]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(S) {
      for (const P of S)
        this.addKeyword(P);
      return this;
    }
    addKeyword(S, P) {
      let b;
      if (typeof S == "string")
        b = S, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = b);
      else if (typeof S == "object" && P === void 0) {
        if (P = S, b = P.keyword, Array.isArray(b) && !b.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (k.call(this, b, P), !P)
        return (0, l.eachItem)(b, ($) => D.call(this, $)), this;
      L.call(this, P);
      const d = {
        ...P,
        type: (0, f.getJSONTypes)(P.type),
        schemaType: (0, f.getJSONTypes)(P.schemaType)
      };
      return (0, l.eachItem)(b, d.type.length === 0 ? ($) => D.call(this, $, d) : ($) => d.type.forEach((A) => D.call(this, $, d, A))), this;
    }
    getKeyword(S) {
      const P = this.RULES.all[S];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(S) {
      const { RULES: P } = this;
      delete P.keywords[S], delete P.all[S];
      for (const b of P.rules) {
        const d = b.rules.findIndex(($) => $.keyword === S);
        d >= 0 && b.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(S, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[S] = P, this;
    }
    errorsText(S = this.errors, { separator: P = ", ", dataVar: b = "data" } = {}) {
      return !S || S.length === 0 ? "No errors" : S.map((d) => `${b}${d.instancePath} ${d.message}`).reduce((d, $) => d + P + $);
    }
    $dataMetaSchema(S, P) {
      const b = this.RULES.all;
      S = JSON.parse(JSON.stringify(S));
      for (const d of P) {
        const $ = d.split("/").slice(1);
        let A = S;
        for (const E of $)
          A = A[E];
        for (const E in b) {
          const y = b[E];
          if (typeof y != "object")
            continue;
          const { $data: j } = y.definition, O = A[E];
          j && O && (A[E] = U(O));
        }
      }
      return S;
    }
    _removeAllSchemas(S, P) {
      for (const b in S) {
        const d = S[b];
        (!P || P.test(b)) && (typeof d == "string" ? delete S[b] : d && !d.meta && (this._cache.delete(d.schema), delete S[b]));
      }
    }
    _addSchema(S, P, b, d = this.opts.validateSchema, $ = this.opts.addUsedSchema) {
      let A;
      const { schemaId: E } = this.opts;
      if (typeof S == "object")
        A = S[E];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof S != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let y = this._cache.get(S);
      if (y !== void 0)
        return y;
      b = (0, c.normalizeId)(A || b);
      const j = c.getSchemaRefs.call(this, S, b);
      return y = new a.SchemaEnv({ schema: S, schemaId: E, meta: P, baseId: b, localRefs: j }), this._cache.set(y.schema, y), $ && !b.startsWith("#") && (b && this._checkUnique(b), this.refs[b] = y), d && this.validateSchema(S, !0), y;
    }
    _checkUnique(S) {
      if (this.schemas[S] || this.refs[S])
        throw new Error(`schema with key or id "${S}" already exists`);
    }
    _compileSchemaEnv(S) {
      if (S.meta ? this._compileMetaSchema(S) : a.compileSchema.call(this, S), !S.validate)
        throw new Error("ajv implementation error");
      return S.validate;
    }
    _compileMetaSchema(S) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, S);
      } finally {
        this.opts = P;
      }
    }
  }
  C.ValidationError = n.default, C.MissingRefError = i.default, e.default = C;
  function M(R, S, P, b = "error") {
    for (const d in R) {
      const $ = d;
      $ in S && this.logger[b](`${P}: option ${d}. ${R[$]}`);
    }
  }
  function z(R) {
    return R = (0, c.normalizeId)(R), this.schemas[R] || this.refs[R];
  }
  function K() {
    const R = this.opts.schemas;
    if (R)
      if (Array.isArray(R))
        this.addSchema(R);
      else
        for (const S in R)
          this.addSchema(R[S], S);
  }
  function pe() {
    for (const R in this.opts.formats) {
      const S = this.opts.formats[R];
      S && this.addFormat(R, S);
    }
  }
  function I(R) {
    if (Array.isArray(R)) {
      this.addVocabulary(R);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const S in R) {
      const P = R[S];
      P.keyword || (P.keyword = S), this.addKeyword(P);
    }
  }
  function Z() {
    const R = { ...this.opts };
    for (const S of _)
      delete R[S];
    return R;
  }
  const B = { log() {
  }, warn() {
  }, error() {
  } };
  function G(R) {
    if (R === !1)
      return B;
    if (R === void 0)
      return console;
    if (R.log && R.warn && R.error)
      return R;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function k(R, S) {
    const { RULES: P } = this;
    if ((0, l.eachItem)(R, (b) => {
      if (P.keywords[b])
        throw new Error(`Keyword ${b} is already defined`);
      if (!Q.test(b))
        throw new Error(`Keyword ${b} has invalid name`);
    }), !!S && S.$data && !("code" in S || "validate" in S))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function D(R, S, P) {
    var b;
    const d = S == null ? void 0 : S.post;
    if (P && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: $ } = this;
    let A = d ? $.post : $.rules.find(({ type: y }) => y === P);
    if (A || (A = { type: P, rules: [] }, $.rules.push(A)), $.keywords[R] = !0, !S)
      return;
    const E = {
      keyword: R,
      definition: {
        ...S,
        type: (0, f.getJSONTypes)(S.type),
        schemaType: (0, f.getJSONTypes)(S.schemaType)
      }
    };
    S.before ? x.call(this, A, E, S.before) : A.rules.push(E), $.all[R] = E, (b = S.implements) === null || b === void 0 || b.forEach((y) => this.addKeyword(y));
  }
  function x(R, S, P) {
    const b = R.rules.findIndex((d) => d.keyword === P);
    b >= 0 ? R.rules.splice(b, 0, S) : (R.rules.push(S), this.logger.warn(`rule ${P} is not defined`));
  }
  function L(R) {
    let { metaSchema: S } = R;
    S !== void 0 && (R.$data && this.opts.$data && (S = U(S)), R.validateSchema = this.compile(S, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function U(R) {
    return { anyOf: [R, V] };
  }
})(O$);
var jf = {}, Uf = {}, Mf = {};
Object.defineProperty(Mf, "__esModule", { value: !0 });
const uk = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Mf.default = uk;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.callRef = Vr.getValidate = void 0;
const fk = Qi, Qm = me, Tt = ce, pi = Lt, Zm = mt, Ja = W, dk = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: a, opts: o, self: c } = n, { root: f } = s;
    if ((r === "#" || r === "#/") && i === f.baseId)
      return u();
    const l = Zm.resolveRef.call(c, f, i, r);
    if (l === void 0)
      throw new fk.default(n.opts.uriResolver, i, r);
    if (l instanceof Zm.SchemaEnv)
      return h(l);
    return p(l);
    function u() {
      if (s === f)
        return bo(e, a, s, s.$async);
      const _ = t.scopeValue("root", { ref: f });
      return bo(e, (0, Tt._)`${_}.validate`, f, f.$async);
    }
    function h(_) {
      const g = _v(e, _);
      bo(e, g, _, _.$async);
    }
    function p(_) {
      const g = t.scopeValue("schema", o.code.source === !0 ? { ref: _, code: (0, Tt.stringify)(_) } : { ref: _ }), v = t.name("valid"), m = e.subschema({
        schema: _,
        dataTypes: [],
        schemaPath: Tt.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function _v(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Tt._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Vr.getValidate = _v;
function bo(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: a, schemaEnv: o, opts: c } = s, f = c.passContext ? pi.default.this : Tt.nil;
  n ? l() : u();
  function l() {
    if (!o.$async)
      throw new Error("async schema referenced by sync schema");
    const _ = i.let("valid");
    i.try(() => {
      i.code((0, Tt._)`await ${(0, Qm.callValidateCode)(e, t, f)}`), p(t), a || i.assign(_, !0);
    }, (g) => {
      i.if((0, Tt._)`!(${g} instanceof ${s.ValidationError})`, () => i.throw(g)), h(g), a || i.assign(_, !1);
    }), e.ok(_);
  }
  function u() {
    e.result((0, Qm.callValidateCode)(e, t, f), () => p(t), () => h(t));
  }
  function h(_) {
    const g = (0, Tt._)`${_}.errors`;
    i.assign(pi.default.vErrors, (0, Tt._)`${pi.default.vErrors} === null ? ${g} : ${pi.default.vErrors}.concat(${g})`), i.assign(pi.default.errors, (0, Tt._)`${pi.default.vErrors}.length`);
  }
  function p(_) {
    var g;
    if (!s.opts.unevaluated)
      return;
    const v = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (s.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (s.props = Ja.mergeEvaluated.props(i, v.props, s.props));
      else {
        const m = i.var("props", (0, Tt._)`${_}.evaluated.props`);
        s.props = Ja.mergeEvaluated.props(i, m, s.props, Tt.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = Ja.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, Tt._)`${_}.evaluated.items`);
        s.items = Ja.mergeEvaluated.items(i, m, s.items, Tt.Name);
      }
  }
}
Vr.callRef = bo;
Vr.default = dk;
Object.defineProperty(Uf, "__esModule", { value: !0 });
const hk = Mf, pk = Vr, mk = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  hk.default,
  pk.default
];
Uf.default = mk;
var xf = {}, Vf = {};
Object.defineProperty(Vf, "__esModule", { value: !0 });
const zo = ce, Jr = zo.operators, Ko = {
  maximum: { okStr: "<=", ok: Jr.LTE, fail: Jr.GT },
  minimum: { okStr: ">=", ok: Jr.GTE, fail: Jr.LT },
  exclusiveMaximum: { okStr: "<", ok: Jr.LT, fail: Jr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Jr.GT, fail: Jr.LTE }
}, gk = {
  message: ({ keyword: e, schemaCode: t }) => (0, zo.str)`must be ${Ko[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, zo._)`{comparison: ${Ko[e].okStr}, limit: ${t}}`
}, yk = {
  keyword: Object.keys(Ko),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: gk,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, zo._)`${r} ${Ko[t].fail} ${n} || isNaN(${r})`);
  }
};
Vf.default = yk;
var qf = {};
Object.defineProperty(qf, "__esModule", { value: !0 });
const Cs = ce, $k = {
  message: ({ schemaCode: e }) => (0, Cs.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Cs._)`{multipleOf: ${e}}`
}, vk = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: $k,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, a = t.let("res"), o = s ? (0, Cs._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}` : (0, Cs._)`${a} !== parseInt(${a})`;
    e.fail$data((0, Cs._)`(${n} === 0 || (${a} = ${r}/${n}, ${o}))`);
  }
};
qf.default = vk;
var Bf = {}, Gf = {};
Object.defineProperty(Gf, "__esModule", { value: !0 });
function Ev(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Gf.default = Ev;
Ev.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Bf, "__esModule", { value: !0 });
const xn = ce, _k = W, Ek = Gf, wk = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xn.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xn._)`{limit: ${e}}`
}, Sk = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: wk,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? xn.operators.GT : xn.operators.LT, a = i.opts.unicode === !1 ? (0, xn._)`${r}.length` : (0, xn._)`${(0, _k.useFunc)(e.gen, Ek.default)}(${r})`;
    e.fail$data((0, xn._)`${a} ${s} ${n}`);
  }
};
Bf.default = Sk;
var Hf = {};
Object.defineProperty(Hf, "__esModule", { value: !0 });
const bk = me, Wo = ce, Pk = {
  message: ({ schemaCode: e }) => (0, Wo.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Wo._)`{pattern: ${e}}`
}, Tk = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Pk,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: s } = e, a = s.opts.unicodeRegExp ? "u" : "", o = r ? (0, Wo._)`(new RegExp(${i}, ${a}))` : (0, bk.usePattern)(e, n);
    e.fail$data((0, Wo._)`!${o}.test(${t})`);
  }
};
Hf.default = Tk;
var zf = {};
Object.defineProperty(zf, "__esModule", { value: !0 });
const Ds = ce, Nk = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Ds.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Ds._)`{limit: ${e}}`
}, Ak = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Nk,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? Ds.operators.GT : Ds.operators.LT;
    e.fail$data((0, Ds._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
zf.default = Ak;
var Kf = {};
Object.defineProperty(Kf, "__esModule", { value: !0 });
const ys = me, ks = ce, Rk = W, Ok = {
  message: ({ params: { missingProperty: e } }) => (0, ks.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, ks._)`{missingProperty: ${e}}`
}, Ik = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Ok,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: s, it: a } = e, { opts: o } = a;
    if (!s && r.length === 0)
      return;
    const c = r.length >= o.loopRequired;
    if (a.allErrors ? f() : l(), o.strictRequired) {
      const p = e.parentSchema.properties, { definedProperties: _ } = e.it;
      for (const g of r)
        if ((p == null ? void 0 : p[g]) === void 0 && !_.has(g)) {
          const v = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${g}" is not defined at "${v}" (strictRequired)`;
          (0, Rk.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function f() {
      if (c || s)
        e.block$data(ks.nil, u);
      else
        for (const p of r)
          (0, ys.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || s) {
        const _ = t.let("valid", !0);
        e.block$data(_, () => h(p, _)), e.ok(_);
      } else
        t.if((0, ys.checkMissingProp)(e, r, p)), (0, ys.reportMissingProp)(e, p), t.else();
    }
    function u() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, ys.noPropertyInData)(t, i, p, o.ownProperties), () => e.error());
      });
    }
    function h(p, _) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign(_, (0, ys.propertyInData)(t, i, p, o.ownProperties)), t.if((0, ks.not)(_), () => {
          e.error(), t.break();
        });
      }, ks.nil);
    }
  }
};
Kf.default = Ik;
var Wf = {};
Object.defineProperty(Wf, "__esModule", { value: !0 });
const Fs = ce, Ck = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Fs.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Fs._)`{limit: ${e}}`
}, Dk = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Ck,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? Fs.operators.GT : Fs.operators.LT;
    e.fail$data((0, Fs._)`${r}.length ${i} ${n}`);
  }
};
Wf.default = Dk;
var Yf = {}, va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
const wv = Ac;
wv.code = 'require("ajv/dist/runtime/equal").default';
va.default = wv;
Object.defineProperty(Yf, "__esModule", { value: !0 });
const Ul = Ve, Ye = ce, kk = W, Fk = va, Lk = {
  message: ({ params: { i: e, j: t } }) => (0, Ye.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ye._)`{i: ${e}, j: ${t}}`
}, jk = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Lk,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: a, it: o } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), f = s.items ? (0, Ul.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, Ye._)`${a} === false`), e.ok(c);
    function l() {
      const _ = t.let("i", (0, Ye._)`${r}.length`), g = t.let("j");
      e.setParams({ i: _, j: g }), t.assign(c, !0), t.if((0, Ye._)`${_} > 1`, () => (u() ? h : p)(_, g));
    }
    function u() {
      return f.length > 0 && !f.some((_) => _ === "object" || _ === "array");
    }
    function h(_, g) {
      const v = t.name("item"), m = (0, Ul.checkDataTypes)(f, v, o.opts.strictNumbers, Ul.DataType.Wrong), w = t.const("indices", (0, Ye._)`{}`);
      t.for((0, Ye._)`;${_}--;`, () => {
        t.let(v, (0, Ye._)`${r}[${_}]`), t.if(m, (0, Ye._)`continue`), f.length > 1 && t.if((0, Ye._)`typeof ${v} == "string"`, (0, Ye._)`${v} += "_"`), t.if((0, Ye._)`typeof ${w}[${v}] == "number"`, () => {
          t.assign(g, (0, Ye._)`${w}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Ye._)`${w}[${v}] = ${_}`);
      });
    }
    function p(_, g) {
      const v = (0, kk.useFunc)(t, Fk.default), m = t.name("outer");
      t.label(m).for((0, Ye._)`;${_}--;`, () => t.for((0, Ye._)`${g} = ${_}; ${g}--;`, () => t.if((0, Ye._)`${v}(${r}[${_}], ${r}[${g}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Yf.default = jk;
var Xf = {};
Object.defineProperty(Xf, "__esModule", { value: !0 });
const Su = ce, Uk = W, Mk = va, xk = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Su._)`{allowedValue: ${e}}`
}, Vk = {
  keyword: "const",
  $data: !0,
  error: xk,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, Su._)`!${(0, Uk.useFunc)(t, Mk.default)}(${r}, ${i})`) : e.fail((0, Su._)`${s} !== ${r}`);
  }
};
Xf.default = Vk;
var Jf = {};
Object.defineProperty(Jf, "__esModule", { value: !0 });
const Ps = ce, qk = W, Bk = va, Gk = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Ps._)`{allowedValues: ${e}}`
}, Hk = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Gk,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: a } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const o = i.length >= a.opts.loopEnum;
    let c;
    const f = () => c ?? (c = (0, qk.useFunc)(t, Bk.default));
    let l;
    if (o || n)
      l = t.let("valid"), e.block$data(l, u);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", s);
      l = (0, Ps.or)(...i.map((_, g) => h(p, g)));
    }
    e.pass(l);
    function u() {
      t.assign(l, !1), t.forOf("v", s, (p) => t.if((0, Ps._)`${f()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, _) {
      const g = i[_];
      return typeof g == "object" && g !== null ? (0, Ps._)`${f()}(${r}, ${p}[${_}])` : (0, Ps._)`${r} === ${g}`;
    }
  }
};
Jf.default = Hk;
Object.defineProperty(xf, "__esModule", { value: !0 });
const zk = Vf, Kk = qf, Wk = Bf, Yk = Hf, Xk = zf, Jk = Kf, Qk = Wf, Zk = Yf, eF = Xf, tF = Jf, rF = [
  // number
  zk.default,
  Kk.default,
  // string
  Wk.default,
  Yk.default,
  // object
  Xk.default,
  Jk.default,
  // array
  Qk.default,
  Zk.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  eF.default,
  tF.default
];
xf.default = rF;
var Qf = {}, Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.validateAdditionalItems = void 0;
const Vn = ce, bu = W, nF = {
  message: ({ params: { len: e } }) => (0, Vn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Vn._)`{limit: ${e}}`
}, iF = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: nF,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, bu.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Sv(e, n);
  }
};
function Sv(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: a } = e;
  a.items = !0;
  const o = r.const("len", (0, Vn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Vn._)`${o} <= ${t.length}`);
  else if (typeof n == "object" && !(0, bu.alwaysValidSchema)(a, n)) {
    const f = r.var("valid", (0, Vn._)`${o} <= ${t.length}`);
    r.if((0, Vn.not)(f), () => c(f)), e.ok(f);
  }
  function c(f) {
    r.forRange("i", t.length, o, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: bu.Type.Num }, f), a.allErrors || r.if((0, Vn.not)(f), () => r.break());
    });
  }
}
Zi.validateAdditionalItems = Sv;
Zi.default = iF;
var Zf = {}, es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
es.validateTuple = void 0;
const eg = ce, Po = W, sF = me, aF = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return bv(e, "additionalItems", t);
    r.items = !0, !(0, Po.alwaysValidSchema)(r, t) && e.ok((0, sF.validateArray)(e));
  }
};
function bv(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: a, it: o } = e;
  l(i), o.opts.unevaluated && r.length && o.items !== !0 && (o.items = Po.mergeEvaluated.items(n, r.length, o.items));
  const c = n.name("valid"), f = n.const("len", (0, eg._)`${s}.length`);
  r.forEach((u, h) => {
    (0, Po.alwaysValidSchema)(o, u) || (n.if((0, eg._)`${f} > ${h}`, () => e.subschema({
      keyword: a,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(u) {
    const { opts: h, errSchemaPath: p } = o, _ = r.length, g = _ === u.minItems && (_ === u.maxItems || u[t] === !1);
    if (h.strictTuples && !g) {
      const v = `"${a}" is ${_}-tuple, but minItems or maxItems/${t} are not specified or different at path "${p}"`;
      (0, Po.checkStrictMode)(o, v, h.strictTuples);
    }
  }
}
es.validateTuple = bv;
es.default = aF;
Object.defineProperty(Zf, "__esModule", { value: !0 });
const oF = es, cF = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, oF.validateTuple)(e, "items")
};
Zf.default = cF;
var ed = {};
Object.defineProperty(ed, "__esModule", { value: !0 });
const tg = ce, lF = W, uF = me, fF = Zi, dF = {
  message: ({ params: { len: e } }) => (0, tg.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tg._)`{limit: ${e}}`
}, hF = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: dF,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, lF.alwaysValidSchema)(n, t) && (i ? (0, fF.validateAdditionalItems)(e, i) : e.ok((0, uF.validateArray)(e)));
  }
};
ed.default = hF;
var td = {};
Object.defineProperty(td, "__esModule", { value: !0 });
const Bt = ce, Qa = W, pF = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Bt.str)`must contain at least ${e} valid item(s)` : (0, Bt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Bt._)`{minContains: ${e}}` : (0, Bt._)`{minContains: ${e}, maxContains: ${t}}`
}, mF = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: pF,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    let a, o;
    const { minContains: c, maxContains: f } = n;
    s.opts.next ? (a = c === void 0 ? 1 : c, o = f) : a = 1;
    const l = t.const("len", (0, Bt._)`${i}.length`);
    if (e.setParams({ min: a, max: o }), o === void 0 && a === 0) {
      (0, Qa.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (o !== void 0 && a > o) {
      (0, Qa.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Qa.alwaysValidSchema)(s, r)) {
      let g = (0, Bt._)`${l} >= ${a}`;
      o !== void 0 && (g = (0, Bt._)`${g} && ${l} <= ${o}`), e.pass(g);
      return;
    }
    s.items = !0;
    const u = t.name("valid");
    o === void 0 && a === 1 ? p(u, () => t.if(u, () => t.break())) : a === 0 ? (t.let(u, !0), o !== void 0 && t.if((0, Bt._)`${i}.length > 0`, h)) : (t.let(u, !1), h()), e.result(u, () => e.reset());
    function h() {
      const g = t.name("_valid"), v = t.let("count", 0);
      p(g, () => t.if(g, () => _(v)));
    }
    function p(g, v) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Qa.Type.Num,
          compositeRule: !0
        }, g), v();
      });
    }
    function _(g) {
      t.code((0, Bt._)`${g}++`), o === void 0 ? t.if((0, Bt._)`${g} >= ${a}`, () => t.assign(u, !0).break()) : (t.if((0, Bt._)`${g} > ${o}`, () => t.assign(u, !1).break()), a === 1 ? t.assign(u, !0) : t.if((0, Bt._)`${g} >= ${a}`, () => t.assign(u, !0)));
    }
  }
};
td.default = mF;
var Cc = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ce, r = W, n = me;
  e.error = {
    message: ({ params: { property: c, depsCount: f, deps: l } }) => {
      const u = f === 1 ? "property" : "properties";
      return (0, t.str)`must have ${u} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: f, deps: l, missingProperty: u } }) => (0, t._)`{property: ${c},
    missingProperty: ${u},
    depsCount: ${f},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [f, l] = s(c);
      a(c, f), o(c, l);
    }
  };
  function s({ schema: c }) {
    const f = {}, l = {};
    for (const u in c) {
      if (u === "__proto__")
        continue;
      const h = Array.isArray(c[u]) ? f : l;
      h[u] = c[u];
    }
    return [f, l];
  }
  function a(c, f = c.schema) {
    const { gen: l, data: u, it: h } = c;
    if (Object.keys(f).length === 0)
      return;
    const p = l.let("missing");
    for (const _ in f) {
      const g = f[_];
      if (g.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, u, _, h.opts.ownProperties);
      c.setParams({
        property: _,
        depsCount: g.length,
        deps: g.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, g, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function o(c, f = c.schema) {
    const { gen: l, data: u, keyword: h, it: p } = c, _ = l.name("valid");
    for (const g in f)
      (0, r.alwaysValidSchema)(p, f[g]) || (l.if(
        (0, n.propertyInData)(l, u, g, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: g }, _);
          c.mergeValidEvaluated(v, _);
        },
        () => l.var(_, !0)
        // TODO var
      ), c.ok(_));
  }
  e.validateSchemaDeps = o, e.default = i;
})(Cc);
var rd = {};
Object.defineProperty(rd, "__esModule", { value: !0 });
const Pv = ce, gF = W, yF = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Pv._)`{propertyName: ${e.propertyName}}`
}, $F = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: yF,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, gF.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, s), t.if((0, Pv.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
rd.default = $F;
var Dc = {};
Object.defineProperty(Dc, "__esModule", { value: !0 });
const Za = me, Jt = ce, vF = Lt, eo = W, _F = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Jt._)`{additionalProperty: ${e.additionalProperty}}`
}, EF = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: _F,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, eo.alwaysValidSchema)(a, r))
      return;
    const f = (0, Za.allSchemaProperties)(n.properties), l = (0, Za.allSchemaProperties)(n.patternProperties);
    u(), e.ok((0, Jt._)`${s} === ${vF.default.errors}`);
    function u() {
      t.forIn("key", i, (v) => {
        !f.length && !l.length ? _(v) : t.if(h(v), () => _(v));
      });
    }
    function h(v) {
      let m;
      if (f.length > 8) {
        const w = (0, eo.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, Za.isOwnProperty)(t, w, v);
      } else f.length ? m = (0, Jt.or)(...f.map((w) => (0, Jt._)`${v} === ${w}`)) : m = Jt.nil;
      return l.length && (m = (0, Jt.or)(m, ...l.map((w) => (0, Jt._)`${(0, Za.usePattern)(e, w)}.test(${v})`))), (0, Jt.not)(m);
    }
    function p(v) {
      t.code((0, Jt._)`delete ${i}[${v}]`);
    }
    function _(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), o || t.break();
        return;
      }
      if (typeof r == "object" && !(0, eo.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (g(v, m, !1), t.if((0, Jt.not)(m), () => {
          e.reset(), p(v);
        })) : (g(v, m), o || t.if((0, Jt.not)(m), () => t.break()));
      }
    }
    function g(v, m, w) {
      const N = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: eo.Type.Str
      };
      w === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Dc.default = EF;
var nd = {};
Object.defineProperty(nd, "__esModule", { value: !0 });
const wF = ir, rg = me, Ml = W, ng = Dc, SF = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ng.default.code(new wF.KeywordCxt(s, ng.default, "additionalProperties"));
    const a = (0, rg.allSchemaProperties)(r);
    for (const u of a)
      s.definedProperties.add(u);
    s.opts.unevaluated && a.length && s.props !== !0 && (s.props = Ml.mergeEvaluated.props(t, (0, Ml.toHash)(a), s.props));
    const o = a.filter((u) => !(0, Ml.alwaysValidSchema)(s, r[u]));
    if (o.length === 0)
      return;
    const c = t.name("valid");
    for (const u of o)
      f(u) ? l(u) : (t.if((0, rg.propertyInData)(t, i, u, s.opts.ownProperties)), l(u), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(u), e.ok(c);
    function f(u) {
      return s.opts.useDefaults && !s.compositeRule && r[u].default !== void 0;
    }
    function l(u) {
      e.subschema({
        keyword: "properties",
        schemaProp: u,
        dataProp: u
      }, c);
    }
  }
};
nd.default = SF;
var id = {};
Object.defineProperty(id, "__esModule", { value: !0 });
const ig = me, to = ce, sg = W, ag = W, bF = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: a } = s, o = (0, ig.allSchemaProperties)(r), c = o.filter((g) => (0, sg.alwaysValidSchema)(s, r[g]));
    if (o.length === 0 || c.length === o.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const f = a.strictSchema && !a.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof to.Name) && (s.props = (0, ag.evaluatedPropsToName)(t, s.props));
    const { props: u } = s;
    h();
    function h() {
      for (const g of o)
        f && p(g), s.allErrors ? _(g) : (t.var(l, !0), _(g), t.if(l));
    }
    function p(g) {
      for (const v in f)
        new RegExp(g).test(v) && (0, sg.checkStrictMode)(s, `property ${v} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function _(g) {
      t.forIn("key", n, (v) => {
        t.if((0, to._)`${(0, ig.usePattern)(e, g)}.test(${v})`, () => {
          const m = c.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: v,
            dataPropType: ag.Type.Str
          }, l), s.opts.unevaluated && u !== !0 ? t.assign((0, to._)`${u}[${v}]`, !0) : !m && !s.allErrors && t.if((0, to.not)(l), () => t.break());
        });
      });
    }
  }
};
id.default = bF;
var sd = {};
Object.defineProperty(sd, "__esModule", { value: !0 });
const PF = W, TF = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, PF.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
sd.default = TF;
var ad = {};
Object.defineProperty(ad, "__esModule", { value: !0 });
const NF = me, AF = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: NF.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ad.default = AF;
var od = {};
Object.defineProperty(od, "__esModule", { value: !0 });
const To = ce, RF = W, OF = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, To._)`{passingSchemas: ${e.passing}}`
}, IF = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: OF,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = r, a = t.let("valid", !1), o = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: o }), t.block(f), e.result(a, () => e.reset(), () => e.error(!0));
    function f() {
      s.forEach((l, u) => {
        let h;
        (0, RF.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: u,
          compositeRule: !0
        }, c), u > 0 && t.if((0, To._)`${c} && ${a}`).assign(a, !1).assign(o, (0, To._)`[${o}, ${u}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(o, u), h && e.mergeEvaluated(h, To.Name);
        });
      });
    }
  }
};
od.default = IF;
var cd = {};
Object.defineProperty(cd, "__esModule", { value: !0 });
const CF = W, DF = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, a) => {
      if ((0, CF.alwaysValidSchema)(n, s))
        return;
      const o = e.subschema({ keyword: "allOf", schemaProp: a }, i);
      e.ok(i), e.mergeEvaluated(o);
    });
  }
};
cd.default = DF;
var ld = {};
Object.defineProperty(ld, "__esModule", { value: !0 });
const Yo = ce, Tv = W, kF = {
  message: ({ params: e }) => (0, Yo.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Yo._)`{failingKeyword: ${e.ifClause}}`
}, FF = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: kF,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Tv.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = og(n, "then"), s = og(n, "else");
    if (!i && !s)
      return;
    const a = t.let("valid", !0), o = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(o, f("then", l), f("else", l));
    } else i ? t.if(o, f("then")) : t.if((0, Yo.not)(o), f("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, o);
      e.mergeEvaluated(l);
    }
    function f(l, u) {
      return () => {
        const h = e.subschema({ keyword: l }, o);
        t.assign(a, o), e.mergeValidEvaluated(h, a), u ? t.assign(u, (0, Yo._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function og(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Tv.alwaysValidSchema)(e, r);
}
ld.default = FF;
var ud = {};
Object.defineProperty(ud, "__esModule", { value: !0 });
const LF = W, jF = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, LF.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ud.default = jF;
Object.defineProperty(Qf, "__esModule", { value: !0 });
const UF = Zi, MF = Zf, xF = es, VF = ed, qF = td, BF = Cc, GF = rd, HF = Dc, zF = nd, KF = id, WF = sd, YF = ad, XF = od, JF = cd, QF = ld, ZF = ud;
function eL(e = !1) {
  const t = [
    // any
    WF.default,
    YF.default,
    XF.default,
    JF.default,
    QF.default,
    ZF.default,
    // object
    GF.default,
    HF.default,
    BF.default,
    zF.default,
    KF.default
  ];
  return e ? t.push(MF.default, VF.default) : t.push(UF.default, xF.default), t.push(qF.default), t;
}
Qf.default = eL;
var fd = {}, ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.dynamicAnchor = void 0;
const xl = ce, tL = Lt, cg = mt, rL = Vr, nL = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Nv(e, e.schema)
};
function Nv(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, xl._)`${tL.default.dynamicAnchors}${(0, xl.getProperty)(t)}`, s = n.errSchemaPath === "#" ? n.validateName : iL(e);
  r.if((0, xl._)`!${i}`, () => r.assign(i, s));
}
ts.dynamicAnchor = Nv;
function iL(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: i, baseId: s, localRefs: a, meta: o } = t.root, { schemaId: c } = n.opts, f = new cg.SchemaEnv({ schema: r, schemaId: c, root: i, baseId: s, localRefs: a, meta: o });
  return cg.compileSchema.call(n, f), (0, rL.getValidate)(e, f);
}
ts.default = nL;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.dynamicRef = void 0;
const lg = ce, sL = Lt, ug = Vr, aL = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Av(e, e.schema)
};
function Av(e, t) {
  const { gen: r, keyword: n, it: i } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const s = t.slice(1);
  if (i.allErrors)
    a();
  else {
    const c = r.let("valid", !1);
    a(c), e.ok(c);
  }
  function a(c) {
    if (i.schemaEnv.root.dynamicAnchors[s]) {
      const f = r.let("_v", (0, lg._)`${sL.default.dynamicAnchors}${(0, lg.getProperty)(s)}`);
      r.if(f, o(f, c), o(i.validateName, c));
    } else
      o(i.validateName, c)();
  }
  function o(c, f) {
    return f ? () => r.block(() => {
      (0, ug.callRef)(e, c), r.let(f, !0);
    }) : () => (0, ug.callRef)(e, c);
  }
}
rs.dynamicRef = Av;
rs.default = aL;
var dd = {};
Object.defineProperty(dd, "__esModule", { value: !0 });
const oL = ts, cL = W, lL = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, oL.dynamicAnchor)(e, "") : (0, cL.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
dd.default = lL;
var hd = {};
Object.defineProperty(hd, "__esModule", { value: !0 });
const uL = rs, fL = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, uL.dynamicRef)(e, e.schema)
};
hd.default = fL;
Object.defineProperty(fd, "__esModule", { value: !0 });
const dL = ts, hL = rs, pL = dd, mL = hd, gL = [dL.default, hL.default, pL.default, mL.default];
fd.default = gL;
var pd = {}, md = {};
Object.defineProperty(md, "__esModule", { value: !0 });
const fg = Cc, yL = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: fg.error,
  code: (e) => (0, fg.validatePropertyDeps)(e)
};
md.default = yL;
var gd = {};
Object.defineProperty(gd, "__esModule", { value: !0 });
const $L = Cc, vL = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, $L.validateSchemaDeps)(e)
};
gd.default = vL;
var yd = {};
Object.defineProperty(yd, "__esModule", { value: !0 });
const _L = W, EL = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, _L.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
yd.default = EL;
Object.defineProperty(pd, "__esModule", { value: !0 });
const wL = md, SL = gd, bL = yd, PL = [wL.default, SL.default, bL.default];
pd.default = PL;
var $d = {}, vd = {};
Object.defineProperty(vd, "__esModule", { value: !0 });
const tn = ce, dg = W, TL = Lt, NL = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, tn._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, AL = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: NL,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: i, it: s } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: a, props: o } = s;
    o instanceof tn.Name ? t.if((0, tn._)`${o} !== true`, () => t.forIn("key", n, (u) => t.if(f(o, u), () => c(u)))) : o !== !0 && t.forIn("key", n, (u) => o === void 0 ? c(u) : t.if(l(o, u), () => c(u))), s.props = !0, e.ok((0, tn._)`${i} === ${TL.default.errors}`);
    function c(u) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: u }), e.error(), a || t.break();
        return;
      }
      if (!(0, dg.alwaysValidSchema)(s, r)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: u,
          dataPropType: dg.Type.Str
        }, h), a || t.if((0, tn.not)(h), () => t.break());
      }
    }
    function f(u, h) {
      return (0, tn._)`!${u} || !${u}[${h}]`;
    }
    function l(u, h) {
      const p = [];
      for (const _ in u)
        u[_] === !0 && p.push((0, tn._)`${h} !== ${_}`);
      return (0, tn.and)(...p);
    }
  }
};
vd.default = AL;
var _d = {};
Object.defineProperty(_d, "__esModule", { value: !0 });
const qn = ce, hg = W, RL = {
  message: ({ params: { len: e } }) => (0, qn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, qn._)`{limit: ${e}}`
}, OL = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: RL,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e, s = i.items || 0;
    if (s === !0)
      return;
    const a = t.const("len", (0, qn._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: s }), e.fail((0, qn._)`${a} > ${s}`);
    else if (typeof r == "object" && !(0, hg.alwaysValidSchema)(i, r)) {
      const c = t.var("valid", (0, qn._)`${a} <= ${s}`);
      t.if((0, qn.not)(c), () => o(c, s)), e.ok(c);
    }
    i.items = !0;
    function o(c, f) {
      t.forRange("i", f, a, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: hg.Type.Num }, c), i.allErrors || t.if((0, qn.not)(c), () => t.break());
      });
    }
  }
};
_d.default = OL;
Object.defineProperty($d, "__esModule", { value: !0 });
const IL = vd, CL = _d, DL = [IL.default, CL.default];
$d.default = DL;
var Ed = {}, wd = {};
Object.defineProperty(wd, "__esModule", { value: !0 });
const Le = ce, kL = {
  message: ({ schemaCode: e }) => (0, Le.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Le._)`{format: ${e}}`
}, FL = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: kL,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: a, it: o } = e, { opts: c, errSchemaPath: f, schemaEnv: l, self: u } = o;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const _ = r.scopeValue("formats", {
        ref: u.formats,
        code: c.code.formats
      }), g = r.const("fDef", (0, Le._)`${_}[${a}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, Le._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign(v, (0, Le._)`${g}.type || "string"`).assign(m, (0, Le._)`${g}.validate`), () => r.assign(v, (0, Le._)`"string"`).assign(m, g)), e.fail$data((0, Le.or)(w(), N()));
      function w() {
        return c.strictSchema === !1 ? Le.nil : (0, Le._)`${a} && !${m}`;
      }
      function N() {
        const C = l.$async ? (0, Le._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Le._)`${m}(${n})`, M = (0, Le._)`(typeof ${m} == "function" ? ${C} : ${m}.test(${n}))`;
        return (0, Le._)`${m} && ${m} !== true && ${v} === ${t} && !${M}`;
      }
    }
    function p() {
      const _ = u.formats[s];
      if (!_) {
        w();
        return;
      }
      if (_ === !0)
        return;
      const [g, v, m] = N(_);
      g === t && e.pass(C());
      function w() {
        if (c.strictSchema === !1) {
          u.logger.warn(M());
          return;
        }
        throw new Error(M());
        function M() {
          return `unknown format "${s}" ignored in schema at path "${f}"`;
        }
      }
      function N(M) {
        const z = M instanceof RegExp ? (0, Le.regexpCode)(M) : c.code.formats ? (0, Le._)`${c.code.formats}${(0, Le.getProperty)(s)}` : void 0, K = r.scopeValue("formats", { key: s, ref: M, code: z });
        return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, Le._)`${K}.validate`] : ["string", M, K];
      }
      function C() {
        if (typeof _ == "object" && !(_ instanceof RegExp) && _.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Le._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, Le._)`${m}(${n})` : (0, Le._)`${m}.test(${n})`;
      }
    }
  }
};
wd.default = FL;
Object.defineProperty(Ed, "__esModule", { value: !0 });
const LL = wd, jL = [LL.default];
Ed.default = jL;
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.contentVocabulary = Gi.metadataVocabulary = void 0;
Gi.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Gi.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(jf, "__esModule", { value: !0 });
const UL = Uf, ML = xf, xL = Qf, VL = fd, qL = pd, BL = $d, GL = Ed, pg = Gi, HL = [
  VL.default,
  UL.default,
  ML.default,
  (0, xL.default)(!0),
  GL.default,
  pg.metadataVocabulary,
  pg.contentVocabulary,
  qL.default,
  BL.default
];
jf.default = HL;
var Sd = {}, kc = {};
Object.defineProperty(kc, "__esModule", { value: !0 });
kc.DiscrError = void 0;
var mg;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(mg || (kc.DiscrError = mg = {}));
Object.defineProperty(Sd, "__esModule", { value: !0 });
const vi = ce, Pu = kc, gg = mt, zL = Qi, KL = W, WL = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Pu.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, vi._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, YL = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: WL,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: s } = e, { oneOf: a } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const o = n.propertyName;
    if (typeof o != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), f = t.const("tag", (0, vi._)`${r}${(0, vi.getProperty)(o)}`);
    t.if((0, vi._)`typeof ${f} == "string"`, () => l(), () => e.error(!1, { discrError: Pu.DiscrError.Tag, tag: f, tagName: o })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const _ in p)
        t.elseIf((0, vi._)`${f} === ${_}`), t.assign(c, u(p[_]));
      t.else(), e.error(!1, { discrError: Pu.DiscrError.Mapping, tag: f, tagName: o }), t.endIf();
    }
    function u(p) {
      const _ = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: p }, _);
      return e.mergeEvaluated(g, vi.Name), _;
    }
    function h() {
      var p;
      const _ = {}, g = m(i);
      let v = !0;
      for (let C = 0; C < a.length; C++) {
        let M = a[C];
        if (M != null && M.$ref && !(0, KL.schemaHasRulesButRef)(M, s.self.RULES)) {
          const K = M.$ref;
          if (M = gg.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, K), M instanceof gg.SchemaEnv && (M = M.schema), M === void 0)
            throw new zL.default(s.opts.uriResolver, s.baseId, K);
        }
        const z = (p = M == null ? void 0 : M.properties) === null || p === void 0 ? void 0 : p[o];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${o}"`);
        v = v && (g || m(M)), w(z, C);
      }
      if (!v)
        throw new Error(`discriminator: "${o}" must be required`);
      return _;
      function m({ required: C }) {
        return Array.isArray(C) && C.includes(o);
      }
      function w(C, M) {
        if (C.const)
          N(C.const, M);
        else if (C.enum)
          for (const z of C.enum)
            N(z, M);
        else
          throw new Error(`discriminator: "properties/${o}" must have "const" or "enum"`);
      }
      function N(C, M) {
        if (typeof C != "string" || C in _)
          throw new Error(`discriminator: "${o}" values must be unique strings`);
        _[C] = M;
      }
    }
  }
};
Sd.default = YL;
var bd = {};
const XL = "https://json-schema.org/draft/2020-12/schema", JL = "https://json-schema.org/draft/2020-12/schema", QL = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, ZL = "meta", ej = "Core and Validation specifications meta-schema", tj = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], rj = [
  "object",
  "boolean"
], nj = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", ij = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, sj = {
  $schema: XL,
  $id: JL,
  $vocabulary: QL,
  $dynamicAnchor: ZL,
  title: ej,
  allOf: tj,
  type: rj,
  $comment: nj,
  properties: ij
}, aj = "https://json-schema.org/draft/2020-12/schema", oj = "https://json-schema.org/draft/2020-12/meta/applicator", cj = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, lj = "meta", uj = "Applicator vocabulary meta-schema", fj = [
  "object",
  "boolean"
], dj = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, hj = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, pj = {
  $schema: aj,
  $id: oj,
  $vocabulary: cj,
  $dynamicAnchor: lj,
  title: uj,
  type: fj,
  properties: dj,
  $defs: hj
}, mj = "https://json-schema.org/draft/2020-12/schema", gj = "https://json-schema.org/draft/2020-12/meta/unevaluated", yj = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, $j = "meta", vj = "Unevaluated applicator vocabulary meta-schema", _j = [
  "object",
  "boolean"
], Ej = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, wj = {
  $schema: mj,
  $id: gj,
  $vocabulary: yj,
  $dynamicAnchor: $j,
  title: vj,
  type: _j,
  properties: Ej
}, Sj = "https://json-schema.org/draft/2020-12/schema", bj = "https://json-schema.org/draft/2020-12/meta/content", Pj = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Tj = "meta", Nj = "Content vocabulary meta-schema", Aj = [
  "object",
  "boolean"
], Rj = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Oj = {
  $schema: Sj,
  $id: bj,
  $vocabulary: Pj,
  $dynamicAnchor: Tj,
  title: Nj,
  type: Aj,
  properties: Rj
}, Ij = "https://json-schema.org/draft/2020-12/schema", Cj = "https://json-schema.org/draft/2020-12/meta/core", Dj = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, kj = "meta", Fj = "Core vocabulary meta-schema", Lj = [
  "object",
  "boolean"
], jj = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, Uj = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, Mj = {
  $schema: Ij,
  $id: Cj,
  $vocabulary: Dj,
  $dynamicAnchor: kj,
  title: Fj,
  type: Lj,
  properties: jj,
  $defs: Uj
}, xj = "https://json-schema.org/draft/2020-12/schema", Vj = "https://json-schema.org/draft/2020-12/meta/format-annotation", qj = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Bj = "meta", Gj = "Format vocabulary meta-schema for annotation results", Hj = [
  "object",
  "boolean"
], zj = {
  format: {
    type: "string"
  }
}, Kj = {
  $schema: xj,
  $id: Vj,
  $vocabulary: qj,
  $dynamicAnchor: Bj,
  title: Gj,
  type: Hj,
  properties: zj
}, Wj = "https://json-schema.org/draft/2020-12/schema", Yj = "https://json-schema.org/draft/2020-12/meta/meta-data", Xj = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Jj = "meta", Qj = "Meta-data vocabulary meta-schema", Zj = [
  "object",
  "boolean"
], eU = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, tU = {
  $schema: Wj,
  $id: Yj,
  $vocabulary: Xj,
  $dynamicAnchor: Jj,
  title: Qj,
  type: Zj,
  properties: eU
}, rU = "https://json-schema.org/draft/2020-12/schema", nU = "https://json-schema.org/draft/2020-12/meta/validation", iU = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, sU = "meta", aU = "Validation vocabulary meta-schema", oU = [
  "object",
  "boolean"
], cU = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, lU = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, uU = {
  $schema: rU,
  $id: nU,
  $vocabulary: iU,
  $dynamicAnchor: sU,
  title: aU,
  type: oU,
  properties: cU,
  $defs: lU
};
Object.defineProperty(bd, "__esModule", { value: !0 });
const fU = sj, dU = pj, hU = wj, pU = Oj, mU = Mj, gU = Kj, yU = tU, $U = uU, vU = ["/properties"];
function _U(e) {
  return [
    fU,
    dU,
    hU,
    pU,
    mU,
    t(this, gU),
    yU,
    t(this, $U)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, vU) : n;
  }
}
bd.default = _U;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = O$, n = jf, i = Sd, s = bd, a = "https://json-schema.org/draft/2020-12/schema";
  class o extends r.default {
    constructor(p = {}) {
      super({
        ...p,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((p) => this.addVocabulary(p)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: p, meta: _ } = this.opts;
      _ && (s.default.call(this, p), this.refs["http://json-schema.org/schema"] = a);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv2020 = o, e.exports = t = o, e.exports.Ajv2020 = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
  var c = ir;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var f = ce;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return f._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return f.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return f.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return f.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return f.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return f.CodeGen;
  } });
  var l = $a;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var u = Qi;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return u.default;
  } });
})($u, $u.exports);
var EU = $u.exports, Tu = { exports: {} }, Rv = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(B, G) {
    return { validate: B, compare: G };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(s, a),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), f),
    "date-time": t(h(!0), p),
    "iso-time": t(c(), l),
    "iso-date-time": t(h(), _),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: Z,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: z },
    // signed 64 bit integer
    int64: { type: "number", validate: K },
    // C-type float
    float: { type: "number", validate: pe },
    // C-type double
    double: { type: "number", validate: pe },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, a),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, f),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, p),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, _),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(B) {
    return B % 4 === 0 && (B % 100 !== 0 || B % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function s(B) {
    const G = n.exec(B);
    if (!G)
      return !1;
    const Q = +G[1], k = +G[2], D = +G[3];
    return k >= 1 && k <= 12 && D >= 1 && D <= (k === 2 && r(Q) ? 29 : i[k]);
  }
  function a(B, G) {
    if (B && G)
      return B > G ? 1 : B < G ? -1 : 0;
  }
  const o = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(B) {
    return function(Q) {
      const k = o.exec(Q);
      if (!k)
        return !1;
      const D = +k[1], x = +k[2], L = +k[3], V = k[4], U = k[5] === "-" ? -1 : 1, R = +(k[6] || 0), S = +(k[7] || 0);
      if (R > 23 || S > 59 || B && !V)
        return !1;
      if (D <= 23 && x <= 59 && L < 60)
        return !0;
      const P = x - S * U, b = D - R * U - (P < 0 ? 1 : 0);
      return (b === 23 || b === -1) && (P === 59 || P === -1) && L < 61;
    };
  }
  function f(B, G) {
    if (!(B && G))
      return;
    const Q = (/* @__PURE__ */ new Date("2020-01-01T" + B)).valueOf(), k = (/* @__PURE__ */ new Date("2020-01-01T" + G)).valueOf();
    if (Q && k)
      return Q - k;
  }
  function l(B, G) {
    if (!(B && G))
      return;
    const Q = o.exec(B), k = o.exec(G);
    if (Q && k)
      return B = Q[1] + Q[2] + Q[3], G = k[1] + k[2] + k[3], B > G ? 1 : B < G ? -1 : 0;
  }
  const u = /t|\s/i;
  function h(B) {
    const G = c(B);
    return function(k) {
      const D = k.split(u);
      return D.length === 2 && s(D[0]) && G(D[1]);
    };
  }
  function p(B, G) {
    if (!(B && G))
      return;
    const Q = new Date(B).valueOf(), k = new Date(G).valueOf();
    if (Q && k)
      return Q - k;
  }
  function _(B, G) {
    if (!(B && G))
      return;
    const [Q, k] = B.split(u), [D, x] = G.split(u), L = a(Q, D);
    if (L !== void 0)
      return L || f(k, x);
  }
  const g = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(B) {
    return g.test(B) && v.test(B);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(B) {
    return w.lastIndex = 0, w.test(B);
  }
  const C = -2147483648, M = 2 ** 31 - 1;
  function z(B) {
    return Number.isInteger(B) && B <= M && B >= C;
  }
  function K(B) {
    return Number.isInteger(B);
  }
  function pe() {
    return !0;
  }
  const I = /[^\\]\\Z/;
  function Z(B) {
    if (I.test(B))
      return !1;
    try {
      return new RegExp(B), !0;
    } catch {
      return !1;
    }
  }
})(Rv);
var Ov = {}, Nu = { exports: {} }, Iv = {}, sr = {}, Hi = {}, _a = {}, de = {}, na = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
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
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((N, C) => `${N}${C}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((N, C) => (C instanceof r && (N[C.str] = (N[C.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(m, ...w) {
    const N = [m[0]];
    let C = 0;
    for (; C < w.length; )
      o(N, w[C]), N.push(m[++C]);
    return new n(N);
  }
  e._ = i;
  const s = new n("+");
  function a(m, ...w) {
    const N = [p(m[0])];
    let C = 0;
    for (; C < w.length; )
      N.push(s), o(N, w[C]), N.push(s, p(m[++C]));
    return c(N), new n(N);
  }
  e.str = a;
  function o(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(u(w));
  }
  e.addCodeArg = o;
  function c(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === s) {
        const N = f(m[w - 1], m[w + 1]);
        if (N !== void 0) {
          m.splice(w - 1, 3, N);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function f(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function l(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : a`${m}${w}`;
  }
  e.strConcat = l;
  function u(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : p(Array.isArray(m) ? m.join(",") : m);
  }
  function h(m) {
    return new n(p(m));
  }
  e.stringify = h;
  function p(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = p;
  function _(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : i`[${m}]`;
  }
  e.getProperty = _;
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function v(m) {
    return new n(m.toString());
  }
  e.regexpCode = v;
})(na);
var Au = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = na;
  class r extends Error {
    constructor(f) {
      super(`CodeGen: "code" for ${f} not defined`), this.value = f.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: f, parent: l } = {}) {
      this._names = {}, this._prefixes = f, this._parent = l;
    }
    toName(f) {
      return f instanceof t.Name ? f : this.name(f);
    }
    name(f) {
      return new t.Name(this._newName(f));
    }
    _newName(f) {
      const l = this._names[f] || this._nameGroup(f);
      return `${f}${l.index++}`;
    }
    _nameGroup(f) {
      var l, u;
      if (!((u = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || u === void 0) && u.has(f) || this._prefixes && !this._prefixes.has(f))
        throw new Error(`CodeGen: prefix "${f}" is not allowed in this scope`);
      return this._names[f] = { prefix: f, index: 0 };
    }
  }
  e.Scope = i;
  class s extends t.Name {
    constructor(f, l) {
      super(l), this.prefix = f;
    }
    setValue(f, { property: l, itemIndex: u }) {
      this.value = f, this.scopePath = (0, t._)`.${new t.Name(l)}[${u}]`;
    }
  }
  e.ValueScopeName = s;
  const a = (0, t._)`\n`;
  class o extends i {
    constructor(f) {
      super(f), this._values = {}, this._scope = f.scope, this.opts = { ...f, _n: f.lines ? a : t.nil };
    }
    get() {
      return this._scope;
    }
    name(f) {
      return new s(f, this._newName(f));
    }
    value(f, l) {
      var u;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const h = this.toName(f), { prefix: p } = h, _ = (u = l.key) !== null && u !== void 0 ? u : l.ref;
      let g = this._values[p];
      if (g) {
        const w = g.get(_);
        if (w)
          return w;
      } else
        g = this._values[p] = /* @__PURE__ */ new Map();
      g.set(_, h);
      const v = this._scope[p] || (this._scope[p] = []), m = v.length;
      return v[m] = l.ref, h.setValue(l, { property: p, itemIndex: m }), h;
    }
    getValue(f, l) {
      const u = this._values[f];
      if (u)
        return u.get(l);
    }
    scopeRefs(f, l = this._values) {
      return this._reduceValues(l, (u) => {
        if (u.scopePath === void 0)
          throw new Error(`CodeGen: name "${u}" has no value`);
        return (0, t._)`${f}${u.scopePath}`;
      });
    }
    scopeCode(f = this._values, l, u) {
      return this._reduceValues(f, (h) => {
        if (h.value === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return h.value.code;
      }, l, u);
    }
    _reduceValues(f, l, u = {}, h) {
      let p = t.nil;
      for (const _ in f) {
        const g = f[_];
        if (!g)
          continue;
        const v = u[_] = u[_] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let w = l(m);
          if (w) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            p = (0, t._)`${p}${N} ${m} = ${w};${this.opts._n}`;
          } else if (w = h == null ? void 0 : h(m))
            p = (0, t._)`${p}${w}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return p;
    }
  }
  e.ValueScope = o;
})(Au);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = na, r = Au;
  var n = na;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = Au;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
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
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, $) {
      return this;
    }
  }
  class a extends s {
    constructor(d, $, A) {
      super(), this.varKind = d, this.name = $, this.rhs = A;
    }
    render({ es5: d, _n: $ }) {
      const A = d ? r.varKinds.var : this.varKind, E = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${A} ${this.name}${E};` + $;
    }
    optimizeNames(d, $) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = k(this.rhs, d, $)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class o extends s {
    constructor(d, $, A) {
      super(), this.lhs = d, this.rhs = $, this.sideEffects = A;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, $) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = k(this.rhs, d, $), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(d, this.rhs);
    }
  }
  class c extends o {
    constructor(d, $, A, E) {
      super(d, A, E), this.op = $;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class f extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class u extends s {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class h extends s {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, $) {
      return this.code = k(this.code, d, $), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class p extends s {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce(($, A) => $ + A.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let $ = d.length;
      for (; $--; ) {
        const A = d[$].optimizeNodes();
        Array.isArray(A) ? d.splice($, 1, ...A) : A ? d[$] = A : d.splice($, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, $) {
      const { nodes: A } = this;
      let E = A.length;
      for (; E--; ) {
        const y = A[E];
        y.optimizeNames(d, $) || (D(d, y.names), A.splice(E, 1));
      }
      return A.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, $) => G(d, $.names), {});
    }
  }
  class _ extends p {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class g extends p {
  }
  class v extends _ {
  }
  v.kind = "else";
  class m extends _ {
    constructor(d, $) {
      super($), this.condition = d;
    }
    render(d) {
      let $ = `if(${this.condition})` + super.render(d);
      return this.else && ($ += "else " + this.else.render(d)), $;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let $ = this.else;
      if ($) {
        const A = $.optimizeNodes();
        $ = this.else = Array.isArray(A) ? new v(A) : A;
      }
      if ($)
        return d === !1 ? $ instanceof m ? $ : $.nodes : this.nodes.length ? this : new m(x(d), $ instanceof m ? [$] : $.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, $) {
      var A;
      if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(d, $), !!(super.optimizeNames(d, $) || this.else))
        return this.condition = k(this.condition, d, $), this;
    }
    get names() {
      const d = super.names;
      return Q(d, this.condition), this.else && G(d, this.else.names), d;
    }
  }
  m.kind = "if";
  class w extends _ {
  }
  w.kind = "for";
  class N extends w {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, $) {
      if (super.optimizeNames(d, $))
        return this.iteration = k(this.iteration, d, $), this;
    }
    get names() {
      return G(super.names, this.iteration.names);
    }
  }
  class C extends w {
    constructor(d, $, A, E) {
      super(), this.varKind = d, this.name = $, this.from = A, this.to = E;
    }
    render(d) {
      const $ = d.es5 ? r.varKinds.var : this.varKind, { name: A, from: E, to: y } = this;
      return `for(${$} ${A}=${E}; ${A}<${y}; ${A}++)` + super.render(d);
    }
    get names() {
      const d = Q(super.names, this.from);
      return Q(d, this.to);
    }
  }
  class M extends w {
    constructor(d, $, A, E) {
      super(), this.loop = d, this.varKind = $, this.name = A, this.iterable = E;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, $) {
      if (super.optimizeNames(d, $))
        return this.iterable = k(this.iterable, d, $), this;
    }
    get names() {
      return G(super.names, this.iterable.names);
    }
  }
  class z extends _ {
    constructor(d, $, A) {
      super(), this.name = d, this.args = $, this.async = A;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  z.kind = "func";
  class K extends p {
    render(d) {
      return "return " + super.render(d);
    }
  }
  K.kind = "return";
  class pe extends _ {
    render(d) {
      let $ = "try" + super.render(d);
      return this.catch && ($ += this.catch.render(d)), this.finally && ($ += this.finally.render(d)), $;
    }
    optimizeNodes() {
      var d, $;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), ($ = this.finally) === null || $ === void 0 || $.optimizeNodes(), this;
    }
    optimizeNames(d, $) {
      var A, E;
      return super.optimizeNames(d, $), (A = this.catch) === null || A === void 0 || A.optimizeNames(d, $), (E = this.finally) === null || E === void 0 || E.optimizeNames(d, $), this;
    }
    get names() {
      const d = super.names;
      return this.catch && G(d, this.catch.names), this.finally && G(d, this.finally.names), d;
    }
  }
  class I extends _ {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  I.kind = "catch";
  class Z extends _ {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  Z.kind = "finally";
  class B {
    constructor(d, $ = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...$, _n: $.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, $) {
      const A = this._extScope.value(d, $);
      return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
    }
    getScopeValue(d, $) {
      return this._extScope.getValue(d, $);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, $, A, E) {
      const y = this._scope.toName($);
      return A !== void 0 && E && (this._constants[y.str] = A), this._leafNode(new a(d, y, A)), y;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, $, A) {
      return this._def(r.varKinds.const, d, $, A);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, $, A) {
      return this._def(r.varKinds.let, d, $, A);
    }
    // `var` declaration with optional assignment
    var(d, $, A) {
      return this._def(r.varKinds.var, d, $, A);
    }
    // assignment code
    assign(d, $, A) {
      return this._leafNode(new o(d, $, A));
    }
    // `+=` code
    add(d, $) {
      return this._leafNode(new c(d, e.operators.ADD, $));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new h(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const $ = ["{"];
      for (const [A, E] of d)
        $.length > 1 && $.push(","), $.push(A), (A !== E || this.opts.es5) && ($.push(":"), (0, t.addCodeArg)($, E));
      return $.push("}"), new t._Code($);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, $, A) {
      if (this._blockNode(new m(d)), $ && A)
        this.code($).else().code(A).endIf();
      else if ($)
        this.code($).endIf();
      else if (A)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new m(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(d, $) {
      return this._blockNode(d), $ && this.code($).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, $) {
      return this._for(new N(d), $);
    }
    // `for` statement for a range of values
    forRange(d, $, A, E, y = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const j = this._scope.toName(d);
      return this._for(new C(y, j, $, A), () => E(j));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, $, A, E = r.varKinds.const) {
      const y = this._scope.toName(d);
      if (this.opts.es5) {
        const j = $ instanceof t.Name ? $ : this.var("_arr", $);
        return this.forRange("_i", 0, (0, t._)`${j}.length`, (O) => {
          this.var(y, (0, t._)`${j}[${O}]`), A(y);
        });
      }
      return this._for(new M("of", E, y, $), () => A(y));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, $, A, E = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${$})`, A);
      const y = this._scope.toName(d);
      return this._for(new M("in", E, y, $), () => A(y));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new f(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const $ = new K();
      if (this._blockNode($), this.code(d), $.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(K);
    }
    // `try` statement
    try(d, $, A) {
      if (!$ && !A)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const E = new pe();
      if (this._blockNode(E), this.code(d), $) {
        const y = this.name("e");
        this._currNode = E.catch = new I(y), $(y);
      }
      return A && (this._currNode = E.finally = new Z(), this.code(A)), this._endBlockNode(I, Z);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new u(d));
    }
    // start self-balancing block
    block(d, $) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock($), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const $ = this._blockStarts.pop();
      if ($ === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const A = this._nodes.length - $;
      if (A < 0 || d !== void 0 && A !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${d} expected`);
      return this._nodes.length = $, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, $ = t.nil, A, E) {
      return this._blockNode(new z(d, $, A)), E && this.code(E).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, $) {
      const A = this._currNode;
      if (A instanceof d || $ && A instanceof $)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${$ ? `${d.kind}/${$.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const $ = this._currNode;
      if (!($ instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = $.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const $ = this._nodes;
      $[$.length - 1] = d;
    }
  }
  e.CodeGen = B;
  function G(b, d) {
    for (const $ in d)
      b[$] = (b[$] || 0) + (d[$] || 0);
    return b;
  }
  function Q(b, d) {
    return d instanceof t._CodeOrName ? G(b, d.names) : b;
  }
  function k(b, d, $) {
    if (b instanceof t.Name)
      return A(b);
    if (!E(b))
      return b;
    return new t._Code(b._items.reduce((y, j) => (j instanceof t.Name && (j = A(j)), j instanceof t._Code ? y.push(...j._items) : y.push(j), y), []));
    function A(y) {
      const j = $[y.str];
      return j === void 0 || d[y.str] !== 1 ? y : (delete d[y.str], j);
    }
    function E(y) {
      return y instanceof t._Code && y._items.some((j) => j instanceof t.Name && d[j.str] === 1 && $[j.str] !== void 0);
    }
  }
  function D(b, d) {
    for (const $ in d)
      b[$] = (b[$] || 0) - (d[$] || 0);
  }
  function x(b) {
    return typeof b == "boolean" || typeof b == "number" || b === null ? !b : (0, t._)`!${P(b)}`;
  }
  e.not = x;
  const L = S(e.operators.AND);
  function V(...b) {
    return b.reduce(L);
  }
  e.and = V;
  const U = S(e.operators.OR);
  function R(...b) {
    return b.reduce(U);
  }
  e.or = R;
  function S(b) {
    return (d, $) => d === t.nil ? $ : $ === t.nil ? d : (0, t._)`${P(d)} ${b} ${P($)}`;
  }
  function P(b) {
    return b instanceof t.Name ? b : (0, t._)`(${b})`;
  }
})(de);
var X = {};
Object.defineProperty(X, "__esModule", { value: !0 });
X.checkStrictMode = X.getErrorPath = X.Type = X.useFunc = X.setEvaluated = X.evaluatedPropsToName = X.mergeEvaluated = X.eachItem = X.unescapeJsonPointer = X.escapeJsonPointer = X.escapeFragment = X.unescapeFragment = X.schemaRefOrVal = X.schemaHasRulesButRef = X.schemaHasRules = X.checkUnknownRules = X.alwaysValidSchema = X.toHash = void 0;
const be = de, wU = na;
function SU(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
X.toHash = SU;
function bU(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Cv(e, t), !Dv(t, e.self.RULES.all));
}
X.alwaysValidSchema = bU;
function Cv(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || Lv(e, `unknown keyword: "${s}"`);
}
X.checkUnknownRules = Cv;
function Dv(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
X.schemaHasRules = Dv;
function PU(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
X.schemaHasRulesButRef = PU;
function TU({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, be._)`${r}`;
  }
  return (0, be._)`${e}${t}${(0, be.getProperty)(n)}`;
}
X.schemaRefOrVal = TU;
function NU(e) {
  return kv(decodeURIComponent(e));
}
X.unescapeFragment = NU;
function AU(e) {
  return encodeURIComponent(Pd(e));
}
X.escapeFragment = AU;
function Pd(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
X.escapeJsonPointer = Pd;
function kv(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
X.unescapeJsonPointer = kv;
function RU(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
X.eachItem = RU;
function yg({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, a, o) => {
    const c = a === void 0 ? s : a instanceof be.Name ? (s instanceof be.Name ? e(i, s, a) : t(i, s, a), a) : s instanceof be.Name ? (t(i, a, s), s) : r(s, a);
    return o === be.Name && !(c instanceof be.Name) ? n(i, c) : c;
  };
}
X.mergeEvaluated = {
  props: yg({
    mergeNames: (e, t, r) => e.if((0, be._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, be._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, be._)`${r} || {}`).code((0, be._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, be._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, be._)`${r} || {}`), Td(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Fv
  }),
  items: yg({
    mergeNames: (e, t, r) => e.if((0, be._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, be._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, be._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, be._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Fv(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, be._)`{}`);
  return t !== void 0 && Td(e, r, t), r;
}
X.evaluatedPropsToName = Fv;
function Td(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, be._)`${t}${(0, be.getProperty)(n)}`, !0));
}
X.setEvaluated = Td;
const $g = {};
function OU(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: $g[t.code] || ($g[t.code] = new wU._Code(t.code))
  });
}
X.useFunc = OU;
var Ru;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Ru || (X.Type = Ru = {}));
function IU(e, t, r) {
  if (e instanceof be.Name) {
    const n = t === Ru.Num;
    return r ? n ? (0, be._)`"[" + ${e} + "]"` : (0, be._)`"['" + ${e} + "']"` : n ? (0, be._)`"/" + ${e}` : (0, be._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, be.getProperty)(e).toString() : "/" + Pd(e);
}
X.getErrorPath = IU;
function Lv(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
X.checkStrictMode = Lv;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
const at = de, CU = {
  // validation function arguments
  data: new at.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new at.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new at.Name("instancePath"),
  parentData: new at.Name("parentData"),
  parentDataProperty: new at.Name("parentDataProperty"),
  rootData: new at.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new at.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new at.Name("vErrors"),
  // null or array of validation errors
  errors: new at.Name("errors"),
  // counter of validation errors
  this: new at.Name("this"),
  // "globals"
  self: new at.Name("self"),
  scope: new at.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new at.Name("json"),
  jsonPos: new at.Name("jsonPos"),
  jsonLen: new at.Name("jsonLen"),
  jsonPart: new at.Name("jsonPart")
};
Sr.default = CU;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = de, r = X, n = Sr;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, m = e.keywordError, w, N) {
    const { it: C } = v, { gen: M, compositeRule: z, allErrors: K } = C, pe = u(v, m, w);
    N ?? (z || K) ? c(M, pe) : f(C, (0, t._)`[${pe}]`);
  }
  e.reportError = i;
  function s(v, m = e.keywordError, w) {
    const { it: N } = v, { gen: C, compositeRule: M, allErrors: z } = N, K = u(v, m, w);
    c(C, K), M || z || f(N, n.default.vErrors);
  }
  e.reportExtraError = s;
  function a(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = a;
  function o({ gen: v, keyword: m, schemaValue: w, data: N, errsCount: C, it: M }) {
    if (C === void 0)
      throw new Error("ajv implementation error");
    const z = v.name("err");
    v.forRange("i", C, n.default.errors, (K) => {
      v.const(z, (0, t._)`${n.default.vErrors}[${K}]`), v.if((0, t._)`${z}.instancePath === undefined`, () => v.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, M.errorPath))), v.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${M.errSchemaPath}/${m}`), M.opts.verbose && (v.assign((0, t._)`${z}.schema`, w), v.assign((0, t._)`${z}.data`, N));
    });
  }
  e.extendErrors = o;
  function c(v, m) {
    const w = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function f(v, m) {
    const { gen: w, validateName: N, schemaEnv: C } = v;
    C.$async ? w.throw((0, t._)`new ${v.ValidationError}(${m})`) : (w.assign((0, t._)`${N}.errors`, m), w.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function u(v, m, w) {
    const { createErrors: N } = v.it;
    return N === !1 ? (0, t._)`{}` : h(v, m, w);
  }
  function h(v, m, w = {}) {
    const { gen: N, it: C } = v, M = [
      p(C, w),
      _(v, w)
    ];
    return g(v, m, M), N.object(...M);
  }
  function p({ errorPath: v }, { instancePath: m }) {
    const w = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function _({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: N }) {
    let C = N ? m : (0, t.str)`${m}/${v}`;
    return w && (C = (0, t.str)`${C}${(0, r.getErrorPath)(w, r.Type.Str)}`), [l.schemaPath, C];
  }
  function g(v, { params: m, message: w }, N) {
    const { keyword: C, data: M, schemaValue: z, it: K } = v, { opts: pe, propertyName: I, topSchemaRef: Z, schemaPath: B } = K;
    N.push([l.keyword, C], [l.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), pe.messages && N.push([l.message, typeof w == "function" ? w(v) : w]), pe.verbose && N.push([l.schema, z], [l.parentSchema, (0, t._)`${Z}${B}`], [n.default.data, M]), I && N.push([l.propertyName, I]);
  }
})(_a);
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.boolOrEmptySchema = Hi.topBoolOrEmptySchema = void 0;
const DU = _a, kU = de, FU = Sr, LU = {
  message: "boolean schema is false"
};
function jU(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? jv(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(FU.default.data) : (t.assign((0, kU._)`${n}.errors`, null), t.return(!0));
}
Hi.topBoolOrEmptySchema = jU;
function UU(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), jv(e)) : r.var(t, !0);
}
Hi.boolOrEmptySchema = UU;
function jv(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, DU.reportError)(i, LU, void 0, t);
}
var qe = {}, ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.getRules = ti.isJSONType = void 0;
const MU = ["string", "number", "integer", "boolean", "null", "object", "array"], xU = new Set(MU);
function VU(e) {
  return typeof e == "string" && xU.has(e);
}
ti.isJSONType = VU;
function qU() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ti.getRules = qU;
var Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.shouldUseRule = Fr.shouldUseGroup = Fr.schemaHasRulesForType = void 0;
function BU({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Uv(e, n);
}
Fr.schemaHasRulesForType = BU;
function Uv(e, t) {
  return t.rules.some((r) => Mv(e, r));
}
Fr.shouldUseGroup = Uv;
function Mv(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Fr.shouldUseRule = Mv;
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.reportTypeError = qe.checkDataTypes = qe.checkDataType = qe.coerceAndCheckDataType = qe.getJSONTypes = qe.getSchemaTypes = qe.DataType = void 0;
const GU = ti, HU = Fr, zU = _a, fe = de, xv = X;
var Fi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Fi || (qe.DataType = Fi = {}));
function KU(e) {
  const t = Vv(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
qe.getSchemaTypes = KU;
function Vv(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(GU.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
qe.getJSONTypes = Vv;
function WU(e, t) {
  const { gen: r, data: n, opts: i } = e, s = YU(t, i.coerceTypes), a = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, HU.schemaHasRulesForType)(e, t[0]));
  if (a) {
    const o = Nd(t, n, i.strictNumbers, Fi.Wrong);
    r.if(o, () => {
      s.length ? XU(e, t, s) : Ad(e);
    });
  }
  return a;
}
qe.coerceAndCheckDataType = WU;
const qv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function YU(e, t) {
  return t ? e.filter((r) => qv.has(r) || t === "array" && r === "array") : [];
}
function XU(e, t, r) {
  const { gen: n, data: i, opts: s } = e, a = n.let("dataType", (0, fe._)`typeof ${i}`), o = n.let("coerced", (0, fe._)`undefined`);
  s.coerceTypes === "array" && n.if((0, fe._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, fe._)`${i}[0]`).assign(a, (0, fe._)`typeof ${i}`).if(Nd(t, i, s.strictNumbers), () => n.assign(o, i))), n.if((0, fe._)`${o} !== undefined`);
  for (const f of r)
    (qv.has(f) || f === "array" && s.coerceTypes === "array") && c(f);
  n.else(), Ad(e), n.endIf(), n.if((0, fe._)`${o} !== undefined`, () => {
    n.assign(i, o), JU(e, o);
  });
  function c(f) {
    switch (f) {
      case "string":
        n.elseIf((0, fe._)`${a} == "number" || ${a} == "boolean"`).assign(o, (0, fe._)`"" + ${i}`).elseIf((0, fe._)`${i} === null`).assign(o, (0, fe._)`""`);
        return;
      case "number":
        n.elseIf((0, fe._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(o, (0, fe._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, fe._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(o, (0, fe._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, fe._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(o, !1).elseIf((0, fe._)`${i} === "true" || ${i} === 1`).assign(o, !0);
        return;
      case "null":
        n.elseIf((0, fe._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(o, null);
        return;
      case "array":
        n.elseIf((0, fe._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(o, (0, fe._)`[${i}]`);
    }
  }
}
function JU({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, fe._)`${t} !== undefined`, () => e.assign((0, fe._)`${t}[${r}]`, n));
}
function Ou(e, t, r, n = Fi.Correct) {
  const i = n === Fi.Correct ? fe.operators.EQ : fe.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, fe._)`${t} ${i} null`;
    case "array":
      s = (0, fe._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, fe._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = a((0, fe._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = a();
      break;
    default:
      return (0, fe._)`typeof ${t} ${i} ${e}`;
  }
  return n === Fi.Correct ? s : (0, fe.not)(s);
  function a(o = fe.nil) {
    return (0, fe.and)((0, fe._)`typeof ${t} == "number"`, o, r ? (0, fe._)`isFinite(${t})` : fe.nil);
  }
}
qe.checkDataType = Ou;
function Nd(e, t, r, n) {
  if (e.length === 1)
    return Ou(e[0], t, r, n);
  let i;
  const s = (0, xv.toHash)(e);
  if (s.array && s.object) {
    const a = (0, fe._)`typeof ${t} != "object"`;
    i = s.null ? a : (0, fe._)`!${t} || ${a}`, delete s.null, delete s.array, delete s.object;
  } else
    i = fe.nil;
  s.number && delete s.integer;
  for (const a in s)
    i = (0, fe.and)(i, Ou(a, t, r, n));
  return i;
}
qe.checkDataTypes = Nd;
const QU = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, fe._)`{type: ${e}}` : (0, fe._)`{type: ${t}}`
};
function Ad(e) {
  const t = ZU(e);
  (0, zU.reportError)(t, QU);
}
qe.reportTypeError = Ad;
function ZU(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, xv.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Fc = {};
Object.defineProperty(Fc, "__esModule", { value: !0 });
Fc.assignDefaults = void 0;
const mi = de, eM = X;
function tM(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      vg(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => vg(e, s, i.default));
}
Fc.assignDefaults = tM;
function vg(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: a } = e;
  if (r === void 0)
    return;
  const o = (0, mi._)`${s}${(0, mi.getProperty)(t)}`;
  if (i) {
    (0, eM.checkStrictMode)(e, `default is ignored for: ${o}`);
    return;
  }
  let c = (0, mi._)`${o} === undefined`;
  a.useDefaults === "empty" && (c = (0, mi._)`${c} || ${o} === null || ${o} === ""`), n.if(c, (0, mi._)`${o} = ${(0, mi.stringify)(r)}`);
}
var _r = {}, ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.validateUnion = ge.validateArray = ge.usePattern = ge.callValidateCode = ge.schemaProperties = ge.allSchemaProperties = ge.noPropertyInData = ge.propertyInData = ge.isOwnProperty = ge.hasPropFunc = ge.reportMissingProp = ge.checkMissingProp = ge.checkReportMissingProp = void 0;
const Re = de, Rd = X, Qr = Sr, rM = X;
function nM(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(Id(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Re._)`${t}` }, !0), e.error();
  });
}
ge.checkReportMissingProp = nM;
function iM({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Re.or)(...n.map((s) => (0, Re.and)(Id(e, t, s, r.ownProperties), (0, Re._)`${i} = ${s}`)));
}
ge.checkMissingProp = iM;
function sM(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ge.reportMissingProp = sM;
function Bv(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Re._)`Object.prototype.hasOwnProperty`
  });
}
ge.hasPropFunc = Bv;
function Od(e, t, r) {
  return (0, Re._)`${Bv(e)}.call(${t}, ${r})`;
}
ge.isOwnProperty = Od;
function aM(e, t, r, n) {
  const i = (0, Re._)`${t}${(0, Re.getProperty)(r)} !== undefined`;
  return n ? (0, Re._)`${i} && ${Od(e, t, r)}` : i;
}
ge.propertyInData = aM;
function Id(e, t, r, n) {
  const i = (0, Re._)`${t}${(0, Re.getProperty)(r)} === undefined`;
  return n ? (0, Re.or)(i, (0, Re.not)(Od(e, t, r))) : i;
}
ge.noPropertyInData = Id;
function Gv(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ge.allSchemaProperties = Gv;
function oM(e, t) {
  return Gv(t).filter((r) => !(0, Rd.alwaysValidSchema)(e, t[r]));
}
ge.schemaProperties = oM;
function cM({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: a }, o, c, f) {
  const l = f ? (0, Re._)`${e}, ${t}, ${n}${i}` : t, u = [
    [Qr.default.instancePath, (0, Re.strConcat)(Qr.default.instancePath, s)],
    [Qr.default.parentData, a.parentData],
    [Qr.default.parentDataProperty, a.parentDataProperty],
    [Qr.default.rootData, Qr.default.rootData]
  ];
  a.opts.dynamicRef && u.push([Qr.default.dynamicAnchors, Qr.default.dynamicAnchors]);
  const h = (0, Re._)`${l}, ${r.object(...u)}`;
  return c !== Re.nil ? (0, Re._)`${o}.call(${c}, ${h})` : (0, Re._)`${o}(${h})`;
}
ge.callValidateCode = cM;
const lM = (0, Re._)`new RegExp`;
function uM({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Re._)`${i.code === "new RegExp" ? lM : (0, rM.useFunc)(e, i)}(${r}, ${n})`
  });
}
ge.usePattern = uM;
function fM(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, s = t.name("valid");
  if (i.allErrors) {
    const o = t.let("valid", !0);
    return a(() => t.assign(o, !1)), o;
  }
  return t.var(s, !0), a(() => t.break()), s;
  function a(o) {
    const c = t.const("len", (0, Re._)`${r}.length`);
    t.forRange("i", 0, c, (f) => {
      e.subschema({
        keyword: n,
        dataProp: f,
        dataPropType: Rd.Type.Num
      }, s), t.if((0, Re.not)(s), o);
    });
  }
}
ge.validateArray = fM;
function dM(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Rd.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const a = t.let("valid", !1), o = t.name("_valid");
  t.block(() => r.forEach((c, f) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: f,
      compositeRule: !0
    }, o);
    t.assign(a, (0, Re._)`${a} || ${o}`), e.mergeValidEvaluated(l, o) || t.if((0, Re.not)(a));
  })), e.result(a, () => e.reset(), () => e.error(!0));
}
ge.validateUnion = dM;
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.validateKeywordUsage = _r.validSchemaType = _r.funcKeywordCode = _r.macroKeywordCode = void 0;
const pt = de, Bn = Sr, hM = ge, pM = _a;
function mM(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: a } = e, o = t.macro.call(a.self, i, s, a), c = Hv(r, n, o);
  a.opts.validateSchema !== !1 && a.self.validateSchema(o, !0);
  const f = r.name("valid");
  e.subschema({
    schema: o,
    schemaPath: pt.nil,
    errSchemaPath: `${a.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, f), e.pass(f, () => e.error(!0));
}
_r.macroKeywordCode = mM;
function gM(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: a, $data: o, it: c } = e;
  $M(c, t);
  const f = !o && t.compile ? t.compile.call(c.self, s, a, c) : t.validate, l = Hv(n, i, f), u = n.let("valid");
  e.block$data(u, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : u);
  function h() {
    if (t.errors === !1)
      g(), t.modifying && _g(e), v(() => e.error());
    else {
      const m = t.async ? p() : _();
      t.modifying && _g(e), v(() => yM(e, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => g((0, pt._)`await `), (w) => n.assign(u, !1).if((0, pt._)`${w} instanceof ${c.ValidationError}`, () => n.assign(m, (0, pt._)`${w}.errors`), () => n.throw(w))), m;
  }
  function _() {
    const m = (0, pt._)`${l}.errors`;
    return n.assign(m, null), g(pt.nil), m;
  }
  function g(m = t.async ? (0, pt._)`await ` : pt.nil) {
    const w = c.opts.passContext ? Bn.default.this : Bn.default.self, N = !("compile" in t && !o || t.schema === !1);
    n.assign(u, (0, pt._)`${m}${(0, hM.callValidateCode)(e, l, w, N)}`, t.modifying);
  }
  function v(m) {
    var w;
    n.if((0, pt.not)((w = t.valid) !== null && w !== void 0 ? w : u), m);
  }
}
_r.funcKeywordCode = gM;
function _g(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, pt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function yM(e, t) {
  const { gen: r } = e;
  r.if((0, pt._)`Array.isArray(${t})`, () => {
    r.assign(Bn.default.vErrors, (0, pt._)`${Bn.default.vErrors} === null ? ${t} : ${Bn.default.vErrors}.concat(${t})`).assign(Bn.default.errors, (0, pt._)`${Bn.default.vErrors}.length`), (0, pM.extendErrors)(e);
  }, () => e.error());
}
function $M({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Hv(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, pt.stringify)(r) });
}
function vM(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
_r.validSchemaType = vM;
function _M({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const a = i.dependencies;
  if (a != null && a.some((o) => !Object.prototype.hasOwnProperty.call(e, o)))
    throw new Error(`parent schema must have dependencies of ${s}: ${a.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[s])) {
    const c = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
_r.validateKeywordUsage = _M;
var yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.extendSubschemaMode = yn.extendSubschemaData = yn.getSubschema = void 0;
const yr = de, zv = X;
function EM(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: a }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const o = e.schema[t];
    return r === void 0 ? {
      schema: o,
      schemaPath: (0, yr._)`${e.schemaPath}${(0, yr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: o[r],
      schemaPath: (0, yr._)`${e.schemaPath}${(0, yr.getProperty)(t)}${(0, yr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, zv.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || a === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: a,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
yn.getSubschema = EM;
function wM(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: a }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: o } = t;
  if (r !== void 0) {
    const { errorPath: f, dataPathArr: l, opts: u } = t, h = o.let("data", (0, yr._)`${t.data}${(0, yr.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, yr.str)`${f}${(0, zv.getErrorPath)(r, n, u.jsPropertySyntax)}`, e.parentDataProperty = (0, yr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const f = i instanceof yr.Name ? i : o.let("data", i, !0);
    c(f), a !== void 0 && (e.propertyName = a);
  }
  s && (e.dataTypes = s);
  function c(f) {
    e.data = f, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, f];
  }
}
yn.extendSubschemaData = wM;
function SM(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
yn.extendSubschemaMode = SM;
var Qe = {}, Kv = { exports: {} }, hn = Kv.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  No(t, n, i, e, "", e);
};
hn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
hn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
hn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
hn.skipKeywords = {
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
function No(e, t, r, n, i, s, a, o, c, f) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, a, o, c, f);
    for (var l in n) {
      var u = n[l];
      if (Array.isArray(u)) {
        if (l in hn.arrayKeywords)
          for (var h = 0; h < u.length; h++)
            No(e, t, r, u[h], i + "/" + l + "/" + h, s, i, l, n, h);
      } else if (l in hn.propsKeywords) {
        if (u && typeof u == "object")
          for (var p in u)
            No(e, t, r, u[p], i + "/" + l + "/" + bM(p), s, i, l, n, p);
      } else (l in hn.keywords || e.allKeys && !(l in hn.skipKeywords)) && No(e, t, r, u, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, a, o, c, f);
  }
}
function bM(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var PM = Kv.exports;
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.getSchemaRefs = Qe.resolveUrl = Qe.normalizeId = Qe._getFullPath = Qe.getFullPath = Qe.inlineRef = void 0;
const TM = X, NM = Ac, AM = PM, RM = /* @__PURE__ */ new Set([
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
function OM(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Iu(e) : t ? Wv(e) <= t : !1;
}
Qe.inlineRef = OM;
const IM = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Iu(e) {
  for (const t in e) {
    if (IM.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Iu) || typeof r == "object" && Iu(r))
      return !0;
  }
  return !1;
}
function Wv(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !RM.has(r) && (typeof e[r] == "object" && (0, TM.eachItem)(e[r], (n) => t += Wv(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Yv(e, t = "", r) {
  r !== !1 && (t = Li(t));
  const n = e.parse(t);
  return Xv(e, n);
}
Qe.getFullPath = Yv;
function Xv(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Qe._getFullPath = Xv;
const CM = /#\/?$/;
function Li(e) {
  return e ? e.replace(CM, "") : "";
}
Qe.normalizeId = Li;
function DM(e, t, r) {
  return r = Li(r), e.resolve(t, r);
}
Qe.resolveUrl = DM;
const kM = /^[a-z_][-a-z0-9._]*$/i;
function FM(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = Li(e[r] || t), s = { "": i }, a = Yv(n, i, !1), o = {}, c = /* @__PURE__ */ new Set();
  return AM(e, { allKeys: !0 }, (u, h, p, _) => {
    if (_ === void 0)
      return;
    const g = a + h;
    let v = s[_];
    typeof u[r] == "string" && (v = m.call(this, u[r])), w.call(this, u.$anchor), w.call(this, u.$dynamicAnchor), s[h] = v;
    function m(N) {
      const C = this.opts.uriResolver.resolve;
      if (N = Li(v ? C(v, N) : N), c.has(N))
        throw l(N);
      c.add(N);
      let M = this.refs[N];
      return typeof M == "string" && (M = this.refs[M]), typeof M == "object" ? f(u, M.schema, N) : N !== Li(g) && (N[0] === "#" ? (f(u, o[N], N), o[N] = u) : this.refs[N] = g), N;
    }
    function w(N) {
      if (typeof N == "string") {
        if (!kM.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), o;
  function f(u, h, p) {
    if (h !== void 0 && !NM(u, h))
      throw l(p);
  }
  function l(u) {
    return new Error(`reference "${u}" resolves to more than one schema`);
  }
}
Qe.getSchemaRefs = FM;
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.getData = sr.KeywordCxt = sr.validateFunctionCode = void 0;
const Jv = Hi, Eg = qe, Cd = Fr, Xo = qe, LM = Fc, Ls = _r, Vl = yn, te = de, ie = Sr, jM = Qe, Lr = X, $s = _a;
function UM(e) {
  if (e_(e) && (t_(e), Zv(e))) {
    VM(e);
    return;
  }
  Qv(e, () => (0, Jv.topBoolOrEmptySchema)(e));
}
sr.validateFunctionCode = UM;
function Qv({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, te._)`${ie.default.data}, ${ie.default.valCxt}`, n.$async, () => {
    e.code((0, te._)`"use strict"; ${wg(r, i)}`), xM(e, i), e.code(s);
  }) : e.func(t, (0, te._)`${ie.default.data}, ${MM(i)}`, n.$async, () => e.code(wg(r, i)).code(s));
}
function MM(e) {
  return (0, te._)`{${ie.default.instancePath}="", ${ie.default.parentData}, ${ie.default.parentDataProperty}, ${ie.default.rootData}=${ie.default.data}${e.dynamicRef ? (0, te._)`, ${ie.default.dynamicAnchors}={}` : te.nil}}={}`;
}
function xM(e, t) {
  e.if(ie.default.valCxt, () => {
    e.var(ie.default.instancePath, (0, te._)`${ie.default.valCxt}.${ie.default.instancePath}`), e.var(ie.default.parentData, (0, te._)`${ie.default.valCxt}.${ie.default.parentData}`), e.var(ie.default.parentDataProperty, (0, te._)`${ie.default.valCxt}.${ie.default.parentDataProperty}`), e.var(ie.default.rootData, (0, te._)`${ie.default.valCxt}.${ie.default.rootData}`), t.dynamicRef && e.var(ie.default.dynamicAnchors, (0, te._)`${ie.default.valCxt}.${ie.default.dynamicAnchors}`);
  }, () => {
    e.var(ie.default.instancePath, (0, te._)`""`), e.var(ie.default.parentData, (0, te._)`undefined`), e.var(ie.default.parentDataProperty, (0, te._)`undefined`), e.var(ie.default.rootData, ie.default.data), t.dynamicRef && e.var(ie.default.dynamicAnchors, (0, te._)`{}`);
  });
}
function VM(e) {
  const { schema: t, opts: r, gen: n } = e;
  Qv(e, () => {
    r.$comment && t.$comment && n_(e), zM(e), n.let(ie.default.vErrors, null), n.let(ie.default.errors, 0), r.unevaluated && qM(e), r_(e), YM(e);
  });
}
function qM(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, te._)`${r}.evaluated`), t.if((0, te._)`${e.evaluated}.dynamicProps`, () => t.assign((0, te._)`${e.evaluated}.props`, (0, te._)`undefined`)), t.if((0, te._)`${e.evaluated}.dynamicItems`, () => t.assign((0, te._)`${e.evaluated}.items`, (0, te._)`undefined`));
}
function wg(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, te._)`/*# sourceURL=${r} */` : te.nil;
}
function BM(e, t) {
  if (e_(e) && (t_(e), Zv(e))) {
    GM(e, t);
    return;
  }
  (0, Jv.boolOrEmptySchema)(e, t);
}
function Zv({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function e_(e) {
  return typeof e.schema != "boolean";
}
function GM(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && n_(e), KM(e), WM(e);
  const s = n.const("_errs", ie.default.errors);
  r_(e, s), n.var(t, (0, te._)`${s} === ${ie.default.errors}`);
}
function t_(e) {
  (0, Lr.checkUnknownRules)(e), HM(e);
}
function r_(e, t) {
  if (e.opts.jtd)
    return Sg(e, [], !1, t);
  const r = (0, Eg.getSchemaTypes)(e.schema), n = (0, Eg.coerceAndCheckDataType)(e, r);
  Sg(e, r, !n, t);
}
function HM(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Lr.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function zM(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Lr.checkStrictMode)(e, "default is ignored in the schema root");
}
function KM(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, jM.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function WM(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function n_({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, te._)`${ie.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const a = (0, te.str)`${n}/$comment`, o = e.scopeValue("root", { ref: t.root });
    e.code((0, te._)`${ie.default.self}.opts.$comment(${s}, ${a}, ${o}.schema)`);
  }
}
function YM(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, te._)`${ie.default.errors} === 0`, () => t.return(ie.default.data), () => t.throw((0, te._)`new ${i}(${ie.default.vErrors})`)) : (t.assign((0, te._)`${n}.errors`, ie.default.vErrors), s.unevaluated && XM(e), t.return((0, te._)`${ie.default.errors} === 0`));
}
function XM({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof te.Name && e.assign((0, te._)`${t}.props`, r), n instanceof te.Name && e.assign((0, te._)`${t}.items`, n);
}
function Sg(e, t, r, n) {
  const { gen: i, schema: s, data: a, allErrors: o, opts: c, self: f } = e, { RULES: l } = f;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Lr.schemaHasRulesButRef)(s, l))) {
    i.block(() => a_(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || JM(e, t), i.block(() => {
    for (const h of l.rules)
      u(h);
    u(l.post);
  });
  function u(h) {
    (0, Cd.shouldUseGroup)(s, h) && (h.type ? (i.if((0, Xo.checkDataType)(h.type, a, c.strictNumbers)), bg(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, Xo.reportTypeError)(e)), i.endIf()) : bg(e, h), o || i.if((0, te._)`${ie.default.errors} === ${n || 0}`));
  }
}
function bg(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, LM.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, Cd.shouldUseRule)(n, s) && a_(e, s.keyword, s.definition, t.type);
  });
}
function JM(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (QM(e, t), e.opts.allowUnionTypes || ZM(e, t), e2(e, e.dataTypes));
}
function QM(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      i_(e.dataTypes, r) || Dd(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), r2(e, t);
  }
}
function ZM(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Dd(e, "use allowUnionTypes to allow union type keyword");
}
function e2(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, Cd.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((a) => t2(t, a)) && Dd(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function t2(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function i_(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function r2(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    i_(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Dd(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Lr.checkStrictMode)(e, t, e.opts.strictTypes);
}
class s_ {
  constructor(t, r, n) {
    if ((0, Ls.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Lr.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", o_(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Ls.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", ie.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, te.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, te.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, te._)`${r} !== undefined && (${(0, te.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? $s.reportExtraError : $s.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, $s.reportError)(this, this.def.$dataError || $s.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, $s.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = te.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = te.nil, r = te.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: a } = this;
    n.if((0, te.or)((0, te._)`${i} === undefined`, r)), t !== te.nil && n.assign(t, !0), (s.length || a.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== te.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: s } = this;
    return (0, te.or)(a(), o());
    function a() {
      if (n.length) {
        if (!(r instanceof te.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, te._)`${(0, Xo.checkDataTypes)(c, r, s.opts.strictNumbers, Xo.DataType.Wrong)}`;
      }
      return te.nil;
    }
    function o() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, te._)`!${c}(${r})`;
      }
      return te.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Vl.getSubschema)(this.it, t);
    (0, Vl.extendSubschemaData)(n, this.it, t), (0, Vl.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return BM(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Lr.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Lr.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, te.Name)), !0;
  }
}
sr.KeywordCxt = s_;
function a_(e, t, r, n) {
  const i = new s_(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, Ls.funcKeywordCode)(i, r) : "macro" in r ? (0, Ls.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, Ls.funcKeywordCode)(i, r);
}
const n2 = /^\/(?:[^~]|~0|~1)*$/, i2 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function o_(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return ie.default.rootData;
  if (e[0] === "/") {
    if (!n2.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = ie.default.rootData;
  } else {
    const f = i2.exec(e);
    if (!f)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +f[1];
    if (i = f[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (s = r[t - l], !i)
      return s;
  }
  let a = s;
  const o = i.split("/");
  for (const f of o)
    f && (s = (0, te._)`${s}${(0, te.getProperty)((0, Lr.unescapeJsonPointer)(f))}`, a = (0, te._)`${a} && ${s}`);
  return a;
  function c(f, l) {
    return `Cannot access ${f} ${l} levels up, current level is ${t}`;
  }
}
sr.getData = o_;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
class s2 extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Ea.default = s2;
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const ql = Qe;
class a2 extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, ql.resolveUrl)(t, r, n), this.missingSchema = (0, ql.normalizeId)((0, ql.getFullPath)(t, this.missingRef));
  }
}
ns.default = a2;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.resolveSchema = At.getCompilingSchema = At.resolveRef = At.compileSchema = At.SchemaEnv = void 0;
const Xt = de, o2 = Ea, Fn = Sr, rr = Qe, Pg = X, c2 = sr;
class Lc {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, rr.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
At.SchemaEnv = Lc;
function kd(e) {
  const t = c_.call(this, e);
  if (t)
    return t;
  const r = (0, rr.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, a = new Xt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let o;
  e.$async && (o = a.scopeValue("Error", {
    ref: o2.default,
    code: (0, Xt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = a.scopeName("validate");
  e.validateName = c;
  const f = {
    gen: a,
    allErrors: this.opts.allErrors,
    data: Fn.default.data,
    parentData: Fn.default.parentData,
    parentDataProperty: Fn.default.parentDataProperty,
    dataNames: [Fn.default.data],
    dataPathArr: [Xt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: a.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Xt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: o,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Xt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Xt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, c2.validateFunctionCode)(f), a.optimize(this.opts.code.optimize);
    const u = a.toString();
    l = `${a.scopeRefs(Fn.default.scope)}return ${u}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${Fn.default.self}`, `${Fn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: u, scopeValues: a._values }), this.opts.unevaluated) {
      const { props: _, items: g } = f;
      p.evaluated = {
        props: _ instanceof Xt.Name ? void 0 : _,
        items: g instanceof Xt.Name ? void 0 : g,
        dynamicProps: _ instanceof Xt.Name,
        dynamicItems: g instanceof Xt.Name
      }, p.source && (p.source.evaluated = (0, Xt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (u) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), u;
  } finally {
    this._compilations.delete(e);
  }
}
At.compileSchema = kd;
function l2(e, t, r) {
  var n;
  r = (0, rr.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = d2.call(this, e, r);
  if (s === void 0) {
    const a = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: o } = this.opts;
    a && (s = new Lc({ schema: a, schemaId: o, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = u2.call(this, s);
}
At.resolveRef = l2;
function u2(e) {
  return (0, rr.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : kd.call(this, e);
}
function c_(e) {
  for (const t of this._compilations)
    if (f2(t, e))
      return t;
}
At.getCompilingSchema = c_;
function f2(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function d2(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || jc.call(this, e, t);
}
function jc(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, rr._getFullPath)(this.opts.uriResolver, r);
  let i = (0, rr.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Bl.call(this, r, e);
  const s = (0, rr.normalizeId)(n), a = this.refs[s] || this.schemas[s];
  if (typeof a == "string") {
    const o = jc.call(this, e, a);
    return typeof (o == null ? void 0 : o.schema) != "object" ? void 0 : Bl.call(this, r, o);
  }
  if (typeof (a == null ? void 0 : a.schema) == "object") {
    if (a.validate || kd.call(this, a), s === (0, rr.normalizeId)(t)) {
      const { schema: o } = a, { schemaId: c } = this.opts, f = o[c];
      return f && (i = (0, rr.resolveUrl)(this.opts.uriResolver, i, f)), new Lc({ schema: o, schemaId: c, root: e, baseId: i });
    }
    return Bl.call(this, r, a);
  }
}
At.resolveSchema = jc;
const h2 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Bl(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const o of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Pg.unescapeFragment)(o)];
    if (c === void 0)
      return;
    r = c;
    const f = typeof r == "object" && r[this.opts.schemaId];
    !h2.has(o) && f && (t = (0, rr.resolveUrl)(this.opts.uriResolver, t, f));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, Pg.schemaHasRulesButRef)(r, this.RULES)) {
    const o = (0, rr.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = jc.call(this, n, o);
  }
  const { schemaId: a } = this.opts;
  if (s = s || new Lc({ schema: r, schemaId: a, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const p2 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", m2 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", g2 = "object", y2 = [
  "$data"
], $2 = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, v2 = !1, _2 = {
  $id: p2,
  description: m2,
  type: g2,
  required: y2,
  properties: $2,
  additionalProperties: v2
};
var Fd = {};
Object.defineProperty(Fd, "__esModule", { value: !0 });
const l_ = $v;
l_.code = 'require("ajv/dist/runtime/uri").default';
Fd.default = l_;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = sr;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = de;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Ea, i = ns, s = ti, a = At, o = de, c = Qe, f = qe, l = X, u = _2, h = Fd, p = (R, S) => new RegExp(R, S);
  p.code = "new RegExp";
  const _ = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
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
  ]), v = {
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
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function N(R) {
    var S, P, b, d, $, A, E, y, j, O, Y, he, $e, Te, Oe, tt, we, xe, Ht, jt, It, Ut, br, Pr, Tr;
    const Ct = R.strict, Mt = (S = R.code) === null || S === void 0 ? void 0 : S.optimize, Nr = Mt === !0 || Mt === void 0 ? 1 : Mt || 0, qr = (b = (P = R.code) === null || P === void 0 ? void 0 : P.regExp) !== null && b !== void 0 ? b : p, bt = (d = R.uriResolver) !== null && d !== void 0 ? d : h.default;
    return {
      strictSchema: (A = ($ = R.strictSchema) !== null && $ !== void 0 ? $ : Ct) !== null && A !== void 0 ? A : !0,
      strictNumbers: (y = (E = R.strictNumbers) !== null && E !== void 0 ? E : Ct) !== null && y !== void 0 ? y : !0,
      strictTypes: (O = (j = R.strictTypes) !== null && j !== void 0 ? j : Ct) !== null && O !== void 0 ? O : "log",
      strictTuples: (he = (Y = R.strictTuples) !== null && Y !== void 0 ? Y : Ct) !== null && he !== void 0 ? he : "log",
      strictRequired: (Te = ($e = R.strictRequired) !== null && $e !== void 0 ? $e : Ct) !== null && Te !== void 0 ? Te : !1,
      code: R.code ? { ...R.code, optimize: Nr, regExp: qr } : { optimize: Nr, regExp: qr },
      loopRequired: (Oe = R.loopRequired) !== null && Oe !== void 0 ? Oe : w,
      loopEnum: (tt = R.loopEnum) !== null && tt !== void 0 ? tt : w,
      meta: (we = R.meta) !== null && we !== void 0 ? we : !0,
      messages: (xe = R.messages) !== null && xe !== void 0 ? xe : !0,
      inlineRefs: (Ht = R.inlineRefs) !== null && Ht !== void 0 ? Ht : !0,
      schemaId: (jt = R.schemaId) !== null && jt !== void 0 ? jt : "$id",
      addUsedSchema: (It = R.addUsedSchema) !== null && It !== void 0 ? It : !0,
      validateSchema: (Ut = R.validateSchema) !== null && Ut !== void 0 ? Ut : !0,
      validateFormats: (br = R.validateFormats) !== null && br !== void 0 ? br : !0,
      unicodeRegExp: (Pr = R.unicodeRegExp) !== null && Pr !== void 0 ? Pr : !0,
      int32range: (Tr = R.int32range) !== null && Tr !== void 0 ? Tr : !0,
      uriResolver: bt
    };
  }
  class C {
    constructor(S = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), S = this.opts = { ...S, ...N(S) };
      const { es5: P, lines: b } = this.opts.code;
      this.scope = new o.ValueScope({ scope: {}, prefixes: g, es5: P, lines: b }), this.logger = G(S.logger);
      const d = S.validateFormats;
      S.validateFormats = !1, this.RULES = (0, s.getRules)(), M.call(this, v, S, "NOT SUPPORTED"), M.call(this, m, S, "DEPRECATED", "warn"), this._metaOpts = Z.call(this), S.formats && pe.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), S.keywords && I.call(this, S.keywords), typeof S.meta == "object" && this.addMetaSchema(S.meta), K.call(this), S.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: S, meta: P, schemaId: b } = this.opts;
      let d = u;
      b === "id" && (d = { ...u }, d.id = d.$id, delete d.$id), P && S && this.addMetaSchema(d, d[b], !1);
    }
    defaultMeta() {
      const { meta: S, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof S == "object" ? S[P] || S : void 0;
    }
    validate(S, P) {
      let b;
      if (typeof S == "string") {
        if (b = this.getSchema(S), !b)
          throw new Error(`no schema with key or ref "${S}"`);
      } else
        b = this.compile(S);
      const d = b(P);
      return "$async" in b || (this.errors = b.errors), d;
    }
    compile(S, P) {
      const b = this._addSchema(S, P);
      return b.validate || this._compileSchemaEnv(b);
    }
    compileAsync(S, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: b } = this.opts;
      return d.call(this, S, P);
      async function d(O, Y) {
        await $.call(this, O.$schema);
        const he = this._addSchema(O, Y);
        return he.validate || A.call(this, he);
      }
      async function $(O) {
        O && !this.getSchema(O) && await d.call(this, { $ref: O }, !0);
      }
      async function A(O) {
        try {
          return this._compileSchemaEnv(O);
        } catch (Y) {
          if (!(Y instanceof i.default))
            throw Y;
          return E.call(this, Y), await y.call(this, Y.missingSchema), A.call(this, O);
        }
      }
      function E({ missingSchema: O, missingRef: Y }) {
        if (this.refs[O])
          throw new Error(`AnySchema ${O} is loaded but ${Y} cannot be resolved`);
      }
      async function y(O) {
        const Y = await j.call(this, O);
        this.refs[O] || await $.call(this, Y.$schema), this.refs[O] || this.addSchema(Y, O, P);
      }
      async function j(O) {
        const Y = this._loading[O];
        if (Y)
          return Y;
        try {
          return await (this._loading[O] = b(O));
        } finally {
          delete this._loading[O];
        }
      }
    }
    // Adds schema to the instance
    addSchema(S, P, b, d = this.opts.validateSchema) {
      if (Array.isArray(S)) {
        for (const A of S)
          this.addSchema(A, void 0, b, d);
        return this;
      }
      let $;
      if (typeof S == "object") {
        const { schemaId: A } = this.opts;
        if ($ = S[A], $ !== void 0 && typeof $ != "string")
          throw new Error(`schema ${A} must be string`);
      }
      return P = (0, c.normalizeId)(P || $), this._checkUnique(P), this.schemas[P] = this._addSchema(S, b, P, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(S, P, b = this.opts.validateSchema) {
      return this.addSchema(S, P, !0, b), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(S, P) {
      if (typeof S == "boolean")
        return !0;
      let b;
      if (b = S.$schema, b !== void 0 && typeof b != "string")
        throw new Error("$schema must be a string");
      if (b = b || this.opts.defaultMeta || this.defaultMeta(), !b)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(b, S);
      if (!d && P) {
        const $ = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error($);
        else
          throw new Error($);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(S) {
      let P;
      for (; typeof (P = z.call(this, S)) == "string"; )
        S = P;
      if (P === void 0) {
        const { schemaId: b } = this.opts, d = new a.SchemaEnv({ schema: {}, schemaId: b });
        if (P = a.resolveSchema.call(this, d, S), !P)
          return;
        this.refs[S] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(S) {
      if (S instanceof RegExp)
        return this._removeAllSchemas(this.schemas, S), this._removeAllSchemas(this.refs, S), this;
      switch (typeof S) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = z.call(this, S);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[S], delete this.refs[S], this;
        }
        case "object": {
          const P = S;
          this._cache.delete(P);
          let b = S[this.opts.schemaId];
          return b && (b = (0, c.normalizeId)(b), delete this.schemas[b], delete this.refs[b]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(S) {
      for (const P of S)
        this.addKeyword(P);
      return this;
    }
    addKeyword(S, P) {
      let b;
      if (typeof S == "string")
        b = S, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = b);
      else if (typeof S == "object" && P === void 0) {
        if (P = S, b = P.keyword, Array.isArray(b) && !b.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (k.call(this, b, P), !P)
        return (0, l.eachItem)(b, ($) => D.call(this, $)), this;
      L.call(this, P);
      const d = {
        ...P,
        type: (0, f.getJSONTypes)(P.type),
        schemaType: (0, f.getJSONTypes)(P.schemaType)
      };
      return (0, l.eachItem)(b, d.type.length === 0 ? ($) => D.call(this, $, d) : ($) => d.type.forEach((A) => D.call(this, $, d, A))), this;
    }
    getKeyword(S) {
      const P = this.RULES.all[S];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(S) {
      const { RULES: P } = this;
      delete P.keywords[S], delete P.all[S];
      for (const b of P.rules) {
        const d = b.rules.findIndex(($) => $.keyword === S);
        d >= 0 && b.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(S, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[S] = P, this;
    }
    errorsText(S = this.errors, { separator: P = ", ", dataVar: b = "data" } = {}) {
      return !S || S.length === 0 ? "No errors" : S.map((d) => `${b}${d.instancePath} ${d.message}`).reduce((d, $) => d + P + $);
    }
    $dataMetaSchema(S, P) {
      const b = this.RULES.all;
      S = JSON.parse(JSON.stringify(S));
      for (const d of P) {
        const $ = d.split("/").slice(1);
        let A = S;
        for (const E of $)
          A = A[E];
        for (const E in b) {
          const y = b[E];
          if (typeof y != "object")
            continue;
          const { $data: j } = y.definition, O = A[E];
          j && O && (A[E] = U(O));
        }
      }
      return S;
    }
    _removeAllSchemas(S, P) {
      for (const b in S) {
        const d = S[b];
        (!P || P.test(b)) && (typeof d == "string" ? delete S[b] : d && !d.meta && (this._cache.delete(d.schema), delete S[b]));
      }
    }
    _addSchema(S, P, b, d = this.opts.validateSchema, $ = this.opts.addUsedSchema) {
      let A;
      const { schemaId: E } = this.opts;
      if (typeof S == "object")
        A = S[E];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof S != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let y = this._cache.get(S);
      if (y !== void 0)
        return y;
      b = (0, c.normalizeId)(A || b);
      const j = c.getSchemaRefs.call(this, S, b);
      return y = new a.SchemaEnv({ schema: S, schemaId: E, meta: P, baseId: b, localRefs: j }), this._cache.set(y.schema, y), $ && !b.startsWith("#") && (b && this._checkUnique(b), this.refs[b] = y), d && this.validateSchema(S, !0), y;
    }
    _checkUnique(S) {
      if (this.schemas[S] || this.refs[S])
        throw new Error(`schema with key or id "${S}" already exists`);
    }
    _compileSchemaEnv(S) {
      if (S.meta ? this._compileMetaSchema(S) : a.compileSchema.call(this, S), !S.validate)
        throw new Error("ajv implementation error");
      return S.validate;
    }
    _compileMetaSchema(S) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        a.compileSchema.call(this, S);
      } finally {
        this.opts = P;
      }
    }
  }
  C.ValidationError = n.default, C.MissingRefError = i.default, e.default = C;
  function M(R, S, P, b = "error") {
    for (const d in R) {
      const $ = d;
      $ in S && this.logger[b](`${P}: option ${d}. ${R[$]}`);
    }
  }
  function z(R) {
    return R = (0, c.normalizeId)(R), this.schemas[R] || this.refs[R];
  }
  function K() {
    const R = this.opts.schemas;
    if (R)
      if (Array.isArray(R))
        this.addSchema(R);
      else
        for (const S in R)
          this.addSchema(R[S], S);
  }
  function pe() {
    for (const R in this.opts.formats) {
      const S = this.opts.formats[R];
      S && this.addFormat(R, S);
    }
  }
  function I(R) {
    if (Array.isArray(R)) {
      this.addVocabulary(R);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const S in R) {
      const P = R[S];
      P.keyword || (P.keyword = S), this.addKeyword(P);
    }
  }
  function Z() {
    const R = { ...this.opts };
    for (const S of _)
      delete R[S];
    return R;
  }
  const B = { log() {
  }, warn() {
  }, error() {
  } };
  function G(R) {
    if (R === !1)
      return B;
    if (R === void 0)
      return console;
    if (R.log && R.warn && R.error)
      return R;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function k(R, S) {
    const { RULES: P } = this;
    if ((0, l.eachItem)(R, (b) => {
      if (P.keywords[b])
        throw new Error(`Keyword ${b} is already defined`);
      if (!Q.test(b))
        throw new Error(`Keyword ${b} has invalid name`);
    }), !!S && S.$data && !("code" in S || "validate" in S))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function D(R, S, P) {
    var b;
    const d = S == null ? void 0 : S.post;
    if (P && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: $ } = this;
    let A = d ? $.post : $.rules.find(({ type: y }) => y === P);
    if (A || (A = { type: P, rules: [] }, $.rules.push(A)), $.keywords[R] = !0, !S)
      return;
    const E = {
      keyword: R,
      definition: {
        ...S,
        type: (0, f.getJSONTypes)(S.type),
        schemaType: (0, f.getJSONTypes)(S.schemaType)
      }
    };
    S.before ? x.call(this, A, E, S.before) : A.rules.push(E), $.all[R] = E, (b = S.implements) === null || b === void 0 || b.forEach((y) => this.addKeyword(y));
  }
  function x(R, S, P) {
    const b = R.rules.findIndex((d) => d.keyword === P);
    b >= 0 ? R.rules.splice(b, 0, S) : (R.rules.push(S), this.logger.warn(`rule ${P} is not defined`));
  }
  function L(R) {
    let { metaSchema: S } = R;
    S !== void 0 && (R.$data && this.opts.$data && (S = U(S)), R.validateSchema = this.compile(S, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function U(R) {
    return { anyOf: [R, V] };
  }
})(Iv);
var Ld = {}, jd = {}, Ud = {};
Object.defineProperty(Ud, "__esModule", { value: !0 });
const E2 = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ud.default = E2;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.callRef = ri.getValidate = void 0;
const w2 = ns, Tg = ge, Nt = de, gi = Sr, Ng = At, ro = X, S2 = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: a, opts: o, self: c } = n, { root: f } = s;
    if ((r === "#" || r === "#/") && i === f.baseId)
      return u();
    const l = Ng.resolveRef.call(c, f, i, r);
    if (l === void 0)
      throw new w2.default(n.opts.uriResolver, i, r);
    if (l instanceof Ng.SchemaEnv)
      return h(l);
    return p(l);
    function u() {
      if (s === f)
        return Ao(e, a, s, s.$async);
      const _ = t.scopeValue("root", { ref: f });
      return Ao(e, (0, Nt._)`${_}.validate`, f, f.$async);
    }
    function h(_) {
      const g = u_(e, _);
      Ao(e, g, _, _.$async);
    }
    function p(_) {
      const g = t.scopeValue("schema", o.code.source === !0 ? { ref: _, code: (0, Nt.stringify)(_) } : { ref: _ }), v = t.name("valid"), m = e.subschema({
        schema: _,
        dataTypes: [],
        schemaPath: Nt.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function u_(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Nt._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
ri.getValidate = u_;
function Ao(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: a, schemaEnv: o, opts: c } = s, f = c.passContext ? gi.default.this : Nt.nil;
  n ? l() : u();
  function l() {
    if (!o.$async)
      throw new Error("async schema referenced by sync schema");
    const _ = i.let("valid");
    i.try(() => {
      i.code((0, Nt._)`await ${(0, Tg.callValidateCode)(e, t, f)}`), p(t), a || i.assign(_, !0);
    }, (g) => {
      i.if((0, Nt._)`!(${g} instanceof ${s.ValidationError})`, () => i.throw(g)), h(g), a || i.assign(_, !1);
    }), e.ok(_);
  }
  function u() {
    e.result((0, Tg.callValidateCode)(e, t, f), () => p(t), () => h(t));
  }
  function h(_) {
    const g = (0, Nt._)`${_}.errors`;
    i.assign(gi.default.vErrors, (0, Nt._)`${gi.default.vErrors} === null ? ${g} : ${gi.default.vErrors}.concat(${g})`), i.assign(gi.default.errors, (0, Nt._)`${gi.default.vErrors}.length`);
  }
  function p(_) {
    var g;
    if (!s.opts.unevaluated)
      return;
    const v = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (s.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (s.props = ro.mergeEvaluated.props(i, v.props, s.props));
      else {
        const m = i.var("props", (0, Nt._)`${_}.evaluated.props`);
        s.props = ro.mergeEvaluated.props(i, m, s.props, Nt.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = ro.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, Nt._)`${_}.evaluated.items`);
        s.items = ro.mergeEvaluated.items(i, m, s.items, Nt.Name);
      }
  }
}
ri.callRef = Ao;
ri.default = S2;
Object.defineProperty(jd, "__esModule", { value: !0 });
const b2 = Ud, P2 = ri, T2 = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  b2.default,
  P2.default
];
jd.default = T2;
var Md = {}, xd = {};
Object.defineProperty(xd, "__esModule", { value: !0 });
const Jo = de, Zr = Jo.operators, Qo = {
  maximum: { okStr: "<=", ok: Zr.LTE, fail: Zr.GT },
  minimum: { okStr: ">=", ok: Zr.GTE, fail: Zr.LT },
  exclusiveMaximum: { okStr: "<", ok: Zr.LT, fail: Zr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Zr.GT, fail: Zr.LTE }
}, N2 = {
  message: ({ keyword: e, schemaCode: t }) => (0, Jo.str)`must be ${Qo[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Jo._)`{comparison: ${Qo[e].okStr}, limit: ${t}}`
}, A2 = {
  keyword: Object.keys(Qo),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: N2,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Jo._)`${r} ${Qo[t].fail} ${n} || isNaN(${r})`);
  }
};
xd.default = A2;
var Vd = {};
Object.defineProperty(Vd, "__esModule", { value: !0 });
const js = de, R2 = {
  message: ({ schemaCode: e }) => (0, js.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, js._)`{multipleOf: ${e}}`
}, O2 = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: R2,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, a = t.let("res"), o = s ? (0, js._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}` : (0, js._)`${a} !== parseInt(${a})`;
    e.fail$data((0, js._)`(${n} === 0 || (${a} = ${r}/${n}, ${o}))`);
  }
};
Vd.default = O2;
var qd = {}, Bd = {};
Object.defineProperty(Bd, "__esModule", { value: !0 });
function f_(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Bd.default = f_;
f_.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(qd, "__esModule", { value: !0 });
const Gn = de, I2 = X, C2 = Bd, D2 = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Gn.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Gn._)`{limit: ${e}}`
}, k2 = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: D2,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? Gn.operators.GT : Gn.operators.LT, a = i.opts.unicode === !1 ? (0, Gn._)`${r}.length` : (0, Gn._)`${(0, I2.useFunc)(e.gen, C2.default)}(${r})`;
    e.fail$data((0, Gn._)`${a} ${s} ${n}`);
  }
};
qd.default = k2;
var Gd = {};
Object.defineProperty(Gd, "__esModule", { value: !0 });
const F2 = ge, Zo = de, L2 = {
  message: ({ schemaCode: e }) => (0, Zo.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Zo._)`{pattern: ${e}}`
}, j2 = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: L2,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: s } = e, a = s.opts.unicodeRegExp ? "u" : "", o = r ? (0, Zo._)`(new RegExp(${i}, ${a}))` : (0, F2.usePattern)(e, n);
    e.fail$data((0, Zo._)`!${o}.test(${t})`);
  }
};
Gd.default = j2;
var Hd = {};
Object.defineProperty(Hd, "__esModule", { value: !0 });
const Us = de, U2 = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Us.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Us._)`{limit: ${e}}`
}, M2 = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: U2,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? Us.operators.GT : Us.operators.LT;
    e.fail$data((0, Us._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Hd.default = M2;
var zd = {};
Object.defineProperty(zd, "__esModule", { value: !0 });
const vs = ge, Ms = de, x2 = X, V2 = {
  message: ({ params: { missingProperty: e } }) => (0, Ms.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Ms._)`{missingProperty: ${e}}`
}, q2 = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: V2,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: s, it: a } = e, { opts: o } = a;
    if (!s && r.length === 0)
      return;
    const c = r.length >= o.loopRequired;
    if (a.allErrors ? f() : l(), o.strictRequired) {
      const p = e.parentSchema.properties, { definedProperties: _ } = e.it;
      for (const g of r)
        if ((p == null ? void 0 : p[g]) === void 0 && !_.has(g)) {
          const v = a.schemaEnv.baseId + a.errSchemaPath, m = `required property "${g}" is not defined at "${v}" (strictRequired)`;
          (0, x2.checkStrictMode)(a, m, a.opts.strictRequired);
        }
    }
    function f() {
      if (c || s)
        e.block$data(Ms.nil, u);
      else
        for (const p of r)
          (0, vs.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || s) {
        const _ = t.let("valid", !0);
        e.block$data(_, () => h(p, _)), e.ok(_);
      } else
        t.if((0, vs.checkMissingProp)(e, r, p)), (0, vs.reportMissingProp)(e, p), t.else();
    }
    function u() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, vs.noPropertyInData)(t, i, p, o.ownProperties), () => e.error());
      });
    }
    function h(p, _) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign(_, (0, vs.propertyInData)(t, i, p, o.ownProperties)), t.if((0, Ms.not)(_), () => {
          e.error(), t.break();
        });
      }, Ms.nil);
    }
  }
};
zd.default = q2;
var Kd = {};
Object.defineProperty(Kd, "__esModule", { value: !0 });
const xs = de, B2 = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, xs.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, xs._)`{limit: ${e}}`
}, G2 = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: B2,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? xs.operators.GT : xs.operators.LT;
    e.fail$data((0, xs._)`${r}.length ${i} ${n}`);
  }
};
Kd.default = G2;
var Wd = {}, wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const d_ = Ac;
d_.code = 'require("ajv/dist/runtime/equal").default';
wa.default = d_;
Object.defineProperty(Wd, "__esModule", { value: !0 });
const Gl = qe, Xe = de, H2 = X, z2 = wa, K2 = {
  message: ({ params: { i: e, j: t } }) => (0, Xe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Xe._)`{i: ${e}, j: ${t}}`
}, W2 = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: K2,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: a, it: o } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), f = s.items ? (0, Gl.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, Xe._)`${a} === false`), e.ok(c);
    function l() {
      const _ = t.let("i", (0, Xe._)`${r}.length`), g = t.let("j");
      e.setParams({ i: _, j: g }), t.assign(c, !0), t.if((0, Xe._)`${_} > 1`, () => (u() ? h : p)(_, g));
    }
    function u() {
      return f.length > 0 && !f.some((_) => _ === "object" || _ === "array");
    }
    function h(_, g) {
      const v = t.name("item"), m = (0, Gl.checkDataTypes)(f, v, o.opts.strictNumbers, Gl.DataType.Wrong), w = t.const("indices", (0, Xe._)`{}`);
      t.for((0, Xe._)`;${_}--;`, () => {
        t.let(v, (0, Xe._)`${r}[${_}]`), t.if(m, (0, Xe._)`continue`), f.length > 1 && t.if((0, Xe._)`typeof ${v} == "string"`, (0, Xe._)`${v} += "_"`), t.if((0, Xe._)`typeof ${w}[${v}] == "number"`, () => {
          t.assign(g, (0, Xe._)`${w}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Xe._)`${w}[${v}] = ${_}`);
      });
    }
    function p(_, g) {
      const v = (0, H2.useFunc)(t, z2.default), m = t.name("outer");
      t.label(m).for((0, Xe._)`;${_}--;`, () => t.for((0, Xe._)`${g} = ${_}; ${g}--;`, () => t.if((0, Xe._)`${v}(${r}[${_}], ${r}[${g}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Wd.default = W2;
var Yd = {};
Object.defineProperty(Yd, "__esModule", { value: !0 });
const Cu = de, Y2 = X, X2 = wa, J2 = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Cu._)`{allowedValue: ${e}}`
}, Q2 = {
  keyword: "const",
  $data: !0,
  error: J2,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, Cu._)`!${(0, Y2.useFunc)(t, X2.default)}(${r}, ${i})`) : e.fail((0, Cu._)`${s} !== ${r}`);
  }
};
Yd.default = Q2;
var Xd = {};
Object.defineProperty(Xd, "__esModule", { value: !0 });
const Ts = de, Z2 = X, ex = wa, tx = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Ts._)`{allowedValues: ${e}}`
}, rx = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: tx,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: a } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const o = i.length >= a.opts.loopEnum;
    let c;
    const f = () => c ?? (c = (0, Z2.useFunc)(t, ex.default));
    let l;
    if (o || n)
      l = t.let("valid"), e.block$data(l, u);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", s);
      l = (0, Ts.or)(...i.map((_, g) => h(p, g)));
    }
    e.pass(l);
    function u() {
      t.assign(l, !1), t.forOf("v", s, (p) => t.if((0, Ts._)`${f()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, _) {
      const g = i[_];
      return typeof g == "object" && g !== null ? (0, Ts._)`${f()}(${r}, ${p}[${_}])` : (0, Ts._)`${r} === ${g}`;
    }
  }
};
Xd.default = rx;
Object.defineProperty(Md, "__esModule", { value: !0 });
const nx = xd, ix = Vd, sx = qd, ax = Gd, ox = Hd, cx = zd, lx = Kd, ux = Wd, fx = Yd, dx = Xd, hx = [
  // number
  nx.default,
  ix.default,
  // string
  sx.default,
  ax.default,
  // object
  ox.default,
  cx.default,
  // array
  lx.default,
  ux.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  fx.default,
  dx.default
];
Md.default = hx;
var Jd = {}, is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
is.validateAdditionalItems = void 0;
const Hn = de, Du = X, px = {
  message: ({ params: { len: e } }) => (0, Hn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Hn._)`{limit: ${e}}`
}, mx = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: px,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Du.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    h_(e, n);
  }
};
function h_(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: a } = e;
  a.items = !0;
  const o = r.const("len", (0, Hn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Hn._)`${o} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Du.alwaysValidSchema)(a, n)) {
    const f = r.var("valid", (0, Hn._)`${o} <= ${t.length}`);
    r.if((0, Hn.not)(f), () => c(f)), e.ok(f);
  }
  function c(f) {
    r.forRange("i", t.length, o, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Du.Type.Num }, f), a.allErrors || r.if((0, Hn.not)(f), () => r.break());
    });
  }
}
is.validateAdditionalItems = h_;
is.default = mx;
var Qd = {}, ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
ss.validateTuple = void 0;
const Ag = de, Ro = X, gx = ge, yx = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return p_(e, "additionalItems", t);
    r.items = !0, !(0, Ro.alwaysValidSchema)(r, t) && e.ok((0, gx.validateArray)(e));
  }
};
function p_(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: a, it: o } = e;
  l(i), o.opts.unevaluated && r.length && o.items !== !0 && (o.items = Ro.mergeEvaluated.items(n, r.length, o.items));
  const c = n.name("valid"), f = n.const("len", (0, Ag._)`${s}.length`);
  r.forEach((u, h) => {
    (0, Ro.alwaysValidSchema)(o, u) || (n.if((0, Ag._)`${f} > ${h}`, () => e.subschema({
      keyword: a,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(u) {
    const { opts: h, errSchemaPath: p } = o, _ = r.length, g = _ === u.minItems && (_ === u.maxItems || u[t] === !1);
    if (h.strictTuples && !g) {
      const v = `"${a}" is ${_}-tuple, but minItems or maxItems/${t} are not specified or different at path "${p}"`;
      (0, Ro.checkStrictMode)(o, v, h.strictTuples);
    }
  }
}
ss.validateTuple = p_;
ss.default = yx;
Object.defineProperty(Qd, "__esModule", { value: !0 });
const $x = ss, vx = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, $x.validateTuple)(e, "items")
};
Qd.default = vx;
var Zd = {};
Object.defineProperty(Zd, "__esModule", { value: !0 });
const Rg = de, _x = X, Ex = ge, wx = is, Sx = {
  message: ({ params: { len: e } }) => (0, Rg.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Rg._)`{limit: ${e}}`
}, bx = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Sx,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, _x.alwaysValidSchema)(n, t) && (i ? (0, wx.validateAdditionalItems)(e, i) : e.ok((0, Ex.validateArray)(e)));
  }
};
Zd.default = bx;
var eh = {};
Object.defineProperty(eh, "__esModule", { value: !0 });
const Gt = de, no = X, Px = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Gt.str)`must contain at least ${e} valid item(s)` : (0, Gt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Gt._)`{minContains: ${e}}` : (0, Gt._)`{minContains: ${e}, maxContains: ${t}}`
}, Tx = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Px,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    let a, o;
    const { minContains: c, maxContains: f } = n;
    s.opts.next ? (a = c === void 0 ? 1 : c, o = f) : a = 1;
    const l = t.const("len", (0, Gt._)`${i}.length`);
    if (e.setParams({ min: a, max: o }), o === void 0 && a === 0) {
      (0, no.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (o !== void 0 && a > o) {
      (0, no.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, no.alwaysValidSchema)(s, r)) {
      let g = (0, Gt._)`${l} >= ${a}`;
      o !== void 0 && (g = (0, Gt._)`${g} && ${l} <= ${o}`), e.pass(g);
      return;
    }
    s.items = !0;
    const u = t.name("valid");
    o === void 0 && a === 1 ? p(u, () => t.if(u, () => t.break())) : a === 0 ? (t.let(u, !0), o !== void 0 && t.if((0, Gt._)`${i}.length > 0`, h)) : (t.let(u, !1), h()), e.result(u, () => e.reset());
    function h() {
      const g = t.name("_valid"), v = t.let("count", 0);
      p(g, () => t.if(g, () => _(v)));
    }
    function p(g, v) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: no.Type.Num,
          compositeRule: !0
        }, g), v();
      });
    }
    function _(g) {
      t.code((0, Gt._)`${g}++`), o === void 0 ? t.if((0, Gt._)`${g} >= ${a}`, () => t.assign(u, !0).break()) : (t.if((0, Gt._)`${g} > ${o}`, () => t.assign(u, !1).break()), a === 1 ? t.assign(u, !0) : t.if((0, Gt._)`${g} >= ${a}`, () => t.assign(u, !0)));
    }
  }
};
eh.default = Tx;
var m_ = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = de, r = X, n = ge;
  e.error = {
    message: ({ params: { property: c, depsCount: f, deps: l } }) => {
      const u = f === 1 ? "property" : "properties";
      return (0, t.str)`must have ${u} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: f, deps: l, missingProperty: u } }) => (0, t._)`{property: ${c},
    missingProperty: ${u},
    depsCount: ${f},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [f, l] = s(c);
      a(c, f), o(c, l);
    }
  };
  function s({ schema: c }) {
    const f = {}, l = {};
    for (const u in c) {
      if (u === "__proto__")
        continue;
      const h = Array.isArray(c[u]) ? f : l;
      h[u] = c[u];
    }
    return [f, l];
  }
  function a(c, f = c.schema) {
    const { gen: l, data: u, it: h } = c;
    if (Object.keys(f).length === 0)
      return;
    const p = l.let("missing");
    for (const _ in f) {
      const g = f[_];
      if (g.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, u, _, h.opts.ownProperties);
      c.setParams({
        property: _,
        depsCount: g.length,
        deps: g.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, g, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  e.validatePropertyDeps = a;
  function o(c, f = c.schema) {
    const { gen: l, data: u, keyword: h, it: p } = c, _ = l.name("valid");
    for (const g in f)
      (0, r.alwaysValidSchema)(p, f[g]) || (l.if(
        (0, n.propertyInData)(l, u, g, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: g }, _);
          c.mergeValidEvaluated(v, _);
        },
        () => l.var(_, !0)
        // TODO var
      ), c.ok(_));
  }
  e.validateSchemaDeps = o, e.default = i;
})(m_);
var th = {};
Object.defineProperty(th, "__esModule", { value: !0 });
const g_ = de, Nx = X, Ax = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, g_._)`{propertyName: ${e.propertyName}}`
}, Rx = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Ax,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, Nx.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (a) => {
      e.setParams({ propertyName: a }), e.subschema({
        keyword: "propertyNames",
        data: a,
        dataTypes: ["string"],
        propertyName: a,
        compositeRule: !0
      }, s), t.if((0, g_.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
th.default = Rx;
var Uc = {};
Object.defineProperty(Uc, "__esModule", { value: !0 });
const io = ge, Qt = de, Ox = Sr, so = X, Ix = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Qt._)`{additionalProperty: ${e.additionalProperty}}`
}, Cx = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Ix,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, opts: c } = a;
    if (a.props = !0, c.removeAdditional !== "all" && (0, so.alwaysValidSchema)(a, r))
      return;
    const f = (0, io.allSchemaProperties)(n.properties), l = (0, io.allSchemaProperties)(n.patternProperties);
    u(), e.ok((0, Qt._)`${s} === ${Ox.default.errors}`);
    function u() {
      t.forIn("key", i, (v) => {
        !f.length && !l.length ? _(v) : t.if(h(v), () => _(v));
      });
    }
    function h(v) {
      let m;
      if (f.length > 8) {
        const w = (0, so.schemaRefOrVal)(a, n.properties, "properties");
        m = (0, io.isOwnProperty)(t, w, v);
      } else f.length ? m = (0, Qt.or)(...f.map((w) => (0, Qt._)`${v} === ${w}`)) : m = Qt.nil;
      return l.length && (m = (0, Qt.or)(m, ...l.map((w) => (0, Qt._)`${(0, io.usePattern)(e, w)}.test(${v})`))), (0, Qt.not)(m);
    }
    function p(v) {
      t.code((0, Qt._)`delete ${i}[${v}]`);
    }
    function _(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), o || t.break();
        return;
      }
      if (typeof r == "object" && !(0, so.alwaysValidSchema)(a, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (g(v, m, !1), t.if((0, Qt.not)(m), () => {
          e.reset(), p(v);
        })) : (g(v, m), o || t.if((0, Qt.not)(m), () => t.break()));
      }
    }
    function g(v, m, w) {
      const N = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: so.Type.Str
      };
      w === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Uc.default = Cx;
var rh = {};
Object.defineProperty(rh, "__esModule", { value: !0 });
const Dx = sr, Og = ge, Hl = X, Ig = Uc, kx = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ig.default.code(new Dx.KeywordCxt(s, Ig.default, "additionalProperties"));
    const a = (0, Og.allSchemaProperties)(r);
    for (const u of a)
      s.definedProperties.add(u);
    s.opts.unevaluated && a.length && s.props !== !0 && (s.props = Hl.mergeEvaluated.props(t, (0, Hl.toHash)(a), s.props));
    const o = a.filter((u) => !(0, Hl.alwaysValidSchema)(s, r[u]));
    if (o.length === 0)
      return;
    const c = t.name("valid");
    for (const u of o)
      f(u) ? l(u) : (t.if((0, Og.propertyInData)(t, i, u, s.opts.ownProperties)), l(u), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(u), e.ok(c);
    function f(u) {
      return s.opts.useDefaults && !s.compositeRule && r[u].default !== void 0;
    }
    function l(u) {
      e.subschema({
        keyword: "properties",
        schemaProp: u,
        dataProp: u
      }, c);
    }
  }
};
rh.default = kx;
var nh = {};
Object.defineProperty(nh, "__esModule", { value: !0 });
const Cg = ge, ao = de, Dg = X, kg = X, Fx = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: a } = s, o = (0, Cg.allSchemaProperties)(r), c = o.filter((g) => (0, Dg.alwaysValidSchema)(s, r[g]));
    if (o.length === 0 || c.length === o.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const f = a.strictSchema && !a.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof ao.Name) && (s.props = (0, kg.evaluatedPropsToName)(t, s.props));
    const { props: u } = s;
    h();
    function h() {
      for (const g of o)
        f && p(g), s.allErrors ? _(g) : (t.var(l, !0), _(g), t.if(l));
    }
    function p(g) {
      for (const v in f)
        new RegExp(g).test(v) && (0, Dg.checkStrictMode)(s, `property ${v} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function _(g) {
      t.forIn("key", n, (v) => {
        t.if((0, ao._)`${(0, Cg.usePattern)(e, g)}.test(${v})`, () => {
          const m = c.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: v,
            dataPropType: kg.Type.Str
          }, l), s.opts.unevaluated && u !== !0 ? t.assign((0, ao._)`${u}[${v}]`, !0) : !m && !s.allErrors && t.if((0, ao.not)(l), () => t.break());
        });
      });
    }
  }
};
nh.default = Fx;
var ih = {};
Object.defineProperty(ih, "__esModule", { value: !0 });
const Lx = X, jx = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Lx.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ih.default = jx;
var sh = {};
Object.defineProperty(sh, "__esModule", { value: !0 });
const Ux = ge, Mx = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Ux.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
sh.default = Mx;
var ah = {};
Object.defineProperty(ah, "__esModule", { value: !0 });
const Oo = de, xx = X, Vx = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Oo._)`{passingSchemas: ${e.passing}}`
}, qx = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Vx,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = r, a = t.let("valid", !1), o = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: o }), t.block(f), e.result(a, () => e.reset(), () => e.error(!0));
    function f() {
      s.forEach((l, u) => {
        let h;
        (0, xx.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: u,
          compositeRule: !0
        }, c), u > 0 && t.if((0, Oo._)`${c} && ${a}`).assign(a, !1).assign(o, (0, Oo._)`[${o}, ${u}]`).else(), t.if(c, () => {
          t.assign(a, !0), t.assign(o, u), h && e.mergeEvaluated(h, Oo.Name);
        });
      });
    }
  }
};
ah.default = qx;
var oh = {};
Object.defineProperty(oh, "__esModule", { value: !0 });
const Bx = X, Gx = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, a) => {
      if ((0, Bx.alwaysValidSchema)(n, s))
        return;
      const o = e.subschema({ keyword: "allOf", schemaProp: a }, i);
      e.ok(i), e.mergeEvaluated(o);
    });
  }
};
oh.default = Gx;
var ch = {};
Object.defineProperty(ch, "__esModule", { value: !0 });
const ec = de, y_ = X, Hx = {
  message: ({ params: e }) => (0, ec.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ec._)`{failingKeyword: ${e.ifClause}}`
}, zx = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Hx,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, y_.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Fg(n, "then"), s = Fg(n, "else");
    if (!i && !s)
      return;
    const a = t.let("valid", !0), o = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(o, f("then", l), f("else", l));
    } else i ? t.if(o, f("then")) : t.if((0, ec.not)(o), f("else"));
    e.pass(a, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, o);
      e.mergeEvaluated(l);
    }
    function f(l, u) {
      return () => {
        const h = e.subschema({ keyword: l }, o);
        t.assign(a, o), e.mergeValidEvaluated(h, a), u ? t.assign(u, (0, ec._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Fg(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, y_.alwaysValidSchema)(e, r);
}
ch.default = zx;
var lh = {};
Object.defineProperty(lh, "__esModule", { value: !0 });
const Kx = X, Wx = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Kx.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
lh.default = Wx;
Object.defineProperty(Jd, "__esModule", { value: !0 });
const Yx = is, Xx = Qd, Jx = ss, Qx = Zd, Zx = eh, e3 = m_, t3 = th, r3 = Uc, n3 = rh, i3 = nh, s3 = ih, a3 = sh, o3 = ah, c3 = oh, l3 = ch, u3 = lh;
function f3(e = !1) {
  const t = [
    // any
    s3.default,
    a3.default,
    o3.default,
    c3.default,
    l3.default,
    u3.default,
    // object
    t3.default,
    r3.default,
    e3.default,
    n3.default,
    i3.default
  ];
  return e ? t.push(Xx.default, Qx.default) : t.push(Yx.default, Jx.default), t.push(Zx.default), t;
}
Jd.default = f3;
var uh = {}, fh = {};
Object.defineProperty(fh, "__esModule", { value: !0 });
const je = de, d3 = {
  message: ({ schemaCode: e }) => (0, je.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, je._)`{format: ${e}}`
}, h3 = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: d3,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: a, it: o } = e, { opts: c, errSchemaPath: f, schemaEnv: l, self: u } = o;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const _ = r.scopeValue("formats", {
        ref: u.formats,
        code: c.code.formats
      }), g = r.const("fDef", (0, je._)`${_}[${a}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, je._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign(v, (0, je._)`${g}.type || "string"`).assign(m, (0, je._)`${g}.validate`), () => r.assign(v, (0, je._)`"string"`).assign(m, g)), e.fail$data((0, je.or)(w(), N()));
      function w() {
        return c.strictSchema === !1 ? je.nil : (0, je._)`${a} && !${m}`;
      }
      function N() {
        const C = l.$async ? (0, je._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, je._)`${m}(${n})`, M = (0, je._)`(typeof ${m} == "function" ? ${C} : ${m}.test(${n}))`;
        return (0, je._)`${m} && ${m} !== true && ${v} === ${t} && !${M}`;
      }
    }
    function p() {
      const _ = u.formats[s];
      if (!_) {
        w();
        return;
      }
      if (_ === !0)
        return;
      const [g, v, m] = N(_);
      g === t && e.pass(C());
      function w() {
        if (c.strictSchema === !1) {
          u.logger.warn(M());
          return;
        }
        throw new Error(M());
        function M() {
          return `unknown format "${s}" ignored in schema at path "${f}"`;
        }
      }
      function N(M) {
        const z = M instanceof RegExp ? (0, je.regexpCode)(M) : c.code.formats ? (0, je._)`${c.code.formats}${(0, je.getProperty)(s)}` : void 0, K = r.scopeValue("formats", { key: s, ref: M, code: z });
        return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, je._)`${K}.validate`] : ["string", M, K];
      }
      function C() {
        if (typeof _ == "object" && !(_ instanceof RegExp) && _.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, je._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, je._)`${m}(${n})` : (0, je._)`${m}.test(${n})`;
      }
    }
  }
};
fh.default = h3;
Object.defineProperty(uh, "__esModule", { value: !0 });
const p3 = fh, m3 = [p3.default];
uh.default = m3;
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.contentVocabulary = zi.metadataVocabulary = void 0;
zi.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
zi.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ld, "__esModule", { value: !0 });
const g3 = jd, y3 = Md, $3 = Jd, v3 = uh, Lg = zi, _3 = [
  g3.default,
  y3.default,
  (0, $3.default)(),
  v3.default,
  Lg.metadataVocabulary,
  Lg.contentVocabulary
];
Ld.default = _3;
var dh = {}, Mc = {};
Object.defineProperty(Mc, "__esModule", { value: !0 });
Mc.DiscrError = void 0;
var jg;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(jg || (Mc.DiscrError = jg = {}));
Object.defineProperty(dh, "__esModule", { value: !0 });
const _i = de, ku = Mc, Ug = At, E3 = ns, w3 = X, S3 = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ku.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, _i._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, b3 = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: S3,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: s } = e, { oneOf: a } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const o = n.propertyName;
    if (typeof o != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!a)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), f = t.const("tag", (0, _i._)`${r}${(0, _i.getProperty)(o)}`);
    t.if((0, _i._)`typeof ${f} == "string"`, () => l(), () => e.error(!1, { discrError: ku.DiscrError.Tag, tag: f, tagName: o })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const _ in p)
        t.elseIf((0, _i._)`${f} === ${_}`), t.assign(c, u(p[_]));
      t.else(), e.error(!1, { discrError: ku.DiscrError.Mapping, tag: f, tagName: o }), t.endIf();
    }
    function u(p) {
      const _ = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: p }, _);
      return e.mergeEvaluated(g, _i.Name), _;
    }
    function h() {
      var p;
      const _ = {}, g = m(i);
      let v = !0;
      for (let C = 0; C < a.length; C++) {
        let M = a[C];
        if (M != null && M.$ref && !(0, w3.schemaHasRulesButRef)(M, s.self.RULES)) {
          const K = M.$ref;
          if (M = Ug.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, K), M instanceof Ug.SchemaEnv && (M = M.schema), M === void 0)
            throw new E3.default(s.opts.uriResolver, s.baseId, K);
        }
        const z = (p = M == null ? void 0 : M.properties) === null || p === void 0 ? void 0 : p[o];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${o}"`);
        v = v && (g || m(M)), w(z, C);
      }
      if (!v)
        throw new Error(`discriminator: "${o}" must be required`);
      return _;
      function m({ required: C }) {
        return Array.isArray(C) && C.includes(o);
      }
      function w(C, M) {
        if (C.const)
          N(C.const, M);
        else if (C.enum)
          for (const z of C.enum)
            N(z, M);
        else
          throw new Error(`discriminator: "properties/${o}" must have "const" or "enum"`);
      }
      function N(C, M) {
        if (typeof C != "string" || C in _)
          throw new Error(`discriminator: "${o}" values must be unique strings`);
        _[C] = M;
      }
    }
  }
};
dh.default = b3;
const P3 = "http://json-schema.org/draft-07/schema#", T3 = "http://json-schema.org/draft-07/schema#", N3 = "Core schema meta-schema", A3 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, R3 = [
  "object",
  "boolean"
], O3 = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, I3 = {
  $schema: P3,
  $id: T3,
  title: N3,
  definitions: A3,
  type: R3,
  properties: O3,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Iv, n = Ld, i = dh, s = I3, a = ["/properties"], o = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((_) => this.addVocabulary(_)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const _ = this.opts.$data ? this.$dataMetaSchema(s, a) : s;
      this.addMetaSchema(_, o, !1), this.refs["http://json-schema.org/schema"] = o;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var f = sr;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return f.KeywordCxt;
  } });
  var l = de;
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
  var u = Ea;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = ns;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Nu, Nu.exports);
var C3 = Nu.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = C3, r = de, n = r.operators, i = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, s = {
    message: ({ keyword: o, schemaCode: c }) => (0, r.str)`should be ${i[o].okStr} ${c}`,
    params: ({ keyword: o, schemaCode: c }) => (0, r._)`{comparison: ${i[o].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(i),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: s,
    code(o) {
      const { gen: c, data: f, schemaCode: l, keyword: u, it: h } = o, { opts: p, self: _ } = h;
      if (!p.validateFormats)
        return;
      const g = new t.KeywordCxt(h, _.RULES.all.format.definition, "format");
      g.$data ? v() : m();
      function v() {
        const N = c.scopeValue("formats", {
          ref: _.formats,
          code: p.code.formats
        }), C = c.const("fmt", (0, r._)`${N}[${g.schemaCode}]`);
        o.fail$data((0, r.or)((0, r._)`typeof ${C} != "object"`, (0, r._)`${C} instanceof RegExp`, (0, r._)`typeof ${C}.compare != "function"`, w(C)));
      }
      function m() {
        const N = g.schema, C = _.formats[N];
        if (!C || C === !0)
          return;
        if (typeof C != "object" || C instanceof RegExp || typeof C.compare != "function")
          throw new Error(`"${u}": format "${N}" does not define "compare" function`);
        const M = c.scopeValue("formats", {
          key: N,
          ref: C,
          code: p.code.formats ? (0, r._)`${p.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        o.fail$data(w(M));
      }
      function w(N) {
        return (0, r._)`${N}.compare(${f}, ${l}) ${i[u].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const a = (o) => (o.addKeyword(e.formatLimitDefinition), o);
  e.default = a;
})(Ov);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Rv, n = Ov, i = de, s = new i.Name("fullFormats"), a = new i.Name("fastFormats"), o = (f, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(f, l, r.fullFormats, s), f;
    const [u, h] = l.mode === "fast" ? [r.fastFormats, a] : [r.fullFormats, s], p = l.formats || r.formatNames;
    return c(f, p, u, h), l.keywords && (0, n.default)(f), f;
  };
  o.get = (f, l = "full") => {
    const h = (l === "fast" ? r.fastFormats : r.fullFormats)[f];
    if (!h)
      throw new Error(`Unknown format "${f}"`);
    return h;
  };
  function c(f, l, u, h) {
    var p, _;
    (p = (_ = f.opts.code).formats) !== null && p !== void 0 || (_.formats = (0, i._)`require("ajv-formats/dist/formats").${h}`);
    for (const g of l)
      f.addFormat(g, u[g]);
  }
  e.exports = t = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
})(Tu, Tu.exports);
var D3 = Tu.exports;
const k3 = /* @__PURE__ */ py(D3), F3 = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, r), s = Object.getOwnPropertyDescriptor(t, r);
  !L3(i, s) && n || Object.defineProperty(e, r, s);
}, L3 = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, j3 = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, U3 = (e, t) => `/* Wrapped ${e}*/
${t}`, M3 = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), x3 = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), V3 = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, i = U3.bind(null, n, t.toString());
  Object.defineProperty(i, "name", x3);
  const { writable: s, enumerable: a, configurable: o } = M3;
  Object.defineProperty(e, "toString", { value: i, writable: s, enumerable: a, configurable: o });
};
function q3(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const i of Reflect.ownKeys(t))
    F3(e, t, i, r);
  return j3(e, t), V3(e, t, n), e;
}
const Mg = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: i = !1,
    after: s = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!i && !s)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let a, o, c;
  const f = function(...l) {
    const u = this, h = () => {
      a = void 0, o && (clearTimeout(o), o = void 0), s && (c = e.apply(u, l));
    }, p = () => {
      o = void 0, a && (clearTimeout(a), a = void 0), s && (c = e.apply(u, l));
    }, _ = i && !a;
    return clearTimeout(a), a = setTimeout(h, r), n > 0 && n !== Number.POSITIVE_INFINITY && !o && (o = setTimeout(p, n)), _ && (c = e.apply(u, l)), c;
  };
  return q3(f, e), f.cancel = () => {
    a && (clearTimeout(a), a = void 0), o && (clearTimeout(o), o = void 0);
  }, f;
};
var Fu = { exports: {} };
const B3 = "2.0.0", $_ = 256, G3 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, H3 = 16, z3 = $_ - 6, K3 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var xc = {
  MAX_LENGTH: $_,
  MAX_SAFE_COMPONENT_LENGTH: H3,
  MAX_SAFE_BUILD_LENGTH: z3,
  MAX_SAFE_INTEGER: G3,
  RELEASE_TYPES: K3,
  SEMVER_SPEC_VERSION: B3,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const W3 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Vc = W3;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = xc, s = Vc;
  t = e.exports = {};
  const a = t.re = [], o = t.safeRe = [], c = t.src = [], f = t.safeSrc = [], l = t.t = {};
  let u = 0;
  const h = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", i],
    [h, n]
  ], _ = (v) => {
    for (const [m, w] of p)
      v = v.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return v;
  }, g = (v, m, w) => {
    const N = _(m), C = u++;
    s(v, C, m), l[v] = C, c[C] = m, f[C] = N, a[C] = new RegExp(m, w ? "g" : void 0), o[C] = new RegExp(N, w ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), g("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${h}+`), g("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), g("FULL", `^${c[l.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), g("LOOSE", `^${c[l.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), g("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", c[l.COERCE], !0), g("COERCERTLFULL", c[l.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Fu, Fu.exports);
var Sa = Fu.exports;
const Y3 = Object.freeze({ loose: !0 }), X3 = Object.freeze({}), J3 = (e) => e ? typeof e != "object" ? Y3 : e : X3;
var hh = J3;
const xg = /^[0-9]+$/, v_ = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = xg.test(e), n = xg.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Q3 = (e, t) => v_(t, e);
var __ = {
  compareIdentifiers: v_,
  rcompareIdentifiers: Q3
};
const oo = Vc, { MAX_LENGTH: Vg, MAX_SAFE_INTEGER: co } = xc, { safeRe: lo, t: uo } = Sa, Z3 = hh, { compareIdentifiers: zl } = __;
let eV = class pr {
  constructor(t, r) {
    if (r = Z3(r), t instanceof pr) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Vg)
      throw new TypeError(
        `version is longer than ${Vg} characters`
      );
    oo("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? lo[uo.LOOSE] : lo[uo.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > co || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > co || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > co || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < co)
          return s;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (oo("SemVer.compare", this.version, this.options, t), !(t instanceof pr)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new pr(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof pr || (t = new pr(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof pr || (t = new pr(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (oo("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return zl(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof pr || (t = new pr(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (oo("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return zl(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? lo[uo.PRERELEASELOOSE] : lo[uo.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let s = [r, i];
          n === !1 && (s = [r]), zl(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var St = eV;
const qg = St, tV = (e, t, r = !1) => {
  if (e instanceof qg)
    return e;
  try {
    return new qg(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var as = tV;
const rV = as, nV = (e, t) => {
  const r = rV(e, t);
  return r ? r.version : null;
};
var iV = nV;
const sV = as, aV = (e, t) => {
  const r = sV(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var oV = aV;
const Bg = St, cV = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Bg(
      e instanceof Bg ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var lV = cV;
const Gg = as, uV = (e, t) => {
  const r = Gg(e, null, !0), n = Gg(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, a = s ? r : n, o = s ? n : r, c = !!a.prerelease.length;
  if (!!o.prerelease.length && !c) {
    if (!o.patch && !o.minor)
      return "major";
    if (o.compareMain(a) === 0)
      return o.minor && !o.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var fV = uV;
const dV = St, hV = (e, t) => new dV(e, t).major;
var pV = hV;
const mV = St, gV = (e, t) => new mV(e, t).minor;
var yV = gV;
const $V = St, vV = (e, t) => new $V(e, t).patch;
var _V = vV;
const EV = as, wV = (e, t) => {
  const r = EV(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var SV = wV;
const Hg = St, bV = (e, t, r) => new Hg(e, r).compare(new Hg(t, r));
var ur = bV;
const PV = ur, TV = (e, t, r) => PV(t, e, r);
var NV = TV;
const AV = ur, RV = (e, t) => AV(e, t, !0);
var OV = RV;
const zg = St, IV = (e, t, r) => {
  const n = new zg(e, r), i = new zg(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var ph = IV;
const CV = ph, DV = (e, t) => e.sort((r, n) => CV(r, n, t));
var kV = DV;
const FV = ph, LV = (e, t) => e.sort((r, n) => FV(n, r, t));
var jV = LV;
const UV = ur, MV = (e, t, r) => UV(e, t, r) > 0;
var qc = MV;
const xV = ur, VV = (e, t, r) => xV(e, t, r) < 0;
var mh = VV;
const qV = ur, BV = (e, t, r) => qV(e, t, r) === 0;
var E_ = BV;
const GV = ur, HV = (e, t, r) => GV(e, t, r) !== 0;
var w_ = HV;
const zV = ur, KV = (e, t, r) => zV(e, t, r) >= 0;
var gh = KV;
const WV = ur, YV = (e, t, r) => WV(e, t, r) <= 0;
var yh = YV;
const XV = E_, JV = w_, QV = qc, ZV = gh, eq = mh, tq = yh, rq = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return XV(e, r, n);
    case "!=":
      return JV(e, r, n);
    case ">":
      return QV(e, r, n);
    case ">=":
      return ZV(e, r, n);
    case "<":
      return eq(e, r, n);
    case "<=":
      return tq(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var S_ = rq;
const nq = St, iq = as, { safeRe: fo, t: ho } = Sa, sq = (e, t) => {
  if (e instanceof nq)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? fo[ho.COERCEFULL] : fo[ho.COERCE]);
  else {
    const c = t.includePrerelease ? fo[ho.COERCERTLFULL] : fo[ho.COERCERTL];
    let f;
    for (; (f = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || f.index + f[0].length !== r.index + r[0].length) && (r = f), c.lastIndex = f.index + f[1].length + f[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", o = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return iq(`${n}.${i}.${s}${a}${o}`, t);
};
var aq = sq;
class oq {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var cq = oq, Kl, Kg;
function fr() {
  if (Kg) return Kl;
  Kg = 1;
  const e = /\s+/g;
  class t {
    constructor(D, x) {
      if (x = i(x), D instanceof t)
        return D.loose === !!x.loose && D.includePrerelease === !!x.includePrerelease ? D : new t(D.raw, x);
      if (D instanceof s)
        return this.raw = D.value, this.set = [[D]], this.formatted = void 0, this;
      if (this.options = x, this.loose = !!x.loose, this.includePrerelease = !!x.includePrerelease, this.raw = D.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((V) => !g(V[0])), this.set.length === 0)
          this.set = [L];
        else if (this.set.length > 1) {
          for (const V of this.set)
            if (V.length === 1 && v(V[0])) {
              this.set = [V];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let D = 0; D < this.set.length; D++) {
          D > 0 && (this.formatted += "||");
          const x = this.set[D];
          for (let L = 0; L < x.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += x[L].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(D) {
      const L = ((this.options.includePrerelease && p) | (this.options.loose && _)) + ":" + D, V = n.get(L);
      if (V)
        return V;
      const U = this.options.loose, R = U ? c[f.HYPHENRANGELOOSE] : c[f.HYPHENRANGE];
      D = D.replace(R, G(this.options.includePrerelease)), a("hyphen replace", D), D = D.replace(c[f.COMPARATORTRIM], l), a("comparator trim", D), D = D.replace(c[f.TILDETRIM], u), a("tilde trim", D), D = D.replace(c[f.CARETTRIM], h), a("caret trim", D);
      let S = D.split(" ").map(($) => w($, this.options)).join(" ").split(/\s+/).map(($) => B($, this.options));
      U && (S = S.filter(($) => (a("loose invalid filter", $, this.options), !!$.match(c[f.COMPARATORLOOSE])))), a("range list", S);
      const P = /* @__PURE__ */ new Map(), b = S.map(($) => new s($, this.options));
      for (const $ of b) {
        if (g($))
          return [$];
        P.set($.value, $);
      }
      P.size > 1 && P.has("") && P.delete("");
      const d = [...P.values()];
      return n.set(L, d), d;
    }
    intersects(D, x) {
      if (!(D instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => m(L, x) && D.set.some((V) => m(V, x) && L.every((U) => V.every((R) => U.intersects(R, x)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(D) {
      if (!D)
        return !1;
      if (typeof D == "string")
        try {
          D = new o(D, this.options);
        } catch {
          return !1;
        }
      for (let x = 0; x < this.set.length; x++)
        if (Q(this.set[x], D, this.options))
          return !0;
      return !1;
    }
  }
  Kl = t;
  const r = cq, n = new r(), i = hh, s = Bc(), a = Vc, o = St, {
    safeRe: c,
    t: f,
    comparatorTrimReplace: l,
    tildeTrimReplace: u,
    caretTrimReplace: h
  } = Sa, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: _ } = xc, g = (k) => k.value === "<0.0.0-0", v = (k) => k.value === "", m = (k, D) => {
    let x = !0;
    const L = k.slice();
    let V = L.pop();
    for (; x && L.length; )
      x = L.every((U) => V.intersects(U, D)), V = L.pop();
    return x;
  }, w = (k, D) => (k = k.replace(c[f.BUILD], ""), a("comp", k, D), k = z(k, D), a("caret", k), k = C(k, D), a("tildes", k), k = pe(k, D), a("xrange", k), k = Z(k, D), a("stars", k), k), N = (k) => !k || k.toLowerCase() === "x" || k === "*", C = (k, D) => k.trim().split(/\s+/).map((x) => M(x, D)).join(" "), M = (k, D) => {
    const x = D.loose ? c[f.TILDELOOSE] : c[f.TILDE];
    return k.replace(x, (L, V, U, R, S) => {
      a("tilde", k, L, V, U, R, S);
      let P;
      return N(V) ? P = "" : N(U) ? P = `>=${V}.0.0 <${+V + 1}.0.0-0` : N(R) ? P = `>=${V}.${U}.0 <${V}.${+U + 1}.0-0` : S ? (a("replaceTilde pr", S), P = `>=${V}.${U}.${R}-${S} <${V}.${+U + 1}.0-0`) : P = `>=${V}.${U}.${R} <${V}.${+U + 1}.0-0`, a("tilde return", P), P;
    });
  }, z = (k, D) => k.trim().split(/\s+/).map((x) => K(x, D)).join(" "), K = (k, D) => {
    a("caret", k, D);
    const x = D.loose ? c[f.CARETLOOSE] : c[f.CARET], L = D.includePrerelease ? "-0" : "";
    return k.replace(x, (V, U, R, S, P) => {
      a("caret", k, V, U, R, S, P);
      let b;
      return N(U) ? b = "" : N(R) ? b = `>=${U}.0.0${L} <${+U + 1}.0.0-0` : N(S) ? U === "0" ? b = `>=${U}.${R}.0${L} <${U}.${+R + 1}.0-0` : b = `>=${U}.${R}.0${L} <${+U + 1}.0.0-0` : P ? (a("replaceCaret pr", P), U === "0" ? R === "0" ? b = `>=${U}.${R}.${S}-${P} <${U}.${R}.${+S + 1}-0` : b = `>=${U}.${R}.${S}-${P} <${U}.${+R + 1}.0-0` : b = `>=${U}.${R}.${S}-${P} <${+U + 1}.0.0-0`) : (a("no pr"), U === "0" ? R === "0" ? b = `>=${U}.${R}.${S}${L} <${U}.${R}.${+S + 1}-0` : b = `>=${U}.${R}.${S}${L} <${U}.${+R + 1}.0-0` : b = `>=${U}.${R}.${S} <${+U + 1}.0.0-0`), a("caret return", b), b;
    });
  }, pe = (k, D) => (a("replaceXRanges", k, D), k.split(/\s+/).map((x) => I(x, D)).join(" ")), I = (k, D) => {
    k = k.trim();
    const x = D.loose ? c[f.XRANGELOOSE] : c[f.XRANGE];
    return k.replace(x, (L, V, U, R, S, P) => {
      a("xRange", k, L, V, U, R, S, P);
      const b = N(U), d = b || N(R), $ = d || N(S), A = $;
      return V === "=" && A && (V = ""), P = D.includePrerelease ? "-0" : "", b ? V === ">" || V === "<" ? L = "<0.0.0-0" : L = "*" : V && A ? (d && (R = 0), S = 0, V === ">" ? (V = ">=", d ? (U = +U + 1, R = 0, S = 0) : (R = +R + 1, S = 0)) : V === "<=" && (V = "<", d ? U = +U + 1 : R = +R + 1), V === "<" && (P = "-0"), L = `${V + U}.${R}.${S}${P}`) : d ? L = `>=${U}.0.0${P} <${+U + 1}.0.0-0` : $ && (L = `>=${U}.${R}.0${P} <${U}.${+R + 1}.0-0`), a("xRange return", L), L;
    });
  }, Z = (k, D) => (a("replaceStars", k, D), k.trim().replace(c[f.STAR], "")), B = (k, D) => (a("replaceGTE0", k, D), k.trim().replace(c[D.includePrerelease ? f.GTE0PRE : f.GTE0], "")), G = (k) => (D, x, L, V, U, R, S, P, b, d, $, A) => (N(L) ? x = "" : N(V) ? x = `>=${L}.0.0${k ? "-0" : ""}` : N(U) ? x = `>=${L}.${V}.0${k ? "-0" : ""}` : R ? x = `>=${x}` : x = `>=${x}${k ? "-0" : ""}`, N(b) ? P = "" : N(d) ? P = `<${+b + 1}.0.0-0` : N($) ? P = `<${b}.${+d + 1}.0-0` : A ? P = `<=${b}.${d}.${$}-${A}` : k ? P = `<${b}.${d}.${+$ + 1}-0` : P = `<=${P}`, `${x} ${P}`.trim()), Q = (k, D, x) => {
    for (let L = 0; L < k.length; L++)
      if (!k[L].test(D))
        return !1;
    if (D.prerelease.length && !x.includePrerelease) {
      for (let L = 0; L < k.length; L++)
        if (a(k[L].semver), k[L].semver !== s.ANY && k[L].semver.prerelease.length > 0) {
          const V = k[L].semver;
          if (V.major === D.major && V.minor === D.minor && V.patch === D.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Kl;
}
var Wl, Wg;
function Bc() {
  if (Wg) return Wl;
  Wg = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, u) {
      if (u = r(u), l instanceof t) {
        if (l.loose === !!u.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), a("comparator", l, u), this.options = u, this.loose = !!u.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(l) {
      const u = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = l.match(u);
      if (!h)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new o(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (a("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new o(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, u) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, u).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, u).test(l.semver) : (u = r(u), u.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !u.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, u) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, u) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Wl = t;
  const r = hh, { safeRe: n, t: i } = Sa, s = S_, a = Vc, o = St, c = fr();
  return Wl;
}
const lq = fr(), uq = (e, t, r) => {
  try {
    t = new lq(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Gc = uq;
const fq = fr(), dq = (e, t) => new fq(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var hq = dq;
const pq = St, mq = fr(), gq = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new mq(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new pq(n, r));
  }), n;
};
var yq = gq;
const $q = St, vq = fr(), _q = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new vq(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    s.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new $q(n, r));
  }), n;
};
var Eq = _q;
const Yl = St, wq = fr(), Yg = qc, Sq = (e, t) => {
  e = new wq(e, t);
  let r = new Yl("0.0.0");
  if (e.test(r) || (r = new Yl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((a) => {
      const o = new Yl(a.semver.version);
      switch (a.operator) {
        case ">":
          o.prerelease.length === 0 ? o.patch++ : o.prerelease.push(0), o.raw = o.format();
        case "":
        case ">=":
          (!s || Yg(o, s)) && (s = o);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), s && (!r || Yg(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var bq = Sq;
const Pq = fr(), Tq = (e, t) => {
  try {
    return new Pq(e, t).range || "*";
  } catch {
    return null;
  }
};
var Nq = Tq;
const Aq = St, b_ = Bc(), { ANY: Rq } = b_, Oq = fr(), Iq = Gc, Xg = qc, Jg = mh, Cq = yh, Dq = gh, kq = (e, t, r, n) => {
  e = new Aq(e, n), t = new Oq(t, n);
  let i, s, a, o, c;
  switch (r) {
    case ">":
      i = Xg, s = Cq, a = Jg, o = ">", c = ">=";
      break;
    case "<":
      i = Jg, s = Dq, a = Xg, o = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Iq(e, t, n))
    return !1;
  for (let f = 0; f < t.set.length; ++f) {
    const l = t.set[f];
    let u = null, h = null;
    if (l.forEach((p) => {
      p.semver === Rq && (p = new b_(">=0.0.0")), u = u || p, h = h || p, i(p.semver, u.semver, n) ? u = p : a(p.semver, h.semver, n) && (h = p);
    }), u.operator === o || u.operator === c || (!h.operator || h.operator === o) && s(e, h.semver))
      return !1;
    if (h.operator === c && a(e, h.semver))
      return !1;
  }
  return !0;
};
var $h = kq;
const Fq = $h, Lq = (e, t, r) => Fq(e, t, ">", r);
var jq = Lq;
const Uq = $h, Mq = (e, t, r) => Uq(e, t, "<", r);
var xq = Mq;
const Qg = fr(), Vq = (e, t, r) => (e = new Qg(e, r), t = new Qg(t, r), e.intersects(t, r));
var qq = Vq;
const Bq = Gc, Gq = ur;
var Hq = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const a = e.sort((l, u) => Gq(l, u, r));
  for (const l of a)
    Bq(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const o = [];
  for (const [l, u] of n)
    l === u ? o.push(l) : !u && l === a[0] ? o.push("*") : u ? l === a[0] ? o.push(`<=${u}`) : o.push(`${l} - ${u}`) : o.push(`>=${l}`);
  const c = o.join(" || "), f = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < f.length ? c : t;
};
const Zg = fr(), vh = Bc(), { ANY: Xl } = vh, _s = Gc, _h = ur, zq = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Zg(e, r), t = new Zg(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const a = Wq(i, s, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Kq = [new vh(">=0.0.0-0")], ey = [new vh(">=0.0.0")], Wq = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Xl) {
    if (t.length === 1 && t[0].semver === Xl)
      return !0;
    r.includePrerelease ? e = Kq : e = ey;
  }
  if (t.length === 1 && t[0].semver === Xl) {
    if (r.includePrerelease)
      return !0;
    t = ey;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = ty(i, p, r) : p.operator === "<" || p.operator === "<=" ? s = ry(s, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && s) {
    if (a = _h(i.semver, s.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (i && !_s(p, String(i), r) || s && !_s(p, String(s), r))
      return null;
    for (const _ of t)
      if (!_s(p, String(_), r))
        return !1;
    return !0;
  }
  let o, c, f, l, u = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && s.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const p of t) {
    if (l = l || p.operator === ">" || p.operator === ">=", f = f || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (o = ty(i, p, r), o === p && o !== i)
          return !1;
      } else if (i.operator === ">=" && !_s(i.semver, String(p), r))
        return !1;
    }
    if (s) {
      if (u && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === u.major && p.semver.minor === u.minor && p.semver.patch === u.patch && (u = !1), p.operator === "<" || p.operator === "<=") {
        if (c = ry(s, p, r), c === p && c !== s)
          return !1;
      } else if (s.operator === "<=" && !_s(s.semver, String(p), r))
        return !1;
    }
    if (!p.operator && (s || i) && a !== 0)
      return !1;
  }
  return !(i && f && !s && a !== 0 || s && l && !i && a !== 0 || h || u);
}, ty = (e, t, r) => {
  if (!e)
    return t;
  const n = _h(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ry = (e, t, r) => {
  if (!e)
    return t;
  const n = _h(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Yq = zq;
const Jl = Sa, ny = xc, Xq = St, iy = __, Jq = as, Qq = iV, Zq = oV, e9 = lV, t9 = fV, r9 = pV, n9 = yV, i9 = _V, s9 = SV, a9 = ur, o9 = NV, c9 = OV, l9 = ph, u9 = kV, f9 = jV, d9 = qc, h9 = mh, p9 = E_, m9 = w_, g9 = gh, y9 = yh, $9 = S_, v9 = aq, _9 = Bc(), E9 = fr(), w9 = Gc, S9 = hq, b9 = yq, P9 = Eq, T9 = bq, N9 = Nq, A9 = $h, R9 = jq, O9 = xq, I9 = qq, C9 = Hq, D9 = Yq;
var k9 = {
  parse: Jq,
  valid: Qq,
  clean: Zq,
  inc: e9,
  diff: t9,
  major: r9,
  minor: n9,
  patch: i9,
  prerelease: s9,
  compare: a9,
  rcompare: o9,
  compareLoose: c9,
  compareBuild: l9,
  sort: u9,
  rsort: f9,
  gt: d9,
  lt: h9,
  eq: p9,
  neq: m9,
  gte: g9,
  lte: y9,
  cmp: $9,
  coerce: v9,
  Comparator: _9,
  Range: E9,
  satisfies: w9,
  toComparators: S9,
  maxSatisfying: b9,
  minSatisfying: P9,
  minVersion: T9,
  validRange: N9,
  outside: A9,
  gtr: R9,
  ltr: O9,
  intersects: I9,
  simplifyRange: C9,
  subset: D9,
  SemVer: Xq,
  re: Jl.re,
  src: Jl.src,
  tokens: Jl.t,
  SEMVER_SPEC_VERSION: ny.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: ny.RELEASE_TYPES,
  compareIdentifiers: iy.compareIdentifiers,
  rcompareIdentifiers: iy.rcompareIdentifiers
};
const yi = /* @__PURE__ */ py(k9), F9 = Object.prototype.toString, L9 = "[object Uint8Array]", j9 = "[object ArrayBuffer]";
function P_(e, t, r) {
  return e ? e.constructor === t ? !0 : F9.call(e) === r : !1;
}
function T_(e) {
  return P_(e, Uint8Array, L9);
}
function U9(e) {
  return P_(e, ArrayBuffer, j9);
}
function M9(e) {
  return T_(e) || U9(e);
}
function x9(e) {
  if (!T_(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function V9(e) {
  if (!M9(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Ql(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, s) => i + s.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    x9(i), r.set(i, n), n += i.length;
  return r;
}
const po = {
  utf8: new globalThis.TextDecoder("utf8")
};
function mo(e, t = "utf8") {
  return V9(e), po[t] ?? (po[t] = new globalThis.TextDecoder(t)), po[t].decode(e);
}
function q9(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const B9 = new globalThis.TextEncoder();
function go(e) {
  return q9(e), B9.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Zl = "aes-256-cbc", en = () => /* @__PURE__ */ Object.create(null), sy = (e) => e !== void 0, eu = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, rn = "__internal__", tu = `${rn}.migrations.version`;
var ln, Zt, Pt, qt, Kn, Wn, ji, mr, ze, N_, A_, R_, O_, I_, C_, D_, k_;
class G9 {
  constructor(t = {}) {
    dr(this, ze);
    fs(this, "path");
    fs(this, "events");
    dr(this, ln);
    dr(this, Zt);
    dr(this, Pt);
    dr(this, qt, {});
    dr(this, Kn, !1);
    dr(this, Wn);
    dr(this, ji);
    dr(this, mr);
    fs(this, "_deserialize", (t) => JSON.parse(t));
    fs(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = Or(this, ze, N_).call(this, t);
    kt(this, Pt, r), Or(this, ze, A_).call(this, r), Or(this, ze, O_).call(this, r), Or(this, ze, I_).call(this, r), this.events = new EventTarget(), kt(this, Zt, r.encryptionKey), this.path = Or(this, ze, C_).call(this, r), Or(this, ze, D_).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ae(this, Pt).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${rn} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, i = (s, a) => {
      if (eu(s, a), ae(this, Pt).accessPropertiesByDotNotation)
        Wa(n, s, a);
      else {
        if (s === "__proto__" || s === "constructor" || s === "prototype")
          return;
        n[s] = a;
      }
    };
    if (typeof t == "object") {
      const s = t;
      for (const [a, o] of Object.entries(s))
        i(a, o);
    } else
      i(t, r);
    this.store = n;
  }
  has(t) {
    return ae(this, Pt).accessPropertiesByDotNotation ? Dl(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    eu(t, r);
    const n = ae(this, Pt).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      sy(ae(this, qt)[r]) && this.set(r, ae(this, qt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ae(this, Pt).accessPropertiesByDotNotation ? gI(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = en();
    for (const r of Object.keys(ae(this, qt)))
      sy(ae(this, qt)[r]) && (eu(r, ae(this, qt)[r]), ae(this, Pt).accessPropertiesByDotNotation ? Wa(t, r, ae(this, qt)[r]) : t[r] = ae(this, qt)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = oe.readFileSync(this.path, ae(this, Zt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
      return ae(this, Kn) || this._validate(i), Object.assign(en(), i);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), en();
      if (ae(this, Pt).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:"))
          return en();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Dl(t, rn))
      try {
        const r = oe.readFileSync(this.path, ae(this, Zt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
        Dl(i, rn) && Wa(t, rn, Um(i, rn));
      } catch {
      }
    ae(this, Kn) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ae(this, Wn) && (ae(this, Wn).close(), kt(this, Wn, void 0)), ae(this, ji) && (oe.unwatchFile(this.path), kt(this, ji, !1)), kt(this, mr, void 0);
  }
  _decryptData(t) {
    if (!ae(this, Zt))
      return typeof t == "string" ? t : mo(t);
    try {
      const r = t.slice(0, 16), n = Cn.pbkdf2Sync(ae(this, Zt), r, 1e4, 32, "sha512"), i = Cn.createDecipheriv(Zl, n, r), s = t.slice(17), a = typeof s == "string" ? go(s) : s;
      return mo(Ql([i.update(a), i.final()]));
    } catch {
      try {
        const r = t.slice(0, 16), n = Cn.pbkdf2Sync(ae(this, Zt), r.toString(), 1e4, 32, "sha512"), i = Cn.createDecipheriv(Zl, n, r), s = t.slice(17), a = typeof s == "string" ? go(s) : s;
        return mo(Ql([i.update(a), i.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : mo(t);
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const i = r, s = this.store;
      Vh(s, i) || (r = s, t.call(this, s, i));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const i = () => {
      const s = n, a = t();
      Vh(a, s) || (n = a, r.call(this, a, s));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!ae(this, ln) || ae(this, ln).call(this, t) || !ae(this, ln).errors)
      return;
    const n = ae(this, ln).errors.map(({ instancePath: i, message: s = "" }) => `\`${i.slice(1)}\` ${s}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    oe.mkdirSync(se.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (ae(this, Zt)) {
      const n = Cn.randomBytes(16), i = Cn.pbkdf2Sync(ae(this, Zt), n, 1e4, 32, "sha512"), s = Cn.createCipheriv(Zl, i, n);
      r = Ql([n, go(":"), s.update(go(r)), s.final()]);
    }
    if (Ie.env.SNAP)
      oe.writeFileSync(this.path, r, { mode: ae(this, Pt).configFileMode });
    else
      try {
        R$(this.path, r, { mode: ae(this, Pt).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          oe.writeFileSync(this.path, r, { mode: ae(this, Pt).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), oe.existsSync(this.path) || this._write(en()), Ie.platform === "win32" || Ie.platform === "darwin") {
      ae(this, mr) ?? kt(this, mr, Mg(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = se.dirname(this.path), r = se.basename(this.path);
      kt(this, Wn, oe.watch(t, { persistent: !1, encoding: "utf8" }, (n, i) => {
        i && i !== r || typeof ae(this, mr) == "function" && ae(this, mr).call(this);
      }));
    } else
      ae(this, mr) ?? kt(this, mr, Mg(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), oe.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ae(this, mr) == "function" && ae(this, mr).call(this);
      }), kt(this, ji, !0);
  }
  _migrate(t, r, n) {
    let i = this._get(tu, "0.0.0");
    const s = Object.keys(t).filter((o) => this._shouldPerformMigration(o, i, r));
    let a = structuredClone(this.store);
    for (const o of s)
      try {
        n && n(this, {
          fromVersion: i,
          toVersion: o,
          finalVersion: r,
          versions: s
        });
        const c = t[o];
        c == null || c(this), this._set(tu, o), i = o, a = structuredClone(this.store);
      } catch (c) {
        this.store = a;
        try {
          this._write(a);
        } catch {
        }
        const f = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${f}`);
      }
    (this._isVersionInRangeFormat(i) || !yi.eq(i, r)) && this._set(tu, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === rn || t.startsWith(`${rn}.`);
  }
  _isVersionInRangeFormat(t) {
    return yi.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && yi.satisfies(r, t) ? !1 : yi.satisfies(n, t) : !(yi.lte(t, r) || yi.gt(t, n));
  }
  _get(t, r) {
    return Um(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Wa(n, t, r), this.store = n;
  }
}
ln = new WeakMap(), Zt = new WeakMap(), Pt = new WeakMap(), qt = new WeakMap(), Kn = new WeakMap(), Wn = new WeakMap(), ji = new WeakMap(), mr = new WeakMap(), ze = new WeakSet(), N_ = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = _I(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, A_ = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = k3.default, n = new EU.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const i = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  kt(this, ln, n.compile(i)), Or(this, ze, R_).call(this, t.schema);
}, R_ = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, i] of r) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: s } = i;
    s !== void 0 && (ae(this, qt)[n] = s);
  }
}, O_ = function(t) {
  t.defaults && Object.assign(ae(this, qt), t.defaults);
}, I_ = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, C_ = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return se.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, D_ = function(t) {
  if (t.migrations) {
    Or(this, ze, k_).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(en(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    qh.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, k_ = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    kt(this, Kn, !0);
    try {
      const i = this.store, s = Object.assign(en(), t.defaults ?? {}, i);
      try {
        qh.deepEqual(i, s);
      } catch {
        this._write(s);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      kt(this, Kn, !1);
    }
  }
};
const { app: Io, ipcMain: Lu, shell: H9 } = jr;
let ay = !1;
const oy = () => {
  if (!Lu || !Io)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Io.getPath("userData"),
    appVersion: Io.getVersion()
  };
  return ay || (Lu.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), ay = !0), e;
};
class z9 extends G9 {
  constructor(t) {
    let r, n;
    if (Ie.type === "renderer") {
      const i = jr.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = i);
    } else Lu && Io && ({ defaultCwd: r, appVersion: n } = oy());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = se.isAbsolute(t.cwd) ? t.cwd : se.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    oy();
  }
  async openInEditor() {
    const t = await H9.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Eh = se.dirname(HE(import.meta.url)), pn = !!process.env.VITE_DEV_SERVER_URL, Jn = se.join(dy.tmpdir(), "gemini-tray-debug");
pn && (Ui.existsSync(Jn) || Ui.mkdirSync(Jn, { recursive: !0 }), console.log("[DEBUG] Debug mode enabled. Debug files will be saved to:", Jn));
async function ju(e, t = "snapshot") {
  if (!pn || !e) return null;
  try {
    const r = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-"), n = `${t}-${r}`, i = await e.webContents.executeJavaScript("document.documentElement.outerHTML"), s = se.join(Jn, `${n}.html`);
    Ui.writeFileSync(s, i);
    const a = await e.webContents.executeJavaScript(`
      (function() {
        const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
        const editor = document.querySelector('.ql-editor[contenteditable="true"]');
        const allImages = document.querySelectorAll('img');
        const allChips = document.querySelectorAll('[class*="chip"]');
        const allMedia = document.querySelectorAll('[class*="media"], [class*="thumbnail"], [class*="preview"]');
        const allUploading = document.querySelectorAll('[class*="loading"], [class*="uploading"], [class*="progress"]');
        const sendButton = document.querySelector('button[aria-label*="Senden"], button[aria-label*="Send"], button mat-icon[data-mat-icon-name="send_spark"], button mat-icon[data-mat-icon-name="send"]')?.closest('button');
        
        return {
          inputFieldExists: !!inputField,
          inputFieldClasses: inputField?.className || null,
          inputFieldHTML: inputField?.innerHTML?.substring(0, 5000) || null,
          editorExists: !!editor,
          editorContent: editor?.innerHTML?.substring(0, 2000) || null,
          imageCount: allImages.length,
          images: Array.from(allImages).slice(0, 10).map(img => ({
            src: img.src?.substring(0, 200),
            className: img.className,
            parentClasses: img.parentElement?.className
          })),
          chipCount: allChips.length,
          chips: Array.from(allChips).slice(0, 10).map(c => ({
            className: c.className,
            innerHTML: c.innerHTML?.substring(0, 500)
          })),
          mediaCount: allMedia.length,
          media: Array.from(allMedia).slice(0, 10).map(m => ({
            tagName: m.tagName,
            className: m.className,
            innerHTML: m.innerHTML?.substring(0, 500)
          })),
          uploadingCount: allUploading.length,
          uploading: Array.from(allUploading).slice(0, 5).map(u => u.className),
          sendButtonExists: !!sendButton,
          sendButtonDisabled: sendButton?.disabled || sendButton?.getAttribute('aria-disabled') === 'true',
          sendButtonHTML: sendButton?.outerHTML || null
        };
      })()
    `), o = se.join(Jn, `${n}-state.json`);
    return Ui.writeFileSync(o, JSON.stringify(a, null, 2)), console.log(`[DEBUG] Snapshot saved: ${n}`), { htmlPath: s, statePath: o, inputState: a };
  } catch (r) {
    return console.error("[DEBUG] Failed to save snapshot:", r), null;
  }
}
process.env.APP_ROOT = se.join(Eh, "..");
const tc = process.env.VITE_DEV_SERVER_URL, NB = se.join(process.env.APP_ROOT, "dist-electron"), F_ = se.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = tc ? se.join(process.env.APP_ROOT, "public") : F_;
const ve = new z9({
  defaults: {
    opacity: 0.95,
    globalShortcut: "Alt+Space",
    screenshotShortcut: "Alt+Shift+S",
    openAtLogin: !1,
    openAsHidden: !0,
    alwaysOnTop: !0,
    newChatShortcut: "Alt+N"
  }
});
let H, Ee, yo = null, wh = !1, nr = null, Oi = null;
function L_() {
  const e = ve.get("opacity");
  H = new Uu({
    icon: se.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 500,
    height: 650,
    minWidth: 400,
    minHeight: 300,
    frame: !1,
    // We use a custom titlebar implementation via HTML/CSS
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#00000000",
      // Transparent overlay
      symbolColor: "#ffffff",
      // White window controls
      height: 40
      // Height of the caption buttons area
    },
    opacity: e,
    // Set initial opacity
    alwaysOnTop: !0,
    webPreferences: {
      preload: se.join(Eh, "preload.mjs"),
      partition: "persist:gemini"
    }
  }), ve.get("alwaysOnTop") && H.setAlwaysOnTop(!0, "screen-saver"), H.on("close", (l) => wh ? !0 : (l.preventDefault(), H == null || H.hide(), !1)), Ee = new jE({
    webPreferences: {
      partition: "persist:gemini",
      // Share session/cookies
      devTools: pn
      // Enable DevTools only in dev mode
    }
  }), Ee.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"), pn && Ee.webContents.on("console-message", (l, u, h, p, _) => {
    const g = `[Gemini Console] [${u}] ${h} (${_}:${p})`;
    console.log(g);
    try {
      Ui.appendFileSync(se.join(Jn, "console.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] ${g}
`);
    } catch {
    }
  }), H.setBrowserView(Ee), pn && (Ee.webContents.openDevTools({ mode: "detach" }), console.log("[DEBUG] DevTools opened for Gemini BrowserView"));
  const r = () => {
    if (H && Ee) {
      const l = H.getBounds();
      Ee.setBounds({ x: 0, y: 40, width: l.width, height: l.height - 40 });
    }
  };
  H.on("resize", r), H.on("maximize", r), H.on("unmaximize", r), Ee.webContents.loadURL("https://gemini.google.com/app"), tc ? H.loadURL(tc) : H.loadFile(se.join(F_, "index.html")), H.webContents.on("before-input-event", (l, u) => {
    u.alt && u.key === " " && l.preventDefault();
  }), process.platform === "win32" && H.hookWindowMessage(274, (h) => (h.readBigUInt64LE(0) & 0xFFF0n) === BigInt(61696)), H.once("ready-to-show", () => {
    r(), process.argv.includes("--hidden") || Ur.getLoginItemSettings().wasOpenedAsHidden && process.platform === "darwin" ? H == null || H.hide() : H == null || H.show();
  }), We.on("toggle-settings", (l, u) => {
    !H || !Ee || (u ? H.setBrowserView(null) : (H.setBrowserView(Ee), r()));
  }), We.handle("get-settings", (l) => ({
    opacity: ve.get("opacity"),
    globalShortcut: ve.get("globalShortcut"),
    screenshotShortcut: ve.get("screenshotShortcut"),
    openAtLogin: ve.get("openAtLogin"),
    openAsHidden: ve.get("openAsHidden"),
    alwaysOnTop: ve.get("alwaysOnTop"),
    newChatShortcut: ve.get("newChatShortcut")
  })), We.on("set-autostart", (l, u) => {
    ve.set("openAtLogin", u.openAtLogin), ve.set("openAsHidden", u.openAsHidden), Ur.setLoginItemSettings({
      openAtLogin: u.openAtLogin,
      openAsHidden: u.openAsHidden,
      // macOS
      args: u.openAsHidden ? ["--hidden"] : []
      // Windows
    });
  }), We.on("set-opacity", (l, u) => {
    H && (H.setOpacity(u), ve.set("opacity", u));
  });
  let n = !1, i = null;
  const s = () => {
    n && i ? i("Alt+Space") : an();
  }, a = () => {
    if (!_e.isRegistered("Alt+Space"))
      try {
        _e.register("Alt+Space", s);
      } catch (l) {
        console.error("Failed to register Alt+Space:", l);
      }
  };
  We.handle("set-global-shortcut", (l, u) => {
    const h = ve.get("globalShortcut");
    h && h !== "Alt+Space" && _e.unregister(h);
    try {
      let p;
      if (u === "Alt+Space")
        _e.isRegistered("Alt+Space") ? p = !0 : p = _e.register("Alt+Space", s);
      else {
        if (h === "Alt+Space")
          try {
            _e.unregister("Alt+Space");
          } catch {
          }
        p = _e.register(u, () => an());
      }
      return p ? (ve.set("globalShortcut", u), !0) : (h === "Alt+Space" ? a() : h && _e.register(h, () => an()), !1);
    } catch (p) {
      return console.error("Failed to register shortcut:", p), h === "Alt+Space" ? a() : h && _e.register(h, () => an()), !1;
    }
  }), We.handle("set-screenshot-shortcut", (l, u) => {
    const h = ve.get("screenshotShortcut");
    h && _e.unregister(h);
    try {
      return _e.register(u, () => {
        Ei();
      }) ? (ve.set("screenshotShortcut", u), !0) : (h && _e.register(h, () => Ei()), !1);
    } catch (p) {
      return console.error("Failed to register screenshot shortcut:", p), h && _e.register(h, () => Ei()), !1;
    }
  }), We.handle("set-new-chat-shortcut", (l, u) => {
    const h = ve.get("newChatShortcut");
    h && _e.unregister(h);
    try {
      return _e.register(u, () => {
        Es();
      }) ? (ve.set("newChatShortcut", u), !0) : (h && _e.register(h, () => Es()), !1);
    } catch (p) {
      return console.error("Failed to register new chat shortcut:", p), h && _e.register(h, () => Es()), !1;
    }
  }), We.on("set-always-on-top", (l, u) => {
    H && (u ? H.setAlwaysOnTop(!0, "screen-saver") : H.setAlwaysOnTop(!1), ve.set("alwaysOnTop", u));
  }), We.on("start-shortcut-recording", () => {
    if (n) return;
    n = !0, i = (p) => {
      H == null || H.webContents.send("shortcut-recorded", p);
    };
    const l = ve.get("globalShortcut"), u = ve.get("screenshotShortcut");
    l && l !== "Alt+Space" && _e.unregister(l), u && u !== "Alt+Space" && _e.unregister(u);
    const h = ve.get("newChatShortcut");
    h && h !== "Alt+Space" && _e.unregister(h), a();
  }), We.on("stop-shortcut-recording", () => {
    if (!n) return;
    n = !1, i = null;
    const l = ve.get("globalShortcut"), u = ve.get("screenshotShortcut"), h = ve.get("newChatShortcut");
    if (l === "Alt+Space")
      a();
    else {
      try {
        _e.unregister("Alt+Space");
      } catch {
      }
      l && _e.register(l, () => an());
    }
    u && u !== "Alt+Space" && _e.register(u, () => Ei()), h && h !== "Alt+Space" && _e.register(h, () => Es());
  }), We.handle("check-for-updates", async () => {
    try {
      return await nn.autoUpdater.checkForUpdates();
    } catch (l) {
      return console.error("Update check failed:", l), null;
    }
  }), pn && (We.handle("debug-save-snapshot", async (l, u = "manual") => Ee ? await ju(Ee, u) : null), We.handle("debug-get-gemini-state", async () => {
    if (!Ee) return null;
    try {
      return await Ee.webContents.executeJavaScript(`
          (function() {
            const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
            const editor = document.querySelector('.ql-editor[contenteditable="true"]');
            
            // Get all elements that might contain uploaded images
            const allElements = document.body.innerHTML;
            const blobUrls = allElements.match(/blob:[^"'\\s]+/g) || [];
            const dataUrls = (allElements.match(/data:image[^"'\\s]+/g) || []).map(u => u.substring(0, 100));
            
            return {
              timestamp: new Date().toISOString(),
              inputFieldHTML: inputField?.outerHTML?.substring(0, 10000) || null,
              editorHTML: editor?.innerHTML || null,
              blobUrlCount: blobUrls.length,
              blobUrls: blobUrls.slice(0, 5),
              dataUrlCount: dataUrls.length,
              documentReadyState: document.readyState,
              activeElement: document.activeElement?.tagName,
              activeElementClasses: document.activeElement?.className
            };
          })()
        `);
    } catch (l) {
      return console.error("[DEBUG] Failed to get Gemini state:", l), null;
    }
  }), We.handle("debug-open-devtools", () => Ee ? (Ee.webContents.openDevTools({ mode: "detach" }), !0) : !1), We.handle("debug-get-dir", () => Jn), console.log("[DEBUG] Debug IPC handlers registered"));
  const o = ve.get("globalShortcut");
  o === "Alt+Space" ? a() : o && _e.register(o, () => an());
  const c = ve.get("screenshotShortcut");
  c && _e.register(c, () => Ei());
  const f = ve.get("newChatShortcut");
  f && _e.register(f, () => Es());
}
function K9() {
  const e = UE.createFromPath(se.join(process.env.VITE_PUBLIC, "tray-icon.png"));
  yo = new ME(e);
  const t = xE.buildFromTemplate([
    {
      label: "Show/Hide",
      click: () => an()
    },
    {
      label: "Screenshot & Ask",
      click: () => Ei()
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        wh = !0, Ur.quit();
      }
    }
  ]);
  yo.setToolTip("Gemini Tray"), yo.setContextMenu(t), yo.on("click", () => {
    an();
  });
}
function an() {
  H && (H.isVisible() && H.isFocused() ? H.hide() : (H.show(), H.focus()));
}
Ur.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ur.quit(), H = null, Ee = null);
});
Ur.on("activate", () => {
  Uu.getAllWindows().length === 0 && L_();
});
Ur.on("before-quit", () => {
  wh = !0;
});
Ur.on("will-quit", () => {
  _e.unregisterAll();
});
async function Es() {
  if (H && (H.isVisible() || H.show(), H.isFocused() || H.focus()), Ee)
    try {
      await Ee.webContents.executeJavaScript(`
        (function() {
          // Selector based on user provided structure: <new-chat-button ...><button ...>
          const newChatBtn = document.querySelector('new-chat-button button');
          if (newChatBtn) {
            newChatBtn.click();
            console.log('[GeminiTray] Clicked new chat button');
          } else {
            console.warn('[GeminiTray] New chat button not found');
            // Fallback: try aria-label
            const ariaBtn = document.querySelector('button[aria-label*="Chat"]');
            if (ariaBtn) ariaBtn.click();
          }
        })();
      `);
    } catch (e) {
      console.error("Failed to trigger new chat:", e);
    }
}
async function Ei() {
  try {
    const e = H == null ? void 0 : H.isVisible();
    e && (H == null || H.hide()), await new Promise((a) => setTimeout(a, 200));
    const t = Mu.getPrimaryDisplay(), { width: r, height: n } = t.size, i = t.scaleFactor, s = await VE.getSources({
      types: ["screen"],
      thumbnailSize: { width: r * i, height: n * i }
    });
    s.length > 0 ? (Oi = s[0].thumbnail, W9()) : e && (H == null || H.show());
  } catch (e) {
    console.error("Screenshot failed:", e), H == null || H.show();
  }
}
function W9() {
  const e = Mu.getPrimaryDisplay(), { width: t, height: r } = e.bounds;
  nr = new Uu({
    x: e.bounds.x,
    y: e.bounds.y,
    width: t,
    height: r,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    resizable: !1,
    movable: !1,
    fullscreen: !0,
    webPreferences: {
      nodeIntegration: !0,
      contextIsolation: !1
    }
  }), nr.loadFile(se.join(Eh, "screenshot-selection.html")), nr.setAlwaysOnTop(!0, "screen-saver"), nr.on("closed", () => {
    nr = null;
  });
}
We.on("screenshot-region-selected", async (e, t) => {
  if (nr && (nr.close(), nr = null), !Oi) {
    H == null || H.show();
    return;
  }
  try {
    const n = Mu.getPrimaryDisplay().scaleFactor, i = {
      x: Math.round(t.x * n),
      y: Math.round(t.y * n),
      width: Math.round(t.width * n),
      height: Math.round(t.height * n)
    }, s = Oi.crop(i), a = se.join(dy.tmpdir(), `gemini-screenshot-${Date.now()}.png`);
    if (Ui.writeFileSync(a, s.toPNG()), H == null || H.show(), H == null || H.focus(), H == null || H.webContents.send("screenshot-taken", a), pn && Ee && await ju(Ee, "before-paste"), Ee) {
      qE.writeImage(s), await Ee.webContents.executeJavaScript(`
        (function() {
          const editor = document.querySelector('.ql-editor[contenteditable="true"]');
          if (editor) {
            editor.focus();
          }
        })();
      `), await new Promise((f) => setTimeout(f, 100)), Ee.webContents.sendInputEvent({ type: "keyDown", keyCode: "V", modifiers: ["control"] }), Ee.webContents.sendInputEvent({ type: "keyUp", keyCode: "V", modifiers: ["control"] });
      let o = 0;
      const c = 50;
      for (; o < c; ) {
        await new Promise((l) => setTimeout(l, 100));
        const f = await Ee.webContents.executeJavaScript(`
          (function() {
            // Look for image thumbnails/previews in the input area
            const inputField = document.querySelector('.text-input-field, [class*="text-input"]');
            if (!inputField) return { ready: false, reason: 'no-input-field' };
            
            // Check for uploaded file chips/thumbnails
            const fileChips = inputField.querySelectorAll('[class*="chip"], [class*="thumbnail"], [class*="preview"], [class*="attachment"], [class*="media"]');
            const images = inputField.querySelectorAll('img:not([class*="icon"])');
            
            // Check for loading/uploading states
            const isLoading = inputField.querySelector('[class*="loading"], [class*="uploading"], [class*="progress"], mat-spinner, .spinner') !== null;
            
            // Check if any file upload is in progress by looking at the uploader component
            const uploader = document.querySelector('uploader');
            const uploaderLoading = uploader?.querySelector('[class*="loading"], [class*="progress"]') !== null;
            
            const hasAttachment = fileChips.length > 0 || images.length > 0;
            
            return {
              ready: hasAttachment && !isLoading && !uploaderLoading,
              hasAttachment: hasAttachment,
              isLoading: isLoading || uploaderLoading,
              chipCount: fileChips.length,
              imageCount: images.length
            };
          })();
        `);
        if (f.ready) {
          console.log("Screenshot upload confirmed ready:", f);
          break;
        }
        if (f.hasAttachment && f.isLoading) {
          o++;
          continue;
        }
        o++;
      }
      o >= c && console.log("Screenshot upload wait timed out, proceeding anyway"), pn && await ju(Ee, "after-paste"), Ee.webContents.focus();
    }
    Oi = null;
  } catch (r) {
    console.error("Screenshot crop failed:", r), H == null || H.show(), Oi = null;
  }
});
We.on("screenshot-selection-cancelled", () => {
  nr && (nr.close(), nr = null), Oi = null, H == null || H.show();
});
function Y9() {
  nn.autoUpdater.autoDownload = !1, nn.autoUpdater.autoInstallOnAppQuit = !0, nn.autoUpdater.on("update-available", (e) => {
    H == null || H.webContents.send("update-available", e);
  }), nn.autoUpdater.on("update-downloaded", (e) => {
    H == null || H.webContents.send("update-downloaded", e);
  }), nn.autoUpdater.on("error", (e) => {
    console.error("Auto-updater error:", e);
  }), tc || nn.autoUpdater.checkForUpdates().catch(console.error);
}
Ur.whenReady().then(() => {
  L_(), K9(), Y9();
});
export {
  NB as MAIN_DIST,
  F_ as RENDERER_DIST,
  tc as VITE_DEV_SERVER_URL
};
