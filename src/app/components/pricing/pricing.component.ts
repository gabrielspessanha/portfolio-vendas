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

interface HowItWorks {
  steps: string[];
  timeline: string;
}

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
  /** Link de pagamento Mercado Pago (https://mpago.la/XXXXXXX). Deixe '' até ter a URL real. */
  paymentUrl?: string;
  howItWorks: HowItWorks;
}

interface PackageCategory {
  id: string;
  label: string;
  icon: string;
  packages: Package[];
}

interface ModalData {
  name: string;
  tagline: string;
  howItWorks: HowItWorks;
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
  selectedModal: ModalData | null = null;

  designCounters = [
    { id: 'posts',   label: 'Posts para feed',      value: 10, min: 0, max: 60 },
    { id: 'stories', label: 'Stories animados',      value: 5,  min: 0, max: 30 },
    { id: 'reels',   label: 'Reels / TikToks',       value: 0,  min: 0, max: 20 },
    { id: 'banners', label: 'Banners para anúncio',  value: 0,  min: 0, max: 20 },
  ];

  designToggles = [
    { id: 'logo',         label: 'Logo profissional (3 versões)', active: false },
    { id: 'brand-guide',  label: 'Manual de marca',               active: false },
    { id: 'business-card',label: 'Cartão de visita',              active: false },
    { id: 'profile-cover',label: 'Capa de perfil nas redes',      active: false },
  ];

  get hasDesignSelection(): boolean {
    return this.designCounters.some(c => c.value > 0) || this.designToggles.some(t => t.active);
  }

  get designSummary(): string {
    const parts: string[] = [];
    this.designCounters.forEach(c => { if (c.value > 0) parts.push(`${c.value} ${c.label.toLowerCase()}`); });
    this.designToggles.forEach(t => { if (t.active) parts.push(t.label); });
    return parts.join(' · ');
  }

  private observer: IntersectionObserver | null = null;

