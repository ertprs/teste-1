import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalapoioconsultacidadePage } from './modalapoioconsultacidade.page';

describe('ModalapoioconsultacidadePage', () => {
  let component: ModalapoioconsultacidadePage;
  let fixture: ComponentFixture<ModalapoioconsultacidadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalapoioconsultacidadePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalapoioconsultacidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
