import { Component, Input } from '@angular/core';
import {  ChartData, ChartOptions, ChartType } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-point-graphic',
  imports: [BaseChartDirective],
  templateUrl: './point-graphic.component.html',
  styleUrl: './point-graphic.component.scss'
})
export class PointGraphicComponent {

public lineChartType: ChartType = 'line';

  public lineChartData: ChartData<'line'> = {
    labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI','JUN','JUL','SET','OUT','NOV','DEZ'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56,1,50,60,10,20,13],
        label: 'Issues Feitas',
        borderColor: '#7C3AED',
        backgroundColor: '#8b4cf974',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
     maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      x: { title: { display: true, text: '' } },
      y: { title: { display: true, text: 'Issues Feitas' }, beginAtZero: true }
    }
  };
}
