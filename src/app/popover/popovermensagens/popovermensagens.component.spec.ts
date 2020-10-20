import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopovermensagensComponent } from './popovermensagens.component';

describe('PopovermensagensComponent', () => {
  let component: PopovermensagensComponent;
  let fixture: ComponentFixture<PopovermensagensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopovermensagensComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopovermensagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
