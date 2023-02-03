import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrediksiComponent } from './prediksi.component';

describe('PrediksiComponent', () => {
  let component: PrediksiComponent;
  let fixture: ComponentFixture<PrediksiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrediksiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrediksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
