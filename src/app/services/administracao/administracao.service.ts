import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ItEmpControle } from 'src/app/interface/administracao/itempcontrole';
import { Itempresaconf } from 'src/app/interface/empresa/itempresaconf';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AdministracaoService {

  private empControleCollection: AngularFirestoreCollection<ItEmpControle>;

  constructor(
    private DB:AngularFirestore,
    private http: HttpClient
  ) { 
    this.empControleCollection = DB.collection('EmpControle');
  }

  add(dados:ItEmpControle) {
    dados.createAt = new Date().getTime();
    return this.empControleCollection.add(dados);
  }
  addLead(dados:any):Promise<any>{
    return new Promise((resolve, reject) => {
      let url = 'https://southamerica-east1-lara2-3b332.cloudfunctions.net/api/newcad'
      this.http.post<any>(url,{dados}).subscribe(dados=>{
        resolve(dados)
      })
    })
    
  }
  update(id: string, dados: ItEmpControle) {
    return this.empControleCollection.doc<ItEmpControle>(id).update(dados);
  }

  updateAll(data : any){
    console.log(data);
    data.forEach(empresa => {
      this.update(empresa.id, empresa);
    });
  }

  acaoAdmAdd(empresaUid:string,acaoNome:string)
  {
    const addItem = {
      createAt: new Date().getTime(),
      situacao:0,
      empresaUid,
      acaoNome
    }
    return this.DB.collection('acoesAdm').add(addItem)
  }
  acaoAdmGetResult(uid:string)
  {
    return this.DB.collection('acoesAdm').doc(uid)
    
  }
  


  getAll()
  {
    // return this.empControleCollection.snapshotChanges().pipe(
    //   map(action => action.map(a=>{
    //     const data = a.payload.doc.data() as ItEmpControle;
    //     const id = a.payload.doc.id;
    //     return {id, ... data}
    //   }))
    // )

    return this.empControleCollection.snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as ItEmpControle;
        const id = a.payload.doc.id;
        const nome = data.nome.toLowerCase();
        data.nome = nome;
        return {id, ... data};
      }))
    );
  }

  getFilter(valor:string){
    // return this.DB.collection('EmpControle',ref=> ref.orderBy('nome').startAt(valor).endAt(valor).limit(20)).get();
    return this.DB.collection('EmpControle',ref=> ref.orderBy('nome').startAt(valor).endAt(valor+'\uf8ff')).get();
  }

  delete(id: string) {
    return this.empControleCollection.doc(id).delete();
  }
  get(id: string) {
    return this.empControleCollection.doc<ItEmpControle>(id).valueChanges();
  }

  getEmpresaConf(empresaUid:string) {
    return this.DB.collection<Itempresaconf>(empresaUid).doc('dados').collection('configuracao').doc('empresa').valueChanges();
  }

  updateEmpresaConf(empresaUid: string, dados: Itempresaconf) {
    return this.DB.collection<Itempresaconf>(empresaUid).doc('dados').collection('configuracao').doc('empresa').update(dados);
  }

  getConfChats(empresaUid:string,document:string) {
    return this.DB.collection(empresaUid).doc('dados').collection('configuracao').doc('chat').collection(document).snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }

  addConfChats(empresaUid: string,document:string, dados: any) {
    dados.createAt = new Date().getTime();
    return this.DB.collection(empresaUid).doc('dados').collection('configuracao').doc('chat').collection(document).add(dados);
  }

  updateConfChats(empresaUid: string,chatId:string,document:string, dados: any) {
    return this.DB.collection(empresaUid).doc('dados').collection('configuracao').doc('chat').collection(document).doc(chatId).update(dados);
  }
}
