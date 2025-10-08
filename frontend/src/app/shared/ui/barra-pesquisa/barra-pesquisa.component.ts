import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-barra-pesquisa',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './barra-pesquisa.component.html',
  styleUrl: './barra-pesquisa.component.scss'
})
export class BarraPesquisaComponent {

  valorInput: string = '';
  @Output() filtrar = new EventEmitter<string>();

  onInput(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.valorInput = valor;
    this.filtrar.emit(this.valorInput);
  }
}
