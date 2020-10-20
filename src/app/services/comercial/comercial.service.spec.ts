import { TestBed } from '@angular/core/testing';

import { ComercialService } from './comercial.service';

describe('ComercialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComercialService = TestBed.get(ComercialService);
    expect(service).toBeTruthy();
  });
});
