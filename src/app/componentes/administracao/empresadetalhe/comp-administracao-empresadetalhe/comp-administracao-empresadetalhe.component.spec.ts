import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompAdministracaoEmpresadetalheComponent } from './comp-administracao-empresadetalhe.component';

describe('CompAdministracaoEmpresadetalheComponent', () => {
  let component: CompAdministracaoEmpresadetalheComponent;
  let fixture: ComponentFixture<CompAdministracaoEmpresadetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompAdministracaoEmpresadetalheComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompAdministracaoEmpresadetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
