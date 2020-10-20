import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverhomemenuPage } from './popoverhomemenu.page';

describe('PopoverhomemenuPage', () => {
  let component: PopoverhomemenuPage;
  let fixture: ComponentFixture<PopoverhomemenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverhomemenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverhomemenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
