import { db } from '../index';

const Log = {
  
  async logInsert(params: any) {
    const { empresaUid, categoria, processoUid, data, mensagem  } = params;
    try {
      const logData = {
        createAt: new Date().getTime(),
        processoId: processoUid,
        data,
        mensagem
      };

      const result = await db.collection(empresaUid).doc('logs').collection(categoria).add(logData);
      return {situacao:'suc',code:0,msg:'Log adicionado com sucesso.',id:result.id};
    } catch(err) {
      return {situacao:'err',code:0,msg:`logInsert err:${err.message}`};
    }
  },
  async Inserir(empresaUid:string,params: any,colecao:string) {

    try {
      const logData = {
        createAt: new Date().getTime(),
        empresaUid,
        params,
        tipo:'backend'
      };

      const result = await db.collection(empresaUid).doc('dados').collection('log').doc('log').collection(colecao).add(logData);
      return {situacao:'suc',code:0,msg:'Log adicionado com sucesso.',id:result.id};
    } catch(err) {
      return {situacao:'err',code:0,msg:`logInsert err:${err.message}`};
    }
  }
}

export default Log;