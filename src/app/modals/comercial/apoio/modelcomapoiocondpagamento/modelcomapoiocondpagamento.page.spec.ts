import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModelcomapoiocondpagamentoPage } from './modelcomapoiocondpagamento.page';

describe('ModelcomapoiocondpagamentoPage', () => {
  let component: ModelcomapoiocondpagamentoPage;
  let fixture: ComponentFixture<ModelcomapoiocondpagamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelcomapoiocondpagamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModelcomapoiocondpagamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
