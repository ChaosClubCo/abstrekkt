import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Search, X, Menu, Star, Download, Copy, Check, Grid3x3, Keyboard,
  Command, ChevronRight, Trash2, Pin, Code2, FileImage, FileCode,
  Layers, Zap, Heart, Sparkles, MoreVertical, ExternalLink
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// ICON DATA — 37 real SVG icons from Lucide, Tabler, Heroicons, Bootstrap
// ═══════════════════════════════════════════════════════════════
const RAW = [{"id":"lucide-a-arrow-down","n":"A Arrow Down","l":"lucide","t":["letter","font size","text"],"s":"outline","c":'<path d="m14 12 4 4 4-4"/><path d="M18 16V7"/><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16"/><path d="M3.304 13h6.392"/>',"v":"0 0 24 24","w":2},{"id":"lucide-a-arrow-up","n":"A Arrow Up","l":"lucide","t":["letter","font size","text"],"s":"outline","c":'<path d="m14 11 4-4 4 4"/><path d="M18 16V7"/><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16"/><path d="M3.304 13h6.392"/>',"v":"0 0 24 24","w":2},{"id":"lucide-accessibility","n":"Accessibility","l":"lucide","t":["disability","disabled","dda"],"s":"outline","c":'<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',"v":"0 0 24 24","w":2},{"id":"lucide-activity","n":"Activity","l":"lucide","t":["pulse","action","motion"],"s":"outline","c":'<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',"v":"0 0 24 24","w":2},{"id":"lucide-air-vent","n":"Air Vent","l":"lucide","t":["air conditioner","ac","central air"],"s":"outline","c":'<path d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12"/><path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 8h12"/><path d="M6.6 15.572A2 2 0 1 0 10 17v-5"/>',"v":"0 0 24 24","w":2},{"id":"lucide-airplay","n":"Airplay","l":"lucide","t":["stream","cast","mirroring"],"s":"outline","c":'<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="m12 15 5 6H7Z"/>',"v":"0 0 24 24","w":2},{"id":"lucide-alarm-clock-check","n":"Alarm Clock Check","l":"lucide","t":["done","todo","tick"],"s":"outline","c":'<circle cx="12" cy="13" r="8"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/><path d="m9 13 2 2 4-4"/>',"v":"0 0 24 24","w":2},{"id":"lucide-alarm-clock","n":"Alarm Clock","l":"lucide","t":["morning","time"],"s":"outline","c":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',"v":"0 0 24 24","w":2},{"id":"lucide-album","n":"Album","l":"lucide","t":["photo","book"],"s":"outline","c":'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><polyline points="11 3 11 11 14 8 17 11 17 3"/>',"v":"0 0 24 24","w":2},{"id":"lucide-ambulance","n":"Ambulance","l":"lucide","t":["emergency","medical"],"s":"outline","c":'<path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',"v":"0 0 24 24","w":2},{"id":"lucide-ampersand","n":"Ampersand","l":"lucide","t":["and","typography"],"s":"outline","c":'<path d="M16 12h3"/><path d="M17.5 12a8 8 0 0 1-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13"/>',"v":"0 0 24 24","w":2},{"id":"tabler-abacus","n":"Abacus","l":"tabler","t":["math","counting"],"s":"outline","c":'<path d="M5 3v18"/><path d="M19 21v-18"/><path d="M5 7h14"/><path d="M5 15h14"/><path d="M8 13v4"/><path d="M11 13v4"/><path d="M16 13v4"/><path d="M14 5v4"/><path d="M11 5v4"/><path d="M8 5v4"/><path d="M3 21h18"/>',"v":"0 0 24 24","w":2},{"id":"tabler-abc","n":"Abc","l":"tabler","t":["letters","alphabet"],"s":"outline","c":'<path d="M3 16v-6a2 2 0 1 1 4 0v6"/><path d="M3 13h4"/><path d="M10 8v6a2 2 0 1 0 4 0v-1a2 2 0 1 0 -4 0v1"/><path d="M20.732 12a2 2 0 0 0 -3.732 1v1a2 2 0 0 0 3.726 1.01"/>',"v":"0 0 24 24","w":2},{"id":"tabler-access-point","n":"Access Point","l":"tabler","t":["device","wifi","network"],"s":"outline","c":'<path d="M12 12l0 .01"/><path d="M14.828 9.172a4 4 0 0 1 0 5.656"/><path d="M17.657 6.343a8 8 0 0 1 0 11.314"/><path d="M9.168 14.828a4 4 0 0 1 0 -5.656"/><path d="M6.337 17.657a8 8 0 0 1 0 -11.314"/>',"v":"0 0 24 24","w":2},{"id":"tabler-accessible","n":"Accessible","l":"tabler","t":["disability","wheelchair"],"s":"outline","c":'<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1"/><path d="M11.5 7.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor"/>',"v":"0 0 24 24","w":2},{"id":"tabler-activity-heartbeat","n":"Activity Heartbeat","l":"tabler","t":["pulse","health","heart"],"s":"outline","c":'<path d="M3 12h4.5l1.5 -6l4 12l2 -9l1.5 3h4.5"/>',"v":"0 0 24 24","w":2},{"id":"tabler-activity","n":"Activity","l":"tabler","t":["pulse","motion"],"s":"outline","c":'<path d="M3 12h4l3 8l4 -16l3 8h4"/>',"v":"0 0 24 24","w":2},{"id":"tabler-ad","n":"Ad","l":"tabler","t":["advert","marketing"],"s":"outline","c":'<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M7 15v-4a2 2 0 0 1 4 0v4"/><path d="M7 13l4 0"/><path d="M17 9v6h-1.5a1.5 1.5 0 1 1 1.5 -1.5"/>',"v":"0 0 24 24","w":2},{"id":"tabler-address-book","n":"Address Book","l":"tabler","t":["contact","contacts"],"s":"outline","c":'<path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2"/><path d="M10 16h6"/><path d="M11 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 8h3"/><path d="M4 12h3"/><path d="M4 16h3"/>',"v":"0 0 24 24","w":2},{"id":"tabler-adjustments-horizontal","n":"Adjustments","l":"tabler","t":["sliders","controls"],"s":"outline","c":'<path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 6l8 0"/><path d="M16 6l4 0"/><path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 12l2 0"/><path d="M10 12l10 0"/><path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 18l11 0"/><path d="M19 18l1 0"/>',"v":"0 0 24 24","w":2},{"id":"tabler-a-b","n":"A B Test","l":"tabler","t":["test","compare"],"s":"outline","c":'<path d="M3 16v-5.5a2.5 2.5 0 0 1 5 0v5.5m0 -4h-5"/><path d="M12 6l0 12"/><path d="M16 16v-8h3a2 2 0 0 1 0 4h-3m3 0a2 2 0 0 1 0 4h-3"/>',"v":"0 0 24 24","w":2},{"id":"hero-academic-cap","n":"Academic Cap","l":"heroicons","t":["education","graduation"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-archive-box","n":"Archive Box","l":"heroicons","t":["archive","box","storage"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-down","n":"Arrow Down","l":"heroicons","t":["arrow","down","direction"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-left","n":"Arrow Left","l":"heroicons","t":["arrow","left","direction"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-right-circle","n":"Arrow Right Circle","l":"heroicons","t":["arrow","right","circle"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-down-tray","n":"Download","l":"heroicons","t":["download","save","tray"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-path","n":"Refresh","l":"heroicons","t":["refresh","reload","sync"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-long-right","n":"Arrow Long Right","l":"heroicons","t":["arrow","long","right"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>',"v":"0 0 24 24","w":1.5},{"id":"bs-0-circle","n":"0 Circle","l":"bootstrap","t":["zero","number"],"s":"outline","c":'<path d="M7.988 12.158c-1.851 0-2.941-1.57-2.941-3.99V7.84c0-2.408 1.101-3.996 2.965-3.996 1.857 0 2.935 1.57 2.935 3.996v.328c0 2.408-1.101 3.99-2.959 3.99M8 4.951c-1.008 0-1.629 1.09-1.629 2.895v.31c0 1.81.627 2.895 1.629 2.895s1.623-1.09 1.623-2.895v-.31c0-1.8-.621-2.895-1.623-2.895"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8"/>',"v":"0 0 16 16"},{"id":"bs-1-circle","n":"1 Circle","l":"bootstrap","t":["one","number"],"s":"outline","c":'<path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"/>',"v":"0 0 16 16"},{"id":"bs-0-circle-fill","n":"0 Circle Fill","l":"bootstrap","t":["zero","number","filled"],"s":"solid","c":'<path d="M8 4.951c-1.008 0-1.629 1.09-1.629 2.895v.31c0 1.81.627 2.895 1.629 2.895s1.623-1.09 1.623-2.895v-.31c0-1.8-.621-2.895-1.623-2.895"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-8.012 4.158c1.858 0 2.96-1.582 2.96-3.99V7.84c0-2.426-1.079-3.996-2.936-3.996-1.864 0-2.965 1.588-2.965 3.996v.328c0 2.42 1.09 3.99 2.941 3.99"/>',"v":"0 0 16 16"},{"id":"bs-1-circle-fill","n":"1 Circle Fill","l":"bootstrap","t":["one","number","filled"],"s":"solid","c":'<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.283 4.002H7.971L6.072 5.385v1.271l1.834-1.318h.065V12h1.312z"/>',"v":"0 0 16 16"},{"id":"bs-123","n":"123","l":"bootstrap","t":["numbers","123"],"s":"outline","c":'<path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75z"/>',"v":"0 0 16 16"}];

