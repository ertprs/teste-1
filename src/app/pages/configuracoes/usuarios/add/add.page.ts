import { UsuariosService } from './../../../../services/seguranca/usuarios.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { Itusercadastro } from 'src/app/interface/seguranca/itusercadastro';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  public userDados: Itusercadastro = {};

  constructor(
    private auth:AuthService,
    private desigin:ProcessosService,
    private usuariosService:UsuariosService,
    private router:Router,
  ) { 
  }

  ngOnInit() {
  }



  async adicionarUsuarioNew() {

    await this.desigin.presentLoading('Gerando usuario').then( resloading => {
      resloading.present();
      this.usuariosService.newUserCreate(this.userDados).then(resp=>{
        resloading.dismiss();
        if(resp) {
          this.desigin.presentToast(
            'Cadastrado com sucesso',
            'success',
            4000
          )
          
          this.router.navigate([`/configuracoes/usuarios`]);
        } else {
          this.desigin.presentToast(
            'Falha ao criar usuário',
            'danger',
            4000
          )
        }
      })
      .catch((err) => {
        resloading.dismiss();
        console.log(err);
        this.desigin.presentToast(
          'Problemas ao criar usuario '+JSON.stringify(err),
          'danger',
          4000
        )
      })
      .finally(()=>{
        resloading.dismiss()
      })
    })
  }
  
}
