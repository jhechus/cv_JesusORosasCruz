import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENTS, CHAT, OFICINA_VIRTUAL, PIPELINE, SECURITY } from '../../core/data/experience.data';
import { MOTION, useGsap } from '../../shared/motion';
import { NextPageComponent } from '../../shared/ui/cta-banner.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SectionHeadingComponent } from '../../shared/ui/section-heading.component';
import { ChipComponent } from '../../shared/ui/tech-chip.component';
import { ArchitectureDiagramComponent } from './architecture-diagram.component';

@Component({
  selector: 'app-case-study-page',
  imports: [RouterLink, IconComponent, SectionHeadingComponent, NextPageComponent, ChipComponent, ArchitectureDiagramComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './case-study.page.html',
  styleUrl: './case-study.page.scss',
})
export default class CaseStudyPage {
  readonly xp = OFICINA_VIRTUAL;
  readonly agents = AGENTS;
  readonly pipeline = PIPELINE;
  readonly security = SECURITY;
  readonly chat = CHAT;

  readonly meta = [
    { k: 'Rol', v: OFICINA_VIRTUAL.role },
    { k: 'Periodo', v: OFICINA_VIRTUAL.period },
    { k: 'Backend', v: 'NestJS · Supabase' },
    { k: 'Deploy', v: 'Docker · Railway' },
  ];

  readonly deploy = [
    { icon: 'code', title: 'Build multi-stage', text: 'El Dockerfile compila el panel Angular y el backend NestJS y deja una imagen final ligera.' },
    { icon: 'shield', title: 'production-check', text: 'Con NODE_ENV=production el backend se niega a arrancar si falta Supabase, Anthropic o un ADMIN_TOKEN nuevo.' },
    { icon: 'gauge', title: 'Healthcheck', text: 'Railway revisa /api/health y reinicia siempre ante fallos.' },
    { icon: 'radio', title: '1 réplica, overlap 0', text: 'La cola y el bus viven en memoria y Telegram no admite dos bots: se apaga la copia vieja antes de prender la nueva.' },
  ];

  readonly next = [
    'Transcribir notas de voz de Telegram (Whisper / Deepgram).',
    'Subir entregables aprobados a Google Drive (external_url ya reservado).',
    'Mover la cola en memoria a pg-boss o BullMQ para escalar a varios workers.',
  ];

  constructor() {
    useGsap(({ el, gsap, reduced }) => {
      if (reduced) return;
      const mm = gsap.matchMedia();

      // 1) Portada: la imagen se "aleja" (scale) mientras el texto sube.
      gsap.fromTo('.cs-cover img', { scale: 1.25 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.cs-cover', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // 2) Chat de Telegram: en escritorio la sección se fija y los mensajes llegan con el scroll.
      const msgs = gsap.utils.toArray<HTMLElement>('.msg');
      const steps = gsap.utils.toArray<HTMLElement>('.how-step');
      mm.add('(min-width: 900px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.how', start: 'top top', end: `+=${msgs.length * 380}`, pin: true, scrub: 0.5 },
        });
        msgs.forEach((m, i) => {
          tl.fromTo(m, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.6)' }, i * 1.2);
          if (steps[i]) {
            tl.to(steps, { opacity: 0.3, duration: 0.3 }, i * 1.2).to(steps[i], { opacity: 1, duration: 0.3 }, i * 1.2);
          }
        });
        tl.to({}, { duration: 0.6 });
      });
      mm.add('(max-width: 899px)', () => {
        msgs.forEach((m) =>
          gsap.from(m, { opacity: 0, y: 24, duration: 0.7, scrollTrigger: { trigger: m, start: 'top 90%', once: true } }),
        );
      });

      // 3) Pipeline: scroll horizontal fijado en escritorio; la barra de progreso avanza con él.
      mm.add('(min-width: 900px)', () => {
        const track = el.querySelector<HTMLElement>('.pipe-track')!;
        const distance = () => track.scrollWidth - window.innerWidth + 80;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.pipe',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo('.pipe-progress span', { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.pipe', start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>('.state').forEach((card) => {
          gsap.from(card, {
            opacity: 0.25,
            scale: 0.9,
            rotateY: -18,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 95%', end: 'left 55%', scrub: true },
          });
        });
      });

      // 4) Capas de seguridad apiladas: cada tarjeta se encoge cuando la siguiente la tapa.
      const layers = gsap.utils.toArray<HTMLElement>('.layer');
      layers.slice(0, -1).forEach((card, i) => {
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: { trigger: layers[i + 1], start: 'top 85%', end: 'top 25%', scrub: true },
        });
      });

      // 5) Tablero: entra inclinado en 3D y se aplana al llegar.
      gsap.fromTo('.board-img', { rotateX: 28, scale: 0.88, y: 60 }, {
        rotateX: 0,
        scale: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.board', start: 'top bottom', end: 'center center', scrub: true },
      });

      // Los pins agregan alto a la página: ordena y recalcula los triggers que ya existían.
      requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      return () => mm.revert();
    });
  }
}
