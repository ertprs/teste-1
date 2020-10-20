import { db } from '../index';

const Secure = {
  
  async ipBlacklistInsert(params: any) {
    const { ip } = params;
    try {
      const SecureData = {
        createAt: new Date().getTime(),
        ip
      };

      const result = await db.collection('seguranca').doc('blacklist').collection('ip').add(SecureData);
      return {situacao:'suc',code:0,msg:'Ip adicionado com sucesso.',id:result.id};
    } catch(err) {
      return {situacao:'err',code:0,msg:`ipBlacklistInsert err:${err.message}`};
    }
  },
  async validarToken(token: any):Promise<any> {

    return new Promise((resolve, reject) => {
      db.collection('access_token').where('apiKeyToken','==',token).get()
      .then(resDados=>{
        if(resDados.size == 1)
        {
          resDados.docs.forEach(dadosDoc=>{
            const id = dadosDoc.id;
            const data = dadosDoc.data()
            const dataReturn = {
              id,
              ... data
            }
            resolve(dataReturn)
          })
          
        }
        else
        {
          reject('(2) Irregularidade no tipo de acessso')
        }
      })
      .catch(err=>{
        reject( 'Falha ao fazer autenticacao')
      })
    })

    

  },
  async ipBlacklistCheck(params: any) {
    const { ip } = params;
    try {
      
      const snapshot = await db.collection('seguranca').doc('blacklist').collection('ip').where('ip','==',ip).get();
      if (snapshot.empty) {
        return {situacao:'suc',code:0,msg:`Ip (${ip}) permitido`};
      } else {
        return {situacao:'err',code:0,msg:`Ip (${ip}) bloqueado`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`ipBlacklistCheck err:${err.message}`};
    }
  },

}

export default Secure;