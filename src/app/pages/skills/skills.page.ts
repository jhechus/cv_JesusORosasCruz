import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARQUEE, SKILL_GROUPS } from '../../core/data/skills.data';
import { MOTION, useGsap } from '../../shared/motion';
import { NextPageComponent } from '../../shared/ui/cta-banner.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SectionHeadingComponent } from '../../shared/ui/section-heading.component';

@Component({
  selector: 'app-skills-page',
  imports: [IconComponent, SectionHeadingComponent, NextPageComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-hero container">
      <p class="eyebrow" appReveal="left"><span class="idx">03</span>Habilidades</p>
      <h1 class="display" appSplitWords>Un stack <em>TypeScript</em> de la base de datos al navegador.</h1>
      <p class="lead" appReveal [revealDelay]="0.4">Desliza: cada área se llena conforme avanzas.</p>
    </header>

    <section class="groups">
      <div class="g-track">
        @for (g of groups; track g.id; let i = $index) {
          <article class="group card" appTilt="4">
            <header>
              <span class="g-icon"><app-icon [name]="g.icon" [size]="26" /></span>
              <span class="mono g-idx">{{ (i + 1).toString().padStart(2, '0') }} / {{ groups.length.toString().padStart(2, '0') }}</span>
            </header>
            <h2 class="display">{{ g.title }}</h2>
            <p class="muted">{{ g.blurb }}</p>
            <ul class="bars">
              @for (s of g.skills; track s.name) {
                <li>
                  <div class="bar-label"><span>{{ s.name }}</span>@if (s.note) {<small class="mono">{{ s.note }}</small>}</div>
                  <div class="bar"><span class="fill" [style.width.%]="s.level"></span></div>
                </li>
              }
            </ul>
          </article>
        }
      </div>
    </section>

    <section class="section container">
      <app-section-heading index="B" eyebrow="Herramientas" lead="Lo que uso en el día a día.">Todo en <em>una nube.</em></app-section-heading>
      <ul class="cloud" appReveal="scale" [revealStagger]="0.04">
        @for (t of tools; track t; let i = $index) {
          <li data-reveal-item [class.big]="i % 4 === 0" [class.alt]="i % 3 === 0">{{ t }}</li>
        }
      </ul>
    </section>

    <div class="container"><app-next-page title="Contacto" link="/contacto" /></div>
  `,
  styles: `
    .page-hero { padding: clamp(9rem, 16vw, 13rem) 0 clamp(2rem, 4vw, 3rem); }
    .page-hero h1 { font-size: clamp(2.8rem, 7.5vw, 6.5rem); line-height: 0.98; margin: 1.5rem 0; max-width: 17ch; }
    .page-hero h1 em { color: var(--lime); }

    .groups { min-height: 100vh; display: flex; align-items: center; overflow: hidden; padding: 3rem 0; }
    .g-track { display: flex; gap: 1.5rem; width: max-content; padding-inline: max(1.25rem, calc((100vw - 78rem) / 2)); }
    .group { width: min(27rem, 85vw); flex: none; padding: 2rem; display: grid; gap: 1rem; align-content: start; }
    .group header { display: flex; justify-content: space-between; align-items: center; }
    .g-icon { width: 3.25rem; aspect-ratio: 1; border-radius: 1rem; display: grid; place-items: center; background: var(--lime); color: var(--bg); }
    .g-idx { color: var(--muted); font-size: 0.75rem; }
    .group h2 { font-size: 2.6rem; }
    .bars { list-style: none; padding: 0; margin: 0.5rem 0 0; display: grid; gap: 1rem; }
    .bar-label { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.92rem; margin-bottom: 0.4rem; }
    .bar-label small { color: var(--muted); font-size: 0.68rem; }
    .bar { height: 6px; border-radius: 99px; background: rgb(255 255 255 / 0.06); overflow: hidden; }
    .fill { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--cyan), var(--lime)); transform-origin: left; }

    .cloud { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
    .cloud li { padding: 0.8rem 1.4rem; border: 1px solid var(--line); border-radius: 999px; font: 400 1.4rem/1 var(--font-display);
      transition: background 0.3s, color 0.3s, transform 0.4s var(--ease); cursor: default; }
    .cloud li.big { font-size: 2.2rem; }
    .cloud li.alt { font-style: italic; color: var(--ink-2); }
    .cloud li:hover { background: var(--lime); color: var(--bg); transform: translateY(-4px) rotate(-2deg); }

    @media (max-width: 899px) {
      .groups { min-height: 0; }
      .g-track { flex-direction: column; width: auto; }
      .group { width: auto; }
    }
  `,
})
export default class SkillsPage {
  readonly groups = SKILL_GROUPS;
  readonly tools = [...MARQUEE, 'Angular CDK', 'class-validator', 'Swagger', 'Postman', 'VS Code', 'Claude Code', 'Figma', 'Linux', 'nginx', 'pg-boss'];

  constructor() {
    useGsap(({ el, gsap, reduced }) => {
      const fills = gsap.utils.toArray<HTMLElement>('.fill');
      if (reduced) return;
      const mm = gsap.matchMedia();

      // Escritorio: las áreas pasan en horizontal con la sección fijada.
      mm.add('(min-width: 900px)', () => {
        const track = el.querySelector<HTMLElement>('.g-track')!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: '.groups', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>('.group').forEach((card) => {
          gsap.from(card.querySelectorAll('.fill'), {
            scaleX: 0,
            stagger: 0.08,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 80%', toggleActions: 'play none none reverse' },
          });
        });
      });

      // Móvil: cada barra se llena al aparecer.
      mm.add('(max-width: 899px)', () => {
        fills.forEach((f) =>
          gsap.from(f, { scaleX: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: f, start: 'top 92%', once: true } }),
        );
      });

      requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    });
  }
}
