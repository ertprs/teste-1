import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ModalController } from '@ionic/angular';
import { ModaluserselecionarPage } from 'src/app/modals/usuarios/modaluserselecionar/modaluserselecionar.page';
import { ModalatfiltrosdataPage } from 'src/app/modals/atendimento/filtros/modalatfiltrosdata/modalatfiltrosdata.page';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { QueryFn, AngularFirestore } from '@angular/fire/firestore';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ServrelatoriosService } from 'src/app/services/global/servrelatorios.service';

import { Subscription } from 'rxjs';
import { RespostaautomaticaPage } from 'src/app/modals/chat/mensagem/respostaautomatica/respostaautomatica.page';
import { UserService } from 'src/app/services/global/user.service';

@Component({
  selector: 'app-compatendimentorelatoriooperaaco',
  templateUrl: './compatendimentorelatoriooperaaco.component.html',
  styleUrls: ['./compatendimentorelatoriooperaaco.component.scss'],
})
export class CompatendimentorelatoriooperaacoComponent implements OnInit {

  private items = []
  public queryStr:QueryFn;
  private processoRel:Boolean = false;

  private ObservandoRel: Subscription;
  private regTotal:number = 0

  private filtroSelect = {
    createAt: new Date().getTime(),
    dataIni:null,
    dataFim:null,
    dataIniString:null,
    dataFimString:null,
    situacao:'0',
    operador:null,
    operadorUid:false
  }


  
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private ctrlModal:ModalController,
    private srvAtendimento:AtendimentoService,
    private design:ProcessosService,
    private srvRelatorios:ServrelatoriosService,
    private DB:AngularFirestore,
    private global:UserService,
  ) { }

  ngOnInit() {
  

  }
  limparUser()
  {
    this.filtroSelect.operador = null,
    this.filtroSelect.operadorUid = false
  }
  gerarRelatorio()
  {
    try
    {
      if(this.filtroSelect.dataIni === null || this.filtroSelect.dataFim === null )
      {
        this.design.presentToast(
          'Selecione um periodo antes de continuar',
          'secondary',
          0,
          true
        )
      }
      else
      {
        console.log('Gerando relatorio...')
        this.items = []
        let filtros = [];
    
        
        this.design.presentLoading('Gerando relatório...')
        .then(resLoading=>{
          resLoading.present()
          //ADICIONANDO DATA 
          filtros.push({campo:'createAt',condicao:'>=',valor:this.filtroSelect.dataIni})
          filtros.push({campo:'createAt',condicao:'<=',valor:this.filtroSelect.dataFim})
      
          if(this.filtroSelect.operadorUid)
          {
            console.log('Adicionando usuario')
            filtros.push({campo:'usuarioUid',condicao:'==',valor:this.filtroSelect.operadorUid})
          }
          if(this.filtroSelect.situacao != "0")
          { 
            filtros.push({campo:'situacao',condicao:'==',valor:Number( this.filtroSelect.situacao)})
          }
      
      
          this.queryStr = ref=>{
            let qr  : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            filtros.forEach(elem=>{
              qr = qr.where(elem.campo,elem.condicao,elem.valor)
            })
            qr.orderBy('createAt','asc')
            
            return qr
          };
          const idCliente = this.global.dadosLogado.idCliente;
          const query = this.DB.collection(idCliente).doc('chat').collection('conversas',this.queryStr).get().forEach(data=>{
            if(data.empty)
            {
              this.design.presentToast(
                'Não existem dados',
                'secondary',
                5000
              )
            }
            else
            {
              this.regTotal = data.size
              data.docs.forEach(elem=>{
                const id = elem.id
                const data = elem.data()
                const dataReturn = {
                  id,
                  ... data
                }
              
                this.items.push(dataReturn)
              })
            }
          
          })
          .finally(()=>{
            resLoading.dismiss()
          })
          
        })
        .catch((err)=>{
          console.log(err)
        })
        
    
    
    
        
      }
    }
    catch(err)
    {
      this.design.presentToast(
        'Verifique se informou os campos de filtro corretamente',
        'warning',
        0,
        true
      )
    }
   
   
  }
  gerarRelatorio2(){
    if(this.filtroSelect.dataIni === null || this.filtroSelect.dataFim === null )
    {
      this.design.presentToast(
        'Selecione um periodo antes de continuar',
        'secondary',
        0,
        true
      )
    }
    else
    {
 
      this.srvRelatorios.gerarPedidoRelatorio('relAtendimentoPosicao',this.filtroSelect)
      .then(resAdd=>{
        const idRel = resAdd.id
        this.design.presentLoading('Gerando relatório...')
        .then(resLoading=>{
          resLoading.present()
          setTimeout(() => {
            if(this.processoRel === false)
            {
           
              resLoading.dismiss()
              this.design.presentToast(
                'Falha ao gerar relatório. Tente novamente mais tarde',
                'secondary',
                5000
              )
            }
          }, 60000); //tempo de 1 minuto aguardando...

   
         this.ObservandoRel = this.srvRelatorios.getProcessoRelatorio(idRel).snapshotChanges().subscribe(dados=>{
            if(dados.payload.exists)
            {
              const data = dados.payload.data()

              if(data["situacao"] == 0)
              {
                console.log('Aguardando...')
               
                
              }
              else if(data["situacao"] == 1)
              {
                
                this.ObservandoRel.unsubscribe();
                this.processoRel = true
                resLoading.dismiss()
                const itemsRet = data["dataRel"]["items"]
                console.log(itemsRet)
                this.items = itemsRet
                this.regTotal = data["dataRel"]["total"]
              }
              else if(data["situacao"] == 3)
              {
                this.ObservandoRel.unsubscribe();
                this.processoRel = true
                resLoading.dismiss()
                this.design.presentToast(
                  'Atenção: '+data["msg"],
                  'warning',
                  0,
                  true
                )
              }
              else
              {
                this.ObservandoRel.unsubscribe();
                console.log(data["situacao"])
                resLoading.dismiss()
                this.design.presentToast(
                  'Falha ao gerar relatorio. Tente novamente mais tarde',
                  'secondary',
                  5000

                )
              }
            }
         })
          
          

        })
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao gerar relatorio',
          'danger',
          0,
          true
        )
      })
    }
   
  }
  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async abrirModalFiltroUser(origem:string)
  {
    const modal = await this.ctrlModal.create({
      component: ModaluserselecionarPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origem
      }
    });
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data.acao == 'relatorios')
        {
          this.filtroSelect.operadorUid = dados.data.usuarioUid
          this.filtroSelect.operador = dados.data.usuarioNome
          //this.filterUser = dados.data.usuarioUid
         
        }
      }
    })
    await modal.present();
  }
  async AbrirMensagensAutomaticas()
  {
  
    const modal = await this.ctrlModal.create({
      component: RespostaautomaticaPage,
      mode: 'ios',
    
      showBackdrop: true,
      
      cssClass: 'selector-modal',
      componentProps: {
     
        
      }
    });
    await modal.present();
  }
  async abrirModalFiltroData()
  {
    const modal = await this.ctrlModal.create({
      component: ModalatfiltrosdataPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origem:'homeatendimento'
      }
    });
    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        if(dados.data.acao == 'filtrar')
        {
          this.filtroSelect.dataIni = dados.data.filtro.dataIni
          this.filtroSelect.dataFim = dados.data.filtro.dataFim
          this.filtroSelect.dataIniString = dados.data.filtro.dataIniString
          this.filtroSelect.dataFimString = dados.data.filtro.dataFimString
          
          
          
       
        }
      }
    })
    await modal.present();
  }
}
