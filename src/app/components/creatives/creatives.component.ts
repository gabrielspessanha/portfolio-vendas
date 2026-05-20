import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

interface Creative {
  id: string;
  title: string;
  category: string;
  type: 'before-after' | 'single';
  beforeImage?: string;
  afterImage?: string;
  image?: string;
}

@Component({
  selector: 'app-creatives',
  standalone: true,
  imports: [],
  templateUrl: './creatives.component.html',
  styleUrl: './creatives.component.scss',
})
export class CreativesComponent implements AfterViewInit, OnDestroy {
  isVisible = false;

  readonly creatives: Creative[] = [
    {
      id: 'logo-petshop',
      title: 'Logo Pet Shop',
      category: 'REBRANDING',
      type: 'before-after',
      beforeImage: 'assets/images/creatives/01-logo-petshop-antes.png',
      afterImage:  'assets/images/creatives/01-logo-petshop-depois.png',
    },
    {
      id: 'anuncio-blackfriday',
      title: 'Campanha Black Friday',
      category: 'ANÚNCIO',
      type: 'single',
      image: 'assets/images/creatives/02-anuncio-blackfriday.png',
    },
    {
      id: 'post-restaurante',
      title: 'Post Restaurante',
      category: 'POST INSTAGRAM',
      type: 'before-after',
      beforeImage: 'assets/images/creatives/03-post-restaurante-antes.png',
      afterImage:  'assets/images/creatives/03-post-restaurante-depois.png',
    },
    {
      id: 'identidade-barbearia',
      title: 'Identidade Visual Barbearia',
      category: 'BRANDING',
      type: 'single',
      image: 'assets/images/creatives/04-identidade-barbearia.png',
    },
    {
      id: 'anuncio-academia',
      title: 'Anúncio Academia',
      category: 'ANÚNCIO META ADS',
      type: 'before-after',
      beforeImage: 'assets/images/creatives/05-anuncio-academia-antes.png',
      afterImage:  'assets/images/creatives/05-anuncio-academia-depois.png',
    },
    {
      id: 'carrossel-educacional',
      title: 'Carrossel Educacional',
      category: 'POST CARROSSEL',
      type: 'single',
      image: 'assets/images/creatives/06-carrossel-educacional.png',
    },
    {
      id: 'embalagem-cosmeticos',
      title: 'Embalagem Cosméticos',
      category: 'PACKAGING',
      type: 'before-after',
      beforeImage: 'assets/images/creatives/07-embalagem-antes.png',
      afterImage:  'assets/images/creatives/07-embalagem-depois.png',
    },
    {
      id: 'banner-ecommerce',
      title: 'Banner Site E-commerce',
      category: 'BANNER',
      type: 'single',
      image: 'assets/images/creatives/08-banner-ecommerce.png',
    },
    {
      id: 'stories-salao',
      title: 'Stories Salão de Beleza',
      category: 'STORIES',
      type: 'before-after',
      beforeImage: 'assets/images/creatives/09-stories-antes.png',
      afterImage:  'assets/images/creatives/09-stories-depois.png',
    },
  ];

  // Slider position (0–100) keyed by creative ID
  readonly sliderPos = new Map<string, number>();
  // Whether this specific slider is currently being dragged (disables CSS transition)
  readonly isDragging = new Map<string, boolean>();

  private activeDrag: { id: string; el: HTMLElement } | null = null;
  private lastFrameTime = 0;
  private hasDragged = false;
  private readonly demoDone = new Set<string>();
  private observer: IntersectionObserver | null = null;

  // ── Bound document handlers (stored to allow removeEventListener) ──────────
  private readonly onDocMouseMove = (e: MouseEvent): void => {
    if (!this.activeDrag) return;
    const now = performance.now();
    if (now - this.lastFrameTime < 16) return; // throttle to ~60fps
    this.lastFrameTime = now;
    this.hasDragged = true;
    this.updatePos(this.activeDrag.id, this.activeDrag.el, e.clientX);
  };

  private readonly onDocMouseUp = (): void => {
    if (!this.activeDrag) return;
    this.isDragging.set(this.activeDrag.id, false);
    this.activeDrag = null;
    document.removeEventListener('mousemove', this.onDocMouseMove);
    document.removeEventListener('mouseup', this.onDocMouseUp);
    this.cd.detectChanges();
  };

  private readonly onDocTouchMove = (e: TouchEvent): void => {
    e.preventDefault(); // blocks page scroll during slider drag
    if (!this.activeDrag) return;
    const now = performance.now();
    if (now - this.lastFrameTime < 16) return;
    this.lastFrameTime = now;
    this.hasDragged = true;
    this.updatePos(this.activeDrag.id, this.activeDrag.el, e.changedTouches[0].clientX);
  };

