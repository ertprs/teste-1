import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectContatosPage } from './select-contatos.page';

describe('SelectContatosPage', () => {
  let component: SelectContatosPage;
  let fixture: ComponentFixture<SelectContatosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectContatosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectContatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
