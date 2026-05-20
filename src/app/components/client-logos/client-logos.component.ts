import { Component } from '@angular/core';

interface ClientLogo {
  name: string;
  category: string;
}

@Component({
  selector: 'app-client-logos',
  standalone: true,
  imports: [],
  templateUrl: './client-logos.component.html',
  styleUrl: './client-logos.component.scss',
})
export class ClientLogosComponent {
  readonly clients: ClientLogo[] = [
    { name: 'Amigo Fiel',         category: 'Pet Shop'     },
    { name: 'Voltagem',           category: 'Academia'     },
    { name: 'Brasa & Bacon',      category: 'Hamburgueria' },
    { name: 'Pizzaria do Bairro', category: 'Pizzaria'     },
    { name: 'Sabor da Terra',     category: 'Restaurante'  },
    { name: 'Barbearia Sete',     category: 'Barbearia'    },
  ];
}
