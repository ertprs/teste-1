const querystring = require('querystring');
const request = require('request');
const fetch = require("node-fetch");
import * as admin from 'firebase-admin';
import { db } from '../index';

import * as fs from 'fs';
import Email from './email';
import Apoio from './apoio';
import Chat from './chat';
import Log from './log';


const Financeiro = {
  async gerarBoletoSicrediAPIIMPRIMIR(key:string,dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      console.log("************* COMECAR IMPRESSAO DO BOLETO")
      const url =  "https://cobrancaonline.sicredi.com.br/sicredi-cobranca-ws-ecomm-api/ecomm/v1/boleto/impressao?agencia=0726&cedente=02107&posto=42&nossoNumero="+dados.nossoNumero;
          const options = {
              method: 'GET',
              qs: {
                agencia: '0726',
                cedente: '02107',
                posto: '42',
                nossoNumero: dados.nossoNumero
              },
              headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'token': key
              }
          };
      
          fetch(url,options).then((response:any)=>{
              console.log('Estagio 1')
              console.log(JSON.stringify( response))
              const { status } = response;
              response.json().then((data:any)=>{
                  console.log('Estagio 2')
                  console.log(JSON.stringify(data))
                  if(status === 200) {
                      console.log('Estagio 3')

                      //DOWNLOAD DO BOLETO

                      resolve(data)
                  }
                  else
                  {
                      console.log('Estagio 4')
                      let msg = "Falha 2|  "+status
                      console.log(msg)
                      reject(msg)
                  }
              })
              .catch((err:any)=>{
                  console.log('Estagio 5')
                  let msg = "Falha 1|  "+err
                  console.log(msg)
                  reject(msg)
              })
        })



    })
  },
  async GerarChave():Promise<any>
  {
    return new Promise((resolve,reject)=>{
      db.collection('controlesLara').doc('chaveBanco').get()
      .then(elemChave=>{  
        if(elemChave.exists)
        {
          //const data = <any>elemChave.data()
          //let dataCreate = data.createAt
          //let dataCriacao = new Date(data * 1000)
        }
        else
        {
          reject('Não existe uma coleção de chave de banco')
        }
  
      })
      .catch(errChave=>{
        reject('Não foi possivel abrir conleçao de controles')
      })
    })
   
  },
  async gerarBoletoSicrediAPI(dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{

      db.collection(dados.empresaUid).doc('dados').collection('parceiros').doc(dados.parceiroUid).get().then(element=>{
        if(element.exists)
        {
          let dadosParceiro   = <any>element.data()
          
          let EmitenteCNPJ = ""
          let EmitentaNome = ""
          ///QmPJcDIMLJBshGe9LDv2/dados/configuracao/empresa
          db.collection(dados.empresaUid).doc('dados').collection('configuracao').doc('empresa').get()
          .then(resEmpresa=>{

            let RetdadosEmpresa = <any>resEmpresa.data()
            EmitenteCNPJ = RetdadosEmpresa.cnpj
            EmitentaNome = RetdadosEmpresa.razaoSocial


            let tipoPessoa = "2"
            let numeroControleInterno =  Apoio.gera_id(8)
            const vencimento0 = new Date(dados.vencimento)
            const vencimento1 = Apoio.pad( vencimento0.getDate(),2)+"/"+Apoio.pad((vencimento0.getMonth()+1),2)+'/'+vencimento0.getFullYear()

            if(dadosParceiro.documento.length < 12)
            {
              tipoPessoa = "1"
            }
            let enderecoCompleto =  dadosParceiro.endereco.endereco+", "+dadosParceiro.endereco.numero
            let JsonSend = {
              agencia: "0726",
              posto: "42",
              cedente: "02107" , 
              tipoPessoa,
              cpfCnpj: dadosParceiro.documento,
              nome: dadosParceiro.razaoSocial.substring(0,40),
              cep: dadosParceiro.endereco.cep,
              endereco:enderecoCompleto.substring(0,40),
              cidade: dadosParceiro.endereco.cidade ,
              uf: dadosParceiro.endereco.estado ,
              telefone: dadosParceiro.contato.telefone,
              email:dadosParceiro.contato.email,
              especieDocumento: "B",
              codigoSacadorAvalista: "000" ,
              seuNumero: numeroControleInterno,
              dataVencimento: vencimento1 ,
              valor: dados.valor_principal,
              tipoDesconto: "A",
              valorDesconto1: 0,
              dataDesconto1: "",
              valorDesconto2: 0,
              dataDesconto2: "",
              valorDesconto3: 0,
              dataDesconto3: "",
              tipoJuros: "B" ,
              juros: 0,
              descontoAntecipado: 0,
              mensagem: "Esta cobrança foi emitida por CNPJ: "+EmitenteCNPJ+" Razão Social "+EmitentaNome, 
              codigoMensagem: "",
              
              informativo: ""
            }


            db.collection('controlesLara').doc('chaveBanco').get()
            .then(resDadosBanco=>{
              console.log('Estagio inicial')
              if(resDadosBanco.exists)
              {
                const dadosChaveBanco = <any>resDadosBanco.data()
                let key  = dadosChaveBanco.key;//"5AC55072CD8112AF17140F739B54D7F31E003AE287AC38E9AF1FF044D1D08209"

                const url =  "https://cobrancaonline.sicredi.com.br/sicredi-cobranca-ws-ecomm-api/ecomm/v1/boleto/emissao";
                const options = {
                    method: 'POST',
                    body: JSON.stringify(JsonSend),
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'token': key
                    }
                };
            
                fetch(url,options).then((response:any)=>{
                    console.log('Estagio 1')
                    console.log(JSON.stringify( response))
                    const { status } = response;
                    response.json().then((data:any)=>{
                        console.log('Estagio 2')
                        console.log(JSON.stringify(data))
                        if(status === 201) {
                            console.log('Estagio 3')
      
                            //IMPRIMIR BOLETO
                            Financeiro.gerarBoletoSicrediAPIIMPRIMIR(key,data)
                            .then(resImprimir=>{
      
                              //UPAR BOLETO PARA S3
                              const filename = 'boleto_'+data.nossoNumero+'_'+Math.random().toString(16).slice(2)+'.pdf';
                              console.log(filename)
                              const bucket = admin.storage().bucket();
                              const destination = dados.empresaUid+'/docFinanceiro/boleto/'+filename;
                              console.log(destination)
                              const file = bucket.file(destination);
                              console.log("**** ENVIANDO ARQUIVO *********")
                              console.log(resImprimir.arquivo)
                              console.log('********************************')
                              const pdfBuffer = Buffer.from(resImprimir.arquivo, 'base64');
                              file.save(pdfBuffer,{metadata: {contentType: 'application/pdf',metadata: {custom: 'metadata'},public: true},
                              }, err => {
                                if (err) {
                                  console.log('Flha no Upload | '+err)
                                  reject(err)
                                }
      
                                file.getSignedUrl({
                                  action: 'read',
                                  expires: '03-17-2025'
                                }).then(resUploaded=>{
                                  console.log('URL')
                                  console.log(resUploaded)
                                  const dadosRetorno ={
                                    data,
                                    url:resUploaded[0],
                                    numeroControleInterno
                                  }
                                  resolve(dadosRetorno)
                                })
                                .catch(errUploaded=>{
                                  console.log('falha ao recuperar url | '+errUploaded)
                                  reject(errUploaded)
                                })
                                
                              })
      
                              
      
      
      
                              //AQUI
                              
      
      
                            })
                            .catch(errImprimir=>{
                              console.log('Falha ao imprimir boleto')
                              reject(errImprimir)
                            })
                            
                        }
                        else
                        {
                            console.log('Estagio 4')
                        
                            let msg = "Falha |  "+data.codigo+" | "+data.mensagem+" | "+data.parametro
                            console.log(msg)
                            reject(msg)
                        }
                    })
                    .catch((err:any)=>{
                        console.log('Estagio 5')
                        const mensagem = response.mensagem
                        const param    = response.parametro
                        let msg = "Falha 1|  "+err+" | "+mensagem+" | "+param
                        console.log(msg)
                        reject(msg)
                    })
              })
      
      
              }
              else
              {
                let msg = 'Documento de chave vazio'
                console.log(msg)
                reject(msg)
              }
            })
            .catch(errBanco=>{
              let msg = 'Falha ao recuperar dados de chaveBanco | '+errBanco
              console.log(msg)
              reject(msg)
            })




          })
          .catch(errEMpresa=>{
            console.log('FAlha ao recuperar dados da empresa ')
            reject('Não foi encontrado dados do parceiro')
          })


          

         

        }
        else
        {
          reject('Não foi encontrado dados do parceiro')
        }
      })
      .catch(errDadosParceiro=>{
        let msg = 'Falha ao resgatar dados do parceiro | '+errDadosParceiro
        console.log(msg)
        reject(msg)
      })

      //FECHANDO PROMISSE
    })

      

  },
  async CriarBoletoCheckout(params:any) :Promise<any>{
    const dados = params;
    return new Promise((resolve, reject) => {

      console.log('############################# INICIO CRIAR BOLETO  #############################');


      try {
        // PRODUCAO BANCO SICREDI, NÂO SABIA AO CERTO QUAL O DA LARA
        const token_user = "api-key_TaY8cPHIG_E3ZoWJ77BuGok6eMWV0cafSBs5X4GkWR8=";
        const url = "https://app.boletocloud.com/api/v1/boletos";
        
        const dadosParceiro   = {
          documento:dados.documento,
          cep:dados.cep,
          nome:dados.nome,
          logradouro:'RUA',
          bairro:dados.bairro,
          rua:dados.endereco,
          uf:dados.estado,
          numero:dados.enderecoN,
          complemento:dados.complemento

        }

        const dadosMsg = dados.dadosMsg
        //token da conta sicredi checkout 

        //TRATAR DESENVOLVIMENTO
        const vencimento0 = new Date(dados.vencimento)
        const vencimento1 = vencimento0.getFullYear()+'-'+Apoio.pad((vencimento0.getMonth()+1),2)+'-'+Apoio.pad( vencimento0.getDate(),2)
        let sequencial = Apoio.gera_id(8)
        const dadosFinanceiro = {
          sequencial,
          token:'api-key_R_xOejoKLixEAfr7xklpkoICeqr-vYP0tVoVO6xCwrc=',
          valor:dados.valor_principal,
          vencimento: vencimento1
        }
  
        const emissaoDate = new Date().toISOString().split('T').shift();
  
        let documento = dadosParceiro.documento;
        if(documento.length === 11) {
          documento = Apoio.mask(documento, '###.###.###-##');
        } else {
          documento = Apoio.mask(documento, '##.###.###/####-##');
        }
  
        const cep = Apoio.mask(dadosParceiro.cep, '#####-###');
          
        const form = {
          'boleto.conta.token': dadosFinanceiro.token,
          'boleto.documento': `LR${dadosFinanceiro.sequencial}`,
          'boleto.emissao': emissaoDate,
          'boleto.titulo': 'DMI',
          'boleto.pagador.cprf': documento,
          'boleto.pagador.nome': dadosParceiro.nome,
          'boleto.pagador.endereco.logradouro': dadosParceiro.logradouro,
          'boleto.pagador.endereco.bairro': dadosParceiro.bairro,
          'boleto.pagador.endereco.localidade': dadosParceiro.rua,
          'boleto.pagador.endereco.uf': dadosParceiro.uf,
          'boleto.pagador.endereco.numero': dadosParceiro.numero,
          'boleto.pagador.endereco.cep': cep,
          'boleto.pagador.endereco.complemento': dadosParceiro.complemento,
          'boleto.valor': dadosFinanceiro.valor.toString(),
          'boleto.vencimento': dadosFinanceiro.vencimento,
          'boleto.instrucao': [
            dadosMsg.mensagem1,
            dadosMsg.mensagem2,
            ''
          ]
        };
        console.log(JSON.stringify( form));
        
        const formData = querystring.stringify(form);
        const contentLength = formData.length;
  
        const options = {
          method: 'POST',
          url,
          body: formData,
          encoding: null,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Accept': 'application/pdf',
            'responseType': 'application/pdf',
            'Content-length': contentLength,
            'Authorization': `Basic ${Buffer.from(token_user).toString('base64')}`
          }
        };
        const ext = 'pdf';
        const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
        const dest = `/tmp/${filename}`;
  
        let status = 400;
        const boletoData:any = {};
        request(options)
        .on("response", async (response:any) => {
          // You can add/remove/modify headers here
          status = response.statusCode;
          if(status === 201) {
            console.log('Processado na boleto cloud com sucesso ')
            boletoData.numeroControle = sequencial
            boletoData.token = await response.headers['x-boletocloud-token'];
            boletoData.nossoNumero = await response.headers['x-boletocloud-nib-nosso-numero'];
            boletoData.linhaDigitavel = await response.headers['x-boletocloud-linha-digitavel'];
          } else {
            // resolve({situacao:'err',code:0,msg:`Falha na requisição: status ${status}`});
            console.log('Falha no processamento na boleto cloud status '+status)
          }
        })
        .pipe(fs.createWriteStream(dest)).on('close', async () => {
          if(status === 201) {
            const bucket = admin.storage().bucket();
            const destination = `teste/${filename}`;
            const [file]:any = await bucket.upload(dest, {destination: destination});
            const [result] = await file.getSignedUrl({
              action: 'read',
              expires: '03-17-2025'
            });
            boletoData.url = result;

            const isBoletoRet = {
              isBoleto:true,
              situacaoCod:1,
              situacaoNome:'Autorizado',
              dadosBoleto:{
                url:boletoData.url,
                linhaDigitavel:boletoData.linhaDigitavel,
                identificador:boletoData.nossoNumero
              }
            
            }
            db.collection(dados.empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(dados.idDoc).set(isBoletoRet,{merge:true})
            .then(resUp=>{
              console.log('Dados do boleto atualizados com sucesso ')
            })
            .catch(errUp=>{
              console.log('Falha no processo de atualizacao boletos | '+errUp)
            })





            // Apoio.deleteTmpFolder('/tmp');
            resolve({situacao:'suc',code:0,msg:'Boleto gerado com sucesso', boletoData: boletoData});
          } else {
            const body = fs.readFileSync(dest);
            console.log(body);
            

            

            // Apoio.deleteTmpFolder('/tmp');
            reject({situacao:'err',code:0,msg:`Falha na requisição: status ${status} ${body}`});
          }
        });


      } catch(err) {
        console.log('Falha no processo de boleto | '+err)
        reject(err)
      }



    
    })
      
    
  
  },



  async boletoCloudCreate(params:any) {
    console.log('############################# INICIO #############################');
    const { financeiroData, parceiroData, bancoData } = params;
    try {
      // PRODUCAO BANCO SICREDI, NÂO SABIA AO CERTO QUAL O DA LARA
      const token_user = "api-key_TaY8cPHIG_E3ZoWJ77BuGok6eMWV0cafSBs5X4GkWR8=";
      const url = "https://app.boletocloud.com/api/v1/boletos";
      // const token_conta = 'api-key_V1Kx3CzT1UtpEdJHBmV1Iet4ZgyhTi-yf9kS8ZVcmEs=';

      //SANDBOX
      // const token_user = "api-key_MtMLKG36ObwJqu4zvBcrWl_GrLx2USUsebEhwLXwMQc=";
      // const url = "https://sandbox.boletocloud.com/api/v1/boletos";
      // const token_conta = 'api-key_VH9rGxUDdrhldvRRst2AzUXoNdEOnGW4SZYVkWLg1QY=';

      const emissaoDate = new Date().toISOString().split('T').shift();

      let documento = parceiroData.documento;
      if(documento.length === 11) {
        documento = Apoio.mask(documento, '###.###.###-##');
      } else {
        documento = Apoio.mask(documento, '##.###.###/####-##');
      }

      const cep = Apoio.mask(parceiroData.cep, '#####-###');
        
      const form = {
        'boleto.conta.token': bancoData.token,
        'boleto.documento': `LR${financeiroData.sequencial}`,
        'boleto.emissao': emissaoDate,
        'boleto.sequencial': financeiroData.sequencial,
        'boleto.titulo': 'DMI',
        'boleto.pagador.cprf': documento,
        'boleto.pagador.nome': parceiroData.nome,
        'boleto.pagador.endereco.logradouro': parceiroData.logradouro,
        'boleto.pagador.endereco.bairro': parceiroData.bairro,
        'boleto.pagador.endereco.localidade': parceiroData.rua,
        'boleto.pagador.endereco.uf': parceiroData.uf,
        'boleto.pagador.endereco.numero': parceiroData.numero,
        'boleto.pagador.endereco.cep': cep,
        'boleto.pagador.endereco.complemento': parceiroData.complemento,
        'boleto.valor': financeiroData.valor.toString(),
        'boleto.vencimento': financeiroData.vencimento,
        'boleto.instrucao': [
          'Atenï¿½ï¿½o! Nï¿½O RECEBER ESTE BOLETO.',
          'Este ï¿½ apenas um teste utilizando a API Boleto Cloud',
          'Mais info em http://www.boletocloud.com/app/dev/api'
        ]
      };
      console.log(form);
      
      const formData = querystring.stringify(form);
      const contentLength = formData.length;

      const options = {
        method: 'POST',
        url,
        body: formData,
        encoding: null,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Accept': 'application/pdf',
          'responseType': 'application/pdf',
          'Content-length': contentLength,
          'Authorization': `Basic ${Buffer.from(token_user).toString('base64')}`
        }
      };
      const ext = 'pdf';
      const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
      const dest = `/tmp/${filename}`;

      let status = 400;
      const getBoleto = new Promise(async (resolve:any,reject:any) => {
        try{
          const boletoData:any = {};
          await request(options)
          .on("response", async (response:any) => {
            // You can add/remove/modify headers here
            status = response.statusCode;
            if(status === 201) {
              boletoData.token = await response.headers['x-boletocloud-token'];
              boletoData.nossoNumero = await response.headers['x-boletocloud-nib-nosso-numero'];
              boletoData.linhaDigitavel = await response.headers['x-boletocloud-linha-digitavel'];
            } else {
              // resolve({situacao:'err',code:0,msg:`Falha na requisição: status ${status}`});
            }
          })
          .pipe(fs.createWriteStream(dest)).on('close', async () => {
            if(status === 201) {
              const bucket = admin.storage().bucket();
              const destination = `teste/${filename}`;
              const [file]:any = await bucket.upload(dest, {destination: destination});
              const [result] = await file.getSignedUrl({
                action: 'read',
                expires: '03-17-2025'
              });
              boletoData.url = result;

              // Apoio.deleteTmpFolder('/tmp');
              resolve({situacao:'suc',code:0,msg:'Boleto gerado com sucesso', boletoData: boletoData});
            } else {
              const body = fs.readFileSync(dest);
              console.log(body);

              // Apoio.deleteTmpFolder('/tmp');
              resolve({situacao:'err',code:0,msg:`Falha na requisição: status ${status} ${body}`});
            }
          });
        } catch(err) {
          resolve({situacao:'err',code:0,msg:`getBoleto: ${err.message}`});
        }
      });
      const procBoleto:any = await getBoleto;
      console.log(procBoleto);
      if(procBoleto.situacao === 'suc') {

        const vBoleto = procBoleto.boletoData;
        
        return {situacao:'suc',code:0,msg:'Boleto gerado com sucesso', boletoData: vBoleto };
        
      } else {
        
        return {situacao:'err',code:0,msg: `attBoleto(2): ${procBoleto.msg}`};
        
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },
  async lancamentoCriar(empresaUid:string,vencimento:number,idReq:string,dadosReq:any):Promise<any> 
  {
    
  
    console.log(JSON.stringify(dadosReq))
    return new Promise((resolve, reject) => {
    
      const dadosFinanceiro = {
        createAt: new Date().getTime(),
        empresaUid,
        c_d:"credito",
        tipoLancamentoCod:"",
        tipoLancamentoNome:"",
        classificacaoUid:"",
        classificacaoNome:"",
        classificacaoDreFiltro:"",
        classificacaoEsfera:"",
        parceiroUid:"",
        valor_principal:dadosReq.dadosOperacao.valor,
        valor_desconto:dadosReq.dadosOperacao.desconto,
        valor_juros:dadosReq.dadosOperacao.juros,
        vencimento,
        bancoUid:"",
        bancoNome:"",
        isPago:false,
        isBoleto:false,
        tipoRegistroCod:1,
        tipoRegistroNome:"Individual",
        situacaoCod:0,
        situacaoNome:"Pendente",
        isCartao:false,
        isIntegracoes:true,
        identCliente:dadosReq.dadosConf.identInterno,
        isIntegracoesData:{
          acaoCod:2,
          acaoNome:"Acionamento webHook",
          identificacao:dadosReq.dadosConf.identInterno,
          endPoint:dadosReq.dadosConf.campainha
        },
        moeda:{
          origemCod:1,
          origemNome:"Real",
          finalCod:0,
          finaNome:"",
          valorConversao:0

        },
        libBoleto:true,
        libCartao:false,
        ... dadosReq.pagador
        


      }
      
      
      
      console.log('Criar na colecao de ->'+empresaUid+'<-')
      console.log(JSON.stringify(dadosFinanceiro))
      db.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').add(dadosFinanceiro)
      .then((resAdd=>{
        console.log('Add financeiro  com sucesso')
        
        resolve(resAdd.id)

        
      }))
      .catch(err=>{
        console.log('Falha ao inserir financceiro   '+err)
        
        reject('Falha ao incluir registro de lancamento ')
      })


    })
   
    
    



  },
  async lancamentoCreate(params: any) {
    try {
      const { empresaUid, lancamentoUid, c_d, parceiroUid, valor_principal, vencimento, bancoUid, libBoleto, classificacaoUid,tipoLancamentoCod } = params;

      const vContador:any = await db.collection('baseapoio').doc('contadores').get();
      if (vContador.exists) {

        const { lancamento } = vContador.data();

        await db.collection('baseapoio').doc('contadores').set({lancamento: admin.firestore.FieldValue.increment(1)},{ merge: true });

        const financeiroData = {
          id: lancamentoUid,
          c_d,
          valor: valor_principal,
          vencimento,
          sequencial: lancamento.toString()
        };

        const vBanco:any = await db.collection(empresaUid).doc('dados').collection('financeiro').doc('configuracoes').collection('bancos').doc(bancoUid).get();
        if (vBanco.exists) {
        
          const { isIntegracao, isIntegracaoData } = vBanco.data();

          const vParceiro:any = await db.collection(empresaUid).doc('dados').collection('parceiros').doc(parceiroUid).get();
          if (vParceiro.exists) {
            
            const { nome, documento, logradouro, bairro,rua,uf,numero,cep,complemento } = vParceiro.data();

            const parceiroData = {
              nome,
              documento,
              logradouro, 
              bairro,
              rua,
              uf,
              numero,
              cep,
              complemento
            };

            const uLancamento:any = {
              parceiroNome: parceiroData.nome,
              bancoNome: vBanco.data().nome,
              sequencial: lancamento.toString()
            };

            if(tipoLancamentoCod === 1) {
              const vClassificacao:any = await db.collection(empresaUid).doc('dados').collection('financeiro').doc('configuracoes').collection('tipoimpostos').doc(classificacaoUid).get();
              if (vClassificacao.exists) {
                uLancamento.classificacaoNome = vClassificacao.data().nome;
                uLancamento.classificacaoDreFiltro = vClassificacao.data().dreFiltro;
                uLancamento.classificacaoEsfera = vClassificacao.data().esfera;              
              }
            } else {
              const vClassificacao:any = await db.collection(empresaUid).doc('dados').collection('financeiro').doc('configuracoes').collection('categorias').doc(classificacaoUid).get();
              if (vClassificacao.exists) {
                uLancamento.classificacaoNome = vClassificacao.data().nome;
                uLancamento.classificacaoDreFiltro = vClassificacao.data().dreFiltro;
                uLancamento.classificacaoEsfera = '';              
              }
            }

            await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(financeiroData.id).set(uLancamento,{ merge: true });

            if(libBoleto && isIntegracao) {

              const bancoData = {
                token: JSON.parse(isIntegracaoData).keyCode
              };

              const vBoleto = await Financeiro.boletoCloudCreate({ financeiroData, parceiroData, bancoData })
              if(vBoleto.situacao === 'suc') {

                const updateLancamento = { 
                  isBoleto: true, 
                  isBoletoData: JSON.stringify({ 
                    url: vBoleto.boletoData.url, 
                    nossoNumero: vBoleto.boletoData.nossoNumero, 
                    linhaDigitavel: vBoleto.boletoData.linhaDigitavel
                  }),
                  situacaoCod: 1,
                  sequencial: lancamento.toString()
                };

                await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(financeiroData.id).set(updateLancamento,{ merge: true });

                return {situacao:'suc',code:0,msg:'lançamentos processado com sucesso' };
              } else {
                await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(financeiroData.id).set({situacaoCod: 6, errorMsg: `${vBoleto.msg}`},{ merge: true });

                return {situacao:'err',code:0,msg:`vBoleto err: ${vBoleto.msg}`};
              }
            } else {
              await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(financeiroData.id).set({situacaoCod: 6, errorMsg: `Banco não possui integração`},{ merge: true });

              return {situacao:'err',code:0,msg:`Banco não possui integração`};
            }
          } else {
            await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(financeiroData.id).set({situacaoCod: 6, errorMsg: `${vParceiro.message}`},{ merge: true });

            return {situacao:'err',code:0,msg:`vParceiro err: ${vParceiro.message}`};
          }
          
          
        } else {
          await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(financeiroData.id).set({situacaoCod: 6, errorMsg: `${vBanco.message}`},{ merge: true });

          return {situacao:'err',code:0,msg:`vBanco err: ${vBanco.message}`};
        }
      } else {
        await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(lancamentoUid).set({situacaoCod: 6, errorMsg: `vContador err: ${vContador.message}`},{ merge: true });

        return {situacao:'err',code:0,msg:`vContador err: ${vContador.message}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`lancamentoCreate err: ${err.message}`};
    }
  },

  async bancoCreate(params: any) {
    try {
      const { codBanco } = params;

      if(codBanco === '999') {
        await db.collection('baseapoio').doc('contadores').set({laracheckout: admin.firestore.FieldValue.increment(1)},{ merge: true });

        return {situacao:'suc',code:0,msg:'Contador processado com sucesso' };
      } else {
        return {situacao:'err',code:0,msg:`codBanco err: ${codBanco}`};
      }    

    } catch(err) {
      return {situacao:'err',code:0,msg:`bancoCreate err: ${err.message}`};
    }
  },

  async cobrancaSend(params: any) {
    try {
      const { empresaUid, lancamentoUid } = params;

      const vLancamento:any = await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').doc(lancamentoUid).get();
      if (vLancamento.exists) {
        const { situacaoCod, isBoleto, isBoletoData, parceiroUid, valor_principal, vencimento, sequencial } = vLancamento.data();

        const vContatos = await db.collection(empresaUid).doc('chat').collection('contatos').where('uidClienteVinculado', '==', parceiroUid).get();
        if (!vContatos.empty) {

          for (const doc of vContatos.docs) {
            const { photo, nome, canal, favorito, origem, nomeClienteVinculado, uidClienteVinculado, email } = doc.data();
            const idContato = doc.id;

            const contatoData = {
              uid: idContato,
              photo,
              nome,
              canal,
              favorito,
              origem,
              nomeClienteVinculado, 
              uidClienteVinculado,
              email,
              notificacaoEmail: true,
              notificacaoMsg: true
            };

            if((situacaoCod === 1 || situacaoCod === 4) && isBoleto) {

              console.log('Boleto elegivel');

              const boletoData:any = JSON.parse(isBoletoData);

              const formatDt = Apoio.date(0);
              const formatValor = `R$ ${Apoio.jsNumberFormat(valor_principal, 2, '.', ',')}`;
              const formatLink = `<a target="_blank" href="${boletoData.url}">${boletoData.url}</a>`;
              const formatVencimento = Apoio.date(vencimento);

              const vEmail = await Email.getTemplate({ empresaUid, template: 'cobranca' });
              console.log(vEmail);
              if(vEmail.situacao === 'suc') {
                const emailData:any = vEmail.dados;

                let assunto = emailData.assunto;
                assunto = assunto.replace('{{id}}',sequencial);

                let corpo = emailData.corpo;
                corpo = corpo.replace('{{data}}',formatDt);
                corpo = corpo.replace('{{cliente_nome}}',contatoData.nome);
                corpo = corpo.replace('{{doc_vencimento}}',formatVencimento);
                corpo = corpo.replace('{{doc_valor}}',formatValor);
                corpo = corpo.replace('{{link}}',formatLink);
                corpo = corpo.replace('{{empresa_emitente}}','');

                if(contatoData.notificacaoEmail) {
                  
                  const emailsDestino:any = [contatoData.email];
                  const anexos = [boletoData.url];

                  const iSendMail = await Email.sendMail({ emailsDestino, assunto, mensagem: corpo, anexos });

                  await Log.logInsert({ empresaUid, categoria: 'financeiro', processoUid: lancamentoUid, data: JSON.stringify({ emailsDestino, assunto, mensagem: corpo, anexos }), mensagem: iSendMail.msg });
                  
                }

                if(contatoData.notificacaoMsg) {

                  const json: any = {
                    mensagem: Apoio.removeHtml(corpo),
                    anexo: '',
                    canal: contatoData.canal,
                    citacao: '',
                    legenda: '',
                    createAt: new Date().getTime(),
                    es: 's',
                    tipo: 'texto',
                    autorNome: contatoData.nome,
                    autorUid: contatoData.uid,
                    contatoNome: contatoData.nome,
                    contatoOrigem: contatoData.origem,
                    contatoUid: contatoData.uid,
                    conversaUid: '',
                    enviadoTag: 1,
                    enviadoData: new Date().getTime(),
                    entregueTag: 0,
                    entregueData: new Date().getTime(),
                    usuarioUid: '',
                    usuarioNome: '',
                    photo: contatoData.photo
                  };

                  const iMsg = await Chat.mensagemAdd({ token:empresaUid, data: json });
                  
                  await Log.logInsert({ empresaUid, categoria: 'financeiro', processoUid: lancamentoUid, data: JSON.stringify(json), mensagem: iMsg.msg });

                  const json2: any = {
                    mensagem: '',
                    anexo: boletoData.url,
                    canal: contatoData.canal,
                    citacao: '',
                    legenda: '',
                    createAt: new Date().getTime(),
                    es: 's',
                    tipo: 'documento',
                    autorNome: contatoData.nome,
                    autorUid: contatoData.uid,
                    contatoNome: contatoData.nome,
                    contatoOrigem: contatoData.origem,
                    contatoUid: contatoData.uid,
                    conversaUid: '',
                    enviadoTag: 1,
                    enviadoData: new Date().getTime(),
                    entregueTag: 0,
                    entregueData: new Date().getTime(),
                    usuarioUid: '',
                    usuarioNome: '',
                    photo: contatoData.photo
                  };

                  const iMsg2 = await Chat.mensagemAdd({ token:empresaUid, data: json2 });
                  await Log.logInsert({ empresaUid, categoria: 'financeiro', processoUid: lancamentoUid, data: JSON.stringify(json), mensagem: iMsg2.msg });
                }
              }
            }
          }

          return {situacao:'suc',code:0,msg:'Cobrança enviado com sucesso' };
        } else {
          return {situacao:'err',code:0,msg:`vContato err`};
        }
      } else {
        return {situacao:'err',code:0,msg:`Boleto não estava elegível`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`cobrancaSend err: ${err.message}`};
    }
  },

  async cobrancaVerificar() {
    try {
      const rootCollection = await db.listCollections();
      for (const doc of rootCollection) {
        const empresaUid = doc.id;

        const vConfFinanceiro:any = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('financeiro').get();
        if (vConfFinanceiro.exists) {

          const { intervalo } = vConfFinanceiro.data();

          const vFinanceiro = await db.collection(empresaUid).doc('dados').collection('financeiro').doc('boletos').collection('lancamentos').where('situacaoCod','==',4).get();
          if (!vFinanceiro.empty) {
            for (const doc2 of vFinanceiro.docs) {

              const { vencimento } = doc2.data();

              const vencimentoDiff = Math.floor(new Date().getTime() / 86400000) - Math.floor(new Date(vencimento).getTime() / 86400000);
              const intervaloInt = intervalo;

              console.log(`VENCIMENTO: ${vencimentoDiff} INTERVALO: ${intervaloInt}`);
              
              if(vencimentoDiff > intervaloInt) {
                console.log(`BOLETO APTO PRA ENVIAR ${doc2.id}`);
                const iFinanceiro = await Financeiro.cobrancaSend({ empresaUid, lancamentoUid: doc2.id});
                console.log(iFinanceiro);
              } else {
                console.log(`BOLETO ERR: ${doc2.id}`);
              }
            }
          }
        }
      }

      return {situacao:'suc',code:0,msg:'Processo de cobrança realizado com sucesso' };
    } catch(err) {
      return {situacao:'err',code:0,msg:`cobrancaSend err: ${err.message}`};
    }
  },

};

export default Financeiro;