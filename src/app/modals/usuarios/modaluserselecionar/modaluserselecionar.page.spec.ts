import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModaluserselecionarPage } from './modaluserselecionar.page';

describe('ModaluserselecionarPage', () => {
  let component: ModaluserselecionarPage;
  let fixture: ComponentFixture<ModaluserselecionarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaluserselecionarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModaluserselecionarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
