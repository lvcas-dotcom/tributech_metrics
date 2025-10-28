import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogUser } from '../../../features/data-acess/entities/catalog-user.model';


@Component({
  selector: 'card-user',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss'
})
export class CardUserComponent {
  @Input() employee!: CatalogUser;
  @Input() necessaryHours!: number;
   constructor(private router: Router) {}

  viewDetails(employee: CatalogUser): void {
    this.router.navigate(['/employee/data', employee.username.toLowerCase().replace(' ', '.')]);
  }
  
  getMaxActivity(activities: number[]): number {
    return Math.max(...activities, 1);
  }
  
  get performace(){
    return ((this.employee.horas_apontadas * 100) / this.necessaryHours).toFixed(2)
  }

  getCurrentDayIndex(): number {
    return new Date().getDay();
  }
   onCardMouseMove(event: MouseEvent, cardElement: HTMLElement): void {
    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    cardElement.style.setProperty('--mouse-x', `${percentage}%`);
  }

  onCardMouseLeave(cardElement: HTMLElement): void {
    cardElement.style.setProperty('--mouse-x', '50%');
  }
}
