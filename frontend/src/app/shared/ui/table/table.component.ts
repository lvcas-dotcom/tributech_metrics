import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Input,Output } from '@angular/core';


type typeGeneric = {
  id:number,
  title:string,
  label1?:string,
  label2?:string,
  label3?:string
};
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends typeGeneric> {
  @Input() itens: T[] = [];
  @Output() item = new EventEmitter<number>();
 
  emitItem(item:T){
    this.item.emit(item.id);
  }

}
