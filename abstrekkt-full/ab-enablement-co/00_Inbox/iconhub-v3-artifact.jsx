import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Search, X, Menu, Star, Download, Copy, Check, Grid3x3, Keyboard,
  Command, ChevronRight, Pin, Code2, FileImage, FileCode, Layers, Zap,
  Heart, Sparkles, ExternalLink, Palette, Wand2, Package, RotateCw,
  FlipHorizontal2, FlipVertical2, Pipette, RotateCcw, Square, Sun
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// ICON DATA — real SVG icons from Lucide, Tabler, Heroicons, Bootstrap
// ═══════════════════════════════════════════════════════════════
const RAW = [{"id":"lucide-a-arrow-down","n":"A Arrow Down","l":"lucide","t":["letter","text"],"s":"outline","c":'<path d="m14 12 4 4 4-4"/><path d="M18 16V7"/><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16"/><path d="M3.304 13h6.392"/>',"v":"0 0 24 24","w":2},{"id":"lucide-accessibility","n":"Accessibility","l":"lucide","t":["disability","disabled"],"s":"outline","c":'<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',"v":"0 0 24 24","w":2},{"id":"lucide-activity","n":"Activity","l":"lucide","t":["pulse","motion"],"s":"outline","c":'<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',"v":"0 0 24 24","w":2},{"id":"lucide-airplay","n":"Airplay","l":"lucide","t":["stream","cast"],"s":"outline","c":'<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="m12 15 5 6H7Z"/>',"v":"0 0 24 24","w":2},{"id":"lucide-alarm-clock","n":"Alarm Clock","l":"lucide","t":["morning","time"],"s":"outline","c":'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>',"v":"0 0 24 24","w":2},{"id":"lucide-album","n":"Album","l":"lucide","t":["photo","book"],"s":"outline","c":'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><polyline points="11 3 11 11 14 8 17 11 17 3"/>',"v":"0 0 24 24","w":2},{"id":"lucide-ambulance","n":"Ambulance","l":"lucide","t":["emergency","medical"],"s":"outline","c":'<path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',"v":"0 0 24 24","w":2},{"id":"lucide-ampersand","n":"Ampersand","l":"lucide","t":["and","typography"],"s":"outline","c":'<path d="M16 12h3"/><path d="M17.5 12a8 8 0 0 1-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13"/>',"v":"0 0 24 24","w":2},{"id":"lucide-anchor","n":"Anchor","l":"lucide","t":["ship","sea","boat"],"s":"outline","c":'<path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/>',"v":"0 0 24 24","w":2},{"id":"lucide-aperture","n":"Aperture","l":"lucide","t":["camera","lens","photo"],"s":"outline","c":'<circle cx="12" cy="12" r="10"/><path d="m14.31 8 5.74 9.94"/><path d="M9.69 8h11.48"/><path d="m7.38 12 5.74-9.94"/><path d="M9.69 16 3.95 6.06"/><path d="M14.31 16H2.83"/><path d="m16.62 12-5.74 9.94"/>',"v":"0 0 24 24","w":2},{"id":"lucide-award","n":"Award","l":"lucide","t":["medal","prize","winner"],"s":"outline","c":'<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',"v":"0 0 24 24","w":2},{"id":"lucide-bell","n":"Bell","l":"lucide","t":["notification","alert"],"s":"outline","c":'<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',"v":"0 0 24 24","w":2},{"id":"lucide-bookmark","n":"Bookmark","l":"lucide","t":["save","favorite"],"s":"outline","c":'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',"v":"0 0 24 24","w":2},{"id":"lucide-camera","n":"Camera","l":"lucide","t":["photo","picture"],"s":"outline","c":'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',"v":"0 0 24 24","w":2},{"id":"lucide-heart","n":"Heart","l":"lucide","t":["love","like"],"s":"outline","c":'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',"v":"0 0 24 24","w":2},{"id":"lucide-star","n":"Star","l":"lucide","t":["favorite","rating"],"s":"outline","c":'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',"v":"0 0 24 24","w":2},{"id":"lucide-zap","n":"Zap","l":"lucide","t":["lightning","power","energy"],"s":"outline","c":'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',"v":"0 0 24 24","w":2},{"id":"tabler-abacus","n":"Abacus","l":"tabler","t":["math","counting"],"s":"outline","c":'<path d="M5 3v18"/><path d="M19 21v-18"/><path d="M5 7h14"/><path d="M5 15h14"/><path d="M8 13v4"/><path d="M11 13v4"/><path d="M16 13v4"/><path d="M14 5v4"/><path d="M11 5v4"/><path d="M8 5v4"/><path d="M3 21h18"/>',"v":"0 0 24 24","w":2},{"id":"tabler-activity","n":"Activity","l":"tabler","t":["pulse","motion"],"s":"outline","c":'<path d="M3 12h4l3 8l4 -16l3 8h4"/>',"v":"0 0 24 24","w":2},{"id":"tabler-ad","n":"Ad","l":"tabler","t":["advert","marketing"],"s":"outline","c":'<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M7 15v-4a2 2 0 0 1 4 0v4"/><path d="M7 13l4 0"/><path d="M17 9v6h-1.5a1.5 1.5 0 1 1 1.5 -1.5"/>',"v":"0 0 24 24","w":2},{"id":"tabler-address-book","n":"Address Book","l":"tabler","t":["contact","contacts"],"s":"outline","c":'<path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2"/><path d="M10 16h6"/><path d="M11 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 8h3"/><path d="M4 12h3"/><path d="M4 16h3"/>',"v":"0 0 24 24","w":2},{"id":"tabler-adjustments","n":"Adjustments","l":"tabler","t":["sliders","controls"],"s":"outline","c":'<path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 6l8 0"/><path d="M16 6l4 0"/><path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 12l2 0"/><path d="M10 12l10 0"/><path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 18l11 0"/><path d="M19 18l1 0"/>',"v":"0 0 24 24","w":2},{"id":"tabler-bolt","n":"Bolt","l":"tabler","t":["lightning","energy"],"s":"outline","c":'<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/>',"v":"0 0 24 24","w":2},{"id":"tabler-bulb","n":"Bulb","l":"tabler","t":["idea","light"],"s":"outline","c":'<path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"/><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"/><path d="M9.7 17l4.6 0"/>',"v":"0 0 24 24","w":2},{"id":"tabler-rocket","n":"Rocket","l":"tabler","t":["launch","space"],"s":"outline","c":'<path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3"/><path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3"/><path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>',"v":"0 0 24 24","w":2},{"id":"hero-academic-cap","n":"Academic Cap","l":"heroicons","t":["education","graduation"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-archive-box","n":"Archive Box","l":"heroicons","t":["archive","storage"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-down-tray","n":"Download","l":"heroicons","t":["download","save"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-arrow-path","n":"Refresh","l":"heroicons","t":["refresh","reload","sync"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-bell-alert","n":"Bell Alert","l":"heroicons","t":["notification","alert"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-bolt","n":"Bolt","l":"heroicons","t":["lightning","power"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-cog","n":"Cog","l":"heroicons","t":["settings","gear"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>',"v":"0 0 24 24","w":1.5},{"id":"hero-fire","n":"Fire","l":"heroicons","t":["flame","hot"],"s":"outline","c":'<path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>',"v":"0 0 24 24","w":1.5},{"id":"bs-0-circle-fill","n":"0 Circle Fill","l":"bootstrap","t":["zero","filled"],"s":"solid","c":'<path d="M8 4.951c-1.008 0-1.629 1.09-1.629 2.895v.31c0 1.81.627 2.895 1.629 2.895s1.623-1.09 1.623-2.895v-.31c0-1.8-.621-2.895-1.623-2.895"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-8.012 4.158c1.858 0 2.96-1.582 2.96-3.99V7.84c0-2.426-1.079-3.996-2.936-3.996-1.864 0-2.965 1.588-2.965 3.996v.328c0 2.42 1.09 3.99 2.941 3.99"/>',"v":"0 0 16 16"},{"id":"bs-heart-fill","n":"Heart Fill","l":"bootstrap","t":["love","like","filled"],"s":"solid","c":'<path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>',"v":"0 0 16 16"},{"id":"bs-star-fill","n":"Star Fill","l":"bootstrap","t":["favorite","rating","filled"],"s":"solid","c":'<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>',"v":"0 0 16 16"},{"id":"bs-lightning-fill","n":"Lightning Fill","l":"bootstrap","t":["bolt","power","filled"],"s":"solid","c":'<path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z"/>',"v":"0 0 16 16"},{"id":"bs-bell-fill","n":"Bell Fill","l":"bootstrap","t":["notification","filled"],"s":"solid","c":'<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>',"v":"0 0 16 16"},{"id":"feather-activity","n":"Activity","l":"feather","t":["pulse","health","action","motion"],"s":"outline","c":"<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/>","v":"0 0 24 24","w":2},{"id":"feather-alert-circle","n":"Alert Circle","l":"feather","t":["warning","alert","danger"],"s":"outline","c":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/>","v":"0 0 24 24","w":2},{"id":"feather-anchor","n":"Anchor","l":"feather","t":[],"s":"outline","c":"<circle cx=\"12\" cy=\"5\" r=\"3\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"8\"/><path d=\"M5 12H2a10 10 0 0 0 20 0h-3\"/>","v":"0 0 24 24","w":2},{"id":"feather-award","n":"Award","l":"feather","t":["achievement","badge"],"s":"outline","c":"<circle cx=\"12\" cy=\"8\" r=\"7\"/><polyline points=\"8.21 13.89 7 23 12 20 17 23 15.79 13.88\"/>","v":"0 0 24 24","w":2},{"id":"feather-bell","n":"Bell","l":"feather","t":["alarm","notification","sound"],"s":"outline","c":"<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/>","v":"0 0 24 24","w":2},{"id":"feather-bookmark","n":"Bookmark","l":"feather","t":["read","clip","marker","tag"],"s":"outline","c":"<path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/>","v":"0 0 24 24","w":2},{"id":"feather-camera","n":"Camera","l":"feather","t":["photo"],"s":"outline","c":"<path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"/><circle cx=\"12\" cy=\"13\" r=\"4\"/>","v":"0 0 24 24","w":2},{"id":"feather-clock","n":"Clock","l":"feather","t":["time","watch","alarm"],"s":"outline","c":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>","v":"0 0 24 24","w":2},{"id":"feather-code","n":"Code","l":"feather","t":["source","programming"],"s":"outline","c":"<polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/>","v":"0 0 24 24","w":2},{"id":"feather-coffee","n":"Coffee","l":"feather","t":["drink","cup","mug","tea","cafe","hot","beverage"],"s":"outline","c":"<path d=\"M18 8h1a4 4 0 0 1 0 8h-1\"/><path d=\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\"/><line x1=\"6\" y1=\"1\" x2=\"6\" y2=\"4\"/><line x1=\"10\" y1=\"1\" x2=\"10\" y2=\"4\"/><line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"4\"/>","v":"0 0 24 24","w":2},{"id":"feather-command","n":"Command","l":"feather","t":["keyboard","cmd","terminal","prompt"],"s":"outline","c":"<path d=\"M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z\"/>","v":"0 0 24 24","w":2},{"id":"feather-compass","n":"Compass","l":"feather","t":["navigation","safari","travel","direction"],"s":"outline","c":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"/>","v":"0 0 24 24","w":2},{"id":"phosphor-alarm","n":"Alarm","l":"phosphor","t":["alarm"],"s":"solid","c":"<path d=\"M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM61.66,37.66l-32,32A8,8,0,0,1,18.34,58.34l32-32A8,8,0,0,1,61.66,37.66Zm176,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,69.66ZM184,128a8,8,0,0,1,0,16H128a8,8,0,0,1-8-8V80a8,8,0,0,1,16,0v48Z\"/>","v":"0 0 256 256"},{"id":"phosphor-aperture","n":"Aperture","l":"phosphor","t":["aperture"],"s":"solid","c":"<path d=\"M201.54,54.46A104,104,0,0,0,54.46,201.54,104,104,0,0,0,201.54,54.46ZM190.23,65.78a88.18,88.18,0,0,1,11,13.48L167.55,119,139.63,40.78A87.34,87.34,0,0,1,190.23,65.78ZM155.59,133l-18.16,21.37-27.59-5L100.41,123l18.16-21.37,27.59,5ZM65.77,65.78a87.34,87.34,0,0,1,56.66-25.59l17.51,49L58.3,74.32A88,88,0,0,1,65.77,65.78ZM46.65,161.54a88.41,88.41,0,0,1,2.53-72.62l51.21,9.35Zm19.12,28.68a88.18,88.18,0,0,1-11-13.48L88.45,137l27.92,78.18A87.34,87.34,0,0,1,65.77,190.22Zm124.46,0a87.34,87.34,0,0,1-56.66,25.59l-17.51-49,81.64,14.91A88,88,0,0,1,190.23,190.22Zm-34.62-32.49,53.74-63.27a88.41,88.41,0,0,1-2.53,72.62Z\"/>","v":"0 0 256 256"},{"id":"phosphor-atom","n":"Atom","l":"phosphor","t":["atom"],"s":"solid","c":"<path d=\"M196.12,128c24.65-34.61,37.22-70.38,19.74-87.86S162.61,35.23,128,59.88C93.39,35.23,57.62,22.66,40.14,40.14S35.23,93.39,59.88,128c-24.65,34.61-37.22,70.38-19.74,87.86h0c5.63,5.63,13.15,8.14,21.91,8.14,18.48,0,42.48-11.17,66-27.88C151.47,212.83,175.47,224,194,224c8.76,0,16.29-2.52,21.91-8.14h0C233.34,198.38,220.77,162.61,196.12,128Zm8.43-76.55c7.64,7.64,2.48,32.4-18.52,63.28a300.33,300.33,0,0,0-21.19-23.57A300.33,300.33,0,0,0,141.27,70C172.15,49,196.91,43.8,204.55,51.45ZM176.29,128a289.14,289.14,0,0,1-22.76,25.53A289.14,289.14,0,0,1,128,176.29a289.14,289.14,0,0,1-25.53-22.76A289.14,289.14,0,0,1,79.71,128,298.62,298.62,0,0,1,128,79.71a289.14,289.14,0,0,1,25.53,22.76A289.14,289.14,0,0,1,176.29,128ZM51.45,51.45c2.2-2.21,5.83-3.35,10.62-3.35C73.89,48.1,92.76,55,114.72,70A304,304,0,0,0,91.16,91.16,300.33,300.33,0,0,0,70,114.73C49,83.85,43.81,59.09,51.45,51.45Zm0,153.1C43.81,196.91,49,172.15,70,141.27a300.33,300.33,0,0,0,21.19,23.57A304.18,304.18,0,0,0,114.73,186C83.85,207,59.09,212.2,51.45,204.55Zm153.1,0c-7.64,7.65-32.4,2.48-63.28-18.52a304.18,304.18,0,0,0,23.57-21.19A300.33,300.33,0,0,0,186,141.27C207,172.15,212.19,196.91,204.55,204.55ZM140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z\"/>","v":"0 0 256 256"},{"id":"phosphor-battery-charging","n":"Battery Charging","l":"phosphor","t":["battery","charging"],"s":"solid","c":"<path d=\"M200,56H32A24,24,0,0,0,8,80v96a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V80A24,24,0,0,0,200,56Zm8,120a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Zm48-80v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM138.81,123.79a8,8,0,0,1,.35,7.79l-16,32a8,8,0,0,1-14.32-7.16L119.06,136H100a8,8,0,0,1-7.16-11.58l16-32a8,8,0,1,1,14.32,7.16L112.94,120H132A8,8,0,0,1,138.81,123.79Z\"/>","v":"0 0 256 256"},{"id":"phosphor-binoculars","n":"Binoculars","l":"phosphor","t":["binoculars"],"s":"solid","c":"<path d=\"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z\"/>","v":"0 0 256 256"},{"id":"phosphor-brain","n":"Brain","l":"phosphor","t":["brain"],"s":"solid","c":"<path d=\"M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.41A56.09,56.09,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.67,86.27,8,8,0,0,0,56,78.73V72a32,32,0,0,1,64,0v68.26A47.8,47.8,0,0,0,88,128a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,1,1,168,144a8,8,0,0,0,0-16,47.8,47.8,0,0,0-32,12.26V72a32,32,0,0,1,64,0v6.73a8,8,0,0,0,5.33,7.54A40,40,0,0,1,192,164Zm16-52a8,8,0,0,1-8,8h-4a36,36,0,0,1-36-36V80a8,8,0,0,1,16,0v4a20,20,0,0,0,20,20h4A8,8,0,0,1,208,112ZM60,120H56a8,8,0,0,1,0-16h4A20,20,0,0,0,80,84V80a8,8,0,0,1,16,0v4A36,36,0,0,1,60,120Z\"/>","v":"0 0 256 256"},{"id":"phosphor-bug","n":"Bug","l":"phosphor","t":["bug"],"s":"solid","c":"<path d=\"M144,92a12,12,0,1,1,12,12A12,12,0,0,1,144,92ZM100,80a12,12,0,1,0,12,12A12,12,0,0,0,100,80Zm116,64A87.76,87.76,0,0,1,213,167l22.24,9.72A8,8,0,0,1,232,192a7.89,7.89,0,0,1-3.2-.67L207.38,182a88,88,0,0,1-158.76,0L27.2,191.33A7.89,7.89,0,0,1,24,192a8,8,0,0,1-3.2-15.33L43,167A87.76,87.76,0,0,1,40,144v-8H16a8,8,0,0,1,0-16H40v-8a87.76,87.76,0,0,1,3-23L20.8,79.33a8,8,0,1,1,6.4-14.66L48.62,74a88,88,0,0,1,158.76,0l21.42-9.36a8,8,0,0,1,6.4,14.66L213,89.05a87.76,87.76,0,0,1,3,23v8h24a8,8,0,0,1,0,16H216ZM56,120H200v-8a72,72,0,0,0-144,0Zm64,95.54V136H56v8A72.08,72.08,0,0,0,120,215.54ZM200,144v-8H136v79.54A72.08,72.08,0,0,0,200,144Z\"/>","v":"0 0 256 256"},{"id":"phosphor-chart-bar","n":"Chart Bar","l":"phosphor","t":["chart","bar"],"s":"solid","c":"<path d=\"M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z\"/>","v":"0 0 256 256"},{"id":"phosphor-cube","n":"Cube","l":"phosphor","t":["cube"],"s":"solid","c":"<path d=\"M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z\"/>","v":"0 0 256 256"},{"id":"phosphor-database","n":"Database","l":"phosphor","t":["database"],"s":"solid","c":"<path d=\"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z\"/>","v":"0 0 256 256"},{"id":"phosphor-flask","n":"Flask","l":"phosphor","t":["flask"],"s":"solid","c":"<path d=\"M221.69,199.77,160,96.92V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V96.92L34.31,199.77A16,16,0,0,0,48,224H208a16,16,0,0,0,13.72-24.23ZM110.86,103.25A7.93,7.93,0,0,0,112,99.14V40h32V99.14a7.93,7.93,0,0,0,1.14,4.11L183.36,167c-12,2.37-29.07,1.37-51.75-10.11-15.91-8.05-31.05-12.32-45.22-12.81ZM48,208l28.54-47.58c14.25-1.74,30.31,1.85,47.82,10.72,19,9.61,35,12.88,48,12.88a69.89,69.89,0,0,0,19.55-2.7L208,208Z\"/>","v":"0 0 256 256"},{"id":"phosphor-gear","n":"Gear","l":"phosphor","t":["gear"],"s":"solid","c":"<path d=\"M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z\"/>","v":"0 0 256 256"}];

const ICONS = RAW.map((i) => ({ ...i, searchText: `${i.n} ${i.t.join(" ")} ${i.l}`.toLowerCase() }));
const LIBRARIES = [...new Set(ICONS.map((i) => i.l))];
const STYLES = [...new Set(ICONS.map((i) => i.s))];
const PRESETS = ["#ffffff","#94a3b8","#6366f1","#8b5cf6","#ec4899","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#000000"];
const FRAMEWORKS = ["SVG", "React", "Vue", "Svelte", "Web Component", "React Native", "Data URL"];

const DEFAULT_FX = {
  rotate: 0, flipH: false, flipV: false, opacity: 1,
  bg: null, bgRadius: 4,
  shadow: false, shadowColor: "#000000", shadowBlur: 1, shadowDx: 0, shadowDy: 1.5,
  glow: false, glowColor: "#6366f1", glowBlur: 1.5,
};

const SHORTCUTS = [
  { keys: ["/"], desc: "Focus search" },
  { keys: ["⌘", "K"], desc: "Command palette" },
  { keys: ["Esc"], desc: "Close / clear" },
  { keys: ["F"], desc: "Favorite icon" },
  { keys: ["C"], desc: "Copy SVG" },
  { keys: ["D"], desc: "Download SVG" },
  { keys: ["M"], desc: "Multi-select" },
  { keys: ["Shift", "Click"], desc: "Add to selection" },
];

const isStrokeIcon = (icon) => icon.s === "outline" || !!icon.w;

// ═══════════════════════════════════════════════════════════════
// COLOR UTILITIES (HSV ↔ RGB ↔ hex) — no external lib
// ═══════════════════════════════════════════════════════════════
function hexToRgb(hex) {
  if (typeof hex !== "string") return [255, 255, 255];
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [255, 255, 255];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("");
}
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}
function hsvToRgb(h, s, v) {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// ═══════════════════════════════════════════════════════════════
// SVG + EFFECTS COMPOSITION (single source of truth)
// ═══════════════════════════════════════════════════════════════
function composeSvgParts(icon, color, strokeW, fx) {
  const stroke = isStrokeIcon(icon);
  const [minX, minY, vbW, vbH] = icon.v.split(/\s+/).map(Number);
  const cx = minX + vbW / 2, cy = minY + vbH / 2;

  const transforms = [];
  if (fx.flipH || fx.flipV) {
    transforms.push(`translate(${cx} ${cy}) scale(${fx.flipH ? -1 : 1} ${fx.flipV ? -1 : 1}) translate(${-cx} ${-cy})`);
  }
  if (fx.rotate) transforms.push(`rotate(${fx.rotate} ${cx} ${cy})`);
  const tAttr = transforms.length ? ` transform="${transforms.join(" ")}"` : "";

  let defs = "", openWrap = "", closeWrap = "";
  if (fx.glow) {
    defs += `<filter id="ihGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${fx.glowBlur}" result="b"/><feFlood flood-color="${fx.glowColor}" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    openWrap += `<g filter="url(#ihGlow)">`; closeWrap = `</g>` + closeWrap;
  }
  if (fx.shadow) {
    defs += `<filter id="ihShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="${fx.shadowDx}" dy="${fx.shadowDy}" stdDeviation="${fx.shadowBlur}" flood-color="${fx.shadowColor}" flood-opacity="0.5"/></filter>`;
    openWrap += `<g filter="url(#ihShadow)">`; closeWrap = `</g>` + closeWrap;
  }

  const bgRect = fx.bg ? `<rect x="${minX}" y="${minY}" width="${vbW}" height="${vbH}" rx="${fx.bgRadius}" fill="${fx.bg}"/>` : "";
  const iconGroup = `<g${tAttr} fill="${stroke ? "none" : color}" stroke="${stroke ? color : "none"}" stroke-width="${stroke ? strokeW : 0}" stroke-linecap="round" stroke-linejoin="round">${icon.c}</g>`;

  return {
    defs: defs ? `<defs>${defs}</defs>` : "",
    body: `${bgRect}${openWrap}${iconGroup}${closeWrap}`,
    rootOpacity: fx.opacity < 1 ? ` opacity="${fx.opacity}"` : "",
    viewBox: icon.v,
  };
}

function buildSvg(icon, color, strokeW, size, fx) {
  const { defs, body, rootOpacity, viewBox } = composeSvgParts(icon, color, strokeW, fx);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}"${rootOpacity}>${defs}${body}</svg>`;
}
function buildDataUrl(icon, color, strokeW, size, fx) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(buildSvg(icon, color, strokeW, size, fx))}`;
}

// ── Framework component builders ──────────────────────────────
function compName(icon) {
  const n = icon.n.replace(/[^a-zA-Z0-9]/g, "");
  return /^[0-9]/.test(n) ? "Icon" + n : n || "Icon";
}
function svgToJsx(svg) {
  return svg.replace(/\s([a-zA-Z-]+)=/g, (_, attr) =>
    " " + attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + "="
  );
}
// ── React Native SVG — proper parser ─────────────────────────
const RN_TAG = {
  path:"Path", circle:"Circle", ellipse:"Ellipse", rect:"Rect",
  line:"Line", polyline:"Polyline", polygon:"Polygon", g:"G",
  text:"Text", defs:"Defs",
};
// Attributes whose values must be numbers in RN (not "string" attrs)
const RN_NUM = new Set([
  "cx","cy","r","rx","ry","x","y","x1","y1","x2","y2",
  "width","height","dx","dy","opacity","stopOpacity",
  "strokeOpacity","fillOpacity","stdDeviation","offset",
]);
// Self-closing SVG leaf elements
const RN_VOID = new Set(["path","circle","ellipse","line","polyline","polygon","rect","stop","use"]);

function parseInnerToRN(markup) {
  const used = new Set();
  const lines = [];
  let depth = 0;
  // <[/]tagName [attrs] [/]>
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?(\/?)>/g;
  let m;
  while ((m = re.exec(markup)) !== null) {
    const [, closeSlash, tag, attrRaw = "", selfSlash] = m;
    const rnTag = RN_TAG[tag];
    if (!rnTag) continue;
    if (closeSlash) {
      depth = Math.max(0, depth - 1);
      lines.push(`${"  ".repeat(depth)}</${rnTag}>`);
      continue;
    }
    used.add(rnTag);
    // Parse attribute pairs: name="value"
    const attrs = [];
    const aRe = /([a-zA-Z][a-zA-Z0-9:-]*)="([^"]*)"/g;
    let a;
    while ((a = aRe.exec(attrRaw)) !== null) {
      const [, rawName, rawVal] = a;
      const cc = rawName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (cc === "filter") continue; // SVG filters unsupported in RN
      // Numeric attrs → {number}, everything else → "string"
      const jsxV = RN_NUM.has(cc) && rawVal !== "" && !isNaN(+rawVal)
        ? `{${+rawVal}}`
        : `"${rawVal}"`;
      attrs.push(`${cc}=${jsxV}`);
    }
    const attrStr = attrs.length ? " " + attrs.join(" ") : "";
    const isSelf = selfSlash === "/" || RN_VOID.has(tag);
    const pad = "  ".repeat(depth);
    if (isSelf) {
      lines.push(`${pad}<${rnTag}${attrStr} />`);
    } else {
      lines.push(`${pad}<${rnTag}${attrStr}>`);
      depth++;
    }
  }
  return { jsx: lines.join("\n"), used: [...used] };
}

function buildRNCode(icon, color, strokeW, size, fx) {
  const name = compName(icon);
  const stroke = isStrokeIcon(icon);
  const [minX, minY, vbW, vbH] = icon.v.split(/\s+/).map(Number);
  const icx = minX + vbW / 2, icy = minY + vbH / 2;

  // Compose transforms (filters stripped)
  const txs = [];
  if (fx.flipH || fx.flipV)
    txs.push(`translate(${icx}, ${icy}) scale(${fx.flipH ? -1 : 1}, ${fx.flipV ? -1 : 1}) translate(${-icx}, ${-icy})`);
  if (fx.rotate) txs.push(`rotate(${fx.rotate})`);

  // Parse raw inner elements (no outer <g>, no filters)
  const { jsx: inner, used } = parseInnerToRN(icon.c);

  const importSet = new Set(["G", ...used]);

  // Optional background rect
  let bgLine = "";
  if (fx.bg) {
    importSet.add("Rect");
    bgLine = `    <Rect x={${minX}} y={${minY}} width={${vbW}} height={${vbH}} rx={${fx.bgRadius}} fill="${fx.bg}" />\n`;
  }

  // Outer <G> carries fill/stroke inheritance + optional transform
  // This replaces the <g> that composeSvgParts generates
  const baseProps = stroke
    ? `stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"`
    : `fill={color}`;
  const txProp = txs.length ? ` transform="${txs.join(" ")}"` : "";

  const innerIndented = inner.split("\n").map((l) => "      " + l).join("\n");
  const opProp = fx.opacity < 1 ? ` opacity={${fx.opacity}}` : "";
  const note = fx.glow || fx.shadow
    ? "// Note: glow/shadow SVG filters are not supported by react-native-svg\n"
    : "";

  const swParam = stroke ? `, strokeWidth = ${strokeW}` : "";
  const imps = [...importSet].sort().join(", ");

  return (
    `${note}import Svg, { ${imps} } from "react-native-svg";\n\n` +
    `const ${name} = ({ size = ${size}, color = "${color}"${swParam} }) => (\n` +
    `  <Svg width={size} height={size} viewBox="${icon.v}"${opProp}>\n` +
    `${bgLine}` +
    `    <G ${baseProps}${txProp}>\n` +
    `${innerIndented}\n` +
    `    </G>\n` +
    `  </Svg>\n` +
    `);\n\nexport default ${name};`
  );
}

function buildComponent(framework, icon, color, strokeW, size, fx) {
  const name = compName(icon);
  const full = buildSvg(icon, color, strokeW, size, fx);

  if (framework === "SVG") return full;
  if (framework === "Data URL") return buildDataUrl(icon, color, strokeW, size, fx);

  if (framework === "React") {
    const jsx = svgToJsx(full.replace(`width="${size}" height="${size}"`, "width={size} height={size}"))
      .replace("<svg", "<svg {...props}");
    return `const ${name} = ({ size = ${size}, ...props }) => (\n  ${jsx}\n);\n\nexport default ${name};`;
  }
  if (framework === "Vue") {
    const tpl = full.replace(`width="${size}" height="${size}"`, ':width="size" :height="size"');
    return `<template>\n  ${tpl}\n</template>\n\n<script setup>\ndefineProps({ size: { type: [Number, String], default: ${size} } })\n</script>`;
  }
  if (framework === "Svelte") {
    const tpl = full.replace(`width="${size}" height="${size}"`, "width={size} height={size}");
    return `<script>\n  export let size = ${size};\n</script>\n\n${tpl}`;
  }
  if (framework === "Web Component") {
    const tag = "icon-" + name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/^icon-?/, "");
    return `class ${name}Icon extends HTMLElement {\n  connectedCallback() {\n    this.attachShadow({ mode: "open" }).innerHTML = \`\n      ${full}\n    \`;\n  }\n}\ncustomElements.define("${tag}", ${name}Icon);\n\n// <${tag}></${tag}>`;
  }
  if (framework === "React Native") return buildRNCode(icon, color, strokeW, size, fx);
  return full;
}

// ── Sprite for bulk export ────────────────────────────────────
function buildSprite(icons) {
  const symbols = icons.map((i) => `<symbol id="${i.id}" viewBox="${i.v}">${i.c}</symbol>`).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n  ${symbols}\n</svg>\n\n<!-- Use: <svg width="24" height="24"><use href="#${icons[0]?.id || "id"}" /></svg> -->`;
}

// ── File / clipboard helpers ──────────────────────────────────
function downloadFile(content, filename, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
function downloadPngFromSvg(svg, filename, size) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = size * 2; c.height = size * 2;
    c.getContext("2d").drawImage(img, 0, 0, size * 2, size * 2);
    c.toBlob((b) => {
      const pu = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = pu; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pu); URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.src = url;
}
async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

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
// SVG STRING RENDERER (renders effect-composed markup)
// ═══════════════════════════════════════════════════════════════
function SvgString({ markup, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function IconHub() {
  const [query, setQuery] = useState("");
  const [activeLibs, setActiveLibs] = useState([]);
  const [activeStyles, setActiveStyles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [color, setColor] = useState("#ffffff");
  const [strokeW, setStrokeW] = useState(2);
  const [iconSize, setIconSize] = useState(24);
  const [fx, setFx] = useState(DEFAULT_FX);

  const [sidebar, setSidebar] = useState(false);
  const [panelTab, setPanelTab] = useState("style");
  const [framework, setFramework] = useState("SVG");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const [multiMode, setMultiMode] = useState(false);
  const [selection, setSelection] = useState(() => new Set());
  const [ctxMenu, setCtxMenu] = useState(null);

  const searchRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 980px)");
  const isMobileSidebar = useMediaQuery("(max-width: 767px)");
  const { toasts, push: pushToast } = useToast();

  const updateFx = useCallback((patch) => setFx((f) => ({ ...f, ...patch })), []);

  const filtered = useMemo(() => {
    let r = ICONS;
    if (favoritesOnly) r = r.filter((i) => favorites.has(i.id));
    if (activeLibs.length) r = r.filter((i) => activeLibs.includes(i.l));
    if (activeStyles.length) r = r.filter((i) => activeStyles.includes(i.s));
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter((i) => i.searchText.includes(q)); }
    return r;
  }, [query, activeLibs, activeStyles, favoritesOnly, favorites]);

  const sel = useMemo(() => (selectedId ? ICONS.find((i) => i.id === selectedId) : null), [selectedId]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); pushToast("Removed from favorites"); }
      else { next.add(id); pushToast("Added to favorites", "success"); }
      return next;
    });
  }, [pushToast]);

  const toggleSelection = useCallback((id) => {
    setSelection((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const handleIconClick = useCallback((icon, e) => {
    if (multiMode || e?.shiftKey) toggleSelection(icon.id);
    else setSelectedId(icon.id);
  }, [multiMode, toggleSelection]);

  const copyAction = useCallback(async (text, label = "Copied") => {
    const ok = await copyToClipboard(text);
    pushToast(ok ? `${label} to clipboard` : "Copy failed", ok ? "success" : "error");
  }, [pushToast]);

  const selectedIcons = useMemo(() => ICONS.filter((i) => selection.has(i.id)), [selection]);

  const bulkDownloadSvgs = useCallback(() => {
    selectedIcons.forEach((icon, i) => {
      setTimeout(() => downloadFile(buildSvg(icon, color, strokeW, iconSize, fx), `${icon.id}.svg`, "image/svg+xml"), i * 100);
    });
    pushToast(`Downloading ${selectedIcons.length} SVGs…`, "success");
  }, [selectedIcons, color, strokeW, iconSize, fx, pushToast]);

  const bulkExportSprite = useCallback(() => {
    if (!selectedIcons.length) return;
    downloadFile(buildSprite(selectedIcons), "icon-sprite.svg", "image/svg+xml");
    pushToast(`Exported sprite (${selectedIcons.length} icons)`, "success");
  }, [selectedIcons, pushToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const inInput = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
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
      if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); }
      if (e.key === "?" && e.shiftKey) setShortcutsOpen((s) => !s);
      if (e.key.toLowerCase() === "m") setMultiMode((m) => !m);
      if (sel) {
        if (e.key.toLowerCase() === "f") toggleFavorite(sel.id);
        if (e.key.toLowerCase() === "c") copyAction(buildSvg(sel, color, strokeW, iconSize, fx), "SVG copied");
        if (e.key.toLowerCase() === "d") {
          downloadFile(buildSvg(sel, color, strokeW, iconSize, fx), `${sel.id}.svg`, "image/svg+xml");
          pushToast("SVG downloaded", "success");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sel, selectedId, selection, sidebar, paletteOpen, shortcutsOpen, ctxMenu, color, strokeW, iconSize, fx, toggleFavorite, copyAction, pushToast]);

  const handleContextMenu = useCallback((e, icon) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, icon }); }, []);
  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => { window.removeEventListener("click", close); window.removeEventListener("scroll", close, true); };
  }, [ctxMenu]);

  return (
    <div className="ih-root">
      <Styles />

      <header className="ih-header">
        <button className="ih-iconbtn" onClick={() => setSidebar((s) => !s)} aria-label="Toggle sidebar"><Menu size={18} /></button>
        <div className="ih-logo">
          <div className="ih-logomark"><Grid3x3 size={14} color="white" strokeWidth={2.5} /></div>
          <span className="ih-logotext">IconHub</span>
        </div>
        <div className="ih-search">
          <Search size={15} className="ih-search-icon" />
          <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search icons… (press /)" aria-label="Search icons" />
          {query && <button className="ih-search-clear" onClick={() => setQuery("")} aria-label="Clear"><X size={13} /></button>}
        </div>
        <div className="ih-header-actions">
          <button className={`ih-pill ${multiMode ? "active" : ""}`} onClick={() => setMultiMode((m) => !m)} title="Multi-select (M)">
            <Layers size={13} /><span className="ih-hide-sm">Multi</span>
            {selection.size > 0 && <span className="ih-pill-badge">{selection.size}</span>}
          </button>
          <button className={`ih-pill ${favoritesOnly ? "active" : ""}`} onClick={() => setFavoritesOnly((f) => !f)} title="Favorites" disabled={favorites.size === 0}>
            <Heart size={13} fill={favoritesOnly ? "currentColor" : "none"} />
            {favorites.size > 0 && <span className="ih-pill-badge">{favorites.size}</span>}
          </button>
          <button className="ih-iconbtn" onClick={() => setPaletteOpen(true)} title="Command palette (⌘K)"><Command size={15} /></button>
          <button className="ih-iconbtn" onClick={() => setShortcutsOpen(true)} title="Shortcuts (?)"><Keyboard size={15} /></button>
        </div>
      </header>

      <div className="ih-body">
        {(isDesktop && !isMobileSidebar) && (
          <SidebarPanel {...{ activeLibs, activeStyles, setActiveLibs, setActiveStyles }} />
        )}
        {sidebar && isMobileSidebar && (
          <>
            <div className="ih-overlay" onClick={() => setSidebar(false)} />
            <div className="ih-sidebar-mobile">
              <SidebarPanel {...{ activeLibs, activeStyles, setActiveLibs, setActiveStyles, onClose: () => setSidebar(false) }} />
            </div>
          </>
        )}

        <main className="ih-main">
          <div className="ih-resultbar">
            <span>
              <strong>{filtered.length}</strong>{filtered.length !== ICONS.length && <> of {ICONS.length}</>} icons
              {favoritesOnly && <span className="ih-resultbar-tag">favorites</span>}
              {activeLibs.length > 0 && <span className="ih-resultbar-tag">{activeLibs.length} lib</span>}
            </span>
            {(activeLibs.length || activeStyles.length || favoritesOnly || query) ? (
              <button className="ih-link" onClick={() => { setActiveLibs([]); setActiveStyles([]); setFavoritesOnly(false); setQuery(""); }}>Clear all</button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="ih-empty">
              <div className="ih-empty-iconbg"><Search size={24} color="#35354a" /></div>
              <p className="ih-empty-title">No icons found</p>
              <p className="ih-empty-sub">Try a different search or clear filters</p>
            </div>
          ) : (
            <div className="ih-grid">
              {filtered.map((icon) => (
                <IconCard key={icon.id} {...{ icon, color, strokeW }}
                  isSelected={selectedId === icon.id}
                  isInSelection={selection.has(icon.id)}
                  isFavorite={favorites.has(icon.id)}
                  multiMode={multiMode}
                  onClick={(e) => handleIconClick(icon, e)}
                  onContextMenu={(e) => handleContextMenu(e, icon)} />
              ))}
            </div>
          )}
        </main>

        {sel && (
          <DetailPanel {...{
            sel, color, setColor, strokeW, setStrokeW, iconSize, setIconSize, fx, updateFx, setFx,
            panelTab, setPanelTab, framework, setFramework, isDesktop,
            isFavorite: favorites.has(sel.id),
            onToggleFavorite: () => toggleFavorite(sel.id),
            onClose: () => setSelectedId(null),
            onCopy: copyAction, onToast: pushToast,
          }} />
        )}
      </div>

      {selection.size > 0 && (
        <div className="ih-bulkbar">
          <div className="ih-bulkbar-info"><Layers size={14} /><strong>{selection.size}</strong> selected</div>
          <div className="ih-bulkbar-actions">
            <button className="ih-bulk-btn" onClick={() => copyAction(buildSprite(selectedIcons), "Sprite copied")}><Copy size={13} /> Sprite</button>
            <button className="ih-bulk-btn" onClick={bulkExportSprite}><Download size={13} /> Sprite SVG</button>
            <button className="ih-bulk-btn primary" onClick={bulkDownloadSvgs}><Download size={13} /> All SVGs</button>
            <button className="ih-iconbtn" onClick={() => setSelection(new Set())} aria-label="Clear"><X size={14} /></button>
          </div>
        </div>
      )}

      {paletteOpen && (
        <CommandPalette
          icons={ICONS} libraries={LIBRARIES}
          onClose={() => setPaletteOpen(false)}
          onSelectIcon={(id) => { setSelectedId(id); setPaletteOpen(false); }}
          onToggleLib={(l) => { setActiveLibs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l])); setPaletteOpen(false); }}
          onAction={(a) => { a(); setPaletteOpen(false); }}
          actions={{
            "Toggle multi-select": () => setMultiMode((m) => !m),
            "Toggle favorites filter": () => setFavoritesOnly((f) => !f),
            "Reset all effects": () => setFx(DEFAULT_FX),
            "Clear all filters": () => { setActiveLibs([]); setActiveStyles([]); setFavoritesOnly(false); setQuery(""); },
            "Show keyboard shortcuts": () => setShortcutsOpen(true),
          }} />
      )}

      {shortcutsOpen && <ShortcutsHelp onClose={() => setShortcutsOpen(false)} />}

      {ctxMenu && (
        <ContextMenu ctx={ctxMenu} isFavorite={favorites.has(ctxMenu.icon.id)} inSelection={selection.has(ctxMenu.icon.id)}
          onCopySvg={() => copyAction(buildSvg(ctxMenu.icon, color, strokeW, iconSize, fx), "SVG copied")}
          onCopyReact={() => copyAction(buildComponent("React", ctxMenu.icon, color, strokeW, iconSize, fx), "React copied")}
          onCopyDataUrl={() => copyAction(buildDataUrl(ctxMenu.icon, color, strokeW, iconSize, fx), "Data URL copied")}
          onDownloadSvg={() => { downloadFile(buildSvg(ctxMenu.icon, color, strokeW, iconSize, fx), `${ctxMenu.icon.id}.svg`, "image/svg+xml"); pushToast("SVG downloaded", "success"); }}
          onDownloadPng={() => { downloadPngFromSvg(buildSvg(ctxMenu.icon, color, strokeW, iconSize, fx), `${ctxMenu.icon.id}.png`, iconSize); pushToast("PNG downloaded", "success"); }}
          onToggleFavorite={() => toggleFavorite(ctxMenu.icon.id)}
          onAddToSelection={() => { toggleSelection(ctxMenu.icon.id); pushToast(selection.has(ctxMenu.icon.id) ? "Removed" : "Added to selection"); }} />
      )}

      <div className="ih-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`ih-toast ih-toast-${t.type}`}>
            {t.type === "success" && <Check size={14} />}{t.type === "error" && <X size={14} />}{t.type === "info" && <Sparkles size={14} />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLOR WHEEL
// ═══════════════════════════════════════════════════════════════
function ColorWheel({ color, onChange }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const [h, s, v] = useMemo(() => rgbToHsv(...hexToRgb(color)), [color]);

  const handlePos = useMemo(() => {
    const rad = (h * Math.PI) / 180;
    const r = s * 50;
    return { left: `${50 + Math.cos(rad) * r}%`, top: `${50 + Math.sin(rad) * r}%` };
  }, [h, s]);

  const pick = useCallback((clientX, clientY) => {
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const dist = Math.min(1, Math.hypot(x, y) / (rect.width / 2));
    let angle = (Math.atan2(y, x) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    onChange(rgbToHex(...hsvToRgb(angle, dist, v)));
  }, [v, onChange]);

  useEffect(() => {
    const move = (e) => { if (!dragging.current) return; const t = e.touches?.[0]; pick(t ? t.clientX : e.clientX, t ? t.clientY : e.clientY); };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
  }, [pick]);

  const setValue = (nv) => onChange(rgbToHex(...hsvToRgb(h, s, nv)));

  return (
    <div className="ih-wheel-wrap">
      <div ref={ref} className="ih-wheel"
        onMouseDown={(e) => { dragging.current = true; pick(e.clientX, e.clientY); }}
        onTouchStart={(e) => { dragging.current = true; const t = e.touches[0]; pick(t.clientX, t.clientY); }}>
        <div className="ih-wheel-dark" style={{ opacity: 1 - v }} />
        <div className="ih-wheel-handle" style={{ ...handlePos, background: color }} />
      </div>
      <div className="ih-wheel-val">
        <Sun size={13} color="#505068" />
        <input type="range" min="0" max="100" value={Math.round(v * 100)} onChange={(e) => setValue(+e.target.value / 100)} aria-label="Brightness" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════════════════════════════
function DetailPanel({ sel, color, setColor, strokeW, setStrokeW, iconSize, setIconSize, fx, updateFx, setFx, panelTab, setPanelTab, framework, setFramework, isFavorite, onToggleFavorite, onClose, onCopy, onToast, isDesktop }) {
  const stroke = isStrokeIcon(sel);
  const previewMarkup = useMemo(() => buildSvg(sel, color, strokeW, 56, fx), [sel, color, strokeW, fx]);
  const code = useMemo(() => buildComponent(framework, sel, color, strokeW, iconSize, fx), [framework, sel, color, strokeW, iconSize, fx]);

  const eyedrop = async () => {
    if (!window.EyeDropper) { onToast("EyeDropper not supported here", "error"); return; }
    try { const r = await new window.EyeDropper().open(); setColor(r.sRGBHex); } catch { /* cancelled */ }
  };

  const fxActive = fx.rotate || fx.flipH || fx.flipV || fx.opacity < 1 || fx.bg || fx.shadow || fx.glow;

  return (
    <>
      {!isDesktop && <div className="ih-overlay" onClick={onClose} />}
      <aside className={`ih-detail ${!isDesktop ? "ih-detail-mobile" : ""}`}>
        <div className="ih-detail-head">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ih-detail-title">{sel.n}</div>
            <div className="ih-detail-sub">{sel.l} · {sel.s}</div>
          </div>
          <button className={`ih-iconbtn ${isFavorite ? "fav-active" : ""}`} onClick={onToggleFavorite} title="Favorite (F)"><Heart size={15} fill={isFavorite ? "currentColor" : "none"} /></button>
          <button className="ih-iconbtn" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>

        <div className="ih-preview" style={fx.bg ? {} : { backgroundImage: "linear-gradient(45deg,#16161f 25%,transparent 25%),linear-gradient(-45deg,#16161f 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#16161f 75%),linear-gradient(-45deg,transparent 75%,#16161f 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0" }}>
          <div className="ih-preview-frame"><SvgString markup={previewMarkup} className="ih-preview-svg" /></div>
        </div>

        <div className="ih-subtabs">
          {[["style", Palette, "Style"], ["effects", Wand2, "Effects"], ["export", Package, "Export"]].map(([k, Icon, label]) => (
            <button key={k} className={`ih-subtab ${panelTab === k ? "active" : ""}`} onClick={() => setPanelTab(k)}>
              <Icon size={13} />{label}
              {k === "effects" && fxActive ? <span className="ih-subtab-dot" /> : null}
            </button>
          ))}
        </div>

        <div className="ih-detail-body">
          {panelTab === "style" && (
            <>
              <Section label="Color Wheel">
                <ColorWheel color={color} onChange={setColor} />
              </Section>
              <Section label="Presets">
                <div className="ih-presets">
                  {PRESETS.map((c) => <button key={c} onClick={() => setColor(c)} className={`ih-preset ${color === c ? "active" : ""}`} style={{ background: c }} aria-label={`Color ${c}`} />)}
                </div>
                <div className="ih-color-row">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Color picker" />
                  <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="ih-color-input" aria-label="Hex" />
                  <button className="ih-iconbtn ih-eyedrop" onClick={eyedrop} title="Eyedropper"><Pipette size={14} /></button>
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
            </>
          )}

          {panelTab === "effects" && (
            <>
              <Section label="Transform">
                <div className="ih-fx-row">
                  <span className="ih-fx-label"><RotateCw size={12} /> Rotate</span>
                  <span className="ih-section-value">{fx.rotate}°</span>
                </div>
                <input type="range" min="0" max="360" step="15" value={fx.rotate} onChange={(e) => updateFx({ rotate: +e.target.value })} />
                <div className="ih-fx-quickrow">
                  <button className="ih-mini-btn" onClick={() => updateFx({ rotate: (fx.rotate + 90) % 360 })}><RotateCw size={12} /> 90°</button>
                  <button className="ih-mini-btn" onClick={() => updateFx({ rotate: (fx.rotate + 270) % 360 })}><RotateCcw size={12} /> -90°</button>
                  <button className={`ih-mini-btn ${fx.flipH ? "on" : ""}`} onClick={() => updateFx({ flipH: !fx.flipH })}><FlipHorizontal2 size={12} /></button>
                  <button className={`ih-mini-btn ${fx.flipV ? "on" : ""}`} onClick={() => updateFx({ flipV: !fx.flipV })}><FlipVertical2 size={12} /></button>
                </div>
              </Section>

              <Section label="Opacity" value={`${Math.round(fx.opacity * 100)}%`}>
                <input type="range" min="0.1" max="1" step="0.05" value={fx.opacity} onChange={(e) => updateFx({ opacity: +e.target.value })} />
              </Section>

              <Section label="Background">
                <Toggle on={!!fx.bg} onChange={(v) => updateFx({ bg: v ? "#1a1a25" : null })} label="Enable background shape" />
                {fx.bg && (
                  <>
                    <div className="ih-presets" style={{ marginTop: 8 }}>
                      {["#1a1a25", "#6366f1", "#ec4899", "#22c55e", "#f97316", "#ffffff"].map((c) => (
                        <button key={c} onClick={() => updateFx({ bg: c })} className={`ih-preset ${fx.bg === c ? "active" : ""}`} style={{ background: c }} aria-label={`bg ${c}`} />
                      ))}
                      <input type="color" value={fx.bg} onChange={(e) => updateFx({ bg: e.target.value })} className="ih-mini-color" aria-label="Background color" />
                    </div>
                    <div className="ih-fx-row" style={{ marginTop: 8 }}>
                      <span className="ih-fx-label"><Square size={12} /> Radius</span>
                      <span className="ih-section-value">{fx.bgRadius}</span>
                    </div>
                    <input type="range" min="0" max="12" step="1" value={fx.bgRadius} onChange={(e) => updateFx({ bgRadius: +e.target.value })} />
                  </>
                )}
              </Section>

              <Section label="Drop Shadow">
                <Toggle on={fx.shadow} onChange={(v) => updateFx({ shadow: v })} label="Enable shadow" />
                {fx.shadow && (
                  <div className="ih-fx-controls">
                    <div className="ih-fx-mini">
                      <input type="color" value={fx.shadowColor} onChange={(e) => updateFx({ shadowColor: e.target.value })} className="ih-mini-color" aria-label="Shadow color" />
                      <label>Blur</label>
                      <input type="range" min="0" max="3" step="0.25" value={fx.shadowBlur} onChange={(e) => updateFx({ shadowBlur: +e.target.value })} />
                    </div>
                    <div className="ih-fx-mini">
                      <label>X</label>
                      <input type="range" min="-4" max="4" step="0.5" value={fx.shadowDx} onChange={(e) => updateFx({ shadowDx: +e.target.value })} />
                      <label>Y</label>
                      <input type="range" min="-4" max="4" step="0.5" value={fx.shadowDy} onChange={(e) => updateFx({ shadowDy: +e.target.value })} />
                    </div>
                  </div>
                )}
              </Section>

              <Section label="Glow">
                <Toggle on={fx.glow} onChange={(v) => updateFx({ glow: v })} label="Enable glow" />
                {fx.glow && (
                  <div className="ih-fx-mini" style={{ marginTop: 8 }}>
                    <input type="color" value={fx.glowColor} onChange={(e) => updateFx({ glowColor: e.target.value })} className="ih-mini-color" aria-label="Glow color" />
                    <label>Blur</label>
                    <input type="range" min="0.5" max="4" step="0.25" value={fx.glowBlur} onChange={(e) => updateFx({ glowBlur: +e.target.value })} />
                  </div>
                )}
              </Section>

              {fxActive ? (
                <Section>
                  <button className="ih-reset-btn" onClick={() => setFx(DEFAULT_FX)}><RotateCcw size={13} /> Reset all effects</button>
                </Section>
              ) : null}
            </>
          )}

          {panelTab === "export" && (
            <>
              <Section label="Download">
                <div className="ih-dlgrid">
                  <DlButton icon={<Download size={13} />} label="SVG" onClick={() => { downloadFile(buildSvg(sel, color, strokeW, iconSize, fx), `${sel.id}.svg`, "image/svg+xml"); onToast("SVG downloaded", "success"); }} />
                  <DlButton icon={<FileImage size={13} />} label="PNG" onClick={() => { downloadPngFromSvg(buildSvg(sel, color, strokeW, iconSize, fx), `${sel.id}.png`, iconSize); onToast("PNG downloaded", "success"); }} />
                  <DlButton icon={<FileCode size={13} />} label="XML" onClick={() => { downloadFile(`<?xml version="1.0" encoding="UTF-8"?>\n${buildSvg(sel, color, strokeW, iconSize, fx)}`, `${sel.id}.xml`, "application/xml"); onToast("XML downloaded", "success"); }} />
                </div>
              </Section>

              <Section label="Component / Format">
                <div className="ih-fw-grid">
                  {FRAMEWORKS.map((f) => (
                    <button key={f} className={`ih-fw-btn ${framework === f ? "active" : ""}`} onClick={() => setFramework(f)}>{f}</button>
                  ))}
                </div>
                {framework === "React Native" && (fx.glow || fx.shadow) && (
                  <p className="ih-fw-note">Glow/shadow omitted — limited react-native-svg filter support.</p>
                )}
                <pre className="ih-code">{code}</pre>
                <button className="ih-copybtn" onClick={() => onCopy(code, `${framework} copied`)}>
                  <Copy size={13} /> Copy {framework}
                </button>
              </Section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════
function IconCard({ icon, color, strokeW, isSelected, isInSelection, isFavorite, multiMode, onClick, onContextMenu }) {
  const stroke = isStrokeIcon(icon);
  return (
    <button onClick={onClick} onContextMenu={onContextMenu}
      className={`ih-card ${isSelected ? "selected" : ""} ${isInSelection ? "in-selection" : ""}`}
      title={`${icon.n} (${icon.l}) — right-click for actions`} aria-label={`${icon.n} from ${icon.l}`} data-multi={multiMode || undefined}>
      {(isInSelection || (multiMode && !isInSelection)) && (
        <div className={`ih-card-checkbox ${isInSelection ? "checked" : ""}`}>{isInSelection && <Check size={10} strokeWidth={3} />}</div>
      )}
      {isFavorite && <div className="ih-card-fav-indicator"><Heart size={9} fill="currentColor" /></div>}
      <svg viewBox={icon.v} width="22" height="22" fill={stroke ? "none" : color} stroke={stroke ? color : "none"} strokeWidth={stroke ? strokeW : 0} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon.c }} />
      <span className="ih-card-label">{icon.n}</span>
    </button>
  );
}

function SidebarPanel({ activeLibs, activeStyles, setActiveLibs, setActiveStyles, onClose }) {
  const toggleLib = (l) => setActiveLibs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));
  const toggleStyle = (s) => setActiveStyles((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <aside className="ih-sidebar">
      {onClose && <div className="ih-sidebar-mhead"><span>Filters</span><button className="ih-iconbtn" onClick={onClose}><X size={14} /></button></div>}
      <div className="ih-sidebar-body">
        <div className="ih-sidebar-section">
          <div className="ih-sidebar-h3">Libraries</div>
          <button onClick={() => setActiveLibs([])} className={`ih-sidebar-btn ${activeLibs.length === 0 ? "active" : ""}`}>All Libraries</button>
          {LIBRARIES.map((lib) => (
            <button key={lib} onClick={() => toggleLib(lib)} className={`ih-sidebar-btn ${activeLibs.includes(lib) ? "active" : ""}`}>
              <span style={{ textTransform: "capitalize" }}>{lib}</span>
              <span className="ih-sidebar-count">{ICONS.filter((i) => i.l === lib).length}</span>
            </button>
          ))}
        </div>
        <div className="ih-sidebar-section">
          <div className="ih-sidebar-h3">Style</div>
          <div className="ih-pill-row">
            {STYLES.map((s) => <button key={s} onClick={() => toggleStyle(s)} className={`ih-pill-sm ${activeStyles.includes(s) ? "active" : ""}`}>{s}</button>)}
          </div>
        </div>
        <p className="ih-sidebar-note">All icons MIT-licensed. Free for personal and commercial use.</p>
      </div>
    </aside>
  );
}

function Section({ label, value, children }) {
  return (
    <div className="ih-section">
      {label && <div className="ih-section-head"><span className="ih-section-label">{label}</span>{value && <span className="ih-section-value">{value}</span>}</div>}
      {children}
    </div>
  );
}
function DlButton({ icon, label, onClick }) { return <button className="ih-dlbtn" onClick={onClick}>{icon}{label}</button>; }
function Toggle({ on, onChange, label }) {
  return (
    <button className={`ih-toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} aria-label={label}>
      <span className="ih-toggle-knob" /><span className="ih-toggle-label">{label}</span>
    </button>
  );
}

