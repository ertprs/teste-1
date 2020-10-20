import { UsuariosService } from './../../../services/seguranca/usuarios.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Itconfusuario } from 'src/app/interface/configuracoes/usuario/itconfusuario';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {


  public usuarios = new Array<Itconfusuario>();
  private itemsUsuarios: Subscription;



  constructor(
    private design:ProcessosService,
    private usuariosService:UsuariosService
  ) { }

  ngOnInit() {

    this.itemsUsuarios = this.usuariosService.getUserEmpresaAll().subscribe(data=>{
        
      this.usuarios = data;
    })
  }
  ngOnDestroy(){
    this.itemsUsuarios.unsubscribe();

  }

  async userDelete(userUid:string) {
    
    console.log(userUid);
    await this.design.presentAlertConfirm(
      'Confirmação',
      'Deseja mesmo deletar esse usuário?'
    ).then(async (res) => {
      if(res) {
        await this.design.presentLoading('Deletando usuário').then( resloading => {
          resloading.present();
          this.usuariosService.userDelete(userUid).then(resp=>{
            resloading.dismiss();
            if(resp)
            {
              this.design.presentToast(
                'Deletado com sucesso',
                'success',
                4000
              )
            }
            else
            {
              this.design.presentToast(
                'Falha ao deletar usuário',
                'danger',
                4000
              )
            }
          })
          .catch((err)=>{
            resloading.dismiss();
            console.log(err);
            this.design.presentToast(
              'Problemas ao criar usuario '+JSON.stringify(err),
              'danger',
              4000
            )
          })
          .finally(()=>{
            resloading.dismiss()
          });
        });
      } else {
        console.log('Return false ')
      }
    }).catch((err) => {
      console.log('Erro no alert confirm '+err);
    });
  }

}
