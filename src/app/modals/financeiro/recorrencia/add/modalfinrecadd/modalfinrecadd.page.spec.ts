import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfinrecaddPage } from './modalfinrecadd.page';

describe('ModalfinrecaddPage', () => {
  let component: ModalfinrecaddPage;
  let fixture: ComponentFixture<ModalfinrecaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfinrecaddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfinrecaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
