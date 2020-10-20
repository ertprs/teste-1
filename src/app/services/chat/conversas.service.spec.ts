import { TestBed } from '@angular/core/testing';

import { ConversasService } from './conversas.service';

describe('ConversasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConversasService = TestBed.get(ConversasService);
    expect(service).toBeTruthy();
  });
});
