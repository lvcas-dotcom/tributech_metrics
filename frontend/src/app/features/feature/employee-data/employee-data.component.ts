import { Component, Inject, inject, Input } from '@angular/core';
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
  
  user$ = this.state.users;
  issue: tableType[] = [];
  goToIssue(idIssue: number) { 
    window.open(this.git.getIssueUrl('suporte',idIssue), '_blank'); 
  }

  ngOnInit(): void {
    const routeUsername = this.route.snapshot.paramMap.get('username');
    if (routeUsername) {
      this.state.loadUserHours(routeUsername);
      this.state.loadUserIssues(routeUsername);
    }
    
  }

  get chartValues(): number[]{
    return [
      this.user$()?.hours?.helpingHours ?? 0,
      this.user$()?.hours?.activeHours ?? 0
    ]
  }

  get issuesTable(): tableType[] {
    return this.user$()?.issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        label1: issue.project
      })) ?? [];
  }
}
