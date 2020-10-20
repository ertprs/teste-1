import { db } from '../index';
import Whatsapp from './whatsapp';
import Chat from './chat';
import CaixaEntrada from './mysql/caixa_entrada'

const Contatos = {
  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  },
  async contatoSelect(params: any) {
    console.log('**** Verificar contado dentro da funcao ')
    console.log(JSON.stringify(params))
    const token = params.token;
    const canalSearch = params.canal;
    const contatoOrigem = params.origem;

    try {
      const snapshot = await db.collection(token).doc('chat').collection('contatos').where('origem', '==', contatoOrigem).where('canal', '==', canalSearch).limit(1).get();
      if (snapshot.empty) {
        console.log('#### nao existe cadastro para '+JSON.stringify(token,canalSearch,contatoOrigem))
        return {situacao:'nocach',code:0,msg:'não existem registros.'};
      } else {
        let contatoData = {};

        for (const doc of snapshot.docs) {
          const { photo, nome, canal, favorito, origem, nomeClienteVinculado, uidClienteVinculado, livechat, usuarioUid, usuarioNome, tempoResposta } = doc.data();
          const idContato = doc.id;

          contatoData = {
            uid: idContato,
            photo,
            nome,
            canal,
            favorito,
            origem,
            livechat,
            nomeClienteVinculado, 
            uidClienteVinculado,
            usuarioUid,
            usuarioNome,
            tempoResposta: tempoResposta
          };
        }

        if(Object.keys(contatoData).length > 0) {
          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:contatoData};
        } else {
          return {situacao:'nocach',code:0,msg:`Não localizei `};
        }
      }
    } catch(err) {
      console.log('**** Falha na verificacao  '+err)
      return {situacao:'err',code:0,msg:`ContatoSelect err:${err.message}`};
    }
  },

  async contatoInsert(params: any) {
    const token = params.token;
    const contatoData = params.data;
    console.log('Adicionando um novo contato dentro da funcao ')
    try {
      const result = await db.collection(token).doc('chat').collection('contatos').add(contatoData);
      
      return {situacao:'suc',code:0,msg:'Contato adicionado com sucesso.',id:result.id};
    } catch(err) {
      return {situacao:'err',code:0,msg:`contatoInsert err:${err.message}`};
    }
  },

  async contatoUpdate(params: any) {
    const token = params.token;
    const contatoUid = params.id;
    const updateData = params.updateData;

    try {
      await db.collection(token).doc('chat').collection('contatos').doc(contatoUid).set(updateData, {merge: true});
        
      return {situacao:'suc',code:0,msg:'Contato atualizado com sucesso.'};
    } catch(err) {
      return {situacao:'err',code:0,msg:`ContatoUpdate err:${err.message}`};
    }
  },

  async contatoCreate(params: any) {
    const { empresaUid, contatoUid, origem, canal, gruposVinculados, contatosVinculados, nome, emmassa } = params;

    try {

      if(emmassa) {
        await db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({ situacao: 1 }, {merge: true});

        return {situacao:'suc',code:0,msg:'Contato habilitado em massa.'};
      }

      if(canal.toUpperCase() === 'LISTA') {

        if(contatosVinculados !== undefined) {
 
          if(contatosVinculados.length > 0) {

            let _gruposVinculados = [];
            if(gruposVinculados !== undefined && gruposVinculados !== '') {
              _gruposVinculados = gruposVinculados;
            }

            for(const contato of contatosVinculados) {

              _gruposVinculados.push({ createAt: new Date().getTime(), uid: contatoUid, nome: nome });

              const updateData = {
                gruposVinculados: _gruposVinculados
              };

              await Contatos.contatoUpdate({ token: empresaUid, id: contato.id, updateData });
            }

            return {situacao:'suc',code:0,msg:'Atualizar contatos.'};
          } else {
            return {situacao:'err',code:0,msg:`contatosVinculados vazia err`};  
          }
          
        } else {
          return {situacao:'err',code:0,msg:`contatosVinculados err`};
        }

      } else {

        let valido = false;
        let errorMsg = '';
        if(canal === 'whatsapp' || canal === 'whatsappdirect') {
          const vCheck = await Whatsapp.checkPhone({token: empresaUid,contatoOrigem:origem});
          if(vCheck.situacao === 'suc') {
            valido = true;
          } else {
            errorMsg = vCheck.msg;
          }
        } else {
          valido = true;
        }

        if(valido) {
          await db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({ situacao: 1 }, {merge: true});


          //ADD NEW CONTATO
          const dadosVerificacao = {
            uid:contatoUid,
            nome,
            canal,
            origem
          }
          CaixaEntrada.AtualizacaoContato(empresaUid,dadosVerificacao)
          .catch(errVeri=>{
            let msg = 'Falha no processo de verificacao de contato no SQL | '+errVeri
            console.log(msg)

          })
         



          
          return {situacao:'suc',code:0,msg:'Contato válido.'};
        } else {
          await db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({ situacao: 4, errorMsg }, {merge: true});
          
          return {situacao:'err',code:0,msg:`Contato inválido. ${errorMsg}`};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`contatoCreate err:${err.message}`};
    }
  },

  async contatoOnUpdate(params: any) {

    try {
      const { empresaUid, contatoUid, nome, origem, canal, nomeClienteVinculado, favorito, uidClienteVinculado, updateInterno } = params;

      if(updateInterno === undefined || updateInterno === false) {
        return {situacao:'suc',code:0,msg:`Nada a atualizar.`};
      }
      
      const updateData = {
        contatoNome: nome,
        nomeClienteVinculado,
        uidClienteVinculado,
        favorito
      };
      console.log(updateData);

      const vChat: any = await Chat.chatAtivoSelect({ token:empresaUid, canal, origem });
      if(vChat.situacao === 'suc') {
        console.log(`CHAT ATIVO ${vChat.dados.id}`);
        const chatId = vChat.dados.id;

        await db.collection(empresaUid).doc('chat').collection('conversas').doc(chatId).set(updateData, {merge: true});
      }
      
      const vChatFinalizados = await db.collection(empresaUid).doc('chat').collection('conversasfinalizadas').where('origem', '==', origem).get();
      if (!vChatFinalizados.empty) {
        for (const doc of vChatFinalizados.docs) {
          console.log(`CHAT FINALIZADOS ${doc.id}`);
          await db.collection(empresaUid).doc('chat').collection('conversasfinalizadas').doc(doc.id).set(updateData, {merge: true});
        }
      }

      const dadosVerificacao = {
        uid:contatoUid,
        nome,
        canal,
        origem
      }
      CaixaEntrada.AtualizacaoContato(empresaUid,dadosVerificacao)
      .catch(errVeri=>{
        let msg = 'Falha no processo de verificacao de contato no SQL | '+errVeri
        console.log(msg)

      })


      await db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({ updateInterno: false }, {merge: true});

      return {situacao:'suc',code:0,msg:`Conversas atualizadas.`};
    } catch(err) {
      return {situacao:'err',code:0,msg:`contatoOnUpdate err:${err.message}`};
    }
  },

  async contatoDelete(params: any) {
    const { empresaUid, contatoUid, canal, contatosVinculados } = params;

    try {
      if(canal.toUpperCase() === 'LISTA') {

        if(contatosVinculados !== undefined) {
          
          if(contatosVinculados.length > 0) {

            for(const contato of contatosVinculados) {

              const vContato:any = await db.collection(empresaUid).doc('chat').collection('contatos').doc(contato.id).get();
              if (vContato.exists) {
                
                const { gruposVinculados } = vContato.data();

                if(gruposVinculados !== undefined) {

                  let _gruposVinculados = [];

                  if(gruposVinculados.length > 0) {
                    _gruposVinculados = gruposVinculados.filter((el:any) => el.uid !== contatoUid);

                    const updateData = {
                      gruposVinculados: _gruposVinculados
                    };

                    await Contatos.contatoUpdate({ token: empresaUid, id: contato.id, updateData });
                  }
                }
              }
            }

            return {situacao:'suc',code:0,msg:'Atualizar contatos.'};
          } else {
            return {situacao:'err',code:0,msg:`contatosVinculados vazia err`};  
          }
          
        } else {
          return {situacao:'err',code:0,msg:`contatosVinculados err`};
        }

      } else {

        //DELETAR NA TABELA SQL 
        CaixaEntrada.verificarContatoDelete(empresaUid,contatoUid)
        .then(res=>{
          console.log('### Cadastro delete com sucesso ')
        })
        .catch(err=>{
          console.log('Falha ao atualizar cadastro '+err)
        })

        return {situacao:'err',code:0,msg:`Nada a fazer. Canal ${canal}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`contatoCreate err:${err.message}`};
    }
  },
  
}

export default Contatos;