// hitsfx.js

// ── HIT SOUNDS ────────────────────────────────────────────────────────────
/* Each hit effect (HIT_FX in ui.js) has a sound of its own, played with the
   burst (playHitSound, from playHitEffect). Nothing is stored as audio: each
   sound is synthesised once into an AudioBuffer with an OfflineAudioContext
   (noise, oscillators, envelopes, a small reverb), then replayed through the
   shared AudioContext (sfx.js) at the SFX volume. A seeded random makes every
   render of a sound identical.
   TEST: HIT_SFX[fx] holds 5 candidates; _hitSfxPick[fx] (memory only) says
   which one plays, chosen in the Progress tab in preview mode. Once the
   developer picks one per effect, the other candidates go. */
var HITSFX_DUR = 0.8;   // seconds — the length of the default burst (Sparks)
var _hitSfxBufs = {};   // 'fx:n' → AudioBuffer
var _hitSfxPick = {};   // fx → candidate index (TEST)

// Seeded random (mulberry32), reset for every render
var _hsSeed = 1;
function _hr(a, b) {
  _hsSeed = (_hsSeed + 0x6D2B79F5) | 0;
  var x = Math.imul(_hsSeed ^ (_hsSeed >>> 15), 1 | _hsSeed);
  x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
  var r = ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  return a === undefined ? r : a + r * (b - a);
}

