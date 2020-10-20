import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModelAprendizadoAddPage } from './model-aprendizado-add.page';

describe('ModelAprendizadoAddPage', () => {
  let component: ModelAprendizadoAddPage;
  let fixture: ComponentFixture<ModelAprendizadoAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelAprendizadoAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModelAprendizadoAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
