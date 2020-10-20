import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiscalemissaonfePage } from './modalfiscalemissaonfe.page';

describe('ModalfiscalemissaonfePage', () => {
  let component: ModalfiscalemissaonfePage;
  let fixture: ComponentFixture<ModalfiscalemissaonfePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiscalemissaonfePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiscalemissaonfePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
