import { TestBed } from '@angular/core/testing';

import { ServAtendimentoDepartamentoService } from './serv-atendimento-departamento.service';

describe('ServAtendimentoDepartamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServAtendimentoDepartamentoService = TestBed.get(ServAtendimentoDepartamentoService);
    expect(service).toBeTruthy();
  });
});
