import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  iconColor: string;
  iconGradient: string;
  icon: 'browser' | 'settings' | 'robot' | 'palette' | 'video';
  ctaText: string;
  mockupImage: string;
  mockupAlt: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  animations: [
    // Scroll-triggered reveal: all elements start hidden, animate in on viewport entry
    trigger('revealOnScroll', [
      state('hidden',  style({ opacity: 0, transform: 'translateY(30px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(
        'hidden => visible',
        [animate('600ms {{ delay }}ms cubic-bezier(0.16, 1, 0.3, 1)')],
        { params: { delay: 0 } }
      ),
    ]),

    // Tab content: cross-fade + scale when active tab changes (premium feel)
    trigger('contentSwitch', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.96)' }),
        animate('350ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),

    // Mobile accordion open / close
    trigger('accordionContent', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open',   style({ height: '*',   opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),

    // Chevron rotation on accordion toggle
    trigger('chevronRotate', [
      state('closed', style({ transform: 'rotate(0deg)'   })),
      state('open',   style({ transform: 'rotate(180deg)' })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  activeServiceId = 'sites';

  private observer: IntersectionObserver | null = null;

  // Reference to each tab button for keyboard focus management
  @ViewChildren('tabBtn') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  readonly whatsappNumber = 'SEUNUMERO'; // ← replace with your number

  readonly services: Service[] = [
    {
      id: 'sites',
      number: '01',
      title: 'Sites Profissionais',
      tagline: 'Vendem 24h pra você',
      description:
        'Sites institucionais, landing pages e e-commerces que convertem visitantes em clientes pagantes.',
      features: [
        'Design responsivo',
        'Otimizado para Google (SEO)',
        'Carregamento rápido',
        'Entrega em até 7 dias',
      ],
      iconColor: '#10B981',
      iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
      icon: 'browser',
      ctaText: 'QUERO MEU SITE',
      mockupImage: 'images/web_modaBeleza.jpeg',
      mockupAlt: 'Exemplo de site profissional entregue para cliente',
    },
    {
      id: 'sistemas',
      number: '02',
      title: 'Sistemas Sob Medida',
      tagline: 'Automatize seu negócio',
      description:
        'Sistemas de agendamento, gestão de clientes, controle de estoque e qualquer solução customizada.',
      features: [
        'Sistema de agendamento',
        'Gestão de clientes (CRM)',
        'Controle de estoque',
        'Soluções 100% personalizadas',
      ],
      iconColor: '#10B981',
      iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
      icon: 'settings',
      ctaText: 'QUERO UM SISTEMA',
      mockupImage: 'images/web_barbearia.jpeg',
      mockupAlt: 'Sistema de agendamento sob medida para barbearia',
    },
    {
      id: 'ia',
      number: '03',
      title: 'Atendentes Virtuais com IA',
      tagline: 'Atendimento que nunca dorme',
      description:
        'Agentes de IA treinados pro seu negócio que tiram dúvidas, qualificam clientes e vendem 24/7.',
      features: [
        'Atendimento 24h por dia',
        'Tira dúvidas frequentes',
        'Qualifica seus leads',
        'Integração com WhatsApp',
      ],
      iconColor: '#10B981',
      iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
      icon: 'robot',
      ctaText: 'QUERO UM ATENDENTE IA',
      mockupImage: 'images/mobile_petshop.png',
      mockupAlt: 'Atendente virtual com IA respondendo via WhatsApp',
    },
    {
      id: 'design',
      number: '04',
      title: 'Design e Criativos',
      tagline: 'Imagens que vendem',
      description:
        'Posts, anúncios, banners e identidade visual que destacam sua marca e geram resultados.',
      features: [
        'Posts para redes sociais',
        'Anúncios e banners',
        'Identidade visual completa',
        'Material para campanhas',
      ],
      iconColor: '#10B981',
      iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
      icon: 'palette',
      ctaText: 'QUERO MEUS CRIATIVOS',
      mockupImage: 'images/mockups.png',
      mockupAlt: 'Grid de criativos e posts entregues para clientes',
    },
    {
      id: 'videos',
      number: '05',
      title: 'Vídeos Profissionais',
      tagline: 'Mostre seus produtos',
      description:
        'Vídeos curtos para Instagram, Reels, anúncios e showcase de produtos que aumentam suas vendas.',
      features: [
        'Vídeos para Reels e Shorts',
        'Showcase de produtos',
        'Anúncios em vídeo',
        'Edição profissional',
      ],
      iconColor: '#10B981',
      iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
      icon: 'video',
      ctaText: 'QUERO MEUS VÍDEOS',
      mockupImage: 'images/web_fitness.png',
      mockupAlt: 'Vídeos profissionais para showcase de produtos',
    },
  ];

  get activeService(): Service {
    return this.services.find(s => s.id === this.activeServiceId)!;
  }

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
          this.cd.detectChanges(); // push change outside Angular zone
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  setActive(id: string): void {
    this.activeServiceId = id;
  }

  // Mobile: keeps at least one item open
  toggleAccordion(id: string): void {
    if (this.activeServiceId === id) return;
    this.activeServiceId = id;
  }

  // ARIA tablist keyboard navigation (arrow keys move between tabs)
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const len = this.services.length;
    let next = -1;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      next = (index + 1) % len;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      next = (index - 1 + len) % len;
    }

    if (next >= 0) {
      this.setActive(this.services[next].id);
      this.tabButtons.toArray()[next].nativeElement.focus();
    }
  }

  getWhatsAppUrl(service: Service): string {
    const msg = `Olá! Tenho interesse em ${service.title}. Pode me passar um orçamento?`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  // Returns sanitized inline SVG for a given icon name and pixel size
  getIconSvg(icon: string, size: number): SafeHtml {
    const svgs: Record<string, string> = {
      browser: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" stroke="white" stroke-width="1.5"/>
        <line x1="1" y1="9" x2="23" y2="9" stroke="white" stroke-width="1.5"/>
        <circle cx="4.5" cy="6.5" r="1" fill="white"/>
        <circle cx="7.5" cy="6.5" r="1" fill="white"/>
        <circle cx="10.5" cy="6.5" r="1" fill="white"/>
      </svg>`,

      settings: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.5"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="white" stroke-width="1.5"/>
      </svg>`,

      robot: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="5" y="8" width="14" height="11" rx="2" stroke="white" stroke-width="1.5"/>
        <circle cx="9.5" cy="13" r="1.5" fill="white"/>
        <circle cx="14.5" cy="13" r="1.5" fill="white"/>
        <path d="M12 8V5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="4" r="1.5" fill="white"/>
        <path d="M2 13h3M19 13h3" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M9 19v2M15 19v2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,

      palette: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5v-.26c0-.44.35-.8.79-.8h1.21C19.24 19.44 22 16.72 22 13.33 22 7.08 17.52 2 12 2z" stroke="white" stroke-width="1.5"/>
        <circle cx="7.5" cy="11.5" r="1.5" fill="white"/>
        <circle cx="12" cy="7.5" r="1.5" fill="white"/>
        <circle cx="16.5" cy="11.5" r="1.5" fill="white"/>
      </svg>`,

      video: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="6" width="15" height="12" rx="2" stroke="white" stroke-width="1.5"/>
        <path d="M16 9.5l6-3v11l-6-3V9.5z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`,
    };

    return this.sanitizer.bypassSecurityTrustHtml(svgs[icon] ?? '');
  }
}
