import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  private observer: IntersectionObserver | null = null;

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

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data     = new FormData(form);
    const name     = (data.get('name')     as string).trim();
    const phone    = (data.get('phone')    as string).trim();
    const business = (data.get('business') as string).trim();
    const message  = (data.get('message')  as string).trim();

    const text = encodeURIComponent(
      `Olá! Sou ${name} e quero falar sobre um projeto.\n\n` +
      `📱 WhatsApp: ${phone}\n` +
      `🏢 Negócio: ${business}` +
      `${message ? `\n\nDetalhes: ${message}` : ''}`,
    );

    window.open(`https://wa.me/SEUNUMERO?text=${text}`, '_blank', 'noopener,noreferrer');
  }
}
