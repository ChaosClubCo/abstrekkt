import { useState, useCallback, useMemo, useEffect, useRef } from "react";

const S={base:"#0a0a0f",raised:"#111118",border:"#2a2a38",borderSub:"#1e1e28",accent:"hsl(262,83%,68%)",accentDim:"hsl(262,60%,45%)",text:"#f0f0f5",textSec:"#9898a8",textTer:"#52525e",success:"#22c55e",successBg:"rgba(34,197,94,0.12)",fontHead:"'Space Grotesk','DM Sans',sans-serif",fontBody:"'Inter','DM Sans',system-ui,sans-serif",fontMono:"'IBM Plex Mono','Fira Code',monospace"};

const BRAND_TOKENS={"airbnb":{"name":"Airbnb","description":"A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries every primary CTA, search-button orb, and ","colors":{"primary":"#ff385c","primary-active":"#e00b41","primary-disabled":"#ffd1da","primary-error-text":"#c13515","primary-error-text-hover":"#b32505","luxe":"#460479","plus":"#92174d","ink":"#222222","body":"#3f3f3f","muted":"#6a6a6a","muted-soft":"#929292","hairline":"#dddddd","hairline-soft":"#ebebeb","border-strong":"#c1c1c1","canvas":"#ffffff","surface-soft":"#f7f7f7","surface-card":"#ffffff","surface-strong":"#f2f2f2","on-primary":"#ffffff","on-dark":"#ffffff","legal-link":"#428bff","star-rating":"#222222","scrim":"#000000"},"fonts":["Airbnb Cereal VF"],"source":"yaml","radius":14},"airtable":{"name":"Airtable","description":"A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signature cards in coral, dark green, peach, an","colors":{"primary":"#181d26","primary-active":"#0d1218","ink":"#181d26","body":"#333840","muted":"#41454d","hairline":"#dddddd","border-strong":"#9297a0","canvas":"#ffffff","surface-soft":"#f8fafc","surface-strong":"#e0e2e6","surface-dark":"#181d26","surface-dark-elevated":"#1d1f25","signature-coral":"#aa2d00","signature-forest":"#0a2e0e","signature-cream":"#f5e9d4","signature-peach":"#fcab79","signature-mint":"#a8d8c4","signature-yellow":"#f4d35e","signature-mustard":"#d9a441","on-primary":"#ffffff","on-dark":"#ffffff","link":"#1b61c9","link-active":"#1a3866","info":"#254fad","info-border":"#458fff","success":"#006400","success-border":"#39bf45","pricing-ink":"#1d1f25"},"fonts":["Haas Groot Disp","Haas","Inter Display"],"source":"yaml","radius":10},"apple":{"name":"Apple","description":"A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF Pro Display headlines with nega","colors":{"primary":"#0066cc","primary-focus":"#0071e3","primary-on-dark":"#2997ff","ink":"#1d1d1f","body":"#1d1d1f","body-on-dark":"#ffffff","body-muted":"#cccccc","ink-muted-80":"#333333","ink-muted-48":"#7a7a7a","divider-soft":"#f0f0f0","hairline":"#e0e0e0","canvas":"#ffffff","canvas-parchment":"#f5f5f7","surface-pearl":"#fafafc","surface-tile-1":"#272729","surface-tile-2":"#2a2a2c","surface-tile-3":"#252527","surface-black":"#000000","surface-chip-translucent":"#d2d2d7","on-primary":"#ffffff","on-dark":"#ffffff"},"fonts":["SF Pro Display","SF Pro Text"],"source":"yaml","radius":11},"binance":{"name":"Binance","description":"A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary CTA, brand accent, and value-claim mome","colors":{"primary":"#fcd535","primary-active":"#f0b90b","primary-disabled":"#3a3a1f","ink":"#181a20","body":"#eaecef","body-on-light":"#181a20","muted":"#707a8a","muted-strong":"#929aa5","hairline-on-light":"#eaecef","hairline-on-dark":"#2b3139","border-strong":"#cdd1d6","canvas-light":"#ffffff","canvas-dark":"#0b0e11","surface-card-dark":"#1e2329","surface-elevated-dark":"#2b3139","surface-soft-light":"#fafafa","surface-strong-light":"#f5f5f5","on-primary":"#181a20","on-dark":"#ffffff","trading-up":"#0ecb81","trading-down":"#f6465d","accent-turquoise":"#2dbdb6","info":"#3b82f6","info-ring":"#3b82f6"},"fonts":["BinanceNova","BinancePlex"],"source":"yaml","radius":6},"bmw":{"name":"BMW","description":"BMW's corporate site \u2014 distinct from BMW M's motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On a light (cream-tinted white) canvas, BM","colors":{"primary":"#1c69d4","primary-active":"#0653b6","primary-disabled":"#d6d6d6","ink":"#262626","body":"#3c3c3c","body-strong":"#1a1a1a","muted":"#6b6b6b","muted-soft":"#9a9a9a","hairline":"#e6e6e6","hairline-strong":"#cccccc","canvas":"#ffffff","surface-soft":"#f7f7f7","surface-card":"#fafafa","surface-strong":"#ebebeb","surface-dark":"#1a2129","surface-dark-elevated":"#262e38","on-primary":"#ffffff","on-dark":"#ffffff","on-dark-soft":"#bbbbbb","m-blue-light":"#0066b1","m-blue-dark":"#1c69d4","m-red":"#e22718","success":"#22c55e","warning":"#f59e0b","error":"#dc2626"},"fonts":["BMW Type Next Latin"],"source":"yaml","radius":8},"bmw-m":{"name":"BMW M","description":"A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE. The brand carries no decorative voltage ","colors":{"primary":"#ffffff","ink":"#ffffff","body":"#bbbbbb","body-strong":"#e6e6e6","muted":"#7e7e7e","hairline":"#3c3c3c","hairline-strong":"#262626","canvas":"#000000","surface-card":"#1a1a1a","surface-elevated":"#262626","surface-soft":"#0d0d0d","on-primary":"#000000","on-dark":"#ffffff","m-blue-light":"#0066b1","m-blue-dark":"#1c69d4","m-red":"#e22718","bmw-blue":"#1c69d4","electric-blue":"#0653b6","carbon-gray":"#2b2b2b","warning":"#f4b400","success":"#0fa336"},"fonts":["BMWTypeNextLatin","BMWTypeNextLatin Light"],"source":"yaml","radius":6},"bugatti":{"name":"Bugatti","description":"An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive photography as the only voltage. The system","colors":{"primary":"#ffffff","ink":"#ffffff","body":"#cccccc","body-strong":"#e6e6e6","muted":"#999999","muted-soft":"#666666","hairline":"#262626","hairline-strong":"#3a3a3a","canvas":"#000000","surface-soft":"#0d0d0d","surface-card":"#141414","surface-elevated":"#1f1f1f","on-primary":"#000000","on-dark":"#ffffff","on-photo":"#ffffff","link":"#c3d9f3","warning":"#d4a017","success":"#5fa657"},"fonts":["Bugatti Display","Bugatti Monospace","Bugatti Text Regular"],"source":"yaml","radius":null},"cal":{"name":"Cal.com","description":"A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The system reads as friendly modern SaaS \u2014 gener","colors":{"primary":"#111111","primary-active":"#242424","primary-disabled":"#e5e7eb","ink":"#111111","body":"#374151","muted":"#6b7280","muted-soft":"#898989","hairline":"#e5e7eb","hairline-soft":"#f3f4f6","canvas":"#ffffff","surface-soft":"#f8f9fa","surface-card":"#f5f5f5","surface-strong":"#e5e7eb","surface-dark":"#101010","surface-dark-elevated":"#1a1a1a","on-primary":"#ffffff","on-dark":"#ffffff","on-dark-soft":"#a1a1aa","brand-accent":"#3b82f6","success":"#10b981","warning":"#f59e0b","error":"#ef4444","badge-orange":"#fb923c","badge-pink":"#ec4899","badge-violet":"#8b5cf6","badge-emerald":"#34d399"},"fonts":["Cal Sans","Inter","JetBrains Mono"],"source":"yaml","radius":8},"claude":{"name":"Claude","description":"A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines, warm coral CTAs, and dark navy product s","colors":{"primary":"#cc785c","primary-active":"#a9583e","primary-disabled":"#e6dfd8","ink":"#141413","body":"#3d3d3a","body-strong":"#252523","muted":"#6c6a64","muted-soft":"#8e8b82","hairline":"#e6dfd8","hairline-soft":"#ebe6df","canvas":"#faf9f5","surface-soft":"#f5f0e8","surface-card":"#efe9de","surface-cream-strong":"#e8e0d2","surface-dark":"#181715","surface-dark-elevated":"#252320","surface-dark-soft":"#1f1e1b","on-primary":"#ffffff","on-dark":"#faf9f5","on-dark-soft":"#a09d96","accent-teal":"#5db8a6","accent-amber":"#e8a55a","success":"#5db872","warning":"#d4a017","error":"#c64545"},"fonts":["Copernicus","StyreneB","JetBrains Mono"],"source":"yaml","radius":8},"clay":{"name":"Clay","description":"A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTAs, custom rounded display type, and satu","colors":{"primary":"#0a0a0a","primary-active":"#1f1f1f","primary-disabled":"#e5e5e5","ink":"#0a0a0a","body":"#3a3a3a","body-strong":"#1a1a1a","muted":"#6a6a6a","muted-soft":"#9a9a9a","hairline":"#e5e5e5","hairline-soft":"#f0f0f0","canvas":"#fffaf0","surface-soft":"#faf5e8","surface-card":"#f5f0e0","surface-strong":"#ebe6d6","surface-dark":"#0a1a1a","surface-dark-elevated":"#1a2a2a","on-primary":"#ffffff","on-dark":"#ffffff","on-dark-soft":"#a0a0a0","brand-pink":"#ff4d8b","brand-teal":"#1a3a3a","brand-lavender":"#b8a4ed","brand-peach":"#ffb084","brand-ochre":"#e8b94a","brand-mint":"#a4d4c5","brand-coral":"#ff6b5a","success":"#22c55e","warning":"#f59e0b","error":"#ef4444"},"fonts":["Plain Black","Inter"],"source":"yaml","radius":12},"clickhouse":{"name":"ClickHouse","description":"A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in confident sans, yellow CTAs, and yellow-text","colors":{"primary":"#faff69","primary-active":"#e6eb52","primary-disabled":"#3a3a1f","ink":"#ffffff","body":"#cccccc","body-strong":"#e6e6e6","muted":"#888888","muted-soft":"#5a5a5a","hairline":"#2a2a2a","hairline-strong":"#3a3a3a","canvas":"#0a0a0a","surface-soft":"#121212","surface-card":"#1a1a1a","surface-elevated":"#242424","surface-yellow-band":"#faff69","on-primary":"#0a0a0a","on-dark":"#ffffff","on-yellow":"#0a0a0a","accent-emerald":"#22c55e","accent-rose":"#ef4444","accent-blue":"#3b82f6","success":"#22c55e","warning":"#f59e0b","error":"#ef4444"},"fonts":["Inter","JetBrains Mono"],"source":"yaml","radius":8},"cohere":{"name":"Cohere","description":"Cohere's 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, soft mineral surfaces, rounded media cards,","colors":{"primary":"#17171c","cohere-black":"#000000","ink":"#212121","deep-green":"#003c33","dark-navy":"#071829","canvas":"#ffffff","soft-stone":"#eeece7","pale-green":"#edfce9","pale-blue":"#f1f5ff","hairline":"#d9d9dd","border-light":"#e5e7eb","card-border":"#f2f2f2","muted":"#93939f","slate":"#75758a","body-muted":"#616161","action-blue":"#1863dc","focus-blue":"#4c6ee6","coral":"#ff7759","coral-soft":"#ffad9b","form-focus":"#9b60aa","on-primary":"#ffffff","on-dark":"#ffffff","error":"#b30000"},"fonts":["CohereText","Unica77 Cohere Web","CohereMono"],"source":"yaml","radius":16},"coinbase":{"name":"Coinbase","description":"An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is pure white; Coinbase Blue (`#0052ff`) is ","colors":{"primary":"#0052ff","primary-active":"#003ecc","primary-disabled":"#a8b8cc","ink":"#0a0b0d","body":"#5b616e","body-strong":"#0a0b0d","muted":"#7c828a","muted-soft":"#a8acb3","hairline":"#dee1e6","hairline-soft":"#eef0f3","canvas":"#ffffff","surface-soft":"#f7f7f7","surface-card":"#ffffff","surface-strong":"#eef0f3","surface-dark":"#0a0b0d","surface-dark-elevated":"#16181c","on-primary":"#ffffff","on-dark":"#ffffff","on-dark-soft":"#a8acb3","semantic-up":"#05b169","semantic-down":"#cf202f","accent-yellow":"#f4b000"},"fonts":["Coinbase Display","Coinbase Sans","Coinbase Mono"],"source":"yaml","radius":12},"composio":{"name":"Composio","description":"A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single deep-electric-blue voltage (`#0007cd`). The page ","colors":{"primary":"#0007cd","primary-active":"#0005a3","primary-glow":"#1a26ff","ink":"#ffffff","body":"#a8a8a8","body-strong":"#ffffff","muted":"#888888","muted-soft":"#666666","hairline":"#222222","hairline-soft":"#1a1a1a","hairline-strong":"#333333","canvas":"#0f0f0f","canvas-deep":"#000000","surface-card":"#181818","surface-card-elevated":"#222222","surface-strong":"#2a2a2a","on-primary":"#ffffff","on-dark":"#ffffff","accent-cyan":"#00d4ff","accent-violet":"#7b3aed","semantic-error":"#ff4d4d","semantic-success":"#33d17a"},"fonts":["abcDiatype","JetBrains Mono"],"source":"yaml","radius":8},"cursor":{"name":"Cursor","description":"An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (`#f7f7f4`) instead of the typical dark IDE atm","colors":{"primary":"#f54e00","primary-active":"#d04200","ink":"#26251e","body":"#5a5852","body-strong":"#26251e","muted":"#807d72","muted-soft":"#a09c92","hairline":"#e6e5e0","hairline-soft":"#efeee8","hairline-strong":"#cfcdc4","canvas":"#f7f7f4","canvas-soft":"#fafaf7","surface-card":"#ffffff","surface-strong":"#e6e5e0","on-primary":"#ffffff","timeline-thinking":"#dfa88f","timeline-grep":"#9fc9a2","timeline-read":"#9fbbe0","timeline-edit":"#c0a8dd","timeline-done":"#c08532","semantic-error":"#cf2d56","semantic-success":"#1f8a65"},"fonts":["CursorGothic","JetBrains Mono"],"source":"yaml","radius":8},"elevenlabs":{"name":"elevenlabs","description":"","colors":{"primary":"#292524","primary-active":"#0c0a09","ink":"#0c0a09","body":"#4e4e4e","body-strong":"#292524","muted":"#777169","muted-soft":"#a8a29e","hairline":"#e7e5e4","hairline-soft":"#f0efed","hairline-strong":"#d6d3d1","canvas":"#f5f5f5","canvas-soft":"#fafafa","canvas-deep":"#0c0a09","surface-card":"#ffffff","surface-strong":"#f0efed","surface-dark":"#0c0a09","surface-dark-elevated":"#1c1917","on-primary":"#ffffff","on-dark":"#ffffff","on-dark-soft":"#a8a29e","gradient-mint":"#a7e5d3","gradient-peach":"#f4c5a8","gradient-lavender":"#c8b8e0","gradient-sky":"#a8c8e8","gradient-rose":"#e8b8c4","semantic-error":"#dc2626","semantic-success":"#16a34a"},"fonts":[],"source":"yaml_error","radius":null},"expo":{"name":"Expo","description":"A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white with a soft sky-blue gradient atmospheric ","colors":{"primary":"#000000","primary-active":"#1a1a1a","text-link":"#0d74ce","text-link-secondary":"#476cff","ink":"#171717","body":"#60646c","body-strong":"#171717","muted":"#999999","muted-soft":"#cccccc","hairline":"#f0f0f3","hairline-soft":"#f5f5f7","hairline-strong":"#dcdee0","canvas":"#ffffff","canvas-soft":"#fafafa","surface-card":"#ffffff","surface-strong":"#f0f0f3","surface-dark":"#171717","surface-dark-elevated":"#1a1a1a","on-primary":"#ffffff","on-dark":"#ffffff","on-dark-soft":"#b0b4ba","gradient-sky-light":"#cfe7ff","gradient-sky-mid":"#a8c8e8","accent-warning":"#ab6400","accent-preview":"#8145b5","accent-link-bright":"#47c2ff","semantic-error":"#eb8e90","semantic-success":"#16a34a"},"fonts":["Inter","JetBrains Mono"],"source":"yaml","radius":8},"ferrari":{"name":"Ferrari","description":"A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is **near-black** (`#181818`) holding pure white display type; white-canvas bands ap","colors":{"primary":"#da291c","primary-active":"#b01e0a","primary-hover":"#9d2211","ink":"#ffffff","body":"#969696","body-strong":"#ffffff","body-on-light":"#181818","muted":"#666666","muted-soft":"#8f8f8f","hairline":"#303030","hairline-on-light":"#d2d2d2","hairline-soft":"#ebebeb","canvas":"#181818","canvas-elevated":"#303030","canvas-light":"#ffffff","surface-card":"#303030","surface-soft-light":"#f7f7f7","surface-strong-light":"#ebebeb","on-primary":"#ffffff","on-dark":"#ffffff","on-light":"#181818","accent-yellow-hypersail":"#fff200","accent-yellow":"#f6e500","semantic-info":"#4c98b9","semantic-success":"#03904a","semantic-warning":"#f13a2c"},"fonts":["FerrariSans"],"source":"yaml","radius":6},"figma":{"name":"Figma","description":"A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome \u2014 figmaSans variable type, pure wh","colors":{"primary":"#000000","on-primary":"#ffffff","ink":"#000000","canvas":"#ffffff","inverse-canvas":"#000000","inverse-ink":"#ffffff","on-inverse-soft":"#ffffff","hairline":"#e6e6e6","hairline-soft":"#f1f1f1","surface-soft":"#f7f7f5","block-lime":"#dceeb1","block-lilac":"#c5b0f4","block-cream":"#f4ecd6","block-pink":"#efd4d4","block-mint":"#c8e6cd","block-coral":"#f3c9b6","block-navy":"#1f1d3d","accent-magenta":"#ff3d8b","semantic-success":"#1ea64a","overlay-scrim":"#000000"},"fonts":["figmaSans","figmaMono"],"source":"yaml","radius":8},"framer":{"name":"Framer","description":"A confident dark-canvas builder marketing site that treats the page like a working artboard \u2014 pure black surfaces, white display type set in GT Walsheim Medium with aggressive nega","colors":{"primary":"#ffffff","on-primary":"#000000","accent-blue":"#0099ff","ink":"#ffffff","ink-muted":"#999999","canvas":"#090909","surface-1":"#141414","surface-2":"#1c1c1c","hairline":"#262626","hairline-soft":"#1a1a1a","inverse-canvas":"#ffffff","inverse-ink":"#000000","gradient-magenta":"#d44df0","gradient-violet":"#6a4cf5","gradient-orange":"#ff7a3d","gradient-coral":"#ff5577","semantic-success":"#22c55e"},"fonts":["GT Walsheim Framer Medium","GT Walsheim Medium","Inter"],"source":"yaml","radius":10},"hashicorp":{"name":"HashiCorp","description":"An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors \u2014 Terraform purple, Vault yellow, Consul pink, Wa","colors":{"primary":"#000000","on-primary":"#ffffff","accent-blue":"#2b89ff","ink":"#ffffff","ink-muted":"#b2b6bd","ink-subtle":"#656a76","canvas":"#000000","surface-1":"#15181e","surface-2":"#1f232b","surface-3":"#3b3d45","hairline":"#3b3d45","hairline-soft":"#252830","inverse-canvas":"#ffffff","inverse-ink":"#000000","product-terraform":"#7b42bc","product-terraform-bright":"#911ced","product-vault":"#ffcf25","product-consul":"#e62b1e","product-waypoint":"#14c6cb","product-waypoint-deep":"#12b6bb","product-vagrant":"#1868f2","product-nomad":"#00ca8e","product-boundary":"#f24c53","amber-100":"#fbeabf","amber-200":"#bb5a00","blue-7":"#101a59","semantic-success":"#00ca8e","semantic-warning":"#ffcf25","semantic-error":"#e62b1e","semantic-visited":"#a737ff"},"fonts":["hashicorpSans"],"source":"yaml","radius":8},"ibm":{"name":"IBM","description":"An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident accent, and a deliberately flat-square ae","colors":{"primary":"#0f62fe","on-primary":"#ffffff","ink":"#161616","ink-muted":"#525252","ink-subtle":"#8c8c8c","canvas":"#ffffff","surface-1":"#f4f4f4","surface-2":"#e0e0e0","inverse-canvas":"#161616","inverse-surface-1":"#262626","inverse-ink":"#ffffff","inverse-ink-muted":"#c6c6c6","hairline":"#e0e0e0","hairline-strong":"#161616","blue-60":"#0043ce","blue-80":"#002d9c","blue-hover":"#0050e6","semantic-success":"#24a148","semantic-warning":"#f1c21b","semantic-error":"#da1e28","semantic-info":"#0f62fe"},"fonts":["IBM Plex Sans"],"source":"yaml","radius":6},"intercom":{"name":"Intercom","description":"An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom's proprietary geometric sans), and a single confident Fi","colors":{"primary":"#111111","on-primary":"#ffffff","ink":"#111111","ink-muted":"#626260","ink-subtle":"#7b7b78","ink-tertiary":"#9c9fa5","canvas":"#f5f1ec","surface-1":"#ffffff","surface-2":"#ebe7e1","inverse-canvas":"#000000","inverse-surface-1":"#313130","inverse-ink":"#ffffff","inverse-ink-muted":"#9c9fa5","hairline":"#d3cec6","hairline-soft":"#ebe7e1","fin-orange":"#ff5600","report-orange":"#fe4c02","report-blue":"#65b5ff","report-green":"#0bdf50","report-pink":"#ff2067","report-lime":"#b3e01c","report-cyan":"#03b2cb","brand-blue":"#0007cb","semantic-error":"#c41c1c","semantic-success":"#0bdf50"},"fonts":["Saans","SaansMono"],"source":"yaml","radius":8},"kraken":{"name":"Design System Inspired by Kraken","description":"# Design System Inspired by Kraken\n\n## 1. Visual Theme & Atmosphere\n\nKraken's website is a clean, trustworthy crypto exchange that uses purple as its commanding brand color. The de","colors":{"key-characteristics:":"#7132f5","kraken-purple":"#7132f5","purple-dark":"#5741d8","purple-deep":"#5b1ecf","(`rgba(133,91,251,0.16)`):-purple-at-16%":"#101114","cool-gray":"#686b82","silver-blue":"#9497a9","white":"#ffffff","border-gray":"#dedee5","green":"#149e61","green-dark":"#026b3f",":-`kraken-product`,-fallbacks:-`helvetic":"#7132f5","purple-outlined":"#ffffff","--background:-`rgba(133,91,251,0.16)`\n--":"#ffffff"},"fonts":[],"source":"prose","radius":null},"lamborghini":{"name":"Design System Inspired by Lamborghini","description":"# Design System Inspired by Lamborghini\n\n## 1. Visual Theme & Atmosphere\n\nLamborghini's website is a cathedral of darkness \u2014 a digital stage where jet-black surfaces stretch infini","colors":{"key-characteristics:":"#000000","lamborghini-gold":"#FFC000","pure-white":"#FFFFFF","dark-gold":"#917300","gold-text":"#FFCE3E","cyan-pulse":"#29ABE2","link-blue":"#3860BE","absolute-black":"#000000","charcoal":"#202020","dark-iron":"#181818","(`rgba(0,0,0,0.7)`):-semi-transparent-ov":"#F8F8F8","mist":"#E6E6E6","smoke":"#F5F5F5","graphite":"#494949","ash":"#7D7D7D","steel":"#969696","slate":"#666666","iron":"#555555","shadow":"#313131","teal-action":"#1EAEDB",":-`open-sans`-\u2014-used-for-some-button-for":"#FFC000","transparent-ghost":"#FFFFFF","white-filled":"#FFFFFF","black-filled":"#000000","gray-neutral":"#969696","desktop":"#969696","base-unit":"#000000"},"fonts":["LamboType","Open Sans"],"source":"prose","radius":null},"linear.app":{"name":"Linear","description":"A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text (#f7f8f8), and the signature Linear la","colors":{"primary":"#5e6ad2","on-primary":"#ffffff","primary-hover":"#828fff","primary-focus":"#5e69d1","ink":"#f7f8f8","ink-muted":"#d0d6e0","ink-subtle":"#8a8f98","ink-tertiary":"#62666d","canvas":"#010102","surface-1":"#0f1011","surface-2":"#141516","surface-3":"#18191a","surface-4":"#191a1b","hairline":"#23252a","hairline-strong":"#34343a","hairline-tertiary":"#3e3e44","inverse-canvas":"#ffffff","inverse-surface-1":"#f5f6f6","inverse-surface-2":"#f6f7f7","inverse-ink":"#000000","brand-secure":"#7a7fad","semantic-success":"#27a644","semantic-overlay":"#000000"},"fonts":["Linear Display","Linear Text","Linear Mono"],"source":"yaml","radius":8},"lovable":{"name":"Design System Inspired by Lovable","description":"# Design System Inspired by Lovable\n\n## 1. Visual Theme & Atmosphere\n\nLovable's website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned backgro","colors":{"key-characteristics:":"#f7f4ed","cream":"#f7f4ed","charcoal":"#1c1c1c","off-white":"#fcfbf8","charcoal-100%":"#1c1c1c","(`rgba(28,28,28,0.82)`):-body-copy.\n-":"#5f5f5d","(`rgba(28,28,28,0.03)`):-barely-visible-":"#eceae4","cream-surface":"#f7f4ed","ring-blue":"#3b82f6",":-`camera-plain-variable`,-with-fallback":"#1c1c1c","ghost---outline":"#1c1c1c","pill---icon-button":"#f7f4ed","ai-chat-input":"#eceae4",":-footer-uses-`1px-solid-#eceae4`-border":"#eceae4"},"fonts":["Camera Plain Variable"],"source":"prose","radius":null},"mastercard":{"name":"Design System Inspired by Mastercard","description":"# Design System Inspired by Mastercard\n\n## 1. Visual Theme & Atmosphere\n\nMastercard's experience reads like a warm, editorial magazine built from soft stone and signal orange. The ","colors":{"oversized-radius":"#F3F0EE","mastercard-red":"#EB001B","mastercard-yellow":"#F79E1B","ink-black":"#141413","signal-orange":"#CF4500","light-signal-orange":"#F37338","clay-brown":"#9A3A0A","canvas-cream":"#F3F0EE","lifted-cream":"#FCFBFA","white":"#FFFFFF","soft-bone":"#F4F4F4","charcoal":"#262627","slate-gray":"#696969","granite":"#555555","graphite":"#565656","dust-taupe":"#D1CDC7","link-blue":"#3860BE","(use-`font-weight:-450`-with-variable-fo":"#141413","secondary-\u2014-outlined-pill":"#FFFFFF","consent---signal-\u2014-orange-pill":"#CF4500","do-not":"#FFFFFF","icon-only-circle-button-(carousel,-play-":"#000000","service---solution-portrait-card":"#E8E2DA",".-the-middle-ground-of-8\u201312-is-absent,-w":"#F3F0EE","nav":"#141413"},"fonts":["MarkForMC","MarkOffcForMC"],"source":"prose","radius":null},"meta":{"name":"Meta","description":"Meta's design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising voice. The system pairs a stark white can","colors":{"primary":"#0064e0","primary-deep":"#0457cb","primary-soft":"#0091ff","on-primary":"#ffffff","ink-button":"#000000","on-ink-button":"#ffffff","fb-blue":"#1876f2","meta-link":"#385898","oculus-purple":"#a121ce","success":"#31a24c","success-bg":"#24e400","attention":"#f2a918","warning":"#f7b928","warning-bg":"#ffe200","critical":"#e41e3f","critical-strong":"#f0284a","canvas":"#ffffff","surface-soft":"#f1f4f7","ink-deep":"#0a1317","ink":"#1c1e21","charcoal":"#444950","slate":"#4b4c4f","steel":"#5d6c7b","stone":"#8595a4","hairline":"#ced0d4","hairline-soft":"#dee3e9","disabled-text":"#bcc0c4"},"fonts":["Optimistic VF"],"source":"yaml","radius":6},"minimax":{"name":"MiniMax","description":"MiniMax presents itself as a premium AI infrastructure brand through a striking duality \u2014 bold black-pill CTAs and stark white canvas for marketing, paired with vibrant gradient pr","colors":{"primary":"#0a0a0a","on-primary":"#ffffff","primary-soft":"#181e25","brand-coral":"#ff5530","brand-magenta":"#ea5ec1","brand-blue":"#1456f0","brand-blue-mid":"#3b82f6","brand-blue-deep":"#1d4ed8","brand-blue-700":"#17437d","brand-cyan":"#3daeff","brand-blue-200":"#bfdbfe","brand-purple":"#a855f7","canvas":"#ffffff","surface":"#f7f8fa","surface-soft":"#f2f3f5","hairline":"#e5e7eb","hairline-soft":"#eaecf0","ink":"#0a0a0a","ink-strong":"#000000","charcoal":"#222222","slate":"#45515e","steel":"#5f5f5f","stone":"#8e8e93","muted":"#a8aab2","success-bg":"#e8ffea","success-text":"#1ba673","on-dark":"#ffffff","footer-bg":"#0a0a0a"},"fonts":["DM Sans"],"source":"yaml","radius":8},"mintlify":{"name":"Mintlify","description":"Mintlify presents documentation infrastructure with a dual-mode aesthetic \u2014 atmospheric sky-gradient marketing heroes (cloud illustration backdrops, soft cream-to-blue washes) pair","colors":{"primary":"#0a0a0a","on-primary":"#ffffff","brand-green":"#00d4a4","brand-green-deep":"#00b48a","brand-green-soft":"#7cebcb","brand-tag":"#3772cf","brand-warn":"#c37d0d","brand-annotate":"#1ba673","brand-error":"#d45656","brand-cursor":"#888888","hero-sky-from":"#87a8c8","hero-sky-to":"#f5e9d8","hero-dark-from":"#1a3d4a","hero-dark-to":"#2d5a4f","testimonial-orange":"#f55a3c","testimonial-orange-deep":"#cc3a1f","canvas":"#ffffff","canvas-dark":"#0a0a0a","surface":"#f7f7f7","surface-soft":"#fafafa","surface-code":"#1c1c1e","hairline":"#e5e5e5","hairline-soft":"#ededed","hairline-dark":"#1f1f1f","ink":"#0a0a0a","charcoal":"#1c1c1e","slate":"#3a3a3c","steel":"#5a5a5c","stone":"#888888","muted":"#a8a8aa"},"fonts":["Inter","Geist Mono"],"source":"yaml","radius":8},"miro":{"name":"Miro","description":"Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice \u2014 anchored by its signature canary yellow ({colors.brand-yellow}) wordmark o","colors":{"primary":"#1c1c1e","on-primary":"#ffffff","brand-yellow":"#ffd02f","brand-yellow-deep":"#fcb900","yellow-light":"#fff4c4","yellow-dark":"#746019","brand-blue":"#4262ff","blue-450":"#5b76fe","blue-pressed":"#2a41b6","brand-coral":"#ff9999","coral-light":"#ffc6c6","coral-dark":"#600000","brand-rose":"#ffd8f4","rose-light":"#fde0f0","brand-pink":"#fde0f0","brand-teal":"#0fbcb0","teal-light":"#c3faf5","moss-dark":"#187574","brand-orange-light":"#ffe6cd","brand-red":"#fbd4d4","brand-red-dark":"#e3c5c5","success-accent":"#00b473","canvas":"#ffffff","surface":"#f7f8fa","surface-soft":"#fafbfc","surface-yellow":"#fff8e0","surface-pricing-featured":"#f5f3ff","hairline":"#e0e2e8","hairline-soft":"#eef0f3","hairline-strong":"#c7cad5"},"fonts":["Roobert PRO"],"source":"yaml","radius":8},"mistral.ai":{"name":"Mistral AI","description":"Mistral AI brands itself with a singular signature \u2014 atmospheric sunset gradients (mustard, orange, deep red) layered over photography of mountains, plus a horizontal \"sunset strip","colors":{"primary":"#fa520f","primary-deep":"#cc3a05","on-primary":"#ffffff","sunshine-300":"#ffd06a","sunshine-500":"#ffb83e","sunshine-700":"#ffa110","sunshine-800":"#ff8105","sunshine-900":"#ff8a00","yellow-saturated":"#ffd900","cream":"#fff8e0","cream-light":"#fffaeb","cream-deeper":"#fff0c2","beige-deep":"#e6d5a8","block-5":"#ffe295","block-6":"#ffd900","block-7":"#ff8105","ink":"#1f1f1f","ink-tint":"#3d3d3d","charcoal":"#2c2c2c","slate":"#4a4a4a","steel":"#6a6a6a","stone":"#8a8a8a","muted":"#a8a8a8","hairline":"#e5e5e5","hairline-soft":"#ededed","hairline-strong":"#c7c7c7","canvas":"#ffffff","surface":"#fafafa","surface-cream":"#fff8e0","surface-cream-soft":"#fffaeb"},"fonts":["PP Editorial Old","Inter","JetBrains Mono"],"source":"yaml","radius":8},"mongodb":{"name":"MongoDB","description":"MongoDB carries a strong dual-mode visual identity \u2014 dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired with stark white documentation surfaces.","colors":{"primary":"#00ed64","primary-deep":"#00b545","primary-pressed":"#008c34","on-primary":"#001e2b","brand-green":"#00ed64","brand-green-dark":"#00684a","brand-green-mid":"#00a35c","brand-green-soft":"#c3f0d2","brand-teal-deep":"#001e2b","brand-teal":"#003d4f","brand-teal-mid":"#00684a","accent-purple":"#7b3ff2","accent-orange":"#fa6e39","accent-pink":"#f06bb8","accent-blue":"#3d4f9f","semantic-warning-bg":"#fff8e0","semantic-warning-text":"#946f3f","canvas":"#ffffff","canvas-dark":"#001e2b","surface":"#f9fbfa","surface-soft":"#f4f7f6","surface-feature":"#e3fcef","hairline":"#e1e5e8","hairline-soft":"#eceff1","hairline-strong":"#c1ccd6","hairline-dark":"#1c2d38","ink":"#001e2b","charcoal":"#1c2d38","slate":"#3d4f5b","steel":"#5c6c7a"},"fonts":["Euclid Circular A","Source Code Pro"],"source":"yaml","radius":8},"nike":{"name":"Nike","description":"A photography-first commerce system built on extreme typographic contrast \u2014 towering uppercase Futura display lockups burned into editorial campaign imagery, sitting above a dense,","colors":{"primary":"#111111","on-primary":"#ffffff","canvas":"#ffffff","soft-cloud":"#f5f5f5","ink":"#111111","charcoal":"#39393b","ash":"#4b4b4d","mute":"#707072","stone":"#9e9ea0","hairline":"#cacacb","hairline-soft":"#e5e5e5","sale":"#d30005","sale-deep":"#780700","success":"#007d48","success-bright":"#1eaa52","info":"#1151ff","info-deep":"#0034e3","accent-pink":"#ed1aa0","accent-pink-soft":"#ffb0dd","accent-purple-soft":"#beaffd","accent-purple-pale":"#d6d1ff","accent-teal":"#0a7281","accent-pink-deep":"#4c012d"},"fonts":["Nike Futura ND","Helvetica Now Display Medium","Helvetica Now Text"],"source":"yaml","radius":24},"notion":{"name":"Notion","description":"Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice \u2014 anchored by a deep navy hero band ({colors.brand-navy}) decorated with brand","colors":{"primary":"#5645d4","primary-pressed":"#4534b3","primary-deep":"#3a2a99","on-primary":"#ffffff","brand-navy":"#0a1530","brand-navy-deep":"#070f24","brand-navy-mid":"#1a2a52","link-blue":"#0075de","link-blue-pressed":"#005bab","brand-orange":"#dd5b00","brand-orange-deep":"#793400","brand-pink":"#ff64c8","brand-pink-deep":"#a02e6d","brand-purple":"#7b3ff2","brand-purple-300":"#d6b6f6","brand-purple-800":"#391c57","brand-teal":"#2a9d99","brand-green":"#1aae39","brand-yellow":"#f5d75e","brand-brown":"#523410","card-tint-peach":"#ffe8d4","card-tint-rose":"#fde0ec","card-tint-mint":"#d9f3e1","card-tint-lavender":"#e6e0f5","card-tint-sky":"#dcecfa","card-tint-yellow":"#fef7d6","card-tint-yellow-bold":"#f9e79f","card-tint-cream":"#f8f5e8","card-tint-gray":"#f0eeec","canvas":"#ffffff"},"fonts":["Notion Sans"],"source":"yaml","radius":8},"nvidia":{"name":"NVIDIA","description":"An engineering-grade marketing system organized around two surface modes \u2014 a deep black canvas for hero and footer chapters and a flat paper-white canvas for body content \u2014 connect","colors":{"primary":"#76b900","on-primary":"#000000","primary-dark":"#5a8d00","ink":"#000000","canvas":"#ffffff","surface-dark":"#000000","surface-soft":"#f7f7f7","surface-elevated":"#1a1a1a","hairline":"#cccccc","hairline-strong":"#5e5e5e","body":"#1a1a1a","mute":"#757575","stone":"#898989","ash":"#a7a7a7","on-dark":"#ffffff","on-dark-mute":"rgba(255,255,255,0.7)","link-blue":"#0046a4","blue-700":"#0046a4","error":"#e52020","error-deep":"#650b0b","warning":"#df6500","warning-bright":"#ef9100","success-deep":"#3f8500","accent-yellow-pale":"#feeeb2","accent-purple":"#952fc6","accent-purple-deep":"#4d1368","accent-purple-pale":"#f9d4ff","accent-green-pale":"#bff230"},"fonts":["NVIDIA-EMEA"],"source":"yaml","radius":2},"ollama":{"name":"Ollama","description":"An almost defiantly minimal documentation-first system that treats the home page like a Markdown README \u2014 paper-white canvas, 36px center-aligned heading, a single black pill CTA, ","colors":{"primary":"#000000","on-primary":"#ffffff","ink":"#000000","ink-deep":"#090909","charcoal":"#525252","body":"#737373","mute":"#a3a3a3","canvas":"#ffffff","surface-soft":"#fafafa","surface-card":"#ffffff","hairline":"#e5e5e5","hairline-strong":"#d4d4d4","on-dark":"#ffffff","on-dark-mute":"rgba(255,255,255,0.7)","surface-dark":"#171717","focus-ring":"rgba(59,130,246,0.5)","link":"#000000","link-mute":"#737373","terminal-red":"#ff5f56","terminal-yellow":"#ffbd2e","terminal-green":"#27c93f"},"fonts":["SF Pro Rounded","ui-sans-serif","ui-monospace"],"source":"yaml","radius":8},"opencode.ai":{"name":"OpenCode","description":"A terminal-native marketing system rendered entirely in Berkeley Mono \u2014 every word on the page, from the hero headline down to the footer fine print, is monospaced. The page itself","colors":{"primary":"#201d1d","on-primary":"#fdfcfc","ink":"#201d1d","ink-deep":"#0f0000","charcoal":"#302c2c","body":"#424245","mute":"#646262","stone":"#6e6e73","ash":"#9a9898","canvas":"#fdfcfc","surface-soft":"#f8f7f7","surface-card":"#f1eeee","surface-dark":"#201d1d","surface-dark-elevated":"#302c2c","hairline":"rgba(15,0,0,0.12)","hairline-strong":"#646262","on-dark":"#fdfcfc","on-dark-mute":"#9a9898","accent":"#007aff","accent-hover":"#0056b3","accent-active":"#004085","warning":"#ff9f0a","warning-hover":"#cc7f08","warning-active":"#995f06","danger":"#ff3b30","danger-hover":"#d70015","danger-active":"#a50011","success":"#30d158"},"fonts":["Berkeley Mono"],"source":"yaml","radius":4},"pinterest":{"name":"Pinterest","description":"A photography-first discovery system organized around the Pinterest Red CTA, the masonry pin grid, and a soft warm-cream chrome that gets out of the imagery's way. The home page is","colors":{"primary":"#e60023","on-primary":"#ffffff","primary-pressed":"#cc001f","ink":"#000000","ink-soft":"#211922","body":"#33332e","charcoal":"#262622","mute":"#62625b","ash":"#91918c","stone":"#c8c8c1","hairline":"#dadad3","hairline-soft":"#e5e5e0","on-secondary":"#000000","secondary-bg":"#e5e5e0","secondary-pressed":"#c8c8c1","canvas":"#ffffff","surface-soft":"#fbfbf9","surface-card":"#f6f6f3","surface-elevated":"#ffffff","on-dark":"#ffffff","on-dark-mute":"rgba(255,255,255,0.7)","surface-dark":"#262622","focus-outer":"#435ee5","focus-inner":"#ffffff","accent-pressed-blue":"#617bff","accent-purple":"#7e238b","accent-purple-deep":"#6845ab","success-deep":"#103c25","success-pale":"#c7f0da","error":"#9e0a0a"},"fonts":["Pin Sans"],"source":"yaml","radius":16},"playstation":{"name":"PlayStation","description":"A three-surface marketing system organized around alternating black, white, and PlayStation Blue chapters that scroll past the viewer like a console launch trailer. Each section ha","colors":{"primary":"#0070d1","primary-pressed":"#0064b7","primary-active":"#004d8d","on-primary":"#ffffff","link-light":"#0064b7","link-dark":"#53b1ff","commerce":"#d53b00","commerce-pressed":"#aa2f00","commerce-link-base":"#d63d00","on-commerce":"#ffffff","ink":"#000000","ink-deep":"#121314","ink-elevated":"#181818","charcoal":"#1f2024","body-light":"rgba(0,0,0,0.6)","mute-light":"#6b6b6b","ash-light":"#cccccc","body-dark":"rgba(255,255,255,0.7)","mute-dark":"rgba(229,229,229,0.55)","ash-dark":"rgba(229,229,229,0.2)","canvas-light":"#ffffff","surface-soft":"#f3f3f3","surface-card":"#f5f7fa","surface-filter":"rgba(245,247,250,0.3)","canvas-dark":"#000000","surface-dark-elevated":"#121314","surface-dark-card":"#181818","hairline-light":"#f3f3f3","hairline-dark":"rgba(229,229,229,0.2)","on-dark":"#ffffff"},"fonts":["PlayStation SST"],"source":"yaml","radius":8},"posthog":{"name":"PostHog","description":"A playful developer-tools system rendered on a warm cream canvas with hand-drawn hedgehog mascots dotted across every page like marginalia in a sketchbook. The chrome reads like a ","colors":{"primary":"#f7a501","primary-pressed":"#dd9001","primary-active":"#b17816","on-primary":"#23251d","ink":"#23251d","body":"#4d4f46","charcoal":"#33342d","mute":"#6c6e63","ash":"#9b9c92","stone":"#b6b7af","hairline":"#bfc1b7","hairline-soft":"#dcdfd2","on-dark":"#ffffff","canvas":"#eeefe9","surface-soft":"#e5e7e0","surface-card":"#ffffff","surface-doc":"#fcfcfa","surface-dark":"#23251d","link-blue":"#1d4ed8","link-teal":"#1078a3","accent-blue":"#2c84e0","accent-blue-soft":"#dceaf6","accent-red":"#cd4239","accent-red-soft":"#f7d6d3","accent-green":"#2c8c66","accent-green-soft":"#d9eddf","accent-purple":"#7c44a6","accent-purple-soft":"#e7d8ee","focus-ring":"rgba(59,130,246,0.5)"},"fonts":["IBM Plex Sans Variable","ui-monospace","Source Code Pro"],"source":"yaml","radius":6},"raycast":{"name":"raycast","description":"","colors":{"primary":"#ffffff","primary-pressed":"#e8e8e8","on-primary":"#000000","ink":"#f4f4f6","body":"#cdcdcd","charcoal":"#d3d3d4","mute":"#9c9c9d","ash":"#6a6b6c","stone":"#434345","on-dark":"#ffffff","canvas":"#07080a","surface":"#0d0d0d","surface-elevated":"#101111","surface-card":"#121212","button-fg":"#18191a","hairline":"#242728","accent-blue":"#57c1ff","accent-red":"#ff6161","accent-green":"#59d499","accent-yellow":"#ffc533","hero-stripe-start":"#ff5757","hero-stripe-end":"#a1131a","key-bg-start":"#121212","key-bg-end":"#0d0d0d"},"fonts":["Inter Fallback"],"source":"yaml_error","radius":null},"renault":{"name":"Renault","description":"Renault's web presence pairs the freshly-modernised Renault diamond\n(the 2021 flat-line rhombus mark) with a stark black-and-white canvas, a\nsignature Sunlight Yellow accent, and t","colors":{"primary":"#ffed00","primary-deep":"#e6d200","on-primary":"#000000","ink":"#000000","body":"#222222","charcoal":"#333333","mute":"#666666","ash":"#8a8a8a","stone":"#c4c4c4","on-dark":"#ffffff","on-dark-mute":"rgba(255,255,255,0.72)","canvas":"#ffffff","surface-soft":"#f7f7f7","surface-card":"#ffffff","surface-dark":"#000000","surface-deep":"#111111","hairline":"#f2f2f2","hairline-strong":"#000000","divider-dark":"rgba(255,255,255,0.16)","badge-new":"#ffed00","link":"#0000ee","error":"#be6464","warning":"#f0ad4e","success":"#8dc572","info":"#337ab7"},"fonts":["NouvelR"],"source":"yaml","radius":4},"replicate":{"name":"Replicate","description":"Replicate's marketing surfaces pair the warm-cream developer-tools aesthetic\nof an indie ML playground with a confident hot-orange brand accent and a\nsignature display typeface (rb","colors":{"primary":"#ea2804","primary-deep":"#c01f00","on-primary":"#ffffff","ink":"#202020","body":"#3a3a3a","charcoal":"#575757","mute":"#646464","ash":"#8d8d8d","stone":"#bbbbbb","on-dark":"#fcfcfc","on-dark-mute":"rgba(252,252,252,0.72)","canvas":"#f9f7f3","surface-bone":"#f3f0e8","surface-card":"#ffffff","surface-dark":"#202020","surface-deep":"#000000","hairline":"rgba(32,32,32,0.12)","hairline-strong":"#202020","divider-dark":"rgba(255,255,255,0.2)","hero-warm":"#ea2804","hero-glow":"#ff6a3d","hero-pink":"#f4a8a0","badge-success":"#2b9a66","link":"#ea2804","ring-focus":"rgba(59,130,246,0.5)","github-dark":"#24292e"},"fonts":["rb-freigeist-neue","basier-square","jetbrains-mono"],"source":"yaml","radius":10},"resend":{"name":"Resend","description":"Resend's marketing surfaces sit on a near-pure black canvas with off-white\ntext and a single signature color \u2014 the deep editorial-serif Domaine\nDisplay headline mark \u2014 that gives a","colors":{"primary":"#fcfdff","primary-on":"#000000","ink":"#fcfdff","body":"rgba(252,253,255,0.86)","charcoal":"rgba(252,253,255,0.7)","mute":"#a1a4a5","ash":"#888e90","stone":"#464a4d","on-light":"#000000","on-light-mute":"rgba(0,0,51,0.7)","canvas":"#000000","surface-card":"#0a0a0c","surface-elevated":"#101012","surface-deep":"#06060a","hairline":"rgba(255,255,255,0.06)","hairline-strong":"rgba(255,255,255,0.14)","divider-soft":"rgba(255,255,255,0.04)","accent-orange":"#ff801f","accent-orange-glow":"rgba(255,89,0,0.22)","accent-yellow":"#ffc53d","accent-blue":"#3b9eff","accent-blue-glow":"rgba(0,117,255,0.34)","accent-green":"#11ff99","accent-green-glow":"rgba(34,255,153,0.18)","accent-red":"#ff2047","accent-red-glow":"rgba(255,32,71,0.34)","link":"#3b9eff","surface-light":"#f1f7fe"},"fonts":["Domaine Display","ABC Favorit","Inter"],"source":"yaml","radius":8},"revolut":{"name":"Revolut","description":"Revolut's marketing surfaces pair a stark black canvas with the brand's\ncobalt-violet (`#494fdf`) and a wide accent palette of deep, fully-saturated\nproduct colours \u2014 teal, light-b","colors":{"primary":"#494fdf","primary-bright":"#4f55f1","primary-deep":"#3a40c4","on-primary":"#ffffff","ink":"#191c1f","body":"#1f2226","charcoal":"#3a3d40","mute":"#505a63","ash":"#5c5e60","stone":"#8d969e","faint":"#c9c9cd","on-dark":"#ffffff","on-dark-mute":"rgba(255,255,255,0.72)","canvas-light":"#ffffff","canvas-dark":"#000000","surface-soft":"#f4f4f4","surface-card":"#ffffff","surface-deep":"#0a0a0a","surface-elevated":"#16181a","hairline-light":"#e2e2e7","hairline-dark":"rgba(255,255,255,0.12)","hairline-strong":"#191c1f","divider-soft":"rgba(255,255,255,0.06)","accent-teal":"#00a87e","accent-blue-link":"#376cd5","accent-light-blue":"#007bc2","accent-light-green":"#428619","accent-green-text":"#006400","accent-yellow":"#b09000","accent-warning":"#ec7e00"},"fonts":["Aeonik Pro","Inter"],"source":"yaml","radius":12},"runwayml":{"name":"Design System Inspired by Runway","description":"# Design System Inspired by Runway\n\n## 1. Visual Theme & Atmosphere\n\nRunway's interface is a cinematic reel brought to life as a website \u2014 a dark, editorial, film-production-grade ","colors":{"key-characteristics:":"#000000","deep-black":"#030303","dark-surface":"#1a1a1a","pure-white":"#ffffff","near-white":"#fefefe","cool-cloud":"#e9ecf2","border-dark":"#27272a","charcoal":"#404040","near-charcoal":"#3f3f3f","cool-slate":"#767d88","mid-slate":"#7d848e","muted-gray":"#a7a7a7","cool-silver":"#c9ccd1","light-silver":"#d0d4d4","tailwind-gray":"#6b7280","dark-link":"#0c0c0c","footer-gray":"#999999"},"fonts":[],"source":"prose","radius":null},"sanity":{"name":"Design System Inspired by Sanity","description":"# Design System Inspired by Sanity\n\n## 1. Visual Theme & Atmosphere\n\nSanity's website is a developer-content platform rendered as a nocturnal command center -- dark, precise, and d","colors":{"key-characteristics:":"#0b0b0b","sanity-black":"#0b0b0b","pure-black":"#000000","sanity-red":"#f36458","electric-blue":"#0052ef","light-blue":"#55beff","(`color(display-p3-.960784-0-1)`):-a-viv":"#0b0b0b","dark-gray":"#212121","medium-dark":"#353535","pure-white":"#ffffff","light-gray":"#ededed","white":"#ffffff","silver":"#b9b9b9","medium-gray":"#797979","charcoal":"#212121","near-black-text":"#0b0b0b","error-red":"#dd0000","gpc-green":"#37cd84","focus-ring-blue":"#0052ef","dark-border":"#0b0b0b","subtle-border":"#212121","medium-border":"#353535","light-border":"#ffffff",":-ibm-plex-mono-captions-and-small-label":"#f36458","secondary-(dark-pill)":"#0b0b0b","outlined-(light-pill)":"#ffffff","ghost---subtle":"#212121","uppercase-label-button":"#212121","dark-content-card":"#212121","feature-card-(full-bleed)":"#0b0b0b","text-input---textarea":"#0b0b0b","search-input":"#0b0b0b","top-navigation":"#0b0b0b","footer":"#0b0b0b","neutral-subtle":"#ffffff","neutral-filled":"#0b0b0b","8px":"#212121","colorimetric":"#0b0b0b",":-horizontal-scroll-with-preserved-monos":"#0b0b0b","add-structure":"#212121","apply-typography":"#f36458","refine-spacing":"#0052ef"},"fonts":["IBM Plex Mono","Helvetica"],"source":"prose","radius":null},"sentry":{"name":"Sentri Inspired","description":"An inspired interpretation of Sentri's design language \u2014 a developer-tools brand built on a deep purple-violet midnight canvas, electric lime accents, and a slightly subversive ill","colors":{"primary":"#150f23","ink-deep":"#1f1633","on-primary":"#ffffff","accent-lime":"#c2ef4e","accent-pink":"#fa7faa","accent-violet":"#6a5fc1","accent-violet-deep":"#422082","accent-violet-mid":"#79628c","surface-canvas-dark":"#1f1633","surface-canvas-light":"#ffffff","surface-night":"#150f23","surface-press-light":"#f0f0f0","surface-press-stronger":"#efefef","hairline-violet":"#362d59","hairline-cool":"#cfcfdb","hairline-cloud":"#e5e7eb","ink":"#1f1633","ink-press":"#1a1a1a","on-dark-muted":"#bdb8c0","on-dark-faint":"#3f3849","ring-focus":"#9dc1f5"},"fonts":["Sentri Display","Rubik","Monaco"],"source":"yaml","radius":8},"shopify":{"name":"Shopifi Inspired","description":"An inspired interpretation of Shopifi's design language \u2014 a cinematic commerce platform that runs two parallel design tracks. The marketing-hero and product-narrative pages live on","colors":{"primary":"#000000","ink":"#000000","on-primary":"#ffffff","on-dark":"#ffffff","canvas-night":"#000000","canvas-night-elevated":"#0a0a0a","canvas-light":"#ffffff","canvas-cream":"#fbfbf5","surface-elevated-dark":"#1e2c31","shade-30":"#d4d4d8","shade-40":"#a1a1aa","shade-50":"#71717a","shade-60":"#52525b","shade-70":"#3f3f46","hairline-light":"#e4e4e7","hairline-dark":"#1e2c31","aloe-10":"#c1fbd4","pistachio-10":"#d4f9e0","link-cool-1":"#9dabad","link-cool-2":"#9797a2","link-cool-3":"#bdbdca","link-mint":"#99b3ad"},"fonts":["NeueHaasGrotesk Display","Inter Variable","ui-monospace"],"source":"yaml","radius":8},"slack":{"name":"Slacc Inspired","description":"An inspired interpretation of Slacc's design language \u2014 a workplace messaging brand built on a deep aubergine primary, with cream-lavender hero gradients, blue inline links, and pi","colors":{"primary":"#4a154b","primary-deep":"#481a54","primary-press":"#611f69","primary-tint":"#592466","on-primary":"#ffffff","ink":"#1d1d1d","ink-mute":"#696969","link-blue":"#1264a3","link-hover":"#3860be","canvas":"#ffffff","canvas-cream":"#f4ede4","canvas-lavender":"#f9f0ff","surface-elev":"#ffffff","surface-aubergine":"#4a154b","hairline":"#e6e6e6","hairline-strong":"#000000","semantic-error":"#cc4117","semantic-success":"#007a5a","on-aubergine-mute":"#d9bdde"},"fonts":["Salesforce-Avant-Garde","Salesforce-Sans"],"source":"yaml","radius":8},"spacex":{"name":"spacex","description":"","colors":{"primary":"#000000","ink":"#000000","on-primary":"#ffffff","on-primary-mute":"#f0f0fa","canvas-night":"#000000","canvas-night-soft":"#0a0a0a","canvas-light":"#ffffff","canvas-cool":"#f0f0fa","hairline-on-dark":"#3a3a3f","hairline-on-light":"#e0e0e8","link-on-dark":"#ffffff","link-blue-fallback":"#0000ee","ink-mute":"#5a5a5f"},"fonts":[],"source":"yaml_error","radius":null},"spotify":{"name":"Design System Inspired by Spotify","description":"# Design System Inspired by Spotify\n\n## 1. Visual Theme & Atmosphere\n\nSpotify's web interface is a dark, immersive music player that wraps listeners in a near-black cocoon (`#12121","colors":{"key-characteristics:":"#121212","spotify-green":"#1ed760","near-black":"#121212","dark-surface":"#181818","mid-dark":"#1f1f1f","white":"#ffffff","silver":"#b3b3b3","near-white":"#cbcbcb","light":"#fdfdfd","negative-red":"#f3727f","warning-orange":"#ffa42b","announcement-blue":"#539df5","dark-card":"#252525","mid-card":"#272727","border-gray":"#4d4d4d","light-border":"#7c7c7c","separator":"#b3b3b3","light-surface":"#eeeeee","spotify-green-border":"#1db954",":-`spotifymixui`,-same-fallback-stack\n\n#":"#1f1f1f","dark-large-pill":"#181818","light-pill":"#eeeeee","outlined-pill":"#ffffff","circular-play":"#1f1f1f","dark-compression":"#121212","shadow-philosophy":"#121212"},"fonts":["SpotifyMixUITitle","SpotifyMixUI"],"source":"prose","radius":null},"starbucks":{"name":"Design System Inspired by Starbucks","description":"# Design System Inspired by Starbucks\n\n## 1. Visual Theme & Atmosphere\n\nStarbucks' design system is a **warm, confident retail flagship** wearing the green of their storefront apro","colors":{"warm,-confident-retail-flagship":"#f2f0eb","starbucks-green":"#006241","typeface-(custom-to-starbucks)-sits-acro":"#f2f0eb","\u2014-every-card-is-a-distinct-illustrated-p":"#1E3932","source-pages-analyzed:":"#006241","green-accent":"#00754A","house-green":"#1E3932","green-uplift":"#2b5148","green-light":"#d4e9e2","gold":"#cba258","gold-light":"#dfc49d","gold-lightest":"#faf6ee","white":"#ffffff","neutral-cool":"#f9f9f9","neutral-warm":"#f2f0eb","primary-page-canvas":"#edebe9","black":"#000000","(`rgba(255,-255,-255,-0.70)`):-secondary":"#33433d","red":"#c82014","yellow":"#fbbc05","\u2014-warmer,-good-for-a-\"caf\u00e9\"-brand-substi":"#00754A","2.-primary-outlined-\u2014-\"give-them-a-try--":"#00754A","3.-black-filled-\u2014-\"join-now\"":"#000000","--background:-transparent\n--text:-`rgba(":"#ffffff","6.-outlined-on-dark-\u2014-\"learn-more---orde":"#ffffff","--background:-`rgb(0,-130,-72)`-(a-speci":"#00754A","9.-full-width-feedback-tab-\u2014-\"provide-fe":"#00754A","content-card-(default)":"#ffffff","--background:-illustrated-photography-fi":"#1E3932","partnership-card-(rewards)":"#faf6ee","dropdown-menu-(account-dropdown,-top-nav":"#f9f9f9","--horizontal-row-of-4-cup-icon-buttons-(":"#ffffff","--embedded-inside-an-add-in-row-when-a-q":"#ffffff","add-to-order-button-(pdp)":"#00754A","--background:-transparent\n--border:-`1px":"#1E3932","--\"menu---refreshers---pink-energy-drink":"#00754A","`1.6rem`-(16px)-appears-across-every-pag":"#f2f0eb"},"fonts":[],"source":"prose","radius":null},"stripe":{"name":"Stripi Inspired","description":"An inspired interpretation of Stripi's design language \u2014 a financial-infrastructure brand built on a deep navy ink, an electric indigo primary, and a recurring atmospheric gradient","colors":{"primary":"#533afd","primary-deep":"#4434d4","primary-press":"#2e2b8c","primary-soft":"#665efd","primary-bg-subdued-hover":"#b9b9f9","brand-dark-900":"#1c1e54","ink":"#0d253d","ink-secondary":"#273951","ink-mute":"#64748d","ink-mute-2":"#61718a","on-primary":"#ffffff","canvas":"#ffffff","canvas-soft":"#f6f9fc","canvas-cream":"#f5e9d4","hairline":"#e3e8ee","hairline-input":"#a8c3de","ruby":"#ea2261","magenta":"#f96bee","lemon":"#9b6829","shadow-blue":"#003770"},"fonts":["sohne-var"],"source":"yaml","radius":8},"supabase":{"name":"supabase","description":"","colors":{"primary":"#3ecf8e","primary-deep":"#24b47e","primary-soft":"#4ade80","ink":"#171717","ink-secondary":"#212121","ink-mute":"#707070","ink-mute-2":"#9a9a9a","ink-faint":"#b2b2b2","on-primary":"#171717","on-dark":"#ffffff","canvas":"#ffffff","canvas-soft":"#fafafa","canvas-night":"#1c1c1c","canvas-night-soft":"#202020","hairline":"#dfdfdf","hairline-strong":"#c7c7c7","hairline-cool":"#ededed","hairline-cool-2":"#efefef","hairline-cool-3":"#d4d4d4","accent-purple":"#6b01c2","accent-violet":"#644fc1","accent-purple-soft":"#eddbf9","accent-yellow":"#ffdb13","accent-tomato":"#ff2201","accent-pink":"#c7007e","accent-indigo":"#054cff","accent-crimson":"#e2005a"},"fonts":["Circular","Helvetica Neue"],"source":"yaml_error","radius":null},"superhuman":{"name":"Superhumon Inspired","description":"An inspired interpretation of Superhumon's design language \u2014 a fast-email productivity brand split between an editorial dark hero (deep indigo navy with violet-sky atmospheric back","colors":{"primary":"#1b1938","primary-deep":"#0e0c1f","on-primary":"#ffffff","ink":"#292827","ink-mute":"#73706d","ink-faint":"#9a9794","canvas":"#ffffff","canvas-soft":"#fafaf8","surface-violet-soft":"#c9b4fa","surface-teal-deep":"#0e3030","surface-teal-mid":"#155555","hairline":"#e8e4dd","hairline-dark":"#3f3a52","on-dark-mute":"#bcbac9","on-dark-faint":"#5a5772"},"fonts":["Super Sans VF"],"source":"yaml","radius":8},"tesla":{"name":"Design System Inspired by Tesla","description":"# Design System Inspired by Tesla\n\n## 1. Visual Theme & Atmosphere\n\nTesla's website is an exercise in radical subtraction \u2014 a digital showroom where the product is everything and t","colors":{"key-characteristics:":"#3E6AE1","electric-blue":"#3E6AE1","pure-white":"#FFFFFF","promo-blue":"#3E6AE1","white-canvas":"#FFFFFF","light-ash":"#F4F4F4","carbon-dark":"#171A20","(`rgba(255,-255,-255,-0.75)`):-semi-tran":"#171A20","graphite":"#393C41","pewter":"#5C5E62","silver-fog":"#8E8E8E","cloud-gray":"#EEEEEE","pale-silver":"#D0D1D2",":-`universal-sans-text`,--apple-system,-":"#3E6AE1","secondary-cta":"#FFFFFF","nav-button":"#171A20","text-link":"#5C5E62","vehicle-card":"#171A20",":-2-up-horizontal-layout-(large-left-car":"#3E6AE1"},"fonts":["Universal Sans Display","Universal Sans Text"],"source":"prose","radius":null},"theverge":{"name":"Design System Inspired by The Verge","description":"# Design System Inspired by The Verge\n\n## 1. Visual Theme & Atmosphere\n\nThe Verge's 2024 redesign feels like somebody wired a Cond\u00e9 Nast magazine to a chiptune soundboard. The canv","colors":{"storystream":"#ffffff","key-characteristics:":"#131313","jelly-mint":"#3cffd0","verge-ultraviolet":"#5200ff","console-mint-border":"#309875","deep-link-blue":"#3860be","focus-cyan":"#1eaedb","purple-rule":"#3d00bf","canvas-black":"#131313","surface-slate":"#2d2d2d","image-frame":"#313131","hazard-white":"#ffffff","absolute-black":"#000000","primary-text":"#ffffff","secondary-text":"#949494","muted-text":"#e9e9e9","inverted-text":"#131313","focus-ring":"#1eaedb","(`rgba(0,-0,-0,-0.33)`):-subtle-1px-ring":"#8c8c8c","zero-decorative-gradients":"#131313",":-positive-(0.72\u20131.9px)-for-all-caps-mon":"#3cffd0","secondary-\u2014-dark-slate-pill":"#2d2d2d","tertiary-\u2014-outlined-mint":"#3cffd0","outlined-ultraviolet-(promotional)":"#5200ff","pill-tag-(non-interactive)":"#3cffd0","storystream-tile":"#131313","feature-card-(top-story)":"#131313","storystream-rail-(timeline)":"#3d00bf","default":"#131313","focus":"#3cffd0","error":"#5200ff","transition":"#131313","wordmark":"#ffffff",":-always-rounded-to-match-the-parent-car":"#313131",":-`loading=\"lazy\"`-on-everything-below-t":"#131313","paced":"#131313","color-as-elevation":"#131313","subtle-`rgba(0,-0,-0,-0.33)`-1px-ring":"#131313","do":"#3d00bf","add-`box-shadow`-for-elevation.-use-1px-":"#3cffd0",":-accent-story-blocks-never-lose-saturat":"#3cffd0","background-(canvas)":"#131313","accent-(secondary-hazard)":"#5200ff","heading-text":"#ffffff","body-text":"#ffffff","secondary-text---metadata":"#949494","card-border":"#ffffff","link-hover":"#3860be","audit-the-canvas.":"#131313","strip-every-`box-shadow`-that-isn't-a-1p":"#3860be"},"fonts":[],"source":"prose","radius":null},"together.ai":{"name":"Design System Inspired by Together AI","description":"# Design System Inspired by Together AI\n\n## 1. Visual Theme & Atmosphere\n\nTogether AI's interface is a pastel-gradient dreamscape built for enterprise AI infrastructure \u2014 a design ","colors":{"key-characteristics:":"#010120","brand-magenta":"#ef2cc1","brand-orange":"#fc4c02","dark-blue":"#010120","soft-lavender":"#bdbbff","black-40":"#00000066","pure-white":"#ffffff","(`rgba(0,-0,-0,-0.08)`):-subtle-tinted-s":"#000000","--background:-`rgba(255,-255,-255,-0.12)":"#010120"},"fonts":["The Future","Arial","PP Neue Montreal Mono"],"source":"prose","radius":null},"uber":{"name":"Design System Inspired by Uber","description":"# Design System Inspired by Uber\n\n## 1. Visual Theme & Atmosphere\n\nUber's design language is a masterclass in confident minimalism -- a black-and-white universe where every pixel s","colors":{"key-characteristics:":"#000000","pure-white":"#ffffff","hover-gray":"#e2e2e2","hover-light":"#f3f3f3","chip-gray":"#efefef","body-gray":"#4b4b4b","muted-gray":"#afafaf","border-black":"#000000","(`rgba(0,-0,-0,-0.08)`):-inset-shadow-fo":"#0000ee","link-white":"#ffffff","link-black":"#000000","bold-headlines,-medium-body":"#000000","secondary-white":"#ffffff","chip---filter":"#efefef","floating-action":"#ffffff",":-major-sections-get-generous-vertical-s":"#000000"},"fonts":["UberMove","UberMoveText"],"source":"prose","radius":null},"vercel":{"name":"Design System Inspired by Vercel","description":"# Design System Inspired by Vercel\n\n## 1. Visual Theme & Atmosphere\n\nVercel's website is the visual thesis of developer infrastructure made invisible \u2014 a design system so restraine","colors":{"--geist-sans-with-extreme-negative-lette":"#171717","pure-white":"#ffffff","true-black":"#000000","ship-red":"#ff5b4f","preview-pink":"#de1d8d","develop-blue":"#0a72ef","console-blue":"#0070f3","console-purple":"#7928ca","console-pink":"#eb367f","link-blue":"#0072f5","(`rgba(147,-197,-253,-0.5)`):-`--tw-ring":"#171717","gray-600":"#4d4d4d","gray-500":"#666666","gray-400":"#808080","gray-100":"#ebebeb","gray-50":"#fafafa","(`hsla(0,-0%,-95%,-1)`):-`--geist-select":"#ebf5ff","badge-blue-text":"#0068d6",":-geist-mono-in-uppercase-with-`\"tnum\"`-":"#ffffff","primary-dark-(inferred-from-geist-system":"#171717","pill-button---badge":"#ebf5ff","large-pill-(navigation)":"#171717","workflow-pipeline":"#ebebeb",":-white-sections-alternate-with-white-se":"#fafafa"},"fonts":["Geist","Geist Mono"],"source":"prose","radius":null},"vodafone":{"name":"Design System Inspired by Vodafone","description":"# Design System Inspired by Vodafone\n\n## 1. Visual Theme & Atmosphere\n\nVodafone's corporate web system carries the confident, broadcast-scale presence of a global telecom brand \u2014 b","colors":{"key-characteristics:":"#e60000","vodafone-red":"#e60000","pure-white":"#ffffff","signal-blue":"#3860be","deep-brand-red-shade":"#ac1811","canvas-white":"#ffffff","light-neutral":"#f2f2f2","charcoal-institutional-panel":"#25282b","(`rgba(255,255,255,0.1)`):-a-soft-glass-":"#25282b","secondary-body-grey":"#7e7e7e","form-text-grey":"#333333","disabled-grey":"#bebebe","(`rgba(255,255,255,0.25)`):-hairline-col":"#e60000","tag-pill-red-border":"#e60000",":-`font-smoothing:-antialiased`-across-t":"#e60000","primary-red-pill":"#e60000","ghost-white-rectangle":"#ffffff","(inline-within-editorial-cards-\u2014-low-emp":"#ffffff","news---editorial-card":"#ffffff","asymmetric-corner-card":"#ffffff","circular-portrait---pictogram-container":"#ffffff","top-bar":"#ffffff","(used-inline-on-article-card-metadata,-e":"#f2f2f2",":-always-full-bleed-edge-to-edge-at-ever":"#e60000"},"fonts":["Vodafone"],"source":"prose","radius":null},"voltagent":{"name":"Design System Inspired by VoltAgent","description":"# Design System Inspired by VoltAgent\n\n## 1. Visual Theme & Atmosphere\n\nVoltAgent's interface is a deep-space command terminal for the AI age \u2014 a developer-facing darkness built on","colors":{"key-characteristics:":"#050507","emerald-signal-green":"#00d992","voltagent-mint":"#2fd6a1","tailwind-emerald":"#10b981","soft-purple":"#818cf8","cobalt-primary":"#306cce","deep-cobalt":"#2554a0","ring-blue":"#3b82f6","abyss-black":"#050507","carbon-surface":"#101010","warm-charcoal-border":"#3d3a39","snow-white":"#f2f2f2","pure-white":"#ffffff","warm-parchment":"#b8b3b0","steel-slate":"#8b949e","fog-gray":"#bdbdbd","mist-gray":"#dcdcdc","near-white":"#eeeeee","success-emerald":"#008b00","success-light":"#80d280","warning-amber":"#ffba00","warning-pale":"#ffdd80","danger-coral":"#fb565b","danger-rose":"#fd9c9f","info-teal":"#4cb3d4","dashed-border-slate":"#4f5d75",":-both-system-ui-and-inter-enable-`\"calt":"#ffffff","primary-green-cta":"#101010","tertiary---emphasized-container-button":"#101010","--large-cards-combining-code-examples-wi":"#3d3a39",":-the-voltagent-bolt-logo-pulses-with-a-":"#3d3a39"},"fonts":["Inter"],"source":"prose","radius":null},"warp":{"name":"Design System Inspired by Warp","description":"# Design System Inspired by Warp\n\n## 1. Visual Theme & Atmosphere\n\nWarp's website feels like sitting at a campfire in a deep forest \u2014 warm, dark, and alive with quiet confidence. U","colors":{"key-characteristics:":"#faf9f6","warm-parchment":"#faf9f6","earth-gray":"#353534","deep-void":"#868584","ash-gray":"#afaeac","purple-tint-gray":"#666469","(`rgba(250,-249,-246,-0.9)`):-slightly-t":"#faf9f6","stone-gray":"#868584","muted-purple":"#666469","dark-charcoal":"#454545",":-`matter-mono-regular`-\u2014-custom-mono-co":"#353534",":-semi-transparent-border-(`rgba(226,-22":"#868584","\u2014-`rgba(255,-255,-255,-0.04)`-overlays-c":"#faf9f6","navigation":"#faf9f6"},"fonts":["Matter Regular","Matter Regular Placeholder","Matter Medium"],"source":"prose","radius":null},"webflow":{"name":"Design System Inspired by Webflow","description":"# Design System Inspired by Webflow\n\n## 1. Visual Theme & Atmosphere\n\nWebflow's website is a visually rich, tool-forward platform that communicates \"design without code\" through cl","colors":{"key-characteristics:":"#080808","near-black":"#080808","webflow-blue":"#146ef5","blue-400":"#3b89ff","blue-300":"#006acc","button-hover-blue":"#0055d4","purple":"#7a3dff","pink":"#ed52cb","green":"#00d722","orange":"#ff6b00","yellow":"#ffae13","red":"#ee1d36","gray-800":"#222222","gray-700":"#363636","gray-300":"#ababab","mid-gray":"#5a5a5a","border-gray":"#d8d8d8","border-hover":"#898989"},"fonts":["WF Visual Sans Variable","Arial"],"source":"prose","radius":null},"wired":{"name":"Design System Inspired by WIRED","description":"# Design System Inspired by WIRED\n\n## 1. Visual Theme & Atmosphere\n\nWIRED's homepage feels like a printed broadsheet that someone has plugged into a wall socket. The grid is dense,","colors":{"typographic-stack":"#057dbc","key-characteristics:":"#000000","page-ink":"#1a1a1a","paper-white":"#ffffff","link-blue":"#057dbc","newsprint":"#ffffff","footer-ink":"#1a1a1a","hairline-tint":"#e2e8f0","headline-black":"#1a1a1a","body-gray":"#1a1a1a","caption-gray":"#757575","disabled-gray":"#999999","hairline-border":"#e2e8f0","brand-hover-blue":"#057dbc","every-wiredmono-usage-carries-`text-tran":"#ffffff","secondary-\u2014-inverted-(\"sign-in\",-in-dark":"#000000","tertiary-\u2014-underlined-inline-link":"#1a1a1a","--border-radius:-`1920px`-(effectively-a":"#000000",":-rectangular,-`2px-solid-#000000`-borde":"#e53e3e","disabled":"#a0aec0","top-utility-bar":"#000000","main-nav":"#ffffff",":-standard-`loading=\"lazy\"`-on-all-below":"#000000","strictest":"#e2e8f0",".-there-is-exactly-one-shadow-token-in-t":"#057dbc","round-corners-on-rectangular-containers-":"#057dbc",":-wireddisplay-hero-scales-from-64px-to-":"#000000","page-canvas":"#ffffff","headline---body-text":"#1a1a1a","caption---metadata":"#757575","hairline---quiet-border":"#e2e8f0","link-hover-accent-(the-only-color)":"#057dbc","strip-every-`box-shadow`.-if-a-tile-need":"#000"},"fonts":[],"source":"prose","radius":null},"wise":{"name":"Design System Inspired by Wise","description":"# Design System Inspired by Wise\n\n## 1. Visual Theme & Atmosphere\n\nWise's website is a bold, confident fintech platform that communicates \"money without borders\" through massive ty","colors":{"key-characteristics:":"#9fe870","near-black":"#0e0f0c","wise-green":"#9fe870","dark-green":"#163300","light-mint":"#e2f6d5","pastel-green":"#cdffad","positive-green":"#054d28","danger-red":"#d03238","warning-yellow":"#ffd11a","(`rgba(56,200,255,0.10)`):-`--color-back":"#ffc091","warm-dark":"#454745","gray":"#868685","light-surface":"#e8ebe6",":-`inter`,-fallbacks:-`helvetica,-arial`":"#9fe870","--background:-`rgba(22,-51,-0,-0.08)`-(d":"#0e0f0c"},"fonts":["Wise Sans","Inter"],"source":"prose","radius":null},"x.ai":{"name":"Design System Inspired by xAI","description":"# Design System Inspired by xAI\n\n## 1. Visual Theme & Atmosphere\n\nxAI's website is a masterclass in dark-first, monospace-driven brutalist minimalism -- a design system that feels ","colors":{"key-characteristics:":"#1f2228","pure-white":"#ffffff","dark-background":"#1f2228","white-default":"#ffffff","(`rgba(255,-255,-255,-0.2)`):-emphasized":"#ffffff",":-`universalsans`,-with-fallback:-`unive":"#ffffff","ghost---outlined":"#ffffff","text-link":"#ffffff","monospace-tag":"#ffffff"},"fonts":["GeistMono"],"source":"prose","radius":null},"zapier":{"name":"Design System Inspired by Zapier","description":"# Design System Inspired by Zapier\n\n## 1. Visual Theme & Atmosphere\n\nZapier's website radiates warm, approachable professionalism. It rejects the cold monochrome minimalism of deve","colors":{"degular-display":"#ff4f00","key-characteristics:":"#fffefb","zapier-black":"#201515","cream-white":"#fffefb","off-white":"#fffdf9","zapier-orange":"#ff4f00","dark-charcoal":"#36342e","warm-gray":"#939084","sand":"#c5c0b1","light-sand":"#eceae3","mid-warm":"#b5b2aa","orange-cta":"#ff4f00","dark-cta":"#201515","light-cta":"#eceae3","link-default":"#201515","(`rgba(45,-45,-46,-0.5)`):-overlay-butto":"#fffefb",":-section-labels-(like-\"01---colors\")-an":"#ff4f00","primary-dark":"#201515","light---ghost":"#eceae3","pill-button":"#fffefb","--background:-`rgba(45,-45,-46,-0.5)`\n--":"#201515","workflow-integration-cards":"#36342e",":-cream-background-throughout,-with-sect":"#c5c0b1"},"fonts":["Degular Display","Inter","GT Alpina"],"source":"prose","radius":null}};

