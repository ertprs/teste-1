import { TestBed } from '@angular/core/testing';

import { AtendimentoService } from './atendimento.service';

describe('AtendimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtendimentoService = TestBed.get(AtendimentoService);
    expect(service).toBeTruthy();
  });
});
