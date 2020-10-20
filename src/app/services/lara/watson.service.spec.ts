import { TestBed } from '@angular/core/testing';

import { WatsonService } from './watson.service';

describe('WatsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatsonService = TestBed.get(WatsonService);
    expect(service).toBeTruthy();
  });
});
