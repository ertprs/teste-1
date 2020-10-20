import { db } from '../index';

import Apoio from './apoio';

import modelCasos from '../model/mysql/model_ticket'
import CaixaEntrada from './mysql/caixa_entrada';

const nodemailer = require("nodemailer");

const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
const sanitizeHtml = require('sanitize-html');


const Email = {

  async sendMail(params: any) :Promise<any>
  {
      return new Promise((resolve, reject) => {
        try {

          const { emailsDestino, assunto, mensagem, anexos,assinatura } = params;
    
          const emailDestino = emailsDestino;
          

          const msgLaraPower = '<br><br><br><br><br>Esta mesagem é um serviço de Lara Inteligência Artificial. Entregue por <a href="https://www.assistentelara.com.br">Lara</a>'


          const mensagemHtml = mensagem+'<br><br><br><br>'+assinatura+'<br>'+msgLaraPower;
          const mensagemTexto = Apoio.removeHtml(mensagemHtml);


          

          
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'no-reply@assistentelara.com.br',
              pass: 'Lara2018###abcd333',
            },
          });
    
          const messageData:any = {
            from: '"Lara Inteligência Artificial" <no-reply@assistentelara.com.br>', // sender address
            to: emailDestino,//"bar@example.com, baz@example.com",
            subject: assunto, // Subject line
            text: mensagemTexto, // plain text body
            html: mensagemHtml, // html body
          };
          if(anexos !== undefined) {
    
            const attachments = [];
            for(const anexo of anexos) {
    
              const anexoNome = anexo.split('/').pop();
              const filename = anexoNome.split('?').shift();
    
              attachments.push({
                filename,
                path: anexo
              });
            }
    
            messageData.attachments = attachments;
          }
          console.log(JSON.stringify( messageData));
          transporter.sendMail(messageData).then(function(){
            resolve()  
          })
          .catch(function(err:any){
            reject(err)
          })
        
    
          
        } catch(err) {
          reject(err)
        }
      })
   
  },

  async getTemplate(params: any) {
    try {
      const { empresaUid, template } = params;
      
      const snapshot = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('email').collection('template').where('template', '==', template).get();
      if (snapshot.empty) {
        const email = {
          assunto: '',
          corpo: ''
        };

        return { situacao:'suc',code:0,msg:'template padrão',dados: email };
      } else {
        let email = {};
        for (const doc of snapshot.docs) {
          const { assunto, corpo } = doc.data();

          email = {
            assunto,
            corpo
          };
        }

        if(Object.keys(email).length > 0) {
          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:email};
        } else {
          return {situacao:'nocach',code:0,msg:`Conflito ao localizar contato `};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioDelete: ${err.message}`};
    }
  },
  async RecebendoEmail(params:any):Promise<any> {

    return new Promise((resolve, reject) => {
      console.log('Iniciando veficicacao de email ')
      const config = {
          imap: {
              user: 'no-reply@assistentelara.com.br',
              password: 'Lara2018###abcd333',
         
              host: 'imap.gmail.com',
              port: 993,
              tls: true,
              authTimeout: 300000
          }
      }

      console.log('Check conta : '+config.imap.user)


      

      imaps.connect(config).then(function (connection:any) {
          console.log('Processo .... 1 ')
          return connection.openBox('INBOX').then(function () {
              console.log('Processo .... 2 ')
              const searchCriteria = ['UNSEEN'];
              const fetchOptions = {
                  bodies: ['HEADER', 'TEXT',''],
                  markSeen: true //MARCAR COMO LIDO
              };
              
              return connection.search(searchCriteria, fetchOptions).then(function (messages:any) {
                messages.forEach(function (item:any) {
                    var all = _.find(item.parts, { "which": "" })
                    var id = item.attributes.uid;
                    var idHeader = "Imap-Id: "+id+"\r\n";
                    simpleParser(idHeader+all.body, (err:any, mail:any) => {
                        console.log('*****************')
                        console.log(JSON.stringify(mail))
                        console.log('*****************')
                        // access to the whole mail object
                        const assunto = mail.subject
                        const hashtags = Apoio.extractHashtags(assunto);
                        if(hashtags !== null && hashtags.length > 0) {

                          const idTicket = hashtags[0].replace('#','');
                          console.log('Ticket encontrado : '+idTicket)

                          //ADICIONANDO AO TICKET
                          modelCasos.RecuperarIdentificacao(params.empresaUid,idTicket)
                          .then(returnRec=>{
                            const casoUid = returnRec.casoUid

                            //DICIONAR INFORMACOES DE INTERACAO
                            console.log(mail.subject)
                            console.log(mail.html)
                            //ADICIONAR CONTATOR AO TICKET 
                            console.log('SETANDO QUANTIDADE DO TICKET ')
                            db.collection(params.empresaUid).doc('dados').collection('ticket').doc(casoUid).set({
                              qtdA:1
                            },{merge:true})
                            .then(resUpdateQtdA=>{
                              let msg7 = 'Processo de vinculo com ticket funcionou '
                              console.log(msg7)
                              const addInteracoes = {
                                createAt: new Date().getTime(),
                                usuarioUid:99999,
                                usuarioNome:'Lara',
                                es:'e',
                                tipo:'email',
                                descricao:mail.html,
                                anexo:'',
                                privacidade:'private'
                              }
                              db.collection(params.empresaUid).doc('dados').collection('ticket_detalhe').doc(casoUid).collection('interacoes').add(addInteracoes)
                              .then(resAdd=>{
                                  resolve()
                              })
                              .catch(errAdd=>{
                                let msg5 = 'Falha ao adicionar interacoes | '+errAdd
                                console.log(msg5)
                                reject(msg5)
                              })
                            })
                            .catch(errUpdateQtdA=>{
                              let msg6 = 'Falha no processo de atualizacao da contagem de mensagens | '+errUpdateQtdA
                              console.log(msg6)
                              reject(msg6)
                            })
                          
                          })
                          .catch(errRec=>{
                            let msg = 'FAlha no processo de recuperar ident ticket | '+errRec
                            console.log(msg)
                            reject(msg)
                          })


                          
                        }
                        else
                        {

                          console.log('Nao existe ticket selecionado ')
                          let emailRementente = mail.from.value[0].address
                          let nomeRemetente = mail.from.value[0].name

                          let textoDetalhamento = mail.html
                          if(textoDetalhamento == false)
                          {
                            textoDetalhamento = mail.text
                          }
                          else
                          {
                            textoDetalhamento = sanitizeHtml(textoDetalhamento)
                          }

                          //VERIFICAR CADSTRO DE CONTATOS PARA VER SE EXISTE EMAIL AUTORIZADO
                          const dadosContato ={
                            canal:'email',
                            email:emailRementente,
                            nome:nomeRemetente
                          }
                          console.log('###########')
                          console.log(JSON.stringify(dadosContato))
                          console.log('###########')
                          CaixaEntrada.verificarContato(params.empresaUid,dadosContato)
                          .then(resContato=>{
                            //const dadosReturn = { uid,nome, persona:personaDefault, qtd:1}
                            //CRIAR UM NOVO TICKET 
                            
                            modelCasos.AddNovoTicket(params.empresaUid,resContato.uid,resContato.nome,mail.subject,textoDetalhamento)
                            .then(addTicket=>{
                               console.log('Novo ticket adicionado ')
                              resolve()
                            })
                            .catch(errTicket=>{
                              let msg = 'Falha ao criar novo ticket | '+errTicket
                              console.log(msg)
                              reject(msg)
                            })
                                
                          })
                          .catch(errVerificarContatoEmail=>{
                            let msg = 'Falha no processo de de verificacao do contato de e-mail | '+errVerificarContatoEmail
                            console.log(msg)
                            reject(msg)
                          })

                        }


                        
                    });
                });
            });



          });
      });
      



      //FIM AQUI DOS E-MAILS
    })
    


  }

}

export default Email;