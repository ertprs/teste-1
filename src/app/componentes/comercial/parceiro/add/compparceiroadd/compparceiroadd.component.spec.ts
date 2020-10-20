import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompparceiroaddComponent } from './compparceiroadd.component';

describe('CompparceiroaddComponent', () => {
  let component: CompparceiroaddComponent;
  let fixture: ComponentFixture<CompparceiroaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompparceiroaddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompparceiroaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