const VIBE_CONTEXT="airbnb|Airbnb|A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries ev\nairtable|Airtable|A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signatu\napple|Apple|A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, fram\nbinance|Binance|A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary\nbmw|BMW|BMW's corporate site \u2014 distinct from BMW M's motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On\nbmw-m|BMW M|A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE. \nbugatti|Bugatti|An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive pho\ncal|Cal.com|A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The syst\nclaude|Claude|A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines, \nclay|Clay|A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTA\nclickhouse|ClickHouse|A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in conf\ncohere|Cohere|Cohere's 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, sof\ncoinbase|Coinbase|An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is p\ncomposio|Composio|A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single deep-elec\ncursor|Cursor|An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (`#f7f7\nelevenlabs|elevenlabs|\nexpo|Expo|A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white wi\nferrari|Ferrari|A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is **near-black** (`#181818`) holding pure w\nfigma|Figma|A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monoc\nframer|Framer|A confident dark-canvas builder marketing site that treats the page like a working artboard \u2014 pure black surfaces, white display type set in\nhashicorp|HashiCorp|An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors \u2014 Terrafo\nibm|IBM|An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident a\nintercom|Intercom|An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom's proprietary ge\nkraken|Design System Inspired by Kraken|# Design System Inspired by Kraken\n\n## 1. Visual Theme & Atmosphere\n\nKraken's website is a clean, trustworthy crypto exchange that uses purp\nlamborghini|Design System Inspired by Lamborghini|# Design System Inspired by Lamborghini\n\n## 1. Visual Theme & Atmosphere\n\nLamborghini's website is a cathedral of darkness \u2014 a digital stage\nlinear.app|Linear|A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray tex\nlovable|Design System Inspired by Lovable|# Design System Inspired by Lovable\n\n## 1. Visual Theme & Atmosphere\n\nLovable's website radiates warmth through restraint. The entire page s\nmastercard|Design System Inspired by Mastercard|# Design System Inspired by Mastercard\n\n## 1. Visual Theme & Atmosphere\n\nMastercard's experience reads like a warm, editorial magazine built\nmeta|Meta|Meta's design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising v\nminimax|MiniMax|MiniMax presents itself as a premium AI infrastructure brand through a striking duality \u2014 bold black-pill CTAs and stark white canvas for ma\nmintlify|Mintlify|Mintlify presents documentation infrastructure with a dual-mode aesthetic \u2014 atmospheric sky-gradient marketing heroes (cloud illustration ba\nmiro|Miro|Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice \u2014 anchored by its signature canary y\nmistral.ai|Mistral AI|Mistral AI brands itself with a singular signature \u2014 atmospheric sunset gradients (mustard, orange, deep red) layered over photography of mo\nmongodb|MongoDB|MongoDB carries a strong dual-mode visual identity \u2014 dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired \nnike|Nike|A photography-first commerce system built on extreme typographic contrast \u2014 towering uppercase Futura display lockups burned into editorial \nnotion|Notion|Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice \u2014 anchored by a deep navy hero band ({\nnvidia|NVIDIA|An engineering-grade marketing system organized around two surface modes \u2014 a deep black canvas for hero and footer chapters and a flat paper\nollama|Ollama|An almost defiantly minimal documentation-first system that treats the home page like a Markdown README \u2014 paper-white canvas, 36px center-al\nopencode.ai|OpenCode|A terminal-native marketing system rendered entirely in Berkeley Mono \u2014 every word on the page, from the hero headline down to the footer fi\npinterest|Pinterest|A photography-first discovery system organized around the Pinterest Red CTA, the masonry pin grid, and a soft warm-cream chrome that gets ou\nplaystation|PlayStation|A three-surface marketing system organized around alternating black, white, and PlayStation Blue chapters that scroll past the viewer like a\nposthog|PostHog|A playful developer-tools system rendered on a warm cream canvas with hand-drawn hedgehog mascots dotted across every page like marginalia i\nraycast|raycast|\nrenault|Renault|Renault's web presence pairs the freshly-modernised Renault diamond\n(the 2021 flat-line rhombus mark) with a stark black-and-white canvas, a\nreplicate|Replicate|Replicate's marketing surfaces pair the warm-cream developer-tools aesthetic\nof an indie ML playground with a confident hot-orange brand acc\nresend|Resend|Resend's marketing surfaces sit on a near-pure black canvas with off-white\ntext and a single signature color \u2014 the deep editorial-serif Doma\nrevolut|Revolut|Revolut's marketing surfaces pair a stark black canvas with the brand's\ncobalt-violet (`#494fdf`) and a wide accent palette of deep, fully-s\nrunwayml|Design System Inspired by Runway|# Design System Inspired by Runway\n\n## 1. Visual Theme & Atmosphere\n\nRunway's interface is a cinematic reel brought to life as a website \u2014 a\nsanity|Design System Inspired by Sanity|# Design System Inspired by Sanity\n\n## 1. Visual Theme & Atmosphere\n\nSanity's website is a developer-content platform rendered as a nocturna\nsentry|Sentri Inspired|An inspired interpretation of Sentri's design language \u2014 a developer-tools brand built on a deep purple-violet midnight canvas, electric lim\nshopify|Shopifi Inspired|An inspired interpretation of Shopifi's design language \u2014 a cinematic commerce platform that runs two parallel design tracks. The marketing-\nslack|Slacc Inspired|An inspired interpretation of Slacc's design language \u2014 a workplace messaging brand built on a deep aubergine primary, with cream-lavender h\nspacex|spacex|\nspotify|Design System Inspired by Spotify|# Design System Inspired by Spotify\n\n## 1. Visual Theme & Atmosphere\n\nSpotify's web interface is a dark, immersive music player that wraps l\nstarbucks|Design System Inspired by Starbucks|# Design System Inspired by Starbucks\n\n## 1. Visual Theme & Atmosphere\n\nStarbucks' design system is a **warm, confident retail flagship** we\nstripe|Stripi Inspired|An inspired interpretation of Stripi's design language \u2014 a financial-infrastructure brand built on a deep navy ink, an electric indigo prima\nsupabase|supabase|\nsuperhuman|Superhumon Inspired|An inspired interpretation of Superhumon's design language \u2014 a fast-email productivity brand split between an editorial dark hero (deep indi\ntesla|Design System Inspired by Tesla|# Design System Inspired by Tesla\n\n## 1. Visual Theme & Atmosphere\n\nTesla's website is an exercise in radical subtraction \u2014 a digital showro\ntheverge|Design System Inspired by The Verge|# Design System Inspired by The Verge\n\n## 1. Visual Theme & Atmosphere\n\nThe Verge's 2024 redesign feels like somebody wired a Cond\u00e9 Nast mag\ntogether.ai|Design System Inspired by Together AI|# Design System Inspired by Together AI\n\n## 1. Visual Theme & Atmosphere\n\nTogether AI's interface is a pastel-gradient dreamscape built for \nuber|Design System Inspired by Uber|# Design System Inspired by Uber\n\n## 1. Visual Theme & Atmosphere\n\nUber's design language is a masterclass in confident minimalism -- a blac\nvercel|Design System Inspired by Vercel|# Design System Inspired by Vercel\n\n## 1. Visual Theme & Atmosphere\n\nVercel's website is the visual thesis of developer infrastructure made \nvodafone|Design System Inspired by Vodafone|# Design System Inspired by Vodafone\n\n## 1. Visual Theme & Atmosphere\n\nVodafone's corporate web system carries the confident, broadcast-scal\nvoltagent|Design System Inspired by VoltAgent|# Design System Inspired by VoltAgent\n\n## 1. Visual Theme & Atmosphere\n\nVoltAgent's interface is a deep-space command terminal for the AI ag\nwarp|Design System Inspired by Warp|# Design System Inspired by Warp\n\n## 1. Visual Theme & Atmosphere\n\nWarp's website feels like sitting at a campfire in a deep forest \u2014 warm, \nwebflow|Design System Inspired by Webflow|# Design System Inspired by Webflow\n\n## 1. Visual Theme & Atmosphere\n\nWebflow's website is a visually rich, tool-forward platform that commu\nwired|Design System Inspired by WIRED|# Design System Inspired by WIRED\n\n## 1. Visual Theme & Atmosphere\n\nWIRED's homepage feels like a printed broadsheet that someone has plugge\nwise|Design System Inspired by Wise|# Design System Inspired by Wise\n\n## 1. Visual Theme & Atmosphere\n\nWise's website is a bold, confident fintech platform that communicates \"m\nx.ai|Design System Inspired by xAI|# Design System Inspired by xAI\n\n## 1. Visual Theme & Atmosphere\n\nxAI's website is a masterclass in dark-first, monospace-driven brutalist m\nzapier|Design System Inspired by Zapier|# Design System Inspired by Zapier\n\n## 1. Visual Theme & Atmosphere\n\nZapier's website radiates warm, approachable professionalism. It reject";

