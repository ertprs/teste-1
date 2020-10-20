import { db } from '../index';
const agenda = {
    async gerarNotificacao(params:any){
        const token = params.token;
        const todoUid = params.todoUid;
        const dados = params.data;
     
        const dadosAlert = {
            dataGeral:0,
            dia:0,
            mes:0,
            ano:0,
            hora:0,
            minuto:0
        }

        

        if(dados.gerarLembrete)
        {
            const dataExplode   = dados.lembreteData.split('-')
            const horaExplode   = dados.lembretehora.split(':')
            
            dadosAlert.dia      = Number(dataExplode[2])
            dadosAlert.mes      = Number(dataExplode[1])
            dadosAlert.ano      = Number(dataExplode[0])
            dadosAlert.hora     = Number(horaExplode[0])
            dadosAlert.minuto   = Number(horaExplode[1])
            const horaAlerta    = new Date(dadosAlert.ano,dadosAlert.mes,dadosAlert.dia,dadosAlert.hora,dadosAlert.minuto,0)
            horaAlerta.setHours(horaAlerta.getHours() +3 )


            dadosAlert.dataGeral= horaAlerta.getTime();
            console.log('Adicionando hora '+dadosAlert.hora +' | '+dadosAlert.dataGeral)

            const infoAgenda = {
                userIdentNot:todoUid,
                createAt : new Date().getTime(),
                comandos:dados.comandos,
                titulo:dados.titulo,
                anotacoes:dados.descriaco,
                tipo:'alert',
                acao_cod:0,
                acao_nome:'',
                acao_robo_cod:0,
                acao_robo_nome:'',
                situacao:1, 
                show_alert:true, 
                alert_visualizado:false,
                Destusuario_uid:dados.usuarioUid, 
                Destusuario_nome:dados.usuarioNome, 
                Remusuario_uid:dados.usuarioUid, 
                Remusuario_nome:dados.usuarioNome, 
                empresa_uid:token,
                empresa_nome:dados.empresaNome,
                dataAlerta:dados.lembreteTIme,
                dataAlerta_dia:dadosAlert.dia,
                dataAlerta_mes:dadosAlert.mes,
                dataAlerta_ano:dadosAlert.ano,
                dataAlerta_hora:dadosAlert.hora,
                dataAlerta_minuto:dadosAlert.minuto,
                alertInWPP:false, 
                alertInEmail:false,
                alertInPlataforma:true 
            }
            //console.log(infoAgenda)

            const add = await db.collection('notificacoes').add(infoAgenda)
            if(add.id)
            {

                //ATUALIZAR DADOS DA TODO
              

                
                const atualizarTodo = await db.collection(token).doc('dados').collection('diretorios').doc(dados.usuarioUid).collection('toDo').doc(todoUid).set({cronUid:add.id}, {merge:true})
                if(atualizarTodo){

                    return {situacao:'suc',code:0,msg:'Cron de lembrete agendado ID : '+add.id};
                }
                else
                {
                    return {situacao:'err',code:0,msg:'Falha ao processar atualizacao da toDo '};
                }
                
            }
            else
            {
                return {situacao:'err',code:0,msg:'Falha ao criar Cron de lembrete'};
            }
        }
        else
        {
            return {situacao:'err',code:0,msg:'Não existe alert de lembrete '};
        }
        
    },
    async deleteToDo(params:any){
        const token = params.token;
        //const todoUid = params.todoUid;
        const dados = params.data;
        if(dados.comandos !== undefined)
        {
            const detComando = JSON.parse(dados.comandos)
            if(detComando.contatoUid  !== undefined)
            {
             
                console.log('Deletar alertas de contato')

                const snapshotLembrete = await db.collection(token).doc('chat').collection('lembretes').where('contatoUid','==',detComando.contatoUid).get()
                if(!snapshotLembrete.empty)
                {
                    for (const doc of snapshotLembrete.docs) {
                        const id = doc.id;
                       
                        const  DeletAlertas = await db.collection(token).doc('chat').collection('lembretes').doc(id).delete()
                        if(DeletAlertas)
                        {
                            console.log('Deletado lembrete com sucesso')
                        }
                        else{
                            console.log('Falha ao deletar lembrete')
                        }
                    }
                }

               
            }
        }

        return {situacao:'suc',code:0,msg:'Cron de lembrete agendado ID : '};
    }
}
export default agenda;