import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcessonegadoPage } from './acessonegado.page';

describe('AcessonegadoPage', () => {
  let component: AcessonegadoPage;
  let fixture: ComponentFixture<AcessonegadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcessonegadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcessonegadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