const LOCAL_TOKENS={
  "flashfusion":{name:"FlashFusion",colors:{"surface-base":"#0F0618","surface-raised":"#1A0B2E","surface-overlay":"#251443","accent-primary":"#A855F7","accent-secondary":"#F472B6","accent-cyan":"#22D3EE","text-primary":"#F8FAFC","text-secondary":"#CBD5E1","text-tertiary":"#64748B","border-primary":"rgba(168,85,247,0.2)","canvas":"#0F0618"},fonts:["Poppins","JetBrains Mono"],radius:8},
  "int-inc":{name:"INT (Intinc)",colors:{"base":"#0a0a0f","raised":"#111118","border":"#2a2a38","accent":"hsl(262,83%,68%)","text":"#f0f0f5","text-secondary":"#9898a8","text-tertiary":"#52525e","canvas":"#0a0a0f"},fonts:["Space Grotesk","Inter","IBM Plex Mono"],radius:8},
  "reading-room":{name:"Reading Room at Midnight",colors:{"canvas":"#0c0c0b","canvas-raised":"#141413","accent":"#d4893a","accent-deep":"#b5691e","text":"#ede7dc","text-secondary":"#a09880","border":"#2a2620"},fonts:["Playfair Display","IBM Plex Sans","IBM Plex Mono"],radius:6},
  "chaosclub":{name:"Chaos Club Co.",colors:{"primary":"#d4651c","primary-deep":"#b5531a","canvas":"#faf7f4","canvas-warm":"#f5f3f0","canvas-dark":"#3d2f27","teal":"#2d5a5a","ink":"#1a1a1a","ink-mute":"#888888"},fonts:["Playfair Display","IBM Plex Sans"],radius:4}
};

