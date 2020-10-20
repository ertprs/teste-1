import { ModalbackupPage } from './../backupt/modalbackup/modalbackup.page';
import { HttpClient } from '@angular/common/http';
import { ModalContatoImportPage } from './../../chat/modal-contato-import/modal-contato-import.page';
import { UserService } from './../../../services/global/user.service';
import { Component, OnInit } from '@angular/core';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UploadstorageService } from 'src/app/services/global/uploadstorage.service';
import { AnexosPage } from '../../chat/anexos/anexos.page';
import { AngularFirestore, QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { PopovergerenciadorarquivosPage } from 'src/app/popover/arquivos/popovergerenciadorarquivos/popovergerenciadorarquivos.page';


@Component({
  selector: 'app-modal-arquivos-home',
  templateUrl: './modal-arquivos-home.page.html',
  styleUrls: ['./modal-arquivos-home.page.scss'],
})
export class ModalArquivosHomePage implements OnInit {

  public idcliente:string;
  public dadosUPloadArquivo;
  public arquivoLista = [];
  public filtered:any[] = [];
  private loaded : any[] = [];
  public queryText : string = '';
  public verProgresso:boolean;
  public scrollAuto:boolean = false;

  constructor(
    private modal:ModalController,
    private design:ProcessosService,
    private storage: AngularFireStorage,
    private global:UserService,
    public serviceUpload:UploadstorageService,
    private ctrlModal:ModalController,
    private DB:AngularFirestore,
    public ctrlPopover: PopoverController,
    public http:HttpClient
    
  ) 
  { 
    this.idcliente = global.dadosLogado.idCliente;
    console.log(this.idcliente);  
    this.verProgresso = false;
  }

  ngOnInit() {
    this.fristLoad();
  }

  ngAfterViewInit(){
    // this.listarPasta();
  }

  public async downloadResource(item:any): Promise<Blob> {
    const file =  await this.http.get<Blob>(item.url,
      {responseType: 'blob' as 'json'}).toPromise();
    return file;
  }

  async search(event:any)
  {
    if(event == '')
    {
      this.fristLoad();
    }
    else
    {
      this.scrollAuto = false;
      this.arquivoLista = [];
      this.filtered = [];

      console.log(event);

      (await this.getFilter(event)).subscribe(arquivos=>{
        arquivos.forEach(arquivo => {
          if (arquivo !== undefined) {
            this.arquivoLista.push(arquivo);
          }
        });        
      });
    }
    
  }

  async fristLoad()
  {
    
    this.scrollAuto = true;
  
    (await this.getFirst()).forEach(arquivos=>{
      arquivos.forEach(arquivo => {

        let checkContato = this.arquivoLista.reduce(( cur, val, index ) => {

          if( val.id === arquivo.id && cur === -1 ) {
              
            return index;
          }
          return cur;
      
        }, -1 );

        if(checkContato == -1)
        {
          console.log('Nao existe')
          this.arquivoLista.push(arquivo);
        }
        else
        {
          console.log('Ja existe')
          this.arquivoLista[checkContato] = arquivo
        }

      });

      this.filtered = this.arquivoLista;
    });

    // PREPARAR FILTRO PARA SER MAIS RAPIDO
    // this.contatoService.getFilter('')
  }

  searchClear(event)
  {
    console.log('Filtro cancelado')
    this.filtered = this.arquivoLista;
  }

  async download(item:any)
  {
    window.open(item.url)
  }

  async presentPopover(ev: any,item:any) {
    const popover = await this.ctrlPopover.create({
      component: PopovergerenciadorarquivosPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then((data) => {
      if(data !== undefined)
      {
        if(data.data == 'import-contato')
        {
          this.ProcessarImportacao(item);
        }
        if(data.data == 'download')
        {
          this.download(item);
        }
        if(data.data == 'import-backup')
        {
          this.ProcessarBackup(item)
        }
      }
    })
    return await popover.present();
  }

  async getFilter(valor : string){
    console.log('Iniciando consultapara '+valor)
      return this.DB.collection(this.idcliente).doc('dados').collection('arquivos',ref=> ref.orderBy('createAt','desc')).snapshotChanges().pipe(
        map(action => action.map(a=>{
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          const doc = a.payload.doc;
          let arquivoNome = data.nome
          if (arquivoNome.toUpperCase().indexOf(valor.toUpperCase()) > -1)
          {
            console.log(arquivoNome);
            return {id, ... data,doc}
          }
        }))
      );
  }

  async getFirst()
  {
    return  this.DB.collection(this.idcliente).doc('dados').collection('arquivos',ref=> 
    ref.orderBy('createAt','desc')
    .limit(150)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const doc = a.payload.doc;
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data,doc}
      }))
    )
  }

  async listarPasta(){
    (await this.getFirst()).subscribe(dados=>{
      this.arquivoLista = dados;
    })
  }

  ObservarProcesso(uidDocumento:string)
  {
    this.verProgresso = true;
    let dadosDeProcesso = { createAt:0,url:'',situacao:0,dados:'',tipo:''}
    const observando = this.DB.collection('prodTemporario').doc(uidDocumento).valueChanges().subscribe(dados=>{
      dadosDeProcesso = <any>dados;  
     
      if(dadosDeProcesso.situacao == 2)
      {
        observando.unsubscribe();
        this.verProgresso = false;
        console.log('Processado com sucesso')

        if(dadosDeProcesso.tipo == 'contato-import')
        {
          this.VisualizarContatosImportacao(dadosDeProcesso.dados)
        }
        else if(dadosDeProcesso.tipo == 'backup')
        {
          console.log(dadosDeProcesso.dados)
          this.VisualizarBackup(dadosDeProcesso.dados)
        
        }
        else
        {
          this.design.presentToast(
            'Não existe um visualizador padrão para esta ação ('+dadosDeProcesso.tipo+') ',
            'warning',
            5000
          )
        }
        
        
       

      }
    });
  }

  ProcessarBackup(item:any)
  {
    console.log(item)
    const arrLink = item.url.split('?').shift();
    let ext = <string>arrLink.split('.').pop();
    const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
    const dest = `/tmp/${filename}`;
    if(ext.toUpperCase() == 'BKP')
    { 
      const dadosDeProcesso = {
        createAt:new Date().getTime(),
        url:item.url,
        situacao:1,
        tipo:'backup',
        dados:''
      }
      this.DB.collection('prodTemporario').add(dadosDeProcesso)
      .then(res=>{
        this.ObservarProcesso(res.id);
        console.log('Enviado para processo')
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao enviar arquivo para processamento',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{

      })
    }
    else
    {
      this.design.presentToast(
        'Arquivo  não esta em um formato para backup ('+ext+') ',
        'warning',
        0,
        true
      )
    }
    
  }

  ProcessarImportacao(item:any)
  {
    console.log(item)
    const arrLink = item.url.split('?').shift();
    let ext = <string>arrLink.split('.').pop();
    const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
    const dest = `/tmp/${filename}`;
    if(ext.toUpperCase() == 'CSV')
    { 
      const dadosDeProcesso = {
        createAt:new Date().getTime(),
        url:item.url,
        situacao:1,
        tipo:'contato-import',
        dados:''
      }
      this.DB.collection('prodTemporario').add(dadosDeProcesso)
      .then(res=>{
        this.ObservarProcesso(res.id);
        console.log('Enviado para processo')
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao enviar arquivo para processamento',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{

      })
    }
    else
    {
      this.design.presentToast(
        'Arquivo  não estão em um formato CSV',
        'warning',
        0,
        true
      )
    }
    
  }

  async upload()
  {
    await this.serviceUpload.SelecionarArquivo('').then((downloadUrl)=>{
      console.log(downloadUrl)
      
    }).catch((err)=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao abrir selecao de arquivo',
        'danger',
        0,
        true
      )
    }) 
  }

  async deletar(item:any)
  {
    this.design.presentAlertConfirm(
      'Excluisão',
      'Confirma exclusão do documento?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {

        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()

          this.storage.storage.refFromURL(item.url).delete()
          .then(resDelete=>{
            //DELETAR ARQUIVO DA LISTA
            this.DB.collection(this.idcliente).doc('dados').collection('arquivos').doc(item.id).delete()
            .then(resDeleteTabela=>{
                this.design.presentToast(
                  'Arquivo excluido com sucesso',
                  'success',
                  3000
                )
            })
            .catch(err=>{
              console.log(err)
              this.design.presentToast(
                'Falha ao apagar item da tabela do gerenciado',
                'danger',
                0,
                true
              )
            })
            .finally(()=>{
              resLoading.dismiss()
            })
          })
          .catch(err=>{
            resLoading.dismiss();
            console.log(err)
            this.design.presentToast(
              'Falha ao tentar deletar arquivo ',
              'danger',
              0,
              true
            )
          })



        })

       
      }
    })
  } 

  async uploadDesk(){
    const modal = await this.ctrlModal.create({
      component: AnexosPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        origemChamada: 'gerenciador'
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data !== undefined) {
        if(data.data.link !== undefined) {
          console.log(data.data.link) 
        }
      }
    });

    await modal.present();
  }

  async VisualizarContatosImportacao(dados:any){
    const modal = await this.ctrlModal.create({
      component: ModalContatoImportPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        dadosImportar: dados
      }
    });

    await modal.present();
  }
  async VisualizarBackup(dados:any){
  
    const modal = await this.ctrlModal.create({
      component: ModalbackupPage,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'selector-modal',
      swipeToClose: true,
      presentingElement: await this.ctrlModal.getTop(), // Get the top-most ion-modal
      componentProps: {
        dadosImportar: dados
      }
    });

   

    await modal.present();
  }

  closeModal() {
    this.modal.dismiss();
  }

}
