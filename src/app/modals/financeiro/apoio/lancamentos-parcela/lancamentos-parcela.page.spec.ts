import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LancamentosParcelaPage } from './lancamentos-parcela.page';

describe('LancamentosParcelaPage', () => {
  let component: LancamentosParcelaPage;
  let fixture: ComponentFixture<LancamentosParcelaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LancamentosParcelaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentosParcelaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
