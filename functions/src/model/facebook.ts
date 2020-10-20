const fetch = require("node-fetch");

import Chat from './chat';
import { db } from '../index';

const Facebook = {

  async sendMessage(params:any) {
    try{
      const { empresaUid } = params;
      const { id , mensagem, anexo, contatoOrigem, contatoUid } = params.data;
      let tipo = params.data.tipo;

      const vFace:any = await Facebook.getToken({token: empresaUid});
      if(vFace.situacao === 'suc') {
        const faceToken = vFace.dados.token;

        try {

          if(tipo.toUpperCase() === 'ANEXO') {
            const vTipo:any = Chat.checkFileTipo({filename: anexo});
            if(vTipo.situacao === 'suc') {
              tipo = vTipo.tipo;
            }
          }

          let json = {};
          if(tipo.toUpperCase() === 'TEXTO') {
            json = {
              recipient: { id: contatoOrigem },
              message: { text: mensagem}
            };
          } else if(tipo.toUpperCase() === 'DOCUMENTO' || tipo.toUpperCase() === 'IMAGEM' || tipo.toUpperCase() === 'VIDEO' || tipo.toUpperCase() === 'AUDIO') {
            let type = '';
            if(tipo.toUpperCase() === 'DOCUMENTO') {
              type = 'file';
            } else if (tipo.toUpperCase() === 'IMAGEM') {
              type = 'image';
            } else if (tipo.toUpperCase() === 'VIDEO') {
              type = 'video';
            } else if (tipo.toUpperCase() === 'AUDIO') {
              type = 'audio';
            }

            json = {
              recipient: { id: contatoOrigem },
              message: {
                attachment: {
                  type: type,
                  payload: {
                    url: anexo,
                    is_reusable: true
                  }
                }
              }
            };
          } else {
            const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: 'Tipo de mensagem inválido'}});
            if(uMsg.situacao === 'suc') {
              return {situacao:'err',code:0,msg:`Falha ao entregar mensagem.`};
            } else {
              return {situacao:'err',code:0,msg:`${uMsg.msg}`};
            }
          }
            
          const url = `https://graph.facebook.com/v7.0/me/messages?access_token=${faceToken}`;
          const options = {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
              'Content-Type': 'application/json'
            }
          };
          const response = await fetch(url,options);
          const data = await response.json();
          if(response.status === 200) {
            const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 2, entregueData: new Date().getTime(), tipo }});
            if(uMsg.situacao === 'suc') {
              return {situacao:'suc',code:0,msg:`Mensagem enviada com sucesso ${JSON.stringify(data)}`};
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
              return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${JSON.stringify(data)}`};
            } else {
              return {situacao:'err',code:0,msg:`${uMsg.msg} ${JSON.stringify(data)}`};
            }
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
        const uMsg = await Chat.mensagemUpdate({token: empresaUid,contatoUid, id, data:{entregueTag: 4, entregueData: new Date().getTime(), errorMsg: vFace.msg }});
        if(uMsg.situacao === 'suc') {
          return {situacao:'err',code:0,msg:`Falha ao entregar mensagem. ${vFace.msg}`};
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
      const snapshot = await db.collection(token).doc('dados').collection('configuracao').doc('chat').collection('facebook').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não possui integração com facebook.'};
      } else {
        let facebookToken = '';

        for (const doc of snapshot.docs) {
          facebookToken = doc.data().token;
        }

        return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:{token:facebookToken}};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`getFacebookToken: ${err.message}`};
    }
  },

  async getEmpresaUid(params: any) {
    const { facebookToken } = params;
    
    try {
      const vEmpresa = await db.collection('EmpControle').where('facebookToken','==',facebookToken).get();
      if(!vEmpresa.empty) {
        const doc = vEmpresa.docs[0];

        return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',empresaUid:doc.data().empresaUid };
      } else {
        return {situacao:'nocach',code:0,msg:'não possui integração com facebook.'};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`getFacebookToken: ${err.message}`};
    }
  }

};

export default Facebook;