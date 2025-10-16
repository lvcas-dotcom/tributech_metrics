import {Component, AfterViewInit, ElementRef, OnInit, inject} from '@angular/core'
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'

import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component'

import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component'
import { RouterLink } from "@angular/router";
import { PointGraphicComponent } from '../../../shared/ui/point-graphic/point-graphic.component';
import { IssueCardComponent } from '../../../shared/ui/issue-card/issue-card.component';
import { MetricsService, HighPriorityIssue } from '../../data-acess/services/metrics.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-page',
    imports: [
      CommonModule,
      SidebarComponent,
      DataCardComponent, 
      PieGraphicComponent, 
      RouterLink, 
      PointGraphicComponent,
      IssueCardComponent
    ],
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements AfterViewInit, OnInit {
  private metricsService = inject(MetricsService);

  options = [{idkey: 2,description:'B'},
    {idkey: 3,description:'C'}
  ]

  horasFeitas: string = '22';
  horasMinimas: string = '220';
  calculoHoras: string = '-190';

  // Novos dados para os cards de issues
  issuesCreatedCount: number = 0;
  issuesCompletedBeforeDeadlineCount: number = 0;
  highPriorityIssues: HighPriorityIssue[] = [];
  selectedMonth: Date = new Date();
  loadingIssuesCreated: boolean = false;
  loadingIssuesCompleted: boolean = false;

  // Dados do gráfico
  chartData: number[] = [];
  chartLabels: string[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadIssuesData();
    this.loadHighPriorityIssues();
  }

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

  loadIssuesData(): void {
    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth() + 1;
    
    this.loadingIssuesCreated = true;
    this.metricsService.getIssuesCreatedByMonth(year, month).subscribe({
      next: (data) => {
        this.issuesCreatedCount = data.length;
        
        // Processar dados para o gráfico (agrupar por projeto)
        const projectCount: { [key: string]: number } = {};
        data.forEach((item: any) => {
          const project = item.projeto || 'Outros';
          projectCount[project] = (projectCount[project] || 0) + 1;
        });
        
        this.chartLabels = Object.keys(projectCount);
        this.chartData = Object.values(projectCount);
        
        this.loadingIssuesCreated = false;
      },
      error: (err) => {
        console.error('Erro ao carregar issues criadas:', err);
        this.loadingIssuesCreated = false;
      }
    });

    this.loadingIssuesCompleted = true;
    this.metricsService.getIssuesCompletedBeforeDeadline().subscribe({
      next: (data) => {
        this.issuesCompletedBeforeDeadlineCount = data.length;
        this.loadingIssuesCompleted = false;
      },
      error: (err) => {
        console.error('Erro ao carregar issues concluídas:', err);
        this.loadingIssuesCompleted = false;
      }
    });
  }

  loadHighPriorityIssues(): void {
    this.metricsService.getHighPriorityIssues().subscribe({
      next: (data) => {
        this.highPriorityIssues = data;
      },
      error: (err) => {
        console.error('Erro ao carregar issues de alta prioridade:', err);
      }
    });
  }

  onMonthChanged(date: Date): void {
    this.selectedMonth = date;
    this.loadIssuesData();
  }

}
