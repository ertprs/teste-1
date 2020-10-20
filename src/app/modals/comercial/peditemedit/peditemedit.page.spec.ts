import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeditemeditPage } from './peditemedit.page';

describe('PeditemeditPage', () => {
  let component: PeditemeditPage;
  let fixture: ComponentFixture<PeditemeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeditemeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PeditemeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