// ── Synth kit ─────────────────────────────────────────────────────────────
// S = { c: offline context, out: master, rev: reverb send, nb: noise buffers }
function _hsKit(c) {
  var S = { c: c, out: c.createGain() }, rate = c.sampleRate, len = rate * 2;
  S.out.connect(c.destination);
  function mk(fill) { var b = c.createBuffer(1, len, rate); fill(b.getChannelData(0)); return b; }
  S.nb = {
    white: mk(function(d) { for (var i = 0; i < d.length; i++) d[i] = _hr() * 2 - 1; }),
    // Paul Kellet's pink filter
    pink: mk(function(d) {
      var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (var i = 0; i < d.length; i++) {
        var w = _hr() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;    b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;    b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      }
    }),
    brown: mk(function(d) {
      var l = 0;
      for (var i = 0; i < d.length; i++) { l = (l + 0.02 * (_hr() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
    })
  };
  var ir = c.createBuffer(1, (rate * 1.2) | 0, rate), x = ir.getChannelData(0);
  for (var i = 0; i < x.length; i++) x[i] = (_hr() * 2 - 1) * Math.pow(1 - i / x.length, 3);
  S.rev = c.createConvolver(); S.rev.buffer = ir;
  var rg = c.createGain(); rg.gain.value = 0.6;
  S.rev.connect(rg); rg.connect(S.out);
  return S;
}
// Attack/decay envelope on a new gain node
function _hsEnv(S, t, a, d, v) {
  var g = S.c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(v, t + Math.max(a, 0.001));
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a, 0.001) + d);
  return g;
}
// Random amplitude flutter (fire, scratches, rustles): o.flick = { rate, depth }
function _hsFlick(S, node, t, len, fl) {
  if (!fl) return node;
  var g = S.c.createGain();
  g.gain.setValueAtTime(1, t);
  for (var x = t; x < t + len; x += 1 / fl.rate) g.gain.linearRampToValueAtTime(1 - fl.depth * _hr(), x);
  node.connect(g);
  return g;
}
// Dry to the master, o.wet to the reverb
function _hsOut(S, node, o) {
  node.connect(S.out);
  if (o.wet) { var w = S.c.createGain(); w.gain.value = o.wet; node.connect(w); w.connect(S.rev); }
}
// Filter sweep: f → f2 over the whole sound, or f → f2 (attack) → f3 (decay)
function _hsFilter(S, o, t) {
  var f = S.c.createBiquadFilter();
  f.type = o.ft || 'lowpass';
  f.Q.value = o.q || 0.7;
  f.frequency.setValueAtTime(o.f, t);
  if (o.f3) {
    f.frequency.exponentialRampToValueAtTime(o.f2, t + (o.a || 0.01));
    f.frequency.exponentialRampToValueAtTime(o.f3, t + (o.a || 0.01) + o.d);
  } else if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + (o.a || 0.01) + o.d);
  return f;
}
// Filtered noise: { t, a, d, v, col: white|pink|brown, ft, f, f2, f3, q, flick, wet }
function _hsNoise(S, o) {
  var t = o.t || 0, a = o.a || 0.005, len = a + o.d;
  var src = S.c.createBufferSource();
  src.buffer = S.nb[o.col || 'white'];
  var fl = _hsFilter(S, o, t), g = _hsEnv(S, t, a, o.d, o.v);
  src.connect(fl); fl.connect(g);
  _hsOut(S, _hsFlick(S, g, t, len, o.flick), o);
  src.start(t, _hr(0, 0.8)); src.stop(t + len + 0.02);
}
// Oscillator: { t, a, d, v, type, f, f2, f3 (glides like the filter), vib: { rate, depth }, lp, flick, wet }
function _hsTone(S, o) {
  var c = S.c, t = o.t || 0, a = o.a || 0.005, len = a + o.d;
  var osc = c.createOscillator();
  osc.type = o.type || 'sine';
  osc.frequency.setValueAtTime(o.f, t);
  if (o.f3) {
    osc.frequency.exponentialRampToValueAtTime(o.f2, t + a);
    osc.frequency.exponentialRampToValueAtTime(o.f3, t + len);
  } else if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + (o.g || len));
  if (o.vib) {
    var lfo = c.createOscillator(), lg = c.createGain();
    lfo.frequency.value = o.vib.rate; lg.gain.value = o.vib.depth;
    lfo.connect(lg); lg.connect(osc.frequency);
    lfo.start(t); lfo.stop(t + len + 0.02);
  }
  var node = osc;
  if (o.lp) { var f = c.createBiquadFilter(); f.frequency.value = o.lp; osc.connect(f); node = f; }
  var g = _hsEnv(S, t, a, o.d, o.v);
  node.connect(g);
  _hsOut(S, _hsFlick(S, g, t, len, o.flick), o);
  osc.start(t); osc.stop(t + len + 0.02);
}
// Struck metal: sine partials, each decaying at its own pace.
// parts = [[ratio, level, decay factor]]; trem = { rate, depth } (a spinning coin)
var HS_COIN = [[1, 1, 1], [2.76, 0.6, 0.7], [5.4, 0.4, 0.5], [8.93, 0.2, 0.35]];
var HS_GLOCK = [[1, 1, 1], [2.9, 0.25, 0.5], [5.8, 0.1, 0.3]];
var HS_CHURCH = [[0.5, 0.6, 1.4], [1, 1, 1], [1.19, 0.5, 0.8], [1.5, 0.4, 0.7], [2, 0.35, 0.6], [2.5, 0.2, 0.5], [3, 0.15, 0.4]];
function _hsBell(S, o) {
  (o.parts || HS_COIN).forEach(function(p) {
    _hsTone(S, { t: o.t, a: o.a || 0.002, d: o.d * p[2], v: o.v * p[1], f: o.f * p[0], wet: o.wet,
      flick: o.trem });
  });
}
// Crackle: n tiny noise pops between t and t+d, thinning out (pow > 1)
function _hsCrackle(S, o) {
  for (var i = 0; i < o.n; i++) {
    var t = (o.t || 0) + o.d * Math.pow(_hr(), o.pow || 1.4);
    _hsNoise(S, { t: t, a: 0.001, d: _hr(0.004, 0.018), v: o.v * _hr(0.3, 1), col: 'white',
      ft: 'bandpass', f: o.f * _hr(0.6, 1.6), q: o.q || 1.2, wet: o.wet });
  }
}
// Water drop: a sine whose pitch jumps up as it decays
function _hsDrop(S, t, f, v, wet) {
  _hsTone(S, { t: t, a: 0.002, d: 0.07, v: v, f: f, f2: f * 2.2, g: 0.045, wet: wet || 0.25 });
}
function _hsThud(S, t, v, f, wet) {
  _hsTone(S, { t: t, a: 0.003, d: 0.22, v: v, f: f, f2: f * 0.4, wet: wet });
  _hsNoise(S, { t: t, a: 0.002, d: 0.05, v: v * 0.6, col: 'pink', f: 900, wet: wet });
}
function _hsFlap(S, t, v) {
  _hsNoise(S, { t: t, a: 0.025, d: 0.12, v: v, col: 'pink', f: 1400, f2: 300 });
  _hsNoise(S, { t: t, a: 0.02, d: 0.1, v: v * 0.6, col: 'brown', f: 250 });
}
function _hsTick(S, t, f, v, wet) {
  _hsNoise(S, { t: t, a: 0.001, d: 0.02, v: v, ft: 'bandpass', f: f, q: 4, wet: wet });
  _hsBell(S, { t: t, f: f * 0.9, d: 0.04, v: v * 0.25, wet: wet });
}
function _hsPluck(S, t, f, v, wet) {
  _hsTone(S, { t: t, a: 0.003, d: 0.35, v: v, f: f, type: 'triangle', wet: wet });
  _hsTone(S, { t: t, a: 0.003, d: 0.15, v: v * 0.3, f: f * 2, wet: wet });
}

