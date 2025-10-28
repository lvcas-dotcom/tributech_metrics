import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { BarraPesquisaComponent } from '../../../shared/ui/barra-pesquisa/barra-pesquisa.component';
import { CardUserComponent } from '../../../shared/ui/card-user/card-user.component';
import { UserService } from '../../data-acess/services/users-service.service';
import { CatalogUser } from '../../data-acess/entities/catalog-user.model';
import { ConfigurationState } from '../../state/configuration.state';
import { UserState } from '../../state/user.state';

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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    BarraPesquisaComponent, CardUserComponent
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  filterBy: 'all' | 'active' | 'high-performance' | 'needs-attention' = 'all';
  
  private stateUser = inject(UserState);
  private stateConfiguration = inject(ConfigurationState);

  $catalogUsers = this.stateUser.catalogUser();
  
  filteredEmployees: CatalogUser[] = [];
  totalEmployees: number = 0;
  totalHours: number = 0;
  avgEfficiency: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.stateUser.loadCatalogUser(this.stateConfiguration.project());
    this.calculateStats();
    this.filteredEmployees = [...this.stateUser.catalogUser()];
  }

  calculateStats(): void {
    this.totalEmployees = this.$catalogUsers.length;
    this.totalHours = this.$catalogUsers.reduce((sum, emp) => sum + emp.horas_apontadas, 0);
    const totalEfficiency = this.$catalogUsers.reduce((sum, emp) => sum + emp.horas_apontadas, 0);
    this.avgEfficiency = Math.round(totalEfficiency / this.$catalogUsers.length);
  }

  filtrar(valor: string) {
    this.filteredEmployees = this.$catalogUsers.filter(o => o.username.toLowerCase()
    .includes(valor.toLowerCase()));
  }
}