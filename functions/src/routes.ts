import * as express from 'express';

import Webhook from './model/webhook';
import Secure from './model/secure';



import Chat from './model/chat';
import Telegram from './model/telegram';
import Facebook from './model/facebook';
// import Apoio from './model/apoio';
import { db } from './index';

import processotemporario from './model/processotemporario';

import logreg from './model/log'
import apiObject from './model/api'
// import ListaTransmissao from './model/listatransmissao';
// import Watson from './model/watson';
// import Usuarios from './model/usuarios';
// import Empresa from './model/empresa';
// import Whatsapp from './model/whatsapp';






const rotas         = express
const routes        = rotas.Router()
//const routesSecure  = rotas.Router() 

//const  Pusher = require('pusher');
const  cors = require('cors')

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

routes.get('', async (req,res) => {
  // const auth = {login: 'guigui', password: '1234'} // change this

  // const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  // const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  // if (login && password && login === auth.login && password === auth.password) {
  //   res.status(200).send('Acesso permitido');
  // } else {
  //   res.status(401).send('Unauthorized');
  // }
});

routes.post('/v1/:acao/:acionamentoUid', async (req,res) => {
  const { acionamentoUid, acao } = req.params;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const vIp = await Secure.ipBlacklistCheck({ip});
  if(vIp.situacao === 'suc') {
    const { chave } = req.body;

    if(chave !== undefined) {
      const [empresaUidRec, acionamentoUidRec] = Buffer.from(chave, 'base64').toString().split('|');

      if (acionamentoUidRec === acionamentoUid) {
          
        res.status(200).send(await Webhook.webhookProcesso({ acionamentoUid, acao, empresaUid: empresaUidRec, chave }));
      } else {
        res.status(401).send('Unauthorized');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
    
  } else {
    res.status(401).send('Unauthorized');
  }

  

});

routes.post('/enotas/:hash', async (req,res) => {
  try {
    const hash = req.params.hash;
    const body = req.body;
    const requisicao = {
      hash,
      createAt:new Date().getTime(),
      situacao:0,
      ... body
    }

    db.collection('webhook').add(requisicao)
    .then(res2=>{

      let definirDocs = body.nfeId.split('-')
      let empresaUid = definirDocs[0]
      let notauid = definirDocs[1]
      //ATUALIZAR INFORMACOES DA NOTA 
      let dadosAtualizacao = {
        dadosNota:{
          situacaoCod:0,
          situacaoNome:'Não existe uma especificação para o problema ',
          nfeMotivoStatus:'',
          nfNumero:'',
          linkPDF:'',
          linkXML:'',
          nfNumeroProtocolo:''

        },
        dataAutorizacao:new Date().getTime(),
    
        autorizada:false
        
      }
      if(body.nfeStatus == "Negada")
      {
        dadosAtualizacao.dadosNota.situacaoCod = 0
        dadosAtualizacao.dadosNota.situacaoNome = 'Nota negada'
        dadosAtualizacao.dadosNota.nfeMotivoStatus = body.nfeMotivoStatus
      }
      else if(body.nfeStatus == "Autorizada")
      {
        dadosAtualizacao.dadosNota.situacaoCod = 3
        dadosAtualizacao.dadosNota.situacaoNome = 'Nota Autorizada'
        dadosAtualizacao.dadosNota.nfeMotivoStatus = ''
        dadosAtualizacao.dadosNota.nfNumero = body.nfeNumero
        dadosAtualizacao.dadosNota.linkPDF = body.nfeLinkDanfe
        dadosAtualizacao.dadosNota.linkXML = body.nfeLinkXml
        dadosAtualizacao.dadosNota.nfNumeroProtocolo = body.nfeNumeroProtocolo
        dadosAtualizacao.autorizada = true

       

      }
      else
      {
        dadosAtualizacao.dadosNota.situacaoCod = 0
        dadosAtualizacao.dadosNota.situacaoNome = 'Nota negada'
        dadosAtualizacao.dadosNota.nfeMotivoStatus = 'Não existe um problema definido ou a resposta de safaz foi inconclusiva'
      }
      // /ubdcX3PtFa3uQPY9BXCR/dados/fiscal/registros/notas
      

      db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notauid).set(dadosAtualizacao,{merge:true})
      .then(()=>{
        console.log('###### ENOTAS ######### ')
        console.log(JSON.stringify(dadosAtualizacao))
        res.status(200).json({situacao:'suc',code:1,msg:'Solicitacao recebida'});
      })
      .catch(errUp=>{
        console.log('[FALHA API ENOTAS] '+errUp)
        res.status(500).json({situacao:'suc',code:1,msg:'falha no processo de requisicao | '+errUp});
      })

      
    })
    .catch(err=>{
      console.log('[FATAL][FALHA API ENOTAS] '+err)
      res.status(500).json({situacao:'suc',code:1,msg:'falha no processo de requisicao | '+err});

    })
  

  } catch(err) {
    res.status(200).json({situacao:'err',code:0,msg:err.message});
  }
});





routes.post('/:empresaUid/testeconect', async (req,res) => {
  try 
  {
    
    const ipCliente =  req.socket.remoteAddress 
    const empresaUid = req.params.empresaUid;
    const token = (req.headers.authorization || '').split(' ')[1] || ''
    console.log('Acionamento /:empresaUid/testeconec '+empresaUid)
    Secure.validarToken(token)
    .then(resDadosToken=>{

     
      //LOG
      const parametros = {
        ipCliente,
        'nivel':'moderado',
        'msg':'Acesso concedio ',
        resDadosToken
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(()=>{
        console.log('Falha registro log')
      })



      res.status(200).json({situacao:'suc',code:1,msg:'Solicitacao recebida'});


      
      
    })
    .catch(err=>{
     
      const parametros = {
        ipCliente,
        err,
        'nivel':'critico',
        'msg':'Falha ao atualizar autorizacao de login por api '
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(()=>{
        console.log('Falha registro log')
      })


      res.status(401).json({situacao:'err',code:1,msg:'Nao autorizado | '+err});
    })


    
    
  
   

  }
  catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(500).json({situacao:'err',code:1,msg:err.message});
  }
});

//#######################################################
//# API
//#######################################################
routes.post('/:empresaUid/com/pedidos/recuperar', async (req,res) => {
  try 
  {
    
    const ipCliente =  req.socket.remoteAddress 
    const empresaUid = req.params.empresaUid;
    const token = (req.headers.authorization || '').split(' ')[1] || ''
    console.log('Acionamento /:empresaUid/testeconec '+empresaUid)
    Secure.validarToken(token)
    .then(resDadosToken=>{

      //LOG
      //const body = req.body;
      res.status(500).json({situacao:'err',code:0,msg:'Metodo nao disponivel para esta empresa | COM 1'});


      
      
    })
    .catch(err=>{
     
      const parametros = {
        ipCliente,
        err,
        'nivel':'critico',
        'msg':'ERR - Falha ao atualizar autorizacao de login por api '
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(()=>{
        console.log('Falha registro log')
      })


      res.status(401).json({situacao:'err',code:1,msg:'Nao autorizado | '+err});
    })


    
    
  
   

  }
  catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(500).json({situacao:'err',code:1,msg:err.message});
  }
});
routes.post('/:empresaUid/com/pedidos/update', async (req,res) => {
  try 
  {
    
    const ipCliente =  req.socket.remoteAddress 
    const empresaUid = req.params.empresaUid;
    const token = (req.headers.authorization || '').split(' ')[1] || ''
    console.log('Acionamento /:empresaUid/testeconec '+empresaUid)
    Secure.validarToken(token)
    .then(resDadosToken=>{

      //LOG
      //const body = req.body;
      res.status(500).json({situacao:'err',code:0,msg:'Metodo nao disponivel para esta empresa | COM 2'});


      
      
    })
    .catch(err=>{
     
      const parametros = {
        ipCliente,
        err,
        'nivel':'critico',
        'msg':'ERR - Falha ao atualizar autorizacao de login por api '
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(()=>{
        console.log('Falha registro log')
      })


      res.status(401).json({situacao:'err',code:1,msg:'Nao autorizado | '+err});
    })


    
    
  
   

  }
  catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(500).json({situacao:'err',code:1,msg:err.message});
  }
});

//#################### FIM ###############################
//NOVO CADSTRO
routes.post('/newcad', async (req,res) => {
  try {

    const body = req.body;
    db.collection('newCad').add(body)
    .then(()=>{
      res.status(200).json({situacao:'suc'});
    })
    .catch(err=>{
      res.status(500).json({situacao:'err',err});
    })

    

  } catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(200).json({situacao:'err',code:1,msg:err.message});
  }
});
//FINANCEIRO
routes.post('/:empresaUid/fin/boleto/add', async (req,res) => {
  try 
  {
    
    const ipCliente =  req.socket.remoteAddress 
    const empresaUid = req.params.empresaUid;
    const token = (req.headers.authorization || '').split(' ')[1] || ''
    console.log('Acionamento /:empresaUid/testeconec '+empresaUid)
    Secure.validarToken(token)
    .then(resDadosToken=>{

      

      //LOG
      const body = req.body;
      db.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').where('identCliente','==',body.dadosConf.identInterno).get()
      .then(resConsulta=>{
        if(resConsulta.empty)
        {
          apiObject.ReceberRequisicao(empresaUid,'finBoletoAdd',ipCliente,body)
          .then(resReq=>{
            res.status(200).json({situacao:'suc',code:0,protocolo:resReq,msg:'Recebemos sua solicitacao'});
          })
          .catch((err3)=>{
            res.status(500).json({situacao:'err',code:0,msg:'Houve um problema ao receber sua requisicao. Verifique seu painel de log | '+err3});
          })
        }
        else
        {
          res.status(500).json({situacao:'err',code:0,msg:'Duplicidade de documento dadosConf.identInterno '});
        }
      })
      .catch(err=>{
        res.status(500).json({situacao:'err',code:0,msg:'Falha no processamento da requisicao'});
      })
      


      
      
    })
    .catch(err=>{
     
      const parametros = {
        ipCliente,
        err,
        'nivel':'critico',
        'msg':'ERR - Falha ao atualizar autorizacao de login por api '
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(()=>{
        console.log('Falha registro log')
      })


      res.status(401).json({situacao:'err',code:1,msg:'Nao autorizado | '+err});
    })


    
    
  
   

  }
  catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(500).json({situacao:'err',code:1,msg:err.message});
  }
});

routes.post('/:empresaUid/fin/boleto/consulta', async (req,res) => {
  try 
  {
    
    const ipCliente =  req.socket.remoteAddress 
    const empresaUid = req.params.empresaUid;
    const token = (req.headers.authorization || '').split(' ')[1] || ''
    console.log('Acionamento /:empresaUid/testeconec '+empresaUid)
    Secure.validarToken(token)
    .then(resDadosToken=>{
      const body = req.body;
      //RECUPERAR DADOS DO LANCAMENTO
      if(body.hasOwnProperty('dadosConf') )
      {
        if(body.dadosConf.hasOwnProperty('identInterno'))
        {
          let nIdent = body.dadosConf.identInterno
          //INICIAR PROCESSO DE RECUPERACAO DE DADOS
          // /QmPJcDIMLJBshGe9LDv2/dados/financeiro/registros/lancamentos/EdlNxuyN2ApGz89dHGpf
          db.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').where('identCliente','==',nIdent).get()
          .then(resConsulta=>{
            if(!resConsulta.empty)
            { 
                const dadosRecuperado = resConsulta.docs[0].data()


                let dadosBoleto = {}
                let dadosPagamento = null

                if(dadosRecuperado.hasOwnProperty('isPago'))
                {
                  if(dadosRecuperado.isPago)
                  {
                    dadosPagamento = {
                      isPago:true,
                      data:new Date().getTime(),
                      valor:dadosRecuperado.valor_principal,
                      juros:0,
                      desconto:0,
  
  
                    }
                  }
                  
                }

                if(dadosRecuperado.hasOwnProperty('dadosBoleto'))
                {
                  dadosBoleto = {
                    urlPDF:dadosRecuperado.dadosBoleto.url,
                    linhaDig:dadosRecuperado.dadosBoleto.linhaDigitavel,
                    visualizado:false,
                    dtVisualizado:null,
                    dadosPagamento
                  }
                }

                let msgErro = ''
                if(dadosRecuperado.hasOwnProperty('msgErro'))
                {
                  msgErro = dadosRecuperado.msgErro
                }
                const infoLancamento = {
                  situacao:dadosRecuperado.situacaoCod,
                  dadosCob:dadosBoleto,
                  msg:msgErro,
                  saldoCheckout:0,
                  
                }
                res.status(200).json({situacao:'suc',code:0,msg:'Requisição processada com sucesso',data:infoLancamento});
            }
            else
            {
              res.status(500).json({situacao:'err',code:0,msg:'Requisição formatacao invalida'});
            }
          })
          .catch(err=>{
            let msg = 'falha no processo da requisicao '
            console.log(msg)
            res.status(500).json({situacao:'err',code:0,msg:'Ocorreu um problema inesperado'});
          })

        }
        else
        {
          res.status(500).json({situacao:'err',code:0,msg:'Requisição formatação invalida'});
        }
      }
      else
      {
        res.status(500).json({situacao:'err',code:0,msg:'Requisição formatacao invalida'});
      }



      


      
      
    })
    .catch(err=>{
     
      const parametros = {
        ipCliente,
        err,
        'nivel':'critico',
        'msg':'ERR - Falha ao atualizar autorizacao de login por api '
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(()=>{
        console.log('Falha registro log')
      })


      res.status(401).json({situacao:'err',code:1,msg:'Nao autorizado | '+err});
    })


    
    
  
   

  }
  catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(500).json({situacao:'err',code:1,msg:err.message});
  }
});


routes.post('/telegramantigoteste/:hash', async (req,res) => {
  try 
  {

    const hash = req.params.hash;

    const hashEmpresa = JSON.parse(Buffer.from(hash, 'base64').toString());

    if(hashEmpresa.hasOwnProperty('empresaUid')) {

      const token = hashEmpresa.empresaUid;

      const body = req.body;

      const dadosInsert ={
        createAt:new Date().getTime(),
        hashEmpresa,
        empresaUid:token,
        situacao:1,
        FinControlqtd_invocacao:1,
        FinControlqtd_gravacao:1,
        FinControlqtd_consulta:0,
        FinControlqtd_updade:0,
        canal:'telegram',
        dadosRecebidos:body
      }
      db.collection('caixa_entrada').add(dadosInsert)
      .then(resAdd=>{
        res.status(200).json({situacao:'suc',code:0,msg:'Recebimento processado com sucesso'});
      })
      .catch(err=>{
        res.status(500).json({situacao:'suc',code:0,msg:'Falha no processo de gravação da nova mensagem'});
      })
    }

  }
  catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(200).json({situacao:'err',code:1,msg:err.message});
  }
});

