import * as admin from 'firebase-admin';
import { db } from '../index';

import Contatos from './contato';
import Empresa from './empresa';
import Email from './email';

const Usuarios = {
  async usuariosSelect(params: any) {
    const token = params.token;
    const usuarioUid = params.userUid;

    try {
      if(usuarioUid === '') {
        const snapshot = await db.collection(token).doc('dados').collection('usuarios').orderBy('createAt','asc').get();
        if (snapshot.empty) {
          return {situacao:'nocach',code:0,msg:'não existem registros.',dados:[]};
        } else {
          const arr:any[] = [];
          for (const doc of snapshot.docs) {
            const userData = {
              uid: doc.id,
              ...doc.data()
            };
            arr.push(userData);
          };
          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:arr};
        }
      } else {
        const snapshot = await db.collection(token).doc('dados').collection('usuarios').where('userUid','==',usuarioUid).get();
        if (snapshot.empty) {
          return {situacao:'nocach',code:0,msg:'não existem registros.',dados:[]};
        } else {
          const arr:any[] = [];
          // snapshot.forEach(doc => {
          for (const doc of snapshot.docs) {
            const userData = {
              uid: doc.id,
              ...doc.data()
            };

            arr.push(userData);
          };

          return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',dados:arr};
        }
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async pushSelect(params: any) {
    const userUid = params.userUid;

    try {
      const doc:any = await db.collection('users').doc(userUid).collection('configuracoes').doc('push').get();
      if (doc.exists) {
        const { pushtoken } = doc.data();
        return {situacao:'suc',code:0,msg:'Dados recuperados com sucesso.',pushToken:pushtoken};
      } else {
        return {situacao:'err',code:0,msg:'não existem registros.'};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:err.message};
    }
  },

  async usuarioCreate(params: any) {
    try {
      const { empresaUid, userEmail, userNome, empresaNome } = params;

      const vEmpresa = await Empresa.usuarioCheck({ empresaUid });
      if(vEmpresa.situacao === 'suc') {
        
        const userData = {
          uid: '',
          userEmail,
          userNome
        }
        let errorMsg = '';
        //CRIAR USUARIO
        await admin.auth().createUser({
          email: userEmail,
          emailVerified: false,
          password: '123456',
          disabled: false,
          displayName: userNome,
          photoURL:'https://api.assistentelara.com.br/build/img/wpp/default-user-icon.jpg'
        })
        .then(async (userRecord) => {
          console.log(userRecord);
          userData.uid = userRecord.uid;

          //SENDMAIL
          await admin.auth().generatePasswordResetLink(userData.userEmail).then( async link=>{
            await Email.sendMail({ 
              emailsDestino: [userData.userEmail], 
              assunto: `Confirmação de conta Lara`, 
              mensagem: `<b>Olá</b><br><br>Segue link para gerar sua senha: <br><br><a href="${link}">${link}</a>`
            });
          });
        })
        .catch(async (error) => {
          errorMsg += `${error.errorInfo.message} `;
          //SE EXISTIR PEGA O EXISTENTE
          if(error.errorInfo.code === 'auth/email-already-exists') {
            await admin.auth().getUserByEmail(userEmail)
            .then(async (userRecord:any) => {
              // See the UserRecord reference doc for the contents of userRecord.
              console.log(userRecord.toJSON());
              const { uid, email, displayName } = userRecord.toJSON()
  
              userData.uid = uid;
              userData.userEmail = email;
              userData.userNome = displayName;
            })
            .catch(async (error2) => {
              errorMsg += `${error2.erroInfo.message} `;
            });
          }
        });
  
        if(userData.uid !== '') {
  
          try {
            await db.collection('users').doc(userData.uid).collection('empresas').doc(empresaUid).set({ nome:empresaNome, padrao:false });
  
            const corPhotoCheck: any = await Contatos.getRandomColor();
  
            try {
              await db.collection(empresaUid).doc('dados').collection('usuarios').add({ createAt: new Date().getTime(), perfil: 'user', userNome: userData.userNome, userUid: userData.uid, photo: corPhotoCheck, email: userData.userEmail });
  
              const iEmpresa = await Empresa.usuarioAdd({ empresaUid, op: 1 });
              if(iEmpresa.situacao === 'suc') {
                return {situacao:'suc',code:0,msg:'Usuário criado com sucesso.', userData};
              } else {
                return {situacao:'err',code:0,msg:`iEmpresa: ${iEmpresa.msg}`};
              }
              
            } catch(err) {
              return {situacao:'err',code:0,msg:`addUser(2): ${err.message}`};
            }
          } catch(err) {
            return {situacao:'err',code:0,msg:`addUser: ${err.message}`};
          }
        } else {
          return {situacao:'err',code:0,msg:`Falha ao recuperar usuário. ${errorMsg}`};
        }
      } else {
        return {situacao:'err',code:0,msg:`vEmpresa: ${vEmpresa.msg}`};
      }      
    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioCreate: ${err.message}`};
    }
  },

  async usuarioDelete(params: any) {
    try {
      const { empresaUid, usuarioUid, userUid } = params;

      await db.collection(empresaUid).doc('dados').collection('usuarios').doc(usuarioUid).delete();

      try {
        await db.collection('users').doc(userUid).delete();
  
        let sucesso = false;

        //VERIFICAR SE NÂO TEM MAIS VINCULO COM OUTRAS EMPRESAS
        sucesso = true;
        // await admin.auth().deleteUser(userUid)
        // .then(async () => {
        //   sucesso = true;
        // })
        // .catch(async (error) => {
        //   console.log(error);
        // });
        
        if(sucesso) {

          const dEmpresa = await Empresa.usuarioAdd({ empresaUid, op: 0 });
          if(dEmpresa.situacao === 'suc') {
            return {situacao:'suc',code:0,msg:`Deletado com sucesso`};
          } else {
            return {situacao:'err',code:0,msg:`dEmpresa: ${dEmpresa.msg}`};
          }
          
        } else {
          return {situacao:'err',code:0,msg:`Falha ao deletar`};
        }
        
      } catch(err) {
        return {situacao:'err',code:0,msg:`users Delete: ${err.message}`};
      }
    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioDelete: ${err.message}`};
    }
  },

  async usuarioUpdate(params: any) {
    try {
      const { userUid, userNome, userUpdateUid } = params;

      const rootCollection = await db.listCollections();
      for (const doc of rootCollection) {
        const empresaUid = doc.id;
        const vUsurarios = await db.collection(empresaUid).doc('dados').collection('usuarios').where('userUid','==',userUid).get();
        if (!vUsurarios.empty) {
          for (const doc2 of vUsurarios.docs) {
            await db.collection(empresaUid).doc('dados').collection('usuarios').doc(doc2.id).set({userNome: userNome},{merge:true});
          }
        }
      }

      await db.collection('usersupdate').doc(userUpdateUid).delete();
      
      return {situacao:'suc',code:0,msg:`Usuário atualizado com sucesso`};        

    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioDelete: ${err.message}`};
    }
  },

  horarioAtendimentoCheck(params: any) {
    const { atdDom, atdDomHrIni ,atdDomHrFim, atdSeg ,atdSegHrIni, atdSegHrFim, atdTer, atdTerHrIni, atdTerHrFim, atdQua, atdQuaHrIni, atdQuaHrFim, atdQui, atdQuiHrIni, atdQuiHrFim, atdSex, atdSexHrIni, atdSexHrFim, atdSab, atdSabHrIni, atdSabHrFim } = params;

    try {
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
      return {situacao:'err',code:0,msg:`horarioAtendimentoCheck: ${err.message}`};
    }
  },

  async usuarioOnUpdate(params: any) {
    try {
      const { empresaUid } = params;
      const before = params.before;
      const after = params.after;

      if(before.recepcao !== after.recepcao) {

        if(after.recepcao) {
          const vUsers:any = await Usuarios.usuariosSelect({token: empresaUid, userUid: ''});
          if(vUsers.situacao === 'suc') {

            for(const usuario of vUsers.dados) {
              if(usuario.userUid !== after.userUid) {

                
                await db.collection(empresaUid).doc('dados').collection('usuarios').doc(usuario.uid).set({recepcao: false},{merge:true});

              }
            }

            return {situacao:'suc',code:0,msg:`Usuário atualizado com sucesso`};
          } else {
            return {situacao:'err',code:0,msg:`usuariosSelect: ${vUsers.msg}`};
          }
        } else {
          return {situacao:'err',code:0,msg:`recepção: ${after.recepcao}`};
        }
      } else {
        return {situacao:'err',code:0,msg:`nada a fazer`};
      }
      
    } catch(err) {
      return {situacao:'err',code:0,msg:`usuarioOnUpdate: ${err.message}`};
    }
  },
  
}

export default Usuarios;