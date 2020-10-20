import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalComercialDashDetNegociandoPage } from './modal-comercial-dash-det-negociando.page';

describe('ModalComercialDashDetNegociandoPage', () => {
  let component: ModalComercialDashDetNegociandoPage;
  let fixture: ComponentFixture<ModalComercialDashDetNegociandoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComercialDashDetNegociandoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComercialDashDetNegociandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
