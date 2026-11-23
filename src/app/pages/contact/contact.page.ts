import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PROFILE } from '../../core/data/profile.data';
import { MotionService } from '../../core/motion/motion.service';
import { MOTION } from '../../shared/motion';
import { IconComponent } from '../../shared/ui/icon.component';

/**
 * Sitio estático: no hay backend. El formulario arma un mailto con el mensaje,
 * así funciona en cualquier hosting sin exponer credenciales ni servicios de terceros.
 */
@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-hero container">
      <p class="eyebrow" appReveal="left"><span class="idx">04</span>Contacto</p>
      <h1 class="display" appSplitWords>Hablemos de <em>lo que quieres construir.</em></h1>
    </header>

    <section class="container contact">
      <div class="left">
        <button type="button" class="email display" (click)="copy()" appReveal="clip" [attr.aria-label]="'Copiar ' + profile.email">
          <span class="email-text">{{ profile.email }}</span>
          <span class="copy mono" [class.ok]="copied()">
            <app-icon [name]="copied() ? 'check' : 'file'" [size]="14" /> {{ copied() ? 'Copiado' : 'Copiar' }}
          </span>
        </button>

        <ul class="channels" appReveal [revealStagger]="0.1">
          @for (c of channels; track c.label) {
            <li data-reveal-item>
              <a [href]="c.href" [attr.target]="c.external ? '_blank' : null" rel="noopener" class="channel card" appTilt="6">
                <span class="c-icon"><app-icon [name]="c.icon" [size]="22" /></span>
                <span><strong>{{ c.label }}</strong><small class="mono">{{ c.value }}</small></span>
                <app-icon name="external" [size]="18" class="c-go" />
              </a>
            </li>
          }
        </ul>

        <p class="status mono" appReveal><span class="pulse"></span>{{ profile.availability }}</p>
      </div>

      <form class="card form" [formGroup]="form" (ngSubmit)="send()" appReveal="right">
        <h2 class="display">Escríbeme</h2>
        <label>
          <span class="mono">Nombre</span>
          <input formControlName="name" autocomplete="name" placeholder="¿Cómo te llamas?" />
        </label>
        <label>
          <span class="mono">Asunto</span>
          <select formControlName="topic">
            @for (t of topics; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </label>
        <label>
          <span class="mono">Mensaje</span>
          <textarea formControlName="message" rows="5" placeholder="Cuéntame del proyecto o la posición"></textarea>
        </label>
        @if (submitted() && form.invalid) {
          <p class="error mono">Completa tu nombre y un mensaje de al menos 10 caracteres.</p>
        }
        <button class="btn" type="submit" appMagnetic><app-icon name="send" [size]="18" /> Abrir en mi correo</button>
      </form>
    </section>
  `,
  styles: `
    .page-hero { padding: clamp(9rem, 16vw, 13rem) 0 clamp(2rem, 4vw, 3rem); }
    .page-hero h1 { font-size: clamp(2.8rem, 7.5vw, 6.5rem); line-height: 0.98; margin-top: 1.5rem; max-width: 15ch; }
    .page-hero h1 em { color: var(--lime); }

    .contact { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(2rem, 5vw, 5rem); align-items: start; padding-bottom: 6rem; }
    .left { display: grid; gap: 2rem; }

    .email { all: unset; cursor: pointer; display: grid; gap: 0.75rem; font-size: clamp(1.6rem, 3.6vw, 3rem); line-height: 1.1; word-break: break-all; }
    .email-text { background: linear-gradient(var(--lime), var(--lime)) 0 100% / 0 2px no-repeat; transition: background-size 0.6s var(--ease); justify-self: start; }
    .email:hover .email-text, .email:focus-visible .email-text { background-size: 100% 2px; }
    .copy { font-size: 0.75rem; color: var(--muted); display: inline-flex; gap: 0.4rem; align-items: center; transition: color 0.3s; }
    .copy.ok { color: var(--lime); }

    .channels { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
    .channel { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; text-decoration: none; color: var(--ink); transition: border-color 0.3s; }
    .channel:hover { border-color: var(--lime); }
    .channel span:nth-child(2) { display: grid; }
    .channel small { color: var(--muted); font-size: 0.75rem; }
    .c-icon { width: 2.75rem; aspect-ratio: 1; border-radius: 0.8rem; display: grid; place-items: center; background: rgb(198 255 61 / 0.1); color: var(--lime); }
    .c-go { margin-left: auto; color: var(--muted); transition: transform 0.4s var(--ease), color 0.3s; }
    .channel:hover .c-go { transform: translate(3px, -3px); color: var(--lime); }

    .status { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; color: var(--ink-2); }
    .pulse { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--lime); animation: ping 2s infinite; }
    @keyframes ping { 0% { box-shadow: 0 0 0 0 rgb(198 255 61 / 0.7); } 70%, 100% { box-shadow: 0 0 0 0.7rem rgb(198 255 61 / 0); } }

    .form { padding: clamp(1.5rem, 3vw, 2.5rem); display: grid; gap: 1.25rem; }
    .form h2 { font-size: 2.6rem; }
    label { display: grid; gap: 0.5rem; }
    label .mono { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
    input, select, textarea {
      font: inherit; color: var(--ink); background: var(--bg); border: 1px solid var(--line); border-radius: 0.8rem; padding: 0.85rem 1rem;
      transition: border-color 0.3s, box-shadow 0.3s; resize: vertical;
    }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--lime); box-shadow: 0 0 0 4px rgb(198 255 61 / 0.12); }
    .error { color: var(--pink); font-size: 0.78rem; }
    .form .btn { justify-self: start; }

    @media (max-width: 860px) { .contact { grid-template-columns: 1fr; } }
  `,
})
export default class ContactPage {
  readonly profile = PROFILE;
  readonly copied = signal(false);
  readonly submitted = signal(false);
  private readonly motion = inject(MotionService);

  readonly topics = ['Posición de trabajo', 'Proyecto freelance', 'Colaboración', 'Otro'];

  readonly channels = [
    { icon: 'mail', label: 'Correo', value: PROFILE.email, href: `mailto:${PROFILE.email}`, external: false },
    { icon: 'linkedin', label: 'LinkedIn', value: PROFILE.linkedin.replace('https://www.', ''), href: PROFILE.linkedin, external: true },
    { icon: 'github', label: 'GitHub', value: PROFILE.github.replace('https://', ''), href: PROFILE.github, external: true },
    { icon: 'phone', label: 'WhatsApp', value: PROFILE.phone, href: `https://wa.me/${PROFILE.phone.replace(/\D/g, '')}`, external: true },
  ];

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    topic: [this.topics[0]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  async copy(): Promise<void> {
    if (!this.motion.isBrowser) return;
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      location.href = `mailto:${PROFILE.email}`;
    }
  }

  send(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const { name, topic, message } = this.form.getRawValue();
    const subject = encodeURIComponent(`${topic} — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  }
}
