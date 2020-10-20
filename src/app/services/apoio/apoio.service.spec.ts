import { TestBed } from '@angular/core/testing';

import { ApoioService } from './apoio.service';

describe('ApoioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApoioService = TestBed.get(ApoioService);
    expect(service).toBeTruthy();
  });
});
