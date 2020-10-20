import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompConfiguracoesProdutosHomeComponent } from './comp-configuracoes-produtos-home.component';

describe('CompConfiguracoesProdutosHomeComponent', () => {
  let component: CompConfiguracoesProdutosHomeComponent;
  let fixture: ComponentFixture<CompConfiguracoesProdutosHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompConfiguracoesProdutosHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompConfiguracoesProdutosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
