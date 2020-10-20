import { TestBed } from '@angular/core/testing';

import { CondpagamentoService } from './condpagamento.service';

describe('CondpagamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CondpagamentoService = TestBed.get(CondpagamentoService);
    expect(service).toBeTruthy();
  });
});
