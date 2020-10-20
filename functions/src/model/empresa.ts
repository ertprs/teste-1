import * as admin from 'firebase-admin';
import { db } from '../index';
import Whatsapp from './whatsapp';
import Telegram from './telegram';
import Twilio from './twilio';

const Empresa = {

  async configGet(params: any) {
    const { empresaUid } = params;

    try {
      const vEmpresa:any = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('empresa').get();
      if (vEmpresa.exists) {
        
        return {situacao:'suc',code:0,msg:'Dados de configuração recuperados.',dados:vEmpresa.data()};
        
      } else {
        return {situacao:'err',code:0,msg:`Falha ao consultar empresa`};
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`configGet: ${err.message}`};
    }
  },

  async consumoGet(params: any) {
    const { empresaUid, date1, date2 } = params;

    try {
      let qtd = 0;
      const vEmpresa = await db.collection(empresaUid).doc('dados').collection('consumo').where('createAt','>',date1).where('createAt','<',date2).get();
      if (!vEmpresa.empty) {

        for(const consumo of vEmpresa.docs) {
          const { codetipo } = consumo.data();
          if(codetipo === 3) qtd++;
        }
      }

      return {situacao:'suc',code:0,msg:'Dados de configuração recuperados.',dados:{ qtd }};
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`configGet: ${err.message}`};
    }
  },

  async checkSaldo(params: any) {
    const { empresaUid } = params;

    try {
      const vEmpresa = await Empresa.configGet({ empresaUid });
      if(vEmpresa.situacao === 'suc') {
        const { qtdSaldo } = vEmpresa.dados;
        
        const dt = new Date();
        const date1 = new Date(dt.getFullYear(), dt.getMonth(), 1).getTime();
        const date2 = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getTime();
        const vConsumo:any = await Empresa.consumoGet({ empresaUid, date1, date2 });
        if(vConsumo.situacao === 'suc') {

          const qtdConsumo = vConsumo.dados.qtd;

          if(qtdConsumo < qtdSaldo) {
            return {situacao:'suc',code:0,msg:'Possui saldo.'};
          } else {
            return {situacao:'nocach',code:0,msg:`Não possui mais saldo`};
          }

        } else {
          return {situacao:'err',code:0,msg:`vConsumo err: ${vConsumo.msg}`};
        }
      } else {
        return {situacao:'err',code:0,msg:`vEmpresa err: ${vEmpresa.msg}`};
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`checkSaldo: ${err.message}`};
    }
  },

  async canalAdd(params: any) {
    const { empresaUid, op } = params;

    try {
      let increment = 1;
      if(op === 0) {
        increment = -1;
      }
      await db.collection(empresaUid).doc('dados').collection('configuracao').doc('empresa').set({ qtdCanais: admin.firestore.FieldValue.increment(increment)},{merge:true});

      return {situacao:'suc',code:0,msg:'Qtd Canais atualizado com sucesso.'};
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async usuarioAdd(params: any) {
    const { empresaUid, op } = params;

    try {
      let increment = 1;
      if(op === 0) {
        increment = -1;
      }
      await db.collection(empresaUid).doc('dados').collection('configuracao').doc('empresa').set({ qtdUsuariosCad: admin.firestore.FieldValue.increment(increment)},{merge:true});

      return {situacao:'suc',code:0,msg:'Qtd Canais atualizado com sucesso.'};
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async usuarioCheck(params: any) {
    const { empresaUid } = params;

    try {
      const vEmpresa:any = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('empresa').get();
      if (vEmpresa.exists) {
        
        const { qtdUsuariosCad, qtdUsuariosLimit } = vEmpresa.data();

        if(qtdUsuariosCad < qtdUsuariosLimit) {
          return {situacao:'suc',code:0,msg:'Cadastro de usuário liberado.'};
        } else {
          return {situacao:'err',code:0,msg:`Quantidade de usuários cadastro no máximo`};
        }
        
      } else {
        return {situacao:'err',code:0,msg:`Falha ao consultar empresa`};
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioCheck: ${err.message}`};
    }
  },

  async atendimentoSelect(params: any) {
    const { empresaUid } = params;

    try {
      const vEmpresa:any = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('atendimento').get();
      if (vEmpresa.exists) {
        
        return {situacao:'suc',code:0,msg:'Dados de atendimento liberado.', dados: {
          uid: vEmpresa.id,
          ...vEmpresa.data()
        } };
        
      } else {
        return {situacao:'err',code:0,msg:`Falha ao consultar empresa`};
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioCheck: ${err.message}`};
    }
  },

  async horarioAtendimentoCheck(params: any) {
    const { empresaUid } = params;

    try {
      const vEmpresa:any = await db.collection(empresaUid).doc('dados').collection('configuracao').doc('atendimento').get();
      if (vEmpresa.exists) {

        return await Empresa.horarioCheck(vEmpresa.data());
        
      } else {
        return {situacao:'err',code:0,msg:`Falha ao consultar empresa`};
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`horarioAtendimentoCheck: ${err.message}`};
    }
  },

  async horarioCheck(params:any) {
    try {
      const { atdDom, atdDomHrIni ,atdDomHrFim, atdSeg ,atdSegHrIni, atdSegHrFim, atdTer, atdTerHrIni, atdTerHrFim, atdQua, atdQuaHrIni, atdQuaHrFim, atdQui, atdQuiHrIni, atdQuiHrFim, atdSex, atdSexHrIni, atdSexHrFim, atdSab, atdSabHrIni, atdSabHrFim } = params;

      const date = new Date()
      const DiaSemanaHoje = date.getDay();
      
      let atdDiaSemana = false;
      let hrIni:any = '';
      let minIni:any = '';
      let hrFim:any = '';
      let minFim:any = '';
      const h = date.getHours() - 3;
      const m = date.getMinutes();
      
      if(DiaSemanaHoje === 0) { //DOMINGO
        atdDiaSemana = atdDom;
        const hrIniArr:any = atdDomHrIni.split(':');
        const hrFimArr:any = atdDomHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      } else if(DiaSemanaHoje === 1) {//SEGUNDA
        atdDiaSemana = atdSeg;
        const hrIniArr:any = atdSegHrIni.split(':');
        const hrFimArr:any = atdSegHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      } else if(DiaSemanaHoje === 2) {//TERCA
        atdDiaSemana = atdTer;
        const hrIniArr:any = atdTerHrIni.split(':');
        const hrFimArr:any = atdTerHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      } else if(DiaSemanaHoje === 3) {//QUARTA
        atdDiaSemana = atdQua;
        const hrIniArr:any = atdQuaHrIni.split(':');
        const hrFimArr:any = atdQuaHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      } else if(DiaSemanaHoje === 4) {//QUINTA
        atdDiaSemana = atdQui;
        const hrIniArr:any = atdQuiHrIni.split(':');
        const hrFimArr:any = atdQuiHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      } else if(DiaSemanaHoje === 5) {//SEXTA
        atdDiaSemana = atdSex;
        const hrIniArr:any = atdSexHrIni.split(':');
        const hrFimArr:any = atdSexHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      } else if(DiaSemanaHoje === 6) {//SABADO
        atdDiaSemana = atdSab;
        const hrIniArr:any = atdSabHrIni.split(':');
        const hrFimArr:any = atdSabHrFim.split(':');
        hrIni = parseInt(hrIniArr.shift());
        minIni = parseInt(hrIniArr.pop());
        hrFim = parseInt(hrFimArr.shift());
        minFim = parseInt(hrFimArr.pop());
      }

      if(atdDiaSemana) {

        if (hrIni <= h && h <= hrFim) {

          if(hrIni === h) {
            if(minIni > m) {
              return {situacao:'nocach',code:0,msg:`Fora do horário de atendimento`};
            }
          }

          if(hrFim === h) {
            if(minFim < m) {
              return {situacao:'nocach',code:0,msg:`Fora do horário de atendimento`};
            }
          }

          return {situacao:'suc',code:0,msg:'Horário liberado.'};
        } else {
          return {situacao:'nocach',code:0,msg:`Fora do horário de atendimento`};
        }
        
      } else {
        return {situacao:'nocach',code:0,msg:`Dia da semana sem atendimento`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`horarioCheck: ${err.message}`};
    }
  },

  async atendimentoOnUpdate(params:any) {
    try {

      const uWhatsapp = await Whatsapp.webhookSet(params);

      const uTelegram = await Telegram.webhookSet(params);

      const uTwilio = await Twilio.webhookSet(params);
      
      return {situacao:'suc',code:0,msg:`Sucesso: ${uWhatsapp.msg} ${uTelegram.msg} ${uTwilio.msg}`};
    } catch(err) {
      return {situacao:'err',code:0,msg:`atendimentoOnUpdate: ${err.message}`};
    }
  }
  
}

export default Empresa;