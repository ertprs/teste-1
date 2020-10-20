import { ProcessosService } from 'src/app/services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';
import { MensagensService } from 'src/app/services/chat/mensagens.service';
import { LoadingController, NavParams, ModalController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { UploadstorageService } from './../../../services/global/uploadstorage.service';

import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Mensagens } from 'src/app/interface/chat/mensagens';
import { Conversas } from 'src/app/interface/chat/conversas';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-anexos',
  templateUrl: './anexos.page.html',
  styleUrls: ['./anexos.page.scss'],
})



export class AnexosPage implements OnInit {
  
  @Input() folder: string;
    
  uploadPercent: Observable<number> ;
  downloadURL: Observable < string > ;

  progresso: number = 0;

  private conversaUid:any;
  private currentUser:any;
  private contatoUid: string;
  private origemChamada: string;

  private dadosMensagem: Mensagens = {};
  private dadosConversa: Conversas = {};
  public dadosdoArquivo = {nome:'',url:''}
  public nomePasta:string
  constructor(
    private srvUpload:UploadstorageService,
    private loadingCtrl:LoadingController,
    private afa:AngularFireAuth,
    private storage: AngularFireStorage,
    private mensagensService:MensagensService,
    private nav:NavParams,
    private global:UserService,
    private modal:ModalController,
    private DB:AngularFirestore,
    private design:ProcessosService


  ) 
  { 
    this.conversaUid = this.nav.get('conversaUid');
    this.currentUser = this.nav.get('currentUser');
    this.contatoUid = this.nav.get('contatoUid');
    this.dadosConversa = this.nav.get('dadosConversa');
    this.origemChamada = this.nav.get('origemChamada');
  }
  closeModal() {
    console.log('Close modal')
      this.modal.dismiss();
  }
  ngOnInit() {
    
  }
  sendArquivo(urlStorage:string)
  {
    this.dadosMensagem.mensagem = '';
    this.dadosMensagem.canal = this.dadosConversa.canal;
    this.dadosMensagem.contatoOrigem = this.dadosConversa.contatoOrigem;
    this.dadosMensagem.contatoUid = this.dadosConversa.contatoUid;
    this.dadosMensagem.tipo = 'anexo';
    this.dadosMensagem.anexo = urlStorage;

    console.log(this.dadosMensagem);

    this.mensagensService.SendMesg(this.conversaUid,this.dadosMensagem).then(()=>{
      console.log('Anexo enviado com sucesso ');
      
      
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      this.modal.dismiss();
    })

  }
  registrarArquivo(nome:string,url:string)
  {
    const idCliente = this.global.dadosLogado.idCliente;
    
    this.design.presentLoading('Registrando arquivo...')
    .then(resLoading=>{
      resLoading.present();
      const dadosDocumento = {
        createAt : new Date().getTime(),
        nome,
        tipo:'arquivo',
        url,
        bucket:this.nomePasta,
        tamanho:0   

      }
      this.DB.collection(idCliente).doc('dados').collection('arquivos').add(dadosDocumento)
      .then(res=>{
        this.design.presentToast(
          'Arquivo registrado com sucesso',
          'success',
          2000
        )
      })
      .catch(err=>{
        console.log(err)
        this.design.presentToast(
          'Falha ao registrar arquivo',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        resLoading.dismiss();
        this.getBackLink(url);
      })
    })
    
  }
  uploadFile(event) {
    this.nomePasta = "docmensagens";
    if (this.origemChamada === 'gerenciador')
    {
      this.nomePasta = 'gerenciador'
    }




    console.log(event);
    const file = event.target.files[0];
    
    const randomId = Math.random().toString(36).substring(2);
    const nomeArquivo = new Date().getTime()+randomId+file.name;
    const filePath = nomeArquivo.split('.');
    const filePathNome  = filePath[0];
    const filePathExt   = filePath.pop();
    const filePafhContent = this.dadosdoArquivo.nome.split(' ').join('_')+'.'+filePathExt;

    const idCliente = this.global.dadosLogado.idCliente;
    const dadosRef = idCliente+"/"+this.nomePasta+"/"+filePafhContent;
    

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
            if(this.origemChamada === 'mensagens'){
              this.sendArquivo(resp);
            } else if (this.origemChamada === 'listatransmissao') {
              this.getBackLink(resp);
            } else if (this.origemChamada === 'gerenciador') {
              this.dadosdoArquivo.url = resp 
              this.registrarArquivo(this.dadosdoArquivo.nome,this.dadosdoArquivo.url)
            
            } 
            else if(this.origemChamada === 'configempresacertificado')
            {
              this.dadosdoArquivo.url = resp 
              this.registrarArquivo(this.dadosdoArquivo.nome,this.dadosdoArquivo.url)
            }
            else if (this.origemChamada === 'aprendizado') {
              this.getBackLink(resp);
            }
            
          }
        })
        
      })
    )
    .subscribe()
  }

  getBackLink(url:string) {
    console.log(`LINK:${url}`);
    this.modal.dismiss({ link: url });
  }

}