routes.post('/telegram/:hash', async (req,res) => {
  try {

    const hash = req.params.hash;

    const hashEmpresa = JSON.parse(Buffer.from(hash, 'base64').toString());

    if(hashEmpresa.hasOwnProperty('empresaUid')) {

      const token = hashEmpresa.empresaUid;

      const body = req.body;


      const dadosInsert ={
        createAt:new Date().getTime(),
        empresaUid:hashEmpresa,
        token,
        situacao:1,
        FinControlqtd_invocacao:1,
        FinControlqtd_gravacao:1,
        FinControlqtd_consulta:0,
        FinControlqtd_updade:0,
        canal:'TELEGRAM',
        dadosRecebidos:body
      }
      db.collection('caixa_entrada').add(dadosInsert)
      
      .catch(err=>{
        console.log('FALha ao inserir entrada')
      })




      const bodyMessage = body.message;

      const idMensagem = bodyMessage.message_id;
      const autorNumero = bodyMessage.from.id.toString();
      const autorNome = bodyMessage.from.first_name;
      const chatId = bodyMessage.from.id;
      const timeMensagem = bodyMessage.date;

      const canal = 'telegram';

      let tipo = '';
      let mensagem = '';
      let anexo = '';
      let citacao = '';
      let legenda = '';

      if(bodyMessage.hasOwnProperty('text')) {
        tipo = 'texto';
        mensagem = bodyMessage.text;

      } else if(bodyMessage.hasOwnProperty('photo') || bodyMessage.hasOwnProperty('video') || bodyMessage.hasOwnProperty('document') || bodyMessage.hasOwnProperty('voice')) {
        let fileId:string = '';
        if(bodyMessage.hasOwnProperty('photo')) {
          tipo = 'imagem';
          fileId = bodyMessage.photo[bodyMessage.photo.length-1].file_id;

        } else if(bodyMessage.hasOwnProperty('video')) {
          tipo = 'video';
          fileId = bodyMessage.video.file_id;

        } else if(bodyMessage.hasOwnProperty('document')) {
          tipo = 'documento';
          fileId = bodyMessage.document.file_id;

        } else if(bodyMessage.hasOwnProperty('voice')) {
          tipo = 'audio';
          fileId = bodyMessage.voice.file_id;
        }
        
        const vTipo:any = await Telegram.getFile({ token, fileId });
        if(vTipo.situacao === 'suc') {
          anexo = vTipo.url;
          const vLink:any = await Chat.getPublicLink({token,link:anexo});
          if(vLink.situacao === 'suc') {
            anexo = vLink.url;
          }
        }
      } else if(bodyMessage.hasOwnProperty('location')) {
        tipo = 'local';
        anexo = `${bodyMessage.location.latitude};${bodyMessage.location.longitude}`;

      } else {
        res.status(200).json({situacao:'err',code:0,msg:'Não identifiquei o tipo de mensagem.'});
      }

      if(bodyMessage.hasOwnProperty('reply_to_message')) {
        if(bodyMessage.reply_to_message.hasOwnProperty('text')) {
          citacao = bodyMessage.reply_to_message.text;
        }
      }
      
      if(bodyMessage.hasOwnProperty('caption')) {
        legenda = bodyMessage.caption;
      }

      const mensagemData = {
        token,
        canal,
        idMensagem,
        createdAt: timeMensagem,
        autorNumero,
        autorNome,
        chatId,
        tipo,
        mensagem,
        anexo,
        citacao,
        legenda,
        empresaConfig: JSON.stringify(hashEmpresa)
      };

      res.status(200).json( await Chat.procMensagemRecebida(mensagemData));
    } else {
      res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }
  } catch(err) {
    console.log(`ERROR: ${err.message}`);
    res.status(200).json({situacao:'err',code:1,msg:err.message});
  }
});

