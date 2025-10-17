import { Component, EventEmitter, Input, Output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarGraphicComponent } from '../bar-graphic/bar-graphic.component';
import { PointGraphicComponent } from '../point-graphic/point-graphic.component';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [CommonModule, FormsModule, BarGraphicComponent, PointGraphicComponent],
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss']
})
export class IssueCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() iconUrl: string = '';
  @Input() showDatePicker: boolean = false;
  @Input() showChart: boolean = false;
  @Input() chartType: 'bar' | 'line' = 'bar';
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  // Estilo/Config do gráfico (usado quando chartType === 'line')
  @Input() chartDatasetLabel: string = 'Issues Concluídas';
  @Input() chartLineColor: string = '#7C3AED';
  @Input() chartFillFrom: string = 'rgba(124, 58, 237, 0.4)';
  @Input() chartFillMid: string = 'rgba(124, 58, 237, 0.2)';
  @Input() chartFillTo: string = 'rgba(124, 58, 237, 0.05)';
  @Input() chartBorderWidth: number = 3;
  @Input() chartPointRadius: number = 5;
  @Input() chartPointHoverRadius: number = 8;
  @Input() chartShowLegend: boolean = false;
  @Input() selectedDate: Date = new Date();
  @Input() loading: boolean = false;
  @Input() accentColor: string = 'primary';
  
  @Output() dateChanged = new EventEmitter<Date>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const card = this.elementRef.nativeElement.querySelector('.issue-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      
      // Garantir que o valor está entre 0 e 100%
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      card.style.setProperty('--mouse-x', `${percentage}%`);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const card = this.elementRef.nativeElement.querySelector('.issue-card');
    if (card) {
      // Reset para o centro quando o mouse sai
      card.style.setProperty('--mouse-x', '50%');
    }
  }

  openMonthPicker(input: HTMLInputElement): void {
    // Tenta usar o método showPicker (Chrome/Edge modernos)
    // Fallback para focus caso não exista
    if (typeof (input as any).showPicker === 'function') {
      (input as any).showPicker();
    } else {
      input.focus();
      input.click();
    }
  }

  getFormattedDate(): string {
    if (!this.selectedDate) {
      const now = new Date();
      return `${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
    }
    const date = this.selectedDate instanceof Date ? this.selectedDate : new Date(this.selectedDate);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  }

  getInputValue(): string {
    const date = this.selectedDate instanceof Date ? this.selectedDate : new Date(this.selectedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  onDateChange(event: any): void {
    const [year, month] = event.target.value.split('-');
    const newDate = new Date(parseInt(year), parseInt(month) - 1);
    this.dateChanged.emit(newDate);
  }
}
