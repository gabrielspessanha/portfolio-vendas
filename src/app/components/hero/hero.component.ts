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

  readonly projects = [
    { id: 1, label: 'Projeto 1', device: 'Laptop', modifier: 'large' },
    { id: 2, label: 'Projeto 2', device: 'Tablet', modifier: 'tablet' },
    { id: 3, label: 'Projeto 3', device: 'Smartphone', modifier: 'phone' },
    { id: 4, label: 'Projeto 4', device: 'Laptop', modifier: 'medium' },
  ];
}
