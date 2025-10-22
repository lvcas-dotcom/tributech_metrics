import { Component } from '@angular/core';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';
import { BarraPesquisaComponent } from '../../../shared/ui/barra-pesquisa/barra-pesquisa.component';
import { CardUserComponent } from '../../../shared/ui/card-user/card-user.component';

@Component({
  selector: 'app-employees',
  imports: [SidebarComponent,BarraPesquisaComponent,CardUserComponent],
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

}
