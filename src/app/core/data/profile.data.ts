/**
 * Datos personales del CV.
 * Las páginas leen de aquí, así que no hace falta tocar plantillas para actualizar el CV.
 */
export interface Profile {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string[];
}

export const PROFILE: Profile = {
  name: 'Jesus Osmari Rosas Cruz',
  shortName: 'Jesus Rosas',
  role: 'Desarrollador Full Stack',
  tagline: 'Construyo sistemas web de punta a punta: APIs en NestJS, paneles en Angular y datos en Postgres. Últimamente, equipos de agentes de IA que trabajan con supervisión humana.',
  location: 'México',
  availability: 'Disponible para proyectos y posiciones remotas',
  email: 'jess.osm1412@gmail.com',
  phone: '+52 55 4782 4383',
  github: 'https://github.com/jhechus',
  linkedin: 'https://www.linkedin.com/in/jesusrosascruz/',
  summary: [
    'Soy desarrollador full stack con foco en TypeScript. Trabajo con NestJS en el backend, Angular en el frontend y Postgres (Supabase o Prisma) como base de datos, y despliego con Docker en Railway o Vercel.',
    'Me gusta llevar un proyecto entero: modelar los datos, diseñar la API, construir la interfaz y dejarlo corriendo en producción con pruebas, healthchecks y documentación de despliegue.',
    'Mi proyecto más reciente es una oficina virtual de agentes de IA: un orquestador que recibe instrucciones por Telegram, las reparte entre agentes especializados y no da nada por terminado sin aprobación humana.',
  ],
};

export interface Value {
  icon: string;
  title: string;
  text: string;
}

export const VALUES: Value[] = [
  { icon: 'shield', title: 'Reglas en la base de datos', text: 'Si una regla de negocio importa, la refuerzo también en Postgres (triggers, RLS), no solo en el backend.' },
  { icon: 'test', title: 'Pruebas donde duele', text: 'Máquinas de estado, presupuestos y permisos llevan pruebas. Es lo que más caro sale romper.' },
  { icon: 'rocket', title: 'Pensado para producción', text: 'El servicio se niega a arrancar si falta configuración, en vez de fallar en silencio con datos de prueba.' },
  { icon: 'users', title: 'El humano decide', text: 'La automatización propone y la persona aprueba. Diseño los flujos para que eso no se pueda saltar.' },
];

export interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

export const TIMELINE: TimelineItem[] = [
  { year: '2026', title: 'Oficina Virtual · Chubot', text: 'Orquestador de agentes de IA con NestJS, Angular 19, Supabase y Claude. Desplegado en Railway con Docker.' },
];
