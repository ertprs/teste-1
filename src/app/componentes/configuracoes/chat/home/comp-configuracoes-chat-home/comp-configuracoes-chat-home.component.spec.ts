import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesChatHomeComponent } from './comp-configuracoes-chat-home.component';

describe('CompConfiguracoesChatHomeComponent', () => {
  let component: CompConfiguracoesChatHomeComponent;
  let fixture: ComponentFixture<CompConfiguracoesChatHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesChatHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesChatHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
