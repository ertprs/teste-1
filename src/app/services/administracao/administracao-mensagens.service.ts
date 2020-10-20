import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AuthService } from '../seguranca/auth.service';
import { ItAdministracaoMensagens } from 'src/app/interface/administracao/it-administracao-mensagens';

@Injectable({
  providedIn: 'root'
})
export class AdministracaoMensagensService {

  private mensagensCollection: AngularFirestoreCollection<ItAdministracaoMensagens>;
  private currentUser:any;
  private idCliente:string;
  private todos : AngularFireObject<any>;
  
  constructor(
    private DB : AngularFirestore,
    private database : AngularFireDatabase,
    private auth:AuthService,
  ) 
  { 
    this.mensagensCollection = DB.collection('caixa_entrada');
  }

  dataAtualFormatada(dataInf?:string){
    var data = new Date(),
        dia  =  Number(data.getDate().toString().padStart(2, '0')),
        //mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        mes  = Number((data.getMonth().toString().padStart(2, '0'))), 
        ano  = Number(data.getFullYear());
      
        var ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
        const returno ={
          data,
          dia,
          mes,
          ano,
          ultimoDia
        }
        return returno;
  }

  listMensagens()
  {
    // 'contatos',ref=> ref.where('createAt','>=',dt2 ).where('createAt','<=',dtFinal))

    let dtFinal = this.dataAtualFormatada().data.getTime();
    let dtInicial = this.dataAtualFormatada().data;
    let dt2 = dtInicial.setDate(dtInicial.getDate()-30);

    return this.DB.collection('caixa_entrada', ref => ref.where('createAt','>=',dt2 ).where('createAt','<=',dtFinal)).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as ItAdministracaoMensagens;
        const id = a.payload.doc.id;
        const doc = a.payload.doc;
        return {id, ... data,doc}
      }))
    );
  }

  listMensagens2()
  {
    // 'contatos',ref=> ref.where('createAt','>=',dt2 ).where('createAt','<=',dtFinal))
    this.currentUser = this.auth.getCUrrentUser();
    this.idCliente = this.currentUser.__zone_symbol__value.idCliente;

    if (this.idCliente) {
      let dtFinal = this.dataAtualFormatada().data.getTime();
      let dtInicial = this.dataAtualFormatada().data;
      let dt2 = dtInicial.setDate(dtInicial.getDate()-30);

      return this.database.list(`/caixa_entrada`, ref =>  ref.orderByChild('createAt').startAt(dt2).endAt(dtFinal)).valueChanges();
    }
    else {
      console.log('IdCliente inválido');
    }
  }

  listRealtime(){
    this.currentUser = this.auth.getCUrrentUser();
    this.idCliente = this.currentUser.__zone_symbol__value.idCliente;

    if (this.idCliente) {
      return this.database.list(`/caixa_entrada`).valueChanges();
    }
    else {
      console.log('IdCliente inválido');
    }


  }
}
