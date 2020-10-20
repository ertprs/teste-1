import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashviewPage } from './dashview.page';

describe('DashviewPage', () => {
  let component: DashviewPage;
  let fixture: ComponentFixture<DashviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
