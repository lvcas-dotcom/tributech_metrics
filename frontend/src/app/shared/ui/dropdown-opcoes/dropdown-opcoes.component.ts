import { Component, EventEmitter, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';

type padraoDeEntrada = {idkey: number, descricao: string}
@Component({
  selector: 'app-dropdown-opcoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-opcoes.component.html',
  styleUrl: './dropdown-opcoes.component.scss'
})
export class DropdownOpcoesComponent<T extends padraoDeEntrada> implements OnChanges {
  @Input() opcaoExistente?: T | null;
  @Input() opcoes: T[] = [];
  @Output() opcaoSelecionada = new EventEmitter<T>();
  opcoesFiltradas: T[] = [...this.opcoes];
  
  valorInput: string = '';

  mostrarDropdown: boolean = false;
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes['opcoes']) {
      this.opcoesFiltradas = [...this.opcoes];
    }
    if(changes['opcaoExistente']){
      this.valorInput = this.opcaoExistente ? this.opcaoExistente.descricao : '';
    }
  }

  filtrar(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.valorInput = valor;
    this.opcoesFiltradas = this.opcoes.filter(o => o.descricao.toLowerCase().includes(valor));
    this.mostrarDropdown = this.opcoesFiltradas.length > 0;
  }

  selecionarOpcao(opcao: T) {
    this.opcaoExistente = opcao;
    this.valorInput = opcao.descricao;
    this.mostrarDropdown = false;
    this.opcaoSelecionada.emit(opcao);
  }

  getLabel(objeto: T): string{
    return objeto.descricao;
  }

  onBlur() {
    setTimeout(() => this.mostrarDropdown = false, 150);
  }
}
