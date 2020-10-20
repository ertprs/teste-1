import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopovergerenciadorarquivosPage } from './popovergerenciadorarquivos.page';

describe('PopovergerenciadorarquivosPage', () => {
  let component: PopovergerenciadorarquivosPage;
  let fixture: ComponentFixture<PopovergerenciadorarquivosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopovergerenciadorarquivosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopovergerenciadorarquivosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
