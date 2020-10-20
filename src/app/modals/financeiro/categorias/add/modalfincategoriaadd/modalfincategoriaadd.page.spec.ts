import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfincategoriaaddPage } from './modalfincategoriaadd.page';

describe('ModalfincategoriaaddPage', () => {
  let component: ModalfincategoriaaddPage;
  let fixture: ComponentFixture<ModalfincategoriaaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfincategoriaaddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfincategoriaaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
