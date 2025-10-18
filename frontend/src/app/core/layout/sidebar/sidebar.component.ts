import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive,RouterModule],
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