routes.post('/whatsapp2/:hash', async (req,res) => {
  try {
    const hash = req.params.hash;
    
    const hashEmpresa = JSON.parse(Buffer.from(hash, 'base64').toString());
    
    if(hashEmpresa.hasOwnProperty('empresaUid')) {

      const token = hashEmpresa.empresaUid;

      const body = req.body;

      

      if(body.hasOwnProperty('messages')) {

        const bodyMessage = body.messages[0];

        const autorNumero = bodyMessage.author.split('@').shift().toString();
        let autorNome = bodyMessage.senderName;
        if(autorNome === '') {
          autorNome = autorNumero;
        }
        const idMensagem = bodyMessage.id;

        const chatId = bodyMessage.chatId.split('@').shift();
        const timeMensagem = bodyMessage.time;

        const canal = 'whatsapp';

        if(!bodyMessage.fromMe) {

          let tipo = '';
          let mensagem = '';
          let anexo = '';
          const citacao = bodyMessage.quotedMsgBody;
          const legenda = bodyMessage.caption;

          if(bodyMessage.type === 'chat') {
            tipo = 'texto';
            mensagem = bodyMessage.body;

          } else if(bodyMessage.type === 'document') {
            tipo = 'documento';
            anexo = bodyMessage.body;
            const vTipo:any = Chat.checkFileTipo({filename: anexo});
            if(vTipo.situacao === 'suc') {
              tipo = vTipo.tipo;
            }

          } else if(bodyMessage.type === 'video') {
            tipo = 'video';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'image') {
            tipo = 'imagem';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'audio' || bodyMessage.type === 'ptt') {
            tipo = 'audio';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'location') {
            tipo = 'local';
            anexo = bodyMessage.body;

          } else {
            res.status(500).json({situacao:'err',code:0,msg:'Não identifiquei o tipo de mensagem.'});
          }

          



          if(anexo !== '') {
            const vLink:any = await Chat.getPublicLink({token,link:anexo});
            if(vLink.situacao === 'suc') {
              anexo = vLink.url;
            }
          }

          const dadosCaixaEntrada = {
            createAt:new Date().getTime(),
            tipo:'msg',
            empresaUid:token,
            situacao:1,
            dadosControle:{
              invocacao:1,
              update:0,
              gravacao:1,
              leitura:0,
              delete:0,
              situacao:1,
              processoIaSaltos:0,
              processoIaEfetivos:0,
              conversaoAudio:0
            },
            dadosFluxo:{
              origemUid:chatId,
              contatoNome:autorNome,
              situacao:1,
              canal:'whatsapp',
              persona:'formal'
              

            },
            dadosMensagem:{
              timeMensagem,
              idMensagem,
              chatId,
              canal,
              tipo,
              mensagem,
              anexo,
              citacao,
              legenda,
              body
            }
            
            
          }
          db.collection('caixa_entrada').add(dadosCaixaEntrada)
          .then((resAdd)=>{
            res.status(200).json({situacao:'suc',code:0,msg:'processado com sucesso',UidControle:resAdd});
          })
          .catch(err=>{
            res.status(500).json( {situacao:'suc',code:0,msg:'Falha no processo | '+err});
          })




          

        } else {
          res.status(200).json({situacao:'err',code:0,msg:'Só processo mensagens recebidas.'});
        }

      } else if (body.hasOwnProperty('ack')) {
        //ACKKK delivered = 2 / viewed = 1
        const bodyAck = body.ack[0];

        let status = 3;
        if (bodyAck.status === 'viewed') {
          status = 1;

          const params = {
            token,
            id: bodyAck.id,
            data: {
              enviadoTag: 1,
              enviadoData: new Date().getTime(),
              entregueTag: status,
              entregueData: new Date().getTime(),
            }
          };
          console.log(params)

          res.status(200).json({situacao:'suc',code:0,msg:'testando falta do ACK '});
          //const result:any = await Chat.mensagemAck(params);
          //if(result.situacao === 'suc')  {
          //  res.status(200).json({situacao:'suc',code:0,msg:result.msg});
          //} else {
          //  res.status(200).json({situacao:'err',code:0,msg:result.msg});
          //}
        } else {
          res.status(200).json({situacao:'suc',code:0,msg:`Nada a ser feito.`});
        }

      } else if (body.hasOwnProperty('chatUpdate')) {
        //ALTERACAO CADASTRO
        res.status(200).json({situacao:'suc',code:0,msg:`Não habilitado no momento`});

      } else {
        res.status(200).json({situacao:'err',code:0,msg:'Nada a processar.'});
      }

    } else {
      res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }

  } catch(err) {
    res.status(200).json({situacao:'err',code:0,msg:err.message});
  }
});

