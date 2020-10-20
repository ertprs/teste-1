import { TestBed } from '@angular/core/testing';

import { ProvEmitterEventService } from './prov-emitter-event.service';

describe('ProvEmitterEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvEmitterEventService = TestBed.get(ProvEmitterEventService);
    expect(service).toBeTruthy();
  });
});
