import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvisoPage } from './aviso.page';

describe('AvisoPage', () => {
  let component: AvisoPage;
  let fixture: ComponentFixture<AvisoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
