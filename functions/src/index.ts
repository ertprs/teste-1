import * as functions from 'firebase-functions';
import * as express from 'express';
import routes from './routes';

import * as admin from 'firebase-admin';

//ADICIONAR MODULOS


import Telegram from './model/telegram';
import Twilio from './model/twilio';
import Facebook from './model/facebook';
import Whatsapp from './model/whatsapp';
import Watson from './model/watson';
import Financeiro from './model/financeiro';
import Lara from './model/lara';
import Chat from './model/chat';
import Usuarios from './model/usuarios';
import Empresa from './model/empresa';
import Contatos from './model/contato';
import Webhook from './model/webhook';
import comercial from './model/comercial';
import processotemporario from './model/processotemporario';
import ListaTransmissao from './model/listatransmissao';
import Sms from './model/sms';
import agenda from './model/agenda';
import logreg from './model/log'
import cron from './model/cron'

import Secure from './model/secure';
import Apoio from './model/apoio';
import Email from './model/email'
import Enotas from './model/Enotas'

//IMPORT MODULOS COM MYSQL
import CaixaEntrada from './model/mysql/caixa_entrada'
import modelUsuarios from './model/mysql/model_usuariosonline'
import modelCasos from './model/mysql/model_ticket'
import FinanceiroSQL from './model/mysql/mysql_financeiro'



const region = 'southamerica-east1'; //SAO PAULo
const cors = require('cors')

admin.initializeApp();
export const db = admin.firestore();

const app = express();





app.use(express.json());
app.use(cors())
app.use(routes);




const runtimeOpts:any = {
    memory:'2GB'
  
    
}

export const api =  functions.runWith(runtimeOpts).region(region).https.onRequest(app);

//FACEBBOK

export const facebookWebHook = functions.region('southamerica-east1').https.onRequest(async (request,response)=>{
  if(request.method == "GET") {
      if (request.query['hub.mode'] === 'subscribe' &&
      request.query['hub.verify_token'] === "Lara2018###") {
          console.log("Validating webhook");
          response.status(200).send(request.query['hub.challenge']);
      }
      else {
          console.error("Failed validation. Make sure the validation tokens match.");
          response.sendStatus(403);
      }
  }
  else if(request.method == "POST") {
      var body = request.body;
     
      const facebookToken = body.entry[0].messaging[0].recipient.id;
    if(facebookToken !== undefined) {

      const vFacebook = await Facebook.getEmpresaUid({ facebookToken });
      if(vFacebook.situacao === 'suc') {

        const empresaUid = vFacebook.empresaUid;
        console.log('Recebendo dados para a empresa '+empresaUid)
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
            response.status(200).json({situacao:'err',code:0,msg:'Não identifiquei o tipo de mensagem.'});
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

          


          response.status(200).json( await Chat.procMensagemRecebida(mensagemData));
        } else {
          response.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
        }
      } else {
        response.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
      }
    } else {
      response.status(401).json({situacao:'err',code:0,msg:'Unauthorized'});
    }
      
  }
  else
  {
    response.sendStatus(500)
  }
})

//API ACOES
export const apiProcess = functions.region('southamerica-east1').https.onRequest(async (request,response)=>{
  if(request.method == "GET") {
    response.status(500).json({situacao:'suc',code:0,msg:'Methodo nao autorizado'});
  }
  else if(request.method == "POST") {

    const token = (request.headers.authorization || '').split(' ')[1] || ''
  
    Secure.validarToken(token)
    .then(resDadosToken=>{
      var body = request.body;
     // let  dadosRetorno:any = []
      if(body.tipo == 'import_contato_base_antiga')
      {
        console.log('Preparando importacao de contatos')
        const empresaUid = resDadosToken.empresaUid
        console.log('Detectados '+body.contatos.length)
        console.log('EmpresaUid: '+empresaUid)


    
        body.contatos.forEach((element:any) => {
          const dadosInsertA = {
            empresaUid,
            createAt:new Date().getTime(),
            contatos:element
          }
        
            //ADICIONA LINHA
            db.collection('contatoImportacao').add(dadosInsertA)
            .then(resAdd=>{
              console.log('Add registro para importacao ')
            })
            .catch(err=>{
              console.log('Falha no proesso de envio ... ')
            })

            
         
          
        });
        response.status(200).json({situacao:'suc',code:0,msg:'Processado',body});


      
       

        

      }
      else
      {
        response.status(500).json({situacao:'err',code:0,msg:'Tipo de processo indefinido ',body,resDadosToken});
      }


      

    })
    .catch(err=>{
      response.status(401).json({situacao:'err',code:0,msg:err});
    })


     
      
  }
  else
  {
    response.sendStatus(500)
  }
})


//FUNCOES INTERNAS DO APP

export const appContatosConsulta = functions.https.onCall(async (data, context) => {
  console.log('#### COMECANDO #####')
  console.log(JSON.stringify(data))
  const empresaUid            = data.empresaUid
  const dados                 = data.consultarPor
  //const consultarPor        = data.consultarPor
  //const dataWhere           = data.dataWhere
  
  const consultaContatos = await CaixaEntrada.contatosFindAll(empresaUid,dados) 
   
  return consultaContatos
 
  

  
});
export const appContatoAdd = functions.runWith({memory:'1GB'}).https.onCall(async (data, context) => {
  console.log('#### COMECANDO #####')
  console.log(JSON.stringify(data))
  const empresaUid            = data.empresaUid 

  //const consultarPor        = data.consultarPor
  //const dataWhere           = data.dataWhere
  
  const addContato = await CaixaEntrada.contatoCheckAdd(empresaUid,data) 
   
  return addContato
 
  

  
});

export const appContatoSpam = functions.runWith({memory:'256MB'}).https.onCall(async (data, context) => {
  console.log('#### COMECANDO #####')
  console.log(JSON.stringify(data))
  const empresaUid            = data.empresaUid 
  const contatoEmail          = data.contatoEmail

  //const consultarPor        = data.consultarPor
  //const dataWhere           = data.dataWhere
  
  const addContato = await CaixaEntrada.contatoSpamADD(empresaUid,contatoEmail) 
   
  return addContato
 
  

  
});
export const appConversaCheck = functions.https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid
  const contatoUid    = data.contatoUid

  const conversaCheck = await CaixaEntrada.ConversaVerificar(empresaUid,contatoUid)
  return conversaCheck
}))


export const appParceiroVerificarSeExiste = functions.https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid
  const documento    = data.documento

  const conversaCheck = await CaixaEntrada.GerenciarParceirosVerificarSeExiste(empresaUid,documento)
  return conversaCheck
}))

export const appParceiroConsulta = functions.https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid
  const buscarpor    = data.buscarpor

  const conversaCheck = await CaixaEntrada.GerenciarParceirosBuscarPor(empresaUid,buscarpor)
  return conversaCheck
}))

export const appAjustesContato = functions.runWith({memory:'2GB'}).https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid


  const conversaCheck = await CaixaEntrada.RotinaParaSincronizarContatos(empresaUid)
  return conversaCheck
}))


export const appSQLexecute = functions.runWith({memory:'2GB'}).https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const sql    = data.sql


  const conversaCheck = await CaixaEntrada.sqlExecute(sql)
  return conversaCheck
}))

export const appSQLexecuteBackup = functions.runWith({memory:'2GB'}).https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const sql    = data.sql


  const conversaCheck = await CaixaEntrada.sqlExecuteBackup(sql)
  return conversaCheck
}))


