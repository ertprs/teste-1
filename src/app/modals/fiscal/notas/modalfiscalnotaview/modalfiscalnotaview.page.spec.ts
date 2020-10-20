import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalnotaviewPage } from './modalfiscalnotaview.page';

describe('ModalfiscalnotaviewPage', () => {
  let component: ModalfiscalnotaviewPage;
  let fixture: ComponentFixture<ModalfiscalnotaviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalnotaviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalnotaviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
