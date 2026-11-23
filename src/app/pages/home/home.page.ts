import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OFICINA_VIRTUAL } from '../../core/data/experience.data';
import { PROFILE } from '../../core/data/profile.data';
import { MARQUEE } from '../../core/data/skills.data';
import { MOTION, useGsap } from '../../shared/motion';
import { NextPageComponent } from '../../shared/ui/cta-banner.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SectionHeadingComponent } from '../../shared/ui/section-heading.component';
import { ChipComponent } from '../../shared/ui/tech-chip.component';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, IconComponent, SectionHeadingComponent, NextPageComponent, ChipComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export default class HomePage {
  readonly profile = PROFILE;
  readonly project = OFICINA_VIRTUAL;
  readonly marquee = [...MARQUEE, ...MARQUEE];

  readonly services = [
    { icon: 'server', title: 'APIs que aguantan', text: 'NestJS modular, DTOs validados, guards y pruebas. Reglas críticas reforzadas también en Postgres.', tags: ['NestJS', 'Postgres', 'Jest'] },
    { icon: 'layout', title: 'Interfaces vivas', text: 'Angular con signals y CDK: tableros con drag & drop, tiempo real por SSE y animaciones con intención.', tags: ['Angular 19', 'RxJS', 'GSAP'] },
    { icon: 'brain', title: 'IA con supervisión', text: 'Agentes con salidas estructuradas, skills y límite de gasto. La IA propone; una persona aprueba.', tags: ['Claude API', 'JSON schema'] },
  ];

  readonly pages = [
    { path: '/sobre-mi', index: '01', title: 'Sobre mí', text: 'Cómo trabajo y mi trayectoria.', icon: 'user' },
    { path: '/experiencia', index: '02', title: 'Experiencia', text: 'Oficina Virtual, caso a fondo.', icon: 'briefcase' },
    { path: '/habilidades', index: '03', title: 'Habilidades', text: 'Stack por áreas y nivel.', icon: 'layers' },
    { path: '/contacto', index: '04', title: 'Contacto', text: 'Hablemos de una vacante.', icon: 'send' },
  ];

  constructor() {
    // Entrada del hero: timeline al cargar (no depende del scroll).
    useGsap(({ el, gsap, reduced }) => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.hero-photo', { clipPath: 'inset(100% 0 0 0)', scale: 1.15, duration: 1.4 }, 0.1)
        .from('.float-chip', { scale: 0, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'back.out(2)' }, 0.8)
        .from('.badge', { rotate: -120, opacity: 0, duration: 1.2 }, 0.6)
        .from('.hero-meta > *', { y: 20, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.5);

      // El hero se aleja (escala + desvanece) mientras haces scroll fuera de él.
      gsap.to('.hero-inner', {
        yPercent: 18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      // La marquesina acelera y cambia de sentido según la dirección del scroll.
      const track = el.querySelector<HTMLElement>('.marquee-track');
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 30, repeat: -1 });
        const boost = gsap.utils.clamp(1, 6);
        gsap.timeline({
          scrollTrigger: {
            trigger: '.marquee',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              const dir = self.direction;
              gsap.to(loop, {
                timeScale: dir * boost(1 + Math.abs(self.getVelocity()) / 500),
                duration: 0.2,
                overwrite: true,
                onComplete: () => void gsap.to(loop, { timeScale: dir, duration: 1.2 }),
              });
            },
          },
        });
      }
    });
  }
}
