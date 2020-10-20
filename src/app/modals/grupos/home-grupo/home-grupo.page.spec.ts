import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeGrupoPage } from './home-grupo.page';

describe('HomeGrupoPage', () => {
  let component: HomeGrupoPage;
  let fixture: ComponentFixture<HomeGrupoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeGrupoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
