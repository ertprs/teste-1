import { Component, OnInit } from '@angular/core';
import { Itusercadastro } from 'src/app/interface/seguranca/itusercadastro';
import { Router } from '@angular/router';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AdministracaoService } from 'src/app/services/administracao/administracao.service';

@Component({
  selector: 'app-cadastronovo',
  templateUrl: './cadastronovo.page.html',
  styleUrls: ['./cadastronovo.page.scss'],
})
export class CadastronovoPage implements OnInit {

  constructor(
    private router: Router,
    private design:ProcessosService,
    private srvAdministracao:AdministracaoService
  ) { }
  public userDados: Itusercadastro = {};
  ngOnInit() {
  }

  voltar()
  {
    this.router.navigateByUrl('/login')
  }
  cadastro()
  {
    this.design.presentLoading('Enviando dados...')
    .then(resLoading=>{
      resLoading.present()
      this.srvAdministracao.addLead(this.userDados)
      .then((res)=>{
        console.log(res)
          this.design.presentToast(
            'Recebemos seu cadastro com sucesso. Em breve um consultar Lara irá entrar em contato com você.',
            'success',
            0,
            true
          )
      })
      .catch(err=>{
        console.log('********')
        console.log(err)
        this.design.presentToast(
          'Houve um problema ao receber seus dados. Tente novamente mais tarde',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        resLoading.dismiss()
        this.voltar()
      })



    })
  }

}
