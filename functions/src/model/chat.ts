import * as admin from 'firebase-admin';

import Usuarios from './usuarios';
import Contatos from './contato';
import { db } from '../index';

import Telegram from './telegram';
import Twilio from './twilio';
import Facebook from './facebook';
import Whatsapp from './whatsapp';
import Log from './log';
import Empresa from './empresa';
import Apoio from './apoio';

import Watson from './watson';
import CaixaEntrada from './mysql/caixa_entrada'

import * as fs from 'fs';
const speech = require('@google-cloud/speech');
const request = require('request');

const Chat = {

  async chatAtivoSelect(params: any) {
    const token = params.token;
    const canalSearch = params.canal;
    const contatoOrigemBusca = params.origem;

    try {
      const snapshot = await db.collection(token).doc('chat').collection('conversas').where('contatoOrigem', '==', contatoOrigemBusca).where('situacao', 'in', [1,2,3]).get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não existem registros.'};
      } else {

        let chats = {};

        for (const doc of snapshot.docs) {
          const { canal }  = doc.data();

          if(canalSearch === canal) {
            chats = {
              id: doc.id,
              ...doc.data()
            };
          }
        }

        if(Object.keys(chats).length > 0) {
          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:chats};
        } else {
          return {situacao:'nocach',code:0,msg:`Conflito ao localizar contato `};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:'chatAtivoSelect err:'+err.message};   
    };
  },

  async chatsSelect(params: any) {
    const { token, uidConversa } = params;

    try {
      if(uidConversa === '') {
        const snapshot = await db.collection(token).doc('chat').collection('conversas').get();
        if (snapshot.empty) {
          return {situacao:'nocach',code:0,msg:'não existem registros.',dados:[]};
        } else {
          
          const arr:any[] = [];
          for (const doc of snapshot.docs) {
            const { canal, contatoNome, contatoOrigem, contatoUid, conversao, createAt, intencao, photo, qtdA, situacao, usuarioNome, usuarioUid } = doc.data();

            const chat = {
              id: doc.id,
              canal, 
              contatoNome, 
              contatoOrigem, 
              contatoUid, 
              conversao, 
              createAt, 
              intencao, 
              photo, 
              qtdA, 
              situacao, 
              usuarioNome, 
              usuarioUid
            };

            arr.push(chat);
          };

          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:arr};
        }
      } else {
        const snapshot:any = await db.collection(token).doc('chat').collection('conversas').doc(uidConversa).get();
        if (snapshot.exists) {
          const arr:any[] = [];
          const { canal, contatoNome, contatoOrigem, contatoUid, conversao, createAt, intencao, photo, qtdA, situacao, usuarioNome, usuarioUid } = snapshot.data();

          const chat = {
            id: snapshot.id,
            canal, 
            contatoNome, 
            contatoOrigem, 
            contatoUid, 
            conversao, 
            createAt, 
            intencao, 
            photo, 
            qtdA, 
            situacao, 
            usuarioNome, 
            usuarioUid
          };
          arr.push(chat);
          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:arr};
        } else {
          return {situacao:'nocach',code:0,msg:'não existem registros.',dados:[]};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async chatAdd(params: any) {
    const token = params.token;
    const chatData = params.data;

    try {
      await Log.logInsert({ empresaUid: token, categoria: 'conversas', processoUid: chatData.contatoOrigem, data: JSON.stringify(chatData), mensagem: 'Conversa criada' });

      const iChat = await db.collection(token).doc('chat').collection('conversas').add(chatData);
      return {situacao:'suc',code:0,msg:'Contato adicionado com sucesso.',id:iChat.id};
    } catch(err) {
      return {situacao:'err',code:0,msg:`chatAdd err:${err.message}`};
    }
  },

  async chatUpdate(params: any) {
    const token = params.token;
    const chatId = params.id;
    const updateData = params.data;

    try {
      await db.collection(token).doc('chat').collection('conversas').doc(chatId).set(updateData, {merge: true});

      return {situacao:'suc',code:0,msg:'Chat atualizado com sucesso.'};
    } catch(err) {
      return {situacao:'err',code:0,msg:`chatUpdate err:${err.message}`};
    };
  },

  async getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  },

  async mensagemAck(params: any) {
    const token = params.token;
    const mensagemId = params.id;
    const updateData = params.data;

    try {
      const snapshot = await db.collection(token).doc('chat').collection('conversas').get();
      if (snapshot.empty) {
        return {situacao:'nocach',code:0,msg:'não existem registros.',dados:[]};
      } else {
        
        for (const doc of snapshot.docs) {
          const { contatoUid } = doc.data();

          const snapshot2:any = await db.collection(token).doc('chat').collection('conversas').doc(contatoUid).collection('mensagens').where('id', '==', mensagemId).get();
          if (!snapshot2.empty) {
            for (const doc2 of snapshot2.docs) {
              const id = doc2.id;

              //VERIFICAR LISTA
              const { listaTransmissaoUid, disparoUid } = doc2.data();

              if(listaTransmissaoUid !== undefined && listaTransmissaoUid !== '') {

                if(updateData.entregueTag === 1) {
                  const listaUpdate = {
                    wppVisualizado: true
                  }; 
                  await db.collection(token).doc('chat').collection('listatransmissao').doc('disparos').collection(listaTransmissaoUid).doc(disparoUid).set(listaUpdate,{merge:true});
                }
              }
              //

              const uMsg = await Chat.mensagemUpdate({ token, contatoUid, id, data: updateData });
              if(uMsg.situacao === 'suc') {
                return {situacao:'suc',code:0,msg:'Mensagem atualizada com sucesso.'};
              }
            }
          }
        }
        return {situacao:'err',code:0,msg:'Não encontrei a mensagem.'+JSON.stringify(params)};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:'mensagemSelect err:'+err.message};   
    }
  },

  async mensagemAdd(params: any) {
    const { token } = params;
    const messageData = params.data;

    try {
      const iMsg = await db.collection(token).doc('chat').collection('conversas').doc(messageData.contatoUid).collection('mensagens').add(messageData);

      if(messageData.conversaUid !== '') await db.collection(token).doc('chat').collection('conversas').doc(messageData.conversaUid).set({ ultMensagemData: new Date().getTime() }, {merge: true});

      return {situacao:'suc',code:0,msg:'Mensagem adicionada com sucesso.',id:iMsg.id}
    } catch(err) {
      return {situacao:'err',code:0,msg:`MensagemAdd err:${err.message}`}
    }
  },

  async mensagemUpdate(params: any) {
    const { token, contatoUid, id, data } = params;
    
    try {
      /*
      * entregueTag = 4 Triangulo vermelho erro
      * entregueTag = 3 um Tick preto enviado
      * entregueTag = 2 dois tick preto recebido
      * entregueTag = 1 dois tick azul visualizado
      * entregueTag = 0 relógio preto
      */
      await db.collection(token).doc('chat').collection('conversas').doc(contatoUid).collection('mensagens').doc(id).set(data, {merge: true});

      return {situacao:'suc',code:0,msg:'Mensagem atualizado com sucesso.'};
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    };
  },

  async mensagemPush(params: any) {
    const { token, data } = params;
    //ENVIAR PUSH
    const params2 = {
      token,
      userUid:data.usuarioUid
    };
    
    try {
      const vUsuarios:any = await Usuarios.usuariosSelect(params2);
      if(vUsuarios.situacao === 'suc') {
        let msgerr = '';

        for (const element of vUsuarios.dados) {
          const params3 = {
            userUid: element.userUid
          };
          const vPush = await Usuarios.pushSelect(params3);
          if(vPush.situacao === 'suc') {
            const pushToken:string = vPush.pushToken;
            
            let msg = '';
            if(data.tipo === 'texto')
            {
              msg = data.mensagem
            }
            else
            {
              msg = 'Enviou '+data.tipo ;
            }
           

            //ADICIONAR PUSHER PARA ENTREGA
            const addPush = await db.collection('pushtest').add({
              token:pushToken,
              title:data.autorNome,
              body:msg
            })
            if(addPush){
              msgerr += '-suc-'+JSON.stringify(addPush);
            }

            
           
          } else {
            msgerr += '(4) '+vPush.msg;
          }
        }
        return {situacao:'suc',code:0,msg:'Push enviado com sucesso. '+msgerr};     
      } else {
        return {situacao:'err',code:0,msg:'(2) '+vUsuarios.msg};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  checkFileTipo(params: any) {
    const { filename } = params;

    try {
      let tipo = 'texto';
      const fileLink = filename.split('?').shift();
      const ext = fileLink.split('.').pop();

      const arrImagem = ['eps', 'tiff', 'svg', 'bmp', 'png', 'jpg', 'jpeg'];
      const arrVideo = ['mp4','gif'];
      const arrAudio = ['wma', 'flac', 'mp3', 'ogg', 'oga'];
      const arrDocumento = ['rtf', 'dec', 'exe', 'js', 'php', 'css', 'html', 'xml', 'csv', 'pdf', 'zip', 'rar', 'txt', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'];
      if (arrImagem.includes(ext.toLowerCase())) {
        tipo = 'imagem';
      } else if (arrVideo.includes(ext.toLowerCase())) {
        tipo = 'video';
      } else if (arrAudio.includes(ext.toLowerCase())) {
        tipo = 'audio';
      } else if (arrDocumento.includes(ext.toLowerCase())) {
        tipo = 'documento';
      }
      
      return {situacao:'suc',code:0,msg:'Mensagem adicionada com sucesso.',tipo:tipo}
    } catch(err) {
      return {situacao:'err',code:0,msg:`checkFileTipo err:${err.message}`}
    }
  },

  getPublicLink(params:any) {
    const { token, link } = params;

    const arrLink = link.split('?').shift();
    const ext = arrLink.split('.').pop();

    const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
    const dest = `/tmp/${filename}`;
    
    return new Promise((resolve, reject) => {
      try {
        request.head(link, function(err:any, res:any, body:any){
          request(link).pipe(fs.createWriteStream(dest)).on('close', async () => {
            try {
              const bucket = admin.storage().bucket();
              const destination = `${token}/docmensagens/${filename}`;
              const [file]:any = await bucket.upload(dest, {destination: destination});
              const result = await file.getSignedUrl({
                action: 'read',
                expires: '03-17-2025'
              });

              // Apoio.deleteTmpFolder('/tmp');

              resolve({situacao:'suc',code:0,msg:`Link gerado`,url:result[0]});
            } catch (err) {
              reject({situacao:'err',code:0,msg:`Upload err: ${err.message}`});
            }
          });
        }); 
      } catch (err) {
        reject({situacao:'err',code:0,msg:`getPublicLink err: ${err.message}`});
      }
    });
  },

  async resetMensagem(params: any) {;
    try {
      const { token, autorNumero, canal } = params;

      let contatoUid = '';
      const snapshot = await db.collection(token).doc('chat').collection('conversas').where('contatoOrigem', '==', autorNumero).where('canal', '==', canal).where('situacao','in',[1,2,3]).get();
      if (!snapshot.empty) {

        for (const doc of snapshot.docs) {
          const conversaUid = doc.id;
          contatoUid = doc.data().contatoUid;

          await Chat.finalizarChat({ token, conversaUid });
        }

        if(contatoUid !== '') {
          await Contatos.contatoUpdate({ token, id: contatoUid, updateData: { situacao: 1 } });
        }
      }
      
      let iSend = { msg: '' };

      if(canal.toUpperCase() === 'TELEGRAM') {

        iSend = await Telegram.sendMessage({ empresaUid: token , data: { id: 0, contatoUid, tipo: 'texto', mensagem: 'Resetado com sucesso', anexo: '', contatoOrigem: autorNumero } });
  
      } else if(canal.toUpperCase() === 'WHATSAPP') {
  
        iSend = await Whatsapp.sendMessage({ empresaUid: token , data: { id: 0, contatoUid, tipo: 'texto', mensagem: 'Resetado com sucesso', anexo: '', contatoOrigem: autorNumero } });
  
      } else if(canal.toUpperCase() === 'FACEBOOK') {
  
        iSend = await Facebook.sendMessage({ empresaUid: token , data: { id: 0, contatoUid, tipo: 'texto', mensagem: 'Resetado com sucesso', anexo: '', contatoOrigem: autorNumero } });
  
      } else if(canal.toUpperCase() === 'WHATSAPPDIRECT') {
  
        iSend = await Twilio.sendMessage({ empresaUid: token , data: { id: 0, contatoUid, tipo: 'texto', mensagem: 'Resetado com sucesso', anexo: '', contatoOrigem: autorNumero } });
  
      } else {
        return {situacao:'err',code:0,msg:'Não habilitado pra esse canal'};
      }

      return {situacao:'suc',code:0,msg:`Resetado com sucesso. ${iSend.msg}`};
    } catch (err) {
      return {situacao:'err',code:0,msg:`resetMensagem err: ${err.message}`};
    }
  },

  async finalizarChat(params: any) {;
    try {
      const { token, conversaUid } = params;

      // const vChat:any = await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).get();
      // if(vChat.exists) {
      //   const { contatoUid } = vChat.data();

        await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ situacao: 6 } , { merge: true });

        // await db.collection(token).doc('chat').collection('contatos').doc(contatoUid).set({ situacao: 1 } , { merge: true });

        return {situacao:'suc',code:0,msg:`Conversa finalizada`};
      // } else {
      //   return {situacao:'err',code:0,msg:`vChat err: Falha ao encontrar conversa`};  
      // }
    } catch (err) {
      return {situacao:'err',code:0,msg:`finalizarChat err: ${err.message}`};
    }
  },

  async procMensagemRecebida(params: any) {
    try {
      const {token, canal, autorNome, autorNumero, idMensagem, tipo, anexo, citacao, legenda, empresaConfig } = params;
      let { mensagem } = params;

      if(mensagem.toUpperCase() === '/RESET') {
        const iReset = await Chat.resetMensagem({ token, autorNumero, canal });
        return iReset;
      }

      const consumoData = {
        createAt: new Date().getTime(),
        tipo: 'Recebimento de mensagem',
        codetipo: 2,
        usuarioUid: '',
        msgtipo: tipo,
        anexo: anexo,
        mensagem: mensagem,
        laraProcesso: 2,
        laraResposta: '',
        qtdProc: 0
      };
      const iConsumo = await db.collection(token).doc('dados').collection('consumo').add(consumoData);

      const produtividadeData = {
        createAt: new Date().getTime(),
        mensagemTexto: mensagem,
        anexoTexto: anexo,
        processadoIA: false,
        intencaoIA: '',
        intencaoIaUid: '',
        intencaoIaNome: ''
      };
      const iProdutividade = await db.collection(token).doc('dados').collection('aprendizado').doc('relatorios').collection('produtividade').add(produtividadeData);

      if(tipo.toUpperCase() === 'AUDIO') {

        const client = new speech.SpeechClient();
        
        const arrLink = anexo.split('?').shift();
        const ext = arrLink.split('.').pop();
        const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
        const dest = `/tmp/${filename}`;

        const getTranscrit = new Promise(async (resolve:any,reject:any) => {
          await request(anexo).pipe(fs.createWriteStream(dest)).on('close', async () => {

            const file = fs.readFileSync(dest);
            const audioBytes = file.toString('base64');

            const audio = {
              content: audioBytes,
            };
            const config = {
              encoding: 'OGG_OPUS',
              sampleRateHertz: 16000,
              languageCode: 'pt-BR',
            };
            const audioData = {
              audio: audio,
              config: config,
            };
            const [response] = await client.recognize(audioData);

            mensagem = response.results.map((transc: any) => transc.alternatives[0].transcript).join('\n');
            resolve(mensagem);
          });
        });

        mensagem = await getTranscrit;
      }
      //CHECK CONFIG LIVECHAT

      const corPhotoCheck: any = await Contatos.getRandomColor();
      
      let contatoData = {
        uid: '',
        photo: corPhotoCheck,
        nome: autorNome,
        canal: canal,
        favorito: false,
        livechat: false,
        origem: autorNumero,
        nomeClienteVinculado: '',
        uidClienteVinculado: '',
        usuarioUid: '',
        usuarioNome: '',
        tempoResposta: 5
      };
      
      let cadastrar = false;
      const vContato: any = await Contatos.contatoSelect({ token, canal: canal, origem: autorNumero });
      if (vContato.situacao === 'nocach') {
        cadastrar = true;

        //############## VERFICAR DIGITO 9 ###################
        if((canal.toUpperCase() === 'WHATSAPP' || canal.toUpperCase() === 'WHATSAPPDIRECT') && autorNumero.length === 12) {

          const newAutorNumero = `${autorNumero.substr(0,4)}9${autorNumero.substr(4)}`;

          const vContato2: any = await Contatos.contatoSelect({ token, canal: canal, origem: newAutorNumero });
          if (vContato2.situacao === 'suc') {
            contatoData = vContato2.dados;

            const uContato = await Contatos.contatoUpdate({ token, id: contatoData.uid, updateData: { origem: newAutorNumero } });
            if(uContato.situacao === 'suc') {
              contatoData.origem = newAutorNumero;
              cadastrar = false;
            }
          }
        }
        //############## VERFICAR DIGITO 9 ###################
        
      } else if (vContato.situacao === 'suc') {

        contatoData = vContato.dados;

      } else {
        return{situacao:'err',code:0,msg:vContato.msg};
      }

      if(cadastrar) {

        const contatoDataAdd = {
          createAt: new Date().getTime(),
          livechat: contatoData.livechat,
          situacao: 2,
          uidClienteVinculado: contatoData.nomeClienteVinculado,
          nomeClienteVinculado: contatoData.uidClienteVinculado,
          photo: contatoData.photo,
          nome: contatoData.nome,
          canal: contatoData.canal,
          favorito: contatoData.favorito,
          origem: contatoData.origem,
          usuarioUid: contatoData.usuarioUid,
          usuarioNome: contatoData.usuarioNome,
          tempoResposta: contatoData.tempoResposta
        };

        const iContato: any = await Contatos.contatoInsert({ token, data: contatoDataAdd });
        if (iContato.situacao === 'suc') {
          contatoData.uid = iContato.id;
          contatoData.photo = contatoDataAdd.photo;
          contatoData.nome = contatoDataAdd.nome;
          contatoData.canal = contatoDataAdd.canal;
          contatoData.favorito = contatoDataAdd.favorito;
          contatoData.origem = contatoDataAdd.origem;
          contatoData.livechat = contatoDataAdd.livechat;

          let situacao = 1;
          if(contatoData.livechat) {
            situacao = 2;
          }

          if(situacao === 1 && mensagem === '') {
            situacao = 2;
          }

          if(situacao === 1) {
            const vSaldo = await Empresa.checkSaldo({ empresaUid:token });
            if(vSaldo.situacao !== 'suc') {
              situacao = 2;
            }
          }

          let qtdA = 1;
          if(situacao === 1) {
            qtdA = 0;
          }

          const jsonSend = {
            contatoNome: contatoData.nome,
            contatoUid: contatoData.uid,
            contatoOrigem: contatoData.origem,
            createAt: new Date().getTime(),
            favorito: contatoData.favorito,
            photo: contatoData.photo,
            situacao: situacao,
            canal: contatoData.canal,
            context: '',
            conversao: 0,
            intencao: '',
            qtdA: qtdA,
            usuarioNome: '',
            usuarioUid: '',
            nomeClienteVinculado: null,
            uidClienteVinculado: null,
            slaAlerta:false,
            slaAgAtendimento: true,
            slaPainel: false,
            tempoResposta: contatoData.tempoResposta
          };
          
          const iChat = await Chat.chatAdd({ token, data: jsonSend });
          if(iChat.situacao === 'suc') {
            const json:any = {
              id: idMensagem,
              mensagem: mensagem,
              anexo: anexo,
              canal: contatoData.canal,
              citacao: citacao,
              legenda: legenda,
              createAt: new Date().getTime(),
              es: 'e',
              tipo: tipo,
              autorNome: contatoData.nome,
              autorUid: contatoData.uid,
              contatoNome: contatoData.nome,
              contatoOrigem: contatoData.origem,
              contatoUid: contatoData.uid,
              conversaUid: iChat.id,
              enviadoTag: 1,
              enviadoData: new Date().getTime(),
              entregueTag: 0,
              entregueData: new Date().getTime(),
              usuarioUid: '',
              usuarioNome: '',
              photo:contatoData.photo,
              consumoUid: iConsumo.id,
              processoIa: false,
              produtividadeUid: iProdutividade.id,
              conversaData: JSON.stringify(jsonSend),
              empresaConfig
            };

            const iMsg = await Chat.mensagemAdd({ token, data: json });
            if(iMsg.situacao === 'suc') {

              json.uid = iMsg.id;

              let watsonmsg = '';
              if(jsonSend.situacao === 1) {
                 const iWatson = await Watson.procMensagem({ token, mensagemData: json, context: {}});
                 watsonmsg = iWatson.msg;
              } else {
                
                await db.collection(token).doc('chat').collection('conversasdistribuicao').add({ createAt: new Date().getTime(), token, ...json});
              }

              return {situacao:'suc',code:0,msg:`Mensagem processada. ${iMsg.msg} ${watsonmsg}`};
            } else {
              return {situacao:'err',code:0,msg:iMsg.msg};
            }
          } else {
            return {situacao:'err',code:0,msg:iChat.msg};
          }
        } else {
          return {situacao:'err',code:0,msg:iContato.msg};
        }

      } else {

        const uContato = await Contatos.contatoUpdate({ token, id: contatoData.uid, updateData: { situacao: 2, contatoAt:new Date().getTime() } });
        if(uContato.situacao === 'suc') {

          const vChat: any = await Chat.chatAtivoSelect({ token, canal: contatoData.canal, origem: contatoData.origem });

          const json: any = {
            id: idMensagem,
            mensagem: mensagem,
            anexo: anexo,
            canal: contatoData.canal,
            citacao: citacao,
            legenda: legenda,
            createAt: new Date().getTime(),
            es: 'e',
            tipo: tipo,
            autorNome: contatoData.nome,
            autorUid: contatoData.uid,
            contatoNome: contatoData.nome,
            contatoOrigem: contatoData.origem,
            contatoUid: contatoData.uid,
            conversaUid: '',
            enviadoTag: 1,
            enviadoData: new Date().getTime(),
            entregueTag: 0,
            entregueData: new Date().getTime(),
            usuarioUid: '',
            usuarioNome: '',
            photo: contatoData.photo,
            consumoUid: iConsumo.id,
            processoIa: false,
            produtividadeUid: iProdutividade.id,
            empresaConfig
          };

          if(vChat.situacao === 'suc') {
            const { usuarioUid, context } = vChat.dados;
           
            const chatId = vChat.dados.id;
            let situacao = vChat.dados.situacao;

            if(situacao === 1 && json.mensagem === '') {
              situacao = 2;
            }

            if(situacao === 1) {
              const vSaldo = await Empresa.checkSaldo({ empresaUid:token });
              if(vSaldo.situacao !== 'suc') {
                situacao = 2;
              }
            }

            let qtdA:any = admin.firestore.FieldValue.increment(1)
            if(situacao === 1) {
              qtdA = 0;
            }
            
            const uChat = await Chat.chatUpdate({ token, id: chatId, data: {
              situacao: situacao,
              qtdA: qtdA
            } });
            if(uChat.situacao === 'suc') {
              json.conversaUid = chatId;
              json.usuarioUid = usuarioUid;

              vChat.dados.situacao = situacao;
              json.conversaData = JSON.stringify(vChat.dados);
              
              const iMsg = await Chat.mensagemAdd({ token, data: json });
              if(iMsg.situacao === 'suc') {

                json.uid = iMsg.id;

                let watsonmsg = '';
                let pushmsg = '';
                if(situacao === 1) {
                   const iWatson = await Watson.procMensagem({ token, mensagemData: json, context: JSON.parse(context)});
                   watsonmsg = iWatson.msg;
                } else {
                  const vEmpresa = await Empresa.horarioAtendimentoCheck({ empresaUid: token });
                  if(vEmpresa.situacao === 'suc') {
                    const iPush = await Chat.mensagemPush({ token, data:json });
                    pushmsg = iPush.msg;
                  }
                }

                return {situacao:'suc',code:0,msg:`Mensagem processada. ${iMsg.msg} ${watsonmsg} ${pushmsg}`};
              } else {
                return {situacao:'err',code:0,msg:iMsg.msg};
              }
            } else {
              return {situacao:'err',code:0,msg:uChat.msg};
            }

          } else {

            let situacao = 1;
            if(contatoData.livechat) {
              situacao = 2;
            }

            if(situacao === 1 && json.mensagem === '') {
              situacao = 2;
            }

            if(situacao === 1) {
              const vSaldo = await Empresa.checkSaldo({ empresaUid:token });
              if(vSaldo.situacao !== 'suc') {
                situacao = 2;
              }
            }

            let qtdA = 1;
            if(situacao === 1) {
              qtdA = 0;
            }

            const slaPainel = false;
            const contatoUsuarioUid = '';
            const contatoUsuarioNome= '';
            // if(contatoData.usuarioUid !== undefined && contatoData.usuarioNome !== undefined) {
            //   contatoUsuarioUid = contatoData.usuarioUid;
            //   contatoUsuarioNome = contatoData.usuarioNome;
            //   slaPainel = true;
            // }
            if(contatoData.tempoResposta === undefined) {
              contatoData.tempoResposta = 5;
            }

            const jsonSend = {
              contatoNome: contatoData.nome,
              contatoUid: contatoData.uid,
              contatoOrigem: contatoData.origem,
              createAt: new Date().getTime(),
              favorito: contatoData.favorito,
              photo: contatoData.photo,
              situacao: situacao,
              canal: contatoData.canal,
              context: '',
              conversao: 0,
              intencao: '',
              qtdA: qtdA,
              usuarioNome: contatoUsuarioNome,
              usuarioUid: contatoUsuarioUid,
              nomeClienteVinculado: contatoData.nomeClienteVinculado,
              uidClienteVinculado: contatoData.uidClienteVinculado,
              slaAlerta:false,
              slaAgAtendimento: true,
              slaPainel: slaPainel,
              tempoResposta: contatoData.tempoResposta
            };
            
            const iChat = await Chat.chatAdd({ token, data: jsonSend });
            if(iChat.situacao === 'suc') {
              json.conversaUid = iChat.id;

              json.conversaData = JSON.stringify(jsonSend);

              const iMsg = await Chat.mensagemAdd({ token, data: json });
              if(iMsg.situacao === 'suc') {

                json.uid = iMsg.id;

                let watsonmsg = '';
                if(jsonSend.situacao === 1) {
                  const iWatson = await Watson.procMensagem({ token, mensagemData: json, context: {}});
                  watsonmsg = iWatson.msg;
                } else {
                  await db.collection(token).doc('chat').collection('conversasdistribuicao').add({ createAt: new Date().getTime(), token, ...json});
                }

                return {situacao:'suc',code:0,msg:`Mensagem processada. ${iMsg.msg} ${watsonmsg}`};
              } else {
                return {situacao:'err',code:0,msg:iMsg.msg};
              }
            } else {
              return {situacao:'err',code:0,msg:iChat.msg};
            }
          }

        } else {
          return{situacao:'err',code:0,msg:uContato.msg};
        }

      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`procMensagemRecebida err:${err.message}`}
    }
  },

  async encaminharMensagens(params: any) {
    try {
      const { token, encaminhamentoUid, contatoUid, mensagemUid, usuarioNome, usuarioUid, conversaUid, contatoUidOrigem } = params;
      
      const vContato:any = await db.collection(token).doc('chat').collection('contatos').doc(contatoUid).get();
      if (vContato.exists) {
        
        const { nome, origem, canal } = vContato.data();

        const vMensagem:any = await db.collection(token).doc('chat').collection('conversas').doc(contatoUidOrigem).collection('mensagens').doc(mensagemUid).get();
        if (vMensagem.exists) {
        
          const { mensagem, tipo, id } = vMensagem.data();
          const canalOrigem = vMensagem.data().canal;
          let { anexo, citacao, legenda } = vMensagem.data();

          if(anexo === undefined) {
            anexo = '';
          }
          if(citacao === undefined) {
            citacao = '';
          }
          if(legenda === undefined) {
            legenda = '';
          }

          let forwardId;
          if(canalOrigem === 'whatsapp') {
            forwardId = id;
          }

          const mensagemData = {
            anexo: anexo,
            autorNome: usuarioNome, 
            autorUid: usuarioUid, 
            canal: canal, 
            citacao: citacao, 
            contatoNome: nome, 
            contatoOrigem: origem, 
            contatoUid: contatoUid, 
            conversaUid: conversaUid,
            createAt: new Date().getTime(),
            entregueData: null, 
            entregueTag: 3, 
            enviadoData: null, 
            enviadoTag: 2, 
            es: 's', 
            id: null,
            forwardId: forwardId, 
            legenda: legenda, 
            mensagem: mensagem, 
            tipo: tipo, 
            usuarioNome: usuarioNome, 
            usuarioUid: usuarioUid
          };

          const iMensagem = await Chat.mensagemAdd({ token: token, data: mensagemData });
          if(iMensagem.situacao === 'suc') {

            try {
              await db.collection(token).doc('chat').collection('encaminhamento').doc(encaminhamentoUid).set({ processado: true, dtProcesso: new Date().getTime(), novaMensagemUid: iMensagem.id }, { merge: true });

              return {situacao:'suc',code:0,msg: `Mensagem encaminhada`};
            } catch(err) {
              return {situacao:'err',code:0,msg: `attEncaminhamento: ${err.message}`};
            }
          } else {
            return {situacao:'err',code:0,msg:`Falha ao consultar mensagem`};
          }

        } else {
          return {situacao:'err',code:0,msg:`Falha ao consultar mensagem`};
        }
      } else {
        return {situacao:'err',code:0,msg:`Falha ao consultar contato`};
      }
    } catch (err) {
      return {situacao:'err',code:0,msg:`encaminharMensagens err: ${err.message}`};
    }
  },
  async FinalizacaoDeChamada(params:any)
  {
    try {
      const { empresaUid, conversaUid, usuarioOrigemUid, usuarioOrigemNome, motivo } = params;

      const vConversa:any = await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).get();
      if (vConversa.exists) {
      
        const { canal, contatoOrigem, contatoNome, contatoUid } = vConversa.data();
        //ADD BALAO MSG
        let motivoMsg = '';
        if(motivo !== '') {
          motivoMsg = `\nMotivo: ${motivo}`;
        }
        const mensagem = `Finalização de chamada Motivo: ${motivoMsg}`;
        const mensagemData = {
          anexo: '',
          autorNome: usuarioOrigemNome, 
          autorUid: usuarioOrigemUid, 
          canal: canal, 
          citacao: '', 
          contatoNome: contatoNome, 
          contatoOrigem: contatoOrigem, 
          contatoUid: contatoUid, 
          conversaUid: conversaUid,
          createAt: new Date().getTime(),
          entregueData: null, 
          entregueTag: 3, 
          enviadoData: null, 
          enviadoTag: 2, 
          es: 't',  
          legenda: '', 
          mensagem: mensagem, 
          tipo: 'info', 
          usuarioNome: usuarioOrigemNome, 
          usuarioUid: usuarioOrigemUid
        };
        const iMensagem = await Chat.mensagemAdd({ token: empresaUid, data: mensagemData });
        if(iMensagem.situacao === 'suc') {

          await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).set({situacao:6},{merge:true})
          
          return {situacao:'suc',code:0,msg: `Conversa transferida ocm sucesso.`};
        } else {
          return {situacao:'err',code:0,msg:`mensagemAdd err: ${iMensagem.msg}`}; 
        }
      } else {
        return {situacao:'err',code:0,msg:`vConversa err: Não consegui localizar a conversa`};
      }
    } catch (err) {
      return {situacao:'err',code:0,msg:`transferenciaCreate err: ${err.message}`};
    }
  },
  async transferenciaCreate(params: any) {
    try {
      const { empresaUid, transferenciaUid, conversaUid, usuarioOrigemUid, usuarioOrigemNome, usuarioDestinoUid, usuarioDestinoNome, motivo } = params;

      const vConversa:any = await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).get();
      if (vConversa.exists) {
      
        const { canal, contatoOrigem, contatoNome, contatoUid } = vConversa.data();
        //ADD BALAO MSG
        let motivoMsg = '';
        if(motivo !== '') {
          motivoMsg = `\nMotivo: ${motivo}`;
        }
        const mensagem = `Transferência de chamada de ${usuarioOrigemNome} para ${usuarioDestinoNome}${motivoMsg}`;
        const mensagemData = {
          anexo: '',
          autorNome: usuarioOrigemNome, 
          autorUid: usuarioOrigemUid, 
          canal: canal, 
          citacao: '', 
          contatoNome: contatoNome, 
          contatoOrigem: contatoOrigem, 
          contatoUid: contatoUid, 
          conversaUid: conversaUid,
          createAt: new Date().getTime(),
          entregueData: null, 
          entregueTag: 3, 
          enviadoData: null, 
          enviadoTag: 2, 
          es: 't',  
          legenda: '', 
          mensagem: mensagem, 
          tipo: 'info', 
          usuarioNome: usuarioOrigemNome, 
          usuarioUid: usuarioOrigemUid
        };
        const iMensagem = await Chat.mensagemAdd({ token: empresaUid, data: mensagemData });
        if(iMensagem.situacao === 'suc') {

          //ADD NOTIFICACOES
          const notificacaoData = {
            createAt: new Date().getTime(),
            tipo: 'transferencia',
            tipoId: transferenciaUid,
            contatoUid: contatoUid,
            finalizado: false,
            titulo: 'Nova transferência de atendimento',
            mensagem: `Você recebeu uma transferência de atendimento de ${usuarioOrigemNome}${motivoMsg}`,
          };

          await db.collection(empresaUid).doc('chat').collection('transferencia').doc(transferenciaUid).set({ mensagemUid: iMensagem.id, processar: false }, {merge:true});

          const iNotificacao:any = await db.collection(empresaUid).doc('notificacoes').collection(usuarioDestinoUid).add(notificacaoData);

          await Log.logInsert({ empresaUid, categoria: 'conversas', processoUid: contatoOrigem, data: JSON.stringify(mensagemData), mensagem: `Transferência de ${usuarioOrigemNome} para ${usuarioDestinoNome}` });

          let pushmsg = '';
          const vEmpresa = await Empresa.horarioAtendimentoCheck({ empresaUid });
          if(vEmpresa.situacao === 'suc') {
            const iPush = await Chat.mensagemPush({ token: empresaUid, data: { usuarioUid:usuarioDestinoUid,tipo: 'texto',mensagem: notificacaoData.mensagem,autorNome: usuarioOrigemNome,contatoUid:contatoUid, conversaUid:conversaUid }});
            pushmsg = iPush.msg;
          }
          
          return {situacao:'suc',code:0,msg: `Conversa transferida ocm sucesso. ${pushmsg}`,id: iNotificacao.id};
        } else {
          return {situacao:'err',code:0,msg:`mensagemAdd err: ${iMensagem.msg}`}; 
        }
      } else {
        return {situacao:'err',code:0,msg:`vConversa err: Não consegui localizar a conversa`};
      }
    } catch (err) {
      return {situacao:'err',code:0,msg:`transferenciaCreate err: ${err.message}`};
    }
  },

  async transferenciaUpdate(params: any) {
    try {
      const { empresaUid, transferenciaUid, usuarioDestinoNome, usuarioDestinoUid, usuarioOrigemUid, usuarioOrigemNome, conversaUid, aceite, motivoRejeicao, mensagemUid, processar } = params;

      if(processar !== undefined && processar === false) {
        return {situacao:'suc',code:0,msg: `Não precisa processar nada`};
      }

      let mensagemRetorno = '';
      let mensagemCorpo = '';

      let motivoRej = '';
      if(motivoRejeicao !== '' && motivoRejeicao !== undefined) {
        motivoRej = `\n"${motivoRejeicao}"`;
      }

      if(aceite) {
        await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).set({ situacao: 2, usuarioUid:usuarioDestinoUid, usuarioNome:usuarioDestinoNome }, {merge:true});
        
        mensagemRetorno = `${usuarioDestinoNome} aceitou sua transferência`;

        mensagemCorpo = `Transferência de chamada de ${usuarioOrigemNome} para ${usuarioDestinoNome} Aceita`;
      } else {
        await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).set({ situacao: 2 }, {merge:true});

        mensagemRetorno = `${usuarioDestinoNome} rejeitou sua transferência: ${motivoRej}`;

        mensagemCorpo = `Transferência de chamada de ${usuarioOrigemNome} para ${usuarioDestinoNome} Rejeitada ${motivoRej}`;

        //ADD NOTIFICACOES
        const notificacaoData = {
          createAt: new Date().getTime(),
          tipo: 'aviso',
          tipoId: transferenciaUid,
          conversaUid: conversaUid,
          finalizado: false,
          titulo: 'Rejeição de transferência de atendimento',
          mensagem: mensagemRetorno,
        };
        await db.collection(empresaUid).doc('notificacoes').collection(usuarioOrigemUid).add(notificacaoData);
      }

      const vConversa:any = await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).get();
      if (vConversa.exists) {
      
        const { contatoUid } = vConversa.data();

        await db.collection(empresaUid).doc('chat').collection('conversas').doc(contatoUid).collection('mensagens').doc(mensagemUid).set({ mensagem: mensagemCorpo }, {merge:true});
      }
      
      return {situacao:'suc',code:0,msg: `Transferência concluída com sucesso`};
    } catch (err) {
      return {situacao:'err',code:0,msg:`transferenciaCreate err: ${err.message}`};
    }
  },

  async conversaDepartamento(params: any) {
    const { token, conversaUid } = params;

    try {
      console.log('############################# CONVERSA DEPARTAMENTO #########################');
      const vChat:any = await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).get();
      if (vChat.exists) {
        const { intencao, uidClienteVinculado, usuarioUid, canal, contatoUid, contatoNome, contatoOrigem, slaAgAtendimento, slaPainel, slaRoleta, slaPrimeiroAtendente } = vChat.data();

        if(slaAgAtendimento) {

          if(slaPainel) {
            return {situacao:'suc',code:0,msg:`Já fez todo ciclo. ` };
          }

          //PRIMEIRA COSIA
          const vContato:any = await db.collection(token).doc('chat').collection('contatos').doc(contatoUid).get();
          if(vContato.exists) {
            const contatoUsuarioUid = vContato.data().usuarioUid;
            const contatoUsuarioNome = vContato.data().usuarioNome;

            if(contatoUsuarioUid !== undefined && contatoUsuarioUid !== '' && contatoUsuarioNome !== undefined && contatoUsuarioNome !== '') {
              const mensagem = `Distribuição automática exclusiva para ${contatoUsuarioNome}`;
              const mensagemData = {
                anexo: '',
                autorNome: contatoUsuarioNome, 
                autorUid: contatoUsuarioUid, 
                canal: canal, 
                citacao: '', 
                contatoNome: contatoNome, 
                contatoOrigem: contatoOrigem, 
                contatoUid: contatoUid, 
                conversaUid: conversaUid,
                createAt: new Date().getTime(),
                entregueData: null, 
                entregueTag: 3, 
                enviadoData: null, 
                enviadoTag: 2, 
                es: 'd',  
                legenda: '', 
                mensagem: mensagem, 
                tipo: 'info', 
                usuarioNome: contatoUsuarioNome, 
                usuarioUid: contatoUsuarioUid
              };
              const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
              console.log(iMensagem);

              return {situacao:'suc',code:0,msg:`Conversa entregada ao usuario vinculado. `,userData: { userUid: contatoUsuarioUid, userNome: contatoUsuarioNome }};
            }
          }

          let departamento = intencao.toUpperCase();

          const arrayIntencao = ['COMERCIAL'];
          const arrayDepartamento = ['ADMINISTRADOR','FINANCEIRO','COMERCIAL','SUPORTE','FISCAL','ATENDIMENTO'];

          if(arrayIntencao.includes(intencao)) {
            //VERIFICAR REPRESENTANTE
            if(uidClienteVinculado !== '' && uidClienteVinculado !== null && uidClienteVinculado !== undefined) {
              
              const vParceiro:any = await db.collection(token).doc('dados').collection('parceiros').doc(uidClienteVinculado).get();
              if (vParceiro.exists) {
                const { representanteUid, representanteNome } = vParceiro.data();


                if(representanteUid !== '' && representanteUid !== undefined) {
                  await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ usuarioNome: representanteNome, usuarioUid: representanteUid }, {merge:true});

                  const mensagem = `Distribuição automática de (${departamento}) exclusivo para ${representanteNome}`;
                  const mensagemData = {
                    anexo: '',
                    autorNome: representanteNome, 
                    autorUid: representanteUid, 
                    canal: canal, 
                    citacao: '', 
                    contatoNome: contatoNome, 
                    contatoOrigem: contatoOrigem, 
                    contatoUid: contatoUid, 
                    conversaUid: conversaUid,
                    createAt: new Date().getTime(),
                    entregueData: null, 
                    entregueTag: 3, 
                    enviadoData: null, 
                    enviadoTag: 2, 
                    es: 'd',  
                    legenda: '', 
                    mensagem: mensagem, 
                    tipo: 'info', 
                    usuarioNome: representanteNome, 
                    usuarioUid: representanteUid
                  };
                  const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
                  console.log(iMensagem);

                  return {situacao:'suc',code:0,msg:`Conversa entregada ao representante. `,userData: { userUid: representanteUid, userNome: representanteNome }};
                }
              }
            }
          }

          if(!arrayDepartamento.includes(departamento)) {
            departamento = 'ATENDIMENTO';
          }

          let ultimoAtendente = '';
          const doc:any = await db.collection(token).doc('chat').collection('configuracoes').doc('atendimentorandom').get();
          if (doc.exists) {
            ultimoAtendente = doc.data()[departamento];
          }

          const arrayUsuarios:any[] = [];
          let arrayUsuariosDepartamento:any[] = [];

          console.log('ULTIMO ATENDENTE: '+ultimoAtendente);
          console.log('DEPARTAMENTO: '+departamento);

          const vUsers:any = await Usuarios.usuariosSelect({token, userUid: ''});
          if(vUsers.situacao === 'suc') {
            // arrayUsuarios = vUsers.dados;
            for(const userDados of vUsers.dados) {
              const vHorarioCheck = Usuarios.horarioAtendimentoCheck(userDados);
              if(vHorarioCheck.situacao === 'suc') {
                arrayUsuarios.push(userDados);
              }
            }
            
            console.log(JSON.stringify(arrayUsuarios));

            let ultimoAtendenteExiste = false;
            arrayUsuarios.forEach((elem:any) => {
              if(elem.departamento.toUpperCase() === departamento || elem.departamento.toUpperCase() === 'ADMINISTRADOR') {
                arrayUsuariosDepartamento.push(elem);
              }
              if(elem.userUid === ultimoAtendente) {
                ultimoAtendenteExiste = true;
              }
            });

            console.log(arrayUsuariosDepartamento.length);

            if(arrayUsuariosDepartamento.length === 0) {
              const mensagem = `Nenhum atendente disponível no departamento (${departamento}), alterando para ATENDIMENTO`;
              const mensagemData = {
                anexo: '',
                autorNome: '', 
                autorUid: '', 
                canal: canal, 
                citacao: '', 
                contatoNome: contatoNome, 
                contatoOrigem: contatoOrigem, 
                contatoUid: contatoUid, 
                conversaUid: conversaUid,
                createAt: new Date().getTime(),
                entregueData: null, 
                entregueTag: 3, 
                enviadoData: null, 
                enviadoTag: 2, 
                es: 'd',  
                legenda: '', 
                mensagem: mensagem, 
                tipo: 'info', 
                usuarioNome: '', 
                usuarioUid: ''
              };
              const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
              console.log(iMensagem);

              departamento = 'ATENDIMENTO';
              arrayUsuariosDepartamento = arrayUsuarios;
            }
            
            let achou = false;
            let atendenteData:any = {};

            console.log(JSON.stringify(arrayUsuariosDepartamento));
            if(arrayUsuariosDepartamento.length === 1) {
              atendenteData = {
                userUid: arrayUsuariosDepartamento[0].userUid,
                userNome: arrayUsuariosDepartamento[0].userNome
              };
            } else {
              for(let i = 0;i < arrayUsuariosDepartamento.length; i++) { 

                if(ultimoAtendenteExiste === false) {
                  atendenteData = {
                    userUid: arrayUsuariosDepartamento[i].userUid,
                    userNome: arrayUsuariosDepartamento[i].userNome
                  };
                  break;
                } else {
                  if(arrayUsuariosDepartamento.length === 1) {
                    atendenteData = {
                      userUid: arrayUsuariosDepartamento[i].userUid,
                      userNome: arrayUsuariosDepartamento[i].userNome
                    };
                    break; 
                  }
                  if(achou) {
                    atendenteData = {
                      userUid: arrayUsuariosDepartamento[i].userUid,
                      userNome: arrayUsuariosDepartamento[i].userNome
                    };
                    break;  
                  }
                  if(ultimoAtendente === arrayUsuariosDepartamento[i].userUid) {
                    achou = true;
                    if(i + 1 === arrayUsuariosDepartamento.length) i = -1;
                    continue;
                  }
                }
              
              }
            }
            
            console.log('atendenteData: '+JSON.stringify(atendenteData));

            if(slaRoleta >= (arrayUsuariosDepartamento.length - 1) || slaPrimeiroAtendente === atendenteData.userUid) {

              await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaPainel: true }, {merge:true});

              return {situacao:'suc',code:0,msg:`Já está com atendente que deveria estar. `,userData: atendenteData };
            }

            await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ intencao: departamento }, {merge:true});

            if(Object.keys(atendenteData).length > 0) {

              const updateData:any = {};
              updateData[departamento] = atendenteData.userUid;

              await db.collection(token).doc('chat').collection('configuracoes').doc('atendimentorandom').set(updateData, {merge:true});

              if(slaRoleta === undefined) {

                await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaRoleta: 0, slaPrimeiroAtendente: atendenteData.userUid }, {merge:true});
              } else {

                await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaRoleta: admin.firestore.FieldValue.increment(1) }, {merge:true});
              }

              await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ usuarioNome: atendenteData.userNome, usuarioUid: atendenteData.userUid }, {merge:true});
              
              if(departamento === 'COMERCIAL') {
                await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaAgAtendimento: false }, {merge: true});
              }

              const mensagem = `Distribuição automática de (${departamento}) para ${atendenteData.userNome}`;
              const mensagemData = {
                anexo: '',
                autorNome: atendenteData.userNome, 
                autorUid: atendenteData.userUid, 
                canal: canal, 
                citacao: '', 
                contatoNome: contatoNome, 
                contatoOrigem: contatoOrigem, 
                contatoUid: contatoUid, 
                conversaUid: conversaUid,
                createAt: new Date().getTime(),
                entregueData: null, 
                entregueTag: 3, 
                enviadoData: null, 
                enviadoTag: 2, 
                es: 'd',  
                legenda: '', 
                mensagem: mensagem, 
                tipo: 'info', 
                usuarioNome: atendenteData.userNome, 
                usuarioUid: atendenteData.userUid
              };
              const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
              console.log(iMensagem);

              return {situacao:'suc',code:0,msg:`Conversa entregada. `, userData: atendenteData };
            } else {

              await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaPainel: true }, {merge:true});

              return {situacao:'err',code:0,msg:`atendenteData err: ${JSON.stringify(atendenteData)}`};
            }

          } else {
            return {situacao:'err',code:0,msg:`vUsers err: `};
          }

        } else {
          return {situacao:'err',code:0,msg:`Ja possui usuario: ${usuarioUid}`};
        }
        
      } else {
        return {situacao:'err',code:0,msg:`Não encontrei a conversa`};
      }
    } catch(err) {
      console.log(`conversaDepartamento: ${err.message}`);
      return {situacao:'err',code:0,msg:`conversaDepartamento: ${err.message}`};
    }
  },

  async conversaUpdate(params: any) {;
    try {
      //VER AGENDAMENTO
      const { empresaUid, contatoUid, contatoNome, contatoOrigem, situacao, context } = params;

      if(situacao === 6) {

        //FINALIZAR CONVERSA NO MYSQL
        CaixaEntrada.FinalizarConversa(params.conversaUid)
        .catch(err=>{
          console.log('################## FALHA AO DELETAR CONVERSA DO MYSQL ')
          console.log(err)
        })



        if(context !== undefined && context !== '') {
          const _context = JSON.parse(context);
          if(_context.proativoUid !== undefined && _context.proativoUid !== '') {
            await Watson.deleteProativo({ proativoUid:_context.proativoUid });
          }
        }

        const vAgenda:any = await db.collection(empresaUid).doc('chat').collection('conversasAgendadas').where('contatoUid', '==', contatoUid).where('situacao', '==', 2).get();
        if (!vAgenda.empty) {
          let arr = vAgenda.docs;
          arr = arr.sort((a:any,b:any) => a.createAt-b.createAt);
          for (const doc of arr) {
            const { usuarioUid, canal,  tipo, mensagem, anexo, acao, listaUid, disparoUid, logId } = doc.data();
            const agendaUid = doc.id;

            console.log(`agendaUid: ${agendaUid}`);
            console.log(`TIPO: ${tipo}`);
            if(tipo === undefined || tipo.toUpperCase() === 'CHAT') {
            
              const mensagemRetorno = `Contato: ${contatoNome} não está mais ocupado, ainda quer iniciar uma conversa?`;

              const notificacaoData = {
                createAt: new Date().getTime(),
                tipo: 'contatolivre',
                tipoId: contatoUid,
                contatoUid: contatoUid,
                finalizado: false,
                titulo: 'Contato liberado',
                mensagem: mensagemRetorno,
              };
              await db.collection(empresaUid).doc('notificacoes').collection(usuarioUid).add(notificacaoData);

              await db.collection(empresaUid).doc('chat').collection('conversasAgendadas').doc(agendaUid).set({ situacao: 1 }, {merge:true});

              return {situacao:'suc',code:0,msg:`Enviado contato livre.`};

            } else if(tipo.toUpperCase() === 'LISTATRANSMISSAO') {

              let errorMsg = '';
              let sitWppMsg = false;
              let sitWppAnexo = false;
              let sitWppAcao = false;

              const dateNow = new Date().getTime();// - 3 * 60 * 60 * 1000;

              const msgData: any = {
                mensagem: '',
                anexo: '',
                canal,
                citacao: '',
                legenda: '',
                createAt: dateNow,
                es: 's',
                tipo: 'texto',
                autorNome: 'Lara IA - Transmissão',
                autorUid: '99999',
                contatoNome,
                contatoOrigem,
                contatoUid,
                disparoUid: disparoUid,
                listaTransmissaoUid: listaUid,
                conversaUid: '',
                enviadoTag: 1,
                enviadoData: dateNow,
                entregueTag: 0,
                entregueData: dateNow,
                usuarioUid: '99999',
                usuarioNome: 'Lara IA - Transmissão',
                photo: ''
              };

              if(mensagem !== '') {

                await Apoio.sleep(Math.random() * (10 - 5) + 5);

                msgData.mensagem = mensagem;

                const iMsg = await Chat.mensagemAdd({ token:empresaUid, data: msgData });
                console.log(`Mensagem enviada com sucesso: ${iMsg.msg}`);
                if(iMsg.situacao === 'suc') {
                  sitWppMsg = true;
                }
                errorMsg += `| mensagem: ${iMsg.msg}`;
              }

              if(anexo !== '') {

                await Apoio.sleep(Math.random() * (10 - 5) + 5);

                msgData.mensagem = '';
                msgData.anexo = anexo;
                msgData.tipo = 'anexo';

                const iMsg = await Chat.mensagemAdd({ token:empresaUid, data: msgData });
                console.log(`Mensagem enviada com sucesso: ${iMsg.msg}`);
                if(iMsg.situacao === 'suc') {
                  sitWppAnexo = true;
                }
                errorMsg += `| anexo: ${iMsg.msg}`;
              }

              if(acao !== '') {
                sitWppAcao = true;
                console.log(`acao não habilitado: ${acao}`);  
              }

              await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('relatorios').collection(listaUid).doc(logId).set({ sitWppMsg, sitWppAnexo, sitWppAcao, errorMsg },{merge:true});

              await db.collection(empresaUid).doc('chat').collection('conversasAgendadas').doc(agendaUid).set({ situacao: 1 }, {merge:true});
 
            } else {
              console.log(`Tipo err: não válido ${tipo}`);  
            }

          }
          
          return {situacao:'suc',code:0,msg:`Processo agendamento com sucesso.`};
        } else {
          return {situacao:'err',code:0,msg:`vAgenda err: nenhum agendamento`};
        }

      } else {
        return {situacao:'err',code:0,msg:`Situação: ${situacao}`};
      }
    } catch (err) {
      return {situacao:'err',code:0,msg:`conversaUpdate err: ${err.message}`};
    }
  },

  async checkSlaConversa() {
    try {
      const vNaoResp = await db.collection('cronnaorespondeu').get();
      if(!vNaoResp.empty) {

        for (const naorespDoc of vNaoResp.docs) {

          const { empresaUid, empresaConfig, conversaData, conversaUid, createAt } = naorespDoc.data();

          if(conversaData === undefined) {
            await Chat.deleteNaoRespondeu({ naoRespondeuUid :naorespDoc.id });
            continue;
          }

          if(empresaConfig === undefined) {
            await Chat.deleteNaoRespondeu({ naoRespondeuUid :naorespDoc.id });
            continue;
          }

          // const _conversaData = JSON.parse(conversaData);

          // const { slaAlerta } = _conversaData;
          console.log(empresaConfig);
          const { atdMinAlerta } = JSON.parse(empresaConfig);

          const minutesAlerta = atdMinAlerta * 60;
          // const minutesRoleta = atdMinRoleta * 60;

          const currentDate = new Date().getTime();

          const diffDate = (currentDate - createAt) / 1000;
          // if(slaAlerta) {

          //   if(diffDate > minutesRoleta) {
              
              
              
          //   } else {
          //     console.log('ainda não precisa trocar atendente');
          //   }

          // } else {

            if(diffDate > minutesAlerta) {

              await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).set({ slaAlerta: true }, {merge:true});

              await Chat.deleteNaoRespondeu({ naoRespondeuUid :naorespDoc.id });

            } else {
              console.log('CHECK DATE: '+diffDate+' ~ '+minutesAlerta);
            }

          // }
        }
        return {situacao:'suc',code:0,msg:`Processo atendimento SLA com sucesso.`};
      } else {
        return {situacao:'err',code:0,msg:`Nada a fazer`};
      }
    } catch (err) {
      return {situacao:'err',code:0,msg:`checkNaoRespondeu err: ${err.message}`};
    }
  },

  async deleteNaoRespondeu(params:any) {
    try {
      const { naoRespondeuUid } = params;
      
      await db.collection('cronnaorespondeu').doc(naoRespondeuUid).delete();

      return {situacao:'suc',code:0,msg:`Proatividade deletado sucesso.`};
    } catch (err) {
      return {situacao:'err',code:0,msg:`deleteNaoRespondeu err: ${err.message}`};
    }
  },

  async cronNaoRespondeuCreate(params:any) {
    try {
      const { empresaUid, naoRespondeuUid, conversaUid } = params;

      await db.collection(empresaUid).doc('chat').collection('conversas').doc(conversaUid).set({ naoRespondeuUid: naoRespondeuUid } , { merge: true });

      return {situacao:'suc',code:0,msg:`Proatividade deletado sucesso.`};
    } catch (err) {
      return {situacao:'err',code:0,msg:`cronNaoRespondeuCreate err: ${err.message}`};
    }
  },

  async conversasDistribuicaoCreate(params:any) {
    try {
      const { token, conversaUid, conversaData } = params;

      if(conversaData === undefined) {
        return {situacao:'err',code:0,msg:`Não localizei informações da empresa`};
      }

      console.log(conversaData);
      const conversaDataObj = JSON.parse(conversaData);

      const { intencao, uidClienteVinculado, usuarioUid, canal, contatoUid, contatoNome, contatoOrigem, slaAgAtendimento, slaPainel, slaRoleta, slaPrimeiroAtendente } = conversaDataObj;

      if(slaAgAtendimento) {

        if(slaPainel) {
          return {situacao:'suc',code:0,msg:`Já fez todo ciclo.` };
        }

        const mensagemData = {
          anexo: '',
          autorNome: 'Lara IA',
          autorUid: '99999',
          canal: canal, 
          citacao: '', 
          contatoNome: contatoNome, 
          contatoOrigem: contatoOrigem, 
          contatoUid: contatoUid, 
          conversaUid: conversaUid,
          createAt: new Date().getTime(),
          entregueData: null, 
          entregueTag: 3, 
          enviadoData: null, 
          enviadoTag: 2, 
          es: 'd',  
          legenda: '', 
          mensagem: '', 
          tipo: 'info', 
          usuarioUid: '99999',
          usuarioNome: 'Lara IA',
        };

        //PRIMEIRA COSIA
        const vContato:any = await db.collection(token).doc('chat').collection('contatos').doc(contatoUid).get();
        if(vContato.exists) {
          const contatoUsuarioUid = ''//vContato.data().usuarioUid;
          const contatoUsuarioNome = ''//' vContato.data().usuarioNome;

          if(contatoUsuarioUid !== undefined && contatoUsuarioUid !== '' && contatoUsuarioNome !== undefined && contatoUsuarioNome !== '') {

            const mensagem = `Distribuição automática exclusiva para ${contatoUsuarioNome}`;
            mensagemData.mensagem = mensagem;
            const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
            console.log(iMensagem);

            params.usuarioUid = contatoUsuarioUid;
            params.usuarioNome = contatoUsuarioNome;
            await db.collection(token).doc('chat').collection('conversastransferencia').add({ createAt: new Date().getTime(), ...params});

            return {situacao:'suc',code:0,msg:`Conversa entregue ao usuario vinculado.`,userData: { userUid: contatoUsuarioUid, userNome: contatoUsuarioNome }};
          }
        }

        let departamento = intencao.toUpperCase();

        console.log(`INTENCAO INICIAL: ${departamento}`);

        const arrayIntencao = ['COMERCIAL'];
        const arrayDepartamento = ['ADMINISTRADOR','FINANCEIRO','COMERCIAL','SUPORTE','FISCAL','ATENDIMENTO'];

        if(arrayIntencao.includes(intencao)) {
          //VERIFICAR REPRESENTANTE
          if(uidClienteVinculado !== '' && uidClienteVinculado !== null && uidClienteVinculado !== undefined) {
            
            const vParceiro:any = await db.collection(token).doc('dados').collection('parceiros').doc(uidClienteVinculado).get();
            if (vParceiro.exists) {
              const { representanteUid, representanteNome } = vParceiro.data();


              if(representanteUid !== '' && representanteUid !== undefined) {

                const mensagem = `Distribuição automática de (${departamento}) exclusivo para ${representanteNome}`;
                mensagemData.mensagem = mensagem;
                const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
                console.log(iMensagem);

                params.usuarioUid = representanteUid;
                params.usuarioNome = representanteNome;
                await db.collection(token).doc('chat').collection('conversastransferencia').add({ createAt: new Date().getTime(), ...params});

                return {situacao:'suc',code:0,msg:`Conversa entregue ao representante.`,userData: { userUid: representanteUid, userNome: representanteNome }};
              }
            }
          }
        }

        if(!arrayDepartamento.includes(departamento)) {
          departamento = 'ATENDIMENTO';
        }

        let ultimoAtendente = '';
        const doc:any = await db.collection(token).doc('chat').collection('configuracoes').doc('atendimentorandom').get();
        if (doc.exists) {
          ultimoAtendente = doc.data()[departamento];
        }

        console.log('ULTIMO ATENDENTE: '+ultimoAtendente);
        console.log('DEPARTAMENTO: '+departamento);

        const vUsers:any = await Usuarios.usuariosSelect({token, userUid: ''});
        if(vUsers.situacao === 'suc') {
          
          //UM SÒ USUARIO 
          if(vUsers.dados.length === 1) {

            await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ intencao: departamento, slaAgAtendimento: false, slaPainel: true }, {merge: true});

            const mensagem = `Distribuição de atendimento especialmente para você`;
            mensagemData.mensagem = mensagem;            
            const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
            console.log(iMensagem);

            params.usuarioUid = vUsers.dados[0].userUid;
            params.usuarioNome = vUsers.dados[0].userNome;
            await db.collection(token).doc('chat').collection('conversastransferencia').add({ createAt: new Date().getTime(), ...params});

            return {situacao:'suc',code:0,msg:`Conversa entregue único usuário.`, userData: vUsers.dados[0] };
          }

          const arrayUsuarios:any[] = [];
          let arrayUsuariosDepartamento:any[] = [];
          let usuarioRecepcao:any = {};

          for(const userDados of vUsers.dados) {
            const vHorarioCheck = await Empresa.horarioCheck(userDados);
            if(vHorarioCheck.situacao === 'suc') {
              arrayUsuarios.push(userDados);
            }
            if(userDados.recepcao) {
              usuarioRecepcao = userDados;
            }
          }
          
          console.log(JSON.stringify(arrayUsuarios));

          let ultimoAtendenteExiste = false;
          arrayUsuarios.forEach((elem:any) => {
            if(elem.departamento.toUpperCase() === departamento || elem.departamento.toUpperCase() === 'ADMINISTRADOR') {
              arrayUsuariosDepartamento.push(elem);
            }
            if(elem.userUid === ultimoAtendente) {
              ultimoAtendenteExiste = true;
            }
          });

          console.log(arrayUsuariosDepartamento.length);

          if(arrayUsuariosDepartamento.length === 0) {

            // const mensagem = `Nenhum atendente disponível no departamento (${departamento}), alterando para ATENDIMENTO`;
            const mensagem = `Distribuição de atendimento especialmente para recepção ${usuarioRecepcao.userNome}`;
            mensagemData.mensagem = mensagem;
            const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
            console.log(iMensagem);

            //RECEPCAO
            params.usuarioUid = usuarioRecepcao.userUid;
            params.usuarioNome = usuarioRecepcao.userNome;
            await db.collection(token).doc('chat').collection('conversastransferencia').add({ createAt: new Date().getTime(), ...params});

            return {situacao:'suc',code:0,msg:`Conversa entregue usuário recepção.`, userData: usuarioRecepcao };

            departamento = 'ATENDIMENTO';
            arrayUsuariosDepartamento = arrayUsuarios;
          }
          
          let achou = false;
          let atendenteData:any = {};

          console.log(JSON.stringify(arrayUsuariosDepartamento));
          if(arrayUsuariosDepartamento.length === 1) {
            atendenteData = {
              userUid: arrayUsuariosDepartamento[0].userUid,
              userNome: arrayUsuariosDepartamento[0].userNome
            };
          } else {
            for(let i = 0;i < arrayUsuariosDepartamento.length; i++) {              
              if(ultimoAtendenteExiste === false) {
                atendenteData = {
                  userUid: arrayUsuariosDepartamento[i].userUid,
                  userNome: arrayUsuariosDepartamento[i].userNome
                };
                break;
              } else {
                if(arrayUsuariosDepartamento.length === 1) {
                  atendenteData = {
                    userUid: arrayUsuariosDepartamento[i].userUid,
                    userNome: arrayUsuariosDepartamento[i].userNome
                  };
                  break; 
                }
                if(achou) {
                  atendenteData = {
                    userUid: arrayUsuariosDepartamento[i].userUid,
                    userNome: arrayUsuariosDepartamento[i].userNome
                  };
                  break;  
                }
                if(ultimoAtendente === arrayUsuariosDepartamento[i].userUid) {
                  achou = true;
                  if(i + 1 === arrayUsuariosDepartamento.length) i = -1;
                  continue;
                }
              }
            }
          }
          
          console.log('atendenteData: '+JSON.stringify(atendenteData));

          if(slaRoleta >= (arrayUsuariosDepartamento.length - 1) || slaPrimeiroAtendente === atendenteData.userUid) {

            await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set({ slaPainel: true }, {merge:true});

            return {situacao:'suc',code:0,msg:`Já está com usuário que deveria estar.`,userData: atendenteData };
          }

          const conversaUpdate:any = {
            intencao: departamento
          };

          if(Object.keys(atendenteData).length > 0) {

            const updateData:any = {};
            updateData[departamento] = atendenteData.userUid;

            await db.collection(token).doc('chat').collection('configuracoes').doc('atendimentorandom').set(updateData, {merge:true});

            if(slaRoleta === undefined) {
              conversaUpdate.slaRoleta = 0;
              conversaUpdate.slaPrimeiroAtendente = atendenteData.userUid;
            } else {
              conversaUpdate.slaRoleta =  admin.firestore.FieldValue.increment(1);
            }

            if(departamento === 'COMERCIAL') {
              conversaUpdate.slaAgAtendimento = false;

              await db.collection(token).doc('chat').collection('contatos').doc(contatoUid).set({ usuarioNome: atendenteData.userNome, usuarioUid: atendenteData.userUid }, {merge:true});
            }

            await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set(conversaUpdate, {merge: true});

            const mensagem = `Distribuição automática de (${departamento}) para ${atendenteData.userNome}`;
            mensagemData.mensagem = mensagem;            
            const iMensagem = await Chat.mensagemAdd({ token, data: mensagemData });
            console.log(iMensagem);

            params.usuarioUid = atendenteData.userUid;
            params.usuarioNome = atendenteData.userNome;
            await db.collection(token).doc('chat').collection('conversastransferencia').add({ createAt: new Date().getTime(), ...params});

            return {situacao:'suc',code:0,msg:`Conversa entregue. `, userData: atendenteData };

          } else {

            conversaUpdate.slaPainel = true;
            await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set(conversaUpdate, {merge: true});

            return {situacao:'err',code:0,msg:`atendenteData err: ${JSON.stringify(atendenteData)}`};
          }

        } else {
          return {situacao:'err',code:0,msg:`vUsers err: `};
        }

      } else {
        return {situacao:'err',code:0,msg:`Ja possui usuário: ${usuarioUid}`};
      }

    } catch(err) {
      return {situacao:'err',code:0,msg:`conversasDistribuicaoCreate err: ${err.message}`};
    }
  },

  async conversasTransferenciaCreate(params:any) {
    try {

      const { token, usuarioUid, usuarioNome, conversaUid, contatoUid, contatoNome, autorNome } = params;

      const conversaUpdate = {
        usuarioUid, 
        usuarioNome
      };

      await db.collection(token).doc('chat').collection('conversas').doc(conversaUid).set(conversaUpdate, {merge: true});

      let pushmsg = '';

      //VERIFICAR HORARIO ATENDIMENTO
      const pushData = {
        usuarioUid: usuarioUid,
        tipo: 'texto',
        mensagem: `Existe uma nova conversa de ${contatoNome} para você`,
        autorNome,
        contatoUid,
        conversaUid
      }
      const iPush = await Chat.mensagemPush({ token, data: pushData });
      pushmsg = iPush.msg;

      return {situacao:'suc',code:0,msg:`Transferido com sucesso. ${pushmsg}`};

    } catch(err) {
      return {situacao:'err',code:0,msg:`conversasTransferenciaCreate err: ${err.message}`};
    }
  }
  
}

export default Chat;