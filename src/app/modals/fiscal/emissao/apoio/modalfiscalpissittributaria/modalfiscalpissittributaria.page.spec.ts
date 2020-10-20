import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalpissittributariaPage } from './modalfiscalpissittributaria.page';

describe('ModalfiscalpissittributariaPage', () => {
  let component: ModalfiscalpissittributariaPage;
  let fixture: ComponentFixture<ModalfiscalpissittributariaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalpissittributariaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalpissittributariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
