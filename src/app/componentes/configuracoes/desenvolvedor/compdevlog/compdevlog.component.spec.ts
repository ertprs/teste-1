import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompdevlogComponent } from './compdevlog.component';

describe('CompdevlogComponent', () => {
  let component: CompdevlogComponent;
  let fixture: ComponentFixture<CompdevlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompdevlogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompdevlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
