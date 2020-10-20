import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompticketaddComponent } from './compticketadd.component';

describe('CompticketaddComponent', () => {
  let component: CompticketaddComponent;
  let fixture: ComponentFixture<CompticketaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompticketaddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompticketaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
