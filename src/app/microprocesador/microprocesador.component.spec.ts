import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroprocesadorComponent } from './microprocesador.component';

describe('MicroprocesadorComponent', () => {
  let component: MicroprocesadorComponent;
  let fixture: ComponentFixture<MicroprocesadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MicroprocesadorComponent]
    });
    fixture = TestBed.createComponent(MicroprocesadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
