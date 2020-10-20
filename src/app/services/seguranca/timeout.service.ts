import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { interval } from 'rxjs';
import { AusentePage } from 'src/app/modals/notificacoes/ausente/ausente.page';
import { GeralService } from '../configuracoes/geral.service';
import { Geral } from 'src/app/interface/configuracoes/geral';
import { UserService } from '../global/user.service';

const sourceHomeDesk = interval(1000);

var time = 0;
var timeoutInMiliseconds = 0;

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {
  private timer : any;
  private timeoutSettings : Geral;

  constructor(
    private modal : ModalController,
    private auth : AuthService,
  
    private global:UserService,
    private configInatividade:GeralService
  ) { 
    
  }

  ngOnInit(){
    this.loadTimeoutSettings();
  }

   //USER IDLE FUNCTIONS 
  start(params : any) { 

    if (params != 'logout') {
      alert(timeoutInMiliseconds)
      time = 0;
      console.log("iniciando timeout");
      this.timer = sourceHomeDesk.subscribe(val => {
        time += 1000;
        if (time == timeoutInMiliseconds) {
          this.doInative();
        }
      });
    }
  }
  
  reset() { 
    time = 0;
    this.timer.unsubscribe();
    this.start('');
  }

  close(){
    this.timer.unsubscribe();
  }
  
  async doInative(){
    console.warn("INATIVO");
    this.timer.unsubscribe();

    let modal = await this.modal.create({
      component: AusentePage,
      mode: 'ios',
      showBackdrop: true, 
      cssClass:'selector-modal',
    });

    modal.onDidDismiss().then(() => {
      this.start('logout')
    })

    await modal.present();
  }

  loadTimeoutSettings(){
   
    console.log("iniciando o timeoutsettings");
    
   
   


   
  }

}
