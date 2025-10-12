import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointGraphicComponent } from './point-graphic.component';

describe('PointGraphicComponent', () => {
  let component: PointGraphicComponent;
  let fixture: ComponentFixture<PointGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
