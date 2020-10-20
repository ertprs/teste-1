const fetch = require("node-fetch");

import Chat from './chat';
import { db } from '../index';

const Whatsapp = {

  async sendMessage(params: any) {
    try{
      const { empresaUid } = params;
      const { id ,casoUid, mensagem, anexo, contatoOrigem, contatoUid, forwardId, listaTransmissaoUid, disparoUid } = params.data;
      let tipo = params.data.tipo;



      
      const vWpp:any = await Whatsapp.getToken({token: empresaUid});
      if(vWpp.situacao === 'suc') {
        const wppToken = vWpp.dados.token;
        const wppUrl = vWpp.dados.url;

        try {


          if(casoUid != '')
          {
            //EXISTE UM CASO
            console.log('########## PRocessando ticket ')
            //FAZER REGISTRO 
            const dadosAddInfoTIcket = {
              createAt: new Date().getTime(),
              usuarioUid:99999,
              usuarioNome:'Lara',
              es:'e',
              tipo:'Reg. automático - Diálogo',
              descricao:mensagem,
              anexo:'',
              privacidade:'private'
            }
            db.collection(empresaUid).doc('dados').collection('ticket_detalhe').doc(casoUid).collection('interacoes').add(dadosAddInfoTIcket)
            .then(()=>{
              //UPDATE QTD A DO TICKET 
              console.log('### Detalhe adicionado com sucesso ')
              db.collection(empresaUid).doc('dados').collection('ticket').doc(casoUid).set({qtdA:0},{merge:true})
              .catch(errAdd=>{
                console.log('Falha no processo de update do ticket '+errAdd)
              })
            })
            .catch(err2=>{
              console.log('ERRO NO PROCESSO DE AJUSTE DO TICKET '+err2)
            })
          }
          else{
            console.log('########## NAO EXISTE TICKET PARA PROCESSO')
          }



          if(tipo.toUpperCase() === 'ANEXO') {
            const vTipo:any = Chat.checkFileTipo({filename: anexo});
            if(vTipo.situacao === 'suc') {
              tipo = vTipo.tipo;
            }
          }

          let restApi = '';
          let json = {};
          console.log('ENVIANDO 1'+tipo.toUpperCase())
          if(tipo.toUpperCase() === 'TEXTO') {
            console.log(1)
            let msgEnviarAqui = mensagem.split('_contatonome').join('Lee');
        
            restApi = 'sendMessage';
            json = {
              phone: contatoOrigem,
              body: msgEnviarAqui
            };
          } else if(tipo.toUpperCase() === 'DOCUMENTO' || tipo.toUpperCase() === 'IMAGEM' || tipo.toUpperCase() === 'VIDEO') {
            console.log(2)
            restApi = 'sendFile';
            console.log('sendFile') 
            const anexoNome = anexo.split('/').pop();
            const filename = anexoNome.split('?')
            const nomeEnvio = filename[0].split('%').pop()
            console.log('ARQUIVO ENVIADO == '+nomeEnvio )
            json = {
              phone: contatoOrigem,
              body: anexo,
              filename: nomeEnvio
            };
            console.log('+++++')
            console.log(json)
          } else if(tipo.toUpperCase() === 'AUDIO') {
            console.log(3)
            restApi = 'sendPTT';
            json = {
              phone: contatoOrigem,
              audio: anexo
            };
          } else {
            console.log(4)
            const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: 'Tipo de mensagem inválido'}});
            if(uMsg.situacao === 'suc') {
              return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. (1)`};
            } else {
              return {situacao:'err',code:0,msg:`${uMsg.msg}`};
            }
          }

          if(forwardId !== undefined) {
            restApi = 'forwardMessage';
            json = {
              phone: contatoOrigem,
              messageId: forwardId
            };
          }
          
          const vCheck = await Whatsapp.checkPhone({token: empresaUid,contatoOrigem});
          if(vCheck.situacao === 'suc') {
            
            const url = `${wppUrl}/${restApi}?token=${wppToken}`;
            const options = {
              method: 'POST',
              body: JSON.stringify(json),
              headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
                'Content-length': JSON.stringify(json).length.toString()
              }
            };
            const response = await fetch(url,options);
            const data = await response.json();
            if(data.sent) {
              let resultId = null;
              if(data.hasOwnProperty('id')) {
                resultId = data.id;
                console.log('###### PROCESSO DE ENTREGA DE MENSAGEM PARA ID '+resultId)
              }

              const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 2, entregueData: new Date().getTime(), id: resultId, tipo }});
              if(uMsg.situacao === 'suc') {
                console.log('MSG '+resultId+' UPDATE DE ENTREGUE ')

                //APAGR ISSO PORQUE PARECE SER LISTA DE TRANSMISSAO
                //
                //
                //if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
                //  const listaUpdate = {
                //    wppAguardando: false,
                //    wppEnviado: true
                //  };
                //  await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
                //}

                return {situacao:'suc',code:0,msg:'Mensagem enviada com sucesso '};
              } else {
                return {situacao:'err',code:0,msg:uMsg.msg};
              }
            } else {
              let error = JSON.stringify(data);
              if(data.hasOwnProperty('error')) {
                error = data.error;
              } else if(data.hasOwnProperty('message')) {
                error = data.message;
              }
              const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: error }});
              if(uMsg.situacao === 'suc') {

                if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
                  const listaUpdate = {
                    wppAguardando: false,
                    wppErro: true,
                    errorMsg: error
                  };
                  await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
                }

                return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${data.message}`};
              } else {
                return {situacao:'err',code:0,msg:`${uMsg.msg} ${data.message}`};
              }
            } 
          } else {
            const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: `Não é um número válido de whatsapp.` }});
            if(uMsg.situacao === 'suc') {

              if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
                const listaUpdate = {
                  wppAguardando: false,
                  wppErro: true,
                  errorMsg: `Não é um número válido de whatsapp.`
                };
                await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
              }

              return {situacao:'err',code:0,msg:`Não é um número válido de whatsapp. -  ${vCheck.msg}`};
            } else {
              return {situacao:'err',code:0,msg:`Número inválido: ${uMsg.msg}`};
            }
          }

              
        } catch(err) {
          const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: err.message }});
          if(uMsg.situacao === 'suc') {

            if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
              const listaUpdate = {
                wppAguardando: false,
                wppErro: true,
                errorMsg: err.message
              };
              await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
            }

            return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${err.message}`};
          } else {
            return {situacao:'err',code:0,msg:`${uMsg.msg} ${err.message}`};
          }
        }
      } else {
        const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: vWpp.msg }});
        if(uMsg.situacao === 'suc') {

          if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
            const listaUpdate = {
              wppAguardando: false,
              wppErro: true,
              errorMsg: vWpp.msg
            };
            await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
          }

          return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${vWpp.msg}`};
        } else {
          return {situacao:'err',code:0,msg:`${uMsg.msg}`};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async getToken(params: any) {
    const { token } = params;
    
    try {
      const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('wppchatapi').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não possui integração com whatsapp.'};
      } else {
        const doc = snapshot.docs[0];

        return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:{token:doc.data().token,url:doc.data().url,id:doc.id}};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async checkPhone(params: any) {
    //const { contatoOrigem } = params;
    return {situacao:'suc',code:0,msg:'Telefone válido para whatsapp.'};
    //try {
    //  const url = `https://api.chat-api.com/instance31432/checkPhone?token=damr589gksyxktgp&phone=${contatoOrigem}`;
    //  const response = await fetch(url,{headers: { 'Content-Type': 'application/json', 'cache-control': 'no-cache' }});
    //  const data = await response.json();
    //  if(data.result === 'exists') {

    //    return {situacao:'suc',code:0,msg:'Telefone válido para whatsapp.'};
    //  } else {
    //    return {situacao:'err',code:0,msg:`Número inválido. ${JSON.stringify(data)}`};
    //  }
    //} catch(err) {
    //  return {situacao:'err',code:0,msg:err.message};
   // }
  },

  async webhookSet(params:any) {
    try {
      const { empresaUid } = params;

      const vWpp:any = await Whatsapp.getToken({token: empresaUid});
      if(vWpp.situacao === 'suc') {
        const wppToken = vWpp.dados.token;
        const wppUrl = vWpp.dados.url;
        const wppUid = vWpp.dados.id;

        const hashConfig = Buffer.from(JSON.stringify(params)).toString('base64');

        const webhookUrl = `https://southamerica-east1-lara2-3b332.cloudfunctions.net/api/whatsapp2/${hashConfig}`;
        
        const json = {
          webhookUrl: webhookUrl
        };

        const url = `${wppUrl}/webhook?token=${wppToken}`;
        const options = {
          method: 'POST',
          body: JSON.stringify(json),
          headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
            'Content-length': JSON.stringify(json).length.toString()
          }
        };
        const response = await fetch(url,options);
        const data = await response.json();
        if(data.hasOwnProperty('set')) {
          if(data.set) {

            await db.collection(empresaUid).doc('dados').collection('configuracao').doc('chat').collection('whatsapp').doc(wppUid).set({ webhookUrl },{merge:true});

            return {situacao:'suc',code:0,msg:'Webhook atualizado.'};
          } else {
            return {situacao:'err',code:0,msg:`Não setou`};
          }
        } else {
          return {situacao:'err',code:0,msg:`fetch: ${JSON.stringify(data)}`};
        }
      } else {
        return {situacao:'err',code:0,msg:`vWpp: ${vWpp.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`webhookSet: ${err.message}`};
    }
  }

};

export default Whatsapp;