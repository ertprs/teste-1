import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompconfigempresaeditComponent } from './compconfigempresaedit.component';

describe('CompconfigempresaeditComponent', () => {
  let component: CompconfigempresaeditComponent;
  let fixture: ComponentFixture<CompconfigempresaeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompconfigempresaeditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompconfigempresaeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
