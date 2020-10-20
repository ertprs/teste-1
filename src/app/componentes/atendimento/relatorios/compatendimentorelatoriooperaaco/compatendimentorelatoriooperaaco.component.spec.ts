import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompatendimentorelatoriooperaacoComponent } from './compatendimentorelatoriooperaaco.component';

describe('CompatendimentorelatoriooperaacoComponent', () => {
  let component: CompatendimentorelatoriooperaacoComponent;
  let fixture: ComponentFixture<CompatendimentorelatoriooperaacoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatendimentorelatoriooperaacoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompatendimentorelatoriooperaacoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
