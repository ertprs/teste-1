import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompcharellistaComponent } from './compcharellista.component';

describe('CompcharellistaComponent', () => {
  let component: CompcharellistaComponent;
  let fixture: ComponentFixture<CompcharellistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompcharellistaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompcharellistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
