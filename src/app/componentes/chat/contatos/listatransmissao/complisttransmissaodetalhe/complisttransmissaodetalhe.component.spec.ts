import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComplisttransmissaodetalheComponent } from './complisttransmissaodetalhe.component';

describe('ComplisttransmissaodetalheComponent', () => {
  let component: ComplisttransmissaodetalheComponent;
  let fixture: ComponentFixture<ComplisttransmissaodetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplisttransmissaodetalheComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComplisttransmissaodetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
