import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * FlashFusion Electric Hero
 * WebGL2 fragment shader implementing 4 layered electricity treatments:
 *   (a) Gated lightning bolts with procedural branching
 *   (b) Domain-warped flow-field wave, recolored to FF palette
 *   (c) Plasma contour tracing (dual counter-flowing bands)
 *   (d) Mesh gradient background + particle spark field
 *
 * Parallax: scroll-primary (0.3) + subtle mouse warp (0.04)
 * Accessibility: respects prefers-reduced-motion with CSS-gradient fallback
 * Performance: DPR capped at 2, render scale 0.85x, IntersectionObserver pause
 */

const VERT_SRC = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;

out vec4 fragColor;

// FlashFusion Electric palette (linear approx of sRGB hex)
const vec3 VOID     = vec3(0.039, 0.039, 0.059);   // #0A0A0F
const vec3 DEEP     = vec3(0.078, 0.074, 0.156);   // #141328
const vec3 INDIGO   = vec3(0.196, 0.169, 0.459);   // #322B75
const vec3 PRIMARY  = vec3(0.545, 0.361, 0.965);   // #8B5CF6
const vec3 GLOW     = vec3(0.659, 0.333, 0.969);   // #A855F7
const vec3 ELECTRIC = vec3(0.024, 0.714, 0.831);   // #06B6D4
const vec3 BRIGHT   = vec3(0.404, 0.910, 0.976);   // #67E8F9

// --- Noise primitives ----------------------------------------------------
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float hash1(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash2(i)),
    dot(b, hash2(i + o)),
    dot(c, hash2(i + 1.0))
  );
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

// --- (a) Lightning bolt distance field -----------------------------------
float bolt(vec2 uv, float seed, float curve) {
  float d = uv.y - 0.5 - sin(uv.x * 2.0 + seed) * curve;
  d += fbm(vec2(uv.x * 4.0 + seed * 13.0, seed)) * 0.28;
  d += noise(vec2(uv.x * 22.0, seed * 7.0)) * 0.035;
  return abs(d);
}