const BRANDS=[
  {id:"airbnb",name:"Airbnb",cat:"E-Commerce",bg:"#FFFFFF",accent:"#FF5A5F"},
  {id:"airtable",name:"Airtable",cat:"Design",bg:"#F7F7F7",accent:"#FFB200"},
  {id:"apple",name:"Apple",cat:"Media",bg:"#FFFFFF",accent:"#0071E3"},
  {id:"binance",name:"Binance",cat:"Fintech",bg:"#0B0E11",accent:"#F3BA2F"},
  {id:"bmw",name:"BMW",cat:"Automotive",bg:"#1A1A1A",accent:"#0066CC"},
  {id:"bmw-m",name:"BMW M",cat:"Automotive",bg:"#0A0A0A",accent:"#C0392B"},
  {id:"bugatti",name:"Bugatti",cat:"Automotive",bg:"#000000",accent:"#C9A84C"},
  {id:"cal",name:"Cal.com",cat:"Productivity",bg:"#FFFFFF",accent:"#292929"},
  {id:"claude",name:"Claude",cat:"AI & LLM",bg:"#FAF0EB",accent:"#D97949"},
  {id:"clay",name:"Clay",cat:"Design",bg:"#F9F5FF",accent:"#C084FC"},
  {id:"clickhouse",name:"ClickHouse",cat:"Backend",bg:"#1A1A1A",accent:"#FAFF69"},
  {id:"cohere",name:"Cohere",cat:"AI & LLM",bg:"#0A0B0D",accent:"#39B5FF"},
  {id:"coinbase",name:"Coinbase",cat:"Fintech",bg:"#FFFFFF",accent:"#0052FF"},
  {id:"composio",name:"Composio",cat:"Backend",bg:"#0D0D0D",accent:"#FF6B35"},
  {id:"cursor",name:"Cursor",cat:"Dev Tools",bg:"#0A0A0F",accent:"#5B5BFF"},
  {id:"elevenlabs",name:"ElevenLabs",cat:"AI & LLM",bg:"#F5F5F5",accent:"#292524"},
  {id:"expo",name:"Expo",cat:"Dev Tools",bg:"#111111",accent:"#FFFFFF"},
  {id:"ferrari",name:"Ferrari",cat:"Automotive",bg:"#0A0A0A",accent:"#D40000"},
  {id:"figma",name:"Figma",cat:"Design",bg:"#0A0A0A",accent:"#A259FF"},
  {id:"framer",name:"Framer",cat:"Design",bg:"#0A0A0A",accent:"#0099FF"},
  {id:"hashicorp",name:"HashiCorp",cat:"Backend",bg:"#FFFFFF",accent:"#000000"},
  {id:"ibm",name:"IBM",cat:"Media",bg:"#161616",accent:"#0F62FE"},
  {id:"intercom",name:"Intercom",cat:"Productivity",bg:"#FFFFFF",accent:"#1F8DED"},
  {id:"kraken",name:"Kraken",cat:"Fintech",bg:"#121218",accent:"#5741D9"},
  {id:"lamborghini",name:"Lamborghini",cat:"Automotive",bg:"#000000",accent:"#C9A84C"},
  {id:"linear.app",name:"Linear",cat:"Productivity",bg:"#010102",accent:"#5E6AD2"},
  {id:"lovable",name:"Lovable",cat:"Dev Tools",bg:"#0F0F1A",accent:"#FF6B9D"},
  {id:"mastercard",name:"Mastercard",cat:"Fintech",bg:"#F7F2EB",accent:"#EB001B"},
  {id:"meta",name:"Meta",cat:"E-Commerce",bg:"#FFFFFF",accent:"#0866FF"},
  {id:"minimax",name:"Minimax",cat:"AI & LLM",bg:"#0A0A0A",accent:"#00FF9D"},
  {id:"mintlify",name:"Mintlify",cat:"Productivity",bg:"#FFFFFF",accent:"#16A34A"},
  {id:"miro",name:"Miro",cat:"Design",bg:"#FFFFFF",accent:"#FFD02F"},
  {id:"mistral.ai",name:"Mistral AI",cat:"AI & LLM",bg:"#1A1A2E",accent:"#7B5EA7"},
  {id:"mongodb",name:"MongoDB",cat:"Backend",bg:"#001E2B",accent:"#00ED64"},
  {id:"nike",name:"Nike",cat:"E-Commerce",bg:"#FFFFFF",accent:"#111111"},
  {id:"notion",name:"Notion",cat:"Productivity",bg:"#FFFFFF",accent:"#000000"},
  {id:"nvidia",name:"NVIDIA",cat:"Media",bg:"#0A0A0A",accent:"#76B900"},
  {id:"ollama",name:"Ollama",cat:"AI & LLM",bg:"#111111",accent:"#F0F0F0"},
  {id:"opencode.ai",name:"OpenCode AI",cat:"AI & LLM",bg:"#0F0F0F",accent:"#61DAFB"},
  {id:"pinterest",name:"Pinterest",cat:"Media",bg:"#FFFFFF",accent:"#E60023"},
  {id:"playstation",name:"PlayStation",cat:"Media",bg:"#00439C",accent:"#003087"},
  {id:"posthog",name:"PostHog",cat:"Backend",bg:"#1A1A1A",accent:"#F54E00"},
  {id:"raycast",name:"Raycast",cat:"Dev Tools",bg:"#1A1A1A",accent:"#FF6363"},
  {id:"renault",name:"Renault",cat:"Automotive",bg:"#000000",accent:"#EFDF00"},
  {id:"replicate",name:"Replicate",cat:"AI & LLM",bg:"#000000",accent:"#FFFFFF"},
  {id:"resend",name:"Resend",cat:"Backend",bg:"#000000",accent:"#FFFFFF"},
  {id:"revolut",name:"Revolut",cat:"Fintech",bg:"#FFFFFF",accent:"#494FDF"},
  {id:"runwayml",name:"Runway",cat:"AI & LLM",bg:"#0D0D0D",accent:"#F5F5F5"},
  {id:"sanity",name:"Sanity",cat:"Backend",bg:"#101112",accent:"#F03E2F"},
  {id:"sentry",name:"Sentry",cat:"Backend",bg:"#000000",accent:"#362D59"},
  {id:"shopify",name:"Shopify",cat:"E-Commerce",bg:"#F6F6F7",accent:"#008060"},
  {id:"slack",name:"Slack",cat:"Productivity",bg:"#FFFFFF",accent:"#4A154B"},
  {id:"spacex",name:"SpaceX",cat:"Media",bg:"#000000",accent:"#FFFFFF"},
  {id:"spotify",name:"Spotify",cat:"Media",bg:"#000000",accent:"#1DB954"},
  {id:"starbucks",name:"Starbucks",cat:"E-Commerce",bg:"#FAF3E0",accent:"#00704A"},
  {id:"stripe",name:"Stripe",cat:"Fintech",bg:"#FFFFFF",accent:"#533AFD"},
  {id:"supabase",name:"Supabase",cat:"Backend",bg:"#1C1C1C",accent:"#3ECF8E"},
  {id:"superhuman",name:"Superhuman",cat:"Dev Tools",bg:"#0A0A14",accent:"#7B55FF"},
  {id:"tesla",name:"Tesla",cat:"Automotive",bg:"#000000",accent:"#E82127"},
  {id:"theverge",name:"The Verge",cat:"Media",bg:"#1B002A",accent:"#00E7FF"},
  {id:"together.ai",name:"Together AI",cat:"AI & LLM",bg:"#0C1225",accent:"#5B8CFF"},
  {id:"uber",name:"Uber",cat:"Media",bg:"#FFFFFF",accent:"#000000"},
  {id:"vercel",name:"Vercel",cat:"Dev Tools",bg:"#000000",accent:"#FFFFFF"},
  {id:"vodafone",name:"Vodafone",cat:"Media",bg:"#FFFFFF",accent:"#E60000"},
  {id:"voltagent",name:"VoltAgent",cat:"AI & LLM",bg:"#000000",accent:"#10B981"},
  {id:"warp",name:"Warp",cat:"Dev Tools",bg:"#0E1117",accent:"#01A9FF"},
  {id:"webflow",name:"Webflow",cat:"Design",bg:"#020917",accent:"#146EF5"},
  {id:"wired",name:"WIRED",cat:"Media",bg:"#FFFFFF",accent:"#0C2340"},
  {id:"wise",name:"Wise",cat:"Fintech",bg:"#FFFFFF",accent:"#00B9A5"},
  {id:"x.ai",name:"xAI",cat:"AI & LLM",bg:"#000000",accent:"#FFFFFF"},
  {id:"zapier",name:"Zapier",cat:"Productivity",bg:"#FFFFFF",accent:"#FF4A00"},
  {id:"flashfusion",name:"FlashFusion",cat:"Original",bg:"#0F0618",accent:"#A855F7",local:true},
  {id:"int-inc",name:"INT (Intinc)",cat:"Original",bg:"#0a0a0f",accent:"hsl(262,83%,68%)",local:true},
  {id:"reading-room",name:"Reading Room at Midnight",cat:"Original",bg:"#0c0c0b",accent:"#d4893a",local:true},
  {id:"chaosclub",name:"Chaos Club Co.",cat:"Original",bg:"#3d2f27",accent:"#d4651c",local:true},
];

