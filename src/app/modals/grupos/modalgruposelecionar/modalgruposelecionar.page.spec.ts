import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalgruposelecionarPage } from './modalgruposelecionar.page';

describe('ModalgruposelecionarPage', () => {
  let component: ModalgruposelecionarPage;
  let fixture: ComponentFixture<ModalgruposelecionarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalgruposelecionarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalgruposelecionarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
