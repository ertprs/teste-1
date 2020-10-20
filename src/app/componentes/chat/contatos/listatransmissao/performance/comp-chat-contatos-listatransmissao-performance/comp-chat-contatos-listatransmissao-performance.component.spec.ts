import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompChatContatosListatransmissaoPerformanceComponent } from './comp-chat-contatos-listatransmissao-performance.component';

describe('CompChatContatosListatransmissaoPerformanceComponent', () => {
  let component: CompChatContatosListatransmissaoPerformanceComponent;
  let fixture: ComponentFixture<CompChatContatosListatransmissaoPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompChatContatosListatransmissaoPerformanceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompChatContatosListatransmissaoPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
