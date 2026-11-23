import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXPERIENCES } from '../../core/data/experience.data';
import { MOTION } from '../../shared/motion';
import { NextPageComponent } from '../../shared/ui/cta-banner.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { ChipComponent } from '../../shared/ui/tech-chip.component';

@Component({
  selector: 'app-experience-page',
  imports: [RouterLink, IconComponent, ChipComponent, NextPageComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-hero container">
      <p class="eyebrow" appReveal="left"><span class="idx">02</span>Experiencia</p>
      <h1 class="display" appSplitWords>Proyectos que <em>llegaron</em> a producción.</h1>
      <p class="lead" appReveal [revealDelay]="0.4">Cada entrada tiene su caso de estudio: el problema, la arquitectura y las decisiones que tomé.</p>
    </header>

    <section class="container list">
      @for (xp of experiences; track xp.slug; let i = $index) {
        <article class="xp">
          <aside class="xp-side">
            <div class="sticky" appReveal="left">
              <span class="mono idx">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <p class="mono period">{{ xp.period }}</p>
              <p class="company">{{ xp.company }}</p>
              <p class="mono role">{{ xp.role }}</p>
            </div>
          </aside>

          <div class="xp-main">
            <a class="cover card" [routerLink]="['/experiencia', xp.slug]" appReveal="clip" appTilt="4">
              <img [src]="xp.cover" [alt]="'Ilustración de ' + xp.title" width="873" height="589" loading="lazy" appParallax="-12" />
              <span class="cover-cta"><app-icon name="eye" [size]="18" /> Ver caso de estudio</span>
            </a>

            <h2 class="display title" appSplitWords>{{ xp.title }} <em>· {{ xp.codename }}</em></h2>
            <p class="lead" appReveal>{{ xp.summary }}</p>

            <ul class="highlights" appReveal [revealStagger]="0.07">
              @for (h of xp.highlights; track h) {
                <li data-reveal-item><app-icon name="check" [size]="18" /><span>{{ h }}</span></li>
              }
            </ul>

            <div class="stack" appReveal [revealStagger]="0.04">
              @for (t of xp.stack; track t) {
                <app-chip data-reveal-item>{{ t }}</app-chip>
              }
            </div>

            <a class="btn" [routerLink]="['/experiencia', xp.slug]" appMagnetic>Leer caso completo <app-icon name="arrow" [size]="18" /></a>
          </div>
        </article>
      }

      <article class="xp next-slot" appReveal>
        <aside class="xp-side"><span class="mono idx">+</span></aside>
        <div class="card slot">
          <app-icon name="sparkles" [size]="28" />
          <p class="display">Tu proyecto podría ser el siguiente.</p>
          <a routerLink="/contacto" class="btn btn-ghost btn-small" appMagnetic>Hablemos</a>
        </div>
      </article>
    </section>

    <div class="container"><app-next-page title="Oficina Virtual" link="/experiencia/oficina-virtual" /></div>
  `,
  styles: `
    .page-hero { padding: clamp(9rem, 16vw, 13rem) 0 clamp(3rem, 6vw, 5rem); }
    .page-hero h1 { font-size: clamp(2.8rem, 7.5vw, 6.5rem); line-height: 0.98; margin: 1.5rem 0; max-width: 16ch; }
    .page-hero h1 em, .title em { color: var(--lime); }
    .page-hero .lead { max-width: 38rem; }

    .list { display: grid; gap: 6rem; padding-bottom: 4rem; }
    .xp { display: grid; grid-template-columns: 15rem 1fr; gap: clamp(1.5rem, 4vw, 4rem); }
    .sticky { position: sticky; top: 7rem; display: grid; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--lime); }
    .idx { font-size: 3rem; color: var(--lime); line-height: 1; }
    .period { color: var(--muted); font-size: 0.8rem; }
    .company { font-weight: 600; }
    .role { color: var(--ink-2); font-size: 0.78rem; }

    .xp-main { display: grid; gap: 2rem; justify-items: start; }
    .cover { display: block; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: #0d0f15; position: relative; }
    .cover img { width: 100%; height: 115%; object-fit: cover; }
    .cover-cta { position: absolute; left: 1.25rem; bottom: 1.25rem; display: inline-flex; gap: 0.5rem; align-items: center; padding: 0.7rem 1.1rem; border-radius: 999px;
      background: var(--lime); color: var(--bg); font-weight: 600; font-size: 0.9rem; transform: translateY(150%); transition: transform 0.6s var(--ease); }
    .cover:hover .cover-cta, .cover:focus-visible .cover-cta { transform: none; }
    .title { font-size: clamp(2.4rem, 5vw, 4rem); }

    .highlights { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem 2rem; }
    .highlights li { display: flex; gap: 0.75rem; color: var(--ink-2); }
    .highlights app-icon { color: var(--lime); flex: none; margin-top: 0.2rem; }
    .stack { display: flex; flex-wrap: wrap; gap: 0.5rem; }

    .slot { padding: 3rem; display: grid; justify-items: start; gap: 1rem; border-style: dashed; color: var(--ink-2); }
    .slot p { font-size: clamp(1.8rem, 3vw, 2.6rem); color: var(--ink); }

    @media (max-width: 860px) {
      .xp { grid-template-columns: 1fr; }
      .sticky { position: static; }
      .highlights { grid-template-columns: 1fr; }
    }
  `,
})
export default class ExperiencePage {
  readonly experiences = EXPERIENCES;
}
