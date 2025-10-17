import {Component, AfterViewInit, ElementRef, inject} from '@angular/core'
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'

import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component'

import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component'
import { RouterLink } from "@angular/router";
import { PointGraphicComponent } from '../../../shared/ui/point-graphic/point-graphic.component';
import { UserState } from '../../state/user.state';

@Component({
    selector: 'app-home-page',
    imports: [SidebarComponent,
    DataCardComponent, PieGraphicComponent, RouterLink, PointGraphicComponent],
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements AfterViewInit {

  private state = inject(UserState);
  users = this.state.listUsers;
  horasFeitas: string = '0';
  horasMinimas: string = (this.users.length * 220).toString();

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

  ngOnInit(): void {
    this.state.loadUsers();
    console.log(this.users())
  }

  get teamHours(): string{
    
    return this.users().reduce((total, user) => total + (user.hours?.total || 0), 0).toFixed(2).toString();
  }

}
