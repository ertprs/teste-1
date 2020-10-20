import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { EMPRESA_MATRIZ } from 'src/environments/environment';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-popoverhomemenu',
  templateUrl: './popoverhomemenu.page.html',
  styleUrls: ['./popoverhomemenu.page.scss'],
})
export class PopoverhomemenuPage implements OnInit {

  public empresaMatriz:string = EMPRESA_MATRIZ;
  private idCliente:string = '';
 
  constructor(
    private authservice:AuthService,
    private serviceDesign:ProcessosService,
    private global:UserService,
    private popoverController:PopoverController,
    private eventEmitterService: ProvEmitterEventService,
  ) { 
    this.idCliente = this.global.dadosLogado.idCliente;
  }

  ngOnInit() {
  }

  popoverfechar()
  {
    this.popoverController.dismiss();
  }
  functionExecute(functionName:string,params:any)
  {
    this.popoverController.dismiss();
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
  
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  async logout()
  {

    await this.serviceDesign.presentAlertConfirm(
      'Confirmação',
      'Deseja sair'
    )
    .then((res)=>{
      console.log('Alert confirm OK ');
      if(res)
      {
        console.log('Return verdadeiro ')
        this.authservice.logout()
        .then((res)=>{
          
          console.log('logout com sucesso');
        })
        .catch((err)=>{
          console.log('falha ao tentar sair ');
        })
      }
      else
      {
        console.log('Return false ')
      }

    })
    .catch((err)=>{
      console.log('Erro no alert confirm '+err);
    })



    
   
  }

}
