import { ProcessosService } from 'src/app/services/design/processos.service';
import { ServAtendimentoDepartamentoService } from './../../../../../services/configuracoes/atendimento/departamento/serv-atendimento-departamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-compatendimentodepartamento',
  templateUrl: './compatendimentodepartamento.component.html',
  styleUrls: ['./compatendimentodepartamento.component.scss'],
})
export class CompatendimentodepartamentoComponent implements OnInit {

  @ViewChild('dadosNome',{static:false}) myInput : IonInput;

  public items = []
  public dados = {nome:''}
  
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvAtendDepartamento:ServAtendimentoDepartamentoService,
    private design:ProcessosService
  ) { }

  ngOnInit() {
   
    setTimeout(() => {
      console.log('Set Focus')
      this.myInput.setFocus()
    },250);

    this.srvAtendDepartamento.getAll().subscribe(dadosRet=>{
      console.log(dadosRet)
      this.items = dadosRet
    })
    
  
  }
  ionViewDidEnter() {
    
  }
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  addNew(){
    if(this.dados.nome.trim().length > 0)
    {

      let nomeCheck = this.dados.nome.toLocaleLowerCase();
      
      let checkCadastro = this.items.reduce( function( cur, val, index ){

        if( val.nome === nomeCheck && cur === -1 ) {
            
          return index;
        }
        return cur;
    
      }, -1 );
      if(checkCadastro === -1)
      {
        this.design.presentLoading('Gravando...')
        .then(resLoading=>{
          resLoading.present()
          
          this.srvAtendDepartamento.add(this.dados)
          .then(resAdd=>{
            this.dados.nome = '';
            this.design.presentToast(
              'Gravado com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao salvar',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss()
            this.myInput.setFocus()
          })
        })
      }
      else
      {
        this.design.presentToast(
          'Já existe um departamento com este nome cadastrado',
          'secondary',
          0,
          true
        )
      }

      
    }
  }
  delete(id:string)
  {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir departamento?',
      'Pode',
      'Nem pensar'
    ).then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present();
          this.srvAtendDepartamento.delete(id)
          .then(resDelete=>{
            this.design.presentToast(
              'Excluido com sucesso',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Houve um problema ao tentar excluir',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss();
          })
        })
      }
    })
  }

}
