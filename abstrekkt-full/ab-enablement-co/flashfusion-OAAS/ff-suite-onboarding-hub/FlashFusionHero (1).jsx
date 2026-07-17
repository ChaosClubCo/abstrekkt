/**
 * FlashFusion Combined Hero
 *
 * Architecture: single Three.js WebGLRenderer, two-scene composite
 *   bgScene  — OrthographicCamera + PlaneGeometry running adapted FBM shader
 *              (lightning, domain-warped waves, plasma, sparks — FF palette)
 *   fgScene  — PerspectiveCamera + physics bodies (glass cubes, pyramids,
 *              nebula spheres) floating over solid stepped platforms
 *
 * Render order: clear → render(bgScene) → clearDepth → render(fgScene)
 *
 * Parallax:  scroll (0.3 on UV.y) + mouse warp (0.04) wired to bg shader
 * Perf:      RENDER_SCALE 0.85, DPR cap 2, IntersectionObserver pause
 * A11y:      prefers-reduced-motion → CSS gradient fallback, no Three.js init
 * Safety:    webglcontextlost/restored, full Three.js dispose on unmount
 *
 * Peer deps: three ^0.128.0
 * Next.js:   add 'use client' at top, or wrap in dynamic(() => import(...), { ssr: false })
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// SHADER SOURCES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Background plane vertex shader.
 * PlaneGeometry(2,2) vertex positions are ALREADY in clip space (±1),
 * so we skip MVP entirely. Writing z=0.0, w=1.0 places fragments at NDC
 * mid-depth; depthWrite:false on the material means it never affects the
 * depth buffer regardless.
 *
 * WHY NOT MVP: OrthographicCamera near=0 places the plane exactly at the
 * near clip boundary (z_ndc = -1). Many GPU drivers silently clip geometry
 * at the exact near plane → blank background. Bypassing matrices avoids this.
 */
const BG_VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

/**
 * Background FBM shader — adapted from standalone.html WebGL2 source.
 * Changes from original:
 *   - Removed #version 300 es / out vec4 fragColor → gl_FragColor
 *   - Uses vUv instead of gl_FragCoord (Three.js PlaneGeometry UV == screen UV)
 *   - Kept all FF palette constants, fbm, bolt, sparks verbatim
 */
