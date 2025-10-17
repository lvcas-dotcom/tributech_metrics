import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-graphic',
  imports: [BaseChartDirective],
  standalone:true,
  templateUrl: './bar-graphic.component.html',
  styleUrl: './bar-graphic.component.scss'
})
export class BarGraphicComponent implements OnInit, OnChanges {
   public barChartData!: ChartData<'bar'>; 
  public barChartType: ChartType = 'bar';
  @Input() values: number[] = [];
  @Input() labels: string[] = [];

   private availableColors: string[] = [
    '#8B44F8',
    '#adfff1ff',
    '#77a6ffff',
    '#b6ffc0ff',
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
          ticks: {
            color: '#c197ff',
            font: {
              size: 11,
              family: 'Inter'
            }
          },
          grid: {
            display: false
          },
          border: {
            color: 'rgba(139, 68, 248, 0.2)'
          }
        },
        y: { 
          beginAtZero: true,
          ticks: {
            color: '#c197ff',
            font: {
              size: 11,
              family: 'Inter'
            }
          },
          grid: {
            color: 'rgba(139, 68, 248, 0.1)'
          },
          border: {
            color: 'rgba(139, 68, 248, 0.2)'
          }
        }
      }
    };

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['values'] || changes['labels']) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (!this.values || this.values.length === 0) {
      return;
    }

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
