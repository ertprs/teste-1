import { db } from '../index';
const fetch = require("node-fetch");
const Enotas = {
    async ProcessarCadastroEmpresa(dados:any):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            let key  = "Mjg3ZGFmZTctYmYxNC00MmRkLTk4YTEtMGI4Yjk1NzcwNjAw"

            const url =  "https://api.enotasgw.com.br/v2/empresas";
            const options = {
                method: 'POST',
                body: JSON.stringify(dados),
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic '+key
                }
            };
            console.log(JSON.stringify(dados))
            fetch(url,options).then((response:any)=>{
                console.log('Estagio 1')
                console.log(response)
                const { status } = response;
                response.json().then((data:any)=>{
                    console.log('Estagio 2')
                    console.log(data)
                    if(status === 200) {
                        console.log('Estagio 3')
                        resolve(data)
                    }
                    else
                    {
                        console.log('Estagio 4')
                        let msg = "Falha 2|  "+status
                        console.log(msg)
                        reject(msg)
                    }
                })
                .catch((err:any)=>{
                    console.log('Estagio 5')
                    let msg = "Falha 1|  "+err
                    console.log(msg)
                    reject(msg)
                })
    
               
            })
            .catch((err:any)=>{
                console.log('Estagio 6')
                let msg = "Falha 0|  "+err
                console.log(msg)
                reject(msg)
            })
           


            
        })
    },

    async EnviarNFe(empresaUid:string,notaUid:string):Promise<any>
    {
        return new Promise((resolve,reject)=>{
            //ABRIOR DADOS DA EMPRESA
            // /ubdcX3PtFa3uQPY9BXCR/dados/configuracao/empresa
            db.collection(empresaUid).doc('dados').collection('configuracao').doc('empresa').get()
            .then(resEmpresa=>{
                if(resEmpresa.exists)
                {
                    const dadosEmpresa =<any> resEmpresa.data()
                    if(dadosEmpresa.hasOwnProperty('eNotasUid'))
                    {
                        let enotaUid = dadosEmpresa.eNotasUid

                        //PEGAR DADOS DA NOTA

                        // /ubdcX3PtFa3uQPY9BXCR/dados/fiscal/registros/notas

                        db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).get()
                        .then(resNota=>{
                            if(resNota.exists)
                            {
                                const dadosNota = <any> resNota.data()
                                const JsonSend = dadosNota.jsonPrep
                                //ENVIAR E-NOTAS
                                let url = "https://api.enotasgw.com.br/v2/empresas/"+enotaUid+"/nf-e"

                                const options = {
                                    method: 'POST',
                                    body: JsonSend,
                                    headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': 'Basic Mjg3ZGFmZTctYmYxNC00MmRkLTk4YTEtMGI4Yjk1NzcwNjAw'
                                    }
                                };
                            
                                fetch(url,options).then((response:any)=>{
                                    console.log('Estagio 1')
                                    console.log(JSON.stringify( response))
                                    const { status } = response;
                                   
                                        console.log('Estagio 2')
                                        
                                        if(status === 200) {
                                            console.log('Estagio 3')

                                            const dadosAtualizacao = {
                                                dadosNota:{
                                                    situacaoCod:2,
                                                    situacaoNome:'Aguardando retorno da SEFAZ'
                                                }
                                            }
                                            db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                                            .then(()=>{
                                                resolve({situacao:'suc',code:0,msg:'Aguardando retorno da SEFAZ'})
                                            })
                                            .catch(err=>{
                                                console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                                            })

                                            
                                        }
                                        else
                                        {
                                            console.log('Estagio 4')
                                            let msg = "Falha 2|  "+status
                                            console.log(msg)
                                            

                                            const dadosAtualizacao = {
                                                dadosNota:{
                                                    situacaoCod:0,
                                                    situacaoNome:'',
                                                    nfeMotivoStatus:msg
                                                }
                                            }
                                            db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                                            .then(()=>{
                                                reject(msg)
                                            })
                                            .catch(err=>{
                                                console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                                            })


                                        }
                                    
                                })
                            }
                            else
                            {
                                let msg = 'dados da nota nao existem'
                                console.log(msg)
                                const dadosAtualizacao = {
                                    dadosNota:{
                                        situacaoCod:0,
                                        situacaoNome:'',
                                        nfeMotivoStatus:msg
                                    }
                                }
                                db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                                .then(()=>{
                                    reject(msg)
                                })
                                .catch(err=>{
                                    console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                                })
                            }
                        })
                        .catch(errNota=>{
                            let msg = 'Falha ao abrir dados da nota | '+errNota
                            console.log(msg)
                            const dadosAtualizacao = {
                                dadosNota:{
                                    situacaoCod:0,
                                    situacaoNome:'',
                                    nfeMotivoStatus:msg
                                }
                            }
                            db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                            .then(()=>{
                                reject(msg)
                            })
                            .catch(err=>{
                                console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                            })
                        })
                    }
                    else
                    {
                        let msg = 'Não existe uma chave valida para envio. ENtre em contato com suporte técnico'
                        console.log(msg)
                        const dadosAtualizacao = {
                            dadosNota:{
                                situacaoCod:0,
                                situacaoNome:'',
                                nfeMotivoStatus:msg
                            }
                        }
                        db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                        .then(()=>{
                            reject(msg)
                        })
                        .catch(err=>{
                            console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                        })
                    }
                    
                    

                }
                else
                {
                    let msg = 'Dados da empresa nao foram encontrados'
                    console.log(msg)
                    const dadosAtualizacao = {
                        dadosNota:{
                            situacaoCod:0,
                            situacaoNome:'',
                            nfeMotivoStatus:msg
                        }
                    }
                    db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                    .then(()=>{
                        reject(msg)
                    })
                    .catch(err=>{
                        console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                    })
                }
            })
            .catch(errEmpresa=>{
                let msg = 'Falha ao abrir dados da empresa | '+errEmpresa
                console.log(msg)
                const dadosAtualizacao = {
                    dadosNota:{
                        situacaoCod:0,
                        situacaoNome:'',
                        nfeMotivoStatus:msg
                    }
                }
                db.collection(empresaUid).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizacao,{merge:true})
                .then(()=>{
                    reject(msg)
                })
                .catch(err=>{
                    console.log('FATAL ERRO AO ATUALIZAR INFORMACAO DE STATUS DE RETORNO ')
                })
            })
        })
    },
    async HabilitarEmpresa(empresaUid:any):Promise<any> {
        console.log('Habilitar empresa versao 1.0.1')
        return new Promise ((resolve,reject)=>{
            ///QmPJcDIMLJBshGe9LDv2/dados/configuracao/empresa
            db.collection(empresaUid).doc('dados').collection('configuracao').doc('empresa').get().then(elem=>{
                if(elem.exists)
                {
                    const dados = <any>elem.data()
                    let optanteSimplesNacional = true
                    if(dados.optanteSimplesNacional === "false")
                    {
                        optanteSimplesNacional = false
                    }
                    const dadosSend = {
                        id:null,
                        cnpj:dados.cnpj,
                        inscricaoEstadual:dados.inscricaoEstadual,
                        inscricaoMunicipal:dados.inscricaoMunicipal,
                        razaoSocial:dados.razaoSocial,
                        nomeFantasia:dados.nomeFantasia,
                        optanteSimplesNacional,
                        email:dados.email,
                        telefoneComercial:dados.telefoneComercial,
                        regimeEspecialTributacao:dados.regimeEspecialTributacao,
                        endereco:{
                            uf:dados.endereco.uf,
                            cidade:dados.endereco.cidade,
                            logradouro:dados.endereco.logradouro,
                            numero:dados.endereco.numero,
                            complemento:dados.endereco.complemento,
                            bairro:dados.endereco.bairro,
                            cep:dados.endereco.cep,
                            codigoIbgeUf:dados.endereco.codigoIbgeUf,
                            codigoIbgeCidade:dados.endereco.codigoIbgeCidade,
                            pais:dados.endereco.pais
                        },
                        emissaoNFeProduto:{
                            ambienteProducao:{
                                sequencialNFe:dados.emissaoNFeProduto.ambienteProducao.sequencialNFe,
                                serieNFe:dados.emissaoNFeProduto.ambienteProducao.serieNFe,
                                sequencialLoteNFe:dados.emissaoNFeProduto.ambienteProducao.sequencialLoteNFe
                            },
                            ambienteHomologacao:{
                                sequencialNFe:dados.emissaoNFeProduto.ambienteHomologacao.sequencialNFe,
                                serieNFe:dados.emissaoNFeProduto.ambienteHomologacao.serieNFe ,
                                sequencialLoteNFe:dados.emissaoNFeProduto.ambienteHomologacao.sequencialLoteNFe
                            }
                        }
                    }

                    

                    if(dados.hasOwnProperty('eNotasUid'))
                    {
                        //ATUALIZAR DADOS
                        dadosSend.id = dados.eNotasUid
                    }
                    
                    Enotas.ProcessarCadastroEmpresa(dadosSend).then(resProc=>{
                        console.log('PRocessando aqui 1')
                        
                        const data = resProc
                        resolve({situacao:'suc',code:0,msg:'processado',data})
                    })
                    .catch(errProc=>{
                        let msg = "Falha no processo de cadastro da empresa"
                        console.log(msg)
                        reject({situacao:'err',code:0,msg})
                    })



                }
                else
                {
                    let msg = 'Não existe documento de configuração para esta empresa - '+empresaUid
                    console.log(msg)
                    reject({situacao:'err',code:0,msg})
                }
            })
            .catch(errAbrirDados=>{
                let msg = 'Falha ao abrir dados de configuracao | '+errAbrirDados
                console.log(msg)
                reject({situacao:'err',code:0,msg})
            })
        })
        
    }
}
export default Enotas;