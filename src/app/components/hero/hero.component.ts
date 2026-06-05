import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

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

const fadeScaleIn = trigger('fadeScaleIn', [
  transition(
    ':enter',
    [
      style({ opacity: 0, transform: 'scale(0.92)' }),
      animate(
        '{{ duration }}ms {{ delay }}ms cubic-bezier(0.16, 1, 0.3, 1)',
        style({ opacity: 1, transform: 'scale(1)' })
      ),
    ],
    { params: { duration: 800, delay: 0 } }
  ),
]);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [fadeSlideUp, fadeScaleIn],
})
export class HeroComponent {
  readonly whatsappCta =
    'https://wa.me/5521974767624?text=' +
    encodeURIComponent(
      'Olá Lumon! Cheguei pelo site e quero conversar sem compromisso sobre site, sistema ou IA pro meu negócio.',
    );

  readonly mosaicImages = [
    { src: 'assets/images/projects/petshop1.jpeg',       alt: 'Site para petshop' },
    { src: 'assets/images/projects/barbearia1.jpeg',     alt: 'Site para barbearia' },
    { src: 'assets/images/projects/academia_hero.jpeg',  alt: 'Site para academia' },
    { src: 'assets/images/projects/hamburgueria5.jpeg',  alt: 'Site para hamburgueria' },
    { src: 'assets/images/projects/pizzaria1.jpeg',      alt: 'Site para pizzaria' },
    { src: 'assets/images/projects/restaurante1.jpeg',   alt: 'Site para restaurante' },
    { src: 'assets/images/projects/mobile_petshop.jpeg', alt: 'App mobile petshop' },
    { src: 'assets/images/projects/academia_precos.jpeg',alt: 'Página de preços academia' },
    { src: 'assets/images/projects/hamburgueria2.jpeg',  alt: 'Cardápio hamburgueria' },
  ];

  readonly socialLinks = [
    {
      key: 'whatsapp',
      href:
        'https://wa.me/5521974767624?text=' +
        encodeURIComponent(
          'Olá Lumon! Cheguei pelo site. Pode me explicar o que vocês fazem?',
        ),
      label: 'Fale no WhatsApp',
      modifier: 'whatsapp',
      external: true,
      delay: 600,
    },
    {
      key: 'instagram',
      href: 'https://instagram.com',
      label: 'Instagram',
      modifier: 'instagram',
      external: true,
      delay: 720,
    },
    {
      key: 'email',
      href: 'mailto:gabrielpessanha2g@gmail.com',
      label: 'Enviar e-mail',
      modifier: 'email',
      delay: 840,
    },
  ];
}
