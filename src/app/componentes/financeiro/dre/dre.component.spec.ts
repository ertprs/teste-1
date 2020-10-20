import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DreComponent } from './dre.component';

describe('DreComponent', () => {
  let component: DreComponent;
  let fixture: ComponentFixture<DreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DreComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
