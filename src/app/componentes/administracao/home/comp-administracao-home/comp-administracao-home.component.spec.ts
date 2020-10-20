import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompAdministracaoHomeComponent } from './comp-administracao-home.component';

describe('CompAdministracaoHomeComponent', () => {
  let component: CompAdministracaoHomeComponent;
  let fixture: ComponentFixture<CompAdministracaoHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompAdministracaoHomeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompAdministracaoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
