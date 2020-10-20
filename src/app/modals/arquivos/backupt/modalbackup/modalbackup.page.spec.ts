import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalbackupPage } from './modalbackup.page';

describe('ModalbackupPage', () => {
  let component: ModalbackupPage;
  let fixture: ComponentFixture<ModalbackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalbackupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalbackupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
