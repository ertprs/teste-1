import { Component, OnInit } from '@angular/core';
import { Ituserrecuperar } from 'src/app/interface/seguranca/ituserrecuperar';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {


  public userDados: Ituserrecuperar = {};

  constructor(
    private designProccess:ProcessosService,
    private authService:AuthService,
    private router: Router

  ) { }

  ngOnInit() {
  }
  async recuperar(){
   
    await this.designProccess.presentLoading("Aguarde")
    .then((res)=>{
     res.present(); 
        this.authService.recuperarSenha(this.userDados)
        .then((res2)=>{
          this.authService.logout();
          res.dismiss();
            console.log('Recuperação de senha enviado para o e-mail '+this.userDados.email);
            this.designProccess.presentToast(
              'Recuperação de senha enviado para o e-mail ',
              'success',
              3000
            );
            //REGISTRAR USER NO ANALYTICS 
            
            this.router.navigate(['/login']);
        })
        .catch((err2)=>{
          this.designProccess.presentToast(
            'Problema: '+err2,
            'danger',
            3000
          );
          res.dismiss();
          console.log('Houve um problema ao tentar recuperar sua senha. Tente novamente mais tarde.'+err2);

        })
    })
    .catch((err)=>{
      console.log('ERRO '+err);
    })


  }


}
