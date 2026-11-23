// Genera las ilustraciones SVG de /public/images. Uso: node scripts/generate-illustrations.mjs
// Son dibujos propios (no capturas), inspirados en la oficina isométrica y el tablero de Chubot.
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/images/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const save = (name, svg) => writeFileSync(new URL(name, OUT), svg.trim() + '\n');

const C = { bg: '#0a0b0f', floor: '#12141c', floor2: '#171a24', line: '#2a2e3d', ink: '#eeebe3', muted: '#7d8090', lime: '#c6ff3d', cyan: '#3de0ff', pink: '#ff7ab6', amber: '#ffb347', violet: '#b18cff', mint: '#5cf2a6' };

/* ---------------- Oficina isométrica ---------------- */
const S = 34; // tamaño de una unidad
const COS = Math.cos(Math.PI / 6), SIN = Math.sin(Math.PI / 6);
const OX = 560, OY = 120;
const iso = (x, y, z = 0) => [OX + (x - y) * COS * S, OY + (x + y) * SIN * S - z * S];
const pts = (...p) => p.map((q) => iso(...q).map((n) => n.toFixed(1)).join(',')).join(' ');

function box(x, y, z, w, d, h, { top, left, right, stroke = 'none', opacity = 1, sw = 1 }) {
  return `<g opacity="${opacity}">
  <polygon points="${pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])}" fill="${left}" stroke="${stroke}" stroke-width="${sw}"/>
  <polygon points="${pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])}" fill="${right}" stroke="${stroke}" stroke-width="${sw}"/>
  <polygon points="${pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])}" fill="${top}" stroke="${stroke}" stroke-width="${sw}"/>
</g>`;
}

function room(x, y, w, d, color, label) {
  const h = 1.3;
  const back = `<polygon points="${pts([x, y, 0], [x + w, y, 0], [x + w, y, h], [x, y, h])}" fill="${color}" fill-opacity=".05" stroke="${color}" stroke-opacity=".55"/>
  <polygon points="${pts([x, y, 0], [x, y + d, 0], [x, y + d, h], [x, y, h])}" fill="${color}" fill-opacity=".04" stroke="${color}" stroke-opacity=".55"/>`;
  const floor = `<polygon points="${pts([x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0])}" fill="${color}" fill-opacity=".07" stroke="${color}" stroke-opacity=".8" stroke-width="1.4"/>`;
  const front = `<polyline points="${pts([x, y + d, h], [x + w, y + d, h], [x + w, y, h])}" fill="none" stroke="${color}" stroke-width="1.6" filter="url(#glow)"/>
  <line x1="${iso(x + w, y + d, 0)[0]}" y1="${iso(x + w, y + d, 0)[1]}" x2="${iso(x + w, y + d, h)[0]}" y2="${iso(x + w, y + d, h)[1]}" stroke="${color}" stroke-opacity=".6"/>`;
  const [lx, ly] = iso(x + 0.3, y + 0.2, h);
  const tag = `<g transform="translate(${lx.toFixed(1)} ${(ly - 10).toFixed(1)})"><rect x="0" y="-13" width="${label.length * 7.4 + 16}" height="20" rx="10" fill="${C.bg}" stroke="${color}"/><text x="8" y="1" fill="${color}" font-family="JetBrains Mono, monospace" font-size="11">${label}</text></g>`;
  return { back: floor + back, front: front + tag };
}

function desk(x, y, color, on = true) {
  const d = box(x, y, 0, 1.4, 0.8, 0.55, { top: '#2b2f3e', left: '#1b1e28', right: '#222634' });
  const screen = box(x + 0.25, y + 0.05, 0.55, 0.9, 0.06, 0.45, { top: '#3a3f52', left: on ? color : '#2a2e3d', right: '#0f1117', stroke: '#0f1117', opacity: on ? 0.9 : 0.6 });
  const glow = on ? `<ellipse cx="${iso(x + 0.7, y + 0.4, 0.6)[0]}" cy="${iso(x + 0.7, y + 0.4, 0.6)[1]}" rx="30" ry="14" fill="${color}" opacity=".18" filter="url(#blur)"/>` : '';
  return d + glow + screen;
}

