import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompchatrelatoriosComponent } from './compchatrelatorios.component';

describe('CompchatrelatoriosComponent', () => {
  let component: CompchatrelatoriosComponent;
  let fixture: ComponentFixture<CompchatrelatoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompchatrelatoriosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompchatrelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
