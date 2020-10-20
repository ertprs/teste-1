import { TestBed } from '@angular/core/testing';

import { SrvconfemailService } from './srvconfemail.service';

describe('SrvconfemailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SrvconfemailService = TestBed.get(SrvconfemailService);
    expect(service).toBeTruthy();
  });
});
