import { EmpresaselectService } from './empresaselect.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Itusercadastro } from 'src/app/interface/seguranca/itusercadastro';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Itconfusuario } from 'src/app/interface/configuracoes/usuario/itconfusuario';
import { map } from 'rxjs/operators';
import { ServiceempresasService } from '../empresa/serviceempresas.service';
import { UserService } from '../global/user.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private currentUser:any;
  private idCliente:string;
  private empresaNome:string;
  private itemsCollectionUserEmpresa: AngularFirestoreCollection<Itconfusuario>;
  private itemsCollectionUserEmpresa2: AngularFirestoreCollection<Itconfusuario>;
  private db: AngularFirestore;
  constructor(
    private auth:AuthService,
    private DB:AngularFirestore,
    private fireAuth:AngularFireAuth,
    private serviceEmpresa:ServiceempresasService,
    private global:UserService

  ) { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.empresaNome = this.global.dadosLogado.empresa;
    this.db = DB;
    this.itemsCollectionUserEmpresa = DB.collection<Itconfusuario>(this.idCliente).doc('dados').collection('usuarios');
    this.itemsCollectionUserEmpresa2 = DB.collection<Itconfusuario>(this.idCliente).doc('users').collection('configuracoes');

    //users/configuracoes/dadoscadastrais.set
  }

  getUserEmpresaAll()
  {
    this.idCliente = this.global.dadosLogado.idCliente;
    return this.DB.collection<Itconfusuario>(this.idCliente).doc('dados').collection('usuarios').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itconfusuario;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  newUserCreate(dadosUser:any): Promise<Boolean> {

    return new Promise((resolve, reject) => {
    
      const newUserData = {
        createAt: new Date().getTime(),
        empresaUid: this.idCliente,
        empresaNome: this.empresaNome,
        userEmail: dadosUser.email,
        userNome: dadosUser.userNome,
        departamento: dadosUser.departamento
      };
      console.log(newUserData)
      this.db.collection('newusers').add(newUserData)
      .then((res)=>{
        console.log('Enviada com sucesso');
        resolve(true);
      })
      .catch((err)=>{
        console.log('[Err] Falha ao enviar mensagem ', err);
        resolve(false)
      });
    });
  }

  userDelete(userUid:string): Promise<Boolean> {

    return new Promise((resolve, reject) => {

      this.db.collection(this.idCliente).doc('dados').collection('usuarios').doc(userUid).delete()
      .then((res)=>{
        console.log('Deletado com sucesso');
        resolve(true);
      })
      .catch((err)=>{
        console.log('[Err] Falha ao enviar deletar ', err);
        resolve(false)
      });
    });
  }

  update(id: string, dados: Itconfusuario) {
    return this.itemsCollectionUserEmpresa.doc<Itconfusuario>(id).update(dados);
  }

  get(id: string) {
    return this.itemsCollectionUserEmpresa.doc<Itconfusuario>(id).valueChanges();
  }

  newUserUpdate(dadosUser:any) {

      const newUserData = {
        userUid: dadosUser.uid,
        userNome: dadosUser.userNome
      };

      return this.db.collection('users').doc(this.fireAuth.auth.currentUser.uid).collection('configuracoes').doc('dadoscadastrais').set(dadosUser);

  }
  getRepresentantes()
  {

    
    return this.DB.collection<Itconfusuario>(this.idCliente).doc('dados').collection('usuarios',
    ref => 
    ref.where('departamento','==','comercial')
    
    ).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Itconfusuario;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

}
