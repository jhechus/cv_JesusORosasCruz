import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE, TIMELINE, VALUES } from '../../core/data/profile.data';
import { MOTION, useGsap } from '../../shared/motion';
import { NextPageComponent } from '../../shared/ui/cta-banner.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SectionHeadingComponent } from '../../shared/ui/section-heading.component';

@Component({
  selector: 'app-about-page',
  imports: [IconComponent, SectionHeadingComponent, NextPageComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-hero container">
      <p class="eyebrow" appReveal="left"><span class="idx">01</span>Sobre mí</p>
      <h1 class="display" appSplitWords>Me gusta que el software <em>no se rompa</em> cuando nadie lo mira.</h1>
    </header>

    <section class="container intro">
      <figure class="portrait" appReveal="clip">
        <img src="images/avatar.svg" [alt]="'Retrato de ' + profile.name" width="480" height="600" appParallax="-8" />
        <figcaption class="mono"><app-icon name="pin" [size]="14" /> {{ profile.location }} · {{ profile.availability }}</figcaption>
      </figure>
      <div class="bio">
        <p class="display quote" appSplitWords="scrub">{{ profile.summary[0] }}</p>
        @for (p of profile.summary.slice(1); track $index) {
          <p class="lead" appReveal>{{ p }}</p>
        }
        <dl class="facts" appReveal [revealStagger]="0.08">
          <div data-reveal-item><dt class="mono">Rol</dt><dd>{{ profile.role }}</dd></div>
          <div data-reveal-item><dt class="mono">Base</dt><dd>{{ profile.location }}</dd></div>
          <div data-reveal-item><dt class="mono">Stack</dt><dd>NestJS · Angular · Postgres</dd></div>
          <div data-reveal-item><dt class="mono">Idiomas</dt><dd>Español · Inglés técnico</dd></div>
        </dl>
      </div>
    </section>

    <section class="section container">
      <app-section-heading index="A" eyebrow="Cómo trabajo">Cuatro reglas que <em>sí</em> sigo.</app-section-heading>
      <div class="values" appReveal="scale" [revealStagger]="0.12">
        @for (v of values; track v.title; let i = $index) {
          <article class="card value" appTilt data-reveal-item>
            <span class="v-icon"><app-icon [name]="v.icon" [size]="24" /></span>
            <h3 class="display">{{ v.title }}</h3>
            <p class="muted">{{ v.text }}</p>
            <span class="v-num display">{{ i + 1 }}</span>
          </article>
        }
      </div>
    </section>

    <section class="section container">
      <app-section-heading index="B" eyebrow="Trayectoria">El camino <em>hasta aquí.</em></app-section-heading>
      <div class="timeline">
        <span class="rail" aria-hidden="true"><span class="rail-fill"></span></span>
        <ol class="t-list">
        @for (t of timeline; track t.title) {
          <li class="t-item" appReveal="right">
            <span class="dot" aria-hidden="true"></span>
            <span class="year display">{{ t.year }}</span>
            <div>
              <h3>{{ t.title }}</h3>
              <p class="muted">{{ t.text }}</p>
            </div>
          </li>
        }
        </ol>
      </div>
    </section>

    <div class="container"><app-next-page title="Experiencia" link="/experiencia" /></div>
  `,
  styleUrl: './about.page.scss',
})
export default class AboutPage {
  readonly profile = PROFILE;
  readonly values = VALUES;
  readonly timeline = TIMELINE;

  constructor() {
    // La línea de la trayectoria se llena con el scroll y cada punto se enciende al pasar.
    useGsap(({ gsap, reduced }) => {
      if (reduced) return;
      gsap.fromTo('.rail-fill', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true },
      });
      gsap.utils.toArray<HTMLElement>('.t-item').forEach((item) => {
        gsap.to(item.querySelector('.dot'), {
          backgroundColor: '#c6ff3d',
          boxShadow: '0 0 0 6px rgb(198 255 61 / .2)',
          scrollTrigger: { trigger: item, start: 'top 62%', toggleActions: 'play none none reverse' },
        });
      });
    });
  }
}
