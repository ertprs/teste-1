import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalchatconversastartPage } from './modalchatconversastart.page';

describe('ModalchatconversastartPage', () => {
  let component: ModalchatconversastartPage;
  let fixture: ComponentFixture<ModalchatconversastartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalchatconversastartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalchatconversastartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
