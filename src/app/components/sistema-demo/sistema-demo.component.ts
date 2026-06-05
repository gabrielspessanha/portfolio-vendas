import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type ApptStatus = 'confirmado' | 'atendimento' | 'concluido';

interface Appointment {
  time: string;
  client: string;
  service: string;
  status: ApptStatus;
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
  extras: Appointment[]; // pool pro botão "novo agendamento"
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
    appts: [
      { time: '09:00', client: 'Marina · Thor', service: 'Banho e tosa', status: 'concluido' },
      { time: '10:30', client: 'Lucas · Mel', service: 'Banho', status: 'atendimento' },
      { time: '11:15', client: 'Ana · Pingo', service: 'Tosa higiênica', status: 'confirmado' },
      { time: '14:00', client: 'Rafa · Luna', service: 'Banho e tosa', status: 'confirmado' },
    ],
    extras: [
      { time: '15:30', client: 'Bruno · Bob', service: 'Banho', status: 'confirmado' },
      { time: '16:45', client: 'Carla · Nina', service: 'Tosa completa', status: 'confirmado' },
    ],
  },
  {
    id: 'barbearia',
    label: 'Barbearia',
    business: 'Barbearia Sete',
    stats: { agendamentos: 19, ocupacao: 88, faturamento: 980 },
    appts: [
      { time: '09:30', client: 'Diego', service: 'Corte', status: 'concluido' },
      { time: '10:15', client: 'Felipe', service: 'Corte + barba', status: 'atendimento' },
      { time: '11:00', client: 'Igor', service: 'Barba', status: 'confirmado' },
      { time: '13:30', client: 'Pedro', service: 'Corte + barba', status: 'confirmado' },
    ],
    extras: [
      { time: '14:15', client: 'Marcos', service: 'Corte', status: 'confirmado' },
      { time: '15:00', client: 'Tiago', service: 'Pézinho', status: 'confirmado' },
    ],
  },
  {
    id: 'clinica',
    label: 'Clínica',
    business: 'Clínica Vértice',
    stats: { agendamentos: 11, ocupacao: 76, faturamento: 3150 },
    appts: [
      { time: '08:30', client: 'Sandra M.', service: 'Consulta', status: 'concluido' },
      { time: '09:45', client: 'João P.', service: 'Retorno', status: 'atendimento' },
      { time: '11:00', client: 'Beatriz L.', service: 'Avaliação', status: 'confirmado' },
      { time: '14:30', client: 'Carlos A.', service: 'Procedimento', status: 'confirmado' },
    ],
    extras: [
      { time: '15:30', client: 'Helena R.', service: 'Consulta', status: 'confirmado' },
      { time: '16:30', client: 'Rodrigo S.', service: 'Retorno', status: 'confirmado' },
    ],
  },
];

@Component({
  selector: 'app-sistema-demo',
  standalone: true,
  imports: [],
  templateUrl: './sistema-demo.component.html',
  styleUrl: './sistema-demo.component.scss',
})
export class SistemaDemoComponent implements AfterViewInit, OnDestroy {
  isVisible = false;

  readonly scenarios = SCENARIOS;
  activeScenarioId: SysScenario['id'] = 'petshop';

  appts: Appointment[] = [];
  displayStats: SysStats = { agendamentos: 0, ocupacao: 0, faturamento: 0 };

  readonly statusLabel = STATUS_LABEL;

  private extrasIndex = 0;
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
    this.loadScenario(id, this.isVisible);
  }

  cycleStatus(appt: Appointment): void {
    const i = STATUS_ORDER.indexOf(appt.status);
    appt.status = STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
  }

  addAppointment(): void {
    const pool = this.activeScenario.extras;
    if (!pool.length) return;
    const next = pool[this.extrasIndex % pool.length];
    this.extrasIndex++;
    this.appts = [...this.appts, { ...next }];
    this.displayStats = {
      ...this.displayStats,
      agendamentos: this.displayStats.agendamentos + 1,
    };
  }

  trackAppt(index: number): number {
    return index;
  }

  // ── Carregamento / animação ────────────────────────────────────────────────────

  private loadScenario(id: SysScenario['id'], animate: boolean): void {
    const sc = this.scenarios.find((s) => s.id === id)!;
    this.appts = sc.appts.map((a) => ({ ...a }));
    this.extrasIndex = 0;
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
    const from: SysStats = { agendamentos: 0, ocupacao: 0, faturamento: 0 };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      this.displayStats = {
        agendamentos: Math.round(from.agendamentos + (target.agendamentos - from.agendamentos) * eased),
        ocupacao: Math.round(from.ocupacao + (target.ocupacao - from.ocupacao) * eased),
        faturamento: Math.round(from.faturamento + (target.faturamento - from.faturamento) * eased),
      };
      this.cd.detectChanges();
      if (t < 1) this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  // ── WhatsApp CTA ─────────────────────────────────────────────────────────────

  get whatsappLink(): string {
    const text = encodeURIComponent(
      'Olá Lumon! Vi a demo do painel de sistema no site e quero um sistema sob medida pro meu negócio.',
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }
}