const CATS=["All","Original",...Array.from(new Set(BRANDS.filter(b=>!b.local).map(b=>b.cat))).sort()];

function luma(hex){
  if(!hex||typeof hex!=="string"||hex.startsWith("hsl")||hex.startsWith("rgba"))return 0;
  const h=hex.replace("#","");
  if(h.length<6)return 0;
  try{return 0.299*parseInt(h.slice(0,2),16)/255+0.587*parseInt(h.slice(2,4),16)/255+0.114*parseInt(h.slice(4,6),16)/255;}
  catch{return 0;}
}
function isHex(v){return typeof v==="string"&&/^#[0-9a-fA-F]{3,8}$/.test(v.trim());}

function getTokens(brand){
  if(brand.local)return LOCAL_TOKENS[brand.id]||{colors:{},fonts:[]};
  return BRAND_TOKENS[brand.id]||{colors:{},fonts:[]};
}

function normTokens(brand){
  const t=getTokens(brand);
  const c=t.colors||{};
  const g=(...keys)=>{for(const k of keys)if(c[k]&&typeof c[k]==="string")return c[k];return null;};
  const bg=g("canvas","canvas-light","canvas-soft","surface-canvas-light","canvas-night")||brand.bg;
  const bgIsDark=luma(bg)<0.45||bg.startsWith("hsl");
  const surface=g("surface-soft","surface-card","surface-1","canvas-soft","raised")||bg;
  const ink=g("ink","ink-deep","body-strong","text","text-primary","on-dark")||(bgIsDark?"#f0f0f0":"#1a1a1a");
  const inkMuted=g("muted","ink-mute","body","text-secondary","on-dark-mute")||(bgIsDark?"#9898a8":"#666");
  const primary=g("primary","accent-primary","accent","brand-blue")||brand.accent;
  const primaryL=luma(primary||"#fff");
  const onPrimary=g("on-primary")||(primaryL<0.45?"#ffffff":"#000000");
  const border=g("hairline","hairline-soft","border","border-gray","border-primary")||"rgba(128,128,128,0.15)";
  const r=t.radius?`${t.radius}px`:(bgIsDark?"6px":"8px");
  const fontFam=(t.fonts&&t.fonts[0])?`${t.fonts[0]}, system-ui, sans-serif`:"system-ui, sans-serif";
  return{bg,surface,ink,inkMuted,primary,onPrimary,border,r,fontFam,isDark:bgIsDark};
}

function toCSSVars(brand){
  const t=getTokens(brand);
  const lines=[`/* ${t.name||brand.name} */`,":root {"];
  for(const[k,v]of Object.entries(t.colors||{}))lines.push(`  --${k}: ${v};`);
  lines.push("}");
  if((t.fonts||[]).length)lines.push("","/* Fonts: "+t.fonts.join(", ")+" */");
  return lines.join("\n");
}

function toTailwind(brand){
  const t=getTokens(brand);
  const entries=Object.entries(t.colors||{}).filter(([,v])=>isHex(v)).map(([k,v])=>`    '${k}': '${v}',`);
  return["// tailwind.config.js — "+(t.name||brand.name),"module.exports = {","  theme: {","    extend: {","      colors: {",...entries,"      },","    },","  },","};"].join("\n");
}

// ─── COMPONENT PREVIEW ────────────────────────────────────────────────────────
function ComponentPreview({brand}){
  const n=normTokens(brand);
  const t=getTokens(brand);
  const colorCount=Object.keys(t.colors||{}).length;
  
  return(
    <div style={{padding:16}}>
      <div style={{background:n.bg,borderRadius:10,padding:20,border:`1px solid ${S.border}`}}>
        {/* Buttons */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <button style={{background:n.primary,color:n.onPrimary,border:"none",borderRadius:n.r,padding:"8px 16px",fontSize:13,fontFamily:n.fontFam,cursor:"default",fontWeight:500}}>Primary</button>
          <button style={{background:"transparent",color:n.ink,border:`1px solid ${n.border}`,borderRadius:n.r,padding:"8px 16px",fontSize:13,fontFamily:n.fontFam,cursor:"default"}}>Ghost</button>
          <button style={{background:"transparent",color:n.primary,border:`1px solid ${n.primary}`,borderRadius:n.r,padding:"8px 16px",fontSize:13,fontFamily:n.fontFam,cursor:"default"}}>Outline</button>
        </div>
        
        {/* Card */}
        <div style={{background:n.surface,border:`1px solid ${n.border}`,borderRadius:n.r,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontFamily:n.fontFam,fontSize:14,fontWeight:600,color:n.ink,marginBottom:4}}>Card component</div>
          <div style={{fontFamily:n.fontFam,fontSize:12,color:n.inkMuted,lineHeight:1.5,marginBottom:10}}>Supporting body text sits here — muted, readable, contextual.</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <span style={{background:n.primary,color:n.onPrimary,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,fontFamily:n.fontFam}}>Active</span>
            <span style={{background:n.isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)",color:n.inkMuted,fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:99,fontFamily:n.fontFam}}>Neutral</span>
            <span style={{background:"transparent",border:`1px solid ${n.border}`,color:n.inkMuted,fontSize:10,fontWeight:500,padding:"1px 7px",borderRadius:99,fontFamily:n.fontFam}}>Label</span>
          </div>
        </div>
        
        {/* Input */}
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:n.fontFam,fontSize:11,fontWeight:500,color:n.inkMuted,marginBottom:5,letterSpacing:"0.03em"}}>FIELD LABEL</div>
          <input readOnly placeholder="Placeholder text…" style={{width:"100%",background:n.surface,border:`1px solid ${n.border}`,borderRadius:n.r,padding:"8px 12px",fontSize:13,color:n.ink,fontFamily:n.fontFam,outline:"none",boxSizing:"border-box"}}/>
        </div>
        
        {/* Typography */}
        <div style={{borderTop:`1px solid ${n.border}`,paddingTop:14}}>
          <div style={{fontFamily:n.fontFam,fontSize:22,fontWeight:700,color:n.ink,lineHeight:1.1,letterSpacing:"-0.5px",marginBottom:4}}>Display heading</div>
          <div style={{fontFamily:n.fontFam,fontSize:13,color:n.inkMuted,lineHeight:1.6}}>Body text renders here. The quick brown fox jumps over the lazy dog — checking legibility across weights and sizes.</div>
        </div>
      </div>
      
      {/* Token count footer */}
      <div style={{marginTop:10,display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono}}>{colorCount} color tokens</span>
        {(t.fonts||[]).length>0&&<span style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Fonts: {t.fonts.slice(0,2).join(", ")}</span>}
        {t.radius&&<span style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono}}>r={t.radius}px</span>}
      </div>
    </div>
  );
}

