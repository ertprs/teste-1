import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PgTodoAddPage } from './pg-todo-add.page';

describe('PgTodoAddPage', () => {
  let component: PgTodoAddPage;
  let fixture: ComponentFixture<PgTodoAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgTodoAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PgTodoAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
