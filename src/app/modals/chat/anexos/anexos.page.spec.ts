import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnexosPage } from './anexos.page';

describe('AnexosPage', () => {
  let component: AnexosPage;
  let fixture: ComponentFixture<AnexosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnexosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnexosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
