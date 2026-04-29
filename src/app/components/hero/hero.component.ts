import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

// Reutilisável: fade-in + slide de baixo para cima, com delay configurável via params
const fadeSlideUp = trigger('fadeSlideUp', [
  transition(
    ':enter',
    [
      style({ opacity: 0, transform: 'translateY(36px)' }),
      animate(
        '{{ duration }}ms {{ delay }}ms cubic-bezier(0.16, 1, 0.3, 1)',
        style({ opacity: 1, transform: 'translateY(0)' })
      ),
    ],
    { params: { duration: 650, delay: 0 } }
  ),
]);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [fadeSlideUp],
})
export class HeroComponent {
  readonly socialLinks = [
    {
      key: 'email',
      href: 'mailto:contato@tg.dev',
      label: 'Enviar e-mail',
      modifier: 'email',
    },
    {
      key: 'github',
      href: 'https://github.com',
      label: 'GitHub',
      modifier: 'github',
      external: true,
    },
    {
      key: 'linkedin',
      href: 'https://linkedin.com',
      label: 'LinkedIn',
      modifier: 'linkedin',
      external: true,
    },
  ];

  readonly webProjects = [
    { id: 1, label: 'Pet Shop',  large: true,  image: '/images/web_petshop.png'    },
    { id: 2, label: 'Academia',  large: false, image: '/images/web_fitness.png'    },
    { id: 3, label: 'Barbearia', large: false, image: '/images/web_barbearia.jpeg' },
  ];

  readonly mobileProjects = [
    { id: 4, label: 'Pet Shop',    image: '/images/mobile_petshop.png'     },
    { id: 5, label: 'Fitness',     image: '/images/mobile_fitness.jpeg'    },
    { id: 6, label: 'Odontologia', image: '/images/mobile_odontologia.png' },
  ];
}
