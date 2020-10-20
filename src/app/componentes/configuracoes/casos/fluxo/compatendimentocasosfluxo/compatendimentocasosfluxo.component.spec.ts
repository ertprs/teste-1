import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompatendimentocasosfluxoComponent } from './compatendimentocasosfluxo.component';

describe('CompatendimentocasosfluxoComponent', () => {
  let component: CompatendimentocasosfluxoComponent;
  let fixture: ComponentFixture<CompatendimentocasosfluxoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatendimentocasosfluxoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompatendimentocasosfluxoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
