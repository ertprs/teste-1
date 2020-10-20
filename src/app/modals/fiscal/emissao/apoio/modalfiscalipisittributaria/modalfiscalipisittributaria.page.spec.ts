import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalipisittributariaPage } from './modalfiscalipisittributaria.page';

describe('ModalfiscalipisittributariaPage', () => {
  let component: ModalfiscalipisittributariaPage;
  let fixture: ComponentFixture<ModalfiscalipisittributariaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalipisittributariaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalipisittributariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
