import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalchatconvhistoricobackupPage } from './modalchatconvhistoricobackup.page';

describe('ModalchatconvhistoricobackupPage', () => {
  let component: ModalchatconvhistoricobackupPage;
  let fixture: ComponentFixture<ModalchatconvhistoricobackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalchatconvhistoricobackupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalchatconvhistoricobackupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
