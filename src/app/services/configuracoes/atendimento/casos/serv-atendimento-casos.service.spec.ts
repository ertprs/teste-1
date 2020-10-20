import { TestBed } from '@angular/core/testing';

import { ServAtendimentoCasosService } from './serv-atendimento-casos.service';

describe('ServAtendimentoCasosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServAtendimentoCasosService = TestBed.get(ServAtendimentoCasosService);
    expect(service).toBeTruthy();
  });
});
