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

  ngOnInit(){
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.values,
          label: 'Contagem',
          backgroundColor: [
            '#FFA500', 
            '#7C3AED',
            '#40E0D0',
            '#FFA500', 
            '#7C3AED',
            '#40E0D0',
            '#FFA500', 
            '#7C3AED',
            '#40E0D0',
            '#FFA500', 
            '#7C3AED',
            '#40E0D0'
          ],
        }
      ]
    }
    
  };

  // Opções do gráfico
  public lineChartOptions: ChartOptions = {
    responsive: true,
     maintainAspectRatio: false
  };

  // Tipo do gráfico
  public lineChartType: ChartType = 'pie';
}
