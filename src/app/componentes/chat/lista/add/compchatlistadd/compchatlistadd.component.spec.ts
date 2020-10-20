import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompchatlistaddComponent } from './compchatlistadd.component';

describe('CompchatlistaddComponent', () => {
  let component: CompchatlistaddComponent;
  let fixture: ComponentFixture<CompchatlistaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompchatlistaddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompchatlistaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
