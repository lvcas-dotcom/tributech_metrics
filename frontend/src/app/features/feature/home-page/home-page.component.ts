import {Component, AfterViewInit, ElementRef} from '@angular/core'
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'

import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component'

import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component'
import { RouterLink } from "@angular/router";
import { PointGraphicComponent } from '../../../shared/ui/point-graphic/point-graphic.component';

@Component({
    selector: 'app-home-page',
    imports: [SidebarComponent,
    DataCardComponent, PieGraphicComponent, RouterLink, PointGraphicComponent],
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements AfterViewInit {
  options = [{idkey: 2,description:'B'},
    {idkey: 3,description:'C'}
  ]

  horasFeitas: string = '22';
  horasMinimas: string = '220';

  calculoHoras: string = '-190';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.card-users app-data-card');
    
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${xPercent}%`);
        card.style.setProperty('--mouse-y', `${yPercent}%`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

}
