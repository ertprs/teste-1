import { TestBed } from '@angular/core/testing';

import { ServrelatoriosService } from './servrelatorios.service';

describe('ServrelatoriosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServrelatoriosService = TestBed.get(ServrelatoriosService);
    expect(service).toBeTruthy();
  });
});
