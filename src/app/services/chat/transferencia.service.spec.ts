import { TestBed } from '@angular/core/testing';

import { TransferenciaService } from './transferencia.service';

describe('TransferenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferenciaService = TestBed.get(TransferenciaService);
    expect(service).toBeTruthy();
  });
});
