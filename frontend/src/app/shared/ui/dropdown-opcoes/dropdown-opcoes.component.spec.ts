import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownOpcoesComponent } from './dropdown-opcoes.component';

describe('DropdownOpcoesComponent', () => {
  let component: DropdownOpcoesComponent;
  let fixture: ComponentFixture<DropdownOpcoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownOpcoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownOpcoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
