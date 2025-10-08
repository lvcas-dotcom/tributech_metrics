import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-sidebar',
    imports: [RouterLink],
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