// ─── VIBE SEARCH ──────────────────────────────────────────────────────────────
function VibeSearch({onResults,onClear}){
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  
  const runSearch=async()=>{
    if(!q.trim())return;
    setLoading(true);setErr(null);
    try{
      const prompt=`You are a design system expert matching aesthetic queries to brand design systems.

Query: "${q}"

Brand list (id|name|description):
${VIBE_CONTEXT}

Return ONLY a JSON array of 4-8 brand IDs that best match this aesthetic query. Best match first. Example: ["stripe","linear.app","vercel"]`;
      
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,messages:[{role:"user",content:prompt}]})
      });
      const data=await res.json();
      const text=data.content?.[0]?.text||"[]";
      const clean=text.replace(/```json|```/g,"").trim();
      const ids=JSON.parse(clean);
      onResults(ids);
    }catch(e){setErr("Search failed: "+e.message);}
    setLoading(false);
  };
  
  const handleKey=e=>{if(e.key==="Enter")runSearch();};
  
  return(
    <div style={{display:"flex",gap:6,alignItems:"center",flex:1}}>
      <div style={{position:"relative",flex:1}}>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={handleKey}
          placeholder='Vibe search: "warm cream editorial", "dark fintech indigo"…'
          style={{width:"100%",background:S.raised,border:`1px solid ${S.border}`,borderRadius:6,padding:"5px 10px",fontSize:12,color:S.text,fontFamily:S.fontBody,outline:"none",boxSizing:"border-box"}}
        />
      </div>
      <button onClick={runSearch} disabled={loading||!q.trim()} style={{padding:"5px 12px",borderRadius:6,fontSize:11,cursor:loading||!q.trim()?"not-allowed":"pointer",background:S.accentDim,border:"none",color:"#fff",fontFamily:S.fontBody,fontWeight:600,whiteSpace:"nowrap",opacity:loading||!q.trim()?0.5:1}}>
        {loading?"…":"AI Match"}
      </button>
      {err&&<span style={{fontSize:10,color:"#ef4444"}}>{err}</span>}
    </div>
  );
}

