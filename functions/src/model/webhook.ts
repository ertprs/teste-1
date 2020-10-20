import { db } from '../index';

const Webhook = {

  async webhookCreate(params: any) {
    const { acionamentoUid, acao, empresaUid, endPoint } = params;
    try {

      const chave64 = Buffer.from(`${empresaUid}|${acionamentoUid}`).toString('base64');
      const url = `https://southamerica-east1-lara2-3b332.cloudfunctions.net/api/v1/${acao}/${acionamentoUid}`;

      const json = {
        chave: chave64,
        endpoint: url
      };

      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'cache-control': 'no-cache',
          'Content-length': JSON.stringify(json).length.toString()
        }
      };
      const response = await fetch(endPoint,options);
      const { status } = response;
      const data = await response.json();

      if(status === 200) {
        await db.collection('acionamentos').doc(acionamentoUid).set(json, {merge: true});
          
        return {situacao:'suc',code:0,msg:`request success: ${JSON.stringify(data)}`};
      } else {
        return {situacao:'err',code:0,msg:`request fail: (${status}) ${JSON.stringify(data)}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`webhookCreate err:${err.message}`};
    }
  },

  async webhookProcesso(params: any) {
    const { acionamentoUid, acao, empresaUid, chave } = params;
    try {

      const data:any = {};
      data.empresa = empresaUid;
      data.chave = chave;
      data.endPoint = `https://us-central1-lara2-3b332.cloudfunctions.net/api/${acao}/${acionamentoUid}`;
      
      if(acao === 'agenda') {

        data.data = {
          respCod: 1.1,
          dtRange: [ 
            123123123123123123,
            123123123123123123 
          ]
        };
        data.resp = 'Oi, tudo bem';
        
      }

      return data;
    } catch(err) {
      return {situacao:'err',code:0,msg:`webhookProcesso err:${err.message}`};
    }
  },

}

export default Webhook;