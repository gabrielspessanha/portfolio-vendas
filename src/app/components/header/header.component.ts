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
    trigger('contactHover', [
      state('default', style({ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' })),
      state(
        'hovered',
        style({ boxShadow: '0 4px 22px rgba(0, 217, 255, 0.4)' })
      ),
      transition('default <=> hovered', animate('200ms ease')),
    ]),
  ],
})
export class HeaderComponent {
  contactHovered = false;

  readonly navLinks = [
    { label: 'About me', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Portfolio', href: '#portfolio' },
  ];
}
