import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalcofinssittributariaPage } from './modalfiscalcofinssittributaria.page';

describe('ModalfiscalcofinssittributariaPage', () => {
  let component: ModalfiscalcofinssittributariaPage;
  let fixture: ComponentFixture<ModalfiscalcofinssittributariaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalcofinssittributariaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalcofinssittributariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