routes.post('/whatsapp/:hash', async (req,res) => {
  try {
    const hash = req.params.hash;
    
    const hashEmpresa = JSON.parse(Buffer.from(hash, 'base64').toString());
    
    if(hashEmpresa.hasOwnProperty('empresaUid')) {

      const token = hashEmpresa.empresaUid;

      const body = req.body;

      

      if(body.hasOwnProperty('messages')) {

        const bodyMessage = body.messages[0];

        const autorNumero = bodyMessage.author.split('@').shift().toString();
        let autorNome = bodyMessage.senderName;
        if(autorNome === '') {
          autorNome = autorNumero;
        }
        const idMensagem = bodyMessage.id;

        const chatId = bodyMessage.chatId.split('@').shift();
        const timeMensagem = bodyMessage.time;

        const canal = 'whatsapp';

        if(!bodyMessage.fromMe) {

          let tipo = '';
          let mensagem = '';
          let anexo = '';
          const citacao = bodyMessage.quotedMsgBody;
          const legenda = bodyMessage.caption;

          if(bodyMessage.type === 'chat') {
            tipo = 'texto';
            mensagem = bodyMessage.body;

          } else if(bodyMessage.type === 'document') {
            tipo = 'documento';
            anexo = bodyMessage.body;
            const vTipo:any = Chat.checkFileTipo({filename: anexo});
            if(vTipo.situacao === 'suc') {
              tipo = vTipo.tipo;
            }

          } else if(bodyMessage.type === 'video') {
            tipo = 'video';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'image') {
            tipo = 'imagem';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'audio' || bodyMessage.type === 'ptt') {
            tipo = 'audio';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'location') {
            tipo = 'local';
            anexo = bodyMessage.body;

          } else {
            res.status(500).json({situacao:'err',code:0,msg:'Não identifiquei o tipo de mensagem.'});
          }

          



          if(anexo !== '') {
            const vLink:any = await Chat.getPublicLink({token,link:anexo});
            if(vLink.situacao === 'suc') {
              anexo = vLink.url;
            }
          }

          const dadosCaixaEntrada = {
            createAt:new Date().getTime(),
            tipo:'msg',
            empresaUid:token,
            situacao:1,
            dadosControle:{
              invocacao:1,
              update:0,
              gravacao:1,
              leitura:0,
              delete:0,
              situacao:1,
              processoIaSaltos:0,
              processoIaEfetivos:0,
              conversaoAudio:0
            },
            dadosFluxo:{
              origemUid:chatId,
              contatoNome:autorNome,
              situacao:1,
              canal:'whatsapp',
              persona:'formal'
              

            },
            dadosMensagem:{
              timeMensagem,
              idMensagem,
              chatId,
              canal,
              tipo,
              mensagem,
              anexo,
              citacao,
              legenda,
              body
            }
            
            
          }
          db.collection('caixa_entrada').add(dadosCaixaEntrada)
          .then((resAdd)=>{
            res.status(200).json({situacao:'suc',code:0,msg:'processado com sucesso',UidControle:resAdd});
          })
          .catch(err=>{
            res.status(500).json( {situacao:'suc',code:0,msg:'Falha no processo | '+err});
          })




          

        } else {
          res.status(200).json({situacao:'err',code:0,msg:'Só processo mensagens recebidas.'});
        }

      } else if (body.hasOwnProperty('ack')) {
        //ACKKK delivered = 2 / viewed = 1
        const bodyAck = body.ack[0];

        let status = 3;
        if (bodyAck.status === 'viewed') {
          status = 1;

          const params = {
            token,
            id: bodyAck.id,
            data: {
              enviadoTag: 1,
              enviadoData: new Date().getTime(),
              entregueTag: status,
              entregueData: new Date().getTime(),
            }
          };
          console.log(params)

          res.status(200).json({situacao:'suc',code:0,msg:'testando falta do ACK '});
          //const result:any = await Chat.mensagemAck(params);
          //if(result.situacao === 'suc')  {
          //  res.status(200).json({situacao:'suc',code:0,msg:result.msg});
          //} else {
          //  res.status(200).json({situacao:'err',code:0,msg:result.msg});
          //}
        } else {
          res.status(200).json({situacao:'suc',code:0,msg:`Nada a ser feito.`});
        }

      } else if (body.hasOwnProperty('chatUpdate')) {
        //ALTERACAO CADASTRO
        res.status(200).json({situacao:'suc',code:0,msg:`Não habilitado no momento`});

      } else {
        res.status(200).json({situacao:'err',code:0,msg:'Nada a processar.'});
      }

    } else {
      res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }

  } catch(err) {
    res.status(200).json({situacao:'err',code:0,msg:err.message});
  }
});