export const listaTransmissaoDetalheAdd = functions.runWith({memory:'256MB'}).https.onCall((async(data,context)=>{
  console.log('## APP VERIFICANDO CONVERSA ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid
  const dados    = data.dados
  const listUid = data.listUid


  const conversaCheck = await CaixaEntrada.listaTransmissaoDetalhe(empresaUid,listUid,dados)
  return conversaCheck
}))

//FINANCEIRO

export const appFinanceiroAdd = functions.runWith({memory:'256MB'}).https.onCall((async(data,context)=>{
  console.log('## APP LANCAMENTO FINANCEIRO  ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid
  const dados         = data




  const conversaCheck = await FinanceiroSQL.addLancamento(empresaUid,dados)
  return conversaCheck
}))

//INTEGRACAO E-NOTAS
export const appFiscalEnotasCriarEmpresa = functions.runWith({memory:'256MB'}).https.onCall((async(data,context)=>{
  console.log('## APP SINCRONIZANDO ENOTAS ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid



  const conversaCheck = await Enotas.HabilitarEmpresa(empresaUid)
  return conversaCheck
}))

export const appFiscalEnotasEnviarNFE = functions.runWith({memory:'256MB'}).https.onCall((async(data,context)=>{
  console.log('## APP SINCRONIZANDO ENOTAS ENVIANDO NOTA  ##')
  console.log(JSON.stringify(data))
  const empresaUid    = data.empresaUid
  const notaUid       = data.notaUid



  const enviarNfe = await Enotas.EnviarNFe(empresaUid,notaUid)
  return enviarNfe
}))


//export const cronTabAtendimento = functions.region(region).pubsub.schedule('*/10 * * * *')
//  .onRun(async (context) => {
//  console.log('############################## INICIO ##################################');
//  const iChat = await Chat.checkSlaConversa();
//  console.log(iChat);
//  console.log('############################### FIM ####################################');
//  return null;
//});

//export const cronTabProAtividade = functions.region(region).pubsub.schedule('*/10 * * * *')
//  .onRun(async (context) => {
//  console.log('############################## INICIO ##################################');
//  console.log(context);
//  const iChat = await Watson.checkProatividade();
//  console.log(iChat);
//  console.log('############################### FIM ####################################');
//  return null;
//});

// -> INICIO LISTA DE TRANSMISSAO
// /EDsoMmEc2C4WQPevGnyu/chat/cron/ZB0pVuy5MnXevI8HCru8
export const onChatListaCronOnWrite = functions.region(region).firestore.document('{empresaUid}/chat/cron/{cronUid}').onWrite(async (snapshot: any,params: any) => {
  console.log('############################## INICIO ##################################');
  

  //RECUPERAD DASDOS DO CRON 
  const dados = snapshot.after.data()
  const {empresaUid,cronUid} = params.params

  if(dados.situacao === 0)
  {
    //PEGAR DADOS DA LISTA MENSAGEM ANEXO 

    db.collection(empresaUid).doc('chat').collection('lista_transmissao').doc(dados.listaUid).get().then(elementList=>{
      if(elementList.exists)
      {
        const dadosLista = elementList.data()

        //MUDAR STATUS PARA ENVIANDO
        db.collection(empresaUid).doc('chat').collection('lista_transmissao').doc(dados.listaUid).set({situacao:2,situacaoNome:'Enviando'},{merge:true})
        .then(resUpdate=>{
            //ENVIAR CONTATO A CONTATO AGORA
            CaixaEntrada.EnviarContatoLista(empresaUid,dados.transmissaoUid,dadosLista,dados)
            .then(resSend=>{

              //Resultado do processo
              

            })
            .catch(errSend=>{
              let msg = 'Falha ao fazer o send das mensagens | '+errSend
              console.log(msg)
              db.collection(empresaUid).doc('chat').collection('cron').doc(cronUid).set({situacao:9,msg},{merge:true})
              .catch(err=>{
                console.log('Falha ao atualizar status da lista | '+err)
              })
              
            })
        })
        .catch(errUpdate=>{
          let msg = 'Falha ao recuperar dados da lista | '+errUpdate
          console.log(msg)
          db.collection(empresaUid).doc('chat').collection('cron').doc(cronUid).set({situacao:9,msg:errUpdate},{merge:true})
          .catch(err=>{
            console.log('Falha ao atualizar status da lista | '+err)
          })
        })


      }
      else
      {
          let msg = 'O documeento especificado para lista  | '+cronUid
          console.log(msg)
          db.collection(empresaUid).doc('chat').collection('cron').doc(cronUid).set({situacao:9,msg},{merge:true})
          .catch(err=>{
            console.log('Falha grave ao atualizar status do cron | '+err)
          })
      }
    })
    .catch(errLista=>{
      let msg = 'Falha ao recuperar dados da lista | '+errLista
      console.log(msg)
      db.collection(empresaUid).doc('chat').collection('cron').doc(cronUid).set({situacao:9,msg:errLista},{merge:true})
      .catch(err=>{
        console.log('Falha grave ao atualizar status do cron | '+err)
      })
    })


  }
  else if(dados.situacao === 9)
  {
    //INFORMAR ERRO TODAL DO PROCESSO
    // /EDsoMmEc2C4WQPevGnyu/chat/lista_transmissao_detalhe/RjIVIn6TDJOFDMNyE0r1/envio/kbMC5vtXVoBgmsirw9nl
    db.collection(empresaUid).doc('chat').collection('lista_transmissao_detalhe').doc(dados.listaUid).collection("envio").doc(dados.transmissaoUid).set({situacaoCod:9,msg:'Falha no processo de envio |'+dados.msg},{merge:true})
    .catch(errCancelamentoDaFinla=>{
      console.log(' ***** FALHA GERAL AO TENTAR CANCELAR FILA '+errCancelamentoDaFinla)
    })
  }

  

  console.log('############################### FIM ####################################');

});


// <- FIM LISTA DE TRANSMISSAO

// -> INCIO CRON

export const cronAlert = functions.region(region).pubsub.schedule('* * * * *')
  .timeZone('America/Sao_Paulo') 
  .onRun(async (context) => {
  console.log('############################## INICIO  cronAlert ##################################');
  const iChat = await cron.verificarAlertas({})
  console.log(iChat);
  console.log('############################### FIM ####################################');
  return null;
});



export const cronConsumo = functions.region(region).pubsub.schedule('*/2 * * * *')
  .timeZone('America/Sao_Paulo') 
  .onRun(async (context) => {
  console.log('############################## INICIO  CronConsumo  ##################################');
  db.collection('caixa_entrada').where('situacao','==',0).limit(100).get()
  .then(Element=>{
    if(!Element.empty)
    {
      
      Element.forEach(doc=>{
        const docUid = doc.id
        const dados = doc.data();

        if(dados.dadosControle.situacao === 0 )
        {
          console.log('Iniciado processo de ajuste de consumo ')
          CaixaEntrada.AddConsumo(dados)
          .then(()=>{
            console.log('Lancamento de saldo processado com sucesso ')
            //DELETAR PROCESSO DE CAIXA DE ENTRADA
            db.collection('caixa_entrada').doc(docUid).delete()
            .then(()=>{
              console.log('Caixa de entrada deletada com sucesso')
            })
            .catch(err=>{
              console.log('Falha ao deletar caixa de entrada ')
            })
          })
          .catch(err=>{
            console.log('ERR no processo de lancamento de saldo '+err)
          })
          



        }
        else{
          console.log('Consumo ainda nao esta pronto '+dados.dadosControle.situacao)
        }
      })
   
      

      
    }
    else
    {
      console.log('Nao existem dados a processar ')
    }
  })
  .catch(err=>{
    console.log('falha no processo de cron consumo '+err)
  })
 
  console.log('############################### FIM ####################################');
  return null;
});


// <- FIM CRON

// -> INCIO parceiros
export const parceirosOnWrite = functions.region(region).firestore.document('{empresaUid}/dados/parceiros/{parceiroUid}').onWrite(async (change:any, context:any) => {
  console.log('############################### INICIO ####################################');

  const dados = change.after.data()
  const { empresaUid,parceiroUid } = context.params;
  const dadosSend = {
    id:parceiroUid,
    ... dados
  }
  console.log(JSON.stringify(dadosSend))

  CaixaEntrada.GerenciarParceiros(empresaUid,dadosSend)
  .then(res=>{
    console.log("Sincronismo de parceiro feito com sucesso | "+parceiroUid)
    db.collection(empresaUid).doc('dados').collection('parceiros').doc(parceiroUid).set({sincronizado:1},{merge:true})
    .catch(errUp=>{
      console.log('ERRO AO ATUALIZAR SITUACAO DO CADASTRO ')
    })
  })
  .catch(err=>{
    console.log("Falha no sincronismo  | "+parceiroUid)
    
  })

  console.log('############################### FIM ####################################');
  


})
export const parceirosOnDelete = functions.runWith({memory:'256MB'}).region(region).firestore.document('{empresaUid}/dados/parceiros/{parceiroUid}').onDelete((snapshot:any,params:any)=>{
  console.log('############################## INICIO ##################################');
  
  const { empresaUid,parceiroUid } = params.params;
  CaixaEntrada.GerenciarParceirosDelete(empresaUid,parceiroUid)
  .then(res=>{
    console.log(res)
  })
  .catch(err=>{
    console.log('### Falha -> '+err)
  })
  console.log('############################## FIM  ##################################');
})
// <- FIM parceiros
// -> INICIO CHAT CRON
export const chatCronOnCreate = functions.runWith({memory:'256MB'}).region(region).firestore.document('{empresaUid}/chat/{cronUid}').onCreate((snapshot:any,params:any)=>{
  console.log('############################## INICIO ##################################');
  const dados = snapshot.data();
  const {empresaUid,cronUid} = params.params
  const dadosProcesso ={
    empresaUid,
    cronUid,
    ... dados
  }
  Chat.transmissaoIniciar(dadosProcesso).then(res=>{
    console.log('Fila processado com suceso')
  })
  .catch(err=>{
    if(err.abortarprocesso)
    {
      ///QmPJcDIMLJBshGe9LDv2/chat/lista_transmissao_detalhe/O8IVOcfGUKRNtaw1G44T/envio/fG34ydLoPZ4O00Uh7uOR
      db.collection(empresaUid).doc('chat').collection('lista_transmissao_detalhe').doc(dados.listaUid).collection('envio').doc(dados.transmissaoUid).set({situacaoCod:9,situacaoNome:'Cancelado',msgProcesso:err.msg},{merge:true})
      .then(resUpdate=>{
        ///QmPJcDIMLJBshGe9LDv2/chat/lista_transmissao/O8IVOcfGUKRNtaw1G44T
        db.collection(empresaUid).doc('chat').collection('lista_transmissao').doc(dados.listaUid).set({situacao:0,situacaoNome:'Parada'},{merge:true})
        .then(()=>{
          console.log('Lista abortada com sucesso')
        })
        .catch(errUpdate2=>{
          console.log('Falha ao atualizar situacao da lista principal no abortar | '+errUpdate2)
        })
      })
      .catch(errUpdate=>{
        console.log('Falha ao atualizar situacao da lista no abortar | '+errUpdate)
      })
    }
    let msg = err
    console.log('[FALHA]'+msg)
  })
  console.log('############################## FIM ##################################');
  
})
// <- FIM CHAT CRON
// -> INCIO usuariosonline
export const usuariosonlineOnCreate = functions.runWith({memory:'256MB'}).region(region).firestore.document('usuariosonline/{uidDoc}').onCreate((snapshot:any,params:any)=>{
  console.log('############################## INICIO ##################################');
  const dados = snapshot.data();
  
  modelUsuarios.MudarStatusOperador(dados,1)
  .then(res=>{
    //ENVIAR E_MAIL
    db.collection('contasEmail').doc('QmPJcDIMLJBshGe9LDv2').get()
    .then(resContaEmail=>{
      if(resContaEmail.exists)
      {
        const dadosConta = <any>resContaEmail.data()
        let smtpSecure = true;
        if(dadosConta.smtpSecure === "false")
        {
          smtpSecure = false;
        }
       
        const parametrosEmail ={
          configDados:{
            host:dadosConta.smtpHost,
            porta:Number(dadosConta.smtpPorta),
            secure:smtpSecure,
            usuario:dadosConta.smtpUsuario,
            senha:dadosConta.smtpSenha,
          },

          emailsDestino:dados.email, 
          assunto:'Lara - Aviso de segurança', 
          mensagem:'Detectamos um novo login seu agora.<br><strong>Empresa:</strong>'+dados.empresa, 
          anexos:'',
          assinatura:'Lara Inteligência Artificial<br>lara@assistentelara.com.br<br>Você pode me chamar no WhatsApp +55 (11) 3230-3871 ou me liga +55 (11) 3181-8709 que falamos melhor. '
        }
        Email.sendMail(parametrosEmail)
        .then(resSendEmail=>{
          let msg = 'Email de acesso enviado com sucesso para '+parametrosEmail.emailsDestino
          console.log(msg)
        })
        .catch(err=>{
          let msg = 'Falha ao enviar e-mail |'+err
          console.log(msg)
        })
      }

      
    })
    .catch(err=>{
      console.log('Falha ao ler contas de e-mail')
    })
   

    
  })
  .catch(err=>{
    console.log('### Falha -> '+err)
  })
  console.log('############################## FIM  ##################################');
})
export const usuariosonlineOnDelete = functions.runWith({memory:'256MB'}).region(region).firestore.document('usuariosonline/{uidDoc}').onDelete((snapshot:any,params:any)=>{
  console.log('############################## INICIO ##################################');
  const dados = snapshot.data();
  
  modelUsuarios.MudarStatusOperador(dados,2)
  .then(res=>{
    console.log(res)
  })
  .catch(err=>{
    console.log('### Falha -> '+err)
  })
  console.log('############################## FIM  ##################################');
})

// <- FIM usuariosonline


// -> ENVIO DE EMAIL
export const onEmailSend = functions.region(region).firestore.document('{empresaUid}/email/caixa_saida/{emailUid}').onWrite(async (snapshot: any,params: any) => {
  console.log('############################## INICIO ##################################');
  

  //RECUPERAD DASDOS DO CRON 
  const dados = snapshot.after.data()
  const {empresaUid,emailUid} = params.params

  if(dados.situacao === 0)
  {
    db.collection('contasEmail').doc(empresaUid).get()
    .then(resContaEmail=>{
        //AQUI INICIO
      if(resContaEmail.exists)
      {
          const dadosConta = <any>resContaEmail.data()
          let smtpSecure = true;
          if(dadosConta.smtpSecure === "false"){smtpSecure = false; }
          let anexoadd = []

          if(dados.anexo)
          {
            anexoadd.push(dados.anexo)
          }
          const parametrosEmail = {
            configDados:{
              host:dadosConta.smtpHost,
              porta:Number(dadosConta.smtpPorta),
              secure:smtpSecure,
              usuario:dadosConta.smtpUsuario,
              senha:dadosConta.smtpSenha,
            },
            emailsDestino:dados.para, 
            assunto:dados.assunto, 
            mensagem:dados.mensagem, 
            anexos:anexoadd,
            assinatura:"Departamento financeiro"
          }
          console.log(parametrosEmail)
        
          Email.sendMail(parametrosEmail)
          .then(resSenMail=>{
            //DEU CERTO O ENVIO
            console.log('Deu certo ')
            db.collection(empresaUid).doc('email').collection('caixa_saida').doc(emailUid).set({situacao:1},{merge:true})
            .catch(errUpdate=>{
              console.log('Falha ao atualizar status de erro')
            })
          })
          .catch(errSendMail=>{
            console.log('Falha 1')
            db.collection(empresaUid).doc('email').collection('caixa_saida').doc(emailUid).set({situacao:9,msg:'Falha 1 | '+errSendMail},{merge:true})
            .catch(errUpdate=>{
              console.log('Falha ao atualizar status de erro')
            })
          })
      }
      else
      {
        //ERRO PORQUE NAO ENVIOU
        console.log('Falha 2')
        db.collection(empresaUid).doc('email').collection('caixa_saida').doc(emailUid).set({situacao:9,msg:'Falha 2 | Não existe uma conta para envio '},{merge:true})
        .catch(errUpdate=>{
          console.log('Falha ao atualizar status de erro')
        })
      }
    })
    .catch(errContaEmail=>{
      //FALHA AO PROCESSAR LEITURA DA CONTA DE EMAIL
      console.log('Falha 3')
      db.collection(empresaUid).doc('email').collection('caixa_saida').doc(emailUid).set({situacao:9,msg:'Falha 3 | '+errContaEmail},{merge:true})
      .catch(errUpdate=>{
        console.log('Falha ao atualizar status de erro')
      })
    })

  }
})
// <-

// -> INICIO TICKET
///QmPJcDIMLJBshGe9LDv2/dados/ticket_detalhe/4OeI00Cpb9tjZRAOZPvP/interacoes/fGOxpQUKM9BmCtkSVCbt
export const ticketOnWrite = functions.region(region).firestore.document('{empresaUid}/dados/ticket_detalhe/{ticketUid}/interacoes/{interacaoUid}').onWrite(async (change:any, context:any) => {
  console.log('############################## INICIO ##################################');
  const dados = change.after.data()
  const { empresaUid,ticketUid,interacaoUid } = context.params;
  if(dados.tipo == 'email')
  {
    

    if(dados.situacao === 0)
    {
      if(dados.es === 's')
      { 
        //ENVIAR EMAIL
        db.collection('contasEmail').doc(empresaUid).get()
        .then(resContaEmail=>{
           //AQUI INICIO
          if(resContaEmail.exists)
          {
             const dadosConta = <any>resContaEmail.data()
             let smtpSecure = true;
             if(dadosConta.smtpSecure === "false"){smtpSecure = false; }
            
             const parametrosEmail = {
               configDados:{
                 host:dadosConta.smtpHost,
                 porta:Number(dadosConta.smtpPorta),
                 secure:smtpSecure,
                 usuario:dadosConta.smtpUsuario,
                 senha:dadosConta.smtpSenha,
               },
               emailsDestino:dados.emailDestinatario, 
               assunto:dados.emailAssunto+' #'+dados.ticketNumero, 
               mensagem:dados.descricao, 
               anexos:dados.anexo,
               assinatura:dados.assinatura
              }
            
            
            Email.sendMail(parametrosEmail)
            .then(resSendEmail=>{
                let msg = 'Email de acesso enviado com sucesso para '+parametrosEmail.emailsDestino
                console.log(msg)

                const dadosAtualizar ={
                  situacao:1,
                  msg:'Enviado com sucesso.'
                }
                db.collection(empresaUid).doc('dados').collection('ticket_detalhe').doc(ticketUid).collection('interacoes').doc(interacaoUid).set(dadosAtualizar,{merge:true})
                .then(resUpdate=>{
                  let msg5 = 'Dados do ticket atualizados com sucesso'
                  console.log(msg5)
                })
                .catch(errUpdate=>{
                  let msg4 = 'Falha no processo de atualizacao do status | '+errUpdate
                  console.log(msg4)
                })
            })
            .catch(errSendMail=>{
              let msg = 'Falha ao enviar e-mail |'+errSendMail
              console.log(msg)

              db.collection(empresaUid).doc('dados').collection('ticket_detalhe').doc(ticketUid).collection('interacoes').doc(interacaoUid).set({situacao:2,msg},{merge:true})
              .then(resUpdate=>{
                let msg3 = 'Dados do ticket atualizados com sucesso'
                console.log(msg3)
              })
              .catch(errUpdate=>{
                let msg2 = 'Falha no processo de atualizacao do status | '+errUpdate
                console.log(msg2)
              })



            })
            
          }
          else
          {
              console.log('Nao existe conta de email configurada')
              const dadosAtualizar ={
                situacao:2,
                msg:'Não existe uma conta de e-mail configurada'
              }
              db.collection(empresaUid).doc('dados').collection('ticket_detalhe').doc(ticketUid).collection('interacoes').doc(interacaoUid).set(dadosAtualizar,{merge:true})
              .then(resUpdate=>{
                let msg5 = 'Dados do ticket atualizados com sucesso'
                console.log(msg5)
              })
              .catch(errUpdate=>{
                let msg4 = 'Falha no processo de atualizacao do status | '+errUpdate
                console.log(msg4)
              })
          }
        

        })
        .catch(err=>{
          console.log('Falha ao abrir dados das contas')
        })
     
      }//
    }
  }  
 
  console.log('############################### FIM ####################################');

});


//TEST EMAIL 
export const EmailTeste = functions.region(region).firestore.document('contasEmailTest/{testUid}').onCreate((snapshot:any,params:any)=>{
  console.log('############################## INICIO  EmailTeste  ##################################');
  const dados = snapshot.data()
  const { testUid } = params.params;


    

  //RECUERAR DADOS DO E_MAIL
  console.log('UidEmpresa: '+dados.empresaUid)
  db.collection('contasEmail').doc(dados.empresaUid).get()
  .then(resContaEmail=>{
    if(resContaEmail.exists)
    {
      const dadosConta = <any> resContaEmail.data()
      if(dados.tipo == 'imap')
      {
        let imapTLS = true;
        if(dadosConta.imapTLS === 'false')
        {
          imapTLS = false;
        }
        const parametros = {
          emailsDestino:dadosConta.imapUsuario, 
          assunto:'Lara - Teste IMAP', 
          mensagem:'Se você recebeu esta mensagem é porque o processo de envio de e-mail esta correto.',
          anexos:'',
          assinatura:'Lara',
          configDados:{
            host:dadosConta.imapHost,
            porta:Number(dadosConta.imapPorta),
            secure:imapTLS,
            usuario:dadosConta.imapUsuario,
            senha:dadosConta.imapSenha,
          }
        }
        Email.ImapTest(parametros)
        .then(()=>{
          console.log('Test IMAP feito com sucesso')
          db.collection("contasEmailTest").doc(testUid).set({situacao:1,msg:'Teste executado com sucesso'},{merge:true})
          .catch(err2=>{
            console.log('Falha ao atualizar resultado do test |'+err2)
          })
        })
        .catch(err=>{
          console.log('Falha ao testar IMAP '+err)
          db.collection("contasEmailTest").doc(testUid).set({situacao:2,msg:err},{merge:true})
          .catch(err2=>{
            console.log('Falha ao atualizar resultado do test |'+err2)
          })
        })


      }
      if(dados.tipo == 'smtp')
      {
        console.log('Iniciando teste SMTP')
        let smtpSecure = true;
        if(dadosConta.smtpSecure === "false")
        {
          smtpSecure = false;
        }
        const parametros = {
          emailsDestino:dadosConta.smtpUsuario, 
          assunto:'Lara - Teste SMTP', 
          mensagem:'Se você recebeu esta mensagem é porque o processo de envio de e-mail esta correto.',
          anexos:'',
          assinatura:'Lara',
          configDados:{
            host:dadosConta.smtpHost,
            porta:Number(dadosConta.smtpPorta),
            secure:smtpSecure,
            usuario:dadosConta.smtpUsuario,
            senha:dadosConta.smtpSenha,
          }
        }
        Email.sendMail(parametros)
        .then(()=>{
          console.log('Test SMTP feito com sucesso')
          db.collection("contasEmailTest").doc(testUid).set({situacao:1,msg:'Teste executado com sucesso'},{merge:true})
          .catch(err2=>{
            console.log('Falha ao atualizar resultado do test |'+err2)
          })
        })
        .catch(err=>{
          console.log('Falha ao testar SMTP '+err)
          db.collection("contasEmailTest").doc(testUid).set({situacao:2,msg:'Falha ao verificar SMTP'},{merge:true})
          .catch(err2=>{
            console.log('Falha ao atualizar resultado do test |'+err2)
          })
        })
      }

      

    }
    else
    {
      db.collection("contasEmailTest").doc(testUid).set({situacao:2,msg:'Não existem configurações de e-mail validas'},{merge:true})
      .catch(err2=>{
        console.log('Falha ao atualizar resultado do test |'+err2)
      })
    }
  })
  .catch(err=>{
    console.log('Falha no processo de leitura das contas')
  })

    
  
  console.log('############################## FIM  EmailTeste  ##################################');
})


//CRIAR NUMERO PARA O TICKET
export const ticketOnCreate = functions.region(region).firestore.document('{empresaUid}/dados/ticket/{ticketUid}').onCreate((snapshot:any,params:any)=>{
  console.log('############################## INICIO  CronConsumo  ##################################');
  
  const dados = snapshot.data();
  const { empresaUid,ticketUid } = params.params;

  if (!dados.hasOwnProperty('numero') || dados.numero == 0 || dados.numero == '')
  {
    modelCasos.AddTicketControle(empresaUid,ticketUid)
    .then(res=>{
      let numeroTicket = res
      console.log('Numero atribuido ao ticket '+numeroTicket)

      db.collection(empresaUid).doc('dados').collection('ticket').doc(ticketUid).set({numero:numeroTicket},{merge:true})
      .then(()=>{
        console.log('Numero atribuido ao ticket com sucesso')
      })
      .catch(err=>{
        let msg = 'Falha ao atribuir numero ao ticket'
        console.log(msg)

      })

    })
    .catch(err=>{
      let msg = 'Falha no processamento de tickets '+err
      console.log(msg)
    
    })
  } 
  else
  {
    console.log('Já existe numero de controle para este ticket ')
  }
  



  
  console.log('############################## FIM  CronConsumo  ##################################');
})

//RECEBER EMAILS VIA IMAP
export const cronImap = functions.region(region).pubsub.schedule('*/5 * * * *').timeZone('America/Sao_Paulo').onRun(async (context) => 
{
  console.log('############################## INICIO  cronImap  ##################################');

 

    db.collection('contasEmail').get().then(elem=>{
      elem.forEach(dadosRec=>{
        if(dadosRec.exists)
        {
          const dadosConta = dadosRec.data()
          const empresaUid = dadosRec.id

          let imapTLS = true;
          if(dadosConta.imapTLS === 'false')
          {
            imapTLS = false;
          }

          const parametros = {
            empresaUid,
            configDados:{
              host:dadosConta.imapHost,
              porta:Number(dadosConta.imapPorta),
              secure:imapTLS,
              usuario:dadosConta.imapUsuario,
              senha:dadosConta.imapSenha,
            }
          }

          Email.RecebendoEmail(parametros)
          .then(res=>{
            console.log('VERIFICACAO DE EMAIL OCORREU COM SUCESSO ')
          })
          .catch(err=>{
            console.log('###### Falha na verificacao dos emails | '+err)
          })



        }
      })
    })
    .catch(err=>{
      console.log('Falha ao processar leitura de e-mails')
    })




    
  
  console.log('############################### FIM ####################################');
  return null;
});


// <- FIM TICKET



// -> INICIO DADOS DE CONTATO
export const contatosOnWrite = functions.region(region).firestore.document('{empresaUid}/chat/contatos/{contatoUid}').onWrite(async (change:any, context:any) => {
  console.log('############################## INICIO ##################################');
  
  const { empresaUid,contatoUid } = context.params;
  try
  {
    console.log(JSON.stringify(change.after))
   
    const dados = change.after.data()
    console.log(JSON.stringify(dados))

    if(dados.sincronizado === 1)
    {
      console.log('** Atualizar contato '+contatoUid)

      //ATUALIZAR EM CASOS
      db.collection(empresaUid).doc('dados').collection('ticket').where('sincronizado','==',1).where('contatoUid','==',contatoUid).get()
      .then(resTicket=>{  
        if(!resTicket.empty)
        {
          resTicket.docs.forEach(dadosTicket=>{
            db.collection(empresaUid).doc('dados').collection('ticket').doc(dadosTicket.id).set({contatoNome:dados.nome,parceiroUid:dados.parceiroUid,parceiroNome:dados.parceiroNome},{merge:true})
            .catch(errUpTIcket=>{
              console.log('** Falha ao atualizar dados no ticket ')
            })
          })
          
        }
      })
      .catch(errTicket=>{
        console.log('** Erro ao listar tickets ')
      })



      

      //ATUALIZAR MYSQL 
      CaixaEntrada.contatoAtualizar(empresaUid,contatoUid,dados)
      .then(()=>{
        console.log('Contato atualizado com sucesso')
      })
      .catch(err=>{
        console.log('Falha ao atualizar o contato')
      })
      //ATUALIZAR
    
    }
    else if(dados.sincronizado === 0 )
    {
      
      //SINCRONIZAR CONTATO
      const dadosAdicionar = {
        id:contatoUid,
        ... dados
      }
      CaixaEntrada.contatoAddNew(empresaUid,dadosAdicionar)
      .then(()=>{
        console.log('Cadastrado com sucesso')
        db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({sincronizado:1,msgErr:'Sincronizado com sucesso'},{merge:true})
        .catch(errAtualizacao=>{
          console.log(errAtualizacao)
        })
      })
      .catch(err=>{
        console.log(err)
        db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({sincronizado:2,msgErr:err},{merge:true})
        .catch(errAtualizacao=>{
          console.log(errAtualizacao)
        })
      })
    

    }
    else
    {
      console.log(JSON.stringify(dados))
      console.log('###### Situacao nao definida ')
      }
    
    
  }
  catch(errGeral)
  {
    console.log(errGeral)
    db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoUid).set({sincronizado:2,msgErr:'Falha geral'},{merge:true})
    .catch(errAtualizacao=>{
      console.log(errAtualizacao)
    })
  }
  

  console.log('############################## FIM  ##################################');
})

export const contatoOnDelete = functions.region(region).firestore.document('{empresaUid}/chat/contatos/{contatoUid}').onDelete(async(snapshot:any,params:any)=>{
  console.log('############################## INICIO ##################################');
  const contatoUid = params.params.contatoUid
  const empresaUid = params.params.empresaUid
  CaixaEntrada.verificarContatoDelete(empresaUid,contatoUid)
  .then(res=>{
    console.log('### Cadastro delete com sucesso ')
  })
  .catch(err=>{
    console.log('Falha ao atualizar cadastro '+err)
  })

  console.log('############################## FIM ##################################');
})
// <- FIM DADOS DE CONTATO




//AJUDA COM INDEX

//GERENCIAMENTO DE FILAS


//CONFIGURACOES


//CONTATOS
export const contatosImportApi = functions.runWith({memory:'2GB'}).region(region).firestore.document('contatoImportacao/{uidProcccesso}').onCreate((snapshot:any,params:any)=>{
 
  console.log('############################## INICIO ##################################');
  const body = snapshot.data();
  const empresaUid = body.empresaUid
 
  const element = body.contatos
  const docUid = params.params.uidProcccesso
    console.log('Iniciando verificacao '+element.telefone)
    const contatoData = {
      createAt: new Date().getTime(),
      photo:Contatos.getRandomColor(),
      nome:element.nome.toLowerCase(),
      canal:'whatsapp',
      favorito:false,
      origem:element.telefone,
      livechat:false,
      nomeClienteVinculado:'', 
      uidClienteVinculado:'',
      usuarioUid:'',
      usuarioNome:'',
      tempoResposta: 0,
      situacao:1
    }
    const ParamSend = {
      token:empresaUid,
      data:contatoData
    }
    const ParamVerificar = {
      token:empresaUid,
      canal:'whatsapp',
      origem:element.telefone
    }
    console.log(JSON.stringify(ParamVerificar))

    console.log(JSON.stringify(contatoData))

    
   Contatos.contatoSelect(ParamVerificar)
    .then(async resVerifica=>{
      console.log('Verificando contato '+element.telefone)
     
      if(resVerifica.situacao === 'nocach')
      {
        console.log('Contato NAO EXISTE  '+element.telefone)
        Contatos.contatoInsert(ParamSend)
        .then(resAdd=>{
          console.log('Contato cadastrado '+element.telefone)
          


          db.collection('contatoImportacao').doc(docUid).delete()
          .catch(err=>{
            console.log('Falha ao deletar '+docUid)
          })


        })
        .catch(err=>{
          console.log('Falha ao cadastrar  '+element.telefone)
          db.collection('contatoImportacao').doc(docUid).delete()
          .catch(err2=>{
            console.log('Falha ao deletar '+docUid)
          })
        })
        
      }
      else
      {
        console.log('Contato Ja existe  '+element.telefone)
        db.collection('contatoImportacao').doc(docUid).delete()
        .catch(err=>{
          console.log('Falha ao deletar '+docUid)
        }) 
      }
    })
    .catch(err=>{
      console.log('##### FALHA NO PROCESSO DE SELECT #########')
      console.log(err)
      console.log('##### FIM  #########')
      db.collection('contatoImportacao').doc(docUid).delete()
      .catch(err2=>{
        console.log('Falha ao deletar '+docUid)
      }) 
    })

   
    

 



  console.log('############################## FIM  ##################################');
 


  
  




})

//USUARIOS
export const confUsuarioOnWrite = functions.region(region).firestore.document('{empresaUid}/dados/usuarios/{usuarioUid}').onWrite(async (change:any, context:any) => {
  console.log('############################## INICIO ##################################');
  const dados = change.after.data()
  const { empresaUid,usuarioUid } = context.params;
  console.log(JSON.stringify(dados))
  if(dados.apiKey !== undefined)
  {
    console.log('Existem apiKey')
    db.collection('access_token').where('userUid','==',dados.userUid).get()
    .then(resDaddos=>{
      if(resDaddos.empty)
      {
        console.log('Add token')
        //ADD
        if(dados.apiKey)
        {
          const addParam ={
            empresaUid,
            ... dados
          }

          db.collection('access_token').add(addParam)
          .catch(err=>{
            const parametros ={
              'funcao':'confUsuarioOnWrite',
              'msg':'Falha ao criar autorizacao de login por api '+usuarioUid
            }
            logreg.Inserir(empresaUid,parametros,"sistema")
            .catch(()=>{
              console.log('Falha registro log')
            })

          })
        }
        else
        {
          console.log('Nao foi criado usuario')
        }
        
      }
      else
      {
        if(resDaddos.size == 1)
        {
          console.log('Padroes corretos de analise ')
          if(dados.apiKey)
          {
            console.log('Atualizado token')
            //ATUALIZAR
            resDaddos.docs.forEach(dadosDocumento=>{
              const id = dadosDocumento.id
              db.collection('access_token').doc(id).update(dados)
              .catch(err=>{
                const parametros ={
                  'funcao':'confUsuarioOnWrite',
                  'msg':'Falha ao atualizar autorizacao de login por api '+usuarioUid
                }
                logreg.Inserir(empresaUid,parametros,"sistema")
                .catch(()=>{
                  console.log('Falha registro log')
                })

              })
            })
          }
          else

          {
            //APAGAR
            console.log('Apagar token')
            resDaddos.docs.forEach(dadosDocumento=>{
              const id = dadosDocumento.id
              db.collection('access_token').doc(id).delete()
              .then(()=>{
                const parametros ={
                  'funcao':'confUsuarioOnWrite',
                  'msg':'Token foi exluido com sucesso '+usuarioUid
                }
                logreg.Inserir(empresaUid,parametros,"sistema") 
                .catch(err=>{
                  console.log('Falha registro log')
                })
              })
              .catch(err=>{
                const parametros ={
                  'funcao':'confUsuarioOnWrite',
                  'msg':'Falha ao apaagr autorizacao de login por api '+usuarioUid
                }
                logreg.Inserir(empresaUid,parametros,"sistema")
                .catch(()=>{
                  console.log('Falha registro log')
                })
              })
            })
          }
          
        }
        else
        {
          const parametros ={
            'funcao':'confUsuarioOnWrite',
            'msg':'Duplicidade de chave detectada para user '+usuarioUid
          }
          logreg.Inserir(empresaUid,parametros,"sistema")
          .catch(err=>{
            console.log('Falha registro log')
          })
        }
        
      }
    })
    .catch(err=>{
      const parametros ={
        'funcao':'confUsuarioOnWrite',
        'msg':err
      }
      logreg.Inserir(empresaUid,parametros,"sistema")
      .catch(()=>{
        console.log('Falha registro log')
      })

    })
    if(dados.apiKey)
    {
      //INCLUIR
    }
    else
    {
      //DELETAR
    }
  }
  else
  {
    console.log('Nao existem dados a serem processados ')
  }
  

  console.log('############################### FIM ####################################');

});


//FINANCEIRO
export const onCreateReqApi = functions.runWith({memory:'1GB'}).region(region).firestore.document('reqapi/{reqUid}').onWrite(async (change: any,params: any) => {
  console.log('############################## INICIO ##################################');
  const id = params.params.reqUid
  console.log('ID: '+id)
  const dados = change.after.data()
  if(dados.situacao == 1)
  {
    console.log('Situacao 1 ')
    //GERAR LANCAMENTO FINANCEIRO
    Financeiro.lancamentoCriar(dados.empresaUid,dados.vencimentoTimeSpam,id,dados.dadosReq)
    .then(resProcesso=>{
      console.log('Os dados foram lancados')
      db.collection('reqapi').doc(id).set({situacao:2,lancUid:resProcesso,msgProcesso:''},{merge:true})
      .catch(err=>{
        console.log('Falha atualizacao da API')
        console.log(err)
      })
      .then((resAdd)=>{
        const parametros = {
            
            
            'msg':'Boleto gerado com sucesso '
          
        }
        logreg.Inserir(dados.empresaUid,parametros,"financeiro")
        .catch(err2=>{
            console.log('Falha ao registrar log')
        })
      })
      .catch(err=>{
        console.log(err)
      })
    })
    .catch(err=>{
      db.collection('reqapi').doc(id).set({situacao:0,msgProcesso:err},{merge:true})
      .catch(err2=>{
        console.log(err2)
      })
    })
  }
  console.log('############################### FIM ####################################');

});

export const onCreateCampainha = functions.runWith({memory:'256MB'}).region(region).firestore.document('/acionamentoWebHook/{docUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO onCreateCampainha  ##################################');


  const uidDOc = params.params.docUid
  const dados2 = snapshot.data()



  Apoio.acionarWebHook(uidDOc,dados2)
  .then(resAcionamento=>{
    console.log(JSON.stringify(resAcionamento))
    //LOG
    const parametros = {
        'ipCliente':'',
        'nivel':'leve',
        'msg':'Campainha acionada com sucesso | '+dados2.url,
        dados:dados2
    }
    logreg.Inserir(dados2.empresaUid,parametros,"api")
    .catch(err2=>{
        console.log('Falha ao registrar log')
    })




    console.log('Acionamento feito com sucesso')
    const dadosAtu = {
      situacao:0,
      msg:'Acionamento feito com sucesso '
    }
    db.collection('acionamentoWebHook').doc(uidDOc).set(dadosAtu,{merge:true})
    .catch(err=>{
      console.log('Falha ao atualizar tabela de acionamentos | '+err)
    })
  })
  .catch(err=>{


     //LOG
     const parametros = {
        'ipCliente':'',
        'nivel':'leve',
        'msg':'Campainha acionada com sucesso | '+dados2.url+'  | '+dados2.identInterno,
        dados:dados2
    }
    logreg.Inserir(dados2.empresaUid,parametros,"api")
    .catch(err2=>{
        console.log('Falha ao registrar log')
    })



    console.log('Falha ao fazer acionamento '+err)
    const dadosAtu = {
      situacao:2,
      msg:err
    }
    db.collection('acionamentoWebHook').doc(uidDOc).set(dadosAtu,{merge:true})
    .catch(err22=>{
      console.log('Falha ao atualizar tabela de acionamentos | '+err22)
    })
  })



  console.log('############################## FIM ##################################');

})

