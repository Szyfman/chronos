// hitsfx.js

// ── HIT SOUNDS ────────────────────────────────────────────────────────────
/* Each hit effect (HIT_FX in ui.js) has a sound of its own, played with the
   burst (playHitSound, from playHitEffect). Nothing is stored as audio: each
   sound is synthesised once into an AudioBuffer with an OfflineAudioContext
   (noise, oscillators, envelopes, a small reverb), then replayed through the
   shared AudioContext (sfx.js) at the SFX volume. Each sound has its own seed
   for the random parts, so every render is identical; changing a seed changes
   the sound. The candidates they were picked from are in commit 8830123. */
var HITSFX_DUR = 0.8;   // seconds — the length of the default burst (Sparks)
var _hitSfxBufs = {};   // fx → AudioBuffer

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
// parts = [[ratio, level, decay factor]]
var HS_COIN = [[1, 1, 1], [2.76, 0.6, 0.7], [5.4, 0.4, 0.5], [8.93, 0.2, 0.35]];
function _hsBell(S, o) {
  (o.parts || HS_COIN).forEach(function(p) {
    _hsTone(S, { t: o.t, a: o.a || 0.002, d: o.d * p[2], v: o.v * p[1], f: o.f * p[0], wet: o.wet });
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
function _hsTick(S, t, f, v, wet) {
  _hsNoise(S, { t: t, a: 0.001, d: 0.02, v: v, ft: 'bandpass', f: f, q: 4, wet: wet });
  _hsBell(S, { t: t, f: f * 0.9, d: 0.04, v: v * 0.25, wet: wet });
}
function _hsPluck(S, t, f, v, wet) {
  _hsTone(S, { t: t, a: 0.003, d: 0.35, v: v, f: f, type: 'triangle', wet: wet });
  _hsTone(S, { t: t, a: 0.003, d: 0.15, v: v * 0.3, f: f * 2, wet: wet });
}

// ── Sounds ────────────────────────────────────────────────────────────────
// { seed, make(S) } per effect, named after the HIT_FX builders
var HIT_SFX = {
  sparks: { seed: 7919, make: function(S) {     // flint strike
    _hsNoise(S, { a: 0.001, d: 0.04, v: 1, ft: 'highpass', f: 3500 });
    _hsBell(S, { f: 4200, d: 0.12, v: 0.25 });
    _hsCrackle(S, { t: 0.03, d: 0.55, n: 14, v: 0.5, f: 4500, q: 1.5, pow: 1.6 });
  } },
  flames: { seed: 15838, make: function(S) {    // ignition
    _hsNoise(S, { a: 0.12, d: 0.6, v: 0.9, col: 'brown', f: 250, f2: 1800, flick: { rate: 18, depth: 0.35 } });
    _hsCrackle(S, { t: 0.08, d: 0.6, n: 12, v: 0.35, f: 3000 });
    _hsTone(S, { a: 0.01, d: 0.25, v: 0.4, f: 70, f2: 40 });
  } },
  coins: { seed: 23761, make: function(S) {     // arcade coin
    _hsTone(S, { a: 0.002, d: 0.07, v: 0.25, f: 988, type: 'square', lp: 6000 });
    _hsTone(S, { t: 0.08, a: 0.002, d: 0.55, v: 0.25, f: 1319, type: 'square', lp: 6000 });
  } },
  leaf: { seed: 31680, make: function(S) {      // harp glissando
    [2349, 1976, 1760, 1480, 1319, 1175, 988, 880].forEach(function(f, i) { _hsPluck(S, i * 0.055, f, 0.3, 0.4); });
  } },
  ink: { seed: 39597, make: function(S) {       // splash and droplets
    _hsNoise(S, { a: 0.004, d: 0.22, v: 1, col: 'pink', f: 2500, f2: 300 });
    _hsTone(S, { a: 0.003, d: 0.12, v: 0.6, f: 120, f2: 60 });
    _hsDrop(S, 0.15, 1200, 0.25); _hsDrop(S, 0.27, 1500, 0.2); _hsDrop(S, 0.38, 1100, 0.15);
  } },
  // The wax lands at once; the press thuds as the seal's ring shows (380 ms)
  seal: { seed: 47517, make: function(S) {      // press
    _hsNoise(S, { a: 0.33, d: 0.05, v: 0.6, col: 'brown', f: 200, f2: 600 });
    _hsThud(S, 0.36, 1, 110, 0.3);
    _hsNoise(S, { t: 0.36, a: 0.005, d: 0.35, v: 0.4, col: 'brown', f: 300 });
  } },
  stars: { seed: 55435, make: function(S) {     // two meteors swooping past
    _hsNoise(S, { a: 0.05, d: 0.45, v: 0.5, ft: 'bandpass', f: 4000, f2: 800, q: 3, wet: 0.3 });
    _hsNoise(S, { t: 0.2, a: 0.05, d: 0.4, v: 0.3, ft: 'bandpass', f: 5000, f2: 1000, q: 3, wet: 0.3 });
    _hsTone(S, { a: 0.03, d: 0.45, v: 0.08, f: 2500, f2: 900 });
  } },
  feathers: { seed: 63353, make: function(S) {  // the phoenix's cry
    _hsTone(S, { a: 0.12, d: 0.45, v: 0.25, f: 1300, f2: 2400, f3: 1700, type: 'triangle', vib: { rate: 28, depth: 80 }, wet: 0.5 });
    _hsTone(S, { a: 0.12, d: 0.45, v: 0.08, f: 2600, f2: 4800, f3: 3400, vib: { rate: 28, depth: 160 }, wet: 0.5 });
  } },
  rewind: { seed: 71271, make: function(S) {    // tick, tock, tick
    _hsTick(S, 0.02, 3200, 0.8); _hsTick(S, 0.29, 2000, 0.8);
    _hsTone(S, { t: 0.29, a: 0.001, d: 0.04, v: 0.2, f: 900 });
    _hsTick(S, 0.56, 3200, 0.8);
  } }
};

// Renders the sound of fx into an AudioBuffer (cached), then calls done
function _renderHitSfx(fx, done) {
  if (_hitSfxBufs[fx]) { done(_hitSfxBufs[fx]); return; }
  var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  var snd = HIT_SFX[fx];
  if (!OAC || !snd) return;
  try {
    var rate = 44100, c = new OAC(1, Math.ceil(rate * HITSFX_DUR), rate);
    _hsSeed = snd.seed;
    var S = _hsKit(c);
    snd.make(S);
    // Event form: older Safari has no promise version of startRendering
    c.oncomplete = function(e) {
      var buf = e.renderedBuffer, d = buf.getChannelData(0), i, peak = 0;
      for (i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
      // Same peak for every sound; short fades so nothing clicks
      var k = peak > 0 ? Math.min(0.8 / peak, 8) : 1, fin = rate * 0.002, fout = rate * 0.01;
      for (i = 0; i < d.length; i++) {
        var m = Math.min(1, i / fin, (d.length - i) / fout);
        d[i] *= k * m;
      }
      _hitSfxBufs[fx] = buf;
      done(buf);
    };
    c.startRendering();
  } catch(e) {}
}

// The hit sound of effect fx, at the SFX volume
function playHitSound(fx) {
  if (_sfxMute || !HIT_SFX[fx]) return;
  var ctx = audioContext();
  if (!ctx) return;
  resumeAudio();
  _renderHitSfx(fx, function(buf) {
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
