import { TestBed } from '@angular/core/testing';

import { EmpresaselectService } from './empresaselect.service';

describe('EmpresaselectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpresaselectService = TestBed.get(EmpresaselectService);
    expect(service).toBeTruthy();
  });
});
