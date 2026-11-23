import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../core/data/profile.data';
import { MOTION } from '../shared/motion';
import { IconComponent } from '../shared/ui/icon.component';
import { NAV } from './nav';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="top" appReveal>
        <p class="display big" data-reveal-item>¿Buscas un full stack<br /><em>para tu equipo?</em></p>
        <a class="btn" [href]="'mailto:' + profile.email" appMagnetic data-reveal-item><app-icon name="mail" /> {{ profile.email }}</a>
      </div>
      <div class="grid">
        <nav aria-label="Pie">
          @for (item of nav; track item.path) {
            <a [routerLink]="item.path">{{ item.label }}</a>
          }
        </nav>
        <div class="social">
          <a [href]="profile.github" target="_blank" rel="noopener" aria-label="GitHub"><app-icon name="github" /></a>
          <a [href]="profile.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"><app-icon name="linkedin" /></a>
          <a [href]="'mailto:' + profile.email" aria-label="Correo"><app-icon name="mail" /></a>
        </div>
      </div>
      <div class="bottom mono">
        <span>© {{ year }} {{ profile.name }}</span>
        <span>Angular 19 + GSAP · sitio estático prerenderizado</span>
      </div>
    </div>
    <div class="glow" aria-hidden="true"></div>
  `,
  styles: `
    :host { display: block; position: relative; overflow: hidden; border-top: 1px solid var(--line); padding: clamp(4rem, 8vw, 7rem) 0 2rem; }
    .top { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; align-items: flex-end; }
    .big { font-size: clamp(2.6rem, 7vw, 5.5rem); line-height: 0.95; margin: 0; }
    .big em { color: var(--lime); }
    .grid { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem; margin: 4rem 0 2.5rem; }
    nav { display: flex; flex-wrap: wrap; gap: 1.5rem; }
    nav a { color: var(--ink-2); text-decoration: none; transition: color 0.3s; }
    nav a:hover { color: var(--lime); }
    .social { display: flex; gap: 0.75rem; }
    .social a {
      width: 2.75rem; aspect-ratio: 1; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 50%; color: var(--ink);
      transition: background 0.3s, color 0.3s, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .social a:hover { background: var(--lime); color: var(--bg); transform: translateY(-3px) rotate(-8deg); }
    .bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; color: var(--muted); font-size: 0.75rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
    .glow { position: absolute; inset: auto -10% -60% -10%; height: 70%; background: radial-gradient(closest-side, rgb(198 255 61 / 0.12), transparent); pointer-events: none; }
  `,
})
export class FooterComponent {
  readonly profile = PROFILE;
  readonly nav = NAV;
  readonly year = new Date().getFullYear();
}
