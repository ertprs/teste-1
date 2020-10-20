import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalapoiowhatsappsendPage } from './modalapoiowhatsappsend.page';

describe('ModalapoiowhatsappsendPage', () => {
  let component: ModalapoiowhatsappsendPage;
  let fixture: ComponentFixture<ModalapoiowhatsappsendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalapoiowhatsappsendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalapoiowhatsappsendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
