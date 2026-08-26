import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Book, ChevronRight, ChevronLeft, Globe, Heart, BookOpen, Trash2, RefreshCw, Sparkles, Library, ImageIcon } from "lucide-react";

const C = {
  parchment:"#faf3e0", parchDark:"#f0e6cc", burgundy:"#7b2d4e", burgLight:"#a34d6e",
  gold:"#c9a84c", goldLight:"#e8d48b", forest:"#2d5a3d", midnight:"#1a1a3e",
  brown:"#3d2b1f", brownLight:"#6b5344", cream:"#fff8ef",
};
const sty = { qk:"'Quicksand',sans-serif", cn:"'Cinzel',serif", cr:"'Crimson Text',serif" };
const btnBase = (x) => ({ border:"none", cursor:"pointer", fontFamily:sty.qk, fontWeight:700, ...x });

/* ═══════════════════════════════════════════
   PROCEDURAL SVG ILLUSTRATION ENGINE
   Deterministic from seed + keywords.
   Soft gradients, simple shapes, storybook feel.
   ═══════════════════════════════════════════ */
function seededRng(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

const SKY_PALETTES = [
  { top:"#87CEEB", bot:"#E0F0FF", name:"day" },       // clear day
  { top:"#FFB347", bot:"#FFECB3", name:"dawn" },       // golden dawn
  { top:"#FF6B6B", bot:"#FFD5CC", name:"sunset" },     // warm sunset
  { top:"#1a1a4e", bot:"#2d2d7e", name:"night" },      // night sky
  { top:"#a8d8ea", bot:"#d4f0f0", name:"misty" },      // misty morning
  { top:"#c3aed6", bot:"#f0e6ff", name:"purple" },     // magical purple
  { top:"#74b9ff", bot:"#dfe6e9", name:"cloudy" },     // soft cloudy
];

const GROUND_COLORS = [
  { base:"#4a8c5c", light:"#7bc47f" }, // green grass
  { base:"#c2956b", light:"#e8c9a0" }, // sandy/desert
  { base:"#5dade2", light:"#aed6f1" }, // water/ocean
  { base:"#2e7d32", light:"#66bb6a" }, // deep forest
  { base:"#8d6e63", light:"#bcaaa4" }, // earth/mountain
  { base:"#e8e8e8", light:"#fafafa" }, // snow
];

// Keyword → visual element mapping
const ELEMENT_KEYWORDS = {
  sun: ["sun","light","warm","golden","day","morning","dawn","bright","sunshine"],
  moon: ["moon","night","dark","stars","midnight","evening","lunar","glow"],
  stars: ["star","night","sky","space","cosmic","constellation","twinkle"],
  mountains: ["mountain","peak","tall","high","climb","volcano","hill","ridge"],
  water: ["water","ocean","sea","river","lake","wave","rain","waterfall","fish","dolphin","coral","reef"],
  trees: ["tree","forest","wood","leaf","branch","jungle","garden","grow","plant","blossom"],
  flowers: ["flower","bloom","petal","rose","garden","butterfly","bee","spring","meadow"],
  snow: ["snow","ice","cold","winter","frost","freeze","penguin","arctic","polar"],
  clouds: ["cloud","sky","float","fluffy","rain","weather","wind","storm"],
  fire: ["fire","flame","hot","cook","bake","forge","volcano","lava","candle"],
  food: ["chocolate","pizza","bread","cake","honey","popcorn","ice cream","cookie","food","eat","kitchen"],
  books: ["book","read","write","letter","alphabet","word","story","library","page"],
  building: ["castle","pyramid","tower","house","build","brick","stone","city","wall","bridge"],
  invention: ["wheel","bicycle","telescope","robot","machine","gear","clock","crayon","tool","invent"],
  animal: ["animal","cat","dog","bird","fish","butterfly","dinosaur","dragon","horse","rabbit","bear","fox"],
  magic: ["magic","wizard","enchant","spell","wand","fairy","mythical","legend","ancient","mystic"],
};

function matchKeywords(desc) {
  const lower = (desc || "").toLowerCase();
  const matches = [];
  for (const [elem, keywords] of Object.entries(ELEMENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) { matches.push(elem); break; }
    }
  }
  return matches.length > 0 ? matches : ["magic","clouds"];
}

