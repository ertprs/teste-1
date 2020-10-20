import { Component, OnInit } from '@angular/core';

import { UsuariosService } from './../../../services/seguranca/usuarios.service';
import { UserService } from './../../../services/global/user.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meusdados',
  templateUrl: './meusdados.page.html',
  styleUrls: ['./meusdados.page.scss'],
})
export class MeusdadosPage implements OnInit {

  private currentUser:any;
  private userSubscription: Subscription = new Subscription;

  constructor(
    private design:ProcessosService,
    private globalUser:UserService,
    private authService:AuthService,
    private usuariosService:UsuariosService
  ) { 
    
  }

  ngOnInit() {
  
      this.currentUser = this.globalUser.dadosLogado;      
   
  }

  async userUpdate() {

    console.log(this.currentUser);

    await this.design.presentLoading('Atualizando dados').then( resloading => {
    resloading.present();
      this.authService.updateProfile(this.currentUser.nome).then(resp=>{
        this.usuariosService.newUserUpdate({nome:this.currentUser.nome,uid:this.currentUser.uid}).then(resp2=>{
          resloading.dismiss();
          this.design.presentToast(
            'Atualizado com sucesso',
            'success',
            4000
          )
        }).catch((err) => {
          resloading.dismiss();
          console.log(err);
          this.design.presentToast(
            'Problemas ao atualizar dados (2)'+JSON.stringify(err),
            'danger',
            4000
          )
        })
      }).catch((err) => {
        resloading.dismiss();
        console.log(err);
        this.design.presentToast(
          'Problemas ao atualizar dados '+JSON.stringify(err),
          'danger',
          4000
        )
      })
      .finally(()=>{
        resloading.dismiss()
      })
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

}
