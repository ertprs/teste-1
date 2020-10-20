const { Sequelize,Op } = require('sequelize');
const sequelize = new Sequelize('lara', 'laracf', 'asdasdasd77766ttghfYYYYrgfVV', {
    host: '10.86.160.3',
    dialect: 'mysql',
    pool: {
        max: 1,
        min: 0,
       
    }
});
let FinLancamentoExtrutura = {
    nossoNumero:{
        type:Sequelize.STRING
    },
    numeroLara:{
        type:Sequelize.STRING
    },
    autorizacaoCartao:{
        type:Sequelize.STRING
    },
    autorizacaoCripto:{
        type:Sequelize.STRING
    },
    parceiroUid:{
        type:Sequelize.STRING
    },
    parceiroNome:{
        type:Sequelize.STRING
    },
    valor:{
        type:Sequelize.DECIMAL(10,5)
    },
    categoriaDRE:{
        type:Sequelize.STRING
    },
    
    categoriaUid:{
        type:Sequelize.STRING
    },
    situacao:{ //0 aberto | 1 operacao confirmada | 2 operacao cancelada | 3 Vencido | 9 cancelado
        type:Sequelize.INTEGER
    },
    lancamentoUid:{
        type:Sequelize.STRING
    },
    vencimento:{
        type:Sequelize.DATE
    },
    empresaUid:{
        type:Sequelize.STRING
    },
    c_d:{
        type:Sequelize.STRING
    }
    

}
const FinanceiroSQL = {
    async updateDados(empresaUid:string,lancamentoUid:string,dadosUpdate:any)
    {
        return new Promise((resolve,reject)=>{
            const Lancamentos  = sequelize.define(empresaUid+'_financeiro_lancamentos',FinLancamentoExtrutura)

            Lancamentos.sync()
            .then(function(){
                Lancamentos.update(
                    dadosUpdate,
                    {where:{
                        [Op.and]: [
                            {lancamentoUid},
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
            })
            .catch(function(err:any){
                let msg = 'Falha ao fechar conexão | '+err
                console.log(msg)
                reject(msg)
            })
        })
        
    },
    async cancelarLandamento(empresaUid:string,lancamentoUid:string)
    {
        return new Promise((resolve,reject)=>{
            const Lancamentos  = sequelize.define(empresaUid+'_financeiro_lancamentos',FinLancamentoExtrutura)

            Lancamentos.sync()
            .then(function(){
                Lancamentos.update(
                    {situacao:9},
                    {where:{
                        [Op.and]: [
                            {lancamentoUid},
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
            })
            .catch(function(err:any){
                let msg = 'Falha ao fechar conexão | '+err
                console.log(msg)
                reject(msg)
            })
        })
        
    },
    async addLancamento(empresaUid:string,dados:any):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            const Lancamentos  = sequelize.define(empresaUid+'_financeiro_lancamentos',FinLancamentoExtrutura)

            Lancamentos.sync()
            .then(function(){

                console.log("** DADOS RECUPERACAO ** ")
                console.log(JSON.stringify(dados))

                let vencimento = new Date(dados.vencimento);
                console.log(vencimento)

                Lancamentos.create({
                    parceiroUid:dados.parceiroUid,
                    parceiroNome:dados.nome,
                    valor:dados.valor_principal,
                    categoriaDRE:dados.categoriaDRE,
                    categoriaUid:dados.categoriaUid,
                    situacao:0,
                    lancamentoUid:dados.id,
                    vencimento,
                    empresaUid,
                    c_d:dados.c_d
    
                })
                .then(function(){
                    resolve('Adicionado com sucesso')
                })
                .catch(function(errInsert:any){
                    let msg = 'Falha ao criar lancamento | '+errInsert
                    reject(msg)
                })

            })
            .catch(function(err:any){
                reject(err)
            })
        })
    }


}
export default FinanceiroSQL;