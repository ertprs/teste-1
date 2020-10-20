import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Itpushnotification } from 'src/app/interface/seguranca/itpushnotification';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {
  private itemsCollection: AngularFirestoreCollection<Itpushnotification>;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private fireAuth:AngularFireAuth,
  ) { 

    this.itemsCollection = DB.collection<Itpushnotification>('users')
  }

  add(configuracoes:Itpushnotification)
  {
    configuracoes.createAt = new Date().getTime();
    
    

    return this.itemsCollection.doc(this.fireAuth.auth.currentUser.uid).collection('configuracoes').doc('push').set(configuracoes);
  }
}
