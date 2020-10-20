import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompfinrecorrenciahomeComponent } from './compfinrecorrenciahome.component';

describe('CompfinrecorrenciahomeComponent', () => {
  let component: CompfinrecorrenciahomeComponent;
  let fixture: ComponentFixture<CompfinrecorrenciahomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompfinrecorrenciahomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompfinrecorrenciahomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
