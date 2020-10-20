import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalncmaddPage } from './modalfiscalncmadd.page';

describe('ModalfiscalncmaddPage', () => {
  let component: ModalfiscalncmaddPage;
  let fixture: ComponentFixture<ModalfiscalncmaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalncmaddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalncmaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
