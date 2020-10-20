const fetch = require("node-fetch");

import Chat from './chat';
import { db } from '../index';

const Sms = {

  async sendMessage(params: any) {
    try{
      const { empresaUid } = params;
      const { id , mensagem, contatoOrigem, contatoUid, createAt, disparoUid, listaTransmissaoUid } = params.data;

      const vSms:any = await Sms.getCredentials({token: empresaUid});
      if(vSms.situacao === 'suc') {
        const smsUser = vSms.dados.user;
        const smsSenha = vSms.dados.senha;

        try {

          const date = new Date(createAt);
          let formatDate = date.toLocaleString('pt-BR');
          formatDate = formatDate.split('/').join('');
          formatDate = formatDate.split(':').join('');
          formatDate = formatDate.split(' ').join('');

          const json = {
            sendSmsRequest: {
              to: contatoOrigem,
              message: mensagem,
              id: formatDate
            }
          };

          const url = `https://mm.otimatel.com.br/api/v2/sms/`;
          const options = {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'cache-control': 'no-cache',
              'Content-length': JSON.stringify(json).length.toString(),
              'Authorization': `Basic ${Buffer.from(`${smsUser}:${smsSenha}`).toString('base64')}`
            }
          };
          const response = await fetch(url,options);
          const data = await response.json();
          if(data.status === 'success') {
            const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 2, entregueData: new Date().getTime() }});
            if(uMsg.situacao === 'suc') {

              if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
                const listaUpdate = {
                  smsAguardando: false,
                  smsEnviado: true
                };
                await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
              }

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
                  smsAguardando: false,
                  smsErro: true, 
                  errorMsg: error
                };
                await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
              }

              return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${data.message}`};
            } else {
              return {situacao:'err',code:0,msg:`${uMsg.msg} ${data.message}`};
            }
          } 

        } catch(err) {
          const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: err.message }});
          if(uMsg.situacao === 'suc') {

            if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
              const listaUpdate = {
                smsAguardando: false,
                smsErro: true, 
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
        const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: vSms.msg }});
        if(uMsg.situacao === 'suc') {

          if(disparoUid !== undefined && disparoUid !== '' && listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {
            const listaUpdate = {
              smsAguardando: false,
              smsErro: true, 
              errorMsg: vSms.msg
            };
            await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
          }

          return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${vSms.msg}`};
        } else {
          return {situacao:'err',code:0,msg:`${uMsg.msg}`};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async getCredentials(params: any) {
    const { token } = params;
    
    try {
      const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('sms').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não possui integração com Sms.'};
      } else {
        for (const doc of snapshot.docs) {
          const { user, senha} = doc.data();
          
          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:{user:user,senha:senha}};
        }
        return {situacao:'nocach',code:0,msg:'não possui integração com Sms.'};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

};

export default Sms;