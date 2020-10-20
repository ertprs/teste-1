import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompatendimentocasosdetalheComponent } from './compatendimentocasosdetalhe.component';

describe('CompatendimentocasosdetalheComponent', () => {
  let component: CompatendimentocasosdetalheComponent;
  let fixture: ComponentFixture<CompatendimentocasosdetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatendimentocasosdetalheComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompatendimentocasosdetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
