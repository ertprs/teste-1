import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalicmssittributariaPage } from './modalfiscalicmssittributaria.page';

describe('ModalfiscalicmssittributariaPage', () => {
  let component: ModalfiscalicmssittributariaPage;
  let fixture: ComponentFixture<ModalfiscalicmssittributariaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalicmssittributariaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalicmssittributariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
