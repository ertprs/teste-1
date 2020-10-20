import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopovermensagemopcaoPage } from './popovermensagemopcao.page';

describe('PopovermensagemopcaoPage', () => {
  let component: PopovermensagemopcaoPage;
  let fixture: ComponentFixture<PopovermensagemopcaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopovermensagemopcaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopovermensagemopcaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