const ICONS = RAW.map(i => ({ ...i, searchText: `${i.n} ${i.t.join(" ")} ${i.l}`.toLowerCase() }));
const LIBRARIES = [...new Set(ICONS.map(i => i.l))];
const STYLES = [...new Set(ICONS.map(i => i.s))];
const PRESETS = ["#ffffff","#94a3b8","#6366f1","#8b5cf6","#ec4899","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#000000"];

const SHORTCUTS = [
  { keys: ["/"], desc: "Focus search" },
  { keys: ["⌘", "K"], desc: "Open command palette" },
  { keys: ["Esc"], desc: "Close panel / clear selection" },
  { keys: ["←", "→", "↑", "↓"], desc: "Navigate icons" },
  { keys: ["Enter"], desc: "Open / select" },
  { keys: ["F"], desc: "Favorite current icon" },
  { keys: ["C"], desc: "Copy SVG" },
  { keys: ["D"], desc: "Download SVG" },
  { keys: ["M"], desc: "Toggle multi-select" },
  { keys: ["Shift", "Click"], desc: "Add to selection" },
];

const isStrokeIcon = (icon) => icon.s === "outline" || !!icon.w;

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const push = useCallback((msg, type = "info") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);
  return { toasts, push };
}

// ═══════════════════════════════════════════════════════════════
// SVG / EXPORT BUILDERS (single source of truth — fixes JSX copy bug)
// ═══════════════════════════════════════════════════════════════
function buildSvg(icon, color, strokeW, size) {
  const stroke = isStrokeIcon(icon);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${icon.v}" fill="${stroke ? "none" : color}" stroke="${stroke ? color : "none"}" stroke-width="${stroke ? strokeW : 0}" stroke-linecap="round" stroke-linejoin="round">${icon.c}</svg>`;
}

function buildJsx(icon, color, strokeW, size) {
  const stroke = isStrokeIcon(icon);
  const componentName = icon.n.replace(/[^a-zA-Z0-9]/g, "") || "Icon";
  return `const ${componentName} = ({ size = ${size}, color = "${color}"${stroke ? `, strokeWidth = ${strokeW}` : ""}, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="${icon.v}"
    fill=${stroke ? `"none"` : `{color}`}
    stroke=${stroke ? `{color}` : `"none"`}
    ${stroke ? `strokeWidth={strokeWidth}` : `strokeWidth={0}`}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    ${icon.c.replace(/></g, ">\n    <")}
  </svg>
);`;
}

