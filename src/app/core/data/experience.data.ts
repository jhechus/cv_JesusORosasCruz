/**
 * Experiencia. Cada entrada tiene su página de detalle en /experiencia/:slug.
 * El contenido de Oficina Virtual sale del README y DEPLOY.md de `oficinavirtual/`.
 */
export interface Metric {
  value: number;
  suffix?: string;
  label: string;
}

export interface Agent {
  name: string;
  role: string;
  department: string;
  color: string;
  skills: string[];
}

export interface PipelineStep {
  key: string;
  label: string;
  actor: string;
  text: string;
  color: string;
}

export interface SecurityLayer {
  icon: string;
  title: string;
  text: string;
  code: string;
}

export interface Experience {
  slug: string;
  title: string;
  codename: string;
  company: string;
  period: string;
  role: string;
  summary: string;
  cover: string;
  stack: string[];
  highlights: string[];
  metrics: Metric[];
}

export const OFICINA_VIRTUAL: Experience = {
  slug: 'oficina-virtual',
  title: 'Oficina Virtual',
  codename: 'Chubot',
  company: 'Proyecto propio · Osmaritech',
  period: '2026 — actualidad', // [TODO] ajusta fechas
  role: 'Arquitectura y desarrollo full stack',
  summary:
    'Un orquestador de IA con un equipo de agentes para el negocio. Le hablas a Chubot por Telegram o desde el panel, él divide la instrucción en tareas y se las asigna a agentes especializados. Lo que entregan aparece en un tablero tipo Trello y nada se da por terminado hasta que un humano lo aprueba.',
  cover: 'images/office-iso.svg',
  stack: ['NestJS', 'TypeScript', 'Angular 19', 'Angular CDK', 'RxJS', 'Supabase', 'PostgreSQL', 'Claude API', 'grammY', 'SSE', 'Docker', 'Railway', 'Jest'],
  highlights: [
    'Máquina de estados con permisos por actor (humano, agente, orquestador, sistema) y pruebas unitarias.',
    'Trigger en Postgres que impide completar una tarea sin aprobación humana, aunque alguien se salte la API.',
    'Tablero kanban en Angular CDK con drag & drop y actualización en vivo por Server-Sent Events.',
    'Oficina isométrica en SVG donde cada agente se mueve según el estado de su tarea.',
    'Salidas estructuradas (JSON schema) con Claude y límite de gasto mensual que pausa a los agentes.',
    'Soporte multi-negocio: cada agente solo ve el contexto del negocio de su tarea, verificado con pruebas.',
    'Despliegue en un solo contenedor Docker en Railway, con healthcheck y arranque bloqueado si falta configuración.',
  ],
  metrics: [
    { value: 6, label: 'agentes especializados' },
    { value: 13, label: 'skills cargables' },
    { value: 17, label: 'suites de pruebas' },
    { value: 11, label: 'migraciones SQL' },
  ],
};

export const EXPERIENCES: Experience[] = [OFICINA_VIRTUAL];

export const AGENTS: Agent[] = [
  { name: 'Luna', role: 'Redacción', department: 'Marketing', color: '#ff7ab6', skills: ['copywriting', 'copy-editing', 'emails', 'linkedin'] },
  { name: 'Mateo', role: 'Marketing', department: 'Marketing', color: '#ffb347', skills: ['content-strategy', 'social', 'linkedin'] },
  { name: 'Iris', role: 'Multimedia', department: 'Diseño', color: '#b18cff', skills: ['image-prompts', 'video-script'] },
  { name: 'Bruno', role: 'Ventas', department: 'Ventas', color: '#3de0ff', skills: ['sales-outreach', 'cold-email'] },
  { name: 'Nico', role: 'Desarrollo', department: 'Ingeniería', color: '#c6ff3d', skills: ['code-standards'] },
  { name: 'Sofi', role: 'Soporte', department: 'Soporte', color: '#5cf2a6', skills: ['support-replies', 'brand-voice'] },
];

export const PIPELINE: PipelineStep[] = [
  { key: 'pending', label: 'Pendiente', actor: 'system', color: '#8a8f9c', text: 'Chubot desglosa el mensaje en tareas, elige el agente y el negocio, y las encola.' },
  { key: 'in_progress', label: 'En progreso', actor: 'agent', color: '#3de0ff', text: 'El agente carga sus skills, trabaja con el contexto del negocio y devuelve un borrador en JSON.' },
  { key: 'awaiting_approval', label: 'Espera de aprobación', actor: 'agent', color: '#ffb347', text: 'El agente solo puede llegar hasta aquí. La tarea aparece en el tablero y en Telegram con botones.' },
  { key: 'in_correction', label: 'En corrección', actor: 'human', color: '#ff7ab6', text: 'Si pides cambios, el comentario vuelve al agente y rehace el borrador en una nueva revisión.' },
  { key: 'completed', label: 'Completado', actor: 'human', color: '#c6ff3d', text: 'Solo una persona puede completar. Postgres exige approved_by y approved_at.' },
];

export const SECURITY: SecurityLayer[] = [
  {
    icon: 'workflow',
    title: 'Máquina de estados',
    text: 'Cada transición declara qué actor puede ejecutarla. Los agentes nunca pueden aprobar su propio trabajo.',
    code: `awaiting_approval: [\n  { to: 'completed', actors: ['human'] },\n  { to: 'in_correction', actors: ['human'] },\n]`,
  },
  {
    icon: 'database',
    title: 'Trigger en Postgres',
    text: 'guard_task_completion rechaza pasar a completed si la tarea no venía de awaiting_approval o faltan los datos de aprobación.',
    code: `if new.approved_by is null\n   or new.approved_at is null then\n  raise exception 'Requiere aprobación humana';`,
  },
  {
    icon: 'lock',
    title: 'Agentes sin publicación',
    text: 'Los agentes solo devuelven JSON (title, content, notes_for_reviewer). Lo que publique hacia fuera sale de approve().',
    code: `{ "title": "...", "content": "...",\n  "notes_for_reviewer": "..." }`,
  },
  {
    icon: 'shield',
    title: 'Acceso cerrado',
    text: 'El bot ignora todo chat que no sea el del dueño, la API exige x-admin-token y RLS bloquea todo salvo service_role.',
    code: `@UseGuards(AdminTokenGuard)\nx-admin-token: ••••••••`,
  },
];

export const CHAT: { from: 'me' | 'bot'; text: string }[] = [
  { from: 'me', text: 'Prepara 3 posts de LinkedIn sobre el lanzamiento y una lista de 10 gimnasios en CDMX para contactar.' },
  { from: 'bot', text: 'Listo, lo dividí en 2 tareas:\n• Mateo (Marketing) → 3 posts\n• Bruno (Ventas) → prospectos con Places API' },
  { from: 'bot', text: '✅ Mateo terminó "3 posts de lanzamiento". Está en Espera de aprobación.' },
  { from: 'me', text: 'Pedir cambios: el segundo post más corto.' },
];
