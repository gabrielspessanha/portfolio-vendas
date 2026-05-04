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
      id: 'amigo-fiel',
      name: 'Amigo Fiel',
      category: 'sites',
      categoryLabel: 'SITE INSTITUCIONAL',
      image: 'assets/images/projects/petshop1.jpeg',
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
      id: 'voltagem',
      name: 'Voltagem',
      category: 'sites',
      categoryLabel: 'SITE',
      image: 'assets/images/projects/academia_hero.jpeg',
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
      id: 'brasa-bacon',
      name: 'Brasa & Bacon',
      category: 'sites',
      categoryLabel: 'SITE + DELIVERY',
      image: 'assets/images/projects/hamburgueria5.jpeg',
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
      id: 'pizzaria-do-bairro',
      name: 'Pizzaria do Bairro',
      category: 'sites',
      categoryLabel: 'SITE + DELIVERY',
      image: 'assets/images/projects/pizzaria1.jpeg',
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
      color: '#EF4444',
    },
    {
      id: 'sabor-da-terra',
      name: 'Sabor da Terra',
      category: 'sites',
      categoryLabel: 'SITE INSTITUCIONAL',
      image: 'assets/images/projects/restaurante1.jpeg',
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
      color: '#F59E0B',
    },
    {
      id: 'barbearia-sete',
      name: 'Barbearia Sete',
      category: 'sites',
      categoryLabel: 'LANDING PAGE',
      image: 'assets/images/projects/barbearia1.jpeg',
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
