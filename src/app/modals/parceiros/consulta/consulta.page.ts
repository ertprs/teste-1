import { Component, OnInit, Input } from '@angular/core';
import { NavParams,ModalController } from '@ionic/angular';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { Subscription } from 'rxjs';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Contatos } from 'src/app/interface/chat/contatos';
import { ContatosService } from 'src/app/services/chat/contatos.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  public contatoId: string;
  public parceirosItems = new Array<Itaddparceiro>();
  private parceirosItemsSubscription: Subscription;
  private contatoItemsSubscription: Subscription;
  public dadosContato: Contatos = {};
  public recover : any = {};

  public filtered : any[] = []; 
  private queryText : string = '';

  private indexCount: number = 0;
  private carregado : Boolean = false;
  

  constructor(
    private modalCtrl:ModalController,
    private nav:NavParams,
    private parceiroService:ParceirosService,
    private contatoService : ContatosService,
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    

  ) { 

  }

  ngOnInit() {
    this.parceirosItemsSubscription = this.parceiroService.getAll().subscribe(data=>{
      
      this.carregado = true;
      this.indexCount = 0;

      data.forEach(elem => {
        
        this.indexCount++;

        if(!elem.photo || elem.photo == '')
        {
          elem.photo = this.generateColor();
        }
      })
      
      this.parceirosItems = data;
      this.filtered = this.parceirosItems;
    });
    
    this.recover = this.nav.get('contatoId');
    this.contatoId = this.recover.contatoId;

    if (this.contatoId) {
      this.contatoItemsSubscription = this.contatoService.get(this.contatoId).subscribe(data => {
        this.dadosContato = data;
      });
    }
  }

  ngOnDestroy(){
    this.parceirosItemsSubscription.unsubscribe();
    this.contatoItemsSubscription.unsubscribe();
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

  closeModal(){
    this.parceirosItemsSubscription.unsubscribe();
    this.modalCtrl.dismiss();
  }

  editar(uid:string){
    alert(uid);
  }

  parceiroSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.parceirosItems; // Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.parceirosItems.filter((parceiro) => {
        if (parceiro.nome != undefined && parceiro.nome != '') {
          for (let i = 0; i < parceiro.nome.length; i++) {
            let parceiroNome = parceiro.nome || ' ';
            let parceiroApelido = parceiro.apelido || ' ';
            let parceiroDocumento = parceiro.documento || ' ';
            
            if (parceiroNome.toUpperCase().indexOf(filter) > -1 || parceiroApelido.toUpperCase().indexOf(filter) > -1 || parceiroDocumento.indexOf(filter) > -1) {
              return parceiro.nome;
            }
          }
        }
        else {
          console.log('parceiro sem nome !');
        }
      });
    }
  }

  async acaoClique(uidParceiro:string,nomeParceiro:string)
  {
    if (this.contatoId)
    {
      await this.design.presentAlertConfirm(
        'Confirmar',
        'Você confirma vincular este parceiro ao contato?',
        'Opa!',
        'Não faz isso não'
      )
      .then((res)=>{
        if(res)
        {
          this.vincular(nomeParceiro,uidParceiro);
        }
      })
      .catch(()=>{

      })
      
    }
    else
    {
      alert('Abrir dados ');
    }

  }

  async vincular(nome:string,uid:string)
  {
  
    this.dadosContato.nomeClienteVinculado = nome;
    this.dadosContato.uidClienteVinculado = uid;  
  
    await this.design.presentLoading('Vinculando...')
    .then((resloading)=>{
      resloading.present();
      this.contatoService.update(this.contatoId,this.dadosContato)
      .then(()=>{
        this.design.presentToast(
          'Cliente vinculado',
          'success',
          3000
        );
        this.modalCtrl.dismiss();
        //this.navCtrl.back();
      })
      .catch((err)=>{
        
        this.design.presentToast(
          'Falha ao vincular '+err,
          'danger',
          4000
        );

        resloading.dismiss();
      })
      .finally(()=>{
        resloading.dismiss();
      })
    })
    .catch((err)=>{
      
      this.design.presentToast(
        'Falha ao abrir loading '+err,
        'danger',
        4000
      )
    })
    
  }

  generateColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
}
