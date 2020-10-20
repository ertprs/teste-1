import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalTransmissaoDetalhePage } from './modal-transmissao-detalhe.page';

describe('ModalTransmissaoDetalhePage', () => {
  let component: ModalTransmissaoDetalhePage;
  let fixture: ComponentFixture<ModalTransmissaoDetalhePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTransmissaoDetalhePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTransmissaoDetalhePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
