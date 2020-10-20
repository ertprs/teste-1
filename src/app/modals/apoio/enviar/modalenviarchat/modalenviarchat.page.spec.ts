import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalenviarchatPage } from './modalenviarchat.page';

describe('ModalenviarchatPage', () => {
  let component: ModalenviarchatPage;
  let fixture: ComponentFixture<ModalenviarchatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalenviarchatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalenviarchatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
