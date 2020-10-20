import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalComercialDashDetLeadsPage } from './modal-comercial-dash-det-leads.page';

describe('ModalComercialDashDetLeadsPage', () => {
  let component: ModalComercialDashDetLeadsPage;
  let fixture: ComponentFixture<ModalComercialDashDetLeadsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComercialDashDetLeadsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComercialDashDetLeadsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
