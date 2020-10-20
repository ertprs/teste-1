import { ProcessosService } from './../design/processos.service';

// import { ServiceempresasService } from './../empresa/serviceempresas.service';


import { environment, STORAGE_PWD, STORAGE_NAME } from './../../../environments/environment';
import { AngularFirestore,QueryFn, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Ituserlogin } from './../../interface/seguranca/ituserlogin';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Itusercadastro } from 'src/app/interface/seguranca/itusercadastro';
import { UserService } from '../global/user.service';

//INTERFACES
import { Itconfusuario } from './../../interface/configuracoes/usuario/itconfusuario';
import { Itseguserlogado } from './../../interface/seguranca/itseguserlogado';
import { Ituserrecuperar } from './../../interface/seguranca/ituserrecuperar';
import { ItOnline } from 'src/app/interface/seguranca/ituseronline';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userModel:Itseguserlogado;
  dadosUsuarioAtivo:Itseguserlogado

 


  public userDadosCadastro: Itusercadastro = {};
  public userAtivo: Itseguserlogado = {};
  private currentUser:any;

  private currentUserAuth:any;

  private idCliente:string;
  private empresaNome:string;

  private userOnline:ItOnline = {};

  
  constructor(
    private fireAuth:AngularFireAuth,
    private DB:AngularFirestore,
    private storage: Storage,
    private globalUser:UserService,
    private design:ProcessosService,
    // private serviceEmpresa:ServiceempresasService
   
    ) { 


    
    }
  


  checkPermissao(componenteNome:string):Promise<any>
  {
    return new Promise((resolve, reject) => {
      const permissaoUser = this.globalUser.dadosLogado.configUser
      const idCliente2 = this.globalUser.dadosLogado.idCliente
      //console.log('##########')
      //console.log(JSON.stringify(this.globalUser.dadosLogado))
      //console.log('##########')
      const permissoesNivel = [ ]
      if(
        componenteNome.toLowerCase() ==='conversasativas' ||  
        componenteNome.toLowerCase() ==='todo' || 
        componenteNome.toLowerCase() === 'btnback' ||
        componenteNome.toLowerCase() === 'compcontatoadd' ||
        componenteNome.toLowerCase() === 'chatconversaopen' 
        )
      {
        
        resolve()
      }
      else
      {
        let liberar = true;
        if(
          componenteNome.toLowerCase() === 'compatendimentohome' ||
          componenteNome.toLowerCase() === 'listatransmissaoperformancecomponent' ||
          componenteNome.toLowerCase() === 'complisttransmissaodetalhe' || 
          componenteNome.toLowerCase() === 'compmssgautomatica' || 
          componenteNome.toLowerCase() === 'compwpptemplate'
          )
        {
          if(permissaoUser.atendimento && permissaoUser.supervisao)
          {
              liberar = true;
          }
          else
          {
            //COLOCAR PERMISSOES REQUERIDAS
            liberar = false
            permissoesNivel.push('atendimento')
            permissoesNivel.push('supervisao')
          }
          
        }
        else if(
          componenteNome.toLowerCase() === 'compaprendizadohome' || 
          componenteNome.toLowerCase() === 'compatendimentorelatoriooperaaco'
          )
        {
          if(permissaoUser.atendimento && permissaoUser.supervisao)
          {
              liberar = true;
          }
          else
          {
            //COLOCAR PERMISSOES REQUERIDAS
            liberar = false
            permissoesNivel.push('atendimento')
            permissoesNivel.push('supervisao')
          }
        }
        else if(
          componenteNome.toLowerCase() === 'compconfiguracoesprodutoshome' || 
          componenteNome.toLowerCase() === 'compconfiguracoesprodutoaddcomponent'
          )
        {
          if(permissaoUser.comercial)
          {
              liberar = true;
          }
          else
          {
            //COLOCAR PERMISSOES REQUERIDAS
            liberar = false
            permissoesNivel.push('comercial')
          
          }
        }
        else if(componenteNome.toLowerCase() === 'compcomercialhome')
        {
          if(permissaoUser.comercial && permissaoUser.supervisao)
          {
              liberar = true;
          }
          else
          {
            //COLOCAR PERMISSOES REQUERIDAS
            liberar = false
            permissoesNivel.push('comercial')
            permissoesNivel.push('supervisao')
          }
        }
        else if(
          componenteNome.toLowerCase() === 'chatcontatohome' ||
          componenteNome.toLowerCase() === 'compchatrelatorioscomponent' ||
          componenteNome.toLowerCase() === 'compticketadd'
          
          )
        {
          if(permissaoUser.atendimento)
          {
              liberar = true;
          }
          else
          {
            //COLOCAR PERMISSOES REQUERIDAS
            liberar = false
            permissoesNivel.push('atendimento')
           
          }
        }
        //CONFIGURACOES
        else if(
          componenteNome.toLowerCase() === 'compconfiguracoeshome' || 
          componenteNome.toLowerCase() === 'compconfiguracoesusuarioshome' || 
          componenteNome.toLowerCase() === 'compconfiguracoesusuariosadd' ||
          componenteNome.toLowerCase() === 'compatendimentodetalhe' ||
          componenteNome.toLowerCase() === 'compatendimentodepartamento' ||
          componenteNome.toLowerCase() === 'compconfiguracoesatendimentohome' ||
          componenteNome.toLowerCase() === 'compatendimentocasoshome'  || 
          componenteNome.toLowerCase() === 'compatendimentocasosdetalhe' ||
          componenteNome.toLowerCase() === 'compdevlog'
        )
        {
          if(permissaoUser.administracao && permissaoUser.supervisao)
          {
              liberar = true;
          }
          else
          {
            //COLOCAR PERMISSOES REQUERIDAS
            liberar = false
            permissoesNivel.push('administração')
            permissoesNivel.push('supervisao')
          }
        }
        else
        {
          liberar = false;
        }


        //CHECK ADM
        if(
          componenteNome.toLowerCase() === 'compadministracaohomecomponent' || 
          componenteNome.toLowerCase() === 'compadministracaoempresadetalhecomponent'
        )
        {
          if(idCliente2 == '6Mt3x9Nz8ZCr7gJftpKe' || idCliente2 == 'QmPJcDIMLJBshGe9LDv2')
          {
            liberar = true;
          }
          else
          {
            liberar = false;
            permissoesNivel.push('master lara ')
          }
         
        }
        liberar = true;
        //liberacao do acesso
        if(liberar)
        {
          const insertLog = {
            createAte: new Date().getTime(),
            componenteNome,
            liberado:true,
            msg:'Acesso liberado',
            permissoesNivel,
            permissaoUser,
            user:this.globalUser.dadosLogado.uid,
            empresa:this.globalUser.dadosLogado.idCliente
          }
          this.DB.collection(idCliente2).doc('dados').collection('log').doc('log').collection('acessos').add(insertLog)
          resolve()
        }
        else
        {
          const insertLog = {
            createAte: new Date().getTime(),
            componenteNome,
            liberado:false,
            msg:'Sem acesso',
            permissoesNivel,
            permissaoUser,
            user:this.globalUser.dadosLogado.uid,
            empresa:this.globalUser.dadosLogado.idCliente
          }
          this.DB.collection(idCliente2).doc('dados').collection('log').doc('log').collection('acessos').add(insertLog)
          reject({situacao:'err',code:0,msg:'Acesso negado',permissoesNivel})
        }
        
      }
      
    })
    
  }

  FazerLogin(user:Ituserlogin)
  {
    return this.fireAuth.auth.signInWithEmailAndPassword(user.email,user.senha);
  }

  register(user:Itusercadastro)
  {
    return this.fireAuth.auth.createUserWithEmailAndPassword(user.email,user.senha);
  }
  enviarEmailVerificacao()
  {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
  }
  updateProfile(dadosUser : any)
  {
    return this.fireAuth.auth.currentUser.updateProfile({
      displayName: dadosUser.displayName,
      photoURL: dadosUser.photoURL,
    });
  }
  deletar()
  {
    return this.fireAuth.auth.currentUser.delete();
  }

  logout():Promise<Boolean>
  {
    return new Promise((resolve, reject) => {


      //DELETAR USUARIO ON_LINE
      this.DB.collection('usuariosonline',ref => ref.where('uid','==',this.fireAuth.auth.currentUser.uid)).get().forEach(dados=>{
        if(!dados.empty)
        {
          //deletar usuario on-line
          dados.docs.forEach(dadosReturn=>{
            const id = dadosReturn.id
            this.DB.collection('usuariosonline').doc(id).delete()
            .then(resDelete=>{
              //PROCESSO PARA FINALIZAR LOGIN DO NAVEGADOR
              this.fireAuth.auth.signOut()
              .then(()=>{
                  this.storage.remove(STORAGE_NAME)
                  .then(()=>{

                    //DELETAR USUARIOS ON-LINE
                    


                    resolve()
                  })
                  .catch(()=>{
                    reject();
                  })
              })
              .catch(()=>{
                reject()
              }) 
            })
            .catch(err=>{
              reject(err)
            })
          })
        }
        else
        {
            //PROCESSO PARA FINALIZAR LOGIN DO NAVEGADOR
            this.fireAuth.auth.signOut()
            .then(()=>{
                this.storage.remove(STORAGE_NAME)
                .then(()=>{

                  //DELETAR USUARIOS ON-LINE
                  


                  resolve()
                })
                .catch(()=>{
                  reject();
                })
            })
            .catch(()=>{
              reject()
            }) 
        }
      })
      

       
    })
    
  }

  getAuth()
  {
    return this.fireAuth.auth;
  }

  

  setToken(dadosUser:Itseguserlogado): Promise<Boolean>
  {
    return new Promise((resolve, reject) => {
      let JsonRetorno = JSON.stringify(dadosUser);

      let encryptData = CryptoJS.AES.encrypt(JsonRetorno,STORAGE_PWD).toString();
      
      
      
      this.storage.set(STORAGE_NAME,encryptData)
      .then(retStore=>{
        this.globalUser.dadosLogado = dadosUser;
        console.log('Security success...');
        resolve(true);
      })
      .catch(err=>{
        console.log('Security error...'+err);
        reject(err);
      })
    })
  }

  getUserDados(usuarioUid:string,empresaUid:string):Promise<any> {

    return new Promise((resolve, reject) => {
      console.log(usuarioUid, empresaUid);
        this.DB.collection(empresaUid).doc('dados').collection('usuarios',ref=> ref.where('userUid','==',usuarioUid)).get().forEach(element=>{
          
          if(element.size == 1)
          {
            element.docs.forEach(dados=>{
              
            const id = dados.id;
            const data = dados.data();
            const datareturn = {id,... data}
            console.log(datareturn);
            resolve({situacao:'suc',code:0,msg:'Processado com sucesso.',data:datareturn})
            })
          }
          else
          {
            reject({situacao:'err',code:0,msg:'Houve um conflito na indentificacao do contato. '+usuarioUid})
          }
        })
    })
    
  }
  getEmpDados(empresaUid:string):Promise<any> {

    return new Promise((resolve, reject) => {
    
        this.DB.collection('EmpControle',ref => ref.where('empresaUid','==',empresaUid)).get().forEach(element=>{

          if(element.size == 1)
          {
            element.docs.forEach(dados=>{
              const id = dados.id;
              const data = dados.data()
              const datareturn = {
                id,
                ... data
              }
              resolve({situacao:'suc',code:0,msg:'Processado com sucesso.',data:datareturn})
            })  
            
          }
          else
          {
            reject({situacao:'err',code:0,msg:'Nao foram encontrado dados ('+empresaUid+')'})
          }
         
          

         
        })
    })
    
  }
  getEmpDadosConfAtendimento(empresaUid:string):Promise<any> {

    return new Promise((resolve, reject) => {
        console.log('2->'+1)
        this.DB.collection(empresaUid).doc('dados').collection('configuracao').doc('atendimento').get().forEach(element=>{
          if(element.exists)
          { 
            console.log('2->'+2)
           
            const data = element.data();
            resolve(data)
          }
          else
          {
            console.log('2->'+3)
            reject({situacao:'err',code:0,msg:'Nao foram encontrado dados de configuraao do atendimento  ('+empresaUid+')'})
          }
         
          

         
        })
    })
    
  }
  setCurrentUser(idCliente:string,empresa:string): Promise<Boolean>
  {
    return new Promise((resolve, reject) => {
      try
      {

        console.log('1->'+1)
        //CONSULTAR DADOS DO USUARIO PARA LOGIN E PEGAR AS CONFIGURACOES DO USUARIO
        this.getUserDados(this.fireAuth.auth.currentUser.uid,idCliente)
        .then(resUser=>{
         
          this.getEmpDados(idCliente)
          .then(resEmp=>{
           
              //GET DADOS CONF ATENDIMENTO 
              this.getEmpDadosConfAtendimento(idCliente)
              .then(resConfAtendimento=>{

                //DADOS CONF SEGURANCA
                let dadosConf = {}
                this.DB.collection(idCliente).doc('dados').collection('configuracao').doc('geral').get().subscribe(configGeral=>{
                  if(configGeral.exists)
                  {
                    dadosConf = configGeral.data();
                  }

                  //CONFINUANDO DADOS
                  //SETAR CONFIGURACOES DO USUARIO
                  const dadosUser = {
                    empresa,
                    idCliente,
                    nome:this.fireAuth.auth.currentUser.displayName,
                    photo:this.fireAuth.auth.currentUser.photoURL,
                    uid:this.fireAuth.auth.currentUser.uid,
                    email:this.fireAuth.auth.currentUser.email,
                    configEmpresa:resEmp.data || {},
                    configUser:resUser.data || {},
                    confEmpAtendimento:resConfAtendimento,
                    confSeguranca:dadosConf
                  };

                
                  
                  this.checkOnline(dadosUser).catch((err3)=>{
                    console.log('falha no processo de login  '+err3);
                  });

                  this.globalUser.dadosLogado = dadosUser;
                  this.storage.remove(STORAGE_NAME)
                  .then(resDelete=>{
                  console.log('TOKEN CLEAR')
                    this.setToken(dadosUser)
                    .then(res=>{
                      resolve(res);
                    })
                    .catch(err=>{
                      reject(err);
                    })
                  })
                  .catch(err=>{
                    reject(err);
                    console.log('ERRO TOKEN')
                  })

                })
                
                
               

                
              })
              .catch(errConfAtend=>{
                reject(errConfAtend);
                console.log('Falha no processo de verificacao das configuracoes de atendimento ')
              })

              
          })
          .catch(err=>{
            console.log('1->'+3)
            console.log(err)
            this.design.presentToast(
              'Houve um problema ao processar sua solicitação',
              'danger',
              0,
              true
            )
            reject()
          })

        })
        .catch(err=>{
          
          console.log(err)
          this.design.presentToast(
            'Houve um problema ao processar sua solicitação',
            'danger',
            0,
            true
          )
        })
      }
      catch(err)
      {
        console.log('[Err] Problema ao preparar dados do user logado '+err);
        resolve(false);
      }
      

    })
    


  }
  
  getCUrrentUser(): Promise<any>{
    return new Promise((resolve, reject) => {
      
      let dadosLogado = this.globalUser.dadosLogado
      if(!dadosLogado)
      {
        //NAO EXISTE
        console.log('Não existem observalble');
        let dados2 = '';
        this.storage.get(STORAGE_NAME).then((data) => {
        
          let bytes =  CryptoJS.AES.decrypt(data,STORAGE_PWD);
          let dados =  JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          this.globalUser.PrencherInfosUsuario(dados);
        
          dados2 =  dados 
         
         
      
        })
        .catch((err) =>{
          console.log(err)
          reject();
        })
        .finally(()=>{
          console.log('DAdos carregados ');
      
          resolve(dados2);
        });
      }
      else
      {
        //EXISTE
        console.log('Recuperar dados do observalhe');
        resolve(dadosLogado)
      }

      
    })
    
  }

  recuperarSenha(user:Ituserrecuperar)
  {
    return this.fireAuth.auth.sendPasswordResetEmail(user.email);
  }

  async checkOnline(dados:any) {
    const vOnline = await this.DB.firestore.collection('usuariosonline').where('uid','==',this.fireAuth.auth.currentUser.uid).get();
    if(!vOnline.empty) {

      for(const userOnline of vOnline.docs) {
        await this.DB.firestore.collection('usuariosonline').doc(userOnline.id).set({conectado:false},{merge:true});

        await this.DB.firestore.collection('usuariosonline').doc(userOnline.id).delete();
      }
    }

 
   
    return await this.DB.firestore.collection('usuariosonline').add(dados);
  }

  getOnline() {
    return this.DB.collection('usuariosonline', ref => ref.where
    ('userUid','==',this.fireAuth.auth.currentUser.uid)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as ItOnline;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  async deleteOnline(userOnlineUid:string) {
    // await this.DB.firestore.collection('usuariosonline').doc(userOnlineUid).set({conectado:false},{merge:true});

    await this.DB.firestore.collection('usuariosonline').doc(userOnlineUid).delete();
  }

 
}
