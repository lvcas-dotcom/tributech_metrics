import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { BarraPesquisaComponent } from '../../../shared/ui/barra-pesquisa/barra-pesquisa.component';
import { CardUserComponent } from '../../../shared/ui/card-user/card-user.component';

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
  selector: 'app-employees',
  imports: [CommonModule, SidebarComponent, BarraPesquisaComponent, CardUserComponent],
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  filterBy: 'all' | 'active' | 'high-performance' | 'needs-attention' = 'all';
  
  employees: Employee[] = [
    {
      id: 1,
      nome: 'Lucas Silva',
      cargo: 'Desenvolvedor Full Stack',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['React', 'Node.js', 'TypeScript'],
      totalHours: 168,
      totalIssues: 24,
      completedIssues: 22,
      efficiency: 95,
      weeklyActivity: [8, 9, 7, 8, 9, 6, 4],
      projects: ['GEO', 'Suporte REURB'],
      onTimeDeliveries: 20,
      lateDeliveries: 2
    },
    {
      id: 2,
      nome: 'Maria Santos',
      cargo: 'Analista QA',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Testing', 'Automation', 'QA'],
      totalHours: 152,
      totalIssues: 18,
      completedIssues: 17,
      efficiency: 92,
      weeklyActivity: [7, 8, 8, 7, 9, 5, 3],
      projects: ['GEO', 'Suporte GEO'],
      onTimeDeliveries: 16,
      lateDeliveries: 1
    },
    {
      id: 3,
      nome: 'João Pereira',
      cargo: 'Desenvolvedor Backend',
      avatarUrl: '../../../../assets/person.svg',
      isActive: false,
      tags: ['Python', 'FastAPI', 'PostgreSQL'],
      totalHours: 144,
      totalIssues: 20,
      completedIssues: 18,
      efficiency: 88,
      weeklyActivity: [6, 7, 8, 7, 8, 4, 2],
      projects: ['Suporte São Vicente'],
      onTimeDeliveries: 15,
      lateDeliveries: 3
    },
    {
      id: 4,
      nome: 'Ana Costa',
      cargo: 'UX/UI Designer',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Figma', 'Design', 'Prototype'],
      totalHours: 136,
      totalIssues: 15,
      completedIssues: 14,
      efficiency: 94,
      weeklyActivity: [5, 6, 7, 6, 7, 5, 3],
      projects: ['GEO', 'Suporte REURB', 'Suporte GEO'],
      onTimeDeliveries: 13,
      lateDeliveries: 1
    },
    {
      id: 5,
      nome: 'Pedro Oliveira',
      cargo: 'DevOps Engineer',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Docker', 'Kubernetes', 'AWS'],
      totalHours: 160,
      totalIssues: 12,
      completedIssues: 11,
      efficiency: 96,
      weeklyActivity: [8, 9, 8, 9, 8, 6, 5],
      projects: ['GEO', 'Suporte São Vicente'],
      onTimeDeliveries: 11,
      lateDeliveries: 0
    },
    {
      id: 6,
      nome: 'Carla Mendes',
      cargo: 'Desenvolvedora Frontend',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Angular', 'SCSS', 'RxJS'],
      totalHours: 148,
      totalIssues: 22,
      completedIssues: 20,
      efficiency: 91,
      weeklyActivity: [7, 8, 7, 8, 8, 5, 4],
      projects: ['GEO', 'Suporte GEO'],
      onTimeDeliveries: 18,
      lateDeliveries: 2
    },
    {
      id: 7,
      nome: 'Roberto Lima',
      cargo: 'Scrum Master',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Agile', 'Scrum', 'Management'],
      totalHours: 140,
      totalIssues: 10,
      completedIssues: 10,
      efficiency: 97,
      weeklyActivity: [6, 7, 7, 6, 7, 5, 4],
      projects: ['GEO', 'Suporte REURB', 'Suporte GEO', 'Suporte São Vicente'],
      onTimeDeliveries: 10,
      lateDeliveries: 0
    },
    {
      id: 8,
      nome: 'Juliana Souza',
      cargo: 'Desenvolvedora Mobile',
      avatarUrl: '../../../../assets/person.svg',
      isActive: false,
      tags: ['Flutter', 'Dart', 'Mobile'],
      totalHours: 128,
      totalIssues: 16,
      completedIssues: 13,
      efficiency: 78,
      weeklyActivity: [5, 6, 5, 6, 6, 4, 2],
      projects: ['Suporte REURB'],
      onTimeDeliveries: 10,
      lateDeliveries: 3
    },
    {
      id: 9,
      nome: 'Rafael Almeida',
      cargo: 'Arquiteto de Software',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Architecture', 'Design Patterns', 'Microservices'],
      totalHours: 156,
      totalIssues: 14,
      completedIssues: 13,
      efficiency: 93,
      weeklyActivity: [7, 8, 8, 7, 8, 6, 4],
      projects: ['GEO', 'Suporte GEO'],
      onTimeDeliveries: 12,
      lateDeliveries: 1
    },
    {
      id: 10,
      nome: 'Fernanda Rocha',
      cargo: 'Analista de Dados',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Python', 'Analytics', 'SQL'],
      totalHours: 132,
      totalIssues: 11,
      completedIssues: 10,
      efficiency: 89,
      weeklyActivity: [6, 6, 7, 6, 7, 4, 3],
      projects: ['GEO'],
      onTimeDeliveries: 9,
      lateDeliveries: 1
    },
    {
      id: 11,
      nome: 'Thiago Santos',
      cargo: 'Desenvolvedor Backend',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Java', 'Spring Boot', 'Redis'],
      totalHours: 112,
      totalIssues: 19,
      completedIssues: 12,
      efficiency: 65,
      weeklyActivity: [4, 5, 5, 4, 6, 3, 2],
      projects: ['Suporte São Vicente'],
      onTimeDeliveries: 8,
      lateDeliveries: 4
    },
    {
      id: 12,
      nome: 'Beatriz Ferreira',
      cargo: 'Product Owner',
      avatarUrl: '../../../../assets/person.svg',
      isActive: true,
      tags: ['Product', 'Strategy', 'Roadmap'],
      totalHours: 144,
      totalIssues: 8,
      completedIssues: 8,
      efficiency: 98,
      weeklyActivity: [7, 7, 7, 7, 7, 5, 4],
      projects: ['GEO', 'Suporte REURB'],
      onTimeDeliveries: 8,
      lateDeliveries: 0
    }
  ];

  filteredEmployees: Employee[] = [];
  totalEmployees: number = 0;
  totalHours: number = 0;
  avgEfficiency: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculateStats();
    this.applyFilter();
  }

  calculateStats(): void {
    this.totalEmployees = this.employees.length;
    this.totalHours = this.employees.reduce((sum, emp) => sum + emp.totalHours, 0);
    const totalEfficiency = this.employees.reduce((sum, emp) => sum + emp.efficiency, 0);
    this.avgEfficiency = Math.round(totalEfficiency / this.employees.length);
  }

  setFilter(filter: 'all' | 'active' | 'high-performance' | 'needs-attention'): void {
    this.filterBy = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    switch (this.filterBy) {
      case 'all':
        this.filteredEmployees = [...this.employees];
        break;
      case 'active':
        this.filteredEmployees = this.employees.filter(emp => emp.isActive);
        break;
      case 'high-performance':
        this.filteredEmployees = this.employees.filter(emp => emp.efficiency >= 90);
        break;
      case 'needs-attention':
        this.filteredEmployees = this.employees.filter(emp => emp.efficiency < 70);
        break;
    }
  }

  viewDetails(employee: Employee): void {
    this.router.navigate(['/employee/data', employee.nome.toLowerCase().replace(' ', '.')]);
  }

  getMaxActivity(activities: number[]): number {
    return Math.max(...activities, 1);
  }

  getCurrentDayIndex(): number {
    return new Date().getDay();
  }
}
