import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompatendimentodetalheComponent } from './compatendimentodetalhe.component';

describe('CompatendimentodetalheComponent', () => {
  let component: CompatendimentodetalheComponent;
  let fixture: ComponentFixture<CompatendimentodetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatendimentodetalheComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompatendimentodetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
