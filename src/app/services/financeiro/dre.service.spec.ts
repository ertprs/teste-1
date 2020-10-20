import { TestBed } from '@angular/core/testing';

import { DreService } from './dre.service';

describe('DreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DreService = TestBed.get(DreService);
    expect(service).toBeTruthy();
  });
});
