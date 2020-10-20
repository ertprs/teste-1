import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalatfiltrosdataPage } from './modalatfiltrosdata.page';

describe('ModalatfiltrosdataPage', () => {
  let component: ModalatfiltrosdataPage;
  let fixture: ComponentFixture<ModalatfiltrosdataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalatfiltrosdataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalatfiltrosdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
