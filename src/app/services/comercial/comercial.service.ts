import { resolve } from 'url';
import { ProdutosService } from './../produtos/produtos.service';
import { Itproduto } from 'src/app/interface/produtos/itproduto';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Pedidos } from 'src/app/interface/comercial/pedidos';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';
import { Pedidositens } from 'src/app/interface/comercial/pedidositens';
import { UserService } from '../global/user.service';
import { Contatos } from 'src/app/interface/chat/contatos';

import { Representantes } from 'src/app/interface/comercial/representantes';
import { Conversas } from 'src/app/interface/chat/conversas';


@Injectable({
  providedIn: 'root'
})
export class ComercialService {
  private itemsCollection: AngularFirestoreCollection<Pedidos>;
  private itemsPedidoCollection: AngularFirestoreCollection<Pedidositens>;
  private ConsultaProduto = new Array<Itproduto>();
  private currentUser:any;
  private idCliente:string;
  private NomeEmpresa:string;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private serviceProduto:ProdutosService,
    
    private global:UserService

    ) { 
  
    this.idCliente = this.global.dadosLogado.idCliente;


    this.NomeEmpresa = this.global.dadosLogado.empresa


   

    this.itemsCollection = DB.collection<Pedidos>(this.idCliente).doc('dados').collection('comercial');
    this.itemsPedidoCollection = DB.collection<Pedidositens>(this.idCliente).doc('dados').collection('comercial');
  }
  
  PedidosItensAdd(pedidoUid:string,dados:Pedidositens): Promise<any>
  {
    console.log('Inserir item para o pedido '+pedidoUid);
    return  new Promise((resolve, reject) => {
      try
      {
        dados.createAt = new Date().getTime();
    
        //CONSULTAR PRODUTO ITENS
        console.log('Preparando inserir ... '+dados.produtoUid);
        this.serviceProduto.get(dados.produtoUid).subscribe(data => {
          console.log('Produto sendo inserido '+data.descricaoCurta)
          dados.produtoDescricao = data.descricaoCurta;
          dados.vrUnitario = data.vrCompra;
          dados.qtd = 0;
          dados.vrTotal = 0;

          this.DB.collection(this.idCliente).doc('dados').collection('comercial_detalhes').doc('itens').collection(pedidoUid).add(dados)
          .then((return2)=>{
            console.log('Inserido com sucesso')
            console.log(return2);
            resolve(true);
          })
          .catch((err)=>{
            console.log(err)
            
            resolve(false);
          })
          
        })
      }
      catch(err)
      {
        console.log(err);
        resolve(false)
      }
    });
 

  }
  getAllItensPedido(pedidoUid:string)
  {
    console.log('Iniciando subscribe '+pedidoUid);
    
    return this.DB.collection(this.idCliente).doc('dados').collection('comercial_detalhes').doc('itens').collection(pedidoUid).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Pedidositens;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }
  
  checkOrcamentoEmAberto(dadosConversa:Conversas)
  {

   
    return this.DB.collection<Pedidos>(this.idCliente).doc('dados').collection('comercial',ref => ref.where('clienteUid', '==',dadosConversa.uidClienteVinculado).where('situacao','==','orcamento')).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Pedidos;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )

    
      

      
  
  }
  getDadosOrcamento(dadosPedido:Pedidos,ItensPedido:any)
  {
    
    let array1 = [];
    let tableItens = [];
    let header = [{width:300,text:'Descricao'},{width:60,text:'Qtd'},{width:100,text:'Vr. Unitario'},{width:100,text:'Vr. Total'}]
    
    tableItens.push(header);

    let corpo = [];
    let dadosColuna = [];
    ItensPedido.forEach(element => {
      let dadosColunaLinha = [{width:280,text:element['produtoDescricao']},{width:60,alignment:'right',text: element['qtd'].toFixed(6)}, {width:80,alignment:'right',text:element['vrUnitario'].toFixed(6)},{width:80,alignment:'right',text:element['vrTotal'].toFixed(6)}] 
      //dadosColuna.push({width:280,text:element['produtoDescricao']},{width:60,alignment:'right',text: element['qtd'].toFixed(6)}, {width:80,alignment:'right',text:element['vrUnitario'].toFixed(6)},{width:80,alignment:'right',text:element['vrTotal'].toFixed(6)});
      const prepColuna = {
        columns:dadosColunaLinha
      }
      dadosColuna.push(prepColuna)
      
    });

    const retornoTable = {
      columns:header
      
    }
    const retornoItens = {
      columns:dadosColuna
      
    }
  
    const dados = {
      cabecalho:{
        data:this.dataAtualFormatada(),
        de:this.NomeEmpresa,
        para:{
          empresa:dadosPedido.clienteNome,
          contato:dadosPedido.contatoNome
        }
      },
      condPagamento:dadosPedido.condPagamentoUid,
      texto:'Conforme conversamos segue orçamento para sua análise.',
      itensHeader:retornoTable,
      itens:dadosColuna,
      total:dadosPedido.total,
      assinatura:{
        nomeUsuario:this.afa.auth.currentUser.displayName,
        autenticacao:this.afa.auth.currentUser.uid
      }
    }

    return dados;
  }

  add(dados:Pedidos)
  {
    dados.createAt = new Date().getTime();
    dados.modifyAt = new Date().getTime();
    dados.empresaLogo = '../../../../assets/img/defaultlogo.png';
    dados.usuarioNome = this.afa.auth.currentUser.displayName;
    dados.usuarioUid = this.afa.auth.currentUser.uid;
    dados.situacao = 'orcamento';
    dados.situacaoCod = 1;

    dados.total = 0;
    
    console.log(dados);
  
    return this.DB.collection<Pedidos>(this.idCliente).doc('dados').collection('comercial').add(dados);
  }

  get(id: string) {
    return this.itemsCollection.doc<Pedidos>(id).valueChanges();
  }

  filterPedido(query : string){
      return this.itemsCollection.snapshotChanges().pipe(
        map(action => action.map(a=>{
          const data = a.payload.doc.data() as Pedidos;
          console.log(data);

          const id = a.payload.doc.id;
          const doc = a.payload.doc;
          const usuarioNome = data.usuarioNome;
          const empresaNome = data.clienteNome;

          if (usuarioNome.toUpperCase().indexOf(query.toUpperCase()) > -1 || empresaNome.toUpperCase().indexOf(query.toUpperCase()) > -1)
          {
            return {id, ... data,doc}
          }
        }))
      ); 
  }

  filterRepresentante(query : string){
    return this.DB.collection(this.idCliente).doc('dados').collection('comercial_estatistica').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Representantes;

        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        const usuarioNome = data.usuarioNome;

        if (usuarioNome.toUpperCase().indexOf(query.toUpperCase()) > -1)
        {
          return {id, ... data,doc}
        }

      }))
    ); 
  }

  checkDasht(){
      return this.DB.collection(this.idCliente).doc('comercial_estatistica_geral').valueChanges()
  }
  
  repDash(usuarioUid:string){
    return this.itemsCollection.doc('representantes').collection(usuarioUid).valueChanges()
  }

  repEstatisticaGetAll(){
    return this.DB.collection(this.idCliente).doc('dados').collection('comercial_estatistica').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  getAll()
  {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Pedidos;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  update(id: string, dadosPdido: Pedidos) {
    return this.itemsCollection.doc<Pedidos>(id).update(dadosPdido);
  }

  delete(id: string) {
    return this.itemsCollection.doc(id).delete();
  }

  pedidosItensDelete(pedidoUid:string,id:string)
  {
    return this.itemsPedidoCollection.doc('itens').collection(pedidoUid).doc<Pedidositens>(id).delete();
  }

  deleteAllItens(pedidoUid: string): Promise<Boolean>  {
    return new Promise((resolve, reject) => {
      try{
        this.itemsPedidoCollection.doc('itens').collection(pedidoUid).snapshotChanges().pipe(
          map(action => action.map(a=>{
            const data = a.payload.doc.data() as Pedidositens;
            const id = a.payload.doc.id;
            this.itemsPedidoCollection.doc('itens').collection(pedidoUid).doc(id).delete();
          }))
        )
        resolve(true);
      }
      catch(err)
      {
        console.log(err);
        console.log('Falha ao excluir itens do pedido ');
        reject()
      }
    })
    
  }

  getItem(pedidoUid:string,id:string) {
    return this.itemsPedidoCollection.doc('itens').collection(pedidoUid).doc<Pedidositens>(id).valueChanges();
  }
  
  updateItem(pedidoUid: string, id:string, dados: Pedidositens) {
    return  this.DB.collection(this.idCliente).doc('dados').collection('comercial_detalhes').doc('itens').collection(pedidoUid).doc<Pedidositens>(id).update(dados);
  }

  calcularTotalPedido(pedidoUid:string)
  {
    let total2:any = 0;
    this.itemsPedidoCollection.doc<Pedidositens>('itens').collection(pedidoUid).valueChanges().forEach(elem=>{
      console.log(elem);
      elem.forEach(item=>{
        let vr = item['vrTotal']
        console.log('Valor total do item '+vr)
        total2 = total2 + vr;
      })
      console.log('Total calculado '+total2);
      const dadosPed = {
        total:total2
      }
      this.itemsCollection.doc<Pedidos>(pedidoUid).update(dadosPed)
      .then(res=>{
        console.log(res)
      })
      .catch((err)=>{
        console.log('Erro');
        console.log(err);
      })
    })
  }
}
