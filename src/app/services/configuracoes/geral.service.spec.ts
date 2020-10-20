import { TestBed } from '@angular/core/testing';

import { GeralService } from './geral.service';

describe('GeralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeralService = TestBed.get(GeralService);
    expect(service).toBeTruthy();
  });
});