//COLOCAR COMO BACKUP AQUI
export const onCreateBoletoBACKUP = functions.runWith({memory:'256MB'}).region(region).firestore.document('/{empresaUid}/dados/financeiro/registros/lancamentos/{docFinanceiro}').onWrite(async (change: any,params: any) => {
  console.log('############################## INICIO ##################################');
  const id            = params.params.docFinanceiro
  const empresaUid    = params.params.empresaUid
  const dados = change.after.data()
  if(!dados.isPago)
  {

     
      if(!dados.isBoleto )
      {

        //RECUPERAR DADOS DA EMPRESA ATIVA
        db.collection('EmpControle').where('empresaUid','==',empresaUid).get()
        .then(resDadosEmpresa=>{
            //CRIAR BOLETO de lançamento
          if(!resDadosEmpresa.empty)
          {
            const dadosEmpresa = resDadosEmpresa.docs[0].data()
            const dadosMsg = {
              mensagem1:'Esta cobranca foi gerado por ordem de',
              mensagem2:'('+dadosEmpresa.documento+ ') '+dadosEmpresa.nome
            }
            const dadosSendBoleto ={
              idDoc:id,
              empresaUid,
              idDocFinanceiro:id,
              dadosMsg,
              ... dados
            }
            Financeiro.CriarBoletoCheckout(dadosSendBoleto)
            .then(resAddBoleto=>{

              console.log(JSON.stringify(resAddBoleto))
              
            
            })
            .catch(errAddBoleto=>{
              const isBoletoRet = {
                situacaoCod:2,
                situacaoNome:'erro',
                msgErro:'Falha na requisiçao | return '+JSON.stringify( errAddBoleto)
              }
  
              db.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(id).set(isBoletoRet,{merge:true})
              .then(resUp=>{
                console.log('Dados do boleto atualizados com sucesso ')
              })
              .catch(errUp=>{
                console.log('Falha no processo de atualizacao boletos | '+errUp)
              })



              //LOG
              const parametros = {
                'ipCliente':'',
                'nivel':'alto',
                'msg':'Falha no processo de geracao de boleto para identificador '+dados.identCliente,
                dados:''
            }
            logreg.Inserir(dados.empresaUid,parametros,"api")
            .catch(err2=>{
                console.log('Falha ao registrar log')
            })

              console.log('Falha ao adicionar boleto | '+JSON.stringify(errAddBoleto))
            })
          }
          else
          {
            let msg = 'Nao foi identificado empresa ativa '+empresaUid
            console.log(msg)
          }
        })
        .catch(errEmpresa=>{
          let msg = 'falha no processo de identificacao da empresa ativa | '+errEmpresa
          console.log(msg)
        })

        
      }
      else
      {
        //ACIONAMENTO WEBHOOK 
        console.log('Acionar webHook')
        if(dados.hasOwnProperty('isIntegracoesData'))
        { 
          const dadosAcionamento = {
            createAt:new Date().getTime(),
            url:dados.isIntegracoesData.endPoint,
            identInterno:dados.isIntegracoesData.identificacao,
            empresaUid,
            situacao:1
          }
          db.collection('acionamentoWebHook').add(dadosAcionamento)
          .then(resWebHook=>{
            console.log('Acionamento WEbHook OK ')

            
            //LOG
            const parametros = {
                'ipCliente':'',
                'nivel':'leve',
                'msg':'Acionamento de campainha enviado com sucesso identificado '+dadosAcionamento.identInterno,
                dados:dadosAcionamento
            }
            logreg.Inserir(empresaUid,parametros,"api")
            .catch(err2=>{
                console.log('Falha ao registrar log')
            })

          })
          .catch(err=>{
            console.log('Falha ao adicionar WEBHOOK | '+err)
          })


        }
   
      }
     

      

  }
  else
  {
    //PAGAMENTO SETADO COMO PAGO
  }
  console.log('############################### FIM ####################################');

});


