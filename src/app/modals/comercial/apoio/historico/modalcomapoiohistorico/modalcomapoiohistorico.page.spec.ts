import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalcomapoiohistoricoPage } from './modalcomapoiohistorico.page';

describe('ModalcomapoiohistoricoPage', () => {
  let component: ModalcomapoiohistoricoPage;
  let fixture: ComponentFixture<ModalcomapoiohistoricoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcomapoiohistoricoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalcomapoiohistoricoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
