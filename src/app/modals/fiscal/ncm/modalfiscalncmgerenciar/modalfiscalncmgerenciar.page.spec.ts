import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalncmgerenciarPage } from './modalfiscalncmgerenciar.page';

describe('ModalfiscalncmgerenciarPage', () => {
  let component: ModalfiscalncmgerenciarPage;
  let fixture: ComponentFixture<ModalfiscalncmgerenciarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalncmgerenciarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalncmgerenciarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
