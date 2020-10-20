import { AngularFireAuth } from '@angular/fire/auth';



import { Component, OnInit } from '@angular/core';
import { Itusercadastro } from 'src/app/interface/seguranca/itusercadastro';
import { AnalyticsService } from 'src/app/services/google/analytics.service';
import { ProcessosService } from './../../../services/design/processos.service';
import { Router } from '@angular/router';
import { ServiceempresasService } from './../../../services/empresa/serviceempresas.service';
import { AuthService } from './../../../services/seguranca/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { STORAGE_NAME } from 'src/environments/environment';

import { Storage } from '@ionic/storage';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {


  public userDados: Itusercadastro = {};



  constructor(
    private glAnalytics:AnalyticsService,
    private design:ProcessosService,

    private router: Router,
    private storage: Storage,
    private afa:AngularFireAuth,
    private DB:AngularFirestore,
 

  ) { 
    try
    {
      this.glAnalytics.set();
      this.glAnalytics.gravarPagina('home');
    }
    catch(err)
    {
      console.log(err);
    }
    

  }

  ngOnInit() {
    
  }
  voltar()
  {
    this.router.navigateByUrl('/login')
  }
  deleteUserCad(resLoading:any)
  {
    
    this.afa.auth.currentUser.delete()
          .then(resDelete=>{
            this.design.presentToast(
              'Já existe uma conta ativa para este CNPJ ou CPF. Solicite ao proprietário para ter permissão ou contate nosso suporte',
              'warning',
              0,
              true
            )
          })
          .catch(err=>{
            console.log('Estagio X')
            console.log(err)
            this.design.presentToast(
              'Houve um problema ao criar sua  conta',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss();
          })
  }
  docExists(path:string) {
    alert(path)
    try{
      return this.DB.collection('EmpControle').doc(path).valueChanges().pipe(first()).toPromise()
    }
    catch(err)
    {
      return false
    }
    
 }
  cadastro()
  {

    let docValidar = this.userDados.documento;
  
    let validado = true;
    if(this.userDados.hasOwnProperty('documento'))
    {
      console.log('Estagio 1 '+this.userDados.documento.toString()+' - '+this.userDados.documento.toString().length)
      if(this.userDados.documento.toString().length  == 11 || this.userDados.documento.toString().length == 14 || this.userDados.documento.toString().length == 15 )
      {
        console.log('Estagio 2')
        if(docValidar.length <= 11)
        {
          //validar CPF
          console.log('validar CPF')
          validado = true;
         
        
        }
        else
        {
          console.log('validar cnPJ')
          // validar CNPJ
          validado = true;
          
        }
      }
    }
    else{
      console.log('*** 2 *** ')
      validado = true
    }
    
    


    if(validado)
    {
      console.log('Cadastrando...')
      this.design.presentLoading('Cadastrando...')
      .then(resLoading=>{
        resLoading.present();

        //DELETAR TOKENS
        this.storage.remove(STORAGE_NAME)

        //CADStrAr USUARIO
        this.afa.auth.createUserWithEmailAndPassword(this.userDados.email,this.userDados.senha)
        .then( async resUserCreate=>{
          
          //MUDAR NOME DO USUARIO
          this.afa.auth.currentUser.updateProfile(
            {
              displayName:this.userDados.nome,
              photoURL:'./../../../assets/img/default-user-icon.jpg'
            }
          )
        
          
          //VERIFICAR SE EXISTE O CNPJ JA NA BASE DE DADOS
          let exist = false;
          let contador = 0;
        
          this.DB.collection('EmpControle',ref => ref.where('documento', '==', this.userDados.documento)).get().forEach(elem=>{
            
            if(!elem.empty)
            {
              contador = elem.docs.length;
            
            }
            
          })
          .then(resCheck=>{

            if(contador>0)
            {
              exist = true;
            }

            if(!exist)
            {
              
              let cumposInformado = "";
              if(this.userDados.hasOwnProperty('cupom'))
              {
                cumposInformado = this.userDados.cupom;
              }
    
              //CRIAR PASTA DE USERS
              
              const dadosEmpresa = {
                createAt:new Date().getTime(),
                nome:this.userDados.nomeempresa.toUpperCase(),
                documento:this.userDados.documento,
                padrao:true,
                ativa:false,
                novoCliente:true,
                cupom:cumposInformado,
                telWhatsApp:'n:'+this.userDados.tellWhats,
                emailCadastro:this.userDados.email,
                nomeContato:this.userDados.nome
              }
    
              //ADICIONAR A COLECAO DE CONTORLE DE EMPRESAS
              this.DB.collection('EmpControle').add(dadosEmpresa)
              .then(resEmpControleCreate=>{
                const empControleUid = resEmpControleCreate.id;
                
                this.DB.collection('users').doc(this.afa.auth.currentUser.uid).collection('empresas').add(dadosEmpresa)
                .then(resEmpresaCreate=>{
                  let UidEmpresa = resEmpresaCreate.id;

                  this.DB.collection('EmpControle').doc(empControleUid).set({empresaUid:UidEmpresa},{merge:true});
      
                  //CRIAR DADOS DE CONFIGURA
                  const dadosConf = {
                    LibCanaisEmail:false,
                    LibCanaisFacebook:false,
                    LibCanaisTelegram:true,
                    LibCanaisWPP:false,
                    liveChat:false,
                    qtdCanais:0,
                    qtdUsuariosCad:1,
                    qtdUsuariosLimit:10
                  } 
                  this.DB.collection(UidEmpresa).doc('dados').collection('configuracao').doc('empresa').set(dadosConf)
                  .then(resEmpresaConf=>{

                    //CRIAR USUARIO
                    const dadosNewUser = {
                      userUid:this.afa.auth.currentUser.uid,
                      createAt: new Date().getTime(),
                      departamento:'atendimento',
                      perfil:'adm',
                      email:this.userDados.email,
                      nome:this.userDados.nome,
                      userNome:this.userDados.nome
                    }
                    this.DB.collection(UidEmpresa).doc('dados').collection('usuarios').add(dadosNewUser)
                    .then(resNewUser=>{

                      //ADICIONAR CONFIGURACOES DE ATENIMENTO
                      const dadosAtendimento = {
                        mensagemHorario:'Desculpe, mas no momento não estamos em atendimento, retornaremos com você assim que iniciarmos os trabalhos.👍',
                        mensagemTransferencia:'Vou transferir você para um de nossos atendentes.'
                      }
                      this.DB.collection(UidEmpresa).doc('dados').collection('configuracao').doc('atendimento').set(dadosAtendimento)
                      .then(resConfAtendimento=>{
                        //ENVIAR EMAIL DE CCONFIRMACAO
                        this.afa.auth.currentUser.sendEmailVerification()
                        .then((resSendMailConfirm)=>{
                          resLoading.dismiss();
                          this.design.presentToast(
                            'Sua conta foi criada com sucesso',
                            'success',
                            3000
                          )
                        
                        })
                        .catch(err=>{
                          console.log(err);
                          this.design.presentToast(
                            'Não foi possivel enviar o e-mail de confirmação de sua conta. Mas você pode utilizar a Lara mesmo assim.',
                            'warning',
                            3000
                          )
                          
                        })
                        .finally(()=>{
                        
                          this.router.navigate(['/login'])
                        })
                      })
                      .catch(err=>{
                        console.log(err)
                        this.design.presentToast(
                          'Falha ao finalizar cadastrar de empresa',
                          'danger',
                          0,
                          true
                        )
                        this.deleteUserCad(resLoading)
                      })
                      .finally(()=>{

                      })

                        
                    })
                    .catch(err=>{
                      console.log(err)
                      this.deleteUserCad(resLoading)
                    })
                    .finally(()=>{

                    })

                  
                  
                    
                  })
                  .catch(err=>{
                    console.log('Estagio 4')
                    console.log(err)
                    this.design.presentToast(
                      'Houve um problema ao criar sua  conta',
                      'danger',
                      0,
                      true
                    )
                  })
                  .finally(()=>{
                    
                  })
      
      
                })
                .catch(err=>{
                  console.log('Estagio 3')
                  console.log(err)
                  this.deleteUserCad(resLoading)
                })
                .finally(()=>{
                
                })
              })
              .catch(err=>{
                console.log(err)
                console.log('Estagio 4')
                this.deleteUserCad(resLoading)
              })
    
    
            
            }
            else
            {
    
              this.deleteUserCad(resLoading)
              
            
            }


          })
          .catch(err=>{

          })
          
        
        

        })
        .catch(err=>{
        
          console.log('Estagio 1')
          console.log(err)
          this.design.presentToast(
            err,
            'warning',
            0,
            true
          )
        })
        .finally(()=>{
          resLoading.dismiss();
        })


      })
      .catch(err=>{
        this.design.presentToast(
          'Houve um problema ao criar sua  conta',
          'danger',
          0,
          true
        )
      })
    }
    else
    {
      this.design.presentToast('O número de CPF/CNPJ ('+docValidar+') informado não parece estar correto. Verifique e tente novamente. Lembre-se de informar apenas números',
      'warning',
      0,
      true)
    }


    
  }

 

}
