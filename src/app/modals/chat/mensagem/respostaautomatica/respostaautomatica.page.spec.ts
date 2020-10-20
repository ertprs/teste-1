import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RespostaautomaticaPage } from './respostaautomatica.page';

describe('RespostaautomaticaPage', () => {
  let component: RespostaautomaticaPage;
  let fixture: ComponentFixture<RespostaautomaticaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespostaautomaticaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RespostaautomaticaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