function CommandPalette({ icons, libraries, onClose, onSelectIcon, onToggleLib, onAction, actions }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const lower = q.toLowerCase();
  const matchedIcons = (q.trim() ? icons.filter((i) => i.searchText.includes(lower)) : icons).slice(0, 6);
  const matchedLibs = q.trim() ? libraries.filter((l) => l.toLowerCase().includes(lower)) : libraries;
  const matchedActions = Object.keys(actions).filter((a) => a.toLowerCase().includes(lower));
  return (
    <>
      <div className="ih-overlay ih-overlay-deep" onClick={onClose} />
      <div className="ih-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="ih-palette-input"><Search size={15} /><input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icons, libraries, actions…" /><kbd className="ih-kbd">Esc</kbd></div>
        <div className="ih-palette-results">
          {matchedActions.length > 0 && (
            <div className="ih-palette-section"><div className="ih-palette-h">Actions</div>
              {matchedActions.map((a) => <button key={a} className="ih-palette-item" onClick={() => onAction(actions[a])}><Zap size={13} /><span>{a}</span><ChevronRight size={12} /></button>)}
            </div>
          )}
          {matchedLibs.length > 0 && (
            <div className="ih-palette-section"><div className="ih-palette-h">Filter by Library</div>
              {matchedLibs.map((l) => <button key={l} className="ih-palette-item" onClick={() => onToggleLib(l)}><Pin size={13} /><span style={{ textTransform: "capitalize" }}>{l}</span><ChevronRight size={12} /></button>)}
            </div>
          )}
          {matchedIcons.length > 0 && (
            <div className="ih-palette-section"><div className="ih-palette-h">Icons</div>
              {matchedIcons.map((icon) => {
                const stroke = isStrokeIcon(icon);
                return (
                  <button key={icon.id} className="ih-palette-item" onClick={() => onSelectIcon(icon.id)}>
                    <svg viewBox={icon.v} width="16" height="16" fill={stroke ? "none" : "#a5b4fc"} stroke={stroke ? "#a5b4fc" : "none"} strokeWidth={stroke ? 2 : 0} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icon.c }} />
                    <span>{icon.n}</span><span className="ih-palette-meta">{icon.l}</span><ChevronRight size={12} />
                  </button>
                );
              })}
            </div>
          )}
          {matchedActions.length === 0 && matchedIcons.length === 0 && matchedLibs.length === 0 && <div className="ih-palette-empty">No matches for "{q}"</div>}
        </div>
      </div>
    </>
  );
}

