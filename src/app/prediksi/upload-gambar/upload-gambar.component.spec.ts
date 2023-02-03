import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGambarComponent } from './upload-gambar.component';

describe('UploadGambarComponent', () => {
  let component: UploadGambarComponent;
  let fixture: ComponentFixture<UploadGambarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadGambarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadGambarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
