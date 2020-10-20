import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalParceiroAddPage } from './add.page';

describe('ModalParceiroAddPage', () => {
  let component: ModalParceiroAddPage;
  let fixture: ComponentFixture<ModalParceiroAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalParceiroAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalParceiroAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
