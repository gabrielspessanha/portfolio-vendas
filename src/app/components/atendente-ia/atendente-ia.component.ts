import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

// ── Tipos do motor de conversa ────────────────────────────────────────────────

interface QuickReply {
  label: string;
  nextId: string;
}

interface ConvNode {
  id: string;
  bot: string[]; // 1+ balões do bot
  replies: QuickReply[]; // botões oferecidos ao usuário; [] = nó final
  handoff?: boolean; // true → mostra botão "Falar com atendente"
}

interface Scenario {
  id: 'petshop' | 'barbearia' | 'clinica';
  label: string; // chip do seletor
  business: string; // nome exibido no header do chat
  tagline: string; // subtítulo no header do chat
  avatarInitial: string;
  start: string; // id do nó inicial
  nodes: Record<string, ConvNode>;
}

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
}

const WHATSAPP_NUMBER = '5521974767624';

// ── Cenários (roteiros editáveis) ─────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 'petshop',
    label: 'Petshop',
    business: 'Amigo Fiel',
    tagline: 'Atendente virtual',
    avatarInitial: 'A',
    start: 'greeting',
    nodes: {
      greeting: {
        id: 'greeting',
        bot: [
          'Oi! Aqui é a assistente do Amigo Fiel 🐾',
          'Posso te ajudar com agendamento, preços ou tirar uma dúvida rápida. O que você precisa?',
        ],
        replies: [
          { label: 'Agendar banho e tosa', nextId: 'agendar' },
          { label: 'Ver preços', nextId: 'precos' },
          { label: 'Vocês buscam em casa?', nextId: 'leva-traz' },
        ],
      },
      agendar: {
        id: 'agendar',
        bot: [
          'Perfeito! Fazemos banho e tosa de segunda a sábado, das 9h às 18h.',
          'Pra qual porte é o pet? Assim já adianto a disponibilidade.',
        ],
        replies: [
          { label: 'Porte pequeno', nextId: 'agendar-confirma' },
          { label: 'Porte médio ou grande', nextId: 'agendar-confirma' },
        ],
      },
      'agendar-confirma': {
        id: 'agendar-confirma',
        bot: [
          'Ótimo! Tenho horários livres ainda esta semana.',
          'Pra confirmar dia e hora, é só falar com a nossa equipe pelo WhatsApp. Te encaminho agora?',
        ],
        replies: [{ label: 'Tenho outra dúvida', nextId: 'greeting' }],
        handoff: true,
      },
      precos: {
        id: 'precos',
        bot: [
          'O banho começa em R$ 45 (porte pequeno) e a tosa em R$ 60.',
          'O valor final depende do porte e do tipo de pelagem. Quer um orçamento certinho pro seu pet?',
        ],
        replies: [
          { label: 'Quero orçamento', nextId: 'handoff-orcamento' },
          { label: 'Voltar ao início', nextId: 'greeting' },
        ],
      },
      'handoff-orcamento': {
        id: 'handoff-orcamento',
        bot: ['Show! Nossa equipe fecha o orçamento rapidinho por aqui 👇'],
        replies: [],
        handoff: true,
      },
      'leva-traz': {
        id: 'leva-traz',
        bot: [
          'Buscamos e levamos sim 🚗 dentro do bairro, com taxa a partir de R$ 15.',
          'Quer que eu já chame a equipe pra combinar o leva e traz?',
        ],
        replies: [{ label: 'Ver preços antes', nextId: 'precos' }],
        handoff: true,
      },
    },
  },
  {
    id: 'barbearia',
    label: 'Barbearia',
    business: 'Barbearia Sete',
    tagline: 'Atendente virtual',
    avatarInitial: 'B',
    start: 'greeting',
    nodes: {
      greeting: {
        id: 'greeting',
        bot: [
          'E aí! Aqui é o assistente da Barbearia Sete ✂️',
          'Posso te ajudar a agendar, ver serviços ou valores. Qual é a boa?',
        ],
        replies: [
          { label: 'Agendar horário', nextId: 'agendar' },
          { label: 'Serviços e valores', nextId: 'servicos' },
          { label: 'Onde vocês ficam?', nextId: 'local' },
        ],
      },
      agendar: {
        id: 'agendar',
        bot: [
          'Fechou! Atendemos de terça a sábado, das 10h às 20h.',
          'Qual serviço você quer marcar?',
        ],
        replies: [
          { label: 'Corte', nextId: 'agendar-confirma' },
          { label: 'Corte + barba', nextId: 'agendar-confirma' },
        ],
      },
      'agendar-confirma': {
        id: 'agendar-confirma',
        bot: [
          'Boa escolha! Tenho horários abertos pros próximos dias.',
          'Pra travar seu horário, é só seguir com o nosso time no WhatsApp. Te levo agora?',
        ],
        replies: [{ label: 'Tenho outra dúvida', nextId: 'greeting' }],
        handoff: true,
      },
      servicos: {
        id: 'servicos',
        bot: [
          'Corte R$ 40, barba R$ 30 e o combo corte + barba sai R$ 60.',
          'Também fazemos sobrancelha e pézinho. Quer agendar algum?',
        ],
        replies: [
          { label: 'Quero agendar', nextId: 'agendar' },
          { label: 'Voltar ao início', nextId: 'greeting' },
        ],
      },
      local: {
        id: 'local',
        bot: [
          'Ficamos pertinho do centro, com estacionamento na porta.',
          'Te mando a localização exata e tiro qualquer dúvida pelo WhatsApp 👇',
        ],
        replies: [{ label: 'Ver serviços', nextId: 'servicos' }],
        handoff: true,
      },
    },
  },
  {
    id: 'clinica',
    label: 'Clínica',
    business: 'Clínica Vértice',
    tagline: 'Atendente virtual',
    avatarInitial: 'V',
    start: 'greeting',
    nodes: {
      greeting: {
        id: 'greeting',
        bot: [
          'Olá! Aqui é a assistente da Clínica Vértice 🩺',
          'Posso te ajudar com agendamento, convênios ou informações sobre os procedimentos. Como posso ajudar?',
        ],
        replies: [
          { label: 'Agendar consulta', nextId: 'agendar' },
          { label: 'Aceitam convênio?', nextId: 'convenio' },
          { label: 'Quais procedimentos?', nextId: 'procedimentos' },
        ],
      },
      agendar: {
        id: 'agendar',
        bot: [
          'Claro! Atendemos de segunda a sexta, das 8h às 19h.',
          'É a primeira vez na clínica ou já é paciente?',
        ],
        replies: [
          { label: 'Primeira vez', nextId: 'agendar-confirma' },
          { label: 'Já sou paciente', nextId: 'agendar-confirma' },
        ],
      },
      'agendar-confirma': {
        id: 'agendar-confirma',
        bot: [
          'Perfeito! Temos horários disponíveis nesta e na próxima semana.',
          'Pra confirmar data e profissional, nossa recepção finaliza com você pelo WhatsApp. Posso encaminhar?',
        ],
        replies: [{ label: 'Tenho outra dúvida', nextId: 'greeting' }],
        handoff: true,
      },
      convenio: {
        id: 'convenio',
        bot: [
          'Atendemos os principais convênios e também particular, com valores acessíveis.',
          'Me diz qual é o seu convênio que eu confirmo a cobertura com a equipe?',
        ],
        replies: [
          { label: 'Quero confirmar', nextId: 'handoff-convenio' },
          { label: 'Voltar ao início', nextId: 'greeting' },
        ],
      },
      'handoff-convenio': {
        id: 'handoff-convenio',
        bot: ['Combinado! A recepção confirma seu convênio rapidinho por aqui 👇'],
        replies: [],
        handoff: true,
      },
      procedimentos: {
        id: 'procedimentos',
        bot: [
          'Trabalhamos com consultas, exames e procedimentos estéticos e clínicos.',
          'Quer que eu detalhe algum específico com a nossa equipe?',
        ],
        replies: [{ label: 'Ver convênios', nextId: 'convenio' }],
        handoff: true,
      },
    },
  },
];

