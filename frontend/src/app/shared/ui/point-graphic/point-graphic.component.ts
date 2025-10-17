import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {  ChartData, ChartOptions, ChartType } from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-point-graphic',
  imports: [BaseChartDirective],
  templateUrl: './point-graphic.component.html',
  styleUrl: './point-graphic.component.scss'
})
export class PointGraphicComponent implements OnChanges {

public lineChartType: ChartType = 'line';
  
  // Inputs para permitir customização por card
  @Input() values: number[] | null = null;
  @Input() labels: string[] | null = null;
  @Input() datasetLabel: string = 'Issues Concluídas';
  @Input() lineColor: string = '#E195FF';
  @Input() fillFrom: string = 'rgba(225, 149, 255, 0.35)';
  @Input() fillMid: string = 'rgba(225, 149, 255, 0.18)';
  @Input() fillTo: string = 'rgba(225, 149, 255, 0.06)';
  @Input() borderWidth: number = 3;
  @Input() pointRadius: number = 5;
  @Input() pointHoverRadius: number = 8;
  @Input() showLegend: boolean = true;

  public lineChartData!: ChartData<'line'>;

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { 
        display: this.showLegend,
        position: 'top',
        align: 'end',
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12,
            weight: 500,
            family: 'Montserrat, sans-serif'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F3F4F6',
        bodyColor: '#E5E7EB',
  borderColor: this.lineColor,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y} issues`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: {
          display: true,
          color: 'rgba(156, 163, 175, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
            weight: 500,
            family: 'Montserrat, sans-serif'
          }
        }
      },
      y: { 
        grid: {
          display: true,
          color: 'rgba(156, 163, 175, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
            weight: 500,
            family: 'Montserrat, sans-serif'
          },
          padding: 8
        },
        beginAtZero: true
      }
    }
  };

  constructor() {
    this.rebuildChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['values'] || changes['labels'] || changes['lineColor'] ||
      changes['fillFrom'] || changes['fillMid'] || changes['fillTo'] ||
      changes['borderWidth'] || changes['pointRadius'] || changes['pointHoverRadius'] ||
      changes['datasetLabel'] || changes['showLegend']
    ) {
      // Atualiza opções dependentes
      this.lineChartOptions = {
        ...this.lineChartOptions,
        plugins: {
          ...this.lineChartOptions.plugins,
          legend: { ...(this.lineChartOptions.plugins?.legend || {}), display: this.showLegend },
          tooltip: { ...(this.lineChartOptions.plugins?.tooltip || {}), borderColor: this.lineColor }
        }
      };
      this.rebuildChartData();
    }
  }

  private rebuildChartData(): void {
    const defaultLabels = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    const defaultValues = [65, 59, 80, 81, 56, 45, 50, 60, 70, 75, 68, 72];

    const labels = this.labels && this.labels.length ? this.labels : defaultLabels;
    const data = this.values && this.values.length ? this.values : defaultValues;

    this.lineChartData = {
      labels,
      datasets: [
        {
          data,
          label: this.datasetLabel,
          borderColor: this.lineColor,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, this.fillFrom);
            gradient.addColorStop(0.5, this.fillMid);
            gradient.addColorStop(1, this.fillTo);
            return gradient;
          },
          fill: true,
          tension: 0.4,
          borderWidth: this.borderWidth,
          pointRadius: this.pointRadius,
          pointHoverRadius: this.pointHoverRadius,
          pointBackgroundColor: this.lineColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: this.lineColor,
          pointHoverBorderWidth: 3
        }
      ]
    };
  }
}
