import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContatolivrePage } from './contatolivre.page';

describe('ContatolivrePage', () => {
  let component: ContatolivrePage;
  let fixture: ComponentFixture<ContatolivrePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContatolivrePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatolivrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
