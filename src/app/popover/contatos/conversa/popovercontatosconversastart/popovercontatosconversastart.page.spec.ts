import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopovercontatosconversastartPage } from './popovercontatosconversastart.page';

describe('PopovercontatosconversastartPage', () => {
  let component: PopovercontatosconversastartPage;
  let fixture: ComponentFixture<PopovercontatosconversastartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopovercontatosconversastartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopovercontatosconversastartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
