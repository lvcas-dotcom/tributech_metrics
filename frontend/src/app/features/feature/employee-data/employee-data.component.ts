import { Component } from '@angular/core';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { DataCardComponent } from '../../../shared/ui/data-card/data-card.component';

@Component({
  selector: 'app-employee-data',
  standalone: true,
  imports: [SidebarComponent,DataCardComponent],
  templateUrl: './employee-data.component.html',
  styleUrl: './employee-data.component.scss'
})
export class EmployeeDataComponent {

}