function ContextMenu({ ctx, isFavorite, inSelection, onCopySvg, onCopyReact, onCopyDataUrl, onDownloadSvg, onDownloadPng, onToggleFavorite, onAddToSelection }) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ x: ctx.x, y: ctx.y });
  useEffect(() => {
    if (!menuRef.current) return;
    const r = menuRef.current.getBoundingClientRect();
    let x = ctx.x, y = ctx.y;
    if (x + r.width > window.innerWidth) x = window.innerWidth - r.width - 8;
    if (y + r.height > window.innerHeight) y = window.innerHeight - r.height - 8;
    setPos({ x, y });
  }, [ctx]);
  return (
    <div ref={menuRef} className="ih-ctxmenu" style={{ left: pos.x, top: pos.y }} onClick={(e) => e.stopPropagation()}>
      <div className="ih-ctxmenu-head">{ctx.icon.n}</div>
      <button onClick={onCopySvg}><Copy size={12} /> Copy SVG</button>
      <button onClick={onCopyReact}><Code2 size={12} /> Copy React</button>
      <button onClick={onCopyDataUrl}><ExternalLink size={12} /> Copy Data URL</button>
      <div className="ih-ctxmenu-divider" />
      <button onClick={onDownloadSvg}><Download size={12} /> Download SVG</button>
      <button onClick={onDownloadPng}><FileImage size={12} /> Download PNG</button>
      <div className="ih-ctxmenu-divider" />
      <button onClick={onToggleFavorite}><Heart size={12} fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "Unfavorite" : "Favorite"}</button>
      <button onClick={onAddToSelection}><Layers size={12} />{inSelection ? "Remove from selection" : "Add to selection"}</button>
    </div>
  );
}

