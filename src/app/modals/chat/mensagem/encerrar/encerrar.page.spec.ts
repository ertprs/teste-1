import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncerrarPage } from './encerrar.page';

describe('EncerrarPage', () => {
  let component: EncerrarPage;
  let fixture: ComponentFixture<EncerrarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncerrarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncerrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
