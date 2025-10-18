<<<<<<< HEAD
import {Component, AfterViewInit, ElementRef, inject} from '@angular/core'
=======
import {Component, AfterViewInit, ElementRef, OnInit, inject} from '@angular/core'
>>>>>>> frontend_test
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'

import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component'

import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component'
import { RouterLink } from "@angular/router";
import { PointGraphicComponent } from '../../../shared/ui/point-graphic/point-graphic.component';
<<<<<<< HEAD
import { UserState } from '../../state/user.state';
=======
import { IssueCardComponent } from '../../../shared/ui/issue-card/issue-card.component';
import { MetricsService, HighPriorityIssue } from '../../data-acess/services/metrics.service';
import { CommonModule } from '@angular/common';
>>>>>>> frontend_test

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
<<<<<<< HEAD
export class HomePageComponent implements AfterViewInit {

  private state = inject(UserState);
  users = this.state.listUsers;
  horasFeitas: string = '0';
  horasMinimas: string = (this.users.length * 220).toString();

=======
export class HomePageComponent implements AfterViewInit, OnInit {
  private metricsService = inject(MetricsService);

  options = [{idkey: 2,description:'B'},
    {idkey: 3,description:'C'}
  ]

  horasFeitas: string = '22';
  horasMinimas: string = '220';
>>>>>>> frontend_test
  calculoHoras: string = '-190';

  // Novos dados para os cards de issues
  issuesCreatedCount: number = 0;
  issuesCompletedBeforeDeadlineCount: number = 0;
  highPriorityIssues: HighPriorityIssue[] = [];
  selectedMonth: Date = new Date();
  loadingIssuesCreated: boolean = false;
  loadingIssuesCompleted: boolean = false;

  // Dados do gráfico de barras (Issues Criadas por Projeto)
  chartData: number[] = [];
  chartLabels: string[] = [];

  // Dados do gráfico de linha (Issues Concluídas antes do Prazo - Mensal)
  completedChartData: number[] = [];
  completedChartLabels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Inicializa dados de exemplo (substituídos quando API responder)
    this.initializeExampleData();
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

<<<<<<< HEAD
  ngOnInit(): void {
    this.state.loadUsers();
    console.log(this.users())
  }

  get teamHours(): string{
    
    return this.users().reduce((total, user) => total + (user.hours?.total || 0), 0).toFixed(2).toString();
=======
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

  /**
   * Inicializa dados de exemplo para apresentação dos gráficos
   * Estes dados são apenas placeholders até a API responder
   */
  private initializeExampleData(): void {
    // Exemplo para Issues Criadas no Mês por projeto
    this.chartLabels = ['Suporte', 'Desenvolvimento', 'São Vicente', 'Reurb'];
    this.chartData = [10, 22, 7, 12];
    this.issuesCreatedCount = this.chartData.reduce((acc, v) => acc + v, 0);

    // Exemplo para Issues Concluídas antes do Prazo (mensal)
    this.completedChartData = [12, 18, 15, 22, 19, 25, 28, 24, 30, 26, 20, 18];
    this.issuesCompletedBeforeDeadlineCount = this.completedChartData.reduce((acc, v) => acc + v, 0);
>>>>>>> frontend_test
  }

}
