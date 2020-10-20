import Chat from './chat';
import Empresa from './empresa';
import Apoio from './apoio';
import CaixaEntrada from '../model/mysql/caixa_entrada'
import { db } from '../index';

import * as admin from 'firebase-admin';


const fetch = require("node-fetch");

const axios = require('axios');

const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('lara', 'laracf', 'asdasdasd77766ttghfYYYYrgfVV', {
    host: '10.86.160.3',
    dialect: 'mysql',
    pool: {
        max: 1,
        min: 0,
       
    }
});

const IaConfig  = sequelize.define('iaconfigs',{
  brainUid:{
      type:Sequelize.STRING
  },
  dadosConf:{
      type:Sequelize.STRING
  }
  
  
  

})
const Conversas  = sequelize.define('conversas',{
  conversaUid:{
      type:Sequelize.STRING
  },
  contatoNome:{
      type:Sequelize.STRING
  },
  createAt:{
      type:Sequelize.STRING
  },
  contatoUid:{
      type:Sequelize.STRING
  },
  
  empresaUid:{
      type:Sequelize.STRING
  },
  situacao:{
      type:Sequelize.INTEGER
  },
  body:{
      type:Sequelize.TEXT
  }
  

})


const Watson = {
  
  procTratarContextRecebido(origem:string,dadosWatson:any,dadosOrigem:any,qtdSaltos:number):Promise<any>
  {
    return new Promise((resolve, reject) => {
      if(origem === 'watson')
      {

        console.log('++++++++++++++++++++++++++++ procTratarContextRecebido Saldo ('+qtdSaltos+ ') ++++++++++++++++++++++++++++ '+dadosOrigem.dadosFluxo.brainProc)

        //console.log(JSON.stringify(dadosWatson))

        
        const context         = dadosWatson.context;



        //EXISTE MENSAGEM A SER ENTREGUE

        if(dadosWatson.hasOwnProperty('output'))
        {
          if(dadosWatson.output.hasOwnProperty('text'))
          {
            let mensagem = "";
            dadosWatson.output.text.forEach((element:any) => {
                mensagem = mensagem + element
            });
            //console.log('++++++++++++++++++++++++++++ START MENSAGEM RECEBIDA ('+qtdSaltos+') ++++++++++++++++++++++++++++ ')
            //console.log(mensagem)
            //console.log('++++++++++++++++++++++++++++ END MENSAGEM RECEBIDA ++++++++++++++++++++++++++++ ')


            //ENVIAR MENSAMGEM
            if(mensagem.trim().length > 0)
            {
              mensagem = mensagem.split('||').join('\n');

             

              const msgEntradaAdd = {
                contatoUid:dadosOrigem.dadosFluxo.contatoUid,
                autorNome:"Lara IA",
                autorUid:"99999",
                canal:dadosOrigem.dadosFluxo.canal,
                contatoOrigem:dadosOrigem.dadosFluxo.origemUid,
                time: new Date().getTime(),
                es:'s',
                idMensagem:0,
                mensagem,
                tipo:'texto',
                anexo:'',
                citacao:'',
                conversaUid:dadosOrigem.dadosFluxo.conversaUid,
                contatoNome:'Lara IA'
             
  
              }
              CaixaEntrada.addMensagem(dadosOrigem.empresaUid,msgEntradaAdd)
              .then(()=>{
                //CONTADOR DE GRAVACAO
                console.log('MEnsagem enviada para destinatario ')
                //UPDATE CONTROLES
                //ATUALIZAR DADOS DO PROCESSO 
                const dadosAtualizacao = {
                  dadosFluxo:dadosOrigem.dadosFluxo,
                  dadosMensagem:{
                    respostaIa:mensagem
                  },
                  dadosControle:{
                    update:admin.firestore.FieldValue.increment(1),
                    processoIaEfetivos:admin.firestore.FieldValue.increment(1),
                    gravacao:admin.firestore.FieldValue.increment(1),
                    situacao:0,
                    msg:'Processado com sucesso'
                  }
                }
                db.collection('caixa_entrada').doc(dadosOrigem.dadosControle.docUid).set(dadosAtualizacao,{ merge:true})
                
                .catch((errCaixa:any)=>{
                  console.log(errCaixa)
                  console.log('######################### FALHA AO INSEIR RESULTADO DA CAIXA DE ENTRADA (2) ######################### ')
                })



                
              })
              .catch(err=>{
                console.log('Falha ao adicionar mensagem de entrada no firebase ')
              })
            }
            


            
          }
        }


        //VERIFICAR ROBO
        if(context.hasOwnProperty('operacao_executa')) {
          if(context.operacao_executa === 'true') {

            if(context.hasOwnProperty('operacao_nome'))
            {
              
              console.log('***** Identificado robo '+context.operacao_nome)
              
               
           


              CaixaEntrada.tratarRobo(dadosWatson,dadosOrigem)
              .then(()=>{
              
              
                console.log('[=] Robo processado com sucesso ')
              })
              .catch(errRobo=>{
                console.log('[ERRR] Falha ao processar robo | '+errRobo)
              })
              //LIMPAR DADOS CONTEXT
              delete context.operacao_nome
              delete context.operacao_executa

              
            }

          }
        }


        //LIMPAR OPERACOES
        

        //VERIFICAR SE EXISTE SALDO
        if(context.hasOwnProperty('next_brain')) {
          //SETANDO NOVO BRAIN
          
          console.log('++++++++++++++++++++++++++++ DAR UM NOVO SALDO  ('+qtdSaltos+ ' ) DE '+dadosOrigem.dadosFluxo.brainProc +'  para  '+context.next_brain)
          dadosOrigem.dadosFluxo.brainProc = context.next_brain
          context.brainProc = context.next_brain
          //DELETAR DADOS DO SALDO
          delete context.next_brain
          
          const saltos = qtdSaltos+1
          const ProcessoWatson = {
              dados:dadosOrigem,
              body:context,
              saltos
          }
          console.log('&&&&&&&& NOVO PROCESSO &&&&&&&&&&&&&&& ')
          console.log(JSON.stringify(dadosWatson))
          console.log('&&&&&&&& NOVO PROCESSO &&&&&&&&&&&&&&& ')
          Watson.procMensagemNew(ProcessoWatson)
          .then(function(){
            
            
            resolve({saltos})
          })
          .catch(function(erroSaltoIa:any){
            let msg = 'Falha ao processar saldo de IA  | '+erroSaltoIa
            console.log(msg)
            reject(msg)
          })

        }
        else
        {
          //UNICO SALDO GRAVAR CONTEXTO NOVO
          console.log('++++++++++++++++++++++++++++ ATUALIZANDO TABELA DE CONVERSA ++++++++++++++++++++++++++++ ')
          Conversas.sync()
          .then(function(){
            Conversas.update(
              {body:JSON.stringify(context)},
              {where:{conversaUid:dadosOrigem.dadosFluxo.conversaUid}}
            )
            .then(function(){
              console.log('++++++++++++++++++++++++++++ TABELA ATUALIZADA COM SUCESSO  ++++++++++++++++++++++++++++ ')
              resolve({saltos:qtdSaltos})
            })
            .catch(function(errUpdate:any){
              let msg = 'Falha ao fazer update do context de conversa | '+errUpdate
              console.log(msg)
              reject(msg)
            })
          })
          .catch(function(erroConection:any){
            let msg = 'Falha ao se conectar a tabela conversas para atualizar json | '+erroConection
            console.log(msg)
            reject(msg)
          })


        }
    

        
      }
      else
      {
        reject('Tipo de origem nao conhecido | '+origem)
      }
    })
  },
  procMensagemNew(dados:any):Promise<any>
  {
    return new Promise((resolve, reject) => {
      
      

      const body = dados.body //DADOS CORPO WATSON
      const dadosRecebido = dados.dados //DADOS DO FLUXO DE CONVERSA
      const qtdSaltos = dados.saltos



     console.log('*********************** Salto ('+qtdSaltos+')  '+dadosRecebido.dadosFluxo.brainProc)
     

      //CHECK CONFIGURACOES
      IaConfig.sync()
      .then(function(){
        IaConfig.findAll({
            where:{
              brainUid:body.brainProc
                
            },
            limit:1
        })
        .then(function(resSelect:any){
          if(resSelect.length > 0)
          {
           
              const version = '2019-02-28';
              const dadosRetorno = resSelect[0]
              const configUsuario = JSON.parse(dadosRetorno["dadosConf"]) 
          
        

              const context = {
                cont_nao_entendeu : 0,
                operacao_confidence : configUsuario.confiabilidade,
                transfer_valid : '2',
                operacao_brain : configUsuario.brainUid,
                timezone : "America/Sao_Paulo",
                ... body
              }

              const json = {
                input: { text: dadosRecebido.dadosMensagem.mensagem },
                context
              };
              console.log('ˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆ JSON DE ENVIO PARA WATSON ˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆ  ')
              console.log(JSON.stringify(json))
              console.log('ˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆ JSON DE ENVIO PARA WATSON ˆˆˆˆˆˆˆˆˆˆˆˆˆˆˆ  ')
              const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${configUsuario.workId}/message?version=${version}`;
              console.log(url)
              let KeyRecuperada = configUsuario.key.split(':')
            
              
              const axiosOpcao =  {
              
                withCredentials: true,
               
                auth: {
                  username: KeyRecuperada[0],
                  password: KeyRecuperada[1]
                },
                headers: { 
                
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
              axios.post(url,JSON.stringify(json),axiosOpcao)
              
              
             
              .then(function(response:any){
              
                const dadosRetornados = response.data
                Watson.procTratarContextRecebido('watson',dadosRetornados,dadosRecebido,qtdSaltos)
                .then(resTratContext=>{
                
                  
                  resolve(resTratContext)
                })
                .catch(errTratContext=>{
                  let msg = "Problema ao tratar o contexto recebido | "+errTratContext
                  console.log(msg)
                  reject(msg)
                })
               
              })
              .catch(function(errCurl:any){
                let msg = "Problema ao chamar Watson nao responde |  "+errCurl
                console.log(msg)
                reject(msg)
              })


             

             
         
            
          }
          else
          {
            let msg = 'Não existem configuracoes ('+body.brainProc+') '
            console.log(msg)
            reject(msg)
          }
        })
        .catch(function(err:any){
          let msg = 'Falha ao consultar  com a tabela IaConfig | '+err
          console.log(msg)
          reject(msg)
        })
      })
      .catch(function(err:any){
        let msg = ' Falha ao conectar com a tabela iaconfigs | '+err
        console.log(msg)
        reject(msg)
      })

    
    })

  },
  async procMensagem(params: any): Promise<any> {

    const { token, mensagemData, context } = params;
    
    try {
    
      //ADD CONSUMO
      const consumoData = {
        createAt: new Date().getTime(),
        tipo: 'Processo IA',
        codetipo: 3,
        usuarioUid: '',
        msgtipo: mensagemData.tipo,
        mensagem: mensagemData.mensagem,
        laraProcesso: 2,
        laraResposta: '',
        consumoUid: mensagemData.consumoUid
      };
      const iConsumo = await db.collection(token).doc('dados').collection('consumo').add(consumoData);

      let apikey = 'apikey:l1wwpPbPxKL6pFuc8hm2j7xjoBqJ5B1kNuKAgXPPlka-';
      let workId = '5fe3e1a8-fbfd-46cd-95e8-11d8fdfa278b';
      let confidence = 0.85;
      let cont = 0;
      let brainId = 118;
      if(context.hasOwnProperty('apikey') && context.hasOwnProperty('workId') && context.hasOwnProperty('operacao_confidence') && context.hasOwnProperty('operacao_brain')) {
        apikey = context.apikey;
        workId = context.workId;
        confidence = context.operacao_confidence;
        cont = context.cont_nao_entendeu;
        brainId = context.operacao_brain;
      } else {
        //busca BD
        const vWatson:any = await Watson.credentialsGet({ token });
        if(vWatson.situacao === 'suc') {
          apikey = vWatson.dados.apikey;
          workId = vWatson.dados.workId;
          confidence = vWatson.dados.confidence;
          brainId = vWatson.dados.brainId;
        }
      }

      context.cont_nao_entendeu = cont;
      context.operacao_confidence = confidence;
      context.transfer_valid = '2';
      context.operacao_brain = brainId;
      context.timezone = "America/Sao_Paulo";

      const hashtags = Apoio.extractHashtags(mensagemData.mensagem);
      if(hashtags !== null && hashtags.length > 0) {
        context.operacao_sku = hashtags[0].replace('#','');
      }

      const version = '2019-02-28';

      const json = {
        input: { text: mensagemData.mensagem },
        context: context,
      };

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/message?version=${version}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();

      if(status === 200) {

        await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.conversaUid).set({ context: JSON.stringify(data.context) }, {merge: true});

        let mensagem = data.output.text.join('\n');
        mensagem = mensagem.split('||').join('\n');

        //CONSUMO ++ PROC RECEBIDA
        await db.collection(token).doc('dados').collection('consumo').doc(mensagemData.consumoUid).set({ laraProcesso: 1, qtdProc: admin.firestore.FieldValue.increment(1) } , { merge: true });
        //CONSUMO RESPOSTA PROC WATSON
        await db.collection(token).doc('dados').collection('consumo').doc(iConsumo.id).set({ laraProcesso: 1, laraResposta: mensagem } , { merge: true });

        //PROCESSAR INTENCAO
        if(data.hasOwnProperty('intents')) {

          if(data.intents.length > 0) {

            if(data.intents[0].hasOwnProperty('intent')) {

              const intent = data.intents[0].intent;

              let intentUid = intent.split('_').pop();
              let intentNome = intent.split('_').shift().toUpperCase();

              const updateIntent:any = {
                intencao: intentNome,
                intencaoUid: intentUid
              };

              if(mensagemData.conversaData !== undefined && mensagemData.conversaData !== '') {

                const _conversaData = JSON.parse(mensagemData.conversaData);
                
                _conversaData.context = JSON.stringify(data.context);
                if(_conversaData.intencao !== 'COMERCIAL') {
                  _conversaData.intencao = intentNome;
                }

                mensagemData.conversaData = JSON.stringify(_conversaData);
              }

              if(intentNome === 'COMERCIAL' || intentNome === 'FINANCEIRO' || intentNome === 'SUPORTE' || intentNome === 'CONTATO') {
                
                const vIntent:any = await db.collection(token).doc('dados').collection('aprendizado').doc(intentUid).get();
                if(vIntent.exists) {
                  const { valorOportunidade, titulo } = vIntent.data();
                  updateIntent.valor = valorOportunidade;
                  updateIntent.intencaoNome = titulo;
                }

                await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.conversaUid).set(updateIntent, {merge: true});

                await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.contatoUid).collection('mensagens').doc(mensagemData.uid).set(updateIntent, { merge: true });

              } else {
                
                if(workId === '5fe3e1a8-fbfd-46cd-95e8-11d8fdfa278b') {
                  intentUid = '99999';
                }

                await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.contatoUid).collection('mensagens').doc(mensagemData.uid).set({ intencao: intent, intencaoUid: intentUid, intencaoNome: 'laraBrain' } , { merge: true });
              }

              intentNome = 'laraBrain';
              const vAprendizado:any = await db.collection(token).doc('dados').collection('aprendizado').doc(intentUid).get();
              if (vAprendizado.exists) {
                intentNome = vAprendizado.data().titulo;
              }

              await db.collection(token).doc('dados').collection('aprendizado').doc('relatorios').collection('produtividade').doc(mensagemData.produtividadeUid).set({ processadoIA: true, intencaoIA: intent, intencaoIaUid: intentUid, intencaoIaNome: intentNome, ...mensagemData } , { merge: true });
            }
          }
        }

        if(data.context.hasOwnProperty('operacao_intencao')) {
          const vIntent:any = await db.collection(token).doc('dados').collection('aprendizado').doc(data.context.operacao_intencao).get();
          if(vIntent.exists) {
            const { valorOportunidade, produtoUid } = vIntent.data();
            
            console.log(`PRODUTO CHECK: ${produtoUid}`);
            if(produtoUid !== undefined && produtoUid !== '') {
              const vProduto:any = await db.collection(token).doc('dados').collection('produtos').doc(produtoUid).get();
              if(vProduto.exists) {
                const { sku, descricaoLonga } = vProduto.data();
                console.log(`INFO: ${sku} ${descricaoLonga}`);

                const updateIntent = {
                  valor:valorOportunidade,
                  produtoUid:produtoUid,
                  produtoSku:sku,
                  produtoDescricao:descricaoLonga,
                };
                await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.contatoUid).collection('mensagens').doc(mensagemData.uid).set(updateIntent, { merge: true });

                const vConversa:any = await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.conversaUid).get();
                if(vConversa.exists) {
                  const { produtosVisitados } = vConversa.data();

                  let arrayProdutos = [];
                  let adicionarProduto = true;
                  if(produtosVisitados !== undefined) {
                    arrayProdutos = produtosVisitados;

                    for(const produto of produtosVisitados) {
                      if(produto.sku === sku) adicionarProduto = false;
                    }
                  }
                  
                  if(adicionarProduto) {
                    arrayProdutos.push({ createAt: new Date().getTime(), ...vProduto.data() });

                    await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.conversaUid).set({ produtosVisitados: arrayProdutos },{ merge: true });
                  }
                }
              }
            }
          }
          
        }

        let transferir = false;
        let errorMsg = ``;
        let finalizar = false;
        
        if(data.context.hasOwnProperty('operacao_executa')) {
          if(data.context.operacao_executa === 'true') {
            errorMsg += `Transferência via Robo `;
            transferir = true;
          }
        }

        if(data.context.hasOwnProperty('operacao_finalizar')) {
          if(data.context.operacao_finalizar === 'true') {
            finalizar = true;
          }
        }

        if(data.context.hasOwnProperty('operacao_sinalizar_resposta')) {
          if(data.context.operacao_sinalizar_resposta === "positiva") {            
            await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.conversaUid).set({ interesse: 1 }, {merge: true});
              
            if(data.context.operacao_robo === undefined || data.context.operacao_robo === null) {
              errorMsg += `Resposta positiva e sem robo `;
              transferir = true;
            }
          } else if(data.context.operacao_sinalizar_resposta === "negativa") {
            await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.conversaUid).set({ interesse: 2 }, {merge: true});

            finalizar = true;
          }
        }

        if(data.context.hasOwnProperty('next_brain')) {

          const vWatson:any = await Watson.credentialsGet({ token, brainId: data.context.next_brain });
          if(vWatson.situacao === 'suc') {
            data.context.apikey = vWatson.dados.apikey;
            data.context.workId = vWatson.dados.workId;
            data.context.operacao_confidence = vWatson.dados.confidence;
          }
          
          delete data.context.system;
          delete data.context.next_brain;

          return await Watson.procMensagem({ token, mensagemData, context: data.context});

        } else {

          const msgCheck = mensagem.split('\n').join('');
          if(msgCheck === '') {
            
            return await Watson.transferirLiveChat({ token, errorMsg: `mensagem vazia`, data: mensagemData});
          }

          //CONSUMO RESPOSTA RECEBIDA
          await db.collection(token).doc('dados').collection('consumo').doc(mensagemData.consumoUid).set({ laraResposta: mensagem } , { merge: true });

          let _conversaData:any = {};
          if(mensagemData.conversaData !== undefined) {
            _conversaData = JSON.parse(mensagemData.conversaData);
            _conversaData.context = data.context;
          }

          let _empresaConfig = '';
          if(mensagemData.empresaConfig !== undefined) {
            _empresaConfig = mensagemData.empresaConfig;
          }

          const jsonMsg:any = {
            mensagem: mensagem,
            anexo: '',
            citacao: '',
            canal: mensagemData.canal,
            legenda: '',
            createAt: new Date().getTime(),
            es: 's',
            tipo: 'texto',
            autorNome: 'Lara IA',
            autorUid: '99999',
            contatoNome: mensagemData.contatoNome,
            contatoOrigem: mensagemData.contatoOrigem,
            contatoUid: mensagemData.contatoUid,
            conversaUid: mensagemData.conversaUid,
            enviadoTag: 1,
            enviadoData: new Date().getTime(),
            entregueTag: 0,
            entregueData: new Date().getTime(),
            usuarioUid: '99999',
            usuarioNome: 'Lara IA',
            conversaData: JSON.stringify(_conversaData),
            empresaConfig: _empresaConfig
          };

          const iMsg = await Chat.mensagemAdd({ token, data: jsonMsg });
          if(iMsg.situacao === 'suc') {
            
            jsonMsg.uid = iMsg.id;

            await db.collection(token).doc('chat').collection('conversas').doc(mensagemData.contatoUid).collection('mensagens').doc(mensagemData.uid).set({ processoIa: true } , { merge: true });

            if(_conversaData.hasOwnProperty('context')) {
              if(_conversaData.context.hasOwnProperty('msg_proativa')) {
                if(_conversaData.context.msg_proativa !== '' && _conversaData.context.msg_proativa !== null) {
                  await db.collection('cronproativo').add({ empresaUid: token, uid: jsonMsg.uid, contatoUid: jsonMsg.contatoUid, ...jsonMsg });
                }
              }
            }

          }

          if(transferir) {
            await Watson.transferirLiveChat({ token, errorMsg: errorMsg, data: mensagemData});
          }

          if(finalizar) {
            await Chat.finalizarChat({ token, conversaUid: mensagemData.conversaUid });
          }

          return {situacao:'suc',code:0,msg:`${JSON.stringify(data)} / ${response} / ${iMsg.msg}`};
        }
      } else {

        return await Watson.transferirLiveChat({ token, errorMsg: `Falha na chamada watson (${status}): ${JSON.stringify(data)}`, data: mensagemData});

      }
    } catch(err) {
        
      return await Watson.transferirLiveChat({ token, errorMsg: `procMensagem: ${err.message}`, data: mensagemData});

    }
  },

  async transferirLiveChat(params: any) {
    const { token, errorMsg } = params;
    const { conversaUid, contatoUid, contatoNome, contatoOrigem, canal, empresaConfig } = params.data
    
    try {

      const updateData:any = {
        situacao: 2,
        qtdA: 1
      };

      if(errorMsg !== '') {
        updateData.errorMsg = errorMsg;
      }
      await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set(updateData, {merge: true});

      if(empresaConfig === undefined) {
        return {situacao:'err',code:0,msg:`Não localizei informações da empresa`};
      }

      const empresaConfigData = JSON.parse(empresaConfig);
      const { mensagemTransferencia, mensagemHorario } = empresaConfigData;

      const jsonMsg = {
        mensagem: '',
        anexo: '',
        citacao: '',
        canal: canal,
        legenda: '',
        createAt: new Date().getTime(),
        es: 's',
        tipo: 'texto',
        autorNome: 'Lara IA',
        autorUid: '99999',
        contatoNome: contatoNome,
        contatoOrigem: contatoOrigem,
        contatoUid: contatoUid,
        conversaUid: conversaUid,
        enviadoTag: 1,
        enviadoData: new Date().getTime(),
        entregueTag: 0,
        entregueData: new Date().getTime(),
        usuarioUid: '99999',
        usuarioNome: 'Lara IA',
        proativo: true
      };

      const vEmpresaHorario = await Empresa.horarioCheck(empresaConfigData);
      if(vEmpresaHorario.situacao === 'suc') {

        //MENSAGEM de traNSFERENCIA
        if(mensagemTransferencia !== undefined && mensagemTransferencia !== '') {
          jsonMsg.mensagem = mensagemTransferencia;
          await Chat.mensagemAdd({ token, data: jsonMsg });
        }

        await db.collection(token).doc('chat').collection('conversasdistribuicao').add({ createAt: new Date().getTime(), token, ...params.data});

        return {situacao:'suc',code:0,msg:`Processo dentro do horário de funcionamento.`};
      } else if (vEmpresaHorario.situacao === 'nocach') {

        //MENSAGEM FORA HORARIO SLAPAINEL TRUE
        if(mensagemHorario !== undefined && mensagemHorario !== '') {
          jsonMsg.mensagem = mensagemHorario;
          await Chat.mensagemAdd({ token, data: jsonMsg });
        }

        await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaPainel: true }, {merge:true});

        return {situacao:'suc',code:0,msg:`Processo fora de horário sucesso.`};
      } else {
        return {situacao:'err',code:0,msg:`horarioAtendimentoCheck err: ${vEmpresaHorario.msg}`};
      }
    } catch(err) {
      await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ situacao: 2, errorMsg: `transferirLiveChat: ${err.message}` }, {merge: true});

      return {situacao:'err',code:0,msg:`transferirLiveChat: ${err.message}`};
    }
  },

  async transferirLiveChat2(params: any) {
    const { token, errorMsg } = params;
    const { conversaUid, contatoUid, contatoNome, contatoOrigem, autorNome, canal } = params.data
    
    try {

      const updateData:any = {
        situacao: 2,
        qtdA: 1
      };

      if(errorMsg !== '') {
        updateData.errorMsg = errorMsg;
      }
      await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set(updateData, {merge: true});

      const vEmpresa:any = await Empresa.atendimentoSelect({ empresaUid: token });
      if(vEmpresa.situacao === 'suc') {

        const { mensagemTransferencia, mensagemHorario } = vEmpresa.dados;

        const vEmpresaHorario = await Empresa.horarioAtendimentoCheck({ empresaUid: token });
        if(vEmpresaHorario.situacao === 'suc') {

          //MENSAGEM de traNSFERENCIA
          if(mensagemTransferencia !== undefined && mensagemTransferencia !== '') {
            const jsonMsg = {
              mensagem: mensagemTransferencia,
              anexo: '',
              citacao: '',
              canal: canal,
              legenda: '',
              createAt: new Date().getTime(),
              es: 's',
              tipo: 'texto',
              autorNome: 'Lara IA',
              autorUid: '99999',
              contatoNome: contatoNome,
              contatoOrigem: contatoOrigem,
              contatoUid: contatoUid,
              conversaUid: conversaUid,
              enviadoTag: 1,
              enviadoData: new Date().getTime(),
              entregueTag: 0,
              entregueData: new Date().getTime(),
              usuarioUid: '99999',
              usuarioNome: 'Lara IA',
              proativo: true
            };
            await Chat.mensagemAdd({ token, data: jsonMsg });
          }

          const iEntrega = await Chat.conversaDepartamento({ token, conversaUid });
          if(iEntrega.situacao === 'suc') {
            let pushmsg = '';

            //VERIFICAR HORARIO ATENDIMENTO
            const pushData = {
              usuarioUid: iEntrega.userData.userUid,
              tipo: 'texto',
              mensagem: `Existe uma nova conversa de ${contatoNome} para você`,
              autorNome,
              contatoUid,
              conversaUid
            }
            const iPush = await Chat.mensagemPush({ token, data: pushData });
            pushmsg = iPush.msg;

            return {situacao:'suc',code:0,msg:`Transferido com sucesso. ${iEntrega.msg} ${pushmsg}`};
          } else {
            return {situacao:'err',code:0,msg:`conversaDepartamento err: ${iEntrega.msg}`};
          }
        } else if (vEmpresaHorario.situacao === 'nocach') {

          //MENSAGEM FORA HORARIO SLAPAINEL TRUE
          if(mensagemHorario !== undefined && mensagemHorario !== '') {
            const jsonMsg = {
              mensagem: mensagemHorario,
              anexo: '',
              citacao: '',
              canal: canal,
              legenda: '',
              createAt: new Date().getTime(),
              es: 's',
              tipo: 'texto',
              autorNome: 'Lara IA',
              autorUid: '99999',
              contatoNome: contatoNome,
              contatoOrigem: contatoOrigem,
              contatoUid: contatoUid,
              conversaUid: conversaUid,
              enviadoTag: 1,
              enviadoData: new Date().getTime(),
              entregueTag: 0,
              entregueData: new Date().getTime(),
              usuarioUid: '99999',
              usuarioNome: 'Lara IA',
              proativo: true
            };
            await Chat.mensagemAdd({ token, data: jsonMsg });
          }

          await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaPainel: true }, {merge:true});

          return {situacao:'suc',code:0,msg:`Processo fora de horário sucesso.`};
        } else {
          return {situacao:'err',code:0,msg:`horarioAtendimentoCheck err: ${vEmpresaHorario.msg}`};
        }
      } else {
        return {situacao:'err',code:0,msg:`atendimentoSelect err: ${vEmpresa.msg}`};
      }
      
    } catch(err) {
      await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ situacao: 2, errorMsg: `transferirLiveChat: ${err.message}` }, {merge: true});

      return {situacao:'err',code:0,msg:`transferirLiveChat: ${err.message}`};
    }
  },

  async credentialsGet(params: any) {
    const { token, brainId } = params;
    
    try {
      if(brainId !== undefined) {

        const snapshot = await db.collection('brain').where('brainId', '==', brainId).get();
        if (snapshot.empty) {
          return {situacao:'nocach',code:0,msg:`não existem registros. ${brainId}`};
        } else {

          let dados = {};

          for (const doc of snapshot.docs) {
            const { apikey, workId, nome, confidence } = doc.data();
            const brain = doc.data().brainId;
              
            dados = {
              apikey,
              workId,
              nome,
              confidence,
              brainId: brain
            };
          };

          if(Object.keys(dados).length > 0) {
            return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:dados};
          } else {
            return {situacao:'nocach',code:0,msg:`Conflito ao localizar brain `};
          }
        }

      } else {

        const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('watson').get();
        if (snapshot.empty) {
          return {situacao:'nocach',code:0,msg:'não possui integração com Watson.'};
        } else {

          let dados = {};

          let msgerr = '';
          for (const doc of snapshot.docs) {
            const { brainUid } = doc.data();
            msgerr += brainUid;
            const document:any = await db.collection('brain').doc(brainUid).get();
            if (document.exists) {
              const { apikey, workId, nome, confidence } = document.data();
              const brain = document.data().brainId;
              
              dados = {
                apikey,
                workId,
                nome,
                confidence,
                brainId: brain
              };
            }
          }

          if(Object.keys(dados).length > 0) {
            return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.', dados: dados };
          } else {
            return {situacao:'nocach',code:0,msg:`(1) Conflito ao localizar brain ${msgerr} `};
          }
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`credentialsGet: ${err.message}`};
    }
  },

  async credentialsCreate(params: any) {
    const { token, data } = params;
    
    try {
      const result = await db.collection('brain').add(data);

      const brainData = {
        createAt: new Date().getTime(),
        brainUid: result.id
      };

      const iData: any = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('watson').add(brainData);
      
      return {situacao:'suc',code:0,msg:`Cérebro configurado`, id: iData.id };
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`credentialsCreate: ${err.message}`};
    }
  },

  async credentialsDelete(params: any) {
    const { token } = params;
    
    try {
      const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('watson').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não possui integração com Watson.'};
      } else {
        for (const doc of snapshot.docs) {
          const { brainUid } = doc.data();

          await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('watson').doc(doc.id).delete();
          
          await db.collection('brain').doc(brainUid).delete();
          
        }
        return {situacao:'suc',code:0,msg:`Cérebro removido`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`credentialsDelete: ${err.message}`};
    }
  },

  async CredentialsOnUpdate(params: any) {
    const { brainUid, confiabilidade } = params;
    
    try {
      const confidence = confiabilidade / 100;

      await db.collection('brain').doc(brainUid).set({ confidence }, {merge: true});

      return {situacao:'suc',code:0,msg:`Cérebro atualizado`};
    } catch(err) {
      return {situacao:'err',code:0,msg:`credentialsDelete: ${err.message}`};
    }
  },

  async workCreate(params: any) {
    const { nome, apikey } = params;
    
    try {
      const version = '2019-02-28';

      const json = {
        name: nome,
        intents: [],
        entities: [],
        dialog_nodes: [],
        system_settings: { system_entities: { enabled: true } },
        language: 'pt-br',
        description: `Cérebro empresa ${nome}`
      };

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces?version=${version}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 201) {
        return {situacao:'suc',code:0,msg:`Work criado`,workId: data.workspace_id };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`workCreate: ${err.message}`};
    }
  },

  async workDelete(params: any) {
    const { apikey, workId } = params;
    
    try {
      const version = '2019-02-28';

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}?version=${version}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 200 || status === 404) {
        return {situacao:'suc',code:0,msg:`work deletado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`workDelete: ${err.message}`};
    }
  },

  async dialogCreate(params: any) {
    const { apikey, workId, nome, conditions, parent, context, previous_sibling, resposta } = params;
    
    try {
      const version = '2019-02-28';

      const json: any = {
        dialog_node: nome,
        output:{
          generic:[]
        }
      };
      if(conditions !== undefined) {
        json.conditions = conditions;
      }
      if(parent !== undefined) {
        json.parent = parent;
      }
      if(context !== undefined) {
        json.context = context;
      }
      if(previous_sibling !== undefined) {
        // json.previous_sibling = previous_sibling;
      }
      if(resposta !== undefined) {
        json.output.generic[0]= {
          response_type: 'text',
          values:[{ text: resposta }]
        };
      }

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/dialog_nodes?version=${version}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 201) {
        return {situacao:'suc',code:0,msg:`Dialog node criado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)} || Json: ${JSON.stringify(json)}` };
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`dialogCreate: ${err.message}`};
    }
  },

  async dialogUpdate(params: any) {
    const { apikey, workId, nome, context, resposta } = params;
    
    try {
      const version = '2019-02-28';

      const json: any = {
        output:{
          generic:[]
        }
      };
      if(context !== undefined) {
        json.context = context;
      }
      if(resposta !== undefined) {
        json.output.generic[0]= {
          response_type: 'text',
          values:[{ text: resposta }]
        };
      }

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/dialog_nodes/${nome}?version=${version}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 200) {
        return {situacao:'suc',code:0,msg:`Dialog node atualizado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`dialogUpdate: ${err.message}`};
    }
  },

  async dialogDelete(params: any) {
    const { apikey, workId, nome } = params;
    
    try {
      const version = '2019-02-28';

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/dialog_nodes/${nome}?version=${version}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 200 || status === 404) {
        return {situacao:'suc',code:0,msg:`dialog deletado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`dialogDelete: ${err.message}`};
    }
  },

  async intentCreate(params: any) {
    const { apikey, workId, nome, descricao } = params;
    
    try {
      const version = '2019-02-28';

      const json = {
        intent: nome,
        description: descricao
      };

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/intents?version=${version}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 201) {
        return {situacao:'suc',code:0,msg:`Intent criado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`intentCreate: ${err.message}`};
    }
  },

  async intentDelete(params: any) {
    const { apikey, workId, nome } = params;
    
    try {
      const version = '2019-02-28';

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/intents/${nome}?version=${version}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 200 || status === 404) {
        return {situacao:'suc',code:0,msg:`Intent deletado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`intentDelete: ${err.message}`};
    }
  },

  async exampleCreate(params: any) {
    const { apikey, workId, exemplo, nome } = params;
    
    try {
      const version = '2019-02-28';

      const json: any = {
        text: exemplo
      };

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/intents/${nome}/examples?version=${version}`;
      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 201) {
        return {situacao:'suc',code:0,msg:`Example criado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`exampleCreate: ${err.message}`};
    }
  },

  async exampleDelete(params: any) {
    const { apikey, workId, nome, exemplo } = params;
    
    try {
      const version = '2019-02-28';

      const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/intents/${nome}/examples/${encodeURIComponent(exemplo)}?version=${version}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
        }
      };
      const response = await fetch(url,options);
      const { status } = response;
      const data = await response.json();
      if(status === 200 || status === 404) {
        return {situacao:'suc',code:0,msg:`Example deletado: ${JSON.stringify(data)}` };
      } else {
        return {situacao:'err',code:0,msg:`watson err: ${JSON.stringify(data)}` };
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`exampleDelete: ${err.message}`};
    }
  },

  async aprendizadoCreate(params: any) {
    const { empresaUid, aprendizadoUid, acao, acaoCod, proatividade, resposta, tipo, produtoUid,anexo } = params;

    try {
      let valid = false;
      let apikey = '';
      let workId = '';
      const vCredentials:any = await Watson.credentialsGet({ token: empresaUid });
      if(vCredentials.situacao === 'suc') {
        //EXISTE BRAIN
        valid = true;
        workId = vCredentials.dados.workId;
        apikey = vCredentials.dados.apikey;
      } else if(vCredentials.situacao === 'nocach') {
        
        apikey = 'apikey:EbYT3PfT4DfQlQQFmHegb6coQp68IuIxJAFIsIHK66us'; //PEGAR APIKEY DE ALGUM LUGAR
        console.log(apikey)

        const iWork = await Watson.workCreate({ nome: empresaUid, apikey });
        if(iWork.situacao === 'suc') {

          workId = iWork.workId;
          const iBrain = await Watson.credentialsCreate({ token: empresaUid, data: { apikey, workId, nome: empresaUid, confidence: 0.75, brainId: empresaUid } });
          if(iBrain.situacao === 'suc') {

            const iNodePadrao = await Watson.dialogCreate({ apikey, workId, nome: `Em outros casos`, conditions: `anything_else`, context: { next_brain: 118 } });
            if(iNodePadrao.situacao === 'suc') {

              valid = true;

            } else {
              console.log('3 - '+iNodePadrao.msg);
            }

          } else {
            console.log('2 - '+iBrain.msg);
          }

        } else {
          console.log('1 - '+iWork.msg);
        }

      } else {
        console.log('0 - '+vCredentials.msg);
      }

      ///WORK ENCONTRADO
      if(valid) {

        const nodeNome = `${tipo}_${aprendizadoUid}`;

        const iIntent = await Watson.intentCreate({ apikey, workId, nome: nodeNome , descricao: 'aprendizado criado via API' });
        if(iIntent.situacao === 'suc') {

          const _context: any = {
            operacao_agenda_especialidade: null,
            intencao_detectada: null,
            msg_proativa: null,
            operacao_robo: null,
            cont_nao_entendeu: 0,
            operacao_executa: false,
            operacao_anexo:false,
            operacao_link:null
          };
          if(acao.toUpperCase() === 'ANEXO') {
            console.log('Criado anexo com sucesso ')
            _context.operacao_anexo = 'true';
            _context.operacao_link = anexo;
          }
          if(acao.toUpperCase() === 'ROBO') {
            _context.operacao_executa = 'true';
            _context.operacao_nome = acaoCod;
          }
          
          if(proatividade !== '') {
            _context.msg_proativa = proatividade;
          }

          let produtoCondition = '';
          if(tipo.toUpperCase() === 'COMERCIAL' && produtoUid !== undefined && produtoUid !== '') {
            const vProduto:any = await db.collection(empresaUid).doc('dados').collection('produtos').doc(produtoUid).get();
            if(vProduto.exists) {
              const { sku } = vProduto.data();
              produtoCondition = ` || $operacao_sku == '${sku}'`;
              _context.operacao_intencao = aprendizadoUid;
            }
          }

          const nodeData = {
            apikey, 
            workId, 
            nome: nodeNome, 
            conditions: `#${nodeNome} && intents[0].confidence >= $operacao_confidence || $intencao_detectada == '${nodeNome}'${produtoCondition}`, 
            context: _context, 
            previous_sibling: 'Em Outros Casos', 
            resposta
          };
          const iNode = await Watson.dialogCreate(nodeData);
          if(iNode.situacao === 'suc') {
            
            await db.collection(empresaUid).doc('dados').collection('aprendizado').doc(aprendizadoUid).set({ situacao: 2 }, {merge: true});

            return {situacao:'suc',code:0,msg:`Processo de Aprendizado concluído com sucesso`};

          } else {
            return {situacao:'err',code:0,msg:`Node err: ${iNode.msg}`};
          }

        } else {
          return {situacao:'err',code:0,msg:`Intent err: ${iIntent.msg}`};
        }
        
      } else {
        return {situacao:'err',code:0,msg:`Não foi valido o work`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`aprendizadoCreate: ${err.message}`};
    }
  },

  async aprendizadoUpdate(params: any) {
    const { empresaUid, aprendizadoUid, acao, acaoCod, proatividade, resposta, tipo, produtoUid,anexo } = params;

    try {
      let apikey = '';
      let workId = '';
      const vCredentials:any = await Watson.credentialsGet({ token: empresaUid });
      if(vCredentials.situacao === 'suc') {
        workId = vCredentials.dados.workId;
        apikey = vCredentials.dados.apikey;

        const nodeNome = `${tipo}_${aprendizadoUid}`;

        const _context: any = {
          operacao_agenda_especialidade: null,
          intencao_detectada: null,
          msg_proativa: null,
          operacao_robo: null,
          cont_nao_entendeu: 0,
          operacao_executa: false,
          operacao_anexo:false,
          operacao_link:null
        };
        
        if(acao.toUpperCase() === 'ANEXO') {
          _context.operacao_anexo = 'true';
          _context.operacao_link = anexo;
        }
        if(acao.toUpperCase() === 'ROBO') {
          _context.operacao_executa = 'true';
          _context.operacao_nome = acaoCod;
        }
        if(proatividade !== '') {
          _context.msg_proativa = proatividade;
        }

        let produtoCondition = '';
        if(tipo.toUpperCase() === 'COMERCIAL' && produtoUid !== undefined && produtoUid !== '') {
          const vProduto:any = await db.collection(empresaUid).doc('dados').collection('produtos').doc(produtoUid).get();
          if(vProduto.exists) {
            const { sku } = vProduto.data();
            produtoCondition = ` || $operacao_sku == '${sku}'`;
            _context.operacao_intencao = aprendizadoUid;
          }
        }
        
        const nodeData = {
          apikey, 
          workId, 
          nome: nodeNome, 
          conditions: `#${nodeNome} && intents[0].confidence >= $operacao_confidence || $intencao_detectada == '${nodeNome}'${produtoCondition}`, 
          context: _context, 
          resposta
        };
        return await Watson.dialogUpdate(nodeData);
      } else {
        return {situacao:'err',code:0,msg:`Credentials err: ${vCredentials.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`aprendizadoUpdate: ${err.message}`};
    }
  },
        

        
  async aprendizadoDelete(params: any) {
    const { empresaUid, aprendizadoUid, tipo } = params;

    try {
      const vCredentials:any = await Watson.credentialsGet({ token: empresaUid });
      if(vCredentials.situacao === 'suc') {
        
        const { workId, apikey } = vCredentials.dados;
        const nodeNome = `${tipo}_${aprendizadoUid}`;

        const iIntent = await Watson.intentDelete({ apikey, workId, nome: nodeNome });
        if(iIntent.situacao === 'suc') {

          const iNode = await Watson.dialogDelete({ apikey, workId, nome: nodeNome });
          if(iNode.situacao === 'suc') {

            //EXCLUIR EXEMPLOS DA BASE
            const vExemplos = await db.collection(empresaUid).doc('dados').collection('aprendizado').doc('exemplos').collection(aprendizadoUid).get();
            if (!vExemplos.empty) {
              for (const doc of vExemplos.docs) {
                await db.collection(empresaUid).doc('dados').collection('aprendizado').doc('exemplos').collection(aprendizadoUid).doc(doc.id).delete();
              }
            }

            //CHECAR PRA EXCLUIR WORK
            const vIntents = await db.collection(empresaUid).doc('dados').collection('aprendizado').get();
            if(vIntents.empty) {
              const dWork = await Watson.workDelete({ apikey, workId });
              if(dWork.situacao === 'suc') {
                await Watson.credentialsDelete({ token: empresaUid});
              }
            }

            return {situacao:'suc',code:0,msg:`Exclusão de aprendizado concluído com sucesso`};

          } else {
            return {situacao:'err',code:0,msg:`Node err: ${iNode.msg}`};
          }

        } else {
          return {situacao:'err',code:0,msg:`Intent err: ${iIntent.msg}`};
        }
        
      } else {
        return {situacao:'err',code:0,msg:`Credentials err: ${vCredentials.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`aprendizadoDelete: ${err.message}`};
    }
  },

  async aprendizadoExemploCreate(params: any) {
    const { empresaUid, aprendizadoUid, exemplo } = params;

    try {
      const vCredentials:any = await Watson.credentialsGet({ token: empresaUid });
      if(vCredentials.situacao === 'suc') {
        
        const { workId, apikey } = vCredentials.dados;

        const document:any = await db.collection(empresaUid).doc('dados').collection('aprendizado').doc(aprendizadoUid).get();
        if (document.exists) {
          const { tipo } = document.data();
          
          const nodeNome = `${tipo}_${aprendizadoUid}`;

          const iExample = await Watson.exampleCreate({ apikey, workId, exemplo, nome: nodeNome });
          if(iExample.situacao === 'suc') {
            return {situacao:'suc',code:0,msg:`Exemplo adicionado com sucesso`};
          } else {
            return {situacao:'err',code:0,msg:`Node err: ${iExample.msg}`};
          }
        } else {
          return {situacao:'err',code:0,msg:`Falha ao localizar aprendizado`};
        }
      } else {
        return {situacao:'err',code:0,msg:`Credentials err: ${vCredentials.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`aprendizadoExemploCreate: ${err.message}`};
    }
  },

  async aprendizadoExemploDelete(params: any) {
    const { empresaUid, aprendizadoUid, exemplo } = params;

    try {
      const vCredentials:any = await Watson.credentialsGet({ token: empresaUid });
      if(vCredentials.situacao === 'suc') {
        
        const { workId, apikey } = vCredentials.dados;

        const document:any = await db.collection(empresaUid).doc('dados').collection('aprendizado').doc(aprendizadoUid).get();
        if (document.exists) {
          const { tipo } = document.data();
          
          const nodeNome = `${tipo}_${aprendizadoUid}`;

          const dExample = await Watson.exampleDelete({ apikey, workId, exemplo, nome: nodeNome });
          if(dExample.situacao === 'suc') {
            return {situacao:'suc',code:0,msg:`Exemplo deletado com sucesso`};
          } else {
            return {situacao:'err',code:0,msg:`Node err: ${dExample.msg}`};
          }
        } else {
          return {situacao:'err',code:0,msg:`Falha ao localizar aprendizado`};
        }
      } else {
        return {situacao:'err',code:0,msg:`Credentials err: ${vCredentials.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`aprendizadoExemploDelete: ${err.message}`};
    }
  },

  async checkProatividade() {
    try {
      const vProatividade = await db.collection('cronproativo').get();
      if(!vProatividade.empty) {

        for (const proativoDoc of vProatividade.docs) {
          const { empresaUid, uid, contatoUid, contatoNome, conversaData, empresaConfig, tempoResposta, createAt, contatoOrigem, canal, conversaUid } = proativoDoc.data();

          console.log('################################## CONVERSAUID: '+conversaUid+' ##################################');
          console.log('CONTATO: '+contatoNome);
          if(conversaData === undefined) {
            await Watson.deleteProativo({ proativoUid :proativoDoc.id });
            continue;
          }

          if(empresaConfig === undefined) {
            await Watson.deleteProativo({ proativoUid :proativoDoc.id });
            continue;
          }

          const _conversaData = JSON.parse(conversaData);

          if(_conversaData.context === undefined) {
            await Watson.deleteProativo({ proativoUid :proativoDoc.id });
            continue;
          }

          const vHorarioCheck = await Empresa.horarioCheck(JSON.parse(empresaConfig));
          if(vHorarioCheck.situacao === 'suc') {
            const contextObj = _conversaData.context;

            if(contextObj.hasOwnProperty('msg_proativa')) {
              if(contextObj.msg_proativa !== '' && contextObj.msg_proativa !== null) {

                let tempoProativo = tempoResposta;
                if(tempoProativo === undefined) tempoProativo = 5
                const minutesProatividade = tempoProativo * 60;

                const currentDate = new Date().getTime();

                const diffDate = (currentDate - createAt) / 1000;
                if(diffDate > minutesProatividade) {

                  if(contextObj.hasOwnProperty('cont_proatividade') && contextObj.cont_proatividade === '1') {

                    //JA FOI PROATIVO FALTA ENVIAR IMAGEM
                    await Chat.finalizarChat({ token:empresaUid, conversaUid });

                    // FINALIZAR CHAMADA
                    await Watson.deleteProativo({ proativoUid :proativoDoc.id });

                  } else {
                    //ENVIAR MESG PROATIVA
                    const vWatson:any = await Watson.credentialsGet({ token:empresaUid, brainId: 118 });
                    if(vWatson.situacao === 'suc') {

                      contextObj.apikey = vWatson.dados.apikey;
                      contextObj.workId = vWatson.dados.workId;
                      contextObj.operacao_confidence = vWatson.dados.confidence;
                      contextObj.operacao_brain = 118;

                      delete contextObj.system;
                      delete contextObj.next_brain;
                      delete contextObj.operacao_executa;

                      contextObj.msg_abertura = contextObj.msg_proativa;
                      contextObj.msg_proativa = contextObj.msg_proativa;

                      if(contextObj.operacao_dica === undefined || contextObj.operacao_dica === null) contextObj.operacao_dica = 2865;

                      const consumoData = {
                        createAt: new Date().getTime(),
                        tipo: 'Recebimento de mensagem',
                        codetipo: 2,
                        usuarioUid: '',
                        msgtipo: 'texto',
                        anexo: '',
                        mensagem: 'oi',
                        laraProcesso: 2,
                        laraResposta: '',
                        qtdProc: 0
                      };
                      const iConsumo = await db.collection(empresaUid).doc('dados').collection('consumo').add(consumoData);

                      const produtividadeData = {
                        createAt: new Date().getTime(),
                        mensagemTexto: 'oi',
                        anexoTexto: '',
                        processadoIA: false,
                        intencaoIA: '',
                        intencaoIaUid: '',
                        intencaoIaNome: ''
                      };
                      const iProdutividade = await db.collection(empresaUid).doc('dados').collection('aprendizado').doc('relatorios').collection('produtividade').add(produtividadeData);

                      const msgData = {
                        mensagem: 'oi',
                        consumoUid: iConsumo.id,
                        uid: uid,
                        produtividadeUid: iProdutividade.id,
                        proativo: true,
                        anexo: '',
                        citacao: '',
                        canal: canal,
                        legenda: '',
                        createAt: new Date().getTime(),
                        es: 's',
                        tipo: 'texto',
                        autorNome: 'Lara IA',
                        autorUid: '99999',
                        contatoNome: contatoNome,
                        contatoOrigem: contatoOrigem,
                        contatoUid: contatoUid,
                        conversaUid: conversaUid,
                        enviadoTag: 1,
                        enviadoData: new Date().getTime(),
                        entregueTag: 0,
                        entregueData: new Date().getTime(),
                        usuarioUid: '99999',
                        usuarioNome: 'Lara IA',
                      };
                      
                      await Watson.procMensagem({ token:empresaUid, mensagemData:msgData, context: contextObj});

                      await Watson.deleteProativo({ proativoUid :proativoDoc.id });
                    }
                  } 
                } else {
                  console.log(`DATA ERR: ${diffDate} ~ ${minutesProatividade}`);
                }
              } else {
                await Watson.deleteProativo({ proativoUid :proativoDoc.id });
              }
            } else {
              await Watson.deleteProativo({ proativoUid :proativoDoc.id });
            }
            console.log('############################################## CONVERSAFIM #############################################');
          }
        }

        return {situacao:'suc',code:0,msg:`Processo atendimento SLA com sucesso.`};
      } else {
        return {situacao:'err',code:0,msg:`Nada a fazer.`};
      }

      
    } catch (err) {
      return {situacao:'err',code:0,msg:`checkSlaConversa err: ${err.message}`};
    }
  },

  async deleteProativo(params:any) {
    try {
      const { proativoUid } = params;
      
      await db.collection('cronproativo').doc(proativoUid).delete();

      return {situacao:'suc',code:0,msg:`Proatividade deletado sucesso.`};
    } catch (err) {
      return {situacao:'err',code:0,msg:`deleteProativo err: ${err.message}`};
    }
  },

  async cronProatividadeCreate(params:any) {
    try {
      const { empresaUid, proativoUid, conversaUid, conversaData } = params;

      const _conversaData = JSON.parse(conversaData);

      _conversaData.context.proativoUid = proativoUid;

      await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).set({ context: JSON.stringify(_conversaData.context) } , { merge: true });

      await db.collection('cronproativo').doc(proativoUid).set({ conversaData: JSON.stringify(_conversaData) } , { merge: true });

      return {situacao:'suc',code:0,msg:`Proatividade deletado sucesso.`};
    } catch (err) {
      return {situacao:'err',code:0,msg:`deleteProativo err: ${err.message}`};
    }
  },

};

export default Watson;