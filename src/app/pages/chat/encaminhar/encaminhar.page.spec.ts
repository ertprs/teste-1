import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncaminharPage } from './encaminhar.page';

describe('EncaminharPage', () => {
  let component: EncaminharPage;
  let fixture: ComponentFixture<EncaminharPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncaminharPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncaminharPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
