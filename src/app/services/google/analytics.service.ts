
import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private googleAnalytics:FirebaseAnalytics) { }
  set(){
    this.googleAnalytics.setEnabled(true)
    .then((res)=>{
      console.log('Deu certo o SET - '+res);
    })
    .catch((err)=>{
      console.log('Deu ruim o ERR - '+err);
    })
  }

  setUser(uid:string)
  {
    this.googleAnalytics.setUserId(uid)
    .then((res)=>{
      console.log('Deu certo o setUserId - '+res);
    })
    .catch((err)=>{
      console.log('Deu ruim o setUserId - '+err);
    })
  }
  gravarPagina(title:string){

    this.googleAnalytics.setCurrentScreen(title)
    .then((res)=>{
      console.log('Deu certo o setCurrentScreen - '+res);
    })
    .catch((err)=>{
      console.log('Deu ruim o setCurrentScreen - '+err);
    })
    

  }


  
  
  
}
