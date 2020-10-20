import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalContatoImportPage } from './modal-contato-import.page';

describe('ModalContatoImportPage', () => {
  let component: ModalContatoImportPage;
  let fixture: ComponentFixture<ModalContatoImportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContatoImportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalContatoImportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