function avatar(x, y, color, name) {
  const [cx, cy] = iso(x, y, 0);
  return `<g class="avatar">
  <ellipse cx="${cx}" cy="${cy}" rx="12" ry="6" fill="#000" opacity=".45"/>
  <path d="M${cx - 9} ${cy} v-22 a9 9 0 0 1 18 0 v22 a9 4.5 0 0 1 -18 0z" fill="${color}"/>
  <circle cx="${cx}" cy="${cy - 34}" r="8" fill="#f2d3b3"/>
  <path d="M${cx - 8} ${cy - 36} a8 8 0 0 1 16 0 q-8 -4 -16 0z" fill="#1b1e28"/>
  <g transform="translate(${cx + 12} ${cy - 52})"><rect width="${name.length * 7 + 14}" height="18" rx="9" fill="${C.bg}" fill-opacity=".85" stroke="${color}" stroke-opacity=".7"/><text x="7" y="12.5" fill="${C.ink}" font-family="Manrope, sans-serif" font-size="10.5" font-weight="600">${name}</text></g>
</g>`;
}

const rooms = [
  { x: 0, y: 0, color: C.pink, label: 'MARKETING', agents: [['Luna', C.pink], ['Mateo', C.amber]] },
  { x: 5.6, y: 0, color: C.violet, label: 'DISEÑO', agents: [['Iris', C.violet]] },
  { x: 11.2, y: 0, color: C.cyan, label: 'VENTAS', agents: [['Bruno', C.cyan]] },
  { x: 0, y: 5.6, color: C.lime, label: 'INGENIERÍA', agents: [['Nico', C.lime]] },
  { x: 5.6, y: 5.6, color: C.mint, label: 'SOPORTE', agents: [['Sofi', C.mint]] },
  { x: 11.2, y: 5.6, color: C.amber, label: 'DIRECCIÓN', agents: [['Chubot', C.amber]] },
];

let scene = '';
for (const r of [...rooms].sort((a, b) => a.x + a.y - (b.x + b.y))) {
  const g = room(r.x, r.y, 4.2, 4.2, r.color, r.label);
  let items = '';
  r.agents.forEach(([name, col], i) => {
    const dx = r.x + 0.5 + i * 1.9, dy = r.y + 0.9;
    items += desk(dx, dy, col, true);
    items += avatar(dx + 0.7, dy + 1.6, col, name);
  });
  if (r.agents.length === 1) items += desk(r.x + 2.4, r.y + 0.9, r.color, false);
  // planta
  items += box(r.x + 3.4, r.y + 3.3, 0, 0.5, 0.5, 0.4, { top: '#2b2f3e', left: '#1b1e28', right: '#222634' });
  const [px, py] = iso(r.x + 3.65, r.y + 3.55, 0.75);
  items += `<circle cx="${px}" cy="${py}" r="11" fill="#2f7d4a"/><circle cx="${px - 6}" cy="${py + 3}" r="7" fill="#3c9a5c"/>`;
  scene += `<g class="room">${g.back}${items}${g.front}</g>`;
}

const floor = `<polygon points="${pts([-0.6, -0.6, 0], [16, -0.6, 0], [16, 10.4, 0], [-0.6, 10.4, 0])}" fill="${C.floor}" stroke="${C.line}"/>`;
let gridLines = '';
for (let i = 0; i <= 16; i++) gridLines += `<line x1="${iso(-0.6 + i, -0.6)[0]}" y1="${iso(-0.6 + i, -0.6)[1]}" x2="${iso(-0.6 + i, 10.4)[0]}" y2="${iso(-0.6 + i, 10.4)[1]}"/>`;
for (let j = 0; j <= 11; j++) gridLines += `<line x1="${iso(-0.6, -0.6 + j)[0]}" y1="${iso(-0.6, -0.6 + j)[1]}" x2="${iso(16, -0.6 + j)[0]}" y2="${iso(16, -0.6 + j)[1]}"/>`;

