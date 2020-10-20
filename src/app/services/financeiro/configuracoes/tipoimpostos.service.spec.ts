import { TestBed } from '@angular/core/testing';

import { TipoimpostosService } from './tipoimpostos.service';

describe('TipoimpostosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoimpostosService = TestBed.get(TipoimpostosService);
    expect(service).toBeTruthy();
  });
});
