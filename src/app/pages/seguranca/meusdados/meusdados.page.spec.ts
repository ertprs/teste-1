import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeusdadosPage } from './meusdados.page';

describe('MeusdadosPage', () => {
  let component: MeusdadosPage;
  let fixture: ComponentFixture<MeusdadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeusdadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeusdadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
