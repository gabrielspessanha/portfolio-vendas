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
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [
    // Stagger animation triggered on each filter change
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
    { id: 'sistemas', label: 'Sistemas' },
    { id: 'ia',       label: 'IA'       },
    { id: 'design',   label: 'Design'   },
    { id: 'videos',   label: 'Vídeos'   },
  ];

  readonly projects: Project[] = [
    {
      id: 'patinhas-felizes',
      name: 'Patinhas Felizes',
      category: 'sites',
      categoryLabel: 'SITE INSTITUCIONAL',
      image: 'assets/images/projects/patinhas-felizes.png',
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
      color: '#3B82F6',
    },
    {
      id: 'barber-king',
      name: 'Barber King',
      category: 'sites',
      categoryLabel: 'LANDING PAGE',
      image: 'assets/images/projects/barber-king.png',
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
      color: '#EF4444',
    },
    {
      id: 'forge-fitness',
      name: 'Forge Fitness',
      category: 'sites',
      categoryLabel: 'SITE + APP',
      image: 'assets/images/projects/forge-fitness.png',
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
      color: '#10B981',
    },
    {
      id: 'sorriso-perfeito',
      name: 'Sorriso Perfeito',
      category: 'sites',
      categoryLabel: 'SITE INSTITUCIONAL',
      image: 'assets/images/projects/sorriso-perfeito.png',
      description: 'Site institucional para clínica odontológica com agendamento e área do paciente.',
      technologies: ['Angular', 'Node.js', 'MongoDB'],
      features: [
        'Agendamento online',
        'Área do paciente',
        'Antes e depois de tratamentos',
        'Convênios aceitos',
      ],
      challenge: 'Modernizar a clínica e captar mais pacientes online.',
      result: 'Crescimento de 80% em novos pacientes via site.',
      color: '#14B8A6',
    },
    {
      id: 'sabor-arte',
      name: 'Sabor & Arte',
      category: 'sites',
      categoryLabel: 'SITE + DELIVERY',
      image: 'assets/images/projects/sabor-arte.png',
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
      color: '#F97316',
    },
    {
      id: 'lumiere-beauty',
      name: 'Lumière Beauty',
      category: 'sites',
      categoryLabel: 'E-COMMERCE',
      image: 'assets/images/projects/lumiere-beauty.png',
      description: 'E-commerce premium para loja de cosméticos com catálogo completo e checkout.',
      technologies: ['Angular', 'Stripe', 'Sanity CMS'],
      features: [
        'Catálogo com filtros avançados',
        'Carrinho persistente',
        'Pagamento integrado',
        'Programa de fidelidade',
      ],
      challenge: 'Criar canal de vendas online premium.',
      result: 'Faturamento online superou loja física em 3 meses.',
      color: '#EC4899',
    },
  ];

  filteredProjects: Project[] = [...this.projects];

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
    return `https://wa.me/SEUNUMERO?text=${text}`;
  }
}
