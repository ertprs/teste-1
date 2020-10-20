import { TestBed } from '@angular/core/testing';

import { DesenvolvedorserviceService } from './desenvolvedorservice.service';

describe('DesenvolvedorserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesenvolvedorserviceService = TestBed.get(DesenvolvedorserviceService);
    expect(service).toBeTruthy();
  });
});
