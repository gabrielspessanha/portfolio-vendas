import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type PillarIcon = 'team' | 'code' | 'rocket' | 'support';

interface Pillar {
  icon: PillarIcon;
  title: string;
  desc: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  isVisible = false;

  readonly pillars: Pillar[] = [
    {
      icon: 'team',
      title: 'Direto com a equipe',
      desc: 'Sem intermediários, sem terceirização. Você fala com quem está construindo.',
    },
    {
      icon: 'code',
      title: 'Código próprio',
      desc: 'Tudo desenvolvido do zero, otimizado pra performance e SEO.',
    },
    {
      icon: 'rocket',
      title: 'Entrega em dias',
      desc: 'Processo enxuto: do briefing ao site no ar em 7 dias.',
    },
    {
      icon: 'support',
      title: 'Suporte real',
      desc: 'Pós-entrega assistido. A gente continua junto depois do go-live.',
    },
  ];

  readonly stats: Stat[] = [
    { value: 100, suffix: '%', label: 'Foco em comércio local' },
    { value: 5, suffix: '', label: 'Áreas de especialização' },
    { value: 7, suffix: '+', label: 'Dias de entrega rápida' },
  ];

  displayValues: number[] = this.stats.map(() => 0);

  private observer: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private countUpStarted = false;

  private readonly icons: Record<PillarIcon, string> = {
    team: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    code: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    support: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  };

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
  ) {}

  getIconSvg(icon: PillarIcon): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.icons[icon]);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cd.detectChanges();
          this.observer?.disconnect();
          this.startCountUp();
        }
      },
      { threshold: 0.3 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  private startCountUp(): void {
    if (this.countUpStarted) return;
    this.countUpStarted = true;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      this.displayValues = this.stats.map((s) => s.value);
      this.cd.detectChanges();
      return;
    }

    const duration = 1500;
    const startDelay = 1400;
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    this.zone.runOutsideAngular(() => {
      const startAt = performance.now() + startDelay;
      const tick = (now: number) => {
        const elapsed = now - startAt;
        if (elapsed < 0) {
          this.rafId = requestAnimationFrame(tick);
          return;
        }
        const t = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(t);
        const next = this.stats.map((s) => Math.round(s.value * eased));
        const changed =
          next.some((v, i) => v !== this.displayValues[i]) || t === 1;
        if (changed) {
          this.zone.run(() => {
            this.displayValues = next;
            this.cd.detectChanges();
          });
        }
        if (t < 1) {
          this.rafId = requestAnimationFrame(tick);
        } else {
          this.rafId = null;
        }
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