const BG_FRAG = /* glsl */`
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;
varying vec2  vUv;

const vec3 VOID_C   = vec3(0.039, 0.039, 0.059);
const vec3 DEEP     = vec3(0.078, 0.074, 0.156);
const vec3 INDIGO   = vec3(0.196, 0.169, 0.459);
const vec3 PRIMARY  = vec3(0.545, 0.361, 0.965);
const vec3 GLOW     = vec3(0.659, 0.333, 0.969);
const vec3 ELECTRIC = vec3(0.024, 0.714, 0.831);
const vec3 BRIGHT   = vec3(0.404, 0.910, 0.976);

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float hash1(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  const float K1 = 0.366025404, K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m), b = a - o + K2, c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h*h*h*h * vec3(dot(a,hash2(i)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = rot * p * 2.0; a *= 0.5; }
  return v;
}

float bolt(vec2 uv, float seed, float curve) {
  float d = uv.y - 0.5 - sin(uv.x * 2.0 + seed) * curve;
  d += fbm(vec2(uv.x * 4.0 + seed * 13.0, seed)) * 0.28;
  d += noise(vec2(uv.x * 22.0, seed * 7.0)) * 0.035;
  return abs(d);
}

float sparks(vec2 uv, float t) {
  vec2 grid = uv * 38.0, gi = floor(grid), gf = fract(grid);
  vec2 rnd = hash2(gi);
  float life = fract(rnd.x * 1.3 + t * (0.2 + rnd.y * 0.3));
  vec2 pos = vec2(0.5) + rnd * 0.35 * sin(t * 0.8 + rnd.x * 10.0);
  float d = distance(gf, pos);
  float size = 0.015 + 0.025 * (1.0 - life);
  return smoothstep(size, 0.0, d) * (1.0 - life) * step(0.72, rnd.x);
}

void main() {
  vec2 uv = vUv;
  vec2 p  = uv - 0.5;
  p.x    *= uResolution.x / uResolution.y;
  p.y    += uScroll * 0.3;
  p      += (uMouse - 0.5) * 0.04;
  float t = uTime * 0.15;

  // Mesh gradient backdrop
  vec3 col  = mix(VOID_C, DEEP, smoothstep(-0.5, 0.5, uv.y));
  vec3 meshA = mix(INDIGO * 0.9, DEEP, smoothstep(0.0, 1.0, length(uv - vec2(0.25, 0.3))));
  vec3 meshB = mix(VOID_C, INDIGO * 0.45, smoothstep(0.0, 0.9, length(uv - vec2(0.82, 0.7))));
  col = mix(col, meshA, 0.45);
  col = mix(col, meshB, 0.35);

  // Domain-warped flow-field wave
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) + t * 1.2));
  vec2 r = vec2(
    fbm(p + 2.0*q + vec2(1.7, 9.2) + t * 0.9),
    fbm(p + 2.0*q + vec2(8.3, 2.8) + t * 1.1)
  );
  float wave = fbm(p + 3.0 * r);
  wave = smoothstep(-0.2, 0.9, wave);
  vec3 wc = mix(DEEP, PRIMARY, smoothstep(0.3, 0.7, wave));
  wc = mix(wc, GLOW,     smoothstep(0.6,  0.85, wave));
  wc = mix(wc, ELECTRIC, smoothstep(0.82, 1.0,  wave));
  col = mix(col, wc, smoothstep(0.25, 0.65, wave));

  // Plasma contour tracing
  float p1 = smoothstep(0.88, 1.0, sin(wave * 22.0 - uTime * 2.0))
           * smoothstep(0.35, 0.70, wave);
  col += BRIGHT   * p1 * 0.9;
  col += GLOW     * p1 * 0.4;
  float p2 = smoothstep(0.92, 1.0, sin(wave * 14.0 + uTime * 3.2 + 1.7))
           * smoothstep(0.50, 0.82, wave);
  col += ELECTRIC * p2 * 0.75;

  // Gated lightning bolts
  float cyc = uTime * 0.18, si = floor(cyc), ph = fract(cyc);
  float env = exp(-ph * 6.0) * step(0.58, hash1(vec2(si, 0.0)));
  float bd  = min(bolt(uv, si, 0.08),
              min(bolt(uv + vec2(0.0, 0.12), si + 3.7, -0.06),
                  bolt(uv + vec2(0.0, -0.09), si + 7.1,  0.04)));
  col += BRIGHT   * smoothstep(0.003, 0.0, bd) * env * 2.2;
  col += ELECTRIC * smoothstep(0.090, 0.0, bd) * env * 0.18;

  // Sparks
  col += BRIGHT   * sparks(uv,         uTime)       * 0.85;
  col += ELECTRIC * sparks(uv * 1.3 + 0.5, uTime * 0.7) * 0.50;

  // Vignette
  col *= 1.0 - length((uv - 0.5) * vec2(1.2, 1.0)) * 0.5;

  // Film grain — derive coords from vUv * uResolution so grain density is
  // consistent with display pixels regardless of DPR or RENDER_SCALE.
  // gl_FragCoord.xy would be in render-buffer pixels (cssW * DPR * 0.85),
  // causing over-dense grain at high DPR.
  vec2  grainCoord = vUv * uResolution;
  float g = fract(sin(dot(grainCoord, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
  col += (g - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}`;

// ── Glass iridescent shader ───────────────────────────────────────────────────
// vVD is intentionally NOT a varying — computing view direction per-vertex and
// interpolating it across low-poly faces (4-sided pyramid, octahedron, thin plate)
// produces wrong per-fragment values → flat/faceted Fresnel. Reconstruct in frag
// shader from vWP instead.
const GLASS_VERT = /* glsl */`
varying vec3 vN, vWN, vWP;
void main() {
  vN   = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWN  = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vWP  = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const GLASS_FRAG = /* glsl */`
