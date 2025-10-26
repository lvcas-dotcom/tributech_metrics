import { Component } from '@angular/core';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { DropdownOpcoesComponent } from '../../../shared/ui/dropdown-opcoes/dropdown-opcoes.component';

@Component({
  selector: 'app-configuration',
  imports: [SidebarComponent,CommonModule,DropdownOpcoesComponent],
  standalone: true,
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  options = [{
    description: 'Suporte',
    boards: ['suporte-geo','suporte-reurb']
  },
  {
    description: 'Desenvolvedores',
     boards: ['geo']
  }];


}
