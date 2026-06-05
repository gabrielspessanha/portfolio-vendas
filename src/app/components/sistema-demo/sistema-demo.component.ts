import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type ApptStatus = 'confirmado' | 'atendimento' | 'concluido';
type ViewId = 'agenda' | 'clientes' | 'financeiro' | 'relatorios';

interface Appointment {
  time: string;
  client: string;
  service: string;
  status: ApptStatus;
}

interface Client {
  name: string;
  phone: string;
  visits: number;
  last: string;
}

interface DayBar {
  label: string;
  value: number;
}

interface TopService {
  name: string;
  pct: number;
}

interface SysStats {
  agendamentos: number;
  ocupacao: number; // %
  faturamento: number; // R$
}

interface SysScenario {
  id: 'petshop' | 'barbearia' | 'clinica';
  label: string;
  business: string;
  stats: SysStats;
  appts: Appointment[];
  services: string[]; // opções pro formulário
  clients: Client[];
  weekly: DayBar[];
  topServices: TopService[];
  ticket: number; // ticket médio R$
  monthRevenue: number; // faturamento do mês R$
}

interface NavItem {
  id: ViewId;
  label: string;
}

const WHATSAPP_NUMBER = '5521974767624';

const STATUS_ORDER: ApptStatus[] = ['confirmado', 'atendimento', 'concluido'];

const STATUS_LABEL: Record<ApptStatus, string> = {
  confirmado: 'Confirmado',
  atendimento: 'Em atendimento',
  concluido: 'Concluído',
};

// ── Cenários (dados de exemplo editáveis) ──────────────────────────────────────

const SCENARIOS: SysScenario[] = [
  {
    id: 'petshop',
    label: 'Petshop',
    business: 'Amigo Fiel',
    stats: { agendamentos: 14, ocupacao: 82, faturamento: 1240 },
    services: ['Banho', 'Banho e tosa', 'Tosa higiênica', 'Tosa completa'],
    appts: [
      { time: '09:00', client: 'Marina · Thor', service: 'Banho e tosa', status: 'concluido' },
      { time: '10:30', client: 'Lucas · Mel', service: 'Banho', status: 'atendimento' },
      { time: '11:15', client: 'Ana · Pingo', service: 'Tosa higiênica', status: 'confirmado' },
      { time: '14:00', client: 'Rafa · Luna', service: 'Banho e tosa', status: 'confirmado' },
    ],
    clients: [
      { name: 'Marina Souza', phone: '(21) 99812-3344', visits: 12, last: 'Hoje' },
      { name: 'Lucas Prado', phone: '(21) 99744-1020', visits: 8, last: 'Hoje' },
      { name: 'Ana Lima', phone: '(21) 98123-7788', visits: 5, last: '3 dias' },
      { name: 'Rafael Dias', phone: '(21) 99655-4521', visits: 21, last: '1 semana' },
    ],
    weekly: [
      { label: 'Seg', value: 9 }, { label: 'Ter', value: 12 }, { label: 'Qua', value: 14 },
      { label: 'Qui', value: 11 }, { label: 'Sex', value: 17 }, { label: 'Sáb', value: 22 },
    ],
    topServices: [
      { name: 'Banho e tosa', pct: 46 },
      { name: 'Banho', pct: 33 },
      { name: 'Tosa higiênica', pct: 21 },
    ],
    ticket: 78,
    monthRevenue: 24800,
  },
  {
    id: 'barbearia',
    label: 'Barbearia',
    business: 'Barbearia Sete',
    stats: { agendamentos: 19, ocupacao: 88, faturamento: 980 },
    services: ['Corte', 'Barba', 'Corte + barba', 'Pézinho', 'Sobrancelha'],
    appts: [
      { time: '09:30', client: 'Diego', service: 'Corte', status: 'concluido' },
      { time: '10:15', client: 'Felipe', service: 'Corte + barba', status: 'atendimento' },
      { time: '11:00', client: 'Igor', service: 'Barba', status: 'confirmado' },
      { time: '13:30', client: 'Pedro', service: 'Corte + barba', status: 'confirmado' },
    ],
    clients: [
      { name: 'Diego Martins', phone: '(21) 99877-1230', visits: 18, last: 'Hoje' },
      { name: 'Felipe Rocha', phone: '(21) 99432-8890', visits: 9, last: 'Hoje' },
      { name: 'Igor Nunes', phone: '(21) 98712-3345', visits: 24, last: '2 dias' },
      { name: 'Pedro Alves', phone: '(21) 99566-2210', visits: 6, last: '5 dias' },
    ],
    weekly: [
      { label: 'Ter', value: 14 }, { label: 'Qua', value: 16 }, { label: 'Qui', value: 19 },
      { label: 'Sex', value: 24 }, { label: 'Sáb', value: 31 }, { label: 'Dom', value: 0 },
    ],
    topServices: [
      { name: 'Corte + barba', pct: 52 },
      { name: 'Corte', pct: 34 },
      { name: 'Barba', pct: 14 },
    ],
    ticket: 52,
    monthRevenue: 19600,
  },
  {
    id: 'clinica',
    label: 'Clínica',
    business: 'Clínica Vértice',
    stats: { agendamentos: 11, ocupacao: 76, faturamento: 3150 },
    services: ['Consulta', 'Retorno', 'Avaliação', 'Procedimento', 'Exame'],
    appts: [
      { time: '08:30', client: 'Sandra M.', service: 'Consulta', status: 'concluido' },
      { time: '09:45', client: 'João P.', service: 'Retorno', status: 'atendimento' },
      { time: '11:00', client: 'Beatriz L.', service: 'Avaliação', status: 'confirmado' },
      { time: '14:30', client: 'Carlos A.', service: 'Procedimento', status: 'confirmado' },
    ],
    clients: [
      { name: 'Sandra Mendes', phone: '(21) 99800-4412', visits: 7, last: 'Hoje' },
      { name: 'João Pereira', phone: '(21) 99355-7781', visits: 3, last: 'Hoje' },
      { name: 'Beatriz Lopes', phone: '(21) 98444-9920', visits: 14, last: '4 dias' },
      { name: 'Carlos Antunes', phone: '(21) 99622-1180', visits: 2, last: '2 semanas' },
    ],
    weekly: [
      { label: 'Seg', value: 8 }, { label: 'Ter', value: 11 }, { label: 'Qua', value: 9 },
      { label: 'Qui', value: 13 }, { label: 'Sex', value: 10 }, { label: 'Sáb', value: 6 },
    ],
    topServices: [
      { name: 'Consulta', pct: 48 },
      { name: 'Retorno', pct: 29 },
      { name: 'Procedimento', pct: 23 },
    ],
    ticket: 286,
    monthRevenue: 63200,
  },
];

