import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesAtendimentoHomeComponent } from './comp-configuracoes-atendimento-home.component';

describe('CompConfiguracoesAtendimentoHomeComponent', () => {
  let component: CompConfiguracoesAtendimentoHomeComponent;
  let fixture: ComponentFixture<CompConfiguracoesAtendimentoHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesAtendimentoHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesAtendimentoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
