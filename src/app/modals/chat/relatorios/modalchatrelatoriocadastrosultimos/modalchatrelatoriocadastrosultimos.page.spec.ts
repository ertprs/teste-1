import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalchatrelatoriocadastrosultimosPage } from './modalchatrelatoriocadastrosultimos.page';

describe('ModalchatrelatoriocadastrosultimosPage', () => {
  let component: ModalchatrelatoriocadastrosultimosPage;
  let fixture: ComponentFixture<ModalchatrelatoriocadastrosultimosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalchatrelatoriocadastrosultimosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalchatrelatoriocadastrosultimosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
