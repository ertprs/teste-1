import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompmssgautomaticaComponent } from './compmssgautomatica.component';

describe('CompmssgautomaticaComponent', () => {
  let component: CompmssgautomaticaComponent;
  let fixture: ComponentFixture<CompmssgautomaticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompmssgautomaticaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompmssgautomaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
