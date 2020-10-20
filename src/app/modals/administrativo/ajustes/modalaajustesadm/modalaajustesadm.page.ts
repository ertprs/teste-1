import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';


import { observable } from 'rxjs';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';

@Component({
  selector: 'app-modalaajustesadm',
  templateUrl: './modalaajustesadm.page.html',
  styleUrls: ['./modalaajustesadm.page.scss'],
})
export class ModalaajustesadmPage implements OnInit {

  @Input() item: any;
  private log = []
  private matrizDoContato = []
  constructor(
    private DB:AngularFirestore,
    private srvContatos:ContatosService,
    private afFunction:AngularFireFunctions,
    private design:ProcessosService,
    private srvParceiro:ParceirosService
  ) { }

  ngOnInit() {
  }
  mensagem(mensagem:string)
  {
    this.log.push({createAt:new Date().getTime(),mensagem})
  }
  getMensagensContato(empresaUid:string,contatoUid:string):Promise<any>
  {
    return new Promise((resolve, reject) => {
       this.DB.collection(empresaUid).doc('chat').collection('conversas').doc(contatoUid).collection('mensagens').get().forEach(elem=>{
         if(!elem.empty)
         {
           const mensagensRetorno = []
           elem.docs.forEach(dados=>{
             const id = dados.id
             const data = dados.data()
             const dataReturn = {
               id,
               ... data
             }

             mensagensRetorno.push(dataReturn)
            

           })

           resolve(mensagensRetorno)

         }
         else
         {
          resolve({})
         }
       })
    })
  }
  async imprimirMatriz()
  {
    console.log(this.matrizDoContato)
  }
  async backupRecorrencia()
  {

    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma restaurar recorrencias? Esta ação irá a pagar os registros atuais e sobrepor com o backup E NÃO PODERÁ SER DEFEITA'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        let empresaUid = this.item.empresaUid
        
      
        this.mensagem('Iniciando processo de recuperação de recorrencia da  '+empresaUid)
        this.DB.collection('EmpControle',ref=> ref.where('empresaUid','==',empresaUid)).get().forEach(element=>{
          if(!element.empty)
          {
            const data = element.docs[0].data()
            const identiCliente = data.documento
            console.log('Identificacao empresa '+identiCliente)
            let sql = "SELECT UNIX_TIMESTAMP(ultimo_fechamento) as ultimoFechamento,periodo,dia_nota,dia_vencimento,qtd_processos,valor,UNIX_TIMESTAMP(prox_vencimento) as  proximoFechamento,documento FROM lara_01.recorrencianew WHERE id_cliente like '"+identiCliente+"'  "  
            console.log(sql)
            const callable = this.afFunction.httpsCallable('appSQLexecuteBackup');
            const obs = callable({ sql });
            obs.subscribe(dadosRet=>{
              console.log(dadosRet)
              console.log(dadosRet.documento)

              const data = dadosRet.data.data[0]
          
              data.forEach(elementReturn => {
                console.log('Recuperar dados de  '+elementReturn.documento)
                this.DB.collection(empresaUid).doc('dados').collection('parceiros',ref=>ref.where('documento','==',elementReturn.documento)).get().forEach(elemCliente=>{
                  if(!elemCliente.empty)
                  {
                    const docs = elemCliente.docs[0]
                    const dadosParceiro = docs.data()
                    let parceiroUid = docs.id
                    let parceiroNome = dadosParceiro.razaoSocial

                  
                    this.mensagem('Recolhendo dados de   '+dadosParceiro.razaoSocial)

                    //PREPARAR INSERIR RECORRENCIAS
                    let dadosRecorrencia = {
                      parceiroUid,
                      parceiroNome,
                      valor:elementReturn.valor,
                      periodo:elementReturn.periodo.toLowerCase(),
                      diaNota:elementReturn.dia_nota,
                      diaVencimento:elementReturn.dia_vencimento,
                      situacao:true, // ATIVO ou DESATIVADO
                      ultimoFechamento:elementReturn.ultimoFechamento,
                      proximoFechamento:elementReturn.proximoFechamento,
                      qtdProcessos:elementReturn.qtd_processos,
                      vrAdicional:0
                    }
                    
                    console.log(dadosRecorrencia)

                    //ADD
                    // /EDsoMmEc2C4WQPevGnyu/dados/financeiro/registros/recorrencia
                    this.DB.collection(empresaUid).doc('dados').collection('financeiro').doc('registros').collection('recorrencia').add(dadosRecorrencia)
                    .then(resAdd=>{
                      this.mensagem('Recorrencia adicionada com sucesso  '+dadosParceiro.razaoSocial)
                    })
                    .catch(errAdd=>{
                      this.mensagem(JSON.stringify(errAdd))
                      this.mensagem('falha ao adicionar recorrencia  '+dadosParceiro.razaoSocial)
                    })


                    
                  }
                  else
                  {
                    this.mensagem('Não existe parceiro cadastrado na Lara   '+empresaUid+" | "+elementReturn.documento)
                  }
                })
              });


              

            })
          }
          else
          {
            this.mensagem('Não existem informações para   '+empresaUid)
          }
        })
      }
    })
    
    


  }
  async importarParceiros()
  {
    let empresaUid = this.item.empresaUid
    this.mensagem('Iniciando processo de importacao de parceiros   '+empresaUid)
    this.DB.collection('EmpControle',ref=> ref.where('empresaUid','==',empresaUid)).get().forEach(element=>{
      if(!element.empty)
      {
        const data = element.docs[0].data()
        const identiCliente = data.documento
        console.log('Identificacao empresa '+identiCliente)
        let sql = "SELECT * FROM lara_01.base_cliente WHERE id_cliente like '"+identiCliente+"' "  
     
        const callable = this.afFunction.httpsCallable('appSQLexecuteBackup');
        const obs = callable({ sql });
        obs.subscribe(dadosRet=>{
          console.log(dadosRet)

          const dadosParceiroRet = dadosRet.data.data[0]
          if(dadosParceiroRet.length > 0)
          {
            this.mensagem('Foram encontrados '+dadosParceiroRet.length+' parceiros')
            for (const  dadosParceiro of dadosParceiroRet) {
              this.mensagem('->'+dadosParceiro.nome)
              const dadosParceiroAdd = {
                libCPF:false,
                libCNPJ:true,
                libCadastro:true,
                sincronizado:0,
                qtdAcoesFiscais:0,
                qtdAcoesFinanceiras:0,
                documento:dadosParceiro.documento,
                dtNascimento:'',
                regimeespecial:dadosParceiro.regime_especial,
                observacoes:dadosParceiro.obs_geral,
                razaoSocial:dadosParceiro.nome,
                nomeFantasia:dadosParceiro.nome,
                documentoSituacao:'',
                documentoData:'',
                documentoComprovanteNumero:'',
                dataAbertura:'',
                empresaSituacao:'',
                inscricaoIE:dadosParceiro.ie,
                inscricaoIM:dadosParceiro.im,
                inscricaoSUFRAMA:dadosParceiro.suframa_inscricao,
                contato:{
                  telefone:dadosParceiro.telefone_fixo,
                  site:'',
                  email:dadosParceiro.email
                },
                endereco:{
                  cep:dadosParceiro.end_cep,
                  logradouro:dadosParceiro.end_logradouro,
                  endereco:dadosParceiro.end_rua,
                  numero:dadosParceiro.end_numero,
                  complemento:dadosParceiro.end_complemento,
                  bairro:dadosParceiro.end_bairro,
                  cidade:dadosParceiro.end_cidade,
                  ibgeCOd:dadosParceiro.codigo_ibge,
                  estado:dadosParceiro.end_estado
                },
                enderecoCob:{
                  cep:'',
                  logradouro:'',
                  endereco:'',
                  numero:'',
                  complemento:'',
                  bairro:'',
                  cidade:'',
                  ibgeCOd:'',
                  estado:''
                },
                enderecoEntrega:{
                  cep:'',
                  logradouro:'',
                  endereco:'',
                  numero:'',
                  complemento:'',
                  bairro:'',
                  cidade:'',
                  ibgeCOd:'',
                  estado:''
                },
                geoLocalizacao:'',
                uidLara:'',
                credito:{
                  liberado:false,
                  valorLiberado:0,
                  valorUtilizado:0,
                  dtLiberacao:0,
                  usuarioUid:'',
                  usuarioNome:''
                },
                confFiscal:{
                  tipoDoc:'nf',
                  observacoesNota:''
                },
                confFinanceiro:{
                  pagamentoBoleto:false,
                  pagamentoCartao:false,
                  observacoesBoleto:''
                },
                confContabil:{
                  contaUid:'',
                  contaNome:'',
                  centrodecustoUid:'',
                  centrodecustoNome:''
                },
                cadastroLibNota:false,
                representanteUid:'',
                representanteNome:'',
                situacaoCadastro:true
            
              }
              this.design.presentLoading('Cadastrando, aguarde...')
              .then(resLoading=>{
                resLoading.present()


                this.srvParceiro.verificarSeExisteDocumentoBackup(empresaUid,dadosParceiroAdd.documento)


                this.srvParceiro.addBackup(empresaUid,dadosParceiroAdd)
                .then(res=>{
                  this.mensagem('* cadastrado com sucesso')
                 
                })
                .catch(err=>{
                  this.mensagem('* Falha |'+err)
                })
                .finally(()=>{
                  resLoading.dismiss()
                })
              })
          
              



            }
          }
          else
          {
            this.mensagem('Nao existem parceiros cadastrados para recuperacao ')
          }
          
        })
      }
      else
      { 
        this.mensagem('Nao existe configuracoes validas para importacao ')
      }
    })


    






  }

  async backupEstoque()
  {

    this.design.presentAlertConfirm(
      'Confirmação',
      'Confirma restaurar estoque? Esta ação irá a pagar os registros atuais e sobrepor com o backup E NÃO PODERÁ SER DEFEITA'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        let empresaUid = this.item.empresaUid
        
      
        this.mensagem('Iniciando processo de recuperação de recorrencia da  '+empresaUid)
        this.DB.collection('EmpControle',ref=> ref.where('empresaUid','==',empresaUid)).get().forEach(element=>{
          if(!element.empty)
          {
            const data = element.docs[0].data()
            const identiCliente = data.documento
            console.log('Identificacao empresa '+identiCliente)
            let sql = "SELECT * FROM lara_01.estoque WHERE id_cliente = '"+identiCliente+ "'"  
            console.log(sql)
            const callable = this.afFunction.httpsCallable('appSQLexecuteBackup');
            const obs = callable({ sql });
            obs.subscribe(dadosRet=>{
              console.log(dadosRet)
              console.log(dadosRet.documento)

              const data = dadosRet.data.data[0]
          
              data.forEach(elementReturn => {
                console.log('Recuperar dados de  '+elementReturn.codigo)
                let ncm = elementReturn.ncm
                ncm = ncm.split('.').join('')
                ncm = ncm.split('-').join('')
                ncm = ncm.substring(0,8)
                const addProduto = {
             
                    createAt:new Date().getTime(),
                    codigo:elementReturn.codigo,
                    sku:elementReturn.codigo,
                    ean:'',
                    ncm,
                    photo:'../../../../../../assets/img/productlogo.png',
                    photoURL:'',
                    liberadoUso:true,
                    tipoFabricacao:0,
                    descricaoCurta:elementReturn.descricao,
                    descricaoLonga:elementReturn.descricao,
                    descricaoFiscal:elementReturn.descricao,
                    ObservacoesGeral:'',
                    qtdDisponivel:0,
                    vrCompra:0,
                    vrVenda:0,
                    pesoL:elementReturn.peso_l,
                    pesoB:elementReturn.peso_b,
                    usuarioUid:''
                    
                
                }
                console.log(addProduto)
                ///QmPJcDIMLJBshGe9LDv2/dados/produtos/80ByfWOjrGoTmYgUc8yT
                this.DB.collection(empresaUid).doc('dados').collection('produtos').add(addProduto)
                .then(resAdd=>{
                  this.mensagem('adicionado   '+addProduto.codigo)
                })
                .catch(errAdd=>{
                  this.mensagem('falha ao adicionar   '+addProduto.codigo)
                })
                
                
              });


              

            })
          }
          else
          {
            this.mensagem('Não existem informações para   '+empresaUid)
          }
        })
      }
    })
    
    


  }

  async ajusteFinalContatos()
  {
    let empresaUid = this.item.empresaUid
    this.mensagem('Iniciando processo ajustes  '+empresaUid)
    const parametrosDados = {
      empresaUid
    }
    const callable = this.afFunction.httpsCallable('appAjustesContato');
    
    const obs = callable(parametrosDados)
    obs.subscribe(dadosRecebidos=>{
      console.log(dadosRecebidos)
      console.log(dadosRecebidos.sqlExecute)
    })






  }
  async ajusteTransferencia(){
    let empresaUid = this.item.empresaUid
    this.mensagem('Iniciando processo ajustes  de transferencias  '+empresaUid)
    this.DB.collection(empresaUid).doc('consumo_painel').get().forEach(Elemento=>{
      if(!Elemento.exists)
      {
        this.mensagem('Nao existe controle de consumo ')
        this.DB.collection(empresaUid).doc('consumo_painel').set({
          qtdConsumoIa:0,
          qtdContratada:0,
          qtdMensagens:0,
          trafegoContratado:0,
          trafegoUtilizado:0,
        })
        .then(res=>{
          this.mensagem('Adicionado painel ')
        })
        .catch(err=>{
          this.mensagem('Falha ao criar painel')
        })
      }
      else
      {
        this.mensagem('AJa existe painel ')
      }
    })
  }
  async migrarContatoSql()
  {
    let empresaUid = this.item.empresaUid
    this.mensagem('Iniciando processo migrar contatos SQL '+empresaUid)

    //LISTAR CONTATOS
    const contatosFirebase = []
    this.DB.collection(empresaUid).doc('chat').collection('contatos',ref=>ref.orderBy('createAt','desc')).get().forEach(elem=>{
      if(!elem.empty)
      {
        this.mensagem('Foram encontrados '+elem.size+' contatos ')
        elem.docs.forEach(dadosCliente=>{
          console.log(dadosCliente)
          let id = dadosCliente.id
          let data = dadosCliente.data()

          const dadosDoContato:any = {
            id,
            origem_wpp:data.origem,
            ... data
          }
          console.log(dadosDoContato)
          if(data.canal == 'whatsappdirect' || data.canal == 'whatsapp' && ( !data.sincronizado || data.sincronizado == 0 || data.sincronizado == 2) )
          {
            //CHECAR CONTATO SQL
            const contatosErro = []
            const contatosCadastrar = []
            const dadosCheck = {
              empresaUid,
              origem_wpp:dadosDoContato.origem
            }
           
            const ObservableSQL = <any>this.srvContatos.contatoCheckADMIN(dadosCheck).subscribe(dadosSqlObservable=>{
              ObservableSQL.unsubscribe()
              console.log(dadosSqlObservable)

              if(dadosSqlObservable.situacao == 'suc')
              {
                const data1 = dadosSqlObservable.data.data[0]
                if(data1.length == 0)
                {
                  //CADASTrAR NOVO
                  contatosCadastrar.push(dadosDoContato)
                  //this.mensagem('Contatos novos  '+contatosCadastrar.length+' |  '+dadosDoContato.nome)
                  //UPDETE SINCRONIZADO = 0
                  this.DB.collection(empresaUid).doc('chat').collection('contatos').doc(dadosDoContato.id).set({sincronizado:0,origem_wpp:dadosDoContato.origem_wpp,empresaUid},{merge:true})
                  .then(resUpdate=>{
                    this.mensagem('Contato adicionado para sincronismo | '+dadosDoContato.id+' | '+dadosDoContato.nome)
                  })
                }
                
              }
              else
              {
                contatosErro.push(dadosDoContato)
                this.mensagem('[ERR] Contatos novos  '+contatosErro.length+' |  '+dadosDoContato.nome)
              }
            })
          }
        
          

          
        })
      }
    })
  }
  async contatoAjusteDuplicidade()
  {
    this.log = []
    this.matrizDoContato = []
    this.mensagem('Iniciando processo')
    this.mensagem('Arquivo extraido '+JSON.stringify(this.item))
  
  


    let empresaUid = this.item.empresaUid
    this.mensagem('Identificando empresa '+empresaUid)


    const colecao = await this.DB.collection(empresaUid).doc('chat').collection('contatos').get()
    colecao.forEach(element=>{
      if(!element.empty)
      {
        this.mensagem('Existem  '+element.size+' contatos cadastrados ')

        const contatos = []
        element.docs.forEach(dados=>{
          const id = dados.id
          const data = dados.data()
          const addContato = {
            id,
            ... data
          }

          contatos.push(addContato)

        })


        this.mensagem('Iniciando loop de verificacao dos contatos')
        const contatoNivel1 = []
        const contatosDuplicados = []

        contatos.forEach(dadosContato=>{
          let CheckContato  = contatoNivel1.reduce( function( cur, val, index ){

            if( val.origem === dadosContato.origem && cur === -1 ) {
                return index;
            }
            return cur;
        
          }, -1 );

          if(CheckContato > -1)
          {
            //existe
            contatosDuplicados.push(dadosContato)
          }
          else
          {
            //NAO EXISTE
            contatoNivel1.push(dadosContato)

          }
        })

        this.mensagem('Foram encontrados '+contatosDuplicados.length+' contatos duplicados ')

        let contDuplicados = 0;
     
        contatosDuplicados.sort(function(a,b) {
          return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
        }).forEach( listarDUplicados=>{
          contDuplicados++
          this.mensagem(contDuplicados+')'+listarDUplicados.nome+' '+listarDUplicados.origem+' '+listarDUplicados.id)
          this.mensagem('=======================================')

         


          //LISTAR MENSAGENS DO CONTATO
          this.getMensagensContato(empresaUid,listarDUplicados.id)
          .then(res=>{
            console.log(res)
            if(res.length > 0)
            {
              const matrizMensagem = []
              res.forEach(loopMensagens => {
                matrizMensagem.push(loopMensagens)
               // this.mensagem('-> '+loopMensagens.mensagem)
               // console.log(loopMensagens)
              });
              this.matrizDoContato.push({
                origem:listarDUplicados.origem,
                mensagens:matrizMensagem
              })
             
            }
            else
            {
             // this.mensagem('Não existe mensagens para este contato')
            }
          })
          .catch(err=>{
            this.mensagem('*ERR* Falha no processo de recuperacao de mensagens '+err)
          })

          this.mensagem('=======================================')




        })


        
        


      }
      else
      {
        this.mensagem('Nao existem contatos cadastrados')
      }
    })
    
    
  }



}
