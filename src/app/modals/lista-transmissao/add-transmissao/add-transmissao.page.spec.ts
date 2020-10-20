import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTransmissaoPage } from './add-transmissao.page';

describe('AddTransmissaoPage', () => {
  let component: AddTransmissaoPage;
  let fixture: ComponentFixture<AddTransmissaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransmissaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTransmissaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
