import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfincategoriaconsultaPage } from './modalfincategoriaconsulta.page';

describe('ModalfincategoriaconsultaPage', () => {
  let component: ModalfincategoriaconsultaPage;
  let fixture: ComponentFixture<ModalfincategoriaconsultaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfincategoriaconsultaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfincategoriaconsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
