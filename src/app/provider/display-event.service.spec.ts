import { TestBed } from '@angular/core/testing';

import { DisplayEventService } from './display-event.service';

describe('DisplayEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayEventService = TestBed.get(DisplayEventService);
    expect(service).toBeTruthy();
  });
});
