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

  // Mistura projetos reais + designs (intercalado pra variar visualmente).
  // Preenche o painel escuro do hero como grade de fundo (decorativo).
  readonly mosaicImages = [
    { src: 'assets/images/projects/petshop1.jpeg',                                           alt: 'Site para petshop' },
    { src: 'images/restaurantes/Gourmet_burger_promotional_ad_202606011826.jpeg',            alt: 'Design hamburgueria' },
    { src: 'assets/images/projects/barbearia1.jpeg',                                         alt: 'Site para barbearia' },
    { src: 'images/moda/Model_in_fashion_lookbook_editorial_202606011814.jpeg',              alt: 'Design moda' },
    { src: 'assets/images/projects/academia_hero.jpeg',                                      alt: 'Site para academia' },
    { src: 'images/informatica/Gaming_setup_with_dual_monitors_202606011753.jpeg',           alt: 'Design informática' },
    { src: 'assets/images/projects/pizzaria1.jpeg',                                          alt: 'Site para pizzaria' },
    { src: 'images/restaurantes/Sushi_restaurant_ad_202606011825.jpeg',                      alt: 'Design restaurante' },
    { src: 'assets/images/projects/restaurante1.jpeg',                                       alt: 'Site para restaurante' },
    { src: 'images/moda/Models_in_streetwear_collection_202606011809.jpeg',                  alt: 'Design moda streetwear' },
    { src: 'assets/images/projects/hamburgueria5.jpeg',                                      alt: 'Site para hamburgueria' },
    { src: 'images/informatica/Gaming_PC_setup_promotional_ad_202606011756.jpeg',            alt: 'Design informática gamer' },
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
