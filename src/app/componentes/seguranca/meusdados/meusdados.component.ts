import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { UserService } from 'src/app/services/global/user.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { UsuariosService } from 'src/app/services/seguranca/usuarios.service';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Itmeusdados } from 'src/app/interface/seguranca/itmeusdados';
import { finalize } from 'rxjs/operators';
import { Itconfusuario } from 'src/app/interface/configuracoes/usuario/itconfusuario';

@Component({
  selector: 'app-meusdados',
  templateUrl: './meusdados.component.html',
  styleUrls: ['./meusdados.component.scss'],
})
export class MeusdadosComponent implements OnInit {
  
  uploadPercent: Observable<number> ;
  downloadURL: Observable <string> ;
  
  private itemsUsuarios: Subscription;
  private currentUser : any;
  private empresaUser : Itconfusuario;
  private userSubscription: Subscription;
  private currentUserUid: string;
  private testando : any = null;
  private changeSenha : boolean = true;
  private newPhoto : any;

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design:ProcessosService,
    private storage: AngularFireStorage,
    private globalUser:UserService,
    private authService:AuthService,
    private usuariosService:UsuariosService,
    private afa : AngularFireAuth
  ) { 
  }

  async ngOnInit() {

    console.log(this.afa.auth.currentUser);

    this.currentUser = {
      displayName: this.afa.auth.currentUser.displayName,
      photoURL: this.afa.auth.currentUser.photoURL,
      email: this.afa.auth.currentUser.email,
      telefone: this.afa.auth.currentUser.phoneNumber,
      senha: '',
      senha2: '',
      senha3: '',
    };

    this.currentUserUid = this.afa.auth.currentUser.uid;

    this.itemsUsuarios = this.usuariosService.getUserEmpresaAll().subscribe(data=>{
      data.forEach(user => {
        if(user.email == this.currentUser.email){
          this.empresaUser = user;
          console.log(user);
        }
      });
    })
  }

  ngOnDestroy(){
    this.itemsUsuarios.unsubscribe();
  }

  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    };
    
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  async uploadFile(event) {
    this.design.presentLoading('Carregando prévia').then( resloading => {
      resloading.present();

      const file = event.target.files[0];
    
      const randomId = Math.random().toString(36).substring(2);
      const nomeArquivo = new Date().getTime()+randomId+file.name;
      const filePath = nomeArquivo;
  
      const idCliente = this.globalUser.dadosLogado.idCliente;
      const dadosRef = idCliente+"/empresausers/"+filePath;
      
  
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
              this.getBackLink(resp, resloading);
            }
            else {
              resloading.dismiss();
              this.design.presentToast(
                'Falha ao carregar prévia, tente novamente',
                'danger',
                4000
              )
            }
          })
          
        })
      ).subscribe();
    });

  }

  getBackLink(url:string, resloading : any) {
    this.currentUser.photoURL = url;
    resloading.dismiss();

    this.design.presentToast(
      'Prévia carregada, clique em salvar para confirmar as alterações',
      'secondary',
      4000
    )
  }

  enableSenha(){
    this.changeSenha == false ? this.changeSenha = true : this.changeSenha = false;

    this.currentUser.senha = '';
    this.currentUser.senha2 = '';
    this.currentUser.senha3 = '';
  }

  updateSenha(){
    if(this.currentUser.senha != '' && this.currentUser.senha2 == this.currentUser.senha3)
    {
      this.design.presentLoading('Atualizando...')
      .then(resLoading => {
        resLoading.present()

        const credentials = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, this.currentUser.senha);

        this.afa.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials).then(() => {
          this.afa.auth.currentUser.updatePassword(this.currentUser.senha2).then(() => {
            this.design.presentToast(
              'Senha atualizada com sucesso',
              'success',
              3000);

              this.enableSenha();
          });
        })
        .catch(err => {
          console.log(err)
          this.design.presentToast(
            'Houve uma falha ao atualizar sua senha',
            'danger',
            0,
            true
          )
        })
        .finally(() => {
          resLoading.dismiss()
        })
      })
      
    }
    else{
      this.design.presentToast(
        'As senhas informadas não conferem',
        'warning',
        0,
        true 
      )
    }
  }

  async userUpdate() {

    await this.design.presentLoading('Atualizando dados').then( resloading => {
        resloading.present();
          this.authService.updateProfile(this.currentUser).then(resp=>{
            if (this.empresaUser) {

              this.empresaUser.userNome = this.currentUser.displayName;
              this.empresaUser.photoURL = this.currentUser.photoURL;

            this.usuariosService.update(this.empresaUser.id,this.empresaUser).then(res=>{
              resloading.dismiss();
              this.design.presentToast(
                'Atualizado com sucesso',
                'success',
                3000
              );
            }).catch(err=>{
              resloading.dismiss();
              console.log(err);
              this.design.presentToast(
                'Falha ao atualizar dados',
                'danger',
                4000
              );
            });
            }
          }).catch((err) => {
            resloading.dismiss();
            console.log(err);
            this.design.presentToast(
              'Problemas ao atualizar dados '+JSON.stringify(err),
              'danger',
              4000
            )
          })
          .finally(()=>{
            resloading.dismiss()
          })
    });
    
  }


}
