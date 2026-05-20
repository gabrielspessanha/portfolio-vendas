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
  priceMonthly?: string;
  inheritsFrom?: string;
  highlights: string[];
  extras: string[];
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
          animate('220ms ease-out', style({ opacity: 0, transform: 'scale(0.96)' })),
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(70, [
            animate(
              '380ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }),
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
          tagline: 'Pra começar direito',
          price: '1.497',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 125/mês em 12x',
          highlights: [
            'Site no ar em até 7 dias',
            'Aparece quando buscam você no Google',
            'Cliente fala com você direto pelo WhatsApp',
            'Funciona perfeito no celular',
          ],
          extras: [
            'Até 5 páginas',
            'Formulário de contato',
            '30 dias de suporte gratuito',
          ],
          ctaText: 'Quero o Essencial',
          isFeatured: false,
        },
        {
          id: 'site-profissional',
          tier: 'PROFISSIONAL',
          name: 'Site Profissional',
          tagline: 'O mais pedido',
          price: '2.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 250/mês em 12x',
          inheritsFrom: 'Essencial',
          highlights: [
            'Vende e captura leads 24h por dia',
            'Posiciona seu negócio acima dos concorrentes no Google',
            'Você atualiza textos e fotos sem chamar programador',
            'Animações que prendem o visitante',
          ],
          extras: [
            'Até 10 páginas',
            'Blog integrado',
            'Google Analytics configurado',
            '60 dias de suporte gratuito',
          ],
          ctaText: 'Quero o Profissional',
          isFeatured: true,
        },
        {
          id: 'site-premium',
          tier: 'PREMIUM',
          name: 'Site Premium',
          tagline: 'Solução completa',
          price: '4.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 417/mês em 12x',
          inheritsFrom: 'Profissional',
          highlights: [
            'Loja online vendendo enquanto você dorme',
            'Recebe Pix, cartão e boleto direto na conta',
            'Sistema sob medida pro seu jeito de operar',
            'Sua equipe treinada pra usar tudo sozinha',
          ],
          extras: [
            'Páginas ilimitadas',
            'Múltiplos idiomas (opcional)',
            '90 dias de suporte gratuito',
          ],
          ctaText: 'Quero o Premium',
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
          tagline: 'Automatize o básico',
          price: '2.497',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 209/mês em 12x',
          highlights: [
            'Automatiza o que hoje toma seu tempo',
            'Substitui planilhas confusas e perdidas',
            'Acessa de qualquer lugar pelo navegador',
            'Cada usuário com login próprio e seguro',
          ],
          extras: [
            'Até 5 funcionalidades',
            'Relatórios básicos',
            '30 dias de suporte',
          ],
          ctaText: 'Quero o Essencial',
          isFeatured: false,
        },
        {
          id: 'sistema-profissional',
          tier: 'PROFISSIONAL',
          name: 'Sistema Profissional',
          tagline: 'Gestão completa',
          price: '4.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 417/mês em 12x',
          inheritsFrom: 'Essencial',
          highlights: [
            'Cliente, agenda e operação num só lugar',
            'Manda lembretes automáticos no WhatsApp e email',
            'Conecta com sistemas que você já usa',
            'Decide com base em dados, não no achismo',
          ],
          extras: [
            'Até 15 funcionalidades',
            'CRM integrado',
            '60 dias de suporte',
          ],
          ctaText: 'Quero o Profissional',
          isFeatured: true,
        },
        {
          id: 'sistema-premium',
          tier: 'PREMIUM',
          name: 'Sistema Premium',
          tagline: 'Solução enterprise',
          price: '9.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 833/mês em 12x',
          inheritsFrom: 'Profissional',
          highlights: [
            'Operação completa rodando sozinha',
            'App pra cliente ou equipe usar do celular',
            'Dashboard mostra a saúde do negócio em tempo real',
            'Cada cargo com tela e permissão própria',
          ],
          extras: [
            'Funcionalidades ilimitadas',
            'App iOS + Android (opcional)',
            '90 dias de suporte',
          ],
          ctaText: 'Quero o Premium',
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
          tagline: 'Atendimento 24h',
          price: '997',
          priceNote: '+ R$ 197/mês',
          highlights: [
            'Atende cliente 24h sem você perder o sono',
            'Responde dúvida frequente em segundos',
            'Funciona no WhatsApp ou no seu site',
            'Ajustamos as respostas todo mês',
          ],
          extras: [
            'Treinada com até 50 perguntas',
            'Relatórios mensais',
            'Horário comercial configurável',
          ],
          ctaText: 'Quero o Essencial',
          isFeatured: false,
        },
        {
          id: 'ia-profissional',
          tier: 'PROFISSIONAL',
          name: 'IA Profissional',
          tagline: 'Vende enquanto você dorme',
          price: '1.997',
          priceNote: '+ R$ 397/mês',
          inheritsFrom: 'Essencial',
          highlights: [
            'Qualifica lead e marca atendimento sozinha',
            'Vende mesmo com você ocupado ou dormindo',
            'Atende no WhatsApp, site e Instagram ao mesmo tempo',
            'Manda dados quentes direto pro seu CRM',
          ],
          extras: [
            '200+ cenários treinados',
            'Relatórios em tempo real',
            'Múltiplos canais',
          ],
          ctaText: 'Quero a Profissional',
          isFeatured: true,
        },
        {
          id: 'ia-premium',
          tier: 'PREMIUM',
          name: 'IA Premium',
          tagline: 'Agente completo',
          price: '3.997',
          priceNote: '+ R$ 797/mês',
          inheritsFrom: 'Profissional',
          highlights: [
            'Aprende sozinha conforme conversa com clientes',
            'Vários atendentes IA trabalhando em paralelo',
            'Prevê quem está perto de comprar',
            'Conversa por voz e áudio (opcional)',
          ],
          extras: [
            'Treinamento ilimitado',
            'Integração com sistemas internos',
            'Suporte prioritário',
          ],
          ctaText: 'Quero a Premium',
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
          tagline: 'Identidade básica',
          price: '797',
          priceNote: '/projeto',
          highlights: [
            'Sua marca pronta pra postar nas redes',
            'Stories que param o dedo do cliente',
            'Visual coeso de feed em 5 dias',
            'Paleta e estilo definidos pra sempre usar',
          ],
          extras: [
            '10 posts + 3 stories animados',
            'Banner principal personalizado',
            'Capa de perfil + foto',
          ],
          ctaText: 'Quero o Essencial',
          isFeatured: false,
        },
        {
          id: 'design-profissional',
          tier: 'PROFISSIONAL',
          name: 'Design Profissional',
          tagline: 'Presença forte',
          price: '1.497',
          priceNote: '/mês',
          highlights: [
            'Sua marca postando todo dia sem você se preocupar',
            'Banner pra anúncio sempre que precisar',
            'Material de campanha sob demanda',
            'Revisamos até você curtir o resultado',
          ],
          extras: [
            '30 posts + 15 stories por mês',
            '5 banners pra anúncios',
            'Suporte prioritário',
          ],
          ctaText: 'Quero o Profissional',
          isFeatured: true,
        },
        {
          id: 'design-premium',
          tier: 'PREMIUM',
          name: 'Design Premium',
          tagline: 'Branding completo',
          price: '2.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 250/mês em 12x',
          highlights: [
            'Marca completa do zero, pronta pra crescer',
            'Logo profissional em 3 versões pra qualquer uso',
            'Manual que sua equipe segue sem errar',
            'Cartão, papel timbrado e papelaria inclusos',
          ],
          extras: [
            '50 posts iniciais',
            'Templates pra redes sociais',
            'Treinamento de uso da marca',
          ],
          ctaText: 'Quero o Premium',
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
          tagline: 'Comece a vender com vídeo',
          price: '597',
          priceNote: '/projeto',
          highlights: [
            'Vídeo profissional que mostra seu produto em 30s',
            'Pronto pra Reels, Stories ou TikTok',
            'Legenda embutida pra quem assiste sem som',
            'Trilha sonora licenciada pra usar à vontade',
          ],
          extras: [
            '1 vídeo de até 30 segundos',
            '1 revisão gratuita',
            'Entrega em até 5 dias',
          ],
          ctaText: 'Quero o Essencial',
          isFeatured: false,
        },
        {
          id: 'video-profissional',
          tier: 'PROFISSIONAL',
          name: 'Vídeo Profissional',
          tagline: 'Conteúdo que engaja',
          price: '1.997',
          priceNote: '/mês',
          highlights: [
            '8 vídeos por mês alimentando suas redes',
            'Roteiro pronto — você só grava ou envia o material',
            'Funciona em Reels, TikTok e Shorts ao mesmo tempo',
            'Revisamos quantas vezes precisar',
          ],
          extras: [
            'Edição profissional avançada',
            'Trilhas sonoras licenciadas',
            'Entrega semanal',
          ],
          ctaText: 'Quero o Profissional',
          isFeatured: true,
        },
        {
          id: 'video-premium',
          tier: 'PREMIUM',
          name: 'Vídeo Premium',
          tagline: 'Produção completa',
          price: '4.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 417/mês em 12x',
          highlights: [
            'Vídeo institucional cinematográfico de 2-3 min',
            'Equipe filma no seu local (opcional)',
            'Color grading e motion graphics profissionais',
            'Trilha exclusiva criada pro seu vídeo',
          ],
          extras: [
            '5 vídeos curtos pra redes',
            'Roteirização profissional',
            'Edição cinematográfica',
          ],
          ctaText: 'Quero o Premium',
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
