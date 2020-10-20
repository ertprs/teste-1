import { TestBed } from '@angular/core/testing';

import { ConfempresaService } from './confempresa.service';

describe('ConfempresaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfempresaService = TestBed.get(ConfempresaService);
    expect(service).toBeTruthy();
  });
});
