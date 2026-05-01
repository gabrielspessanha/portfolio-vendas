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

export interface Project {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
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
  ],
})
export class ProjectModalComponent implements OnChanges, AfterViewChecked {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('closeBtn') closeBtnRef!: ElementRef<HTMLButtonElement>;

  private needsFocus = false;

  readonly whatsappNumber = 'SEUNUMERO';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.needsFocus = true;
    }
  }

  // Focus the close button after the @if block renders the modal
  ngAfterViewChecked(): void {
    if (this.needsFocus && this.closeBtnRef) {
      this.needsFocus = false;
      this.closeBtnRef.nativeElement.focus();
    }
  }

  // Trap Tab focus inside modal while it's open
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen || event.key !== 'Tab') return;

    const container = this.closeBtnRef?.nativeElement?.closest('.modal-container') as HTMLElement | null;
    if (!container) return;

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
