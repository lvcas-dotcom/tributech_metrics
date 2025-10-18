import { Component, Input } from '@angular/core';
import {  ChartData, ChartOptions, ChartType } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'pie-graphic',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-graphic.component.html',
  styleUrl: './pie-graphic.component.scss'
})
export class PieGraphicComponent {
  @Input() values: number[] = [];
  @Input() labels: string[] = [];


  public lineChartData!: ChartData<'pie'>;
  public lineChartType: 'pie' = 'pie';

  ngOnInit(){
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.values,
          label: 'Issues',
          backgroundColor: [
<<<<<<< HEAD
            '#8b3eff8e',
            '#faa81ab8',
=======
            '#A384FF',
            '#ff91f0ff',
>>>>>>> frontend_test
            '#22D3EE',
            '#10B981',
            '#EF4444',
            '#6366F1',
            '#FBBF24',
            '#06B6D4',
            '#14B8A6',
            '#EC4899',
            '#8B5CF6',
            '#F97316'
          ],
          borderColor: '#12131A',
          borderWidth: 2,
          hoverBorderColor: '#12131A',
          hoverBorderWidth: 2,
          offset: 2,
          hoverOffset: 8
        }
      ]
    }
    
  };

  public lineChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10
    },
    plugins: {
      legend: { 
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          color: '#EDEDED',
          font: {
            family: 'Inter, sans-serif',
            size: 13,
            weight: 500
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          boxHeight: 10,
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  fontColor: '#EDEDED',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: { 
        enabled: true,
        padding: 16,
        displayColors: true,
        boxPadding: 8,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${value} issues (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutQuart'
    }
  };
}
