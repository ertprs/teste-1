import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalpedidoenviarPage } from './modalpedidoenviar.page';

describe('ModalpedidoenviarPage', () => {
  let component: ModalpedidoenviarPage;
  let fixture: ComponentFixture<ModalpedidoenviarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalpedidoenviarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalpedidoenviarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
