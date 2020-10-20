const twilio = require("twilio");

import Chat from './chat';
import { db } from '../index';

const Twilio = {

  async sendMessage(params: any) {
    try {
      const { empresaUid } = params;
      const { id , mensagem, anexo, contatoOrigem, contatoUid } = params.data;
      let tipo = params.data.tipo;

      const vTwilio:any = await Twilio.getToken({token: empresaUid});
      if(vTwilio.situacao === 'suc') {
        const TwilioToken = vTwilio.dados.token;
        const TwilioAccount = vTwilio.dados.accountsid;
        const TwilioNumero = vTwilio.dados.numero;

        try {

          if(tipo.toUpperCase() === 'ANEXO') {
            const vTipo:any = Chat.checkFileTipo({filename: anexo});
            if(vTipo.situacao === 'suc') {
              tipo = vTipo.tipo;
            }
          }

          const client = new twilio(TwilioAccount, TwilioToken);

          let json = {};

          if(tipo.toUpperCase() === 'TEXTO') {
            
            json = {
              body: mensagem,
              to: `whatsapp:+${contatoOrigem}`,  // Text this number
              from: `whatsapp:+${TwilioNumero}` // From a valid Twilio number
            }
            
          } else if(tipo.toUpperCase() === 'DOCUMENTO' || tipo.toUpperCase() === 'IMAGEM' || tipo.toUpperCase() === 'VIDEO' || tipo.toUpperCase() === 'AUDIO') {
            
            json = {
              mediaUrl: [anexo],
              body: mensagem,
              to: `whatsapp:+${contatoOrigem}`,  // Text this number
              from: `whatsapp:+${TwilioNumero}` // From a valid Twilio number
            }
            
          } else {
            const uMsg2 = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: 'Tipo de mensagem inválido'}});
            if(uMsg2.situacao === 'suc') {
              return {situacao:'err',code:0,msg:`Falha ao entregar mensagem.`};
            } else {
              return {situacao:'err',code:0,msg:`${uMsg2.msg}`};
            }
          }

          const message = await client.messages.create(json);
          
          const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 2, entregueData: new Date().getTime(), tipo }});
          if(uMsg.situacao === 'suc') {
            return {situacao:'suc',code:0,msg:'Mensagem enviada com sucesso '+JSON.stringify(message)};
          } else {
            return {situacao:'err',code:0,msg:uMsg.msg};
          }   
        } catch(err) {
          const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: err.message }});
          if(uMsg.situacao === 'suc') {
            return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${err.message}`};
          } else {
            return {situacao:'err',code:0,msg:`${uMsg.msg} ${err.message}`};
          }
        }
      } else {
        const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: vTwilio.msg }});
        if(uMsg.situacao === 'suc') {
          return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${vTwilio.msg}`};
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
      const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('twilio').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não possui integração com Whatsapp Direct.'};
      } else {
        const doc = snapshot.docs[0];

        return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:{ id:doc.id, token: doc.data().token, accountsid: doc.data().accountsid, numero: doc.data().numero }};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async webhookSet(params:any) {
    try {
      const { empresaUid } = params;

      const vTwilio:any = await Twilio.getToken({token: empresaUid}); 
      if(vTwilio.situacao === 'suc') {
        const twilioUid = vTwilio.dados.id;

        const hashConfig = Buffer.from(JSON.stringify(params)).toString('base64');
        console.log('Hash Twilio '+hashConfig)
        const webhookUrl = `https://southamerica-east1-lara2-3b332.cloudfunctions.net/api/twilio/${hashConfig}`;

        await db.collection(empresaUid).doc('dados').collection('configuracao').doc('chat').collection('twilio').doc(twilioUid).set({ webhookUrl },{merge:true});

        return {situacao:'suc',code:0,msg:'Webhook atualizado.'};

      } else {
        return {situacao:'err',code:0,msg:`vTwilio: ${vTwilio.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`webhookSet: ${err.message}`};
    }
  }

};

export default Twilio;