export const onCreateBoleto = functions.runWith({memory:'256MB'}).region(region).firestore.document('/{empresaUid}/dados/financeiro/registros/lancamentos/{docFinanceiro}').onWrite(async (change: any,params: any) => {
  console.log('############################## INICIO ##################################');
  const id            = params.params.docFinanceiro
  const empresaUid    = params.params.empresaUid
  const dados = change.after.data()

 

  //VERIFICAR SE É PARA CRIAR BOLETO
  if(dados.libBoleto)
  {
    if(!dados.isBoleto )
    {
      //GERAR BOLETO
      const dadosGerar = {
        uid:id,
        empresaUid,
        ... dados
      }
      Financeiro.gerarBoletoSicrediAPI(dadosGerar).then(resBoletoRetorno=>{
        const resBoleto = resBoletoRetorno.data
        console.log(id+' - Boleto criado com sucesso')
        console.log(JSON.stringify(resBoleto))
        //ATUALIZAR DADOS DO BOLETO
        const dadosRetorno =  {
          isBoleto:true,
          situacaoNome:'Ag. Recebimento',
          dadosBoleto:{
            linhaDigitavel:resBoleto.linhaDigitavel,
            url:resBoletoRetorno.url,
            identCliente:resBoletoRetorno.numeroControleInterno,
            codigoBarra:resBoleto.codigoBarra,
            nossoNumero:resBoleto.nossoNumero,
            dataProcessamento:resBoleto.dataProcessamento,
            dataDocumento:resBoleto.dataDocumento
          }
        }
        console.log(dadosRetorno)
        db.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(id).set(
          dadosRetorno
         ,
          {merge:true}
        )
        .then(resUpdate=>{
          const dadosUpdate = {
            nossoNumero:resBoleto.nossoNumero,
            numeroLara:resBoletoRetorno.numeroControleInterno
          }
          FinanceiroSQL.updateDados(empresaUid,id,dadosUpdate)
          .catch(errUpdateSql=>{
            console.log('Falha ao atualizar dados no SQL |'+errUpdateSql)
          })
        })
        .catch(errUpdateDoc=>{
          console.log('Falha ao fazer upload dos dados do boleto recebido '+errUpdateDoc)
        })


       
      })
      .catch(errBoleto=>{
        console.log(id+' - Falha ao gerar boleto |'+errBoleto)
        const dadosRetorno =  {
          isBoleto:false,
          situacaoNome:'Erro',
          situacaoCod:9,
          msgErro:'Houve um problema ao gerar o boleto. | '+errBoleto
          
        }
        db.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('lancamentos').doc(id).set(
          dadosRetorno
         ,
          {merge:true}
        )
        .catch(errUpdateDoc=>{
          console.log('Falha ao fazer upload dos dados do boleto recebido '+errUpdateDoc)
        })
      })
    }
  }
  else
  {
    console.log('Não existe boleto para emitir')
  }


  //CANCELAR LANCAMENTO
  if(dados.isCancelado)
  {
    FinanceiroSQL.cancelarLandamento(empresaUid,id)
    .then(resCancelamento=>{
      console.log('Titulo cancelado com sucesso')
    })
    .catch(errCancelamentop=>{
      console.log('Falha ao cancelar '+errCancelamentop)
    })
  }
  //ACIONAMENTO WEBHOOK 
  
  if(dados.hasOwnProperty('isIntegracoesData'))
  { 
    console.log('Acionar webHook')
    const dadosAcionamento = {
      createAt:new Date().getTime(),
      url:dados.isIntegracoesData.endPoint,
      identInterno:dados.isIntegracoesData.identificacao,
      empresaUid,
      situacao:1
    }
    db.collection('acionamentoWebHook').add(dadosAcionamento)
    .then(resWebHook=>{
      console.log('Acionamento WEbHook OK ')

      
      //LOG
      const parametros = {
          'ipCliente':'',
          'nivel':'leve',
          'msg':'Acionamento de campainha enviado com sucesso identificado '+dadosAcionamento.identInterno,
          dados:dadosAcionamento
      }
      logreg.Inserir(empresaUid,parametros,"api")
      .catch(err2=>{
          console.log('Falha ao registrar log')
      })

    })
    .catch(err=>{
      console.log('Falha ao adicionar WEBHOOK | '+err)
    })


  }


  console.log('############################### FIM ####################################');

});





