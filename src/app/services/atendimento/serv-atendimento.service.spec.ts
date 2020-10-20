import { TestBed } from '@angular/core/testing';

import { ServAtendimentoService } from './serv-atendimento.service';

describe('ServAtendimentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServAtendimentoService = TestBed.get(ServAtendimentoService);
    expect(service).toBeTruthy();
  });
});
