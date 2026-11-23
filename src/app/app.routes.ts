import { Routes } from '@angular/router';

const t = (page: string) => `${page} · CV Full Stack`;

/** Cada página es un chunk lazy y se prerenderiza a su propio index.html. */
export const routes: Routes = [
  {
    path: '',
    title: 'CV · Desarrollador Full Stack',
    data: { description: 'Desarrollador full stack: NestJS, Angular 19, Postgres e IA aplicada.' },
    loadComponent: () => import('./pages/home/home.page'),
  },
  {
    path: 'sobre-mi',
    title: t('Sobre mí'),
    data: { description: 'Quién soy, cómo trabajo y mi trayectoria.' },
    loadComponent: () => import('./pages/about/about.page'),
  },
  {
    path: 'experiencia',
    title: t('Experiencia'),
    data: { description: 'Proyectos y experiencia profesional.' },
    loadComponent: () => import('./pages/experience/experience.page'),
  },
  {
    path: 'experiencia/oficina-virtual',
    title: t('Oficina Virtual · Chubot'),
    data: { description: 'Caso de estudio: orquestador de agentes de IA con NestJS, Angular 19, Supabase y Claude.' },
    loadComponent: () => import('./pages/case-study/case-study.page'),
  },
  {
    path: 'habilidades',
    title: t('Habilidades'),
    data: { description: 'Stack técnico: backend, frontend, datos, IA y DevOps.' },
    loadComponent: () => import('./pages/skills/skills.page'),
  },
  {
    path: 'contacto',
    title: t('Contacto'),
    data: { description: 'Escríbeme para proyectos o posiciones.' },
    loadComponent: () => import('./pages/contact/contact.page'),
  },
  {
    path: '**',
    title: t('No encontrado'),
    loadComponent: () => import('./pages/not-found/not-found.page'),
  },
];
