import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TelegramPage } from './telegram.page';

describe('TelegramPage', () => {
  let component: TelegramPage;
  let fixture: ComponentFixture<TelegramPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelegramPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TelegramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