export const onFunctionTeste = functions.region(region).firestore.document('funcaoteste/{mensagemUid}').onWrite(async (snapshot: any,params: any) => {
  console.log('############################## INICIO ##################################');
  
  try{
    
   const token = 'QmPJcDIMLJBshGe9LDv2'
   const datataIni =1598410740000
   const dataFim = 1596250800000
    const dados = await  db.collection(token).doc('chat').collection('conversas').where('createAt','>=',datataIni).where('createAt','<=',dataFim).get()
    if(!dados.empty)
    {
      dados.forEach(elem=>{
        const dadosRet = elem.data()
        console.log(JSON.stringify(dadosRet))
        
      })
    }
    else
    {
      console.log('vazioo')
    }
  
  }
  catch(errr)
  {
    console.log(errr)
  }
  

  console.log('############################### FIM ####################################');

});


//ACOES ADM
export const onCreateAcoesADm = functions.runWith(runtimeOpts).region(region).firestore.document('acoesAdm/{acaoUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO  onCreateAcoesADm##################################');
  const dados = snapshot.data()
  const { acaoUid }= params.params;

  if(dados.acaoNome == 'contatossql')
  {
    console.log('Iniciando contatos sql ')
    const empresaUid = dados.empresaUid
    //LISTAR CONTATOS ATUAIS
    db.collection(empresaUid).doc('chat').collection('contatos').get()
    .then(resDadosContato=>{
      if(!resDadosContato.empty)
      {
        const dadosVerificacaoTotal:any = []
        resDadosContato.docs.forEach(elem=>{
         
          //ITEM
          const uid      = elem.id
          const data    = elem.data()

          const dadosVerificacao = {
            uid,
            ... data
          }
          console.log(JSON.stringify(dadosVerificacao))
          
          dadosVerificacaoTotal.push(dadosVerificacao)
          


        })
        
        CaixaEntrada.verificarContatoAdd(empresaUid,dadosVerificacaoTotal)
          .then(resResult=>{
            let msg = 'Processado com sucesso'
            console.log()
            db.collection('acoesAdm').doc(acaoUid).set({
              situacao:1,
              msg,
            },{merge:true})
            .catch(err=>{
              console.log('falha ao atualizar informacao do processo 1 | '+err)
            })
          })
          .catch(errVerificacao=>{
            let msg = 'Falha ao fazer verificacao do contato | '+errVerificacao
            console.log()
            db.collection('acoesAdm').doc(acaoUid).set({
              situacao:2,
              msg,
            },{merge:true})
            .catch(err=>{
              console.log('falha ao atualizar informacao do processo 1 | '+err)
            })
          })



        
      }
      else
      {
        let msg = 'Nao existem contatos cadastrados '
        console.log()
        db.collection('acoesAdm').doc(acaoUid).set({
          situacao:2,
          msg,
        },{merge:true})
        .catch(err=>{
          console.log('falha ao atualizar informacao do processo 1 | '+err)
        })
      }
    })
    .catch(err=>{
      let msg = 'falha ao listar contatos | '+err
      console.log()
      db.collection('acoesAdm').doc(acaoUid).set({
        situacao:2,
        msg,
      },{merge:true})
      .catch(err2=>{
        console.log('falha ao atualizar informacao do processo 1 | '+err2)
      })

    })

  }
  else
  {
    console.log('AcaoNome nao identificada '+dados.acaoNome)
    db.collection('acoesAdm').doc(acaoUid).set({
      situacao:2,
      msg:'acaoNome nao foi identificada '+dados.acaoNome
    },{merge:true})
    .catch(err=>{
      console.log('falha ao atualizar informacao do processo 1 | '+err)
    })
  }




  console.log('############################## FIM  onCreateAcoesADm##################################');

})


