import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalapoioemailsendPage } from './modalapoioemailsend.page';

describe('ModalapoioemailsendPage', () => {
  let component: ModalapoioemailsendPage;
  let fixture: ComponentFixture<ModalapoioemailsendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalapoioemailsendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalapoioemailsendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
