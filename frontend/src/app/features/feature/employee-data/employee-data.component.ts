import { Component, computed, Inject, inject, Input } from '@angular/core';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component';
import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component';
import { GitLabService } from '../../data-acess/services/gitlab-service.service';
import { TableComponent } from '../../../shared/ui/table/table.component';
import { UserState } from '../../state/user.state';
import { User } from '../../data-acess/entities/user.model';
import { ActivatedRoute } from '@angular/router';

type tableType = {
  id: number;
  title: string;
  label1?: string;
  label2?: string;
  label3?: string;
};
@Component({
  selector: 'app-employee-data',
  standalone: true,
  imports: [SidebarComponent,DataCardComponent,PieGraphicComponent,TableComponent],
  templateUrl: './employee-data.component.html',
  styleUrl: './employee-data.component.scss'
})
export class EmployeeDataComponent {
  private git = inject(GitLabService);
  private state = inject(UserState);
  private route = inject(ActivatedRoute);
  
  user$ = this.state.user;
  issue: tableType[] = [];
  goToIssue(idIssue: number) { 
    window.open(this.git.getIssueUrl('suporte',idIssue), '_blank'); 
  }

  ngOnInit(): void {
    const routeUsername = this.route.snapshot.paramMap.get('username');
    if (routeUsername) {
      this.state.loadUser(routeUsername,'suporte-geo');
    }
    
  }

  chartValues = computed(() => {
    const u = this.user$();     
    const helping = Number(u?.hours?.helpingHours ?? 0);
    const active  = Number(u?.hours?.activeHours  ?? 0);
    const sum = helping + active;
    return sum > 0 ? [helping, active] : [0,0];      
  });

  get issueCount(): string {
    return this.user$()?.issues?.length.toString() ?? '0';
  }

  get hoursRemain(): string {
    return (272 - (this.user$()?.hours?.total ?? 0)).toFixed(1).toString();
  }

  get hoursApontadas(): string {
    return (this.user$()?.hours?.total ?? 0).toFixed(1).toString();
  }

  get issuesTable(): tableType[] {
    const issues = this.user$()?.issues ?? [];
    if(issues.length === 0){
      return [{
        id: -1,
        title: 'No issues found',
        label1: 'N/A'
      }];}
    return issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        label1: issue.project,
        label2: (issue.hours?.toFixed(1).toString() ?? '0') + 'Hrs Apontadas',
        label3: issue.status ?? 'N/A'
      }));
  }

  get CountIssues(): number {
    return this.user$()?.issues?.length ?? 0;
  }
}
