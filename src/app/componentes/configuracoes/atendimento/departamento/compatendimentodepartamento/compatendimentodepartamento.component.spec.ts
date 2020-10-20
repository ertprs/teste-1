import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompatendimentodepartamentoComponent } from './compatendimentodepartamento.component';

describe('CompatendimentodepartamentoComponent', () => {
  let component: CompatendimentodepartamentoComponent;
  let fixture: ComponentFixture<CompatendimentodepartamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatendimentodepartamentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompatendimentodepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
