import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOTION, useGsap } from '../../shared/motion';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf container">
      <p class="code display" aria-label="404"><span>4</span><span class="zero">0</span><span>4</span></p>
      <p class="mono muted">Transición no permitida: <span class="accent">ruta → 404</span> por "visitante"</p>
      <a routerLink="/" class="btn" appMagnetic><app-icon name="arrow" [size]="18" /> Volver al inicio</a>
    </section>
  `,
  styles: `
    .nf { min-height: 90vh; display: grid; place-content: center; justify-items: center; gap: 1.5rem; text-align: center; }
    .code { font-size: clamp(8rem, 30vw, 20rem); line-height: 0.85; display: flex; }
    .zero { color: var(--lime); font-style: italic; display: inline-block; }
  `,
})
export default class NotFoundPage {
  constructor() {
    useGsap(({ gsap, reduced }) => {
      if (reduced) return;
      gsap.from('.code span', { yPercent: 100, opacity: 0, stagger: 0.12, duration: 1, ease: 'power4.out' });
      gsap.to('.zero', { rotate: 360, duration: 6, repeat: -1, ease: 'none' });
    });
  }
}