function SceneIllustration({ description, seed, show }) {
  const elements = useMemo(() => matchKeywords(description), [description]);

  const svg = useMemo(() => {
    const rng = seededRng(seed || 42);
    const r = () => rng();
    const W = 680, H = 320;

    // Pick sky palette
    let skyIdx = Math.floor(r() * SKY_PALETTES.length);
    if (elements.includes("night") || elements.includes("moon") || elements.includes("stars")) skyIdx = 3;
    else if (elements.includes("fire") || elements.includes("food")) skyIdx = 1;
    else if (elements.includes("snow")) skyIdx = 4;
    const sky = SKY_PALETTES[skyIdx];
    const isNight = sky.name === "night";

    // Pick ground
    let gndIdx = Math.floor(r() * GROUND_COLORS.length);
    if (elements.includes("water")) gndIdx = 2;
    else if (elements.includes("snow")) gndIdx = 5;
    else if (elements.includes("mountains") || elements.includes("building")) gndIdx = 4;
    else if (elements.includes("trees") || elements.includes("flowers")) gndIdx = 0;
    const gnd = GROUND_COLORS[gndIdx];

    const parts = [];
    const defs = [];
    let defId = 0;
    const uid = () => `g${seed}-${defId++}`;

    // Sky gradient
    const skyGId = uid();
    defs.push(`<linearGradient id="${skyGId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${sky.top}"/><stop offset="100%" stop-color="${sky.bot}"/></linearGradient>`);
    parts.push(`<rect width="${W}" height="${H}" fill="url(#${skyGId})" rx="12"/>`);

    // Stars (if night)
    if (isNight || elements.includes("stars")) {
      for (let i = 0; i < 25; i++) {
        const sx = r()*W, sy = r()*(H*0.55), ss = 1+r()*2.5, op = 0.4+r()*0.6;
        parts.push(`<circle cx="${sx}" cy="${sy}" r="${ss}" fill="white" opacity="${op}"/>`);
      }
    }

    // Sun or Moon
    if (elements.includes("sun") || (!isNight && r() > 0.3)) {
      const sx = 80+r()*120, sy = 40+r()*40;
      const sId = uid();
      defs.push(`<radialGradient id="${sId}"><stop offset="0%" stop-color="#FFF176"/><stop offset="60%" stop-color="#FFD54F"/><stop offset="100%" stop-color="#FFB30044"/></radialGradient>`);
      parts.push(`<circle cx="${sx}" cy="${sy}" r="32" fill="url(#${sId})"/>`);
      // Rays
      for (let i = 0; i < 8; i++) {
        const a = (i/8)*Math.PI*2;
        const rx1 = sx+Math.cos(a)*36, ry1 = sy+Math.sin(a)*36;
        const rx2 = sx+Math.cos(a)*52, ry2 = sy+Math.sin(a)*52;
        parts.push(`<line x1="${rx1}" y1="${ry1}" x2="${rx2}" y2="${ry2}" stroke="#FFD54F" stroke-width="2" opacity="0.5" stroke-linecap="round"/>`);
      }
    }
    if (elements.includes("moon") || isNight) {
      const mx = 550+r()*80, my = 35+r()*30;
      parts.push(`<circle cx="${mx}" cy="${my}" r="24" fill="#FFF9C4" opacity="0.9"/>`);
      parts.push(`<circle cx="${mx+8}" cy="${my-4}" r="20" fill="${sky.top}"/>`);
    }

    // Clouds
    if (elements.includes("clouds") || r() > 0.35) {
      const nc = 2 + Math.floor(r()*3);
      for (let i = 0; i < nc; i++) {
        const cx = r()*W, cy = 30+r()*60, cw = 50+r()*70;
        const cop = isNight ? 0.15 : 0.5+r()*0.3;
        parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${cw}" ry="${14+r()*10}" fill="white" opacity="${cop}"/>`);
        parts.push(`<ellipse cx="${cx-cw*0.3}" cy="${cy+4}" rx="${cw*0.6}" ry="${10+r()*6}" fill="white" opacity="${cop*0.8}"/>`);
      }
    }

    // Mountains (background)
    if (elements.includes("mountains")) {
      for (let i = 0; i < 3; i++) {
        const mx = r()*W, mh = 80+r()*80, mb = H*0.65;
        const mId = uid();
        defs.push(`<linearGradient id="${mId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7e8a98"/><stop offset="100%" stop-color="#546e7a"/></linearGradient>`);
        parts.push(`<polygon points="${mx-80-r()*40},${mb} ${mx},${mb-mh} ${mx+80+r()*40},${mb}" fill="url(#${mId})" opacity="0.7"/>`);
        if (r() > 0.5) parts.push(`<polygon points="${mx-15},${mb-mh} ${mx},${mb-mh+18} ${mx+15},${mb-mh}" fill="white" opacity="0.7"/>`);
      }
    }

    // Ground curve
    const groundY = H * 0.62;
    const gId = uid();
    defs.push(`<linearGradient id="${gId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${gnd.light}"/><stop offset="100%" stop-color="${gnd.base}"/></linearGradient>`);
    const gy1 = groundY + r()*15, gy2 = groundY - r()*15, gy3 = groundY + r()*10;
    parts.push(`<path d="M0,${gy1} Q${W*0.25},${gy2} ${W*0.5},${gy3} Q${W*0.75},${groundY+r()*15} ${W},${groundY-5} L${W},${H} L0,${H} Z" fill="url(#${gId})"/>`);

    // Trees
    if (elements.includes("trees")) {
      const nt = 3 + Math.floor(r()*4);
      for (let i = 0; i < nt; i++) {
        const tx = 30+r()*(W-60), ty = groundY-5+r()*15, th = 40+r()*50, tw = 20+r()*25;
        parts.push(`<rect x="${tx-3}" y="${ty-th*0.4}" width="6" height="${th*0.5}" fill="#8D6E63" rx="2"/>`);
        const tc = r()>0.5 ? "#4CAF50" : "#66BB6A";
        parts.push(`<ellipse cx="${tx}" cy="${ty-th*0.5}" rx="${tw}" ry="${th*0.45}" fill="${tc}" opacity="0.85"/>`);
        parts.push(`<ellipse cx="${tx-tw*0.3}" cy="${ty-th*0.4}" rx="${tw*0.6}" ry="${th*0.3}" fill="${tc}" opacity="0.6"/>`);
      }
    }

    // Flowers
    if (elements.includes("flowers")) {
      const nf = 6 + Math.floor(r()*8);
      const fColors = ["#E91E63","#FF5722","#FF9800","#9C27B0","#F44336","#E040FB","#FF6F00"];
      for (let i = 0; i < nf; i++) {
        const fx = 20+r()*(W-40), fy = groundY+8+r()*30, fs = 4+r()*5;
        parts.push(`<line x1="${fx}" y1="${fy}" x2="${fx}" y2="${fy+fs*2}" stroke="#4CAF50" stroke-width="1.5"/>`);
        const fc = fColors[Math.floor(r()*fColors.length)];
        for (let p = 0; p < 5; p++) {
          const pa = (p/5)*Math.PI*2;
          parts.push(`<circle cx="${fx+Math.cos(pa)*fs*0.6}" cy="${fy+Math.sin(pa)*fs*0.6}" r="${fs*0.4}" fill="${fc}" opacity="0.8"/>`);
        }
        parts.push(`<circle cx="${fx}" cy="${fy}" r="${fs*0.3}" fill="#FFF176"/>`);
      }
    }

    // Water (waves overlay)
    if (elements.includes("water")) {
      for (let i = 0; i < 5; i++) {
        const wy = groundY+15+i*16;
        const wx1 = r()*100, wx2 = W*0.3+r()*100, wx3 = W*0.6+r()*100;
        parts.push(`<path d="M0,${wy} Q${wx1},${wy-6} ${wx2},${wy} Q${wx3},${wy+6} ${W},${wy}" stroke="white" stroke-width="1.5" fill="none" opacity="${0.3+r()*0.2}"/>`);
      }
    }

    // Fire / warm glow
    if (elements.includes("fire")) {
      const fx = W*0.5, fy = groundY+10;
      const fgId = uid();
      defs.push(`<radialGradient id="${fgId}"><stop offset="0%" stop-color="#FF6F00" stop-opacity="0.7"/><stop offset="50%" stop-color="#FF8F00" stop-opacity="0.3"/><stop offset="100%" stop-color="#FF8F00" stop-opacity="0"/></radialGradient>`);
      parts.push(`<circle cx="${fx}" cy="${fy}" r="50" fill="url(#${fgId})"/>`);
      for (let i = 0; i < 5; i++) {
        const fh = 15+r()*25, fw = 4+r()*8;
        parts.push(`<ellipse cx="${fx-10+r()*20}" cy="${fy-fh*0.3}" rx="${fw}" ry="${fh}" fill="${r()>0.5?'#FF6F00':'#FFA726'}" opacity="${0.6+r()*0.3}"/>`);
      }
    }

    // Building shapes
    if (elements.includes("building")) {
      const bx = W*0.4+r()*W*0.2, by = groundY;
      const bw = 60+r()*40, bh = 70+r()*50;
      parts.push(`<rect x="${bx-bw/2}" y="${by-bh}" width="${bw}" height="${bh}" fill="#8D6E63" rx="3"/>`);
      parts.push(`<polygon points="${bx-bw/2-10},${by-bh} ${bx},${by-bh-30-r()*20} ${bx+bw/2+10},${by-bh}" fill="#795548"/>`);
      // Windows
      for (let wy = 0; wy < 2; wy++) {
        for (let wx = 0; wx < 2; wx++) {
          parts.push(`<rect x="${bx-bw*0.3+wx*bw*0.35}" y="${by-bh+15+wy*bh*0.35}" width="${bw*0.18}" height="${bh*0.18}" fill="#FFF9C4" rx="1" opacity="0.8"/>`);
        }
      }
    }

    // Butterflies / small animals
    if (elements.includes("animal") || elements.includes("flowers")) {
      const nb = 2+Math.floor(r()*3);
      const bColors = ["#E91E63","#FF9800","#2196F3","#9C27B0","#4CAF50"];
      for (let i = 0; i < nb; i++) {
        const bx = 50+r()*(W-100), by = 40+r()*(groundY-60), bs = 5+r()*5;
        const bc = bColors[Math.floor(r()*bColors.length)];
        parts.push(`<ellipse cx="${bx-bs}" cy="${by}" rx="${bs}" ry="${bs*0.6}" fill="${bc}" opacity="0.7" transform="rotate(${-20+r()*10} ${bx} ${by})"/>`);
        parts.push(`<ellipse cx="${bx+bs}" cy="${by}" rx="${bs}" ry="${bs*0.6}" fill="${bc}" opacity="0.7" transform="rotate(${10+r()*10} ${bx} ${by})"/>`);
        parts.push(`<circle cx="${bx}" cy="${by}" r="1.5" fill="${C.brown}"/>`);
      }
    }

    // Sparkle particles for magic
    if (elements.includes("magic") || elements.includes("invention")) {
      for (let i = 0; i < 12; i++) {
        const sx = r()*W, sy = r()*H*0.7, ss = 2+r()*3;
        const sc = r()>0.5 ? "#FFF176" : "#CE93D8";
        parts.push(`<polygon points="${sx},${sy-ss} ${sx+ss*0.3},${sy-ss*0.3} ${sx+ss},${sy} ${sx+ss*0.3},${sy+ss*0.3} ${sx},${sy+ss} ${sx-ss*0.3},${sy+ss*0.3} ${sx-ss},${sy} ${sx-ss*0.3},${sy-ss*0.3}" fill="${sc}" opacity="${0.4+r()*0.4}"/>`);
      }
    }

    // Subtle vignette overlay
    const vigId = uid();
    defs.push(`<radialGradient id="${vigId}"><stop offset="60%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.08)"/></radialGradient>`);
    parts.push(`<rect width="${W}" height="${H}" fill="url(#${vigId})" rx="12"/>`);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%"><defs>${defs.join("")}</defs>${parts.join("")}</svg>`;
  }, [description, seed, elements]);

  if (!show) return null;

  return (
    <div style={{
      margin:"16px 0", borderRadius:12, overflow:"hidden",
      border:`1px solid ${C.gold}22`, background:`${C.gold}06`,
    }} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

/* ═══════════════════════════════════════════
   I18N
   ═══════════════════════════════════════════ */
const LANGS = [
  {code:"en",label:"English",flag:"🇺🇸"},{code:"es",label:"Español",flag:"🇪🇸"},
  {code:"fr",label:"Français",flag:"🇫🇷"},{code:"de",label:"Deutsch",flag:"🇩🇪"},
  {code:"pt",label:"Português",flag:"🇧🇷"},{code:"ja",label:"日本語",flag:"🇯🇵"},
  {code:"zh",label:"中文",flag:"🇨🇳"},
];
const TX = {
  en:{title:"Origin Stories",whatStory:"What origin story shall we tell?",enterTopic:"Type anything — an animal, invention, food, or idea!",placeholder:"e.g., butterflies, chocolate, the moon, rainbows...",begin:"Tell Me!",ages:"Reading Level",age46:"Ages 4–6",age79:"Ages 7–9",age1012:"Ages 10–12",planning:"Gathering ancient knowledge...",opening:"Writing the beginning...",chapters:"Weaving the story...",conclusion:"Crafting the grand finale...",binding:"Binding the pages...",complete:"Your story is ready!",error:"Oops! Something went wrong. Let's try again!",page:"Page",of:"of",theEnd:"The End",myStories:"My Stories",noStories:"No stories yet — let's create one!",saved:"Saved!",save:"Save to Bookshelf",askQuestion:"Ask about the story...",ask:"Ask",researching:"Thinking...",newStory:"New Story",backHome:"Home",library:"Bookshelf",vocab:"New Words",explore:"Keep Exploring",categories:"Pick a Topic",catAnimals:"Animals",catScience:"Science",catFood:"Food & Drink",catNature:"Nature",catHistory:"History",catInventions:"Inventions",favorite:"Favorite",unfavorite:"Unfavorite",promptSuffix:"Respond in English.",imgToggle:"Art"},
  es:{title:"Historias de Origen",whatStory:"¿Qué historia contaremos?",enterTopic:"¡Escribe lo que quieras!",placeholder:"ej., mariposas, chocolate, la luna...",begin:"¡Cuéntame!",ages:"Nivel",age46:"4–6 años",age79:"7–9 años",age1012:"10–12 años",planning:"Reuniendo sabiduría...",opening:"Escribiendo el comienzo...",chapters:"Tejiendo la historia...",conclusion:"Creando el final...",binding:"Encuadernando...",complete:"¡Lista!",error:"¡Ups! Algo salió mal.",page:"Página",of:"de",theEnd:"Fin",myStories:"Mis Historias",noStories:"¡Aún no hay historias!",saved:"¡Guardado!",save:"Guardar",askQuestion:"Pregunta...",ask:"Preguntar",researching:"Pensando...",newStory:"Nueva",backHome:"Inicio",library:"Estantería",vocab:"Palabras Nuevas",explore:"Explorar Más",categories:"Elige un Tema",catAnimals:"Animales",catScience:"Ciencia",catFood:"Comida",catNature:"Naturaleza",catHistory:"Historia",catInventions:"Inventos",favorite:"Favorito",unfavorite:"Quitar",promptSuffix:"Responde en español.",imgToggle:"Arte"},
  fr:{title:"Histoires des Origines",whatStory:"Quelle histoire raconter?",enterTopic:"Tapez n'importe quoi!",placeholder:"ex., papillons, chocolat, la lune...",begin:"Raconte!",ages:"Niveau",age46:"4–6 ans",age79:"7–9 ans",age1012:"10–12 ans",planning:"Rassembler les savoirs...",opening:"Écrire le début...",chapters:"Tisser l'histoire...",conclusion:"Créer le final...",binding:"Relier les pages...",complete:"Prête!",error:"Oups! Réessayons!",page:"Page",of:"de",theEnd:"Fin",myStories:"Mes Histoires",noStories:"Pas encore d'histoires!",saved:"Enregistré!",save:"Sauvegarder",askQuestion:"Posez une question...",ask:"Demander",researching:"Réflexion...",newStory:"Nouvelle",backHome:"Accueil",library:"Étagère",vocab:"Nouveaux Mots",explore:"Explorer",categories:"Choisissez",catAnimals:"Animaux",catScience:"Science",catFood:"Nourriture",catNature:"Nature",catHistory:"Histoire",catInventions:"Inventions",favorite:"Favori",unfavorite:"Retirer",promptSuffix:"Réponds en français.",imgToggle:"Art"},
  de:{title:"Ursprungsgeschichten",whatStory:"Welche Geschichte erzählen wir?",enterTopic:"Tippe alles ein!",placeholder:"z.B., Schmetterlinge, Schokolade, der Mond...",begin:"Erzähl!",ages:"Stufe",age46:"4–6 J.",age79:"7–9 J.",age1012:"10–12 J.",planning:"Sammle Wissen...",opening:"Schreibe den Anfang...",chapters:"Webe die Geschichte...",conclusion:"Gestalte das Finale...",binding:"Binde die Seiten...",complete:"Fertig!",error:"Ups! Nochmal!",page:"Seite",of:"von",theEnd:"Ende",myStories:"Meine Geschichten",noStories:"Noch keine Geschichten!",saved:"Gespeichert!",save:"Speichern",askQuestion:"Frag etwas...",ask:"Fragen",researching:"Denke...",newStory:"Neue",backHome:"Start",library:"Regal",vocab:"Neue Wörter",explore:"Entdecken",categories:"Wähle",catAnimals:"Tiere",catScience:"Wissenschaft",catFood:"Essen",catNature:"Natur",catHistory:"Geschichte",catInventions:"Erfindungen",favorite:"Favorit",unfavorite:"Entfernen",promptSuffix:"Antworte auf Deutsch.",imgToggle:"Bild"},
  pt:{title:"Histórias de Origem",whatStory:"Que história vamos contar?",enterTopic:"Digite qualquer coisa!",placeholder:"ex., borboletas, chocolate, a lua...",begin:"Conte!",ages:"Nível",age46:"4–6 anos",age79:"7–9 anos",age1012:"10–12 anos",planning:"Reunindo sabedoria...",opening:"Escrevendo o começo...",chapters:"Tecendo a história...",conclusion:"Criando o final...",binding:"Encadernando...",complete:"Pronta!",error:"Ops! Vamos tentar de novo!",page:"Página",of:"de",theEnd:"Fim",myStories:"Minhas Histórias",noStories:"Ainda sem histórias!",saved:"Salvo!",save:"Salvar",askQuestion:"Pergunte...",ask:"Perguntar",researching:"Pensando...",newStory:"Nova",backHome:"Início",library:"Estante",vocab:"Novas Palavras",explore:"Explorar",categories:"Escolha",catAnimals:"Animais",catScience:"Ciência",catFood:"Comida",catNature:"Natureza",catHistory:"História",catInventions:"Invenções",favorite:"Favorito",unfavorite:"Remover",promptSuffix:"Responda em português.",imgToggle:"Arte"},
  ja:{title:"はじまりの物語",whatStory:"どんな物語を語りましょう？",enterTopic:"なんでも入力してね！",placeholder:"例：ちょうちょ、チョコレート、月...",begin:"教えて！",ages:"レベル",age46:"4〜6歳",age79:"7〜9歳",age1012:"10〜12歳",planning:"知恵を集めています...",opening:"始まりを書いています...",chapters:"物語を紡いでいます...",conclusion:"フィナーレを作成中...",binding:"ページを綴じています...",complete:"できました！",error:"おっと！もう一度！",page:"ページ",of:"/",theEnd:"おしまい",myStories:"わたしの物語",noStories:"まだ物語がありません！",saved:"保存しました！",save:"保存",askQuestion:"質問してね...",ask:"聞く",researching:"考え中...",newStory:"新しい",backHome:"ホーム",library:"本棚",vocab:"新しい言葉",explore:"もっと探検",categories:"テーマ",catAnimals:"動物",catScience:"科学",catFood:"食べ物",catNature:"自然",catHistory:"歴史",catInventions:"発明",favorite:"お気に入り",unfavorite:"解除",promptSuffix:"日本語で回答してください。",imgToggle:"絵"},
  zh:{title:"起源故事",whatStory:"讲一个什么故事？",enterTopic:"输入任何东西！",placeholder:"例如：蝴蝶、巧克力、月亮...",begin:"讲！",ages:"水平",age46:"4-6岁",age79:"7-9岁",age1012:"10-12岁",planning:"收集智慧...",opening:"书写开头...",chapters:"编织故事...",conclusion:"创作结局...",binding:"装订书页...",complete:"准备好了！",error:"哎呀！再试一次！",page:"页",of:"/",theEnd:"终",myStories:"我的故事",noStories:"还没有故事！",saved:"已保存！",save:"保存",askQuestion:"提问...",ask:"问",researching:"思考中...",newStory:"新故事",backHome:"首页",library:"书架",vocab:"新词汇",explore:"继续探索",categories:"主题",catAnimals:"动物",catScience:"科学",catFood:"美食",catNature:"自然",catHistory:"历史",catInventions:"发明",favorite:"收藏",unfavorite:"取消",promptSuffix:"请用中文回答。",imgToggle:"图"},
};

const TOPICS_DATA = {
  animals:["Butterflies","Dolphins","Dinosaurs","Fireflies","Penguins","Octopuses"],
  science:["Rainbows","Stars","Magnets","Volcanoes","Gravity","Snowflakes"],
  food:["Chocolate","Pizza","Ice Cream","Popcorn","Bread","Honey"],
  nature:["The Moon","Waterfalls","Mountains","Coral Reefs","Forests","Caves"],
  history:["Pyramids","Castles","The Alphabet","Maps","Clocks","Music"],
  inventions:["Bicycles","Telescopes","Hot Air Balloons","Crayons","Robots","Books"],
};
const CAT_EMOJI = {animals:"🦋",science:"🌈",food:"🍫",nature:"🌙",history:"🏰",inventions:"🔭"};
const AGE_GUIDE = {
  "4-6":"Write for a 4-6 year old. Very simple words, short sentences (max 10 words), warm gentle tone, sense of wonder. 50-70 words per section.",
  "7-9":"Write for a 7-9 year old. Accessible vocabulary with some interesting new words, moderate sentences, adventurous tone. 90-120 words per section.",
  "10-12":"Write for a 10-12 year old. Rich vocabulary, varied sentences, deeper themes, fascinating details. 130-180 words per section.",
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
async function askClaude(prompt, system) {
  const body = {model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]};
  if (system) body.system = system;
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API "+res.status);
  const data = await res.json();
  return (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
}
function extractJSON(raw) {
  const s = raw.replace(/```json\s*/gi,"").replace(/```/g,"").trim();
  try { return JSON.parse(s); } catch {}
  const m = s.match(/\{[\s\S]*\}/);
  if (m) try { return JSON.parse(m[0]); } catch {}
  throw new Error("JSON parse failed");
}
async function sGet(k) { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch{return null;} }
async function sSet(k,v) { try { await window.storage.set(k,JSON.stringify(v)); } catch{} }

/* ═══════════════════════════════════════════
   SMALL UI COMPONENTS
   ═══════════════════════════════════════════ */
function StarBG() {
  const [dots] = useState(() => Array.from({length:18},(_,i)=>({
    i,l:Math.random()*100,t:Math.random()*100,s:2+Math.random()*3,d:Math.random()*4,dur:2+Math.random()*2,
  })));
  return (<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
    {dots.map(d=><div key={d.i} style={{position:"absolute",left:`${d.l}%`,top:`${d.t}%`,width:d.s,height:d.s,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}88,transparent)`,animation:`twinkle ${d.dur}s ease-in-out infinite ${d.d}s`}}/>)}
  </div>);
}
function Divider() {
  return (<div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}>
    <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,${C.gold}55,transparent)`}}/>
    <Sparkles size={12} color={C.gold}/>
    <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,${C.gold}55,transparent)`}}/>
  </div>);
}
function Orb({pct,label}) {
  return (<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
    <div style={{width:90,height:90,borderRadius:"50%",background:`conic-gradient(${C.gold} ${pct*3.6}deg, ${C.parchDark} 0deg)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 20px rgba(201,168,76,0.4)`}}>
      <div style={{width:70,height:70,borderRadius:"50%",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Book size={22} color={C.burgundy} style={{animation:"spin 6s linear infinite"}}/>
      </div>
    </div>
    <p style={{fontFamily:sty.qk,color:C.brownLight,fontWeight:500,fontSize:14,textAlign:"center",margin:0}}>{label}</p>
    <p style={{fontFamily:sty.qk,color:C.gold,fontWeight:700,fontSize:18,margin:0}}>{Math.round(pct)}%</p>
  </div>);
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function OriginStoryBook() {
  const [view,setView]=useState("home");
  const [locale,setLocale]=useState("en");
  const [age,setAge]=useState("7-9");
  const [topic,setTopic]=useState("");
  const [stories,setStories]=useState([]);
  const [story,setStory]=useState(null);
  const [pg,setPg]=useState(0);
  const [pct,setPct]=useState(0);
  const [phase,setPhase]=useState("");
  const [err,setErr]=useState(null);
  const [fq,setFq]=useState("");
  const [fa,setFa]=useState("");
  const [asking,setAsking]=useState(false);
  const [selCat,setSelCat]=useState(null);
  const [langOpen,setLangOpen]=useState(false);
  const [savedFlash,setSavedFlash]=useState(false);
  const [showImages,setShowImages]=useState(true);
  const t=useCallback(k=>TX[locale]?.[k]||TX.en[k]||k,[locale]);

  useEffect(()=>{
    if(!document.getElementById("os-css")){
      const el=document.createElement("style");el.id="os-css";
      el.textContent=`@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes pageIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}.fu{animation:fadeUp .4s ease-out both}.pi{animation:pageIn .35s ease-out both}.bob{animation:bob 3s ease-in-out infinite}.shimmer-text{background:linear-gradient(90deg,#c9a84c,#e8d48b,#c9a84c);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite}.bs{box-shadow:0 3px 16px rgba(61,43,31,.1),0 1px 3px rgba(61,43,31,.07)}.cs{box-shadow:0 5px 22px rgba(61,43,31,.18)}`;
      document.head.appendChild(el);
    }
  },[]);
  useEffect(()=>{sGet("os-lib").then(d=>{if(d)setStories(d)});},[]);
  useEffect(()=>{
    if(view!=="read"||!story)return;
    const tot=getTotal();
    const h=e=>{if(e.target.tagName==="INPUT")return;if(e.key==="ArrowRight"||e.key===" ")setPg(p=>Math.min(p+1,tot-1));if(e.key==="ArrowLeft")setPg(p=>Math.max(p-1,0));};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  });

  function getTotal(){if(!story)return 0;let n=1+story.chapters.length+1;if(story.vocab?.length>0)n++;if(fa)n++;return n;}
  function getPage(idx){
    if(!story)return null;
    if(idx===0)return{type:"opening",text:story.opening,img:story.openingImg,seed:story.seed};
    if(idx<=story.chapters.length){const ch=story.chapters[idx-1];return{type:"chapter",...ch,num:idx,seed:(story.seed||0)+idx};}
    let off=idx-story.chapters.length-1;
    if(off===0)return{type:"conclusion",text:story.conclusion,img:story.conclusionImg,seed:(story.seed||0)+99};
    off--;
    if(story.vocab?.length>0&&off===0)return{type:"vocab",words:story.vocab};
    return{type:"followup",text:fa};
  }

  async function generate(){
    if(!topic.trim())return;
    setView("gen");setErr(null);setPct(0);setFa("");setFq("");setStory(null);
    const sys=`You are a master children's storyteller. ${AGE_GUIDE[age]} ${t("promptSuffix")} IMPORTANT: Respond with ONLY valid JSON. No markdown fences, no extra text outside the JSON object.`;
    try {
      setPhase(t("planning"));setPct(8);
      const planRaw=await askClaude(`Plan an origin story about "${topic}". Create a magical educational narrative mixing real facts with enchanting storytelling.\n\nReturn JSON:\n{"title":"story title","theme":"one sentence theme","chapters":[{"num":1,"title":"ch title","focus":"what to cover"},{"num":2,"title":"ch title","focus":"what to cover"},{"num":3,"title":"ch title","focus":"what to cover"}],"vocabWords":[{"word":"word1","meaning":"def1"},{"word":"word2","meaning":"def2"},{"word":"word3","meaning":"def3"}]}`,sys);
      const plan=extractJSON(planRaw);setPct(18);

      setPhase(t("opening"));setPct(25);
      const openRaw=await askClaude(`Write the enchanting opening for an origin story about "${topic}".\nPlan: ${JSON.stringify(plan)}\nSet the scene with wonder. Hook the reader.\n\nReturn JSON:\n{"text":"the opening paragraph","scene":"keywords describing the visual scene for illustration, e.g. forest night moon glowing butterflies flowers magical"}`,sys);
      const opening=extractJSON(openRaw);setPct(35);

      setPhase(t("chapters"));
      const chapters=[];let ctx=opening.text.slice(0,200);
      const chList=plan.chapters||[];
      for(let i=0;i<chList.length;i++){
        setPct(35+((i+1)/chList.length)*30);
        const chRaw=await askClaude(`Continue the origin story of "${topic}".\nSo far: ${ctx}\nWrite chapter: ${JSON.stringify(chList[i])}\nAdvance the narrative with real facts woven in.\n\nReturn JSON:\n{"text":"chapter text","summary":"one line summary","scene":"keywords describing the visual scene for illustration of this chapter"}`,sys);
        const chData=extractJSON(chRaw);
        chapters.push({title:chList[i].title,text:chData.text,img:chData.scene||topic});
        ctx+=" "+(chData.summary||"");
      }
      setPct(70);

      setPhase(t("conclusion"));setPct(78);
      const concRaw=await askClaude(`Write the conclusion for the origin story of "${topic}".\nSo far: ${ctx}\nReveal how "${topic}" became what it is. End with wonder.\n\nReturn JSON:\n{"text":"conclusion text","scene":"keywords describing the visual scene for the triumphant ending illustration"}`,sys);
      const conc=extractJSON(concRaw);setPct(92);

      setPhase(t("binding"));
      const seed=Date.now()%100000;
      const newStory={
        id:Date.now().toString(),topic,title:plan.title||topic,theme:plan.theme||"",
        opening:opening.text,openingImg:opening.scene||topic,
        chapters,conclusion:conc.text,conclusionImg:conc.scene||topic,
        vocab:plan.vocabWords||[],age,locale,seed,
        createdAt:new Date().toISOString(),favorite:false,
      };
      setPct(100);setPhase(t("complete"));
      setStory(newStory);setPg(0);
      await new Promise(r=>setTimeout(r,400));
      setView("read");
    }catch(e){console.error("Gen:",e);setErr(t("error"));}
  }

  async function doFollowUp(){
    if(!fq.trim()||!story)return;setAsking(true);
    try{
      const raw=await askClaude(`A child read an origin story about "${story.topic}" and asks: "${fq}"\nStory theme: ${story.theme}\nGive a fascinating educational answer. ${AGE_GUIDE[story.age||age]} ${t("promptSuffix")}\nRespond with ONLY the answer text.`,"You are a friendly storyteller answering a curious child.");
      setFa(raw);setFq("");
      const newTot=1+story.chapters.length+1+(story.vocab?.length>0?1:0)+1;
      setPg(newTot-1);
    }catch{setFa(t("error"));}finally{setAsking(false);}
  }

  async function save(){if(!story)return;const has=stories.find(s=>s.id===story.id);const upd=has?stories.map(s=>s.id===story.id?story:s):[story,...stories];setStories(upd);await sSet("os-lib",upd);setSavedFlash(true);setTimeout(()=>setSavedFlash(false),2000);}
  async function remove(id){const upd=stories.filter(s=>s.id!==id);setStories(upd);await sSet("os-lib",upd);}
  async function toggleFav(){if(!story)return;const upd={...story,favorite:!story.favorite};setStory(upd);const list=stories.map(s=>s.id===upd.id?upd:s);setStories(list);await sSet("os-lib",list);}
  function goHome(){setView("home");setErr(null);setFa("");setFq("");}
  function openStory(s){setStory(s);setPg(0);setFa("");setFq("");setView("read");}

  // ════════════════════════════════════
  const navbar=(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:`linear-gradient(135deg,${C.midnight},${C.burgundy})`,fontFamily:sty.qk,position:"relative",zIndex:50}}>
    <div onClick={goHome} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
      <Book size={18} color={C.goldLight}/>
      <span className="shimmer-text" style={{fontFamily:sty.cn,fontWeight:700,fontSize:16}}>{t("title")}</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <button onClick={()=>setShowImages(!showImages)} style={btnBase({display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,fontSize:12,background:showImages?`${C.gold}44`:`${C.gold}15`,color:C.goldLight})}>
        <ImageIcon size={12}/> {t("imgToggle")}
      </button>
      <button onClick={()=>setView("lib")} style={btnBase({display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:20,background:`${C.gold}22`,color:C.goldLight,fontSize:13})}>
        <Library size={13}/> {t("library")}
        {stories.length>0&&<span style={{marginLeft:4,padding:"1px 6px",borderRadius:10,fontSize:11,background:C.gold,color:C.midnight,fontWeight:700}}>{stories.length}</span>}
      </button>
      <div style={{position:"relative"}}>
        <button onClick={()=>setLangOpen(!langOpen)} style={btnBase({display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,background:`${C.gold}22`,color:C.goldLight,fontSize:14})}>
          <Globe size={13}/> {LANGS.find(l=>l.code===locale)?.flag}
        </button>
        {langOpen&&<div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:C.cream,borderRadius:12,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,.15)",border:`1px solid ${C.gold}33`,minWidth:150,zIndex:100}}>
          {LANGS.map(l=><button key={l.code} onClick={()=>{setLocale(l.code);setLangOpen(false);}} style={btnBase({display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",background:locale===l.code?`${C.gold}22`:"transparent",fontSize:13,color:C.brown,textAlign:"left"})}>{l.flag} {l.label}</button>)}
        </div>}
      </div>
    </div>
  </div>);

  // HOME
  const homeView=(<div className="fu" style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div className="bob" style={{display:"inline-block",marginBottom:10}}><BookOpen size={42} color={C.burgundy}/></div>
      <h1 style={{fontFamily:sty.cn,color:C.brown,fontSize:26,margin:"0 0 6px"}}>{t("whatStory")}</h1>
      <p style={{fontFamily:sty.qk,color:C.brownLight,fontSize:14,margin:0}}>{t("enterTopic")}</p>
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:18}}>
      <span style={{fontFamily:sty.qk,color:C.brownLight,fontSize:13,fontWeight:600,alignSelf:"center",marginRight:4}}>{t("ages")}:</span>
      {[["4-6","age46"],["7-9","age79"],["10-12","age1012"]].map(([v,k])=><button key={v} onClick={()=>setAge(v)} style={{padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:sty.qk,border:`1.5px solid ${age===v?C.burgundy:C.burgundy+"44"}`,background:age===v?C.burgundy:`${C.burgundy}08`,color:age===v?C.cream:C.burgundy}}>{t(k)}</button>)}
    </div>
    <div className="bs" style={{borderRadius:16,background:C.cream,marginBottom:24}}>
      <div style={{padding:14,display:"flex",gap:8}}>
        <input type="text" value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&topic.trim())generate();}} placeholder={t("placeholder")} style={{flex:1,padding:"11px 14px",borderRadius:12,fontSize:16,border:`1.5px solid ${C.gold}44`,background:C.parchment,color:C.brown,fontFamily:sty.cr,outline:"none"}}/>
        <button onClick={generate} disabled={!topic.trim()} style={btnBase({padding:"11px 18px",borderRadius:12,fontSize:16,display:"flex",alignItems:"center",gap:6,background:topic.trim()?`linear-gradient(135deg,${C.burgundy},${C.burgLight})`:"#ccc",color:C.cream,opacity:topic.trim()?1:.5})}><Sparkles size={16}/> {t("begin")}</button>
      </div>
    </div>
    <div style={{textAlign:"center",marginBottom:20}}>
      <p style={{fontFamily:sty.qk,color:C.brownLight,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>{t("categories")}</p>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6,marginBottom:8}}>
        {Object.keys(TOPICS_DATA).map(cat=><button key={cat} onClick={()=>setSelCat(selCat===cat?null:cat)} style={{padding:"6px 12px",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:sty.qk,border:`1.5px solid ${selCat===cat?C.forest:C.forest+"44"}`,background:selCat===cat?C.forest:`${C.forest}08`,color:selCat===cat?C.cream:C.forest}}>{CAT_EMOJI[cat]} {t(`cat${cat[0].toUpperCase()+cat.slice(1)}`)}</button>)}
      </div>
      {selCat&&<div className="fu" style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6}}>
        {TOPICS_DATA[selCat].map(item=><button key={item} onClick={()=>{setTopic(item);setSelCat(null);}} style={{padding:"5px 12px",borderRadius:10,fontSize:14,cursor:"pointer",fontFamily:sty.cr,border:`1px solid ${C.gold}33`,background:`${C.gold}12`,color:C.brown}}>{item}</button>)}
      </div>}
    </div>
    {stories.length>0&&<div>
      <Divider/>
      <p style={{textAlign:"center",fontFamily:sty.qk,color:C.brownLight,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>{t("myStories")}</p>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8}}>
        {stories.slice(0,4).map(s=><div key={s.id} onClick={()=>openStory(s)} className="bs" style={{width:125,borderRadius:12,overflow:"hidden",cursor:"pointer",background:C.cream}}>
          <div style={{height:50,background:`linear-gradient(135deg,${C.midnight},${C.burgundy})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Book size={16} color={C.goldLight}/></div>
          <div style={{padding:6}}><p style={{fontFamily:sty.qk,fontSize:10,fontWeight:700,color:C.brown,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</p></div>
        </div>)}
      </div>
    </div>}
  </div>);

  // GENERATING
  const genView=(<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
    <div className="fu" style={{textAlign:"center",padding:20}}>
      <Orb pct={pct} label={phase}/>
      <h2 style={{fontFamily:sty.cn,color:C.brown,fontSize:20,marginTop:14}}>"{topic}"</h2>
      {err&&<div style={{marginTop:16}}><p style={{color:"#c0392b",fontFamily:sty.qk,fontSize:14,marginBottom:10}}>{err}</p><button onClick={goHome} style={btnBase({padding:"8px 18px",borderRadius:12,fontSize:14,background:C.burgundy,color:C.cream})}>{t("backHome")}</button></div>}
    </div>
  </div>);

  // READING
  const total=getTotal();const pd=getPage(pg);
  const readView=story&&pd?(<div className="fu" style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
    <div className="cs" style={{borderRadius:"14px 14px 0 0",padding:"18px 20px",textAlign:"center",background:`linear-gradient(135deg,${C.midnight},${C.burgundy})`}}>
      <h1 style={{fontFamily:sty.cn,color:C.goldLight,fontSize:20,margin:"0 0 4px"}}>{story.title}</h1>
      <p style={{fontFamily:sty.cr,color:`${C.goldLight}aa`,fontSize:13,fontStyle:"italic",margin:0}}>{story.theme}</p>
    </div>
    <div key={pg} className="pi bs" style={{borderRadius:"0 0 14px 14px",background:C.cream,minHeight:250}}>
      <div style={{padding:"24px 24px 14px"}}>
        {pd.type==="opening"&&<div>
          <SceneIllustration description={`${story.topic} ${pd.img||""}`} seed={pd.seed} show={showImages}/>
          <p style={{fontFamily:sty.cr,fontSize:17,lineHeight:1.7,color:C.brown,margin:0}}>{pd.text}</p>
        </div>}
        {pd.type==="chapter"&&<div>
          <h3 style={{fontFamily:sty.cn,color:C.burgundy,fontSize:17,textAlign:"center",margin:"0 0 6px"}}>{pd.title}</h3>
          <Divider/>
          <SceneIllustration description={`${story.topic} ${pd.img||""}`} seed={pd.seed} show={showImages}/>
          <p style={{fontFamily:sty.cr,fontSize:17,lineHeight:1.7,color:C.brown,margin:0}}>{pd.text}</p>
        </div>}
        {pd.type==="conclusion"&&<div>
          <h3 style={{fontFamily:sty.cn,color:C.burgundy,fontSize:17,textAlign:"center",margin:"0 0 6px"}}>✨ {t("theEnd")} ✨</h3>
          <Divider/>
          <SceneIllustration description={`${story.topic} ${pd.img||""} celebration magical`} seed={pd.seed} show={showImages}/>
          <p style={{fontFamily:sty.cr,fontSize:17,lineHeight:1.7,color:C.brown,margin:0}}>{pd.text}</p>
        </div>}
        {pd.type==="vocab"&&<div>
          <h3 style={{fontFamily:sty.cn,color:C.forest,fontSize:17,textAlign:"center",margin:"0 0 6px"}}>📚 {t("vocab")}</h3>
          <Divider/>
          {pd.words.map((w,i)=><div key={i} style={{padding:"8px 12px",borderRadius:10,background:`${C.gold}10`,border:`1px solid ${C.gold}20`,marginBottom:8}}>
            <span style={{fontFamily:sty.qk,fontWeight:700,color:C.burgundy}}>{w.word}</span>
            <span style={{color:C.gold,margin:"0 8px"}}>—</span>
            <span style={{fontFamily:sty.cr,color:C.brown}}>{w.meaning}</span>
          </div>)}
        </div>}
        {pd.type==="followup"&&<div>
          <h3 style={{fontFamily:sty.cn,color:C.forest,fontSize:17,textAlign:"center",margin:"0 0 6px"}}>💡 {t("explore")}</h3>
          <Divider/>
          <p style={{fontFamily:sty.cr,fontSize:17,lineHeight:1.7,color:C.brown,margin:0}}>{pd.text}</p>
        </div>}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 20px 14px"}}>
        <button onClick={()=>setPg(p=>Math.max(0,p-1))} disabled={pg===0} style={btnBase({width:34,height:34,borderRadius:"50%",background:`${C.gold}22`,color:C.brown,display:"flex",alignItems:"center",justifyContent:"center",opacity:pg===0?.2:1})}><ChevronLeft size={18}/></button>
        <span style={{fontFamily:sty.qk,color:C.brownLight,fontSize:13}}>{t("page")} {pg+1} {t("of")} {total}</span>
        <button onClick={()=>setPg(p=>Math.min(total-1,p+1))} disabled={pg>=total-1} style={btnBase({width:34,height:34,borderRadius:"50%",background:`${C.gold}22`,color:C.brown,display:"flex",alignItems:"center",justifyContent:"center",opacity:pg>=total-1?.2:1})}><ChevronRight size={18}/></button>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>
      {[
        {click:save,icon:savedFlash?null:<BookOpen size={13}/>,label:savedFlash?`✓ ${t("saved")}`:t("save"),bg:savedFlash?C.forest:`${C.forest}12`,fg:savedFlash?C.cream:C.forest,bdr:`${C.forest}44`},
        {click:toggleFav,icon:<Heart size={13} fill={story.favorite?C.burgundy:"none"}/>,label:story.favorite?t("unfavorite"):t("favorite"),bg:story.favorite?`${C.burgundy}15`:"transparent",fg:C.burgundy,bdr:`${C.burgundy}44`},
        {click:()=>{goHome();setTopic("");setStory(null);},icon:<RefreshCw size={13}/>,label:t("newStory"),bg:`${C.gold}12`,fg:C.brown,bdr:`${C.gold}44`},
      ].map((b,i)=><button key={i} onClick={b.click} style={btnBase({display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:12,fontSize:13,background:b.bg,color:b.fg,border:`1.5px solid ${b.bdr}`})}>{b.icon} {b.label}</button>)}
    </div>
    <div className="bs" style={{marginTop:18,borderRadius:14,padding:14,background:C.cream}}>
      <p style={{fontFamily:sty.qk,color:C.brownLight,fontSize:13,fontWeight:700,textAlign:"center",margin:"0 0 8px"}}>💬 {t("explore")}</p>
      <div style={{display:"flex",gap:8}}>
        <input type="text" value={fq} onChange={e=>setFq(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doFollowUp();}} placeholder={t("askQuestion")} disabled={asking} style={{flex:1,padding:"9px 12px",borderRadius:10,fontSize:14,border:`1px solid ${C.gold}33`,background:C.parchment,color:C.brown,fontFamily:sty.cr,outline:"none"}}/>
        <button onClick={doFollowUp} disabled={asking||!fq.trim()} style={btnBase({padding:"9px 16px",borderRadius:10,fontSize:13,background:(!asking&&fq.trim())?C.forest:"#ccc",color:C.cream,opacity:(!asking&&fq.trim())?1:.5})}>{asking?t("researching"):t("ask")}</button>
      </div>
    </div>
  </div>):null;

  // LIBRARY
  const libView=(<div className="fu" style={{maxWidth:640,margin:"0 auto",padding:"32px 16px"}}>
    <div style={{textAlign:"center",marginBottom:24}}>
      <Library size={34} color={C.burgundy} style={{marginBottom:6}}/>
      <h1 style={{fontFamily:sty.cn,color:C.brown,fontSize:24,margin:0}}>{t("myStories")}</h1>
    </div>
    {stories.length===0?(<div style={{textAlign:"center",padding:"36px 0"}}>
      <BookOpen size={36} color={C.brownLight} style={{opacity:.3,marginBottom:10}}/>
      <p style={{fontFamily:sty.qk,color:C.brownLight}}>{t("noStories")}</p>
      <button onClick={goHome} style={btnBase({marginTop:10,padding:"9px 22px",borderRadius:12,fontSize:14,background:C.burgundy,color:C.cream})}>{t("newStory")}</button>
    </div>):(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
      {stories.map(s=><div key={s.id} className="bs" style={{borderRadius:12,overflow:"hidden",background:C.cream}}>
        <div onClick={()=>openStory(s)} style={{padding:"14px 12px 8px",textAlign:"center",cursor:"pointer",background:`linear-gradient(135deg,${C.midnight},${C.burgundy})`}}>
          <Book size={18} color={C.goldLight} style={{marginBottom:4}}/>
          <p style={{fontFamily:sty.cn,color:C.goldLight,fontSize:13,margin:0,lineHeight:1.3}}>{s.title}</p>
          <p style={{fontFamily:sty.cr,color:`${C.goldLight}88`,fontSize:11,fontStyle:"italic",margin:"3px 0 0"}}>{s.topic}</p>
        </div>
        <div style={{padding:"6px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            {s.favorite&&<Heart size={10} fill={C.burgundy} color={C.burgundy}/>}
            <span style={{fontFamily:sty.qk,fontSize:10,color:C.brownLight}}>{new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
          <button onClick={e=>{e.stopPropagation();remove(s.id);}} style={btnBase({padding:3,borderRadius:6,background:"transparent",color:C.brownLight})}><Trash2 size={12}/></button>
        </div>
      </div>)}
    </div>)}
  </div>);

  return (<div style={{minHeight:"100vh",fontFamily:sty.cr,position:"relative",background:`linear-gradient(135deg,${C.parchment} 0%,#f5ead0 30%,${C.parchment} 60%,${C.parchDark} 100%)`}}>
    <StarBG/>
    <div style={{position:"relative",zIndex:1}}>
      {navbar}
      {view==="home"&&homeView}
      {view==="gen"&&genView}
      {view==="read"&&readView}
      {view==="lib"&&libView}
    </div>
    {langOpen&&<div onClick={()=>setLangOpen(false)} style={{position:"fixed",inset:0,zIndex:40}}/>}
  </div>);
}
