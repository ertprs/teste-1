import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Itempresaativa } from 'src/app/interface/seguranca/itempresaativa';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaselectService {
  private itemsCollection: AngularFirestoreCollection<Itempresaativa>;
 
  
  constructor(
    private auth:AuthService,
    private afs: AngularFirestore
  ) { 

    this.itemsCollection = afs.collection<Itempresaativa>('users')
    .doc(this.auth.getAuth().currentUser.uid)
    .collection('empresas');
  }

  count()
  {
    this.itemsCollection.get().subscribe( data=> {
      return data.size;
     });
  }
  
  getEmpresas()
  {
    return this.itemsCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itempresaativa;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
}
