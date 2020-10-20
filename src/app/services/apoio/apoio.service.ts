import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApoioService {

  private apoioCollection: AngularFirestoreCollection;

  constructor(
    private DB:AngularFirestore,
  ) { 
    this.apoioCollection = DB.collection('baseapoio');
  }

  getEstados() {
    return this.apoioCollection.doc('gerais').collection('estados').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  getCidades() {
    return this.apoioCollection.doc('gerais').collection('cidades').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }


}
