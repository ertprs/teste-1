import { db } from '../index';
const comercial = {
    async repAddEstatistiacas(params: any)
    {
        const token = params.token;
        const data = params.data;
        console.log('Iniciando repAddEstatistiacas')
        console.log(data)
        const addEstatisticaRep:any = await db.collection(token).doc('dados').collection('comercial_estatistica').where('usuarioUid','==',data.usuarioUid).get();
        if (!addEstatisticaRep.empty) 
        {
            const arr = addEstatisticaRep.docs;

            let vrNegociandoTotal = 0
            let vrTotalLeads = 0;
            for (const doc of arr) {
                console.log('Encontrato estatistica');
                //EXISTE DADOS RECONTAR
               

                const uidDoc = doc.id
                const dadosRec = doc.data()

                vrNegociandoTotal = vrNegociandoTotal + dadosRec.negociando
                vrTotalLeads = vrTotalLeads + 1;
               
                const dadosEstatistica = {
                    createAt: new Date().getTime(),
                    usuarioUid:data.usuarioUid,
                    usuarioNome:data.usuarioNome,
                    leads:vrTotalLeads,
                    negociando:vrNegociandoTotal+data.total,
                    ganhamos:0,
                    perdemos:0
                   
                }
             
                await db.collection(token).doc('dados').collection('comercial_estatistica').doc(uidDoc).set(dadosEstatistica)
                
               
            }

            

            return {situacao:'suc',code:0,msg:'Atualizado dados  de estatistica para '+data.usuarioNome};
        }
        else
        {
            console.log('Não encontrato estatistica');
            //NAO EXISTE ADICIONAR NOVO 
            const dadosEstatistica = {
                createAt: new Date().getTime(),
                usuarioUid:data.usuarioUid,
                usuarioNome:data.usuarioNome,
                leads:1,
                negociando:0,
                ganhamos:0,
                perdemos:0
            }
            await db.collection(token).doc('dados').collection('comercial_estatistica').add(dadosEstatistica);
            return {situacao:'suc',code:0,msg:'Adicionado nova colecao de estatistica para '+data.usuarioNome};
        }
        
        
       
    },
    
    async addEstatisticaGeral(params:any)
    {
        const token = params.token;
        try
        {
            const addEstatistica:any = await db.collection(token).doc('comercial_estatistica_geral').get();
            if (addEstatistica.exists) 
            {
                console.log('Existe documento de estatistica geral')
                const dados = addEstatistica.data();
                const dadosEstatistica = {
                    createAt: new Date().getTime(),
                    leads:(dados.leads+1),
                    ganhamos:dados.ganhamos,
                    perdemos:dados.perdemos,
                    negociando:dados.negociando
                    
                }
                await db.collection(token).doc('comercial_estatistica_geral').set(dadosEstatistica);

                
                return {situacao:'suc',code:0,msg:'Adicionado nova colecao de estatistica geral '};
            }
            else
            {
                console.log('Não existe documento de estatistica geral')
                const dadosEstatistica = {
                    createAt: new Date().getTime(),
                    leads:1,
                    negociando:0,
                    perdemos:0,
                    ganhamos:0
                    
                }
                await db.collection(token).doc('comercial_estatistica_geral').set(dadosEstatistica);

                
                return {situacao:'suc',code:0,msg:'Adicionado nova colecao de estatistica geral '};
            }
        }
        catch(err)
        {
            console.log(err)
            return {situacao:'err',code:0,msg:'Falha ao consultar comercial_estatistica_geral '+token};
            
        }
        
    },
    async atualizarEstatisticaGeral(params:any)
    {
        const token = params.token;
        try
        {
            const snapshot:any = await db.collection(token).doc('dados').collection('comercial_estatistica').get();
            if (!snapshot.empty) 
            {
             
                let vrLead          = 0;
                let vrNegociando    = 0;
                let vrGanhamos      = 0;
                let vrPerdemos      = 0;
                let qtdItem         = 0;
                for (const doc of snapshot.docs) 
                {   

                    const {leads,negociando,perdemos,ganhamos} = doc.data();

                    console.log('Aqui negociando '+negociando)
                    qtdItem++;
                    vrLead          = vrLead+leads;
                    vrNegociando    = vrNegociando + negociando;
                    vrGanhamos      = vrGanhamos + perdemos;
                    vrPerdemos      = vrPerdemos + ganhamos;
                }
                console.log('Qtd estatisticas encontradas '+qtdItem)
                console.log('vrNegociando '+vrNegociando)

                const dadosEstatistica = {
                    createAt: new Date().getTime(),
                    leads:vrLead,
                    negociando:vrNegociando,
                    perdemos:vrGanhamos,
                    ganhamos:vrPerdemos
                    
                }
                console.log(dadosEstatistica)

                await db.collection(token).doc('comercial_estatistica_geral').set(dadosEstatistica);
            }

            return {situacao:'suc',code:0,msg:'atualizarEstatisticaGeral realizado com sucesso '};
        }
        catch(err)
        {
            console.log(err)
            return {situacao:'err',code:0,msg:'Falha ao consultar atualizarEstatisticaGeral '+token};
        }
        
    },
    async atualizarEstatisticasComerciaisPorOrcamento(params:any)
    {
        const token = params.token;
        const data = params.data;
        
        try
        {

             //console.log('Dados antigos '+data.previousValue.total)
            //console.log('Dados novos '+data.newValue.total)
            const usuarioUid = data.newValue.usuarioUid;
            const usuarioNome = data.newValue.usuarioNome;

            if(data.newValue.situacaoCod === 1)
            {

                //COLETAR PEDIDOS
                let totalNegociandoAcumulado = 0;
                let totalLeads = 0;
                const loopPedidos:any = await db.collection(token).doc('dados').collection('comercial').where('usuarioUid','==',usuarioUid).where('situacaoCod', 'in', [1,2]).get();
                if(!loopPedidos.empty)
                {
                    const arr = loopPedidos.docs;
                    for (const doc of arr) 
                    {
                       
                        const dadosRec = doc.data()
                        totalLeads = totalLeads + 1;
                        totalNegociandoAcumulado = totalNegociandoAcumulado + dadosRec.total
                    }
                    console.log('Total histórico '+totalNegociandoAcumulado)

                   
                }

                 //Atualizar dados de orçamento 
                 const addEstatisticaRep:any = await db.collection(token).doc('dados').collection('comercial_estatistica').where('usuarioUid','==',usuarioUid).get();
                 if (!addEstatisticaRep.empty) 
                 {
                     const arr = addEstatisticaRep.docs;
                     for (const doc of arr) 
                     {
                         console.log('Encontrato estatistica ');
                         //EXISTE DADOS RECONTAR
                     

                         const uidDoc = doc.id
                         const dadosRec = doc.data()

                         const dadosEstatistica = {
                             createAt: new Date().getTime(),
                             usuarioUid,
                             usuarioNome,
                             leads:totalLeads,
                             negociando:totalNegociandoAcumulado,
                             ganhamos:dadosRec.ganhamos,
                             perdemos:dadosRec.perdemos
                         
                         }
                         console.log(dadosEstatistica)
                         console.log('Total negociando  '+totalNegociandoAcumulado)
                         await db.collection(token).doc('dados').collection('comercial_estatistica').doc(uidDoc).set(dadosEstatistica)
                         
                     
                     }
                 
                 }
                 else
                 {
                     console.log('Nao exite colecao do representante')
                 }
               


                
            }
           
            
            return {situacao:'suc',code:0,msg:'atualizarEstatisticasComerciaisPorOrcamento realizado com sucesso '};
        }
        catch(err)
        {
            console.log(err)
            return {situacao:'err',code:0,msg:'Falha ao consultar atualizarEstatisticasComerciaisPorOrcamento '+token};

        }
    }
}
export default comercial;