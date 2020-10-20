import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Ittodo } from 'src/app/interface/todo/ittodo';
import { UserService } from '../global/user.service';
import { AuthService } from '../seguranca/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServTodoService {
  private itemsCollection: AngularFirestoreCollection<Ittodo>;
  private idCliente:string;
  constructor(
    private global:UserService,
    private auth:AuthService,
    private DB:AngularFirestore,
    private afa:AngularFireAuth
  ) 
  { 

    this.idCliente = this.global.dadosLogado.idCliente;
    this.itemsCollection = DB.collection<Ittodo>(this.idCliente)

  }
  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  addLembreteUsuario(dados:any):Promise<any>
  {
    return new Promise((resolve, reject) => {
    
      if(dados.contatoUid !== undefined && dados.contatoUid !== '')
      {
        this.idCliente = this.global.dadosLogado.idCliente;
        let todoUid = '';
        if(dados.todoUid !== undefined)
        {
          todoUid = dados.todoUid
        }
        const detLembrete = {
          createAt:new Date().getTime(),
          contatoUid:dados.contatoUid,
          usuarioUid:this.afa.auth.currentUser.uid,
          usuarioNome:this.afa.auth.currentUser.displayName,
          todoUid
        }
        this.DB.collection(this.idCliente).doc('chat').collection('lembretes').add(detLembrete)
        .then(res=>{
          resolve(res)
        })
        .catch(err=>{
          reject(err)
        })
      }
      else
      {
        reject('Identificação do contato era esperada contatoUid')
      }
    
    })
  }
  add(dados:Ittodo,dadosConversa?:any):Promise<any>
  {
    return new Promise((resolve, reject) => {

      let gravar = true;
      dados.createAt =  new Date().getTime();
      dados.concluido = false;
      dados.color = this.getRandomColor();
      dados.comandos = '';

     
  
      if(dados.lembreteData !== '' && dados.lembreteData!== undefined)
      {
        //Aqui EXISTeM DADOS DE ALErTA
        let dataRec = dados.lembreteData.split('-');
        
        if(dados.lembretehora !== undefined && dados.lembretehora !== '')
        {
          let horaRec = dados.lembretehora.split(':')
          
          if(horaRec.length == 2)
          {
            dados.gerarLembrete = true;
            if(Number(horaRec[0]) <= 23)
            {
              let data = new Date(Number( dataRec[0]),Number(dataRec[1])-1,Number(dataRec[2]),Number(horaRec[0]),Number(horaRec[1]),0);
              let dataSpan = data.getTime()
      
              dados.lembreteTIme = dataSpan;

              
              if(dataSpan < dados.createAt)
              {
                gravar = false;
                reject('Data inferior a atual')
              }
             
            }
            else
            {
              gravar = false;
              reject('Hora invalida (3)')
            }
            
          }
          else
          {
            gravar = false;
            reject('Hora invalida (2)')
          }

          
        }
        else
        {
          dados.gerarLembrete = false;
   
        }
        
  
  
       
      }
      else
      {
        //AQUI NAO EXISTEM DADOS DE ALERTA
        dados.lembreteTIme = null;
        dados.gerarLembrete = false;
      }
      
      if(gravar)
      {
        dados.empresaNome = this.global.dadosLogado.empresa;
        dados.usuarioUid = this.afa.auth.currentUser.uid;
        dados.usuarioNome = this.afa.auth.currentUser.displayName;
        this.idCliente = this.global.dadosLogado.idCliente;
         //AJUSTE DE COMANDOS
        if(dadosConversa)
        {
          const detComando = {
            acaoNome:'conversa',
            contatoUid:dadosConversa.contatoUid,
            usuarioNome:this.afa.auth.currentUser.displayName,
            usuarioUid:this.afa.auth.currentUser.uid,
            createAt:new Date().getTime()
          }
          dados.comandos = JSON.stringify(detComando);
        }




        
        console.log(this.idCliente)
  
        this.DB.collection(this.idCliente).doc('dados').collection('diretorios').doc(this.afa.auth.currentUser.uid).collection('toDo').add(dados)
        .then(res=>{
          if(dadosConversa)
          {
            this.addLembreteUsuario({contatoUid:dadosConversa.contatoUid,todoUid:res.id})
            .then(res2=>{
              resolve(res.id)
            })
            .catch(err2=>{
              reject(err2)
            })
          }
          else
          {
            resolve(res.id)
          }
          
         
        })
        .catch(err=>{
          console.log(err)
          reject(err)
        })
      }
     


    })
   

   
      
  }
  update(id: string, dados: Ittodo) {
   
    return this.itemsCollection.doc('dados').collection('diretorios').doc(this.afa.auth.currentUser.uid).collection('toDo').doc<Ittodo>(id).update(dados);
  }
  getAll()
  {

    
    return this.itemsCollection.doc('dados').collection('diretorios').doc(this.afa.auth.currentUser.uid).collection('toDo').snapshotChanges().pipe(
      map(action => action.map(a=>{
        const data = a.payload.doc.data() as Ittodo;
        const id = a.payload.doc.id;
        return {id, ... data}
      }))
    )
  }
  get(id: string) 
  {
    
    return this.itemsCollection.doc('dados').collection('diretorios').doc(this.afa.auth.currentUser.uid).collection('toDo').doc<Ittodo>(id).valueChanges();
  }
  delete(id: string) {
    return this.itemsCollection.doc('dados').collection('diretorios').doc(this.afa.auth.currentUser.uid).collection('toDo').doc(id).delete();
  }
  deleteCron(tarefaUid:any,dados:Ittodo):Promise<any>
  {
    return new Promise((resolve, reject) => {
      if(dados.usuarioUid == this.afa.auth.currentUser.uid)
     {  
      if(dados.gerarLembrete)
      {
        this.DB.collection('notificacoes').doc(dados.cronUid).delete()
        .then(()=>{
          //ATUALIZAR NA TODO 
          this.idCliente = this.global.dadosLogado.idCliente;

          dados.lembretehora = '',
          dados.lembreteData = '';
          dados.gerarLembrete = false;
          dados.lembreteTIme = 0;
      

          this.DB.collection(this.idCliente).doc('dados').collection('diretorios').doc(this.afa.auth.currentUser.uid).collection('toDo').doc(tarefaUid).set(dados)
          .then(()=>{
            resolve('Lembrete excluido com sucesso!')
          })
          .catch(err=>{
            console.log('Falha ao atualizar exclusao de lembrete')
            reject(err)
          })
        })
        .catch(err=>{
          reject(err)
        })
      }
      else
      {
        resolve('Não existe cron')
      }
      

     }
     else
     {
      reject('Você não  pode excluir este lembrete ')
     }
    })
     
  }

}
