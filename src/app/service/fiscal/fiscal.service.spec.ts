import { TestBed } from '@angular/core/testing';

import { FiscalService } from './fiscal.service';

describe('FiscalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiscalService = TestBed.get(FiscalService);
    expect(service).toBeTruthy();
  });
});
