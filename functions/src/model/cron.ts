import { db } from '../index';
const cron ={
    async verificarAlertas(params: any) {
        const date = new Date();
        const dateSpan = date.getTime()
        console.log('->TimeSpan: '+date.getTime())
      
      


        const alertSnapShotRef = await db.collection('notificacoes').where("dataAlerta","<=",dateSpan).where('situacao','==',1).where('show_alert','==',true).get()
        
        if(!alertSnapShotRef.empty)
        {
            console.log('Encontrados '+alertSnapShotRef.docs.length)

            for (const doc of alertSnapShotRef.docs) {
                const id = doc.id
                const { titulo,anotacoes,Destusuario_uid,tipo,alertInEmail,alertInWPP,alertInPlataforma } = doc.data()
                console.log('Encontrado')
                const addAlertUser = {
                    createAt:new Date().getTime(),
                    cronUid:id,
                    visualizado:false,
                    titulo:titulo,
                    descricao:anotacoes,
                    acao:'',
                    tipo,
                    alertInEmail,
                    alertInWPP,
                    alertInPlataforma,
                    visualizadoTime:0

                }
             
                const addAlert = await db.collection('users').doc(Destusuario_uid).collection('notificacoes').add(addAlertUser)
                if(addAlert.id)
                {
                    console.log('Criado alerta de usuario')
                    //ATUALIZAR ALERT GERAL
                    await db.collection('notificacoes').doc(id).set({situacao:2},{merge:true})
                    
                }
                else
                {
                    //ERRO
                    console.log('Erro ao criar alerta ')
                    await db.collection('notificacoes').doc(id).set({situacao:3},{merge:true})    
                }
                

            }
        }
        else
        {
            console.log('Não existem registros.')
        }
        
        return {situacao:'suc',code:0,msg:'Processado com sucesso'};
    }
}
export default cron;