import { db } from '../index';
import Empresa from './empresa';
import Chat from './chat';
import Apoio from './apoio';
import * as admin from 'firebase-admin';

const ListaTransmissao = {

  async listaTransmissaoDisparo(params:any) {
    try {
      const { empresaUid, disparoUid, processado, listaUid, libWpp, libSms, libEmail, mensagem, anexo, acao } = params;

      const { id, nome, origem, canal } = params.contatoData;

      console.log(`Contato: ${nome} ${origem}`);

      const vEmpresa = await Empresa.horarioAtendimentoCheck({ empresaUid });
      if(vEmpresa.situacao === 'suc') {

        const vLista:any = await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).get();
        if(vLista.exists) {

          const { situacao } = vLista.data();

          if(situacao === 3) {

            if(!processado) {

              let agendamentoUid = '';
              let errorMsg = '';
              let wppAguardando = false;
              const wppEnviado = false;
              const wppVisualizado = false;
              let wppErro = false;
              let smsAguardando = false;
              const smsEnviado = false;
              const smsVisualizado = false;
              let smsErro = false;
              const emailAguardando = false;
              const emailEnviado = false;
              const emailVisualizado = false;
              const emailErro = false;

              const dateNow = new Date().getTime();// - 3 * 60 * 60 * 1000;
                
              const msgData: any = {
                mensagem: '',
                anexo: '',
                canal: canal,
                citacao: '',
                legenda: '',
                createAt: dateNow,
                es: 's',
                tipo: 'texto',
                autorNome: 'Lara IA - Transmissão',
                autorUid: '99999',
                contatoNome: nome,
                contatoOrigem: origem,
                contatoUid: id,
                conversaUid: '',
                listaTransmissaoUid: listaUid,
                disparoUid: disparoUid,
                enviadoTag: 1,
                enviadoData: dateNow,
                entregueTag: 0,
                entregueData: dateNow,
                usuarioUid: '99999',
                usuarioNome: 'Lara IA - Transmissão',
                photo: '',
                proativo: true
              };

              if(libWpp && canal.toUpperCase() === 'WHATSAPP') {

                wppAguardando = true;

                const vChat = await Chat.chatAtivoSelect({ token: empresaUid, canal, origem });
                if(vChat.situacao === 'nocach') {

                  //LOGG
                  // $dadosConhecimento = $vBase->dados[0];
                  // $msg_abertura = $dadosConhecimento->resposta;
                  // $id_robo = $dadosConhecimento->robo;

                  // $context = json_decode($context);
                  // $context->operacao_dica = intval($id_robo);
                  // $context->msg_abertura = $msg_abertura;
                  // $context->fluxo_id = $id_fluxo;

                  if(mensagem !== '') {

                    await Apoio.sleep(Math.random() * (10 - 5) + 5);

                    msgData.mensagem = mensagem;

                    const iMsg = await Chat.mensagemAdd({ token:empresaUid, data: msgData });
                    console.log(`Mensagem enviada com sucesso: ${iMsg.msg}`);
                    if(iMsg.situacao === 'suc') {
                      wppAguardando = true;
                    } else {
                      wppErro = true;
                      errorMsg += `| mensagem Whatsapp: ${iMsg.msg}`;
                    }
                  }

                  if(anexo !== '') {

                    await Apoio.sleep(Math.random() * (10 - 5) + 5);

                    msgData.mensagem = '';
                    msgData.anexo = anexo;
                    msgData.tipo = 'anexo';

                    const iMsg = await Chat.mensagemAdd({ token:empresaUid, data: msgData });
                    console.log(`Mensagem enviada com sucesso: ${iMsg.msg}`);
                    if(iMsg.situacao !== 'suc') {
                      wppErro = true;
                      errorMsg += `| anexo: ${iMsg.msg}`;
                    }                    
                  }

                  if(acao !== '') {
                    console.log(`acao não habilitado: ${acao}`);  
                  }

                } else if(vChat.situacao === 'suc') {

                  console.log(`Agendar Mensagem`);
                  const dadosAgendamento = {
                    createAt: new Date().getTime(),
                    contatoUid: id, 
                    contatoNome: nome, 
                    contatoOrigem: origem, 
                    mensagem,
                    anexo,
                    canal,
                    acao,
                    listaUid,
                    disparoUid,
                    tipo: 'listatransmissao',
                    situacao: 2
                  };
                  const iAgendamento = await db.collection(empresaUid).doc('chat').collection('conversasAgendadas').add(dadosAgendamento);
                  agendamentoUid = iAgendamento.id;

                } else {
                  console.log(`vChat err: ${JSON.stringify(vChat)}`);
                }

              } else {
                console.log(`Envio de WPP não habilitado: ${nome} ${origem}`);
              }

              if(libSms && (canal.toUpperCase() === 'WHATSAPP' || canal.toUpperCase() === 'WHATSAPPDIRECT')) {

                smsAguardando = true;
                
                msgData.canal = 'sms';
                msgData.anexo = '';

                if(mensagem !== '') {

                  msgData.mensagem = mensagem;

                  const iMsg = await Chat.mensagemAdd({ token:empresaUid, data: msgData });
                  console.log(`Mensagem enviada com sucesso: ${iMsg.msg}`);
                  if(iMsg.situacao !== 'suc') {
                    smsErro = true;
                    errorMsg += `| mensagem SMS: ${iMsg.msg}`;
                  }                  
                }

                console.log(`Envio de SMS em manutenção: ${nome} ${origem}`);
              } else {
                console.log(`Envio de SMS não habilitado: ${nome} ${origem}`);
              }

              if(libEmail) {
                console.log(`Envio de EMAIL em manutenção: ${nome} ${origem}`);
              } else {
                console.log(`Envio de EMAIL não habilitado: ${nome} ${origem}`);
              }

              const disparoUpdate = {
                wppAguardando,
                wppEnviado,
                wppVisualizado,
                wppErro,
                smsAguardando,
                smsEnviado,
                smsVisualizado,
                smsErro,
                emailAguardando,
                emailEnviado,
                emailVisualizado,
                emailErro,
                errorMsg,
                processado: true
              };
              await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaUid).doc(disparoUid).set(disparoUpdate,{merge:true});
              
              if(agendamentoUid !== '') {
                await db.collection(empresaUid).doc('chat').collection('conversasAgendadas').doc(agendamentoUid).set({logId: disparoUid},{merge:true});
              }
              
              const listaUpdate = {
                disparosEnviados: admin.firestore.FieldValue.increment(1)
              };
              await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).set(listaUpdate,{merge:true});

              return {situacao:'suc',code:0,msg:`Envios feitos`};
            } else {
              return {situacao:'suc',code:0,msg:`Já foi feio envio para : ${nome} ${origem}`};
            }
              
          } else {
            return {situacao:'err',code:0,msg:`Lista não está ativa: (${situacao})`};
          }
        } else {
          return {situacao:'err',code:0,msg:`vLista err: Falha ao recuperar dados da lista`};
        }
      } else {
        return {situacao:'err',code:0,msg:`vEmpresa err: ${vEmpresa.msg}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`listaTransmissaoDisparo err:${err.message}`};
    }
  },

  async disparoUpdate(params: any) {
    try {
      const { empresaUid, listaUid } = params;

      let wppAguardando = 0;
      let wppEnviado = 0;
      let wppVisualizado = 0;
      let wppErro = 0;
      let smsAguardando = 0;
      let smsEnviado = 0;
      let smsVisualizado = 0;
      let smsErro = 0;
      let emailAguardando = 0;
      let emailEnviado = 0;
      let emailVisualizado = 0;
      let emailErro = 0;
      let wppTotal = 0;
      let smsTotal = 0;
      let emailTotal = 0;

      const vDisparos = await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaUid).get();
      if(!vDisparos.empty) {
        for(const disparo of vDisparos.docs) {
          if(disparo.data().wppAguardando) wppAguardando++;
          if(disparo.data().wppEnviado) wppEnviado++;
          if(disparo.data().wppVisualizado) wppVisualizado++;
          if(disparo.data().wppErro) wppErro++;
          if(disparo.data().smsAguardando) smsAguardando++;
          if(disparo.data().smsEnviado) smsEnviado++;
          if(disparo.data().smsVisualizado) smsVisualizado++;
          if(disparo.data().smsErro) smsErro++;
          if(disparo.data().emailAguardando) emailAguardando++;
          if(disparo.data().emailEnviado) emailEnviado++;
          if(disparo.data().emailVisualizado) emailVisualizado++;
          if(disparo.data().emailErro) emailErro++; 
          
          if(disparo.data().wppAguardando || disparo.data().wppEnviado || disparo.data().wppErro) wppTotal++;
          if(disparo.data().smsAguardando || disparo.data().smsEnviado || disparo.data().smsErro) smsTotal++;
          if(disparo.data().emailAguardando || disparo.data().emailEnviado || disparo.data().emailErro) emailTotal++;
        }
      }

      const listaUpdate = {
        wppTotal,
        wppAguardando,
        wppEnviado,
        wppVisualizado,
        wppErro,
        smsTotal,
        smsAguardando,
        smsEnviado,
        smsVisualizado,
        smsErro,
        emailTotal,
        emailAguardando,
        emailEnviado,
        emailVisualizado,
        emailErro
      };
      await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).set(listaUpdate,{merge:true});

      return {situacao:'suc',code:0,msg:`atualizações feitos`};
    } catch(err) {
      return {situacao:'err',code:0,msg:`disparoUpdate err:${err.message}`};
    }
  },

  async ListaOnCreate(params: any): Promise<any> {
    try {
      const { empresaUid, listaUid, disparoImediato, situacao, contatoListaUid } = params;

      // const timeout = setTimeout(() => { 
      //   throw new Error(`Timeout`); 
      // }, 58000); // 2sec buffer off the default 60s timeout

      console.log(disparoImediato);
      if(disparoImediato) {
        console.log(situacao);
        if(situacao === 3) {
          const vLista:any = await db.collection(empresaUid).doc('chat').collection('contatos').doc(contatoListaUid).get();
          if (vLista.exists) {

            const { grupo, subgrupo, cidade, estado, canalFiltro } = vLista.data();

            console.log(`FILTROS: ${grupo} ${subgrupo} ${cidade} ${estado} `);

            const vContato = await db.collection(empresaUid).doc('chat').collection('contatos').get();
            if (!vContato.empty) {

              const arrFinal = [];
              for(const contato of vContato.docs) {
                
                const contatoCanal = contato.data().canal;
                const contatoCidade = contato.data().cidade;
                const contatoEstado = contato.data().estado;
                const contatoGrupo = contato.data().grupo;
                const contatoSubgrupo = contato.data().subgrupo;

                let validCanal = true;
                if(canalFiltro !== 'todos') {
                  if(contatoCanal === undefined || contatoCanal === null) {
                    validCanal = false;
                  } else {
                    if(contatoCanal.toUpperCase() !== canalFiltro.toUpperCase()) {
                      validCanal = false;
                    }
                  }
                } else {
                  if(contatoCanal.toUpperCase() === 'LISTA') validCanal = false;
                }
                
                let validGrupo = true;
                if(grupo !== 'todos') {
                  if(contatoGrupo === undefined || contatoGrupo === null) {
                    validGrupo = false;
                  } else {
                    if(contatoGrupo.toUpperCase() !== grupo.toUpperCase()) {
                      validGrupo = false;
                    }
                  }
                }

                let validSubgrupo = true;
                if(subgrupo !== 'todos') {
                  if(contatoSubgrupo === undefined || contatoSubgrupo === null) {
                    validSubgrupo = false;
                  } else {
                    if(contatoSubgrupo.toUpperCase() !== subgrupo.toUpperCase()) {
                      validSubgrupo = false;
                    }
                  }
                }

                let validCidade = true;
                if(cidade !== 'todos') {
                  if(contatoCidade === undefined || contatoCidade === null) {
                    validCidade = false;
                  } else {
                    if(contatoCidade.toUpperCase() !== cidade.toUpperCase()) {
                      validCidade = false;
                    }
                  }
                }

                let validEstado = true;
                if(estado !== 'todos') {
                  if(contatoEstado === undefined || contatoEstado === null) {
                    validEstado = false;
                  } else {
                    if(contatoEstado.toUpperCase() !== estado.toUpperCase()) {
                      validEstado = false;
                    }
                  }
                }
                
                if(validCanal && validGrupo && validSubgrupo && validCidade && validEstado) {
                  arrFinal.push({ id: contato.id, ...contato.data()});
                }
              }

              console.log(JSON.stringify(arrFinal));
              if(arrFinal.length > 0) {

                await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).set({disparosTotal: arrFinal.length, disparosEnviados: 0 },{merge:true});

                for(const contato of arrFinal) {
                  
                  await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('disparos').collection(listaUid).add({ createAt: new Date().getTime(), ...params, contatoData: contato, processado: false });

                }

              } else {

                await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).set({ situacao: 4, errorMsg: `Não encontrei nenhum contato` },{merge:true});
                return {situacao:'err',code:0,msg:`Não encontrei nenhum contato`}

              }
            } else {
              return {situacao:'err',code:0,msg:`Contato err`}
            }
          } else {
            return {situacao:'err',code:0,msg:`Contato err`}
          }  
        } else {
          return {situacao:'err',code:0,msg:`Situacao err`}
        }
      } else {
        return {situacao:'err',code:0,msg:`Disparo imediato err`}
      }

      // clearTimeout(timeout);

      return {situacao:'suc',code:0,msg:'Processando lista sucesso.'}
    } catch(err) {

      // if(Object.keys(err).length === 0) return ListaTransmissao.ListaOnCreate(params);
      // else 
      return {situacao:'err',code:0,msg:`ListaOnCreate err:${err.message}`}
    }
  },
  
  async DisparoOnCreate(params: any) {
    try {
      const iDisparo = await ListaTransmissao.listaTransmissaoDisparo(params);
      const vLista = await ListaTransmissao.listaFinalizadaCheck(params);
      console.log(JSON.stringify(vLista));
      return iDisparo;
    } catch(err) {
      return {situacao:'err',code:0,msg:`DisparoOnCreate err:${err.message}`}
    }
  },

  async listaFinalizadaCheck(params: any) {
    const { empresaUid, listaUid } = params;

    try {
      console.log(`${empresaUid} - ${listaUid}`);
      const vLista:any = await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).get();
      if (vLista.exists) {

        const { disparosTotal, disparosEnviados } = vLista.data();
        
        if(disparosEnviados === disparosTotal) {
          await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc(listaUid).set({ situacao: 1 },{merge:true});

          return {situacao:'suc',code:0,msg:'Lista finalizada com sucesso.'}
        } else {
          return {situacao:'err',code:0,msg:`Não terminou ainda`}
        }
      } else {
        return {situacao:'err',code:0,msg:`vLista err`}
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`ListaLogInsert err:${err.message}`}
    }
  },

  async ListaLogInsert(params: any) {
    const { empresaUid } = params;
    const logData = params.data;

    try {
      const iLog = await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('relatorios').collection(logData.listaUid).add({ createAt: new Date().getTime(), ...logData});

      return {situacao:'suc',code:0,msg:'Log adicionada com sucesso.',id:iLog.id}
    } catch(err) {
      return {situacao:'err',code:0,msg:`ListaLogInsert err:${err.message}`}
    }
  },

  async ListaLogCheck(params: any) {
    const { empresaUid, listaUid, origem, canal } = params;

    try {
      const vLog = await db.collection(empresaUid).doc('chat').collection('listatransmissao').doc('relatorios').collection(listaUid).where('destino','==',origem).where('canal','==',canal).get();
      if(vLog.empty) {
        return {situacao:'suc',code:0,msg:'Nenhum log pra esse destino sucesso.'}
      } else {
        return {situacao:'err',code:0,msg:`Já existe um log pra esse destino`}
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`ListaLogCheck err:${err.message}`}
    }
  },

}
                                                                         
                                            
export default ListaTransmissao;