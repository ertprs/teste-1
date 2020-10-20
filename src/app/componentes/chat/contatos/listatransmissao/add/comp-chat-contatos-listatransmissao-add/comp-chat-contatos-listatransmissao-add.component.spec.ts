import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompChatContatosListatransmissaoAddComponent } from './comp-chat-contatos-listatransmissao-add.component';

describe('CompChatContatosListatransmissaoAddComponent', () => {
  let component: CompChatContatosListatransmissaoAddComponent;
  let fixture: ComponentFixture<CompChatContatosListatransmissaoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompChatContatosListatransmissaoAddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompChatContatosListatransmissaoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