@Component({
  selector: 'app-sistema-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sistema-demo.component.html',
  styleUrl: './sistema-demo.component.scss',
})
export class SistemaDemoComponent implements AfterViewInit, OnDestroy {
  isVisible = false;

  readonly scenarios = SCENARIOS;
  activeScenarioId: SysScenario['id'] = 'petshop';

  readonly navItems: NavItem[] = [
    { id: 'agenda', label: 'Agenda' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'relatorios', label: 'Relatórios' },
  ];
  activeView: ViewId = 'agenda';

  appts: Appointment[] = [];
  displayStats: SysStats = { agendamentos: 0, ocupacao: 0, faturamento: 0 };

  readonly statusLabel = STATUS_LABEL;

  // Formulário inline
  showForm = false;
  formTime = '';
  formClient = '';
  formService = '';
  formError = '';

  private observer: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private readonly reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.loadScenario(this.activeScenarioId, false);
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cd.detectChanges();
          this.animateStats();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  get activeScenario(): SysScenario {
    return this.scenarios.find((s) => s.id === this.activeScenarioId)!;
  }

  // ── Controles ────────────────────────────────────────────────────────────────

  selectScenario(id: SysScenario['id']): void {
    if (id === this.activeScenarioId) return;
    this.activeScenarioId = id;
    this.closeForm();
    this.loadScenario(id, this.isVisible);
  }

  selectView(id: ViewId): void {
    this.activeView = id;
    if (id !== 'agenda') this.closeForm();
  }

  cycleStatus(appt: Appointment): void {
    const i = STATUS_ORDER.indexOf(appt.status);
    appt.status = STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
  }

  // ── Formulário inline ──────────────────────────────────────────────────────────

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.formError = '';
      this.formTime = '';
      this.formClient = '';
      this.formService = this.activeScenario.services[0] ?? '';
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.formError = '';
  }

  submitForm(): void {
    const client = this.formClient.trim();
    if (!client) {
      this.formError = 'Informe o nome do cliente.';
      return;
    }
    const appt: Appointment = {
      time: this.formTime || '--:--',
      client,
      service: this.formService || this.activeScenario.services[0] || 'Serviço',
      status: 'confirmado',
    };
    this.appts = [...this.appts, appt];
    this.displayStats = {
      ...this.displayStats,
      agendamentos: this.displayStats.agendamentos + 1,
    };
    this.closeForm();
  }

  trackAppt(index: number): number {
    return index;
  }

  // ── Carregamento / animação ────────────────────────────────────────────────────

  private loadScenario(id: SysScenario['id'], animate: boolean): void {
    const sc = this.scenarios.find((s) => s.id === id)!;
    this.appts = sc.appts.map((a) => ({ ...a }));
    if (animate) {
      this.animateStats();
    } else {
      this.displayStats = { ...sc.stats };
    }
    this.cd.detectChanges();
  }

  private animateStats(): void {
    const target = this.activeScenario.stats;
    if (this.reduceMotion) {
      this.displayStats = { ...target };
      this.cd.detectChanges();
      return;
    }
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      this.displayStats = {
        agendamentos: Math.round(target.agendamentos * eased),
        ocupacao: Math.round(target.ocupacao * eased),
        faturamento: Math.round(target.faturamento * eased),
      };
      this.cd.detectChanges();
      if (t < 1) this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  // ── Helpers de view ──────────────────────────────────────────────────────────

  maxWeekly(): number {
    return Math.max(...this.activeScenario.weekly.map((d) => d.value), 1);
  }

  formatMoney(v: number): string {
    return v.toLocaleString('pt-BR');
  }

  // ── WhatsApp CTA ─────────────────────────────────────────────────────────────

  get whatsappLink(): string {
    const text = encodeURIComponent(
      'Olá Lumon! Vi a demo do painel de sistema no site e quero um sistema sob medida pro meu negócio.',
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }
}
