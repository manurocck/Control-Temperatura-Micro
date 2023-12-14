import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentiladorComponent } from './ventilador.component';

describe('VentiladorComponent', () => {
  let component: VentiladorComponent;
  let fixture: ComponentFixture<VentiladorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentiladorComponent]
    });
    fixture = TestBed.createComponent(VentiladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
