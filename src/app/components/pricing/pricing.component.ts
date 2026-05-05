import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

interface Package {
  id: string;
  tier: string;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  iconGradient: string;
  ctaText: string;
  isFeatured: boolean;
}

interface PackageCategory {
  id: string;
  label: string;
  icon: string;
  packages: Package[];
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
  animations: [
    trigger('categorySwitch', [
      transition('* => *', [
        query(':leave', [
          animate('220ms ease-out', style({ opacity: 0, transform: 'scale(0.88)' })),
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(28px) scale(0.95)' }),
          stagger(80, [
            animate(
              '420ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
            ),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class PricingComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  filterVersion = 0;
  activeCategory = '';

  private observer: IntersectionObserver | null = null;

  readonly categories: PackageCategory[] = [
    {
      id: 'sites',
      label: 'Sites',
      icon: 'browser',
      packages: [
        {
          id: 'site-essencial',
          tier: 'ESSENCIAL',
          name: 'Site Essencial',
          tagline: 'PRA COMEÇAR DIREITO',
          price: '1.497',
          priceNote: '/projeto',
          description: 'Site profissional pra colocar seu negócio no digital com presença forte.',
          features: [
            'Site institucional até 5 páginas',
            'Design responsivo (desktop + mobile)',
            'Otimização básica para Google',
            'Formulário de contato',
            'Integração com WhatsApp',
            'Entrega em até 7 dias',
            '30 dias de suporte gratuito',
          ],
          iconGradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
        {
          id: 'site-profissional',
          tier: 'PROFISSIONAL',
          name: 'Site Profissional',
          tagline: 'O MAIS PEDIDO',
          price: '2.997',
          priceNote: '/projeto',
          description: 'Site completo com tudo que você precisa pra vender e crescer no digital.',
          features: [
            'Tudo do Essencial +',
            'Site até 10 páginas',
            'SEO otimizado avançado',
            'Blog integrado',
            'Google Analytics configurado',
            'Animações personalizadas',
            'Painel administrativo simples',
            'Entrega em até 10 dias',
            '60 dias de suporte gratuito',
          ],
          iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
          ctaText: 'QUERO ESSE',
          isFeatured: true,
        },
        {
          id: 'site-premium',
          tier: 'PREMIUM',
          name: 'Site Premium',
          tagline: 'SOLUÇÃO COMPLETA',
          price: '4.997',
          priceNote: '/projeto',
          description: 'Solução completa com e-commerce ou sistema integrado pro seu negócio.',
          features: [
            'Tudo do Profissional +',
            'E-commerce completo OU Sistema sob medida',
            'Páginas ilimitadas',
            'Integração com gateway de pagamento',
            'Múltiplos idiomas (opcional)',
            'Treinamento da sua equipe',
            'Entrega em até 15 dias',
            '90 dias de suporte gratuito',
          ],
          iconGradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
      ],
    },
    {
      id: 'sistemas',
      label: 'Sistemas',
      icon: 'settings',
      packages: [
        {
          id: 'sistema-essencial',
          tier: 'ESSENCIAL',
          name: 'Sistema Essencial',
          tagline: 'AUTOMATIZE O BÁSICO',
          price: '2.497',
          priceNote: '/projeto',
          description: 'Sistema sob medida pra automatizar a parte mais crítica do seu negócio.',
          features: [
            'Sistema com até 5 funcionalidades',
            'Painel administrativo',
            'Banco de dados estruturado',
            'Login e cadastro de usuários',
            'Relatórios básicos',
            'Suporte por 30 dias',
          ],
          iconGradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
        {
          id: 'sistema-profissional',
          tier: 'PROFISSIONAL',
          name: 'Sistema Profissional',
          tagline: 'GESTÃO COMPLETA',
          price: '4.997',
          priceNote: '/projeto',
          description: 'Sistema completo pra gerenciar clientes, agendamentos e operações.',
          features: [
            'Tudo do Essencial +',
            'Sistema com até 15 funcionalidades',
            'CRM integrado',
            'Sistema de agendamento',
            'Notificações automáticas (email + WhatsApp)',
            'Relatórios avançados',
            'Integrações com APIs externas',
            'Suporte por 60 dias',
          ],
          iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
          ctaText: 'QUERO ESSE',
          isFeatured: true,
        },
        {
          id: 'sistema-premium',
          tier: 'PREMIUM',
          name: 'Sistema Premium',
          tagline: 'SOLUÇÃO ENTERPRISE',
          price: '9.997',
          priceNote: '/projeto',
          description: 'Sistema enterprise totalmente personalizado pra operações complexas.',
          features: [
            'Tudo do Profissional +',
            'Funcionalidades ilimitadas',
            'Múltiplos perfis de usuário',
            'App mobile (iOS + Android opcional)',
            'Integração com sistemas internos',
            'Dashboards personalizados',
            'Treinamento completo da equipe',
            'Suporte por 90 dias',
          ],
          iconGradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
      ],
    },
    {
      id: 'ia',
      label: 'Atendentes IA',
      icon: 'robot',
      packages: [
        {
          id: 'ia-essencial',
          tier: 'ESSENCIAL',
          name: 'IA Essencial',
          tagline: 'ATENDIMENTO 24H',
          price: '997',
          priceNote: '+ R$ 197/mês',
          description: 'Atendente virtual treinado pra responder dúvidas frequentes do seu negócio.',
          features: [
            'Atendente IA pra WhatsApp ou Site',
            'Treinamento com até 50 perguntas',
            'Respostas automáticas inteligentes',
            'Horário comercial configurável',
            'Relatórios de atendimento mensais',
            'Suporte e ajustes contínuos',
          ],
          iconGradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
        {
          id: 'ia-profissional',
          tier: 'PROFISSIONAL',
          name: 'IA Profissional',
          tagline: 'VENDE ENQUANTO VOCÊ DORME',
          price: '1.997',
          priceNote: '+ R$ 397/mês',
          description: 'IA que qualifica leads, agenda atendimentos e fecha vendas automaticamente.',
          features: [
            'Tudo do Essencial +',
            'Treinamento com 200+ cenários',
            'Qualificação automática de leads',
            'Agendamento integrado ao calendário',
            'Integração com CRM',
            'Múltiplos canais (WhatsApp, Site, Instagram)',
            'Relatórios avançados em tempo real',
          ],
          iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
          ctaText: 'QUERO ESSE',
          isFeatured: true,
        },
        {
          id: 'ia-premium',
          tier: 'PREMIUM',
          name: 'IA Premium',
          tagline: 'AGENTE COMPLETO',
          price: '3.997',
          priceNote: '+ R$ 797/mês',
          description: 'Agente de IA totalmente personalizado que aprende e evolui com seu negócio.',
          features: [
            'Tudo do Profissional +',
            'IA com aprendizado contínuo',
            'Treinamento ilimitado',
            'Integração com sistemas internos',
            'Múltiplos atendentes simultâneos',
            'Análise preditiva de vendas',
            'Voz e áudio (opcional)',
            'Suporte prioritário',
          ],
          iconGradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
      ],
    },
    {
      id: 'design',
      label: 'Design',
      icon: 'palette',
      packages: [
        {
          id: 'design-essencial',
          tier: 'ESSENCIAL',
          name: 'Design Essencial',
          tagline: 'IDENTIDADE BÁSICA',
          price: '797',
          priceNote: '/projeto',
          description: 'Pacote pra começar a comunicar sua marca com qualidade nas redes sociais.',
          features: [
            '10 posts pra redes sociais',
            '3 stories animados',
            'Banner principal personalizado',
            'Capa de perfil + foto',
            'Paleta de cores definida',
            'Entrega em até 5 dias',
          ],
          iconGradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
        {
          id: 'design-profissional',
          tier: 'PROFISSIONAL',
          name: 'Design Profissional',
          tagline: 'PRESENÇA FORTE',
          price: '1.497',
          priceNote: '/mês',
          description: 'Pacote mensal com design contínuo pra manter sua marca sempre ativa.',
          features: [
            '30 posts mensais',
            '15 stories animados',
            '5 banners pra anúncios',
            'Identidade visual completa',
            'Material para campanhas',
            'Revisões ilimitadas',
            'Suporte prioritário',
          ],
          iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
          ctaText: 'QUERO ESSE',
          isFeatured: true,
        },
        {
          id: 'design-premium',
          tier: 'PREMIUM',
          name: 'Design Premium',
          tagline: 'BRANDING COMPLETO',
          price: '2.997',
          priceNote: '/projeto',
          description: 'Identidade visual completa do zero pro seu negócio se destacar.',
          features: [
            'Logo profissional (3 versões)',
            'Manual de marca completo',
            'Identidade visual completa',
            '50 posts iniciais',
            'Templates pra redes sociais',
            'Papelaria (cartão, envelope, papel timbrado)',
            'Material publicitário diverso',
            'Treinamento de uso da marca',
          ],
          iconGradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
      ],
    },
    {
      id: 'videos',
      label: 'Vídeos',
      icon: 'video',
      packages: [
        {
          id: 'video-essencial',
          tier: 'ESSENCIAL',
          name: 'Vídeo Essencial',
          tagline: 'COMECE A VENDER COM VÍDEO',
          price: '597',
          priceNote: '/projeto',
          description: 'Vídeo profissional curto pra apresentar seu produto ou serviço.',
          features: [
            '1 vídeo de até 30 segundos',
            'Edição profissional',
            'Trilha sonora licenciada',
            'Legendas embutidas',
            'Formato vertical (Reels/Stories) ou horizontal',
            'Entrega em até 5 dias',
            '1 revisão gratuita',
          ],
          iconGradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
        {
          id: 'video-profissional',
          tier: 'PROFISSIONAL',
          name: 'Vídeo Profissional',
          tagline: 'CONTEÚDO QUE ENGAJA',
          price: '1.997',
          priceNote: '/mês',
          description: 'Pacote mensal de vídeos pra alimentar suas redes com conteúdo de qualidade.',
          features: [
            '8 vídeos curtos por mês (até 60s cada)',
            'Edição profissional avançada',
            'Roteirização incluída',
            'Legendas e efeitos',
            'Múltiplos formatos (Reels, TikTok, Shorts)',
            'Trilhas sonoras licenciadas',
            'Entrega semanal',
            'Revisões ilimitadas',
          ],
          iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
          ctaText: 'QUERO ESSE',
          isFeatured: true,
        },
        {
          id: 'video-premium',
          tier: 'PREMIUM',
          name: 'Vídeo Premium',
          tagline: 'PRODUÇÃO COMPLETA',
          price: '4.997',
          priceNote: '/projeto',
          description: 'Produção audiovisual completa com vídeos institucionais e comerciais.',
          features: [
            'Vídeo institucional de 2-3 minutos',
            '5 vídeos curtos pra redes',
            'Roteirização profissional',
            'Filmagem no local (opcional)',
            'Edição cinematográfica',
            'Motion graphics e animações',
            'Trilha sonora exclusiva',
            'Color grading profissional',
          ],
          iconGradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          ctaText: 'QUERO ESSE',
          isFeatured: false,
        },
      ],
    },
  ];

  get activePackages(): Package[] {
    if (!this.activeCategory) return [];
    return this.categories.find(c => c.id === this.activeCategory)?.packages ?? [];
  }

  get activeCategoryIcon(): string {
    return this.categories.find(c => c.id === this.activeCategory)?.icon ?? 'browser';
  }

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.activeCategory = 'sites';
          this.filterVersion++;
          this.cd.detectChanges();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  selectCategory(id: string): void {
    if (id === this.activeCategory) return;
    this.activeCategory = id;
    this.filterVersion++;
  }

  openWhatsApp(pkg: Package): void {
    const text = encodeURIComponent(
      `Olá! Tenho interesse no pacote ${pkg.name}. Pode me passar mais detalhes?`,
    );
    window.open(`https://wa.me/SEUNUMERO?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;

    const toggle = (event.target as HTMLElement).closest('[role="tablist"]');
    if (!toggle) return;

    const tabs = Array.from(toggle.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const currentIdx = tabs.indexOf(event.target as HTMLButtonElement);
    if (currentIdx === -1) return;

    event.preventDefault();
    const len = tabs.length;
    const nextIdx = event.key === 'ArrowRight'
      ? (currentIdx + 1) % len
      : (currentIdx - 1 + len) % len;

    tabs[nextIdx].focus();
    this.selectCategory(this.categories[nextIdx].id);
  }
}
