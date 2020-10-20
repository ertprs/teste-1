import { NavController } from '@ionic/angular';
import { ComercialService } from './../../../services/comercial/comercial.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ContatosService } from './../../../services/chat/contatos.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ConversasService } from 'src/app/services/chat/conversas.service';

import { Pedidos } from 'src/app/interface/comercial/pedidos';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
})
export class ContatosPage implements OnInit {


  public items = new Array<Contatos>();
  private itemsSubscription: Subscription;
  public filtered:any[] = [];
  private pedidoUid: string = null;
  public dadosPedido: Pedidos = {};
  public queryText : string = '';

  


  constructor(
    private contatoService:ContatosService,
    private design:ProcessosService,
    private router:Router,
    private conversasService:ConversasService,
    private afa:AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private comercialService:ComercialService,
    private navCtrl:NavController,
    private eventEmitterService : ProvEmitterEventService
  ) {

    try
    {

      this.pedidoUid = this.activatedRoute.snapshot.params['pedidoUid']; 
      
      console.log(this.itemsSubscription)
    }
    catch(err)
    {
      this.design.presentToast(
        err,
        'danger',
        3000
      )
      this.router.navigate(['/empresaselect'])
    }
  }

  ngOnInit() {
    this.itemsSubscription = this.contatoService.getAll().subscribe(data=>{
        
      this.items = data;
      this.filtered = this.items;
    });
    
  }

  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
  
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async selecionar(
  
    tipo:number,
    dadosContato:Contatos
  )
  {
    
    if(tipo==1)
    { 
      await this.design.presentLoading('Vinculando...')
      .then((resLoading)=>{
        console.log(dadosContato);
        resLoading.present();
        
        this.dadosPedido.contatoUid = dadosContato.id;
        this.dadosPedido.contatoNome = dadosContato.nome;
        this.dadosPedido.clienteUid = dadosContato.uidClienteVinculado;
        this.dadosPedido.clienteNome = dadosContato.nomeClienteVinculado;

        this.comercialService.update(this.pedidoUid,this.dadosPedido)
        .then((res)=>{
          this.design.presentToast(
            'Vinculado com sucesso.',
            'success',
            3000
          )
          this.router.navigate(['/comercial/add/'+this.pedidoUid])
        })
        .catch((err)=>{
          console.log('[Err]'+err)
          this.design.presentToast(
            'Falha ao vincular contato ao pedido ',
            'danger',
            4000
          )
        })
        .finally(()=>{
          resLoading.dismiss();
        })
      })
      
    }
    //else if(this.pedidoUid)
    //{

    //}
    else
    {
      this.design.presentToast(
        'Não foi identificado uma origem de seleção',
        'warning',
        4000
      )
      //DIrecionar para pagina 
    
      //this.router.navigate(['/chat/contatos/add/'+dadosContato.id])
    }
  }

  getRandomColor2() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  
  Destroy(){
   // this.itemsSubscription.unsubscribe();
   // this.items = new Array<Contatos>();
  }

  sendMail(emailFrom:string)
  {
    
  }


  //COMENTARIO PARA REMOVER 

  
  editar(uid:string)
  {
    this.router.navigate(['/chat/contatos/add/'+uid]);
  }

  async startConversa(dadosContato:any) {
    
    try {
      const result = await this.conversasService.startChat(dadosContato);
      if(result.situacao === 'suc') {
        this.router.navigate([`/chat/mensagens/${dadosContato.id}`], { queryParams: {idconversa: result.id,assumirAtendimento:true}});
      } else {
        console.log(result.msg);  
      }
    } catch(err) {
      console.log('startConversa err:'+err.message);   
    }
  }

  contatoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.items; // Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.items.filter((item) => {
        for (let i = 0; i < item.nome.length; i++) {
          let contatoNome = item.nome;
          let contatoEmpresa = item.nomeClienteVinculado || '';
          let contatoOrigem = item.origem;
          contatoOrigem = contatoOrigem + "";
        
          if (contatoNome.toUpperCase().indexOf(filter) > -1 || contatoEmpresa.toUpperCase().indexOf(filter) > -1 || contatoOrigem.indexOf(filter) > -1) {
            return item.nome;
          }
        }
      })
    }
  }

}
