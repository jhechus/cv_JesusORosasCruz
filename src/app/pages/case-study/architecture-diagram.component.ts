import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawSvgDirective } from '../../shared/motion/draw-svg.directive';

interface Node {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  color: string;
}

/**
 * Diagrama de arquitectura de Chubot. Los nodos aparecen y las conexiones se dibujan
 * al ritmo del scroll (appDrawSvg). La línea SSE es punteada y "fluye" con CSS.
 */
@Component({
  selector: 'app-architecture-diagram',
  imports: [DrawSvgDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" appDrawSvg drawStart="top 80%" drawEnd="bottom 70%">
      <svg viewBox="0 0 1000 590" role="img" aria-label="Diagrama: Telegram y el panel Angular hablan con la API NestJS; Chubot desglosa en tareas, la cola las reparte a los agentes, Supabase guarda todo y el panel recibe eventos por SSE.">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#7d8090" />
          </marker>
          <filter id="nglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>

        <g class="edges" fill="none" stroke-width="2" marker-end="url(#arr)">
          <path data-draw stroke="#3de0ff" d="M250 112 C 300 112, 290 230, 328 236" />
          <path data-draw stroke="#b18cff" d="M250 372 C 300 372, 290 262, 328 256" />
          <path data-draw stroke="#ffb347" d="M512 236 C 560 236, 540 112, 588 112" />
          <path data-draw stroke="#ffb347" d="M675 146 L 675 326" />
          <path data-draw stroke="#c6ff3d" d="M762 360 C 800 360, 800 266, 834 266" />
          <path data-draw stroke="#c6ff3d" d="M762 360 L 834 360" />
          <path data-draw stroke="#c6ff3d" d="M762 360 C 800 360, 800 454, 834 454" />
          <path data-draw stroke="#5cf2a6" d="M420 280 L 420 414" />
        </g>
        <path class="sse" d="M675 394 C 675 590, 145 590, 145 410" fill="none" stroke="#3de0ff" stroke-width="2" marker-end="url(#arr)" />
        <text class="sse-label" x="540" y="560">SSE · eventos en vivo</text>

        @for (n of nodes; track n.id) {
          <g data-node>
            <rect [attr.x]="n.x" [attr.y]="n.y" [attr.width]="n.w" [attr.height]="n.h" rx="14" [attr.fill]="n.color" opacity=".22" filter="url(#nglow)" />
            <rect [attr.x]="n.x" [attr.y]="n.y" [attr.width]="n.w" [attr.height]="n.h" rx="14" fill="#14161f" [attr.stroke]="n.color" stroke-width="1.5" />
            <circle [attr.cx]="n.x + 18" [attr.cy]="n.y + n.h / 2" r="5" [attr.fill]="n.color" />
            <text [attr.x]="n.x + 32" [attr.y]="n.y + n.h / 2 - 3" class="t">{{ n.title }}</text>
            <text [attr.x]="n.x + 32" [attr.y]="n.y + n.h / 2 + 14" class="s">{{ n.sub }}</text>
          </g>
        }
      </svg>
    </div>
    <p class="hint mono" aria-hidden="true">← desliza el diagrama →</p>
  `,
  styles: `
    .wrap { border: 1px solid var(--line); border-radius: var(--radius); background: radial-gradient(ellipse at center, #141722, var(--bg-2)); padding: clamp(0.5rem, 2vw, 2rem); overflow-x: auto; }
    svg { min-width: 680px; width: 100%; height: auto; }
    .t { font: 600 15px var(--font-body); fill: var(--ink); }
    .s { font: 400 11.5px var(--font-mono); fill: var(--muted); }
    .sse { stroke-dasharray: 6 8; animation: flow 1.2s linear infinite; opacity: 0.8; }
    .sse-label { font: 500 12px var(--font-mono); fill: var(--cyan); }
    .hint { display: none; margin-top: 0.6rem; font-size: 0.7rem; color: var(--muted); text-align: center; }
    @media (max-width: 720px) { .hint { display: block; } }
    @keyframes flow { to { stroke-dashoffset: -28; } }
  `,
})
export class ArchitectureDiagramComponent {
  readonly nodes: Node[] = [
    { id: 'tg', x: 40, y: 80, w: 210, h: 64, title: 'Telegram', sub: 'grammY · long polling', color: '#3de0ff' },
    { id: 'panel', x: 40, y: 340, w: 210, h: 64, title: 'Panel Angular 19', sub: 'kanban · oficina SVG', color: '#b18cff' },
    { id: 'api', x: 330, y: 214, w: 182, h: 64, title: 'API NestJS', sub: 'x-admin-token · REST', color: '#eeebe3' },
    { id: 'chubot', x: 590, y: 82, w: 170, h: 64, title: 'Chubot', sub: 'Claude Haiku · plan', color: '#ffb347' },
    { id: 'queue', x: 590, y: 328, w: 170, h: 64, title: 'Pipeline', sub: 'cola · estados', color: '#ffb347' },
    { id: 'a1', x: 836, y: 240, w: 156, h: 52, title: 'Marketing', sub: 'Luna · Mateo', color: '#ff7ab6' },
    { id: 'a2', x: 836, y: 334, w: 156, h: 52, title: 'Ventas', sub: 'Bruno', color: '#3de0ff' },
    { id: 'a3', x: 836, y: 428, w: 156, h: 52, title: '+3 agentes', sub: 'Iris · Nico · Sofi', color: '#c6ff3d' },
    { id: 'db', x: 320, y: 416, w: 200, h: 64, title: 'Supabase', sub: 'Postgres · RLS · trigger', color: '#5cf2a6' },
  ];
}
