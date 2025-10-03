import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';

type inputPattern = {idkey: number, description: string}
@Component({
  selector: 'dropdown-opcoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-opcoes.component.html',
  styleUrl: './dropdown-opcoes.component.scss'
})
export class DropdownOpcoesComponent<T extends inputPattern> implements OnChanges {
  @Input() existingOption?: T | null;
  @Input() options: T[] = [];
  @Output() SelectedOption = new EventEmitter<T>();
  filteredOptions: T[] = [...this.options];
  
  empyLabel: string = 'Sem dados encontrados';

  inputValue: string = '';

  showDropdown: boolean = false;
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes['options']) {
      this.filteredOptions = [...this.options];
    }
    if(changes['existingOption']){
      this.inputValue = this.existingOption ? this.existingOption.description : '';
    }
  }

  filter(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.inputValue = valor;
    this.filteredOptions = this.options.filter(o => o.description.toLowerCase().includes(valor));
    this.showDropdown = this.filteredOptions.length > 0;
  }

  selecionarOpcao(option: T) {
    this.existingOption = option;
    this.inputValue = option.description;
    this.showDropdown = false;
    this.SelectedOption.emit(option);
  }

  getLabel(objeto: T): string{
    return objeto.description;
  }

  onBlur() {
    setTimeout(() => this.showDropdown = false, 150);
  }
}

