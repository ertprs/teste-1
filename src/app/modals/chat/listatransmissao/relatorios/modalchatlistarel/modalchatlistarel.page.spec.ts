import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalchatlistarelPage } from './modalchatlistarel.page';

describe('ModalchatlistarelPage', () => {
  let component: ModalchatlistarelPage;
  let fixture: ComponentFixture<ModalchatlistarelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalchatlistarelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalchatlistarelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
