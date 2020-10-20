
import { db } from '../index';
import logreg from '../model/log'
import { isNumber, isDate } from 'util';

const Api = {
    
    async validarCampos(colecao:string,dados:any):Promise<any>
    {
        const colecoesativas = ["finBoletoAdd"]
        return new Promise((resolve, reject) => {
            
            let checkColecao = colecoesativas.reduce( function( cur, val, index ){

                if( val === colecao && cur === -1 ) {
                    return index;
                }
                return cur;
            
            }, -1 );

            if(checkColecao > -1)
            {
                if(colecao == 'finBoletoAdd')
                {

                    //VERIFICAR CAMPOS
                    if(dados.hasOwnProperty('identificacao') && dados.hasOwnProperty('pagador'))
                    {
                       reject('Bloco identificacao e pagador nao podem ser enviados em conjunto')
                    }
                    if(!dados.hasOwnProperty('identificacao'))
                    {
                        if(!dados.hasOwnProperty('pagador'))
                        {
                            reject('Obrigatorio informar bloco de indentificacao ou pagador ')
                        }

                        
                    }
                    if(!dados.hasOwnProperty('pagador'))
                    {
                        if(!dados.hasOwnProperty('identificacao'))
                        {
                            reject('Obrigatorio informar bloco de indentificacao ou pagador ')
                        }

                        
                    }
                    if(!dados.hasOwnProperty('dadosOperacao'))
                    {
                        reject('Obrigatorio informar bloco de dadosOperacao')
                    }
                    else
                    {
                        if(!dados.dadosOperacao.hasOwnProperty('valor'))
                        {
                           
                            reject('Obrigatoro informar dadosOperacao.valor')
                            
                        }
                        else
                        {
                            if(!isNumber(dados.dadosOperacao.valor ))
                            {
                                reject('dadosOperacao.valor nao e um valor valido ')
                            }
                            else
                            {
                                if(dados.dadosOperacao.valor <= 10  )
                                {
                                    reject('dadosOperacao.valor valor informado abaixo do minimo  ')
                                }
                                else
                                {
                                    const qtdDecimais = dados.dadosOperacao.valor.toString().split('.')
                                    if(qtdDecimais.lengeth <= 0 )
                                    {
                                        reject('dadosOperacao.valor valor sem informacao de casas decimais ex.: 0.00 | necessário 2 casas decimais ')
                                    }
                                }
                            }
                        }


                        if(!dados.dadosOperacao.hasOwnProperty('vencimento'))
                        {
                            reject('Obrigatorio informar dadosOperacao.vencimento ')
                        }
                        else
                        {
                            let dado1 = dados.dadosOperacao.vencimento.split('-')
                            let dataFormt = new Date(Number(dado1[0]),Number(dado1[1])-1,Number(dado1[2])+1,0,0,0,0)
                            let dataSpam = dataFormt.getTime()
                            let dataAtual = new Date().getTime()

                            if(!isDate(dataFormt))
                            {
                                reject('dadosOperacao.vencimento nao e um valor valido  '+JSON.stringify(dado1))
                            }
                            else
                            {
                                if(dataSpam < dataAtual)
                                {
                                    reject('Data informada nao pode ser aceita ')
                                }
                            }
                        }
                    }

                    if(!dados.hasOwnProperty('dadosConf'))
                    {
                        reject('Obrigatorio informar bloco de dadosConf')
                    }
                    else{
                        if(!dados.dadosConf.hasOwnProperty('campainha'))
                        {
                            reject('Obrigatorio informar dadosConf.campainha ')
                        }
                        if(!dados.dadosConf.hasOwnProperty('identInterno'))
                        {
                            reject('Obrigatorio informar dadosConf.identInterno')
                        }
                    }

                  

                    resolve()



                }
            }
            else
            {
                reject('Funcao nao ativa '+colecao)
            }
        
        })

    },
    async ReceberRequisicao(empresaUid:string,colecao:string,ipCliente:any,dadosReq:any):Promise<any> {

        return new Promise((resolve, reject) => {
            try {


                Api.validarCampos(colecao,dadosReq)
                .then(resValidador=>{

                    let dado1 = dadosReq.dadosOperacao.vencimento.split('-')
                    let dataFormt = new Date(Number(dado1[0]),Number(dado1[1])-1,Number(dado1[2])+1,0,0,0,0)
                    let dataSpam = dataFormt.getTime()

                    
                    const logData = {
                        createAt: new Date().getTime(),
                        empresaUid,
                        situacao:1,
                        colecao,
                        ipCliente,
                        dadosReq,
                        vencimentoTimeSpam:dataSpam
                      };
                
                      db.collection('reqapi').add(logData)
                      .then(resAdd=>{
                          //LOG
                          const parametros = {
                              ipCliente,
                              'nivel':'leve',
                              'msg':'SUC - Requisicao recebida com sucesso '+colecao+' protocolo '+resAdd.id,
                              dados:dadosReq
                          }
                          logreg.Inserir(empresaUid,parametros,"api")
                          .catch(err2=>{
                              console.log('Falha ao registrar log')
                          })
                          resolve(resAdd.id)
                      })
                      .catch((err)=>{
                          //LOG
                          const parametros = {
                              ipCliente,
                              'nivel':'moderado',
                              'msg':'Falha ao recepcionar solicitacao '+colecao,
                              dados:dadosReq
                          }
                          logreg.Inserir(empresaUid,parametros,"api")
                          .catch(err2=>{
                              console.log('Falha ao registrar log')
                          })
                          reject('Nao processado')
                      })
                })
                .catch(errValidados=>{
                   
                    //LOG
                    const parametros = {
                        ipCliente,
                        'nivel':'leve',
                        'msg':'ERR - Arquivo formatacao invalida  '+errValidados,
                        dados:dadosReq
                    }
                    logreg.Inserir(empresaUid,parametros,"api")
                    .catch(err2=>{
                        console.log('Falha ao registrar log')
                    })
                    reject(errValidados)
                })


                
                
              } catch(err) {
                //LOG
                const parametros = {
                    ipCliente,
                    'nivel':'critico',
                    'msg':'FALHA FATAL '+err,
                    dados:dadosReq
                }
                logreg.Inserir(empresaUid,parametros,"api")
                .catch(err2=>{
                    console.log(err2)
                })
                reject()
              }
        })

       
      },
}
export default Api;