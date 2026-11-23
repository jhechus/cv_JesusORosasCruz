export interface NavItem {
  path: string;
  label: string;
  index: string;
}

export const NAV: NavItem[] = [
  { path: '/', label: 'Inicio', index: '00' },
  { path: '/sobre-mi', label: 'Sobre mí', index: '01' },
  { path: '/experiencia', label: 'Experiencia', index: '02' },
  { path: '/habilidades', label: 'Habilidades', index: '03' },
  { path: '/contacto', label: 'Contacto', index: '04' },
];
