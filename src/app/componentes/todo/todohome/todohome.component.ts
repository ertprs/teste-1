import { ModalnotificacaoverPage } from './../../../modals/notificacoes/modalnotificacaover/modalnotificacaover.page';
import { UserService } from 'src/app/services/global/user.service';

import { ProcessosService } from 'src/app/services/design/processos.service';
import { ServTodoService } from './../../../services/todo/serv-todo.service';
import { Ittodo } from 'src/app/interface/todo/ittodo';
import { PgTodoAddPage } from './../../../pages/todo/add/pg-todo-add/pg-todo-add.page';
import { Platform, ModalController } from '@ionic/angular';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription } from 'rxjs';
import { isBoolean } from 'util';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';
import { map } from 'rxjs/internal/operators/map';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-todohome',
  templateUrl: './todohome.component.html',
  styleUrls: ['./todohome.component.scss'],
})
export class TodohomeComponent implements OnInit {

  @Input() data: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    pager: false
  };

  @ViewChild("SlideHome", { read: ElementRef, static: true }) SlideHome: ElementRef
  public toDos = new Array<Ittodo>();
  public filtered:any[] = [];
  public todoSubscription: Subscription;
  public queryText : string = '';

  public platform:string='web';
  public comamndListaTitulo:string = 'Listar todos'
  public comamndListaValor:boolean = true;
  public notificacoes = [];
  private modalNotificacoesAberto:boolean = false;
  
  //INFORMACOES DE CASOS
  private casosItems      = []
  private casosNovo       = 0
  private casosAndamento  = 0

  private qtdAtendimentos:number = 0



  private qtdCasos = 0;
  private qtdCasosNovo:number = 0;
  private casosqtdPorcentagem1 = 0;
  private casosqtdPorcentagem2 = 0;
  private qtdCasosSemResposta = 0;
  private casosProgressColor:string = 'danger'

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private plataforma:Platform,
    public ctrlModal: ModalController,
    private serviceTodo:ServTodoService,
    private design:ProcessosService,
    public global:UserService,
    public srvAtendimento:AtendimentoService,
    private afa:AngularFireAuth
  ) { 
    this.modalNotificacoesAberto = false;
  
  }

  ngOnInit() {
    if(this.plataforma.is('hybrid'))
    {
      this.platform = 'hybrid'
    }

    //LISTAR CASOS 
    this.listarCasos()
    .then((resProcesso)=>{
  
        
        if(this.qtdCasos == 0)
        {
         
          this.casosProgressColor = 'secondary'
        }
        else
        {
          if(this.qtdCasos > 0)
          {
           
            const porcentagem = (this.qtdCasosNovo /  this.qtdCasos)*100
            this.casosqtdPorcentagem1 = porcentagem/100
            this.casosqtdPorcentagem2 = Math.round(porcentagem)
  
  
            console.log('Porcentagem de producao '+porcentagem)
            if(porcentagem <= 40 )
            {
              //QTD DE CASOS EM UM BOM NIVEL 
              this.casosProgressColor = 'success'
            }
            else if (porcentagem <= 60 )
            {
              //QTD DE CASOS EM ALERTA
              this.casosProgressColor = 'warning'
            }
            else
            {
              //MUITOS NOVOS TICKETS SEM TRATATIVA
              this.casosProgressColor = 'danger'
            }
          }
  
         
  
        }

    })
    .catch(err=>{
      console.log('Falha ao tentar listar casos')
    })

    this.qtdAtendimentos =  0 //this.global.conversas.length
   
    this.todoSubscription = this.serviceTodo.getAll().subscribe(data=>{
      

      data.forEach(elem=>{
        let checkTodo = this.toDos.reduce( function( cur, val, index ){

            if( val.id === elem.id && cur === -1 ) {
                return index;
            }
            return cur;
        
        }, -1 );

        if(checkTodo == -1)
        {
          //NAO EXISTE
          this.toDos.push(elem)
        }
      })


    
  
      this.filtered = this.toDos.filter((item) => {
        if(!item.concluido)
        {
          return item;
        }
      })
      this.filtered = this.filtered.sort(function (a, b){
        return a-b
      })

      


    })

   
  }
  async listarCasos():Promise<any>
  {
    return new Promise((resolve, reject) => {
      
      this.srvAtendimento.getCasosPorOperador(ref=>ref.where('usuarioUid','==',this.afa.auth.currentUser.uid).where('situacao','<',6)).then(dadosReturn=>[
        dadosReturn.subscribe((dados:any)=>{
          if(dados.length > 0)
          {
            this.qtdCasos = dados.length
            this.casosItems = dados
           
            dados.sort(function(a,b) {
              return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
            }).forEach(retDadosNumeros=>{
              if(retDadosNumeros["novo"] == 1)
              {
                this.qtdCasosNovo = this.qtdCasosNovo + 1
              }

              if(retDadosNumeros["qtdA"] > 0)
              {
                this.qtdCasosSemResposta = this.qtdCasosSemResposta+1
              }
            })
            
            

       
            resolve()
          }
          else
          {
            this.casosItems = []
            this.qtdCasos = 0;
          }
        })
      ])
      .then(()=>{
        //alert('aqui g '+this.qtdCasos)
        
      })
     



   
      

     
    
    })
    
    
  }
  public next(){
    this.SlideHome.nativeElement.slideNext();
  }

  public prev(){
    this.SlideHome.nativeElement.slidePrev();
  }
  determinarFiltro()
  {
    if(!this.comamndListaValor)
    {
      console.log('Apenas');
      this.comamndListaTitulo = 'Apenas a fazer';
      this.comamndListaValor = true;
      this.filtered = this.toDos.filter((item) => {
        if(!item.concluido)
        {
          return item;
        }
      })
      
    }
    else
    {
      console.log('Todos');
      this.comamndListaValor = false;
      this.comamndListaTitulo = 'Listar todos';
      this.filtered = this.toDos;
      
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

  AtualizarToogle(valor:boolean,dados:Ittodo)
  {
    dados.concluido = valor;
    if(valor)
    {
      dados.concluidoData = new Date().getTime();
    }
    else
    {
      dados.concluidoData = null
    }
    console.log(dados);
    this.serviceTodo.update(dados["id"],dados)
    
    .then(res=>{
      console.log('Tarefa marcada  ');
      if(valor)
      {
        this.design.presentToast(
          'Tarefa concluida!',
          'secondary',
          2000
        )
      }
      else
      {
        this.design.presentToast(
          'Tarefa reaberta!',
          'secondary',
          2000
        )
      }
     
      
    })
    .catch(err=>{

    })
  }
  value = false;
  toogleClick(event:any,dados:Ittodo)
  {
    this.AtualizarToogle(event.detail.checked,dados)
    console.log('Acao de toogle')
    

    
  }

  async presentModal() {

     
    const modal = await this.ctrlModal.create({
      component: PgTodoAddPage,
      showBackdrop:true,
      cssClass: 'selector-modal',
      
    });
    return await modal.present();
  }

  async presentModalEdit(dados?:Ittodo) {

    console.log('Abrir edit ');
    const modal = await this.ctrlModal.create({
      component: PgTodoAddPage,
      showBackdrop:true,
      cssClass: 'selector-modal',
      componentProps: {
        tarefaUid:dados["id"]
      },
    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados.data !== undefined)
      {
        if(dados.data.acao == 'delete')
        {
          console.log('deletar')
          let uid = dados.data.uid
          let checkTodo = this.filtered.reduce( function( cur, val, index ){

            if( val.id === uid && cur === -1 ) {
                return index;
            }
            return cur;
        
          }, -1 );
          if(checkTodo > -1)
          { 
            console.log('Deletado')
            this.filtered.splice(checkTodo,1);
          }
          else
          {
            console.log('Nao encontrado')
          }
          



        }
      }
      
    })


    return await modal.present();
  }


  async modalNewNotificacao(dados:any) {
   
    if(!this.modalNotificacoesAberto)
    {
      const modal = await this.ctrlModal.create({
        component: ModalnotificacaoverPage,
        mode: 'ios',
        showBackdrop: true,
        cssClass:'selector-modal',
        componentProps: {
         dados
        }
      });
      modal.onDidDismiss().then((dados) => {
        this.modalNotificacoesAberto = false;
        
      })
      await modal.present();
    }
    
   
    
  }

}
