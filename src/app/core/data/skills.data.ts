export interface Skill {
  name: string;
  level: number; // 0-100, para la barra animada
  note?: string;
}

export interface SkillGroup {
  id: string;
  icon: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'backend',
    icon: 'server',
    title: 'Backend',
    blurb: 'APIs modulares con inyección de dependencias, validación en DTOs y pruebas.',
    skills: [
      { name: 'NestJS', level: 92, note: 'módulos, guards, SSE' },
      { name: 'TypeScript', level: 92 },
      { name: 'Node.js', level: 88 },
      { name: 'REST + Server-Sent Events', level: 85 },
      { name: 'Jest', level: 78 },
      { name: 'Express', level: 75 },
    ],
  },
  {
    id: 'frontend',
    icon: 'layout',
    title: 'Frontend',
    blurb: 'Interfaces reactivas con standalone components, signals y animación.',
    skills: [
      { name: 'Angular 19', level: 90, note: 'signals, CDK, standalone' },
      { name: 'RxJS', level: 80 },
      { name: 'SCSS / Tailwind', level: 85 },
      { name: 'SVG y animación (GSAP)', level: 76 },
      { name: 'Next.js', level: 72 },
    ],
  },
  {
    id: 'data',
    icon: 'database',
    title: 'Datos',
    blurb: 'Modelado relacional y reglas de negocio reforzadas en la propia base.',
    skills: [
      { name: 'PostgreSQL', level: 86, note: 'triggers, enums, RLS' },
      { name: 'Supabase', level: 84 },
      { name: 'Prisma ORM', level: 82 },
      { name: 'Migraciones SQL', level: 82 },
    ],
  },
  {
    id: 'ai',
    icon: 'brain',
    title: 'IA aplicada',
    blurb: 'Agentes con salidas estructuradas, herramientas y control de gasto.',
    skills: [
      { name: 'Claude API (Anthropic SDK)', level: 85 },
      { name: 'Salidas estructuradas (JSON schema)', level: 84 },
      { name: 'Orquestación de agentes', level: 80 },
      { name: 'Prompting y skills', level: 82 },
    ],
  },
  {
    id: 'devops',
    icon: 'container',
    title: 'DevOps',
    blurb: 'Contenedores, despliegue continuo y checks antes de producción.',
    skills: [
      { name: 'Docker (multi-stage)', level: 80 },
      { name: 'Railway', level: 82 },
      { name: 'Vercel', level: 78 },
      { name: 'Git', level: 85 },
    ],
  },
  {
    id: 'integrations',
    icon: 'puzzle',
    title: 'Integraciones',
    blurb: 'Servicios externos conectados con límites y fallbacks.',
    skills: [
      { name: 'Telegram Bot API (grammY)', level: 84 },
      { name: 'Google Calendar / Places API', level: 72 },
      { name: 'MercadoPago', level: 70 },
      { name: 'Flutter (básico)', level: 55 },
    ],
  },
];

/** Logos de la marquesina (texto, sin marcas registradas en imagen). */
export const MARQUEE = ['NestJS', 'Angular 19', 'TypeScript', 'PostgreSQL', 'Supabase', 'Prisma', 'Claude API', 'Docker', 'Railway', 'RxJS', 'GSAP', 'Next.js', 'Jest', 'Telegram Bot API'];