// ─── COMPARE VIEW ─────────────────────────────────────────────────────────────
function CompareView({brands,onClose}){
  const [a,b]=brands;
  const na=normTokens(a);
  const nb=normTokens(b);
  const ta=getTokens(a);
  const tb=getTokens(b);
  const colsA=Object.entries(ta.colors||{}).filter(([,v])=>isHex(v));
  const colsB=Object.entries(tb.colors||{}).filter(([,v])=>isHex(v));
  const keysA=new Set(colsA.map(([k])=>k));
  const keysB=new Set(colsB.map(([k])=>k));
  const shared=[...keysA].filter(k=>keysB.has(k));
  const onlyA=[...keysA].filter(k=>!keysB.has(k));
  const onlyB=[...keysB].filter(k=>!keysA.has(k));
  
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:S.base}}>
      <div style={{padding:"10px 16px",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <span style={{fontSize:12,fontWeight:600,color:S.text,fontFamily:S.fontHead}}>Compare</span>
        <div style={{display:"flex",gap:6,flex:1}}>
          {[a,b].map((brand,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:S.raised,borderRadius:6,padding:"4px 8px",border:`1px solid ${S.border}`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:brand.accent}}/>
              <span style={{fontSize:11,color:S.text,fontFamily:S.fontHead}}>{brand.name}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{width:24,height:24,borderRadius:4,cursor:"pointer",background:"transparent",border:`1px solid ${S.border}`,color:S.textTer,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
        {/* Side A */}
        <div style={{padding:16,borderRight:`1px solid ${S.border}`}}>
          <div style={{fontFamily:S.fontHead,fontSize:12,fontWeight:600,color:S.accent,marginBottom:12}}>{a.name}</div>
          <ComponentPreview brand={a}/>
          {onlyA.length>0&&(
            <div style={{marginTop:12}}>
              <div style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Unique tokens ({onlyA.length})</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))",gap:4}}>
                {onlyA.slice(0,12).map(k=>{const v=ta.colors[k];return<div key={k} style={{borderRadius:4,overflow:"hidden",border:`1px solid ${S.border}`}}><div style={{height:22,background:v}}/><div style={{padding:"2px 4px",background:S.raised,fontSize:9,color:S.textTer,fontFamily:S.fontMono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{k}</div></div>;})}
              </div>
            </div>
          )}
        </div>
        {/* Side B */}
        <div style={{padding:16}}>
          <div style={{fontFamily:S.fontHead,fontSize:12,fontWeight:600,color:S.textSec,marginBottom:12}}>{b.name}</div>
          <ComponentPreview brand={b}/>
          {onlyB.length>0&&(
            <div style={{marginTop:12}}>
              <div style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Unique tokens ({onlyB.length})</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))",gap:4}}>
                {onlyB.slice(0,12).map(k=>{const v=tb.colors[k];return<div key={k} style={{borderRadius:4,overflow:"hidden",border:`1px solid ${S.border}`}}><div style={{height:22,background:v}}/><div style={{padding:"2px 4px",background:S.raised,fontSize:9,color:S.textTer,fontFamily:S.fontMono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{k}</div></div>;})}
              </div>
            </div>
          )}
        </div>
      </div>
      {shared.length>0&&(
        <div style={{padding:"10px 16px",borderTop:`1px solid ${S.border}`,flexShrink:0}}>
          <div style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Shared key names ({shared.length}) — values may differ</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {shared.slice(0,20).map(k=>{
              const va=ta.colors[k],vb=tb.colors[k];
              const same=va===vb;
              return(
                <div key={k} style={{display:"flex",alignItems:"center",gap:3,background:S.raised,border:`1px solid ${same?"#22c55e30":S.border}`,borderRadius:4,padding:"2px 6px"}}>
                  <div style={{width:8,height:8,borderRadius:2,background:va}}/>
                  <span style={{fontSize:9,color:S.textTer,fontFamily:S.fontMono}}>{k}</span>
                  <div style={{width:8,height:8,borderRadius:2,background:vb}}/>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TOKEN TAB ────────────────────────────────────────────────────────────────
function ColorSwatch({name,value}){
  const[copied,setCopied]=useState(false);
  const valid=isHex(value);
  const dk=valid?luma(value)<0.5:true;
  const handle=async()=>{try{await navigator.clipboard.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1400);}catch{}};
  return(
    <div onClick={handle} title={`${name}: ${value}`} style={{cursor:"pointer",borderRadius:5,overflow:"hidden",border:`1px solid ${S.border}`,flexShrink:0,minWidth:0}}>
      <div style={{height:28,background:valid?value:"#2a2a3a",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {copied&&<span style={{fontSize:9,color:dk?"rgba(255,255,255,0.9)":"rgba(0,0,0,0.8)",fontFamily:S.fontMono,fontWeight:600}}>✓</span>}
        {!valid&&!copied&&<span style={{fontSize:8,color:"#52525e"}}>—</span>}
      </div>
      <div style={{padding:"3px 5px",background:S.raised}}>
        <div style={{fontSize:8,color:S.text,fontFamily:S.fontMono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
        <div style={{fontSize:7,color:S.textTer,fontFamily:S.fontMono,marginTop:1}}>{value&&value.length>13?value.slice(0,13)+"…":value||"—"}</div>
      </div>
    </div>
  );
}

function TokensTab({brand}){
  const t=getTokens(brand);
  const all=Object.entries(t.colors||{});
  const hexCols=all.filter(([,v])=>isHex(v));
  const otherCols=all.filter(([,v])=>!isHex(v));
  return(
    <div style={{padding:16}}>
      {hexCols.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:5,marginBottom:12}}>
        {hexCols.map(([k,v])=><ColorSwatch key={k} name={k} value={v}/>)}
      </div>}
      {otherCols.length>0&&<div>
        <div style={{fontSize:10,color:S.textTer,fontFamily:S.fontMono,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:5}}>Non-hex ({otherCols.length})</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {otherCols.map(([k,v])=><div key={k} style={{background:S.raised,border:`1px solid ${S.border}`,borderRadius:4,padding:"2px 7px",fontSize:9,fontFamily:S.fontMono,color:S.textSec}}><span style={{color:S.textTer}}>{k}: </span>{v&&v.length>30?v.slice(0,30)+"…":v}</div>)}
        </div>
      </div>}
      {all.length===0&&<div style={{padding:"20px 0",textAlign:"center",fontSize:12,color:S.textTer}}>No embedded tokens.</div>}
    </div>
  );
}

function ExportTab({brand}){
  const css=toCSSVars(brand);
  const tw=toTailwind(brand);
  const [mode,setMode]=useState("css");
  const content=mode==="css"?css:tw;
  const[copied,setCopied]=useState(false);
  const copy=async()=>{try{await navigator.clipboard.writeText(content);setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{}};
  return(
    <div style={{padding:16}}>
      <div style={{display:"flex",gap:5,marginBottom:12,alignItems:"center"}}>
        {["css","tailwind"].map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{padding:"3px 10px",borderRadius:5,fontSize:11,cursor:"pointer",background:mode===m?S.accentDim:"transparent",border:`1px solid ${mode===m?S.accent:S.border}`,color:mode===m?S.text:S.textSec,fontFamily:S.fontBody,fontWeight:500}}>
            {m==="css"?"CSS Vars":"Tailwind"}
          </button>
        ))}
        <button onClick={copy} style={{marginLeft:"auto",padding:"3px 10px",borderRadius:5,fontSize:11,cursor:"pointer",background:copied?S.successBg:"transparent",border:`1px solid ${copied?S.success:S.border}`,color:copied?S.success:S.textSec,fontFamily:S.fontBody,fontWeight:500}}>
          {copied?"✓ Copied":"Copy"}
        </button>
      </div>
      <pre style={{margin:0,fontSize:10,lineHeight:1.7,color:"#c9d1d9",fontFamily:S.fontMono,whiteSpace:"pre-wrap",wordBreak:"break-word",background:S.raised,borderRadius:6,padding:12,border:`1px solid ${S.border}`}}>{content}</pre>
    </div>
  );
}

// ─── VIEWER ───────────────────────────────────────────────────────────────────
function Viewer({brand,compareWith,onClose,onCompare}){
  const[tab,setTab]=useState("preview");
  const[raw,setRaw]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState(null);
  const CDN="https://cdn.jsdelivr.net/gh/nichochar/awesome-design-md@main/design-md";
  const t=getTokens(brand);
  const colorCount=Object.keys(t.colors||{}).length;

  useEffect(()=>{
    if(tab!=="raw")return;
    if(raw)return;
    setLoading(true);setErr(null);
    if(brand.local){setRaw("# Original design system — no upstream source.");setLoading(false);return;}
    fetch(`${CDN}/${brand.id}/DESIGN.md`)
      .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();})
      .then(t=>{setRaw(t);setLoading(false);})
      .catch(e=>{setErr(e.message);setLoading(false);});
  },[tab,brand.id,brand.local]);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:S.base}}>
      <div style={{padding:"9px 14px",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:6,background:brand.bg,border:`1px solid ${S.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{width:11,height:11,borderRadius:"50%",background:brand.accent}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:S.fontHead,fontWeight:700,fontSize:12,color:S.text,letterSpacing:"-0.2px"}}>{brand.name}</div>
          <div style={{fontSize:10,color:S.textTer,fontFamily:S.fontBody,marginTop:1}}>{brand.cat} · {colorCount} tokens{t.fonts&&t.fonts[0]?" · "+t.fonts[0]:""}</div>
        </div>
        <button onClick={onCompare} style={{padding:"3px 9px",borderRadius:5,fontSize:10,cursor:"pointer",background:compareWith?"hsla(262,83%,68%,0.15)":"transparent",border:`1px solid ${compareWith?S.accent:S.border}`,color:compareWith?S.accent:S.textSec,fontFamily:S.fontBody,fontWeight:500,whiteSpace:"nowrap"}}>
          {compareWith?"Exit Compare":"Compare"}
        </button>
        <button onClick={onClose} style={{width:24,height:24,borderRadius:4,cursor:"pointer",background:"transparent",border:`1px solid ${S.border}`,color:S.textTer,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${S.border}`,flexShrink:0}}>
        {["preview","tokens","export","raw"].map(t2=>(
          <button key={t2} onClick={()=>setTab(t2)} style={{padding:"6px 12px",fontSize:10,cursor:"pointer",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t2?S.accent:"transparent"}`,color:tab===t2?S.text:S.textTer,fontFamily:S.fontBody,fontWeight:tab===t2?600:400,letterSpacing:"0.04em",textTransform:"capitalize",transition:"all 100ms",whiteSpace:"nowrap"}}>
            {t2==="raw"?"Raw MD":t2==="export"?"Export":t2.charAt(0).toUpperCase()+t2.slice(1)}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {tab==="preview"&&<ComponentPreview brand={brand}/>}
        {tab==="tokens"&&<TokensTab brand={brand}/>}
        {tab==="export"&&<ExportTab brand={brand}/>}
        {tab==="raw"&&(
          <div style={{padding:16}}>
            {loading&&<div style={{display:"flex",gap:8,alignItems:"center",padding:"20px 0",color:S.textTer,fontSize:12}}><span style={{display:"inline-block",width:12,height:12,border:`2px solid ${S.border}`,borderTopColor:S.accent,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Fetching…</div>}
            {err&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:6,padding:12,fontSize:11,color:"#ef4444",marginBottom:10}}>{err}<br/><span style={{color:S.textSec,fontSize:9,marginTop:3,display:"block"}}>Tokens / Preview / Export always work offline.</span></div>}
            {!loading&&raw&&<pre style={{margin:0,fontSize:10,lineHeight:1.65,color:"#c9d1d9",fontFamily:S.fontMono,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{raw}</pre>}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── BRAND CARD ───────────────────────────────────────────────────────────────
function BrandCard({brand,selected,pinned,onClick}){
  const[hov,setHov]=useState(false);
  const dark=luma(brand.bg)<0.45||brand.bg.startsWith("hsl");
  const tc=dark?"rgba(255,255,255,0.9)":"rgba(0,0,0,0.85)";
  const t=getTokens(brand);
  const hexColors=Object.values(t.colors||{}).filter(isHex).slice(0,5);
  const colorCount=Object.keys(t.colors||{}).length;
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      borderRadius:8,overflow:"hidden",cursor:"pointer",
      border:selected?`1px solid ${S.accent}`:pinned?`1px solid hsl(262,83%,50%)`:`1px solid ${hov?"#3a3a50":S.border}`,
      background:selected?"#16162a":hov?"#13131e":S.raised,
      transition:"all 120ms",transform:hov&&!selected?"translateY(-1px)":"none",
      boxShadow:selected?`0 0 0 1px ${S.accent},0 4px 20px hsla(262,83%,68%,0.1)`:pinned?"0 0 0 1px hsl(262,83%,50%)":"none",
    }}>
      <div style={{height:44,background:brand.bg,display:"flex",alignItems:"center",padding:"0 10px",gap:7,borderBottom:`1px solid ${S.borderSub}`,position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",gap:2,position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",opacity:0.8}}>
          {hexColors.map((c,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:c}}/>)}
        </div>
        <span style={{width:9,height:9,borderRadius:"50%",background:brand.accent,flexShrink:0}}/>
        <span style={{fontSize:11,fontWeight:600,color:tc,fontFamily:S.fontHead,letterSpacing:"-0.2px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",flex:1}}>{brand.name}</span>
        {brand.local&&<span style={{fontSize:7,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",background:"rgba(168,85,247,0.3)",color:"hsl(262,83%,78%)",padding:"1px 5px",borderRadius:99,flexShrink:0,zIndex:1}}>orig</span>}
      </div>
      <div style={{padding:"6px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:9,fontWeight:600,color:brand.local?"hsl(262,83%,68%)":S.accentDim,background:brand.local?"hsla(262,83%,68%,0.12)":"hsla(262,60%,45%,0.15)",padding:"2px 6px",borderRadius:99,letterSpacing:"0.04em",textTransform:"uppercase"}}>{brand.cat}</span>
        <span style={{fontSize:9,color:S.textTer,fontFamily:S.fontMono}}>{colorCount}</span>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App(){
  const[cat,setCat]=useState("All");
  const[q,setQ]=useState("");
  const[selected,setSelected]=useState(null);
  const[pinned,setPinned]=useState(null);
  const[vibeResults,setVibeResults]=useState(null);
  const[compareMode,setCompareMode]=useState(false);
  
  const filtered=useMemo(()=>{
    let list=BRANDS;
    if(vibeResults){
      const order=vibeResults.reduce((a,id,i)=>(a[id]=i,a),{});
      list=list.filter(b=>vibeResults.includes(b.id)).sort((a,b2)=>(order[a.id]??99)-(order[b2.id]??99));
      return list;
    }
    if(cat!=="All")list=list.filter(b=>b.cat===cat);
    if(q.trim()){const ql=q.toLowerCase();list=list.filter(b=>b.name.toLowerCase().includes(ql)||b.cat.toLowerCase().includes(ql)||b.id.toLowerCase().includes(ql));}
    return list;
  },[cat,q,vibeResults]);

  const selectedBrand=useMemo(()=>selected?BRANDS.find(b=>b.id===selected):null,[selected]);
  const pinnedBrand=useMemo(()=>pinned?BRANDS.find(b=>b.id===pinned):null,[pinned]);
  
  const handleCompareToggle=()=>{
    if(!compareMode&&selectedBrand){setPinned(selected);setSelected(null);setCompareMode(true);}
    else{setPinned(null);setCompareMode(false);}
  };

  const handleVibeResults=(ids)=>{
    setVibeResults(ids);setCat("All");setQ("");setSelected(null);
  };
  const clearVibe=()=>{setVibeResults(null);};

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:S.base,color:S.text,fontFamily:S.fontBody,overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <div style={{fontFamily:S.fontHead,fontWeight:700,fontSize:13,color:S.text,letterSpacing:"-0.3px",whiteSpace:"nowrap"}}>
          design<span style={{color:S.accent}}>.</span>md
          <span style={{fontSize:9,color:S.textTer,fontWeight:400,marginLeft:6,fontFamily:S.fontMono}}>{BRANDS.length} brands</span>
        </div>
        {vibeResults?(
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:S.accent,fontFamily:S.fontBody,fontWeight:500}}>✦ AI match: {vibeResults.length} results</span>
            <button onClick={clearVibe} style={{padding:"3px 8px",borderRadius:4,fontSize:10,cursor:"pointer",background:"transparent",border:`1px solid ${S.border}`,color:S.textSec,fontFamily:S.fontBody}}>Clear</button>
          </div>
        ):(
          <VibeSearch onResults={handleVibeResults} onClear={clearVibe}/>
        )}
      </div>
      
      {/* Category tabs — hidden during vibe results */}
      {!vibeResults&&(
        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${S.border}`,flexShrink:0,overflowX:"auto"}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{padding:"5px 11px",fontSize:10,cursor:"pointer",background:"transparent",border:"none",borderBottom:`2px solid ${cat===c?S.accent:"transparent"}`,color:cat===c?S.text:S.textTer,fontFamily:S.fontBody,fontWeight:cat===c?600:400,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap",transition:"all 100ms"}}>
              {c}
            </button>
          ))}
          {!vibeResults&&(
            <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 10px"}}>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter…" style={{background:S.raised,border:`1px solid ${S.border}`,borderRadius:5,padding:"3px 8px",fontSize:11,color:S.text,fontFamily:S.fontBody,outline:"none",width:120}}/>
            </div>
          )}
        </div>
      )}
      
      {/* Compare mode banner */}
      {compareMode&&pinnedBrand&&(
        <div style={{padding:"6px 14px",background:"hsla(262,83%,68%,0.08)",borderBottom:`1px solid ${S.border}`,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:pinnedBrand.accent}}/>
          <span style={{fontSize:11,color:S.text,fontFamily:S.fontBody}}><span style={{color:S.accent,fontWeight:600}}>{pinnedBrand.name}</span> pinned — click a second brand to compare</span>
          <button onClick={handleCompareToggle} style={{marginLeft:"auto",padding:"2px 8px",borderRadius:4,fontSize:10,cursor:"pointer",background:"transparent",border:`1px solid ${S.border}`,color:S.textSec}}>Cancel</button>
        </div>
      )}
      
      {/* Body */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Grid */}
        <div style={{flex:(selectedBrand||compareMode&&selectedBrand)?"0 0 300px":"1",overflowY:"auto",padding:10,borderRight:(selectedBrand)?`1px solid ${S.border}`:"none",minWidth:0}}>
          {compareMode&&!selectedBrand&&<div style={{padding:"4px 6px",marginBottom:8,fontSize:10,color:S.textTer,fontFamily:S.fontBody}}>Select a brand to compare with {pinnedBrand?.name}</div>}
          <div style={{display:"grid",gridTemplateColumns:selectedBrand?"repeat(2,1fr)":"repeat(auto-fill,minmax(148px,1fr))",gap:7}}>
            {filtered.map(b=>(
              <BrandCard key={b.id} brand={b} selected={selected===b.id} pinned={pinned===b.id}
                onClick={()=>{
                  if(compareMode&&pinned&&b.id!==pinned){setSelected(b.id);}
                  else if(!compareMode){setSelected(s=>s===b.id?null:b.id);}
                }}
              />
            ))}
          </div>
          {filtered.length===0&&<div style={{padding:"40px 0",textAlign:"center",fontSize:13,color:S.textTer}}>No results</div>}
        </div>
        
        {/* Right panel */}
        {selectedBrand&&(
          <div style={{flex:1,overflow:"hidden",minWidth:0}}>
            {compareMode&&pinnedBrand?
              <CompareView brands={[pinnedBrand,selectedBrand]} onClose={()=>{setSelected(null);setPinned(null);setCompareMode(false);}}/>
            :
              <Viewer brand={selectedBrand} compareWith={compareMode?pinnedBrand:null} onClose={()=>setSelected(null)} onCompare={handleCompareToggle}/>
            }
          </div>
        )}
      </div>
    </div>
  );
}