// ── Candidates ────────────────────────────────────────────────────────────
// Five per effect, each { name, make(S) }; S.reverse plays the render backwards
var HIT_SFX = {
  sparks: [
    { name: 'Pederneira', make: function(S) {
      _hsNoise(S, { a: 0.001, d: 0.04, v: 1, ft: 'highpass', f: 3500 });
      _hsBell(S, { f: 4200, d: 0.12, v: 0.25 });
      _hsCrackle(S, { t: 0.03, d: 0.55, n: 14, v: 0.5, f: 4500, q: 1.5, pow: 1.6 });
    } },
    { name: 'Estrelinha', make: function(S) {
      _hsNoise(S, { a: 0.03, d: 0.7, v: 0.35, ft: 'bandpass', f: 6000, q: 0.8, flick: { rate: 45, depth: 0.7 } });
      _hsCrackle(S, { d: 0.7, n: 30, v: 0.45, f: 5000 });
    } },
    { name: 'Choque elétrico', make: function(S) {
      _hsTone(S, { a: 0.005, d: 0.3, v: 0.3, f: 70, type: 'sawtooth', lp: 2500, flick: { rate: 70, depth: 0.9 } });
      _hsNoise(S, { a: 0.005, d: 0.3, v: 0.5, ft: 'bandpass', f: 2500, q: 2, flick: { rate: 70, depth: 0.9 } });
      _hsCrackle(S, { t: 0.25, d: 0.45, n: 8, v: 0.4, f: 4000 });
    } },
    { name: 'Brilho', make: function(S) {
      var notes = [2093, 2637, 3136, 3520, 4186, 5274, 6272];
      for (var i = 0; i < 7; i++) _hsTone(S, { t: i === 0 ? 0 : _hr(0, 0.5), a: 0.002, d: 0.18, v: 0.25, f: notes[(_hr() * 7) | 0], wet: 0.5 });
      _hsNoise(S, { a: 0.01, d: 0.3, v: 0.08, ft: 'highpass', f: 7000 });
    } },
    { name: 'Estalinhos', make: function(S) {
      _hsNoise(S, { a: 0.001, d: 0.03, v: 0.9, ft: 'bandpass', f: 2000, q: 0.7 });
      _hsCrackle(S, { d: 0.6, n: 40, v: 0.7, f: 2500, q: 0.7, wet: 0.3 });
    } }
  ],
  flames: [
    { name: 'Ignição', make: function(S) {
      _hsNoise(S, { a: 0.12, d: 0.6, v: 0.9, col: 'brown', f: 250, f2: 1800, flick: { rate: 18, depth: 0.35 } });
      _hsCrackle(S, { t: 0.08, d: 0.6, n: 12, v: 0.35, f: 3000 });
      _hsTone(S, { a: 0.01, d: 0.25, v: 0.4, f: 70, f2: 40 });
    } },
    { name: 'Tocha', make: function(S) {
      _hsNoise(S, { a: 0.06, d: 0.7, v: 0.8, col: 'pink', ft: 'bandpass', f: 700, q: 0.6, flick: { rate: 28, depth: 0.6 } });
      _hsNoise(S, { a: 0.05, d: 0.7, v: 0.7, col: 'brown', f: 300 });
    } },
    { name: 'Fogueira', make: function(S) {
      _hsNoise(S, { a: 0.05, d: 0.7, v: 0.45, col: 'brown', f: 400, flick: { rate: 10, depth: 0.3 } });
      _hsCrackle(S, { d: 0.72, n: 26, v: 0.6, f: 3500, q: 1, pow: 1 });
    } },
    { name: 'Bola de fogo', make: function(S) {
      _hsNoise(S, { a: 0.2, d: 0.5, v: 1, col: 'pink', f: 200, f2: 4000, f3: 400, wet: 0.3 });
      _hsTone(S, { t: 0.18, a: 0.01, d: 0.4, v: 0.7, f: 90, f2: 35, wet: 0.3 });
    } },
    { name: 'Fósforo', make: function(S) {
      _hsNoise(S, { a: 0.005, d: 0.1, v: 0.6, ft: 'bandpass', f: 3500, q: 1.5, flick: { rate: 60, depth: 0.8 } });
      _hsNoise(S, { t: 0.1, a: 0.06, d: 0.6, v: 0.9, col: 'pink', f: 500, f2: 3500, f3: 900, flick: { rate: 25, depth: 0.4 } });
      _hsCrackle(S, { t: 0.15, d: 0.5, n: 6, v: 0.3, f: 3000 });
    } }
  ],
  coins: [
    { name: 'Moeda caindo', make: function(S) {
      var ts = [0, 0.17, 0.3, 0.39, 0.45, 0.49, 0.52, 0.54, 0.555, 0.565], v = 0.6;
      ts.forEach(function(t, i) { _hsBell(S, { t: t, f: 2400 * _hr(0.99, 1.01), d: 0.25 - i * 0.015, v: v }); v *= 0.8; });
    } },
    { name: 'Chuva de moedas', make: function(S) {
      for (var i = 0; i < 16; i++) _hsBell(S, { t: i === 0 ? 0 : _hr(0, 0.55), f: _hr(1800, 3800), d: _hr(0.15, 0.35), v: _hr(0.2, 0.5), wet: 0.2 });
    } },
    { name: 'Caixa registradora', make: function(S) {
      _hsNoise(S, { a: 0.002, d: 0.05, v: 0.6, col: 'pink', f: 900 });
      _hsNoise(S, { t: 0.06, a: 0.001, d: 0.04, v: 0.4, ft: 'bandpass', f: 1500, q: 3 });
      _hsBell(S, { t: 0.1, f: 2637, d: 0.55, v: 0.6, wet: 0.3 });
      _hsBell(S, { t: 0.1, f: 3951, d: 0.45, v: 0.35, wet: 0.3 });
    } },
    { name: 'Cara ou coroa', make: function(S) {
      _hsBell(S, { f: 3000, d: 0.45, v: 0.45, trem: { rate: 22, depth: 0.8 } });
      _hsBell(S, { t: 0.45, f: 2500, d: 0.22, v: 0.5 });
      _hsBell(S, { t: 0.56, f: 2520, d: 0.18, v: 0.25 });
    } },
    { name: 'Moeda de fliperama', make: function(S) {
      _hsTone(S, { a: 0.002, d: 0.07, v: 0.25, f: 988, type: 'square', lp: 6000 });
      _hsTone(S, { t: 0.08, a: 0.002, d: 0.55, v: 0.25, f: 1319, type: 'square', lp: 6000 });
    } }
  ],
  leaf: [
    { name: 'Farfalhar', make: function(S) {
      for (var i = 0; i < 5; i++) _hsNoise(S, { t: i * 0.12 + _hr(0, 0.05), a: 0.04, d: 0.12, v: _hr(0.3, 0.5),
        ft: 'bandpass', f: _hr(2500, 4500), q: 1, flick: { rate: 50, depth: 0.8 } });
    } },
    { name: 'Cintilar dourado', make: function(S) {
      [3136, 2637, 2349, 2093, 1760, 1568].forEach(function(f, i) { _hsBell(S, { t: i * 0.09, f: f, d: 0.4, v: 0.35, parts: HS_GLOCK, wet: 0.5 }); });
    } },
    { name: 'Brisa', make: function(S) {
      _hsNoise(S, { a: 0.3, d: 0.45, v: 0.7, col: 'pink', ft: 'bandpass', f: 400, f2: 1400, f3: 500, q: 1.2 });
      _hsBell(S, { t: 0.25, f: 2793, d: 0.4, v: 0.15, parts: HS_GLOCK, wet: 0.6 });
    } },
    { name: 'Folha metálica', make: function(S) {
      _hsCrackle(S, { d: 0.7, n: 35, v: 0.25, f: 6000, q: 0.8, pow: 1 });
      _hsBell(S, { f: 4186, d: 0.5, v: 0.1, parts: HS_GLOCK, wet: 0.5 });
    } },
    { name: 'Harpa', make: function(S) {
      [2349, 1976, 1760, 1480, 1319, 1175, 988, 880].forEach(function(f, i) { _hsPluck(S, i * 0.055, f, 0.3, 0.4); });
    } }
  ],
  ink: [
    { name: 'Pena raspando', make: function(S) {
      [0, 0.22, 0.44].forEach(function(t) { _hsNoise(S, { t: t, a: 0.02, d: 0.14, v: 0.5, ft: 'bandpass', f: 3200, f2: 2600, q: 2.5, flick: { rate: 80, depth: 0.6 } }); });
    } },
    { name: 'Gota', make: function(S) {
      _hsDrop(S, 0, 700, 0.7); _hsDrop(S, 0.32, 900, 0.4); _hsDrop(S, 0.55, 800, 0.25);
    } },
    { name: 'Splash', make: function(S) {
      _hsNoise(S, { a: 0.004, d: 0.22, v: 1, col: 'pink', f: 2500, f2: 300 });
      _hsTone(S, { a: 0.003, d: 0.12, v: 0.6, f: 120, f2: 60 });
      _hsDrop(S, 0.15, 1200, 0.25); _hsDrop(S, 0.27, 1500, 0.2); _hsDrop(S, 0.38, 1100, 0.15);
    } },
    { name: 'Pingos', make: function(S) {
      _hsDrop(S, 0, 1000, 0.6); _hsDrop(S, 0.26, 850, 0.6); _hsDrop(S, 0.52, 700, 0.6);
    } },
    { name: 'Traço e borrão', make: function(S) {
      _hsNoise(S, { a: 0.03, d: 0.3, v: 0.45, ft: 'bandpass', f: 3000, f2: 2000, q: 2, flick: { rate: 90, depth: 0.5 } });
      _hsNoise(S, { t: 0.38, a: 0.005, d: 0.2, v: 0.9, col: 'brown', f: 600 });
      _hsTone(S, { t: 0.38, a: 0.003, d: 0.18, v: 0.5, f: 160, f2: 70 });
    } }
  ],
  // The wax lands at once; the seal's ring shows at 380 ms
  seal: [
    { name: 'Carimbo', make: function(S) {
      _hsThud(S, 0, 0.9, 140, 0.5);
      // The stamp lifts off as the ring shows
      _hsNoise(S, { t: 0.36, a: 0.002, d: 0.06, v: 0.3, col: 'pink', ft: 'bandpass', f: 1200, q: 2, wet: 0.4 });
    } },
    { name: 'Cera derretendo', make: function(S) {
      _hsNoise(S, { a: 0.02, d: 0.33, v: 0.25, ft: 'highpass', f: 4000, flick: { rate: 60, depth: 0.7 } });
      _hsThud(S, 0.36, 0.9, 130);
    } },
    { name: 'Batida de madeira', make: function(S) {
      [0, 0.36].forEach(function(t) {
        _hsNoise(S, { t: t, a: 0.001, d: 0.07, v: 0.9, ft: 'bandpass', f: 850, q: 5 });
        _hsTone(S, { t: t, a: 0.001, d: 0.08, v: 0.4, f: 320, f2: 280 });
      });
    } },
    { name: 'Prensa', make: function(S) {
      _hsNoise(S, { a: 0.33, d: 0.05, v: 0.6, col: 'brown', f: 200, f2: 600 });
      _hsThud(S, 0.36, 1, 110, 0.3);
      _hsNoise(S, { t: 0.36, a: 0.005, d: 0.35, v: 0.4, col: 'brown', f: 300 });
    } },
    { name: 'Selo e sino', make: function(S) {
      _hsThud(S, 0, 0.8, 140);
      _hsBell(S, { t: 0.36, f: 1568, d: 0.4, v: 0.3, parts: HS_GLOCK, wet: 0.4 });
      _hsBell(S, { t: 0.36, f: 2349, d: 0.35, v: 0.15, parts: HS_GLOCK, wet: 0.4 });
    } }
  ],
  stars: [
    { name: 'Estrela cadente', make: function(S) {
      _hsTone(S, { a: 0.02, d: 0.5, v: 0.3, f: 3200, f2: 700, wet: 0.5 });
      _hsTone(S, { a: 0.02, d: 0.5, v: 0.12, f: 3210, f2: 705, type: 'triangle', wet: 0.5 });
      for (var i = 0; i < 4; i++) _hsBell(S, { t: _hr(0.25, 0.6), f: _hr(4000, 6000), d: 0.12, v: 0.1, parts: HS_GLOCK, wet: 0.6 });
    } },
    { name: 'Arpejo mágico', make: function(S) {
      [1047, 1319, 1568, 2093, 2637, 3136].forEach(function(f, i) { _hsTone(S, { t: i * 0.05, a: 0.003, d: 0.3, v: 0.22, f: f, wet: 0.6 }); });
      _hsNoise(S, { a: 0.2, d: 0.4, v: 0.05, ft: 'highpass', f: 8000 });
    } },
    { name: 'Rasante', make: function(S) {
      _hsNoise(S, { a: 0.05, d: 0.45, v: 0.5, ft: 'bandpass', f: 4000, f2: 800, q: 3, wet: 0.3 });
      _hsNoise(S, { t: 0.2, a: 0.05, d: 0.4, v: 0.3, ft: 'bandpass', f: 5000, f2: 1000, q: 3, wet: 0.3 });
      _hsTone(S, { a: 0.03, d: 0.45, v: 0.08, f: 2500, f2: 900 });
    } },
    { name: 'Sinos de vento', make: function(S) {
      var notes = [2093, 2349, 2637, 3136, 3520, 4186];
      for (var i = 0; i < 9; i++) _hsBell(S, { t: i === 0 ? 0 : _hr(0, 0.5), f: notes[(_hr() * 6) | 0], d: 0.35, v: _hr(0.15, 0.25),
        parts: [[1, 1, 1], [2.76, 0.4, 0.6], [5.4, 0.2, 0.4]], wet: 0.5 });
    } },
    { name: 'Fiuu', make: function(S) {
      _hsTone(S, { a: 0.01, d: 0.5, v: 0.3, f: 1800, f2: 250, vib: { rate: 18, depth: 60 }, wet: 0.4 });
      _hsTone(S, { a: 0.01, d: 0.5, v: 0.2, f: 1810, f2: 255, wet: 0.4 });
      for (var i = 0; i < 3; i++) _hsBell(S, { t: 0.4 + i * 0.08, f: _hr(4000, 5500), d: 0.12, v: 0.08, parts: HS_GLOCK, wet: 0.6 });
    } }
  ],
  feathers: [
    { name: 'Bater de asas', make: function(S) {
      _hsFlap(S, 0, 0.9); _hsFlap(S, 0.2, 0.8); _hsFlap(S, 0.4, 0.6);
      _hsNoise(S, { a: 0.05, d: 0.2, v: 0.1, ft: 'bandpass', f: 3000 });
    } },
    { name: 'Canto da fênix', make: function(S) {
      _hsTone(S, { a: 0.12, d: 0.45, v: 0.25, f: 1300, f2: 2400, f3: 1700, type: 'triangle', vib: { rate: 28, depth: 80 }, wet: 0.5 });
      _hsTone(S, { a: 0.12, d: 0.45, v: 0.08, f: 2600, f2: 4800, f3: 3400, vib: { rate: 28, depth: 160 }, wet: 0.5 });
    } },
    { name: 'Asas em chamas', make: function(S) {
      _hsFlap(S, 0, 0.8); _hsFlap(S, 0.22, 0.7);
      _hsNoise(S, { a: 0.25, d: 0.5, v: 0.7, col: 'brown', f: 300, f2: 2000, flick: { rate: 20, depth: 0.4 } });
      _hsCrackle(S, { t: 0.1, d: 0.6, n: 10, v: 0.3, f: 3000 });
    } },
    { name: 'Renascer', make: function(S) {
      _hsNoise(S, { a: 0.5, d: 0.25, v: 0.7, col: 'pink', ft: 'bandpass', f: 300, f2: 3000, q: 0.8 });
      _hsTone(S, { a: 0.5, d: 0.25, v: 0.15, f: 220, f2: 880, g: 0.5, wet: 0.4 });
      _hsCrackle(S, { t: 0.3, d: 0.45, n: 10, v: 0.3, f: 3500 });
    } },
    { name: 'Asas e brilho', make: function(S) {
      _hsFlap(S, 0, 0.8); _hsFlap(S, 0.18, 0.7);
      [2093, 2637, 3136, 4186].forEach(function(f, i) { _hsTone(S, { t: 0.3 + i * 0.05, a: 0.003, d: 0.3, v: 0.15, f: f, wet: 0.6 }); });
    } }
  ],
  rewind: [
    { name: 'Tique-taque', make: function(S) {
      _hsTick(S, 0.02, 3200, 0.8); _hsTick(S, 0.29, 2000, 0.8);
      _hsTone(S, { t: 0.29, a: 0.001, d: 0.04, v: 0.2, f: 900 });
      _hsTick(S, 0.56, 3200, 0.8);
    } },
    { name: 'Tique-taque ao contrário', make: function(S) {
      S.reverse = true;
      _hsTick(S, 0.1, 3200, 0.8, 0.6); _hsTick(S, 0.37, 2000, 0.8, 0.6); _hsTick(S, 0.64, 3200, 0.8, 0.6);
    } },
    { name: 'Rebobinar', make: function(S) {
      for (var t = 0, step = 0.09; t < 0.65; t += step, step = Math.max(step * 0.85, 0.015)) _hsTick(S, t, 2500, 0.5);
      _hsTone(S, { a: 0.05, d: 0.55, v: 0.08, f: 300, f2: 1200, type: 'sawtooth', lp: 1200 });
    } },
    { name: 'Badalada invertida', make: function(S) {
      S.reverse = true;
      _hsBell(S, { f: 523, d: 0.75, v: 0.6, parts: HS_CHURCH, wet: 0.5 });
    } },
    { name: 'Corda do relógio', make: function(S) {
      for (var i = 0; i < 12; i++) _hsTick(S, i * 0.045, i % 2 ? 2400 : 2800, 0.35);
      _hsTick(S, 0.62, 3000, 0.9);
      _hsBell(S, { t: 0.62, f: 1760, d: 0.15, v: 0.15, parts: HS_GLOCK });
    } }
  ]
};

