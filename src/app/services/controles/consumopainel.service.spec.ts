import { TestBed } from '@angular/core/testing';

import { ConsumopainelService } from './consumopainel.service';

describe('ConsumopainelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumopainelService = TestBed.get(ConsumopainelService);
    expect(service).toBeTruthy();
  });
});
