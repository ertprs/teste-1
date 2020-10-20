import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Geral } from 'src/app/interface/configuracoes/geral';
import { UserService } from '../global/user.service';
import { AuthService } from '../seguranca/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeralService {

  private idCliente : any;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private global:UserService
  ) 
  {
   
  }



  get(idCliente:string){

    return  this.DB.collection(idCliente).doc('dados').collection('configuracao').doc('geral').get();
  }

  update(data : Geral){
    this.idCliente = this.global.dadosLogado.idCliente;
    return  this.DB.collection(this.idCliente).doc('dados').collection('configuracao').doc('geral').set(data ,{merge:true});
  }

}
