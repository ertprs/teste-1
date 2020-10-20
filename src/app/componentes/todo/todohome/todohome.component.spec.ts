import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodohomeComponent } from './todohome.component';

describe('TodohomeComponent', () => {
  let component: TodohomeComponent;
  let fixture: ComponentFixture<TodohomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodohomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodohomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
