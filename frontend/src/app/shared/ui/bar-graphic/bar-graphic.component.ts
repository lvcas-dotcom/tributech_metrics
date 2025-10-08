import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-graphic',
  imports: [BaseChartDirective],
  standalone:true,
  templateUrl: './bar-graphic.component.html',
  styleUrl: './bar-graphic.component.scss'
})
export class BarGraphicComponent {
   public barChartData!: ChartData<'bar'>; 
  public barChartType: ChartType = 'bar';
  @Input() values: number[] = [];
  @Input() labels: string[] = [];

   private availableColors: string[] = [
    '#007bff',
    '#28a745',
    '#ffc107',
    '#dc3545', 
    '#7C3AED', 
  ];
  public barChartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          display: false 
        }
      },
      scales: {
        x: { 
          title: {
            display: true,
            text: 'Categorias' 
          }
        },
        y: { 
          beginAtZero: true, 
          title: {
            display: true,
            text: 'Valores'
          }
        }
      }
    };

  ngOnInit() {
    const mappedColors = this.values.map((_, index) => 
      this.availableColors[index % this.availableColors.length]
    );

    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.values,
          label: 'Contagem', 
          backgroundColor: mappedColors,
          borderColor: mappedColors.map(color => color + 'AA'), 
          borderWidth: 1,
        }
      ]
    };
  }
}
