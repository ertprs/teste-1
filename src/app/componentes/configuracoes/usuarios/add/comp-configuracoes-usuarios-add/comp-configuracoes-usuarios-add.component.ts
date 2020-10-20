import { UsuariosService } from 'src/app/services/seguranca/usuarios.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { Itconfusuario } from 'src/app/interface/configuracoes/usuario/itconfusuario';
import { Router } from '@angular/router';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Subscription, Observable } from 'rxjs';
import { UserService } from 'src/app/services/global/user.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AtendimentoService } from 'src/app/services/configuracoes/atendimento.service';

@Component({
  selector: 'app-comp-configuracoes-usuarios-add',
  templateUrl: './comp-configuracoes-usuarios-add.component.html',
  styleUrls: ['./comp-configuracoes-usuarios-add.component.scss'],
})
export class CompConfiguracoesUsuariosAddComponent implements OnInit {

  public userDados: Itconfusuario = {};
  private currentUser : any;
  private itemsSubscriptionAdd: Subscription;
  private newPhoto : any;
  private usuarioAtual : string = 'offline';
  uploadPercent: Observable<number>;
  downloadURL: Observable <string>;
  private dadosConfEmpresa:any = []
  private departamentosList = []

  @Input() data: any;
  currentUserUid: string;

  constructor(
    private auth:AuthService,
    private design:ProcessosService,
    private usuariosService:UsuariosService,
    private router:Router,
    private eventEmitterService: ProvEmitterEventService,
    private global:UserService,
    private storage: AngularFireStorage,
    private afa : AngularFireAuth,
    private srvAtendimento:AtendimentoService
  ) { 
    this.itemsSubscriptionAdd = new Subscription;
  }

  ngOnInit() {
    this.currentUser = {
      displayName: this.afa.auth.currentUser.displayName,
      photoURL: this.afa.auth.currentUser.photoURL,
      email: this.afa.auth.currentUser.email,
      telefone: this.afa.auth.currentUser.phoneNumber,
      senha: '',
      senha2: '',
      senha3: '',
    
    };
    this.dadosConfEmpresa = this.global.dadosLogado.configEmpresa

    this.currentUserUid = this.afa.auth.currentUser.uid;

    if(this.data.usuarioUid) {

      //CARREGAR DEPARTAMENTOS
      this.srvAtendimento.getAllConfDepartamentos().subscribe(element=>{
        if(element.size > 0)
        {
          element.docs.forEach(dados=>{
            const id = dados.id
            const data = dados.data()
            const dataRet = {
              id,
              ... data
            }
          
            this.departamentosList.push(dataRet)
          })
        }
      })


      this.itemsSubscriptionAdd =  this.usuariosService.get(this.data.usuarioUid).subscribe(data => {    
        this.userDados = data;

        if (this.currentUserUid == this.userDados.userUid) this.usuarioAtual  = 'online';
        if (!this.userDados.photoURL) this.userDados.photoURL = '../../../../../../assets/img//default-user-icon.jpg';
          
      });
    }


  }

