import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesProdutoAddComponent } from './comp-configuracoes-produto-add.component';

describe('CompConfiguracoesProdutoAddComponent', () => {
  let component: CompConfiguracoesProdutoAddComponent;
  let fixture: ComponentFixture<CompConfiguracoesProdutoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesProdutoAddComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesProdutoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
