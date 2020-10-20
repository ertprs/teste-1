import { TestBed } from '@angular/core/testing';

import { ServempresaService } from './servempresa.service';

describe('ServempresaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServempresaService = TestBed.get(ServempresaService);
    expect(service).toBeTruthy();
  });
});