  ngOnDestroy() {
    this.itemsSubscriptionAdd.unsubscribe();
  }
  stringToHash(string) { 
                  
      let hash =btoa(string)
        
      return hash; 
  } 
  public copyForClipboard(event: MouseEvent, input : any): void {
    try {
      event.preventDefault();
      const payload: string = input.data;
  
      let listener = (e: ClipboardEvent) => {
        let clipboard = e.clipboardData || window["clipboardData"];
        clipboard.setData("text", payload.toString());
        e.preventDefault();
      };
  
      document.addEventListener("copy", listener, false)
      document.execCommand("copy");
      document.removeEventListener("copy", listener, false);

      this.design.presentToast( 
        'Copiado com sucesso',
        'success',
        3000
      );

    } 
    catch (error) {
      this.design.presentToast(
        'Falha ao copiar '+error,
        'danger',
        3000
      );
    }
  }
  atualizar() {
    this.design.presentLoading('Atualizando...').then(resLoading=>{
      resLoading.present();

      //HORÁRIOS DE ATENDIMENTO
      if(!this.userDados.hasOwnProperty('atdDom')) this.userDados.atdDom = false;
      if(!this.userDados.hasOwnProperty('atdSeg')) this.userDados.atdSeg = false;
      if(!this.userDados.hasOwnProperty('atdTer')) this.userDados.atdTer = false;
      if(!this.userDados.hasOwnProperty('atdQua')) this.userDados.atdQua = false;
      if(!this.userDados.hasOwnProperty('atdQui')) this.userDados.atdQui = false;
      if(!this.userDados.hasOwnProperty('atdSex')) this.userDados.atdSex = false;
      if(!this.userDados.hasOwnProperty('atdSab')) this.userDados.atdSab = false;

      //API
      if(this.userDados.apiKey)
      {
        if(this.userDados.apiKeyToken == '')
        {
          this.userDados.apiKeyToken = this.stringToHash(this.afa.auth.currentUser.uid);
        }
       
      }
      else
      {
        this.userDados.apiKeyToken = '';
      }
      
      //PERMISSÕES
      if(!this.userDados.hasOwnProperty('administracao')) this.userDados.administracao = false;
      if(!this.userDados.hasOwnProperty('atendimento')) this.userDados.atendimento = false;
      if(!this.userDados.hasOwnProperty('cadastro')) this.userDados.cadastro = false;
      if(!this.userDados.hasOwnProperty('comercial')) this.userDados.comercial = false;
      if(!this.userDados.hasOwnProperty('financeiro')) this.userDados.financeiro = false;
      if(!this.userDados.hasOwnProperty('fiscal')) this.userDados.fiscal = false;
      if(!this.userDados.hasOwnProperty('supervisao')) this.userDados.supervisao = false;
      if(!this.userDados.hasOwnProperty('suporte')) this.userDados.suporte = false;

      if(!this.userDados.hasOwnProperty('recepcao')) this.userDados.recepcao = false;

      this.usuariosService.update(this.data.usuarioUid,this.userDados).then(res=>{
        if (this.usuarioAtual == 'online') {

          this.currentUser.displayName = this.userDados.userNome;
          this.currentUser.photoURL = this.userDados.photoURL;

          this.auth.updateProfile(this.currentUser).then(() => {
            resLoading.dismiss();
            this.design.presentToast(
              'Atualizado com sucesso',
              'success',
              3000
            );
          }).catch(err=>{
            resLoading.dismiss();
            console.log(err);
            
            this.design.presentToast(
              'Falha ao atualizar dados',
              'danger',
              4000
            );
          });
        }
        else {
          resLoading.dismiss();
          this.design.presentToast(
            'Atualizado com sucesso',
            'success',
            3000
          );
        }
      }).catch(err=>{
        resLoading.dismiss();
        console.log(err);
        this.design.presentToast(
          'Falha ao atualizar dados',
          'danger',
          4000
        );
      });
    });
  }

  async uploadFile(event) {
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
            console.log('Falha ao gerar link');
          }
        })
        
      })
    )
    .subscribe()
  }

  getBackLink(url:string, resloading : any) {
    this.userDados.photoURL = url;
    resloading.dismiss();

    this.design.presentToast(
      'Prévia carregada, clique em salvar para confirmar as alterações',
      'secondary',
      4000
    )
  }

  async adicionarUsuarioNew() {

    await this.design.presentLoading('Gerando usuario').then( resloading => {
      resloading.present();
      this.userDados.departamento = 'atendimento'
      this.usuariosService.newUserCreate(this.userDados).then(resp=>{
        resloading.dismiss();
        if(resp) {
          this.design.presentToast(
            'Cadastrado com sucesso',
            'success',
            4000
          )
          
          this.functionExecute('compConfiguracoesUsuariosHome',{});
        } 
        else {
          this.design.presentToast(
            'Falha ao criar usuário',
            'danger',
            4000
          )
        }
      })
      .catch((err) => {
        resloading.dismiss();
        console.log(err);
        this.design.presentToast(
          'Problemas ao criar usuario '+JSON.stringify(err),
          'danger',
          4000
        )
      })
      .finally(()=>{
        resloading.dismiss()
      })
    })
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  checkDiaSemana(ev,campo) {
    let isChecked = ev.currentTarget.checked;

    if(isChecked == false)
    {
      if (campo == 'atdSeg') {
          
        this.userDados.atdSeg = true;
        this.userDados.atdSegHrIni = "08:00";
        this.userDados.atdSegHrFim = "18:00";

        this.userDados.atdTer = true;
        this.userDados.atdTerHrIni = "08:00";
        this.userDados.atdTerHrFim = "18:00";

        this.userDados.atdQua = true;
        this.userDados.atdQuaHrIni = "08:00";
        this.userDados.atdQuaHrFim = "18:00";

        this.userDados.atdQui = true;
        this.userDados.atdQuiHrIni = "08:00";
        this.userDados.atdQuiHrFim = "18:00";

        this.userDados.atdSex = true;
        this.userDados.atdSexHrIni = "08:00";
        this.userDados.atdSexHrFim = "18:00";
      }

      this.userDados[campo] = false;
    }
    else
    {
      this.userDados[campo] = true;
      this.userDados[`${campo}HrIni`] = "00:00";
      this.userDados[`${campo}HrFim`] = "00:00";
    }
  }

  contatoCheckboxes(ev : any, name : string) {

    let isChecked = ev.currentTarget.checked;

    if (!isChecked) {
      this.userDados[name] = false;
    }
    else {
      this.userDados[name] = true;
    }
  }

}
