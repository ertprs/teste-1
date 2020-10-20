import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopovercontatoshomeopcoesitensselecionadosPage } from './popovercontatoshomeopcoesitensselecionados.page';

describe('PopovercontatoshomeopcoesitensselecionadosPage', () => {
  let component: PopovercontatoshomeopcoesitensselecionadosPage;
  let fixture: ComponentFixture<PopovercontatoshomeopcoesitensselecionadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopovercontatoshomeopcoesitensselecionadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopovercontatoshomeopcoesitensselecionadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
