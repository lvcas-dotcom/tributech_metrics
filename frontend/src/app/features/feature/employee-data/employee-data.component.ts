import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component';
import { PieGraphicComponent } from '../../../shared/ui/pie-graphic/pie-graphic.component';
import { GitLabService } from '../../data-acess/services/gitlab-service.service';
import { TableComponent } from '../../../shared/ui/table/table.component';

@Component({
  selector: 'app-employee-data',
  standalone: true,
  imports: [SidebarComponent,DataCardComponent,PieGraphicComponent,TableComponent],
  templateUrl: './employee-data.component.html',
  styleUrl: './employee-data.component.scss'
})
export class EmployeeDataComponent {
  private git = inject(GitLabService);

  goToIssue(idIssue: number) {
    window.open(this.git.getIssueUrl('suporte',idIssue), '_blank'); 
  }
}
