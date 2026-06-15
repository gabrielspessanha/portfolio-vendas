import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  icon: 'browser' | 'settings' | 'robot' | 'palette' | 'video';
  pricingAnchor: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  animations: [
    trigger('gridReveal', [
      transition(':enter', [
        query('.service-card', [
          style({ opacity: 0, transform: 'translateY(28px)' }),
          stagger(80, [
            animate(
              '600ms cubic-bezier(0.16, 1, 0.3, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }),
            ),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  isVisible = false;

  private observer: IntersectionObserver | null = null;

  readonly whatsappNumber = '5521974767624';

  readonly services: Service[] = [
    {
      id: 'sites',
      title: 'Sites Profissionais',
      tagline: 'Vendem 24h pra você',
      description: 'Sites institucionais, landing pages e e-commerces estruturados para atrair e converter visitantes.',
      features: [
        'Aparece no Google quando buscam você',
        'Cliente fecha direto pelo WhatsApp',
        'Carrega rápido e funciona no celular',
      ],
      icon: 'browser',
      pricingAnchor: '#precos',
    },
    {
      id: 'sistemas',
      title: 'Sistemas Sob Medida',
      tagline: 'Automatize seu negócio',
      description: 'Sistemas de agendamento, gestão de clientes, controle de estoque e qualquer solução customizada.',
      features: [
        'Substitui planilhas confusas',
        'Acessa do celular, de qualquer lugar',
        'Cada cargo com permissão própria',
      ],
      icon: 'settings',
      pricingAnchor: '#precos',
    },
    {
      id: 'ia',
      title: 'Atendentes Virtuais com IA',
      tagline: 'Atendimento que nunca dorme',
      description: 'Agentes de IA treinados pro seu negócio que tiram dúvidas, qualificam clientes e vendem 24/7.',
      features: [
        'Vende enquanto você dorme',
        'Funciona no WhatsApp, site e Instagram',
        'Configurada com as informações do seu negócio',
      ],
      icon: 'robot',
      pricingAnchor: '#precos',
    },
    {
      id: 'design',
      title: 'Design e Criativos',
      tagline: 'Imagens que vendem',
      description: 'Posts, anúncios, banners e identidade visual que destacam sua marca e geram resultados.',
      features: [
        'Marca pronta pra postar todo dia',
        'Stories que param o dedo do cliente',
        'Visual coeso de feed e campanhas',
      ],
      icon: 'palette',
      pricingAnchor: '#precos',
    },
    {
      id: 'videos',
      title: 'Vídeos Profissionais',
      tagline: 'Mostre seus produtos',
      description: 'Vídeos curtos para Instagram, Reels, anúncios e showcase de produtos que aumentam suas vendas.',
      features: [
        'Reels que param o scroll',
        'Vídeo do produto em 30 segundos',
        'Pacote mensal disponível',
      ],
      icon: 'video',
      pricingAnchor: '#precos',
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
      { threshold: 0.12 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  getWhatsAppUrl(): string {
    const msg = 'Olá! Não sei por onde começar. Pode me ajudar a escolher o serviço ideal?';
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  getIconSvg(icon: string): SafeHtml {
    const svgs: Record<string, string> = {
      browser: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <line x1="2" y1="9" x2="22" y2="9"/>
        <circle cx="5" cy="6.5" r="0.6" fill="currentColor"/>
        <circle cx="7.5" cy="6.5" r="0.6" fill="currentColor"/>
        <circle cx="10" cy="6.5" r="0.6" fill="currentColor"/>
      </svg>`,
      settings: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>`,
      robot: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5" y="8" width="14" height="11" rx="2"/>
        <circle cx="9.5" cy="13" r="1" fill="currentColor"/>
        <circle cx="14.5" cy="13" r="1" fill="currentColor"/>
        <path d="M12 8V5"/>
        <circle cx="12" cy="4" r="1" fill="currentColor"/>
        <path d="M2 13h3M19 13h3"/>
      </svg>`,
      palette: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5v-.26c0-.44.35-.8.79-.8h1.21C19.24 19.44 22 16.72 22 13.33 22 7.08 17.52 2 12 2z"/>
        <circle cx="7.5" cy="11.5" r="1" fill="currentColor"/>
        <circle cx="12" cy="7.5" r="1" fill="currentColor"/>
        <circle cx="16.5" cy="11.5" r="1" fill="currentColor"/>
      </svg>`,
      video: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="6" width="15" height="12" rx="2"/>
        <path d="M17 9.5l5-3v11l-5-3z" fill="currentColor" stroke="none"/>
      </svg>`,
    };
    return this.sanitizer.bypassSecurityTrustHtml(svgs[icon] ?? '');
  }
}
