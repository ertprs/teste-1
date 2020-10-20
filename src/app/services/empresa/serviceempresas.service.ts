import { resolve } from 'url';
import { environment } from './../../../environments/environment';

import { Itusercadastro } from './../../interface/seguranca/itusercadastro';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { BancoService } from 'src/app/services/financeiro/configuracoes/banco.service';
import { Itbanco } from 'src/app/interface/financeiro/configuracoes/itbanco';

@Injectable({
  providedIn: 'root'
})
export class ServiceempresasService {

  private dadosBanco: Itbanco = {};

  constructor(

    private DB:AngularFirestore,
    private bancoService:BancoService
  ) { }
    
  CadDepUserEmpresas(dados:Itusercadastro): Promise<Boolean>
  {
    return new Promise((resolve, reject) => {
      //CRIAR PRIMEIRO CADASTRO DA EMPRESA
      const empresa = {
        nome:dados.nomeempresa
       
      }
      
 
      //CDASTRAR DEPENDENCIAS DO USUARIO CMO EMPRESA
      this.DB.collection('users').doc(dados.uid).collection('empresas').add(empresa)
      .then((res)=>{
        let empresaUid = res.id
        let dadosUsuarioEmpresa = {

          createAt:new Date().getTime(),
          userUid:dados.uid,
          userNome:dados.nome

        }
        this.DB.collection(empresaUid).doc('dados').collection('usuarios').add(dadosUsuarioEmpresa)
        .then((res2)=>{

          const dadosConf = {
            LibCanaisEmail:false,
            LibCanaisFecebook:false,
            LibCanaisTelegram:false,
            LibCanaisWPP:false,
            liveChat:false,
            qtdCanais:0,
            qtdUsuariosCad:1,
            qtdUsuariosLimit:1,
            multiEmpresa:false
          }
          
          this.DB.collection(empresaUid).doc('dados').collection('configuracao').doc('ge').set(dadosConf)
          .then(res4=>{

            this.DB.collection('baseapoio').doc('contadores').ref.get().then(res5=>{
              console.log('CONTADOR');
              console.log(res5.data());
              const contador = res5.data();
              this.dadosBanco.codBanco = '999';
              this.dadosBanco.nome = 'Lara Checkout';
              this.dadosBanco.ag = '1';
              this.dadosBanco.conta = contador.laracheckout.toString();
              this.dadosBanco.contaDigito = '0';
              this.dadosBanco.ativo = true;
              this.dadosBanco.padrao = true;
              this.dadosBanco.isIntegracao = true;
              this.dadosBanco.isIntegracaoData = JSON.stringify({
                cod: 1,
                nome: 'boletoCloud',
                keyCode: 'api-key_VH9rGxUDdrhldvRRst2AzUXoNdEOnGW4SZYVkWLg1QY=',
                tipoProcesso: 2
              });

              this.bancoService.add(this.dadosBanco).then((res)=>{
                console.log('BANCO BOM');
                console.log(res);
                resolve(true);
              }).catch(err4=>{
                console.log('BANCO RUIM');
                console.log(err4)
                resolve(false);
              })
            }).catch(err5=>{
              console.log(err5);
              resolve(false);
            })
            
          })
          .catch(err3=>{
            console.log(err3)
            resolve(false);
          })

          
        })
        .catch((err)=>{
          resolve(false)
        })
        
      })
      .catch((err)=>{
        resolve(false)
      })





     


      

    })
  }


  CadDepUserEmpresasAdicional(empresaUid:string,dados:Itusercadastro): Promise<Boolean>
  {
    return new Promise((resolve, reject) => {
      //CRIAR PRIMEIRO CADASTRO DA EMPRESA
      const empresa = {
        nome:dados.nomeempresa
       
      }
      
 
      //CDASTRAR DEPENDENCIAS DO USUARIO CMO EMPRESA
      this.DB.collection('users').doc(dados.uid).collection('empresas').doc(empresaUid).set(empresa)
      .then((res2)=>{
       


        let dadosUsuarioEmpresa = {

          createAt:new Date().getTime(),
          userUid:dados.uid,
          userNome:dados.nome

        }
        this.DB.collection(empresaUid).doc('dados').collection('usuarios').add(dadosUsuarioEmpresa)
        .then((res2)=>{
          resolve(true)
        })
        .catch((err)=>{
          resolve(false)
        })
        
      })
      .catch((err)=>{
        resolve(false)
      })





     


      

    })
  }
}
