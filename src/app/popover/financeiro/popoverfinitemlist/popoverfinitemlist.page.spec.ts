import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverfinitemlistPage } from './popoverfinitemlist.page';

describe('PopoverfinitemlistPage', () => {
  let component: PopoverfinitemlistPage;
  let fixture: ComponentFixture<PopoverfinitemlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverfinitemlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverfinitemlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
