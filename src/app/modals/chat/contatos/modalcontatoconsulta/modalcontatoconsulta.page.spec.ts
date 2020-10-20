import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalcontatoconsultaPage } from './modalcontatoconsulta.page';

describe('ModalcontatoconsultaPage', () => {
  let component: ModalcontatoconsultaPage;
  let fixture: ComponentFixture<ModalcontatoconsultaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcontatoconsultaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalcontatoconsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
