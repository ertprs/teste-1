import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoveratdashfiltrosPage } from './popoveratdashfiltros.page';

describe('PopoveratdashfiltrosPage', () => {
  let component: PopoveratdashfiltrosPage;
  let fixture: ComponentFixture<PopoveratdashfiltrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoveratdashfiltrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoveratdashfiltrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
