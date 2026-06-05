import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { AtendenteIaComponent } from './components/atendente-ia/atendente-ia.component';
import { SistemaDemoComponent } from './components/sistema-demo/sistema-demo.component';
import { AboutComponent } from './components/about/about.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    ProjectsComponent,
    ServicesComponent,
    AtendenteIaComponent,
    SistemaDemoComponent,
    HowItWorksComponent,
    PricingComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-header />
    <app-hero />
    <app-projects />
    <app-services />
    <app-atendente-ia />
    <app-sistema-demo />
    <app-how-it-works />
    <app-pricing />
    <app-about />
    <app-contact />
    <app-footer />
  `,
})
export class AppComponent {}
