import { ServAtendimentoCasosService } from './../../../../../../services/configuracoes/atendimento/casos/serv-atendimento-casos.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { ServAtendimentoDepartamentoService } from 'src/app/services/configuracoes/atendimento/departamento/serv-atendimento-departamento.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

@Component({
  selector: 'app-compatendimentocasosdetalhe',
  templateUrl: './compatendimentocasosdetalhe.component.html',
  styleUrls: ['./compatendimentocasosdetalhe.component.scss'],
})
export class CompatendimentocasosdetalheComponent implements OnInit {

  //focus
  @ViewChild('dadosNome',{static:false}) myInput : IonInput;

  public items = []
  public itemsDepartamento = [];
  public dados = {nome:'',departamento:''}
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private srvCasos:ServAtendimentoCasosService,
    private srvDepartamento:ServAtendimentoDepartamentoService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      console.log('Set Focus')
      this.myInput.setFocus()
    },250);


    this.srvCasos.getAll().subscribe(dadosRet=>{
   
      this.items = dadosRet
    })

    this.srvDepartamento.getAll().subscribe(dadosRet=>{
      this.itemsDepartamento = dadosRet
    })

  }
  
  addNew(){
    if(this.dados.nome.trim().length > 0)
    {
      let departamento = this.dados.departamento.split('|')
      let departamentoUid = departamento[0].trim()
      let departamentoNome = departamento[1].trim()
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
          const dadosInsert = {
            nome:this.dados.nome.toLocaleLowerCase(),
            departamentoUid,
            departamentoNome
          }
          console.log(dadosInsert)
          this.srvCasos.add(dadosInsert)
          .then(resAdd=>{
            this.dados.nome           = '';
            
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
          this.srvCasos.delete(id)
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
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

}
