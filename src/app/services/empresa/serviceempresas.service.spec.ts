import { TestBed } from '@angular/core/testing';

import { ServiceempresasService } from './serviceempresas.service';

describe('ServiceempresasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceempresasService = TestBed.get(ServiceempresasService);
    expect(service).toBeTruthy();
  });
});
