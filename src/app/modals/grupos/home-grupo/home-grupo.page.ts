import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController } from '@ionic/angular';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { Grupos } from 'src/app/interface/chat/grupos';

@Component({
  selector: 'app-home-grupo',
  templateUrl: './home-grupo.page.html',
  styleUrls: ['./home-grupo.page.scss'],
})
export class HomeGrupoPage implements OnInit {

  @Input() origem:string

  public items = new Array<Grupos>();
  public dadosGrupo : Grupos = {};
  private currentGrupoId : string = null;
  public filtered:any[] = [];
  public queryText : string = '';
  private grupoId : string = null;

  private currentUserUid : string = null;

  private itemsSubscription: Subscription;
  public gruposSubscription : Subscription;
 
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private afa:AngularFireAuth,
    public modal:ModalController,
    private gruposService : GruposService,
  ) { }

  ngOnInit() {
    console.log('Listed contact');
    this.currentUserUid = this.afa.auth.currentUser.uid;
    this.itemsSubscription = this.gruposService.getAll().subscribe(data=>{

      this.items = data;
      this.filtered = this.items.sort(function(a,b) {
        return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
      });
      // this.filtered = this.filtered.sort((n1,n2) => {
      //   if (n1.nome > n2.nome) {
      //       return 1;
      //   }
    
      //   if (n1.nome < n2.nome) {
      //       return -1;
      //   }
    
      //   return 0;
      // })
    });
  }

  ngOnDestroy(){
    // this.gruposSubscription.unsubscribe();
  }
  selecionarItem(dados:any)
  {
    this.modal.dismiss({origem:this.origem,uid:dados.id,nome:dados.nome})
  }
  functionExecute(functionName:string,params:any)
  {
    console.log(params);
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  grupoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.items; 
      this.filtered = this.filtered.sort(function (a, b){
        return a-b
      })// Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.items.filter((item) => {
        for (let i = 0; i < item.nome.length; i++) {
          const grupoNome = item.nome;

          if (grupoNome.toUpperCase().indexOf(filter) > -1) {
            return item.nome;
          }
        }
      })
    }
  }

  async grupoAdd(grupo : string){

    this.grupoId = grupo;
    console.log(`CURRENT GRUPOID ${grupo}`);
    
    if(!this.dadosGrupo.photo || this.dadosGrupo.photo == '')
    {
      this.dadosGrupo.photo = this.generateColor();
    }

    console.log(this.dadosGrupo);

    if (this.grupoId) {

      await this.design.presentLoading('Atualizando...')
      .then((res)=>
      {
        res.present();
        this.gruposService.update(this.grupoId, this.dadosGrupo)
        .then(()=>{
          this.design.presentToast(
            'Alterado com sucesso',
            'success',
            3000
            );
            this.dadosGrupo = {};
            this.currentGrupoId = '';
        })
        .catch((err)=>{
          this.design.presentToast(
            'Falha ao atualizar grupo '+err,
            'danger',
            4000
          );
        })
        .finally(()=>{
          res.dismiss();
        });
      });

    }
    else
    {
      this.gruposService.add(this.dadosGrupo)
      .then(()=>{
        this.design.presentToast(
          'Cadastrado com sucesso!',
          'success',
          3000
        );
        this.dadosGrupo = {};
        this.currentGrupoId = '';
      })
      .catch((err)=>{
        console.log(err)
        if(err.code == 1)
        { 
          this.design.presentToast(
            err.msg,
            'warning',
            0,
            true
          );
        }
        else
        { 
          this.design.presentToast(
            'Falha ao cadastrar '+err,
            'danger',
            4000,
            true
          )
        }
      });
    }
  }

  async grupoDelete(grupo : string){

    this.grupoId = grupo;

    if (this.grupoId) {
      try {
        await this.design.presentAlertConfirm(
          'Excluir!',
          'Posso excluir esta lista?',
          "Pode!",
          "Nem pensar..."
        )
        .then((resp)=>
        {
          
          if(resp)
          {
            //OK
            this.gruposService.delete(this.grupoId)
            .then(()=>{
              this.design.presentToast(
                'Grupo deletado com sucesso ',
                'success',
                3000
              );
              // this.modal.dismiss();
            })
            .catch((err)=>{
              this.design.presentToast(
                'Falha ao deletar grupo'+err,
                'success',
                3000
              );
            });
          }
    
        })
        .catch(()=>{
    
        })
      } catch (err) {
        console.log('Falha ao registrar subscribe de contatos ');
      }

    }
    else {
      console.error('Falha ao deletar grupo');
    }
  }

  grupoEdit(grupo : string){
    this.grupoId = grupo;
    this.currentGrupoId = grupo;

    console.log(`GRUPO SELECIONADO PARA EDITAR: ${grupo}`);

    if (this.grupoId){
      try
      {
        this.gruposSubscription = this.gruposService.get(this.currentGrupoId).subscribe(data => {
          this.dadosGrupo = data;
        });
      }
      catch(err)
      {
        console.log('Falha ao registrar subscribe de grupo');
      }
    }
  }

  searchClear(event)
  {
    this.filtered = this.items;
  }

  generateColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  closeModal(){
    this.modal.dismiss();
  }

}
