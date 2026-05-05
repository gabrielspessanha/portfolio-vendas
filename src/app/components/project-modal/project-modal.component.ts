import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  HostListener,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

export interface ProjectImage {
  url: string;
  caption: string;
  type: 'desktop' | 'mobile';
}

export interface Project {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  thumbnail: string;
  images: ProjectImage[];
  description: string;
  technologies: string[];
  features: string[];
  challenge: string;
  result: string;
  color: string;
}

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss',
  animations: [
    trigger('overlayFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('containerSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(24px)' }),
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95) translateY(12px)' }),
        ),
      ]),
    ]),
    // animTrigger increments for next, decrements for prev → always correct direction
    trigger('imageTransition', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class ProjectModalComponent implements OnChanges, AfterViewChecked {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('closeBtn') closeBtnRef!: ElementRef<HTMLButtonElement>;

  private needsFocus = false;
  private touchStartX = 0;
  private touchEndX = 0;

  currentIndex = 0;
  animTrigger = 0;
  imageLoaded = true;

  readonly whatsappNumber = 'SEUNUMERO';

  get currentImage(): ProjectImage | null {
    return this.project?.images?.[this.currentIndex] ?? null;
  }

  get hasMultipleImages(): boolean {
    return (this.project?.images?.length ?? 0) > 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.needsFocus = true;
    }
    if (changes['project']) {
      this.currentIndex = 0;
      this.animTrigger = 0;
      this.imageLoaded = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.needsFocus && this.closeBtnRef) {
      this.needsFocus = false;
      this.closeBtnRef.nativeElement.focus();
    }
  }

  nextImage(): void {
    if (!this.project?.images?.length) return;
    this.imageLoaded = false;
    this.animTrigger++;
    this.currentIndex = (this.currentIndex + 1) % this.project.images.length;
  }

  prevImage(): void {
    if (!this.project?.images?.length) return;
    this.imageLoaded = false;
    this.animTrigger--;
    const len = this.project.images.length;
    this.currentIndex = (this.currentIndex - 1 + len) % len;
  }

  goToImage(index: number): void {
    if (index === this.currentIndex) return;
    this.imageLoaded = false;
    index > this.currentIndex ? this.animTrigger++ : this.animTrigger--;
    this.currentIndex = index;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) < 50) return;
    diff > 0 ? this.nextImage() : this.prevImage();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    if (event.key === 'ArrowRight') { this.nextImage(); return; }
    if (event.key === 'ArrowLeft')  { this.prevImage(); return; }
    if (event.key !== 'Tab') return;

    const container = this.closeBtnRef?.nativeElement?.closest('.modal-container') as HTMLElement | null;
    if (!container) return;

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) { event.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { event.preventDefault(); first.focus(); }
    }
  }

  close(): void {
    this.closed.emit();
  }

  get whatsappLink(): string {
    if (!this.project) return '#';
    const text = encodeURIComponent(
      `Olá! Vi o projeto ${this.project.name} no seu site e gostaria de algo parecido.`,
    );
    return `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
}