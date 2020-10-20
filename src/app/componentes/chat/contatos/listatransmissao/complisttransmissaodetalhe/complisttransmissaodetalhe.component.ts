import { LoadingController } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { QueryFn } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-complisttransmissaodetalhe',
  templateUrl: './complisttransmissaodetalhe.component.html',
  styleUrls: ['./complisttransmissaodetalhe.component.scss'],
})
export class ComplisttransmissaodetalheComponent implements OnInit {
  
  @Input() data: any;
  public dashQtdContatos:number;
  public dashQtdProcessos:number;
  public dadosLista = {id:'',nome:'',canal:'lista',canalFiltro:'',cidade:'',estado:'',grupo:'',subgrupo:'',origem:new Date().getTime().toString(),contatosVinculados:{} } 
  public itens = [];
  public queryStr:QueryFn;

  public startAfter:any;

  public criarNovo:boolean;
  public listaGrupos = [];
  public listCidades = [];
  public listEstado  = [];

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvContato:ContatosService,
    private design:ProcessosService,
    private ctrlLoading:LoadingController
  ) { 
   
  }

  ngOnInit() {
    console.log(this.data)
    if(this.data)
    {
      //DETALHES DOS FILTroS
      this.dadosLista.canalFiltro = this.data.canalFiltro
      this.dadosLista.nome = this.data.nome;
      this.dadosLista.id = this.data.id
      this.dadosLista.cidade = this.data.cidade
      this.dadosLista.estado = this.data.estado
      this.dadosLista.grupo = this.data.grupo
      this.dadosLista.subgrupo = this.data.subgrupo

      //CONTADORES
      this.dashQtdContatos  = 0;
      this.dashQtdProcessos = 0;
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
  async listarGrupos(){
    
    (await this.srvContato.Select()).get().forEach(dados=>{
      if(!dados.empty)
      {
        dados.forEach(item=>{
          const data  = item.data();

          let checkGroup = this.listaGrupos.reduce(( cur, val, index ) => {

            if( val.grupo === data.grupo  && cur === -1 ) {
                
              return index;
            }
            return cur;
        
          }, -1 );
          if(checkGroup == -1)
          {
            this.listaGrupos.push(data)
          }


       



        })
      }
    })
  }
  salvarLista(){
    if(this.dadosLista.nome.trim() == '')
    {
      this.design.presentToast(
        'Informe um nome  para a lista',
        'warning',
        0,
        true
      )
    }
    else
    {
      this.design.presentLoading('Aguarde...')
      .then(resLoading=>{
        resLoading.present();
        delete this.dadosLista.id;
        this.srvContato.add(this.dadosLista)
        .then(resAdd=>{

          this.design.presentToast(
            'Filtro de listas criado com sucesso',
            'success',
            3000
          )
          this.functionExecute('CompchatrelatoriosComponent',{});
        })
        .catch(err=>{
          console.log(err)
            this.design.presentToast(
              'Falha ao gravar lista ',
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
  }
  ngAfterViewInit(){
    
   if(this.data)
    {
      let filtros = [];
      
      if(this.dadosLista.canalFiltro != 'todos')
      {
        filtros.push({campo:'canal',condicao:'==',valor:this.dadosLista.canalFiltro})
      }
      if(this.dadosLista.grupo != 'todos')
      {
        filtros.push({campo:'grupo',condicao:'==',valor:this.dadosLista.grupo})
      }
      if(this.dadosLista.subgrupo != 'todos')
      {
        filtros.push({campo:'subgrupo',condicao:'==',valor:this.dadosLista.subgrupo})
      }
      if(this.dadosLista.cidade != 'todos')
      {
        filtros.push({campo:'cidade',condicao:'==',valor:this.dadosLista.cidade})
      }
      if(this.dadosLista.estado != 'todos')
      {
        filtros.push({campo:'estado',condicao:'==',valor:this.dadosLista.estado})
      }
      
      console.log(filtros)

      this.queryStr = ref=>{
        let qr  : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        filtros.forEach(elem=>{
          qr = qr.where(elem.campo,elem.condicao,elem.valor)
        })
        //qr.orderBy('nome','asc')
        if(this.startAfter)
        { 
          qr.startAfter(this.startAfter)
        }
        qr.limit(1)
        return qr
      };
    
      this.listarItens();
    }
    
  
    
  

  }
  filtrar()
  {
    let filtros = [];
    if(this.dadosLista.canalFiltro != 'todos')
    {

      filtros.push({campo:'canal',condicao:'==',valor:this.dadosLista.canalFiltro})
      if(this.dadosLista.canalFiltro == 'whatsapp')
      {
        //PEGAR APENAS CONTTOS VALIDOS
        filtros.push({campo:'situacao',condicao:'<',valor:3})
      }
    }
    if(this.dadosLista.grupo != 'todos')
    {
      filtros.push({campo:'grupo',condicao:'==',valor:this.dadosLista.grupo})
    }
    if(this.dadosLista.subgrupo != 'todos')
    {
      filtros.push({campo:'subgrupo',condicao:'==',valor:this.dadosLista.subgrupo})
    }
    if(this.dadosLista.cidade != 'todos')
    {
      filtros.push({campo:'cidade',condicao:'==',valor:this.dadosLista.cidade})
    }
    if(this.dadosLista.estado != 'todos')
    {
      filtros.push({campo:'estado',condicao:'==',valor:this.dadosLista.estado})
    }

    console.log(filtros)

    this.queryStr = ref=>{
      let qr  : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      filtros.forEach(elem=>{
        qr = qr.where(elem.campo,elem.condicao,elem.valor)
      })
      //qr.orderBy('nome','asc')
      if(this.startAfter)
      { 
        qr.startAfter(this.startAfter)
      }
      qr.limit(1)
      return qr
    };
  
    this.listarItens();
  }
  listarItens()
  {
    this.itens = [];
    this.design.presentLoading(
      'Gerando filtro...'
    )
    .then(resLoading=>{
      resLoading.present();
      this.srvContato.Select(this.queryStr).then(returnDados=>{
      
 
        returnDados.get().forEach(dados=>{
         
          if(!dados.empty)
          {
            this.dashQtdContatos = dados.size
            dados.forEach(elem=>{
              let id = elem.id;
              let data = elem.data();
              let item = {id,...data}
              this.itens.push(item)
            })

            resLoading.dismiss();
          }
          else
          {
            resLoading.dismiss();
          }
        })
        
        
     
      })
      .catch(err=>{
        console.log(err)
        this.ctrlLoading.dismiss();
        this.criarNovo = true;
        this.dadosLista.nome = '';
        this.dadosLista.canalFiltro = 'todos';
        this.dadosLista.cidade = 'todos';
        this.dadosLista.estado = 'todos';
        this.dadosLista.grupo = 'todos';
        this.dadosLista.subgrupo = 'todos';

        this.listarGrupos();
      })
      .finally(()=>{
       
      })
    })
    
  } 
  
}
