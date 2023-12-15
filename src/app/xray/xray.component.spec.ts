import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XrayComponent } from './xray.component';

describe('XrayComponent', () => {
  let component: XrayComponent;
  let fixture: ComponentFixture<XrayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [XrayComponent]
    });
    fixture = TestBed.createComponent(XrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
