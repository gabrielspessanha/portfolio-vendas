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
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import type { Project } from '../project-modal/project-modal.component';

interface Category {
  id: string;
  label: string;
  shortcut?: string; // se definido, o chip rola até esta seção em vez de filtrar
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query('article:leave', [
          animate('200ms ease-out', style({ opacity: 0, transform: 'scale(0.88)' })),
        ], { optional: true }),
        query('article:enter', [
          style({ opacity: 0, transform: 'translateY(28px) scale(0.95)' }),
          stagger(70, [
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
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  filterVersion = 0;
  activeCategory = 'all';
  selectedProject: Project | null = null;
  isModalOpen = false;

  private observer: IntersectionObserver | null = null;

  readonly categories: Category[] = [
    { id: 'all',      label: 'Todos'    },
    { id: 'sites',    label: 'Sites'    },
    { id: 'sistemas', label: 'Sistemas', shortcut: 'sistema-demo'  },
    { id: 'ia',       label: 'IA',       shortcut: 'atendente-ia'  },
    { id: 'design',   label: 'Design'   },
    { id: 'videos',   label: 'Vídeos'   },
  ];

  readonly projects: Project[] = [
    {
      id: 'amigo-fiel',
      name: 'Amigo Fiel',
      category: 'sites',
      categoryLabel: 'SITE INSTITUCIONAL',
      thumbnail: 'assets/images/projects/petshop1.jpeg',
      images: [
        {
          url: 'assets/images/projects/petshop1.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
      ],
      description: 'Site completo para pet shop com agendamento online, e-commerce de produtos pet e blog informativo.',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'API REST'],
      features: [
        'Sistema de agendamento online',
        'E-commerce integrado',
        'Blog com SEO otimizado',
        'Painel administrativo',
      ],
      challenge: 'Modernizar o atendimento e expandir as vendas digitais.',
      result: 'Aumento de 40% nos agendamentos e novo canal de vendas online.',
      resultMetric: '+40% agendamentos',
      color: '#3B82F6',
    },
    {
      id: 'voltagem',
      name: 'Voltagem',
      category: 'sites',
      categoryLabel: 'SITE',
      thumbnail: 'assets/images/projects/academia_hero.jpeg',
      images: [
        {
          url: 'assets/images/projects/academia_hero.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/academia_precos.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/academia_mobile.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'mobile',
        },
        
      ],
      description: 'Plataforma completa para academia com site institucional e app mobile para alunos.',
      technologies: ['Angular', 'Capacitor', 'Firebase'],
      features: [
        'App mobile para alunos',
        'Sistema de matrícula online',
        'Aulas ao vivo via streaming',
        'Acompanhamento de progresso',
      ],
      challenge: 'Engajar alunos durante a pandemia.',
      result: 'Retenção de alunos aumentou 65%.',
      resultMetric: '+65% retenção',
      color: '#2EC6DE',
    },
    {
      id: 'brasa-bacon',
      name: 'Brasa & Bacon',
      category: 'sites',
      categoryLabel: 'SITE + DELIVERY',
      thumbnail: 'assets/images/projects/hamburgueria5.jpeg',
      images: [
        {
          url: 'assets/images/projects/hamburgueria5.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/hamburgueria1.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/hamburgueria2.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/hamburgueria3.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/mobile_hamburgueria.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'mobile',
        },
      ],
      description: 'Site de restaurante gourmet com cardápio digital e sistema de pedidos.',
      technologies: ['Angular', 'Stripe', 'WhatsApp API'],
      features: [
        'Cardápio digital interativo',
        'Pedidos via WhatsApp',
        'Reservas online',
        'Galeria de pratos',
      ],
      challenge: 'Substituir cardápio físico e agilizar pedidos.',
      result: 'Pedidos aumentaram 50% após implementação.',
      resultMetric: '+50% pedidos',
      color: '#F97316',
    },
    {
      id: 'pizzaria-do-bairro',
      name: 'Pizzaria do Bairro',
      category: 'sites',
      categoryLabel: 'SITE + DELIVERY',
      thumbnail: 'assets/images/projects/pizzaria1.jpeg',
      images: [
        {
          url: 'assets/images/projects/pizzaria1.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/pizzaria2.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/pizzaria3.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/mobile_pizzaria.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'mobile',
        },
      ],
      description: 'Site completo para pizzaria com cardápio digital, sistema de pedidos online e área de promoções.',
      technologies: ['Angular', 'WhatsApp API', 'SCSS'],
      features: [
        'Cardápio digital interativo',
        'Pedidos via WhatsApp',
        'Sistema de promoções',
        'Rastreamento de entrega',
      ],
      challenge: 'Digitalizar os pedidos e reduzir erros no atendimento.',
      result: 'Volume de pedidos online cresceu 70% no primeiro mês.',
      resultMetric: '+70% pedidos online',
      color: '#EF4444',
    },
    {
      id: 'sabor-da-terra',
      name: 'Sabor da Terra',
      category: 'sites',
      categoryLabel: 'SITE INSTITUCIONAL',
      thumbnail: 'assets/images/projects/restaurante1.jpeg',
      images: [
        {
          url: 'assets/images/projects/restaurante1.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/restaurante2.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/restaurante3.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/mobile_restaurante.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'mobile',
        },
      ],
      description: 'Site institucional para restaurante de comida típica com menu digital e sistema de reservas online.',
      technologies: ['Angular', 'SCSS', 'WhatsApp API'],
      features: [
        'Menu digital completo',
        'Sistema de reservas',
        'Galeria de pratos',
        'Depoimentos de clientes',
      ],
      challenge: 'Aumentar a visibilidade local e facilitar reservas.',
      result: 'Taxa de ocupação subiu 45% com o sistema de reservas online.',
      resultMetric: '+45% ocupação',
      color: '#2EC6DE',
    },
    {
      id: 'barbearia-sete',
      name: 'Barbearia Sete',
      category: 'sites',
      categoryLabel: 'LANDING PAGE',
      thumbnail: 'assets/images/projects/barbearia1.jpeg',
      images: [
        {
          url: 'assets/images/projects/barbearia1.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/barbearia2.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/barbearia3.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
        {
          url: 'assets/images/projects/mobile_barbearia.jpeg',
          caption: 'Hero — Apresentação principal',
          type: 'desktop',
        },
      ],
      description: 'Landing page moderna para barbearia com sistema de agendamento e galeria de cortes.',
      technologies: ['Angular', 'SCSS', 'Animations'],
      features: [
        'Agendamento via WhatsApp',
        'Galeria de cortes',
        'Depoimentos de clientes',
        'Localização integrada',
      ],
      challenge: 'Criar presença digital forte e reduzir agendamentos perdidos.',
      result: 'Agenda 100% preenchida com 2 semanas de antecedência.',
      resultMetric: 'Agenda 100% lotada',
      color: '#EF4444',
    },
  ];

  filteredProjects: Project[] = [...this.projects];

  // Galeria de Designs — intercalada por categoria pra masonry variar visualmente
  readonly designGallery: { src: string; alt: string }[] = [
    { src: 'images/Barbearia/Barbearia%20-%20Social%20Media.jpg', alt: 'Design barbearia' },
    { src: 'images/informatica/Black_Friday_Tech_Sale_Promotion%E2%80%A6_202606011754.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Brazilian_model_in_fashion_ad_202606011809.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Artisanal_cocktails_on_bar_table_202606011823.jpeg', alt: 'Design restaurante' },
    { src: 'images/Barbearia/Man\'s_hand_holding_iPhone_202606011751.jpeg', alt: 'Design barbearia' },
    { src: 'images/informatica/Gaming_console_promotional_poster_202606011759.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Cardigan_on_hanger_with_sculpture_202606011812.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Beer_and_fried_chicken_wings_202606011832.jpeg', alt: 'Design restaurante' },
    { src: 'images/Barbearia/Social%20Media%20-%20Barbearia.jpg', alt: 'Design barbearia' },
    { src: 'images/informatica/Gaming_controller_in_red_finish_202606011800.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Hoodie_ad_ethereal_atmosphere_202606011812.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Beer_and_fries_happy_hour_202606011833.jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Gaming_mouse_with__Sua_mira_202606011758.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Male_model_wearing_resort_shirt_202606011807.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Beer_and_fries_happy_hour_202606011834.jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Gaming_PC_setup_promotional_ad_202606011756.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Models_in_streetwear_collection_202606011809.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Beer_promotional_ad_dynamic_splash_202606011834.jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Gaming_setup_with_dual_monitors_202606011753.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Model_holding_camera_Black_Friday_202606011808.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Brunch_cafe_promotional_ad_202606011827.jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Laptop_promotional_ad_202606011756.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Model_in_fashion_collection_look%E2%80%A6_202606011812.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Chef_slicing_grilled_beef_rib_202606011834%20(1).jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Premium_tech_product_ad_202606011758.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Model_in_fashion_lookbook_editorial_202606011814.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Chef_slicing_grilled_beef_rib_202606011834.jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Smartphone_and_accessories_promo%E2%80%A6_202606011753.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Model_posing_in_fashion_promotion_202606011808%20(1).jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Chocolate_dessert_with_raspberry%E2%80%A6_202606011827.jpeg', alt: 'Design restaurante' },
    { src: 'images/informatica/Smartphone_and_earbuds_ad_202606011801.jpeg', alt: 'Design informática' },
    { src: 'images/moda/Model_posing_in_fashion_promotion_202606011808.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Cocktail_ad_with_hand_202606011824.jpeg', alt: 'Design restaurante' },
    { src: 'images/moda/Model_seated_in_fashion_ad_202606011811.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Cocktail_on_banana_leaf_202606011830.jpeg', alt: 'Design restaurante' },
    { src: 'images/moda/Model_wearing_premium_denim_pants_202606011807.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Cocktail_on_dark_wood_table_202606011828.jpeg', alt: 'Design restaurante' },
    { src: 'images/moda/Oversized_shirt_with_necklaces_202606011815.jpeg', alt: 'Design moda' },
    { src: 'images/restaurantes/Design%20Poster.jpg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Gourmet_burger_promotional_ad_202606011826.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Grilled_picanha_steaks_fire_atmo%E2%80%A6_202606011833.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Hands_clinking_beer_glasses_202606011825.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Hands_clinking_cocktail_cups_cheers_202606011839.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Hands_clinking_drinks_and_food_202606011826.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Happy_Hour_Flyer_Lumon_Lounge_202606011830.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Pizza_promotional_ad_rustic_atmo%E2%80%A6_202606011825.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Premium_cocktails_on_marble_table_202606011828.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Shrimp_with_aioli_and_beer_202606011824.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Sports_bar_football_match_beer_202606011837.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Sushi_restaurant_ad_202606011825(1).jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Sushi_restaurant_ad_202606011825.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Waiter_holding_cocktails_on_tray_202606011837.jpeg', alt: 'Design restaurante' },
    { src: 'images/restaurantes/Wine_and_cheese_night_event_202606011830.jpeg', alt: 'Design restaurante' },
  ];

  get isDesignActive(): boolean {
    return this.activeCategory === 'design';
  }

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
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

  onCategoryClick(cat: Category): void {
    if (cat.shortcut) {
      document
        .getElementById(cat.shortcut)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    this.filterProjects(cat.id);
  }

  filterProjects(categoryId: string): void {
    this.activeCategory = categoryId;
    this.filterVersion++;
    this.filteredProjects = categoryId === 'all'
      ? [...this.projects]
      : this.projects.filter(p => p.category === categoryId);
  }

  openModal(project: Project): void {
    this.selectedProject = project;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
    document.body.style.overflow = '';
  }

  onCardKeydown(event: KeyboardEvent, project: Project): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openModal(project);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isModalOpen) this.closeModal();
  }

  get whatsappCtaLink(): string {
    const text = encodeURIComponent('Olá! Quero conversar sobre um projeto.');
    return `https://wa.me/5521974767624?text=${text}`;
  }
}