function ShortcutsHelp({ onClose }) {
  return (
    <>
      <div className="ih-overlay ih-overlay-deep" onClick={onClose} />
      <div className="ih-shortcuts" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
        <div className="ih-shortcuts-head"><Keyboard size={15} /><span>Keyboard Shortcuts</span><button className="ih-iconbtn" onClick={onClose}><X size={14} /></button></div>
        <div className="ih-shortcuts-body">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="ih-shortcut-row">
              <div className="ih-shortcut-keys">{s.keys.map((k, j) => <kbd key={j} className="ih-kbd">{k}</kbd>)}</div>
              <span className="ih-shortcut-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ih-root { font-family: 'DM Sans', system-ui, sans-serif; background: #0a0a0f; color: #dddde8; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-thumb { background: #35354a; border-radius: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      input[type=range] { accent-color: #6366f1; width: 100%; height: 4px; }
      ::selection { background: #6366f1; color: white; }
      kbd { font-family: 'Space Mono', monospace; }

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
      .ih-header-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .ih-pill { display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; cursor: pointer; font-size: 11px; font-weight: 500; font-family: inherit; transition: all 0.12s; }
      .ih-pill:hover:not(:disabled) { border-color: #35354a; color: #dddde8; }
      .ih-pill:disabled { opacity: 0.4; cursor: not-allowed; }
      .ih-pill.active { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
      .ih-pill-badge { background: #6366f1; color: white; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 8px; min-width: 14px; text-align: center; }
      .ih-hide-sm { display: inline; }
      @media (max-width: 640px) { .ih-hide-sm { display: none; } }

      .ih-body { flex: 1; display: flex; overflow: hidden; position: relative; }
      .ih-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }
      .ih-overlay-deep { background: rgba(0,0,0,0.7); z-index: 80; }

      .ih-sidebar { width: 210px; height: 100%; flex-shrink: 0; background: #111119; border-right: 1px solid #1a1a25; display: flex; flex-direction: column; overflow: hidden; }
      .ih-sidebar-mobile { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; width: 210px; }
      .ih-sidebar-mhead { display: flex; align-items: center; justify-content: space-between; padding: 14px; border-bottom: 1px solid #1a1a25; font-family: 'Space Mono', monospace; font-weight: 700; font-size: 12px; }
      .ih-sidebar-body { flex: 1; overflow-y: auto; padding: 14px; }
      .ih-sidebar-section { margin-bottom: 18px; }
      .ih-sidebar-h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #505068; font-family: 'Space Mono', monospace; margin-bottom: 8px; }
      .ih-sidebar-btn { width: 100%; text-align: left; padding: 7px 10px; border-radius: 6px; background: transparent; border: 1px solid transparent; color: #8888a4; font-size: 13px; cursor: pointer; margin-bottom: 2px; font-family: inherit; display: flex; justify-content: space-between; align-items: center; transition: all 0.1s; }
      .ih-sidebar-btn:hover { background: rgba(26,26,37,0.6); color: #dddde8; }
      .ih-sidebar-btn.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
      .ih-sidebar-count { font-size: 10px; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-pill-row { display: flex; flex-wrap: wrap; gap: 5px; }
      .ih-pill-sm { padding: 5px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; text-transform: capitalize; font-family: inherit; transition: all 0.1s; }
      .ih-pill-sm:hover { border-color: #35354a; color: #dddde8; }
      .ih-pill-sm.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
      .ih-sidebar-note { margin-top: 16px; padding-top: 14px; border-top: 1px solid #1a1a25; font-size: 11px; color: #505068; line-height: 1.5; }

      .ih-main { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; }
      .ih-resultbar { display: flex; align-items: center; justify-content: space-between; padding: 4px 4px 12px; font-size: 12px; color: #8888a4; }
      .ih-resultbar strong { color: #dddde8; font-weight: 600; }
      .ih-resultbar-tag { display: inline-block; margin-left: 6px; padding: 2px 7px; border-radius: 4px; background: rgba(99,102,241,0.15); color: #a5b4fc; font-size: 10px; font-family: 'Space Mono', monospace; }
      .ih-link { background: none; border: none; color: #8888a4; cursor: pointer; font-size: 11px; font-family: inherit; text-decoration: underline; text-underline-offset: 2px; }
      .ih-link:hover { color: #dddde8; }

      .ih-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 4px; }
      .ih-card { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 12px; border: 1px solid rgba(26,26,37,0.5); background: rgba(17,17,25,0.5); cursor: pointer; transition: background 0.1s, border-color 0.1s; font-family: inherit; color: inherit; }
      .ih-card:hover { background: rgba(26,26,37,0.7); border-color: #252533; }
      .ih-card:hover svg { transform: scale(1.1); }
      .ih-card svg { transition: transform 0.15s; }
      .ih-card.selected { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); }
      .ih-card.in-selection { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); }
      .ih-card-label { font-size: 9px; color: #505068; width: 100%; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ih-card-checkbox { position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid #35354a; background: rgba(10,10,15,0.6); display: flex; align-items: center; justify-content: center; color: white; }
      .ih-card-checkbox.checked { background: #6366f1; border-color: #6366f1; }
      .ih-card-fav-indicator { position: absolute; top: 4px; right: 4px; color: #ec4899; }

      .ih-empty { flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; padding: 40px; }
      .ih-empty-iconbg { width: 56px; height: 56px; border-radius: 16px; background: rgba(26,26,37,0.5); display: flex; align-items: center; justify-content: center; }
      .ih-empty-title { color: #8888a4; font-size: 14px; }
      .ih-empty-sub { color: #505068; font-size: 12px; }

      .ih-detail { width: 300px; flex-shrink: 0; background: #111119; border-left: 1px solid #1a1a25; display: flex; flex-direction: column; overflow: hidden; }
      .ih-detail-mobile { position: fixed; right: 0; top: 0; bottom: 0; z-index: 50; }
      .ih-detail-head { display: flex; align-items: center; gap: 6px; padding: 0 12px; height: 52px; border-bottom: 1px solid #1a1a25; flex-shrink: 0; }
      .ih-detail-title { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ih-detail-sub { font-size: 10px; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-preview { padding: 18px; display: flex; justify-content: center; border-bottom: 1px solid #1a1a25; flex-shrink: 0; }
      .ih-preview-frame { width: 110px; height: 110px; border-radius: 16px; background: transparent; display: flex; align-items: center; justify-content: center; }
      .ih-preview-svg { display: flex; }
      .ih-preview-svg svg { display: block; }

      .ih-subtabs { display: flex; border-bottom: 1px solid #1a1a25; flex-shrink: 0; }
      .ih-subtab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 10px 4px; background: none; border: none; border-bottom: 2px solid transparent; color: #505068; font-size: 11px; font-weight: 500; cursor: pointer; font-family: inherit; margin-bottom: -1px; transition: all 0.12s; position: relative; }
      .ih-subtab:hover { color: #8888a4; }
      .ih-subtab.active { color: #a5b4fc; border-bottom-color: #6366f1; }
      .ih-subtab-dot { position: absolute; top: 8px; right: 18px; width: 5px; height: 5px; border-radius: 50%; background: #ec4899; }

      .ih-detail-body { flex: 1; overflow-y: auto; }
      .ih-section { padding: 12px 14px; border-bottom: 1px solid #1a1a25; }
      .ih-section:last-child { border-bottom: none; }
      .ih-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .ih-section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-section-value { font-size: 11px; color: #8888a4; font-family: 'Space Mono', monospace; }

      /* COLOR WHEEL */
      .ih-wheel-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
      .ih-wheel { position: relative; width: 150px; height: 150px; border-radius: 50%; cursor: crosshair; touch-action: none;
        background:
          radial-gradient(circle closest-side, #fff, rgba(255,255,255,0) 95%),
          conic-gradient(hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%));
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); }
      .ih-wheel-dark { position: absolute; inset: 0; border-radius: 50%; background: #000; pointer-events: none; }
      .ih-wheel-handle { position: absolute; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.5); transform: translate(-50%, -50%); pointer-events: none; }
      .ih-wheel-val { display: flex; align-items: center; gap: 8px; width: 100%; }

      .ih-presets { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
      .ih-preset { width: 22px; height: 22px; border-radius: 5px; border: 2px solid #252533; cursor: pointer; transition: all 0.1s; padding: 0; }
      .ih-preset:hover { border-color: #35354a; }
      .ih-preset.active { border-color: #818cf8; transform: scale(1.15); }
      .ih-color-row { display: flex; align-items: center; gap: 6px; }
      .ih-color-row input[type=color] { width: 30px; height: 26px; border: none; background: none; cursor: pointer; padding: 0; }
      .ih-color-input { flex: 1; height: 26px; padding: 0 8px; border-radius: 5px; background: #1a1a25; border: 1px solid #252533; color: #dddde8; font-size: 11px; font-family: 'Space Mono', monospace; outline: none; }
      .ih-color-input:focus { border-color: #6366f1; }
      .ih-eyedrop { border: 1px solid #252533; }
      .ih-mini-color { width: 26px; height: 22px; border: 1px solid #252533; border-radius: 5px; background: none; cursor: pointer; padding: 0; }

      /* EFFECTS */
      .ih-fx-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
      .ih-fx-label { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #8888a4; }
      .ih-fx-quickrow { display: flex; gap: 5px; margin-top: 8px; }
      .ih-mini-btn { display: flex; align-items: center; gap: 3px; padding: 5px 8px; border-radius: 6px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; font-size: 10px; cursor: pointer; font-family: inherit; transition: all 0.1s; }
      .ih-mini-btn:hover { border-color: #35354a; color: #dddde8; }
      .ih-mini-btn.on { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
      .ih-fx-controls { margin-top: 8px; display: flex; flex-direction: column; gap: 10px; }
      .ih-fx-mini { display: flex; align-items: center; gap: 8px; }
      .ih-fx-mini label { font-size: 10px; color: #505068; font-family: 'Space Mono', monospace; min-width: 20px; }
      .ih-toggle { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
      .ih-toggle-knob { width: 32px; height: 18px; border-radius: 10px; background: #252533; position: relative; transition: background 0.15s; flex-shrink: 0; }
      .ih-toggle-knob::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #8888a4; transition: transform 0.15s, background 0.15s; }
      .ih-toggle.on .ih-toggle-knob { background: #6366f1; }
      .ih-toggle.on .ih-toggle-knob::after { transform: translateX(14px); background: #fff; }
      .ih-toggle-label { font-size: 12px; color: #8888a4; }
      .ih-toggle.on .ih-toggle-label { color: #dddde8; }
      .ih-reset-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 0; border-radius: 8px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; font-size: 12px; cursor: pointer; font-family: inherit; transition: all 0.12s; }
      .ih-reset-btn:hover { background: rgba(239,68,68,0.18); }

      .ih-dlgrid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
      .ih-dlbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; border-radius: 8px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; font-size: 11px; cursor: pointer; transition: all 0.12s; font-family: inherit; }
      .ih-dlbtn:hover { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.1); color: #dddde8; }

      .ih-fw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 10px; }
      .ih-fw-btn { padding: 7px 8px; border-radius: 7px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; font-size: 11px; cursor: pointer; font-family: inherit; transition: all 0.1s; }
      .ih-fw-btn:hover { border-color: #35354a; color: #dddde8; }
      .ih-fw-btn.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
      .ih-fw-note { font-size: 10px; color: #f97316; margin-bottom: 8px; line-height: 1.4; }
      .ih-code { background: rgba(10,10,15,0.8); border: 1px solid #1a1a25; border-radius: 8px; padding: 10px; font-size: 9px; color: #8888a4; font-family: 'Space Mono', monospace; overflow: auto; max-height: 160px; white-space: pre-wrap; word-break: break-all; line-height: 1.5; }
      .ih-copybtn { width: 100%; margin-top: 8px; padding: 8px 0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; background: #6366f1; color: white; border: 1px solid #6366f1; transition: all 0.12s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
      .ih-copybtn:hover { background: #4f46e5; }

      .ih-bulkbar { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); background: #111119; border: 1px solid #252533; border-radius: 12px; box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15); padding: 8px 8px 8px 14px; display: flex; align-items: center; gap: 14px; z-index: 60; max-width: calc(100% - 32px); }
      .ih-bulkbar-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8888a4; padding-right: 10px; border-right: 1px solid #1a1a25; }
      .ih-bulkbar-info strong { color: #dddde8; font-weight: 700; font-family: 'Space Mono', monospace; }
      .ih-bulkbar-actions { display: flex; align-items: center; gap: 4px; }
      .ih-bulk-btn { display: flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 7px; background: rgba(26,26,37,0.5); border: 1px solid #252533; color: #8888a4; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.12s; font-family: inherit; }
      .ih-bulk-btn:hover { border-color: #35354a; color: #dddde8; }
      .ih-bulk-btn.primary { background: #6366f1; border-color: #6366f1; color: white; }
      .ih-bulk-btn.primary:hover { background: #4f46e5; }

      .ih-palette { position: fixed; top: 14vh; left: 50%; transform: translateX(-50%); width: 92%; max-width: 540px; background: #111119; border: 1px solid #252533; border-radius: 14px; box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2); overflow: hidden; z-index: 90; display: flex; flex-direction: column; max-height: 70vh; }
      .ih-palette-input { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #1a1a25; color: #505068; }
      .ih-palette-input input { flex: 1; background: none; border: none; color: #dddde8; font-size: 14px; outline: none; font-family: inherit; }
      .ih-kbd { display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 4px; background: #1a1a25; border: 1px solid #252533; color: #8888a4; font-size: 10px; font-family: 'Space Mono', monospace; min-height: 18px; }
      .ih-palette-results { flex: 1; overflow-y: auto; padding: 6px 0; }
      .ih-palette-h { padding: 6px 16px 4px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #505068; font-family: 'Space Mono', monospace; }
      .ih-palette-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px 16px; background: none; border: none; color: #dddde8; cursor: pointer; font-size: 13px; font-family: inherit; text-align: left; transition: background 0.1s; }
      .ih-palette-item:hover { background: rgba(99,102,241,0.1); }
      .ih-palette-item span { flex: 1; }
      .ih-palette-meta { font-size: 10px !important; color: #505068; font-family: 'Space Mono', monospace; flex: 0 !important; }
      .ih-palette-empty { padding: 24px; text-align: center; color: #505068; font-size: 13px; }

      .ih-ctxmenu { position: fixed; background: #111119; border: 1px solid #252533; border-radius: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.6); padding: 4px; min-width: 180px; z-index: 100; display: flex; flex-direction: column; }
      .ih-ctxmenu-head { padding: 6px 10px 8px; font-size: 11px; color: #505068; font-family: 'Space Mono', monospace; border-bottom: 1px solid #1a1a25; margin-bottom: 4px; }
      .ih-ctxmenu button { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: none; border: none; color: #dddde8; font-size: 12px; cursor: pointer; font-family: inherit; text-align: left; border-radius: 5px; transition: background 0.1s; }
      .ih-ctxmenu button:hover { background: rgba(99,102,241,0.15); color: #a5b4fc; }
      .ih-ctxmenu-divider { height: 1px; background: #1a1a25; margin: 4px 6px; }

      .ih-shortcuts { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 92%; max-width: 460px; background: #111119; border: 1px solid #252533; border-radius: 14px; z-index: 90; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
      .ih-shortcuts-head { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #1a1a25; font-weight: 600; font-size: 14px; }
      .ih-shortcuts-head span { flex: 1; }
      .ih-shortcuts-body { padding: 16px; max-height: 60vh; overflow-y: auto; }
      .ih-shortcut-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; gap: 16px; }
      .ih-shortcut-row + .ih-shortcut-row { border-top: 1px solid rgba(26,26,37,0.5); }
      .ih-shortcut-keys { display: flex; gap: 4px; }
      .ih-shortcut-desc { font-size: 13px; color: #8888a4; }

      .ih-toasts { position: fixed; top: 70px; right: 16px; z-index: 200; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
      .ih-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #111119; border: 1px solid #252533; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); font-size: 12px; color: #dddde8; min-width: 180px; max-width: 280px; animation: ih-toast-in 0.18s ease-out; }
      .ih-toast-success { border-color: rgba(34,197,94,0.3); color: #86efac; }
      .ih-toast-error { border-color: rgba(239,68,68,0.3); color: #fca5a5; }
      .ih-toast-info { border-color: rgba(99,102,241,0.3); color: #a5b4fc; }
      @keyframes ih-toast-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    `}</style>
  );
}