varying vec3 vN, vWN, vWP;
uniform float uT;
uniform vec3  uC;
uniform float uO, uH;

vec3 hsl(float h, float s, float l) {
  h = mod(h, 1.0);
  float c = (1.0 - abs(2.0*l - 1.0)) * s;
  float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
  float m = l - c / 2.0;
  vec3  r;
  if      (h < 0.1667) r = vec3(c, x, 0.);
  else if (h < 0.3333) r = vec3(x, c, 0.);
  else if (h < 0.5000) r = vec3(0., c, x);
  else if (h < 0.6667) r = vec3(0., x, c);
  else if (h < 0.8333) r = vec3(x, 0., c);
  else                 r = vec3(c, 0., x);
  return r + m;
}

void main() {
  vec3  N = normalize(vN);
  // Per-fragment view direction — correct Fresnel on low-poly geometry.
  // Computing in vertex shader + interpolating produces faceted artifacts.
  vec3  V = normalize(cameraPosition - vWP);
  float nd = max(0.0, dot(N, V));
  float F  = pow(1.0 - nd, 2.6);

  float ang = dot(vWN * 0.5 + 0.5, vec3(0.58, 0.40, 0.71));
  float h1  = mod(ang + uH + uT * 0.033 + 0.58, 1.0);
  float h2  = mod(h1 + 0.26 + F * 0.30, 1.0);
  vec3  ir  = mix(hsl(h1, 0.88, 0.62), hsl(h2, 0.82, 0.68), smoothstep(0.20, 0.90, F));

  vec3  L1  = normalize(vec3( 0.55,  0.75, 0.62));
  vec3  H1  = normalize(L1 + V);
  float s1  = pow(max(0.0, dot(N, H1)), 96.0);
  vec3  L2  = normalize(vec3(-0.72, -0.28, 0.58));
  vec3  H2  = normalize(L2 + V);
  float s2  = pow(max(0.0, dot(N, H2)), 44.0);

  vec3  base = mix(vec3(0.010, 0.006, 0.028), uC, 0.24);
  float neon = pow(F, 3.2) * 2.0;
  vec3  col  = mix(base, ir, clamp(F * 1.45, 0.0, 1.0));
  col += hsl(mod(h1 - 0.04, 1.0), 0.96, 0.66) * neon * 0.65;
  col += vec3(1.0, 0.9, 1.0) * s1 * 1.1;
  col += vec3(0.65, 0.55, 1.0) * s2 * 0.7;

  float a = clamp(mix(uO * 0.07, uO, pow(F, 0.80)) + s1 * 0.50 + neon * 0.40, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}`;

// ── Nebula sphere shader ──────────────────────────────────────────────────────
// NEBULA_VERT matches GLASS_VERT layout (no vVD — per-fragment view direction)
const NEBULA_VERT = GLASS_VERT;

const NEBULA_FRAG = /* glsl */`
varying vec3 vN, vWN, vWP;
uniform float uT;

float H(vec3 p) {
  p = fract(p * vec3(443.9, 397.3, 491.2));
  p += dot(p.zxy, p.yxz + 19.19);
  return fract(p.x * p.y * p.z);
}
float VN(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(H(i),H(i+vec3(1,0,0)),f.x), mix(H(i+vec3(0,1,0)),H(i+vec3(1,1,0)),f.x), f.y),
    mix(mix(H(i+vec3(0,0,1)),H(i+vec3(1,0,1)),f.x), mix(H(i+vec3(0,1,1)),H(i+vec3(1,1,1)),f.x), f.y),
    f.z);
}

