import { Component } from '@angular/core';

@Component({
  selector: 'card-user',
  imports: [],
  standalone: true,
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss'
})
export class CardUserComponent {
  nome: string = 'Nome do Usuário';
}