//CAIXA DE ENTRADA
export const onCreateCaixaEntrada = functions.region(region).firestore.document('caixa_entrada/{docUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO ##################################');
  

  const { docUid } = params.params;


    

      //console.log('Existe uma nova acao ')
      const dados = snapshot.data()

      if(dados.situacao == 1)
      {
         //SETAR DOCUMENTO DE CONTROLE
         dados.dadosControle.docUid = docUid

         //VERIFICAR DADOS DA EMPRESA
         CaixaEntrada.empresaGetConfiguracoes(dados.empresaUid)
         .then(resDadosEmpresa=>{


            //DADOS DA EMPRESA
            dados.dadosEmpresa            = resDadosEmpresa

            console.log("######### BOAS VINDAS ")
            console.log(JSON.stringify(dados.dadosEmpresa))
            console.log("#########")
             CaixaEntrada.verificarContato(dados.empresaUid,dados.dadosFluxo)
             .then((resContato)=>{
               const contatoUid    = resContato.uid
               const contatoNome   = resContato.nome
               const persona       = resContato.persona
               const contatoNovo   = resContato.novo
 
               //CONTADOR DE REGISTROS DE CONVERSA
               if(resContato.qtd > 0)
               {
                 const dadosAtualizacao = {
                   dadosControle:{
                     update:admin.firestore.FieldValue.increment(1),
                     gravacao:admin.firestore.FieldValue.increment(1),
                   }
                 }
                 db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
                 .catch((errCaixa:any)=>{
                   console.log(errCaixa)
                   console.log('######################### FALHA AO GRAVAR CONTADOR CONTATO ######################### ')
                 })
 
                
               }
 
 
               //UPDATE PARAMETROS DO FLUXO
               dados.dadosFluxo.contatoUid   = contatoUid
               dados.dadosFluxo.contatoNome  = contatoNome.toLowerCase()
               dados.dadosFluxo.persona      = persona.toLowerCase()
               dados.dadosFluxo.brainProc    = resDadosEmpresa.brainUid
               
               
               
             
 
               //console.log('################################################## JSON FORMATADO ')
               //console.log(JSON.stringify(dados))
 
               //VERIFICAR SE EXISTE TICKET DE ATENDIMENTO EM ANDAMENTO
               //dados.dadosFluxo.usuarioUid
               //dados.dadosFluxo.usuarioNome
 
 
               //FINAL DA VERIFICACAO DE TICKET
               db.collection(dados.empresaUid).doc('dados').collection('ticket').where('contatoUid','==',dados.dadosFluxo.contatoUid).where('situacao', 'in', [1,2]).get()
               .then(resCheckTicket=>{
 
                 if(!resCheckTicket.empty)
                 {
                     const doc = resCheckTicket.docs[0]
                     const dataTicket = doc.data()
                     dados.dadosFluxo.usuarioUid     = dataTicket.usuarioUid
                     dados.dadosFluxo.usuarioNome    = dataTicket.usuarioNome
                     dados.dadosFluxo.casoUid        = doc.id
                 }
                 

                 //VERIFICACOES DA CONVERSA ANDAMENTO 
                 CaixaEntrada.verificarConversa(dados.empresaUid,dados.dadosFluxo,)
                 .then((resConversa)=>{
                   const conversaUid = resConversa.conversaUid
                   const conversaSituacao = resConversa.situacao
                  
                  if(contatoNovo)
                  {
                         //ENVIAR MENSAGENS DE BOAS VINDAS
                         console.log("######### BOAS VINDAS 1")
                         if(dados.dadosEmpresa)
                         {
                             console.log("######### BOAS VINDAS 2")
                             if(dados.dadosEmpresa.msgBoasVindas != '')
                             {
                                 console.log("######### BOAS VINDAS 3")
                                 const msgSaidaTransf = {
                                     contatoUid:dados.dadosFluxo.contatoUid,
                                     autorNome:dados.dadosFluxo.contatoNome,
                                     autorUid:dados.dadosFluxo.origemUid,
                                     canal:dados.dadosFluxo.canal,
                                     contatoOrigem:dados.dadosFluxo.origemUid,
                                     time:new Date().getTime(),
                                     es:'s',
                                     idMensagem:0,
                                     mensagem:dados.dadosEmpresa.msgBoasVindas,
                                     tipo:'texto',
                                     anexo:'',
                                     citacao:'',
                                     conversaUid:'',
                                     contatoNome:''
                 
                                 }
                                 console.log(JSON.stringify(msgSaidaTransf))
                                 CaixaEntrada.addMensagem(dados.empresaUid,msgSaidaTransf)
                                 .then(()=>{
                                 //CONTADOR DE GRAVACAO
                                 console.log('[****] Foi aenviado mensagem de boas vidas [****] ')
                               
                                 
                                 })
                                 .catch(err=>{
                                     let msgProc = 'Falha ao adicionar mensagem de entrada no firebase (10) '+err
                                 console.log(msgProc)
                                 
                                 })
                             }
                         }
                  }

                 

                  
 
                   //CONTADOR DE REGISTROS DE CONVERSA
                   if(resConversa.qtd > 0)
                   {
                     const dadosAtualizacao = {
                       dadosControle:{
                         update:admin.firestore.FieldValue.increment(1),
                         gravacao:admin.firestore.FieldValue.increment(1),
                       }
                     }
                     db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
                     .catch((errCaixa:any)=>{
                       console.log(errCaixa)
                       console.log('######################### FALHA AO GRAVAR CONTADOR CONVERSA ######################### ')
                     })
                   }
 
 
                   //ATUALIZAR DADOS DO FLUXO
                   dados.dadosFluxo.conversaUid  = conversaUid
                   dados.dadosFluxo.situacao     = conversaSituacao
                 
                   
                 
                   //PROCESSAR CONVERSA
 
                   //DETERMINAR TIME ENTRADA
                   let timeEntrada = new Date().getTime()
                   if(dados.dadosMensagem.hasOwnProperty('body'))
                   {
                     if(dados.dadosMensagem.body.hasOwnProperty('messages'))
                     {
                       dados.dadosMensagem.body.messages.forEach((element:any) => {
                         if(element.hasOwnProperty('time'))
                         {
                           timeEntrada = element.time
                         }
                       });
                       
                     }
                   }
 
                   let idMensagemRecebida = ''
                   if(dados.dadosMensagem.hasOwnProperty('body'))
                   {
                     if(dados.dadosMensagem.body.hasOwnProperty('messages'))
                     {
                       dados.dadosMensagem.body.messages.forEach((element:any) => {
                         if(element.hasOwnProperty('id'))
                         {
                           idMensagemRecebida = element.id
                         }
                       });
 
                       
                     }
                   }
 
 
                   //ADICIONAR MENSAGEM DE ENTRADA 
                   const msgEntradaAdd = {
                     contatoUid:dados.dadosFluxo.contatoUid,
                     autorNome:dados.dadosFluxo.contatoNome,
                     autorUid:dados.dadosFluxo.origemUid,
                     canal:dados.dadosFluxo.canal,
                     contatoOrigem:dados.dadosFluxo.origemUid,
                     time:timeEntrada,
                     es:'e',
                     idMensagem:idMensagemRecebida,
                     mensagem:dados.dadosMensagem.mensagem,
                     tipo:dados.dadosMensagem.tipo,
                     anexo:dados.dadosMensagem.anexo,
                     citacao:dados.dadosMensagem.citacao,
                     processoIa:false,
                     conversaUid:dados.dadosFluxo.conversaUid,
                    
 
                   }
                   CaixaEntrada.addMensagem(dados.empresaUid,msgEntradaAdd)
                   .then(()=>{
                     //CONTADOR DE GRAVACAO
                     //console.log('[****] FOi adicionado mensagem de entrada aos arquivos')
                     dados.dadosControle.gravacao = dados.dadosControle.gravacao + 1
 
                     //GRAVAR UPDATE QTDA
                     db.collection(dados.empresaUid).doc('chat').collection('conversas').doc(dados.dadosFluxo.conversaUid).set({
                       qtdA:admin.firestore.FieldValue.increment(1)
                     },{merge:true})
                     .catch(errUpdateQta=>{
                       let msgErrQtdA = 'Falha ao atualizar quantidade de mensagens recebidas';
                       console.log(msgErrQtdA)
                     })
 
                   })
                   .catch(err=>{
                     console.log('Falha ao adicionar mensagem de entrada no firebase '+err)
                   })
 
                   //PROCESSAR OS TEXTOS E ARQUIVOS RECEBIDOS AQUI ENVIAR TODO O BLOCO DO RECEBIDO
 
                   if(dados.dadosFluxo.situacao == 1)
                   {
                    //LOADING PARA SITE
                    if(dados.dadosFluxo.canal == 'botsite')
                    {
                      
                      const  Pusher = require('pusher')
                      const pusher = new Pusher({
                        appId: '1082354',
                        key: 'd6876fba7e071feed1d2',
                        secret: '9718282169569665f79e',
                        cluster: 'us2'
                      });
                      const enviarPara =  dados.dadosFluxo.origemUid
                      pusher.trigger(enviarPara, 'LaraDigitando', { message: '' })
                    }
                     CaixaEntrada.proessamentoMensagem(dados.empresaUid,dados)
                     .then(resProcConversa=>{
                       //UPDATE COD MENSAGENS COMO processado 
                       
                       console.log(JSON.stringify(resProcConversa))
                       //ATUALIZAR DADOS DO PROCESSO 
                       const dadosAtualizacao = {
                         dadosFluxo:dados.dadosFluxo,
                         dadosControle:{
                           update:admin.firestore.FieldValue.increment(1),
                           processoIaSaltos:admin.firestore.FieldValue.increment(resProcConversa.saltos),
                           gravacao:admin.firestore.FieldValue.increment(1),
                           leitura:admin.firestore.FieldValue.increment(1),
                           situacao:0,
                           msg:'Processado com sucesso'
                         },
                         situacao:0
                       }
                       db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
                       .then(()=>{
                         console.log('######################### DEU TUDO CERTO  ######################### ')
                       })
                       .catch((errCaixa:any)=>{
                         console.log(errCaixa)
                         console.log('######################### FALHA AO INSEIR RESULTADO DA CAIXA DE ENTRADA (2) ######################### ')
                       })
                     })
                     .catch(errProcConversa=>{
 
                       //UPDATE COD MENSAGENS COMO ERRO
                       let msg = '[=] Falha no processameanto da mensagem | '+errProcConversa
                       console.log(msg)
                       //ATUALIZAR DADOS DO PROCESSO 
                       const dadosAtualizacao = {
                         dadosFluxo:dados.dadosFluxo,
                       
                         dadosControle:{
                           update:admin.firestore.FieldValue.increment(1),
                           leitura:admin.firestore.FieldValue.increment(1),
                           situacao:9,
                           msg
                         },
                         situacao:9
                       }
                       db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
                       .then(()=>{
                         //VERIFICAR SE A MENSAGEM JA FOI REPROCESSADA ANTES
                        if(!dados.hasOwnProperty('reprocessar'))
                        {
                           //REPROCESSAR MAIS UMA VEZ  
                           console.log('Inicio de reprocesso de mensagem ')
 
 
                           delete dados.situacao
 
                           //HIGIENIZANDO ACOES 
                           dados.dadosFluxo.msg = '';
                           dados.dadosFluxo.situacao = 1
                           dados.reprocessar = 1
 
 
                           db.collection('caixa_entrada').doc(docUid).delete()
                           .then(()=>{
                             console.log('deletada com sucesso da caixa de entrada')
 
                             //ADD NOVAMENTE
                             db.collection('caixa_entrada').add(dados)
                             .then(resAddNovamente=>{
                               console.log('Mensagem foi adicionada novamente para processamento ')
                             })
                             .catch(errAddNovamente=>{
                               
                               console.log('Falha ao tentar adicionar novamente mensagem para processamento | '+errAddNovamente)
                             })
                           })
                           .catch(errDelete=>{
                             
                             console.log('Falha ao deletar mensagem original | '+errDelete)
                           })
                           
 
                        }
                        else
                        {
                           //ADD TABELA DE ERRO
                          console.log('################ Mensagem com erro detectada e lancada para pasta de erros ')
                           //LANCAR MENSAGEM EM ERRO E REPROCESSAR
                           db.collection('caixa_entrada_erro').add(dados)
                           .then(()=>{
                             //ADICIONADO COM  SUCESSO
                             console.log('Add caixa de erro')
 
                             db.collection('caixa_entrada').doc(docUid).delete()
                             .then(()=>{



                               console.log('Mensagem removida da caixa principal')
                               
                             })
                             .catch(errDeleteReprocesso=>{
                               console.log('Falha ao remover da caixa principal')
                             })
 
 
                           })
                           .catch(err=>{
                             console.log('Falha ao adicionar a caixa de erros ')
                           })
 
 
                        }
 
                       })
                       .catch((errCaixa:any)=>{
                         console.log(errCaixa)
                         console.log('######################### FALHA AO INSEIR RESULTADO DA CAIXA DE ENTRADA (2) ######################### ')
 
                         
                         
 
 
                       
 
                       })
                       
 
 
                       
 
 
                     })
                   }
                   else
                   {
                     console.log('[****] Verificado que a conversa esta em live chat ')
                     //CONVERSA COMO LIVE CHAT  FINALIZAR PROCESSO DA CAIXA DE ENTRADA
                     //ATUALIZAR DADOS DO PROCESSO 
                     const dadosAtualizacao = {
                       dadosFluxo:dados.dadosFluxo,
                       dadosControle:{
                         update:admin.firestore.FieldValue.increment(1),
                         gravacao:admin.firestore.FieldValue.increment(1),
                         leitura:admin.firestore.FieldValue.increment(1),
                         situacao:0,
                         msg:'Processado com sucesso'
                       },
                       situacao:0
                     }
                     db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
                     .then(()=>{
                       console.log('######################### DEU TUDO CERTO  ######################### ')
                     })
                     .catch((errCaixa:any)=>{
                       console.log(errCaixa)
                       console.log('######################### FALHA AO INSEIR RESULTADO DA CAIXA DE ENTRADA (2) ######################### ')
                     })
                   }
                   
 
 
                 })
                 .catch(errConversa=>{
                   console.log('** Erro ao verificar conversa '+errConversa)
                 })
 
 
               })
               .catch(errCheckTicket=>{
                 let msgErrCheck = 'Falha ao detectar ticket  | '+errCheckTicket
                  console.log(msgErrCheck)
                  //ATUALIZAR DADOS DO PROCESSO 
                   const dadosAtualizacao = {
                     dadosFluxo:dados.dadosFluxo,
                     dadosControle:{
                       update:admin.firestore.FieldValue.increment(1),
                       situacao:9,
                       msg:msgErrCheck
                     }
                   }
                   db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
                   .catch((errCaixa:any)=>{
                     console.log(errCaixa)
                     console.log('######################### FALHA DE PROCESSO  ######################### ')
                   })
               })
 
               
               
             })
             .catch(err=>{
               console.log('** Falha no processo '+err)
             })
         })
         .catch(err=>{
           let msg = 'Mensagem nao foi processada '+err
           console.log(msg)
 
 
           
           
           //ATUALIZAR DADOS DO PROCESSO 
           const dadosAtualizacao = {
             dadosFluxo:dados.dadosFluxo,
             dadosControle:{
               update:admin.firestore.FieldValue.increment(1),
               situacao:9,
               msg
             }
           }
           db.collection('caixa_entrada').doc(docUid).set(dadosAtualizacao,{ merge:true})
           .catch((errCaixa:any)=>{
             console.log(errCaixa)
             console.log('######################### FALHA DE PROCESSO  ######################### ')
           })
 
 
 
 
         })
      }

       

        

       
        
        
       


      
      
    

    
    
  
   
  

  console.log('############################### FIM ####################################');

});

