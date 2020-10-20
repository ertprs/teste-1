const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");

const request = require('request');

import Chat from './chat';
import { db } from '../index';

const Telegram = {

  async sendMessage(params: any) {
    try{
      const { empresaUid } = params;
      const { id , mensagem, anexo, contatoOrigem, contatoUid } = params.data;
      let tipo = params.data.tipo;

      if(tipo.toUpperCase() === 'ANEXO') {
        const vTipo:any = Chat.checkFileTipo({filename: anexo});
        if(vTipo.situacao === 'suc') {
          tipo = vTipo.tipo;
        }
      }

      const vToken = await Telegram.getToken({token: empresaUid});
      if(vToken.situacao === 'suc') {
        const telegramToken = vToken.token;

        const bot = new TelegramBot(telegramToken, {polling: false});

        try {
          if(tipo.toUpperCase() === 'TEXTO') {
            bot.sendMessage(contatoOrigem, mensagem);
            
          } else if(tipo.toUpperCase() === 'IMAGEM') {
            bot.sendPhoto(contatoOrigem, anexo);

          } else if(tipo.toUpperCase() === 'VIDEO') {
            bot.sendVideoNote(contatoOrigem, anexo);

          } else if(tipo.toUpperCase() === 'DOCUMENTO') {
            bot.sendDocument(contatoOrigem, request(anexo));

          } else if(tipo.toUpperCase() === 'AUDIO') {
            bot.sendAudio(contatoOrigem, anexo);

          } else {
            const xMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: 'Tipo de mensagem inválido'}});
            if(xMsg.situacao === 'suc') {
              return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. (tipo)`};
            } else {
              return {situacao:'err',code:0,msg:`${xMsg.msg}`};
            }
          }      
          
          const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 2, entregueData: new Date().getTime(), tipo}});
          if(uMsg.situacao === 'suc') {
            return {situacao:'suc',code:0,msg:'Mensagem enviada com sucesso'};
          } else {
            return {situacao:'err',code:0,msg:vToken.msg};
          }
        } catch(err) {
          const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: err.message}});
          if(uMsg.situacao === 'suc') {
            return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${err.message}`};
          } else {
            return {situacao:'err',code:0,msg:`${uMsg.msg} ${err.message}`};
          }
        }
      } else {
        const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: vToken.msg}});
        if(uMsg.situacao === 'suc') {
          return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${vToken.msg}`};
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
      const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('telegram').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não possui integração com telegram.'};
      } else {
        const doc = snapshot.docs[0];

        return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',token:doc.data().token,id:doc.id};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async getFile(params: any) {
    const empresaUid = params.token;
    const { fileId } = params;

    try {
      const vToken = await Telegram.getToken({token: empresaUid});
      if(vToken.situacao === 'suc') {
        const telegramToken = vToken.token;

        const url = `https://api.telegram.org/bot${telegramToken}/getFile?file_id=${fileId}`;
        const options = {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        };        
        const response = await fetch(url,options);
        const data = await response.json();
        const fileLink = `https://api.telegram.org/file/bot${telegramToken}/${data.result.file_path}`;

        return {situacao:'suc',code:0,msg:'arquivo recuperado com sucesso.',url:fileLink}
      } else {
        return {situacao:'err',code:0,msg:vToken.msg};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`telegramGetFile err:${err.message}`}
    }
  },

  async webhookSet(params:any) {
    try {
      const { empresaUid,ambiente } = params;

      const vToken:any = await Telegram.getToken({token: empresaUid});
      if(vToken.situacao === 'suc') {
        const telegramToken = vToken.token;
        const telegramUid = vToken.id;

        let hashConfig = Buffer.from(JSON.stringify(params)).toString('base64');
        hashConfig = encodeURIComponent(hashConfig);

        const webhookUrl = `https://southamerica-east1-${ambiente}.cloudfunctions.net/api/telegram/${hashConfig}`;
        console.log(webhookUrl)
       


        const url = `https://api.telegram.org/bot${telegramToken}/setwebhook?url=${webhookUrl}`;
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache'
          }
        };
        const response = await fetch(url,options);
        const data = await response.json();
        if(data.hasOwnProperty('result')) {
          if(data.result) {

            await db.collection(empresaUid).doc('dados').collection('configuracao').doc('chat').collection('telegram').doc(telegramUid).set({ webhookUrl },{merge:true});

            return {situacao:'suc',code:0,msg:'Webhook atualizado. '+webhookUrl};
          } else {
            return {situacao:'err',code:0,msg:`Não setou: ${JSON.stringify(data)}`};
          }
        } else {
          return {situacao:'err',code:0,msg:`fetch: ${JSON.stringify(data)}`};
        }
      } else {
        return {situacao:'err',code:0,msg:`vToken: ${vToken.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`webhookSet: ${err.message}`};
    }
  }

};

export default Telegram;