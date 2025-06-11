var Hp = Object.create;
var xs = Object.defineProperty,
    $p = Object.defineProperties,
    Up = Object.getOwnPropertyDescriptor,
    zp = Object.getOwnPropertyDescriptors,
    qp = Object.getOwnPropertyNames,
    _u = Object.getOwnPropertySymbols,
    Wp = Object.getPrototypeOf,
    Au = Object.prototype.hasOwnProperty,
    Gp = Object.prototype.propertyIsEnumerable;
var Su = (e, t, n) => t in e ? xs(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n
    }) : e[t] = n,
    P = (e, t) => {
        for (var n in t ||= {}) Au.call(t, n) && Su(e, n, t[n]);
        if (_u)
            for (var n of _u(t)) Gp.call(t, n) && Su(e, n, t[n]);
        return e
    },
    le = (e, t) => $p(e, zp(t));
var Mu = (e => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, {
    get: (t, n) => (typeof require < "u" ? require : t)[n]
}) : e)(function(e) {
    if (typeof require < "u") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + e + '" is not supported')
});
var Q = (e, t) => () => (t || e((t = {
    exports: {}
}).exports, t), t.exports);
var Zp = (e, t, n, r) => {
    if (t && typeof t == "object" || typeof t == "function")
        for (let o of qp(t)) !Au.call(e, o) && o !== n && xs(e, o, {
            get: () => t[o],
            enumerable: !(r = Up(t, o)) || r.enumerable
        });
    return e
};
var Yp = (e, t, n) => (n = e != null ? Hp(Wp(e)) : {}, Zp(t || !e || !e.__esModule ? xs(n, "default", {
    value: e,
    enumerable: !0
}) : n, e));
var y0 = Q(() => {
    "use strict"
});
var K = Q((Ni, D0) => {
    "use strict";
    (function(e, t) {
        typeof Ni == "object" ? D0.exports = Ni = t() : typeof define == "function" && define.amd ? define([], t) : e.CryptoJS = t()
    })(Ni, function() {
        var e = e || function(t, n) {
            var r;
            if (typeof window < "u" && window.crypto && (r = window.crypto), typeof self < "u" && self.crypto && (r = self.crypto), typeof globalThis < "u" && globalThis.crypto && (r = globalThis.crypto), !r && typeof window < "u" && window.msCrypto && (r = window.msCrypto), !r && typeof global < "u" && global.crypto && (r = global.crypto), !r && typeof Mu == "function") try {
                r = y0()
            } catch {}
            var o = function() {
                    if (r) {
                        if (typeof r.getRandomValues == "function") try {
                            return r.getRandomValues(new Uint32Array(1))[0]
                        } catch {}
                        if (typeof r.randomBytes == "function") try {
                            return r.randomBytes(4).readInt32LE()
                        } catch {}
                    }
                    throw new Error("Native crypto module could not be used to get secure random number.")
                },
                i = Object.create || function() {
                    function p() {}
                    return function(m) {
                        var D;
                        return p.prototype = m, D = new p, p.prototype = null, D
                    }
                }(),
                s = {},
                a = s.lib = {},
                c = a.Base = function() {
                    return {
                        extend: function(p) {
                            var m = i(this);
                            return p && m.mixIn(p), (!m.hasOwnProperty("init") || this.init === m.init) && (m.init = function() {
                                m.$super.init.apply(this, arguments)
                            }), m.init.prototype = m, m.$super = this, m
                        },
                        create: function() {
                            var p = this.extend();
                            return p.init.apply(p, arguments), p
                        },
                        init: function() {},
                        mixIn: function(p) {
                            for (var m in p) p.hasOwnProperty(m) && (this[m] = p[m]);
                            p.hasOwnProperty("toString") && (this.toString = p.toString)
                        },
                        clone: function() {
                            return this.init.prototype.extend(this)
                        }
                    }
                }(),
                l = a.WordArray = c.extend({
                    init: function(p, m) {
                        p = this.words = p || [], m != n ? this.sigBytes = m : this.sigBytes = p.length * 4
                    },
                    toString: function(p) {
                        return (p || d).stringify(this)
                    },
                    concat: function(p) {
                        var m = this.words,
                            D = p.words,
                            y = this.sigBytes,
                            C = p.sigBytes;
                        if (this.clamp(), y % 4)
                            for (var E = 0; E < C; E++) {
                                var N = D[E >>> 2] >>> 24 - E % 4 * 8 & 255;
                                m[y + E >>> 2] |= N << 24 - (y + E) % 4 * 8
                            } else
                                for (var M = 0; M < C; M += 4) m[y + M >>> 2] = D[M >>> 2];
                        return this.sigBytes += C, this
                    },
                    clamp: function() {
                        var p = this.words,
                            m = this.sigBytes;
                        p[m >>> 2] &= 4294967295 << 32 - m % 4 * 8, p.length = t.ceil(m / 4)
                    },
                    clone: function() {
                        var p = c.clone.call(this);
                        return p.words = this.words.slice(0), p
                    },
                    random: function(p) {
                        for (var m = [], D = 0; D < p; D += 4) m.push(o());
                        return new l.init(m, p)
                    }
                }),
                u = s.enc = {},
                d = u.Hex = {
                    stringify: function(p) {
                        for (var m = p.words, D = p.sigBytes, y = [], C = 0; C < D; C++) {
                            var E = m[C >>> 2] >>> 24 - C % 4 * 8 & 255;
                            y.push((E >>> 4).toString(16)), y.push((E & 15).toString(16))
                        }
                        return y.join("")
                    },
                    parse: function(p) {
                        for (var m = p.length, D = [], y = 0; y < m; y += 2) D[y >>> 3] |= parseInt(p.substr(y, 2), 16) << 24 - y % 8 * 4;
                        return new l.init(D, m / 2)
                    }
                },
                f = u.Latin1 = {
                    stringify: function(p) {
                        for (var m = p.words, D = p.sigBytes, y = [], C = 0; C < D; C++) {
                            var E = m[C >>> 2] >>> 24 - C % 4 * 8 & 255;
                            y.push(String.fromCharCode(E))
                        }
                        return y.join("")
                    },
                    parse: function(p) {
                        for (var m = p.length, D = [], y = 0; y < m; y++) D[y >>> 2] |= (p.charCodeAt(y) & 255) << 24 - y % 4 * 8;
                        return new l.init(D, m)
                    }
                },
                h = u.Utf8 = {
                    stringify: function(p) {
                        try {
                            return decodeURIComponent(escape(f.stringify(p)))
                        } catch {
                            throw new Error("Malformed UTF-8 data")
                        }
                    },
                    parse: function(p) {
                        return f.parse(unescape(encodeURIComponent(p)))
                    }
                },
                g = a.BufferedBlockAlgorithm = c.extend({
                    reset: function() {
                        this._data = new l.init, this._nDataBytes = 0
                    },
                    _append: function(p) {
                        typeof p == "string" && (p = h.parse(p)), this._data.concat(p), this._nDataBytes += p.sigBytes
                    },
                    _process: function(p) {
                        var m, D = this._data,
                            y = D.words,
                            C = D.sigBytes,
                            E = this.blockSize,
                            N = E * 4,
                            M = C / N;
                        p ? M = t.ceil(M) : M = t.max((M | 0) - this._minBufferSize, 0);
                        var R = M * E,
                            O = t.min(R * 4, C);
                        if (R) {
                            for (var w = 0; w < R; w += E) this._doProcessBlock(y, w);
                            m = y.splice(0, R), D.sigBytes -= O
                        }
                        return new l.init(m, O)
                    },
                    clone: function() {
                        var p = c.clone.call(this);
                        return p._data = this._data.clone(), p
                    },
                    _minBufferSize: 0
                }),
                v = a.Hasher = g.extend({
                    cfg: c.extend(),
                    init: function(p) {
                        this.cfg = this.cfg.extend(p), this.reset()
                    },
                    reset: function() {
                        g.reset.call(this), this._doReset()
                    },
                    update: function(p) {
                        return this._append(p), this._process(), this
                    },
                    finalize: function(p) {
                        p && this._append(p);
                        var m = this._doFinalize();
                        return m
                    },
                    blockSize: 512 / 32,
                    _createHelper: function(p) {
                        return function(m, D) {
                            return new p.init(D).finalize(m)
                        }
                    },
                    _createHmacHelper: function(p) {
                        return function(m, D) {
                            return new x.HMAC.init(p, D).finalize(m)
                        }
                    }
                }),
                x = s.algo = {};
            return s
        }(Math);
        return e
    })
});
var jr = Q((Ri, C0) => {
    "use strict";
    (function(e, t) {
        typeof Ri == "object" ? C0.exports = Ri = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Ri, function(e) {
        return function(t) {
            var n = e,
                r = n.lib,
                o = r.Base,
                i = r.WordArray,
                s = n.x64 = {},
                a = s.Word = o.extend({
                    init: function(l, u) {
                        this.high = l, this.low = u
                    }
                }),
                c = s.WordArray = o.extend({
                    init: function(l, u) {
                        l = this.words = l || [], u != t ? this.sigBytes = u : this.sigBytes = l.length * 8
                    },
                    toX32: function() {
                        for (var l = this.words, u = l.length, d = [], f = 0; f < u; f++) {
                            var h = l[f];
                            d.push(h.high), d.push(h.low)
                        }
                        return i.create(d, this.sigBytes)
                    },
                    clone: function() {
                        for (var l = o.clone.call(this), u = l.words = this.words.slice(0), d = u.length, f = 0; f < d; f++) u[f] = u[f].clone();
                        return l
                    }
                })
        }(), e
    })
});
var w0 = Q((Fi, E0) => {
    "use strict";
    (function(e, t) {
        typeof Fi == "object" ? E0.exports = Fi = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Fi, function(e) {
        return function() {
            if (typeof ArrayBuffer == "function") {
                var t = e,
                    n = t.lib,
                    r = n.WordArray,
                    o = r.init,
                    i = r.init = function(s) {
                        if (s instanceof ArrayBuffer && (s = new Uint8Array(s)), (s instanceof Int8Array || typeof Uint8ClampedArray < "u" && s instanceof Uint8ClampedArray || s instanceof Int16Array || s instanceof Uint16Array || s instanceof Int32Array || s instanceof Uint32Array || s instanceof Float32Array || s instanceof Float64Array) && (s = new Uint8Array(s.buffer, s.byteOffset, s.byteLength)), s instanceof Uint8Array) {
                            for (var a = s.byteLength, c = [], l = 0; l < a; l++) c[l >>> 2] |= s[l] << 24 - l % 4 * 8;
                            o.call(this, c, a)
                        } else o.apply(this, arguments)
                    };
                i.prototype = r
            }
        }(), e.lib.WordArray
    })
});
var I0 = Q((ki, b0) => {
    "use strict";
    (function(e, t) {
        typeof ki == "object" ? b0.exports = ki = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(ki, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.WordArray,
                o = t.enc,
                i = o.Utf16 = o.Utf16BE = {
                    stringify: function(a) {
                        for (var c = a.words, l = a.sigBytes, u = [], d = 0; d < l; d += 2) {
                            var f = c[d >>> 2] >>> 16 - d % 4 * 8 & 65535;
                            u.push(String.fromCharCode(f))
                        }
                        return u.join("")
                    },
                    parse: function(a) {
                        for (var c = a.length, l = [], u = 0; u < c; u++) l[u >>> 1] |= a.charCodeAt(u) << 16 - u % 2 * 16;
                        return r.create(l, c * 2)
                    }
                };
            o.Utf16LE = {
                stringify: function(a) {
                    for (var c = a.words, l = a.sigBytes, u = [], d = 0; d < l; d += 2) {
                        var f = s(c[d >>> 2] >>> 16 - d % 4 * 8 & 65535);
                        u.push(String.fromCharCode(f))
                    }
                    return u.join("")
                },
                parse: function(a) {
                    for (var c = a.length, l = [], u = 0; u < c; u++) l[u >>> 1] |= s(a.charCodeAt(u) << 16 - u % 2 * 16);
                    return r.create(l, c * 2)
                }
            };

            function s(a) {
                return a << 8 & 4278255360 | a >>> 8 & 16711935
            }
        }(), e.enc.Utf16
    })
});
var Mt = Q((Oi, _0) => {
    "use strict";
    (function(e, t) {
        typeof Oi == "object" ? _0.exports = Oi = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Oi, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.WordArray,
                o = t.enc,
                i = o.Base64 = {
                    stringify: function(a) {
                        var c = a.words,
                            l = a.sigBytes,
                            u = this._map;
                        a.clamp();
                        for (var d = [], f = 0; f < l; f += 3)
                            for (var h = c[f >>> 2] >>> 24 - f % 4 * 8 & 255, g = c[f + 1 >>> 2] >>> 24 - (f + 1) % 4 * 8 & 255, v = c[f + 2 >>> 2] >>> 24 - (f + 2) % 4 * 8 & 255, x = h << 16 | g << 8 | v, p = 0; p < 4 && f + p * .75 < l; p++) d.push(u.charAt(x >>> 6 * (3 - p) & 63));
                        var m = u.charAt(64);
                        if (m)
                            for (; d.length % 4;) d.push(m);
                        return d.join("")
                    },
                    parse: function(a) {
                        var c = a.length,
                            l = this._map,
                            u = this._reverseMap;
                        if (!u) {
                            u = this._reverseMap = [];
                            for (var d = 0; d < l.length; d++) u[l.charCodeAt(d)] = d
                        }
                        var f = l.charAt(64);
                        if (f) {
                            var h = a.indexOf(f);
                            h !== -1 && (c = h)
                        }
                        return s(a, c, u)
                    },
                    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                };

            function s(a, c, l) {
                for (var u = [], d = 0, f = 0; f < c; f++)
                    if (f % 4) {
                        var h = l[a.charCodeAt(f - 1)] << f % 4 * 2,
                            g = l[a.charCodeAt(f)] >>> 6 - f % 4 * 2,
                            v = h | g;
                        u[d >>> 2] |= v << 24 - d % 4 * 8, d++
                    } return r.create(u, d)
            }
        }(), e.enc.Base64
    })
});
var A0 = Q((Pi, S0) => {
    "use strict";
    (function(e, t) {
        typeof Pi == "object" ? S0.exports = Pi = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Pi, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.WordArray,
                o = t.enc,
                i = o.Base64url = {
                    stringify: function(a, c) {
                        c === void 0 && (c = !0);
                        var l = a.words,
                            u = a.sigBytes,
                            d = c ? this._safe_map : this._map;
                        a.clamp();
                        for (var f = [], h = 0; h < u; h += 3)
                            for (var g = l[h >>> 2] >>> 24 - h % 4 * 8 & 255, v = l[h + 1 >>> 2] >>> 24 - (h + 1) % 4 * 8 & 255, x = l[h + 2 >>> 2] >>> 24 - (h + 2) % 4 * 8 & 255, p = g << 16 | v << 8 | x, m = 0; m < 4 && h + m * .75 < u; m++) f.push(d.charAt(p >>> 6 * (3 - m) & 63));
                        var D = d.charAt(64);
                        if (D)
                            for (; f.length % 4;) f.push(D);
                        return f.join("")
                    },
                    parse: function(a, c) {
                        c === void 0 && (c = !0);
                        var l = a.length,
                            u = c ? this._safe_map : this._map,
                            d = this._reverseMap;
                        if (!d) {
                            d = this._reverseMap = [];
                            for (var f = 0; f < u.length; f++) d[u.charCodeAt(f)] = f
                        }
                        var h = u.charAt(64);
                        if (h) {
                            var g = a.indexOf(h);
                            g !== -1 && (l = g)
                        }
                        return s(a, l, d)
                    },
                    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                    _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
                };

            function s(a, c, l) {
                for (var u = [], d = 0, f = 0; f < c; f++)
                    if (f % 4) {
                        var h = l[a.charCodeAt(f - 1)] << f % 4 * 2,
                            g = l[a.charCodeAt(f)] >>> 6 - f % 4 * 2,
                            v = h | g;
                        u[d >>> 2] |= v << 24 - d % 4 * 8, d++
                    } return r.create(u, d)
            }
        }(), e.enc.Base64url
    })
});
var Tt = Q((Bi, M0) => {
    "use strict";
    (function(e, t) {
        typeof Bi == "object" ? M0.exports = Bi = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Bi, function(e) {
        return function(t) {
            var n = e,
                r = n.lib,
                o = r.WordArray,
                i = r.Hasher,
                s = n.algo,
                a = [];
            (function() {
                for (var h = 0; h < 64; h++) a[h] = t.abs(t.sin(h + 1)) * 4294967296 | 0
            })();
            var c = s.MD5 = i.extend({
                _doReset: function() {
                    this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878])
                },
                _doProcessBlock: function(h, g) {
                    for (var v = 0; v < 16; v++) {
                        var x = g + v,
                            p = h[x];
                        h[x] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360
                    }
                    var m = this._hash.words,
                        D = h[g + 0],
                        y = h[g + 1],
                        C = h[g + 2],
                        E = h[g + 3],
                        N = h[g + 4],
                        M = h[g + 5],
                        R = h[g + 6],
                        O = h[g + 7],
                        w = h[g + 8],
                        T = h[g + 9],
                        k = h[g + 10],
                        S = h[g + 11],
                        j = h[g + 12],
                        B = h[g + 13],
                        q = h[g + 14],
                        X = h[g + 15],
                        b = m[0],
                        _ = m[1],
                        A = m[2],
                        I = m[3];
                    b = l(b, _, A, I, D, 7, a[0]), I = l(I, b, _, A, y, 12, a[1]), A = l(A, I, b, _, C, 17, a[2]), _ = l(_, A, I, b, E, 22, a[3]), b = l(b, _, A, I, N, 7, a[4]), I = l(I, b, _, A, M, 12, a[5]), A = l(A, I, b, _, R, 17, a[6]), _ = l(_, A, I, b, O, 22, a[7]), b = l(b, _, A, I, w, 7, a[8]), I = l(I, b, _, A, T, 12, a[9]), A = l(A, I, b, _, k, 17, a[10]), _ = l(_, A, I, b, S, 22, a[11]), b = l(b, _, A, I, j, 7, a[12]), I = l(I, b, _, A, B, 12, a[13]), A = l(A, I, b, _, q, 17, a[14]), _ = l(_, A, I, b, X, 22, a[15]), b = u(b, _, A, I, y, 5, a[16]), I = u(I, b, _, A, R, 9, a[17]), A = u(A, I, b, _, S, 14, a[18]), _ = u(_, A, I, b, D, 20, a[19]), b = u(b, _, A, I, M, 5, a[20]), I = u(I, b, _, A, k, 9, a[21]), A = u(A, I, b, _, X, 14, a[22]), _ = u(_, A, I, b, N, 20, a[23]), b = u(b, _, A, I, T, 5, a[24]), I = u(I, b, _, A, q, 9, a[25]), A = u(A, I, b, _, E, 14, a[26]), _ = u(_, A, I, b, w, 20, a[27]), b = u(b, _, A, I, B, 5, a[28]), I = u(I, b, _, A, C, 9, a[29]), A = u(A, I, b, _, O, 14, a[30]), _ = u(_, A, I, b, j, 20, a[31]), b = d(b, _, A, I, M, 4, a[32]), I = d(I, b, _, A, w, 11, a[33]), A = d(A, I, b, _, S, 16, a[34]), _ = d(_, A, I, b, q, 23, a[35]), b = d(b, _, A, I, y, 4, a[36]), I = d(I, b, _, A, N, 11, a[37]), A = d(A, I, b, _, O, 16, a[38]), _ = d(_, A, I, b, k, 23, a[39]), b = d(b, _, A, I, B, 4, a[40]), I = d(I, b, _, A, D, 11, a[41]), A = d(A, I, b, _, E, 16, a[42]), _ = d(_, A, I, b, R, 23, a[43]), b = d(b, _, A, I, T, 4, a[44]), I = d(I, b, _, A, j, 11, a[45]), A = d(A, I, b, _, X, 16, a[46]), _ = d(_, A, I, b, C, 23, a[47]), b = f(b, _, A, I, D, 6, a[48]), I = f(I, b, _, A, O, 10, a[49]), A = f(A, I, b, _, q, 15, a[50]), _ = f(_, A, I, b, M, 21, a[51]), b = f(b, _, A, I, j, 6, a[52]), I = f(I, b, _, A, E, 10, a[53]), A = f(A, I, b, _, k, 15, a[54]), _ = f(_, A, I, b, y, 21, a[55]), b = f(b, _, A, I, w, 6, a[56]), I = f(I, b, _, A, X, 10, a[57]), A = f(A, I, b, _, R, 15, a[58]), _ = f(_, A, I, b, B, 21, a[59]), b = f(b, _, A, I, N, 6, a[60]), I = f(I, b, _, A, S, 10, a[61]), A = f(A, I, b, _, C, 15, a[62]), _ = f(_, A, I, b, T, 21, a[63]), m[0] = m[0] + b | 0, m[1] = m[1] + _ | 0, m[2] = m[2] + A | 0, m[3] = m[3] + I | 0
                },
                _doFinalize: function() {
                    var h = this._data,
                        g = h.words,
                        v = this._nDataBytes * 8,
                        x = h.sigBytes * 8;
                    g[x >>> 5] |= 128 << 24 - x % 32;
                    var p = t.floor(v / 4294967296),
                        m = v;
                    g[(x + 64 >>> 9 << 4) + 15] = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, g[(x + 64 >>> 9 << 4) + 14] = (m << 8 | m >>> 24) & 16711935 | (m << 24 | m >>> 8) & 4278255360, h.sigBytes = (g.length + 1) * 4, this._process();
                    for (var D = this._hash, y = D.words, C = 0; C < 4; C++) {
                        var E = y[C];
                        y[C] = (E << 8 | E >>> 24) & 16711935 | (E << 24 | E >>> 8) & 4278255360
                    }
                    return D
                },
                clone: function() {
                    var h = i.clone.call(this);
                    return h._hash = this._hash.clone(), h
                }
            });

            function l(h, g, v, x, p, m, D) {
                var y = h + (g & v | ~g & x) + p + D;
                return (y << m | y >>> 32 - m) + g
            }

            function u(h, g, v, x, p, m, D) {
                var y = h + (g & x | v & ~x) + p + D;
                return (y << m | y >>> 32 - m) + g
            }

            function d(h, g, v, x, p, m, D) {
                var y = h + (g ^ v ^ x) + p + D;
                return (y << m | y >>> 32 - m) + g
            }

            function f(h, g, v, x, p, m, D) {
                var y = h + (v ^ (g | ~x)) + p + D;
                return (y << m | y >>> 32 - m) + g
            }
            n.MD5 = i._createHelper(c), n.HmacMD5 = i._createHmacHelper(c)
        }(Math), e.MD5
    })
});
var fu = Q((Li, T0) => {
    "use strict";
    (function(e, t) {
        typeof Li == "object" ? T0.exports = Li = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Li, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.WordArray,
                o = n.Hasher,
                i = t.algo,
                s = [],
                a = i.SHA1 = o.extend({
                    _doReset: function() {
                        this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                    },
                    _doProcessBlock: function(c, l) {
                        for (var u = this._hash.words, d = u[0], f = u[1], h = u[2], g = u[3], v = u[4], x = 0; x < 80; x++) {
                            if (x < 16) s[x] = c[l + x] | 0;
                            else {
                                var p = s[x - 3] ^ s[x - 8] ^ s[x - 14] ^ s[x - 16];
                                s[x] = p << 1 | p >>> 31
                            }
                            var m = (d << 5 | d >>> 27) + v + s[x];
                            x < 20 ? m += (f & h | ~f & g) + 1518500249 : x < 40 ? m += (f ^ h ^ g) + 1859775393 : x < 60 ? m += (f & h | f & g | h & g) - 1894007588 : m += (f ^ h ^ g) - 899497514, v = g, g = h, h = f << 30 | f >>> 2, f = d, d = m
                        }
                        u[0] = u[0] + d | 0, u[1] = u[1] + f | 0, u[2] = u[2] + h | 0, u[3] = u[3] + g | 0, u[4] = u[4] + v | 0
                    },
                    _doFinalize: function() {
                        var c = this._data,
                            l = c.words,
                            u = this._nDataBytes * 8,
                            d = c.sigBytes * 8;
                        return l[d >>> 5] |= 128 << 24 - d % 32, l[(d + 64 >>> 9 << 4) + 14] = Math.floor(u / 4294967296), l[(d + 64 >>> 9 << 4) + 15] = u, c.sigBytes = l.length * 4, this._process(), this._hash
                    },
                    clone: function() {
                        var c = o.clone.call(this);
                        return c._hash = this._hash.clone(), c
                    }
                });
            t.SHA1 = o._createHelper(a), t.HmacSHA1 = o._createHmacHelper(a)
        }(), e.SHA1
    })
});
var Vi = Q((ji, N0) => {
    "use strict";
    (function(e, t) {
        typeof ji == "object" ? N0.exports = ji = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(ji, function(e) {
        return function(t) {
            var n = e,
                r = n.lib,
                o = r.WordArray,
                i = r.Hasher,
                s = n.algo,
                a = [],
                c = [];
            (function() {
                function d(v) {
                    for (var x = t.sqrt(v), p = 2; p <= x; p++)
                        if (!(v % p)) return !1;
                    return !0
                }

                function f(v) {
                    return (v - (v | 0)) * 4294967296 | 0
                }
                for (var h = 2, g = 0; g < 64;) d(h) && (g < 8 && (a[g] = f(t.pow(h, 1 / 2))), c[g] = f(t.pow(h, 1 / 3)), g++), h++
            })();
            var l = [],
                u = s.SHA256 = i.extend({
                    _doReset: function() {
                        this._hash = new o.init(a.slice(0))
                    },
                    _doProcessBlock: function(d, f) {
                        for (var h = this._hash.words, g = h[0], v = h[1], x = h[2], p = h[3], m = h[4], D = h[5], y = h[6], C = h[7], E = 0; E < 64; E++) {
                            if (E < 16) l[E] = d[f + E] | 0;
                            else {
                                var N = l[E - 15],
                                    M = (N << 25 | N >>> 7) ^ (N << 14 | N >>> 18) ^ N >>> 3,
                                    R = l[E - 2],
                                    O = (R << 15 | R >>> 17) ^ (R << 13 | R >>> 19) ^ R >>> 10;
                                l[E] = M + l[E - 7] + O + l[E - 16]
                            }
                            var w = m & D ^ ~m & y,
                                T = g & v ^ g & x ^ v & x,
                                k = (g << 30 | g >>> 2) ^ (g << 19 | g >>> 13) ^ (g << 10 | g >>> 22),
                                S = (m << 26 | m >>> 6) ^ (m << 21 | m >>> 11) ^ (m << 7 | m >>> 25),
                                j = C + S + w + c[E] + l[E],
                                B = k + T;
                            C = y, y = D, D = m, m = p + j | 0, p = x, x = v, v = g, g = j + B | 0
                        }
                        h[0] = h[0] + g | 0, h[1] = h[1] + v | 0, h[2] = h[2] + x | 0, h[3] = h[3] + p | 0, h[4] = h[4] + m | 0, h[5] = h[5] + D | 0, h[6] = h[6] + y | 0, h[7] = h[7] + C | 0
                    },
                    _doFinalize: function() {
                        var d = this._data,
                            f = d.words,
                            h = this._nDataBytes * 8,
                            g = d.sigBytes * 8;
                        return f[g >>> 5] |= 128 << 24 - g % 32, f[(g + 64 >>> 9 << 4) + 14] = t.floor(h / 4294967296), f[(g + 64 >>> 9 << 4) + 15] = h, d.sigBytes = f.length * 4, this._process(), this._hash
                    },
                    clone: function() {
                        var d = i.clone.call(this);
                        return d._hash = this._hash.clone(), d
                    }
                });
            n.SHA256 = i._createHelper(u), n.HmacSHA256 = i._createHmacHelper(u)
        }(Math), e.SHA256
    })
});
var F0 = Q((Hi, R0) => {
    "use strict";
    (function(e, t, n) {
        typeof Hi == "object" ? R0.exports = Hi = t(K(), Vi()) : typeof define == "function" && define.amd ? define(["./core", "./sha256"], t) : t(e.CryptoJS)
    })(Hi, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.WordArray,
                o = t.algo,
                i = o.SHA256,
                s = o.SHA224 = i.extend({
                    _doReset: function() {
                        this._hash = new r.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
                    },
                    _doFinalize: function() {
                        var a = i._doFinalize.call(this);
                        return a.sigBytes -= 4, a
                    }
                });
            t.SHA224 = i._createHelper(s), t.HmacSHA224 = i._createHmacHelper(s)
        }(), e.SHA224
    })
});
var hu = Q(($i, k0) => {
    "use strict";
    (function(e, t, n) {
        typeof $i == "object" ? k0.exports = $i = t(K(), jr()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core"], t) : t(e.CryptoJS)
    })($i, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.Hasher,
                o = t.x64,
                i = o.Word,
                s = o.WordArray,
                a = t.algo;

            function c() {
                return i.create.apply(i, arguments)
            }
            var l = [c(1116352408, 3609767458), c(1899447441, 602891725), c(3049323471, 3964484399), c(3921009573, 2173295548), c(961987163, 4081628472), c(1508970993, 3053834265), c(2453635748, 2937671579), c(2870763221, 3664609560), c(3624381080, 2734883394), c(310598401, 1164996542), c(607225278, 1323610764), c(1426881987, 3590304994), c(1925078388, 4068182383), c(2162078206, 991336113), c(2614888103, 633803317), c(3248222580, 3479774868), c(3835390401, 2666613458), c(4022224774, 944711139), c(264347078, 2341262773), c(604807628, 2007800933), c(770255983, 1495990901), c(1249150122, 1856431235), c(1555081692, 3175218132), c(1996064986, 2198950837), c(2554220882, 3999719339), c(2821834349, 766784016), c(2952996808, 2566594879), c(3210313671, 3203337956), c(3336571891, 1034457026), c(3584528711, 2466948901), c(113926993, 3758326383), c(338241895, 168717936), c(666307205, 1188179964), c(773529912, 1546045734), c(1294757372, 1522805485), c(1396182291, 2643833823), c(1695183700, 2343527390), c(1986661051, 1014477480), c(2177026350, 1206759142), c(2456956037, 344077627), c(2730485921, 1290863460), c(2820302411, 3158454273), c(3259730800, 3505952657), c(3345764771, 106217008), c(3516065817, 3606008344), c(3600352804, 1432725776), c(4094571909, 1467031594), c(275423344, 851169720), c(430227734, 3100823752), c(506948616, 1363258195), c(659060556, 3750685593), c(883997877, 3785050280), c(958139571, 3318307427), c(1322822218, 3812723403), c(1537002063, 2003034995), c(1747873779, 3602036899), c(1955562222, 1575990012), c(2024104815, 1125592928), c(2227730452, 2716904306), c(2361852424, 442776044), c(2428436474, 593698344), c(2756734187, 3733110249), c(3204031479, 2999351573), c(3329325298, 3815920427), c(3391569614, 3928383900), c(3515267271, 566280711), c(3940187606, 3454069534), c(4118630271, 4000239992), c(116418474, 1914138554), c(174292421, 2731055270), c(289380356, 3203993006), c(460393269, 320620315), c(685471733, 587496836), c(852142971, 1086792851), c(1017036298, 365543100), c(1126000580, 2618297676), c(1288033470, 3409855158), c(1501505948, 4234509866), c(1607167915, 987167468), c(1816402316, 1246189591)],
                u = [];
            (function() {
                for (var f = 0; f < 80; f++) u[f] = c()
            })();
            var d = a.SHA512 = r.extend({
                _doReset: function() {
                    this._hash = new s.init([new i.init(1779033703, 4089235720), new i.init(3144134277, 2227873595), new i.init(1013904242, 4271175723), new i.init(2773480762, 1595750129), new i.init(1359893119, 2917565137), new i.init(2600822924, 725511199), new i.init(528734635, 4215389547), new i.init(1541459225, 327033209)])
                },
                _doProcessBlock: function(f, h) {
                    for (var g = this._hash.words, v = g[0], x = g[1], p = g[2], m = g[3], D = g[4], y = g[5], C = g[6], E = g[7], N = v.high, M = v.low, R = x.high, O = x.low, w = p.high, T = p.low, k = m.high, S = m.low, j = D.high, B = D.low, q = y.high, X = y.low, b = C.high, _ = C.low, A = E.high, I = E.low, ue = N, ce = M, Ie = R, Y = O, Un = w, Xt = T, ms = k, zn = S, ze = j, Te = B, Vr = q, qn = X, Hr = b, Wn = _, vs = A, Gn = I, qe = 0; qe < 80; qe++) {
                        var Le, mt, $r = u[qe];
                        if (qe < 16) mt = $r.high = f[h + qe * 2] | 0, Le = $r.low = f[h + qe * 2 + 1] | 0;
                        else {
                            var pu = u[qe - 15],
                                Jt = pu.high,
                                Zn = pu.low,
                                Ap = (Jt >>> 1 | Zn << 31) ^ (Jt >>> 8 | Zn << 24) ^ Jt >>> 7,
                                gu = (Zn >>> 1 | Jt << 31) ^ (Zn >>> 8 | Jt << 24) ^ (Zn >>> 7 | Jt << 25),
                                mu = u[qe - 2],
                                en = mu.high,
                                Yn = mu.low,
                                Mp = (en >>> 19 | Yn << 13) ^ (en << 3 | Yn >>> 29) ^ en >>> 6,
                                vu = (Yn >>> 19 | en << 13) ^ (Yn << 3 | en >>> 29) ^ (Yn >>> 6 | en << 26),
                                xu = u[qe - 7],
                                Tp = xu.high,
                                Np = xu.low,
                                yu = u[qe - 16],
                                Rp = yu.high,
                                Du = yu.low;
                            Le = gu + Np, mt = Ap + Tp + (Le >>> 0 < gu >>> 0 ? 1 : 0), Le = Le + vu, mt = mt + Mp + (Le >>> 0 < vu >>> 0 ? 1 : 0), Le = Le + Du, mt = mt + Rp + (Le >>> 0 < Du >>> 0 ? 1 : 0), $r.high = mt, $r.low = Le
                        }
                        var Fp = ze & Vr ^ ~ze & Hr,
                            Cu = Te & qn ^ ~Te & Wn,
                            kp = ue & Ie ^ ue & Un ^ Ie & Un,
                            Op = ce & Y ^ ce & Xt ^ Y & Xt,
                            Pp = (ue >>> 28 | ce << 4) ^ (ue << 30 | ce >>> 2) ^ (ue << 25 | ce >>> 7),
                            Eu = (ce >>> 28 | ue << 4) ^ (ce << 30 | ue >>> 2) ^ (ce << 25 | ue >>> 7),
                            Bp = (ze >>> 14 | Te << 18) ^ (ze >>> 18 | Te << 14) ^ (ze << 23 | Te >>> 9),
                            Lp = (Te >>> 14 | ze << 18) ^ (Te >>> 18 | ze << 14) ^ (Te << 23 | ze >>> 9),
                            wu = l[qe],
                            jp = wu.high,
                            bu = wu.low,
                            Ne = Gn + Lp,
                            vt = vs + Bp + (Ne >>> 0 < Gn >>> 0 ? 1 : 0),
                            Ne = Ne + Cu,
                            vt = vt + Fp + (Ne >>> 0 < Cu >>> 0 ? 1 : 0),
                            Ne = Ne + bu,
                            vt = vt + jp + (Ne >>> 0 < bu >>> 0 ? 1 : 0),
                            Ne = Ne + Le,
                            vt = vt + mt + (Ne >>> 0 < Le >>> 0 ? 1 : 0),
                            Iu = Eu + Op,
                            Vp = Pp + kp + (Iu >>> 0 < Eu >>> 0 ? 1 : 0);
                        vs = Hr, Gn = Wn, Hr = Vr, Wn = qn, Vr = ze, qn = Te, Te = zn + Ne | 0, ze = ms + vt + (Te >>> 0 < zn >>> 0 ? 1 : 0) | 0, ms = Un, zn = Xt, Un = Ie, Xt = Y, Ie = ue, Y = ce, ce = Ne + Iu | 0, ue = vt + Vp + (ce >>> 0 < Ne >>> 0 ? 1 : 0) | 0
                    }
                    M = v.low = M + ce, v.high = N + ue + (M >>> 0 < ce >>> 0 ? 1 : 0), O = x.low = O + Y, x.high = R + Ie + (O >>> 0 < Y >>> 0 ? 1 : 0), T = p.low = T + Xt, p.high = w + Un + (T >>> 0 < Xt >>> 0 ? 1 : 0), S = m.low = S + zn, m.high = k + ms + (S >>> 0 < zn >>> 0 ? 1 : 0), B = D.low = B + Te, D.high = j + ze + (B >>> 0 < Te >>> 0 ? 1 : 0), X = y.low = X + qn, y.high = q + Vr + (X >>> 0 < qn >>> 0 ? 1 : 0), _ = C.low = _ + Wn, C.high = b + Hr + (_ >>> 0 < Wn >>> 0 ? 1 : 0), I = E.low = I + Gn, E.high = A + vs + (I >>> 0 < Gn >>> 0 ? 1 : 0)
                },
                _doFinalize: function() {
                    var f = this._data,
                        h = f.words,
                        g = this._nDataBytes * 8,
                        v = f.sigBytes * 8;
                    h[v >>> 5] |= 128 << 24 - v % 32, h[(v + 128 >>> 10 << 5) + 30] = Math.floor(g / 4294967296), h[(v + 128 >>> 10 << 5) + 31] = g, f.sigBytes = h.length * 4, this._process();
                    var x = this._hash.toX32();
                    return x
                },
                clone: function() {
                    var f = r.clone.call(this);
                    return f._hash = this._hash.clone(), f
                },
                blockSize: 1024 / 32
            });
            t.SHA512 = r._createHelper(d), t.HmacSHA512 = r._createHmacHelper(d)
        }(), e.SHA512
    })
});
var P0 = Q((Ui, O0) => {
    "use strict";
    (function(e, t, n) {
        typeof Ui == "object" ? O0.exports = Ui = t(K(), jr(), hu()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core", "./sha512"], t) : t(e.CryptoJS)
    })(Ui, function(e) {
        return function() {
            var t = e,
                n = t.x64,
                r = n.Word,
                o = n.WordArray,
                i = t.algo,
                s = i.SHA512,
                a = i.SHA384 = s.extend({
                    _doReset: function() {
                        this._hash = new o.init([new r.init(3418070365, 3238371032), new r.init(1654270250, 914150663), new r.init(2438529370, 812702999), new r.init(355462360, 4144912697), new r.init(1731405415, 4290775857), new r.init(2394180231, 1750603025), new r.init(3675008525, 1694076839), new r.init(1203062813, 3204075428)])
                    },
                    _doFinalize: function() {
                        var c = s._doFinalize.call(this);
                        return c.sigBytes -= 16, c
                    }
                });
            t.SHA384 = s._createHelper(a), t.HmacSHA384 = s._createHmacHelper(a)
        }(), e.SHA384
    })
});
var L0 = Q((zi, B0) => {
    "use strict";
    (function(e, t, n) {
        typeof zi == "object" ? B0.exports = zi = t(K(), jr()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core"], t) : t(e.CryptoJS)
    })(zi, function(e) {
        return function(t) {
            var n = e,
                r = n.lib,
                o = r.WordArray,
                i = r.Hasher,
                s = n.x64,
                a = s.Word,
                c = n.algo,
                l = [],
                u = [],
                d = [];
            (function() {
                for (var g = 1, v = 0, x = 0; x < 24; x++) {
                    l[g + 5 * v] = (x + 1) * (x + 2) / 2 % 64;
                    var p = v % 5,
                        m = (2 * g + 3 * v) % 5;
                    g = p, v = m
                }
                for (var g = 0; g < 5; g++)
                    for (var v = 0; v < 5; v++) u[g + 5 * v] = v + (2 * g + 3 * v) % 5 * 5;
                for (var D = 1, y = 0; y < 24; y++) {
                    for (var C = 0, E = 0, N = 0; N < 7; N++) {
                        if (D & 1) {
                            var M = (1 << N) - 1;
                            M < 32 ? E ^= 1 << M : C ^= 1 << M - 32
                        }
                        D & 128 ? D = D << 1 ^ 113 : D <<= 1
                    }
                    d[y] = a.create(C, E)
                }
            })();
            var f = [];
            (function() {
                for (var g = 0; g < 25; g++) f[g] = a.create()
            })();
            var h = c.SHA3 = i.extend({
                cfg: i.cfg.extend({
                    outputLength: 512
                }),
                _doReset: function() {
                    for (var g = this._state = [], v = 0; v < 25; v++) g[v] = new a.init;
                    this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                },
                _doProcessBlock: function(g, v) {
                    for (var x = this._state, p = this.blockSize / 2, m = 0; m < p; m++) {
                        var D = g[v + 2 * m],
                            y = g[v + 2 * m + 1];
                        D = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360, y = (y << 8 | y >>> 24) & 16711935 | (y << 24 | y >>> 8) & 4278255360;
                        var C = x[m];
                        C.high ^= y, C.low ^= D
                    }
                    for (var E = 0; E < 24; E++) {
                        for (var N = 0; N < 5; N++) {
                            for (var M = 0, R = 0, O = 0; O < 5; O++) {
                                var C = x[N + 5 * O];
                                M ^= C.high, R ^= C.low
                            }
                            var w = f[N];
                            w.high = M, w.low = R
                        }
                        for (var N = 0; N < 5; N++)
                            for (var T = f[(N + 4) % 5], k = f[(N + 1) % 5], S = k.high, j = k.low, M = T.high ^ (S << 1 | j >>> 31), R = T.low ^ (j << 1 | S >>> 31), O = 0; O < 5; O++) {
                                var C = x[N + 5 * O];
                                C.high ^= M, C.low ^= R
                            }
                        for (var B = 1; B < 25; B++) {
                            var M, R, C = x[B],
                                q = C.high,
                                X = C.low,
                                b = l[B];
                            b < 32 ? (M = q << b | X >>> 32 - b, R = X << b | q >>> 32 - b) : (M = X << b - 32 | q >>> 64 - b, R = q << b - 32 | X >>> 64 - b);
                            var _ = f[u[B]];
                            _.high = M, _.low = R
                        }
                        var A = f[0],
                            I = x[0];
                        A.high = I.high, A.low = I.low;
                        for (var N = 0; N < 5; N++)
                            for (var O = 0; O < 5; O++) {
                                var B = N + 5 * O,
                                    C = x[B],
                                    ue = f[B],
                                    ce = f[(N + 1) % 5 + 5 * O],
                                    Ie = f[(N + 2) % 5 + 5 * O];
                                C.high = ue.high ^ ~ce.high & Ie.high, C.low = ue.low ^ ~ce.low & Ie.low
                            }
                        var C = x[0],
                            Y = d[E];
                        C.high ^= Y.high, C.low ^= Y.low
                    }
                },
                _doFinalize: function() {
                    var g = this._data,
                        v = g.words,
                        x = this._nDataBytes * 8,
                        p = g.sigBytes * 8,
                        m = this.blockSize * 32;
                    v[p >>> 5] |= 1 << 24 - p % 32, v[(t.ceil((p + 1) / m) * m >>> 5) - 1] |= 128, g.sigBytes = v.length * 4, this._process();
                    for (var D = this._state, y = this.cfg.outputLength / 8, C = y / 8, E = [], N = 0; N < C; N++) {
                        var M = D[N],
                            R = M.high,
                            O = M.low;
                        R = (R << 8 | R >>> 24) & 16711935 | (R << 24 | R >>> 8) & 4278255360, O = (O << 8 | O >>> 24) & 16711935 | (O << 24 | O >>> 8) & 4278255360, E.push(O), E.push(R)
                    }
                    return new o.init(E, y)
                },
                clone: function() {
                    for (var g = i.clone.call(this), v = g._state = this._state.slice(0), x = 0; x < 25; x++) v[x] = v[x].clone();
                    return g
                }
            });
            n.SHA3 = i._createHelper(h), n.HmacSHA3 = i._createHmacHelper(h)
        }(Math), e.SHA3
    })
});
var V0 = Q((qi, j0) => {
    "use strict";
    (function(e, t) {
        typeof qi == "object" ? j0.exports = qi = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(qi, function(e) {
        return function(t) {
            var n = e,
                r = n.lib,
                o = r.WordArray,
                i = r.Hasher,
                s = n.algo,
                a = o.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
                c = o.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
                l = o.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
                u = o.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
                d = o.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
                f = o.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
                h = s.RIPEMD160 = i.extend({
                    _doReset: function() {
                        this._hash = o.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                    },
                    _doProcessBlock: function(y, C) {
                        for (var E = 0; E < 16; E++) {
                            var N = C + E,
                                M = y[N];
                            y[N] = (M << 8 | M >>> 24) & 16711935 | (M << 24 | M >>> 8) & 4278255360
                        }
                        var R = this._hash.words,
                            O = d.words,
                            w = f.words,
                            T = a.words,
                            k = c.words,
                            S = l.words,
                            j = u.words,
                            B, q, X, b, _, A, I, ue, ce, Ie;
                        A = B = R[0], I = q = R[1], ue = X = R[2], ce = b = R[3], Ie = _ = R[4];
                        for (var Y, E = 0; E < 80; E += 1) Y = B + y[C + T[E]] | 0, E < 16 ? Y += g(q, X, b) + O[0] : E < 32 ? Y += v(q, X, b) + O[1] : E < 48 ? Y += x(q, X, b) + O[2] : E < 64 ? Y += p(q, X, b) + O[3] : Y += m(q, X, b) + O[4], Y = Y | 0, Y = D(Y, S[E]), Y = Y + _ | 0, B = _, _ = b, b = D(X, 10), X = q, q = Y, Y = A + y[C + k[E]] | 0, E < 16 ? Y += m(I, ue, ce) + w[0] : E < 32 ? Y += p(I, ue, ce) + w[1] : E < 48 ? Y += x(I, ue, ce) + w[2] : E < 64 ? Y += v(I, ue, ce) + w[3] : Y += g(I, ue, ce) + w[4], Y = Y | 0, Y = D(Y, j[E]), Y = Y + Ie | 0, A = Ie, Ie = ce, ce = D(ue, 10), ue = I, I = Y;
                        Y = R[1] + X + ce | 0, R[1] = R[2] + b + Ie | 0, R[2] = R[3] + _ + A | 0, R[3] = R[4] + B + I | 0, R[4] = R[0] + q + ue | 0, R[0] = Y
                    },
                    _doFinalize: function() {
                        var y = this._data,
                            C = y.words,
                            E = this._nDataBytes * 8,
                            N = y.sigBytes * 8;
                        C[N >>> 5] |= 128 << 24 - N % 32, C[(N + 64 >>> 9 << 4) + 14] = (E << 8 | E >>> 24) & 16711935 | (E << 24 | E >>> 8) & 4278255360, y.sigBytes = (C.length + 1) * 4, this._process();
                        for (var M = this._hash, R = M.words, O = 0; O < 5; O++) {
                            var w = R[O];
                            R[O] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360
                        }
                        return M
                    },
                    clone: function() {
                        var y = i.clone.call(this);
                        return y._hash = this._hash.clone(), y
                    }
                });

            function g(y, C, E) {
                return y ^ C ^ E
            }

            function v(y, C, E) {
                return y & C | ~y & E
            }

            function x(y, C, E) {
                return (y | ~C) ^ E
            }

            function p(y, C, E) {
                return y & E | C & ~E
            }

            function m(y, C, E) {
                return y ^ (C | ~E)
            }

            function D(y, C) {
                return y << C | y >>> 32 - C
            }
            n.RIPEMD160 = i._createHelper(h), n.HmacRIPEMD160 = i._createHmacHelper(h)
        }(Math), e.RIPEMD160
    })
});
var Gi = Q((Wi, H0) => {
    "use strict";
    (function(e, t) {
        typeof Wi == "object" ? H0.exports = Wi = t(K()) : typeof define == "function" && define.amd ? define(["./core"], t) : t(e.CryptoJS)
    })(Wi, function(e) {
        (function() {
            var t = e,
                n = t.lib,
                r = n.Base,
                o = t.enc,
                i = o.Utf8,
                s = t.algo,
                a = s.HMAC = r.extend({
                    init: function(c, l) {
                        c = this._hasher = new c.init, typeof l == "string" && (l = i.parse(l));
                        var u = c.blockSize,
                            d = u * 4;
                        l.sigBytes > d && (l = c.finalize(l)), l.clamp();
                        for (var f = this._oKey = l.clone(), h = this._iKey = l.clone(), g = f.words, v = h.words, x = 0; x < u; x++) g[x] ^= 1549556828, v[x] ^= 909522486;
                        f.sigBytes = h.sigBytes = d, this.reset()
                    },
                    reset: function() {
                        var c = this._hasher;
                        c.reset(), c.update(this._iKey)
                    },
                    update: function(c) {
                        return this._hasher.update(c), this
                    },
                    finalize: function(c) {
                        var l = this._hasher,
                            u = l.finalize(c);
                        l.reset();
                        var d = l.finalize(this._oKey.clone().concat(u));
                        return d
                    }
                })
        })()
    })
});
var U0 = Q((Zi, $0) => {
    "use strict";
    (function(e, t, n) {
        typeof Zi == "object" ? $0.exports = Zi = t(K(), Vi(), Gi()) : typeof define == "function" && define.amd ? define(["./core", "./sha256", "./hmac"], t) : t(e.CryptoJS)
    })(Zi, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.Base,
                o = n.WordArray,
                i = t.algo,
                s = i.SHA256,
                a = i.HMAC,
                c = i.PBKDF2 = r.extend({
                    cfg: r.extend({
                        keySize: 128 / 32,
                        hasher: s,
                        iterations: 25e4
                    }),
                    init: function(l) {
                        this.cfg = this.cfg.extend(l)
                    },
                    compute: function(l, u) {
                        for (var d = this.cfg, f = a.create(d.hasher, l), h = o.create(), g = o.create([1]), v = h.words, x = g.words, p = d.keySize, m = d.iterations; v.length < p;) {
                            var D = f.update(u).finalize(g);
                            f.reset();
                            for (var y = D.words, C = y.length, E = D, N = 1; N < m; N++) {
                                E = f.finalize(E), f.reset();
                                for (var M = E.words, R = 0; R < C; R++) y[R] ^= M[R]
                            }
                            h.concat(D), x[0]++
                        }
                        return h.sigBytes = p * 4, h
                    }
                });
            t.PBKDF2 = function(l, u, d) {
                return c.create(d).compute(l, u)
            }
        }(), e.PBKDF2
    })
});
var gt = Q((Yi, z0) => {
    "use strict";
    (function(e, t, n) {
        typeof Yi == "object" ? z0.exports = Yi = t(K(), fu(), Gi()) : typeof define == "function" && define.amd ? define(["./core", "./sha1", "./hmac"], t) : t(e.CryptoJS)
    })(Yi, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.Base,
                o = n.WordArray,
                i = t.algo,
                s = i.MD5,
                a = i.EvpKDF = r.extend({
                    cfg: r.extend({
                        keySize: 128 / 32,
                        hasher: s,
                        iterations: 1
                    }),
                    init: function(c) {
                        this.cfg = this.cfg.extend(c)
                    },
                    compute: function(c, l) {
                        for (var u, d = this.cfg, f = d.hasher.create(), h = o.create(), g = h.words, v = d.keySize, x = d.iterations; g.length < v;) {
                            u && f.update(u), u = f.update(c).finalize(l), f.reset();
                            for (var p = 1; p < x; p++) u = f.finalize(u), f.reset();
                            h.concat(u)
                        }
                        return h.sigBytes = v * 4, h
                    }
                });
            t.EvpKDF = function(c, l, u) {
                return a.create(u).compute(c, l)
            }
        }(), e.EvpKDF
    })
});
var me = Q((Qi, q0) => {
    "use strict";
    (function(e, t, n) {
        typeof Qi == "object" ? q0.exports = Qi = t(K(), gt()) : typeof define == "function" && define.amd ? define(["./core", "./evpkdf"], t) : t(e.CryptoJS)
    })(Qi, function(e) {
        e.lib.Cipher || function(t) {
            var n = e,
                r = n.lib,
                o = r.Base,
                i = r.WordArray,
                s = r.BufferedBlockAlgorithm,
                a = n.enc,
                c = a.Utf8,
                l = a.Base64,
                u = n.algo,
                d = u.EvpKDF,
                f = r.Cipher = s.extend({
                    cfg: o.extend(),
                    createEncryptor: function(w, T) {
                        return this.create(this._ENC_XFORM_MODE, w, T)
                    },
                    createDecryptor: function(w, T) {
                        return this.create(this._DEC_XFORM_MODE, w, T)
                    },
                    init: function(w, T, k) {
                        this.cfg = this.cfg.extend(k), this._xformMode = w, this._key = T, this.reset()
                    },
                    reset: function() {
                        s.reset.call(this), this._doReset()
                    },
                    process: function(w) {
                        return this._append(w), this._process()
                    },
                    finalize: function(w) {
                        w && this._append(w);
                        var T = this._doFinalize();
                        return T
                    },
                    keySize: 128 / 32,
                    ivSize: 128 / 32,
                    _ENC_XFORM_MODE: 1,
                    _DEC_XFORM_MODE: 2,
                    _createHelper: function() {
                        function w(T) {
                            return typeof T == "string" ? O : N
                        }
                        return function(T) {
                            return {
                                encrypt: function(k, S, j) {
                                    return w(S).encrypt(T, k, S, j)
                                },
                                decrypt: function(k, S, j) {
                                    return w(S).decrypt(T, k, S, j)
                                }
                            }
                        }
                    }()
                }),
                h = r.StreamCipher = f.extend({
                    _doFinalize: function() {
                        var w = this._process(!0);
                        return w
                    },
                    blockSize: 1
                }),
                g = n.mode = {},
                v = r.BlockCipherMode = o.extend({
                    createEncryptor: function(w, T) {
                        return this.Encryptor.create(w, T)
                    },
                    createDecryptor: function(w, T) {
                        return this.Decryptor.create(w, T)
                    },
                    init: function(w, T) {
                        this._cipher = w, this._iv = T
                    }
                }),
                x = g.CBC = function() {
                    var w = v.extend();
                    w.Encryptor = w.extend({
                        processBlock: function(k, S) {
                            var j = this._cipher,
                                B = j.blockSize;
                            T.call(this, k, S, B), j.encryptBlock(k, S), this._prevBlock = k.slice(S, S + B)
                        }
                    }), w.Decryptor = w.extend({
                        processBlock: function(k, S) {
                            var j = this._cipher,
                                B = j.blockSize,
                                q = k.slice(S, S + B);
                            j.decryptBlock(k, S), T.call(this, k, S, B), this._prevBlock = q
                        }
                    });

                    function T(k, S, j) {
                        var B, q = this._iv;
                        q ? (B = q, this._iv = t) : B = this._prevBlock;
                        for (var X = 0; X < j; X++) k[S + X] ^= B[X]
                    }
                    return w
                }(),
                p = n.pad = {},
                m = p.Pkcs7 = {
                    pad: function(w, T) {
                        for (var k = T * 4, S = k - w.sigBytes % k, j = S << 24 | S << 16 | S << 8 | S, B = [], q = 0; q < S; q += 4) B.push(j);
                        var X = i.create(B, S);
                        w.concat(X)
                    },
                    unpad: function(w) {
                        var T = w.words[w.sigBytes - 1 >>> 2] & 255;
                        w.sigBytes -= T
                    }
                },
                D = r.BlockCipher = f.extend({
                    cfg: f.cfg.extend({
                        mode: x,
                        padding: m
                    }),
                    reset: function() {
                        var w;
                        f.reset.call(this);
                        var T = this.cfg,
                            k = T.iv,
                            S = T.mode;
                        this._xformMode == this._ENC_XFORM_MODE ? w = S.createEncryptor : (w = S.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == w ? this._mode.init(this, k && k.words) : (this._mode = w.call(S, this, k && k.words), this._mode.__creator = w)
                    },
                    _doProcessBlock: function(w, T) {
                        this._mode.processBlock(w, T)
                    },
                    _doFinalize: function() {
                        var w, T = this.cfg.padding;
                        return this._xformMode == this._ENC_XFORM_MODE ? (T.pad(this._data, this.blockSize), w = this._process(!0)) : (w = this._process(!0), T.unpad(w)), w
                    },
                    blockSize: 128 / 32
                }),
                y = r.CipherParams = o.extend({
                    init: function(w) {
                        this.mixIn(w)
                    },
                    toString: function(w) {
                        return (w || this.formatter).stringify(this)
                    }
                }),
                C = n.format = {},
                E = C.OpenSSL = {
                    stringify: function(w) {
                        var T, k = w.ciphertext,
                            S = w.salt;
                        return S ? T = i.create([1398893684, 1701076831]).concat(S).concat(k) : T = k, T.toString(l)
                    },
                    parse: function(w) {
                        var T, k = l.parse(w),
                            S = k.words;
                        return S[0] == 1398893684 && S[1] == 1701076831 && (T = i.create(S.slice(2, 4)), S.splice(0, 4), k.sigBytes -= 16), y.create({
                            ciphertext: k,
                            salt: T
                        })
                    }
                },
                N = r.SerializableCipher = o.extend({
                    cfg: o.extend({
                        format: E
                    }),
                    encrypt: function(w, T, k, S) {
                        S = this.cfg.extend(S);
                        var j = w.createEncryptor(k, S),
                            B = j.finalize(T),
                            q = j.cfg;
                        return y.create({
                            ciphertext: B,
                            key: k,
                            iv: q.iv,
                            algorithm: w,
                            mode: q.mode,
                            padding: q.padding,
                            blockSize: w.blockSize,
                            formatter: S.format
                        })
                    },
                    decrypt: function(w, T, k, S) {
                        S = this.cfg.extend(S), T = this._parse(T, S.format);
                        var j = w.createDecryptor(k, S).finalize(T.ciphertext);
                        return j
                    },
                    _parse: function(w, T) {
                        return typeof w == "string" ? T.parse(w, this) : w
                    }
                }),
                M = n.kdf = {},
                R = M.OpenSSL = {
                    execute: function(w, T, k, S, j) {
                        if (S || (S = i.random(64 / 8)), j) var B = d.create({
                            keySize: T + k,
                            hasher: j
                        }).compute(w, S);
                        else var B = d.create({
                            keySize: T + k
                        }).compute(w, S);
                        var q = i.create(B.words.slice(T), k * 4);
                        return B.sigBytes = T * 4, y.create({
                            key: B,
                            iv: q,
                            salt: S
                        })
                    }
                },
                O = r.PasswordBasedCipher = N.extend({
                    cfg: N.cfg.extend({
                        kdf: R
                    }),
                    encrypt: function(w, T, k, S) {
                        S = this.cfg.extend(S);
                        var j = S.kdf.execute(k, w.keySize, w.ivSize, S.salt, S.hasher);
                        S.iv = j.iv;
                        var B = N.encrypt.call(this, w, T, j.key, S);
                        return B.mixIn(j), B
                    },
                    decrypt: function(w, T, k, S) {
                        S = this.cfg.extend(S), T = this._parse(T, S.format);
                        var j = S.kdf.execute(k, w.keySize, w.ivSize, T.salt, S.hasher);
                        S.iv = j.iv;
                        var B = N.decrypt.call(this, w, T, j.key, S);
                        return B
                    }
                })
        }()
    })
});
var G0 = Q((Ki, W0) => {
    "use strict";
    (function(e, t, n) {
        typeof Ki == "object" ? W0.exports = Ki = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(Ki, function(e) {
        return e.mode.CFB = function() {
            var t = e.lib.BlockCipherMode.extend();
            t.Encryptor = t.extend({
                processBlock: function(r, o) {
                    var i = this._cipher,
                        s = i.blockSize;
                    n.call(this, r, o, s, i), this._prevBlock = r.slice(o, o + s)
                }
            }), t.Decryptor = t.extend({
                processBlock: function(r, o) {
                    var i = this._cipher,
                        s = i.blockSize,
                        a = r.slice(o, o + s);
                    n.call(this, r, o, s, i), this._prevBlock = a
                }
            });

            function n(r, o, i, s) {
                var a, c = this._iv;
                c ? (a = c.slice(0), this._iv = void 0) : a = this._prevBlock, s.encryptBlock(a, 0);
                for (var l = 0; l < i; l++) r[o + l] ^= a[l]
            }
            return t
        }(), e.mode.CFB
    })
});
var Y0 = Q((Xi, Z0) => {
    "use strict";
    (function(e, t, n) {
        typeof Xi == "object" ? Z0.exports = Xi = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(Xi, function(e) {
        return e.mode.CTR = function() {
            var t = e.lib.BlockCipherMode.extend(),
                n = t.Encryptor = t.extend({
                    processBlock: function(r, o) {
                        var i = this._cipher,
                            s = i.blockSize,
                            a = this._iv,
                            c = this._counter;
                        a && (c = this._counter = a.slice(0), this._iv = void 0);
                        var l = c.slice(0);
                        i.encryptBlock(l, 0), c[s - 1] = c[s - 1] + 1 | 0;
                        for (var u = 0; u < s; u++) r[o + u] ^= l[u]
                    }
                });
            return t.Decryptor = n, t
        }(), e.mode.CTR
    })
});
var K0 = Q((Ji, Q0) => {
    "use strict";
    (function(e, t, n) {
        typeof Ji == "object" ? Q0.exports = Ji = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(Ji, function(e) {
        return e.mode.CTRGladman = function() {
            var t = e.lib.BlockCipherMode.extend();

            function n(i) {
                if ((i >> 24 & 255) === 255) {
                    var s = i >> 16 & 255,
                        a = i >> 8 & 255,
                        c = i & 255;
                    s === 255 ? (s = 0, a === 255 ? (a = 0, c === 255 ? c = 0 : ++c) : ++a) : ++s, i = 0, i += s << 16, i += a << 8, i += c
                } else i += 1 << 24;
                return i
            }

            function r(i) {
                return (i[0] = n(i[0])) === 0 && (i[1] = n(i[1])), i
            }
            var o = t.Encryptor = t.extend({
                processBlock: function(i, s) {
                    var a = this._cipher,
                        c = a.blockSize,
                        l = this._iv,
                        u = this._counter;
                    l && (u = this._counter = l.slice(0), this._iv = void 0), r(u);
                    var d = u.slice(0);
                    a.encryptBlock(d, 0);
                    for (var f = 0; f < c; f++) i[s + f] ^= d[f]
                }
            });
            return t.Decryptor = o, t
        }(), e.mode.CTRGladman
    })
});
var J0 = Q((es, X0) => {
    "use strict";
    (function(e, t, n) {
        typeof es == "object" ? X0.exports = es = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(es, function(e) {
        return e.mode.OFB = function() {
            var t = e.lib.BlockCipherMode.extend(),
                n = t.Encryptor = t.extend({
                    processBlock: function(r, o) {
                        var i = this._cipher,
                            s = i.blockSize,
                            a = this._iv,
                            c = this._keystream;
                        a && (c = this._keystream = a.slice(0), this._iv = void 0), i.encryptBlock(c, 0);
                        for (var l = 0; l < s; l++) r[o + l] ^= c[l]
                    }
                });
            return t.Decryptor = n, t
        }(), e.mode.OFB
    })
});
var tp = Q((ts, ep) => {
    "use strict";
    (function(e, t, n) {
        typeof ts == "object" ? ep.exports = ts = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(ts, function(e) {
        return e.mode.ECB = function() {
            var t = e.lib.BlockCipherMode.extend();
            return t.Encryptor = t.extend({
                processBlock: function(n, r) {
                    this._cipher.encryptBlock(n, r)
                }
            }), t.Decryptor = t.extend({
                processBlock: function(n, r) {
                    this._cipher.decryptBlock(n, r)
                }
            }), t
        }(), e.mode.ECB
    })
});
var rp = Q((ns, np) => {
    "use strict";
    (function(e, t, n) {
        typeof ns == "object" ? np.exports = ns = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(ns, function(e) {
        return e.pad.AnsiX923 = {
            pad: function(t, n) {
                var r = t.sigBytes,
                    o = n * 4,
                    i = o - r % o,
                    s = r + i - 1;
                t.clamp(), t.words[s >>> 2] |= i << 24 - s % 4 * 8, t.sigBytes += i
            },
            unpad: function(t) {
                var n = t.words[t.sigBytes - 1 >>> 2] & 255;
                t.sigBytes -= n
            }
        }, e.pad.Ansix923
    })
});
var ip = Q((rs, op) => {
    "use strict";
    (function(e, t, n) {
        typeof rs == "object" ? op.exports = rs = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(rs, function(e) {
        return e.pad.Iso10126 = {
            pad: function(t, n) {
                var r = n * 4,
                    o = r - t.sigBytes % r;
                t.concat(e.lib.WordArray.random(o - 1)).concat(e.lib.WordArray.create([o << 24], 1))
            },
            unpad: function(t) {
                var n = t.words[t.sigBytes - 1 >>> 2] & 255;
                t.sigBytes -= n
            }
        }, e.pad.Iso10126
    })
});
var ap = Q((os, sp) => {
    "use strict";
    (function(e, t, n) {
        typeof os == "object" ? sp.exports = os = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(os, function(e) {
        return e.pad.Iso97971 = {
            pad: function(t, n) {
                t.concat(e.lib.WordArray.create([2147483648], 1)), e.pad.ZeroPadding.pad(t, n)
            },
            unpad: function(t) {
                e.pad.ZeroPadding.unpad(t), t.sigBytes--
            }
        }, e.pad.Iso97971
    })
});
var up = Q((is, cp) => {
    "use strict";
    (function(e, t, n) {
        typeof is == "object" ? cp.exports = is = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(is, function(e) {
        return e.pad.ZeroPadding = {
            pad: function(t, n) {
                var r = n * 4;
                t.clamp(), t.sigBytes += r - (t.sigBytes % r || r)
            },
            unpad: function(t) {
                for (var n = t.words, r = t.sigBytes - 1, r = t.sigBytes - 1; r >= 0; r--)
                    if (n[r >>> 2] >>> 24 - r % 4 * 8 & 255) {
                        t.sigBytes = r + 1;
                        break
                    }
            }
        }, e.pad.ZeroPadding
    })
});
var dp = Q((ss, lp) => {
    "use strict";
    (function(e, t, n) {
        typeof ss == "object" ? lp.exports = ss = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(ss, function(e) {
        return e.pad.NoPadding = {
            pad: function() {},
            unpad: function() {}
        }, e.pad.NoPadding
    })
});
var hp = Q((as, fp) => {
    "use strict";
    (function(e, t, n) {
        typeof as == "object" ? fp.exports = as = t(K(), me()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], t) : t(e.CryptoJS)
    })(as, function(e) {
        return function(t) {
            var n = e,
                r = n.lib,
                o = r.CipherParams,
                i = n.enc,
                s = i.Hex,
                a = n.format,
                c = a.Hex = {
                    stringify: function(l) {
                        return l.ciphertext.toString(s)
                    },
                    parse: function(l) {
                        var u = s.parse(l);
                        return o.create({
                            ciphertext: u
                        })
                    }
                }
        }(), e.format.Hex
    })
});
var gp = Q((cs, pp) => {
    "use strict";
    (function(e, t, n) {
        typeof cs == "object" ? pp.exports = cs = t(K(), Mt(), Tt(), gt(), me()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], t) : t(e.CryptoJS)
    })(cs, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.BlockCipher,
                o = t.algo,
                i = [],
                s = [],
                a = [],
                c = [],
                l = [],
                u = [],
                d = [],
                f = [],
                h = [],
                g = [];
            (function() {
                for (var p = [], m = 0; m < 256; m++) m < 128 ? p[m] = m << 1 : p[m] = m << 1 ^ 283;
                for (var D = 0, y = 0, m = 0; m < 256; m++) {
                    var C = y ^ y << 1 ^ y << 2 ^ y << 3 ^ y << 4;
                    C = C >>> 8 ^ C & 255 ^ 99, i[D] = C, s[C] = D;
                    var E = p[D],
                        N = p[E],
                        M = p[N],
                        R = p[C] * 257 ^ C * 16843008;
                    a[D] = R << 24 | R >>> 8, c[D] = R << 16 | R >>> 16, l[D] = R << 8 | R >>> 24, u[D] = R;
                    var R = M * 16843009 ^ N * 65537 ^ E * 257 ^ D * 16843008;
                    d[C] = R << 24 | R >>> 8, f[C] = R << 16 | R >>> 16, h[C] = R << 8 | R >>> 24, g[C] = R, D ? (D = E ^ p[p[p[M ^ E]]], y ^= p[p[y]]) : D = y = 1
                }
            })();
            var v = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
                x = o.AES = r.extend({
                    _doReset: function() {
                        var p;
                        if (!(this._nRounds && this._keyPriorReset === this._key)) {
                            for (var m = this._keyPriorReset = this._key, D = m.words, y = m.sigBytes / 4, C = this._nRounds = y + 6, E = (C + 1) * 4, N = this._keySchedule = [], M = 0; M < E; M++) M < y ? N[M] = D[M] : (p = N[M - 1], M % y ? y > 6 && M % y == 4 && (p = i[p >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[p & 255]) : (p = p << 8 | p >>> 24, p = i[p >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[p & 255], p ^= v[M / y | 0] << 24), N[M] = N[M - y] ^ p);
                            for (var R = this._invKeySchedule = [], O = 0; O < E; O++) {
                                var M = E - O;
                                if (O % 4) var p = N[M];
                                else var p = N[M - 4];
                                O < 4 || M <= 4 ? R[O] = p : R[O] = d[i[p >>> 24]] ^ f[i[p >>> 16 & 255]] ^ h[i[p >>> 8 & 255]] ^ g[i[p & 255]]
                            }
                        }
                    },
                    encryptBlock: function(p, m) {
                        this._doCryptBlock(p, m, this._keySchedule, a, c, l, u, i)
                    },
                    decryptBlock: function(p, m) {
                        var D = p[m + 1];
                        p[m + 1] = p[m + 3], p[m + 3] = D, this._doCryptBlock(p, m, this._invKeySchedule, d, f, h, g, s);
                        var D = p[m + 1];
                        p[m + 1] = p[m + 3], p[m + 3] = D
                    },
                    _doCryptBlock: function(p, m, D, y, C, E, N, M) {
                        for (var R = this._nRounds, O = p[m] ^ D[0], w = p[m + 1] ^ D[1], T = p[m + 2] ^ D[2], k = p[m + 3] ^ D[3], S = 4, j = 1; j < R; j++) {
                            var B = y[O >>> 24] ^ C[w >>> 16 & 255] ^ E[T >>> 8 & 255] ^ N[k & 255] ^ D[S++],
                                q = y[w >>> 24] ^ C[T >>> 16 & 255] ^ E[k >>> 8 & 255] ^ N[O & 255] ^ D[S++],
                                X = y[T >>> 24] ^ C[k >>> 16 & 255] ^ E[O >>> 8 & 255] ^ N[w & 255] ^ D[S++],
                                b = y[k >>> 24] ^ C[O >>> 16 & 255] ^ E[w >>> 8 & 255] ^ N[T & 255] ^ D[S++];
                            O = B, w = q, T = X, k = b
                        }
                        var B = (M[O >>> 24] << 24 | M[w >>> 16 & 255] << 16 | M[T >>> 8 & 255] << 8 | M[k & 255]) ^ D[S++],
                            q = (M[w >>> 24] << 24 | M[T >>> 16 & 255] << 16 | M[k >>> 8 & 255] << 8 | M[O & 255]) ^ D[S++],
                            X = (M[T >>> 24] << 24 | M[k >>> 16 & 255] << 16 | M[O >>> 8 & 255] << 8 | M[w & 255]) ^ D[S++],
                            b = (M[k >>> 24] << 24 | M[O >>> 16 & 255] << 16 | M[w >>> 8 & 255] << 8 | M[T & 255]) ^ D[S++];
                        p[m] = B, p[m + 1] = q, p[m + 2] = X, p[m + 3] = b
                    },
                    keySize: 256 / 32
                });
            t.AES = r._createHelper(x)
        }(), e.AES
    })
});
var vp = Q((us, mp) => {
    "use strict";
    (function(e, t, n) {
        typeof us == "object" ? mp.exports = us = t(K(), Mt(), Tt(), gt(), me()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], t) : t(e.CryptoJS)
    })(us, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.WordArray,
                o = n.BlockCipher,
                i = t.algo,
                s = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
                a = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
                c = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
                l = [{
                    0: 8421888,
                    268435456: 32768,
                    536870912: 8421378,
                    805306368: 2,
                    1073741824: 512,
                    1342177280: 8421890,
                    1610612736: 8389122,
                    1879048192: 8388608,
                    2147483648: 514,
                    2415919104: 8389120,
                    2684354560: 33280,
                    2952790016: 8421376,
                    3221225472: 32770,
                    3489660928: 8388610,
                    3758096384: 0,
                    4026531840: 33282,
                    134217728: 0,
                    402653184: 8421890,
                    671088640: 33282,
                    939524096: 32768,
                    1207959552: 8421888,
                    1476395008: 512,
                    1744830464: 8421378,
                    2013265920: 2,
                    2281701376: 8389120,
                    2550136832: 33280,
                    2818572288: 8421376,
                    3087007744: 8389122,
                    3355443200: 8388610,
                    3623878656: 32770,
                    3892314112: 514,
                    4160749568: 8388608,
                    1: 32768,
                    268435457: 2,
                    536870913: 8421888,
                    805306369: 8388608,
                    1073741825: 8421378,
                    1342177281: 33280,
                    1610612737: 512,
                    1879048193: 8389122,
                    2147483649: 8421890,
                    2415919105: 8421376,
                    2684354561: 8388610,
                    2952790017: 33282,
                    3221225473: 514,
                    3489660929: 8389120,
                    3758096385: 32770,
                    4026531841: 0,
                    134217729: 8421890,
                    402653185: 8421376,
                    671088641: 8388608,
                    939524097: 512,
                    1207959553: 32768,
                    1476395009: 8388610,
                    1744830465: 2,
                    2013265921: 33282,
                    2281701377: 32770,
                    2550136833: 8389122,
                    2818572289: 514,
                    3087007745: 8421888,
                    3355443201: 8389120,
                    3623878657: 0,
                    3892314113: 33280,
                    4160749569: 8421378
                }, {
                    0: 1074282512,
                    16777216: 16384,
                    33554432: 524288,
                    50331648: 1074266128,
                    67108864: 1073741840,
                    83886080: 1074282496,
                    100663296: 1073758208,
                    117440512: 16,
                    134217728: 540672,
                    150994944: 1073758224,
                    167772160: 1073741824,
                    184549376: 540688,
                    201326592: 524304,
                    218103808: 0,
                    234881024: 16400,
                    251658240: 1074266112,
                    8388608: 1073758208,
                    25165824: 540688,
                    41943040: 16,
                    58720256: 1073758224,
                    75497472: 1074282512,
                    92274688: 1073741824,
                    109051904: 524288,
                    125829120: 1074266128,
                    142606336: 524304,
                    159383552: 0,
                    176160768: 16384,
                    192937984: 1074266112,
                    209715200: 1073741840,
                    226492416: 540672,
                    243269632: 1074282496,
                    260046848: 16400,
                    268435456: 0,
                    285212672: 1074266128,
                    301989888: 1073758224,
                    318767104: 1074282496,
                    335544320: 1074266112,
                    352321536: 16,
                    369098752: 540688,
                    385875968: 16384,
                    402653184: 16400,
                    419430400: 524288,
                    436207616: 524304,
                    452984832: 1073741840,
                    469762048: 540672,
                    486539264: 1073758208,
                    503316480: 1073741824,
                    520093696: 1074282512,
                    276824064: 540688,
                    293601280: 524288,
                    310378496: 1074266112,
                    327155712: 16384,
                    343932928: 1073758208,
                    360710144: 1074282512,
                    377487360: 16,
                    394264576: 1073741824,
                    411041792: 1074282496,
                    427819008: 1073741840,
                    444596224: 1073758224,
                    461373440: 524304,
                    478150656: 0,
                    494927872: 16400,
                    511705088: 1074266128,
                    528482304: 540672
                }, {
                    0: 260,
                    1048576: 0,
                    2097152: 67109120,
                    3145728: 65796,
                    4194304: 65540,
                    5242880: 67108868,
                    6291456: 67174660,
                    7340032: 67174400,
                    8388608: 67108864,
                    9437184: 67174656,
                    10485760: 65792,
                    11534336: 67174404,
                    12582912: 67109124,
                    13631488: 65536,
                    14680064: 4,
                    15728640: 256,
                    524288: 67174656,
                    1572864: 67174404,
                    2621440: 0,
                    3670016: 67109120,
                    4718592: 67108868,
                    5767168: 65536,
                    6815744: 65540,
                    7864320: 260,
                    8912896: 4,
                    9961472: 256,
                    11010048: 67174400,
                    12058624: 65796,
                    13107200: 65792,
                    14155776: 67109124,
                    15204352: 67174660,
                    16252928: 67108864,
                    16777216: 67174656,
                    17825792: 65540,
                    18874368: 65536,
                    19922944: 67109120,
                    20971520: 256,
                    22020096: 67174660,
                    23068672: 67108868,
                    24117248: 0,
                    25165824: 67109124,
                    26214400: 67108864,
                    27262976: 4,
                    28311552: 65792,
                    29360128: 67174400,
                    30408704: 260,
                    31457280: 65796,
                    32505856: 67174404,
                    17301504: 67108864,
                    18350080: 260,
                    19398656: 67174656,
                    20447232: 0,
                    21495808: 65540,
                    22544384: 67109120,
                    23592960: 256,
                    24641536: 67174404,
                    25690112: 65536,
                    26738688: 67174660,
                    27787264: 65796,
                    28835840: 67108868,
                    29884416: 67109124,
                    30932992: 67174400,
                    31981568: 4,
                    33030144: 65792
                }, {
                    0: 2151682048,
                    65536: 2147487808,
                    131072: 4198464,
                    196608: 2151677952,
                    262144: 0,
                    327680: 4198400,
                    393216: 2147483712,
                    458752: 4194368,
                    524288: 2147483648,
                    589824: 4194304,
                    655360: 64,
                    720896: 2147487744,
                    786432: 2151678016,
                    851968: 4160,
                    917504: 4096,
                    983040: 2151682112,
                    32768: 2147487808,
                    98304: 64,
                    163840: 2151678016,
                    229376: 2147487744,
                    294912: 4198400,
                    360448: 2151682112,
                    425984: 0,
                    491520: 2151677952,
                    557056: 4096,
                    622592: 2151682048,
                    688128: 4194304,
                    753664: 4160,
                    819200: 2147483648,
                    884736: 4194368,
                    950272: 4198464,
                    1015808: 2147483712,
                    1048576: 4194368,
                    1114112: 4198400,
                    1179648: 2147483712,
                    1245184: 0,
                    1310720: 4160,
                    1376256: 2151678016,
                    1441792: 2151682048,
                    1507328: 2147487808,
                    1572864: 2151682112,
                    1638400: 2147483648,
                    1703936: 2151677952,
                    1769472: 4198464,
                    1835008: 2147487744,
                    1900544: 4194304,
                    1966080: 64,
                    2031616: 4096,
                    1081344: 2151677952,
                    1146880: 2151682112,
                    1212416: 0,
                    1277952: 4198400,
                    1343488: 4194368,
                    1409024: 2147483648,
                    1474560: 2147487808,
                    1540096: 64,
                    1605632: 2147483712,
                    1671168: 4096,
                    1736704: 2147487744,
                    1802240: 2151678016,
                    1867776: 4160,
                    1933312: 2151682048,
                    1998848: 4194304,
                    2064384: 4198464
                }, {
                    0: 128,
                    4096: 17039360,
                    8192: 262144,
                    12288: 536870912,
                    16384: 537133184,
                    20480: 16777344,
                    24576: 553648256,
                    28672: 262272,
                    32768: 16777216,
                    36864: 537133056,
                    40960: 536871040,
                    45056: 553910400,
                    49152: 553910272,
                    53248: 0,
                    57344: 17039488,
                    61440: 553648128,
                    2048: 17039488,
                    6144: 553648256,
                    10240: 128,
                    14336: 17039360,
                    18432: 262144,
                    22528: 537133184,
                    26624: 553910272,
                    30720: 536870912,
                    34816: 537133056,
                    38912: 0,
                    43008: 553910400,
                    47104: 16777344,
                    51200: 536871040,
                    55296: 553648128,
                    59392: 16777216,
                    63488: 262272,
                    65536: 262144,
                    69632: 128,
                    73728: 536870912,
                    77824: 553648256,
                    81920: 16777344,
                    86016: 553910272,
                    90112: 537133184,
                    94208: 16777216,
                    98304: 553910400,
                    102400: 553648128,
                    106496: 17039360,
                    110592: 537133056,
                    114688: 262272,
                    118784: 536871040,
                    122880: 0,
                    126976: 17039488,
                    67584: 553648256,
                    71680: 16777216,
                    75776: 17039360,
                    79872: 537133184,
                    83968: 536870912,
                    88064: 17039488,
                    92160: 128,
                    96256: 553910272,
                    100352: 262272,
                    104448: 553910400,
                    108544: 0,
                    112640: 553648128,
                    116736: 16777344,
                    120832: 262144,
                    124928: 537133056,
                    129024: 536871040
                }, {
                    0: 268435464,
                    256: 8192,
                    512: 270532608,
                    768: 270540808,
                    1024: 268443648,
                    1280: 2097152,
                    1536: 2097160,
                    1792: 268435456,
                    2048: 0,
                    2304: 268443656,
                    2560: 2105344,
                    2816: 8,
                    3072: 270532616,
                    3328: 2105352,
                    3584: 8200,
                    3840: 270540800,
                    128: 270532608,
                    384: 270540808,
                    640: 8,
                    896: 2097152,
                    1152: 2105352,
                    1408: 268435464,
                    1664: 268443648,
                    1920: 8200,
                    2176: 2097160,
                    2432: 8192,
                    2688: 268443656,
                    2944: 270532616,
                    3200: 0,
                    3456: 270540800,
                    3712: 2105344,
                    3968: 268435456,
                    4096: 268443648,
                    4352: 270532616,
                    4608: 270540808,
                    4864: 8200,
                    5120: 2097152,
                    5376: 268435456,
                    5632: 268435464,
                    5888: 2105344,
                    6144: 2105352,
                    6400: 0,
                    6656: 8,
                    6912: 270532608,
                    7168: 8192,
                    7424: 268443656,
                    7680: 270540800,
                    7936: 2097160,
                    4224: 8,
                    4480: 2105344,
                    4736: 2097152,
                    4992: 268435464,
                    5248: 268443648,
                    5504: 8200,
                    5760: 270540808,
                    6016: 270532608,
                    6272: 270540800,
                    6528: 270532616,
                    6784: 8192,
                    7040: 2105352,
                    7296: 2097160,
                    7552: 0,
                    7808: 268435456,
                    8064: 268443656
                }, {
                    0: 1048576,
                    16: 33555457,
                    32: 1024,
                    48: 1049601,
                    64: 34604033,
                    80: 0,
                    96: 1,
                    112: 34603009,
                    128: 33555456,
                    144: 1048577,
                    160: 33554433,
                    176: 34604032,
                    192: 34603008,
                    208: 1025,
                    224: 1049600,
                    240: 33554432,
                    8: 34603009,
                    24: 0,
                    40: 33555457,
                    56: 34604032,
                    72: 1048576,
                    88: 33554433,
                    104: 33554432,
                    120: 1025,
                    136: 1049601,
                    152: 33555456,
                    168: 34603008,
                    184: 1048577,
                    200: 1024,
                    216: 34604033,
                    232: 1,
                    248: 1049600,
                    256: 33554432,
                    272: 1048576,
                    288: 33555457,
                    304: 34603009,
                    320: 1048577,
                    336: 33555456,
                    352: 34604032,
                    368: 1049601,
                    384: 1025,
                    400: 34604033,
                    416: 1049600,
                    432: 1,
                    448: 0,
                    464: 34603008,
                    480: 33554433,
                    496: 1024,
                    264: 1049600,
                    280: 33555457,
                    296: 34603009,
                    312: 1,
                    328: 33554432,
                    344: 1048576,
                    360: 1025,
                    376: 34604032,
                    392: 33554433,
                    408: 34603008,
                    424: 0,
                    440: 34604033,
                    456: 1049601,
                    472: 1024,
                    488: 33555456,
                    504: 1048577
                }, {
                    0: 134219808,
                    1: 131072,
                    2: 134217728,
                    3: 32,
                    4: 131104,
                    5: 134350880,
                    6: 134350848,
                    7: 2048,
                    8: 134348800,
                    9: 134219776,
                    10: 133120,
                    11: 134348832,
                    12: 2080,
                    13: 0,
                    14: 134217760,
                    15: 133152,
                    2147483648: 2048,
                    2147483649: 134350880,
                    2147483650: 134219808,
                    2147483651: 134217728,
                    2147483652: 134348800,
                    2147483653: 133120,
                    2147483654: 133152,
                    2147483655: 32,
                    2147483656: 134217760,
                    2147483657: 2080,
                    2147483658: 131104,
                    2147483659: 134350848,
                    2147483660: 0,
                    2147483661: 134348832,
                    2147483662: 134219776,
                    2147483663: 131072,
                    16: 133152,
                    17: 134350848,
                    18: 32,
                    19: 2048,
                    20: 134219776,
                    21: 134217760,
                    22: 134348832,
                    23: 131072,
                    24: 0,
                    25: 131104,
                    26: 134348800,
                    27: 134219808,
                    28: 134350880,
                    29: 133120,
                    30: 2080,
                    31: 134217728,
                    2147483664: 131072,
                    2147483665: 2048,
                    2147483666: 134348832,
                    2147483667: 133152,
                    2147483668: 32,
                    2147483669: 134348800,
                    2147483670: 134217728,
                    2147483671: 134219808,
                    2147483672: 134350880,
                    2147483673: 134217760,
                    2147483674: 134219776,
                    2147483675: 0,
                    2147483676: 133120,
                    2147483677: 2080,
                    2147483678: 131104,
                    2147483679: 134350848
                }],
                u = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
                d = i.DES = o.extend({
                    _doReset: function() {
                        for (var v = this._key, x = v.words, p = [], m = 0; m < 56; m++) {
                            var D = s[m] - 1;
                            p[m] = x[D >>> 5] >>> 31 - D % 32 & 1
                        }
                        for (var y = this._subKeys = [], C = 0; C < 16; C++) {
                            for (var E = y[C] = [], N = c[C], m = 0; m < 24; m++) E[m / 6 | 0] |= p[(a[m] - 1 + N) % 28] << 31 - m % 6, E[4 + (m / 6 | 0)] |= p[28 + (a[m + 24] - 1 + N) % 28] << 31 - m % 6;
                            E[0] = E[0] << 1 | E[0] >>> 31;
                            for (var m = 1; m < 7; m++) E[m] = E[m] >>> (m - 1) * 4 + 3;
                            E[7] = E[7] << 5 | E[7] >>> 27
                        }
                        for (var M = this._invSubKeys = [], m = 0; m < 16; m++) M[m] = y[15 - m]
                    },
                    encryptBlock: function(v, x) {
                        this._doCryptBlock(v, x, this._subKeys)
                    },
                    decryptBlock: function(v, x) {
                        this._doCryptBlock(v, x, this._invSubKeys)
                    },
                    _doCryptBlock: function(v, x, p) {
                        this._lBlock = v[x], this._rBlock = v[x + 1], f.call(this, 4, 252645135), f.call(this, 16, 65535), h.call(this, 2, 858993459), h.call(this, 8, 16711935), f.call(this, 1, 1431655765);
                        for (var m = 0; m < 16; m++) {
                            for (var D = p[m], y = this._lBlock, C = this._rBlock, E = 0, N = 0; N < 8; N++) E |= l[N][((C ^ D[N]) & u[N]) >>> 0];
                            this._lBlock = C, this._rBlock = y ^ E
                        }
                        var M = this._lBlock;
                        this._lBlock = this._rBlock, this._rBlock = M, f.call(this, 1, 1431655765), h.call(this, 8, 16711935), h.call(this, 2, 858993459), f.call(this, 16, 65535), f.call(this, 4, 252645135), v[x] = this._lBlock, v[x + 1] = this._rBlock
                    },
                    keySize: 64 / 32,
                    ivSize: 64 / 32,
                    blockSize: 64 / 32
                });

            function f(v, x) {
                var p = (this._lBlock >>> v ^ this._rBlock) & x;
                this._rBlock ^= p, this._lBlock ^= p << v
            }

            function h(v, x) {
                var p = (this._rBlock >>> v ^ this._lBlock) & x;
                this._lBlock ^= p, this._rBlock ^= p << v
            }
            t.DES = o._createHelper(d);
            var g = i.TripleDES = o.extend({
                _doReset: function() {
                    var v = this._key,
                        x = v.words;
                    if (x.length !== 2 && x.length !== 4 && x.length < 6) throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
                    var p = x.slice(0, 2),
                        m = x.length < 4 ? x.slice(0, 2) : x.slice(2, 4),
                        D = x.length < 6 ? x.slice(0, 2) : x.slice(4, 6);
                    this._des1 = d.createEncryptor(r.create(p)), this._des2 = d.createEncryptor(r.create(m)), this._des3 = d.createEncryptor(r.create(D))
                },
                encryptBlock: function(v, x) {
                    this._des1.encryptBlock(v, x), this._des2.decryptBlock(v, x), this._des3.encryptBlock(v, x)
                },
                decryptBlock: function(v, x) {
                    this._des3.decryptBlock(v, x), this._des2.encryptBlock(v, x), this._des1.decryptBlock(v, x)
                },
                keySize: 192 / 32,
                ivSize: 64 / 32,
                blockSize: 64 / 32
            });
            t.TripleDES = o._createHelper(g)
        }(), e.TripleDES
    })
});
var yp = Q((ls, xp) => {
    "use strict";
    (function(e, t, n) {
        typeof ls == "object" ? xp.exports = ls = t(K(), Mt(), Tt(), gt(), me()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], t) : t(e.CryptoJS)
    })(ls, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.StreamCipher,
                o = t.algo,
                i = o.RC4 = r.extend({
                    _doReset: function() {
                        for (var c = this._key, l = c.words, u = c.sigBytes, d = this._S = [], f = 0; f < 256; f++) d[f] = f;
                        for (var f = 0, h = 0; f < 256; f++) {
                            var g = f % u,
                                v = l[g >>> 2] >>> 24 - g % 4 * 8 & 255;
                            h = (h + d[f] + v) % 256;
                            var x = d[f];
                            d[f] = d[h], d[h] = x
                        }
                        this._i = this._j = 0
                    },
                    _doProcessBlock: function(c, l) {
                        c[l] ^= s.call(this)
                    },
                    keySize: 256 / 32,
                    ivSize: 0
                });

            function s() {
                for (var c = this._S, l = this._i, u = this._j, d = 0, f = 0; f < 4; f++) {
                    l = (l + 1) % 256, u = (u + c[l]) % 256;
                    var h = c[l];
                    c[l] = c[u], c[u] = h, d |= c[(c[l] + c[u]) % 256] << 24 - f * 8
                }
                return this._i = l, this._j = u, d
            }
            t.RC4 = r._createHelper(i);
            var a = o.RC4Drop = i.extend({
                cfg: i.cfg.extend({
                    drop: 192
                }),
                _doReset: function() {
                    i._doReset.call(this);
                    for (var c = this.cfg.drop; c > 0; c--) s.call(this)
                }
            });
            t.RC4Drop = r._createHelper(a)
        }(), e.RC4
    })
});
var Cp = Q((ds, Dp) => {
    "use strict";
    (function(e, t, n) {
        typeof ds == "object" ? Dp.exports = ds = t(K(), Mt(), Tt(), gt(), me()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], t) : t(e.CryptoJS)
    })(ds, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.StreamCipher,
                o = t.algo,
                i = [],
                s = [],
                a = [],
                c = o.Rabbit = r.extend({
                    _doReset: function() {
                        for (var u = this._key.words, d = this.cfg.iv, f = 0; f < 4; f++) u[f] = (u[f] << 8 | u[f] >>> 24) & 16711935 | (u[f] << 24 | u[f] >>> 8) & 4278255360;
                        var h = this._X = [u[0], u[3] << 16 | u[2] >>> 16, u[1], u[0] << 16 | u[3] >>> 16, u[2], u[1] << 16 | u[0] >>> 16, u[3], u[2] << 16 | u[1] >>> 16],
                            g = this._C = [u[2] << 16 | u[2] >>> 16, u[0] & 4294901760 | u[1] & 65535, u[3] << 16 | u[3] >>> 16, u[1] & 4294901760 | u[2] & 65535, u[0] << 16 | u[0] >>> 16, u[2] & 4294901760 | u[3] & 65535, u[1] << 16 | u[1] >>> 16, u[3] & 4294901760 | u[0] & 65535];
                        this._b = 0;
                        for (var f = 0; f < 4; f++) l.call(this);
                        for (var f = 0; f < 8; f++) g[f] ^= h[f + 4 & 7];
                        if (d) {
                            var v = d.words,
                                x = v[0],
                                p = v[1],
                                m = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360,
                                D = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360,
                                y = m >>> 16 | D & 4294901760,
                                C = D << 16 | m & 65535;
                            g[0] ^= m, g[1] ^= y, g[2] ^= D, g[3] ^= C, g[4] ^= m, g[5] ^= y, g[6] ^= D, g[7] ^= C;
                            for (var f = 0; f < 4; f++) l.call(this)
                        }
                    },
                    _doProcessBlock: function(u, d) {
                        var f = this._X;
                        l.call(this), i[0] = f[0] ^ f[5] >>> 16 ^ f[3] << 16, i[1] = f[2] ^ f[7] >>> 16 ^ f[5] << 16, i[2] = f[4] ^ f[1] >>> 16 ^ f[7] << 16, i[3] = f[6] ^ f[3] >>> 16 ^ f[1] << 16;
                        for (var h = 0; h < 4; h++) i[h] = (i[h] << 8 | i[h] >>> 24) & 16711935 | (i[h] << 24 | i[h] >>> 8) & 4278255360, u[d + h] ^= i[h]
                    },
                    blockSize: 128 / 32,
                    ivSize: 64 / 32
                });

            function l() {
                for (var u = this._X, d = this._C, f = 0; f < 8; f++) s[f] = d[f];
                d[0] = d[0] + 1295307597 + this._b | 0, d[1] = d[1] + 3545052371 + (d[0] >>> 0 < s[0] >>> 0 ? 1 : 0) | 0, d[2] = d[2] + 886263092 + (d[1] >>> 0 < s[1] >>> 0 ? 1 : 0) | 0, d[3] = d[3] + 1295307597 + (d[2] >>> 0 < s[2] >>> 0 ? 1 : 0) | 0, d[4] = d[4] + 3545052371 + (d[3] >>> 0 < s[3] >>> 0 ? 1 : 0) | 0, d[5] = d[5] + 886263092 + (d[4] >>> 0 < s[4] >>> 0 ? 1 : 0) | 0, d[6] = d[6] + 1295307597 + (d[5] >>> 0 < s[5] >>> 0 ? 1 : 0) | 0, d[7] = d[7] + 3545052371 + (d[6] >>> 0 < s[6] >>> 0 ? 1 : 0) | 0, this._b = d[7] >>> 0 < s[7] >>> 0 ? 1 : 0;
                for (var f = 0; f < 8; f++) {
                    var h = u[f] + d[f],
                        g = h & 65535,
                        v = h >>> 16,
                        x = ((g * g >>> 17) + g * v >>> 15) + v * v,
                        p = ((h & 4294901760) * h | 0) + ((h & 65535) * h | 0);
                    a[f] = x ^ p
                }
                u[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, u[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, u[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, u[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, u[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, u[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, u[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, u[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0
            }
            t.Rabbit = r._createHelper(c)
        }(), e.Rabbit
    })
});
var wp = Q((fs, Ep) => {
    "use strict";
    (function(e, t, n) {
        typeof fs == "object" ? Ep.exports = fs = t(K(), Mt(), Tt(), gt(), me()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], t) : t(e.CryptoJS)
    })(fs, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.StreamCipher,
                o = t.algo,
                i = [],
                s = [],
                a = [],
                c = o.RabbitLegacy = r.extend({
                    _doReset: function() {
                        var u = this._key.words,
                            d = this.cfg.iv,
                            f = this._X = [u[0], u[3] << 16 | u[2] >>> 16, u[1], u[0] << 16 | u[3] >>> 16, u[2], u[1] << 16 | u[0] >>> 16, u[3], u[2] << 16 | u[1] >>> 16],
                            h = this._C = [u[2] << 16 | u[2] >>> 16, u[0] & 4294901760 | u[1] & 65535, u[3] << 16 | u[3] >>> 16, u[1] & 4294901760 | u[2] & 65535, u[0] << 16 | u[0] >>> 16, u[2] & 4294901760 | u[3] & 65535, u[1] << 16 | u[1] >>> 16, u[3] & 4294901760 | u[0] & 65535];
                        this._b = 0;
                        for (var g = 0; g < 4; g++) l.call(this);
                        for (var g = 0; g < 8; g++) h[g] ^= f[g + 4 & 7];
                        if (d) {
                            var v = d.words,
                                x = v[0],
                                p = v[1],
                                m = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360,
                                D = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360,
                                y = m >>> 16 | D & 4294901760,
                                C = D << 16 | m & 65535;
                            h[0] ^= m, h[1] ^= y, h[2] ^= D, h[3] ^= C, h[4] ^= m, h[5] ^= y, h[6] ^= D, h[7] ^= C;
                            for (var g = 0; g < 4; g++) l.call(this)
                        }
                    },
                    _doProcessBlock: function(u, d) {
                        var f = this._X;
                        l.call(this), i[0] = f[0] ^ f[5] >>> 16 ^ f[3] << 16, i[1] = f[2] ^ f[7] >>> 16 ^ f[5] << 16, i[2] = f[4] ^ f[1] >>> 16 ^ f[7] << 16, i[3] = f[6] ^ f[3] >>> 16 ^ f[1] << 16;
                        for (var h = 0; h < 4; h++) i[h] = (i[h] << 8 | i[h] >>> 24) & 16711935 | (i[h] << 24 | i[h] >>> 8) & 4278255360, u[d + h] ^= i[h]
                    },
                    blockSize: 128 / 32,
                    ivSize: 64 / 32
                });

            function l() {
                for (var u = this._X, d = this._C, f = 0; f < 8; f++) s[f] = d[f];
                d[0] = d[0] + 1295307597 + this._b | 0, d[1] = d[1] + 3545052371 + (d[0] >>> 0 < s[0] >>> 0 ? 1 : 0) | 0, d[2] = d[2] + 886263092 + (d[1] >>> 0 < s[1] >>> 0 ? 1 : 0) | 0, d[3] = d[3] + 1295307597 + (d[2] >>> 0 < s[2] >>> 0 ? 1 : 0) | 0, d[4] = d[4] + 3545052371 + (d[3] >>> 0 < s[3] >>> 0 ? 1 : 0) | 0, d[5] = d[5] + 886263092 + (d[4] >>> 0 < s[4] >>> 0 ? 1 : 0) | 0, d[6] = d[6] + 1295307597 + (d[5] >>> 0 < s[5] >>> 0 ? 1 : 0) | 0, d[7] = d[7] + 3545052371 + (d[6] >>> 0 < s[6] >>> 0 ? 1 : 0) | 0, this._b = d[7] >>> 0 < s[7] >>> 0 ? 1 : 0;
                for (var f = 0; f < 8; f++) {
                    var h = u[f] + d[f],
                        g = h & 65535,
                        v = h >>> 16,
                        x = ((g * g >>> 17) + g * v >>> 15) + v * v,
                        p = ((h & 4294901760) * h | 0) + ((h & 65535) * h | 0);
                    a[f] = x ^ p
                }
                u[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, u[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, u[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, u[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, u[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, u[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, u[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, u[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0
            }
            t.RabbitLegacy = r._createHelper(c)
        }(), e.RabbitLegacy
    })
});
var Ip = Q((hs, bp) => {
    "use strict";
    (function(e, t, n) {
        typeof hs == "object" ? bp.exports = hs = t(K(), Mt(), Tt(), gt(), me()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], t) : t(e.CryptoJS)
    })(hs, function(e) {
        return function() {
            var t = e,
                n = t.lib,
                r = n.BlockCipher,
                o = t.algo;
            let i = 16,
                s = [608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731],
                a = [
                    [3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946],
                    [1266315497, 3048417604, 3681880366, 3289982499, 290971e4, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055],
                    [3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504],
                    [976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409e3, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462]
                ];
            var c = {
                pbox: [],
                sbox: []
            };

            function l(g, v) {
                let x = v >> 24 & 255,
                    p = v >> 16 & 255,
                    m = v >> 8 & 255,
                    D = v & 255,
                    y = g.sbox[0][x] + g.sbox[1][p];
                return y = y ^ g.sbox[2][m], y = y + g.sbox[3][D], y
            }

            function u(g, v, x) {
                let p = v,
                    m = x,
                    D;
                for (let y = 0; y < i; ++y) p = p ^ g.pbox[y], m = l(g, p) ^ m, D = p, p = m, m = D;
                return D = p, p = m, m = D, m = m ^ g.pbox[i], p = p ^ g.pbox[i + 1], {
                    left: p,
                    right: m
                }
            }

            function d(g, v, x) {
                let p = v,
                    m = x,
                    D;
                for (let y = i + 1; y > 1; --y) p = p ^ g.pbox[y], m = l(g, p) ^ m, D = p, p = m, m = D;
                return D = p, p = m, m = D, m = m ^ g.pbox[1], p = p ^ g.pbox[0], {
                    left: p,
                    right: m
                }
            }

            function f(g, v, x) {
                for (let C = 0; C < 4; C++) {
                    g.sbox[C] = [];
                    for (let E = 0; E < 256; E++) g.sbox[C][E] = a[C][E]
                }
                let p = 0;
                for (let C = 0; C < i + 2; C++) g.pbox[C] = s[C] ^ v[p], p++, p >= x && (p = 0);
                let m = 0,
                    D = 0,
                    y = 0;
                for (let C = 0; C < i + 2; C += 2) y = u(g, m, D), m = y.left, D = y.right, g.pbox[C] = m, g.pbox[C + 1] = D;
                for (let C = 0; C < 4; C++)
                    for (let E = 0; E < 256; E += 2) y = u(g, m, D), m = y.left, D = y.right, g.sbox[C][E] = m, g.sbox[C][E + 1] = D;
                return !0
            }
            var h = o.Blowfish = r.extend({
                _doReset: function() {
                    if (this._keyPriorReset !== this._key) {
                        var g = this._keyPriorReset = this._key,
                            v = g.words,
                            x = g.sigBytes / 4;
                        f(c, v, x)
                    }
                },
                encryptBlock: function(g, v) {
                    var x = u(c, g[v], g[v + 1]);
                    g[v] = x.left, g[v + 1] = x.right
                },
                decryptBlock: function(g, v) {
                    var x = d(c, g[v], g[v + 1]);
                    g[v] = x.left, g[v + 1] = x.right
                },
                blockSize: 64 / 32,
                keySize: 128 / 32,
                ivSize: 64 / 32
            });
            t.Blowfish = r._createHelper(h)
        }(), e.Blowfish
    })
});
var Sp = Q((ps, _p) => {
    "use strict";
    (function(e, t, n) {
        typeof ps == "object" ? _p.exports = ps = t(K(), jr(), w0(), I0(), Mt(), A0(), Tt(), fu(), Vi(), F0(), hu(), P0(), L0(), V0(), Gi(), U0(), gt(), me(), G0(), Y0(), K0(), J0(), tp(), rp(), ip(), ap(), up(), dp(), hp(), gp(), vp(), yp(), Cp(), wp(), Ip()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./enc-base64url", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy", "./blowfish"], t) : e.CryptoJS = t(e.CryptoJS)
    })(ps, function(e) {
        return e
    })
});

function Qp(e, t) {
    return Object.is(e, t)
}
var he = null,
    Ur = !1,
    ys = 1,
    tn = Symbol("SIGNAL");

function re(e) {
    let t = he;
    return he = e, t
}

function Nu() {
    return he
}
var zr = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    kind: "unknown",
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {}
};

function Ru(e) {
    if (Ur) throw new Error("");
    if (he === null) return;
    he.consumerOnSignalRead(e);
    let t = he.nextProducerIndex++;
    if (Wr(he), t < he.producerNode.length && he.producerNode[t] !== e && Qn(he)) {
        let n = he.producerNode[t];
        qr(n, he.producerIndexOfThis[t])
    }
    he.producerNode[t] !== e && (he.producerNode[t] = e, he.producerIndexOfThis[t] = Qn(he) ? Ou(e, he, t) : 0), he.producerLastReadVersion[t] = e.version
}

function Kp() {
    ys++
}

function Xp(e) {
    if (!(Qn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === ys)) {
        if (!e.producerMustRecompute(e) && !Cs(e)) {
            Tu(e);
            return
        }
        e.producerRecomputeValue(e), Tu(e)
    }
}

function Fu(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = Ur;
    Ur = !0;
    try {
        for (let n of e.liveConsumerNode) n.dirty || eg(n)
    } finally {
        Ur = t
    }
}

function Jp() {
    return he?.consumerAllowSignalWrites !== !1
}

function eg(e) {
    e.dirty = !0, Fu(e), e.consumerMarkedDirty?.(e)
}

function Tu(e) {
    e.dirty = !1, e.lastCleanEpoch = ys
}

function Ds(e) {
    return e && (e.nextProducerIndex = 0), re(e)
}

function ku(e, t) {
    if (re(t), !(!e || e.producerNode === void 0 || e.producerIndexOfThis === void 0 || e.producerLastReadVersion === void 0)) {
        if (Qn(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++) qr(e.producerNode[n], e.producerIndexOfThis[n]);
        for (; e.producerNode.length > e.nextProducerIndex;) e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop()
    }
}

function Cs(e) {
    Wr(e);
    for (let t = 0; t < e.producerNode.length; t++) {
        let n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
        if (r !== n.version || (Xp(n), r !== n.version)) return !0
    }
    return !1
}

function Es(e) {
    if (Wr(e), Qn(e))
        for (let t = 0; t < e.producerNode.length; t++) qr(e.producerNode[t], e.producerIndexOfThis[t]);
    e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0, e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}

function Ou(e, t, n) {
    if (Pu(e), e.liveConsumerNode.length === 0 && Bu(e))
        for (let r = 0; r < e.producerNode.length; r++) e.producerIndexOfThis[r] = Ou(e.producerNode[r], e, r);
    return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1
}

function qr(e, t) {
    if (Pu(e), e.liveConsumerNode.length === 1 && Bu(e))
        for (let r = 0; r < e.producerNode.length; r++) qr(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (e.liveConsumerNode[t] = e.liveConsumerNode[n], e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n], e.liveConsumerNode.length--, e.liveConsumerIndexOfThis.length--, t < e.liveConsumerNode.length) {
        let r = e.liveConsumerIndexOfThis[t],
            o = e.liveConsumerNode[t];
        Wr(o), o.producerIndexOfThis[r] = t
    }
}

function Qn(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}

function Wr(e) {
    e.producerNode ??= [], e.producerIndexOfThis ??= [], e.producerLastReadVersion ??= []
}

function Pu(e) {
    e.liveConsumerNode ??= [], e.liveConsumerIndexOfThis ??= []
}

function Bu(e) {
    return e.producerNode !== void 0
}

function tg() {
    throw new Error
}
var Lu = tg;

function ng(e) {
    Lu(e)
}

function ju(e) {
    Lu = e
}
var rg = null;

function Vu(e, t) {
    Jp() || ng(e), e.equal(e.value, t) || (e.value = t, og(e))
}
var Hu = le(P({}, zr), {
    equal: Qp,
    value: void 0,
    kind: "signal"
});

function og(e) {
    e.version++, Kp(), Fu(e), rg?.()
}
var ws;

function Kn() {
    return ws
}

function at(e) {
    let t = ws;
    return ws = e, t
}
var bs = Symbol("NotFound");

function H(e) {
    return typeof e == "function"
}

function nn(e) {
    let n = e(r => {
        Error.call(r), r.stack = new Error().stack
    });
    return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n
}
var Gr = nn(e => function(n) {
    e(this), this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((r,o)=>`${o+1}) ${r.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = n
});

function Xn(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1)
    }
}
var fe = class e {
    constructor(t) {
        this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let {
                _parentage: n
            } = this;
            if (n)
                if (this._parentage = null, Array.isArray(n))
                    for (let i of n) i.remove(this);
                else n.remove(this);
            let {
                initialTeardown: r
            } = this;
            if (H(r)) try {
                r()
            } catch (i) {
                t = i instanceof Gr ? i.errors : [i]
            }
            let {
                _finalizers: o
            } = this;
            if (o) {
                this._finalizers = null;
                for (let i of o) try {
                    $u(i)
                } catch (s) {
                    t = t ?? [], s instanceof Gr ? t = [...t, ...s.errors] : t.push(s)
                }
            }
            if (t) throw new Gr(t)
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed) $u(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this)) return;
                    t._addParent(this)
                }(this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
            }
    }
    _hasParent(t) {
        let {
            _parentage: n
        } = this;
        return n === t || Array.isArray(n) && n.includes(t)
    }
    _addParent(t) {
        let {
            _parentage: n
        } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t
    }
    _removeParent(t) {
        let {
            _parentage: n
        } = this;
        n === t ? this._parentage = null : Array.isArray(n) && Xn(n, t)
    }
    remove(t) {
        let {
            _finalizers: n
        } = this;
        n && Xn(n, t), t instanceof e && t._removeParent(this)
    }
};
fe.EMPTY = (() => {
    let e = new fe;
    return e.closed = !0, e
})();
var Is = fe.EMPTY;

function Zr(e) {
    return e instanceof fe || e && "closed" in e && H(e.remove) && H(e.add) && H(e.unsubscribe)
}

function $u(e) {
    H(e) ? e() : e.unsubscribe()
}
var We = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var rn = {
    setTimeout(e, t, ...n) {
        let {
            delegate: r
        } = rn;
        return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
    },
    clearTimeout(e) {
        let {
            delegate: t
        } = rn;
        return (t?.clearTimeout || clearTimeout)(e)
    },
    delegate: void 0
};

function Yr(e) {
    rn.setTimeout(() => {
        let {
            onUnhandledError: t
        } = We;
        if (t) t(e);
        else throw e
    })
}

function Jn() {}
var Uu = _s("C", void 0, void 0);

function zu(e) {
    return _s("E", void 0, e)
}

function qu(e) {
    return _s("N", e, void 0)
}

function _s(e, t, n) {
    return {
        kind: e,
        value: t,
        error: n
    }
}
var Nt = null;

function on(e) {
    if (We.useDeprecatedSynchronousErrorHandling) {
        let t = !Nt;
        if (t && (Nt = {
                errorThrown: !1,
                error: null
            }), e(), t) {
            let {
                errorThrown: n,
                error: r
            } = Nt;
            if (Nt = null, n) throw r
        }
    } else e()
}

function Wu(e) {
    We.useDeprecatedSynchronousErrorHandling && Nt && (Nt.errorThrown = !0, Nt.error = e)
}
var Rt = class extends fe {
        constructor(t) {
            super(), this.isStopped = !1, t ? (this.destination = t, Zr(t) && t.add(this)) : this.destination = ag
        }
        static create(t, n, r) {
            return new sn(t, n, r)
        }
        next(t) {
            this.isStopped ? As(qu(t), this) : this._next(t)
        }
        error(t) {
            this.isStopped ? As(zu(t), this) : (this.isStopped = !0, this._error(t))
        }
        complete() {
            this.isStopped ? As(Uu, this) : (this.isStopped = !0, this._complete())
        }
        unsubscribe() {
            this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
        }
        _next(t) {
            this.destination.next(t)
        }
        _error(t) {
            try {
                this.destination.error(t)
            } finally {
                this.unsubscribe()
            }
        }
        _complete() {
            try {
                this.destination.complete()
            } finally {
                this.unsubscribe()
            }
        }
    },
    ig = Function.prototype.bind;

function Ss(e, t) {
    return ig.call(e, t)
}
var Ms = class {
        constructor(t) {
            this.partialObserver = t
        }
        next(t) {
            let {
                partialObserver: n
            } = this;
            if (n.next) try {
                n.next(t)
            } catch (r) {
                Qr(r)
            }
        }
        error(t) {
            let {
                partialObserver: n
            } = this;
            if (n.error) try {
                n.error(t)
            } catch (r) {
                Qr(r)
            } else Qr(t)
        }
        complete() {
            let {
                partialObserver: t
            } = this;
            if (t.complete) try {
                t.complete()
            } catch (n) {
                Qr(n)
            }
        }
    },
    sn = class extends Rt {
        constructor(t, n, r) {
            super();
            let o;
            if (H(t) || !t) o = {
                next: t ?? void 0,
                error: n ?? void 0,
                complete: r ?? void 0
            };
            else {
                let i;
                this && We.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = {
                    next: t.next && Ss(t.next, i),
                    error: t.error && Ss(t.error, i),
                    complete: t.complete && Ss(t.complete, i)
                }) : o = t
            }
            this.destination = new Ms(o)
        }
    };

function Qr(e) {
    We.useDeprecatedSynchronousErrorHandling ? Wu(e) : Yr(e)
}

function sg(e) {
    throw e
}

function As(e, t) {
    let {
        onStoppedNotification: n
    } = We;
    n && rn.setTimeout(() => n(e, t))
}
var ag = {
    closed: !0,
    next: Jn,
    error: sg,
    complete: Jn
};
var an = typeof Symbol == "function" && Symbol.observable || "@@observable";

function Re(e) {
    return e
}

function Ts(...e) {
    return Ns(e)
}

function Ns(e) {
    return e.length === 0 ? Re : e.length === 1 ? e[0] : function(n) {
        return e.reduce((r, o) => o(r), n)
    }
}
var se = (() => {
    class e {
        constructor(n) {
            n && (this._subscribe = n)
        }
        lift(n) {
            let r = new e;
            return r.source = this, r.operator = n, r
        }
        subscribe(n, r, o) {
            let i = ug(n) ? n : new sn(n, r, o);
            return on(() => {
                let {
                    operator: s,
                    source: a
                } = this;
                i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i))
            }), i
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (r) {
                n.error(r)
            }
        }
        forEach(n, r) {
            return r = Gu(r), new r((o, i) => {
                let s = new sn({
                    next: a => {
                        try {
                            n(a)
                        } catch (c) {
                            i(c), s.unsubscribe()
                        }
                    },
                    error: i,
                    complete: o
                });
                this.subscribe(s)
            })
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)
        } [an]() {
            return this
        }
        pipe(...n) {
            return Ns(n)(this)
        }
        toPromise(n) {
            return n = Gu(n), new n((r, o) => {
                let i;
                this.subscribe(s => i = s, s => o(s), () => r(i))
            })
        }
    }
    return e.create = t => new e(t), e
})();

function Gu(e) {
    var t;
    return (t = e ?? We.Promise) !== null && t !== void 0 ? t : Promise
}

function cg(e) {
    return e && H(e.next) && H(e.error) && H(e.complete)
}

function ug(e) {
    return e && e instanceof Rt || cg(e) && Zr(e)
}

function Rs(e) {
    return H(e?.lift)
}

function ee(e) {
    return t => {
        if (Rs(t)) return t.lift(function(n) {
            try {
                return e(n, this)
            } catch (r) {
                this.error(r)
            }
        });
        throw new TypeError("Unable to lift unknown Observable type")
    }
}

function te(e, t, n, r, o) {
    return new Fs(e, t, n, r, o)
}
var Fs = class extends Rt {
    constructor(t, n, r, o, i, s) {
        super(t), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = n ? function(a) {
            try {
                n(a)
            } catch (c) {
                t.error(c)
            }
        } : super._next, this._error = o ? function(a) {
            try {
                o(a)
            } catch (c) {
                t.error(c)
            } finally {
                this.unsubscribe()
            }
        } : super._error, this._complete = r ? function() {
            try {
                r()
            } catch (a) {
                t.error(a)
            } finally {
                this.unsubscribe()
            }
        } : super._complete
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let {
                closed: n
            } = this;
            super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
        }
    }
};

function cn() {
    return ee((e, t) => {
        let n = null;
        e._refCount++;
        let r = te(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                n = null;
                return
            }
            let o = e._connection,
                i = n;
            n = null, o && (!i || o === i) && o.unsubscribe(), t.unsubscribe()
        });
        e.subscribe(r), r.closed || (n = e.connect())
    })
}
var un = class extends se {
    constructor(t, n) {
        super(), this.source = t, this.subjectFactory = n, this._subject = null, this._refCount = 0, this._connection = null, Rs(t) && (this.lift = t.lift)
    }
    _subscribe(t) {
        return this.getSubject().subscribe(t)
    }
    getSubject() {
        let t = this._subject;
        return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject
    }
    _teardown() {
        this._refCount = 0;
        let {
            _connection: t
        } = this;
        this._subject = this._connection = null, t?.unsubscribe()
    }
    connect() {
        let t = this._connection;
        if (!t) {
            t = this._connection = new fe;
            let n = this.getSubject();
            t.add(this.source.subscribe(te(n, void 0, () => {
                this._teardown(), n.complete()
            }, r => {
                this._teardown(), n.error(r)
            }, () => this._teardown()))), t.closed && (this._connection = null, t = fe.EMPTY)
        }
        return t
    }
    refCount() {
        return cn()(this)
    }
};
var Zu = nn(e => function() {
    e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
});
var Ee = (() => {
        class e extends se {
            constructor() {
                super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
            }
            lift(n) {
                let r = new Kr(this, this);
                return r.operator = n, r
            }
            _throwIfClosed() {
                if (this.closed) throw new Zu
            }
            next(n) {
                on(() => {
                    if (this._throwIfClosed(), !this.isStopped) {
                        this.currentObservers || (this.currentObservers = Array.from(this.observers));
                        for (let r of this.currentObservers) r.next(n)
                    }
                })
            }
            error(n) {
                on(() => {
                    if (this._throwIfClosed(), !this.isStopped) {
                        this.hasError = this.isStopped = !0, this.thrownError = n;
                        let {
                            observers: r
                        } = this;
                        for (; r.length;) r.shift().error(n)
                    }
                })
            }
            complete() {
                on(() => {
                    if (this._throwIfClosed(), !this.isStopped) {
                        this.isStopped = !0;
                        let {
                            observers: n
                        } = this;
                        for (; n.length;) n.shift().complete()
                    }
                })
            }
            unsubscribe() {
                this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
            }
            get observed() {
                var n;
                return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0
            }
            _trySubscribe(n) {
                return this._throwIfClosed(), super._trySubscribe(n)
            }
            _subscribe(n) {
                return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n)
            }
            _innerSubscribe(n) {
                let {
                    hasError: r,
                    isStopped: o,
                    observers: i
                } = this;
                return r || o ? Is : (this.currentObservers = null, i.push(n), new fe(() => {
                    this.currentObservers = null, Xn(i, n)
                }))
            }
            _checkFinalizedStatuses(n) {
                let {
                    hasError: r,
                    thrownError: o,
                    isStopped: i
                } = this;
                r ? n.error(o) : i && n.complete()
            }
            asObservable() {
                let n = new se;
                return n.source = this, n
            }
        }
        return e.create = (t, n) => new Kr(t, n), e
    })(),
    Kr = class extends Ee {
        constructor(t, n) {
            super(), this.destination = t, this.source = n
        }
        next(t) {
            var n, r;
            (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t)
        }
        error(t) {
            var n, r;
            (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t)
        }
        complete() {
            var t, n;
            (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t)
        }
        _subscribe(t) {
            var n, r;
            return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : Is
        }
    };
var xe = class extends Ee {
    constructor(t) {
        super(), this._value = t
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value), n
    }
    getValue() {
        let {
            hasError: t,
            thrownError: n,
            _value: r
        } = this;
        if (t) throw n;
        return this._throwIfClosed(), r
    }
    next(t) {
        super.next(this._value = t)
    }
};
var _e = new se(e => e.complete());

function Yu(e) {
    return e && H(e.schedule)
}

function Qu(e) {
    return e[e.length - 1]
}

function Ku(e) {
    return H(Qu(e)) ? e.pop() : void 0
}

function xt(e) {
    return Yu(Qu(e)) ? e.pop() : void 0
}

function Ju(e, t, n, r) {
    function o(i) {
        return i instanceof n ? i : new n(function(s) {
            s(i)
        })
    }
    return new(n || (n = Promise))(function(i, s) {
        function a(u) {
            try {
                l(r.next(u))
            } catch (d) {
                s(d)
            }
        }

        function c(u) {
            try {
                l(r.throw(u))
            } catch (d) {
                s(d)
            }
        }

        function l(u) {
            u.done ? i(u.value) : o(u.value).then(a, c)
        }
        l((r = r.apply(e, t || [])).next())
    })
}

function Xu(e) {
    var t = typeof Symbol == "function" && Symbol.iterator,
        n = t && e[t],
        r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number") return {
        next: function() {
            return e && r >= e.length && (e = void 0), {
                value: e && e[r++],
                done: !e
            }
        }
    };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
}

function Ft(e) {
    return this instanceof Ft ? (this.v = e, this) : new Ft(e)
}

function el(e, t, n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []),
        o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", s), o[Symbol.asyncIterator] = function() {
        return this
    }, o;

    function s(h) {
        return function(g) {
            return Promise.resolve(g).then(h, d)
        }
    }

    function a(h, g) {
        r[h] && (o[h] = function(v) {
            return new Promise(function(x, p) {
                i.push([h, v, x, p]) > 1 || c(h, v)
            })
        }, g && (o[h] = g(o[h])))
    }

    function c(h, g) {
        try {
            l(r[h](g))
        } catch (v) {
            f(i[0][3], v)
        }
    }

    function l(h) {
        h.value instanceof Ft ? Promise.resolve(h.value.v).then(u, d) : f(i[0][2], h)
    }

    function u(h) {
        c("next", h)
    }

    function d(h) {
        c("throw", h)
    }

    function f(h, g) {
        h(g), i.shift(), i.length && c(i[0][0], i[0][1])
    }
}

function tl(e) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator],
        n;
    return t ? t.call(e) : (e = typeof Xu == "function" ? Xu(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
        return this
    }, n);

    function r(i) {
        n[i] = e[i] && function(s) {
            return new Promise(function(a, c) {
                s = e[i](s), o(a, c, s.done, s.value)
            })
        }
    }

    function o(i, s, a, c) {
        Promise.resolve(c).then(function(l) {
            i({
                value: l,
                done: a
            })
        }, s)
    }
}
var Xr = e => e && typeof e.length == "number" && typeof e != "function";

function Jr(e) {
    return H(e?.then)
}

function eo(e) {
    return H(e[an])
}

function to(e) {
    return Symbol.asyncIterator && H(e?.[Symbol.asyncIterator])
}

function no(e) {
    return new TypeError(`You provided ${e!==null&&typeof e=="object"?"an invalid object":`'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
}

function lg() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}
var ro = lg();

function oo(e) {
    return H(e?.[ro])
}

function io(e) {
    return el(this, arguments, function*() {
        let n = e.getReader();
        try {
            for (;;) {
                let {
                    value: r,
                    done: o
                } = yield Ft(n.read());
                if (o) return yield Ft(void 0);
                yield yield Ft(r)
            }
        } finally {
            n.releaseLock()
        }
    })
}

function so(e) {
    return H(e?.getReader)
}

function ve(e) {
    if (e instanceof se) return e;
    if (e != null) {
        if (eo(e)) return dg(e);
        if (Xr(e)) return fg(e);
        if (Jr(e)) return hg(e);
        if (to(e)) return nl(e);
        if (oo(e)) return pg(e);
        if (so(e)) return gg(e)
    }
    throw no(e)
}

function dg(e) {
    return new se(t => {
        let n = e[an]();
        if (H(n.subscribe)) return n.subscribe(t);
        throw new TypeError("Provided object does not correctly implement Symbol.observable")
    })
}

function fg(e) {
    return new se(t => {
        for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
        t.complete()
    })
}

function hg(e) {
    return new se(t => {
        e.then(n => {
            t.closed || (t.next(n), t.complete())
        }, n => t.error(n)).then(null, Yr)
    })
}

function pg(e) {
    return new se(t => {
        for (let n of e)
            if (t.next(n), t.closed) return;
        t.complete()
    })
}

function nl(e) {
    return new se(t => {
        mg(e, t).catch(n => t.error(n))
    })
}

function gg(e) {
    return nl(io(e))
}

function mg(e, t) {
    var n, r, o, i;
    return Ju(this, void 0, void 0, function*() {
        try {
            for (n = tl(e); r = yield n.next(), !r.done;) {
                let s = r.value;
                if (t.next(s), t.closed) return
            }
        } catch (s) {
            o = {
                error: s
            }
        } finally {
            try {
                r && !r.done && (i = n.return) && (yield i.call(n))
            } finally {
                if (o) throw o.error
            }
        }
        t.complete()
    })
}

function Se(e, t, n, r = 0, o = !1) {
    let i = t.schedule(function() {
        n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe()
    }, r);
    if (e.add(i), !o) return i
}

function ao(e, t = 0) {
    return ee((n, r) => {
        n.subscribe(te(r, o => Se(r, e, () => r.next(o), t), () => Se(r, e, () => r.complete(), t), o => Se(r, e, () => r.error(o), t)))
    })
}

function co(e, t = 0) {
    return ee((n, r) => {
        r.add(e.schedule(() => n.subscribe(r), t))
    })
}

function rl(e, t) {
    return ve(e).pipe(co(t), ao(t))
}

function ol(e, t) {
    return ve(e).pipe(co(t), ao(t))
}

function il(e, t) {
    return new se(n => {
        let r = 0;
        return t.schedule(function() {
            r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule())
        })
    })
}

function sl(e, t) {
    return new se(n => {
        let r;
        return Se(n, t, () => {
            r = e[ro](), Se(n, t, () => {
                let o, i;
                try {
                    ({
                        value: o,
                        done: i
                    } = r.next())
                } catch (s) {
                    n.error(s);
                    return
                }
                i ? n.complete() : n.next(o)
            }, 0, !0)
        }), () => H(r?.return) && r.return()
    })
}

function uo(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new se(n => {
        Se(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            Se(n, t, () => {
                r.next().then(o => {
                    o.done ? n.complete() : n.next(o.value)
                })
            }, 0, !0)
        })
    })
}

function al(e, t) {
    return uo(io(e), t)
}

function cl(e, t) {
    if (e != null) {
        if (eo(e)) return rl(e, t);
        if (Xr(e)) return il(e, t);
        if (Jr(e)) return ol(e, t);
        if (to(e)) return uo(e, t);
        if (oo(e)) return sl(e, t);
        if (so(e)) return al(e, t)
    }
    throw no(e)
}

function pe(e, t) {
    return t ? cl(e, t) : ve(e)
}

function U(...e) {
    let t = xt(e);
    return pe(e, t)
}

function ln(e, t) {
    let n = H(e) ? e : () => e,
        r = o => o.error(n());
    return new se(t ? o => t.schedule(r, 0, o) : r)
}

function ks(e) {
    return !!e && (e instanceof se || H(e.lift) && H(e.subscribe))
}
var ct = nn(e => function() {
    e(this), this.name = "EmptyError", this.message = "no elements in sequence"
});

function ne(e, t) {
    return ee((n, r) => {
        let o = 0;
        n.subscribe(te(r, i => {
            r.next(e.call(t, i, o++))
        }))
    })
}
var {
    isArray: vg
} = Array;

function xg(e, t) {
    return vg(t) ? e(...t) : e(t)
}

function ul(e) {
    return ne(t => xg(e, t))
}
var {
    isArray: yg
} = Array, {
    getPrototypeOf: Dg,
    prototype: Cg,
    keys: Eg
} = Object;

function ll(e) {
    if (e.length === 1) {
        let t = e[0];
        if (yg(t)) return {
            args: t,
            keys: null
        };
        if (wg(t)) {
            let n = Eg(t);
            return {
                args: n.map(r => t[r]),
                keys: n
            }
        }
    }
    return {
        args: e,
        keys: null
    }
}

function wg(e) {
    return e && typeof e == "object" && Dg(e) === Cg
}

function dl(e, t) {
    return e.reduce((n, r, o) => (n[r] = t[o], n), {})
}

function lo(...e) {
    let t = xt(e),
        n = Ku(e),
        {
            args: r,
            keys: o
        } = ll(e);
    if (r.length === 0) return pe([], t);
    let i = new se(bg(r, t, o ? s => dl(o, s) : Re));
    return n ? i.pipe(ul(n)) : i
}

function bg(e, t, n = Re) {
    return r => {
        fl(t, () => {
            let {
                length: o
            } = e, i = new Array(o), s = o, a = o;
            for (let c = 0; c < o; c++) fl(t, () => {
                let l = pe(e[c], t),
                    u = !1;
                l.subscribe(te(r, d => {
                    i[c] = d, u || (u = !0, a--), a || r.next(n(i.slice()))
                }, () => {
                    --s || r.complete()
                }))
            }, r)
        }, r)
    }
}

function fl(e, t, n) {
    e ? Se(n, e, t) : t()
}

function hl(e, t, n, r, o, i, s, a) {
    let c = [],
        l = 0,
        u = 0,
        d = !1,
        f = () => {
            d && !c.length && !l && t.complete()
        },
        h = v => l < r ? g(v) : c.push(v),
        g = v => {
            i && t.next(v), l++;
            let x = !1;
            ve(n(v, u++)).subscribe(te(t, p => {
                o?.(p), i ? h(p) : t.next(p)
            }, () => {
                x = !0
            }, void 0, () => {
                if (x) try {
                    for (l--; c.length && l < r;) {
                        let p = c.shift();
                        s ? Se(t, s, () => g(p)) : g(p)
                    }
                    f()
                } catch (p) {
                    t.error(p)
                }
            }))
        };
    return e.subscribe(te(t, h, () => {
        d = !0, f()
    })), () => {
        a?.()
    }
}

function ge(e, t, n = 1 / 0) {
    return H(t) ? ge((r, o) => ne((i, s) => t(r, i, o, s))(ve(e(r, o))), n) : (typeof t == "number" && (n = t), ee((r, o) => hl(r, o, e, n)))
}

function Os(e = 1 / 0) {
    return ge(Re, e)
}

function pl() {
    return Os(1)
}

function dn(...e) {
    return pl()(pe(e, xt(e)))
}

function fo(e) {
    return new se(t => {
        ve(e()).subscribe(t)
    })
}

function Ge(e, t) {
    return ee((n, r) => {
        let o = 0;
        n.subscribe(te(r, i => e.call(t, i, o++) && r.next(i)))
    })
}

function yt(e) {
    return ee((t, n) => {
        let r = null,
            o = !1,
            i;
        r = t.subscribe(te(n, void 0, void 0, s => {
            i = ve(e(s, yt(e)(t))), r ? (r.unsubscribe(), r = null, i.subscribe(n)) : o = !0
        })), o && (r.unsubscribe(), r = null, i.subscribe(n))
    })
}

function gl(e, t, n, r, o) {
    return (i, s) => {
        let a = n,
            c = t,
            l = 0;
        i.subscribe(te(s, u => {
            let d = l++;
            c = a ? e(c, u, d) : (a = !0, u), r && s.next(c)
        }, o && (() => {
            a && s.next(c), s.complete()
        })))
    }
}

function fn(e, t) {
    return H(t) ? ge(e, t, 1) : ge(e, 1)
}

function Dt(e) {
    return ee((t, n) => {
        let r = !1;
        t.subscribe(te(n, o => {
            r = !0, n.next(o)
        }, () => {
            r || n.next(e), n.complete()
        }))
    })
}

function ut(e) {
    return e <= 0 ? () => _e : ee((t, n) => {
        let r = 0;
        t.subscribe(te(n, o => {
            ++r <= e && (n.next(o), e <= r && n.complete())
        }))
    })
}

function ho(e = Ig) {
    return ee((t, n) => {
        let r = !1;
        t.subscribe(te(n, o => {
            r = !0, n.next(o)
        }, () => r ? n.complete() : n.error(e())))
    })
}

function Ig() {
    return new ct
}

function er(e) {
    return ee((t, n) => {
        try {
            t.subscribe(n)
        } finally {
            n.add(e)
        }
    })
}

function lt(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? Ge((o, i) => e(o, i, r)) : Re, ut(1), n ? Dt(t) : ho(() => new ct))
}

function hn(e) {
    return e <= 0 ? () => _e : ee((t, n) => {
        let r = [];
        t.subscribe(te(n, o => {
            r.push(o), e < r.length && r.shift()
        }, () => {
            for (let o of r) n.next(o);
            n.complete()
        }, void 0, () => {
            r = null
        }))
    })
}

function Ps(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? Ge((o, i) => e(o, i, r)) : Re, hn(1), n ? Dt(t) : ho(() => new ct))
}

function Bs(e, t) {
    return ee(gl(e, t, arguments.length >= 2, !0))
}

function Ls(...e) {
    let t = xt(e);
    return ee((n, r) => {
        (t ? dn(e, n, t) : dn(e, n)).subscribe(r)
    })
}

function Ze(e, t) {
    return ee((n, r) => {
        let o = null,
            i = 0,
            s = !1,
            a = () => s && !o && r.complete();
        n.subscribe(te(r, c => {
            o?.unsubscribe();
            let l = 0,
                u = i++;
            ve(e(c, u)).subscribe(o = te(r, d => r.next(t ? t(c, d, u, l++) : d), () => {
                o = null, a()
            }))
        }, () => {
            s = !0, a()
        }))
    })
}

function js(e) {
    return ee((t, n) => {
        ve(e).subscribe(te(n, () => n.complete(), Jn)), !n.closed && t.subscribe(n)
    })
}

function ye(e, t, n) {
    let r = H(e) || t || n ? {
        next: e,
        error: t,
        complete: n
    } : e;
    return r ? ee((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(te(i, c => {
            var l;
            (l = r.next) === null || l === void 0 || l.call(r, c), i.next(c)
        }, () => {
            var c;
            a = !1, (c = r.complete) === null || c === void 0 || c.call(r), i.complete()
        }, c => {
            var l;
            a = !1, (l = r.error) === null || l === void 0 || l.call(r, c), i.error(c)
        }, () => {
            var c, l;
            a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)), (l = r.finalize) === null || l === void 0 || l.call(r)
        }))
    }) : Re
}
var L = class extends Error {
    code;
    constructor(t, n) {
        super(Ta(t, n)), this.code = t
    }
};

function Ta(e, t) {
    return `${`NG0${Math.abs(e)}`}${t?": "+t:""}`
}
var Kl = Symbol("InputSignalNode#UNSET"),
    Sg = le(P({}, Hu), {
        transformFn: void 0,
        applyValueToInputSignal(e, t) {
            Vu(e, t)
        }
    });

function Xl(e, t) {
    let n = Object.create(Sg);
    n.value = e, n.transformFn = t?.transform;

    function r() {
        if (Ru(n), n.value === Kl) throw new L(-950, !1);
        return n.value
    }
    return r[tn] = n, r
}

function Na(e) {
    return {
        toString: e
    }.toString()
}

function ae(e) {
    for (let t in e)
        if (e[t] === ae) return t;
    throw Error("Could not find renamed property on target object.")
}

function ke(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return `[${e.map(ke).join(", ")}]`;
    if (e == null) return "" + e;
    let t = e.overriddenName || e.name;
    if (t) return `${t}`;
    let n = e.toString();
    if (n == null) return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n
}

function ml(e, t) {
    return e ? t ? `${e} ${t}` : e : t || ""
}
var Ag = ae({
    __forward_ref__: ae
});

function Jl(e) {
    return e.__forward_ref__ = Jl, e.toString = function() {
        return ke(this())
    }, e
}

function we(e) {
    return ed(e) ? e() : e
}

function ed(e) {
    return typeof e == "function" && e.hasOwnProperty(Ag) && e.__forward_ref__ === Jl
}

function V(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0
    }
}

function Uo(e) {
    return vl(e, nd) || vl(e, rd)
}

function td(e) {
    return Uo(e) !== null
}

function vl(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null
}

function Mg(e) {
    let t = e && (e[nd] || e[rd]);
    return t || null
}

function xl(e) {
    return e && (e.hasOwnProperty(yl) || e.hasOwnProperty(Tg)) ? e[yl] : null
}
var nd = ae({
        \u0275prov: ae
    }),
    yl = ae({
        \u0275inj: ae
    }),
    rd = ae({
        ngInjectableDef: ae
    }),
    Tg = ae({
        ngInjectorDef: ae
    }),
    $ = class {
        _desc;
        ngMetadataName = "InjectionToken";
        \u0275prov;
        constructor(t, n) {
            this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = V({
                token: this,
                providedIn: n.providedIn || "root",
                factory: n.factory
            }))
        }
        get multi() {
            return this
        }
        toString() {
            return `InjectionToken ${this._desc}`
        }
    };

function od(e) {
    return e && !!e.\u0275providers
}
var Ng = ae({
        \u0275cmp: ae
    }),
    Rg = ae({
        \u0275dir: ae
    }),
    Fg = ae({
        \u0275pipe: ae
    }),
    kg = ae({
        \u0275mod: ae
    }),
    yo = ae({
        \u0275fac: ae
    }),
    or = ae({
        __NG_ELEMENT_ID__: ae
    }),
    Dl = ae({
        __NG_ENV_ID__: ae
    });

function Og(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e)
}

function Pg(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : Og(e)
}

function id(e, t) {
    throw new L(-200, e)
}

function Ra(e, t) {
    throw new L(-201, !1)
}
var G = function(e) {
        return e[e.Default = 0] = "Default", e[e.Host = 1] = "Host", e[e.Self = 2] = "Self", e[e.SkipSelf = 4] = "SkipSelf", e[e.Optional = 8] = "Optional", e
    }(G || {}),
    Qs;

function sd() {
    return Qs
}

function je(e) {
    let t = Qs;
    return Qs = e, t
}

function ad(e, t, n) {
    let r = Uo(e);
    if (r && r.providedIn == "root") return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & G.Optional) return null;
    if (t !== void 0) return t;
    Ra(e, "Injector")
}
var Bg = {},
    kt = Bg,
    Lg = "__NG_DI_FLAG__",
    Do = class {
        injector;
        constructor(t) {
            this.injector = t
        }
        retrieve(t, n) {
            let r = n;
            return this.injector.get(t, r.optional ? bs : kt, r)
        }
    },
    Co = "ngTempTokenPath",
    jg = "ngTokenPath",
    Vg = /\n/gm,
    Hg = "\u0275",
    Cl = "__source";

function $g(e, t = G.Default) {
    if (Kn() === void 0) throw new L(-203, !1);
    if (Kn() === null) return ad(e, void 0, t);
    {
        let n = Kn(),
            r;
        return n instanceof Do ? r = n.injector : r = n, r.get(e, t & G.Optional ? null : void 0, t)
    }
}

function Z(e, t = G.Default) {
    return (sd() || $g)(we(e), t)
}

function F(e, t = G.Default) {
    return Z(e, zo(t))
}

function zo(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}

function Ks(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = we(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0) throw new L(900, !1);
            let o, i = G.Default;
            for (let s = 0; s < r.length; s++) {
                let a = r[s],
                    c = Ug(a);
                typeof c == "number" ? c === -1 ? o = a.token : i |= c : o = a
            }
            t.push(Z(o, i))
        } else t.push(Z(r))
    }
    return t
}

function Ug(e) {
    return e[Lg]
}

function zg(e, t, n, r) {
    let o = e[Co];
    throw t[Cl] && o.unshift(t[Cl]), e.message = qg(`
` + e.message, o, n, r), e[jg] = o, e[Co] = null, e
}

function qg(e, t, n, r = null) {
    e = e && e.charAt(0) === `
` && e.charAt(1) == Hg ? e.slice(2) : e;
    let o = ke(t);
    if (Array.isArray(t)) o = t.map(ke).join(" -> ");
    else if (typeof t == "object") {
        let i = [];
        for (let s in t)
            if (t.hasOwnProperty(s)) {
                let a = t[s];
                i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ke(a)))
            } o = `{${i.join(", ")}}`
    }
    return `${n}${r?"("+r+")":""}[${o}]: ${e.replace(Vg,`
  `)}`
}

function xn(e, t) {
    let n = e.hasOwnProperty(yo);
    return n ? e[yo] : null
}

function Fa(e, t) {
    e.forEach(n => Array.isArray(n) ? Fa(n, t) : t(n))
}

function cd(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n)
}

function Eo(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
var yn = {},
    Dn = [],
    Cn = new $(""),
    ud = new $("", -1),
    ld = new $(""),
    wo = class {
        get(t, n = kt) {
            if (n === kt) {
                let r = new Error(`NullInjectorError: No provider for ${ke(t)}!`);
                throw r.name = "NullInjectorError", r
            }
            return n
        }
    };

function dd(e, t) {
    let n = e[kg] || null;
    if (!n && t === !0) throw new Error(`Type ${ke(e)} does not have '\u0275mod' property.`);
    return n
}

function En(e) {
    return e[Ng] || null
}

function Wg(e) {
    return e[Rg] || null
}

function Gg(e) {
    return e[Fg] || null
}

function qo(e) {
    return {
        \u0275providers: e
    }
}

function Zg(...e) {
    return {
        \u0275providers: fd(!0, e),
        \u0275fromNgModule: !0
    }
}

function fd(e, ...t) {
    let n = [],
        r = new Set,
        o, i = s => {
            n.push(s)
        };
    return Fa(t, s => {
        let a = s;
        Xs(a, i, [], r) && (o ||= [], o.push(a))
    }), o !== void 0 && hd(o, i), n
}

function hd(e, t) {
    for (let n = 0; n < e.length; n++) {
        let {
            ngModule: r,
            providers: o
        } = e[n];
        ka(o, i => {
            t(i, r)
        })
    }
}

function Xs(e, t, n, r) {
    if (e = we(e), !e) return !1;
    let o = null,
        i = xl(e),
        s = !i && En(e);
    if (!i && !s) {
        let c = e.ngModule;
        if (i = xl(c), i) o = c;
        else return !1
    } else {
        if (s && !s.standalone) return !1;
        o = e
    }
    let a = r.has(o);
    if (s) {
        if (a) return !1;
        if (r.add(o), s.dependencies) {
            let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let l of c) Xs(l, t, n, r)
        }
    } else if (i) {
        if (i.imports != null && !a) {
            r.add(o);
            let l;
            try {
                Fa(i.imports, u => {
                    Xs(u, t, n, r) && (l ||= [], l.push(u))
                })
            } finally {}
            l !== void 0 && hd(l, t)
        }
        if (!a) {
            let l = xn(o) || (() => new o);
            t({
                provide: o,
                useFactory: l,
                deps: Dn
            }, o), t({
                provide: ld,
                useValue: o,
                multi: !0
            }, o), t({
                provide: Cn,
                useValue: () => Z(o),
                multi: !0
            }, o)
        }
        let c = i.providers;
        if (c != null && !a) {
            let l = e;
            ka(c, u => {
                t(u, l)
            })
        }
    } else return !1;
    return o !== e && e.providers !== void 0
}

function ka(e, t) {
    for (let n of e) od(n) && (n = n.\u0275providers), Array.isArray(n) ? ka(n, t) : t(n)
}
var Yg = ae({
    provide: String,
    useValue: ae
});

function pd(e) {
    return e !== null && typeof e == "object" && Yg in e
}

function Qg(e) {
    return !!(e && e.useExisting)
}

function Kg(e) {
    return !!(e && e.useFactory)
}

function wn(e) {
    return typeof e == "function"
}

function Xg(e) {
    return !!e.useClass
}
var Wo = new $(""),
    po = {},
    El = {},
    Vs;

function Oa() {
    return Vs === void 0 && (Vs = new wo), Vs
}
var He = class {},
    ir = class extends He {
        parent;
        source;
        scopes;
        records = new Map;
        _ngOnDestroyHooks = new Set;
        _onDestroyHooks = [];
        get destroyed() {
            return this._destroyed
        }
        _destroyed = !1;
        injectorDefTypes;
        constructor(t, n, r, o) {
            super(), this.parent = n, this.source = r, this.scopes = o, ea(t, s => this.processProvider(s)), this.records.set(ud, pn(void 0, this)), o.has("environment") && this.records.set(He, pn(void 0, this));
            let i = this.records.get(Wo);
            i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(ld, Dn, G.Self))
        }
        retrieve(t, n) {
            let r = n;
            return this.get(t, r.optional ? bs : kt, r)
        }
        destroy() {
            nr(this), this._destroyed = !0;
            let t = re(null);
            try {
                for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
                let n = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of n) r()
            } finally {
                this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), re(t)
            }
        }
        onDestroy(t) {
            return nr(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
        }
        runInContext(t) {
            nr(this);
            let n = at(this),
                r = je(void 0),
                o;
            try {
                return t()
            } finally {
                at(n), je(r)
            }
        }
        get(t, n = kt, r = G.Default) {
            if (nr(this), t.hasOwnProperty(Dl)) return t[Dl](this);
            r = zo(r);
            let o, i = at(this),
                s = je(void 0);
            try {
                if (!(r & G.SkipSelf)) {
                    let c = this.records.get(t);
                    if (c === void 0) {
                        let l = rm(t) && Uo(t);
                        l && this.injectableDefInScope(l) ? c = pn(Js(t), po) : c = null, this.records.set(t, c)
                    }
                    if (c != null) return this.hydrate(t, c)
                }
                let a = r & G.Self ? Oa() : this.parent;
                return n = r & G.Optional && n === kt ? null : n, a.get(t, n)
            } catch (a) {
                if (a.name === "NullInjectorError") {
                    if ((a[Co] = a[Co] || []).unshift(ke(t)), i) throw a;
                    return zg(a, t, "R3InjectorError", this.source)
                } else throw a
            } finally {
                je(s), at(i)
            }
        }
        resolveInjectorInitializers() {
            let t = re(null),
                n = at(this),
                r = je(void 0),
                o;
            try {
                let i = this.get(Cn, Dn, G.Self);
                for (let s of i) s()
            } finally {
                at(n), je(r), re(t)
            }
        }
        toString() {
            let t = [],
                n = this.records;
            for (let r of n.keys()) t.push(ke(r));
            return `R3Injector[${t.join(", ")}]`
        }
        processProvider(t) {
            t = we(t);
            let n = wn(t) ? t : we(t && t.provide),
                r = em(t);
            if (!wn(t) && t.multi === !0) {
                let o = this.records.get(n);
                o || (o = pn(void 0, po, !0), o.factory = () => Ks(o.multi), this.records.set(n, o)), n = t, o.multi.push(t)
            }
            this.records.set(n, r)
        }
        hydrate(t, n) {
            let r = re(null);
            try {
                return n.value === El ? id(ke(t)) : n.value === po && (n.value = El, n.value = n.factory()), typeof n.value == "object" && n.value && nm(n.value) && this._ngOnDestroyHooks.add(n.value), n.value
            } finally {
                re(r)
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn) return !1;
            let n = we(t.providedIn);
            return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
        }
        removeOnDestroy(t) {
            let n = this._onDestroyHooks.indexOf(t);
            n !== -1 && this._onDestroyHooks.splice(n, 1)
        }
    };

function Js(e) {
    let t = Uo(e),
        n = t !== null ? t.factory : xn(e);
    if (n !== null) return n;
    if (e instanceof $) throw new L(204, !1);
    if (e instanceof Function) return Jg(e);
    throw new L(204, !1)
}

function Jg(e) {
    if (e.length > 0) throw new L(204, !1);
    let n = Mg(e);
    return n !== null ? () => n.factory(e) : () => new e
}

function em(e) {
    if (pd(e)) return pn(void 0, e.useValue);
    {
        let t = gd(e);
        return pn(t, po)
    }
}

function gd(e, t, n) {
    let r;
    if (wn(e)) {
        let o = we(e);
        return xn(o) || Js(o)
    } else if (pd(e)) r = () => we(e.useValue);
    else if (Kg(e)) r = () => e.useFactory(...Ks(e.deps || []));
    else if (Qg(e)) r = () => Z(we(e.useExisting));
    else {
        let o = we(e && (e.useClass || e.provide));
        if (tm(e)) r = () => new o(...Ks(e.deps));
        else return xn(o) || Js(o)
    }
    return r
}

function nr(e) {
    if (e.destroyed) throw new L(205, !1)
}

function pn(e, t, n = !1) {
    return {
        factory: e,
        value: t,
        multi: n ? [] : void 0
    }
}

function tm(e) {
    return !!e.deps
}

function nm(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
}

function rm(e) {
    return typeof e == "function" || typeof e == "object" && e instanceof $
}

function ea(e, t) {
    for (let n of e) Array.isArray(n) ? ea(n, t) : n && od(n) ? ea(n.\u0275providers, t) : t(n)
}

function Je(e, t) {
    let n;
    e instanceof ir ? (nr(e), n = e) : n = new Do(e);
    let r, o = at(n),
        i = je(void 0);
    try {
        return t()
    } finally {
        at(o), je(i)
    }
}

function om() {
    return sd() !== void 0 || Kn() != null
}

function im(e) {
    return typeof e == "function"
}
var dt = 0,
    J = 1,
    W = 2,
    be = 3,
    Qe = 4,
    et = 5,
    bo = 6,
    wl = 7,
    $e = 8,
    sr = 9,
    Et = 10,
    Ke = 11,
    ar = 12,
    bl = 13,
    lr = 14,
    rt = 15,
    bn = 16,
    gn = 17,
    In = 18,
    Go = 19,
    md = 20,
    Ct = 21,
    Hs = 22,
    Io = 23,
    Ve = 24,
    $s = 25,
    Xe = 26,
    vd = 1;
var Bt = 7,
    _o = 8,
    So = 9,
    Oe = 10;

function Ot(e) {
    return Array.isArray(e) && typeof e[vd] == "object"
}

function ft(e) {
    return Array.isArray(e) && e[vd] === !0
}

function xd(e) {
    return (e.flags & 4) !== 0
}

function Zo(e) {
    return e.componentOffset > -1
}

function yd(e) {
    return (e.flags & 1) === 1
}

function _t(e) {
    return !!e.template
}

function Ao(e) {
    return (e[W] & 512) !== 0
}

function dr(e) {
    return (e[W] & 256) === 256
}
var ta = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
        this.previousValue = t, this.currentValue = n, this.firstChange = r
    }
    isFirstChange() {
        return this.firstChange
    }
};

function Dd(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r
}
var Pa = (() => {
    let e = () => Cd;
    return e.ngInherit = !0, e
})();

function Cd(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = am), sm
}

function sm() {
    let e = wd(this),
        t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === yn) e.previous = t;
        else
            for (let r in t) n[r] = t[r];
        e.current = null, this.ngOnChanges(t)
    }
}

function am(e, t, n, r, o) {
    let i = this.declaredInputs[r],
        s = wd(e) || cm(e, {
            previous: yn,
            current: null
        }),
        a = s.current || (s.current = {}),
        c = s.previous,
        l = c[i];
    a[i] = new ta(l && l.currentValue, n, c === yn), Dd(e, t, o, n)
}
var Ed = "__ngSimpleChanges__";

function wd(e) {
    return e[Ed] || null
}

function cm(e, t) {
    return e[Ed] = t
}
var Il = null;
var de = function(e, t = null, n) {
        Il?.(e, t, n)
    },
    um = "svg",
    lm = "math";

function wt(e) {
    for (; Array.isArray(e);) e = e[dt];
    return e
}

function $t(e, t) {
    return wt(t[e.index])
}

function bd(e, t) {
    return e.data[t]
}

function Lt(e, t) {
    let n = t[e];
    return Ot(n) ? n : n[dt]
}

function Ba(e) {
    return (e[W] & 128) === 128
}

function dm(e) {
    return ft(e[be])
}

function Mo(e, t) {
    return t == null ? null : e[t]
}

function Id(e) {
    e[gn] = 0
}

function _d(e) {
    e[W] & 1024 || (e[W] |= 1024, Ba(e) && Qo(e))
}

function Yo(e) {
    return !!(e[W] & 9216 || e[Ve]?.dirty)
}

function na(e) {
    e[Et].changeDetectionScheduler?.notify(8), e[W] & 64 && (e[W] |= 1024), Yo(e) && Qo(e)
}

function Qo(e) {
    e[Et].changeDetectionScheduler?.notify(0);
    let t = jt(e);
    for (; t !== null && !(t[W] & 8192 || (t[W] |= 8192, !Ba(t)));) t = jt(t)
}

function Sd(e, t) {
    if (dr(e)) throw new L(911, !1);
    e[Ct] === null && (e[Ct] = []), e[Ct].push(t)
}

function fm(e, t) {
    if (e[Ct] === null) return;
    let n = e[Ct].indexOf(t);
    n !== -1 && e[Ct].splice(n, 1)
}

function jt(e) {
    let t = e[be];
    return ft(t) ? t[be] : t
}
var ie = {
    lFrame: Od(null),
    bindingsEnabled: !0,
    skipHydrationRootTNode: null
};
var ra = !1;

function hm() {
    return ie.lFrame.elementDepthCount
}

function pm() {
    ie.lFrame.elementDepthCount++
}

function gm() {
    ie.lFrame.elementDepthCount--
}

function Ad() {
    return ie.bindingsEnabled
}

function mm() {
    return ie.skipHydrationRootTNode !== null
}

function vm(e) {
    return ie.skipHydrationRootTNode === e
}

function xm() {
    ie.skipHydrationRootTNode = null
}

function Ae() {
    return ie.lFrame.lView
}

function Ut() {
    return ie.lFrame.tView
}

function St() {
    let e = Md();
    for (; e !== null && e.type === 64;) e = e.parent;
    return e
}

function Md() {
    return ie.lFrame.currentTNode
}

function ym() {
    let e = ie.lFrame,
        t = e.currentTNode;
    return e.isParent ? t : t.parent
}

function fr(e, t) {
    let n = ie.lFrame;
    n.currentTNode = e, n.isParent = t
}

function Td() {
    return ie.lFrame.isParent
}

function Dm() {
    ie.lFrame.isParent = !1
}

function Nd() {
    return ra
}

function _l(e) {
    let t = ra;
    return ra = e, t
}

function Cm(e) {
    return ie.lFrame.bindingIndex = e
}

function Em() {
    return ie.lFrame.bindingIndex++
}

function wm() {
    return ie.lFrame.inI18n
}

function bm(e, t) {
    let n = ie.lFrame;
    n.bindingIndex = n.bindingRootIndex = e, oa(t)
}

function Im() {
    return ie.lFrame.currentDirectiveIndex
}

function oa(e) {
    ie.lFrame.currentDirectiveIndex = e
}

function Rd(e) {
    ie.lFrame.currentQueryIndex = e
}

function _m(e) {
    let t = e[J];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[et] : null
}

function Fd(e, t, n) {
    if (n & G.SkipSelf) {
        let o = t,
            i = e;
        for (; o = o.parent, o === null && !(n & G.Host);)
            if (o = _m(i), o === null || (i = i[lr], o.type & 10)) break;
        if (o === null) return !1;
        t = o, e = i
    }
    let r = ie.lFrame = kd();
    return r.currentTNode = t, r.lView = e, !0
}

function La(e) {
    let t = kd(),
        n = e[J];
    ie.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1
}

function kd() {
    let e = ie.lFrame,
        t = e === null ? null : e.child;
    return t === null ? Od(e) : t
}

function Od(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1
    };
    return e !== null && (e.child = t), t
}

function Pd() {
    let e = ie.lFrame;
    return ie.lFrame = e.parent, e.currentTNode = null, e.lView = null, e
}
var Bd = Pd;

function ja() {
    let e = Pd();
    e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0
}

function Ld() {
    return ie.lFrame.selectedIndex
}

function Vt(e) {
    ie.lFrame.selectedIndex = e
}

function Sm() {
    return ie.lFrame.currentNamespace
}
var jd = !0;

function Va() {
    return jd
}

function Ha(e) {
    jd = e
}

function Am(e, t, n) {
    let {
        ngOnChanges: r,
        ngOnInit: o,
        ngDoCheck: i
    } = t.type.prototype;
    if (r) {
        let s = Cd(t);
        (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s)
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i))
}

function Vd(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype,
            {
                ngAfterContentInit: s,
                ngAfterContentChecked: a,
                ngAfterViewInit: c,
                ngAfterViewChecked: l,
                ngOnDestroy: u
            } = i;
        s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), c && (e.viewHooks ??= []).push(-n, c), l && ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)), u != null && (e.destroyHooks ??= []).push(n, u)
    }
}

function go(e, t, n) {
    Hd(e, t, 3, n)
}

function mo(e, t, n, r) {
    (e[W] & 3) === n && Hd(e, t, n, r)
}

function Us(e, t) {
    let n = e[W];
    (n & 3) === t && (n &= 16383, n += 1, e[W] = n)
}

function Hd(e, t, n, r) {
    let o = r !== void 0 ? e[gn] & 65535 : 0,
        i = r ?? -1,
        s = t.length - 1,
        a = 0;
    for (let c = o; c < s; c++)
        if (typeof t[c + 1] == "number") {
            if (a = t[c], r != null && a >= r) break
        } else t[c] < 0 && (e[gn] += 65536), (a < i || i == -1) && (Mm(e, n, t, c), e[gn] = (e[gn] & 4294901760) + c + 2), c++
}

function Sl(e, t) {
    de(4, e, t);
    let n = re(null);
    try {
        t.call(e)
    } finally {
        re(n), de(5, e, t)
    }
}

function Mm(e, t, n, r) {
    let o = n[r] < 0,
        i = n[r + 1],
        s = o ? -n[r] : n[r],
        a = e[s];
    o ? e[W] >> 14 < e[gn] >> 16 && (e[W] & 3) === t && (e[W] += 16384, Sl(a, i)) : Sl(a, i)
}
var vn = -1,
    Ht = class {
        factory;
        injectImpl;
        resolving = !1;
        canSeeViewProviders;
        multi;
        componentProviders;
        index;
        providerFactory;
        constructor(t, n, r) {
            this.factory = t, this.canSeeViewProviders = n, this.injectImpl = r
        }
    };

function Tm(e) {
    return (e.flags & 8) !== 0
}

function Nm(e) {
    return (e.flags & 16) !== 0
}

function Rm(e, t, n) {
    let r = 0;
    for (; r < n.length;) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0) break;
            r++;
            let i = n[r++],
                s = n[r++],
                a = n[r++];
            e.setAttribute(t, s, a, i)
        } else {
            let i = o,
                s = n[++r];
            km(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++
        }
    }
    return r
}

function Fm(e) {
    return e === 3 || e === 4 || e === 6
}

function km(e) {
    return e.charCodeAt(0) === 64
}

function $a(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0) e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? Al(e, n, o, null, t[++r]) : Al(e, n, o, null, null))
            }
        } return e
}

function Al(e, t, n, r, o) {
    let i = 0,
        s = e.length;
    if (t === -1) s = -1;
    else
        for (; i < e.length;) {
            let a = e[i++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break
                } else if (a > t) {
                    s = i - 1;
                    break
                }
            }
        }
    for (; i < e.length;) {
        let a = e[i];
        if (typeof a == "number") break;
        if (a === n) {
            o !== null && (e[i + 1] = o);
            return
        }
        i++, o !== null && i++
    }
    s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), o !== null && e.splice(i++, 0, o)
}
var zs = {},
    ia = class {
        injector;
        parentInjector;
        constructor(t, n) {
            this.injector = t, this.parentInjector = n
        }
        get(t, n, r) {
            r = zo(r);
            let o = this.injector.get(t, zs, r);
            return o !== zs || n === zs ? o : this.parentInjector.get(t, n, r)
        }
    };

function $d(e) {
    return e !== vn
}

function To(e) {
    return e & 32767
}

function Om(e) {
    return e >> 16
}

function No(e, t) {
    let n = Om(e),
        r = t;
    for (; n > 0;) r = r[lr], n--;
    return r
}
var sa = !0;

function Ml(e) {
    let t = sa;
    return sa = e, t
}
var Pm = 256,
    Ud = Pm - 1,
    zd = 5,
    Bm = 0,
    nt = {};

function Lm(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(or) && (r = n[or]), r == null && (r = n[or] = Bm++);
    let o = r & Ud,
        i = 1 << o;
    t.data[e + (o >> zd)] |= i
}

function Ro(e, t) {
    let n = qd(e, t);
    if (n !== -1) return n;
    let r = t[J];
    r.firstCreatePass && (e.injectorIndex = t.length, qs(r.data, e), qs(t, null), qs(r.blueprint, null));
    let o = Ua(e, t),
        i = e.injectorIndex;
    if ($d(o)) {
        let s = To(o),
            a = No(o, t),
            c = a[J].data;
        for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l]
    }
    return t[i + 8] = o, i
}

function qs(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}

function qd(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex
}

function Ua(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
    let n = 0,
        r = null,
        o = t;
    for (; o !== null;) {
        if (r = Qd(o), r === null) return vn;
        if (n++, o = o[lr], r.injectorIndex !== -1) return r.injectorIndex | n << 16
    }
    return vn
}

function aa(e, t, n) {
    Lm(e, t, n)
}

function Wd(e, t, n) {
    if (n & G.Optional || e !== void 0) return e;
    Ra(t, "NodeInjector")
}

function Gd(e, t, n, r) {
    if (n & G.Optional && r === void 0 && (r = null), (n & (G.Self | G.Host)) === 0) {
        let o = e[sr],
            i = je(void 0);
        try {
            return o ? o.get(t, r, n & G.Optional) : ad(t, r, n & G.Optional)
        } finally {
            je(i)
        }
    }
    return Wd(r, t, n)
}

function Zd(e, t, n, r = G.Default, o) {
    if (e !== null) {
        if (t[W] & 2048 && !(r & G.Self)) {
            let s = Um(e, t, n, r, nt);
            if (s !== nt) return s
        }
        let i = Yd(e, t, n, r, nt);
        if (i !== nt) return i
    }
    return Gd(t, n, r, o)
}

function Yd(e, t, n, r, o) {
    let i = Hm(n);
    if (typeof i == "function") {
        if (!Fd(t, e, r)) return r & G.Host ? Wd(o, n, r) : Gd(t, n, r, o);
        try {
            let s;
            if (s = i(r), s == null && !(r & G.Optional)) Ra(n);
            else return s
        } finally {
            Bd()
        }
    } else if (typeof i == "number") {
        let s = null,
            a = qd(e, t),
            c = vn,
            l = r & G.Host ? t[rt][et] : null;
        for ((a === -1 || r & G.SkipSelf) && (c = a === -1 ? Ua(e, t) : t[a + 8], c === vn || !Nl(r, !1) ? a = -1 : (s = t[J], a = To(c), t = No(c, t))); a !== -1;) {
            let u = t[J];
            if (Tl(i, a, u.data)) {
                let d = jm(a, t, n, s, r, l);
                if (d !== nt) return d
            }
            c = t[a + 8], c !== vn && Nl(r, t[J].data[a + 8] === l) && Tl(i, a, t) ? (s = u, a = To(c), t = No(c, t)) : a = -1
        }
    }
    return o
}

function jm(e, t, n, r, o, i) {
    let s = t[J],
        a = s.data[e + 8],
        c = r == null ? Zo(a) && sa : r != s && (a.type & 3) !== 0,
        l = o & G.Host && i === a,
        u = Vm(a, s, n, c, l);
    return u !== null ? Fo(t, s, u, a) : nt
}

function Vm(e, t, n, r, o) {
    let i = e.providerIndexes,
        s = t.data,
        a = i & 1048575,
        c = e.directiveStart,
        l = e.directiveEnd,
        u = i >> 20,
        d = r ? a : a + u,
        f = o ? a + u : l;
    for (let h = d; h < f; h++) {
        let g = s[h];
        if (h < c && n === g || h >= c && g.type === n) return h
    }
    if (o) {
        let h = s[c];
        if (h && _t(h) && h.type === n) return c
    }
    return null
}

function Fo(e, t, n, r) {
    let o = e[n],
        i = t.data;
    if (o instanceof Ht) {
        let s = o;
        s.resolving && id(Pg(i[n]));
        let a = Ml(s.canSeeViewProviders);
        s.resolving = !0;
        let c, l = s.injectImpl ? je(s.injectImpl) : null,
            u = Fd(e, r, G.Default);
        try {
            o = e[n] = s.factory(void 0, i, e, r), t.firstCreatePass && n >= r.directiveStart && Am(n, i[n], t)
        } finally {
            l !== null && je(l), Ml(a), s.resolving = !1, Bd()
        }
    }
    return o
}

function Hm(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(or) ? e[or] : void 0;
    return typeof t == "number" ? t >= 0 ? t & Ud : $m : t
}

function Tl(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> zd)] & r)
}

function Nl(e, t) {
    return !(e & G.Self) && !(e & G.Host && t)
}
var Pt = class {
    _tNode;
    _lView;
    constructor(t, n) {
        this._tNode = t, this._lView = n
    }
    get(t, n, r) {
        return Zd(this._tNode, this._lView, t, zo(r), n)
    }
};

function $m() {
    return new Pt(St(), Ae())
}

function za(e) {
    return Na(() => {
        let t = e.prototype.constructor,
            n = t[yo] || ca(t),
            r = Object.prototype,
            o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r;) {
            let i = o[yo] || ca(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o)
        }
        return i => new i
    })
}

function ca(e) {
    return ed(e) ? () => {
        let t = ca(we(e));
        return t && t()
    } : xn(e)
}

function Um(e, t, n, r, o) {
    let i = e,
        s = t;
    for (; i !== null && s !== null && s[W] & 2048 && !Ao(s);) {
        let a = Yd(i, s, n, r | G.Self, nt);
        if (a !== nt) return a;
        let c = i.parent;
        if (!c) {
            let l = s[md];
            if (l) {
                let u = l.get(n, nt, r);
                if (u !== nt) return u
            }
            c = Qd(s), s = s[lr]
        }
        i = c
    }
    return o
}

function Qd(e) {
    let t = e[J],
        n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[et] : null
}

function Rl(e, t = null, n = null, r) {
    let o = Kd(e, t, n, r);
    return o.resolveInjectorInitializers(), o
}

function Kd(e, t = null, n = null, r, o = new Set) {
    let i = [n || Dn, Zg(e)];
    return r = r || (typeof e == "object" ? void 0 : ke(e)), new ir(i, t || Oa(), r || null, o)
}
var ot = class e {
    static THROW_IF_NOT_FOUND = kt;
    static NULL = new wo;
    static create(t, n) {
        if (Array.isArray(t)) return Rl({
            name: ""
        }, n, t, "");
        {
            let r = t.name ?? "";
            return Rl({
                name: r
            }, t.parent, t.providers, r)
        }
    }
    static \u0275prov = V({
        token: e,
        providedIn: "any",
        factory: () => Z(ud)
    });
    static __NG_ELEMENT_ID__ = -1
};
var zm = new $("");
zm.__NG_ELEMENT_ID__ = e => {
    let t = St();
    if (t === null) throw new L(204, !1);
    if (t.type & 2) return t.value;
    if (e & G.Optional) return null;
    throw new L(204, !1)
};
var Xd = !1,
    Ko = (() => {
        class e {
            static __NG_ELEMENT_ID__ = qm;
            static __NG_ENV_ID__ = n => n
        }
        return e
    })(),
    ua = class extends Ko {
        _lView;
        constructor(t) {
            super(), this._lView = t
        }
        onDestroy(t) {
            return Sd(this._lView, t), () => fm(this._lView, t)
        }
    };

function qm() {
    return new ua(Ae())
}
var cr = class {},
    Xo = new $("", {
        providedIn: "root",
        factory: () => !1
    });
var Jd = new $(""),
    ef = new $(""),
    An = (() => {
        class e {
            taskId = 0;
            pendingTasks = new Set;
            get _hasPendingTasks() {
                return this.hasPendingTasks.value
            }
            hasPendingTasks = new xe(!1);
            add() {
                this._hasPendingTasks || this.hasPendingTasks.next(!0);
                let n = this.taskId++;
                return this.pendingTasks.add(n), n
            }
            has(n) {
                return this.pendingTasks.has(n)
            }
            remove(n) {
                this.pendingTasks.delete(n), this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(!1)
            }
            ngOnDestroy() {
                this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(!1)
            }
            static \u0275prov = V({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })();
var la = class extends Ee {
        __isAsync;
        destroyRef = void 0;
        pendingTasks = void 0;
        constructor(t = !1) {
            super(), this.__isAsync = t, om() && (this.destroyRef = F(Ko, {
                optional: !0
            }) ?? void 0, this.pendingTasks = F(An, {
                optional: !0
            }) ?? void 0)
        }
        emit(t) {
            let n = re(null);
            try {
                super.next(t)
            } finally {
                re(n)
            }
        }
        subscribe(t, n, r) {
            let o = t,
                i = n || (() => null),
                s = r;
            if (t && typeof t == "object") {
                let c = t;
                o = c.next?.bind(c), i = c.error?.bind(c), s = c.complete?.bind(c)
            }
            this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s)));
            let a = super.subscribe({
                next: o,
                error: i,
                complete: s
            });
            return t instanceof fe && t.add(a), a
        }
        wrapInTimeout(t) {
            return n => {
                let r = this.pendingTasks?.add();
                setTimeout(() => {
                    t(n), r !== void 0 && this.pendingTasks?.remove(r)
                })
            }
        }
    },
    Fe = la;

function ko(...e) {}

function tf(e) {
    let t, n;

    function r() {
        e = ko;
        try {
            n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t)
        } catch {}
    }
    return t = setTimeout(() => {
        e(), r()
    }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => {
        e(), r()
    })), () => r()
}

function Fl(e) {
    return queueMicrotask(() => e()), () => {
        e = ko
    }
}
var qa = "isAngularZone",
    Oo = qa + "_ID",
    Wm = 0,
    De = class e {
        hasPendingMacrotasks = !1;
        hasPendingMicrotasks = !1;
        isStable = !0;
        onUnstable = new Fe(!1);
        onMicrotaskEmpty = new Fe(!1);
        onStable = new Fe(!1);
        onError = new Fe(!1);
        constructor(t) {
            let {
                enableLongStackTrace: n = !1,
                shouldCoalesceEventChangeDetection: r = !1,
                shouldCoalesceRunChangeDetection: o = !1,
                scheduleInRootZone: i = Xd
            } = t;
            if (typeof Zone > "u") throw new L(908, !1);
            Zone.assertZonePatched();
            let s = this;
            s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = !1, s.scheduleInRootZone = i, Ym(s)
        }
        static isInAngularZone() {
            return typeof Zone < "u" && Zone.current.get(qa) === !0
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new L(909, !1)
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new L(909, !1)
        }
        run(t, n, r) {
            return this._inner.run(t, n, r)
        }
        runTask(t, n, r, o) {
            let i = this._inner,
                s = i.scheduleEventTask("NgZoneEvent: " + o, t, Gm, ko, ko);
            try {
                return i.runTask(s, n, r)
            } finally {
                i.cancelTask(s)
            }
        }
        runGuarded(t, n, r) {
            return this._inner.runGuarded(t, n, r)
        }
        runOutsideAngular(t) {
            return this._outer.run(t)
        }
    },
    Gm = {};

function Wa(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable) try {
        e._nesting++, e.onMicrotaskEmpty.emit(null)
    } finally {
        if (e._nesting--, !e.hasPendingMicrotasks) try {
            e.runOutsideAngular(() => e.onStable.emit(null))
        } finally {
            e.isStable = !0
        }
    }
}

function Zm(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = !0;

    function t() {
        tf(() => {
            e.callbackScheduled = !1, da(e), e.isCheckStableRunning = !0, Wa(e), e.isCheckStableRunning = !1
        })
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
        t()
    }) : e._outer.run(() => {
        t()
    }), da(e)
}

function Ym(e) {
    let t = () => {
            Zm(e)
        },
        n = Wm++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: {
            [qa]: !0,
            [Oo]: n,
            [Oo + n]: !0
        },
        onInvokeTask: (r, o, i, s, a, c) => {
            if (Qm(c)) return r.invokeTask(i, s, a, c);
            try {
                return kl(e), r.invokeTask(i, s, a, c)
            } finally {
                (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), Ol(e)
            }
        },
        onInvoke: (r, o, i, s, a, c, l) => {
            try {
                return kl(e), r.invoke(i, s, a, c, l)
            } finally {
                e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !Km(c) && t(), Ol(e)
            }
        },
        onHasTask: (r, o, i, s) => {
            r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, da(e), Wa(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask))
        },
        onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1)
    })
}

function da(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1
}

function kl(e) {
    e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null))
}

function Ol(e) {
    e._nesting--, Wa(e)
}
var fa = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new Fe;
    onMicrotaskEmpty = new Fe;
    onStable = new Fe;
    onError = new Fe;
    run(t, n, r) {
        return t.apply(n, r)
    }
    runGuarded(t, n, r) {
        return t.apply(n, r)
    }
    runOutsideAngular(t) {
        return t()
    }
    runTask(t, n, r, o) {
        return t.apply(n, r)
    }
};

function Qm(e) {
    return nf(e, "__ignore_ng_zone__")
}

function Km(e) {
    return nf(e, "__scheduler_tick__")
}

function nf(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0
}
var bt = class {
        _console = console;
        handleError(t) {
            this._console.error("ERROR", t)
        }
    },
    Xm = new $("", {
        providedIn: "root",
        factory: () => {
            let e = F(De),
                t = F(bt);
            return n => e.runOutsideAngular(() => t.handleError(n))
        }
    });

function Pl(e, t) {
    return Xl(e, t)
}

function Jm(e) {
    return Xl(Kl, e)
}
var rf = (Pl.required = Jm, Pl);

function ev() {
    return Ga(St(), Ae())
}

function Ga(e, t) {
    return new Jo($t(e, t))
}
var Jo = (() => {
    class e {
        nativeElement;
        constructor(n) {
            this.nativeElement = n
        }
        static __NG_ELEMENT_ID__ = ev
    }
    return e
})();

function of(e) {
    return (e.flags & 128) === 128
}
var sf = function(e) {
        return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e
    }(sf || {}),
    af = new Map,
    tv = 0;

function nv() {
    return tv++
}

function rv(e) {
    af.set(e[Go], e)
}

function ha(e) {
    af.delete(e[Go])
}
var Bl = "__ngContext__";

function hr(e, t) {
    Ot(t) ? (e[Bl] = t[Go], rv(t)) : e[Bl] = t
}

function cf(e) {
    return lf(e[ar])
}

function uf(e) {
    return lf(e[Qe])
}

function lf(e) {
    for (; e !== null && !ft(e);) e = e[Qe];
    return e
}
var pa;

function df(e) {
    pa = e
}

function ov() {
    if (pa !== void 0) return pa;
    if (typeof document < "u") return document;
    throw new L(210, !1)
}
var Za = new $("", {
        providedIn: "root",
        factory: () => iv
    }),
    iv = "ng",
    Ya = new $(""),
    zt = new $("", {
        providedIn: "platform",
        factory: () => "unknown"
    });
var Qa = new $("", {
    providedIn: "root",
    factory: () => ov().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
});
var sv = "h",
    av = "b";
var ff = !1,
    cv = new $("", {
        providedIn: "root",
        factory: () => ff
    });
var hf = function(e) {
        return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e
    }(hf || {}),
    ei = new $(""),
    Ll = new Set;

function ti(e) {
    Ll.has(e) || (Ll.add(e), performance?.mark?.("mark_feature_usage", {
        detail: {
            feature: e
        }
    }))
}
var uv = (() => {
    class e {
        impl = null;
        execute() {
            this.impl?.execute()
        }
        static \u0275prov = V({
            token: e,
            providedIn: "root",
            factory: () => new e
        })
    }
    return e
})();
var lv = () => null;

function pf(e, t, n = !1) {
    return lv(e, t, n)
}

function gf(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = re(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o],
                    s = n[o + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    Rd(i), a.contentQueries(2, t[s], s)
                }
            }
        } finally {
            re(r)
        }
    }
}

function ga(e, t, n) {
    Rd(0);
    let r = re(null);
    try {
        t(e, n)
    } finally {
        re(r)
    }
}

function mf(e, t, n) {
    if (xd(t)) {
        let r = re(null);
        try {
            let o = t.directiveStart,
                i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let c = n[s];
                    a.contentQueries(1, c, s)
                }
            }
        } finally {
            re(r)
        }
    }
}
var it = function(e) {
    return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e
}(it || {});

function vf(e) {
    return e instanceof Function ? e() : e
}

function dv(e, t, n) {
    let r = e.length;
    for (;;) {
        let o = e.indexOf(t, n);
        if (o === -1) return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o
        }
        n = o + 1
    }
}
var xf = "ng-template";

function fv(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && dv(t[o + 1].toLowerCase(), n, 0) !== -1) return !0
    } else if (Ka(e)) return !1;
    if (o = t.indexOf(1, o), o > -1) {
        let i;
        for (; ++o < t.length && typeof(i = t[o]) == "string";)
            if (i.toLowerCase() === n) return !0
    }
    return !1
}

function Ka(e) {
    return e.type === 4 && e.value !== xf
}

function hv(e, t, n) {
    let r = e.type === 4 && !n ? xf : e.value;
    return t === r
}

function pv(e, t, n) {
    let r = 4,
        o = e.attrs,
        i = o !== null ? vv(o) : 0,
        s = !1;
    for (let a = 0; a < t.length; a++) {
        let c = t[a];
        if (typeof c == "number") {
            if (!s && !Ye(r) && !Ye(c)) return !1;
            if (s && Ye(c)) continue;
            s = !1, r = c | r & 1;
            continue
        }
        if (!s)
            if (r & 4) {
                if (r = 2 | r & 1, c !== "" && !hv(e, c, n) || c === "" && t.length === 1) {
                    if (Ye(r)) return !1;
                    s = !0
                }
            } else if (r & 8) {
            if (o === null || !fv(e, o, c, n)) {
                if (Ye(r)) return !1;
                s = !0
            }
        } else {
            let l = t[++a],
                u = gv(c, o, Ka(e), n);
            if (u === -1) {
                if (Ye(r)) return !1;
                s = !0;
                continue
            }
            if (l !== "") {
                let d;
                if (u > i ? d = "" : d = o[u + 1].toLowerCase(), r & 2 && l !== d) {
                    if (Ye(r)) return !1;
                    s = !0
                }
            }
        }
    }
    return Ye(r) || s
}

function Ye(e) {
    return (e & 1) === 0
}

function gv(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length;) {
            let s = t[o];
            if (s === e) return o;
            if (s === 3 || s === 6) i = !0;
            else if (s === 1 || s === 2) {
                let a = t[++o];
                for (; typeof a == "string";) a = t[++o];
                continue
            } else {
                if (s === 4) break;
                if (s === 0) {
                    o += 4;
                    continue
                }
            }
            o += i ? 1 : 2
        }
        return -1
    } else return xv(t, e)
}

function mv(e, t, n = !1) {
    for (let r = 0; r < t.length; r++)
        if (pv(e, t[r], n)) return !0;
    return !1
}

function vv(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (Fm(n)) return t
    }
    return e.length
}

function xv(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length;) {
            let r = e[n];
            if (typeof r == "number") return -1;
            if (r === t) return n;
            n++
        }
    return -1
}

function jl(e, t) {
    return e ? ":not(" + t.trim() + ")" : t
}

function yv(e) {
    let t = e[0],
        n = 1,
        r = 2,
        o = "",
        i = !1;
    for (; n < e.length;) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else r & 8 ? o += "." + s : r & 4 && (o += " " + s);
        else o !== "" && !Ye(s) && (t += jl(i, o), o = ""), r = s, i = i || !Ye(r);
        n++
    }
    return o !== "" && (t += jl(i, o)), t
}

function Dv(e) {
    return e.map(yv).join(",")
}

function Cv(e) {
    let t = [],
        n = [],
        r = 1,
        o = 2;
    for (; r < e.length;) {
        let i = e[r];
        if (typeof i == "string") o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!Ye(o)) break;
            o = i
        }
        r++
    }
    return n.length && t.push(1, ...n), t
}
var Xa = {};

function Ev(e, t) {
    return e.createText(t)
}

function yf(e, t, n) {
    return e.createElement(t, n)
}

function Po(e, t, n, r, o) {
    e.insertBefore(t, n, r, o)
}

function Df(e, t, n) {
    e.appendChild(t, n)
}

function Vl(e, t, n, r, o) {
    r !== null ? Po(e, t, n, r, o) : Df(e, t, n)
}

function wv(e, t, n) {
    e.removeChild(null, t, n)
}

function bv(e, t, n) {
    e.setAttribute(t, "style", n)
}

function Iv(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
}

function Cf(e, t, n) {
    let {
        mergedAttrs: r,
        classes: o,
        styles: i
    } = n;
    r !== null && Rm(e, t, r), o !== null && Iv(e, t, o), i !== null && bv(e, t, i)
}

function Ja(e, t, n, r, o, i, s, a, c, l, u) {
    let d = Xe + r,
        f = d + o,
        h = _v(d, f),
        g = typeof l == "function" ? l() : l;
    return h[J] = {
        type: e,
        blueprint: h,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: h.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: f,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: c,
        consts: g,
        incompleteFirstPass: !1,
        ssrId: u
    }
}

function _v(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : Xa);
    return n
}

function Sv(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = Ja(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
}

function ec(e, t, n, r, o, i, s, a, c, l, u) {
    let d = t.blueprint.slice();
    return d[dt] = o, d[W] = r | 4 | 128 | 8 | 64 | 1024, (l !== null || e && e[W] & 2048) && (d[W] |= 2048), Id(d), d[be] = d[lr] = e, d[$e] = n, d[Et] = s || e && e[Et], d[Ke] = a || e && e[Ke], d[sr] = c || e && e[sr] || null, d[et] = i, d[Go] = nv(), d[bo] = u, d[md] = l, d[rt] = t.type == 2 ? e[rt] : d, d
}

function Av(e, t, n) {
    let r = $t(t, e),
        o = Sv(n),
        i = e[Et].rendererFactory,
        s = tc(e, ec(e, o, null, Ef(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s
}

function Ef(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64), t
}

function wf(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
    return o
}

function tc(e, t) {
    return e[ar] ? e[bl][Qe] = t : e[ar] = t, e[bl] = t, t
}

function bf(e = 1) {
    If(Ut(), Ae(), Ld() + e, !1)
}

function If(e, t, n, r) {
    if (!r)
        if ((t[W] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && go(t, i, n)
        } else {
            let i = e.preOrderHooks;
            i !== null && mo(t, i, 0, n)
        } Vt(n)
}
var ni = function(e) {
    return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e
}(ni || {});

function ma(e, t, n, r) {
    let o = re(null);
    try {
        let [i, s, a] = e.inputs[n], c = null;
        (s & ni.SignalBased) !== 0 && (c = t[i][tn]), c !== null && c.transformFn !== void 0 ? r = c.transformFn(r) : a !== null && (r = a.call(t, r)), e.setInput !== null ? e.setInput(t, c, r, n, i) : Dd(t, c, i, r)
    } finally {
        re(o)
    }
}

function _f(e, t, n, r, o) {
    let i = Ld(),
        s = r & 2;
    try {
        Vt(-1), s && t.length > Xe && If(e, t, Xe, !1), de(s ? 2 : 0, o), n(r, o)
    } finally {
        Vt(i), de(s ? 3 : 1, o)
    }
}

function nc(e, t, n) {
    Rv(e, t, n), (n.flags & 64) === 64 && Fv(e, t, n)
}

function Sf(e, t, n = $t) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1],
                a = s === -1 ? n(t, e) : e[s];
            e[o++] = a
        }
    }
}

function Mv(e, t, n, r) {
    let i = r.get(cv, ff) || n === it.ShadowDom,
        s = e.selectRootElement(t, i);
    return Tv(s), s
}

function Tv(e) {
    Nv(e)
}
var Nv = () => null;

function Rv(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd;
    Zo(n) && Av(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Ro(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
        let a = e.data[s],
            c = Fo(t, e, s, n);
        if (hr(c, t), i !== null && Ov(t, s - r, c, a, n, i), _t(a)) {
            let l = Lt(n.index, t);
            l[$e] = Fo(t, e, s, n)
        }
    }
}

function Fv(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd,
        i = n.index,
        s = Im();
    try {
        Vt(i);
        for (let a = r; a < o; a++) {
            let c = e.data[a],
                l = t[a];
            oa(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && kv(c, l)
        }
    } finally {
        Vt(-1), oa(s)
    }
}

function kv(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}

function Af(e, t) {
    let n = e.directiveRegistry,
        r = null;
    if (n)
        for (let o = 0; o < n.length; o++) {
            let i = n[o];
            mv(t, i.selectors, !1) && (r ??= [], _t(i) ? r.unshift(i) : r.push(i))
        }
    return r
}

function Ov(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let a = 0; a < s.length; a += 2) {
            let c = s[a],
                l = s[a + 1];
            ma(r, n, c, l)
        }
}

function Pv(e, t) {
    let n = e[sr],
        r = n ? n.get(bt, null) : null;
    r && r.handleError(t)
}

function Mf(e, t, n, r, o) {
    let i = e.inputs?.[r],
        s = e.hostDirectiveInputs?.[r],
        a = !1;
    if (s)
        for (let c = 0; c < s.length; c += 2) {
            let l = s[c],
                u = s[c + 1],
                d = t.data[l];
            ma(d, n[l], u, o), a = !0
        }
    if (i)
        for (let c of i) {
            let l = n[c],
                u = t.data[c];
            ma(u, l, r, o), a = !0
        }
    return a
}

function Bv(e, t) {
    let n = Lt(t, e),
        r = n[J];
    Lv(r, n);
    let o = n[dt];
    o !== null && n[bo] === null && (n[bo] = pf(o, n[sr])), de(18), rc(r, n, n[$e]), de(19, n[$e])
}

function Lv(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
}

function rc(e, t, n) {
    La(t);
    try {
        let r = e.viewQuery;
        r !== null && ga(1, r, n);
        let o = e.template;
        o !== null && _f(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), t[In]?.finishViewCreation(e), e.staticContentQueries && gf(e, t), e.staticViewQueries && ga(2, e.viewQuery, n);
        let i = e.components;
        i !== null && jv(t, i)
    } catch (r) {
        throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), r
    } finally {
        t[W] &= -5, ja()
    }
}

function jv(e, t) {
    for (let n = 0; n < t.length; n++) Bv(e, t[n])
}

function Vv(e, t, n, r) {
    let o = re(null);
    try {
        let i = t.tView,
            a = e[W] & 4096 ? 4096 : 16,
            c = ec(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null),
            l = e[t.index];
        c[bn] = l;
        let u = e[In];
        return u !== null && (c[In] = u.createEmbeddedView(i)), rc(i, c, n), c
    } finally {
        re(o)
    }
}

function va(e, t) {
    return !t || t.firstChild === null || of(e)
}
var Hv;

function oc(e, t) {
    return Hv(e, t)
}
var qt = function(e) {
    return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e
}(qt || {});

function Tf(e) {
    return (e.flags & 32) === 32
}

function mn(e, t, n, r, o) {
    if (r != null) {
        let i, s = !1;
        ft(r) ? i = r : Ot(r) && (s = !0, r = r[dt]);
        let a = wt(r);
        e === 0 && n !== null ? o == null ? Df(t, n, a) : Po(t, n, a, o || null, !0) : e === 1 && n !== null ? Po(t, n, a, o || null, !0) : e === 2 ? wv(t, a, s) : e === 3 && t.destroyNode(a), i != null && Jv(t, e, i, n, o)
    }
}

function $v(e, t) {
    Nf(e, t), t[dt] = null, t[et] = null
}

function Uv(e, t, n, r, o, i) {
    r[dt] = o, r[et] = t, ri(e, r, n, 1, o, i)
}

function Nf(e, t) {
    t[Et].changeDetectionScheduler?.notify(9), ri(e, t, t[Ke], 2, null, null)
}

function zv(e) {
    let t = e[ar];
    if (!t) return Ws(e[J], e);
    for (; t;) {
        let n = null;
        if (Ot(t)) n = t[ar];
        else {
            let r = t[Oe];
            r && (n = r)
        }
        if (!n) {
            for (; t && !t[Qe] && t !== e;) Ot(t) && Ws(t[J], t), t = t[be];
            t === null && (t = e), Ot(t) && Ws(t[J], t), n = t && t[Qe]
        }
        t = n
    }
}

function ic(e, t) {
    let n = e[So],
        r = n.indexOf(t);
    n.splice(r, 1)
}

function sc(e, t) {
    if (dr(t)) return;
    let n = t[Ke];
    n.destroyNode && ri(e, t, n, 3, null, null), zv(t)
}

function Ws(e, t) {
    if (dr(t)) return;
    let n = re(null);
    try {
        t[W] &= -129, t[W] |= 256, t[Ve] && Es(t[Ve]), Wv(e, t), qv(e, t), t[J].type === 1 && t[Ke].destroy();
        let r = t[bn];
        if (r !== null && ft(t[be])) {
            r !== t[be] && ic(r, t);
            let o = t[In];
            o !== null && o.detachView(e)
        }
        ha(t)
    } finally {
        re(n)
    }
}

function qv(e, t) {
    let n = e.cleanup,
        r = t[wl];
    if (n !== null)
        for (let s = 0; s < n.length - 1; s += 2)
            if (typeof n[s] == "string") {
                let a = n[s + 3];
                a >= 0 ? r[a]() : r[-a].unsubscribe(), s += 2
            } else {
                let a = r[n[s + 1]];
                n[s].call(a)
            } r !== null && (t[wl] = null);
    let o = t[Ct];
    if (o !== null) {
        t[Ct] = null;
        for (let s = 0; s < o.length; s++) {
            let a = o[s];
            a()
        }
    }
    let i = t[Io];
    if (i !== null) {
        t[Io] = null;
        for (let s of i) s.destroy()
    }
}

function Wv(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof Ht)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let a = o[i[s]],
                            c = i[s + 1];
                        de(4, a, c);
                        try {
                            c.call(a)
                        } finally {
                            de(5, a, c)
                        }
                    } else {
                        de(4, o, i);
                        try {
                            i.call(o)
                        } finally {
                            de(5, o, i)
                        }
                    }
            }
        }
}

function Gv(e, t, n) {
    return Zv(e, t.parent, n)
}

function Zv(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168;) t = r, r = t.parent;
    if (r === null) return n[dt];
    if (Zo(r)) {
        let {
            encapsulation: o
        } = e.data[r.directiveStart + r.componentOffset];
        if (o === it.None || o === it.Emulated) return null
    }
    return $t(r, n)
}

function Yv(e, t, n) {
    return Kv(e, t, n)
}

function Qv(e, t, n) {
    return e.type & 40 ? $t(e, n) : null
}
var Kv = Qv,
    Hl;

function ac(e, t, n, r) {
    let o = Gv(e, r, t),
        i = t[Ke],
        s = r.parent || t[et],
        a = Yv(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let c = 0; c < n.length; c++) Vl(i, o, n[c], a, !1);
        else Vl(i, o, n, a, !1);
    Hl !== void 0 && Hl(i, r, t, n, o)
}

function rr(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3) return $t(t, e);
        if (n & 4) return xa(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null) return rr(e, r);
            {
                let o = e[t.index];
                return ft(o) ? xa(-1, o) : wt(o)
            }
        } else {
            if (n & 128) return rr(e, t.next);
            if (n & 32) return oc(t, e)() || wt(e[t.index]);
            {
                let r = Rf(e, t);
                if (r !== null) {
                    if (Array.isArray(r)) return r[0];
                    let o = jt(e[rt]);
                    return rr(o, r)
                } else return rr(e, t.next)
            }
        }
    }
    return null
}

function Rf(e, t) {
    if (t !== null) {
        let r = e[rt][et],
            o = t.projection;
        return r.projection[o]
    }
    return null
}

function xa(e, t) {
    let n = Oe + e + 1;
    if (n < t.length) {
        let r = t[n],
            o = r[J].firstChild;
        if (o !== null) return rr(r, o)
    }
    return t[Bt]
}

function cc(e, t, n, r, o, i, s) {
    for (; n != null;) {
        if (n.type === 128) {
            n = n.next;
            continue
        }
        let a = r[n.index],
            c = n.type;
        if (s && t === 0 && (a && hr(wt(a), r), n.flags |= 2), !Tf(n))
            if (c & 8) cc(e, t, n.child, r, o, i, !1), mn(t, e, o, a, i);
            else if (c & 32) {
            let l = oc(n, r),
                u;
            for (; u = l();) mn(t, e, o, u, i);
            mn(t, e, o, a, i)
        } else c & 16 ? Xv(e, t, r, n, o, i) : mn(t, e, o, a, i);
        n = s ? n.projectionNext : n.next
    }
}

function ri(e, t, n, r, o, i) {
    cc(n, r, e.firstChild, t, o, i, !1)
}

function Xv(e, t, n, r, o, i) {
    let s = n[rt],
        c = s[et].projection[r.projection];
    if (Array.isArray(c))
        for (let l = 0; l < c.length; l++) {
            let u = c[l];
            mn(t, e, o, u, i)
        } else {
            let l = c,
                u = s[be];
            of(r) && (l.flags |= 128), cc(e, t, l, u, o, i, !0)
        }
}

function Jv(e, t, n, r, o) {
    let i = n[Bt],
        s = wt(n);
    i !== s && mn(t, e, r, i, o);
    for (let a = Oe; a < n.length; a++) {
        let c = n[a];
        ri(c[J], c, e, t, r, i)
    }
}

function Bo(e, t, n, r, o = !1) {
    for (; n !== null;) {
        if (n.type === 128) {
            n = o ? n.projectionNext : n.next;
            continue
        }
        let i = t[n.index];
        i !== null && r.push(wt(i)), ft(i) && ex(i, r);
        let s = n.type;
        if (s & 8) Bo(e, t, n.child, r);
        else if (s & 32) {
            let a = oc(n, t),
                c;
            for (; c = a();) r.push(c)
        } else if (s & 16) {
            let a = Rf(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
                let c = jt(t[rt]);
                Bo(c[J], c, a, r, !0)
            }
        }
        n = o ? n.projectionNext : n.next
    }
    return r
}

function ex(e, t) {
    for (let n = Oe; n < e.length; n++) {
        let r = e[n],
            o = r[J].firstChild;
        o !== null && Bo(r[J], r, o, t)
    }
    e[Bt] !== e[dt] && t.push(e[Bt])
}

function Ff(e) {
    if (e[$s] !== null) {
        for (let t of e[$s]) t.impl.addSequence(t);
        e[$s].length = 0
    }
}
var kf = [];

function tx(e) {
    return e[Ve] ?? nx(e)
}

function nx(e) {
    let t = kf.pop() ?? Object.create(ox);
    return t.lView = e, t
}

function rx(e) {
    e.lView[Ve] !== e && (e.lView = null, kf.push(e))
}
var ox = le(P({}, zr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        Qo(e.lView)
    },
    consumerOnSignalRead() {
        this.lView[Ve] = this
    }
});

function ix(e) {
    let t = e[Ve] ?? Object.create(sx);
    return t.lView = e, t
}
var sx = le(P({}, zr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        let t = jt(e.lView);
        for (; t && !Of(t[J]);) t = jt(t);
        t && _d(t)
    },
    consumerOnSignalRead() {
        this.lView[Ve] = this
    }
});

function Of(e) {
    return e.type !== 2
}

function Pf(e) {
    if (e[Io] === null) return;
    let t = !0;
    for (; t;) {
        let n = !1;
        for (let r of e[Io]) r.dirty && (n = !0, r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
        t = n && !!(e[W] & 8192)
    }
}
var ax = 100;

function Bf(e, t = !0, n = 0) {
    let o = e[Et].rendererFactory,
        i = !1;
    i || o.begin?.();
    try {
        cx(e, n)
    } catch (s) {
        throw t && Pv(e, s), s
    } finally {
        i || o.end?.()
    }
}

function cx(e, t) {
    let n = Nd();
    try {
        _l(!0), ya(e, t);
        let r = 0;
        for (; Yo(e);) {
            if (r === ax) throw new L(103, !1);
            r++, ya(e, 1)
        }
    } finally {
        _l(n)
    }
}

function ux(e, t, n, r) {
    if (dr(t)) return;
    let o = t[W],
        i = !1,
        s = !1;
    La(t);
    let a = !0,
        c = null,
        l = null;
    i || (Of(e) ? (l = tx(t), c = Ds(l)) : Nu() === null ? (a = !1, l = ix(t), c = Ds(l)) : t[Ve] && (Es(t[Ve]), t[Ve] = null));
    try {
        Id(t), Cm(e.bindingStartIndex), n !== null && _f(e, t, n, 2, r);
        let u = (o & 3) === 3;
        if (!i)
            if (u) {
                let h = e.preOrderCheckHooks;
                h !== null && go(t, h, null)
            } else {
                let h = e.preOrderHooks;
                h !== null && mo(t, h, 0, null), Us(t, 0)
            } if (s || lx(t), Pf(t), Lf(t, 0), e.contentQueries !== null && gf(e, t), !i)
            if (u) {
                let h = e.contentCheckHooks;
                h !== null && go(t, h)
            } else {
                let h = e.contentHooks;
                h !== null && mo(t, h, 1), Us(t, 1)
            } fx(e, t);
        let d = e.components;
        d !== null && Vf(t, d, 0);
        let f = e.viewQuery;
        if (f !== null && ga(2, f, r), !i)
            if (u) {
                let h = e.viewCheckHooks;
                h !== null && go(t, h)
            } else {
                let h = e.viewHooks;
                h !== null && mo(t, h, 2), Us(t, 2)
            } if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Hs]) {
            for (let h of t[Hs]) h();
            t[Hs] = null
        }
        i || (Ff(t), t[W] &= -73)
    } catch (u) {
        throw i || Qo(t), u
    } finally {
        l !== null && (ku(l, c), a && rx(l)), ja()
    }
}

function Lf(e, t) {
    for (let n = cf(e); n !== null; n = uf(n))
        for (let r = Oe; r < n.length; r++) {
            let o = n[r];
            jf(o, t)
        }
}

function lx(e) {
    for (let t = cf(e); t !== null; t = uf(t)) {
        if (!(t[W] & 2)) continue;
        let n = t[So];
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            _d(o)
        }
    }
}

function dx(e, t, n) {
    de(18);
    let r = Lt(t, e);
    jf(r, n), de(19, r[$e])
}

function jf(e, t) {
    Ba(e) && ya(e, t)
}

function ya(e, t) {
    let r = e[J],
        o = e[W],
        i = e[Ve],
        s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0), s ||= !!(o & 1024), s ||= !!(i?.dirty && Cs(i)), s ||= !1, i && (i.dirty = !1), e[W] &= -9217, s) ux(r, e, r.template, e[$e]);
    else if (o & 8192) {
        Pf(e), Lf(e, 1);
        let a = r.components;
        a !== null && Vf(e, a, 1), Ff(e)
    }
}

function Vf(e, t, n) {
    for (let r = 0; r < t.length; r++) dx(e, t[r], n)
}

function fx(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null) try {
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            if (o < 0) Vt(~o);
            else {
                let i = o,
                    s = n[++r],
                    a = n[++r];
                bm(s, i);
                let c = t[i];
                de(24, c), a(2, c), de(25, c)
            }
        }
    } finally {
        Vt(-1)
    }
}

function Hf(e, t) {
    let n = Nd() ? 64 : 1088;
    for (e[Et].changeDetectionScheduler?.notify(t); e;) {
        e[W] |= n;
        let r = jt(e);
        if (Ao(e) && !r) return e;
        e = r
    }
    return null
}

function $f(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null]
}

function hx(e, t) {
    let n = Oe + t;
    if (n < e.length) return e[n]
}

function Uf(e, t, n, r = !0) {
    let o = t[J];
    if (gx(o, t, e, n), r) {
        let s = xa(n, e),
            a = t[Ke],
            c = a.parentNode(e[Bt]);
        c !== null && Uv(o, e[et], a, t, c, s)
    }
    let i = t[bo];
    i !== null && i.firstChild !== null && (i.firstChild = null)
}

function px(e, t) {
    let n = Lo(e, t);
    return n !== void 0 && sc(n[J], n), n
}

function Lo(e, t) {
    if (e.length <= Oe) return;
    let n = Oe + t,
        r = e[n];
    if (r) {
        let o = r[bn];
        o !== null && o !== e && ic(o, r), t > 0 && (e[n - 1][Qe] = r[Qe]);
        let i = Eo(e, Oe + t);
        $v(r[J], r);
        let s = i[In];
        s !== null && s.detachView(i[J]), r[be] = null, r[Qe] = null, r[W] &= -129
    }
    return r
}

function gx(e, t, n, r) {
    let o = Oe + r,
        i = n.length;
    r > 0 && (n[o - 1][Qe] = t), r < i - Oe ? (t[Qe] = n[o], cd(n, Oe + r, t)) : (n.push(t), t[Qe] = null), t[be] = n;
    let s = t[bn];
    s !== null && n !== s && zf(s, t);
    let a = t[In];
    a !== null && a.insertView(e), na(t), t[W] |= 128
}

function zf(e, t) {
    let n = e[So],
        r = t[be];
    if (Ot(r)) e[W] |= 2;
    else {
        let o = r[be][rt];
        t[rt] !== o && (e[W] |= 2)
    }
    n === null ? e[So] = [t] : n.push(t)
}
var jo = class {
    _lView;
    _cdRefInjectingView;
    notifyErrorHandler;
    _appRef = null;
    _attachedToViewContainer = !1;
    get rootNodes() {
        let t = this._lView,
            n = t[J];
        return Bo(n, t, n.firstChild, [])
    }
    constructor(t, n, r = !0) {
        this._lView = t, this._cdRefInjectingView = n, this.notifyErrorHandler = r
    }
    get context() {
        return this._lView[$e]
    }
    set context(t) {
        this._lView[$e] = t
    }
    get destroyed() {
        return dr(this._lView)
    }
    destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let t = this._lView[be];
            if (ft(t)) {
                let n = t[_o],
                    r = n ? n.indexOf(this) : -1;
                r > -1 && (Lo(t, r), Eo(n, r))
            }
            this._attachedToViewContainer = !1
        }
        sc(this._lView[J], this._lView)
    }
    onDestroy(t) {
        Sd(this._lView, t)
    }
    markForCheck() {
        Hf(this._cdRefInjectingView || this._lView, 4)
    }
    detach() {
        this._lView[W] &= -129
    }
    reattach() {
        na(this._lView), this._lView[W] |= 128
    }
    detectChanges() {
        this._lView[W] |= 1024, Bf(this._lView, this.notifyErrorHandler)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
        if (this._appRef) throw new L(902, !1);
        this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
        this._appRef = null;
        let t = Ao(this._lView),
            n = this._lView[bn];
        n !== null && !t && ic(n, this._lView), Nf(this._lView[J], this._lView)
    }
    attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new L(902, !1);
        this._appRef = t;
        let n = Ao(this._lView),
            r = this._lView[bn];
        r !== null && !n && zf(r, this._lView), na(this._lView)
    }
};

function uc(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) i = mx(e, t, n, r, o), wm() && (i.flags |= 32);
    else if (i.type & 64) {
        i.type = n, i.value = r, i.attrs = o;
        let s = ym();
        i.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return fr(i, !0), i
}

function mx(e, t, n, r, o) {
    let i = Md(),
        s = Td(),
        a = s ? i : i && i.parent,
        c = e.data[t] = xx(e, a, n, t, r, o);
    return vx(e, c, i, s), c
}

function vx(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t), n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n))
}

function xx(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1,
        a = 0;
    return mm() && (a |= 128), {
        type: n,
        index: r,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: o,
        attrs: i,
        mergedAttrs: null,
        localNames: null,
        initialInputs: null,
        inputs: null,
        hostDirectiveInputs: null,
        outputs: null,
        hostDirectiveOutputs: null,
        directiveToIndex: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: t,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}
var H_ = new RegExp(`^(\\d+)*(${av}|${sv})*(.*)`);
var yx = () => null;

function Da(e, t) {
    return yx(e, t)
}
var Dx = class {},
    qf = class {},
    Ca = class {
        resolveComponentFactory(t) {
            throw Error(`No component factory found for ${ke(t)}.`)
        }
    },
    oi = class {
        static NULL = new Ca
    },
    _n = class {};
var Cx = (() => {
    class e {
        static \u0275prov = V({
            token: e,
            providedIn: "root",
            factory: () => null
        })
    }
    return e
})();

function $l(e, t, n) {
    let r = n ? e.styles : null,
        o = n ? e.classes : null,
        i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number") i = a;
            else if (i == 1) o = ml(o, a);
            else if (i == 2) {
                let c = a,
                    l = t[++s];
                r = ml(r, c + ": " + l + ";")
            }
        }
    n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o
}

function Wt(e, t = G.Default) {
    let n = Ae();
    if (n === null) return Z(e, t);
    let r = St();
    return Zd(r, n, we(e), t)
}

function Wf(e, t, n, r, o) {
    let i = r === null ? null : {
            "": -1
        },
        s = o(e, n);
    if (s !== null) {
        let a, c = null,
            l = null,
            u = wx(s);
        u === null ? a = s : [a, c, l] = u, _x(e, t, n, a, i, c, l)
    }
    i !== null && r !== null && Ex(n, r, i)
}

function Ex(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
        let i = n[t[o + 1]];
        if (i == null) throw new L(-301, !1);
        r.push(t[o], i)
    }
}

function wx(e) {
    let t = null,
        n = !1;
    for (let s = 0; s < e.length; s++) {
        let a = e[s];
        if (s === 0 && _t(a) && (t = a), a.findHostDirectiveDefs !== null) {
            n = !0;
            break
        }
    }
    if (!n) return null;
    let r = null,
        o = null,
        i = null;
    for (let s of e) s.findHostDirectiveDefs !== null && (r ??= [], o ??= new Map, i ??= new Map, bx(s, r, i, o)), s === t && (r ??= [], r.push(s));
    return r !== null ? (r.push(...t === null ? e : e.slice(1)), [r, o, i]) : null
}

function bx(e, t, n, r) {
    let o = t.length;
    e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1])
}

function Ix(e, t, n) {
    t.componentOffset = n, (e.components ??= []).push(t.index)
}

function _x(e, t, n, r, o, i, s) {
    let a = r.length,
        c = !1;
    for (let f = 0; f < a; f++) {
        let h = r[f];
        !c && _t(h) && (c = !0, Ix(e, n, f)), aa(Ro(n, t), e, h.type)
    }
    Rx(n, e.data.length, a);
    for (let f = 0; f < a; f++) {
        let h = r[f];
        h.providersResolver && h.providersResolver(h)
    }
    let l = !1,
        u = !1,
        d = wf(e, t, a, null);
    a > 0 && (n.directiveToIndex = new Map);
    for (let f = 0; f < a; f++) {
        let h = r[f];
        if (n.mergedAttrs = $a(n.mergedAttrs, h.hostAttrs), Ax(e, n, t, d, h), Nx(d, h, o), s !== null && s.has(h)) {
            let [v, x] = s.get(h);
            n.directiveToIndex.set(h.type, [d, v + n.directiveStart, x + n.directiveStart])
        } else(i === null || !i.has(h)) && n.directiveToIndex.set(h.type, d);
        h.contentQueries !== null && (n.flags |= 4), (h.hostBindings !== null || h.hostAttrs !== null || h.hostVars !== 0) && (n.flags |= 64);
        let g = h.type.prototype;
        !l && (g.ngOnChanges || g.ngOnInit || g.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), l = !0), !u && (g.ngOnChanges || g.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = !0), d++
    }
    Sx(e, n, i)
}

function Sx(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
        let o = e.data[r];
        if (n === null || !n.has(o)) Ul(0, t, o, r), Ul(1, t, o, r), ql(t, r, !1);
        else {
            let i = n.get(o);
            zl(0, t, i, r), zl(1, t, i, r), ql(t, r, !0)
        }
    }
}

function Ul(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s;
            e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(r), Gf(t, i)
        }
}

function zl(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s = o[i],
                a;
            e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(r, i), Gf(t, s)
        }
}

function Gf(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16)
}

function ql(e, t, n) {
    let {
        attrs: r,
        inputs: o,
        hostDirectiveInputs: i
    } = e;
    if (r === null || !n && o === null || n && i === null || Ka(e)) {
        e.initialInputs ??= [], e.initialInputs.push(null);
        return
    }
    let s = null,
        a = 0;
    for (; a < r.length;) {
        let c = r[a];
        if (c === 0) {
            a += 4;
            continue
        } else if (c === 5) {
            a += 2;
            continue
        } else if (typeof c == "number") break;
        if (!n && o.hasOwnProperty(c)) {
            let l = o[c];
            for (let u of l)
                if (u === t) {
                    s ??= [], s.push(c, r[a + 1]);
                    break
                }
        } else if (n && i.hasOwnProperty(c)) {
            let l = i[c];
            for (let u = 0; u < l.length; u += 2)
                if (l[u] === t) {
                    s ??= [], s.push(l[u + 1], r[a + 1]);
                    break
                }
        }
        a += 2
    }
    e.initialInputs ??= [], e.initialInputs.push(s)
}

function Ax(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = xn(o.type, !0)),
        s = new Ht(i, _t(o), Wt);
    e.blueprint[r] = s, n[r] = s, Mx(e, t, r, wf(e, n, o.hostVars, Xa), o)
}

function Mx(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        Tx(s) != a && s.push(a), s.push(n, r, i)
    }
}

function Tx(e) {
    let t = e.length;
    for (; t > 0;) {
        let n = e[--t];
        if (typeof n == "number" && n < 0) return n
    }
    return 0
}

function Nx(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
        _t(t) && (n[""] = e)
    }
}

function Rx(e, t, n) {
    e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t
}

function Zf(e, t, n, r, o, i, s, a) {
    let c = t.consts,
        l = Mo(c, s),
        u = uc(t, e, 2, r, l);
    return i && Wf(t, n, u, Mo(c, a), o), u.mergedAttrs = $a(u.mergedAttrs, u.attrs), u.attrs !== null && $l(u, u.attrs, !1), u.mergedAttrs !== null && $l(u, u.mergedAttrs, !0), t.queries !== null && t.queries.elementStart(t, u), u
}

function Yf(e, t) {
    Vd(e, t), xd(t) && e.queries.elementEnd(t)
}
var Vo = class extends oi {
    ngModule;
    constructor(t) {
        super(), this.ngModule = t
    }
    resolveComponentFactory(t) {
        let n = En(t);
        return new ur(n, this.ngModule)
    }
};

function Fx(e) {
    return Object.keys(e).map(t => {
        let [n, r, o] = e[t], i = {
            propName: n,
            templateName: t,
            isSignal: (r & ni.SignalBased) !== 0
        };
        return o && (i.transform = o), i
    })
}

function kx(e) {
    return Object.keys(e).map(t => ({
        propName: e[t],
        templateName: t
    }))
}

function Ox(e, t, n) {
    let r = t instanceof He ? t : t?.injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r), r ? new ia(n, r) : n
}

function Px(e) {
    let t = e.get(_n, null);
    if (t === null) throw new L(407, !1);
    let n = e.get(Cx, null),
        r = e.get(cr, null);
    return {
        rendererFactory: t,
        sanitizer: n,
        changeDetectionScheduler: r
    }
}

function Bx(e, t) {
    let n = (e.selectors[0][0] || "div").toLowerCase();
    return yf(t, n, n === "svg" ? um : n === "math" ? lm : null)
}
var ur = class extends qf {
        componentDef;
        ngModule;
        selector;
        componentType;
        ngContentSelectors;
        isBoundToModule;
        cachedInputs = null;
        cachedOutputs = null;
        get inputs() {
            return this.cachedInputs ??= Fx(this.componentDef.inputs), this.cachedInputs
        }
        get outputs() {
            return this.cachedOutputs ??= kx(this.componentDef.outputs), this.cachedOutputs
        }
        constructor(t, n) {
            super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = Dv(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n
        }
        create(t, n, r, o) {
            de(22);
            let i = re(null);
            try {
                let s = this.componentDef,
                    a = r ? ["ng-version", "19.2.2"] : Cv(this.componentDef.selectors[0]),
                    c = Ja(0, null, null, 1, 0, null, null, null, null, [a], null),
                    l = Ox(s, o || this.ngModule, t),
                    u = Px(l),
                    d = u.rendererFactory.createRenderer(null, s),
                    f = r ? Mv(d, r, s.encapsulation, l) : Bx(s, d),
                    h = ec(null, c, null, 512 | Ef(s), null, null, u, d, l, null, pf(f, l, !0));
                h[Xe] = f, La(h);
                let g = null;
                try {
                    let v = Zf(Xe, c, h, "#host", () => [this.componentDef], !0, 0);
                    f && (Cf(d, f, v), hr(f, h)), nc(c, h, v), mf(c, v, h), Yf(c, v), n !== void 0 && Lx(v, this.ngContentSelectors, n), g = Lt(v.index, h), h[$e] = g[$e], rc(c, h, null)
                } catch (v) {
                    throw g !== null && ha(g), ha(h), v
                } finally {
                    de(23), ja()
                }
                return new Ea(this.componentType, h)
            } finally {
                re(i)
            }
        }
    },
    Ea = class extends Dx {
        _rootLView;
        instance;
        hostView;
        changeDetectorRef;
        componentType;
        location;
        previousInputValues = null;
        _tNode;
        constructor(t, n) {
            super(), this._rootLView = n, this._tNode = bd(n[J], Xe), this.location = Ga(this._tNode, n), this.instance = Lt(this._tNode.index, n)[$e], this.hostView = this.changeDetectorRef = new jo(n, void 0, !1), this.componentType = t
        }
        setInput(t, n) {
            let r = this._tNode;
            if (this.previousInputValues ??= new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
            let o = this._rootLView,
                i = Mf(r, o[J], o, t, n);
            this.previousInputValues.set(t, n);
            let s = Lt(r.index, o);
            Hf(s, 1)
        }
        get injector() {
            return new Pt(this._tNode, this._rootLView)
        }
        destroy() {
            this.hostView.destroy()
        }
        onDestroy(t) {
            this.hostView.onDestroy(t)
        }
    };

function Lx(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null && i.length ? Array.from(i) : null)
    }
}
var ii = (() => {
    class e {
        static __NG_ELEMENT_ID__ = jx
    }
    return e
})();

function jx() {
    let e = St();
    return Hx(e, Ae())
}
var Vx = ii,
    Qf = class extends Vx {
        _lContainer;
        _hostTNode;
        _hostLView;
        constructor(t, n, r) {
            super(), this._lContainer = t, this._hostTNode = n, this._hostLView = r
        }
        get element() {
            return Ga(this._hostTNode, this._hostLView)
        }
        get injector() {
            return new Pt(this._hostTNode, this._hostLView)
        }
        get parentInjector() {
            let t = Ua(this._hostTNode, this._hostLView);
            if ($d(t)) {
                let n = No(t, this._hostLView),
                    r = To(t),
                    o = n[J].data[r + 8];
                return new Pt(o, n)
            } else return new Pt(null, this._hostLView)
        }
        clear() {
            for (; this.length > 0;) this.remove(this.length - 1)
        }
        get(t) {
            let n = Wl(this._lContainer);
            return n !== null && n[t] || null
        }
        get length() {
            return this._lContainer.length - Oe
        }
        createEmbeddedView(t, n, r) {
            let o, i;
            typeof r == "number" ? o = r : r != null && (o = r.index, i = r.injector);
            let s = Da(this._lContainer, t.ssrId),
                a = t.createEmbeddedViewImpl(n || {}, i, s);
            return this.insertImpl(a, o, va(this._hostTNode, s)), a
        }
        createComponent(t, n, r, o, i) {
            let s = t && !im(t),
                a;
            if (s) a = n;
            else {
                let g = n || {};
                a = g.index, r = g.injector, o = g.projectableNodes, i = g.environmentInjector || g.ngModuleRef
            }
            let c = s ? t : new ur(En(t)),
                l = r || this.parentInjector;
            if (!i && c.ngModule == null) {
                let v = (s ? l : this.parentInjector).get(He, null);
                v && (i = v)
            }
            let u = En(c.componentType ?? {}),
                d = Da(this._lContainer, u?.id ?? null),
                f = d?.firstChild ?? null,
                h = c.create(l, o, f, i);
            return this.insertImpl(h.hostView, a, va(this._hostTNode, d)), h
        }
        insert(t, n) {
            return this.insertImpl(t, n, !0)
        }
        insertImpl(t, n, r) {
            let o = t._lView;
            if (dm(o)) {
                let a = this.indexOf(t);
                if (a !== -1) this.detach(a);
                else {
                    let c = o[be],
                        l = new Qf(c, c[et], c[be]);
                    l.detach(l.indexOf(t))
                }
            }
            let i = this._adjustIndex(n),
                s = this._lContainer;
            return Uf(s, o, i, r), t.attachToViewContainerRef(), cd(Gs(s), i, t), t
        }
        move(t, n) {
            return this.insert(t, n)
        }
        indexOf(t) {
            let n = Wl(this._lContainer);
            return n !== null ? n.indexOf(t) : -1
        }
        remove(t) {
            let n = this._adjustIndex(t, -1),
                r = Lo(this._lContainer, n);
            r && (Eo(Gs(this._lContainer), n), sc(r[J], r))
        }
        detach(t) {
            let n = this._adjustIndex(t, -1),
                r = Lo(this._lContainer, n);
            return r && Eo(Gs(this._lContainer), n) != null ? new jo(r) : null
        }
        _adjustIndex(t, n = 0) {
            return t ?? this.length + n
        }
    };

function Wl(e) {
    return e[_o]
}

function Gs(e) {
    return e[_o] || (e[_o] = [])
}

function Hx(e, t) {
    let n, r = t[e.index];
    return ft(r) ? n = r : (n = $f(r, t, null, e), t[e.index] = n, tc(t, n)), Ux(n, t, e, r), new Qf(n, e, t)
}

function $x(e, t) {
    let n = e[Ke],
        r = n.createComment(""),
        o = $t(t, e),
        i = n.parentNode(o);
    return Po(n, i, r, n.nextSibling(o), !1), r
}
var Ux = Wx,
    zx = () => !1;

function qx(e, t, n) {
    return zx(e, t, n)
}

function Wx(e, t, n, r) {
    if (e[Bt]) return;
    let o;
    n.type & 8 ? o = wt(r) : o = $x(t, n), e[Bt] = o
}
var Sn = class {},
    lc = class {};
var wa = class extends Sn {
        ngModuleType;
        _parent;
        _bootstrapComponents = [];
        _r3Injector;
        instance;
        destroyCbs = [];
        componentFactoryResolver = new Vo(this);
        constructor(t, n, r, o = !0) {
            super(), this.ngModuleType = t, this._parent = n;
            let i = dd(t);
            this._bootstrapComponents = vf(i.bootstrap), this._r3Injector = Kd(t, n, [{
                provide: Sn,
                useValue: this
            }, {
                provide: oi,
                useValue: this.componentFactoryResolver
            }, ...r], ke(t), new Set(["environment"])), o && this.resolveInjectorInitializers()
        }
        resolveInjectorInitializers() {
            this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(this.ngModuleType)
        }
        get injector() {
            return this._r3Injector
        }
        destroy() {
            let t = this._r3Injector;
            !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null
        }
        onDestroy(t) {
            this.destroyCbs.push(t)
        }
    },
    ba = class extends lc {
        moduleType;
        constructor(t) {
            super(), this.moduleType = t
        }
        create(t) {
            return new wa(this.moduleType, t, [])
        }
    };
var Ho = class extends Sn {
    injector;
    componentFactoryResolver = new Vo(this);
    instance = null;
    constructor(t) {
        super();
        let n = new ir([...t.providers, {
            provide: Sn,
            useValue: this
        }, {
            provide: oi,
            useValue: this.componentFactoryResolver
        }], t.parent || Oa(), t.debugName, new Set(["environment"]));
        this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
};

function dc(e, t, n = null) {
    return new Ho({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0
    }).injector
}
var Gx = (() => {
    class e {
        _injector;
        cachedInjectors = new Map;
        constructor(n) {
            this._injector = n
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
                let r = fd(!1, n.type),
                    o = r.length > 0 ? dc([r], this._injector, `Standalone[${n.type.name}]`) : null;
                this.cachedInjectors.set(n, o)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static \u0275prov = V({
            token: e,
            providedIn: "environment",
            factory: () => new e(Z(He))
        })
    }
    return e
})();

function si(e) {
    return Na(() => {
        let t = Kf(e),
            n = le(P({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === sf.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: t.standalone && e.dependencies || null,
                getStandaloneInjector: t.standalone ? o => o.get(Gx).getOrCreateStandaloneInjector(n) : null,
                getExternalStyles: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || it.Emulated,
                styles: e.styles || Dn,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: ""
            });
        t.standalone && ti("NgStandalone"), Xf(n);
        let r = e.dependencies;
        return n.directiveDefs = Gl(r, !1), n.pipeDefs = Gl(r, !0), n.id = Xx(n), n
    })
}

function Zx(e) {
    return En(e) || Wg(e)
}

function Yx(e) {
    return e !== null
}

function Qx(e, t) {
    if (e == null) return yn;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r],
                i, s, a, c;
            Array.isArray(o) ? (a = o[0], i = o[1], s = o[2] ?? i, c = o[3] || null) : (i = o, s = o, a = ni.None, c = null), n[i] = [r, a, c], t[i] = s
        } return n
}

function Kx(e) {
    if (e == null) return yn;
    let t = {};
    for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
    return t
}

function fc(e) {
    return Na(() => {
        let t = Kf(e);
        return Xf(t), t
    })
}

function Kf(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputConfig: e.inputs || yn,
        exportAs: e.exportAs || null,
        standalone: e.standalone ?? !0,
        signals: e.signals === !0,
        selectors: e.selectors || Dn,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: Qx(e.inputs, t),
        outputs: Kx(e.outputs),
        debugInfo: null
    }
}

function Xf(e) {
    e.features?.forEach(t => t(e))
}

function Gl(e, t) {
    if (!e) return null;
    let n = t ? Gg : Zx;
    return () => (typeof e == "function" ? e() : e).map(r => n(r)).filter(Yx)
}

function Xx(e) {
    let t = 0,
        n = typeof e.consts == "function" ? "" : e.consts,
        r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|")) t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648, "c" + t
}

function Jx(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? !1 : (e[t] = n, !0)
}

function ey(e, t, n, r, o, i, s, a, c) {
    let l = t.consts,
        u = uc(t, e, 4, s || null, a || null);
    Ad() && Wf(t, n, u, Mo(l, c), Af), u.mergedAttrs = $a(u.mergedAttrs, u.attrs), Vd(t, u);
    let d = u.tView = Ja(2, u, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, l, null);
    return t.queries !== null && (t.queries.template(t, u), d.queries = t.queries.embeddedTView(u)), u
}

function ty(e, t, n, r, o, i, s, a, c, l) {
    let u = n + Xe,
        d = t.firstCreatePass ? ey(u, t, e, r, o, i, s, a, c) : t.data[u];
    fr(d, !1);
    let f = ny(t, e, d, n);
    Va() && ac(t, e, f, d), hr(f, e);
    let h = $f(f, e, f, d);
    return e[u] = h, tc(e, h), qx(h, d, e), yd(d) && nc(t, e, d), c != null && Sf(e, d, l), d
}

function hc(e, t, n, r, o, i, s, a) {
    let c = Ae(),
        l = Ut(),
        u = Mo(l.consts, i);
    return ty(c, l, e, t, n, r, o, u, s, a), hc
}
var ny = ry;

function ry(e, t, n, r) {
    return Ha(!0), t[Ke].createComment("")
}
var pc = (() => {
    class e {
        log(n) {
            console.log(n)
        }
        warn(n) {
            console.warn(n)
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = V({
            token: e,
            factory: e.\u0275fac,
            providedIn: "platform"
        })
    }
    return e
})();
var Jf = new $("");
var oy = (() => {
        class e {
            static \u0275prov = V({
                token: e,
                providedIn: "root",
                factory: () => new Ia
            })
        }
        return e
    })(),
    Ia = class {
        queuedEffectCount = 0;
        queues = new Map;
        schedule(t) {
            this.enqueue(t)
        }
        remove(t) {
            let n = t.zone,
                r = this.queues.get(n);
            r.has(t) && (r.delete(t), this.queuedEffectCount--)
        }
        enqueue(t) {
            let n = t.zone;
            this.queues.has(n) || this.queues.set(n, new Set);
            let r = this.queues.get(n);
            r.has(t) || (this.queuedEffectCount++, r.add(t))
        }
        flush() {
            for (; this.queuedEffectCount > 0;)
                for (let [t, n] of this.queues) t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n))
        }
        flushQueue(t) {
            for (let n of t) t.delete(n), this.queuedEffectCount--, n.run()
        }
    };

function pr(e) {
    return !!e && typeof e.then == "function"
}

function eh(e) {
    return !!e && typeof e.subscribe == "function"
}
var th = new $("");
var nh = (() => {
        class e {
            resolve;
            reject;
            initialized = !1;
            done = !1;
            donePromise = new Promise((n, r) => {
                this.resolve = n, this.reject = r
            });
            appInits = F(th, {
                optional: !0
            }) ?? [];
            injector = F(ot);
            constructor() {}
            runInitializers() {
                if (this.initialized) return;
                let n = [];
                for (let o of this.appInits) {
                    let i = Je(this.injector, o);
                    if (pr(i)) n.push(i);
                    else if (eh(i)) {
                        let s = new Promise((a, c) => {
                            i.subscribe({
                                complete: a,
                                error: c
                            })
                        });
                        n.push(s)
                    }
                }
                let r = () => {
                    this.done = !0, this.resolve()
                };
                Promise.all(n).then(() => {
                    r()
                }).catch(o => {
                    this.reject(o)
                }), n.length === 0 && r(), this.initialized = !0
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    gc = new $("");

function iy() {
    ju(() => {
        throw new L(600, !1)
    })
}

function sy(e) {
    return e.isBoundToModule
}
var ay = 10;
var It = (() => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = F(Xm);
        afterRenderManager = F(uv);
        zonelessEnabled = F(Xo);
        rootEffectScheduler = F(oy);
        dirtyFlags = 0;
        tracingSnapshot = null;
        externalTestViews = new Set;
        afterTick = new Ee;
        get allViews() {
            return [...this.externalTestViews.keys(), ...this._views]
        }
        get destroyed() {
            return this._destroyed
        }
        componentTypes = [];
        components = [];
        isStable = F(An).hasPendingTasks.pipe(ne(n => !n));
        constructor() {
            F(ei, {
                optional: !0
            })
        }
        whenStable() {
            let n;
            return new Promise(r => {
                n = this.isStable.subscribe({
                    next: o => {
                        o && r()
                    }
                })
            }).finally(() => {
                n.unsubscribe()
            })
        }
        _injector = F(He);
        _rendererFactory = null;
        get injector() {
            return this._injector
        }
        bootstrap(n, r) {
            de(10);
            let o = n instanceof qf;
            if (!this._injector.get(nh).done) {
                let f = "";
                throw new L(405, f)
            }
            let s;
            o ? s = n : s = this._injector.get(oi).resolveComponentFactory(n), this.componentTypes.push(s.componentType);
            let a = sy(s) ? void 0 : this._injector.get(Sn),
                c = r || s.selector,
                l = s.create(ot.NULL, [], c, a),
                u = l.location.nativeElement,
                d = l.injector.get(Jf, null);
            return d?.registerApplication(u), l.onDestroy(() => {
                this.detachView(l.hostView), vo(this.components, l), d?.unregisterApplication(u)
            }), this._loadComponent(l), de(11, l), l
        }
        tick() {
            this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick()
        }
        _tick() {
            de(12), this.tracingSnapshot !== null ? this.tracingSnapshot.run(hf.CHANGE_DETECTION, this.tickImpl) : this.tickImpl()
        }
        tickImpl = () => {
            if (this._runningTick) throw new L(101, !1);
            let n = re(null);
            try {
                this._runningTick = !0, this.synchronize()
            } catch (r) {
                this.internalErrorHandler(r)
            } finally {
                this._runningTick = !1, this.tracingSnapshot?.dispose(), this.tracingSnapshot = null, re(n), this.afterTick.next(), de(13)
            }
        };
        synchronize() {
            this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(_n, null, {
                optional: !0
            }));
            let n = 0;
            for (; this.dirtyFlags !== 0 && n++ < ay;) de(14), this.synchronizeOnce(), de(15)
        }
        synchronizeOnce() {
            if (this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()), this.dirtyFlags & 7) {
                let n = !!(this.dirtyFlags & 1);
                this.dirtyFlags &= -8, this.dirtyFlags |= 8;
                for (let {
                        _lView: r,
                        notifyErrorHandler: o
                    }
                    of this.allViews) cy(r, o, n, this.zonelessEnabled);
                if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23) return
            } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
            this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews()
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some(({
                    _lView: n
                }) => Yo(n))) {
                this.dirtyFlags |= 2;
                return
            } else this.dirtyFlags &= -8
        }
        attachView(n) {
            let r = n;
            this._views.push(r), r.attachToAppRef(this)
        }
        detachView(n) {
            let r = n;
            vo(this._views, r), r.detachFromAppRef()
        }
        _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n), this._injector.get(gc, []).forEach(o => o(n))
        }
        ngOnDestroy() {
            if (!this._destroyed) try {
                this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy())
            } finally {
                this._destroyed = !0, this._views = [], this._destroyListeners = []
            }
        }
        onDestroy(n) {
            return this._destroyListeners.push(n), () => vo(this._destroyListeners, n)
        }
        destroy() {
            if (this._destroyed) throw new L(406, !1);
            let n = this._injector;
            n.destroy && !n.destroyed && n.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = V({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function vo(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}

function cy(e, t, n, r) {
    if (!n && !Yo(e)) return;
    Bf(e, t, n && !r ? 0 : 1)
}

function Zl(e, t, n, r, o) {
    Mf(t, e, n, o ? "class" : "style", r)
}

function rh(e, t) {
    ti("NgControlFlow");
    let n = Ae(),
        r = Em(),
        o = n[r] !== Xa ? n[r] : -1,
        i = o !== -1 ? Yl(n, Xe + o) : void 0,
        s = 0;
    if (Jx(n, r, e)) {
        let a = re(null);
        try {
            if (i !== void 0 && px(i, s), e !== -1) {
                let c = Xe + e,
                    l = Yl(n, c),
                    u = uy(n[J], c),
                    d = Da(l, u.tView.ssrId),
                    f = Vv(n, u, t, {
                        dehydratedView: d
                    });
                Uf(l, f, s, va(u, d))
            }
        } finally {
            re(a)
        }
    } else if (i !== void 0) {
        let a = hx(i, s);
        a !== void 0 && (a[$e] = t)
    }
}

function Yl(e, t) {
    return e[t]
}

function uy(e, t) {
    return bd(e, t)
}

function Mn(e, t, n, r) {
    let o = Ae(),
        i = Ut(),
        s = Xe + e,
        a = o[Ke],
        c = i.firstCreatePass ? Zf(s, i, o, t, Af, Ad(), n, r) : i.data[s],
        l = ly(i, o, c, a, t, e);
    o[s] = l;
    let u = yd(c);
    return fr(c, !0), Cf(a, l, c), !Tf(c) && Va() && ac(i, o, l, c), (hm() === 0 || u) && hr(l, o), pm(), u && (nc(i, o, c), mf(i, c, o)), r !== null && Sf(o, c), Mn
}

function Tn() {
    let e = St();
    Td() ? Dm() : (e = e.parent, fr(e, !1));
    let t = e;
    vm(t) && xm(), gm();
    let n = Ut();
    return n.firstCreatePass && Yf(n, t), t.classesWithoutHost != null && Tm(t) && Zl(n, t, Ae(), t.classesWithoutHost, !0), t.stylesWithoutHost != null && Nm(t) && Zl(n, t, Ae(), t.stylesWithoutHost, !1), Tn
}

function mc(e, t, n, r) {
    return Mn(e, t, n, r), Tn(), mc
}
var ly = (e, t, n, r, o, i) => (Ha(!0), yf(r, o, Sm()));
var $o = "en-US";
var dy = $o;

function fy(e) {
    typeof e == "string" && (dy = e.toLowerCase().replace(/_/g, "-"))
}

function ai(e, t = "") {
    let n = Ae(),
        r = Ut(),
        o = e + Xe,
        i = r.firstCreatePass ? uc(r, o, 1, t, null) : r.data[o],
        s = hy(r, n, i, t, e);
    n[o] = s, Va() && ac(r, n, s, i), fr(i, !1)
}
var hy = (e, t, n, r, o) => (Ha(!0), Ev(t[Ke], r));

function py(e, t, n) {
    let r = Ut();
    if (r.firstCreatePass) {
        let o = _t(e);
        _a(n, r.data, r.blueprint, o, !0), _a(t, r.data, r.blueprint, o, !1)
    }
}

function _a(e, t, n, r, o) {
    if (e = we(e), Array.isArray(e))
        for (let i = 0; i < e.length; i++) _a(e[i], t, n, r, o);
    else {
        let i = Ut(),
            s = Ae(),
            a = St(),
            c = wn(e) ? e : we(e.provide),
            l = gd(e),
            u = a.providerIndexes & 1048575,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
        if (wn(e) || !e.multi) {
            let h = new Ht(l, o, Wt),
                g = Ys(c, t, o ? u : u + f, d);
            g === -1 ? (aa(Ro(a, s), i, c), Zs(i, e, t.length), t.push(c), a.directiveStart++, a.directiveEnd++, o && (a.providerIndexes += 1048576), n.push(h), s.push(h)) : (n[g] = h, s[g] = h)
        } else {
            let h = Ys(c, t, u + f, d),
                g = Ys(c, t, u, u + f),
                v = h >= 0 && n[h],
                x = g >= 0 && n[g];
            if (o && !x || !o && !v) {
                aa(Ro(a, s), i, c);
                let p = vy(o ? my : gy, n.length, o, r, l);
                !o && x && (n[g].providerFactory = p), Zs(i, e, t.length, 0), t.push(c), a.directiveStart++, a.directiveEnd++, o && (a.providerIndexes += 1048576), n.push(p), s.push(p)
            } else {
                let p = oh(n[o ? g : h], l, !o && r);
                Zs(i, e, h > -1 ? h : g, p)
            }!o && r && x && n[g].componentProviders++
        }
    }
}

function Zs(e, t, n, r) {
    let o = wn(t),
        i = Xg(t);
    if (o || i) {
        let c = (i ? we(t.useClass) : t).prototype.ngOnDestroy;
        if (c) {
            let l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
                let u = l.indexOf(n);
                u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c)
            } else l.push(n, c)
        }
    }
}

function oh(e, t, n) {
    return n && e.componentProviders++, e.multi.push(t) - 1
}

function Ys(e, t, n, r) {
    for (let o = n; o < r; o++)
        if (t[o] === e) return o;
    return -1
}

function gy(e, t, n, r) {
    return Sa(this.multi, [])
}

function my(e, t, n, r) {
    let o = this.multi,
        i;
    if (this.providerFactory) {
        let s = this.providerFactory.componentProviders,
            a = Fo(n, n[J], this.providerFactory.index, r);
        i = a.slice(0, s), Sa(o, i);
        for (let c = s; c < a.length; c++) i.push(a[c])
    } else i = [], Sa(o, i);
    return i
}

function Sa(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r())
    }
    return t
}

function vy(e, t, n, r, o) {
    let i = new Ht(e, n, Wt);
    return i.multi = [], i.index = t, i.componentProviders = 0, oh(i, o, r && !n), i
}

function ih(e, t = []) {
    return n => {
        n.providersResolver = (r, o) => py(r, o ? o(e) : e, t)
    }
}
var Aa = class {
        ngModuleFactory;
        componentFactories;
        constructor(t, n) {
            this.ngModuleFactory = t, this.componentFactories = n
        }
    },
    vc = (() => {
        class e {
            compileModuleSync(n) {
                return new ba(n)
            }
            compileModuleAsync(n) {
                return Promise.resolve(this.compileModuleSync(n))
            }
            compileModuleAndAllComponentsSync(n) {
                let r = this.compileModuleSync(n),
                    o = dd(n),
                    i = vf(o.declarations).reduce((s, a) => {
                        let c = En(a);
                        return c && s.push(new ur(c)), s
                    }, []);
                return new Aa(r, i)
            }
            compileModuleAndAllComponentsAsync(n) {
                return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
            }
            clearCache() {}
            clearCacheFor(n) {}
            getModuleId(n) {}
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();
var xy = (() => {
        class e {
            zone = F(De);
            changeDetectionScheduler = F(cr);
            applicationRef = F(It);
            _onMicrotaskEmptySubscription;
            initialize() {
                this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                    next: () => {
                        this.changeDetectionScheduler.runningTick || this.zone.run(() => {
                            this.applicationRef.tick()
                        })
                    }
                }))
            }
            ngOnDestroy() {
                this._onMicrotaskEmptySubscription?.unsubscribe()
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    yy = new $("", {
        factory: () => !1
    });

function sh({
    ngZoneFactory: e,
    ignoreChangesOutsideZone: t,
    scheduleInRootZone: n
}) {
    return e ??= () => new De(le(P({}, ch()), {
        scheduleInRootZone: n
    })), [{
        provide: De,
        useFactory: e
    }, {
        provide: Cn,
        multi: !0,
        useFactory: () => {
            let r = F(xy, {
                optional: !0
            });
            return () => r.initialize()
        }
    }, {
        provide: Cn,
        multi: !0,
        useFactory: () => {
            let r = F(Dy);
            return () => {
                r.initialize()
            }
        }
    }, t === !0 ? {
        provide: Jd,
        useValue: !0
    } : [], {
        provide: ef,
        useValue: n ?? Xd
    }]
}

function ah(e) {
    let t = e?.ignoreChangesOutsideZone,
        n = e?.scheduleInRootZone,
        r = sh({
            ngZoneFactory: () => {
                let o = ch(e);
                return o.scheduleInRootZone = n, o.shouldCoalesceEventChangeDetection && ti("NgZone_CoalesceEvent"), new De(o)
            },
            ignoreChangesOutsideZone: t,
            scheduleInRootZone: n
        });
    return qo([{
        provide: yy,
        useValue: !0
    }, {
        provide: Xo,
        useValue: !1
    }, r])
}

function ch(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1
    }
}
var Dy = (() => {
    class e {
        subscription = new fe;
        initialized = !1;
        zone = F(De);
        pendingTasks = F(An);
        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let n = null;
            !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => {
                this.subscription.add(this.zone.onStable.subscribe(() => {
                    De.assertNotInAngularZone(), queueMicrotask(() => {
                        n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null)
                    })
                }))
            }), this.subscription.add(this.zone.onUnstable.subscribe(() => {
                De.assertInAngularZone(), n ??= this.pendingTasks.add()
            }))
        }
        ngOnDestroy() {
            this.subscription.unsubscribe()
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = V({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();
var Cy = (() => {
    class e {
        appRef = F(It);
        taskService = F(An);
        ngZone = F(De);
        zonelessEnabled = F(Xo);
        tracing = F(ei, {
            optional: !0
        });
        disableScheduling = F(Jd, {
            optional: !0
        }) ?? !1;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{
            data: {
                __scheduler_tick__: !0
            }
        }];
        subscriptions = new fe;
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Oo) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (F(ef, {
            optional: !0
        }) ?? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
                this.runningTick || this.cleanup()
            })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
                this.runningTick || this.cleanup()
            })), this.disableScheduling ||= !this.zonelessEnabled && (this.ngZone instanceof fa || !this.zoneIsDefined)
        }
        notify(n) {
            if (!this.zonelessEnabled && n === 5) return;
            let r = !1;
            switch (n) {
                case 0: {
                    this.appRef.dirtyFlags |= 2;
                    break
                }
                case 3:
                case 2:
                case 4:
                case 5:
                case 1: {
                    this.appRef.dirtyFlags |= 4;
                    break
                }
                case 6: {
                    this.appRef.dirtyFlags |= 2, r = !0;
                    break
                }
                case 12: {
                    this.appRef.dirtyFlags |= 16, r = !0;
                    break
                }
                case 13: {
                    this.appRef.dirtyFlags |= 2, r = !0;
                    break
                }
                case 11: {
                    r = !0;
                    break
                }
                case 9:
                case 8:
                case 7:
                case 10:
                default:
                    this.appRef.dirtyFlags |= 8
            }
            if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick(r)) return;
            let o = this.useMicrotaskScheduler ? Fl : tf;
            this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick()))
        }
        shouldScheduleTick(n) {
            return !(this.disableScheduling && !n || this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(Oo + this.angularZoneId))
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed) return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return
            }!this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
                this.ngZone.run(() => {
                    this.runningTick = !0, this.appRef._tick()
                }, void 0, this.schedulerTickApplyArgs)
            } catch (r) {
                throw this.taskService.remove(n), r
            } finally {
                this.cleanup()
            }
            this.useMicrotaskScheduler = !0, Fl(() => {
                this.useMicrotaskScheduler = !1, this.taskService.remove(n)
            })
        }
        ngOnDestroy() {
            this.subscriptions.unsubscribe(), this.cleanup()
        }
        cleanup() {
            if (this.runningTick = !1, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
                let n = this.pendingRenderTaskId;
                this.pendingRenderTaskId = null, this.taskService.remove(n)
            }
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = V({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function Ey() {
    return typeof $localize < "u" && $localize.locale || $o
}
var xc = new $("", {
    providedIn: "root",
    factory: () => F(xc, G.Optional | G.SkipSelf) || Ey()
});
var Ma = new $(""),
    wy = new $("");

function tr(e) {
    return !e.moduleRef
}

function by(e) {
    let t = tr(e) ? e.r3Injector : e.moduleRef.injector,
        n = t.get(De);
    return n.run(() => {
        tr(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
        let r = t.get(bt, null),
            o;
        if (n.runOutsideAngular(() => {
                o = n.onError.subscribe({
                    next: i => {
                        r.handleError(i)
                    }
                })
            }), tr(e)) {
            let i = () => t.destroy(),
                s = e.platformInjector.get(Ma);
            s.add(i), t.onDestroy(() => {
                o.unsubscribe(), s.delete(i)
            })
        } else {
            let i = () => e.moduleRef.destroy(),
                s = e.platformInjector.get(Ma);
            s.add(i), e.moduleRef.onDestroy(() => {
                vo(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i)
            })
        }
        return _y(r, n, () => {
            let i = t.get(nh);
            return i.runInitializers(), i.donePromise.then(() => {
                let s = t.get(xc, $o);
                if (fy(s || $o), !t.get(wy, !0)) return tr(e) ? t.get(It) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
                if (tr(e)) {
                    let c = t.get(It);
                    return e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
                } else return Iy(e.moduleRef, e.allPlatformModules), e.moduleRef
            })
        })
    })
}

function Iy(e, t) {
    let n = e.injector.get(It);
    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach(r => n.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
    else throw new L(-403, !1);
    t.push(e)
}

function _y(e, t, n) {
    try {
        let r = n();
        return pr(r) ? r.catch(o => {
            throw t.runOutsideAngular(() => e.handleError(o)), o
        }) : r
    } catch (r) {
        throw t.runOutsideAngular(() => e.handleError(r)), r
    }
}
var xo = null;

function Sy(e = [], t) {
    return ot.create({
        name: t,
        providers: [{
            provide: Wo,
            useValue: "platform"
        }, {
            provide: Ma,
            useValue: new Set([() => xo = null])
        }, ...e]
    })
}

function Ay(e = []) {
    if (xo) return xo;
    let t = Sy(e);
    return xo = t, iy(), My(t), t
}

function My(e) {
    let t = e.get(Ya, null);
    Je(e, () => {
        t?.forEach(n => n())
    })
}
var gr = (() => {
    class e {
        static __NG_ELEMENT_ID__ = Ty
    }
    return e
})();

function Ty(e) {
    return Ny(St(), Ae(), (e & 16) === 16)
}

function Ny(e, t, n) {
    if (Zo(e) && !n) {
        let r = Lt(e.index, t);
        return new jo(r, r)
    } else if (e.type & 175) {
        let r = t[rt];
        return new jo(r, t)
    }
    return null
}

function uh(e) {
    de(8);
    try {
        let {
            rootComponent: t,
            appProviders: n,
            platformProviders: r
        } = e, o = Ay(r), i = [sh({}), {
            provide: cr,
            useExisting: Cy
        }, ...n || []], s = new Ho({
            providers: i,
            parent: o,
            debugName: "",
            runEnvironmentInitializers: !1
        });
        return by({
            r3Injector: s.injector,
            platformInjector: o,
            rootComponent: t
        })
    } catch (t) {
        return Promise.reject(t)
    } finally {
        de(9)
    }
}
var Ql = class {
    [tn];
    constructor(t) {
        this[tn] = t
    }
    destroy() {
        this[tn].destroy()
    }
};
var mh = null;

function Nn() {
    return mh
}

function vh(e) {
    mh ??= e
}
var ci = class {};
var Me = new $(""),
    xh = (() => {
        class e {
            historyGo(n) {
                throw new Error("")
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => F(Oy),
                providedIn: "platform"
            })
        }
        return e
    })();
var Oy = (() => {
    class e extends xh {
        _location;
        _history;
        _doc = F(Me);
        constructor() {
            super(), this._location = window.location, this._history = window.history
        }
        getBaseHrefFromDOM() {
            return Nn().getBaseHref(this._doc)
        }
        onPopState(n) {
            let r = Nn().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", n, !1), () => r.removeEventListener("popstate", n)
        }
        onHashChange(n) {
            let r = Nn().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", n, !1), () => r.removeEventListener("hashchange", n)
        }
        get href() {
            return this._location.href
        }
        get protocol() {
            return this._location.protocol
        }
        get hostname() {
            return this._location.hostname
        }
        get port() {
            return this._location.port
        }
        get pathname() {
            return this._location.pathname
        }
        get search() {
            return this._location.search
        }
        get hash() {
            return this._location.hash
        }
        set pathname(n) {
            this._location.pathname = n
        }
        pushState(n, r, o) {
            this._history.pushState(n, r, o)
        }
        replaceState(n, r, o) {
            this._history.replaceState(n, r, o)
        }
        forward() {
            this._history.forward()
        }
        back() {
            this._history.back()
        }
        historyGo(n = 0) {
            this._history.go(n)
        }
        getState() {
            return this._history.state
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = V({
            token: e,
            factory: () => new e,
            providedIn: "platform"
        })
    }
    return e
})();

function yh(e, t) {
    return e ? t ? e.endsWith("/") ? t.startsWith("/") ? e + t.slice(1) : e + t : t.startsWith("/") ? e + t : `${e}/${t}` : e : t
}

function lh(e) {
    let t = e.search(/#|\?|$/);
    return e[t - 1] === "/" ? e.slice(0, t - 1) + e.slice(t) : e
}

function Gt(e) {
    return e && e[0] !== "?" ? `?${e}` : e
}
var li = (() => {
        class e {
            historyGo(n) {
                throw new Error("")
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => F(Dh),
                providedIn: "root"
            })
        }
        return e
    })(),
    Py = new $(""),
    Dh = (() => {
        class e extends li {
            _platformLocation;
            _baseHref;
            _removeListenerFns = [];
            constructor(n, r) {
                super(), this._platformLocation = n, this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? F(Me).location?.origin ?? ""
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
            }
            onPopState(n) {
                this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
            }
            getBaseHref() {
                return this._baseHref
            }
            prepareExternalUrl(n) {
                return yh(this._baseHref, n)
            }
            path(n = !1) {
                let r = this._platformLocation.pathname + Gt(this._platformLocation.search),
                    o = this._platformLocation.hash;
                return o && n ? `${r}${o}` : r
            }
            pushState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + Gt(i));
                this._platformLocation.pushState(n, r, s)
            }
            replaceState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + Gt(i));
                this._platformLocation.replaceState(n, r, s)
            }
            forward() {
                this._platformLocation.forward()
            }
            back() {
                this._platformLocation.back()
            }
            getState() {
                return this._platformLocation.getState()
            }
            historyGo(n = 0) {
                this._platformLocation.historyGo?.(n)
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(xh), Z(Py, 8))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();
var vr = (() => {
    class e {
        _subject = new Ee;
        _basePath;
        _locationStrategy;
        _urlChangeListeners = [];
        _urlChangeSubscription = null;
        constructor(n) {
            this._locationStrategy = n;
            let r = this._locationStrategy.getBaseHref();
            this._basePath = jy(lh(dh(r))), this._locationStrategy.onPopState(o => {
                this._subject.next({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type
                })
            })
        }
        ngOnDestroy() {
            this._urlChangeSubscription?.unsubscribe(), this._urlChangeListeners = []
        }
        path(n = !1) {
            return this.normalize(this._locationStrategy.path(n))
        }
        getState() {
            return this._locationStrategy.getState()
        }
        isCurrentPathEqualTo(n, r = "") {
            return this.path() == this.normalize(n + Gt(r))
        }
        normalize(n) {
            return e.stripTrailingSlash(Ly(this._basePath, dh(n)))
        }
        prepareExternalUrl(n) {
            return n && n[0] !== "/" && (n = "/" + n), this._locationStrategy.prepareExternalUrl(n)
        }
        go(n, r = "", o = null) {
            this._locationStrategy.pushState(o, "", n, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Gt(r)), o)
        }
        replaceState(n, r = "", o = null) {
            this._locationStrategy.replaceState(o, "", n, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Gt(r)), o)
        }
        forward() {
            this._locationStrategy.forward()
        }
        back() {
            this._locationStrategy.back()
        }
        historyGo(n = 0) {
            this._locationStrategy.historyGo?.(n)
        }
        onUrlChange(n) {
            return this._urlChangeListeners.push(n), this._urlChangeSubscription ??= this.subscribe(r => {
                this._notifyUrlChangeListeners(r.url, r.state)
            }), () => {
                let r = this._urlChangeListeners.indexOf(n);
                this._urlChangeListeners.splice(r, 1), this._urlChangeListeners.length === 0 && (this._urlChangeSubscription?.unsubscribe(), this._urlChangeSubscription = null)
            }
        }
        _notifyUrlChangeListeners(n = "", r) {
            this._urlChangeListeners.forEach(o => o(n, r))
        }
        subscribe(n, r, o) {
            return this._subject.subscribe({
                next: n,
                error: r ?? void 0,
                complete: o ?? void 0
            })
        }
        static normalizeQueryParams = Gt;
        static joinWithSlash = yh;
        static stripTrailingSlash = lh;
        static \u0275fac = function(r) {
            return new(r || e)(Z(li))
        };
        static \u0275prov = V({
            token: e,
            factory: () => By(),
            providedIn: "root"
        })
    }
    return e
})();

function By() {
    return new vr(Z(li))
}

function Ly(e, t) {
    if (!e || !t.startsWith(e)) return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t
}

function dh(e) {
    return e.replace(/\/index.html$/, "")
}

function jy(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let [, n] = e.split(/\/\/[^\/]+/);
        return n
    }
    return e
}

function Ch(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("="),
            [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (o.trim() === t) return decodeURIComponent(i)
    }
    return null
}
var yc = "browser",
    Vy = "server";

function Eh(e) {
    return e === yc
}

function Dc(e) {
    return e === Vy
}
var ui = class {};
var Ec = class extends ci {
        supportsDOMEvents = !0
    },
    wc = class e extends Ec {
        static makeCurrent() {
            vh(new e)
        }
        onAndCancel(t, n, r, o) {
            return t.addEventListener(n, r, o), () => {
                t.removeEventListener(n, r, o)
            }
        }
        dispatchEvent(t, n) {
            t.dispatchEvent(n)
        }
        remove(t) {
            t.remove()
        }
        createElement(t, n) {
            return n = n || this.getDefaultDocument(), n.createElement(t)
        }
        createHtmlDocument() {
            return document.implementation.createHTMLDocument("fakeTitle")
        }
        getDefaultDocument() {
            return document
        }
        isElementNode(t) {
            return t.nodeType === Node.ELEMENT_NODE
        }
        isShadowRoot(t) {
            return t instanceof DocumentFragment
        }
        getGlobalEventTarget(t, n) {
            return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null
        }
        getBaseHref(t) {
            let n = Hy();
            return n == null ? null : $y(n)
        }
        resetBaseElement() {
            xr = null
        }
        getUserAgent() {
            return window.navigator.userAgent
        }
        getCookie(t) {
            return Ch(document.cookie, t)
        }
    },
    xr = null;

function Hy() {
    return xr = xr || document.querySelector("base"), xr ? xr.getAttribute("href") : null
}

function $y(e) {
    return new URL(e, document.baseURI).pathname
}
var Uy = (() => {
        class e {
            build() {
                return new XMLHttpRequest
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    bc = new $(""),
    Ah = (() => {
        class e {
            _zone;
            _plugins;
            _eventNameToPlugin = new Map;
            constructor(n, r) {
                this._zone = r, n.forEach(o => {
                    o.manager = this
                }), this._plugins = n.slice().reverse()
            }
            addEventListener(n, r, o, i) {
                return this._findPluginFor(r).addEventListener(n, r, o, i)
            }
            getZone() {
                return this._zone
            }
            _findPluginFor(n) {
                let r = this._eventNameToPlugin.get(n);
                if (r) return r;
                if (r = this._plugins.find(i => i.supports(n)), !r) throw new L(5101, !1);
                return this._eventNameToPlugin.set(n, r), r
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(bc), Z(De))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    fi = class {
        _doc;
        constructor(t) {
            this._doc = t
        }
        manager
    },
    di = "ng-app-id";

function wh(e) {
    for (let t of e) t.remove()
}

function bh(e, t) {
    let n = t.createElement("style");
    return n.textContent = e, n
}

function zy(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${di}="${t}"],link[${di}="${t}"]`);
    if (o)
        for (let i of o) i.removeAttribute(di), i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
            usage: 0,
            elements: [i]
        }) : i.textContent && n.set(i.textContent, {
            usage: 0,
            elements: [i]
        })
}

function Ic(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n
}
var Mh = (() => {
        class e {
            doc;
            appId;
            nonce;
            inline = new Map;
            external = new Map;
            hosts = new Set;
            isServer;
            constructor(n, r, o, i = {}) {
                this.doc = n, this.appId = r, this.nonce = o, this.isServer = Dc(i), zy(n, r, this.inline, this.external), this.hosts.add(n.head)
            }
            addStyles(n, r) {
                for (let o of n) this.addUsage(o, this.inline, bh);
                r?.forEach(o => this.addUsage(o, this.external, Ic))
            }
            removeStyles(n, r) {
                for (let o of n) this.removeUsage(o, this.inline);
                r?.forEach(o => this.removeUsage(o, this.external))
            }
            addUsage(n, r, o) {
                let i = r.get(n);
                i ? i.usage++ : r.set(n, {
                    usage: 1,
                    elements: [...this.hosts].map(s => this.addElement(s, o(n, this.doc)))
                })
            }
            removeUsage(n, r) {
                let o = r.get(n);
                o && (o.usage--, o.usage <= 0 && (wh(o.elements), r.delete(n)))
            }
            ngOnDestroy() {
                for (let [, {
                        elements: n
                    }] of [...this.inline, ...this.external]) wh(n);
                this.hosts.clear()
            }
            addHost(n) {
                this.hosts.add(n);
                for (let [r, {
                        elements: o
                    }] of this.inline) o.push(this.addElement(n, bh(r, this.doc)));
                for (let [r, {
                        elements: o
                    }] of this.external) o.push(this.addElement(n, Ic(r, this.doc)))
            }
            removeHost(n) {
                this.hosts.delete(n)
            }
            addElement(n, r) {
                return this.nonce && r.setAttribute("nonce", this.nonce), this.isServer && r.setAttribute(di, this.appId), n.appendChild(r)
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(Me), Z(Za), Z(Qa, 8), Z(zt))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    Cc = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/Math/MathML"
    },
    Sc = /%COMP%/g;
var Th = "%COMP%",
    qy = `_nghost-${Th}`,
    Wy = `_ngcontent-${Th}`,
    Gy = !0,
    Zy = new $("", {
        providedIn: "root",
        factory: () => Gy
    });

function Yy(e) {
    return Wy.replace(Sc, e)
}

function Qy(e) {
    return qy.replace(Sc, e)
}

function Nh(e, t) {
    return t.map(n => n.replace(Sc, e))
}
var Ih = (() => {
        class e {
            eventManager;
            sharedStylesHost;
            appId;
            removeStylesOnCompDestroy;
            doc;
            platformId;
            ngZone;
            nonce;
            tracingService;
            rendererByCompId = new Map;
            defaultRenderer;
            platformIsServer;
            constructor(n, r, o, i, s, a, c, l = null, u = null) {
                this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = i, this.doc = s, this.platformId = a, this.ngZone = c, this.nonce = l, this.tracingService = u, this.platformIsServer = Dc(a), this.defaultRenderer = new yr(n, s, c, this.platformIsServer, this.tracingService)
            }
            createRenderer(n, r) {
                if (!n || !r) return this.defaultRenderer;
                this.platformIsServer && r.encapsulation === it.ShadowDom && (r = le(P({}, r), {
                    encapsulation: it.Emulated
                }));
                let o = this.getOrCreateRenderer(n, r);
                return o instanceof hi ? o.applyToHost(n) : o instanceof Dr && o.applyStyles(), o
            }
            getOrCreateRenderer(n, r) {
                let o = this.rendererByCompId,
                    i = o.get(r.id);
                if (!i) {
                    let s = this.doc,
                        a = this.ngZone,
                        c = this.eventManager,
                        l = this.sharedStylesHost,
                        u = this.removeStylesOnCompDestroy,
                        d = this.platformIsServer,
                        f = this.tracingService;
                    switch (r.encapsulation) {
                        case it.Emulated:
                            i = new hi(c, l, r, this.appId, u, s, a, d, f);
                            break;
                        case it.ShadowDom:
                            return new _c(c, l, n, r, s, a, this.nonce, d, f);
                        default:
                            i = new Dr(c, l, r, u, s, a, d, f);
                            break
                    }
                    o.set(r.id, i)
                }
                return i
            }
            ngOnDestroy() {
                this.rendererByCompId.clear()
            }
            componentReplaced(n) {
                this.rendererByCompId.delete(n)
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(Ah), Z(Mh), Z(Za), Z(Zy), Z(Me), Z(zt), Z(De), Z(Qa), Z(ei, 8))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    yr = class {
        eventManager;
        doc;
        ngZone;
        platformIsServer;
        tracingService;
        data = Object.create(null);
        throwOnSyntheticProps = !0;
        constructor(t, n, r, o, i) {
            this.eventManager = t, this.doc = n, this.ngZone = r, this.platformIsServer = o, this.tracingService = i
        }
        destroy() {}
        destroyNode = null;
        createElement(t, n) {
            return n ? this.doc.createElementNS(Cc[n] || n, t) : this.doc.createElement(t)
        }
        createComment(t) {
            return this.doc.createComment(t)
        }
        createText(t) {
            return this.doc.createTextNode(t)
        }
        appendChild(t, n) {
            (_h(t) ? t.content : t).appendChild(n)
        }
        insertBefore(t, n, r) {
            t && (_h(t) ? t.content : t).insertBefore(n, r)
        }
        removeChild(t, n) {
            n.remove()
        }
        selectRootElement(t, n) {
            let r = typeof t == "string" ? this.doc.querySelector(t) : t;
            if (!r) throw new L(-5104, !1);
            return n || (r.textContent = ""), r
        }
        parentNode(t) {
            return t.parentNode
        }
        nextSibling(t) {
            return t.nextSibling
        }
        setAttribute(t, n, r, o) {
            if (o) {
                n = o + ":" + n;
                let i = Cc[o];
                i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
            } else t.setAttribute(n, r)
        }
        removeAttribute(t, n, r) {
            if (r) {
                let o = Cc[r];
                o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
            } else t.removeAttribute(n)
        }
        addClass(t, n) {
            t.classList.add(n)
        }
        removeClass(t, n) {
            t.classList.remove(n)
        }
        setStyle(t, n, r, o) {
            o & (qt.DashCase | qt.Important) ? t.style.setProperty(n, r, o & qt.Important ? "important" : "") : t.style[n] = r
        }
        removeStyle(t, n, r) {
            r & qt.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
        }
        setProperty(t, n, r) {
            t != null && (t[n] = r)
        }
        setValue(t, n) {
            t.nodeValue = n
        }
        listen(t, n, r, o) {
            if (typeof t == "string" && (t = Nn().getGlobalEventTarget(this.doc, t), !t)) throw new L(5102, !1);
            let i = this.decoratePreventDefault(r);
            return this.tracingService?.wrapEventListener && (i = this.tracingService.wrapEventListener(t, n, i)), this.eventManager.addEventListener(t, n, i, o)
        }
        decoratePreventDefault(t) {
            return n => {
                if (n === "__ngUnwrap__") return t;
                (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) === !1 && n.preventDefault()
            }
        }
    };

function _h(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0
}
var _c = class extends yr {
        sharedStylesHost;
        hostEl;
        shadowRoot;
        constructor(t, n, r, o, i, s, a, c, l) {
            super(t, i, s, c, l), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({
                mode: "open"
            }), this.sharedStylesHost.addHost(this.shadowRoot);
            let u = o.styles;
            u = Nh(o.id, u);
            for (let f of u) {
                let h = document.createElement("style");
                a && h.setAttribute("nonce", a), h.textContent = f, this.shadowRoot.appendChild(h)
            }
            let d = o.getExternalStyles?.();
            if (d)
                for (let f of d) {
                    let h = Ic(f, i);
                    a && h.setAttribute("nonce", a), this.shadowRoot.appendChild(h)
                }
        }
        nodeOrShadowRoot(t) {
            return t === this.hostEl ? this.shadowRoot : t
        }
        appendChild(t, n) {
            return super.appendChild(this.nodeOrShadowRoot(t), n)
        }
        insertBefore(t, n, r) {
            return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
        }
        removeChild(t, n) {
            return super.removeChild(null, n)
        }
        parentNode(t) {
            return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
        }
        destroy() {
            this.sharedStylesHost.removeHost(this.shadowRoot)
        }
    },
    Dr = class extends yr {
        sharedStylesHost;
        removeStylesOnCompDestroy;
        styles;
        styleUrls;
        constructor(t, n, r, o, i, s, a, c, l) {
            super(t, i, s, a, c), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = o;
            let u = r.styles;
            this.styles = l ? Nh(l, u) : u, this.styleUrls = r.getExternalStyles?.(l)
        }
        applyStyles() {
            this.sharedStylesHost.addStyles(this.styles, this.styleUrls)
        }
        destroy() {
            this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls)
        }
    },
    hi = class extends Dr {
        contentAttr;
        hostAttr;
        constructor(t, n, r, o, i, s, a, c, l) {
            let u = o + "-" + r.id;
            super(t, n, r, i, s, a, c, l, u), this.contentAttr = Yy(u), this.hostAttr = Qy(u)
        }
        applyToHost(t) {
            this.applyStyles(), this.setAttribute(t, this.hostAttr, "")
        }
        createElement(t, n) {
            let r = super.createElement(t, n);
            return super.setAttribute(r, this.contentAttr, ""), r
        }
    },
    Ky = (() => {
        class e extends fi {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return !0
            }
            addEventListener(n, r, o, i) {
                return n.addEventListener(r, o, i), () => this.removeEventListener(n, r, o, i)
            }
            removeEventListener(n, r, o, i) {
                return n.removeEventListener(r, o, i)
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(Me))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    Sh = ["alt", "control", "meta", "shift"],
    Xy = {
        "\b": "Backspace",
        "	": "Tab",
        "\x7F": "Delete",
        "\x1B": "Escape",
        Del: "Delete",
        Esc: "Escape",
        Left: "ArrowLeft",
        Right: "ArrowRight",
        Up: "ArrowUp",
        Down: "ArrowDown",
        Menu: "ContextMenu",
        Scroll: "ScrollLock",
        Win: "OS"
    },
    Jy = {
        alt: e => e.altKey,
        control: e => e.ctrlKey,
        meta: e => e.metaKey,
        shift: e => e.shiftKey
    },
    eD = (() => {
        class e extends fi {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return e.parseEventName(n) != null
            }
            addEventListener(n, r, o, i) {
                let s = e.parseEventName(r),
                    a = e.eventCallback(s.fullKey, o, this.manager.getZone());
                return this.manager.getZone().runOutsideAngular(() => Nn().onAndCancel(n, s.domEventName, a, i))
            }
            static parseEventName(n) {
                let r = n.toLowerCase().split("."),
                    o = r.shift();
                if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
                let i = e._normalizeKey(r.pop()),
                    s = "",
                    a = r.indexOf("code");
                if (a > -1 && (r.splice(a, 1), s = "code."), Sh.forEach(l => {
                        let u = r.indexOf(l);
                        u > -1 && (r.splice(u, 1), s += l + ".")
                    }), s += i, r.length != 0 || i.length === 0) return null;
                let c = {};
                return c.domEventName = o, c.fullKey = s, c
            }
            static matchEventFullKeyCode(n, r) {
                let o = Xy[n.key] || n.key,
                    i = "";
                return r.indexOf("code.") > -1 && (o = n.code, i = "code."), o == null || !o ? !1 : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), Sh.forEach(s => {
                    if (s !== o) {
                        let a = Jy[s];
                        a(n) && (i += s + ".")
                    }
                }), i += o, i === r)
            }
            static eventCallback(n, r, o) {
                return i => {
                    e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i))
                }
            }
            static _normalizeKey(n) {
                return n === "esc" ? "escape" : n
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(Me))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })();

function Rh(e, t) {
    return uh(P({
        rootComponent: e
    }, tD(t)))
}

function tD(e) {
    return {
        appProviders: [...sD, ...e?.providers ?? []],
        platformProviders: iD
    }
}

function nD() {
    wc.makeCurrent()
}

function rD() {
    return new bt
}

function oD() {
    return df(document), document
}
var iD = [{
    provide: zt,
    useValue: yc
}, {
    provide: Ya,
    useValue: nD,
    multi: !0
}, {
    provide: Me,
    useFactory: oD,
    deps: []
}];
var sD = [{
        provide: Wo,
        useValue: "root"
    }, {
        provide: bt,
        useFactory: rD,
        deps: []
    }, {
        provide: bc,
        useClass: Ky,
        multi: !0,
        deps: [Me]
    }, {
        provide: bc,
        useClass: eD,
        multi: !0,
        deps: [Me]
    }, Ih, Mh, Ah, {
        provide: _n,
        useExisting: Ih
    }, {
        provide: ui,
        useClass: Uy,
        deps: []
    },
    []
];
var Fh = (() => {
    class e {
        _doc;
        constructor(n) {
            this._doc = n
        }
        getTitle() {
            return this._doc.title
        }
        setTitle(n) {
            this._doc.title = n || ""
        }
        static \u0275fac = function(r) {
            return new(r || e)(Z(Me))
        };
        static \u0275prov = V({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();
var z = "primary",
    Pr = Symbol("RouteTitle"),
    Rc = class {
        params;
        constructor(t) {
            this.params = t || {}
        }
        has(t) {
            return Object.prototype.hasOwnProperty.call(this.params, t)
        }
        get(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n[0] : n
            }
            return null
        }
        getAll(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n : [n]
            }
            return []
        }
        get keys() {
            return Object.keys(this.params)
        }
    };

function Bn(e) {
    return new Rc(e)
}

function cD(e, t, n) {
    let r = n.path.split("/");
    if (r.length > e.length || n.pathMatch === "full" && (t.hasChildren() || r.length < e.length)) return null;
    let o = {};
    for (let i = 0; i < r.length; i++) {
        let s = r[i],
            a = e[i];
        if (s[0] === ":") o[s.substring(1)] = a;
        else if (s !== a.path) return null
    }
    return {
        consumed: e.slice(0, r.length),
        posParams: o
    }
}

function uD(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; ++n)
        if (!st(e[n], t[n])) return !1;
    return !0
}

function st(e, t) {
    let n = e ? Fc(e) : void 0,
        r = t ? Fc(t) : void 0;
    if (!n || !r || n.length != r.length) return !1;
    let o;
    for (let i = 0; i < n.length; i++)
        if (o = n[i], !Hh(e[o], t[o])) return !1;
    return !0
}

function Fc(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}

function Hh(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1;
        let n = [...e].sort(),
            r = [...t].sort();
        return n.every((o, i) => r[i] === o)
    } else return e === t
}

function $h(e) {
    return e.length > 0 ? e[e.length - 1] : null
}

function At(e) {
    return ks(e) ? e : pr(e) ? pe(Promise.resolve(e)) : U(e)
}
var lD = {
        exact: zh,
        subset: qh
    },
    Uh = {
        exact: dD,
        subset: fD,
        ignored: () => !0
    };

function kh(e, t, n) {
    return lD[n.paths](e.root, t.root, n.matrixParams) && Uh[n.queryParams](e.queryParams, t.queryParams) && !(n.fragment === "exact" && e.fragment !== t.fragment)
}

function dD(e, t) {
    return st(e, t)
}

function zh(e, t, n) {
    if (!Yt(e.segments, t.segments) || !mi(e.segments, t.segments, n) || e.numberOfChildren !== t.numberOfChildren) return !1;
    for (let r in t.children)
        if (!e.children[r] || !zh(e.children[r], t.children[r], n)) return !1;
    return !0
}

function fD(e, t) {
    return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => Hh(e[n], t[n]))
}

function qh(e, t, n) {
    return Wh(e, t, t.segments, n)
}

function Wh(e, t, n, r) {
    if (e.segments.length > n.length) {
        let o = e.segments.slice(0, n.length);
        return !(!Yt(o, n) || t.hasChildren() || !mi(o, n, r))
    } else if (e.segments.length === n.length) {
        if (!Yt(e.segments, n) || !mi(e.segments, n, r)) return !1;
        for (let o in t.children)
            if (!e.children[o] || !qh(e.children[o], t.children[o], r)) return !1;
        return !0
    } else {
        let o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
        return !Yt(e.segments, o) || !mi(e.segments, o, r) || !e.children[z] ? !1 : Wh(e.children[z], t, i, r)
    }
}

function mi(e, t, n) {
    return t.every((r, o) => Uh[n](e[o].parameters, r.parameters))
}
var pt = class {
        root;
        queryParams;
        fragment;
        _queryParamMap;
        constructor(t = new oe([], {}), n = {}, r = null) {
            this.root = t, this.queryParams = n, this.fragment = r
        }
        get queryParamMap() {
            return this._queryParamMap ??= Bn(this.queryParams), this._queryParamMap
        }
        toString() {
            return gD.serialize(this)
        }
    },
    oe = class {
        segments;
        children;
        parent = null;
        constructor(t, n) {
            this.segments = t, this.children = n, Object.values(n).forEach(r => r.parent = this)
        }
        hasChildren() {
            return this.numberOfChildren > 0
        }
        get numberOfChildren() {
            return Object.keys(this.children).length
        }
        toString() {
            return vi(this)
        }
    },
    Zt = class {
        path;
        parameters;
        _parameterMap;
        constructor(t, n) {
            this.path = t, this.parameters = n
        }
        get parameterMap() {
            return this._parameterMap ??= Bn(this.parameters), this._parameterMap
        }
        toString() {
            return Zh(this)
        }
    };

function hD(e, t) {
    return Yt(e, t) && e.every((n, r) => st(n.parameters, t[r].parameters))
}

function Yt(e, t) {
    return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path)
}

function pD(e, t) {
    let n = [];
    return Object.entries(e.children).forEach(([r, o]) => {
        r === z && (n = n.concat(t(o, r)))
    }), Object.entries(e.children).forEach(([r, o]) => {
        r !== z && (n = n.concat(t(o, r)))
    }), n
}
var iu = (() => {
        class e {
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => new _r,
                providedIn: "root"
            })
        }
        return e
    })(),
    _r = class {
        parse(t) {
            let n = new Oc(t);
            return new pt(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment())
        }
        serialize(t) {
            let n = `/${Cr(t.root,!0)}`,
                r = xD(t.queryParams),
                o = typeof t.fragment == "string" ? `#${mD(t.fragment)}` : "";
            return `${n}${r}${o}`
        }
    },
    gD = new _r;

function vi(e) {
    return e.segments.map(t => Zh(t)).join("/")
}

function Cr(e, t) {
    if (!e.hasChildren()) return vi(e);
    if (t) {
        let n = e.children[z] ? Cr(e.children[z], !1) : "",
            r = [];
        return Object.entries(e.children).forEach(([o, i]) => {
            o !== z && r.push(`${o}:${Cr(i,!1)}`)
        }), r.length > 0 ? `${n}(${r.join("//")})` : n
    } else {
        let n = pD(e, (r, o) => o === z ? [Cr(e.children[z], !1)] : [`${o}:${Cr(r,!1)}`]);
        return Object.keys(e.children).length === 1 && e.children[z] != null ? `${vi(e)}/${n[0]}` : `${vi(e)}/(${n.join("//")})`
    }
}

function Gh(e) {
    return encodeURIComponent(e).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
}

function pi(e) {
    return Gh(e).replace(/%3B/gi, ";")
}

function mD(e) {
    return encodeURI(e)
}

function kc(e) {
    return Gh(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}

function xi(e) {
    return decodeURIComponent(e)
}

function Oh(e) {
    return xi(e.replace(/\+/g, "%20"))
}

function Zh(e) {
    return `${kc(e.path)}${vD(e.parameters)}`
}

function vD(e) {
    return Object.entries(e).map(([t, n]) => `;${kc(t)}=${kc(n)}`).join("")
}

function xD(e) {
    let t = Object.entries(e).map(([n, r]) => Array.isArray(r) ? r.map(o => `${pi(n)}=${pi(o)}`).join("&") : `${pi(n)}=${pi(r)}`).filter(n => n);
    return t.length ? `?${t.join("&")}` : ""
}
var yD = /^[^\/()?;#]+/;

function Ac(e) {
    let t = e.match(yD);
    return t ? t[0] : ""
}
var DD = /^[^\/()?;=#]+/;

function CD(e) {
    let t = e.match(DD);
    return t ? t[0] : ""
}
var ED = /^[^=?&#]+/;

function wD(e) {
    let t = e.match(ED);
    return t ? t[0] : ""
}
var bD = /^[^&#]+/;

function ID(e) {
    let t = e.match(bD);
    return t ? t[0] : ""
}
var Oc = class {
    url;
    remaining;
    constructor(t) {
        this.url = t, this.remaining = t
    }
    parseRootSegment() {
        return this.consumeOptional("/"), this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#") ? new oe([], {}) : new oe([], this.parseChildren())
    }
    parseQueryParams() {
        let t = {};
        if (this.consumeOptional("?"))
            do this.parseQueryParam(t); while (this.consumeOptional("&"));
        return t
    }
    parseFragment() {
        return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
    }
    parseChildren() {
        if (this.remaining === "") return {};
        this.consumeOptional("/");
        let t = [];
        for (this.peekStartsWith("(") || t.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");) this.capture("/"), t.push(this.parseSegment());
        let n = {};
        this.peekStartsWith("/(") && (this.capture("/"), n = this.parseParens(!0));
        let r = {};
        return this.peekStartsWith("(") && (r = this.parseParens(!1)), (t.length > 0 || Object.keys(n).length > 0) && (r[z] = new oe(t, n)), r
    }
    parseSegment() {
        let t = Ac(this.remaining);
        if (t === "" && this.peekStartsWith(";")) throw new L(4009, !1);
        return this.capture(t), new Zt(xi(t), this.parseMatrixParams())
    }
    parseMatrixParams() {
        let t = {};
        for (; this.consumeOptional(";");) this.parseParam(t);
        return t
    }
    parseParam(t) {
        let n = CD(this.remaining);
        if (!n) return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let o = Ac(this.remaining);
            o && (r = o, this.capture(r))
        }
        t[xi(n)] = xi(r)
    }
    parseQueryParam(t) {
        let n = wD(this.remaining);
        if (!n) return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = ID(this.remaining);
            s && (r = s, this.capture(r))
        }
        let o = Oh(n),
            i = Oh(r);
        if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || (s = [s], t[o] = s), s.push(i)
        } else t[o] = i
    }
    parseParens(t) {
        let n = {};
        for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
            let r = Ac(this.remaining),
                o = this.remaining[r.length];
            if (o !== "/" && o !== ")" && o !== ";") throw new L(4010, !1);
            let i;
            r.indexOf(":") > -1 ? (i = r.slice(0, r.indexOf(":")), this.capture(i), this.capture(":")) : t && (i = z);
            let s = this.parseChildren();
            n[i] = Object.keys(s).length === 1 ? s[z] : new oe([], s), this.consumeOptional("//")
        }
        return n
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t)
    }
    consumeOptional(t) {
        return this.peekStartsWith(t) ? (this.remaining = this.remaining.substring(t.length), !0) : !1
    }
    capture(t) {
        if (!this.consumeOptional(t)) throw new L(4011, !1)
    }
};

function Yh(e) {
    return e.segments.length > 0 ? new oe([], {
        [z]: e
    }) : e
}

function Qh(e) {
    let t = {};
    for (let [r, o] of Object.entries(e.children)) {
        let i = Qh(o);
        if (r === z && i.segments.length === 0 && i.hasChildren())
            for (let [s, a] of Object.entries(i.children)) t[s] = a;
        else(i.segments.length > 0 || i.hasChildren()) && (t[r] = i)
    }
    let n = new oe(e.segments, t);
    return _D(n)
}

function _D(e) {
    if (e.numberOfChildren === 1 && e.children[z]) {
        let t = e.children[z];
        return new oe(e.segments.concat(t.segments), t.children)
    }
    return e
}

function Sr(e) {
    return e instanceof pt
}

function SD(e, t, n = null, r = null) {
    let o = Kh(e);
    return Xh(o, t, n, r)
}

function Kh(e) {
    let t;

    function n(i) {
        let s = {};
        for (let c of i.children) {
            let l = n(c);
            s[c.outlet] = l
        }
        let a = new oe(i.url, s);
        return i === e && (t = a), a
    }
    let r = n(e.root),
        o = Yh(r);
    return t ?? o
}

function Xh(e, t, n, r) {
    let o = e;
    for (; o.parent;) o = o.parent;
    if (t.length === 0) return Mc(o, o, o, n, r);
    let i = AD(t);
    if (i.toRoot()) return Mc(o, o, new oe([], {}), n, r);
    let s = MD(i, o, e),
        a = s.processChildren ? wr(s.segmentGroup, s.index, i.commands) : e0(s.segmentGroup, s.index, i.commands);
    return Mc(o, s.segmentGroup, a, n, r)
}

function yi(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath
}

function Ar(e) {
    return typeof e == "object" && e != null && e.outlets
}

function Mc(e, t, n, r, o) {
    let i = {};
    r && Object.entries(r).forEach(([c, l]) => {
        i[c] = Array.isArray(l) ? l.map(u => `${u}`) : `${l}`
    });
    let s;
    e === t ? s = n : s = Jh(e, t, n);
    let a = Yh(Qh(s));
    return new pt(a, i, o)
}

function Jh(e, t, n) {
    let r = {};
    return Object.entries(e.children).forEach(([o, i]) => {
        i === t ? r[o] = n : r[o] = Jh(i, t, n)
    }), new oe(e.segments, r)
}
var Di = class {
    isAbsolute;
    numberOfDoubleDots;
    commands;
    constructor(t, n, r) {
        if (this.isAbsolute = t, this.numberOfDoubleDots = n, this.commands = r, t && r.length > 0 && yi(r[0])) throw new L(4003, !1);
        let o = r.find(Ar);
        if (o && o !== $h(r)) throw new L(4004, !1)
    }
    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    }
};

function AD(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/") return new Di(!0, 0, e);
    let t = 0,
        n = !1,
        r = e.reduce((o, i, s) => {
            if (typeof i == "object" && i != null) {
                if (i.outlets) {
                    let a = {};
                    return Object.entries(i.outlets).forEach(([c, l]) => {
                        a[c] = typeof l == "string" ? l.split("/") : l
                    }), [...o, {
                        outlets: a
                    }]
                }
                if (i.segmentPath) return [...o, i.segmentPath]
            }
            return typeof i != "string" ? [...o, i] : s === 0 ? (i.split("/").forEach((a, c) => {
                c == 0 && a === "." || (c == 0 && a === "" ? n = !0 : a === ".." ? t++ : a != "" && o.push(a))
            }), o) : [...o, i]
        }, []);
    return new Di(n, t, r)
}
var kn = class {
    segmentGroup;
    processChildren;
    index;
    constructor(t, n, r) {
        this.segmentGroup = t, this.processChildren = n, this.index = r
    }
};

function MD(e, t, n) {
    if (e.isAbsolute) return new kn(t, !0, 0);
    if (!n) return new kn(t, !1, NaN);
    if (n.parent === null) return new kn(n, !0, 0);
    let r = yi(e.commands[0]) ? 0 : 1,
        o = n.segments.length - 1 + r;
    return TD(n, o, e.numberOfDoubleDots)
}

function TD(e, t, n) {
    let r = e,
        o = t,
        i = n;
    for (; i > o;) {
        if (i -= o, r = r.parent, !r) throw new L(4005, !1);
        o = r.segments.length
    }
    return new kn(r, !1, o - i)
}

function ND(e) {
    return Ar(e[0]) ? e[0].outlets : {
        [z]: e
    }
}

function e0(e, t, n) {
    if (e ??= new oe([], {}), e.segments.length === 0 && e.hasChildren()) return wr(e, t, n);
    let r = RD(e, t, n),
        o = n.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let i = new oe(e.segments.slice(0, r.pathIndex), {});
        return i.children[z] = new oe(e.segments.slice(r.pathIndex), e.children), wr(i, 0, o)
    } else return r.match && o.length === 0 ? new oe(e.segments, {}) : r.match && !e.hasChildren() ? Pc(e, t, n) : r.match ? wr(e, 0, o) : Pc(e, t, n)
}

function wr(e, t, n) {
    if (n.length === 0) return new oe(e.segments, {});
    {
        let r = ND(n),
            o = {};
        if (Object.keys(r).some(i => i !== z) && e.children[z] && e.numberOfChildren === 1 && e.children[z].segments.length === 0) {
            let i = wr(e.children[z], t, n);
            return new oe(e.segments, i.children)
        }
        return Object.entries(r).forEach(([i, s]) => {
            typeof s == "string" && (s = [s]), s !== null && (o[i] = e0(e.children[i], t, s))
        }), Object.entries(e.children).forEach(([i, s]) => {
            r[i] === void 0 && (o[i] = s)
        }), new oe(e.segments, o)
    }
}

function RD(e, t, n) {
    let r = 0,
        o = t,
        i = {
            match: !1,
            pathIndex: 0,
            commandIndex: 0
        };
    for (; o < e.segments.length;) {
        if (r >= n.length) return i;
        let s = e.segments[o],
            a = n[r];
        if (Ar(a)) break;
        let c = `${a}`,
            l = r < n.length - 1 ? n[r + 1] : null;
        if (o > 0 && c === void 0) break;
        if (c && l && typeof l == "object" && l.outlets === void 0) {
            if (!Bh(c, l, s)) return i;
            r += 2
        } else {
            if (!Bh(c, {}, s)) return i;
            r++
        }
        o++
    }
    return {
        match: !0,
        pathIndex: o,
        commandIndex: r
    }
}

function Pc(e, t, n) {
    let r = e.segments.slice(0, t),
        o = 0;
    for (; o < n.length;) {
        let i = n[o];
        if (Ar(i)) {
            let c = FD(i.outlets);
            return new oe(r, c)
        }
        if (o === 0 && yi(n[0])) {
            let c = e.segments[t];
            r.push(new Zt(c.path, Ph(n[0]))), o++;
            continue
        }
        let s = Ar(i) ? i.outlets[z] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
        s && a && yi(a) ? (r.push(new Zt(s, Ph(a))), o += 2) : (r.push(new Zt(s, {})), o++)
    }
    return new oe(r, {})
}

function FD(e) {
    let t = {};
    return Object.entries(e).forEach(([n, r]) => {
        typeof r == "string" && (r = [r]), r !== null && (t[n] = Pc(new oe([], {}), 0, r))
    }), t
}

function Ph(e) {
    let t = {};
    return Object.entries(e).forEach(([n, r]) => t[n] = `${r}`), t
}

function Bh(e, t, n) {
    return e == n.path && st(t, n.parameters)
}
var br = "imperative",
    Ce = function(e) {
        return e[e.NavigationStart = 0] = "NavigationStart", e[e.NavigationEnd = 1] = "NavigationEnd", e[e.NavigationCancel = 2] = "NavigationCancel", e[e.NavigationError = 3] = "NavigationError", e[e.RoutesRecognized = 4] = "RoutesRecognized", e[e.ResolveStart = 5] = "ResolveStart", e[e.ResolveEnd = 6] = "ResolveEnd", e[e.GuardsCheckStart = 7] = "GuardsCheckStart", e[e.GuardsCheckEnd = 8] = "GuardsCheckEnd", e[e.RouteConfigLoadStart = 9] = "RouteConfigLoadStart", e[e.RouteConfigLoadEnd = 10] = "RouteConfigLoadEnd", e[e.ChildActivationStart = 11] = "ChildActivationStart", e[e.ChildActivationEnd = 12] = "ChildActivationEnd", e[e.ActivationStart = 13] = "ActivationStart", e[e.ActivationEnd = 14] = "ActivationEnd", e[e.Scroll = 15] = "Scroll", e[e.NavigationSkipped = 16] = "NavigationSkipped", e
    }(Ce || {}),
    Ue = class {
        id;
        url;
        constructor(t, n) {
            this.id = t, this.url = n
        }
    },
    Mr = class extends Ue {
        type = Ce.NavigationStart;
        navigationTrigger;
        restoredState;
        constructor(t, n, r = "imperative", o = null) {
            super(t, n), this.navigationTrigger = r, this.restoredState = o
        }
        toString() {
            return `NavigationStart(id: ${this.id}, url: '${this.url}')`
        }
    },
    Qt = class extends Ue {
        urlAfterRedirects;
        type = Ce.NavigationEnd;
        constructor(t, n, r) {
            super(t, n), this.urlAfterRedirects = r
        }
        toString() {
            return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
        }
    },
    Be = function(e) {
        return e[e.Redirect = 0] = "Redirect", e[e.SupersededByNewNavigation = 1] = "SupersededByNewNavigation", e[e.NoDataFromResolver = 2] = "NoDataFromResolver", e[e.GuardRejected = 3] = "GuardRejected", e
    }(Be || {}),
    Bc = function(e) {
        return e[e.IgnoredSameUrlNavigation = 0] = "IgnoredSameUrlNavigation", e[e.IgnoredByUrlHandlingStrategy = 1] = "IgnoredByUrlHandlingStrategy", e
    }(Bc || {}),
    ht = class extends Ue {
        reason;
        code;
        type = Ce.NavigationCancel;
        constructor(t, n, r, o) {
            super(t, n), this.reason = r, this.code = o
        }
        toString() {
            return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
        }
    },
    Kt = class extends Ue {
        reason;
        code;
        type = Ce.NavigationSkipped;
        constructor(t, n, r, o) {
            super(t, n), this.reason = r, this.code = o
        }
    },
    Tr = class extends Ue {
        error;
        target;
        type = Ce.NavigationError;
        constructor(t, n, r, o) {
            super(t, n), this.error = r, this.target = o
        }
        toString() {
            return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
        }
    },
    Ci = class extends Ue {
        urlAfterRedirects;
        state;
        type = Ce.RoutesRecognized;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    Lc = class extends Ue {
        urlAfterRedirects;
        state;
        type = Ce.GuardsCheckStart;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    jc = class extends Ue {
        urlAfterRedirects;
        state;
        shouldActivate;
        type = Ce.GuardsCheckEnd;
        constructor(t, n, r, o, i) {
            super(t, n), this.urlAfterRedirects = r, this.state = o, this.shouldActivate = i
        }
        toString() {
            return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
        }
    },
    Vc = class extends Ue {
        urlAfterRedirects;
        state;
        type = Ce.ResolveStart;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    Hc = class extends Ue {
        urlAfterRedirects;
        state;
        type = Ce.ResolveEnd;
        constructor(t, n, r, o) {
            super(t, n), this.urlAfterRedirects = r, this.state = o
        }
        toString() {
            return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
    },
    $c = class {
        route;
        type = Ce.RouteConfigLoadStart;
        constructor(t) {
            this.route = t
        }
        toString() {
            return `RouteConfigLoadStart(path: ${this.route.path})`
        }
    },
    Uc = class {
        route;
        type = Ce.RouteConfigLoadEnd;
        constructor(t) {
            this.route = t
        }
        toString() {
            return `RouteConfigLoadEnd(path: ${this.route.path})`
        }
    },
    zc = class {
        snapshot;
        type = Ce.ChildActivationStart;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    },
    qc = class {
        snapshot;
        type = Ce.ChildActivationEnd;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    },
    Wc = class {
        snapshot;
        type = Ce.ActivationStart;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    },
    Gc = class {
        snapshot;
        type = Ce.ActivationEnd;
        constructor(t) {
            this.snapshot = t
        }
        toString() {
            return `ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`
        }
    };
var Nr = class {},
    Ln = class {
        url;
        navigationBehaviorOptions;
        constructor(t, n) {
            this.url = t, this.navigationBehaviorOptions = n
        }
    };

function kD(e, t) {
    return e.providers && !e._injector && (e._injector = dc(e.providers, t, `Route: ${e.path}`)), e._injector ?? t
}

function tt(e) {
    return e.outlet || z
}

function OD(e, t) {
    let n = e.filter(r => tt(r) === t);
    return n.push(...e.filter(r => tt(r) !== t)), n
}

function Br(e) {
    if (!e) return null;
    if (e.routeConfig?._injector) return e.routeConfig._injector;
    for (let t = e.parent; t; t = t.parent) {
        let n = t.routeConfig;
        if (n?._loadedInjector) return n._loadedInjector;
        if (n?._injector) return n._injector
    }
    return null
}
var Zc = class {
        rootInjector;
        outlet = null;
        route = null;
        children;
        attachRef = null;
        get injector() {
            return Br(this.route?.snapshot) ?? this.rootInjector
        }
        constructor(t) {
            this.rootInjector = t, this.children = new Ai(this.rootInjector)
        }
    },
    Ai = (() => {
        class e {
            rootInjector;
            contexts = new Map;
            constructor(n) {
                this.rootInjector = n
            }
            onChildOutletCreated(n, r) {
                let o = this.getOrCreateContext(n);
                o.outlet = r, this.contexts.set(n, o)
            }
            onChildOutletDestroyed(n) {
                let r = this.getContext(n);
                r && (r.outlet = null, r.attachRef = null)
            }
            onOutletDeactivated() {
                let n = this.contexts;
                return this.contexts = new Map, n
            }
            onOutletReAttached(n) {
                this.contexts = n
            }
            getOrCreateContext(n) {
                let r = this.getContext(n);
                return r || (r = new Zc(this.rootInjector), this.contexts.set(n, r)), r
            }
            getContext(n) {
                return this.contexts.get(n) || null
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(He))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    Ei = class {
        _root;
        constructor(t) {
            this._root = t
        }
        get root() {
            return this._root.value
        }
        parent(t) {
            let n = this.pathFromRoot(t);
            return n.length > 1 ? n[n.length - 2] : null
        }
        children(t) {
            let n = Yc(t, this._root);
            return n ? n.children.map(r => r.value) : []
        }
        firstChild(t) {
            let n = Yc(t, this._root);
            return n && n.children.length > 0 ? n.children[0].value : null
        }
        siblings(t) {
            let n = Qc(t, this._root);
            return n.length < 2 ? [] : n[n.length - 2].children.map(o => o.value).filter(o => o !== t)
        }
        pathFromRoot(t) {
            return Qc(t, this._root).map(n => n.value)
        }
    };

function Yc(e, t) {
    if (e === t.value) return t;
    for (let n of t.children) {
        let r = Yc(e, n);
        if (r) return r
    }
    return null
}

function Qc(e, t) {
    if (e === t.value) return [t];
    for (let n of t.children) {
        let r = Qc(e, n);
        if (r.length) return r.unshift(t), r
    }
    return []
}
var Pe = class {
    value;
    children;
    constructor(t, n) {
        this.value = t, this.children = n
    }
    toString() {
        return `TreeNode(${this.value})`
    }
};

function Fn(e) {
    let t = {};
    return e && e.children.forEach(n => t[n.value.outlet] = n), t
}
var wi = class extends Ei {
    snapshot;
    constructor(t, n) {
        super(t), this.snapshot = n, su(this, t)
    }
    toString() {
        return this.snapshot.toString()
    }
};

function t0(e) {
    let t = PD(e),
        n = new xe([new Zt("", {})]),
        r = new xe({}),
        o = new xe({}),
        i = new xe({}),
        s = new xe(""),
        a = new jn(n, r, i, s, o, z, e, t.root);
    return a.snapshot = t.root, new wi(new Pe(a, []), t)
}

function PD(e) {
    let t = {},
        n = {},
        r = {},
        o = "",
        i = new On([], t, r, o, n, z, e, null, {});
    return new Ii("", new Pe(i, []))
}
var jn = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    constructor(t, n, r, o, i, s, a, c) {
        this.urlSubject = t, this.paramsSubject = n, this.queryParamsSubject = r, this.fragmentSubject = o, this.dataSubject = i, this.outlet = s, this.component = a, this._futureSnapshot = c, this.title = this.dataSubject?.pipe(ne(l => l[Pr])) ?? U(void 0), this.url = t, this.params = n, this.queryParams = r, this.fragment = o, this.data = i
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap ??= this.params.pipe(ne(t => Bn(t))), this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap ??= this.queryParams.pipe(ne(t => Bn(t))), this._queryParamMap
    }
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
    }
};

function bi(e, t, n = "emptyOnly") {
    let r, {
        routeConfig: o
    } = e;
    return t !== null && (n === "always" || o?.path === "" || !t.component && !t.routeConfig?.loadComponent) ? r = {
        params: P(P({}, t.params), e.params),
        data: P(P({}, t.data), e.data),
        resolve: P(P(P(P({}, e.data), t.data), o?.data), e._resolvedData)
    } : r = {
        params: P({}, e.params),
        data: P({}, e.data),
        resolve: P(P({}, e.data), e._resolvedData ?? {})
    }, o && r0(o) && (r.resolve[Pr] = o.title), r
}
var On = class {
        url;
        params;
        queryParams;
        fragment;
        data;
        outlet;
        component;
        routeConfig;
        _resolve;
        _resolvedData;
        _routerState;
        _paramMap;
        _queryParamMap;
        get title() {
            return this.data?.[Pr]
        }
        constructor(t, n, r, o, i, s, a, c, l) {
            this.url = t, this.params = n, this.queryParams = r, this.fragment = o, this.data = i, this.outlet = s, this.component = a, this.routeConfig = c, this._resolve = l
        }
        get root() {
            return this._routerState.root
        }
        get parent() {
            return this._routerState.parent(this)
        }
        get firstChild() {
            return this._routerState.firstChild(this)
        }
        get children() {
            return this._routerState.children(this)
        }
        get pathFromRoot() {
            return this._routerState.pathFromRoot(this)
        }
        get paramMap() {
            return this._paramMap ??= Bn(this.params), this._paramMap
        }
        get queryParamMap() {
            return this._queryParamMap ??= Bn(this.queryParams), this._queryParamMap
        }
        toString() {
            let t = this.url.map(r => r.toString()).join("/"),
                n = this.routeConfig ? this.routeConfig.path : "";
            return `Route(url:'${t}', path:'${n}')`
        }
    },
    Ii = class extends Ei {
        url;
        constructor(t, n) {
            super(n), this.url = t, su(this, n)
        }
        toString() {
            return n0(this._root)
        }
    };

function su(e, t) {
    t.value._routerState = e, t.children.forEach(n => su(e, n))
}

function n0(e) {
    let t = e.children.length > 0 ? ` { ${e.children.map(n0).join(", ")} } ` : "";
    return `${e.value}${t}`
}

function Tc(e) {
    if (e.snapshot) {
        let t = e.snapshot,
            n = e._futureSnapshot;
        e.snapshot = n, st(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams), t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment), st(t.params, n.params) || e.paramsSubject.next(n.params), uD(t.url, n.url) || e.urlSubject.next(n.url), st(t.data, n.data) || e.dataSubject.next(n.data)
    } else e.snapshot = e._futureSnapshot, e.dataSubject.next(e._futureSnapshot.data)
}

function Kc(e, t) {
    let n = st(e.params, t.params) && hD(e.url, t.url),
        r = !e.parent != !t.parent;
    return n && !r && (!e.parent || Kc(e.parent, t.parent))
}

function r0(e) {
    return typeof e.title == "string" || e.title === null
}
var BD = new $(""),
    LD = (() => {
        class e {
            activated = null;
            get activatedComponentRef() {
                return this.activated
            }
            _activatedRoute = null;
            name = z;
            activateEvents = new Fe;
            deactivateEvents = new Fe;
            attachEvents = new Fe;
            detachEvents = new Fe;
            routerOutletData = rf(void 0);
            parentContexts = F(Ai);
            location = F(ii);
            changeDetector = F(gr);
            inputBinder = F(au, {
                optional: !0
            });
            supportsBindingToComponentInputs = !0;
            ngOnChanges(n) {
                if (n.name) {
                    let {
                        firstChange: r,
                        previousValue: o
                    } = n.name;
                    if (r) return;
                    this.isTrackedInParentContexts(o) && (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)), this.initializeOutletWithName()
                }
            }
            ngOnDestroy() {
                this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name), this.inputBinder?.unsubscribeFromRouteData(this)
            }
            isTrackedInParentContexts(n) {
                return this.parentContexts.getContext(n)?.outlet === this
            }
            ngOnInit() {
                this.initializeOutletWithName()
            }
            initializeOutletWithName() {
                if (this.parentContexts.onChildOutletCreated(this.name, this), this.activated) return;
                let n = this.parentContexts.getContext(this.name);
                n?.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector))
            }
            get isActivated() {
                return !!this.activated
            }
            get component() {
                if (!this.activated) throw new L(4012, !1);
                return this.activated.instance
            }
            get activatedRoute() {
                if (!this.activated) throw new L(4012, !1);
                return this._activatedRoute
            }
            get activatedRouteData() {
                return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
            }
            detach() {
                if (!this.activated) throw new L(4012, !1);
                this.location.detach();
                let n = this.activated;
                return this.activated = null, this._activatedRoute = null, this.detachEvents.emit(n.instance), n
            }
            attach(n, r) {
                this.activated = n, this._activatedRoute = r, this.location.insert(n.hostView), this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.attachEvents.emit(n.instance)
            }
            deactivate() {
                if (this.activated) {
                    let n = this.component;
                    this.activated.destroy(), this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(n)
                }
            }
            activateWith(n, r) {
                if (this.isActivated) throw new L(4013, !1);
                this._activatedRoute = n;
                let o = this.location,
                    s = n.snapshot.component,
                    a = this.parentContexts.getOrCreateContext(this.name).children,
                    c = new Xc(n, a, o.injector, this.routerOutletData);
                this.activated = o.createComponent(s, {
                    index: o.length,
                    injector: c,
                    environmentInjector: r
                }), this.changeDetector.markForCheck(), this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.activateEvents.emit(this.activated.instance)
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275dir = fc({
                type: e,
                selectors: [
                    ["router-outlet"]
                ],
                inputs: {
                    name: "name",
                    routerOutletData: [1, "routerOutletData"]
                },
                outputs: {
                    activateEvents: "activate",
                    deactivateEvents: "deactivate",
                    attachEvents: "attach",
                    detachEvents: "detach"
                },
                exportAs: ["outlet"],
                features: [Pa]
            })
        }
        return e
    })(),
    Xc = class e {
        route;
        childContexts;
        parent;
        outletData;
        __ngOutletInjector(t) {
            return new e(this.route, this.childContexts, t, this.outletData)
        }
        constructor(t, n, r, o) {
            this.route = t, this.childContexts = n, this.parent = r, this.outletData = o
        }
        get(t, n) {
            return t === jn ? this.route : t === Ai ? this.childContexts : t === BD ? this.outletData : this.parent.get(t, n)
        }
    },
    au = new $("");

function jD(e, t, n) {
    let r = Rr(e, t._root, n ? n._root : void 0);
    return new wi(r, t)
}

function Rr(e, t, n) {
    if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
        let r = n.value;
        r._futureSnapshot = t.value;
        let o = VD(e, t, n);
        return new Pe(r, o)
    } else {
        if (e.shouldAttach(t.value)) {
            let i = e.retrieve(t.value);
            if (i !== null) {
                let s = i.route;
                return s.value._futureSnapshot = t.value, s.children = t.children.map(a => Rr(e, a)), s
            }
        }
        let r = HD(t.value),
            o = t.children.map(i => Rr(e, i));
        return new Pe(r, o)
    }
}

function VD(e, t, n) {
    return t.children.map(r => {
        for (let o of n.children)
            if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Rr(e, r, o);
        return Rr(e, r)
    })
}

function HD(e) {
    return new jn(new xe(e.url), new xe(e.params), new xe(e.queryParams), new xe(e.fragment), new xe(e.data), e.outlet, e.component, e)
}
var Fr = class {
        redirectTo;
        navigationBehaviorOptions;
        constructor(t, n) {
            this.redirectTo = t, this.navigationBehaviorOptions = n
        }
    },
    o0 = "ngNavigationCancelingError";

function _i(e, t) {
    let {
        redirectTo: n,
        navigationBehaviorOptions: r
    } = Sr(t) ? {
        redirectTo: t,
        navigationBehaviorOptions: void 0
    } : t, o = i0(!1, Be.Redirect);
    return o.url = n, o.navigationBehaviorOptions = r, o
}

function i0(e, t) {
    let n = new Error(`NavigationCancelingError: ${e||""}`);
    return n[o0] = !0, n.cancellationCode = t, n
}

function $D(e) {
    return s0(e) && Sr(e.url)
}

function s0(e) {
    return !!e && e[o0]
}
var UD = (e, t, n, r) => ne(o => (new Jc(t, o.targetRouterState, o.currentRouterState, n, r).activate(e), o)),
    Jc = class {
        routeReuseStrategy;
        futureState;
        currState;
        forwardEvent;
        inputBindingEnabled;
        constructor(t, n, r, o, i) {
            this.routeReuseStrategy = t, this.futureState = n, this.currState = r, this.forwardEvent = o, this.inputBindingEnabled = i
        }
        activate(t) {
            let n = this.futureState._root,
                r = this.currState ? this.currState._root : null;
            this.deactivateChildRoutes(n, r, t), Tc(this.futureState.root), this.activateChildRoutes(n, r, t)
        }
        deactivateChildRoutes(t, n, r) {
            let o = Fn(n);
            t.children.forEach(i => {
                let s = i.value.outlet;
                this.deactivateRoutes(i, o[s], r), delete o[s]
            }), Object.values(o).forEach(i => {
                this.deactivateRouteAndItsChildren(i, r)
            })
        }
        deactivateRoutes(t, n, r) {
            let o = t.value,
                i = n ? n.value : null;
            if (o === i)
                if (o.component) {
                    let s = r.getContext(o.outlet);
                    s && this.deactivateChildRoutes(t, n, s.children)
                } else this.deactivateChildRoutes(t, n, r);
            else i && this.deactivateRouteAndItsChildren(n, r)
        }
        deactivateRouteAndItsChildren(t, n) {
            t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, n) : this.deactivateRouteAndOutlet(t, n)
        }
        detachAndStoreRouteSubtree(t, n) {
            let r = n.getContext(t.value.outlet),
                o = r && t.value.component ? r.children : n,
                i = Fn(t);
            for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
            if (r && r.outlet) {
                let s = r.outlet.detach(),
                    a = r.children.onOutletDeactivated();
                this.routeReuseStrategy.store(t.value.snapshot, {
                    componentRef: s,
                    route: t,
                    contexts: a
                })
            }
        }
        deactivateRouteAndOutlet(t, n) {
            let r = n.getContext(t.value.outlet),
                o = r && t.value.component ? r.children : n,
                i = Fn(t);
            for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
            r && (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()), r.attachRef = null, r.route = null)
        }
        activateChildRoutes(t, n, r) {
            let o = Fn(n);
            t.children.forEach(i => {
                this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new Gc(i.value.snapshot))
            }), t.children.length && this.forwardEvent(new qc(t.value.snapshot))
        }
        activateRoutes(t, n, r) {
            let o = t.value,
                i = n ? n.value : null;
            if (Tc(o), o === i)
                if (o.component) {
                    let s = r.getOrCreateContext(o.outlet);
                    this.activateChildRoutes(t, n, s.children)
                } else this.activateChildRoutes(t, n, r);
            else if (o.component) {
                let s = r.getOrCreateContext(o.outlet);
                if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
                    let a = this.routeReuseStrategy.retrieve(o.snapshot);
                    this.routeReuseStrategy.store(o.snapshot, null), s.children.onOutletReAttached(a.contexts), s.attachRef = a.componentRef, s.route = a.route.value, s.outlet && s.outlet.attach(a.componentRef, a.route.value), Tc(a.route.value), this.activateChildRoutes(t, null, s.children)
                } else s.attachRef = null, s.route = o, s.outlet && s.outlet.activateWith(o, s.injector), this.activateChildRoutes(t, null, s.children)
            } else this.activateChildRoutes(t, null, r)
        }
    },
    Si = class {
        path;
        route;
        constructor(t) {
            this.path = t, this.route = this.path[this.path.length - 1]
        }
    },
    Pn = class {
        component;
        route;
        constructor(t, n) {
            this.component = t, this.route = n
        }
    };

function zD(e, t, n) {
    let r = e._root,
        o = t ? t._root : null;
    return Er(r, o, n, [r.value])
}

function qD(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !t || t.length === 0 ? null : {
        node: e,
        guards: t
    }
}

function Hn(e, t) {
    let n = Symbol(),
        r = t.get(e, n);
    return r === n ? typeof e == "function" && !td(e) ? e : t.get(e) : r
}

function Er(e, t, n, r, o = {
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = Fn(t);
    return e.children.forEach(s => {
        WD(s, i[s.value.outlet], n, r.concat([s.value]), o), delete i[s.value.outlet]
    }), Object.entries(i).forEach(([s, a]) => Ir(a, n.getContext(s), o)), o
}

function WD(e, t, n, r, o = {
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = e.value,
        s = t ? t.value : null,
        a = n ? n.getContext(e.value.outlet) : null;
    if (s && i.routeConfig === s.routeConfig) {
        let c = GD(s, i, i.routeConfig.runGuardsAndResolvers);
        c ? o.canActivateChecks.push(new Si(r)) : (i.data = s.data, i._resolvedData = s._resolvedData), i.component ? Er(e, t, a ? a.children : null, r, o) : Er(e, t, n, r, o), c && a && a.outlet && a.outlet.isActivated && o.canDeactivateChecks.push(new Pn(a.outlet.component, s))
    } else s && Ir(t, a, o), o.canActivateChecks.push(new Si(r)), i.component ? Er(e, null, a ? a.children : null, r, o) : Er(e, null, n, r, o);
    return o
}

function GD(e, t, n) {
    if (typeof n == "function") return n(e, t);
    switch (n) {
        case "pathParamsChange":
            return !Yt(e.url, t.url);
        case "pathParamsOrQueryParamsChange":
            return !Yt(e.url, t.url) || !st(e.queryParams, t.queryParams);
        case "always":
            return !0;
        case "paramsOrQueryParamsChange":
            return !Kc(e, t) || !st(e.queryParams, t.queryParams);
        case "paramsChange":
        default:
            return !Kc(e, t)
    }
}

function Ir(e, t, n) {
    let r = Fn(e),
        o = e.value;
    Object.entries(r).forEach(([i, s]) => {
        o.component ? t ? Ir(s, t.children.getContext(i), n) : Ir(s, null, n) : Ir(s, t, n)
    }), o.component ? t && t.outlet && t.outlet.isActivated ? n.canDeactivateChecks.push(new Pn(t.outlet.component, o)) : n.canDeactivateChecks.push(new Pn(null, o)) : n.canDeactivateChecks.push(new Pn(null, o))
}

function Lr(e) {
    return typeof e == "function"
}

function ZD(e) {
    return typeof e == "boolean"
}

function YD(e) {
    return e && Lr(e.canLoad)
}

function QD(e) {
    return e && Lr(e.canActivate)
}

function KD(e) {
    return e && Lr(e.canActivateChild)
}

function XD(e) {
    return e && Lr(e.canDeactivate)
}

function JD(e) {
    return e && Lr(e.canMatch)
}

function a0(e) {
    return e instanceof ct || e?.name === "EmptyError"
}
var gi = Symbol("INITIAL_VALUE");

function Vn() {
    return Ze(e => lo(e.map(t => t.pipe(ut(1), Ls(gi)))).pipe(ne(t => {
        for (let n of t)
            if (n !== !0) {
                if (n === gi) return gi;
                if (n === !1 || eC(n)) return n
            } return !0
    }), Ge(t => t !== gi), ut(1)))
}

function eC(e) {
    return Sr(e) || e instanceof Fr
}

function tC(e, t) {
    return ge(n => {
        let {
            targetSnapshot: r,
            currentSnapshot: o,
            guards: {
                canActivateChecks: i,
                canDeactivateChecks: s
            }
        } = n;
        return s.length === 0 && i.length === 0 ? U(le(P({}, n), {
            guardsResult: !0
        })) : nC(s, r, o, e).pipe(ge(a => a && ZD(a) ? rC(r, i, e, t) : U(a)), ne(a => le(P({}, n), {
            guardsResult: a
        })))
    })
}

function nC(e, t, n, r) {
    return pe(e).pipe(ge(o => cC(o.component, o.route, n, t, r)), lt(o => o !== !0, !0))
}

function rC(e, t, n, r) {
    return pe(t).pipe(fn(o => dn(iC(o.route.parent, r), oC(o.route, r), aC(e, o.path, n), sC(e, o.route, n))), lt(o => o !== !0, !0))
}

function oC(e, t) {
    return e !== null && t && t(new Wc(e)), U(!0)
}

function iC(e, t) {
    return e !== null && t && t(new zc(e)), U(!0)
}

function sC(e, t, n) {
    let r = t.routeConfig ? t.routeConfig.canActivate : null;
    if (!r || r.length === 0) return U(!0);
    let o = r.map(i => fo(() => {
        let s = Br(t) ?? n,
            a = Hn(i, s),
            c = QD(a) ? a.canActivate(t, e) : Je(s, () => a(t, e));
        return At(c).pipe(lt())
    }));
    return U(o).pipe(Vn())
}

function aC(e, t, n) {
    let r = t[t.length - 1],
        i = t.slice(0, t.length - 1).reverse().map(s => qD(s)).filter(s => s !== null).map(s => fo(() => {
            let a = s.guards.map(c => {
                let l = Br(s.node) ?? n,
                    u = Hn(c, l),
                    d = KD(u) ? u.canActivateChild(r, e) : Je(l, () => u(r, e));
                return At(d).pipe(lt())
            });
            return U(a).pipe(Vn())
        }));
    return U(i).pipe(Vn())
}

function cC(e, t, n, r, o) {
    let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
    if (!i || i.length === 0) return U(!0);
    let s = i.map(a => {
        let c = Br(t) ?? o,
            l = Hn(a, c),
            u = XD(l) ? l.canDeactivate(e, t, n, r) : Je(c, () => l(e, t, n, r));
        return At(u).pipe(lt())
    });
    return U(s).pipe(Vn())
}

function uC(e, t, n, r) {
    let o = t.canLoad;
    if (o === void 0 || o.length === 0) return U(!0);
    let i = o.map(s => {
        let a = Hn(s, e),
            c = YD(a) ? a.canLoad(t, n) : Je(e, () => a(t, n));
        return At(c)
    });
    return U(i).pipe(Vn(), c0(r))
}

function c0(e) {
    return Ts(ye(t => {
        if (typeof t != "boolean") throw _i(e, t)
    }), ne(t => t === !0))
}

function lC(e, t, n, r) {
    let o = t.canMatch;
    if (!o || o.length === 0) return U(!0);
    let i = o.map(s => {
        let a = Hn(s, e),
            c = JD(a) ? a.canMatch(t, n) : Je(e, () => a(t, n));
        return At(c)
    });
    return U(i).pipe(Vn(), c0(r))
}
var kr = class {
        segmentGroup;
        constructor(t) {
            this.segmentGroup = t || null
        }
    },
    Or = class extends Error {
        urlTree;
        constructor(t) {
            super(), this.urlTree = t
        }
    };

function Rn(e) {
    return ln(new kr(e))
}

function dC(e) {
    return ln(new L(4e3, !1))
}

function fC(e) {
    return ln(i0(!1, Be.GuardRejected))
}
var eu = class {
        urlSerializer;
        urlTree;
        constructor(t, n) {
            this.urlSerializer = t, this.urlTree = n
        }
        lineralizeSegments(t, n) {
            let r = [],
                o = n.root;
            for (;;) {
                if (r = r.concat(o.segments), o.numberOfChildren === 0) return U(r);
                if (o.numberOfChildren > 1 || !o.children[z]) return dC(`${t.redirectTo}`);
                o = o.children[z]
            }
        }
        applyRedirectCommands(t, n, r, o, i) {
            if (typeof n != "string") {
                let a = n,
                    {
                        queryParams: c,
                        fragment: l,
                        routeConfig: u,
                        url: d,
                        outlet: f,
                        params: h,
                        data: g,
                        title: v
                    } = o,
                    x = Je(i, () => a({
                        params: h,
                        data: g,
                        queryParams: c,
                        fragment: l,
                        routeConfig: u,
                        url: d,
                        outlet: f,
                        title: v
                    }));
                if (x instanceof pt) throw new Or(x);
                n = x
            }
            let s = this.applyRedirectCreateUrlTree(n, this.urlSerializer.parse(n), t, r);
            if (n[0] === "/") throw new Or(s);
            return s
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
            let i = this.createSegmentGroup(t, n.root, r, o);
            return new pt(i, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment)
        }
        createQueryParams(t, n) {
            let r = {};
            return Object.entries(t).forEach(([o, i]) => {
                if (typeof i == "string" && i[0] === ":") {
                    let a = i.substring(1);
                    r[o] = n[a]
                } else r[o] = i
            }), r
        }
        createSegmentGroup(t, n, r, o) {
            let i = this.createSegments(t, n.segments, r, o),
                s = {};
            return Object.entries(n.children).forEach(([a, c]) => {
                s[a] = this.createSegmentGroup(t, c, r, o)
            }), new oe(i, s)
        }
        createSegments(t, n, r, o) {
            return n.map(i => i.path[0] === ":" ? this.findPosParam(t, i, o) : this.findOrReturn(i, r))
        }
        findPosParam(t, n, r) {
            let o = r[n.path.substring(1)];
            if (!o) throw new L(4001, !1);
            return o
        }
        findOrReturn(t, n) {
            let r = 0;
            for (let o of n) {
                if (o.path === t.path) return n.splice(r), o;
                r++
            }
            return t
        }
    },
    tu = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {}
    };

function hC(e, t, n, r, o) {
    let i = u0(e, t, n);
    return i.matched ? (r = kD(t, r), lC(r, t, n, o).pipe(ne(s => s === !0 ? i : P({}, tu)))) : U(i)
}

function u0(e, t, n) {
    if (t.path === "**") return pC(n);
    if (t.path === "") return t.pathMatch === "full" && (e.hasChildren() || n.length > 0) ? P({}, tu) : {
        matched: !0,
        consumedSegments: [],
        remainingSegments: n,
        parameters: {},
        positionalParamSegments: {}
    };
    let o = (t.matcher || cD)(n, e, t);
    if (!o) return P({}, tu);
    let i = {};
    Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
        i[a] = c.path
    });
    let s = o.consumed.length > 0 ? P(P({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
    return {
        matched: !0,
        consumedSegments: o.consumed,
        remainingSegments: n.slice(o.consumed.length),
        parameters: s,
        positionalParamSegments: o.posParams ?? {}
    }
}

function pC(e) {
    return {
        matched: !0,
        parameters: e.length > 0 ? $h(e).parameters : {},
        consumedSegments: e,
        remainingSegments: [],
        positionalParamSegments: {}
    }
}

function Lh(e, t, n, r) {
    return n.length > 0 && vC(e, n, r) ? {
        segmentGroup: new oe(t, mC(r, new oe(n, e.children))),
        slicedSegments: []
    } : n.length === 0 && xC(e, n, r) ? {
        segmentGroup: new oe(e.segments, gC(e, n, r, e.children)),
        slicedSegments: n
    } : {
        segmentGroup: new oe(e.segments, e.children),
        slicedSegments: n
    }
}

function gC(e, t, n, r) {
    let o = {};
    for (let i of n)
        if (Mi(e, t, i) && !r[tt(i)]) {
            let s = new oe([], {});
            o[tt(i)] = s
        } return P(P({}, r), o)
}

function mC(e, t) {
    let n = {};
    n[z] = t;
    for (let r of e)
        if (r.path === "" && tt(r) !== z) {
            let o = new oe([], {});
            n[tt(r)] = o
        } return n
}

function vC(e, t, n) {
    return n.some(r => Mi(e, t, r) && tt(r) !== z)
}

function xC(e, t, n) {
    return n.some(r => Mi(e, t, r))
}

function Mi(e, t, n) {
    return (e.hasChildren() || t.length > 0) && n.pathMatch === "full" ? !1 : n.path === ""
}

function yC(e, t, n) {
    return t.length === 0 && !e.children[n]
}
var nu = class {};

function DC(e, t, n, r, o, i, s = "emptyOnly") {
    return new ru(e, t, n, r, o, s, i).recognize()
}
var CC = 31,
    ru = class {
        injector;
        configLoader;
        rootComponentType;
        config;
        urlTree;
        paramsInheritanceStrategy;
        urlSerializer;
        applyRedirects;
        absoluteRedirectCount = 0;
        allowRedirects = !0;
        constructor(t, n, r, o, i, s, a) {
            this.injector = t, this.configLoader = n, this.rootComponentType = r, this.config = o, this.urlTree = i, this.paramsInheritanceStrategy = s, this.urlSerializer = a, this.applyRedirects = new eu(this.urlSerializer, this.urlTree)
        }
        noMatchError(t) {
            return new L(4002, `'${t.segmentGroup}'`)
        }
        recognize() {
            let t = Lh(this.urlTree.root, [], [], this.config).segmentGroup;
            return this.match(t).pipe(ne(({
                children: n,
                rootSnapshot: r
            }) => {
                let o = new Pe(r, n),
                    i = new Ii("", o),
                    s = SD(r, [], this.urlTree.queryParams, this.urlTree.fragment);
                return s.queryParams = this.urlTree.queryParams, i.url = this.urlSerializer.serialize(s), {
                    state: i,
                    tree: s
                }
            }))
        }
        match(t) {
            let n = new On([], Object.freeze({}), Object.freeze(P({}, this.urlTree.queryParams)), this.urlTree.fragment, Object.freeze({}), z, this.rootComponentType, null, {});
            return this.processSegmentGroup(this.injector, this.config, t, z, n).pipe(ne(r => ({
                children: r,
                rootSnapshot: n
            })), yt(r => {
                if (r instanceof Or) return this.urlTree = r.urlTree, this.match(r.urlTree.root);
                throw r instanceof kr ? this.noMatchError(r) : r
            }))
        }
        processSegmentGroup(t, n, r, o, i) {
            return r.segments.length === 0 && r.hasChildren() ? this.processChildren(t, n, r, i) : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(ne(s => s instanceof Pe ? [s] : []))
        }
        processChildren(t, n, r, o) {
            let i = [];
            for (let s of Object.keys(r.children)) s === "primary" ? i.unshift(s) : i.push(s);
            return pe(i).pipe(fn(s => {
                let a = r.children[s],
                    c = OD(n, s);
                return this.processSegmentGroup(t, c, a, s, o)
            }), Bs((s, a) => (s.push(...a), s)), Dt(null), Ps(), ge(s => {
                if (s === null) return Rn(r);
                let a = l0(s);
                return EC(a), U(a)
            }))
        }
        processSegment(t, n, r, o, i, s, a) {
            return pe(n).pipe(fn(c => this.processSegmentAgainstRoute(c._injector ?? t, n, c, r, o, i, s, a).pipe(yt(l => {
                if (l instanceof kr) return U(null);
                throw l
            }))), lt(c => !!c), yt(c => {
                if (a0(c)) return yC(r, o, i) ? U(new nu) : Rn(r);
                throw c
            }))
        }
        processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
            return tt(r) !== s && (s === z || !Mi(o, i, r)) ? Rn(o) : r.redirectTo === void 0 ? this.matchSegmentAgainstRoute(t, o, r, i, s, c) : this.allowRedirects && a ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c) : Rn(o)
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
            let {
                matched: c,
                parameters: l,
                consumedSegments: u,
                positionalParamSegments: d,
                remainingSegments: f
            } = u0(n, o, i);
            if (!c) return Rn(n);
            typeof o.redirectTo == "string" && o.redirectTo[0] === "/" && (this.absoluteRedirectCount++, this.absoluteRedirectCount > CC && (this.allowRedirects = !1));
            let h = new On(i, l, Object.freeze(P({}, this.urlTree.queryParams)), this.urlTree.fragment, jh(o), tt(o), o.component ?? o._loadedComponent ?? null, o, Vh(o)),
                g = bi(h, a, this.paramsInheritanceStrategy);
            h.params = Object.freeze(g.params), h.data = Object.freeze(g.data);
            let v = this.applyRedirects.applyRedirectCommands(u, o.redirectTo, d, h, t);
            return this.applyRedirects.lineralizeSegments(o, v).pipe(ge(x => this.processSegment(t, r, n, x.concat(f), s, !1, a)))
        }
        matchSegmentAgainstRoute(t, n, r, o, i, s) {
            let a = hC(n, r, o, t, this.urlSerializer);
            return r.path === "**" && (n.children = {}), a.pipe(Ze(c => c.matched ? (t = r._injector ?? t, this.getChildConfig(t, r, o).pipe(Ze(({
                routes: l
            }) => {
                let u = r._loadedInjector ?? t,
                    {
                        parameters: d,
                        consumedSegments: f,
                        remainingSegments: h
                    } = c,
                    g = new On(f, d, Object.freeze(P({}, this.urlTree.queryParams)), this.urlTree.fragment, jh(r), tt(r), r.component ?? r._loadedComponent ?? null, r, Vh(r)),
                    v = bi(g, s, this.paramsInheritanceStrategy);
                g.params = Object.freeze(v.params), g.data = Object.freeze(v.data);
                let {
                    segmentGroup: x,
                    slicedSegments: p
                } = Lh(n, f, h, l);
                if (p.length === 0 && x.hasChildren()) return this.processChildren(u, l, x, g).pipe(ne(D => new Pe(g, D)));
                if (l.length === 0 && p.length === 0) return U(new Pe(g, []));
                let m = tt(r) === i;
                return this.processSegment(u, l, x, p, m ? z : i, !0, g).pipe(ne(D => new Pe(g, D instanceof Pe ? [D] : [])))
            }))) : Rn(n)))
        }
        getChildConfig(t, n, r) {
            return n.children ? U({
                routes: n.children,
                injector: t
            }) : n.loadChildren ? n._loadedRoutes !== void 0 ? U({
                routes: n._loadedRoutes,
                injector: n._loadedInjector
            }) : uC(t, n, r, this.urlSerializer).pipe(ge(o => o ? this.configLoader.loadChildren(t, n).pipe(ye(i => {
                n._loadedRoutes = i.routes, n._loadedInjector = i.injector
            })) : fC(n))) : U({
                routes: [],
                injector: t
            })
        }
    };

function EC(e) {
    e.sort((t, n) => t.value.outlet === z ? -1 : n.value.outlet === z ? 1 : t.value.outlet.localeCompare(n.value.outlet))
}

function wC(e) {
    let t = e.value.routeConfig;
    return t && t.path === ""
}

function l0(e) {
    let t = [],
        n = new Set;
    for (let r of e) {
        if (!wC(r)) {
            t.push(r);
            continue
        }
        let o = t.find(i => r.value.routeConfig === i.value.routeConfig);
        o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r)
    }
    for (let r of n) {
        let o = l0(r.children);
        t.push(new Pe(r.value, o))
    }
    return t.filter(r => !n.has(r))
}

function jh(e) {
    return e.data || {}
}

function Vh(e) {
    return e.resolve || {}
}

function bC(e, t, n, r, o, i) {
    return ge(s => DC(e, t, n, r, s.extractedUrl, o, i).pipe(ne(({
        state: a,
        tree: c
    }) => le(P({}, s), {
        targetSnapshot: a,
        urlAfterRedirects: c
    }))))
}

function IC(e, t) {
    return ge(n => {
        let {
            targetSnapshot: r,
            guards: {
                canActivateChecks: o
            }
        } = n;
        if (!o.length) return U(n);
        let i = new Set(o.map(c => c.route)),
            s = new Set;
        for (let c of i)
            if (!s.has(c))
                for (let l of d0(c)) s.add(l);
        let a = 0;
        return pe(s).pipe(fn(c => i.has(c) ? _C(c, r, e, t) : (c.data = bi(c, c.parent, e).resolve, U(void 0))), ye(() => a++), hn(1), ge(c => a === s.size ? U(n) : _e))
    })
}

function d0(e) {
    let t = e.children.map(n => d0(n)).flat();
    return [e, ...t]
}

function _C(e, t, n, r) {
    let o = e.routeConfig,
        i = e._resolve;
    return o?.title !== void 0 && !r0(o) && (i[Pr] = o.title), SC(i, e, t, r).pipe(ne(s => (e._resolvedData = s, e.data = bi(e, e.parent, n).resolve, null)))
}

function SC(e, t, n, r) {
    let o = Fc(e);
    if (o.length === 0) return U({});
    let i = {};
    return pe(o).pipe(ge(s => AC(e[s], t, n, r).pipe(lt(), ye(a => {
        if (a instanceof Fr) throw _i(new _r, a);
        i[s] = a
    }))), hn(1), ne(() => i), yt(s => a0(s) ? _e : ln(s)))
}

function AC(e, t, n, r) {
    let o = Br(t) ?? r,
        i = Hn(e, o),
        s = i.resolve ? i.resolve(t, n) : Je(o, () => i(t, n));
    return At(s)
}

function Nc(e) {
    return Ze(t => {
        let n = e(t);
        return n ? pe(n).pipe(ne(() => t)) : U(t)
    })
}
var f0 = (() => {
        class e {
            buildTitle(n) {
                let r, o = n.root;
                for (; o !== void 0;) r = this.getResolvedTitleForRoute(o) ?? r, o = o.children.find(i => i.outlet === z);
                return r
            }
            getResolvedTitleForRoute(n) {
                return n.data[Pr]
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => F(MC),
                providedIn: "root"
            })
        }
        return e
    })(),
    MC = (() => {
        class e extends f0 {
            title;
            constructor(n) {
                super(), this.title = n
            }
            updateTitle(n) {
                let r = this.buildTitle(n);
                r !== void 0 && this.title.setTitle(r)
            }
            static \u0275fac = function(r) {
                return new(r || e)(Z(Fh))
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    cu = new $("", {
        providedIn: "root",
        factory: () => ({})
    }),
    TC = (() => {
        class e {
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275cmp = si({
                type: e,
                selectors: [
                    ["ng-component"]
                ],
                exportAs: ["emptyRouterOutlet"],
                decls: 1,
                vars: 0,
                template: function(r, o) {
                    r & 1 && mc(0, "router-outlet")
                },
                dependencies: [LD],
                encapsulation: 2
            })
        }
        return e
    })();

function uu(e) {
    let t = e.children && e.children.map(uu),
        n = t ? le(P({}, e), {
            children: t
        }) : P({}, e);
    return !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== z && (n.component = TC), n
}
var lu = new $(""),
    NC = (() => {
        class e {
            componentLoaders = new WeakMap;
            childrenLoaders = new WeakMap;
            onLoadStartListener;
            onLoadEndListener;
            compiler = F(vc);
            loadComponent(n) {
                if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
                if (n._loadedComponent) return U(n._loadedComponent);
                this.onLoadStartListener && this.onLoadStartListener(n);
                let r = At(n.loadComponent()).pipe(ne(h0), ye(i => {
                        this.onLoadEndListener && this.onLoadEndListener(n), n._loadedComponent = i
                    }), er(() => {
                        this.componentLoaders.delete(n)
                    })),
                    o = new un(r, () => new Ee).pipe(cn());
                return this.componentLoaders.set(n, o), o
            }
            loadChildren(n, r) {
                if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
                if (r._loadedRoutes) return U({
                    routes: r._loadedRoutes,
                    injector: r._loadedInjector
                });
                this.onLoadStartListener && this.onLoadStartListener(r);
                let i = RC(r, this.compiler, n, this.onLoadEndListener).pipe(er(() => {
                        this.childrenLoaders.delete(r)
                    })),
                    s = new un(i, () => new Ee).pipe(cn());
                return this.childrenLoaders.set(r, s), s
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function RC(e, t, n, r) {
    return At(e.loadChildren()).pipe(ne(h0), ge(o => o instanceof lc || Array.isArray(o) ? U(o) : pe(t.compileModuleAsync(o))), ne(o => {
        r && r(e);
        let i, s, a = !1;
        return Array.isArray(o) ? (s = o, a = !0) : (i = o.create(n).injector, s = i.get(lu, [], {
            optional: !0,
            self: !0
        }).flat()), {
            routes: s.map(uu),
            injector: i
        }
    }))
}

function FC(e) {
    return e && typeof e == "object" && "default" in e
}

function h0(e) {
    return FC(e) ? e.default : e
}
var du = (() => {
        class e {
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => F(kC),
                providedIn: "root"
            })
        }
        return e
    })(),
    kC = (() => {
        class e {
            shouldProcessUrl(n) {
                return !0
            }
            extract(n) {
                return n
            }
            merge(n, r) {
                return n
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    OC = new $("");
var PC = new $(""),
    BC = (() => {
        class e {
            currentNavigation = null;
            currentTransition = null;
            lastSuccessfulNavigation = null;
            events = new Ee;
            transitionAbortSubject = new Ee;
            configLoader = F(NC);
            environmentInjector = F(He);
            destroyRef = F(Ko);
            urlSerializer = F(iu);
            rootContexts = F(Ai);
            location = F(vr);
            inputBindingEnabled = F(au, {
                optional: !0
            }) !== null;
            titleStrategy = F(f0);
            options = F(cu, {
                optional: !0
            }) || {};
            paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
            urlHandlingStrategy = F(du);
            createViewTransition = F(OC, {
                optional: !0
            });
            navigationErrorHandler = F(PC, {
                optional: !0
            });
            navigationId = 0;
            get hasRequestedNavigation() {
                return this.navigationId !== 0
            }
            transitions;
            afterPreactivation = () => U(void 0);
            rootComponentType = null;
            destroyed = !1;
            constructor() {
                let n = o => this.events.next(new $c(o)),
                    r = o => this.events.next(new Uc(o));
                this.configLoader.onLoadEndListener = r, this.configLoader.onLoadStartListener = n, this.destroyRef.onDestroy(() => {
                    this.destroyed = !0
                })
            }
            complete() {
                this.transitions?.complete()
            }
            handleNavigationRequest(n) {
                let r = ++this.navigationId;
                this.transitions?.next(le(P(P({}, this.transitions.value), n), {
                    id: r
                }))
            }
            setupNavigations(n, r, o) {
                return this.transitions = new xe({
                    id: 0,
                    currentUrlTree: r,
                    currentRawUrl: r,
                    extractedUrl: this.urlHandlingStrategy.extract(r),
                    urlAfterRedirects: this.urlHandlingStrategy.extract(r),
                    rawUrl: r,
                    extras: {},
                    resolve: () => {},
                    reject: () => {},
                    promise: Promise.resolve(!0),
                    source: br,
                    restoredState: null,
                    currentSnapshot: o.snapshot,
                    targetSnapshot: null,
                    currentRouterState: o,
                    targetRouterState: null,
                    guards: {
                        canActivateChecks: [],
                        canDeactivateChecks: []
                    },
                    guardsResult: null
                }), this.transitions.pipe(Ge(i => i.id !== 0), ne(i => le(P({}, i), {
                    extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl)
                })), Ze(i => {
                    let s = !1,
                        a = !1;
                    return U(i).pipe(Ze(c => {
                        if (this.navigationId > i.id) return this.cancelNavigationTransition(i, "", Be.SupersededByNewNavigation), _e;
                        this.currentTransition = i, this.currentNavigation = {
                            id: c.id,
                            initialUrl: c.rawUrl,
                            extractedUrl: c.extractedUrl,
                            targetBrowserUrl: typeof c.extras.browserUrl == "string" ? this.urlSerializer.parse(c.extras.browserUrl) : c.extras.browserUrl,
                            trigger: c.source,
                            extras: c.extras,
                            previousNavigation: this.lastSuccessfulNavigation ? le(P({}, this.lastSuccessfulNavigation), {
                                previousNavigation: null
                            }) : null
                        };
                        let l = !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                            u = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                        if (!l && u !== "reload") {
                            let d = "";
                            return this.events.next(new Kt(c.id, this.urlSerializer.serialize(c.rawUrl), d, Bc.IgnoredSameUrlNavigation)), c.resolve(!1), _e
                        }
                        if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl)) return U(c).pipe(Ze(d => {
                            let f = this.transitions?.getValue();
                            return this.events.next(new Mr(d.id, this.urlSerializer.serialize(d.extractedUrl), d.source, d.restoredState)), f !== this.transitions?.getValue() ? _e : Promise.resolve(d)
                        }), bC(this.environmentInjector, this.configLoader, this.rootComponentType, n.config, this.urlSerializer, this.paramsInheritanceStrategy), ye(d => {
                            i.targetSnapshot = d.targetSnapshot, i.urlAfterRedirects = d.urlAfterRedirects, this.currentNavigation = le(P({}, this.currentNavigation), {
                                finalUrl: d.urlAfterRedirects
                            });
                            let f = new Ci(d.id, this.urlSerializer.serialize(d.extractedUrl), this.urlSerializer.serialize(d.urlAfterRedirects), d.targetSnapshot);
                            this.events.next(f)
                        }));
                        if (l && this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)) {
                            let {
                                id: d,
                                extractedUrl: f,
                                source: h,
                                restoredState: g,
                                extras: v
                            } = c, x = new Mr(d, this.urlSerializer.serialize(f), h, g);
                            this.events.next(x);
                            let p = t0(this.rootComponentType).snapshot;
                            return this.currentTransition = i = le(P({}, c), {
                                targetSnapshot: p,
                                urlAfterRedirects: f,
                                extras: le(P({}, v), {
                                    skipLocationChange: !1,
                                    replaceUrl: !1
                                })
                            }), this.currentNavigation.finalUrl = f, U(i)
                        } else {
                            let d = "";
                            return this.events.next(new Kt(c.id, this.urlSerializer.serialize(c.extractedUrl), d, Bc.IgnoredByUrlHandlingStrategy)), c.resolve(!1), _e
                        }
                    }), ye(c => {
                        let l = new Lc(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot);
                        this.events.next(l)
                    }), ne(c => (this.currentTransition = i = le(P({}, c), {
                        guards: zD(c.targetSnapshot, c.currentSnapshot, this.rootContexts)
                    }), i)), tC(this.environmentInjector, c => this.events.next(c)), ye(c => {
                        if (i.guardsResult = c.guardsResult, c.guardsResult && typeof c.guardsResult != "boolean") throw _i(this.urlSerializer, c.guardsResult);
                        let l = new jc(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot, !!c.guardsResult);
                        this.events.next(l)
                    }), Ge(c => c.guardsResult ? !0 : (this.cancelNavigationTransition(c, "", Be.GuardRejected), !1)), Nc(c => {
                        if (c.guards.canActivateChecks.length) return U(c).pipe(ye(l => {
                            let u = new Vc(l.id, this.urlSerializer.serialize(l.extractedUrl), this.urlSerializer.serialize(l.urlAfterRedirects), l.targetSnapshot);
                            this.events.next(u)
                        }), Ze(l => {
                            let u = !1;
                            return U(l).pipe(IC(this.paramsInheritanceStrategy, this.environmentInjector), ye({
                                next: () => u = !0,
                                complete: () => {
                                    u || this.cancelNavigationTransition(l, "", Be.NoDataFromResolver)
                                }
                            }))
                        }), ye(l => {
                            let u = new Hc(l.id, this.urlSerializer.serialize(l.extractedUrl), this.urlSerializer.serialize(l.urlAfterRedirects), l.targetSnapshot);
                            this.events.next(u)
                        }))
                    }), Nc(c => {
                        let l = u => {
                            let d = [];
                            u.routeConfig?.loadComponent && !u.routeConfig._loadedComponent && d.push(this.configLoader.loadComponent(u.routeConfig).pipe(ye(f => {
                                u.component = f
                            }), ne(() => {})));
                            for (let f of u.children) d.push(...l(f));
                            return d
                        };
                        return lo(l(c.targetSnapshot.root)).pipe(Dt(null), ut(1))
                    }), Nc(() => this.afterPreactivation()), Ze(() => {
                        let {
                            currentSnapshot: c,
                            targetSnapshot: l
                        } = i, u = this.createViewTransition?.(this.environmentInjector, c.root, l.root);
                        return u ? pe(u).pipe(ne(() => i)) : U(i)
                    }), ne(c => {
                        let l = jD(n.routeReuseStrategy, c.targetSnapshot, c.currentRouterState);
                        return this.currentTransition = i = le(P({}, c), {
                            targetRouterState: l
                        }), this.currentNavigation.targetRouterState = l, i
                    }), ye(() => {
                        this.events.next(new Nr)
                    }), UD(this.rootContexts, n.routeReuseStrategy, c => this.events.next(c), this.inputBindingEnabled), ut(1), ye({
                        next: c => {
                            s = !0, this.lastSuccessfulNavigation = this.currentNavigation, this.events.next(new Qt(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects))), this.titleStrategy?.updateTitle(c.targetRouterState.snapshot), c.resolve(!0)
                        },
                        complete: () => {
                            s = !0
                        }
                    }), js(this.transitionAbortSubject.pipe(ye(c => {
                        throw c
                    }))), er(() => {
                        !s && !a && this.cancelNavigationTransition(i, "", Be.SupersededByNewNavigation), this.currentTransition?.id === i.id && (this.currentNavigation = null, this.currentTransition = null)
                    }), yt(c => {
                        if (this.destroyed) return i.resolve(!1), _e;
                        if (a = !0, s0(c)) this.events.next(new ht(i.id, this.urlSerializer.serialize(i.extractedUrl), c.message, c.cancellationCode)), $D(c) ? this.events.next(new Ln(c.url, c.navigationBehaviorOptions)) : i.resolve(!1);
                        else {
                            let l = new Tr(i.id, this.urlSerializer.serialize(i.extractedUrl), c, i.targetSnapshot ?? void 0);
                            try {
                                let u = Je(this.environmentInjector, () => this.navigationErrorHandler?.(l));
                                if (u instanceof Fr) {
                                    let {
                                        message: d,
                                        cancellationCode: f
                                    } = _i(this.urlSerializer, u);
                                    this.events.next(new ht(i.id, this.urlSerializer.serialize(i.extractedUrl), d, f)), this.events.next(new Ln(u.redirectTo, u.navigationBehaviorOptions))
                                } else throw this.events.next(l), c
                            } catch (u) {
                                this.options.resolveNavigationPromiseOnError ? i.resolve(!1) : i.reject(u)
                            }
                        }
                        return _e
                    }))
                }))
            }
            cancelNavigationTransition(n, r, o) {
                let i = new ht(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
                this.events.next(i), n.resolve(!1)
            }
            isUpdatingInternalState() {
                return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString()
            }
            isUpdatedBrowserUrl() {
                let n = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
                    r = this.currentNavigation?.targetBrowserUrl ?? this.currentNavigation?.extractedUrl;
                return n.toString() !== r?.toString() && !this.currentNavigation?.extras.skipLocationChange
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function LC(e) {
    return e !== br
}
var jC = (() => {
        class e {
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => F(VC),
                providedIn: "root"
            })
        }
        return e
    })(),
    ou = class {
        shouldDetach(t) {
            return !1
        }
        store(t, n) {}
        shouldAttach(t) {
            return !1
        }
        retrieve(t) {
            return null
        }
        shouldReuseRoute(t, n) {
            return t.routeConfig === n.routeConfig
        }
    },
    VC = (() => {
        class e extends ou {
            static \u0275fac = (() => {
                let n;
                return function(o) {
                    return (n || (n = za(e)))(o || e)
                }
            })();
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    p0 = (() => {
        class e {
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: () => F(HC),
                providedIn: "root"
            })
        }
        return e
    })(),
    HC = (() => {
        class e extends p0 {
            location = F(vr);
            urlSerializer = F(iu);
            options = F(cu, {
                optional: !0
            }) || {};
            canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
            urlHandlingStrategy = F(du);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            currentUrlTree = new pt;
            getCurrentUrlTree() {
                return this.currentUrlTree
            }
            rawUrlTree = this.currentUrlTree;
            getRawUrlTree() {
                return this.rawUrlTree
            }
            currentPageId = 0;
            lastSuccessfulId = -1;
            restoredState() {
                return this.location.getState()
            }
            get browserPageId() {
                return this.canceledNavigationResolution !== "computed" ? this.currentPageId : this.restoredState()?.\u0275routerPageId ?? this.currentPageId
            }
            routerState = t0(null);
            getRouterState() {
                return this.routerState
            }
            stateMemento = this.createStateMemento();
            createStateMemento() {
                return {
                    rawUrlTree: this.rawUrlTree,
                    currentUrlTree: this.currentUrlTree,
                    routerState: this.routerState
                }
            }
            registerNonRouterCurrentEntryChangeListener(n) {
                return this.location.subscribe(r => {
                    r.type === "popstate" && n(r.url, r.state)
                })
            }
            handleRouterEvent(n, r) {
                if (n instanceof Mr) this.stateMemento = this.createStateMemento();
                else if (n instanceof Kt) this.rawUrlTree = r.initialUrl;
                else if (n instanceof Ci) {
                    if (this.urlUpdateStrategy === "eager" && !r.extras.skipLocationChange) {
                        let o = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
                        this.setBrowserUrl(r.targetBrowserUrl ?? o, r)
                    }
                } else n instanceof Nr ? (this.currentUrlTree = r.finalUrl, this.rawUrlTree = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl), this.routerState = r.targetRouterState, this.urlUpdateStrategy === "deferred" && !r.extras.skipLocationChange && this.setBrowserUrl(r.targetBrowserUrl ?? this.rawUrlTree, r)) : n instanceof ht && (n.code === Be.GuardRejected || n.code === Be.NoDataFromResolver) ? this.restoreHistory(r) : n instanceof Tr ? this.restoreHistory(r, !0) : n instanceof Qt && (this.lastSuccessfulId = n.id, this.currentPageId = this.browserPageId)
            }
            setBrowserUrl(n, r) {
                let o = n instanceof pt ? this.urlSerializer.serialize(n) : n;
                if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
                    let i = this.browserPageId,
                        s = P(P({}, r.extras.state), this.generateNgRouterState(r.id, i));
                    this.location.replaceState(o, "", s)
                } else {
                    let i = P(P({}, r.extras.state), this.generateNgRouterState(r.id, this.browserPageId + 1));
                    this.location.go(o, "", i)
                }
            }
            restoreHistory(n, r = !1) {
                if (this.canceledNavigationResolution === "computed") {
                    let o = this.browserPageId,
                        i = this.currentPageId - o;
                    i !== 0 ? this.location.historyGo(i) : this.currentUrlTree === n.finalUrl && i === 0 && (this.resetState(n), this.resetUrlToCurrentUrlTree())
                } else this.canceledNavigationResolution === "replace" && (r && this.resetState(n), this.resetUrlToCurrentUrlTree())
            }
            resetState(n) {
                this.routerState = this.stateMemento.routerState, this.currentUrlTree = this.stateMemento.currentUrlTree, this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n.finalUrl ?? this.rawUrlTree)
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
            }
            generateNgRouterState(n, r) {
                return this.canceledNavigationResolution === "computed" ? {
                    navigationId: n,
                    \u0275routerPageId: r
                } : {
                    navigationId: n
                }
            }
            static \u0275fac = (() => {
                let n;
                return function(o) {
                    return (n || (n = za(e)))(o || e)
                }
            })();
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function $C(e, t) {
    e.events.pipe(Ge(n => n instanceof Qt || n instanceof ht || n instanceof Tr || n instanceof Kt), ne(n => n instanceof Qt || n instanceof Kt ? 0 : (n instanceof ht ? n.code === Be.Redirect || n.code === Be.SupersededByNewNavigation : !1) ? 2 : 1), Ge(n => n !== 2), ut(1)).subscribe(() => {
        t()
    })
}
var UC = {
        paths: "exact",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "exact"
    },
    zC = {
        paths: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "subset"
    },
    g0 = (() => {
        class e {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree()
            }
            get rawUrlTree() {
                return this.stateManager.getRawUrlTree()
            }
            disposed = !1;
            nonRouterCurrentEntryChangeSubscription;
            console = F(pc);
            stateManager = F(p0);
            options = F(cu, {
                optional: !0
            }) || {};
            pendingTasks = F(An);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            navigationTransitions = F(BC);
            urlSerializer = F(iu);
            location = F(vr);
            urlHandlingStrategy = F(du);
            _events = new Ee;
            get events() {
                return this._events
            }
            get routerState() {
                return this.stateManager.getRouterState()
            }
            navigated = !1;
            routeReuseStrategy = F(jC);
            onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
            config = F(lu, {
                optional: !0
            })?.flat() ?? [];
            componentInputBindingEnabled = !!F(au, {
                optional: !0
            });
            constructor() {
                this.resetConfig(this.config), this.navigationTransitions.setupNavigations(this, this.currentUrlTree, this.routerState).subscribe({
                    error: n => {
                        this.console.warn(n)
                    }
                }), this.subscribeToNavigationEvents()
            }
            eventsSubscription = new fe;
            subscribeToNavigationEvents() {
                let n = this.navigationTransitions.events.subscribe(r => {
                    try {
                        let o = this.navigationTransitions.currentTransition,
                            i = this.navigationTransitions.currentNavigation;
                        if (o !== null && i !== null) {
                            if (this.stateManager.handleRouterEvent(r, i), r instanceof ht && r.code !== Be.Redirect && r.code !== Be.SupersededByNewNavigation) this.navigated = !0;
                            else if (r instanceof Qt) this.navigated = !0;
                            else if (r instanceof Ln) {
                                let s = r.navigationBehaviorOptions,
                                    a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                                    c = P({
                                        browserUrl: o.extras.browserUrl,
                                        info: o.extras.info,
                                        skipLocationChange: o.extras.skipLocationChange,
                                        replaceUrl: o.extras.replaceUrl || this.urlUpdateStrategy === "eager" || LC(o.source)
                                    }, s);
                                this.scheduleNavigation(a, br, null, c, {
                                    resolve: o.resolve,
                                    reject: o.reject,
                                    promise: o.promise
                                })
                            }
                        }
                        WC(r) && this._events.next(r)
                    } catch (o) {
                        this.navigationTransitions.transitionAbortSubject.next(o)
                    }
                });
                this.eventsSubscription.add(n)
            }
            resetRootComponentType(n) {
                this.routerState.root.component = n, this.navigationTransitions.rootComponentType = n
            }
            initialNavigation() {
                this.setUpLocationChangeListener(), this.navigationTransitions.hasRequestedNavigation || this.navigateToSyncWithBrowser(this.location.path(!0), br, this.stateManager.restoredState())
            }
            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ??= this.stateManager.registerNonRouterCurrentEntryChangeListener((n, r) => {
                    setTimeout(() => {
                        this.navigateToSyncWithBrowser(n, "popstate", r)
                    }, 0)
                })
            }
            navigateToSyncWithBrowser(n, r, o) {
                let i = {
                        replaceUrl: !0
                    },
                    s = o?.navigationId ? o : null;
                if (o) {
                    let c = P({}, o);
                    delete c.navigationId, delete c.\u0275routerPageId, Object.keys(c).length !== 0 && (i.state = c)
                }
                let a = this.parseUrl(n);
                this.scheduleNavigation(a, r, s, i)
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree)
            }
            getCurrentNavigation() {
                return this.navigationTransitions.currentNavigation
            }
            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation
            }
            resetConfig(n) {
                this.config = n.map(uu), this.navigated = !1
            }
            ngOnDestroy() {
                this.dispose()
            }
            dispose() {
                this._events.unsubscribe(), this.navigationTransitions.complete(), this.nonRouterCurrentEntryChangeSubscription && (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(), this.nonRouterCurrentEntryChangeSubscription = void 0), this.disposed = !0, this.eventsSubscription.unsubscribe()
            }
            createUrlTree(n, r = {}) {
                let {
                    relativeTo: o,
                    queryParams: i,
                    fragment: s,
                    queryParamsHandling: a,
                    preserveFragment: c
                } = r, l = c ? this.currentUrlTree.fragment : s, u = null;
                switch (a ?? this.options.defaultQueryParamsHandling) {
                    case "merge":
                        u = P(P({}, this.currentUrlTree.queryParams), i);
                        break;
                    case "preserve":
                        u = this.currentUrlTree.queryParams;
                        break;
                    default:
                        u = i || null
                }
                u !== null && (u = this.removeEmptyProps(u));
                let d;
                try {
                    let f = o ? o.snapshot : this.routerState.snapshot.root;
                    d = Kh(f)
                } catch {
                    (typeof n[0] != "string" || n[0][0] !== "/") && (n = []), d = this.currentUrlTree.root
                }
                return Xh(d, n, u, l ?? null)
            }
            navigateByUrl(n, r = {
                skipLocationChange: !1
            }) {
                let o = Sr(n) ? n : this.parseUrl(n),
                    i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
                return this.scheduleNavigation(i, br, null, r)
            }
            navigate(n, r = {
                skipLocationChange: !1
            }) {
                return qC(n), this.navigateByUrl(this.createUrlTree(n, r), r)
            }
            serializeUrl(n) {
                return this.urlSerializer.serialize(n)
            }
            parseUrl(n) {
                try {
                    return this.urlSerializer.parse(n)
                } catch {
                    return this.urlSerializer.parse("/")
                }
            }
            isActive(n, r) {
                let o;
                if (r === !0 ? o = P({}, UC) : r === !1 ? o = P({}, zC) : o = r, Sr(n)) return kh(this.currentUrlTree, n, o);
                let i = this.parseUrl(n);
                return kh(this.currentUrlTree, i, o)
            }
            removeEmptyProps(n) {
                return Object.entries(n).reduce((r, [o, i]) => (i != null && (r[o] = i), r), {})
            }
            scheduleNavigation(n, r, o, i, s) {
                if (this.disposed) return Promise.resolve(!1);
                let a, c, l;
                s ? (a = s.resolve, c = s.reject, l = s.promise) : l = new Promise((d, f) => {
                    a = d, c = f
                });
                let u = this.pendingTasks.add();
                return $C(this, () => {
                    queueMicrotask(() => this.pendingTasks.remove(u))
                }), this.navigationTransitions.handleNavigationRequest({
                    source: r,
                    restoredState: o,
                    currentUrlTree: this.currentUrlTree,
                    currentRawUrl: this.currentUrlTree,
                    rawUrl: n,
                    extras: i,
                    resolve: a,
                    reject: c,
                    promise: l,
                    currentSnapshot: this.routerState.snapshot,
                    currentRouterState: this.routerState
                }), l.catch(d => Promise.reject(d))
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();

function qC(e) {
    for (let t = 0; t < e.length; t++)
        if (e[t] == null) throw new L(4008, !1)
}

function WC(e) {
    return !(e instanceof Nr) && !(e instanceof Ln)
}
var GC = new $("");

function m0(e, ...t) {
    return qo([{
            provide: lu,
            multi: !0,
            useValue: e
        },
        [], {
            provide: jn,
            useFactory: ZC,
            deps: [g0]
        }, {
            provide: gc,
            multi: !0,
            useFactory: YC
        },
        t.map(n => n.\u0275providers)
    ])
}

function ZC(e) {
    return e.routerState.root
}

function YC() {
    let e = F(ot);
    return t => {
        let n = e.get(It);
        if (t !== n.components[0]) return;
        let r = e.get(g0),
            o = e.get(QC);
        e.get(KC) === 1 && r.initialNavigation(), e.get(XC, null, G.Optional)?.setUpPreloading(), e.get(GC, null, G.Optional)?.init(), r.resetRootComponentType(n.componentTypes[0]), o.closed || (o.next(), o.complete(), o.unsubscribe())
    }
}
var QC = new $("", {
        factory: () => new Ee
    }),
    KC = new $("", {
        providedIn: "root",
        factory: () => 1
    });
var XC = new $("");
var v0 = [];
var x0 = {
    providers: [ah({
        eventCoalescing: !0
    }), m0(v0)]
};
var Ti = (() => {
    class e {
        constructor(n, r) {
            this.document = n, this.platformId = r, this.documentIsAccessible = Eh(this.platformId)
        }
        static getCookieRegExp(n) {
            let r = n.replace(/([\[\]{}()|=;+?,.*^$])/gi, "\\$1");
            return new RegExp("(?:^" + r + "|;\\s*" + r + ")=(.*?)(?:;|$)", "g")
        }
        static safeDecodeURIComponent(n) {
            try {
                return decodeURIComponent(n)
            } catch {
                return n
            }
        }
        check(n) {
            return this.documentIsAccessible ? (n = encodeURIComponent(n), e.getCookieRegExp(n).test(this.document.cookie)) : !1
        }
        get(n) {
            if (this.check(n)) {
                n = encodeURIComponent(n);
                let o = e.getCookieRegExp(n).exec(this.document.cookie);
                return o && o[1] ? e.safeDecodeURIComponent(o[1]) : ""
            } else return ""
        }
        getAll() {
            if (!this.documentIsAccessible) return {};
            let n = {},
                r = this.document;
            return r.cookie && r.cookie !== "" && r.cookie.split(";").forEach(o => {
                let [i, s] = o.split("=");
                n[e.safeDecodeURIComponent(i.replace(/^ /, ""))] = e.safeDecodeURIComponent(s)
            }), n
        }
        set(n, r, o, i, s, a, c, l) {
            if (!this.documentIsAccessible) return;
            if (typeof o == "number" || o instanceof Date || i || s || a || c) {
                let f = {
                    expires: o,
                    path: i,
                    domain: s,
                    secure: a,
                    sameSite: c || "Lax",
                    partitioned: l
                };
                this.set(n, r, f);
                return
            }
            let u = encodeURIComponent(n) + "=" + encodeURIComponent(r) + ";",
                d = o || {};
            if (d.expires)
                if (typeof d.expires == "number") {
                    let f = new Date(new Date().getTime() + d.expires * 1e3 * 60 * 60 * 24);
                    u += "expires=" + f.toUTCString() + ";"
                } else u += "expires=" + d.expires.toUTCString() + ";";
            d.path && (u += "path=" + d.path + ";"), d.domain && (u += "domain=" + d.domain + ";"), d.secure === !1 && d.sameSite === "None" && (d.secure = !0, console.warn(`[ngx-cookie-service] Cookie ${n} was forced with secure flag because sameSite=None.More details : https://github.com/stevermeister/ngx-cookie-service/issues/86#issuecomment-597720130`)), d.secure && (u += "secure;"), d.sameSite || (d.sameSite = "Lax"), u += "sameSite=" + d.sameSite + ";", d.partitioned && (u += "Partitioned;"), this.document.cookie = u
        }
        delete(n, r, o, i, s = "Lax") {
            if (!this.documentIsAccessible) return;
            let a = new Date("Thu, 01 Jan 1970 00:00:01 GMT");
            this.set(n, "", {
                expires: a,
                path: r,
                domain: o,
                secure: i,
                sameSite: s
            })
        }
        deleteAll(n, r, o, i = "Lax") {
            if (!this.documentIsAccessible) return;
            let s = this.getAll();
            for (let a in s) s.hasOwnProperty(a) && this.delete(a, n, r, o, i)
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || e)(Z(Me), Z(zt))
            }
        }
        static {
            this.\u0275prov = V({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
    }
    return e
})();
var $n = Yp(Sp());

function eE(e, t) {
    e & 1 && (Mn(0, "p"), ai(1, "Yes"), Tn())
}

function tE(e, t) {
    e & 1 && (Mn(0, "p"), ai(1, "No"), Tn())
}
var gs = class e {
    constructor(t) {
        this.cookieService = t;
        let n = "flagPart2_3",
            r = "U2FsdGVkX1/oCOrv2BF34XQbx7f34cYJ8aA71tr8cl8=",
            o = "U2FsdGVkX197aFEtB5VUIBcswkWs4GiFPal6425rsTU=";
        this.cookieService.set("flagPart2", $n.AES.decrypt(r, n).toString($n.enc.Utf8), {
            expires: 7,
            path: "/",
            secure: !0,
            sameSite: "Strict"
        });
        let i = new Headers;
        i.set("flagPart3", $n.AES.decrypt(o, n).toString($n.enc.Utf8)), fetch("/favicon.ico", {
            headers: i
        })
    }
    date = new Date;
    static \u0275fac = function(n) {
        return new(n || e)(Wt(Ti))
    };
    static \u0275cmp = si({
        type: e,
        selectors: [
            ["app-root"]
        ],
        features: [ih([Ti])],
        decls: 4,
        vars: 1,
        template: function(n, r) {
            n & 1 && (Mn(0, "p"), ai(1, "Is it Tuesday?"), Tn(), hc(2, eE, 2, 0, "p")(3, tE, 2, 0, "p")), n & 2 && (bf(2), rh(r.date.getDay() == 3 ? 2 : 3))
        },
        styles: ["p[_ngcontent-%COMP%]{font-family:Comic Sans MS,cursive,sans-serif;font-size:24px;color:#ff69b4;text-shadow:2px 2px 5px yellow;background:repeating-linear-gradient(45deg,#0ff,#f0f 10%,#ff0 20%);padding:10px;border:5px dashed lime;transform:rotate(-5deg);animation:_ngcontent-%COMP%_wiggle .1s infinite alternate}@keyframes _ngcontent-%COMP%_wiggle{0%{transform:rotate(-5deg)}to{transform:rotate(5deg)}}"]
    })
};
Rh(gs, x0).catch(e => console.error(e));