import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieGraphicComponent } from './pie-graphic.component';

describe('PieGraphicComponent', () => {
  let component: PieGraphicComponent;
  let fixture: ComponentFixture<PieGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
