import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesChatSmsComponent } from './comp-configuracoes-chat-sms.component';

describe('CompConfiguracoesChatSmsComponent', () => {
  let component: CompConfiguracoesChatSmsComponent;
  let fixture: ComponentFixture<CompConfiguracoesChatSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesChatSmsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesChatSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
