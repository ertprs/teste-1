import { UserService } from './../../../services/global/user.service';
import { UploadstorageService } from './../../../services/global/uploadstorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpresaselectService } from './../../../services/seguranca/empresaselect.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itempresaativa } from 'src/app/interface/seguranca/itempresaativa';
import { Observable, Subscription } from 'rxjs';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { LoadingController, Platform } from '@ionic/angular';
import { Ituserdata } from 'src/app/interface/seguranca/ituserdata';




@Component({
  selector: 'app-empresaselect',
  templateUrl: './empresaselect.page.html',
  styleUrls: ['./empresaselect.page.scss'],
})
export class EmpresaselectPage implements OnInit {

  public desktopActive :  string;
  public trocaEmp:string
  public empresaItem = new Array<Itempresaativa>();
  public empresaSubscription: Subscription;

  public dadosUsuario: Ituserdata = {};


  constructor(
    
    private activeRoute: ActivatedRoute,
    public serviceSelecEmpresa:EmpresaselectService,
    private serviceDesign:ProcessosService,
    private authservice:AuthService,
    private router:Router,
    private serviceUpload:UploadstorageService,
    private plataforma : Platform,
    private global:UserService,
    private DB:AngularFirestore,
    
    
  ) { 
    // this.itemsSubscription = new Subscription;
  }

  ionViewDidEnter() {
  
  }

  ngOnInit() {
    this.desktopActive = this.activeRoute.snapshot.queryParamMap.get('active');
    this.trocaEmp = this.activeRoute.snapshot.queryParamMap.get('troca');
  
    this.serviceDesign.presentLoading('Aguarde...')
    .then(resLoading=>{
        resLoading.present();
        //SETAR PERMISSões de LEITURA E ESCRITA 
        if (this.plataforma.is('hybrid'))
        { 
          //SETAR PERMISSOES PARA MOBILIE 
          this.serviceUpload.getPermission();
        }
        
        this.authservice.getCUrrentUser()
        .then(dados=>{
          //DIRECIONAR DIRETAMENTE PARA EMPRESA
          if(!this.trocaEmp)
          {
            console.log('Diredionar para empresa selecionada');
            resLoading.dismiss();
            this.setarEMpresa(dados.idCliente,dados.empresa)
          }
          else
          {
            console.log('Selcionar empresa');
            //LISTAR EMPRESAS PARA CRIAR TOKEN
            this.empresaSubscription = this.serviceSelecEmpresa.getEmpresas().subscribe(data=>{
              this.empresaItem = data;
              resLoading.dismiss();
            });
          }
          
        })
        .catch(()=>{
          //LISTAR EMPRESAS PARA CRIAR TOKEN
          this.empresaSubscription = this.serviceSelecEmpresa.getEmpresas().subscribe(data=>{
            this.empresaItem = data;
            resLoading.dismiss();
          });
        })


      
    })
    .catch(err=>{
      console.log(err)
      this.serviceDesign.presentToast(
        'Problema ao carregar a pagina',
        'danger',
        4000
      )
    })

    
  }

  ngOnDestroy() {
    this.empresaSubscription.unsubscribe();                            
  }
  selecionerempresa(item:any){

    let dadosEmpresaSelecionada:any;
    console.log('Verificando dados da empresa...'+item.id)
    this.DB.collection('EmpControle',ref => ref.where('empresaUid', '==', item.id)).get().forEach(elem=>{
 

      if(!elem.empty)
      {
        elem.docs.forEach(dados=>{
          dadosEmpresaSelecionada = dados.data();
         
        })
      
      
        
      }
    })
    .then(resDados=>{
      if(dadosEmpresaSelecionada)
      {
        if(dadosEmpresaSelecionada.ativa !== undefined)
        {
          
          if(dadosEmpresaSelecionada.ativa)
          {
            console.log(1)
            //SEGUIR COM VALIDACAO
            //ATIVO
            this.setarEMpresa(item.id,item.nome)
          }
          else
          {
            console.log(2)
            //CADAStrO NAO ESTA ATIVO
            this.serviceDesign.presentToast(
              'Codigo 1 - Sua conta ainda não foi validada para acesso. Se você preencheu seus dados corretamente em breve um de nossos especialista irá entrar em contato com você. Se preferir entre em contato com nosso suporte',
              'secondary',
              0,
              true
            )
            this.authservice.logout()
          }
        }
        else
        {
          this.serviceDesign.presentToast(
            'Aconteceram algumas mudanças por aqui. Se você esta recebendo está mensagem é porque seu cadastro ainda não esta completo para aceso. Entre em contato com nosso suporte técnico',
            'warning',
            0,
            true
          )
          this.authservice.logout()
        }
      }
      else
      {
        this.serviceDesign.presentToast(
          'Sua conta ainda não foi validada para acesso. Se você prerencheu seus dados corretamente em breve um de nossos especialista irá entrar em contato com você. Se preferir entre em contato com nosso suporte',
          'warning',
          0,
          true
        )
        this.authservice.logout()
      }
    })

  

    
  }
  setarEMpresa(idCliente:string,empresa:string)
  {
   

    this.authservice.setCurrentUser(idCliente,empresa)
    .then(res=>{
      if(res)
      {
        this.global.conversas = [];
        //EMPRESA SETADA COM SUCESSO
        if (this.plataforma.is('hybrid'))
        {
          //TELA DE CELULAR
          console.log('Iniciando MOBILE');
          this.router.navigate(['/home']);
        }
        else
        {
          //TELA WEB
          console.log('Iniciando WEB');
          if(!this.desktopActive)
          {
            console.log('desktopActive:false')
            this.router.navigate(['/homedesk']);
          }
          else
          {
            console.log('desktopActive:true')
            this.router.navigate(['/home']);
          }
        

        }
      }
      else
      {
        this.serviceDesign.presentToast(
          'Nào foi possivel setar empresa, verifique se seu armazenamento de cookie estão habilitados',
          'warning',
          0,
          true
        )
      }
    })
    .catch(err=>{
      console.log(err);
      this.serviceDesign.presentToast(
        'Houve um problema ao iniciar empresa, consulte suporte técnico',
        'danger',
        4000
      )
    })
  }
  async logout()
  {

    await this.serviceDesign.presentAlertConfirm(
      'Confirmação',
      'Deseja sair'
    )
    .then((res)=>{
      console.log('Alert confirm OK ');
      if(res)
      {
        console.log('Return verdadeiro ')
        this.authservice.logout()
        .then((res)=>{
          this.empresaSubscription.unsubscribe();
          console.log('logout com sucesso');
        })
        .catch((err)=>{
          console.log('falha ao tentar sair ');
        })
      }
      else
      {
        console.log('Return false ')
      }

    })
    .catch((err)=>{
      console.log('Erro no alert confirm '+err);
    })



    
  
  }

}
