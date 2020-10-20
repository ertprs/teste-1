import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompchatcontatoeditPage } from './compchatcontatoedit.page';

describe('CompchatcontatoeditPage', () => {
  let component: CompchatcontatoeditPage;
  let fixture: ComponentFixture<CompchatcontatoeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompchatcontatoeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompchatcontatoeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
