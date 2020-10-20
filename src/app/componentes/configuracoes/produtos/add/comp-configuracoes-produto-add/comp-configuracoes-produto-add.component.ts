import { ProcessosService } from './../../../../../services/design/processos.service';
import { ProdutosService } from 'src/app/services/produtos/produtos.service';

import { Component, OnInit, Input } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Itproduto } from 'src/app/interface/produtos/itproduto';
import { Subscription, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserService } from 'src/app/services/global/user.service';
import { finalize } from 'rxjs/operators';
import { ModalController, Platform } from '@ionic/angular';
import { ModalfiscalncmgerenciarPage } from 'src/app/modals/fiscal/ncm/modalfiscalncmgerenciar/modalfiscalncmgerenciar.page';

@Component({
  selector: 'app-comp-configuracoes-produto-add',
  templateUrl: './comp-configuracoes-produto-add.component.html',
  styleUrls: ['./comp-configuracoes-produto-add.component.scss'],
})
export class CompConfiguracoesProdutoAddComponent implements OnInit {
  @Input() data: any;

  private produtoUid:string;
  private produtosSubscription: Subscription;
  public dadosProduto : Itproduto = {};
  private newPhoto : any;
  uploadPercent: Observable<number>;
  downloadURL: Observable <string>;

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvProduto:ProdutosService,
    private design:ProcessosService,
    private storage: AngularFireStorage,
    private global:UserService,
    private platform : Platform,
    private ctrlModal:ModalController
  ) 
  { 

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

  ngOnInit() {

    if(this.data.id)
    {
      console.log('Recuperando dados de produto')
      this.produtoUid = this.data.id;

      this.produtosSubscription = this.srvProduto.get(this.produtoUid).subscribe(dados=>{
        this.dadosProduto = dados
      })

      
    }
  }

  gravar()
  {
    this.design.presentAlertConfirm(
      'Gravar',
      'Confirma gravar os dados?',
      'SIM',
      'Não' 
    )
    .then(resConfirm=>{
      console.log('Seguindo ...')
      if(resConfirm)
      {
        this.design.presentLoading('Aguarde...')
        .then(resLoading=>{
            resLoading.present()
            if(this.produtoUid)
            {
              this.srvProduto.update(this.produtoUid,this.dadosProduto)
              .then(resUpdate=>{
                this.design.presentToast(
                  'Atualizado com sucesso',
                  'success',
                  3000
                )
              })
              .catch(err=>{
                console.log(err)
                this.design.presentToast(
                  'Falha ao atualizar dados de produto',
                  'danger',
                  0,
                  true
                )
              })
              .finally(()=>{
                resLoading.dismiss();
              })
            }
            else
            {
              this.srvProduto.add(this.dadosProduto)
              .then(resAdd=>{
                this.produtoUid = resAdd.id
                console.log('Produto '+this.produtoUid)
                this.design.presentToast(
                  'Cadastrado com sucesso',
                  'success',
                  3000
                )
              })
              .catch(err=>{
                console.log(err)
                this.design.presentToast(
                  'Falha ao adicionar produto',
                  'danger',
                  0,
                  true
                )
              })
              .finally(()=>{
                resLoading.dismiss()
              })
            }
        })
      }
      
    })
  }

  async uploadFile(event) {

    if (this.platform.is('hybrid')) {
      this.design.presentToast(
        'Função desabilitada temporariamente',
        'danger',
        4000
      )
    }
    
    const file = event.target.files[0];
    
    const randomId = Math.random().toString(36).substring(2);
    const nomeArquivo = new Date().getTime()+randomId+file.name;
    const filePath = nomeArquivo;

    const idCliente = this.global.dadosLogado.idCliente;
    const dadosRef = idCliente+"/usuariosempresa/"+filePath;
    

    const fileRef = this.storage.ref(dadosRef);
    const task = this.storage.upload(dadosRef, file);
  
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() =>{
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(resp=>{
          if(resp != '')
          {
            this.design.presentLoading('Carregando prévia').then( resloading => {
              resloading.present();
              this.getBackLink(resp, resloading);
            });
          }
          else {
            this.design.presentToast(
              'Falha ao carregar prévia, tente novamente',
              'danger',
              4000
            );
          }
        })
        
      })
    )
    .subscribe()
  }

  getBackLink(url:string, resloading : any) {
    this.dadosProduto.photoURL = url;
    resloading.dismiss();

    this.design.presentToast(
      'Prévia carregada, clique em salvar para confirmar as alterações',
      'secondary',
      4000
    )
  }
  async abrirNCM()
  {
    const modal = await this.ctrlModal.create({
      component: ModalfiscalncmgerenciarPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      componentProps: {
        origem:'produtoEstoque'
      }

    });

    modal.onDidDismiss().then((dados) => {
      console.log(dados)
      if(dados !== undefined)
      {
        const data = dados.data
        this.dadosProduto.ncm = data.ncm
      }
    })

    await modal.present();
  }

}
