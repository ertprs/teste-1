import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalnotificacaoverPage } from './modalnotificacaover.page';

describe('ModalnotificacaoverPage', () => {
  let component: ModalnotificacaoverPage;
  let fixture: ComponentFixture<ModalnotificacaoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalnotificacaoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalnotificacaoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