routes.post('/whatsapp_backup/:hash', async (req,res) => {
  try {
    const hash = req.params.hash;
    
    const hashEmpresa = JSON.parse(Buffer.from(hash, 'base64').toString());
    
    if(hashEmpresa.hasOwnProperty('empresaUid')) {

      const token = hashEmpresa.empresaUid;

      const body = req.body;

      

      if(body.hasOwnProperty('messages')) {

        const bodyMessage = body.messages[0];

        const autorNumero = bodyMessage.author.split('@').shift().toString();
        let autorNome = bodyMessage.senderName;
        if(autorNome === '') {
          autorNome = autorNumero;
        }
        const idMensagem = bodyMessage.id;

        const chatId = bodyMessage.chatId.split('@').shift();
        const timeMensagem = bodyMessage.time;

        const canal = 'whatsapp';

        if(!bodyMessage.fromMe) {

          let tipo = '';
          let mensagem = '';
          let anexo = '';
          const citacao = bodyMessage.quotedMsgBody;
          const legenda = bodyMessage.caption;

          if(bodyMessage.type === 'chat') {
            tipo = 'texto';
            mensagem = bodyMessage.body;

          } else if(bodyMessage.type === 'document') {
            tipo = 'documento';
            anexo = bodyMessage.body;
            const vTipo:any = Chat.checkFileTipo({filename: anexo});
            if(vTipo.situacao === 'suc') {
              tipo = vTipo.tipo;
            }

          } else if(bodyMessage.type === 'video') {
            tipo = 'video';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'image') {
            tipo = 'imagem';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'audio' || bodyMessage.type === 'ptt') {
            tipo = 'audio';
            anexo = bodyMessage.body;

          } else if(bodyMessage.type === 'location') {
            tipo = 'local';
            anexo = bodyMessage.body;

          } else {
            res.status(500).json({situacao:'err',code:0,msg:'Não identifiquei o tipo de mensagem.'});
          }

          



          if(anexo !== '') {
            const vLink:any = await Chat.getPublicLink({token,link:anexo});
            if(vLink.situacao === 'suc') {
              anexo = vLink.url;
            }
          }

          const mensagemData = {
            token,
            canal,
            idMensagem,
            createdAt: timeMensagem,
            autorNumero,
            autorNome,
            chatId,
            tipo,
            mensagem,
            anexo,
            citacao,
            legenda,
            empresaConfig: JSON.stringify(hashEmpresa)
          };

          res.status(200).json( await Chat.procMensagemRecebida(mensagemData));

        } else {
          res.status(200).json({situacao:'err',code:0,msg:'Só processo mensagens recebidas.'});
        }

      } else if (body.hasOwnProperty('ack')) {
        //ACKKK delivered = 2 / viewed = 1
        const bodyAck = body.ack[0];

        let status = 3;
        if (bodyAck.status === 'viewed') {
          status = 1;

          const params = {
            token,
            id: bodyAck.id,
            data: {
              enviadoTag: 1,
              enviadoData: new Date().getTime(),
              entregueTag: status,
              entregueData: new Date().getTime(),
            }
          };
          const result:any = await Chat.mensagemAck(params);
          if(result.situacao === 'suc')  {
            res.status(200).json({situacao:'suc',code:0,msg:result.msg});
          } else {
            res.status(200).json({situacao:'err',code:0,msg:result.msg});
          }
        } else {
          res.status(200).json({situacao:'suc',code:0,msg:`Nada a ser feito.`});
        }

      } else if (body.hasOwnProperty('chatUpdate')) {
        //ALTERACAO CADASTRO
        res.status(200).json({situacao:'suc',code:0,msg:`Não habilitado no momento`});

      } else {
        res.status(200).json({situacao:'err',code:0,msg:'Nada a processar.'});
      }

    } else {
      res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }

  } catch(err) {
    res.status(200).json({situacao:'err',code:0,msg:err.message});
  }
});

