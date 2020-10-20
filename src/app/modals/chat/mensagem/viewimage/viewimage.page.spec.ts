import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewimagePage } from './viewimage.page';

describe('ViewimagePage', () => {
  let component: ViewimagePage;
  let fixture: ComponentFixture<ViewimagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewimagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewimagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
