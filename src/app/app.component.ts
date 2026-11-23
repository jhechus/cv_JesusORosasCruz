import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotionService } from './core/motion/motion.service';
import { SeoService } from './core/seo/seo.service';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { ScrollProgressComponent } from './layout/scroll-progress.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ScrollProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">Saltar al contenido</a>
    <app-scroll-progress />
    <app-header style="view-transition-name: site-header" />
    <main id="main"><router-outlet /></main>
    <app-footer />
  `,
  styles: `
    .skip { position: fixed; left: 1rem; top: -4rem; z-index: 70; background: var(--lime); color: var(--bg); padding: 0.6rem 1rem; border-radius: 0.5rem; }
    .skip:focus { top: 1rem; }
    main { display: block; min-height: 100vh; }
  `,
})
export class AppComponent {
  constructor() {
    inject(MotionService); // registra GSAP + refresh de ScrollTrigger por ruta
    inject(SeoService).init();
  }
}