  private readonly onDocTouchEnd = (): void => {
    if (!this.activeDrag) return;
    this.isDragging.set(this.activeDrag.id, false);
    this.activeDrag = null;
    document.removeEventListener('touchmove', this.onDocTouchMove);
    document.removeEventListener('touchend', this.onDocTouchEnd);
    this.cd.detectChanges();
  };

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {
    // Initialise all before-after sliders at 50%
    this.creatives
      .filter(c => c.type === 'before-after')
      .forEach(c => {
        this.sliderPos.set(c.id, 50);
        this.isDragging.set(c.id, false);
      });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cd.detectChanges();
          this.observer?.disconnect();
          this.scheduleDemo();
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    document.removeEventListener('mousemove', this.onDocMouseMove);
    document.removeEventListener('mouseup', this.onDocMouseUp);
    document.removeEventListener('touchmove', this.onDocTouchMove);
    document.removeEventListener('touchend', this.onDocTouchEnd);
  }

  // ── Public helpers for the template ────────────────────────────────────────

  getPos(id: string): number {
    return this.sliderPos.get(id) ?? 50;
  }

  getClipPath(id: string): string {
    return `inset(0 ${100 - this.getPos(id)}% 0 0)`;
  }

  getTransition(id: string): string {
    return this.isDragging.get(id) ? 'none' : 'clip-path 0.3s ease, left 0.3s ease';
  }

  // ── Mouse drag ─────────────────────────────────────────────────────────────

  onDragStart(event: MouseEvent, id: string, el: HTMLElement): void {
    this.hasDragged = false;
    this.isDragging.set(id, true);
    this.activeDrag = { id, el };
    document.addEventListener('mousemove', this.onDocMouseMove);
    document.addEventListener('mouseup', this.onDocMouseUp);
  }

  // Fires after mousedown+mouseup without significant movement
  onSliderClick(event: MouseEvent, id: string, el: HTMLElement): void {
    if (this.hasDragged) return; // was a drag, not a click
    this.updatePos(id, el, event.clientX);
  }

  // ── Touch drag ─────────────────────────────────────────────────────────────

  onTouchStart(event: TouchEvent, id: string, el: HTMLElement): void {
    this.hasDragged = false;
    this.isDragging.set(id, true);
    this.activeDrag = { id, el };
    document.addEventListener('touchmove', this.onDocTouchMove, { passive: false });
    document.addEventListener('touchend', this.onDocTouchEnd);
  }

  // ── Keyboard control ───────────────────────────────────────────────────────

  onKeydown(event: KeyboardEvent, id: string): void {
    const current = this.getPos(id);
    let next: number | null = null;

    switch (event.key) {
      case 'ArrowRight': next = Math.min(100, current + 5); break;
      case 'ArrowLeft':  next = Math.max(0,   current - 5); break;
      case 'Home':       next = 0;   break;
      case 'End':        next = 100; break;
    }

    if (next === null) return;
    event.preventDefault();
    this.isDragging.set(id, false); // enable smooth transition
    this.sliderPos.set(id, next);
  }

  // ── Position calculation ───────────────────────────────────────────────────

  private updatePos(id: string, el: HTMLElement, clientX: number): void {
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    this.sliderPos.set(id, pct);
    this.cd.detectChanges();
  }

  // ── Demo animation: 50 → 30 → 70 → 50, once, desktop only ─────────────────
  private scheduleDemo(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    const targets = this.creatives.filter(c => c.type === 'before-after');
    targets.forEach((c, idx) => {
      if (this.demoDone.has(c.id)) return;
      this.demoDone.add(c.id);

      const base = 800 + idx * 500;
      setTimeout(() => { this.sliderPos.set(c.id, 30); this.isDragging.set(c.id, false); this.cd.detectChanges(); }, base);
      setTimeout(() => { this.sliderPos.set(c.id, 70); this.cd.detectChanges(); }, base + 700);
      setTimeout(() => { this.sliderPos.set(c.id, 50); this.cd.detectChanges(); }, base + 1400);
    });
  }

  // ── CTA WhatsApp ───────────────────────────────────────────────────────────
  get whatsappLink(): string {
    const text = encodeURIComponent('Olá! Vi seus criativos e quero criar conteúdo profissional pro meu negócio também.');
    return `https://wa.me/SEUNUMERO?text=${text}`;
  }
}