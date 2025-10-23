import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-data-card',
    imports: [],
    standalone: true,
    templateUrl: './data-card.component.html',
    styleUrl: './data-card.component.scss'
})
export class DataCardComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() imgUrl: string = '';
    @Input() label: string = 'Hrs';
}
