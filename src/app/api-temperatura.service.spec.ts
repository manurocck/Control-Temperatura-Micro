import { TestBed } from '@angular/core/testing';

import { ApiTemperaturaService } from './api-temperatura.service';

describe('ApiTemperaturaService', () => {
  let service: ApiTemperaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTemperaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
