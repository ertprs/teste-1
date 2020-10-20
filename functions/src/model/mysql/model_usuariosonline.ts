const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('lara', 'laracf', 'asdasdasd77766ttghfYYYYrgfVV', {
    host: '10.86.160.3',
    dialect: 'mysql',
    pool: {
        max: 1,
        min: 0,
       
    }
});

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
    },
    

})

const modelUsuarioOnline = {
    async MudarStatusOperador(dadosOrigem:any,statusOnline:number):Promise<any>
    {
        return new Promise((resolve, reject) => {
            
            Usuarios.sync()
            .then(function(){
                Usuarios.findAll(
                    {where:{usuarioUid:dadosOrigem.uid}},
                   
                    
                )
                .then(function(SelectUsuarios:any){
                    
                    if(SelectUsuarios.length > 0)
                    {
                        SelectUsuarios.forEach((element:any) => {
                            const id            = element["id"]

                            Usuarios.update(
                                {
                                    online:statusOnline,
                                    departamento:dadosOrigem.configUser.departamento
                                },
                                
                                {where:{id:id}}
                            ) 
                            .then(function(){
                                let msg = 'Status do usuario modificado para '+statusOnline
                                console.log(msg)
                                resolve(msg)
                            })
                            .catch(function(err:any){
                                let msg = 'Falha no processo de atualizacao do status do usuario '+dadosOrigem.uid+' | '+err
                                console.log(msg)
                                reject(msg)
                            })

                        })
                    }
                    else
                    {

                        //ADICIONAR AOS USUARIOS
                        Usuarios.create({
                            empresaUid:dadosOrigem.idCliente,
                            usuarioNome:dadosOrigem.nome,
                            departamento:dadosOrigem.configUser.departamento,
                            sequencia:0,
                            online:statusOnline,
                            usuarioUid:dadosOrigem.uid
            
                        })
                        .then(function(){
                            let msg = 'Criada sessao de usuario'
                            console.log(msg)
                            resolve(msg)
                        })
                        .catch(function(err:any){
                            let msg = 'Falha ao criar usuario nao existente  | '+err
                            reject(msg)
                        })

                       
                    }

                })
                .catch(function(err:any){
                    let msg = 'Falha ao consultar tabela de usuarios |'+err
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
    }
}
export default modelUsuarioOnline;