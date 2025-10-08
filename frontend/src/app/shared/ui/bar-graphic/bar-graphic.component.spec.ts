import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarGraphicComponent } from './bar-graphic.component';

describe('BarGraphicComponent', () => {
  let component: BarGraphicComponent;
  let fixture: ComponentFixture<BarGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
