import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesUsuariosAddComponent } from './comp-configuracoes-usuarios-add.component';

describe('CompConfiguracoesUsuariosAddComponent', () => {
  let component: CompConfiguracoesUsuariosAddComponent;
  let fixture: ComponentFixture<CompConfiguracoesUsuariosAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesUsuariosAddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesUsuariosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