void main() {
  vec3  N  = normalize(vN);
  vec3  V  = normalize(cameraPosition - vWP); // per-fragment, not interpolated
  float nd = max(0.0, dot(N, V));
  float F  = pow(1.0 - nd, 2.3);

  vec3  p  = vWP * 2.8 + uT * 0.044;
  float n  = VN(p) * 0.50 + VN(p * 2.1 + vec3(1.7, 3.1, 2.3)) * 0.25 + VN(p * 4.3) * 0.125;
  float st = step(0.89, VN(vWP * 18.0)) * VN(vWP * 40.0 + uT * 0.09);

  vec3 c = mix(vec3(0.008, 0.004, 0.022), vec3(0.14, 0.04, 0.35),  smoothstep(0.15, 0.55, n));
  c      = mix(c, vec3(0.52, 0.18, 0.92), smoothstep(0.55, 0.84, n) * 0.88);
  c     += vec3(0.82, 0.72, 1.0) * st * 1.2;
  c     += mix(vec3(0.45, 0.12, 0.95), vec3(0.96, 0.25, 0.72), VN(vWP*2.0+uT*0.08)) * F * 1.35;
  c     += vec3(0.06, 0.55, 0.72) * step(0.96, VN(vWP * 25.0 + uT * 0.12)) * 0.6;

  gl_FragColor = vec4(c, 1.0);
}`;

// ─────────────────────────────────────────────────────────────────────────────
// PHYSICS HELPERS  (top-level — no React deps, safe to call from useEffect)
// ─────────────────────────────────────────────────────────────────────────────

const BOUNDS    = { x: 10.0, y: 6.2, z: 2.8 };
// Attractor and camera lookAt both target (3.0, -0.5, 0) so objects
// stay centered in the camera's focal region rather than drifting off-axis.
const ATTRACTOR  = new THREE.Vector3(3.0, -0.5, 0.0);

class PhysicsBody {
  constructor(mesh, radius) {
    this.mesh = mesh;
    this.r    = radius;
    const speed = 1.2 + Math.random() * 2.5;
    const angle = Math.random() * Math.PI * 2;
    this.v  = new THREE.Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 0.6);
    this.av = new THREE.Vector3((Math.random() - 0.5) * 1.3, (Math.random() - 0.5) * 1.3, (Math.random() - 0.5) * 0.9);
    this.e  = 0.72 + Math.random() * 0.18;
  }

  tick(dt) {
    const p = this.mesh.position;

    // Soft attractor bias (keeps shapes right-of-center)
    this.v.x += (ATTRACTOR.x - p.x) * 0.0018;
    this.v.y += (ATTRACTOR.y - p.y) * 0.0018;

    p.addScaledVector(this.v, dt);
    this.mesh.rotation.x += this.av.x * dt;
    this.mesh.rotation.y += this.av.y * dt;
    this.mesh.rotation.z += this.av.z * dt;

    // Damping (frame-rate independent)
    this.v.multiplyScalar(Math.pow(0.986, dt));
    this.av.multiplyScalar(Math.pow(0.993, dt));

    // Minimum speed floor — prevents shapes freezing mid-air
    const sp = this.v.length();
    if (sp > 0.0001 && sp < 0.38) this.v.multiplyScalar(0.38 / sp);

    // Boundary bounce
    const r = this.r;
    if (p.x - r < -BOUNDS.x) { p.x = -BOUNDS.x + r; this.v.x =  Math.abs(this.v.x) * this.e; this._kick(); }
    if (p.x + r >  BOUNDS.x) { p.x =  BOUNDS.x - r; this.v.x = -Math.abs(this.v.x) * this.e; this._kick(); }
    if (p.y - r < -BOUNDS.y) { p.y = -BOUNDS.y + r; this.v.y =  Math.abs(this.v.y) * this.e; this._kick(); }
    if (p.y + r >  BOUNDS.y) { p.y =  BOUNDS.y - r; this.v.y = -Math.abs(this.v.y) * this.e; this._kick(); }
    if (p.z - r < -BOUNDS.z) { p.z = -BOUNDS.z + r; this.v.z =  Math.abs(this.v.z) * this.e; }
    if (p.z + r >  BOUNDS.z) { p.z =  BOUNDS.z - r; this.v.z = -Math.abs(this.v.z) * this.e; }
  }

  _kick() {
    this.av.x += (Math.random() - 0.5) * 0.32;
    this.av.y += (Math.random() - 0.5) * 0.32;
  }
}

function resolveCollision(a, b) {
  const d    = new THREE.Vector3().subVectors(b.mesh.position, a.mesh.position);
  const dist = d.length();
  const minD = a.r + b.r;
  if (dist >= minD || dist < 0.001) return;

  const n   = d.divideScalar(dist);
  const ov  = minD - dist;
  a.mesh.position.addScaledVector(n, -ov * 0.51);
  b.mesh.position.addScaledVector(n,  ov * 0.51);

  const relV = new THREE.Vector3().subVectors(b.v, a.v).dot(n);
  if (relV > 0) return;

  const j = -(1 + Math.min(a.e, b.e)) * relV / 2;
  a.v.addScaledVector(n, -j);
  b.v.addScaledVector(n,  j);
  a._kick(); b._kick();
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE BUILDER HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const rp = (s) => (Math.random() - 0.5) * s;
const rr = ()  => Math.random() * Math.PI * 2;

function buildBackground(cw, ch) {
  const bgScene = new THREE.Scene();
  // Camera is irrelevant (BG_VERT bypasses MVP) but Three.js requires one.
  // near=-1 avoids degenerate depth matrices in case Three.js ever uses it.
  const bgCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const uniforms = {
    uResolution: { value: new THREE.Vector2(cw, ch) },
    uTime:       { value: 0 },
    uScroll:     { value: 0 },
    uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
  };
  const mat  = new THREE.ShaderMaterial({ vertexShader: BG_VERT, fragmentShader: BG_FRAG, uniforms, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  bgScene.add(mesh);
  return { bgScene, bgCam, uniforms, dispose: () => { mesh.geometry.dispose(); mat.dispose(); } };
}

function buildLights(scene) {
  scene.add(new THREE.AmbientLight(0x0e0620, 0.45));
  const kl = new THREE.DirectionalLight(0xf0ecff, 0.40); kl.position.set( 6, 14,  8); scene.add(kl);
  const fl = new THREE.DirectionalLight(0x7c3aed, 1.55); fl.position.set(-4,  7,  5); scene.add(fl);
  const rl = new THREE.DirectionalLight(0xf43f9e, 0.75); rl.position.set( 3,-10, -2); scene.add(rl);
  const al = new THREE.DirectionalLight(0x06b6d4, 0.38); al.position.set(10,  4, -6); scene.add(al);
}

function buildPlatforms(scene, disposables) {
  const mat = new THREE.MeshPhongMaterial({ color: 0x0D0B1E, specular: 0x5236A0, shininess: 14, emissive: 0x07051A });
  disposables.push(mat);
  [
    { w: 10.5, h: 0.75, d: 6.5, x:  5.2, y: -3.2, z: -1.8, ry:  0.08 },
    { w:  9.0, h: 0.70, d: 5.5, x:  5.8, y: -1.4, z: -4.0, ry:  0.12 },
    { w:  7.5, h: 0.65, d: 4.5, x:  6.5, y:  0.3, z: -6.0, ry:  0.06 },
    { w:  5.0, h: 5.50, d: 0.9, x:  8.2, y:  0.5, z: -4.5, ry:  0.16 },
    { w:  0.9, h: 4.00, d: 5.0, x:  2.0, y: -0.5, z: -3.8, ry: -0.04 },
    { w:  3.5, h: 0.60, d: 3.0, x:  9.2, y:  1.8, z: -4.0, ry:  0.22 },
    { w: 10.0, h: 0.55, d: 4.5, x:  5.5, y:  2.0, z: -8.2, ry:  0.08 },
  ].forEach(({ w, h, d, x, y, z, ry }) => {
    const geo  = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    scene.add(mesh);
    disposables.push(geo);
  });
}

function buildGlassMaterial(color, hueOffset, opacity, disposables) {
  const mat = new THREE.ShaderMaterial({
    vertexShader:   GLASS_VERT,
    fragmentShader: GLASS_FRAG,
    uniforms: {
      uT: { value: 0 },
      uC: { value: new THREE.Color(color) },
      uO: { value: opacity },
      uH: { value: hueOffset },
    },
    transparent: true,
    depthWrite:  false,
    side:        THREE.DoubleSide,
  });
  disposables.push(mat);
  return mat;
}

function buildNebulaMaterial(disposables) {
  const mat = new THREE.ShaderMaterial({
    vertexShader:   NEBULA_VERT,
    fragmentShader: NEBULA_FRAG,
    uniforms: { uT: { value: 0 } },
  });
  disposables.push(mat);
  return mat;
}

function buildPhysicsObjects(scene, disposables) {
  const bodies = [];

  // Glass shapes
  const shapeDefs = [
    { geo: new THREE.BoxGeometry(1.7, 1.7, 1.7),    color: 0x0c0820, hue: 0.58, opacity: 0.90, radius: 1.45 },
    { geo: new THREE.BoxGeometry(2.6, 3.2, 0.22),   color: 0x0a0620, hue: 0.66, opacity: 0.88, radius: 1.62 },
    { geo: new THREE.ConeGeometry(0.92, 2.6, 4),    color: 0x0a0825, hue: 0.62, opacity: 0.86, radius: 1.42 },
    { geo: new THREE.ConeGeometry(0.68, 2.0, 4),    color: 0x0c0720, hue: 0.74, opacity: 0.84, radius: 1.18 },
    { geo: new THREE.OctahedronGeometry(0.72),       color: 0x080520, hue: 0.54, opacity: 0.88, radius: 1.05, scaleY: 2.1 },
    { geo: new THREE.SphereGeometry(0.28, 16, 16),  color: 0x0b0720, hue: 0.68, opacity: 0.80, radius: 0.30 },
  ];

  shapeDefs.forEach(({ geo, color, hue, opacity, radius, scaleY }) => {
    const mat  = buildGlassMaterial(color, hue, opacity, disposables);
    const mesh = new THREE.Mesh(geo, mat);
    if (scaleY) mesh.scale.y = scaleY;
    mesh.position.set(3 + rp(7), rp(7), rp(2.5));
    mesh.rotation.set(rr(), rr(), rr());
    scene.add(mesh);
    bodies.push(new PhysicsBody(mesh, radius));
    disposables.push(geo);
  });

  // Nebula spheres (inner solid + outer glass shell as child)
  [{ r: 1.08, hue: 0.68 }, { r: 0.80, hue: 0.75 }].forEach(({ r, hue }) => {
    const innerGeo   = new THREE.SphereGeometry(r,       36, 36);
    const shellGeo   = new THREE.SphereGeometry(r * 1.08, 36, 36);
    const innerMat   = buildNebulaMaterial(disposables);
    const shellMat   = buildGlassMaterial(0x0a0520, hue, 0.82, disposables);
    const innerMesh  = new THREE.Mesh(innerGeo, innerMat);
    const shellMesh  = new THREE.Mesh(shellGeo, shellMat);
    innerMesh.add(shellMesh);
    innerMesh.position.set(3 + rp(4), rp(5), rp(2.5));
    innerMesh.rotation.set(rr(), rr(), rr());
    scene.add(innerMesh);
    bodies.push(new PhysicsBody(innerMesh, r * 1.12));
    disposables.push(innerGeo, shellGeo);
  });

  // Violet + cyan particles (non-physics, decorative depth layer)
  const makeParticles = (count, color, opacity) => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { pos[i*3] = rp(22); pos[i*3+1] = rp(14); pos[i*3+2] = rp(10) - 2; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat  = new THREE.PointsMaterial({ color, size: 0.048, sizeAttenuation: true, transparent: true, opacity });
    const pts  = new THREE.Points(geo, mat);
    scene.add(pts);
    disposables.push(geo, mat);
  };
  makeParticles(200, 0x8b5cf6, 0.45);
  makeParticles(60,  0x06b6d4, 0.30);

  return bodies;
}

// ─────────────────────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function FlashFusionHero({ children }) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglFailed,   setWebglFailed]   = useState(false);

  // ── Reduced-motion detection ────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ── Interaction handlers (stable refs) ──────────────────────────────────
  const stateRef = useRef({ scroll: 0, mouse: new THREE.Vector2(0.5, 0.5), visible: true });

  const handleMouse = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.mouse.set(
      (e.clientX - rect.left) / rect.width,
      1.0 - (e.clientY - rect.top) / rect.height,
    );
  }, []);

  const handleScroll = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.scroll = -rect.top / rect.height;
  }, []);

  // ── Main WebGL init ──────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Three.js renderer — single WebGL context for both scenes
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (err) {
      console.error('[FlashFusionHero] WebGLRenderer init failed', err);
      setWebglFailed(true);
      return;
    }
    renderer.setClearColor(0x0A0A0F, 1);
    renderer.autoClear = false;

    const RENDER_SCALE = 0.85;
    const DPR_CAP      = 2;

    // ── Background (FBM shader plane) ─────────────────────────────────────
    const { bgScene, bgCam, uniforms: bgUniforms, dispose: disposeBg } = buildBackground(
      container.clientWidth,
      container.clientHeight,
    );

    // ── Foreground (platforms + physics) ─────────────────────────────────
    const fgScene = new THREE.Scene();
    fgScene.fog   = new THREE.Fog(0x0A0A0F, 18, 38);

    const camera  = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 14);

    const disposables = []; // all Three.js resources to dispose on cleanup
    buildLights(fgScene);
    buildPlatforms(fgScene, disposables);
    const bodies = buildPhysicsObjects(fgScene, disposables);

    // Collect all shader materials that need uT ticked
    const tickMats = [];
    fgScene.traverse((obj) => {
      if (obj.isMesh && obj.material?.uniforms?.uT) tickMats.push(obj.material);
    });

    // ── Resize ─────────────────────────────────────────────────────────────
    // Read container (not canvas) dimensions. Canvas CSS sizing is handled
    // entirely by `position: absolute; inset: 0` — writing canvas.style.width/height
    // overrides inset:0 and locks the canvas to its initial pixel size, so
    // clientWidth reads stale values on every subsequent resize. Never touch
    // canvas.style here.
    const resize = () => {
      const dpr  = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const cssW = container.clientWidth;
      const cssH = container.clientHeight;
      const w    = Math.max(1, Math.floor(cssW * dpr * RENDER_SCALE));
      const h    = Math.max(1, Math.floor(cssH * dpr * RENDER_SCALE));
      if (renderer.domElement.width === w && renderer.domElement.height === h) return;
      renderer.setSize(w, h, false);
      camera.aspect = cssW / cssH;
      camera.updateProjectionMatrix();
      bgUniforms.uResolution.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Visibility pause ───────────────────────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => { stateRef.current.visible = entries[0].isIntersecting; },
      { threshold: 0 },
    );
    io.observe(container);

    // ── Render loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId   = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      if (!stateRef.current.visible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t  = clock.elapsedTime;

      // Sync bg uniforms
      bgUniforms.uTime.value  = t;
      bgUniforms.uScroll.value = stateRef.current.scroll;
      bgUniforms.uMouse.value.copy(stateRef.current.mouse);

      // Tick glass/nebula shader time
      tickMats.forEach((m) => { m.uniforms.uT.value = t; });

      // Physics
      bodies.forEach((b) => b.tick(dt));
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          resolveCollision(bodies[i], bodies[j]);
        }
      }

      // Camera slow sway
      camera.position.x = Math.sin(t * 0.068) * 0.36;
      camera.position.y = 0.5 + Math.cos(t * 0.052) * 0.22;
      camera.lookAt(3.0, -0.5, 0);

      // Two-pass render: bg (no depth) → fg (with depth)
      renderer.clear();
      renderer.render(bgScene, bgCam);
      renderer.clearDepth();
      renderer.render(fgScene, camera);
    };
    rafId = requestAnimationFrame(render);

    // ── Event listeners ────────────────────────────────────────────────────
    window.addEventListener('scroll',    handleScroll, { passive: true });
    container.addEventListener('mousemove', handleMouse, { passive: true });

    // ── Context loss ───────────────────────────────────────────────────────
    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(rafId); };
    const onRestored = () => { rafId = requestAnimationFrame(render); };
    canvas.addEventListener('webglcontextlost',     onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll',    handleScroll);
      container.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('webglcontextlost',     onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      ro.disconnect();
      io.disconnect();
      disposeBg();
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
    };
  }, [reducedMotion, handleScroll, handleMouse]);

  const showFallback = reducedMotion || webglFailed;

  return (
    <>
      {/*
        @import in a JS-injected <style> tag is silently ignored by browsers —
        it must appear at the top of a stylesheet parsed during document load.
        Use a <link> element instead. In Next.js App Router, move this to
        app/layout.tsx. In Pages Router, use next/head or next/font/google.
      */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap"
      />
      <style>{`
        .ff-hero-root {
          --ff-void:           #0A0A0F;
          --ff-deep:           #141328;
          --ff-indigo:         #322B75;
          --ff-primary:        #8B5CF6;
          --ff-primary-light:  #C4B5FD;
          --ff-glow:           #A855F7;
          --ff-electric:       #06B6D4;
          --ff-electric-light: #67E8F9;
          --ff-bright:         #E0E7FF;
          --ff-text:           #F8FAFC;
          --ff-text-muted:     #94A3B8;
        }
        /* Canvas CSS: inset:0 fills the container. Never set inline width/height
           on the canvas — that overrides inset:0 and breaks responsive resize. */
        .ff-hero-canvas {
          position: absolute;
          inset: 0;
          display: block;
        }
        .ff-hero-headline {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 0.95;
          color: var(--ff-text);
          text-shadow:
            0 0 40px rgba(139, 92, 246, 0.25),
            0 0 80px rgba(6, 182, 212, 0.15);
        }
        .ff-hero-card {
          background: linear-gradient(135deg, rgba(10,10,15,.55) 0%, rgba(20,19,40,.35) 100%);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border: 1px solid rgba(196,181,253,.12);
          border-radius: 18px;
          box-shadow: 0 0 0 1px rgba(10,10,15,.4) inset, 0 24px 60px -20px rgba(0,0,0,.6);
        }
        .ff-hero-fallback {
          background:
            radial-gradient(ellipse at 25% 30%, rgba(50,43,117,.6) 0%, transparent 55%),
            radial-gradient(ellipse at 82% 70%, rgba(6,182,212,.2)  0%, transparent 50%),
            linear-gradient(180deg, #0A0A0F 0%, #141328 100%);
        }
      `}</style>

      <section
        ref={containerRef}
        className="ff-hero-root relative w-full overflow-hidden"
        style={{ height: '82vh', minHeight: 560, backgroundColor: 'var(--ff-void)' }}
      >
        {showFallback ? (
          <div className="absolute inset-0 ff-hero-fallback" aria-hidden="true" />
        ) : (
          <canvas
            ref={canvasRef}
            className="ff-hero-canvas"
            aria-hidden="true"
          />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pb-16 md:pb-20">
            <div className="ff-hero-card inline-block px-8 py-10 md:px-12 md:py-12 max-w-2xl">
              <h1 className="ff-hero-headline text-5xl md:text-7xl">
                Transform Your
                <br />
                Vision Into Reality
              </h1>
              {children && <div className="mt-8">{children}</div>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
