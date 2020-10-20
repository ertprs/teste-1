import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { interval } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

const sourceModal = interval(1000);

@Component({
  selector: 'app-ausente',
  templateUrl: './ausente.page.html',
  styleUrls: ['./ausente.page.scss'],
})

export class AusentePage implements OnInit {
  private countdownTime : number = 60;
  private timer : any;
  private currentUser : any;

  constructor(
    private modal : ModalController,
    private auth : AuthService,
    private fire : AngularFireAuth
  ) { 
  }

  ngOnInit() {
    this.currentUser = this.fire.auth.currentUser;
    //console.log(this.currentUser);
    this.startLogout();
  }

  ngOnDestroy(){
    //this.timer.unsubscribe()
  }

  startLogout(){
    this.timer = sourceModal.subscribe(() => {
      this.countdownTime--;
      if (this.countdownTime == 0) {
        console.log('$$$$$$$')
        this.modal.dismiss({acao:'logout'})
      }
    });
  }

  closeModal(){
    //this.timer.unsubscribe()
    //this.modal.dismiss();
  }

  logout(){
    //this.timer.unsubscribe();
    //this.modal.dismiss();
    //this.auth.logout();
  }
}
