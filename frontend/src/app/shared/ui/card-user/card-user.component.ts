import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface Employee {
  id: number;
  nome: string;
  cargo: string;
  avatarUrl: string;
  isActive: boolean;
  tags: string[];
  totalHours: number;
  totalIssues: number;
  completedIssues: number;
  efficiency: number;
  weeklyActivity: number[];
  projects: string[];
  onTimeDeliveries: number;
  lateDeliveries: number;
}
@Component({
  selector: 'card-user',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss'
})
export class CardUserComponent {
  @Input() employee!: Employee;

   constructor(private router: Router) {}

  viewDetails(employee: Employee): void {
    this.router.navigate(['/employee/data', employee.nome.toLowerCase().replace(' ', '.')]);
  }
  
  getMaxActivity(activities: number[]): number {
    return Math.max(...activities, 1);
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
