import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopovercontatoaddPage } from './popovercontatoadd.page';

describe('PopovercontatoaddPage', () => {
  let component: PopovercontatoaddPage;
  let fixture: ComponentFixture<PopovercontatoaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopovercontatoaddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopovercontatoaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
