import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfinapoioselecionartipoPage } from './modalfinapoioselecionartipo.page';

describe('ModalfinapoioselecionartipoPage', () => {
  let component: ModalfinapoioselecionartipoPage;
  let fixture: ComponentFixture<ModalfinapoioselecionartipoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfinapoioselecionartipoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfinapoioselecionartipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
