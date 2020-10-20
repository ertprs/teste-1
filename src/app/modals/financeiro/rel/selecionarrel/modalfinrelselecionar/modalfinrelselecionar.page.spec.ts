import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfinrelselecionarPage } from './modalfinrelselecionar.page';

describe('ModalfinrelselecionarPage', () => {
  let component: ModalfinrelselecionarPage;
  let fixture: ComponentFixture<ModalfinrelselecionarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfinrelselecionarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfinrelselecionarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
