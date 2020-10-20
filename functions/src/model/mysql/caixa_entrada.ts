import Watson from '../watson';
import {  db } from '../..';
import * as admin from 'firebase-admin';


const { Sequelize,Op } = require('sequelize');


const sequelize = new Sequelize('lara', 'laracf', 'asdasdasd77766ttghfYYYYrgfVV', {
    host: '10.86.160.3',
    dialect: 'mysql',
    pool: {
        max: 1,
        min: 0,
       
    }
});


const sequelize2 = new Sequelize('lara_01', 'adm_ext', '2F/7+I3o1P72@hpe', {
    host: 'web01-lara.hostmundi.com',
    dialect: 'mysql',
    pool: {
        max: 1,
        min: 0,
       
    }
});

const Conversas  = sequelize.define('conversas',{
    conversaUid:{
        type:Sequelize.STRING
    },
    contatoNome:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.STRING
    },
    contatoUid:{
        type:Sequelize.STRING
    },
    
    empresaUid:{
        type:Sequelize.STRING
    },
    situacao:{
        type:Sequelize.INTEGER
    },
    body:{
        type:Sequelize.TEXT
    }
    

})
const SPAMS = sequelize.define('spams',{
    empresaUid:{
        type:Sequelize.STRING
    },
    contatoEmail:{
        type:Sequelize.STRING
    },
    CreateAt:{
        type:Sequelize.INTEGER
    },
})

const Empresas  = sequelize.define('empresas',{
    empresaUid:{
        type:Sequelize.STRING
    },
    nome:{
        type:Sequelize.STRING
    },
    nomeFantasia:{
        type:Sequelize.STRING
    },
    brainUid:{
        type:Sequelize.STRING
    },
    situacao:{
        type:Sequelize.INTEGER
    },
    qtdContratada:{
        type:Sequelize.INTEGER
    },
    qtdExtra:{
        type:Sequelize.INTEGER
    },
    confiabilidade:{
        type:Sequelize.INTEGER
    },
    body:{
        type:Sequelize.BLOB
    },
    msgTransferencia:{
        type:Sequelize.TEXT
    },
    msgHorarioAtendimento:{
        type:Sequelize.TEXT
    },
    msgBoasVindas:{
        type:Sequelize.TEXT
    }
    

})

const Usuarios  = sequelize.define('usuarios',{
    empresaUid:{
        type:Sequelize.STRING
    },
    usuarioNome:{
        type:Sequelize.STRING
    },
    usuarioUid:{
        type:Sequelize.STRING
    },
    departamento:{
        type:Sequelize.STRING
    },
    sequencia:{
        type:Sequelize.INTEGER
    },
    online:{
        type:Sequelize.INTEGER
    }
    

})

const Contatos  = sequelize.define('contatos',{
    uid:{
        type:Sequelize.STRING
    },
    nome:{
        type:Sequelize.STRING
    },
    origem_wpp:{
        type:Sequelize.STRING
    },
    origem_wppDirerct:{
        type:Sequelize.STRING
    },
    origem_facebook:{
        type:Sequelize.STRING
    },
    origem_email:{
        type:Sequelize.STRING
    },
    origem_telegram:{
        type:Sequelize.STRING
    },
    origem_1:{
        type:Sequelize.STRING
    },
    origem_2:{
        type:Sequelize.STRING
    },
    origem_3:{
        type:Sequelize.STRING
    },
    origem_4:{
        type:Sequelize.STRING
    },
    origem_5:{
        type:Sequelize.STRING
    },
    origem_6:{
        type:Sequelize.STRING
    },
    empresaUid:{
        type:Sequelize.STRING
    },
    situacao:{
        type:Sequelize.INTEGER
    },
    kyc:{
        type:Sequelize.BOOLEAN
    },
    persona:{
        type:Sequelize.STRING
    },
    grupo:{
        type:Sequelize.STRING
    },
    grupoUid:{
        type:Sequelize.STRING
    },
    subgrupo:{
        type:Sequelize.STRING
    },
    subgrupoUid:{
        type:Sequelize.STRING
    },
    usuarioUid:{
        type:Sequelize.STRING
    },
    usuarioNome:{
        type:Sequelize.STRING
    },
    parceiroUid:{
        type:Sequelize.STRING
    },
    parceiroNome:{
        type:Sequelize.STRING
    }


})


