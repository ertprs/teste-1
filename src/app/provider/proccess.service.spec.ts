import { TestBed } from '@angular/core/testing';

import { ProccessService } from './proccess.service';

describe('ProccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProccessService = TestBed.get(ProccessService);
    expect(service).toBeTruthy();
  });
});