function buildDataUrl(icon, color, strokeW, size) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(buildSvg(icon, color, strokeW, size))}`;
}

function buildSprite(icons, color, strokeW) {
  // Generate single SVG sprite with <symbol> definitions for batch use
  const symbols = icons.map((icon) =>
    `<symbol id="${icon.id}" viewBox="${icon.v}">${icon.c}</symbol>`
  ).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  ${symbols}
</svg>

<!-- Use anywhere on the page: -->
<!-- <svg width="24" height="24"><use href="#${icons[0]?.id || 'icon-id'}" /></svg> -->`;
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPngFromSvg(svg, filename, size) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = size * 2;
    c.height = size * 2;
    c.getContext("2d").drawImage(img, 0, 0, size * 2, size * 2);
    c.toBlob((b) => {
      const pu = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = pu;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pu);
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.src = url;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function IconHub() {
  // ─── Core state ─────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [activeLibs, setActiveLibs] = useState([]);
  const [activeStyles, setActiveStyles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // ─── Customization (sticky across icon selections) ──────
  const [color, setColor] = useState("#ffffff");
  const [strokeW, setStrokeW] = useState(2);
  const [iconSize, setIconSize] = useState(24);

  // ─── UI state ───────────────────────────────────────────
  const [sidebar, setSidebar] = useState(false);
  const [tab, setTab] = useState("svg");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // ─── Multi-select state ─────────────────────────────────
  const [multiMode, setMultiMode] = useState(false);
  const [selection, setSelection] = useState(() => new Set());

  // ─── Context menu ───────────────────────────────────────
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, icon }

  // ─── Refs and helpers ───────────────────────────────────
  const searchRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const isMobileSidebar = useMediaQuery("(max-width: 767px)");
  const { toasts, push: pushToast } = useToast();

  // ─── Filtered icons ─────────────────────────────────────
  const filtered = useMemo(() => {
    let r = ICONS;
    if (favoritesOnly) r = r.filter((i) => favorites.has(i.id));
    if (activeLibs.length) r = r.filter((i) => activeLibs.includes(i.l));
    if (activeStyles.length) r = r.filter((i) => activeStyles.includes(i.s));
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((i) => i.searchText.includes(q));
    }
    return r;
  }, [query, activeLibs, activeStyles, favoritesOnly, favorites]);

  const sel = useMemo(
    () => (selectedId ? ICONS.find((i) => i.id === selectedId) : null),
    [selectedId]
  );

  // ─── Actions ────────────────────────────────────────────
  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          pushToast("Removed from favorites");
        } else {
          next.add(id);
          pushToast("Added to favorites", "success");
        }
        return next;
      });
    },
    [pushToast]
  );

  const toggleSelection = useCallback((id) => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleIconClick = useCallback(
    (icon, e) => {
      if (multiMode || e?.shiftKey) {
        toggleSelection(icon.id);
      } else {
        setSelectedId(icon.id);
      }
    },
    [multiMode, toggleSelection]
  );

  const copyAction = useCallback(
    async (text, label = "Copied") => {
      const ok = await copyToClipboard(text);
      pushToast(ok ? `${label} to clipboard` : "Copy failed", ok ? "success" : "error");
    },
    [pushToast]
  );

  // ─── Bulk actions ───────────────────────────────────────
  const selectedIcons = useMemo(
    () => ICONS.filter((i) => selection.has(i.id)),
    [selection]
  );

  const bulkDownloadSvgs = useCallback(() => {
    selectedIcons.forEach((icon, i) => {
      // Stagger so browsers don't block multiple downloads
      setTimeout(() => {
        downloadFile(buildSvg(icon, color, strokeW, iconSize), `${icon.id}.svg`, "image/svg+xml");
      }, i * 100);
    });
    pushToast(`Downloading ${selectedIcons.length} SVGs…`, "success");
  }, [selectedIcons, color, strokeW, iconSize, pushToast]);

  const bulkExportSprite = useCallback(() => {
    if (!selectedIcons.length) return;
    const sprite = buildSprite(selectedIcons, color, strokeW);
    downloadFile(sprite, "icon-sprite.svg", "image/svg+xml");
    pushToast(`Exported sprite with ${selectedIcons.length} icons`, "success");
  }, [selectedIcons, color, strokeW, pushToast]);

  const bulkCopySpriteCode = useCallback(() => {
    const sprite = buildSprite(selectedIcons, color, strokeW);
    copyAction(sprite, "Sprite code copied");
  }, [selectedIcons, color, strokeW, copyAction]);

  // ─── Keyboard shortcuts (global) ────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Don't interfere with typing in inputs (except specific keys)
      const inInput = ["INPUT", "TEXTAREA"].includes(e.target.tagName);

      // Esc — close panels
      if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (shortcutsOpen) setShortcutsOpen(false);
        else if (ctxMenu) setCtxMenu(null);
        else if (selectedId) setSelectedId(null);
        else if (selection.size) setSelection(new Set());
        else if (sidebar) setSidebar(false);
        return;
      }

      if (inInput) return;

      // / — focus search
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }

      // Cmd/Ctrl+K — command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }

      // ? — shortcuts help
      if (e.key === "?" && e.shiftKey) {
        setShortcutsOpen((s) => !s);
      }

      // M — toggle multi-select
      if (e.key.toLowerCase() === "m") {
        setMultiMode((m) => !m);
      }

      // Single-icon shortcuts (when an icon is selected)
      if (sel) {
        if (e.key.toLowerCase() === "f") {
          toggleFavorite(sel.id);
        }
        if (e.key.toLowerCase() === "c") {
          copyAction(buildSvg(sel, color, strokeW, iconSize), "SVG copied");
        }
        if (e.key.toLowerCase() === "d") {
          downloadFile(buildSvg(sel, color, strokeW, iconSize), `${sel.id}.svg`, "image/svg+xml");
          pushToast("SVG downloaded", "success");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    sel, selectedId, selection, sidebar, paletteOpen, shortcutsOpen, ctxMenu,
    color, strokeW, iconSize, toggleFavorite, copyAction, pushToast,
  ]);

  // ─── Right-click context menu ───────────────────────────
  const handleContextMenu = useCallback((e, icon) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, icon });
  }, []);

  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [ctxMenu]);

  // ─── Render helpers ─────────────────────────────────────
  const stroke = sel ? isStrokeIcon(sel) : false;

  return (
    <div className="ih-root">
      <Styles />

      {/* ═════ HEADER ═════ */}
      <header className="ih-header">
        <button className="ih-iconbtn" onClick={() => setSidebar((s) => !s)} aria-label="Toggle sidebar">
          <Menu size={18} />
        </button>

        <div className="ih-logo">
          <div className="ih-logomark">
            <Grid3x3 size={14} color="white" strokeWidth={2.5} />
          </div>
          <span className="ih-logotext">IconHub</span>
        </div>

        <div className="ih-search">
          <Search size={15} className="ih-search-icon" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons… (press /)"
            aria-label="Search icons"
          />
          {query && (
            <button className="ih-search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="ih-header-actions">
          <button
            className={`ih-pill ${multiMode ? "active" : ""}`}
            onClick={() => setMultiMode((m) => !m)}
            title="Toggle multi-select (M)"
          >
            <Layers size={13} />
            <span className="ih-hide-sm">Multi</span>
            {selection.size > 0 && <span className="ih-pill-badge">{selection.size}</span>}
          </button>
          <button
            className={`ih-pill ${favoritesOnly ? "active" : ""}`}
            onClick={() => setFavoritesOnly((f) => !f)}
            title="Show favorites only"
            disabled={favorites.size === 0}
          >
            <Heart size={13} fill={favoritesOnly ? "currentColor" : "none"} />
            {favorites.size > 0 && <span className="ih-pill-badge">{favorites.size}</span>}
          </button>
          <button
            className="ih-iconbtn"
            onClick={() => setPaletteOpen(true)}
            title="Command palette (⌘K)"
          >
            <Command size={15} />
          </button>
          <button
            className="ih-iconbtn"
            onClick={() => setShortcutsOpen(true)}
            title="Keyboard shortcuts (?)"
          >
            <Keyboard size={15} />
          </button>
        </div>
      </header>

      <div className="ih-body">
        {/* ═════ SIDEBAR ═════ */}
        {(sidebar || isDesktop) && !isMobileSidebar && (
          <Sidebar
            libraries={LIBRARIES}
            styles={STYLES}
            activeLibs={activeLibs}
            activeStyles={activeStyles}
            onToggleLib={(l) =>
              setActiveLibs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))
            }
            onToggleStyle={(s) =>
              setActiveStyles((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
            }
            onClearLibs={() => setActiveLibs([])}
            iconCounts={ICONS}
          />
        )}
        {sidebar && isMobileSidebar && (
          <>
            <div className="ih-overlay" onClick={() => setSidebar(false)} />
            <div className="ih-sidebar-mobile">
              <Sidebar
                libraries={LIBRARIES}
                styles={STYLES}
                activeLibs={activeLibs}
                activeStyles={activeStyles}
                onToggleLib={(l) =>
                  setActiveLibs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))
                }
                onToggleStyle={(s) =>
                  setActiveStyles((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
                }
                onClearLibs={() => setActiveLibs([])}
                iconCounts={ICONS}
                onClose={() => setSidebar(false)}
              />
            </div>
          </>
        )}

        {/* ═════ GRID ═════ */}
        <main className="ih-main">
          {/* Result bar */}
          <div className="ih-resultbar">
            <span>
              <strong>{filtered.length}</strong>
              {filtered.length !== ICONS.length && <> of {ICONS.length}</>} icons
              {favoritesOnly && <span className="ih-resultbar-tag">favorites</span>}
              {activeLibs.length > 0 && (
                <span className="ih-resultbar-tag">
                  {activeLibs.length} {activeLibs.length === 1 ? "library" : "libraries"}
                </span>
              )}
            </span>
            {(activeLibs.length > 0 || activeStyles.length > 0 || favoritesOnly || query) && (
              <button
                className="ih-link"
                onClick={() => {
                  setActiveLibs([]);
                  setActiveStyles([]);
                  setFavoritesOnly(false);
                  setQuery("");
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="ih-empty">
              <div className="ih-empty-iconbg"><Search size={24} color="#35354a" /></div>
              <p className="ih-empty-title">No icons found</p>
              <p className="ih-empty-sub">Try a different search or clear your filters</p>
            </div>
          ) : (
            <div className="ih-grid">
              {filtered.map((icon) => (
                <IconCard
                  key={icon.id}
                  icon={icon}
                  color={color}
                  strokeW={strokeW}
                  isSelected={selectedId === icon.id}
                  isInSelection={selection.has(icon.id)}
                  isFavorite={favorites.has(icon.id)}
                  multiMode={multiMode}
                  onClick={(e) => handleIconClick(icon, e)}
                  onContextMenu={(e) => handleContextMenu(e, icon)}
                />
              ))}
            </div>
          )}
        </main>

        {/* ═════ DETAIL PANEL ═════ */}
        {sel && (
          <DetailPanel
            sel={sel}
            color={color}
            setColor={setColor}
            strokeW={strokeW}
            setStrokeW={setStrokeW}
            iconSize={iconSize}
            setIconSize={setIconSize}
            tab={tab}
            setTab={setTab}
            isFavorite={favorites.has(sel.id)}
            onToggleFavorite={() => toggleFavorite(sel.id)}
            onClose={() => setSelectedId(null)}
            onCopy={copyAction}
            onToast={pushToast}
            isDesktop={isDesktop}
          />
        )}
      </div>

      {/* ═════ MULTI-SELECT ACTION BAR ═════ */}
      {selection.size > 0 && (
        <BulkActionBar
          count={selection.size}
          onClear={() => setSelection(new Set())}
          onDownloadSvgs={bulkDownloadSvgs}
          onExportSprite={bulkExportSprite}
          onCopySpriteCode={bulkCopySpriteCode}
        />
      )}

      {/* ═════ COMMAND PALETTE ═════ */}
      {paletteOpen && (
        <CommandPalette
          icons={ICONS}
          libraries={LIBRARIES}
          styles={STYLES}
          activeLibs={activeLibs}
          activeStyles={activeStyles}
          onClose={() => setPaletteOpen(false)}
          onSelectIcon={(id) => {
            setSelectedId(id);
            setPaletteOpen(false);
          }}
          onToggleLib={(l) => {
            setActiveLibs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));
            setPaletteOpen(false);
          }}
          onToggleStyle={(s) => {
            setActiveStyles((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
            setPaletteOpen(false);
          }}
          onAction={(action) => {
            action();
            setPaletteOpen(false);
          }}
          actions={{
            "Toggle multi-select mode": () => setMultiMode((m) => !m),
            "Toggle favorites filter": () => setFavoritesOnly((f) => !f),
            "Clear all filters": () => {
              setActiveLibs([]); setActiveStyles([]); setFavoritesOnly(false); setQuery("");
            },
            "Show keyboard shortcuts": () => setShortcutsOpen(true),
          }}
        />
      )}

      {/* ═════ KEYBOARD SHORTCUTS HELP ═════ */}
      {shortcutsOpen && <ShortcutsHelp onClose={() => setShortcutsOpen(false)} />}

      {/* ═════ CONTEXT MENU ═════ */}
      {ctxMenu && (
        <ContextMenu
          ctx={ctxMenu}
          color={color}
          strokeW={strokeW}
          iconSize={iconSize}
          isFavorite={favorites.has(ctxMenu.icon.id)}
          onCopySvg={() => copyAction(buildSvg(ctxMenu.icon, color, strokeW, iconSize), "SVG copied")}
          onCopyJsx={() => copyAction(buildJsx(ctxMenu.icon, color, strokeW, iconSize), "JSX copied")}
          onCopyDataUrl={() => copyAction(buildDataUrl(ctxMenu.icon, color, strokeW, iconSize), "Data URL copied")}
          onDownloadSvg={() => {
            downloadFile(buildSvg(ctxMenu.icon, color, strokeW, iconSize), `${ctxMenu.icon.id}.svg`, "image/svg+xml");
            pushToast("SVG downloaded", "success");
          }}
          onDownloadPng={() => {
            downloadPngFromSvg(buildSvg(ctxMenu.icon, color, strokeW, iconSize), `${ctxMenu.icon.id}.png`, iconSize);
            pushToast("PNG downloaded", "success");
          }}
          onToggleFavorite={() => toggleFavorite(ctxMenu.icon.id)}
          onAddToSelection={() => {
            toggleSelection(ctxMenu.icon.id);
            pushToast(selection.has(ctxMenu.icon.id) ? "Removed from selection" : "Added to selection");
          }}
          inSelection={selection.has(ctxMenu.icon.id)}
        />
      )}

      {/* ═════ TOASTS ═════ */}
      <div className="ih-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`ih-toast ih-toast-${t.type}`}>
            {t.type === "success" && <Check size={14} />}
            {t.type === "error" && <X size={14} />}
            {t.type === "info" && <Sparkles size={14} />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════
function IconCard({ icon, color, strokeW, isSelected, isInSelection, isFavorite, multiMode, onClick, onContextMenu }) {
  const stroke = isStrokeIcon(icon);
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`ih-card ${isSelected ? "selected" : ""} ${isInSelection ? "in-selection" : ""}`}
      title={`${icon.n} (${icon.l}) — right-click for actions`}
      aria-label={`${icon.n} from ${icon.l}`}
      data-multi={multiMode || undefined}
    >
      {(isInSelection || (multiMode && !isInSelection)) && (
        <div className={`ih-card-checkbox ${isInSelection ? "checked" : ""}`}>
          {isInSelection && <Check size={10} strokeWidth={3} />}
        </div>
      )}
      {isFavorite && (
        <div className="ih-card-fav-indicator">
          <Heart size={9} fill="currentColor" />
        </div>
      )}
      <svg
        viewBox={icon.v}
        width="22"
        height="22"
        fill={stroke ? "none" : color}
        stroke={stroke ? color : "none"}
        strokeWidth={stroke ? strokeW : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: icon.c }}
      />
      <span className="ih-card-label">{icon.n}</span>
    </button>
  );
}

function Sidebar({ libraries, styles, activeLibs, activeStyles, onToggleLib, onToggleStyle, onClearLibs, iconCounts, onClose }) {
  return (
    <aside className="ih-sidebar">
      {onClose && (
        <div className="ih-sidebar-mhead">
          <span>Filters</span>
          <button className="ih-iconbtn" onClick={onClose}><X size={14} /></button>
        </div>
      )}
      <div className="ih-sidebar-body">
        <div className="ih-sidebar-section">
          <div className="ih-sidebar-h3">Libraries</div>
          <button
            onClick={onClearLibs}
            className={`ih-sidebar-btn ${activeLibs.length === 0 ? "active" : ""}`}
          >
            All Libraries
          </button>
          {libraries.map((lib) => (
            <button
              key={lib}
              onClick={() => onToggleLib(lib)}
              className={`ih-sidebar-btn ${activeLibs.includes(lib) ? "active" : ""}`}
            >
              <span style={{ textTransform: "capitalize" }}>{lib}</span>
              <span className="ih-sidebar-count">{iconCounts.filter((i) => i.l === lib).length}</span>
            </button>
          ))}
        </div>
        <div className="ih-sidebar-section">
          <div className="ih-sidebar-h3">Style</div>
          <div className="ih-pill-row">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => onToggleStyle(s)}
                className={`ih-pill-sm ${activeStyles.includes(s) ? "active" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <p className="ih-sidebar-note">
          All icons MIT-licensed. Use freely for personal and commercial projects.
        </p>
      </div>
    </aside>
  );
}

function DetailPanel({ sel, color, setColor, strokeW, setStrokeW, iconSize, setIconSize, tab, setTab, isFavorite, onToggleFavorite, onClose, onCopy, onToast, isDesktop }) {
  const stroke = isStrokeIcon(sel);
  const svgMarkup = buildSvg(sel, color, strokeW, iconSize);
  const jsxCode = buildJsx(sel, color, strokeW, iconSize);
  const dataUrl = buildDataUrl(sel, color, strokeW, iconSize);

  return (
    <>
      {!isDesktop && <div className="ih-overlay" onClick={onClose} />}
      <aside className={`ih-detail ${!isDesktop ? "ih-detail-mobile" : ""}`}>
        <div className="ih-detail-head">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ih-detail-title">{sel.n}</div>
            <div className="ih-detail-sub">{sel.l} · {sel.s}</div>
          </div>
          <button
            className={`ih-iconbtn ${isFavorite ? "fav-active" : ""}`}
            onClick={onToggleFavorite}
            title="Favorite (F)"
            aria-label="Toggle favorite"
          >
            <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button className="ih-iconbtn" onClick={onClose} aria-label="Close panel">
            <X size={15} />
          </button>
        </div>

        <div className="ih-detail-body">
          <div className="ih-preview">
            <div className="ih-preview-frame">
              <svg
                viewBox={sel.v}
                width="56"
                height="56"
                fill={stroke ? "none" : color}
                stroke={stroke ? color : "none"}
                strokeWidth={stroke ? strokeW : 0}
                strokeLinecap="round"
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: sel.c }}
              />
            </div>
          </div>

          <Section label="Color">
            <div className="ih-presets">
              {PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`ih-preset ${color === c ? "active" : ""}`}
                  style={{ background: c }}
                  aria-label={`Set color to ${c}`}
                />
              ))}
            </div>
            <div className="ih-color-row">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Color picker" />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="ih-color-input"
                aria-label="Hex color code"
              />
            </div>
          </Section>

          {stroke && (
            <Section label="Stroke" value={`${strokeW}px`}>
              <input type="range" min="0.5" max="4" step="0.25" value={strokeW} onChange={(e) => setStrokeW(+e.target.value)} />
            </Section>
          )}

          <Section label="Size" value={`${iconSize}px`}>
            <input type="range" min="16" max="256" step="8" value={iconSize} onChange={(e) => setIconSize(+e.target.value)} />
          </Section>

          <Section label="Download">
            <div className="ih-dlgrid">
              <DlButton icon={<Download size={13} />} label="SVG" onClick={() => {
                downloadFile(svgMarkup, `${sel.id}.svg`, "image/svg+xml");
                onToast("SVG downloaded", "success");
              }} />
              <DlButton icon={<FileImage size={13} />} label="PNG" onClick={() => {
                downloadPngFromSvg(svgMarkup, `${sel.id}.png`, iconSize);
                onToast("PNG downloaded", "success");
              }} />
              <DlButton icon={<FileCode size={13} />} label="XML" onClick={() => {
                downloadFile(`<?xml version="1.0" encoding="UTF-8"?>\n${svgMarkup}`, `${sel.id}.xml`, "application/xml");
                onToast("XML downloaded", "success");
              }} />
            </div>
          </Section>

          <Section>
            <div className="ih-tabs">
              {["svg", "jsx", "url"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`ih-tab ${tab === t ? "active" : ""}`}
                >
                  {t === "url" ? "Data URL" : t.toUpperCase()}
                </button>
              ))}
            </div>
            <pre className="ih-code">
              {tab === "svg" ? svgMarkup : tab === "jsx" ? jsxCode : dataUrl}
            </pre>
            <button
              className="ih-copybtn"
              onClick={() => {
                const text = tab === "svg" ? svgMarkup : tab === "jsx" ? jsxCode : dataUrl;
                const label = tab === "svg" ? "SVG" : tab === "jsx" ? "JSX" : "Data URL";
                onCopy(text, `${label} copied`);
              }}
            >
              <Copy size={13} />
              Copy {tab === "url" ? "URL" : tab.toUpperCase()}
            </button>
          </Section>
        </div>
      </aside>
    </>
  );
}

function Section({ label, value, children }) {
  return (
    <div className="ih-section">
      {label && (
        <div className="ih-section-head">
          <span className="ih-section-label">{label}</span>
          {value && <span className="ih-section-value">{value}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function DlButton({ icon, label, onClick }) {
  return (
    <button className="ih-dlbtn" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function BulkActionBar({ count, onClear, onDownloadSvgs, onExportSprite, onCopySpriteCode }) {
  return (
    <div className="ih-bulkbar">
      <div className="ih-bulkbar-info">
        <Layers size={14} />
        <strong>{count}</strong> {count === 1 ? "icon" : "icons"} selected
      </div>
      <div className="ih-bulkbar-actions">
        <button className="ih-bulk-btn" onClick={onCopySpriteCode}>
          <Copy size={13} /> Sprite Code
        </button>
        <button className="ih-bulk-btn" onClick={onExportSprite}>
          <Download size={13} /> Sprite SVG
        </button>
        <button className="ih-bulk-btn primary" onClick={onDownloadSvgs}>
          <Download size={13} /> All SVGs
        </button>
        <button className="ih-iconbtn" onClick={onClear} aria-label="Clear selection">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function CommandPalette({ icons, libraries, styles, onClose, onSelectIcon, onToggleLib, onToggleStyle, onAction, actions }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const lower = q.toLowerCase();
  const matchedIcons = q.trim()
    ? icons.filter((i) => i.searchText.includes(lower)).slice(0, 6)
    : icons.slice(0, 6);
  const matchedLibs = q.trim() ? libraries.filter((l) => l.toLowerCase().includes(lower)) : libraries;
  const matchedStyles = q.trim() ? styles.filter((s) => s.toLowerCase().includes(lower)) : styles;
  const matchedActions = Object.keys(actions).filter((a) => a.toLowerCase().includes(lower));

  return (
    <>
      <div className="ih-overlay ih-overlay-deep" onClick={onClose} />
      <div className="ih-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="ih-palette-input">
          <Search size={15} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search icons, filter by library, run actions…"
            aria-label="Command palette search"
          />
          <kbd className="ih-kbd">Esc</kbd>
        </div>
        <div className="ih-palette-results">
          {matchedActions.length > 0 && (
            <div className="ih-palette-section">
              <div className="ih-palette-h">Actions</div>
              {matchedActions.map((a) => (
                <button key={a} className="ih-palette-item" onClick={() => onAction(actions[a])}>
                  <Zap size={13} />
                  <span>{a}</span>
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>
          )}
          {matchedLibs.length > 0 && (
            <div className="ih-palette-section">
              <div className="ih-palette-h">Filter by Library</div>
              {matchedLibs.map((l) => (
                <button key={l} className="ih-palette-item" onClick={() => onToggleLib(l)}>
                  <Pin size={13} />
                  <span style={{ textTransform: "capitalize" }}>{l}</span>
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>
          )}
          {matchedStyles.length > 0 && q.trim() && (
            <div className="ih-palette-section">
              <div className="ih-palette-h">Filter by Style</div>
              {matchedStyles.map((s) => (
                <button key={s} className="ih-palette-item" onClick={() => onToggleStyle(s)}>
                  <Pin size={13} />
                  <span style={{ textTransform: "capitalize" }}>{s}</span>
                </button>
              ))}
            </div>
          )}
          {matchedIcons.length > 0 && (
            <div className="ih-palette-section">
              <div className="ih-palette-h">Icons</div>
              {matchedIcons.map((icon) => {
                const stroke = isStrokeIcon(icon);
                return (
                  <button
                    key={icon.id}
                    className="ih-palette-item"
                    onClick={() => onSelectIcon(icon.id)}
                  >
                    <svg
                      viewBox={icon.v}
                      width="16"
                      height="16"
                      fill={stroke ? "none" : "#a5b4fc"}
                      stroke={stroke ? "#a5b4fc" : "none"}
                      strokeWidth={stroke ? 2 : 0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dangerouslySetInnerHTML={{ __html: icon.c }}
                    />
                    <span>{icon.n}</span>
                    <span className="ih-palette-meta">{icon.l}</span>
                    <ChevronRight size={12} />
                  </button>
                );
              })}
            </div>
          )}
          {matchedActions.length === 0 && matchedIcons.length === 0 && matchedLibs.length === 0 && (
            <div className="ih-palette-empty">No matches for "{q}"</div>
          )}
        </div>
      </div>
    </>
  );
}

function ContextMenu({ ctx, isFavorite, inSelection, onCopySvg, onCopyJsx, onCopyDataUrl, onDownloadSvg, onDownloadPng, onToggleFavorite, onAddToSelection }) {
  // Constrain menu to viewport
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ x: ctx.x, y: ctx.y });
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let x = ctx.x;
    let y = ctx.y;
    if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 8;
    if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 8;
    setPosition({ x, y });
  }, [ctx]);

  return (
    <div
      ref={menuRef}
      className="ih-ctxmenu"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="ih-ctxmenu-head">{ctx.icon.n}</div>
      <button onClick={onCopySvg}><Copy size={12} /> Copy SVG</button>
      <button onClick={onCopyJsx}><Code2 size={12} /> Copy JSX</button>
      <button onClick={onCopyDataUrl}><ExternalLink size={12} /> Copy Data URL</button>
      <div className="ih-ctxmenu-divider" />
      <button onClick={onDownloadSvg}><Download size={12} /> Download SVG</button>
      <button onClick={onDownloadPng}><FileImage size={12} /> Download PNG</button>
      <div className="ih-ctxmenu-divider" />
      <button onClick={onToggleFavorite}>
        <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
      <button onClick={onAddToSelection}>
        <Layers size={12} />
        {inSelection ? "Remove from selection" : "Add to selection"}
      </button>
    </div>
  );
}

function ShortcutsHelp({ onClose }) {
  return (
    <>
      <div className="ih-overlay ih-overlay-deep" onClick={onClose} />
      <div className="ih-shortcuts" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
        <div className="ih-shortcuts-head">
          <Keyboard size={15} />
          <span>Keyboard Shortcuts</span>
          <button className="ih-iconbtn" onClick={onClose} aria-label="Close shortcuts"><X size={14} /></button>
        </div>
        <div className="ih-shortcuts-body">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="ih-shortcut-row">
              <div className="ih-shortcut-keys">
                {s.keys.map((k, j) => (
                  <kbd key={j} className="ih-kbd">{k}</kbd>
                ))}
              </div>
              <span className="ih-shortcut-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES — single source of truth for all visual chrome
// ═══════════════════════════════════════════════════════════════
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ih-root { font-family: 'DM Sans', system-ui, sans-serif; background: #0a0a0f; color: #dddde8; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #35354a; border-radius: 3px; }
      input[type=range] { accent-color: #6366f1; width: 100%; }
      ::selection { background: #6366f1; color: white; }
      kbd { font-family: 'Space Mono', monospace; }

      /* ─── HEADER ─── */
      .ih-header { flex-shrink: 0; border-bottom: 1px solid #1a1a25; background: rgba(17,17,25,0.85); backdrop-filter: blur(16px); z-index: 30; display: flex; align-items: center; gap: 10px; padding: 0 14px; height: 52px; }
      .ih-iconbtn { background: none; border: none; color: #dddde8; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: background 0.12s; }
      .ih-iconbtn:hover { background: rgba(99,102,241,0.1); }
      .ih-iconbtn.fav-active { color: #ec4899; }
      .ih-logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      .ih-logomark { width: 26px; height: 26px; border-radius: 7px; background: linear-gradient(135deg,#6366f1,#22d3ee); display: flex; align-items: center; justify-content: center; }
      .ih-logotext { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 13px; }
      .ih-search { flex: 1; max-width: 460px; margin: 0 auto; position: relative; display: flex; align-items: center; }
      .ih-search-icon { position: absolute; left: 10px; color: #505068; pointer-events: none; }
      .ih-search input { width: 100%; height: 34px; padding-left: 32px; padding-right: 30px; border-radius: 8px; background: rgba(26,26,37,0.6); border: 1px solid #252533; color: #dddde8; font-size: 13px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
      .ih-search input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
      .ih-search-clear { position: absolute; right: 8px; background: none; border: none; color: #8888a4; cursor: pointer; padding: 4px; display: flex; }
      .ih-search-clear:hover { color: #dddde8; }
      .ih-header-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .ih-pill { display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; cursor: pointer; font-size: 11px; font-weight: 500; font-family: inherit; transition: all 0.12s; }
      .ih-pill:hover:not(:disabled) { border-color: #35354a; color: #dddde8; }
      .ih-pill:disabled { opacity: 0.4; cursor: not-allowed; }
      .ih-pill.active { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
      .ih-pill-badge { background: #6366f1; color: white; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 8px; min-width: 14px; text-align: center; }
      .ih-hide-sm { display: inline; }
      @media (max-width: 640px) { .ih-hide-sm { display: none; } }

      /* ─── BODY LAYOUT ─── */
      .ih-body { flex: 1; display: flex; overflow: hidden; position: relative; }
      .ih-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }
      .ih-overlay-deep { background: rgba(0,0,0,0.7); z-index: 80; }

      /* ─── SIDEBAR ─── */
      .ih-sidebar { width: 220px; height: 100%; flex-shrink: 0; background: #111119; border-right: 1px solid #1a1a25; display: flex; flex-direction: column; overflow: hidden; }
      .ih-sidebar-mobile { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; width: 220px; }
      .ih-sidebar-mhead { display: flex; align-items: center; justify-content: space-between; padding: 14px; border-bottom: 1px solid #1a1a25; font-family: 'Space Mono', monospace; font-weight: 700; font-size: 12px; }
      .ih-sidebar-body { flex: 1; overflow-y: auto; padding: 14px; }
      .ih-sidebar-section { margin-bottom: 18px; }
      .ih-sidebar-h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #505068; font-family: 'Space Mono', monospace; margin-bottom: 8px; }
      .ih-sidebar-btn { width: 100%; text-align: left; padding: 7px 10px; border-radius: 6px; background: transparent; border: 1px solid transparent; color: #8888a4; font-size: 13px; cursor: pointer; margin-bottom: 2px; font-family: inherit; display: flex; justify-content: space-between; align-items: center; transition: all 0.1s; }
      .ih-sidebar-btn:hover { background: rgba(26,26,37,0.6); color: #dddde8; }
      .ih-sidebar-btn.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
      .ih-sidebar-count { font-size: 10px; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-sidebar-btn.active .ih-sidebar-count { color: #818cf8; }
      .ih-pill-row { display: flex; flex-wrap: wrap; gap: 5px; }
      .ih-pill-sm { padding: 5px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; text-transform: capitalize; font-family: inherit; transition: all 0.1s; }
      .ih-pill-sm:hover { border-color: #35354a; color: #dddde8; }
      .ih-pill-sm.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
      .ih-sidebar-note { margin-top: 16px; padding-top: 14px; border-top: 1px solid #1a1a25; font-size: 11px; color: #505068; line-height: 1.5; }

      /* ─── MAIN ─── */
      .ih-main { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; }
      .ih-resultbar { display: flex; align-items: center; justify-content: space-between; padding: 4px 4px 12px; font-size: 12px; color: #8888a4; }
      .ih-resultbar strong { color: #dddde8; font-weight: 600; }
      .ih-resultbar-tag { display: inline-block; margin-left: 6px; padding: 2px 7px; border-radius: 4px; background: rgba(99,102,241,0.15); color: #a5b4fc; font-size: 10px; text-transform: lowercase; font-family: 'Space Mono', monospace; }
      .ih-link { background: none; border: none; color: #8888a4; cursor: pointer; font-size: 11px; font-family: inherit; text-decoration: underline; text-underline-offset: 2px; }
      .ih-link:hover { color: #dddde8; }

      /* ─── GRID + CARDS ─── */
      .ih-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 4px; }
      .ih-card { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 12px; border: 1px solid rgba(26,26,37,0.5); background: rgba(17,17,25,0.5); cursor: pointer; transition: background 0.1s, border-color 0.1s, transform 0.1s; font-family: inherit; color: inherit; }
      .ih-card:hover { background: rgba(26,26,37,0.7); border-color: #252533; }
      .ih-card:hover svg { transform: scale(1.1); }
      .ih-card svg { transition: transform 0.15s; }
      .ih-card.selected { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); }
      .ih-card.in-selection { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); }
      .ih-card[data-multi]:not(.in-selection) { background: rgba(17,17,25,0.7); }
      .ih-card-label { font-size: 9px; color: #505068; width: 100%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ih-card-checkbox { position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid #35354a; background: rgba(10,10,15,0.6); display: flex; align-items: center; justify-content: center; color: white; }
      .ih-card-checkbox.checked { background: #6366f1; border-color: #6366f1; }
      .ih-card-fav-indicator { position: absolute; top: 4px; right: 4px; color: #ec4899; }

      /* ─── EMPTY STATE ─── */
      .ih-empty { flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; padding: 40px; }
      .ih-empty-iconbg { width: 56px; height: 56px; border-radius: 16px; background: rgba(26,26,37,0.5); display: flex; align-items: center; justify-content: center; }
      .ih-empty-title { color: #8888a4; font-size: 14px; }
      .ih-empty-sub { color: #505068; font-size: 12px; }

      /* ─── DETAIL PANEL ─── */
      .ih-detail { width: 280px; flex-shrink: 0; background: #111119; border-left: 1px solid #1a1a25; display: flex; flex-direction: column; overflow: hidden; }
      .ih-detail-mobile { position: fixed; right: 0; top: 0; bottom: 0; z-index: 50; }
      .ih-detail-head { display: flex; align-items: center; gap: 6px; padding: 0 12px; height: 52px; border-bottom: 1px solid #1a1a25; flex-shrink: 0; }
      .ih-detail-title { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ih-detail-sub { font-size: 10px; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-detail-body { flex: 1; overflow-y: auto; }
      .ih-preview { padding: 18px; display: flex; justify-content: center; border-bottom: 1px solid #1a1a25; }
      .ih-preview-frame { width: 110px; height: 110px; border-radius: 16px; background: rgba(10,10,15,0.8); border: 1px solid #1a1a25; display: flex; align-items: center; justify-content: center; }

      .ih-section { padding: 12px 14px; border-bottom: 1px solid #1a1a25; }
      .ih-section:last-child { border-bottom: none; }
      .ih-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .ih-section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-section-value { font-size: 11px; color: #8888a4; font-family: 'Space Mono', monospace; }

      .ih-presets { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
      .ih-preset { width: 22px; height: 22px; border-radius: 5px; border: 2px solid #252533; cursor: pointer; transition: all 0.1s; padding: 0; }
      .ih-preset:hover { border-color: #35354a; }
      .ih-preset.active { border-color: #818cf8; transform: scale(1.15); }
      .ih-color-row { display: flex; align-items: center; gap: 6px; }
      .ih-color-row input[type=color] { width: 30px; height: 26px; border: none; background: none; cursor: pointer; padding: 0; }
      .ih-color-input { flex: 1; height: 26px; padding: 0 8px; border-radius: 5px; background: #1a1a25; border: 1px solid #252533; color: #dddde8; font-size: 11px; font-family: 'Space Mono', monospace; outline: none; }
      .ih-color-input:focus { border-color: #6366f1; }

      .ih-dlgrid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
      .ih-dlbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; border-radius: 8px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; font-size: 11px; cursor: pointer; transition: all 0.12s; font-family: inherit; }
      .ih-dlbtn:hover { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.1); color: #dddde8; }

      .ih-tabs { display: flex; gap: 0; border-bottom: 1px solid #1a1a25; margin-bottom: 10px; }
      .ih-tab { padding: 5px 12px; font-size: 11px; font-family: 'Space Mono', monospace; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; color: #505068; margin-bottom: -1px; text-transform: uppercase; transition: all 0.12s; }
      .ih-tab:hover { color: #8888a4; }
      .ih-tab.active { border-bottom-color: #6366f1; color: #a5b4fc; }
      .ih-code { background: rgba(10,10,15,0.8); border: 1px solid #1a1a25; border-radius: 8px; padding: 10px; font-size: 9px; color: #8888a4; font-family: 'Space Mono', monospace; overflow: auto; max-height: 140px; white-space: pre-wrap; word-break: break-all; line-height: 1.5; }
      .ih-copybtn { width: 100%; margin-top: 8px; padding: 8px 0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; background: #6366f1; color: white; border: 1px solid #6366f1; transition: all 0.12s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
      .ih-copybtn:hover { background: #4f46e5; }

      /* ─── BULK ACTION BAR ─── */
      .ih-bulkbar { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); background: #111119; border: 1px solid #252533; border-radius: 12px; box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15); padding: 8px 8px 8px 14px; display: flex; align-items: center; gap: 14px; z-index: 60; max-width: calc(100% - 32px); }
      .ih-bulkbar-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8888a4; padding-right: 10px; border-right: 1px solid #1a1a25; }
      .ih-bulkbar-info strong { color: #dddde8; font-weight: 700; font-family: 'Space Mono', monospace; }
      .ih-bulkbar-actions { display: flex; align-items: center; gap: 4px; }
      .ih-bulk-btn { display: flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 7px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
      .ih-bulk-btn:hover { border-color: #35354a; color: #dddde8; }
      .ih-bulk-btn.primary { background: #6366f1; border-color: #6366f1; color: white; }
      .ih-bulk-btn.primary:hover { background: #4f46e5; border-color: #4f46e5; }

      /* ─── COMMAND PALETTE ─── */
      .ih-palette { position: fixed; top: 14vh; left: 50%; transform: translateX(-50%); width: 92%; max-width: 540px; background: #111119; border: 1px solid #252533; border-radius: 14px; box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2); overflow: hidden; z-index: 90; display: flex; flex-direction: column; max-height: 70vh; }
      .ih-palette-input { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #1a1a25; color: #505068; }
      .ih-palette-input input { flex: 1; background: none; border: none; color: #dddde8; font-size: 14px; outline: none; font-family: inherit; }
      .ih-kbd { display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 4px; background: #1a1a25; border: 1px solid #252533; color: #8888a4; font-size: 10px; font-family: 'Space Mono', monospace; min-height: 18px; }
      .ih-palette-results { flex: 1; overflow-y: auto; padding: 6px 0; }
      .ih-palette-section { padding: 4px 0; }
      .ih-palette-h { padding: 6px 16px 4px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-palette-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px 16px; background: none; border: none; color: #dddde8; cursor: pointer; font-size: 13px; font-family: inherit; text-align: left; transition: background 0.1s; }
      .ih-palette-item:hover { background: rgba(99,102,241,0.1); }
      .ih-palette-item span { flex: 1; }
      .ih-palette-meta { font-size: 10px !important; color: #505068; font-family: 'Space Mono', monospace; flex: 0 !important; }
      .ih-palette-empty { padding: 24px; text-align: center; color: #505068; font-size: 13px; }

      /* ─── CONTEXT MENU ─── */
      .ih-ctxmenu { position: fixed; background: #111119; border: 1px solid #252533; border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.6); padding: 4px; min-width: 180px; z-index: 100; display: flex; flex-direction: column; }
      .ih-ctxmenu-head { padding: 6px 10px 8px; font-size: 11px; color: #505068; font-family: 'Space Mono', monospace; border-bottom: 1px solid #1a1a25; margin-bottom: 4px; }
      .ih-ctxmenu button { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: none; border: none; color: #dddde8; font-size: 12px; cursor: pointer; font-family: inherit; text-align: left; border-radius: 5px; transition: background 0.1s; }
      .ih-ctxmenu button:hover { background: rgba(99,102,241,0.15); color: #a5b4fc; }
      .ih-ctxmenu-divider { height: 1px; background: #1a1a25; margin: 4px 6px; }

      /* ─── SHORTCUTS HELP ─── */
      .ih-shortcuts { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 92%; max-width: 480px; background: #111119; border: 1px solid #252533; border-radius: 14px; z-index: 90; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
      .ih-shortcuts-head { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #1a1a25; font-weight: 600; font-size: 14px; }
      .ih-shortcuts-head span { flex: 1; }
      .ih-shortcuts-body { padding: 16px; max-height: 60vh; overflow-y: auto; }
      .ih-shortcut-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; gap: 16px; }
      .ih-shortcut-row + .ih-shortcut-row { border-top: 1px solid rgba(26,26,37,0.5); }
      .ih-shortcut-keys { display: flex; gap: 4px; }
      .ih-shortcut-desc { font-size: 13px; color: #8888a4; }

      /* ─── TOASTS ─── */
      .ih-toasts { position: fixed; top: 70px; right: 16px; z-index: 200; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
      .ih-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #111119; border: 1px solid #252533; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); font-size: 12px; color: #dddde8; min-width: 180px; max-width: 280px; animation: ih-toast-in 0.18s ease-out; }
      .ih-toast-success { border-color: rgba(34,197,94,0.3); color: #86efac; }
      .ih-toast-error { border-color: rgba(239,68,68,0.3); color: #fca5a5; }
      .ih-toast-info { border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
      @keyframes ih-toast-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    `}</style>
  );
}
