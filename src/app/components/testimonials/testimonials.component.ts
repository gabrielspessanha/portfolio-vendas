import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

interface Testimonial {
  name: string;
  business: string;
  segment: string;
  rating: number;
  quote: string;
  initials: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  private observer: IntersectionObserver | null = null;

  readonly testimonials: Testimonial[] = [
    {
      name: 'Marina Costa',
      business: 'Bella Massa',
      segment: 'Restaurante',
      rating: 5,
      quote:
        'Pra ser sincera, eu já tinha contratado agência antes e não tinha dado muito certo, então estava meio pé atrás. Com a Lumon foi diferente porque eles realmente acompanharam de perto e ajustaram as coisas no caminho em vez de entregar e sumir. O movimento no fim de semana melhorou bem. Não foi mágica da noite pro dia, mas hoje a gente não depende mais só de indicação.',
      initials: 'MC',
    },
    {
      name: 'Rafael Andrade',
      business: 'Mundo Pet',
      segment: 'Petshop',
      rating: 5,
      quote:
        'Eles entenderam a rotina do petshop antes de propor qualquer coisa. Demorou um pouco pra engrenar, mas depois passamos a receber bem mais agendamento de banho e tosa pela internet.',
      initials: 'RA',
    },
  ];

  range(n: number): number[] {
    return Array.from({ length: n });
  }

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
}
