import { TestBed } from '@angular/core/testing';

import { NotificacoesService } from './notificacoes.service';

describe('NotificacoesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificacoesService = TestBed.get(NotificacoesService);
    expect(service).toBeTruthy();
  });
});
