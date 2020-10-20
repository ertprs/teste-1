import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompcasosreldetalheComponent } from './compcasosreldetalhe.component';

describe('CompcasosreldetalheComponent', () => {
  let component: CompcasosreldetalheComponent;
  let fixture: ComponentFixture<CompcasosreldetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompcasosreldetalheComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompcasosreldetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
