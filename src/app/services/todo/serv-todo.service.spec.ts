import { TestBed } from '@angular/core/testing';

import { ServTodoService } from './serv-todo.service';

describe('ServTodoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServTodoService = TestBed.get(ServTodoService);
    expect(service).toBeTruthy();
  });
});
