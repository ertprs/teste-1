import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalheitemPage } from './detalheitem.page';

describe('DetalheitemPage', () => {
  let component: DetalheitemPage;
  let fixture: ComponentFixture<DetalheitemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheitemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheitemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
