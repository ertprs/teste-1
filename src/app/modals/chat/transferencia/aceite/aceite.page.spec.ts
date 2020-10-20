import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AceitePage } from './aceite.page';

describe('AceitePage', () => {
  let component: AceitePage;
  let fixture: ComponentFixture<AceitePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceitePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AceitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
