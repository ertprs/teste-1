import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CasoeventoaddPage } from './casoeventoadd.page';

describe('CasoeventoaddPage', () => {
  let component: CasoeventoaddPage;
  let fixture: ComponentFixture<CasoeventoaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasoeventoaddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CasoeventoaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
