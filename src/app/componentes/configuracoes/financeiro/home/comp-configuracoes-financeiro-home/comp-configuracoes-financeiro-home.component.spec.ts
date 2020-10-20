import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesFinanceiroHomeComponent } from './comp-configuracoes-financeiro-home.component';

describe('CompConfiguracoesFinanceiroHomeComponent', () => {
  let component: CompConfiguracoesFinanceiroHomeComponent;
  let fixture: ComponentFixture<CompConfiguracoesFinanceiroHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesFinanceiroHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesFinanceiroHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
