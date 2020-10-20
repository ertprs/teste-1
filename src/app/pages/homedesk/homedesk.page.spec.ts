import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomedeskPage } from './homedesk.page';

describe('HomedeskPage', () => {
  let component: HomedeskPage;
  let fixture: ComponentFixture<HomedeskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomedeskPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomedeskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
