import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesUsuariosHomeComponent } from './comp-configuracoes-usuarios-home.component';

describe('CompConfiguracoesUsuariosHomeComponent', () => {
  let component: CompConfiguracoesUsuariosHomeComponent;
  let fixture: ComponentFixture<CompConfiguracoesUsuariosHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesUsuariosHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesUsuariosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