const CaixaEntrada = {
    getRandomColor() {
        const color = Math.floor(0x1000000 * Math.random()).toString(16);
        return '#' + ('000000' + color).slice(-6);
    },
    async sqlExecuteBackup(sqlQuery:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
           
                

                console.log(sqlQuery)
                sequelize2.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                    resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
                
                
                })   
           
            
        })
        
    },
    async transmissaoRecuperarContatos(empresaUid:string,transmissaoUid:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
           
            let sqlQuery = "SELECT * FROM "+empresaUid+"_listadetalhes WHERE listaUid like '"+transmissaoUid+"' order by nome "
            console.log(sqlQuery)
            sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
            
            
            })   
        })
           
            
        
        
    },
    async RotinaParaSincronizarContatos(empresaUid:string):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            console.log("Versao 1.0.0")
            Contatos.sync()
            .then(function(){
                db.collection(empresaUid).doc('chat').collection('contatos').get().then(elemContato=>{
                    if(!elemContato.empty)
                    {   
                    
                        let qtdEncontrado = 0;
                        let sqlList:any = []
                        //APAGAR TODOS OS CONTATOS
                        Contatos.destroy(
            
                            {where:{empresaUid}}
                        )
                        .then(function(){
                            console.log('Deletado com sucesso')

                            for (const  dadosContato of elemContato.docs) {

                                qtdEncontrado ++
                                console.log("Processando, "+qtdEncontrado)
                                const id = dadosContato.id
                                const data = dadosContato.data()
                                const  dadosDoContatoFirebase:any = {
                                    id,
                                  
                                    ... data
                                }
                                if(dadosDoContatoFirebase.canal == 'whatsapp')
                                {   

                                    let origemdado = ""
                                    if(dadosDoContatoFirebase.origem_wpp === undefined)
                                    {
                                        origemdado = dadosDoContatoFirebase.origem
                                    }
                                    else
                                    {
                                        origemdado = dadosDoContatoFirebase.origem_wpp
                                    }

                                    let nomeImprimir = dadosDoContatoFirebase.nome
                                    nomeImprimir = nomeImprimir.split("'").join("")
                                    nomeImprimir = nomeImprimir.split("`").join("")


                                    let sqlQuery = "('"+nomeImprimir+"','"+origemdado+"','"+dadosDoContatoFirebase.id+"','"+empresaUid+"',false,'formal','"+dadosDoContatoFirebase.usuarioNome+"','"+dadosDoContatoFirebase.usuarioUid+"',now(),now(),'"+dadosDoContatoFirebase.grupo+"','"+dadosDoContatoFirebase.subgrupo+"','','')"
                                    console.log(sqlQuery)
                                    sqlList.push(sqlQuery)

                                   
                                    
                                    
                                }
                                
                                
        
                            }
                            let sqlExecute = 'INSERT INTO lara.contatos(nome,origem_wpp,uid,empresaUid,kyc,persona,usuarioNome,usuarioUid,createdAt,updatedAt,grupo,subgrupo,grupoUid,subgrupoUid)VALUES'
                            for (const  dadosContato of sqlList) {
                                console.log(dadosContato)
                                sqlExecute = sqlExecute + dadosContato + ","
                            }
                            sqlExecute = sqlExecute.substring(0,sqlExecute.length -1 )


                            console.log('BIGGGGGGGGGGGGGGGGG')
                            console.log(sqlExecute)
                            console.log('END BIGGGGGGGGGGGGGGGGG')

                            sequelize.query(sqlExecute, null, { raw: true }).then(function(resSelect:any){
                                
                            console.log("BIG QUERY EXECUTOU")
                            
                            })   
                           
    
    
                            resolve({qtdEncontrado,sqlExecute,dados:sqlList})


                        })
                        .catch(function(err:any){
                          console.log('falha ao deletar')
                        })



                        

                    }
                })
                .catch(err=>{
                    reject(err)
                })



            })
            .catch(function(erro:any){
                console.log('# Falha ao se conectar ao mysql ')
            })


            
        })
    },

    async listaTransmissaoDetalhe(empresaUid:string,listUid:string,dados:any):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            const LISTADETALHE = sequelize.define(empresaUid+'_listadetalhe',{
                listaUid:{
                    type:Sequelize.STRING
                },
                contatoUid:{
                    type:Sequelize.STRING
                },
                contatoNome:{
                    type:Sequelize.STRING
                },
                contatoWPP:{
                    type:Sequelize.STRING
                },
                contatoSMS:{
                    type:Sequelize.STRING
                },
                contatoEmail:{
                    type:Sequelize.STRING
                },
                envioSituacaoCod:{
                    type:Sequelize.INTEGER
                },
                envioSituacaoNome:{
                    type:Sequelize.STRING
                },
                envioMsg:{
                    type:Sequelize.STRING
                }
            })
            LISTADETALHE.sync()
            .then(function(){
                let sqlList = []
                for (const  dadosDetalhe of dados) {
                    let sqlQuery = "('"+listUid+"','"+dadosDetalhe.uid+"','"+dadosDetalhe.nome+"','"+dadosDetalhe.origem_wpp+"','"+dadosDetalhe.origem_wpp+"','"+dadosDetalhe.origem_email+"','0','Ag. Envio','',now(),now())"
                  
                    sqlList.push(sqlQuery)
                }
                
                //ADICIONAR NOVO
                let sqlExecute = 'INSERT INTO lara.'+empresaUid+'_listadetalhes(listaUid,contatoUid,contatoNome,contatoWPP,contatoSMS,contatoEmail,envioSituacaoCod,envioSituacaoNome,envioMsg,createdAt,updatedAt)VALUES'
                for (const  dadosContato of sqlList) {
                    
                    sqlExecute = sqlExecute + dadosContato + ","
                }
                sqlExecute = sqlExecute.substring(0,sqlExecute.length -1 )
                console.log(sqlExecute)

                console.log('BIGGGGGGGGGGGGGGGGG')
                console.log(sqlExecute)
                console.log('END BIGGGGGGGGGGGGGGGGG')

                sequelize.query(sqlExecute, null, { raw: true }).then(function(resSelect:any){
                    
                    resolve({situacao:'suc',code:0,msg:'Processado com sucesso'})
                
                })
                .catch(function(err:any){
                    console.log('ERRRR    BIGGGGGGGGGGGGGGGGG')
                    console.log(err)
                    console.log('END ERR BIGGGGGGGGGGGGGGGGG')
                    reject({situacao:'err',code:0,msg:'Falha no processo de incluir detalhes da transmissao'})
                })   





                
               
            })
            .catch(function(err:any){
                reject(err)
            })
            
        })
    },

    async sqlExecute(sqlQuery:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
           
                

                console.log(sqlQuery)
                sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                    resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
                
                
                })   
           
            
        })
        
    },
    
    async EnviarContatoLista(empresaUid:string,listaUid:string,dadosMensagem:any,dadosCron:any):Promise<any>
    {

        return new Promise((resolve,reject)=>{
            let sqlQuery = "SELECT * FROM lara."+empresaUid+"_listadetalhes WHERE listaUid like '"+listaUid+"' and situacao = '0' order by contatoNome  "


            console.log(sqlQuery)
            sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){

                if(resSelect.length > 0)
                {
            
                    
                    resSelect.forEach((element:any) => {
                  
                        //const conversaUid = element["conversaUid"]

                        const contatoUid    = element["contatoUid"]
                        const contatoWPP    = element["contatoWPP"]
                        const contatoNome   = element["contatoNome"]
                        const mensagem      = dadosMensagem.mensagem
                        //const anexo         = dadosMensagem.anexo


                        //VERIFICAR SE EXISTE CONVERSA EM ABERTO
                        let sqlQueryConversa = "SELECT * FROM lara.conversas WHERE empresaUid like '"+empresaUid+"' and contatoUid like '"+contatoUid+"' "
                        sequelize.query(sqlQueryConversa, null, { raw: true }).then(function(resSelectConversa:any){
                            if(resSelectConversa.length > 0)
                            {
                                //ADICIONAR PARA ENVIO NO FUTURO
                                const dadosAdd = {
                                    listaUid,
                                    contatoUid,
                                    dadosMensagem,
                                    dadosCron
                                }
                                db.collection(empresaUid).doc('chat').collection('lista_espera').add(dadosAdd)
                                .then(resColocarNaespera=>{

                                    //
                                    resolve()

                                })
                                .catch(errColocarNaEspera=>{
                                    
                                    //
                                    reject(errColocarNaEspera)

                                })
                            }
                            else
                            {
                                //ENVIAR AGORA

                                // /EDsoMmEc2C4WQPevGnyu/chat/conversas/4qBOlMHAdQxtN8YsVpZw/mensagens/JxkAeRI6kZpAQdCbtNun
                                const dadosMensagemTextoSend = {
                                    anexo:'',
                                    autorNome:'Lara - Lista |'+dadosMensagem.nome,
                                    autorUid:'99999',
                                    canal:'whatsapp',
                                    citacao:'',
                                    contatoNome,
                                    contatoOrigem:contatoWPP,
                                    contatoUid,
                                    conversaUid:'',
                                    createAt:new Date().getTime(),
                                    entregueData : null,
                                    entregueTag : 0,
                                    enviadoData : new Date().getTime(),
                                    enviadoTag : 1,
                                    es : 's',
                                    usuarioNome : 'Lara - Lista Transmissao',
                                    usuarioUid : '99999',
                                    lidoTag : 2,
                                    lidoData : null,
                                    mensagem
                                }
                                db.collection(empresaUid).doc('chat').collection('conversas').doc(contatoUid).collection('mensagens').add(dadosMensagemTextoSend)
                                .then(()=>{
                                    console.log('Entregue mensagtem para '+contatoWPP)
                                    resolve()
                                })
                                .catch(err=>{
                                    let msg = 'Falha no processo de colocar na caixa de envio para o cliente '
                                    console.log(msg)
                                    reject(msg)

                                })

                            }
                        }).catch(function(err:any){
                            let msg2 = err
                            console.log(msg2)
                            reject(msg2)
                        })

                        
                       
                    
                    });
                }
                else
                {
                    reject('Nao existem contatos prontos para envio')
                }

            
            
            
            })
            .catch(function(err:any){
                let msg2 = err
                console.log(msg2)
                reject(msg2)
            })   
        })
        
        
    },
    async GerenciarParceirosBuscarPor(empresaUid:string,buscarpor:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
            const PARCEIROS = sequelize.define(empresaUid+'_parceiros',{
                razaoSocial:{
                    type:Sequelize.STRING
                },
                nomeFantasia:{
                    type:Sequelize.STRING
                },
                uid:{
                    type:Sequelize.STRING
                },
                documento:{
                    type:Sequelize.STRING
                }
            })
            PARCEIROS.sync()
            .then(function(){
                let sqlQuery = "SELECT * FROM lara."+empresaUid+"_parceiros WHERE  ( documento like '"+buscarpor+"' or razaoSocial like '%"+buscarpor+"%' or    nomeFantasia like '%"+buscarpor+"%'  ) ORDER BY razaoSocial LIMIT 0,10"


                console.log(sqlQuery)
                sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                    resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
                
                
                })   
            })
            .catch(function(err:any){
                reject(err)
            })
            
        })
        
    },
    async GerenciarParceirosVerificarSeExiste(empresaUid:string,documento:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
            const PARCEIROS = sequelize.define(empresaUid+'_parceiros',{
                razaoSocial:{
                    type:Sequelize.STRING
                },
                nomeFantasia:{
                    type:Sequelize.STRING
                },
                uid:{
                    type:Sequelize.STRING
                },
                documento:{
                    type:Sequelize.STRING
                }
            })
            PARCEIROS.sync()
            .then(function(){
                let sqlQuery = "SELECT * FROM lara."+empresaUid+"_parceiros WHERE documento like '"+documento+"' LIMIT 0,10"


                console.log(sqlQuery)
                sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                    resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
                
                
                })   
            })
            .catch(function(err:any){
                reject(err)
            })
            
        })
        
    },
    async GerenciarParceirosDelete(empresaUid:string,parceuriUid:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
            const PARCEIROS = sequelize.define(empresaUid+'_parceiros',{
                razaoSocial:{
                    type:Sequelize.STRING
                },
                nomeFantasia:{
                    type:Sequelize.STRING
                },
                uid:{
                    type:Sequelize.STRING
                },
                documento:{
                    type:Sequelize.STRING
                }
            })
            PARCEIROS.sync()
            .then(function(){
                PARCEIROS.destroy(
            
                    {where:{uid:parceuriUid}}
                )
                .then(function(){
                    resolve()
                })
                .catch(function(err:any){
                    reject(err)
                })
            })
            .catch(function(err:any){
                reject(err)
            })
            
        })
        
    },
    async GerenciarParceiros(empresaUid:string,dados:any):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            const PARCEIROS = sequelize.define(empresaUid+'_parceiros',{
                razaoSocial:{
                    type:Sequelize.STRING
                },
                nomeFantasia:{
                    type:Sequelize.STRING
                },
                uid:{
                    type:Sequelize.STRING
                },
                documento:{
                    type:Sequelize.STRING
                }
            })
            PARCEIROS.sync()
            .then(function(){
                if(dados.sincronizado == 0)
                {
                    //ADICIONAR NOVO
                    PARCEIROS.create({
                        razaoSocial:dados.razaoSocial,
                        nomeFantasia:dados.nomeFantasia,
                        documento:dados.documento,
                        uid:dados.id
        
                    })
                    .then(function(){
                        resolve()
                    })
                    .catch(function(err:any){
                        let msg = 'Falha ao criar conversa | '+err
                        reject(msg)
                    })
                }
                else if(dados.sincronizado == 1)
                {
                    //ATUALIZAR
                    PARCEIROS.update(
                        {
                            razaoSocial:dados.razaoSocial,
                            nomeFantasia:dados.nomeFantasia
                        },
                        {where:{uid:dados.id}}
                    ) 
                    .then(function(){
                        resolve()



                      
                    })
                    .catch(function(errUpSequencia:any){
                        let msg = 'Problema ao atualizar ordem de sequencia no mysql | '+errUpSequencia
                        console.log(msg)
                        reject(msg)
                    })
                }
                else
                {
                    reject('Não existe identificacao de sincronismo')
                }
            })
            .catch(function(err:any){
                reject(err)
            })
            
        })
    },
    async DetermarUsuarioDistribuicao(empresaUid:string,departamento:string):Promise<any>
    {


       

        console.log('Distribuir para '+departamento)
        return new Promise((resolve,reject)=>{
            Usuarios.sync()
                .then(function(){
                    
                    Usuarios.findAll({
                        where:{
                            [Op.and]: [
                                {online:1},
                                {empresaUid:empresaUid},
                                {departamento:'atendimento'}
                            ]
                            
                           },
                        limit:1,
                        order:[
                            ['sequencia','ASC']
                        ]
                    })
                    .then(function(SelectUsuarios:any){
                        if(SelectUsuarios.length > 0)
                        {
                            SelectUsuarios.forEach((element:any) => {
                                const usuarioUid    = element["usuarioUid"]
                                const usuarioNome   = element["usuarioNome"]
                                const sequencia     = Number(element["sequencia"])+1
                                const id            = element["id"]
                                //FAZER A TRANSFERENCIA
                                Usuarios.update(
                                    {sequencia},
                                    {where:{id:id}}
                                ) 
                                .then(function(){
                                    console.log('Determinado usuario ')

                                    const retornoDados = {
                                        usuarioNome,
                                        usuarioUid
                                    }
                                    resolve(retornoDados)



                                  
                                })
                                .catch(function(errUpSequencia:any){
                                    let msg = 'Problema ao atualizar ordem de sequencia no mysql | '+errUpSequencia
                                    console.log(msg)
                                    reject(msg)
                                })
                            })
                        }
                        else
                        {
                            let msg = 'Nao existem usuarios definidos'
                            console.log(msg)
                            reject(msg)
                        }
    
                    })
                    .catch(function(errSelect:any){
                        let msg = 'Falha ao fazer select de usuarios | '+errSelect
                        console.log(msg)
                        reject(msg)
                    })
    
                    
                })
                .catch(function(err:any){
                    let msg = 'Falha ao se conectar a tabela de usuarios | '+err
                    console.log(msg)
                    reject(msg)
                })
        })
    },
    async ConversasLiveChat(empresaUid:string,conversaUid:string):Promise<any>
    {   
        console.log('COlocando conversa em liveChat')
        return new Promise((resolve, reject) => {
            console.log('Atualizando status de conversa para empresa '+empresaUid)
            Conversas.update(
                {situacao:2},
                {where:{conversaUid}}
              )
              .then(function(){
                console.log('++++++++++++++++++++++++++++ Conversa virou live chat  ++++++++++++++++++++++++++++ ')
                resolve()
              
              })
              .catch(function(errUpdate:any){
                let msg = 'Falha ao atualizar conversa para live  | '+errUpdate
                console.log(msg)
                reject(msg)
              })
        })
    },
    async tratarRobo(dadosWatson:any,dadosOrigem:any,enviarMensagemResponse?:boolean):Promise<any>
    {
        console.log('[***********] Processo robo start ')
        console.log(JSON.stringify(dadosWatson))
        console.log(JSON.stringify(dadosOrigem))
      return new Promise((resolve, reject) => {
        console.log('[***********] Processo robo start (1) ')
        const context           = dadosWatson.context;
        const operacao_nome     = context.operacao_nome
        if(operacao_nome == "46") // TRANSFERIR ATENDIMENTO
        {
            console.log('[***********] Processo robo start  - Transferencia ')
            console.log('Transferir chamada ')
            Conversas.update(
              {situacao:2},
              {where:{conversaUid:dadosOrigem.dadosFluxo.conversaUid}}
            )
            .then(function(){
              console.log('++++++++++++++++++++++++++++ Conversa virou live chat  ++++++++++++++++++++++++++++ '+dadosOrigem.empresaUid)
              db.collection(dadosOrigem.empresaUid).doc('chat').collection('fila_transferencia').add(dadosOrigem)
              .then((resAdd)=>{
                console.log('++++++++++++++++++++++++++++ AGUARDAR DISTRIBUICAO   ++++++++++++++++++++++++++++ '+resAdd.id)

                //MENSAGEMS AO CLIENTE 

                //ADICIONAR MENSAGEM DE ENTRADA 

                if(enviarMensagemResponse !=false)
                {

                  
               
            
                

                    const msgSaidaTransf = {
                        contatoUid:dadosOrigem.dadosFluxo.contatoUid,
                        autorNome:dadosOrigem.dadosFluxo.contatoNome,
                        autorUid:dadosOrigem.dadosFluxo.origemUid,
                        canal:dadosOrigem.dadosFluxo.canal,
                        contatoOrigem:dadosOrigem.dadosFluxo.origemUid,
                        time:new Date().getTime(),
                        es:'s',
                        idMensagem:0,
                        mensagem:dadosOrigem.dadosEmpresa.msgTransferencia,
                        tipo:'texto',
                        anexo:'',
                        citacao:'',
                        conversaUid:'',
                        contatoNome:''
      
                      }
                      console.log(JSON.stringify(msgSaidaTransf))
                      CaixaEntrada.addMensagem(dadosOrigem.empresaUid,msgSaidaTransf)
                      .then(()=>{
                        //CONTADOR DE GRAVACAO
                        console.log('[****] FOi adicionado mensagem de entrada aos arquivos (3)')
                        resolve()
                        
                      })
                      .catch(err=>{
                          let msgProc = 'Falha ao adicionar mensagem de entrada no firebase (10) '+err
                        console.log(msgProc)
                       
                      })
                }
                else{
                    //TRANSFERENCIAS NO SISTEMA FOI FEITA, MAS NAO FOI ENVIADO MENSAGEM DE INFORMACAO PARA O CHAMADOR
                    resolve()
                }


                  



                
              })
              .catch(errAddTransfer=>{
                let msg = 'Falha ao adicionar na fila de transmissao '+errAddTransfer;
                console.log(msg)
                reject(msg)
              })
            })
            .catch(function(errUpdate:any){
              let msg = 'Falha ao atualizar conversa para live  | '+errUpdate
              console.log(msg)
              reject(msg)
            })
        }
        else if( operacao_nome == "10001") // CRIAR TICKET DE ATENDIMENTO..
        {
            console.log('RObo de ticket ')
        }
        else
        {
            console.log(JSON.stringify(dadosWatson))
            console.log('[***********] Processo robo nao informado '+operacao_nome)
        }

      })
    },
    async FinalizarConversa(conversaUid:string):Promise<any>
    {   
        return new Promise((resolve, reject) => {
            Conversas.destroy(
            
                {where:{conversaUid:conversaUid}}
            )
            .then(function(){
                resolve()
            })
            .catch(function(err:any){
                reject(err)
            })
        })
        
    },
    async distribuirChamada(dados:any):Promise<any>{
        return new Promise((resolve, reject) => {

            




            if(dados.dadosFluxo.hasOwnProperty('usuarioUid'))
            {
                //VERIFICAR SE JA EXISTE USUARIO SETADO PARA TRANSFERENCIA
                const infoTransferencia = 'Transferência automática de LARA para '+dados.dadosFluxo.usuarioNome+' existe uma referência/caso para transferencia.';
                const msgEntradaAdd = {
                    contatoUid:dados.dadosFluxo.contatoUid,
                    autorNome:dados.dadosFluxo.contatoNome,
                    autorUid:dados.dadosFluxo.origemUid,
                    canal:dados.dadosFluxo.canal,
                    contatoOrigem:dados.dadosFluxo.contatoUid,
                    time:new Date().getTime(),
                    es:'t',
                    idMensagem:0,
                    mensagem:infoTransferencia,
                    tipo:'info',
                    anexo:'',
                    citacao:'',
                    conversaUid:'',
                    contatoNome:''            
                }
                CaixaEntrada.addMensagem(dados.empresaUid,msgEntradaAdd)
                .then(()=>{


                    //ADD DETALHE DE CONTATO NO TICKET

                    db.collection(dados.empresaUid).doc('dados').collection('ticket').doc(dados.dadosFluxo.casoUid).set({qtdA:admin.firestore.FieldValue.increment(1)},{merge:true})
                    .then(()=>{
                        //ADICIONAR DETALHES DA CHAMADA
                        const dadosAddDetalhe = {
                            createAt: new Date().getTime(),
                            usuarioUid:99999,
                            usuarioNome:'Lara',
                            es:'e',
                            tipo:'contato',
                            descricao:dados.dadosMensagem.mensagem,
                            anexo:dados.dadosMensagem.anexo,
                            privacidade:'private'
                        }
                        db.collection(dados.empresaUid).doc('dados').collection('ticket_detalhe').doc(dados.dadosFluxo.casoUid).collection('interacoes').add(dadosAddDetalhe)
                        .catch(errAddDetalhe=>{
                            console.log('Falha ao adicionar detalhamento no ticket '+errAddDetalhe)
                        })
                    })
                    .catch(errInfoCaso=>{
                        console.log('Falha no processo de adicionar informacoes ao ticket ')
                    })

                    //AJUSTAR DADOS DA CONVERSA
                    db.collection(dados.empresaUid).doc('chat').collection('conversas').doc(dados.dadosFluxo.conversaUid).set({
                        situacao:2,
                        qtdA:1,
                        usuarioUid:dados.dadosFluxo.usuarioUid,
                        usuarioNome:dados.dadosFluxo.usuarioNome,
                        casoUid:dados.dadosFluxo.casoUid
                    },{merge:true})
                    .catch(errAjustConversa=>{
                        console.log('Falha ao fazer ajustes na conversa ')
                    })


                    //CONTADOR DE GRAVACAO
                    resolve({usuarioUid:dados.dadosFluxo.usuarioUid,usuarioNome:dados.dadosFluxo.usuarioNome})
                })
                .catch(err=>{
                    let msgRet = 'Falha ao adicionar mensagem de info na conversa | '+err;
                    console.log(msgRet)
                    reject(err)
                })


                
            }
            else
            {
                console.log('Iniciar consulta de usuarios para empresa '+dados.empresaUid)
                Usuarios.sync()
                .then(function(){
                    
                    Usuarios.findAll({
                        where:{
                            [Op.and]: [
                                {online:1},
                                {empresaUid:dados.empresaUid},
                                {departamento:'atendimento'}
                            ]
                            
                           },
                        limit:1,
                        order:[
                            ['sequencia','ASC']
                        ]
                    })
                    .then(function(SelectUsuarios:any){
                        

                        if(SelectUsuarios.length > 0)
                        {
                            SelectUsuarios.forEach((element:any) => {
                                const usuarioUid    = element["usuarioUid"]
                                const usuarioNome   = element["usuarioNome"]
                                const sequencia     = Number(element["sequencia"])+1
                                const id            = element["id"]
                                //FAZER A TRANSFERENCIA
                                db.collection(dados.empresaUid).doc('chat').collection('conversas').doc(dados.dadosFluxo.conversaUid).set({
                                    situacao:2,
                                    qtdA:1,
                                    usuarioUid,
                                    usuarioNome
                                },{merge:true})
                                .then(()=>{
                                    //UPDATE SEQUENCIA DO USUARIO
                                    Usuarios.sync()
                                    .then(function(){
                                        Usuarios.update(
                                            {sequencia},
                                            {where:{id:id}}
                                        ) 
                                        .then(function(){
                                            console.log('A distribuicao foi feita com sucesso (2)  '+dados.dadosFluxo.origemUid)

                                            const infoTransferencia = 'Transferência automática de LARA para '+usuarioNome+' critério de distribuição';

                                          

                                            const msgEntradaAdd = {
                                                contatoUid:dados.dadosFluxo.contatoUid,
                                                autorNome:dados.dadosFluxo.contatoNome,
                                                autorUid:dados.dadosFluxo.origemUid,
                                                canal:dados.dadosFluxo.canal,
                                                contatoOrigem:dados.dadosFluxo.contatoUid,
                                                time:new Date().getTime(),
                                                es:'t',
                                                idMensagem:0,
                                                mensagem:infoTransferencia,
                                                tipo:'info',
                                                anexo:'',
                                                citacao:'',
                                                conversaUid:'',
                                                contatoNome:'',  
                                                                                
                                            }
                                            CaixaEntrada.addMensagem(dados.empresaUid,msgEntradaAdd)
                                            .then(()=>{
                                                //CONTADOR DE GRAVACAO
                                                resolve({usuarioUid,usuarioNome})
                                            })
                                            .catch(err=>{
                                                let msgRet = 'Falha ao adicionar mensagem de info na conversa | '+err;
                                                console.log(msgRet)
                                                reject(err)
                                            })



                                          
                                        })
                                        .catch(function(errUpSequencia:any){
                                            let msg = 'Problema ao atualizar ordem de sequencia no mysql | '+errUpSequencia
                                            console.log(msg)
                                            reject(msg)
                                        })
                                    })
                                    .catch((errTransfer:any)=>{
                                        let msg = 'Falha ao atualizar processo de transferencia | '+errTransfer
                                        console.log(msg)
                                        reject(msg)
                                    })
    
                                })
                                .catch(errUpConversaF=>{
                                    let msg = 'Problema ao atualizar situacao na conversa firebase | '+errUpConversaF
                                    console.log(msg)
                                    reject(msg)
                                })
                            })
                        }
                        else
                        {
                            console.log('('+dados.empresaUid+')  ####### NAO EXISTE USUARIO ONLINE ########### ')
                            db.collection(dados.empresaUid).doc('dados').collection('configuracao').doc('atendimento').get()
                            .then(resConfAtendimento=>{
                                if(resConfAtendimento.exists)
                                {
                                    console.log('('+dados.empresaUid+') ####### NAO EXISTE USUARIO ONLINE ###########  EXISTEM DADOS ')
                                    const dadosConfAtendimento = <any>resConfAtendimento.data()
                                    if(dadosConfAtendimento.usuarioChaveUid === undefined)
                                    {
                                        let msg = '('+dados.empresaUid+') Nao existe um usuario chave configurado '+dadosConfAtendimento.usuarioChaveUid 
                                        console.log(msg)
                                        reject(msg)
                                    }
                                    else
                                    {
                                        console.log('('+dados.empresaUid+') ####### NAO EXISTE USUARIO ONLINE ###########  INICIANDO PROCESSO ')
                                        //SETAR OS DADOS DO USUARIO PADRAO 
                                        const usuarioUid    = dadosConfAtendimento.usuarioChaveUid
                                        const usuarioNome   = dadosConfAtendimento.usuarioChaveNome
                                        
                                    
                                        //FAZER A TRANSFERENCIA
                                        db.collection(dados.empresaUid).doc('chat').collection('conversas').doc(dados.dadosFluxo.conversaUid).set({
                                            situacao:2,
                                            qtdA:1,
                                            usuarioUid,
                                            usuarioNome
                                        },{merge:true})
                                        .then(()=>  
                                        {
                                            
                                            
                                            console.log('A distribuicao foi feita com sucesso (2)  '+dados.dadosFluxo.origemUid)

                                            const infoTransferencia = 'Transferência automática de LARA para '+usuarioNome+' critério de atendente chave';

                                            

                                            const msgEntradaAdd = {
                                                contatoUid:dados.dadosFluxo.contatoUid,
                                                autorNome:dados.dadosFluxo.contatoNome,
                                                autorUid:dados.dadosFluxo.origemUid,
                                                canal:dados.dadosFluxo.canal,
                                                contatoOrigem:dados.dadosFluxo.contatoUid,
                                                time:new Date().getTime(),
                                                es:'t',
                                                idMensagem:0,
                                                mensagem:infoTransferencia,
                                                tipo:'info',
                                                anexo:'',
                                                citacao:'',
                                                conversaUid:'',
                                                contatoNome:'',  
                                                                                
                                            }
                                            CaixaEntrada.addMensagem(dados.empresaUid,msgEntradaAdd)
                                            .then(()=>{
                                                //CONTADOR DE GRAVACAO
                                                resolve({usuarioUid,usuarioNome})
                                            })
                                            .catch(err=>{
                                                let msgRet = 'Falha ao adicionar mensagem de info na conversa | '+err;
                                                console.log(msgRet)
                                                reject(err)
                                            })



                                                    
                                                
                                            

                                        })
                                        .catch(errUpConversaF=>{
                                            let msg = 'Problema ao atualizar situacao na conversa firebase | '+errUpConversaF
                                            console.log(msg)
                                            reject(msg)
                                        })
                                    }
                                   
                        
                                }
                                else
                                {

                                    let msg = "Nao existe um usuario padrao de escape"
                                    console.log('####### NAO EXISTE USUARIO ONLINE ########### '+msg)
                                    console.log(msg)
                                    reject(msg)
                                }
                            })
                            .catch(errCOnf=>{
                                let msg = 'Falha ao resgatar configuracoes do usuario | '+errCOnf
                                console.log('####### NAO EXISTE USUARIO ONLINE ########### '+msg)
                                console.log(msg)
                                reject(msg)
                            })
                            
                        }
    
                    })
                    .catch(function(errSelect:any){
                        let msg = 'Falha ao fazer select de usuarios | '+errSelect+' - '+dados.dadosFluxo.conversaUid
                        console.log(msg)
                        reject(msg)
                    })
    
                    
                })
                .catch(function(err:any){
                    let msg = 'Falha ao se conectar a tabela de usuarios | '+err
                    console.log(msg)
                    reject(msg)
                })
            }

           
        })
    },
    async verificarConversaAdd(empresaUid:string,dados:any):Promise<any>
    {
        return new Promise((resolve,reject)=>{

            Conversas.sync()
                .then(function(){
                    Conversas.create({
                        conversaUid:dados.conversaUid,
                        contatoNome:dados.contatoNome,
                        createAt:dados.createAt,
                        contatoUid:dados.contatoUid,
                        empresaUid,
                        situacao:2,
                        body: ''
        
                    })
                    .then(function(){
                        resolve()
                    })
                    .catch(function(err:any){
                        let msg = 'Falha ao criar conversa | '+err
                        reject(msg)
                    })
                })
                .catch(function(err:any){
                    let msg = 'Falha ao se conectar a conversa | '+err
                    reject(msg)
                })
           
        })
    },
    async verificarConversa(empresaUid:any,dados:any):Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            sequelize.authenticate().then(function(){
                //SETAR TABELA DE CONTATOS
                
                Conversas.sync()
                .then(function(){
                    
                 
                    //VERIFICAR SE JA EXISTE
                    Conversas.findAll({
                        where:{
                            [Op.and]: [
                                {contatoUid:dados.contatoUid},
                                {empresaUid}
                            ],
                            [Op.or]: [
                                {situacao:1},
                                {situacao:2}
                            ]
                            
                        },
                        limit:1
                    })
                    .then(function(resSelect:any){
                        if(resSelect.length > 0)
                        {
                            console.log(JSON.stringify(resSelect) )
                            
                            resSelect.forEach((element:any) => {
                                console.log(JSON.stringify(element))
                                const conversaUid = element["conversaUid"]
                                
                                const situacao    = element["situacao"]
                                const dadosReturn = {
                                    conversaUid,
                                    qtd:0,
                                    situacao}
                                console.log('*** Conversa identificada  '+JSON.stringify(dadosReturn))
                                resolve(dadosReturn)  
                            });


                            
                        }
                        else
                        {
                            const uid               = empresaUid+'_'+ Math.random().toString(36).substr(2, 20)
                            const contatoNome       = dados.contatoNome
                            const situacao          = dados.situacao
                            const createAt          =  new Date().getTime()
                         
                            console.log('******************************************************')
                            console.log(dados)
                            console.log('******************************************************')
                            //CRIAR UM NOVO 
                            console.log(JSON.stringify(resSelect))
                            Conversas.create({
                                conversaUid:uid,
                                contatoNome,
                                createAt,
                                contatoUid:dados.contatoUid,
                                empresaUid,
                                situacao,
                                body: ''
    
                            })
                            .then(function(){
                                console.log('#### Conversa iniciada com sucesso ');

                                const estruturaContato = {
                                    canal:dados.canal,
                                    contatoNome,
                                    contatoOrigem:dados.origemUid,
                                    contatoUid:dados.contatoUid,
                                    conversao:false,
                                    createAt: new Date().getTime(),
                                    errorMsg:'',
                                    favorito:false,
                                    intencao:"",
                                    nomeClienteVinculado:"",
                                    photo:CaixaEntrada.getRandomColor(),
                                    qtdA:0,
                                    situacao:dados.situacao,
                                    slqAgAtendimento:true,
                                    slaAlerta:false,
                                    slaPainel:true,
                                    tempoResposta:0,
                                    uidClienteVinculado:'',
                                    ultMensagemData:0,
                                    usuarioNome:'',
                                    usuarioUid:'',
                                    entrada:1
                                }
                                db.collection(empresaUid).doc('chat').collection('conversas').doc(uid).set(estruturaContato)
                                .catch(errAddContato=>{
                                    console.log('ERRRRRR ao adicionar conversdas no firebase ')
                                })



                                const dadosReturn = {
                                    conversaUid:uid,
                                    qtd:1,
                                    situacao}
                                resolve(dadosReturn)
                            })
                            .catch(function(err:any){
                                let msg = 'Falha ao cadastrar converssa  '+dados.canal+' | '+err
                                console.log(msg)
                                reject(msg)
                            }) 
                        }
                        
                    })
                    .catch(function(errSelect:any){
                        let msg = 'Falha ao consultar  conversa | '+errSelect
                        console.log(msg)
                        reject(msg)
                    })
                        
                        
                    


                   
                })
                .catch(function(err:any){
                    let msg = 'Falha ao criar tabelal conversa | '+err
                    console.log(msg)
                    reject(msg)
                })
                
            })
            .catch(function(error:any){
                let  msg  = '##### Unable to connect to the database:'+error
                console.log(msg);
                reject(msg)
            })
        })
    },
    async verificarContato(empresaUid:any,dados:any):Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            sequelize.authenticate().then(function(){

                console.log('Verificar se existe contado');
              
                Contatos.sync()
                .then(function(){


                    let personaDefault = 'formal'


                    if(dados.canal == 'whatsapp') //PARA COLOCAR EM PRODUCAO TIRAR ID DO CLIENTE
                    {
                        console.log('VALIDANDO CONTATO  WPP')
                       

                        //VERIFICAR SE JA EXISTE
                        Contatos.findAll({
                            where:{
                                [Op.and]: [
                                    {origem_wpp:dados.origemUid},
                                    {empresaUid}
                                ]
                                
                            },
                            limit:1
                        })
                        .then(function(resSelect:any){
                            if(resSelect.length > 0)
                            {
                              
                               
                                resSelect.forEach((element:any) => {
                                    console.log(JSON.stringify(element))
                                    const uid = element["uid"]
                                    const nome = element["nome"]
                                    personaDefault = element["persona"]
                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault,
                                        qtd:0,
                                        novo:false
                                    }
                                    console.log('*** Origem identificada uid '+JSON.stringify(dadosReturn))
                                    resolve(dadosReturn)  
                                });


                                
                            }
                            else
                            {
                                const uid               =  empresaUid+'_'+Math.random().toString(36).substr(2, 20)
                                const nome              =  dados.contatoNome;
                                //CRIAR UM NOVO 
                                console.log(JSON.stringify(resSelect))
                                Contatos.create({
                                    nome,
                                    origem_wpp:dados.origemUid,
                                    uid,
                                    empresaUid,
                                    kyc:false,
                                    persona:personaDefault
        
                                })
                                .then(function(){
                                    console.log('#### Tabela criada com suceso ');

                                    //ADD CONTATO NOVO 
                                    //Situacao 2 ocupado porque a Lara esta atendendo
                                    const estruturaContato = {
                                        canal:dados.canal,
                                        createAt: new Date().getTime(),
                                        favorito:false,
                                        livechat:false,
                                        nome,
                                        nomeClienteVinculado:'',
                                        origem_wpp:dados.origemUid,
                                        origem:dados.origemUid,
                                        photo:CaixaEntrada.getRandomColor(),
                                        situacao:2, 
                                        tempoResposta:0,
                                        uidClienteVinculado:'',
                                        updateInterno:false,
                                        usuarioNome:'',
                                        usuarioUid:''
                                    }
                                    db.collection(empresaUid).doc('chat').collection('contatos').doc(uid).set(estruturaContato)
                                    .catch(errAddContato=>{
                                        console.log('ERRRRRR ao adicionar contato no firebase ')
                                    })


                               


                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault,
                                        qtd:1,
                                        novo:true
                                    }
                                    resolve(dadosReturn)
                                })
                                .catch(function(err:any){
                                    let msg = 'Falha ao cadastrar contato  '+dados.canal+' | '+err
                                    console.log(msg)
                                    reject(msg)
                                }) 
                            }
                            
                        })
                        .catch(function(errSelect:any){
                            let msg = 'Falha ao consultar  contatos | '+errSelect
                            console.log(msg)
                            reject(msg)
                        })
                        
                        
                    }
                    else if(dados.canal == 'TELEGRAM') //PARA COLOCAR EM PRODUCAO TIRAR ID DO CLIENTE
                    {
                        console.log('VALIDANDO CONTATO  TELEGRAM')
                       
                       

                        //VERIFICAR SE JA EXISTE
                        Contatos.findAll({
                            where:{
                                [Op.and]: [
                                    {origem_telegram:dados.origemUid},
                                    {empresaUid}
                                ]
                                
                            },
                            limit:1
                        })
                        .then(function(resSelect:any){
                            if(resSelect.length > 0)
                            {
                                console.log(JSON.stringify(resSelect) )
                               
                                resSelect.forEach((element:any) => {
                                    console.log(JSON.stringify(element))
                                    const uid = element["uid"]
                                    const nome = element["nome"]
                                    personaDefault = element["persona"]
                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault
                                    }
                                    console.log('*** Origem identificada uid '+JSON.stringify(dadosReturn))
                                    resolve(dadosReturn)  
                                });


                                
                            }
                            else
                            {
                                const uid               =   empresaUid+'_'+Math.random().toString(36).substr(2, 20)
                               
                                //CRIAR UM NOVO 
                                console.log(JSON.stringify(resSelect))
                                Contatos.create({
                                    nome:dados.contatoNome,
                                    origem_telegram:dados.origemUid,
                                    uid,
                                    empresaUid,
                                    kyc:false,
                                    persona:personaDefault
        
                                })
                                .then(function(){
                                    console.log('#### Tabela criada com suceso ');
                                    const dadosReturn = {
                                        uid,
                                        nome:dados.contatoNome,
                                        persona:personaDefault
                                    }
                                    resolve(dadosReturn)
                                })
                                .catch(function(err:any){
                                    let msg = 'Falha ao cadastrar contato TELEGRAM '+dados.canal+' | '+err
                                    console.log(msg)
                                    reject(msg)
                                }) 
                            }
                            
                        })
                        .catch(function(errSelect:any){
                            let msg = 'Falha ao consultar  contatos | '+errSelect
                            console.log(msg)
                            reject(msg)
                        })
                        
                        
                    }
                    else if(dados.canal == 'email')
                    {   

                        console.log('VALIDANDO CONTATO  EMAIL')
                        console.log(JSON.stringify(dados))

                        //VERIFICAR SE JA EXISTE
                        Contatos.findAll({
                            where:{
                                [Op.and]: [
                                    {origem_email:dados.email},
                                    {empresaUid}
                                ]
                                
                            },
                            limit:1
                        })
                        .then(function(resSelect:any){
                            if(resSelect.length > 0)
                            {
                              
                               
                                resSelect.forEach((element:any) => {
                                    console.log(JSON.stringify(element))
                                    const uid = element["uid"]
                                    const nome = element["nome"]
                                    personaDefault = element["persona"]
                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault,
                                        qtd:0
                                    }
                                    console.log('*** Origem identificada uid '+JSON.stringify(dadosReturn))
                                    resolve(dadosReturn)  
                                });


                                
                            }
                            else
                            {
                                const uid               =  empresaUid+'_'+Math.random().toString(36).substr(2, 20)
                                const nome              =  dados.nome;
                                //CRIAR UM NOVO 
                                console.log(JSON.stringify(resSelect))
                                Contatos.create({
                                    nome,
                                    origem_email:dados.email,
                                    uid,
                                    empresaUid,
                                    kyc:false,
                                    persona:personaDefault
        
                                })
                                .then(function(){
                                    console.log('#### Tabela criada com suceso ');

                                    //ADD CONTATO NOVO 
                                    //Situacao 2 ocupado porque a Lara esta atendendo
                                    const estruturaContato = {
                                        canal:'whatsapp',
                                        createAt: new Date().getTime(),
                                        favorito:false,
                                        livechat:false,
                                        nome,
                                        nomeClienteVinculado:'',
                                    
                                        origem_email:dados.email,
                                        origem:'',
                                        photo:CaixaEntrada.getRandomColor(),
                                        situacao:2, 
                                        tempoResposta:0,
                                        uidClienteVinculado:'',
                                        updateInterno:false,
                                        usuarioNome:'',
                                        usuarioUid:''
                                    }
                                    db.collection(empresaUid).doc('chat').collection('contatos').doc(uid).set(estruturaContato)
                                    .catch(errAddContato=>{
                                        console.log('ERRRRRR ao adicionar contato no firebase ')
                                    })



                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault,
                                        qtd:1
                                    }
                                    resolve(dadosReturn)
                                })
                                .catch(function(err:any){
                                    let msg = 'Falha ao cadastrar contato  '+dados.canal+' | '+err
                                    console.log(msg)
                                    reject(msg)
                                }) 
                            }
                            
                        })
                        .catch(function(errSelect:any){
                            let msg = 'Falha ao consultar  contatos | '+errSelect
                            console.log(msg)
                            reject(msg)
                        })


                    }
                    else if(dados.canal == 'botsite')
                    {
                        console.log('VALIDANDO CONTATO  BOTSITE')
                        console.log(JSON.stringify(dados))

                        //VERIFICAR SE JA EXISTE
                        Contatos.findAll({
                            where:{
                                [Op.and]: [
                                    {origem_6:dados.origemUid},
                                    {empresaUid}
                                ]
                                
                            },
                            limit:1
                        })
                        .then(function(resSelect:any){
                            if(resSelect.length > 0)
                            {
                              
                               
                                resSelect.forEach((element:any) => {
                                    console.log(JSON.stringify(element))
                                    const uid = element["uid"]
                                    const nome = element["nome"]
                                    personaDefault = element["persona"]
                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault,
                                        qtd:0
                                    }
                                    console.log('*** Origem identificada uid '+JSON.stringify(dadosReturn))
                                    resolve(dadosReturn)  
                                });


                                
                            }
                            else
                            {
                                const uid               =  empresaUid+'_'+Math.random().toString(36).substr(2, 20)
                                const nome              =  dados.contatoNome;
                                //CRIAR UM NOVO 
                                console.log(JSON.stringify(resSelect))
                                Contatos.create({
                                    nome,
                                    origem_6:dados.origemUid,
                                    uid,
                                    empresaUid,
                                    kyc:false,
                                    persona:personaDefault
        
                                })
                                .then(function(){
                                    console.log('#### Tabela criada com suceso ');

                                    //ADD CONTATO NOVO 
                                    //Situacao 2 ocupado porque a Lara esta atendendo
                                    const estruturaContato = {
                                        canal:'whatsapp',
                                        createAt: new Date().getTime(),
                                        favorito:false,
                                        livechat:false,
                                        nome,
                                        nomeClienteVinculado:'',
                                    
                                        origem_email:dados.email,
                                        origem:'',
                                        photo:CaixaEntrada.getRandomColor(),
                                        situacao:2, 
                                        tempoResposta:0,
                                        uidClienteVinculado:'',
                                        updateInterno:false,
                                        usuarioNome:'',
                                        usuarioUid:''
                                    }
                                    db.collection(empresaUid).doc('chat').collection('contatos').doc(uid).set(estruturaContato)
                                    .catch(errAddContato=>{
                                        console.log('ERRRRRR ao adicionar contato no firebase ')
                                    })



                                    const dadosReturn = {
                                        uid,
                                        nome,
                                        persona:personaDefault,
                                        qtd:1
                                    }
                                    resolve(dadosReturn)
                                })
                                .catch(function(err:any){
                                    let msg = 'Falha ao cadastrar contato  '+dados.canal+' | '+err
                                    console.log(msg)
                                    reject(msg)
                                }) 
                            }
                            
                        })
                        .catch(function(errSelect:any){
                            let msg = 'Falha ao consultar  contatos | '+errSelect
                            console.log(msg)
                            reject(msg)
                        })
                    }
                    else
                    {
                        let msg = 'Canal nao especificado '+dados.canal
                        console.log(msg)
                        reject(msg)
                    }


                   
                })
                .catch(function(err:any){
                    let msg = 'Falha ao criar tabelal contatos | '+err
                    console.log(msg)
                    reject(msg)
                })



                
            })
            .catch(function(error:any){
                let  msg  = '##### Unable to connect to the database:'+error
                console.log(msg);
                reject(msg)
            })
        })
    },
    async verificarContatoAdd(empresaUid:any,dados:any):Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            sequelize.authenticate().then(function(){

                
                //SETAR TABELA DE CONTATOS
               
                Contatos.sync()
                .then(function(){


                    dados.forEach((element:any) => {
                        console.log('Verificar se existe contado '+element.origem);
                        if(element.canal == 'whatsapp') //PARA COLOCAR EM PRODUCAO TIRAR ID DO CLIENTE
                        {
                            console.log('VALIDANDO CONTATO  WPP')
                           
    
                            //VERIFICAR SE JA EXISTE
                            Contatos.findAll({
                                where:{
                                    [Op.and]: [
                                        {origem_wpp:element.origem},
                                        {empresaUid}
                                    ]
                                    
                                },
                                limit:1
                            })
                            .then(function(resSelect:any){
                               
                                if(resSelect.length == 0)
                                {
                                    //CRIAR NOVO CONTATO
                                    console.log('##### TENTANDO ADD NOVO CONTATO ')
                                    const uid               =  element.uid
                                    const nome              =  element.nome.toLowerCase()
                                  
                                    Contatos.create({
                                        nome,
                                        origem_wpp:element.origem,
                                        uid,
                                        empresaUid,
                                        kyc:false,
                                        persona:'formal'
            
                                    })
                                    .then(function(){
                                        console.log('#### Tabela criada com suceso ');
    
                                    })
                                    .catch(function(err:any){
                                        let msg = 'Falha ao cadastrar contato  '+err
                                        console.log(msg)
                                        
                                    }) 
                                }
                                else
                                {
                                    console.log('Contador nao funcionou')
                                }
                                
                            })
                            .catch(function(errSelect:any){
                                let msg = 'Falha ao consultar  contatos | '+errSelect
                                console.log(msg)
                               
                            })
                            
                            
                        }
                       
                        else
                        {
                            let msg = 'Canal nao especificado '
                            console.log(msg)
                           
                        }
                    });

                    resolve()
               


                   


                   
                })
                .catch(function(err:any){
                    let msg = 'Falha ao criar tabelal contatos | '+err
                    console.log(msg)
                    reject(msg)
                })



                
            })
            .catch(function(error:any){
                let  msg  = '##### Unable to connect to the database:'+error
                console.log(msg);
                reject(msg)
            })
        })
    },
    async verificarContatoDelete(empresaUid:string,contatoUid:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            Contatos.destroy(
            
                {where:{
                    [Op.and]: [
                        {uid:contatoUid},
                        {empresaUid}
                    ]
                    
                }}
            )
            .then(function(){
                resolve()
            })
            .catch(function(err:any){
                reject(err)
            })
        })
        
    },
    async AtualizacaoContato(empresaUid:any,dados:any):Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            sequelize.authenticate().then(function(){

                
                //SETAR TABELA DE CONTATOS
               
                Contatos.sync()
                .then(function(){


                   
                        console.log('Verificar se existe contado '+dados.origem);
                        if(dados.canal == 'whatsapp' || dados.canal === 'whatsappdirect') //PARA COLOCAR EM PRODUCAO TIRAR ID DO CLIENTE
                        {
                            console.log('VALIDANDO CONTATO  WPP')
                           
    
                            //VERIFICAR SE JA EXISTE
                            Contatos.findAll({
                                where:{
                                    [Op.and]: [
                                        {origem_wpp:dados.origem},
                                        {empresaUid}
                                    ]
                                    
                                },
                                limit:1
                            })
                            .then(function(resSelect:any){
                               
                                if(resSelect.length == 0)
                                {
                                    //CRIAR NOVO CONTATO
                                    console.log('##### TENTANDO ADD NOVO CONTATO ')
                                    const uid               =  dados.uid
                                    const nome              =  dados.nome.toLowerCase()
                                  
                                    Contatos.create({
                                        nome,
                                        origem_wpp:dados.origem,
                                        uid,
                                        empresaUid,
                                        kyc:false,
                                        persona:'formal'
            
                                    })
                                    .then(function(){
                                        console.log('#### Tabela criada com suceso ');
                                        resolve()
    
                                    })
                                    .catch(function(err:any){
                                        let msg = 'Falha ao cadastrar contato  '+err
                                        console.log(msg)
                                        reject(msg)
                                        
                                    }) 
                                }
                                else
                                {
                                    console.log('Iniciar atualizacao de contato ')
                                    const nome              =  dados.nome.toLowerCase()
                                    const uid               =  dados.uid
                                    //FAZER UPDATE
                                    Contatos.update(
                                        {
                                            nome
                                        },
                                        {where:{
                                            [Op.and]: [
                                                {uid},
                                                {empresaUid}
                                            ]
                                            
                                           }}
                                    )
                                    .then(function(){
                                        console.log('DAdos atualizados com sucesso ')
                                        resolve()
                                    })
                                    .catch(function(errUpdate:any){
                                        let msg = 'Falha ao atualizar dados '+errUpdate
                                        console.log(msg)
                                        reject(msg)
                                    })

                                    
                                }
                                
                            })
                            .catch(function(errSelect:any){
                                let msg = 'Falha ao consultar  contatos | '+errSelect
                                console.log(msg)
                                reject(msg)

                               
                            })
                            
                            
                        }
                       
                        else
                        {
                            let msg = 'Canal nao especificado '
                            console.log(msg)
                            reject(msg)
                        }
                 

                    
               


                   


                   
                })
                .catch(function(err:any){
                    let msg = 'Falha ao criar tabelal contatos | '+err
                    console.log(msg)
                    reject(msg)
                })



                
            })
            .catch(function(error:any){
                let  msg  = '##### Unable to connect to the database:'+error
                console.log(msg);
                reject(msg)
            })
        })
    },
    async addMensagem(empresaUid:any,dadosMensagem:any):Promise<any>
    {
        return new Promise((resolve, reject) => {
            
            const addMensagem = {
                autorNome:dadosMensagem.autorNome,
                autorUid:dadosMensagem.autorUid,
                canal:dadosMensagem.canal,
                contatoOrigem:dadosMensagem.contatoOrigem,
                contatoUid:dadosMensagem.contatoUid,
                contatoNome:dadosMensagem.autorNome,
                conversaUid:dadosMensagem.conversaUid,
                createAt: new Date().getTime(),
                entregueData: dadosMensagem.time,
                entregueTag:2,
                enviadoData: dadosMensagem.time,
                enviadoTag:1,
                es:dadosMensagem.es,
                id:dadosMensagem.idMensagem,
                lidoData:null,
                lidoTag:2,
                mensagem:dadosMensagem.mensagem,
                tipo:dadosMensagem.tipo,
                usuarioNome:dadosMensagem.autorNome,
                usuarioUid:dadosMensagem.autorUid,
                anexo:dadosMensagem.anexo,
                citacao:dadosMensagem.citacao,
                processoIa:false,
        
                consumoUid:'',
                photo:'' 
            }
            db.collection(empresaUid).doc('chat').collection('conversas').doc(dadosMensagem.contatoUid).collection('mensagens').add(addMensagem)
            .then(()=>{
                resolve()
            })
            .catch(err=>{
                reject(err)
            })
        })
    },
    async proessamentoMensagem(empresaUid:any,dados:any):Promise<any>
    {
        return new Promise((resolve, reject) => {
           try
           {
           
            const dadosFluxo = dados.dadosFluxo
            const dadosMensagem = dados.dadosMensagem


            db.collection(empresaUid).doc('consumo_painel').get()
            .then((resCheckConsumo:any)=>{
              if(resCheckConsumo.exists)
              {
                const dadosConsumo = resCheckConsumo.data()
                if(dadosFluxo.situacao == 1)
                {
                    if(dadosConsumo.qtdContratada <= dadosConsumo.qtdConsumoIa)
                    {
                        //CLIENTE NAO POSSUI SALDO PARA PROCESSAMENTO EM IA
                        dadosFluxo.situacao = 2

                        
                        //FAZER TRANSFERENCIA DA CHAMADA E UPDATE DE SITUACAO
                        //TRANSFERIR MENSAGEM PARA 500 HUMANO 
                        const dadosWatson = {
                            context:{
                                operacao_nome:'46'
                            }
                        }
                        CaixaEntrada.tratarRobo(dadosWatson,dados)
                        
                        .catch(errTipoSemTrat=>{
                            reject('Falha ao executar transferencia por falta de saldo  '+dadosMensagem.tipo+' | '+errTipoSemTrat)
                        })                        

                    }
                }
                


                if(Number( dadosFluxo.situacao ) == 1)
                {
                    
                    //CONVERSA COM A ALARA
                    if(dadosMensagem.tipo == 'texto')
                    {

                    
                        //RECUPERAR DADOS DA CONVERSA
                        Conversas.sync()
                        .then(function(){
                            
                        
                            //VERIFICAR SE JA EXISTE
                            Conversas.findAll({
                                where:{
                                    [Op.and]: [
                                        {conversaUid:dadosFluxo.conversaUid},
                                        {empresaUid},
                                        {situacao:1}
                                    ]
                                
                                    
                                },
                                limit:1
                            })
                            .then(function(resSelect:any){
                                if(resSelect.length > 0)
                                {
                                    //console.log(JSON.stringify(resSelect) )
                                    
                                    resSelect.forEach((element:any) => {
                                        

                                        //RECUPERAR JSON INICIAL
                                        let bodyRec =   {}
                                    
                                        
                                        if(element["body"].length === 0)
                                        {
                                            console.log('Criando novo contexto ')
                                            //CRIAR NOVO 
                                            bodyRec = {
                                                brainProc : dados.dadosFluxo.brainProc
                                            }
                                        }
                                        else
                                        {
                                            console.log('Recuperando contexto  ')
                                            const dadosRetorno = JSON.parse(element["body"])
                                            bodyRec = dadosRetorno
                                            //console.log('++++ '+bodyRec)
                                        }

                                        const ProcessoWatson = {
                                            dados,
                                            body:bodyRec,
                                            saltos:1
                                        }
                                    
                                        Watson.procMensagemNew(ProcessoWatson)
                                        .then((resProcessoIA:any)=>{
                                            console.log('########## A CONVERSA FOI PROCESSADA COM SUCESSO ###########')
                                            //console.log(JSON.stringify(resProcessoIA))
                                            resolve(resProcessoIA)
                                        })
                                        .catch(errProcIA=>{
                                            let msg = 'Func: proessamentoMensagem  | Falha ao processar IA | '+errProcIA
                                            //console.log(msg)
                                            reject(msg)
                                        })
                                    
                                    });


                                    
                                }
                                else
                                {
                                let msg = 'A conversa apresenta falhas de processo '
                                //console.log(msg)
                                reject(msg) 
                                }
                                
                            })
                            .catch(function(errSelect:any){
                                let msg = 'Func: proessamentoMensagem  | Falha ao verificar conversa  | '+errSelect
                                console.log(msg)
                                reject(msg)
                            })
                                
                                
                            


                        
                        })
                        .catch(function(err:any){
                            let msg = 'Falha ao criar tabelal conversa | '+err
                            console.log(msg)
                            reject(msg)
                        })


                    }
                    else
                    {



                        //TRANSFERIR MENSAGEM PARA ATENDIMENTO HUMANO 
                        const dadosWatson = {
                            context:{
                                operacao_nome:'46'
                            }
                        }
                        CaixaEntrada.tratarRobo(dadosWatson,dados)
                        .then(()=>{
                            console.log('Transferencia processado com sucesso para tipo de arquivo nao tratado ')
                            resolve({saltos:0})
                        })
                        .catch(errTipoSemTrat=>{
                            reject('Func: proessamentoMensagem | tipo de mensagem nao foi tratada   '+dadosMensagem.tipo+' | '+errTipoSemTrat)
                        })
                        
                    }

                }
                else if (Number(dadosFluxo.situacao) == 2)
                {
                    console.log('### CONVERSA IDENTIFICADA COMO LIVE CHAT  ###')
                    //LIVE CHAT
                    console.log('Mensagem com livechat')
                    resolve({saldos:0})
                }
                else
                {
                    //SITUACAO INDEFINIDA
                    reject('Func: proessamentoMensagem | Situacao indefinida de conversa '+dadosFluxo.situacao)
                }


              }
            })
            .catch(errCheckConsumo=>{
                let msg = 'Problema ao verificar saldo de consumo do cliente'+errCheckConsumo
                console.log(msg)
                reject(msg)
            })




            

           
           }
           catch(err)
           {
               reject(err)
           }
            
        })
        
    },
    async empresaGetConfiguracoes(empresaUid:any):Promise<any>{
        return new Promise((resolve, reject) => {
            
            Empresas.sync()
            .then(function(){
                //VERIFICAR SE JA EXISTE
                Empresas.findAll({
                    where:{
                        [Op.and]: [
                          
                            {empresaUid}
                        ]
                        
                    },
                    limit:1
                })
                .then(function(resSelect:any){
                    if(resSelect.length > 0)
                    {
                       
                       
                        resSelect.forEach((element:any) => {
                            console.log(JSON.stringify(element))
                            const brainUid = element["brainUid"]
                            const nome = element["nome"]
                            const nomeFantasia = element["nomeFantasia"]
                            const empresaSituacao = element["situacao"]
                            const msgTransferencia = element["msgTransferencia"]
                            const msgBoasVindas = element["msgBoasVindas"]
                         
                            const dadosReturn = {
                                empresaSituacao,
                                nome,
                                nomeFantasia,
                                brainUid,
                                msgTransferencia,
                                msgBoasVindas
                            }
                            console.log('*** Origem identificada uid '+JSON.stringify(dadosReturn))
                            resolve(dadosReturn)  
                        });


                        
                    }
                    else
                    {
                        let msg = 'Nao existem dados da empresa para seguir'
                        console.log(msg)
                        reject(msg)
                    }
                    
                })
                .catch(function(errSelect:any){
                    let msg = 'Falha ao consultar  contatos | '+errSelect
                    console.log(msg)
                    reject(msg)
                })
            })
            .catch(function(err:any){
                reject('Falha ao resgatar dados da empresa | '+err)
            })
        
        })
    },
    async AddConsumo(dados:any):Promise<any>{
        return new Promise((resolve, reject) => {
            
            const Consumos  = sequelize.define('consumos',{
                empresaUid  :{ type:Sequelize.STRING},
                createAt    :{ type:Sequelize.STRING},
                es          :{ type:Sequelize.STRING},
                msgProcesso :{ type:Sequelize.TEXT},
                msgResposta :{ type:Sequelize.TEXT},
                conversaUid :{ type:Sequelize.STRING },
                conversaData:{ type:Sequelize.STRING },
                contGravacao:{ type:Sequelize.INTEGER },
                contUpdate  :{ type:Sequelize.INTEGER },
                contLeitura :{ type:Sequelize.INTEGER },
                contAudio   :{ type:Sequelize.INTEGER },
                contInvocacao:{ type:Sequelize.INTEGER },
                contDelete:{ type:Sequelize.INTEGER },
                contSaltoIa:{ type:Sequelize.INTEGER },
                contUsoIa:{ type:Sequelize.INTEGER }

            })
            Consumos.sync()
            .then(function(){

                const contGravacao  = dados.dadosControle.gravacao+1 //ADD regitro de quantidades
                const contUpdate    = dados.dadosControle.update
                const contLeitura   = dados.dadosControle.leitura+1 //ADD registro de quatidade por causa da leitura
                const contAudio     = dados.dadosControle.contAudio
                const contInvocacao = dados.dadosControle.invocacao
                const contDelete    = dados.dadosControle.delete+1 //ADD registro de quantidade de delete 

                const contSaltoIa   = dados.dadosControle.processoIaSaltos
                const contUsoIa     = 0+dados.dadosControle.processoIaEfetivos

                Consumos.create({
                    empresaUid:dados.empresaUid,
                    createAt: new Date().getTime(),
                    es:'e',
                    msgProcesso:dados.dadosMensagem.mensagem,
                    msgResposta:dados.dadosMensagem.respostaIa,
                    conversaUid:dados.dadosFluxo.conversaUid,
                    conversaData:dados.createAt,
                    contGravacao,
                    contUpdate,
                    contLeitura,
                    contAudio,
                    contInvocacao,
                    contDelete,
                    contSaltoIa,
                    contUsoIa

                })
                .then(function(){
                    const dadosConsumoPainel = {
                        qtdMensagens:admin.firestore.FieldValue.increment(1),
                        qtdConsumoIa:admin.firestore.FieldValue.increment(contUsoIa),
                        trafegoUtilizado:admin.firestore.FieldValue.increment(1)
                    }
                    console.log('DADOS DE ATUALIZACAO DE CONSUMO ')
                    console.log(JSON.stringify(dadosConsumoPainel))
                    db.collection(dados.empresaUid).doc('consumo_painel').update(dadosConsumoPainel)
                    .then(()=>{
                        resolve()
                    })
                    .catch(err=>{
                        let msg = 'Falha ao adicionar dados no painel de consumo | '+err
                        console.log(msg)
                        reject(msg)
                    })
                })
                .catch(function(err:any){
                    let msg = 'Falha ao adicionar dados de consumo | '+err;
                    console.log(msg)
                    reject(msg)
                })
            })
            .catch(function(err:any){
                let msg = 'Falha ao se conectar a tabela de consumo '
                console.log(msg)
                reject(msg)
            })
            
        })
    },
    async contatosFindAll(empresaUid:any,pesquisarPor:any):Promise<any>
    {
       
        return new Promise((resolve, reject) => {
          

                console.log('Listando contato');
                console.log(JSON.stringify(pesquisarPor))
              
                Contatos.sync()
                .then(function(){
                    let sqlQuery = "SELECT * FROM lara.contatos WHERE empresaUid like '"+empresaUid+ "'  "

                    if(pesquisarPor != '')
                    {
                        sqlQuery = sqlQuery + "  and ( nome like '%"+pesquisarPor+"%' or origem_wpp like '%"+pesquisarPor+"' or origem_wppDirerct like '%"+pesquisarPor+"' or origem_facebook like '%"+pesquisarPor+"' or origem_email like '"+pesquisarPor+"' or origem_telegram like '"+pesquisarPor+"%' or origem_1 like '"+pesquisarPor+"' or origem_2 like '"+pesquisarPor+"' or origem_3 like '"+pesquisarPor+"' or origem_4 like '"+pesquisarPor+"' or origem_5 like '"+pesquisarPor+"' or origem_6 like '"+pesquisarPor+"' )  "
                    }
                    sqlQuery = sqlQuery + " ORDER BY nome LIMIT 0,30"
                    console.log(sqlQuery)
                    sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){

                        console.log('Contatos encontrados '+resSelect.length)
                        

                        const dadosReturn = {
                            situacao:'suc',
                            code:0,
                            msg:'Processado com sucesso',
                            data:resSelect
                        }
                    
                        resolve(dadosReturn) 

                    })
                   
                    .catch(function(errSelect:any){
                        let msg = 'Falha ao consultar  contatos | '+errSelect
                        console.log(msg)
                        reject(msg)
                    })


                   
                })
                .catch(function(err:any){
                    let msg = 'Falha ao criar tabelal contatos | '+err
                    console.log(msg)
                    reject(msg)
                })



                
           
        })
    },
    async contatoCheckAdd(empresaUid:any,dados:any):Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            

            console.log('Verificar se existe contado');
            
            Contatos.sync()
            .then(function(){

                let sqlQuery = "SELECT * FROM lara.contatos WHERE empresaUid like '"+empresaUid+ "'  and (   origem_wpp like '"+dados.origem_wpp+"' or origem_wppDirerct like '"+dados.origem_wpp+"' )  LIMIT 0,10"


                console.log(sqlQuery)
                sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                    resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
                
                
                })   
              



                
            })
            .catch(function(err:any){
                let msg = 'Falha ao criar tabelal contatos | '+err
                console.log(msg)
                reject({situacao:'err',code:0,msg})
            })



                
           
        })
    },
    async contatoAddNew(empresaUid:any,dados:any):Promise<any>
    {
        return new Promise((resolve, reject) => {
            Contatos.sync()
            .then(function(){
                Contatos.create({
                    nome:dados.nome,
                    origem_wpp:dados.origem_wpp,
                    uid:dados.id,
                    empresaUid:dados.empresaUid,
                    kyc:false,
                    persona:dados.persona,
                    origem_email:dados.origem_email,
                    origem_facebook:dados.origem_facebook,
                    origem_telegram:dados.origem_telegram,
                    grupo:dados.grupo,
                    subgrupo:dados.subGrupo,
                    grupoUid:dados.grupoUid,
                    subgrupoUid:dados.subGrupoUid,
                    parceiroUid:dados.parceiroUid,
                    parceiroNome:dados.parceiroNome,
                    live:dados.live,
                    favorito:dados.favorito,
                    usuarioNome:dados.usuarioNome,
                    usuarioUid:dados.usuarioUid

                })
                .then(function(){
                    console.log('#### Tabela criada com suceso ');

                   
                    
                    resolve()
                })
                .catch(function(err:any){
                    let msg = 'Falha ao cadastrar contato  '+dados.canal+' | '+err
                    console.log(msg)
                    reject(msg)
                }) 
            })
            .catch(function(err:any){
                reject(err)
            })
        })
    },
    async contatoAtualizar(empresaUid:string,contatoUid:string,dados:any):Promise<any>
    {   
        console.log('Atualizando '+empresaUid)
        console.log(JSON.stringify(dados))
        return new Promise((resolve,reject)=>{
            Contatos.sync()
            .then(function(){
                Contatos.update(
                    {
                        nome:dados.nome,
                        origem_wpp:dados.origem_wpp,
                        kyc:dados.kyc,
                        persona:dados.persona,
                        origem_email:dados.origem_email,
                        origem_facebook:dados.origem_facebook,
                        origem_telegram:dados.origem_telegram,
                        grupo:dados.grupo,
                        subgrupo:dados.subGrupo,
                        grupoUid:dados.grupoUid,
                        subgrupoUid:dados.subGrupoUid,
                        parceiroUid:dados.parceiroUid,
                        parceiroNome:dados.parceiroNome,
                        live:dados.live,
                        favorito:dados.favorito,
                        usuarioNome:dados.usuarioNome,
                        usuarioUid:dados.usuarioUid
                    },
                    {where:{uid:contatoUid}}
                  )
                  .then(function(res:any){
                    console.log('******* todos os dados atualizados com sucesso '+res)
                    resolve()
                  })
                  .catch(function(err2:any){
                    reject(err2)
                  })
            })
            .catch(function(err:any){
                reject(err)
            })
        })
    },
    async ConversaVerificar(empresaUid:string,contatoUid:string):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            console.log('Verificar se existe conversa aberta');
            
            Conversas.sync()
            .then(function(){

                let sqlQuery = "SELECT id,conversaUid,createAt FROM lara.conversas WHERE empresaUid like '"+empresaUid+"' and contatoUid LIKE '"+contatoUid+"'   LIMIT 0,10"


                console.log(sqlQuery)
                sequelize.query(sqlQuery, null, { raw: true }).then(function(resSelect:any){
                    resolve({situacao:'suc',code:0,msg:'processado com sucesso ',data:{data:resSelect}})    
                
                
                })   
              



                
            })
            .catch(function(err:any){
                let msg = 'Falha ao criar tabelal contatos | '+err
                console.log(msg)
                reject({situacao:'err',code:0,msg})
            })
        })  
    },
    async contatoSpamCheck(empresaUid:string,contatoEmail:string):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            SPAMS.sync().then(function(){
                SPAMS.findAll({
                    where:{
                        [Op.and]: [
                            {contatoEmail},
                            {empresaUid:empresaUid}
                          
                        ]
                        
                       },
                    limit:1
                    
                })
                .then(function(SelectUsuarios:any){
                    if(SelectUsuarios.length == 0)
                    {
                       //ADICIONAR CONATATO
                       resolve({situacao:'suc',code:0,msg:'Já existe'})
                    }
                    else

                    {
                        reject({situacao:'suc',code:0,msg:'Considerado SPAM'})
                    }
                    
                })
                .catch(function(err:any){
                    let msg2 = 'Falha ao consultar tabela SPAM'
                    console.log(msg2)
                    reject({situacao:'err',code:0,msg:msg2})
                })

            })
            .catch(function(err:any){
                let msg = 'Falha ao se conectar a tabela de SPAM'
                console.log(msg)
                reject({situacao:'err',code:0,msg})
            })
        })
    },
    async contatoSpamADD(empresaUid:string,contatoEmail:string):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            SPAMS.sync().then(function(){
                SPAMS.findAll({
                    where:{
                        [Op.and]: [
                            {contatoEmail},
                            {empresaUid:empresaUid}
                          
                        ]
                        
                       },
                    limit:1
                    
                })
                .then(function(SelectUsuarios:any){
                    if(SelectUsuarios.length == 0)
                    {
                       //ADICIONAR CONATATO
                       SPAMS.create({
                        empresaUid,
                        contatoEmail
        
                        })
                        .then(function(){
                            resolve({situacao:'suc',code:0,msg:'Adicionado'})
                        })
                        .catch(function(err:any){
                            let msg = 'Falha ao adicionar ao SPAM | '+err
                            reject({situacao:'err',code:0,msg})
                        })
                    }
                    else

                    {
                        resolve({situacao:'suc',code:0,msg:'Já existe'})
                    }
                    
                })
                .catch(function(err:any){
                    let msg2 = 'Falha ao consultar tabela SPAM'
                    console.log(msg2)
                    reject({situacao:'err',code:0,msg:msg2})
                })

            })
            .catch(function(err:any){
                let msg = 'Falha ao se conectar a tabela de SPAM'
                console.log(msg)
                reject({situacao:'err',code:0,msg})
            })
            
        })
    }

   
}
export default CaixaEntrada;