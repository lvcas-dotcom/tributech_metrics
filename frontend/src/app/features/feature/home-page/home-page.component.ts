import {Component} from '@angular/core'
import { DropdownOpcoesComponent } from '../../../shared/ui/dropdown-opcoes/dropdown-opcoes.component'
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'

import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component'

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DropdownOpcoesComponent,SidebarComponent ,
    DataCardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  options = [{idkey: 2,description:'B'},
    {idkey: 3,description:'C'}
  ]
}
