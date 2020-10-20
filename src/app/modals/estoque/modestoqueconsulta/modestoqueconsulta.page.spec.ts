import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModestoqueconsultaPage } from './modestoqueconsulta.page';

describe('ModestoqueconsultaPage', () => {
  let component: ModestoqueconsultaPage;
  let fixture: ComponentFixture<ModestoqueconsultaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModestoqueconsultaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModestoqueconsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
