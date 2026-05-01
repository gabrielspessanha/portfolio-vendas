import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Step {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: 'chat' | 'target' | 'gear' | 'rocket';
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  private observer: IntersectionObserver | null = null;

  readonly whatsappNumber = 'SEUNUMERO'; // ← replace with your number

  readonly steps: Step[] = [
    {
      number: '1',
      title: 'Conversa Inicial',
      tagline: 'Entendemos seu desafio',
      description:
        'Bate-papo de 30 minutos sem compromisso pra entender seu negócio, dores e objetivos.',
      icon: 'chat',
    },
    {
      number: '2',
      title: 'Estratégia Personalizada',
      tagline: 'Planejamos a solução ideal',
      description:
        'Definimos juntos o melhor caminho — seja site, sistema, IA, design ou vídeo — pra atingir seu objetivo.',
      icon: 'target',
    },
    {
      number: '3',
      title: 'Execução com Você',
      tagline: 'Mãos à obra, sem mistério',
      description:
        'Tiramos a ideia do papel com você acompanhando cada etapa. Transparência total.',
      icon: 'gear',
    },
    {
      number: '4',
      title: 'Entrega + Acompanhamento',
      tagline: 'Seu negócio em outro nível',
      description:
        'Entregamos no prazo e seguimos com você. Suporte pós-entrega garantido.',
      icon: 'rocket',
    },
  ];

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cd.detectChanges();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  getWhatsAppUrl(): string {
    const msg = 'Olá! Quero saber mais sobre como funciona o processo.';
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  // Returns sanitized inline SVG for a given icon name and pixel size
  getIconSvg(icon: string, size: number): SafeHtml {
    const stroke = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;

    const svgs: Record<string, string> = {
      chat: `<svg ${stroke}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>`,

      target: `<svg ${stroke}>
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>`,

      gear: `<svg ${stroke}>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>`,

      rocket: `<svg ${stroke}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m3.29 15 1.71 1.71"/>
        <path d="M6 15C5 8 10 2 12 2s7 6 6 13"/>
        <path d="M9 21c0-4.9 5-7 7-4"/>
      </svg>`,
    };

    return this.sanitizer.bypassSecurityTrustHtml(svgs[icon] ?? '');
  }
}
