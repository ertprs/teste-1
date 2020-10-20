import { ContatosService } from './../../../services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Component, OnInit } from '@angular/core';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { Subscription } from 'rxjs';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contatos } from 'src/app/interface/chat/contatos';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  
  public dadosContato: Contatos = {};
  public parceirosItems = new Array<Itaddparceiro>();
  private parceirosItemsSubscription: Subscription;
  private contatoItemsSubscription: Subscription;
  private contatoId: string = null;
  private searchQuery: string = '';
  public color_teste : string = '';
  public queryText : string = '';
  public filtered:any[] = [];
  private indexCount: number = 0;
  private carregado : Boolean = false;

  constructor(
    private parceiroService:ParceirosService,
    private router:Router,
    private contatoService:ContatosService,
    private activatedRoute: ActivatedRoute,
    private design:ProcessosService,
    private navCtrl:NavController
  ) 
  { 
    this.contatoId = this.activatedRoute.snapshot.params['contatoUid']; 

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

  contatoSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.parceirosItems; // Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.parceirosItems.filter((item) => {
        if (item.nome != undefined && item.nome != '') {
          for (let i = 0; i < item.nome.length; i++) {
            let parceiroNome = item.nome || ' ';
            let parceiroApelido = item.nome || ' ';
            let parceiroDocumento = item.documento;
            parceiroDocumento = parceiroDocumento + ' ';
            
            if (parceiroNome.toUpperCase().indexOf(filter) > -1) {
              return item.nome;
            }
          }
        }
        else {
          console.log('parceiro sem nome !');
        }
      });
    }
  }

  search() {
    

    if(this.searchQuery)
    {
      this.parceiroService.getAll().subscribe(data=>{
        this.parceirosItems = data
        
        .filter(item=> {
          item.apelido.includes(this.searchQuery)
          
          
        })
        
      });
    }
    else
    {
    
      this.parceiroService.getAll().subscribe(data=>{
        this.parceirosItems = data;
      });
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
        )
        this.ngOnDestroy();
        //this.navCtrl.back();
      })
      .catch((err)=>{
        
        this.design.presentToast(
          'Falha ao vincular '+err,
          'danger',
          4000
        )
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

  async desvincular()
  {
  
    this.dadosContato.nomeClienteVinculado = "";
    this.dadosContato.uidClienteVinculado = "";  
  
    this.contatoService.update(this.contatoId,this.dadosContato)
    .then(()=>{
      console.log('Cliente desvinculado com sucesso');
      this.ngOnDestroy();
      //this.navCtrl.back();
    })
    .catch((err)=>{
      
      this.design.presentToast(
        'Falha ao desvincular '+err,
        'danger',
        4000
      )
    })
    .finally(()=>{
    })
    

    

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

  editar(parceiroId : string){
    this.router.navigate(['/parceiros/add/'+parceiroId]);
  }

  async deletar(parceiroId : string){

    await this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir a parceiro?',
      'Sim',
      'Não'
    ).then(res=>{
      if(res) {
        this.design.presentLoading('Deletando...')
        .then((res) => {
          res.present();

          this.parceiroService.delete(parceiroId).then(()=>{
            if (parceiroId == this.dadosContato.uidClienteVinculado) {
              console.log('Parceiro vinculado excluído');
              this.desvincular().then(() => {
                this.design.presentToast(
                  'Parceiro excluído com sucesso',
                  'success',
                  3000
                )
              });
            }
            else {
              console.log('Parceiro sem vínculo excluído');
              this.design.presentToast(
                'Parceiro excluído com sucesso',
                'success',
                3000
              );
            }

          })
          .catch((err)=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao excluir parceiro',
              'danger',
              4000
            )
          })
          .finally(()=>{
          })

          res.dismiss();
        })
        .catch((err) => {
          console.log(err)
          this.design.presentToast(
            'Falha ao executar operação de exclusão',
            'danger',
            4000
          );
        });
      }
    }).catch(err=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao tentar confirmação de exclusão',
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