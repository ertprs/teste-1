import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoveremojiPage } from './popoveremoji.page';

describe('PopoveremojiPage', () => {
  let component: PopoveremojiPage;
  let fixture: ComponentFixture<PopoveremojiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoveremojiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoveremojiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