export const onReceiveMessage = functions.runWith(runtimeOpts).region(region).firestore.document('{empresaUid}/chat/conversas/{contatoUid}/mensagens/{mensagemUid}').onCreate(async (snapshot: any,context: any) => {
  
  const { empresaUid, mensagemUid, contatoUid } = context.params;
  const { contatoOrigem, canal, mensagem, anexo, es, tipo, forwardId, usuarioUid, listaTransmissaoUid, entregueTag, disparoUid, naoRespondeuUid, conversaData } = snapshot.data();
  const dadosGerais = snapshot.data()
  let casoUid = '';
  if(dadosGerais.hasOwnProperty('casoUid'))
  {
    casoUid = dadosGerais.casoUid
  }
  if(entregueTag !== 1) {

    if(es.toUpperCase() === 'S') {

      if(usuarioUid !== '99999') {
        if(naoRespondeuUid !== undefined && naoRespondeuUid !== '') {
          await Chat.deleteNaoRespondeu({ naoRespondeuUid });
        }
      }

      if(canal.toUpperCase() === 'TELEGRAM') {

        const iTlg = await Telegram.sendMessage({ empresaUid, data: { id: mensagemUid,casoUid, contatoUid, tipo, mensagem, anexo, contatoOrigem } });
        console.log(iTlg.msg);
        return iTlg;

      } else if(canal.toUpperCase() === 'WHATSAPP') {
        console.log('Iniciar envio de mensagem ('+mensagem+') ')
        const iWpp = await Whatsapp.sendMessage({ empresaUid, data: { id: mensagemUid,casoUid, contatoUid, tipo, mensagem, anexo, contatoOrigem, forwardId, listaTransmissaoUid, disparoUid } });
        console.log(iWpp.msg);
        return iWpp;

      } else if(canal.toUpperCase() === 'FACEBOOK') {

        const iFace = await Facebook.sendMessage({ empresaUid, data: { id: mensagemUid,casoUid, contatoUid, tipo, mensagem, anexo, contatoOrigem } });
        console.log(iFace.msg);
        return iFace;

      } else if(canal.toUpperCase() === 'WHATSAPPDIRECT') {

        const iTwilio = await Twilio.sendMessage({ empresaUid, data: { id: mensagemUid,casoUid, contatoUid, tipo, mensagem, anexo, contatoOrigem } });
        console.log(iTwilio.msg);
        return iTwilio;

      } else if(canal.toUpperCase() === 'SMS') {

        const iSms = await Sms.sendMessage({ empresaUid, data: { id: mensagemUid,casoUid, ...snapshot.data() } });
        console.log(iSms.msg);
        return iSms;

      }
      else if(canal.toUpperCase() === 'BOTSITE') 
      {
        console.log('##### ENTREGA SITE ')
          const  Pusher = require('pusher')
          const pusher = new Pusher({
            appId: '1082354',
            key: 'd6876fba7e071feed1d2',
            secret: '9718282169569665f79e',
            cluster: 'us2'
          });
          const enviarPara =  dadosGerais.contatoOrigem
          const iBot = await pusher.trigger(enviarPara, 'LaraResposta', { message: dadosGerais.mensagem })

          //ATUALIZAR MENSAGEM COMO ENVIADA
          db.collection(empresaUid).doc('chat').collection('conversas').doc('mensagens').collection(dadosGerais.contatoUid).doc(mensagemUid).set({entregueTag: 2, entregueData: new Date().getTime() },{merge:true})
          .catch(err=>{
            console.log('Falha ao atualizar mensagem do chat bot')
          })

          console.log(iBot);
          return iBot;
      }
      else {
        return {situacao:'err',code:0,msg:'Não habilitado pra esse canal'};
      }
    } else if(es.toUpperCase() === 'E') {

      if(conversaData !== undefined && conversaData !== '') {

        const _conversaData = JSON.parse(conversaData);
        
        if(_conversaData.situacao === 1) {
          
          if(_conversaData.context !== undefined) {
            const _context = JSON.parse(_conversaData.context);

            if(_context.proativoUid !== undefined) {
              await Watson.deleteProativo({ proativoUid: _context.proativoUid });
            }
          }
        } else {
          await db.collection('cronnaorespondeu').add({ empresaUid, uid: mensagemUid, contatoUid, ...snapshot.data() });
        }
      }
      return {situacao:'suc',code:0,msg:'Delete proativo'};

    } else {
      return {situacao:'err',code:0,msg:'Não habilitado pra mensagens de entrada'};
    }
  } else {
    return {situacao:'err',code:0,msg:'Já foi processada'};
  }
  
});


export const onCreateConversa = functions.runWith({memory:"256MB" }).region(region).firestore.document('/{empresaUid}/chat/conversas/{conversaUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO onCreateConversa ##################################');
  const { empresaUid, conversaUid } = context.params;
  const dados = snapshot.data()

  if(dados.hasOwnProperty('entrada'))
  {
    console.log('Msg já contem entrada ')
  }
  else
  {
    const dadosEnviarProcessamento = {
      conversaUid,
      ... dados
    }
    CaixaEntrada.verificarConversaAdd(empresaUid,dadosEnviarProcessamento)
    .then(()=>{
      console.log('Conversa Iniciada com sucesso ')
    })
    .catch(err=>{
      console.log('Falha no processo de criacao da conversa '+err)
    })
  }

  
 

  console.log('############################### FIM onCreateConversa ####################################');
 
});

export const onCreateFilaTrnasferencia = functions.region(region).firestore.document('{empresaUid}/chat/fila_transferencia/{docUid}').onCreate(async (snapshot: any,params: any) =>{
  console.log('############################## INICIO  onCreateFilaTrnasferencia##################################');

  const { docUid } = params.params;
  console.log('Existe uma nova acao '+JSON.stringify(snapshot.data() ))
  const dados = snapshot.data()
  CaixaEntrada.distribuirChamada(dados)
  .then(()=>{


    


    console.log('TRANSFERENCIA ACONTECEU COM SUCESSO ')
  })
  .catch(err=>{
    console.log('########## FALHA NO PROCESSO DE TRANSFERENCIA ('+docUid+')  |'+err)
  })

  console.log('############################## FIM ##################################');
})

export const onUpdateAtendimento = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/atendimento').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const uAtendimento = await Empresa.atendimentoOnUpdate({ empresaUid, ...change.after.data() });
  console.log(uAtendimento);
  console.log('############################### FIM ####################################');
  return uAtendimento;
});

export const onReceiveMessageLara = functions.runWith(runtimeOpts).region(region).firestore.document('lara/{usuarioUid}/dialogos/{mensagemUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO ##################################');
  const { usuarioUid,mensagemUid } = params.params;
  const { textoProcessar,empresaUid,contexto } = snapshot.data();
  const processoIA = await Lara.ProcessarTexto({ empresaUid, data: {id:mensagemUid, textoProcessar,usuarioUid,contexto } })
  console.log(processoIA);
  console.log('############################### FIM ####################################');
  return processoIA;
});

export const onCreateAprendizado = functions.region(region).firestore.document('/{empresaUid}/dados/aprendizado/{aprendizadoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, aprendizadoUid } = context.params;
  const processoAprendizado = await Watson.aprendizadoCreate({ empresaUid, aprendizadoUid, ...snapshot.data() });
  console.log(processoAprendizado);
  console.log('############################### FIM ####################################');
  return processoAprendizado;
});

export const onUpdateAprendizado = functions.region(region).firestore.document('/{empresaUid}/dados/aprendizado/{aprendizadoUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, aprendizadoUid } = context.params;
  const processoAprendizado = await Watson.aprendizadoUpdate({ empresaUid, aprendizadoUid, ...change.after.data() });
  console.log(processoAprendizado);
  console.log('############################### FIM ####################################');
  return processoAprendizado;
});

export const onDeleteAprendizado = functions.region(region).firestore.document('/{empresaUid}/dados/aprendizado/{aprendizadoUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, aprendizadoUid } = context.params;
  const { tipo } = snapshot.data();
  const processoAprendizado = await Watson.aprendizadoDelete({ empresaUid, aprendizadoUid, tipo });
  console.log(processoAprendizado);
  console.log('############################### FIM ####################################');
  return processoAprendizado;
});

export const onCreateAprendizadoExemplo = functions.region(region).firestore.document('/{empresaUid}/dados/aprendizado/exemplos/{aprendizadoUid}/{exemploUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO onCreateAprendizadoExemplo ##################################');
  const { empresaUid, aprendizadoUid, exemploUid } = context.params;
  const { exemplo } = snapshot.data();
  const processoAprendizado = await Watson.aprendizadoExemploCreate({ empresaUid, aprendizadoUid, exemploUid, exemplo });
  console.log(processoAprendizado);
  console.log('############################### FIM ####################################');
  return processoAprendizado;
});

export const onDeleteAprendizadoExemplo = functions.region(region).firestore.document('/{empresaUid}/dados/aprendizado/exemplos/{aprendizadoUid}/{exemploUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, aprendizadoUid, exemploUid } = context.params;
  const { exemplo } = snapshot.data();
  const processoAprendizado = await Watson.aprendizadoExemploDelete({ empresaUid, aprendizadoUid, exemploUid, exemplo });
  console.log(processoAprendizado);
  console.log('############################### FIM ####################################');
  return processoAprendizado;
});



