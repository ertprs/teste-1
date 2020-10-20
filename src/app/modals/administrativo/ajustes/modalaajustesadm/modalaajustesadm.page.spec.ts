import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalaajustesadmPage } from './modalaajustesadm.page';

describe('ModalaajustesadmPage', () => {
  let component: ModalaajustesadmPage;
  let fixture: ComponentFixture<ModalaajustesadmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalaajustesadmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalaajustesadmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
