import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompAtendimentoHomeComponent } from './comp-atendimento-home.component';

describe('CompAtendimentoHomeComponent', () => {
  let component: CompAtendimentoHomeComponent;
  let fixture: ComponentFixture<CompAtendimentoHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompAtendimentoHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompAtendimentoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
