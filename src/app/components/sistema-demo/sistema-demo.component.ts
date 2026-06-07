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

interface WeekAppt {
  day: number; // 0 = Seg … 5 = Sáb
  hour: number; // 9..18
  span: number; // duração em horas (1 ou 2)
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
  services: string[]; // opções pro formulário
  week: WeekAppt[];
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
const TODAY = 2; // coluna "hoje" = Quarta
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS = [
  { label: 'Seg', date: 6 },
  { label: 'Ter', date: 7 },
  { label: 'Qua', date: 8 },
  { label: 'Qui', date: 9 },
  { label: 'Sex', date: 10 },
  { label: 'Sáb', date: 11 },
];

const STATUS_ORDER: ApptStatus[] = ['confirmado', 'atendimento', 'concluido'];
const STATUS_LABEL: Record<ApptStatus, string> = {
  confirmado: 'Confirmado',
  atendimento: 'Em atendimento',
  concluido: 'Concluído',
};
const STATUS_SHORT: Record<ApptStatus, string> = {
  confirmado: 'CONFIRMADO',
  atendimento: 'EM ATENDIMENTO',
  concluido: 'CONCLUÍDO',
};

// ── Cenários (dados de exemplo editáveis) ──────────────────────────────────────

const SCENARIOS: SysScenario[] = [
  {
    id: 'barbearia',
    label: 'Barbearia',
    business: 'Barbearia Sete',
    stats: { agendamentos: 19, ocupacao: 88, faturamento: 980 },
    services: ['Corte', 'Barba', 'Corte + barba', 'Pézinho', 'Sobrancelha'],
    week: [
      { day: 0, hour: 9, span: 1, client: 'Diego M.', service: 'Corte', status: 'concluido' },
      { day: 0, hour: 11, span: 1, client: 'Igor N.', service: 'Barba', status: 'confirmado' },
      { day: 0, hour: 14, span: 2, client: 'Pedro A.', service: 'Corte + barba', status: 'confirmado' },
      { day: 1, hour: 10, span: 1, client: 'Bruno S.', service: 'Corte', status: 'concluido' },
      { day: 1, hour: 15, span: 2, client: 'Marcos T.', service: 'Corte + barba', status: 'confirmado' },
      { day: 2, hour: 9, span: 1, client: 'Lucas P.', service: 'Corte', status: 'concluido' },
      { day: 2, hour: 10, span: 2, client: 'Felipe R.', service: 'Corte + barba', status: 'atendimento' },
      { day: 2, hour: 13, span: 1, client: 'Rafael D.', service: 'Barba', status: 'confirmado' },
      { day: 2, hour: 16, span: 1, client: 'Tiago L.', service: 'Pézinho', status: 'confirmado' },
      { day: 3, hour: 11, span: 1, client: 'André V.', service: 'Corte', status: 'confirmado' },
      { day: 3, hour: 17, span: 2, client: 'João P.', service: 'Corte + barba', status: 'confirmado' },
      { day: 4, hour: 10, span: 1, client: 'Carlos A.', service: 'Barba', status: 'confirmado' },
      { day: 4, hour: 14, span: 1, client: 'Vitor S.', service: 'Corte', status: 'confirmado' },
      { day: 5, hour: 9, span: 2, client: 'Henrique B.', service: 'Corte + barba', status: 'confirmado' },
      { day: 5, hour: 12, span: 1, client: 'Murilo F.', service: 'Corte', status: 'confirmado' },
    ],
    clients: [
      { name: 'Diego Martins', phone: '(21) 99877-1230', visits: 18, last: 'Hoje' },
      { name: 'Felipe Rocha', phone: '(21) 99432-8890', visits: 9, last: 'Hoje' },
      { name: 'Igor Nunes', phone: '(21) 98712-3345', visits: 24, last: '2 dias' },
      { name: 'Pedro Alves', phone: '(21) 99566-2210', visits: 6, last: '5 dias' },
    ],
    weekly: [
      { label: 'Seg', value: 14 }, { label: 'Ter', value: 16 }, { label: 'Qua', value: 19 },
      { label: 'Qui', value: 13 }, { label: 'Sex', value: 17 }, { label: 'Sáb', value: 24 },
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
    id: 'petshop',
    label: 'Petshop',
    business: 'Amigo Fiel',
    stats: { agendamentos: 14, ocupacao: 82, faturamento: 1240 },
    services: ['Banho', 'Banho e tosa', 'Tosa higiênica', 'Tosa completa'],
    week: [
      { day: 0, hour: 9, span: 2, client: 'Marina · Thor', service: 'Banho e tosa', status: 'concluido' },
      { day: 0, hour: 14, span: 1, client: 'Bruno · Bob', service: 'Banho', status: 'confirmado' },
      { day: 1, hour: 10, span: 1, client: 'Carla · Nina', service: 'Tosa higiênica', status: 'concluido' },
      { day: 1, hour: 15, span: 2, client: 'Diego · Spike', service: 'Tosa completa', status: 'confirmado' },
      { day: 2, hour: 9, span: 1, client: 'Lucas · Mel', service: 'Banho', status: 'concluido' },
      { day: 2, hour: 10, span: 2, client: 'Ana · Pingo', service: 'Banho e tosa', status: 'atendimento' },
      { day: 2, hour: 14, span: 1, client: 'Rafa · Luna', service: 'Tosa higiênica', status: 'confirmado' },
      { day: 2, hour: 16, span: 1, client: 'Bia · Thor', service: 'Banho', status: 'confirmado' },
      { day: 3, hour: 11, span: 2, client: 'Paula · Max', service: 'Tosa completa', status: 'confirmado' },
      { day: 4, hour: 10, span: 1, client: 'Sofia · Bel', service: 'Banho', status: 'confirmado' },
      { day: 4, hour: 15, span: 2, client: 'Tomás · Rex', service: 'Banho e tosa', status: 'confirmado' },
      { day: 5, hour: 9, span: 1, client: 'Léo · Pretinha', service: 'Banho', status: 'confirmado' },
      { day: 5, hour: 11, span: 2, client: 'Duda · Amora', service: 'Banho e tosa', status: 'confirmado' },
    ],
    clients: [
      { name: 'Marina Souza', phone: '(21) 99812-3344', visits: 12, last: 'Hoje' },
      { name: 'Ana Lima', phone: '(21) 98123-7788', visits: 5, last: 'Hoje' },
      { name: 'Lucas Prado', phone: '(21) 99744-1020', visits: 8, last: '3 dias' },
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
    id: 'clinica',
    label: 'Clínica',
    business: 'Clínica Vértice',
    stats: { agendamentos: 11, ocupacao: 76, faturamento: 3150 },
    services: ['Consulta', 'Retorno', 'Avaliação', 'Procedimento', 'Exame'],
    week: [
      { day: 0, hour: 9, span: 1, client: 'Helena R.', service: 'Consulta', status: 'concluido' },
      { day: 0, hour: 14, span: 1, client: 'Rodrigo S.', service: 'Retorno', status: 'confirmado' },
      { day: 1, hour: 10, span: 2, client: 'Marcela P.', service: 'Procedimento', status: 'concluido' },
      { day: 2, hour: 9, span: 1, client: 'Sandra M.', service: 'Consulta', status: 'concluido' },
      { day: 2, hour: 10, span: 1, client: 'João P.', service: 'Retorno', status: 'atendimento' },
      { day: 2, hour: 13, span: 1, client: 'Beatriz L.', service: 'Avaliação', status: 'confirmado' },
      { day: 2, hour: 15, span: 2, client: 'Carlos A.', service: 'Procedimento', status: 'confirmado' },
      { day: 3, hour: 11, span: 1, client: 'Letícia F.', service: 'Consulta', status: 'confirmado' },
      { day: 3, hour: 16, span: 1, client: 'Paulo R.', service: 'Exame', status: 'confirmado' },
      { day: 4, hour: 10, span: 1, client: 'Gabriela T.', service: 'Avaliação', status: 'confirmado' },
      { day: 5, hour: 9, span: 1, client: 'Renato M.', service: 'Consulta', status: 'confirmado' },
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
  activeScenarioId: SysScenario['id'] = 'barbearia';

  readonly navItems: NavItem[] = [
    { id: 'agenda', label: 'Agenda' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'relatorios', label: 'Relatórios' },
  ];
  activeView: ViewId = 'agenda';

  readonly hours = HOURS;
  readonly days = DAYS;
  readonly today = TODAY;
  readonly statusLabel = STATUS_LABEL;
  readonly statusShort = STATUS_SHORT;

  week: WeekAppt[] = [];
  displayStats: SysStats = { agendamentos: 0, ocupacao: 0, faturamento: 0 };

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
      { threshold: 0.12 },
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

  cycleStatus(appt: WeekAppt): void {
    const i = STATUS_ORDER.indexOf(appt.status);
    appt.status = STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
  }

  // ── Grid helpers ───────────────────────────────────────────────────────────────

  fmtHour(h: number): string {
    return `${String(h).padStart(2, '0')}:00`;
  }

  gridRow(appt: WeekAppt): string {
    const start = this.hours.indexOf(appt.hour) + 2; // +1 header, +1 base-1
    return `${start} / span ${appt.span}`;
  }

  gridCol(appt: WeekAppt): number {
    return appt.day + 2; // col 1 = horários
  }

  // ── Painel lateral (derivado) ──────────────────────────────────────────────────

  get todays(): WeekAppt[] {
    return this.week
      .filter((a) => a.day === TODAY)
      .sort((a, b) => a.hour - b.hour);
  }

  get nextClients(): WeekAppt[] {
    return this.todays.filter((a) => a.status !== 'concluido').slice(0, 4);
  }

  countToday(status: ApptStatus): number {
    return this.todays.filter((a) => a.status === status).length;
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
    let hour = 11;
    if (this.formTime) {
      const parsed = parseInt(this.formTime.split(':')[0], 10);
      if (!Number.isNaN(parsed)) hour = Math.min(18, Math.max(9, parsed));
    }
    this.week = [
      ...this.week,
      {
        day: TODAY,
        hour,
        span: 1,
        client,
        service: this.formService || this.activeScenario.services[0] || 'Serviço',
        status: 'confirmado',
      },
    ];
    this.displayStats = {
      ...this.displayStats,
      agendamentos: this.displayStats.agendamentos + 1,
    };
    this.closeForm();
  }

  // ── Carregamento / animação ────────────────────────────────────────────────────

  private loadScenario(id: SysScenario['id'], animate: boolean): void {
    const sc = this.scenarios.find((s) => s.id === id)!;
    this.week = sc.week.map((a) => ({ ...a }));
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
      const eased = 1 - Math.pow(1 - t, 3);
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