// --- (d) Particle spark field --------------------------------------------
float sparks(vec2 uv, float t) {
  vec2 grid = uv * 38.0;
  vec2 gi = floor(grid);
  vec2 gf = fract(grid);
  vec2 rnd = hash2(gi);
  float life = fract(rnd.x * 1.3 + t * (0.2 + rnd.y * 0.3));
  vec2 pos = vec2(0.5) + rnd * 0.35 * sin(t * 0.8 + rnd.x * 10.0);
  float d = distance(gf, pos);
  float size = 0.015 + 0.025 * (1.0 - life);
  float s = smoothstep(size, 0.0, d);
  return s * (1.0 - life) * step(0.72, rnd.x);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / uResolution.y;

  // Parallax — scroll shifts flow field vertically, mouse adds warp
  p.y += uScroll * 0.3;
  p += (uMouse - 0.5) * 0.04;

  float t = uTime * 0.15;

  // --- (d) Mesh gradient backdrop ----------------------------------------
  vec3 col = mix(VOID, DEEP, smoothstep(-0.5, 0.5, uv.y));
  vec3 meshA = mix(INDIGO * 0.9, DEEP, smoothstep(0.0, 1.0, length(uv - vec2(0.25, 0.3))));
  vec3 meshB = mix(VOID, INDIGO * 0.45, smoothstep(0.0, 0.9, length(uv - vec2(0.82, 0.7))));
  col = mix(col, meshA, 0.45);
  col = mix(col, meshB, 0.35);

  // --- (b) Domain-warped flow-field wave ---------------------------------
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) + t * 1.2));
  vec2 r = vec2(
    fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.9),
    fbm(p + 2.0 * q + vec2(8.3, 2.8) + t * 1.1)
  );
  float wave = fbm(p + 3.0 * r);
  wave = smoothstep(-0.2, 0.9, wave);

  // Wave recolored to FF electric palette
  vec3 waveCol = mix(DEEP, PRIMARY, smoothstep(0.3, 0.7, wave));
  waveCol = mix(waveCol, GLOW, smoothstep(0.6, 0.85, wave));
  waveCol = mix(waveCol, ELECTRIC, smoothstep(0.82, 1.0, wave));
  col = mix(col, waveCol, smoothstep(0.25, 0.65, wave));

  // --- (c) Plasma contour tracing — dual counter-flowing bands -----------
  float iso1 = sin(wave * 22.0 - uTime * 2.0);
  float plasma1 = smoothstep(0.88, 1.0, iso1) * smoothstep(0.35, 0.7, wave);
  col += BRIGHT * plasma1 * 0.9;
  col += GLOW   * plasma1 * 0.4;

  float iso2 = sin(wave * 14.0 + uTime * 3.2 + 1.7);
  float plasma2 = smoothstep(0.92, 1.0, iso2) * smoothstep(0.5, 0.82, wave);
  col += ELECTRIC * plasma2 * 0.75;

  // --- (a) Gated lightning bolts -----------------------------------------
  float cycle = uTime * 0.18;
  float seedI = floor(cycle);
  float phase = fract(cycle);
  float active = step(0.58, hash1(vec2(seedI, 0.0)));
  float envelope = exp(-phase * 6.0) * active;

  float b1 = bolt(uv, seedI, 0.08);
  float b2 = bolt(uv + vec2(0.0, 0.12), seedI + 3.7, -0.06);
  float b3 = bolt(uv + vec2(0.0, -0.09), seedI + 7.1, 0.04);
  float boltD = min(b1, min(b2, b3));

  float core = smoothstep(0.003, 0.0, boltD) * envelope;
  float halo = smoothstep(0.09, 0.0, boltD) * envelope * 0.18;
  col += BRIGHT   * core * 2.2;
  col += ELECTRIC * halo;

  // --- (d) Sparks --------------------------------------------------------
  col += BRIGHT   * sparks(uv, uTime) * 0.85;
  col += ELECTRIC * sparks(uv * 1.3 + 0.5, uTime * 0.7) * 0.5;

  // Vignette
  float vig = 1.0 - length((uv - 0.5) * vec2(1.2, 1.0)) * 0.5;
  col *= vig;

  // Film grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
  col += (g - 0.5) * 0.025;

  fragColor = vec4(col, 1.0);
}`;

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error('Shader compile failed: ' + log);
  }
  return sh;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error('Program link failed: ' + log);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

export default function FlashFusionHero({ children }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const stateRef = useRef({
    gl: null,
    program: null,
    vao: null,
    uniforms: {},
    rafId: 0,
    scroll: 0,
    mouse: { x: 0.5, y: 0.5 },
    visible: true,
    startTime: 0,
  });

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleMouse = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    stateRef.current.mouse.x = (e.clientX - rect.left) / rect.width;
    stateRef.current.mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    // Normalize scroll offset relative to hero height
    const offset = -rect.top / rect.height;
    stateRef.current.scroll = offset;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    let program;
    try {
      program = createProgram(gl, VERT_SRC, FRAG_SRC);
    } catch (err) {
      console.error('[FlashFusionHero]', err);
      setWebglFailed(true);
      return;
    }

    // Fullscreen quad
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uTime:       gl.getUniformLocation(program, 'uTime'),
      uScroll:     gl.getUniformLocation(program, 'uScroll'),
      uMouse:      gl.getUniformLocation(program, 'uMouse'),
    };

    Object.assign(stateRef.current, {
      gl, program, vao, uniforms, startTime: performance.now(),
    });

    // Resize handler with DPR cap and render-scale
    const RENDER_SCALE = 0.85;
    const DPR_CAP = 2;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr * RENDER_SCALE));
      const h = Math.max(1, Math.floor(rect.height * dpr * RENDER_SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Visibility pause
    const io = new IntersectionObserver(
      (entries) => { stateRef.current.visible = entries[0].isIntersecting; },
      { threshold: 0 }
    );
    io.observe(container);

    // Render loop
    const render = () => {
      const s = stateRef.current;
      if (!s.visible) {
        s.rafId = requestAnimationFrame(render);
        return;
      }
      const time = (performance.now() - s.startTime) / 1000;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uTime, time);
      gl.uniform1f(uniforms.uScroll, s.scroll);
      gl.uniform2f(uniforms.uMouse, s.mouse.x, s.mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      s.rafId = requestAnimationFrame(render);
    };
    stateRef.current.rafId = requestAnimationFrame(render);

    // Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mousemove', handleMouse, { passive: true });

    // Context loss
    const onLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(stateRef.current.rafId);
    };
    const onRestored = () => {
      // Re-create program on restore
      try {
        program = createProgram(gl, VERT_SRC, FRAG_SRC);
        stateRef.current.program = program;
        stateRef.current.rafId = requestAnimationFrame(render);
      } catch (err) {
        console.error('[FlashFusionHero] restore failed', err);
        setWebglFailed(true);
      }
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, [reducedMotion, handleScroll, handleMouse]);

  const showFallback = reducedMotion || webglFailed;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .ff-hero-root {
          --ff-void: #0A0A0F;
          --ff-deep: #141328;
          --ff-indigo: #322B75;
          --ff-primary: #8B5CF6;
          --ff-primary-light: #C4B5FD;
          --ff-glow: #A855F7;
          --ff-electric: #06B6D4;
          --ff-electric-light: #67E8F9;
          --ff-bright: #E0E7FF;
          --ff-text: #F8FAFC;
          --ff-text-muted: #94A3B8;
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
          background: linear-gradient(
            135deg,
            rgba(10, 10, 15, 0.55) 0%,
            rgba(20, 19, 40, 0.35) 100%
          );
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border: 1px solid rgba(196, 181, 253, 0.12);
          border-radius: 18px;
          box-shadow:
            0 0 0 1px rgba(10, 10, 15, 0.4) inset,
            0 24px 60px -20px rgba(0, 0, 0, 0.6);
        }
        .ff-hero-fallback {
          background:
            radial-gradient(ellipse at 25% 30%, rgba(50, 43, 117, 0.6) 0%, transparent 55%),
            radial-gradient(ellipse at 82% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, #0A0A0F 0%, #141328 100%);
        }
      `}</style>
      <section
        ref={containerRef}
        className="ff-hero-root relative w-full overflow-hidden"
        style={{
          height: '82vh',
          minHeight: 560,
          backgroundColor: 'var(--ff-void)',
        }}
      >
        {showFallback ? (
          <div className="absolute inset-0 ff-hero-fallback" aria-hidden="true" />
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
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
