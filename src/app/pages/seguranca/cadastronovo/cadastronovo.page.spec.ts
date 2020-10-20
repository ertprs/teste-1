import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastronovoPage } from './cadastronovo.page';

describe('CadastronovoPage', () => {
  let component: CadastronovoPage;
  let fixture: ComponentFixture<CadastronovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastronovoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastronovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
