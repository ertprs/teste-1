import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConversaativalistaComponent } from './conversaativalista.component';

describe('ConversaativalistaComponent', () => {
  let component: ConversaativalistaComponent;
  let fixture: ComponentFixture<ConversaativalistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversaativalistaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversaativalistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
