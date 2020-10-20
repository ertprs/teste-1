import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalcontatofiltrosPage } from './modalcontatofiltros.page';

describe('ModalcontatofiltrosPage', () => {
  let component: ModalcontatofiltrosPage;
  let fixture: ComponentFixture<ModalcontatofiltrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcontatofiltrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalcontatofiltrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