@Component({
  selector: 'app-atendente-ia',
  standalone: true,
  imports: [],
  templateUrl: './atendente-ia.component.html',
  styleUrl: './atendente-ia.component.scss',
})
export class AtendenteIaComponent implements AfterViewInit, OnDestroy {
  isVisible = false;

  readonly scenarios = SCENARIOS;
  activeScenarioId: Scenario['id'] = 'petshop';

  readonly benefits = [
    'Responde na hora, 24 horas por dia',
    'Qualifica o cliente antes de chegar em você',
    'Acaba com as mensagens repetidas do dia a dia',
    'Adapta o roteiro pro seu tipo de negócio',
  ];

  messages: ChatMessage[] = [];
  currentReplies: QuickReply[] = [];
  isTyping = false;
  showHandoff = false;

  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;

  private currentNodeId = '';
  private started = false;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private observer: IntersectionObserver | null = null;
  private readonly reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cd.detectChanges();
          if (!this.started) {
            this.started = true;
            this.startScenario(this.activeScenarioId);
          }
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.clearTimers();
  }

  get activeScenario(): Scenario {
    return this.scenarios.find((s) => s.id === this.activeScenarioId)!;
  }

  // ── Controles ────────────────────────────────────────────────────────────────

  selectScenario(id: Scenario['id']): void {
    if (id === this.activeScenarioId && this.messages.length) return;
    this.activeScenarioId = id;
    this.startScenario(id);
  }

  restart(): void {
    this.startScenario(this.activeScenarioId);
  }

  onReply(reply: QuickReply): void {
    // Balão do usuário aparece na hora
    this.messages = [...this.messages, { from: 'user', text: reply.label }];
    this.currentReplies = [];
    this.showHandoff = false;
    this.cd.detectChanges();
    this.scrollToBottom();
    this.goToNode(reply.nextId);
  }

  // ── Motor ────────────────────────────────────────────────────────────────────

  private startScenario(id: Scenario['id']): void {
    this.clearTimers();
    this.messages = [];
    this.currentReplies = [];
    this.showHandoff = false;
    this.isTyping = false;
    this.cd.detectChanges();
    this.goToNode(this.activeScenario.start);
  }

  private goToNode(nodeId: string): void {
    const node = this.activeScenario.nodes[nodeId];
    if (!node) return;
    this.currentNodeId = nodeId;
    this.emitBotMessages(node, 0);
  }

  private emitBotMessages(node: ConvNode, index: number): void {
    if (index >= node.bot.length) {
      // Terminou os balões: libera respostas/handoff
      this.currentReplies = node.replies;
      this.showHandoff = !!node.handoff;
      this.isTyping = false;
      this.cd.detectChanges();
      return;
    }

    const typingDelay = this.reduceMotion ? 0 : index === 0 ? 700 : 850;
    this.isTyping = true;
    this.cd.detectChanges();
    this.scrollToBottom();

    this.timers.push(
      setTimeout(() => {
        this.messages = [...this.messages, { from: 'bot', text: node.bot[index] }];
        this.isTyping = false;
        this.cd.detectChanges();
        this.scrollToBottom();
        // Pequena pausa antes do próximo balão / das opções
        const gap = this.reduceMotion ? 0 : 250;
        this.timers.push(
          setTimeout(() => this.emitBotMessages(node, index + 1), gap),
        );
      }, typingDelay),
    );
  }

  private clearTimers(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  private scrollToBottom(): void {
    const el = this.chatBody?.nativeElement;
    if (!el) return;
    // Espera o DOM pintar o novo balão antes de rolar
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }

  // ── WhatsApp handoff ───────────────────────────────────────────────────────────

  get handoffLink(): string {
    const text = encodeURIComponent(
      `Olá! Conversei com o atendente IA da ${this.activeScenario.business} no site da Lumon e quero falar com uma pessoa.`,
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }
}
