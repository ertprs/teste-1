import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/global/user.service';

@Injectable({
  providedIn: 'root'
})
export class FiscalService {

  private idCliente:string;
  constructor(
    private DB:AngularFirestore,
    private global:UserService,
    private afa:AngularFireAuth,
    private afFunction:AngularFireFunctions
  ) { }
  EnviarNotaEnotas(notaUid:string)
  {
    const parametrosDados = {
      empresaUid:this.global.dadosLogado.idCliente,
      notaUid
    }
    const callable = this.afFunction.httpsCallable('appFiscalEnotasEnviarNFE');
    
    const obs = callable(parametrosDados)
    return obs
    //obs.subscribe(async (res:any) => {
  }
  ncmAdd(dados:any)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;
    dados.createAt      = new Date().getTime()
    dados.usuarioUid    = this.afa.auth.currentUser.uid
    dados.usuarioNome   = this.afa.auth.currentUser.displayName  

    let ipiSitTrib      = dados.ipi.situacaoTributariaSelect.split('|')
    dados.ipi.situacaoTributaria = ipiSitTrib[0]
    dados.ipi.situacaoTributariaNome = ipiSitTrib[1]


    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm').add(dados)
  }
  ncmGet(ncmUid:string)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;


    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm').doc(ncmUid).get()
  }
  ncmGetAll()
  {
    this.idCliente      = this.global.dadosLogado.idCliente;


    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm').get()
  }
  ncmDelete(ncmUid)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;


    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm').doc(ncmUid).delete()
  }
  ncmReferenciaAdd(ncmNumero:string,dados:any)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;
    dados.createAt      = new Date().getTime()
    dados.usuarioUid    = this.afa.auth.currentUser.uid
    dados.usuarioNome   = this.afa.auth.currentUser.displayName  

    let icmsSituacaoTributario = dados.situacaoTributariaSelect.split('|')
    dados.situacaoTributaria = icmsSituacaoTributario[0]
    dados.situacaoTributariaNome = icmsSituacaoTributario[1]

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm_'+ncmNumero).doc(dados.uf).set(dados,{merge:true})
  }
  ncmReferenciaGetAll(ncmNumero:string)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm_'+ncmNumero).get()
  }
  ncmReferenciaDelete(ncmNumero:string,referenciaUid:string)
  {
    this.idCliente      = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('ncm_'+ncmNumero).doc(referenciaUid).delete()
  }
  notaAdd(dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      dados.createAt        = new Date().getTime()
      dados.usuarioNome     = this.afa.auth.currentUser.displayName
      dados.usuarioUid      = this.afa.auth.currentUser.uid

      this.idCliente = this.global.dadosLogado.idCliente;

      this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('notas').add(dados)
      .then(resAdd=>{
        let notaUid = resAdd.id
        this.DB.collection(this.idCliente).doc('dados').collection('comercial').doc('movimentacao').collection('lancamentos').doc(dados.pedidoUid).set({notaUid,situacaoCod:1,situacaoNome:'Aguardando faturamento'},{merge:true})
        .then(UpdateComercial=>{
          this.NotapreEmissaoDeNota(notaUid,dados)
          .then(resPrepNota=>{

            //ATUALIZAR JSON E TRAVAR NOTA
            //dadosNota.travarNota
            const jsonPrep = resPrepNota
            const dadosAtualizar = {
              jsonPrep,

              dadosNota:{
                travarNota:true,
                situacaoCod:1,
                situacaoNome:'Iniciando envio',
                nfeMotivoStatus:''
              }
            }
            this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizar,{merge:true})
            .then(resUpdateNotaFinal=>{
              resolve(resAdd)
            })
            .catch(errUpdateNotaFinal=>{
              reject(errUpdateNotaFinal)
            })

          })
          .catch(errPrepNota=>{
            reject(errPrepNota)
          })
        })
        .catch(errUpdateComercial=>{
          reject(errUpdateComercial)
        })
      })
      .catch(errAdd=>{
        reject(errAdd)
      })
    })
    

  }
  notaAtualizar(notaUid:string,dados:any):Promise<any>
  {
    return new Promise((resolve,reject)=>{
      dados.createAt        = new Date().getTime()
      dados.usuarioNome     = this.afa.auth.currentUser.displayName
      dados.usuarioUid      = this.afa.auth.currentUser.uid

      this.idCliente = this.global.dadosLogado.idCliente;

      this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dados,{merge:true})
      .then(resAdd=>{
        
        this.DB.collection(this.idCliente).doc('dados').collection('comercial').doc('movimentacao').collection('lancamentos').doc(dados.pedidoUid).set({notaUid,situacaoCod:1,situacaoNome:'Aguardando faturamento'},{merge:true})
        .then(UpdateComercial=>{
          this.NotapreEmissaoDeNota(notaUid,dados)
          .then(resPrepNota=>{

            //ATUALIZAR JSON E TRAVAR NOTA
            //dadosNota.travarNota
            const jsonPrep = resPrepNota
            const dadosAtualizar = {
              jsonPrep,

              dadosNota:{
                travarNota:true,
                situacaoCod:1,
                situacaoNome:'Iniciando envio',
                nfeMotivoStatus:''
              }
            }
            this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).set(dadosAtualizar,{merge:true})
            .then(resUpdateNotaFinal=>{
              resolve({id:notaUid})
            })
            .catch(errUpdateNotaFinal=>{
              reject(errUpdateNotaFinal)
            })

          })
          .catch(errPrepNota=>{
            reject(errPrepNota)
          })
        })
        .catch(errUpdateComercial=>{
          reject(errUpdateComercial)
        })
      })
      .catch(errAdd=>{
        reject(errAdd)
      })
    })
    

  }
  notaGet(notaUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('notas').doc(notaUid).snapshotChanges().pipe(
      map(a => {
        const data = <any> a.payload.data();
        const id = a.payload.id;
        const dadosReturno = {
          id,
          ... data
        }
        return dadosReturno
      }))
  }
  notaGetAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('registros').collection('notas').get()
  }
  NotapreEmissaoDeNota(notaUid:string,informacoesoNota:any):Promise<any>
  {

    return new Promise((resolve,reject)=>{
     
      const JsonProcesso = []
      this.idCliente = this.global.dadosLogado.idCliente;
      let consumidorFinal = false;
      let enviarPorEmail = false
      let idNOta = this.idCliente+"-"+notaUid+"-"+informacoesoNota.dadosNota.ambienteEmissao.substring(0,1)
      console.log('ID NOTA '+idNOta)
      if(informacoesoNota.dadosNota.consumidorFinal.toLowerCase() == "sim")
      {
        consumidorFinal = true
      }
      if(informacoesoNota.dadosNota.enviarPorEmail.toLowerCase() == "sim")
      {
        enviarPorEmail = true
      }

      let dadosCliente = {
        tipoPessoa:"",
        indicadorContribuinteICMS:"Contribuinte",
        nome:"",
        email:"",
        telefone:"",
        cpfCnpj:"",
        inscricaoEstadual:"",
        endereco:{
          uf:"",
          cidade:"",
          logradouro:"",
          numero:"",
          complemento:"",
          bairro:"",
          cep:"",
          pais:"BRASIL"
        }
      }

     
     
      /// /X3xjHSDVvfSjHJMUbnyB/dados/parceiros/x5X7G5RgtGEx3L7zXJua
      this.DB.collection(this.idCliente).doc('dados').collection('parceiros').doc(informacoesoNota.dadosNota.parceiroUid).get().forEach(elementParceiro=>{
        if(elementParceiro.exists)
        {
          const dadosParceiro = elementParceiro.data()
          let tipoPessoa = "J"
          if(dadosParceiro.documento.length < 12)
          {
            tipoPessoa = "f"
          }
          dadosCliente.tipoPessoa           = tipoPessoa
          dadosCliente.nome                 = dadosParceiro.razaoSocial
          dadosCliente.email                = dadosParceiro.contato.email
          dadosCliente.telefone             = String( dadosParceiro.contato.telefone)
          dadosCliente.cpfCnpj              = dadosParceiro.documento
          dadosCliente.inscricaoEstadual    = dadosParceiro.inscricaoIE
          dadosCliente.endereco.uf          = dadosParceiro.endereco.estado
          dadosCliente.endereco.cidade      = dadosParceiro.endereco.cidade
          dadosCliente.endereco.logradouro  = dadosParceiro.endereco.logradouro+" "+dadosParceiro.endereco.endereco
          dadosCliente.endereco.numero      = dadosParceiro.endereco.numero
          dadosCliente.endereco.complemento = dadosParceiro.endereco.complemento
          dadosCliente.endereco.bairro      = dadosParceiro.endereco.bairro
          dadosCliente.endereco.cep         = dadosParceiro.endereco.cep
          

          //ITENS
          let itensAdd = []

       

          // /X3xjHSDVvfSjHJMUbnyB/dados/comercial/movimentacao_itens/8315ujo78u2bKKOVB9l1/3Xu4T5l6CoxrEOAEbrF8
          
          let itensColetados =  this.DB.collection(this.idCliente).doc('dados').collection('comercial').doc('movimentacao_itens').collection(informacoesoNota.pedidoUid).get().subscribe(retItensElement=>{
            if(!retItensElement.empty)
            {
              let totalCalculoST        = 0;
              let totalCalculoProdutos  = 0

              let qtdVolumes = 0
              let totalPesoL = 0
              let totalPesoB = 0

              for (const docItems of retItensElement.docs) {

                 const dataItem = <any>docItems.data()

                  //calculo ST
                  totalCalculoST = totalCalculoST + Number(dataItem.impostos.icms.valorST)
                  totalCalculoProdutos = totalCalculoProdutos + Number(dataItem.vrTotal)
                  console.log("###### "+ totalCalculoProdutos + " ###### ")
                  //CALCULANDO PESO
                  let pesoL = Number(dataItem.pesoL)*dataItem.quantidade
                  let pesoB = Number(dataItem.pesoB)*dataItem.quantidade
                  totalPesoL = totalPesoL + pesoL
                  totalPesoB = totalPesoB + pesoB
                  qtdVolumes = qtdVolumes + dataItem.quantidade

                 let itemJSON = {
                  cfop:dataItem.cfop,
                  codigo:dataItem.codigo,
                  descricao:dataItem.descricao,
                  ncm:dataItem.ncm,
                  cest:dataItem.cest,
                  quantidade:dataItem.quantidade,
                  unidadeMedida:dataItem.unidadeMedida,
                  valorUnitario:dataItem.vrUnitario,
                  impostos:{
                    icms:{
                      situacaoTributaria:dataItem.impostos.icms.situacaoTributaria,
                      origem:Number(dataItem.impostos.icms.origem),
                      aliquota:Number( dataItem.impostos.icms.aliquota),
                     
                      aliquotaST: Number( dataItem.impostos.icms.aliquotaST),
                      percentualMargemValorAdicionadoST: Number( dataItem.impostos.icms.percentualMargemValorAdicionadoST),
                      modalidadeBaseCalculoST: Number(4),
                      baseCalculoST: Number(dataItem.impostos.icms.baseCalculoST),
                      valorST:Number(dataItem.impostos.icms.valorST)
                      
                      
                    },
                    pis:{
                      situacaoTributaria:dataItem.impostos.pis.situacaoTributaria,
                      porAliquota:{
                        aliquota:Number(dataItem.impostos.pis.porAliquota.aliquota)
                      } 
                    },
                    cofins:{
                      situacaoTributaria:dataItem.impostos.cofins.situacaoTributaria,
                      porAliquota:{
                        aliquota:Number(dataItem.impostos.cofins.porAliquota.aliquota)
                      } 
                    },
                    ipi:{
                      situacaoTributaria:dataItem.impostos.ipi.situacaoTributaria,
                      porAliquota:{
                        aliquota:Number(dataItem.impostos.ipi.porAliquota.aliquota)
                      } 
                    }

                  }


                 


                 }
                 
                 itensAdd.push(itemJSON)
              }

              console.log("###### TOTAL : "+ totalCalculoProdutos + " ###### ")
              

              

              if(informacoesoNota.dadosNota.transportadoraUid && informacoesoNota.dadosNota.transportadoraUid!= '')
              {
                let dadosTransportadora = {
                  usarDadosEmitente:false,
                  tipoPessoa:"",
                  CpfCnpj:"Contribuinte",
                  nome:"",
                  inscricaoEstadual:"",
                  endereco:"",
                  cidade:"",
                  uf:""
                }

                //DADOS DE TRANSPORTADORA
                this.DB.collection(this.idCliente).doc('dados').collection('parceiros').doc(informacoesoNota.dadosNota.transportadoraUid).get().forEach(elementTransportadora=>{
                  if(elementTransportadora.exists)
                  {
                    const RetdadosTransportadora = elementTransportadora.data()
                    console.log('##########')
                    console.warn(RetdadosTransportadora)
                    dadosTransportadora.tipoPessoa          = "J"
                    dadosTransportadora.CpfCnpj             = RetdadosTransportadora.documento,
                    dadosTransportadora.nome                = RetdadosTransportadora.razaoSocial,
                    dadosTransportadora.inscricaoEstadual   = RetdadosTransportadora.inscricaoIE,
                    dadosTransportadora.endereco            = RetdadosTransportadora.endereco.logradouro+" "+dadosParceiro.endereco.endereco
                    dadosTransportadora.cidade              = RetdadosTransportadora.endereco.cidade
                    dadosTransportadora.uf                  = RetdadosTransportadora.endereco.estado
                    console.warn(dadosTransportadora)

                  
                    let ParcelasLancadas = []
                    let cobranca = {
                      fatura:{
                        numero:String( new Date().getTime()),
                        desconto:0.00,
                        valorOriginal:totalCalculoProdutos+totalCalculoST
                      },
                      parcelas:[]
                    }
                    this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros_notas').collection(informacoesoNota.pedidoUid,ref=>ref.orderBy('vencimentoInt','asc')).get().subscribe(retParcelarElement=>{
                      if(!retParcelarElement.empty)
                      {
                        let contParcela = 0;
                        let totalVencimento = 0
                        let contandoParcela = 0
                        let qtdParcelas = retParcelarElement.size
                        let totalPorParcela = totalCalculoProdutos/qtdParcelas
                        console.log('')
                        for (const docParcelas of retParcelarElement.docs) {
                          contParcela++
                          const dataItemParcela = <any>docParcelas.data()
                          totalVencimento = totalVencimento + Number(totalPorParcela)
                          const dadosParcelaAddd = {
                            numero:"00"+String(contParcela),
                            valor:Number(totalPorParcela),
                            vencimento:dataItemParcela.dataEnotas
    
                          }
                          if(contandoParcela == 0 && totalCalculoST > 0)
                          {
                            dadosParcelaAddd.valor = dadosParcelaAddd.valor + totalCalculoST
                          }
                          contandoParcela++


                          ParcelasLancadas.push(dadosParcelaAddd)
    
                        }
                        cobranca.fatura.valorOriginal = totalVencimento+totalCalculoST
                        cobranca.parcelas = ParcelasLancadas
    
    
                        //COM COBRANCA
                        //COM COBRANCA E SEM TRANSPORTADORA

                        //DEFINIR DADOS DE VOLUMES
                        let volumeQuantidade = informacoesoNota.transporte.volume.quantidade
                        if(volumeQuantidade == 0)
                        {
                          volumeQuantidade = qtdVolumes
                        }

                        let volumePesoL = informacoesoNota.transporte.volume.pesoLiquido
                        if(volumePesoL == 0)
                        {
                          volumePesoL = totalPesoL
                        }

                        let volumePesoB = informacoesoNota.transporte.volume.pesoBruto
                        if(volumePesoB == 0)
                        {
                          volumePesoB = totalPesoL
                        }


                        const Json1 = {
                          id:idNOta,
                          ambienteEmissao:informacoesoNota.dadosNota.ambienteEmissao,
                          naturezaOperacao:informacoesoNota.dadosNota.naturezaOperacao,
                          tipoOperacao:informacoesoNota.dadosNota.tipoOperacao,
                          finalidade:informacoesoNota.dadosNota.finalidade,
                          consumidorFinal,
                          enviarPorEmail,
                          cobranca,
                          cliente:dadosCliente,
                          itens:itensAdd,
                          transporte:{
                            frete:{
                              modalidade:informacoesoNota.transporte.frete.modalidade,
                              valor:null
                            },
                            transportadora:dadosTransportadora,
                            volume:{
                              quantidade:volumeQuantidade,
                              especie:informacoesoNota.transporte.volume.especie,
                              marca:informacoesoNota.transporte.volume.marca,
                              numeracao:informacoesoNota.transporte.volume.numeracao,
                              pesoLiquido:volumePesoL,
                              pesoBruto:volumePesoB
                            }
                          },
                          informacoesAdicionais:informacoesoNota.informacoesAdicionais
                        }
              
                        resolve(JSON.stringify(Json1))
    
                      }
                      else
                      {
                        //DEFINIR DADOS DE VOLUMES
                        /* 
                        volume:{
                              quantidade:volumeQuantidade,
                              especie:informacoesoNota.transporte.volume.especie,
                              marca:informacoesoNota.transporte.volume.marca,
                              numeracao:informacoesoNota.transporte.volume.numeracao,
                              pesoLiquido:volumePesoL,
                              pesoBruto:volumePesoB
                        }*/
                        let volumeQuantidade = informacoesoNota.transporte.volume.quantidade
                        if(volumeQuantidade == 0)
                        {
                          volumeQuantidade = qtdVolumes
                        }

                        let volumePesoL = informacoesoNota.transporte.volume.pesoLiquido
                        if(volumePesoL == 0)
                        {
                          volumePesoL = totalPesoL
                        }

                        let volumePesoB = informacoesoNota.transporte.volume.pesoBruto
                        if(volumePesoB == 0)
                        {
                          volumePesoB = totalPesoL
                        }

                        //COM COBRANCA E SEM TRANSPORTADORA
                        const Json1 = {
                          id:idNOta,
                          ambienteEmissao:informacoesoNota.dadosNota.ambienteEmissao,
                          naturezaOperacao:informacoesoNota.dadosNota.naturezaOperacao,
                          tipoOperacao:informacoesoNota.dadosNota.tipoOperacao,
                          finalidade:informacoesoNota.dadosNota.finalidade,
                          consumidorFinal,
                          enviarPorEmail,
                          
                          cliente:dadosCliente,
                          itens:itensAdd,
                          transporte:{
                            frete:{
                              modalidade:informacoesoNota.transporte.frete.modalidade,
                              valor:null
                            },
                            transportadora:dadosTransportadora,
                            volume:{
                              quantidade:volumeQuantidade,
                              especie:informacoesoNota.transporte.volume.especie,
                              marca:informacoesoNota.transporte.volume.marca,
                              numeracao:informacoesoNota.transporte.volume.numeracao,
                              pesoLiquido:volumePesoL,
                              pesoBruto:volumePesoB
                            }
                          },
                          informacoesAdicionais:informacoesoNota.informacoesAdicionais
                        }
              
                        resolve(JSON.stringify(Json1))
                      }
                    
                    })
                    
                    
                  
                  }
                  else
                  {
                    reject('Não existem dados da transportadora '+informacoesoNota.dadosNota.transportadoraUid)
                  }
                })
              }
              else
              {


                //COBRANCA
                let ParcelasLancadas = []
                let cobranca = {
                  fatura:{
                    numero:String( new Date().getTime()),
                    desconto:0.00,
                    valorOriginal:0.00
                  },
                  parcelas:[]
                }
                this.DB.collection(this.idCliente).doc('dados').collection('financeiro').doc('registros_notas').collection(informacoesoNota.pedidoUid,ref=>ref.orderBy('vencimentoInt','asc')).get().subscribe(retParcelarElement=>{
                  if(!retParcelarElement.empty)
                  {
                    let contParcela = 0;
                        let totalVencimento = 0
                        let contandoParcela = 0
                        let qtdParcelas = retParcelarElement.size
                        let totalPorParcela = totalCalculoProdutos/qtdParcelas
                       
                        for (const docParcelas of retParcelarElement.docs) {
                          contParcela++
                          const dataItemParcela = <any>docParcelas.data()
                          totalVencimento = totalVencimento + Number(totalPorParcela)
                          const dadosParcelaAddd = {
                            numero:"00"+String(contParcela),
                            valor:Number(totalPorParcela),
                            vencimento:dataItemParcela.dataEnotas
    
                          }
                          if(contandoParcela == 0 && totalCalculoST > 0)
                          {
                            dadosParcelaAddd.valor = dadosParcelaAddd.valor + totalCalculoST
                          }
                          contandoParcela++


                          ParcelasLancadas.push(dadosParcelaAddd)
    
                        }
                        cobranca.fatura.valorOriginal = totalVencimento+totalCalculoST
                        cobranca.parcelas = ParcelasLancadas

                    //DEFINIR DADOS DE VOLUMES
                    /* 
                    volume:{
                          quantidade:volumeQuantidade,
                          especie:informacoesoNota.transporte.volume.especie,
                          marca:informacoesoNota.transporte.volume.marca,
                          numeracao:informacoesoNota.transporte.volume.numeracao,
                          pesoLiquido:volumePesoL,
                          pesoBruto:volumePesoB
                    }*/
                    let volumeQuantidade = informacoesoNota.transporte.volume.quantidade
                    if(volumeQuantidade == 0)
                    {
                      volumeQuantidade = qtdVolumes
                    }

                    let volumePesoL = informacoesoNota.transporte.volume.pesoLiquido
                    if(volumePesoL == 0)
                    {
                      volumePesoL = totalPesoL
                    }

                    let volumePesoB = informacoesoNota.transporte.volume.pesoBruto
                    if(volumePesoB == 0)
                    {
                      volumePesoB = totalPesoL
                    }


                    //COM COBRANCA
                    const Json1 = {
                      id:idNOta,
                      ambienteEmissao:informacoesoNota.dadosNota.ambienteEmissao,
                      naturezaOperacao:informacoesoNota.dadosNota.naturezaOperacao,
                      tipoOperacao:informacoesoNota.dadosNota.tipoOperacao,
                      finalidade:informacoesoNota.dadosNota.finalidade,
                      consumidorFinal,
                      enviarPorEmail,
                      cobranca,
                      cliente:dadosCliente,
                      itens:itensAdd,
                      transporte:{
                        frete:{
                          modalidade:informacoesoNota.transporte.frete.modalidade,
                          valor:null
                        },
                        volume:{
                          quantidade:volumeQuantidade,
                          especie:informacoesoNota.transporte.volume.especie,
                          marca:informacoesoNota.transporte.volume.marca,
                          numeracao:informacoesoNota.transporte.volume.numeracao,
                          pesoLiquido:volumePesoL,
                          pesoBruto:volumePesoB
                        }
                      },
                      informacoesAdicionais:informacoesoNota.informacoesAdicionais
                    }
                    
          
                    resolve(JSON.stringify(Json1))

                  }
                  else
                  {

                    //DEFINIR DADOS DE VOLUMES
                    /* 
                    volume:{
                          quantidade:volumeQuantidade,
                          especie:informacoesoNota.transporte.volume.especie,
                          marca:informacoesoNota.transporte.volume.marca,
                          numeracao:informacoesoNota.transporte.volume.numeracao,
                          pesoLiquido:volumePesoL,
                          pesoBruto:volumePesoB
                    }*/
                    let volumeQuantidade = informacoesoNota.transporte.volume.quantidade
                    if(volumeQuantidade == 0)
                    {
                      volumeQuantidade = qtdVolumes
                    }

                    let volumePesoL = informacoesoNota.transporte.volume.pesoLiquido
                    if(volumePesoL == 0)
                    {
                      volumePesoL = totalPesoL
                    }

                    let volumePesoB = informacoesoNota.transporte.volume.pesoBruto
                    if(volumePesoB == 0)
                    {
                      volumePesoB = totalPesoL
                    }

                    //SEM COBRANCA E SEM TRANSPORTADORA
                    const Json1 = {
                      id:idNOta,
                      ambienteEmissao:informacoesoNota.dadosNota.ambienteEmissao,
                      naturezaOperacao:informacoesoNota.dadosNota.naturezaOperacao,
                      tipoOperacao:informacoesoNota.dadosNota.tipoOperacao,
                      finalidade:informacoesoNota.dadosNota.finalidade,
                      consumidorFinal,
                      enviarPorEmail,
                      
                      cliente:dadosCliente,
                      itens:itensAdd,
                      transporte:{
                        frete:{
                          modalidade:informacoesoNota.transporte.frete.modalidade,
                          valor:null
                        },
                        volume:{
                          quantidade:volumeQuantidade,
                          especie:informacoesoNota.transporte.volume.especie,
                          marca:informacoesoNota.transporte.volume.marca,
                          numeracao:informacoesoNota.transporte.volume.numeracao,
                          pesoLiquido:volumePesoL,
                          pesoBruto:volumePesoB
                        }
                      },
                      informacoesAdicionais:informacoesoNota.informacoesAdicionais
                    }
                    
          
                    resolve(JSON.stringify(Json1))
                  }
                
                })


                
              }
              
            }
            else
            {
              reject('Não existem itens lançados a este pedido '+informacoesoNota.dadosNota.pedidoUid)
            }
          })
         

         


        }
        else
        {
          reject('Cadastro do parceiro de negócios não foi identificado '+informacoesoNota.dadosNota.parceiroUid)
        }
      })


     
    })
    
  }
  cfopAdd(dados:any)
  {
    dados.createAt = new Date().getTime()
    dados.usuarioUid =  this.afa.auth.currentUser.uid
    dados.usuarioNome = this.afa.auth.currentUser.displayName
    this.idCliente = this.global.dadosLogado.idCliente;

    let pisSelect = dados.impostos.pis.situacaoTributariaSelect.split('|')
    dados.impostos.pis.situacaoTributaria = pisSelect[0]
    dados.impostos.pis.situacaoTributariaNome = pisSelect[1]


    let cofinsSelect = dados.impostos.cofins.situacaoTributariaSelect.split('|')
    dados.impostos.cofins.situacaoTributaria = cofinsSelect[0]
    dados.impostos.cofins.situacaoTributariaNome = cofinsSelect[1]

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('apoio').collection('cfop').add(dados)
  }

  cfopGetAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('apoio').collection('cfop',ref=>ref.orderBy('createAt','desc')).get()
  }
  cfopGet(cfopUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('apoio').collection('cfop').doc(cfopUid).get()
  }

  cfopUpdate(cfopUid:string,dados:any)
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('apoio').collection('cfop').doc(cfopUid).set(dados,{merge:true})
  }
  cfopDelete(cfopUid:string)
  {
    this.idCliente = this.global.dadosLogado.idCliente;

    return this.DB.collection(this.idCliente).doc('dados').collection('fiscal').doc('apoio').collection('cfop').doc(cfopUid).delete()
  }
}
