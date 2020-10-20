import { UserService } from 'src/app/services/global/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ParceirosService {
  private itemsCollection: AngularFirestoreCollection<Itaddparceiro>;
  private currentUser:any;
  private idCliente:string;


  
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth,
    private global:UserService

    ) { 
  
      this.idCliente = this.global.dadosLogado.idCliente;

    this.itemsCollection = DB.collection<Itaddparceiro>(this.idCliente);
  }

  generateColor() {
    let color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  add(dados:Itaddparceiro)
  {
    dados.createAt = new Date().getTime();
    dados.photo = this.generateColor();
    dados.userUid = this.afa.auth.currentUser.uid;
    return this.itemsCollection.doc('dados').collection('parceiros').add(dados);
  }

  update(parceiroId : string, parceiro : Itaddparceiro) {
    return this.itemsCollection.doc('dados').collection('parceiros').doc<Itaddparceiro>(parceiroId).update(parceiro);
  }

  get(parceiroId : string){
    return this.itemsCollection.doc('dados').collection('parceiros').doc<Itaddparceiro>(parceiroId).valueChanges();
  }

  getAll()
  {

    
    return this.itemsCollection.doc('dados').collection('parceiros').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itaddparceiro;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  delete(parceiroId: string){
    return this.itemsCollection.doc('dados').collection('parceiros').doc(parceiroId).delete();
  }
}