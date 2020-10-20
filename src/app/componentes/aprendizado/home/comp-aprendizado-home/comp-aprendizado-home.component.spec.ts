import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompAprendizadoHomeComponent } from './comp-aprendizado-home.component';

describe('CompAprendizadoHomeComponent', () => {
  let component: CompAprendizadoHomeComponent;
  let fixture: ComponentFixture<CompAprendizadoHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompAprendizadoHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompAprendizadoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