// Renders candidate n of fx into an AudioBuffer (cached), then calls done
function _renderHitSfx(fx, n, done) {
  var key = fx + ':' + n;
  if (_hitSfxBufs[key]) { done(_hitSfxBufs[key]); return; }
  var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  var cand = HIT_SFX[fx] && HIT_SFX[fx][n];
  if (!OAC || !cand) return;
  try {
    var rate = 44100, c = new OAC(1, Math.ceil(rate * HITSFX_DUR), rate);
    _hsSeed = 7919 * (Object.keys(HIT_SFX).indexOf(fx) + 1) + n;
    var S = _hsKit(c);
    cand.make(S);
    // Event form: older Safari has no promise version of startRendering
    c.oncomplete = function(e) {
      var buf = e.renderedBuffer, d = buf.getChannelData(0), i, peak = 0;
      if (S.reverse) Array.prototype.reverse.call(d);
      for (i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
      // Same peak for every sound; short fades so nothing clicks
      var k = peak > 0 ? Math.min(0.8 / peak, 8) : 1, fin = rate * 0.002, fout = rate * 0.01;
      for (i = 0; i < d.length; i++) {
        var m = Math.min(1, i / fin, (d.length - i) / fout);
        d[i] *= k * m;
      }
      _hitSfxBufs[key] = buf;
      done(buf);
    };
    c.startRendering();
  } catch(e) {}
}

// The hit sound of effect fx (or its candidate n, TEST), at the SFX volume
function playHitSound(fx, n) {
  if (_sfxMute || !HIT_SFX[fx]) return;
  var ctx = audioContext();
  if (!ctx) return;
  resumeAudio();
  if (n === undefined) n = _hitSfxPick[fx] || 0;
  _renderHitSfx(fx, n, function(buf) {
    try {
      var src = ctx.createBufferSource(), gain = ctx.createGain();
      gain.gain.value = _sfxVol / 100;
      src.buffer = buf;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    } catch(e) {}
  });
}
