import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalArquivosHomePage } from './modal-arquivos-home.page';

describe('ModalArquivosHomePage', () => {
  let component: ModalArquivosHomePage;
  let fixture: ComponentFixture<ModalArquivosHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalArquivosHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalArquivosHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
