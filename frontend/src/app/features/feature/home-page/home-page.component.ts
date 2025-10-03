import {Component} from '@angular/core'
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'

import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component'

import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component'
import { BarGraphicComponent } from '../../../shared/ui/bar-graphic/bar-graphic.component'

@Component({
    selector: 'app-home-page',
    imports: [ SidebarComponent,
        DataCardComponent, PieGraphicComponent,BarGraphicComponent
    ],
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  options = [{idkey: 2,description:'B'},
    {idkey: 3,description:'C'}
  ]

  horasFeitas: string = '22';
  horasMinimas: string = '220';

  calculoHoras: string = '-190';

}