routes.post('/site/:key',cors(corsOptions),async(req,res)=>{
  const body = req.body
  try
  {
    const key = req.params.key;
    console.log(key)
    
    const token = key//'QmPJcDIMLJBshGe9LDv2';
    console.log(body)
  
    const dadosCaixaEntrada = {
      createAt:new Date().getTime(),
      tipo:'msg',
      empresaUid:token,
      situacao:1,
      dadosControle:{
        invocacao:1,
        update:0,
        gravacao:1,
        leitura:0,
        delete:0,
        situacao:1,
        processoIaSaltos:0,
        processoIaEfetivos:0,
        conversaoAudio:0
      },
      dadosFluxo:{
        origemUid:body.sender.canal,
        contatoNome:body.sender.user_nome,
        situacao:1,
        canal:'botsite',
        persona:'formal'
        
  
      },
      dadosMensagem:{
        timeMensagem: new Date().getTime(),
        idMensagem:0,
        chatId:body.sender.canal,
        canal:'botsite',
        tipo:'texto',
        mensagem:body.message,
        anexo:'',
        citacao:'',
        legenda:'',
        body
      }
      
      
    }
    db.collection('caixa_entrada').add(dadosCaixaEntrada)
    .then((resAdd)=>{


      //TESTE PUSHER 
      //const pusher = new Pusher({
      //  appId: '1082354',
      //  key: 'd6876fba7e071feed1d2',
      //  secret: '9718282169569665f79e',
      //  cluster: 'us2'
      //});
      //pusher.trigger(body.sender.canal, 'LaraDigitando', { message: "" });
      //setTimeout(function(){pusher.trigger(body.sender.canal, 'LaraResposta', { message: "oi " }); }, 3000)

      let Resposta = {
        msg:'Mensagem recebida'
      }
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST')
      res.status(200).send([Resposta]);
    })
    .catch(err=>{
      let Resposta = {
       
        msg:'Falha no processo | '+err
      }
      res.status(500).send([Resposta])
    })
  
  
  
  }
  catch(err)
  {
    let Resposta = {
      body,
      msg:'Falha geral | '+err
    }
    res.status(500).send([Resposta])
  }
 
  
  
 
  
})
routes.post('/facebookWebHook', async (req,res) => {
  try {
    const body = req.body;
    
    const facebookToken = body.entry[0].messaging[0].recipient.id;
    if(facebookToken !== undefined) {

      const vFacebook = await Facebook.getEmpresaUid({ facebookToken });
      if(vFacebook.situacao === 'suc') {

        const empresaUid = vFacebook.empresaUid;

        const vEmpresa:any = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('atendimento').get();
        if(vEmpresa.exists) {
          
          const data:any = body.entry[0].messaging[0];

          const autorNumero = data.sender.id.toString();
          const autorNome = data.sender.id;
          const chatId = data.recipient.id;
          const idMensagem = body.entry[0].id;
          const timeMensagem = data.timestamp;

          const canal = 'facebook';
          let tipo = '';
          let mensagem = '';
          let anexo = '';
          const citacao = '';
          const legenda = '';

          if(data.message.hasOwnProperty('text')) {
            tipo = 'texto';
            mensagem = data.message.text;

          } else if(data.message.hasOwnProperty('attachments')) {
            if(data.message.attachments[0].type === 'image') {
              tipo = 'imagem';
              anexo = data.message.attachments[0].payload.url;

            } else if(data.message.attachments[0].type === 'video') {
              tipo = 'video';
              anexo = data.message.attachments[0].payload.url;

            } else if(data.message.attachments[0].type === 'file') {
              tipo = 'documento';
              anexo = data.message.attachments[0].payload.url;

            } else if(data.message.attachments[0].type === 'audio') {
              tipo = 'audio';
              anexo = data.message.attachments[0].payload.url;
            } else if(data.message.attachments[0].type === 'location') {
              tipo = 'local';
              anexo = `${data.message.attachments[0].payload.coordinates.lat};${data.message.attachments[0].payload.coordinates.long}`;
            }
          } else {
            res.status(200).json({situacao:'err',code:0,msg:'Não identifiquei o tipo de mensagem.'});
          }

          const mensagemData = {
            token: empresaUid,
            canal,
            idMensagem,
            createdAt: timeMensagem,
            autorNumero,
            autorNome,
            chatId,
            tipo,
            mensagem,
            anexo,
            citacao,
            legenda,
            empresaConfig: JSON.stringify(vEmpresa.data())
          };

          res.status(200).json( await Chat.procMensagemRecebida(mensagemData));
        } else {
          res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
        }
      } else {
        res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
      }
    } else {
      res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }
  } catch(err) {
    res.status(200).json({situacao:'err',code:1,msg:err.message});
  }
});