const defs = `<defs>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
  <radialGradient id="vig" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#1a1e2b"/><stop offset="1" stop-color="${C.bg}"/></radialGradient>
</defs>`;

const corners = [iso(-0.6, -0.6), iso(16, -0.6), iso(16, 10.4), iso(-0.6, 10.4)];
const minX = Math.min(...corners.map((c) => c[0])) - 30, maxX = Math.max(...corners.map((c) => c[0])) + 30;
const minY = Math.min(...corners.map((c) => c[1])) - 90, maxY = Math.max(...corners.map((c) => c[1])) + 30;
const VB = `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;
save('office-iso.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="Ilustración isométrica de la oficina virtual: seis salas de cristal con agentes de IA en sus escritorios">
${defs}
<rect x="${minX}" y="${minY}" width="${maxX - minX}" height="${maxY - minY}" fill="url(#vig)"/>
${floor}
<g stroke="${C.line}" stroke-opacity=".5" stroke-width=".6">${gridLines}</g>
${scene}
</svg>`);

/* ---------------- Tablero kanban ---------------- */
const cols = [
  { t: 'Pendiente', c: C.muted, cards: [['Lista de prospectos CDMX', 'Bruno', C.cyan]] },
  { t: 'En progreso', c: C.cyan, cards: [['3 posts de lanzamiento', 'Mateo', C.amber], ['Guion de video 30s', 'Iris', C.violet]] },
  { t: 'Espera de aprobación', c: C.amber, cards: [['Respuesta a cliente', 'Sofi', C.mint], ['Email de bienvenida', 'Luna', C.pink]] },
  { t: 'En corrección', c: C.pink, cards: [['Landing de precios', 'Nico', C.lime]] },
  { t: 'Completado', c: C.lime, cards: [['Copy para Instagram', 'Luna', C.pink], ['FAQ de soporte', 'Sofi', C.mint]] },
];
let kb = '';
cols.forEach((col, i) => {
  const x = 36 + i * 214;
  kb += `<rect x="${x}" y="92" width="198" height="470" rx="14" fill="#11131a" stroke="${C.line}"/>
  <circle cx="${x + 18}" cy="117" r="5" fill="${col.c}"/><text x="${x + 30}" y="121" fill="${C.ink}" font-family="Manrope, sans-serif" font-size="12.5" font-weight="700">${col.t}</text>
  <text x="${x + 180}" y="121" fill="${C.muted}" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="end">${col.cards.length}</text>`;
  col.cards.forEach(([title, agent, ac], j) => {
    const y = 140 + j * 118;
    const glow = col.t === 'Espera de aprobación' ? ` stroke="${C.amber}" stroke-opacity=".7"` : ` stroke="${C.line}"`;
    kb += `<g><rect x="${x + 10}" y="${y}" width="178" height="104" rx="10" fill="#1a1d28"${glow}/>
    <rect x="${x + 22}" y="${y + 14}" width="54" height="16" rx="8" fill="${ac}" fill-opacity=".15"/><text x="${x + 30}" y="${y + 25.5}" fill="${ac}" font-family="JetBrains Mono, monospace" font-size="9.5">${agent.toLowerCase()}</text>
    <text x="${x + 22}" y="${y + 50}" fill="${C.ink}" font-family="Manrope, sans-serif" font-size="12.5" font-weight="600">${title}</text>
    <rect x="${x + 22}" y="${y + 62}" width="130" height="6" rx="3" fill="#2a2e3d"/><rect x="${x + 22}" y="${y + 74}" width="96" height="6" rx="3" fill="#2a2e3d"/>
    <circle cx="${x + 170}" cy="${y + 88}" r="9" fill="${ac}"/><text x="${x + 170}" y="${y + 91.5}" fill="${C.bg}" font-family="Manrope, sans-serif" font-size="9" font-weight="800" text-anchor="middle">${agent[0]}</text>
    </g>`;
  });
});
save('kanban-board.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1140 600" role="img" aria-label="Tablero kanban de cinco columnas con tareas de los agentes">
<rect width="1140" height="600" rx="22" fill="${C.bg}" stroke="${C.line}"/>
<rect width="1140" height="64" rx="22" fill="#0f1117"/><rect y="42" width="1140" height="22" fill="#0f1117"/>
<circle cx="32" cy="32" r="6" fill="#ff5f57"/><circle cx="52" cy="32" r="6" fill="#febc2e"/><circle cx="72" cy="32" r="6" fill="#28c840"/>
<text x="104" y="37" fill="${C.ink}" font-family="Manrope, sans-serif" font-size="14" font-weight="700">Chubot · Tablero</text>
<rect x="880" y="18" width="110" height="28" rx="14" fill="none" stroke="${C.line}"/><text x="935" y="36" fill="${C.muted}" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle">osmaritech ▾</text>
<rect x="1002" y="18" width="110" height="28" rx="14" fill="${C.lime}"/><text x="1057" y="36" fill="${C.bg}" font-family="Manrope, sans-serif" font-size="12" font-weight="700" text-anchor="middle">+ Tarea</text>
<circle cx="1094" cy="76" r="0" />
<text x="1104" y="80" fill="${C.lime}" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="end">● SSE en vivo</text>
${kb}
</svg>`);

/* ---------------- Avatar / retrato abstracto ---------------- */
save('avatar.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600" role="img" aria-label="Retrato ilustrado (reemplázalo por tu foto)">
<defs>
  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1d28"/><stop offset="1" stop-color="#0a0b0f"/></linearGradient>
  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lime}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
</defs>
<rect width="480" height="600" rx="28" fill="url(#g1)"/>
<g stroke="${C.line}" stroke-width="1">${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="600"/>`).join('')}${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="480" y2="${i * 40}"/>`).join('')}</g>
<circle cx="240" cy="250" r="150" fill="url(#g2)" opacity=".16"/>
<path d="M90 600 C 100 470, 170 420, 240 420 S 380 470, 390 600 Z" fill="#232838"/>
<path d="M200 420 l40 60 l40 -60" fill="none" stroke="${C.lime}" stroke-width="3"/>
<rect x="212" y="350" width="56" height="80" rx="20" fill="#d9b48f"/>
<ellipse cx="240" cy="270" rx="92" ry="108" fill="#e8c39d"/>
<path d="M146 262 C 140 170, 200 140, 250 146 C 320 150, 346 200, 334 262 C 320 214, 290 196, 240 200 C 196 202, 160 220, 146 262 Z" fill="#1b1e28"/>
<rect x="178" y="262" width="56" height="34" rx="12" fill="none" stroke="${C.ink}" stroke-width="4"/><rect x="246" y="262" width="56" height="34" rx="12" fill="none" stroke="${C.ink}" stroke-width="4"/><line x1="234" y1="276" x2="246" y2="276" stroke="${C.ink}" stroke-width="4"/>
<path d="M214 330 q26 18 52 0" fill="none" stroke="#9c6b4a" stroke-width="4" stroke-linecap="round"/>
<g font-family="JetBrains Mono, monospace" font-size="15" fill="${C.lime}">
  <text x="36" y="70">&lt;dev /&gt;</text>
  <text x="360" y="120" fill="${C.cyan}">{ }</text>
  <text x="380" y="520" fill="${C.ink}" opacity=".5">TS</text>
</g>
</svg>`);

/* ---------------- Favicon y portada OG ---------------- */
save('../favicon.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${C.lime}"/><path d="M18 44 L30 20 L34 20 L46 44" fill="none" stroke="${C.bg}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

save('og-cover.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${C.bg}"/>
<circle cx="1000" cy="120" r="320" fill="${C.lime}" opacity=".08"/>
<text x="80" y="300" fill="${C.ink}" font-family="Instrument Serif, serif" font-size="110">Full Stack</text>
<text x="80" y="410" fill="${C.lime}" font-family="Instrument Serif, serif" font-style="italic" font-size="110">Developer</text>
<text x="84" y="500" fill="${C.muted}" font-family="JetBrains Mono, monospace" font-size="28">NestJS · Angular · Postgres · IA</text>
</svg>`);

console.log('Ilustraciones generadas en public/images');
