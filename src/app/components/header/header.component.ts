import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('ctaHover', [
      state('default', style({ boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)' })),
      state('hovered', style({ boxShadow: '0 4px 22px rgba(16, 185, 129, 0.55)' })),
      transition('default <=> hovered', animate('200ms ease')),
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-16px)' }),
        animate('500ms 100ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  ctaHovered = false;

  readonly navLinks = [
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Serviços',      href: '#servicos'      },
    { label: 'Projetos',      href: '#projetos'      },
    { label: 'Contato',       href: '#contato'       },
  ];
}