export const onCreateWebhook = functions.region(region).firestore.document('/acionamentos/{acionamentoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { acionamentoUid } = context.params;
  const iProc = await Webhook.webhookCreate({ acionamentoUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateLancamento = functions.region(region).firestore.document('/{empresaUid}/dados/financeiro/boletos/lancamentos/{lancamentoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, lancamentoUid } = context.params;
  const iProc = await Financeiro.lancamentoCreate({ empresaUid, lancamentoUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateBanco = functions.region(region).firestore.document('/{empresaUid}/dados/financeiro/configuracoes/bancos/{bancoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, bancoUid } = context.params;
  const iProc = await Financeiro.bancoCreate({ empresaUid, bancoUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateEncaminhar = functions.region(region).firestore.document('/{empresaUid}/chat/encaminhamento/{encaminhamentoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, encaminhamentoUid } = context.params;
  const iProc = await Chat.encaminharMensagens({ ...{ token:empresaUid, encaminhamentoUid }, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateUser = functions.region(region).firestore.document('/newusers/{newUserUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { newUserUid } = context.params;
  const iProc = await Usuarios.usuarioCreate({ newUserUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onUpdateUser = functions.region(region).firestore.document('/usersupdate/{userUpdateUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { userUpdateUid } = context.params;
  const iProc = await Usuarios.usuarioUpdate({ userUpdateUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onDeleteUser = functions.region(region).firestore.document('/{empresaUid}/dados/usuarios/{usuarioUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, usuarioUid } = context.params;
  const iProc = await Usuarios.usuarioDelete({ empresaUid, usuarioUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onUpdateUsuario = functions.region(region).firestore.document('/{empresaUid}/dados/usuarios/{usuarioUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, usuarioUid } = context.params;
  const iProc = await Usuarios.usuarioOnUpdate({ empresaUid, usuarioUid, before:change.before.data(), after:change.after.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateTransferencia = functions.region(region).firestore.document('/{empresaUid}/chat/transferencia/{transferenciaUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, transferenciaUid } = context.params;
  const iProc = await Chat.transferenciaCreate({ empresaUid, transferenciaUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateFinalizacao = functions.region(region).firestore.document('/{empresaUid}/chat/autofinalizacao/{transferenciaUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, transferenciaUid } = context.params;
  const iProc = await Chat.FinalizacaoDeChamada({ empresaUid, transferenciaUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onUpdateTransferencia = functions.region(region).firestore.document('/{empresaUid}/chat/transferencia/{transferenciaUid}').onUpdate(async (change,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, transferenciaUid } = context.params;
  // const before = change.before.data()  // DataSnapshot before the change
  // const after = change.after.data()  // DataSnapshot after the change
  const iProc = await Chat.transferenciaUpdate({ empresaUid, transferenciaUid, ...change.after.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

//FUNCAO DESCONTINUADA EM 25/09 PARA RETOMADA DE NOVA ROTNA NO ONWRITE
//export const onCreateContato = functions.region(region).firestore.document('/{empresaUid}/chat/contatos/{contatoUid}').onCreate(async (snapshot: any,context: any) => {
//  console.log('############################## INICIO ##################################');
//  const { empresaUid, contatoUid } = context.params;
//  const iProc = await Contatos.contatoCreate({ empresaUid, contatoUid, ...snapshot.data()});
//  console.log(iProc);
//  console.log('############################### FIM ####################################');
//  return iProc;
//});


//export const onUpdateContato = functions.region(region).firestore.document('/{empresaUid}/chat/contatos/{contatoUid}').onUpdate(async (change: any,context: any) => {
//  console.log('############################## INICIO ##################################');
//  const { empresaUid, contatoUid } = context.params;
//  const iProc = await Contatos.contatoOnUpdate({ empresaUid, contatoUid, ...change.after.data()});
//  console.log(iProc);
//  console.log('############################### FIM ####################################');
//  return iProc;
//});

//export const onDeleteContato = functions.region(region).firestore.document('/{empresaUid}/chat/contatos/{contatoUid}').onDelete(async (snapshot: any,context: any) => {
//  console.log('############################## INICIO ##################################');
//  const { empresaUid, contatoUid } = context.params;
//  const iProc = await Contatos.contatoDelete({ empresaUid, contatoUid, ...snapshot.data()});
//  console.log(iProc);
//  console.log('############################### FIM ####################################');
//  return iProc;
//});

export const onUpdateBrain = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/watson/{watsonUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, watsonUid } = context.params;
  const iProc = await Watson.CredentialsOnUpdate({ empresaUid, watsonUid, ...change.after.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onUpdateConversa = functions.runWith({memory:"256MB" }).region(region).firestore.document('/{empresaUid}/chat/conversas/{conversaUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, conversaUid } = context.params;
  const dEmpresa = await Chat.conversaUpdate({ empresaUid, conversaUid, ...change.after.data() });
  console.log(dEmpresa);
  console.log('############################### FIM ####################################');
  return dEmpresa;
});

export const onCreateLista = functions.region(region).firestore.document('/{empresaUid}/chat/listatransmissao/{listaUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, listaUid } = context.params;
  const iProc = await ListaTransmissao.ListaOnCreate({ empresaUid, listaUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateDisparo = functions.region(region).firestore.document('/{empresaUid}/chat/listatransmissao/disparos/{listaUid}/{disparoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, disparoUid } = context.params;
  const iProc = await ListaTransmissao.DisparoOnCreate({ empresaUid, disparoUid, ...snapshot.data()});
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});
export const onUpdateDisparo = functions.region(region).firestore.document('/{empresaUid}/chat/listatransmissao/disparos/{listaUid}/{disparoUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, disparoUid } = context.params;
  const uDisparo = await ListaTransmissao.disparoUpdate({ empresaUid, disparoUid, ...change.after.data() });
  console.log(uDisparo);
  console.log('############################### FIM ####################################');
  return uDisparo;
});

export const onCreateCronProatividade = functions.region(region).firestore.document('/cronproativo/{proativoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { proativoUid } = context.params;
  const iProc = await Watson.cronProatividadeCreate({ proativoUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateCronnaoRespondeu = functions.region(region).firestore.document('/cronnaorespondeu/{naoRespondeuUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { naoRespondeuUid } = context.params;
  const iProc = await Chat.cronNaoRespondeuCreate({ naoRespondeuUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateConversasDistribuicao = functions.region(region).firestore.document('/{empresaUid}/chat/conversasdistribuicao/{conversasDistribuicaoUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, conversasDistribuicaoUid } = context.params;
  const iProc = await Chat.conversasDistribuicaoCreate({ empresaUid, conversasDistribuicaoUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateConversasTransferencia = functions.region(region).firestore.document('/{empresaUid}/chat/conversastransferencia/{conversasTransferenciaUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid, conversasTransferenciaUid } = context.params;
  const iProc = await Chat.conversasTransferenciaCreate({ empresaUid, conversasTransferenciaUid, ...snapshot.data() });
  console.log(iProc);
  console.log('############################### FIM ####################################');
  return iProc;
});

export const onCreateTelegram = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/telegram/{telegramUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const {  ambiente } = snapshot.data();
  const iEmpresa = await Empresa.canalAdd({ empresaUid, op: 1 });
  console.log(iEmpresa);
  const vAtendimento = await Empresa.atendimentoSelect({ empresaUid });
  if(vAtendimento.situacao === 'suc') {
    const uTelegram = await Telegram.webhookSet({ empresaUid,ambiente, ...vAtendimento.dados});
    console.log(uTelegram);
  }
  console.log('############################### FIM ####################################');
  return iEmpresa;
});
export const onDeleteTelegram = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/telegram/{telegramUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const dEmpresa = await Empresa.canalAdd({ empresaUid, op: 0 });
  console.log(dEmpresa);
  console.log('############################### FIM ####################################');
  return dEmpresa;
});
export const onCreateWhatsapp = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/wppchatapi/{whatsappUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const iEmpresa = await Empresa.canalAdd({ empresaUid, op: 1 });
  console.log(iEmpresa);
  console.log('############################### FIM ####################################');
  return iEmpresa;
});
export const onDeleteWhatsapp = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/wppchatapi/{whatsappUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const dEmpresa = await Empresa.canalAdd({ empresaUid, op: 0 });
  console.log(dEmpresa);
  console.log('############################### FIM ####################################');
  return dEmpresa;
});
export const onCreateTwilio = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/twilio/{twilioUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const iEmpresa = await Empresa.canalAdd({ empresaUid, op: 1 });
  console.log(iEmpresa);
  console.log('############################### FIM ####################################');
  return iEmpresa;
});
export const onDeleteTwilio = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/twilio/{twilioUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const dEmpresa = await Empresa.canalAdd({ empresaUid, op: 0 });
  console.log(dEmpresa);
  console.log('############################### FIM ####################################');
  return dEmpresa;
});
export const onCreateFacebook = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/facebook/{facebookUid}').onCreate(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const iEmpresa = await Empresa.canalAdd({ empresaUid, op: 1 });
  console.log(iEmpresa);
  const vEmpresa = await db.collection('EmpControle').where('empresaUid','==',empresaUid).get();
  if(!vEmpresa.empty) {
    const doc = vEmpresa.docs[0];
    await db.collection('EmpControle').doc(doc.id).set({ facebookToken: snapshot.data().token }, { merge: true });
  }
  console.log('############################### FIM ####################################');
  return iEmpresa;
});
export const onDeleteFacebook = functions.region(region).firestore.document('/{empresaUid}/dados/configuracao/chat/facebook/{facebookUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO ##################################');
  const { empresaUid } = context.params;
  const dEmpresa = await Empresa.canalAdd({ empresaUid, op: 0 });
  console.log(dEmpresa);
  console.log('############################### FIM ####################################');
  return dEmpresa;
});


//AÇOES CCOMERCIAIS

//ADICIONAR ESTATISTICA DE COMERCIAL REPRESENTANTE
export const onCreateOrcamento = functions.region(region).firestore.document('/{token}/dados/comercial/{pedidoUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO onCreateOrcamento ##################################');
  
  const { token,pedidoUid } = params.params;
  const {  usuarioUid,usuarioNome,total} = snapshot.data();
  const ProcessarAddEstatistica = await comercial.repAddEstatistiacas({token,data:{pedidoUid,usuarioUid,usuarioNome,total,lead:1}})
  
  
  console.log('############################### FIM ####################################');
  return ProcessarAddEstatistica;
  
});

//ATUALIZANDO TABELA COMERCIAL
export const onUpdateComercial = functions.region(region).firestore.document('/{token}/dados/comercial/{pedidoUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO onUpdateComercial ##################################');
  const { token,pedidoUid } = context.params;
  
  const processoUpdateEstatistica = await comercial.atualizarEstatisticasComerciaisPorOrcamento({token,data:{pedidoUid, newValue: change.after.data(),previousValue: change.before.data() } })
  // Watson.aprendizadoUpdate({ token, estatisticaUid, ...change.after.data() });

  console.log('############################### FIM ####################################');
  return processoUpdateEstatistica;
});

//ATUALIZANDO TABELA DE ESTATISTICAS POR REPRESENTANTE
export const onUpdateComercialEstatisticaRep = functions.region(region).firestore.document('/{token}/dados/comercial_estatistica/{estatisticaUid}').onUpdate(async (change: any,context: any) => {
  console.log('############################## INICIO onUpdateComercialEstatisticaRep ##################################');
  const { token } = context.params;
  const processoUpdateEstatistica = await comercial.atualizarEstatisticaGeral({token})
  // Watson.aprendizadoUpdate({ token, estatisticaUid, ...change.after.data() });

  console.log('############################### FIM ####################################');
  return processoUpdateEstatistica;
});

//ADICIONAR ESTATISTICA DE COMERCIAL GERAL
export const onCreateComercialEstatistica = functions.region(region).firestore.document('/{token}/dados/comercial_estatistica/{estatisticaUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO onCreateComercialEstatistica ##################################');
  
  const { token } = params.params;
  const ProcessarAddEstatistica = await comercial.addEstatisticaGeral({token})
  
  
  console.log('############################### FIM ####################################');
  return ProcessarAddEstatistica;
  
});


//ACAO DE ARQUIVOS TEMPORARIOS
export const onCreateProcTemporario = functions.region(region).firestore.document('/prodTemporario/{documentoUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO onCreateProcTemporario ##################################');
  
  const { documentoUid  } = params.params;
  const {createAt,situacao,url,dados,tipo} = snapshot.data();
  const Proc = await processotemporario.importarContatos({documentoUid,data:{createAt,situacao,url,dados,tipo}})
  
  
  console.log('############################### FIM ####################################');
  return Proc;
  
});


//ACOES DA TODO
export const onCreateToDo = functions.region(region).firestore.document('/{token}/dados/diretorios/{usuarioUid}/toDo/{todoUid}')

.onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO onCreateToDo ##################################');
  const { token,todoUid  } = params.params;
  const data = snapshot.data();

 

  const Proc = await agenda.gerarNotificacao({token,todoUid,data})
  
  
  console.log('############################### FIM ####################################');
  return Proc;
  
});
export const onDeleteToDo = functions.region(region).firestore.document('/{token}/dados/diretorios/{usuarioUid}/toDo/{todoUid}').onDelete(async (snapshot: any,context: any) => {
  console.log('############################## INICIO onDeleteToDo ##################################');

  const { token,todoUid  } = context.params;
  const data = snapshot.data();

  const Proc = await agenda.deleteToDo({token,todoUid,data});
  console.log(Proc);
  console.log('############################### FIM ####################################');
  return Proc;
});




//ACOES DA TODO
export const onCreatePushTest = functions.region(region).firestore.document('/pushtest/{documentoUid}').onCreate(async (snapshot: any,params: any) => {
  console.log('############################## INICIO onCreatePushTest ##################################');
 
  const data = snapshot.data();
  console.log("->"+data.token)


   
  const proc = await  admin.messaging().send(
    {
      token:data.token,
      notification:{
        title:data.title,
        body:data.body,
      
      },
      apns:{
        payload:{
          aps:{
            sound:'default',
            badge:1
          },
    
        }
      }
      
     
    })
    console.log(proc)

  console.log('############################### FIM ####################################');
  return 'Concluido';
  
});