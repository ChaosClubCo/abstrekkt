(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/Scene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Scene",
    ()=>Scene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const floorVertexShader = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
const floorFragmentShader = `
precision highp float;
varying vec3 vWorldPosition;
uniform float uTime;

vec3 hsl(float h, float s, float l) {
  h = mod(h, 1.0);
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
  float m = l - c / 2.0;
  vec3 color;
  if (h < 0.1667) color = vec3(c, x, 0.0);
  else if (h < 0.3333) color = vec3(x, c, 0.0);
  else if (h < 0.5) color = vec3(0.0, c, x);
  else if (h < 0.6667) color = vec3(0.0, x, c);
  else if (h < 0.8333) color = vec3(x, 0.0, c);
  else color = vec3(c, 0.0, x);
  return color + m;
}

vec3 caustic(vec2 point, vec2 origin, float frequency, float hue, float strength) {
  float distanceToOrigin = length(point - origin);
  float ring = pow(sin(distanceToOrigin * frequency - uTime * 1.7) * 0.5 + 0.5, 2.0);
  float fade = exp(-distanceToOrigin * 1.55);
  return hsl(distanceToOrigin * 0.8 + hue + uTime * 0.08, 0.9, 0.62) * ring * fade * strength;
}

void main() {
  vec2 point = vWorldPosition.xz * 0.16;
  vec3 color = vec3(0.015, 0.0, 0.04);
  color += caustic(point, vec2(0.55, 0.02), 11.0, 0.74, 0.46);
  color += caustic(point, vec2(0.86, -0.18), 12.5, 0.58, 0.38);
  color += caustic(point, vec2(0.42, 0.26), 14.0, 0.86, 0.34);
  color += caustic(point, vec2(0.72, 0.42), 8.5, 0.50, 0.26);

  vec2 gridPoint = fract(point * 25.0) - 0.5;
  float sparkle = pow(max(0.0, 1.0 - length(gridPoint) * 16.0), 3.0);
  float seed = fract(sin(dot(floor(point * 25.0), vec2(127.1, 311.7))) * 43758.5);
  color += vec3(1.0, 0.82, 1.0) * sparkle * step(0.92, seed) * 0.5;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;
const gemVertexShader = `
varying vec3 vObjectPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vObjectPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
const gemFragmentShader = `
precision highp float;
varying vec3 vObjectPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec3 uBottom;
uniform vec3 uMiddle;
uniform vec3 uTop;
uniform float uYMin;
uniform float uYMax;
uniform float uTime;

vec3 hsl(float h, float s, float l) {
  h = mod(h, 1.0);
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
  float m = l - c / 2.0;
  vec3 color;
  if (h < 0.1667) color = vec3(c, x, 0.0);
  else if (h < 0.3333) color = vec3(x, c, 0.0);
  else if (h < 0.5) color = vec3(0.0, c, x);
  else if (h < 0.6667) color = vec3(0.0, x, c);
  else if (h < 0.8333) color = vec3(x, 0.0, c);
  else color = vec3(c, 0.0, x);
  return color + m;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(0.001, dot(normal, viewDirection)), 2.35);
  float heightMix = clamp((vObjectPosition.y - uYMin) / max(uYMax - uYMin, 0.001), 0.0, 1.0);
  vec3 color = heightMix < 0.5
    ? mix(uBottom, uMiddle, heightMix * 2.0)
    : mix(uMiddle, uTop, (heightMix - 0.5) * 2.0);

  vec3 iridescence = hsl(0.72 + fresnel * 0.48 + uTime * 0.015, 0.98, 0.66);
  color = mix(color, iridescence, fresnel * 0.46);

  vec3 lightA = normalize(vec3(0.7, 1.4, 0.9));
  vec3 lightB = normalize(vec3(-0.55, 0.75, 1.4));
  float specA = pow(max(0.0, dot(normal, normalize(lightA + viewDirection))), 90.0);
  float specB = pow(max(0.0, dot(normal, normalize(lightB + viewDirection))), 28.0);
  color += vec3(1.0) * specA * 2.2;
  color += vec3(0.75, 0.92, 1.0) * specB * 0.75;
  color += vec3(1.0) * pow(fresnel, 7.0) * 0.45;

  gl_FragColor = vec4(color, clamp(0.78 + fresnel * 0.18 + specA * 0.1, 0.0, 1.0));
}`;
const palettes = [
    [
        "#ff5fb3",
        "#c040e8",
        "#8b1fd9"
    ],
    [
        "#00e4ff",
        "#0088ee",
        "#5030ff"
    ],
    [
        "#ffe055",
        "#ff8fa8",
        "#ff3f80"
    ],
    [
        "#ff7ac0",
        "#a840f0",
        "#30c0ff"
    ],
    [
        "#60ffd0",
        "#30acff",
        "#6850ff"
    ],
    [
        "#ffb040",
        "#ffe860",
        "#70ffd0"
    ]
];
function makeGemMaterial(geometry, palette) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        vertexShader: gemVertexShader,
        fragmentShader: gemFragmentShader,
        uniforms: {
            uBottom: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette[0])
            },
            uMiddle: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette[1])
            },
            uTop: {
                value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette[2])
            },
            uYMin: {
                value: box?.min.y ?? -1
            },
            uYMax: {
                value: box?.max.y ?? 1
            },
            uTime: {
                value: 0
            }
        },
        transparent: true,
        depthWrite: false,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
}
function makeGem(index) {
    const geometryOptions = [
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](1),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.88, 0.88, 1.25, 8, 1, false),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.85, 0.85, 1.55, 6, 1, false),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](0.65, 0.22, 6, 20),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.88, 0.3, 1.1, 16, 1, false),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](1.7, 0.9, 0.28)
    ];
    const geometry = geometryOptions[index % geometryOptions.length];
    const material = makeGemMaterial(geometry, palettes[index % palettes.length]);
    const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
    const edges = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineSegments"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EdgesGeometry"](geometry, 12), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineBasicMaterial"]({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.72
    }));
    mesh.add(edges);
    return mesh;
}
function resolveCollision(a, b) {
    const delta = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().subVectors(b.mesh.position, a.mesh.position);
    const distance = delta.length();
    const minimumDistance = (a.radius + b.radius) * 0.72;
    if (distance >= minimumDistance || distance < 0.001) return;
    const normal = delta.divideScalar(distance);
    const overlap = (minimumDistance - distance) * 0.5;
    a.mesh.position.addScaledVector(normal, -overlap);
    b.mesh.position.addScaledVector(normal, overlap);
    const relativeVelocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().subVectors(b.velocity, a.velocity).dot(normal);
    if (relativeVelocity > 0) return;
    const impulse = -(1 + Math.min(a.restitution, b.restitution) * 0.6) * relativeVelocity / 2;
    a.velocity.addScaledVector(normal, -impulse);
    b.velocity.addScaledVector(normal, impulse);
}
function Scene() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Scene.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
            renderer.setClearColor(0x03000a, 1);
            renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            renderer.toneMappingExposure = 1.05;
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.fog = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fog"](0x03000a, 20, 48);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](46, 1, 0.1, 100);
            camera.position.set(0, 2.5, 13);
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0xffffff, 0.9));
            const key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffffff, 0.9);
            key.position.set(7, 14, 10);
            scene.add(key);
            const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xe8eeff, 0.55);
            fill.position.set(-8, 6, 10);
            scene.add(fill);
            const rim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffddf8, 0.35);
            rim.position.set(4, -12, -4);
            scene.add(rim);
            const floorUniforms = {
                uTime: {
                    value: 0
                }
            };
            const floor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](80, 80), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                vertexShader: floorVertexShader,
                fragmentShader: floorFragmentShader,
                uniforms: floorUniforms
            }));
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -4.5;
            scene.add(floor);
            const bounds = {
                x: 10,
                y: 5.8,
                z: 3
            };
            const bodies = Array.from({
                length: 12
            }, {
                "Scene.useEffect.bodies": (_, index)=>{
                    const mesh = makeGem(index);
                    const size = 0.78 + Math.random() * 0.34;
                    mesh.scale.setScalar(size);
                    if (index === 0 || index === 8) mesh.scale.y *= 1.85;
                    if (index === 3) mesh.scale.x *= 1.45;
                    mesh.position.set(1.4 + Math.random() * 7, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 2.8);
                    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
                    scene.add(mesh);
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.36 + Math.random() * 0.55;
                    return {
                        mesh,
                        radius: size * 0.82,
                        velocity: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 0.32),
                        angularVelocity: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.38),
                        phase: index * 1.618 + Math.random(),
                        restitution: 0.58 + Math.random() * 0.2
                    };
                }
            }["Scene.useEffect.bodies"]);
            const resize = {
                "Scene.useEffect.resize": ()=>{
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height, false);
                }
            }["Scene.useEffect.resize"];
            resize();
            window.addEventListener("resize", resize);
            const clock = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"]();
            let frameId = 0;
            let visible = true;
            const observer = new IntersectionObserver({
                "Scene.useEffect": (entries)=>{
                    visible = entries[0]?.isIntersecting ?? true;
                }
            }["Scene.useEffect"]);
            observer.observe(canvas);
            const tick = {
                "Scene.useEffect.tick": ()=>{
                    frameId = requestAnimationFrame(tick);
                    if (!visible) return;
                    const delta = Math.min(clock.getDelta(), 0.05);
                    const elapsed = clock.elapsedTime;
                    floorUniforms.uTime.value = elapsed;
                    bodies.forEach({
                        "Scene.useEffect.tick": (body)=>{
                            const position = body.mesh.position;
                            body.velocity.x += (3.8 - position.x) * 0.0008;
                            body.velocity.y += (0 - position.y) * 0.0008;
                            body.velocity.x += Math.sin(elapsed * 0.26 + body.phase) * 0.005;
                            body.velocity.y += Math.cos(elapsed * 0.21 + body.phase * 1.618) * 0.005;
                            body.velocity.z += Math.sin(elapsed * 0.16 + body.phase * 0.764) * 0.002;
                            position.addScaledVector(body.velocity, delta);
                            body.mesh.rotation.x += body.angularVelocity.x * delta;
                            body.mesh.rotation.y += body.angularVelocity.y * delta;
                            body.mesh.rotation.z += body.angularVelocity.z * delta;
                            body.velocity.multiplyScalar(Math.pow(0.992, delta));
                            body.angularVelocity.multiplyScalar(Math.pow(0.996, delta));
                            const radius = body.radius * 0.86;
                            if (position.x - radius < -bounds.x) {
                                position.x = -bounds.x + radius;
                                body.velocity.x = Math.abs(body.velocity.x) * body.restitution;
                            }
                            if (position.x + radius > bounds.x) {
                                position.x = bounds.x - radius;
                                body.velocity.x = -Math.abs(body.velocity.x) * body.restitution;
                            }
                            if (position.y - radius < -bounds.y) {
                                position.y = -bounds.y + radius;
                                body.velocity.y = Math.abs(body.velocity.y) * body.restitution;
                            }
                            if (position.y + radius > bounds.y) {
                                position.y = bounds.y - radius;
                                body.velocity.y = -Math.abs(body.velocity.y) * body.restitution;
                            }
                            if (position.z - radius < -bounds.z) {
                                position.z = -bounds.z + radius;
                                body.velocity.z = Math.abs(body.velocity.z) * body.restitution;
                            }
                            if (position.z + radius > bounds.z) {
                                position.z = bounds.z - radius;
                                body.velocity.z = -Math.abs(body.velocity.z) * body.restitution;
                            }
                            const material = body.mesh.material;
                            if (material instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]) {
                                material.uniforms.uTime.value = elapsed;
                            }
                        }
                    }["Scene.useEffect.tick"]);
                    for(let i = 0; i < bodies.length; i += 1){
                        for(let j = i + 1; j < bodies.length; j += 1){
                            resolveCollision(bodies[i], bodies[j]);
                        }
                    }
                    camera.position.x = Math.sin(elapsed * 0.055) * 0.38;
                    camera.position.y = 2.5 + Math.cos(elapsed * 0.042) * 0.28;
                    camera.lookAt(3.8, -1, 0);
                    renderer.render(scene, camera);
                }
            }["Scene.useEffect.tick"];
            tick();
            return ({
                "Scene.useEffect": ()=>{
                    cancelAnimationFrame(frameId);
                    observer.disconnect();
                    window.removeEventListener("resize", resize);
                    bodies.forEach({
                        "Scene.useEffect": ({ mesh })=>{
                            mesh.traverse({
                                "Scene.useEffect": (child)=>{
                                    if (child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineSegments"]) {
                                        child.geometry.dispose();
                                        child.material.dispose();
                                    }
                                }
                            }["Scene.useEffect"]);
                            mesh.geometry.dispose();
                            if (mesh.material instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Material"]) mesh.material.dispose();
                        }
                    }["Scene.useEffect"]);
                    floor.geometry.dispose();
                    floor.material.dispose();
                    renderer.dispose();
                }
            })["Scene.useEffect"];
        }
    }["Scene.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-0 overflow-hidden bg-void pointer-events-none",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "h-full w-full"
            }, void 0, false, {
                fileName: "[project]/components/Scene.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[linear-gradient(90deg,rgba(3,0,10,0.96)_0%,rgba(3,0,10,0.68)_34%,rgba(3,0,10,0.18)_62%,rgba(3,0,10,0.54)_100%)]"
            }, void 0, false, {
                fileName: "[project]/components/Scene.tsx",
                lineNumber: 393,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 scanline"
            }, void 0, false, {
                fileName: "[project]/components/Scene.tsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 vignette"
            }, void 0, false, {
                fileName: "[project]/components/Scene.tsx",
                lineNumber: 395,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Scene.tsx",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
_s(Scene, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = Scene;
var _c;
__turbopack_context__.k.register(_c, "Scene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_Scene_tsx_0mrs.p1._.js.map