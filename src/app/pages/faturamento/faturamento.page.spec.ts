import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaturamentoPage } from './faturamento.page';

describe('FaturamentoPage', () => {
  let component: FaturamentoPage;
  let fixture: ComponentFixture<FaturamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaturamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaturamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
