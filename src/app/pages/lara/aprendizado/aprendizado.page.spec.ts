import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AprendizadoPage } from './aprendizado.page';

describe('AprendizadoPage', () => {
  let component: AprendizadoPage;
  let fixture: ComponentFixture<AprendizadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprendizadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AprendizadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
