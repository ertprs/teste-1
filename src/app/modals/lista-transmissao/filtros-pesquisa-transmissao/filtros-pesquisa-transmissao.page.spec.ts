import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltrosPesquisaTransmissaoPage } from './filtros-pesquisa-transmissao.page';

describe('FiltrosPesquisaTransmissaoPage', () => {
  let component: FiltrosPesquisaTransmissaoPage;
  let fixture: ComponentFixture<FiltrosPesquisaTransmissaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosPesquisaTransmissaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosPesquisaTransmissaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
