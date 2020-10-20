import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MensagenscontentPage } from './mensagenscontent.page';

describe('MensagenscontentPage', () => {
  let component: MensagenscontentPage;
  let fixture: ComponentFixture<MensagenscontentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensagenscontentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MensagenscontentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