  /** Conteúdo do card único da aba Sites (substitui os 3 planos). */
  readonly sitesIntro = {
    tagline: 'Sites profissionais sob medida',
    name: 'Seu site profissional',
    price: '700',
    priceNote: '/projeto',
    priceFootnote: 'Preço final conforme o escopo. Você fala direto com quem programa.',
    highlights: [
      'Site profissional pronto pra vender',
      'Estrutura de SEO configurada desde o início',
      'Manutenção e atualizações feitas pela Lumon',
      'Funciona perfeito no celular',
    ],
    ctaText: 'Quero meu site',
    howItWorks: {
      steps: [
        'Reunião de briefing pelo WhatsApp ou Google Meet (30 min)',
        'Você envia logo, textos e fotos — ou a Lumon cria junto com você',
        'Desenvolvemos o site com SEO configurado desde o início',
        'Você aprova o resultado e pedimos ajustes sem custo extra',
        'Publicamos e configuramos tudo no ar',
      ],
      timeline: 'Entrega estimada em 7 a 15 dias úteis conforme escopo',
    },
  };

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
          tagline: 'Pra negócio começando agora',
          price: '1.497',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 125/mês em 12x',
          highlights: [
            'Site profissional pronto pra vender',
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
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Reunião de briefing para entender o negócio (30 min)',
              'Você envia logo e textos — orientamos no que for precisar',
              'Desenvolvemos as 5 páginas com formulário de contato',
              'Configuramos SEO básico (título, meta e Google Search Console)',
              'Você aprova, pedimos ajustes e publicamos',
            ],
            timeline: '8 a 12 dias úteis',
          },
        },
        {
          id: 'site-profissional',
          tier: 'PROFISSIONAL',
          name: 'Site Profissional',
          tagline: 'O mais escolhido pelos clientes',
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
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Briefing completo + análise dos concorrentes no Google',
              'Design aprovado antes de codificar',
              'Desenvolvemos com painel de edição (CMS) para você trocar textos sozinho',
              'Blog integrado e Google Analytics configurados',
              'Publicamos e treinamos você em como usar o CMS',
            ],
            timeline: '15 a 25 dias úteis',
          },
        },
        {
          id: 'site-premium',
          tier: 'PREMIUM',
          name: 'Site Premium',
          tagline: 'Pra negócio pronto pra escalar',
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
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Reunião de escopo detalhado com toda a equipe',
              'Desenvolvimento da loja com carrinho e checkout integrado',
              'Pix, cartão e boleto configurados via Mercado Pago',
              'Treinamento da equipe em vídeo passo a passo',
              'Suporte dedicado por 90 dias após a entrega',
            ],
            timeline: '25 a 40 dias úteis conforme volume de produtos',
          },
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
          tagline: 'Pra automatizar o básico',
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
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Mapeamos os processos que você quer automatizar',
              'Definimos as 5 funcionalidades juntos — sem surpresa no escopo',
              'Desenvolvemos o sistema web com login por usuário',
              'Você testa em ambiente de testes antes de aprovar',
              'Publicamos e entregamos o acesso de administrador',
            ],
            timeline: '10 a 18 dias úteis',
          },
        },
        {
          id: 'sistema-profissional',
          tier: 'PROFISSIONAL',
          name: 'Sistema Profissional',
          tagline: 'Pra controlar tudo num lugar só',
          price: '4.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 417/mês em 12x',
          inheritsFrom: 'Essencial',
          highlights: [
            'Cliente, agenda e operação num só lugar',
            'Manda lembretes automáticos no WhatsApp e e-mail',
            'Conecta com sistemas que você já usa',
            'Decide com base em dados, não no achismo',
          ],
          extras: [
            'Até 15 funcionalidades',
            'Gestão de clientes e histórico de contatos',
            '60 dias de suporte',
          ],
          ctaText: 'Quero o Profissional',
          isFeatured: true,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Workshop de mapeamento das até 15 funcionalidades',
              'Desenvolvimento do painel de gestão de clientes com histórico de contatos',
              'Automações de mensagem via WhatsApp e e-mail configuradas',
              'Integração com ferramentas que você já usa (Google, planilhas, etc.)',
              'Suporte e ajustes por 60 dias após a entrega',
            ],
            timeline: '25 a 40 dias úteis',
          },
        },
        {
          id: 'sistema-premium',
          tier: 'PREMIUM',
          name: 'Sistema Premium',
          tagline: 'Pra operação grande',
          price: '9.997',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 833/mês em 12x',
          inheritsFrom: 'Profissional',
          highlights: [
            'Operação completa rodando sozinha',
            'App instalável no celular pra cliente ou equipe',
            'Dashboard mostra a saúde do negócio em tempo real',
            'Cada cargo com tela e permissão própria',
          ],
          extras: [
            'Funcionalidades ilimitadas',
            'App instalável no celular (PWA)',
            '90 dias de suporte',
          ],
          ctaText: 'Quero o Premium',
          isFeatured: false,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Escopo detalhado com todos os departamentos envolvidos',
              'Desenvolvimento do sistema completo com permissões por cargo',
              'Dashboard em tempo real com os indicadores do negócio',
              'App instalável no celular via navegador (funciona em Android e iOS sem loja)',
              'Treinamento da equipe com documentação completa',
            ],
            timeline: '45 a 70 dias úteis conforme volume de funcionalidades',
          },
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
          tagline: 'Pra atender cliente 24h',
          price: '997',
          priceNote: '+ R$ 197/mês',
          highlights: [
            'Atende cliente 24h sem você perder o sono',
            'Responde dúvida frequente em segundos',
            'Funciona no WhatsApp ou no seu site',
            'Ajustamos as respostas todo mês',
          ],
          extras: [
            'Treinada com as 50 perguntas mais frequentes',
            'Relatórios mensais',
            'Horário comercial configurável',
          ],
          ctaText: 'Quero o Essencial',
          isFeatured: false,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Você nos envia as 50 perguntas mais frequentes dos clientes',
              'Configuramos o chatbot com a linguagem e identidade da sua marca',
              'Integramos no WhatsApp Business ou como widget no seu site',
              'Testamos todos os fluxos antes de ligar para os clientes',
              'Ajuste mensal de respostas incluso no plano',
            ],
            timeline: '5 a 8 dias úteis',
          },
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
            'Manda dados quentes direto pra sua planilha',
          ],
          extras: [
            'Base de conhecimento completa do negócio',
            'Relatórios em tempo real',
            'Múltiplos canais',
          ],
          ctaText: 'Quero a Profissional',
          isFeatured: true,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Mapeamos todos os cenários de atendimento do negócio',
              'Configuramos qualificação de leads e agendamento automático',
              'Integramos no WhatsApp, site e Instagram ao mesmo tempo',
              'Conectamos à sua planilha para registrar os atendimentos',
              'Painel com histórico e métricas em tempo real',
            ],
            timeline: '12 a 18 dias úteis',
          },
        },
        {
          id: 'ia-premium',
          tier: 'PREMIUM',
          name: 'IA Premium',
          tagline: 'Pra operação de atendimento completa',
          price: '3.997',
          priceNote: '+ R$ 797/mês',
          inheritsFrom: 'Profissional',
          highlights: [
            'Refinamento mensal com base nos atendimentos reais',
            'Atende dezenas de clientes ao mesmo tempo, sem fila',
            'Histórico completo de conversas com relatório semanal',
            'Integração com Google Sheets e ferramentas web',
          ],
          extras: [
            'Treinamento ilimitado de conteúdo',
            'Integração com Google Sheets e ferramentas web via API',
            'Suporte prioritário',
          ],
          ctaText: 'Quero a Premium',
          isFeatured: false,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Análise completa da operação de atendimento atual',
              'Chatbot treinado com todo o material e histórico do negócio',
              'Integração com Google Sheets e ferramentas web via API',
              'Painel de histórico completo com relatórios semanais',
              'Refinamento mensal incluso por 6 meses após a entrega',
            ],
            timeline: '18 a 25 dias úteis',
          },
        },
      ],
    },
    {
      id: 'design',
      label: 'Design',
      icon: 'palette',
      packages: [],
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
          tagline: 'Pra começar a vender com vídeo',
          price: '597',
          priceNote: '/projeto',
          highlights: [
            'Vídeo criado com IA que mostra seu produto em 30s',
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
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Você nos envia fotos ou referências do produto ou negócio',
              'Geramos o vídeo com IA (Higgsfield)',
              'Adicionamos legenda, trilha licenciada e identidade visual',
              '1 revisão de ajustes inclusa — entrega em MP4 otimizado',
            ],
            timeline: '3 a 5 dias úteis',
          },
        },
        {
          id: 'video-profissional',
          tier: 'PROFISSIONAL',
          name: 'Vídeo Profissional',
          tagline: 'Pra alimentar suas redes todo mês',
          price: '997',
          priceNote: '/mês',
          highlights: [
            '8 vídeos por mês criados com IA alimentando suas redes',
            'Você envia fotos ou referências, a gente cuida do resto',
            'Funciona em Reels, TikTok e Shorts ao mesmo tempo',
            'Revisamos quantas vezes precisar',
          ],
          extras: [
            'Geração e edição com IA (Higgsfield)',
            'Trilhas sonoras licenciadas',
            'Entrega semanal',
          ],
          ctaText: 'Quero o Profissional',
          isFeatured: true,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Você nos envia fotos, produtos ou referências visuais do mês',
              'Geramos os 8 vídeos com IA (Higgsfield) e editamos',
              'Roteiro e legenda criados pela Lumon',
              'Trilhas sonoras licenciadas para uso comercial',
              'Entrega de 2 vídeos por semana no dia combinado',
            ],
            timeline: 'Recorrente mensal — entrega semanal',
          },
        },
        {
          id: 'video-premium',
          tier: 'PREMIUM',
          name: 'Vídeo Premium',
          tagline: 'Pra vídeo institucional completo',
          price: '2.497',
          priceNote: '/projeto',
          priceMonthly: '≈ R$ 208/mês em 12x',
          highlights: [
            'Vídeo institucional de 2-3 min criado com IA',
            'Visual cinematográfico sem precisar de equipe de filmagem',
            'Motion graphics e edição profissional',
            'Trilha sonora licenciada pro seu vídeo',
          ],
          extras: [
            '5 vídeos curtos pra redes',
            'Roteirização profissional',
            'Geração e edição com IA (Higgsfield)',
          ],
          ctaText: 'Quero o Premium',
          isFeatured: false,
          paymentUrl: '',
          howItWorks: {
            steps: [
              'Briefing completo sobre o negócio e o objetivo do vídeo',
              'Roteirização profissional do vídeo de 2-3 min',
              'Geração e edição com IA (Higgsfield) + motion graphics',
              'Trilha sonora licenciada inclusa',
              '5 vídeos curtos derivados para alimentar as redes sociais',
            ],
            timeline: '10 a 18 dias úteis',
          },
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

  incrementCounter(counter: { value: number; max: number }): void {
    if (counter.value < counter.max) counter.value++;
  }

  decrementCounter(counter: { value: number; min: number }): void {
    if (counter.value > counter.min) counter.value--;
  }

  toggleDesignItem(toggle: { active: boolean }): void {
    toggle.active = !toggle.active;
  }

  openDesignWhatsApp(): void {
    const lines: string[] = ['Olá! Quero um orçamento de Design personalizado:\n'];
    const counters = this.designCounters.filter(c => c.value > 0);
    if (counters.length) {
      lines.push('📅 *Conteúdo mensal:*');
      counters.forEach(c => lines.push(`• ${c.value} ${c.label.toLowerCase()}`));
    }
    const toggles = this.designToggles.filter(t => t.active);
    if (toggles.length) {
      if (counters.length) lines.push('');
      lines.push('🎨 *Identidade visual:*');
      toggles.forEach(t => lines.push(`• ${t.label}`));
    }
    lines.push('\nPodem me passar um orçamento?');
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/5521974767624?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  openModal(data: ModalData): void {
    this.selectedModal = data;
  }

  closeModal(): void {
    this.selectedModal = null;
  }

  openWhatsApp(pkg: { name: string }): void {
    const text = encodeURIComponent(
      `Olá! Tenho interesse no pacote ${pkg.name}. Pode me passar mais detalhes?`,
    );
    window.open(`https://wa.me/5521974767624?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  openPayment(pkg: Package): void {
    if (pkg.paymentUrl) {
      window.open(pkg.paymentUrl, '_blank', 'noopener,noreferrer');
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.selectedModal) {
      this.closeModal();
      return;
    }

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
