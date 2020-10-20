import { db } from '../..';
const { Sequelize } = require('sequelize');
import  CaixaEntrada  from '../../model/mysql/caixa_entrada'

const sequelize = new Sequelize('lara', 'laracf', 'asdasdasd77766ttghfYYYYrgfVV', {
    host: '10.86.160.3',
    dialect: 'mysql',
    pool: {
        max: 1,
        min: 0,
       
    }
});


const modelCasos = {
    async AddTicketControle(empresaUid:string,casoUid:string):Promise<any>
    {
        return new Promise((resolve, reject) => {

            const Casos  = sequelize.define(empresaUid+'_casos',{
                empresaUid:{
                    type:Sequelize.STRING
                },
                casoUid:{
                    type:Sequelize.STRING
                }
                
                
            
            })


            Casos.sync()
            .then(function(){
                Casos.create({
                    empresaUid,
                    casoUid
    
                })
                .then(function(res:any){
                    let msg = 'Criada sessao de usuario '+res
                    console.log(msg)
                    resolve(res.id)
                })
                .catch(function(err:any){
                    let msg = 'Falha ao criar usuario nao existente  | '+err
                    reject(msg)
                })
               
            })
            .catch(function(err:any){
                let msg = 'Falha ao se conectar com a tabela de casos controle  |'+err
                console.log(msg)
                reject(msg)
            })

        })
    },
    async RecuperarIdentificacao(empresaUid:string,casoNumero:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            const Casos  = sequelize.define(empresaUid+'_casos',{
                empresaUid:{
                    type:Sequelize.STRING
                },
                casoUid:{
                    type:Sequelize.STRING
                }
                
                
            
            })


            Casos.sync()
            .then(function(){
                Casos.findAll(
                    {where:{id:casoNumero}},
                   
                    
                )
                .then(function(SelectCasos:any){
                    if(SelectCasos.length > 0)
                    {
                        SelectCasos.forEach((element:any) => {
                            const id            = element["id"]
                            const casoUid       = element["casoUid"]
                            const returnData    = {
                                id,
                                casoUid
                            }
                            resolve(returnData)
                        })
                    }
                    else
                    {
                        let msg = 'Nao existe linha de ticket mysql '
                        reject(msg)
                    }
                })
                .catch(function(err:any){
                    let msg2 = 'Falha ao gerar consulta no ticket '
                    console.log(msg2)
                    reject(msg2)
                })

            })
            .catch(function(err:any){
                let msg = 'Falha ao se conectar com tabela de controle de ticket | '+err
                console.log(msg)
                reject(msg)
            })
        })

    },
    async AddNovoTicket(empresaUid:string,contatoUid:string,contatoNome:string,contatoEmail:string,assunto:string,detalhamento:any):Promise<any>
    {
        return new Promise((resolve, reject) => {
            
            let casoUid               = empresaUid+'_'+ Math.random().toString(36).substr(2, 20)
            console.log('Uid Ticket criar '+casoUid)
            modelCasos.AddTicketControle(empresaUid,casoUid)
            .then(resAddControle=>{
                console.log('$$$$$$$$$$$$$$$$$$$')
                console.log(detalhamento)
                let idControle = resAddControle


                //DETERMINAR USUARIO 
                CaixaEntrada.DetermarUsuarioDistribuicao(empresaUid,'atendimento')
                .then(resUsuario=>{
                   
                    const dadosTicket       = {
                        assunto,
                        contatoNome,
                        contatoEmail,
                        contatoUid,
                        createAt:new Date().getTime(),
                        dataAbertura:new Date().getTime(),
                        dataModificacao: new Date().getTime(),
                        departamento:'',
                        departamentoNome:'',
                        departamentoUid:'',
                        detalhamento,
                        novo:1,
                        numero:idControle,
                        parceiroNome:'',
                        parceiroUid:'',
                        qtdA:1,
                        situacao:1,
                        tipo:'',
                        tipoNome:'',
                        tipoUid:'',
                        usuarioNome:resUsuario.usuarioNome, 
                        usuarioUid:resUsuario.usuarioUid
                    }
                    console.log(JSON.stringify(dadosTicket))
                    db.collection(empresaUid).doc('dados').collection('ticket').doc(casoUid).set(dadosTicket)
                    .then(resAddTicket=>{
                        let msg = 'Ticket criado com sucesso';
                        console.log(msg)
                        resolve()
                    })
                    .catch(errAddTicket=>{
                        let msg = 'Falha no processo de  adicionar o novo ticket | '+errAddTicket
                        console.log(msg)
                        reject(msg)
                    })
                })
                .catch(errSelUsuario=>{
                    let msg = 'Falha no processo de distribuicao para usuario | '+errSelUsuario
                    console.log(msg)
                    reject(msg)
                })


              
               
            })
            .catch(errControle=>{
                let msg = 'Falha ao adicionar controle do ticket | '+errControle
                console.log(msg)
                reject(msg)
            })


        })
    }


}


export default modelCasos;