routes.post('/twilio/:hash', async (req,res) => {
  try {
    const hash = req.params.hash;

    const hashEmpresa = JSON.parse(Buffer.from(hash, 'base64').toString());

    if(hashEmpresa.hasOwnProperty('empresaUid')) {

      const token = hashEmpresa.empresaUid;

      const body = req.body;

      const autorNumero   = body.From.split('+').pop().toString();
      const autorNome     = body.From.split('+').pop().toString();
      const chatId        = body.To.split('+').pop().toString();
      const idMensagem    = body.MessageSid;
      const timeMensagem  = new Date().getTime();
      const canal = 'whatsappdirect';

      let tipo = '';
      let mensagem = '';
      let anexo = '';
      const citacao = '';
      let legenda = '';

      if(parseInt(body.NumMedia) > 0) {
        const type = body.MediaContentType0.split('/').shift();
        if(type === 'image') {
          tipo = 'imagem';
        } else if (type === 'application') {
          tipo = 'documento';
        } else if (type === 'audio') {
          tipo = 'audio';
        }

        anexo = body.MediaUrl0;
        legenda = body.Body;
      } else {
        tipo = 'texto';
        mensagem = body.Body;
      }

      const mensagemData = {
        token,
        canal,
        idMensagem,
        createdAt: timeMensagem,
        autorNumero,
        autorNome,
        chatId,
        tipo,
        mensagem,
        anexo,
        citacao,
        legenda,
        empresaConfig: JSON.stringify(hashEmpresa)
      };

      res.status(200).json( await Chat.procMensagemRecebida(mensagemData));
    } else {
      res.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }
  } catch(err) {
    res.status(200).json({situacao:'err',code:1,msg:err.message});
  }
});

routes.post('/migracao/:hash', async (req,res) => {
  try {
      const token = req.params.hash;
      const body = req.body;

      const dadosEnviar = {
        token,
        body
      }
     
      const Processo:any = await processotemporario.receberdadosMigracao(dadosEnviar);
      if(Processo.situacao === 'suc')
      {
        
        //RECEBER CONVERSAS
        const dadosContato = Processo.dados;
        const importConversas:any = await processotemporario.receberMigracaoConversas({token,body,dadosContato})
        console.log(importConversas)
        res.status(200).json(Processo);
      }
      else{
        res.status(500).json(Processo);
      }

      
   
  } catch(err) {
    res.status(500).json({situacao:'err',code:1,msg:err.message});
  }
});

//module.exports ={
//  protected: routesSecure,
//  unprotected: routes
//}
export default routes;