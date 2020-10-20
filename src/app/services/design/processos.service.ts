import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, PopoverController, Platform } from '@ionic/angular';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class ProcessosService {

  constructor(
    public loadingController: LoadingController,
    public toastCOntroller:ToastController,
    public alertController: AlertController,
    private popoverController: PopoverController,
    private plataforma : Platform,
  ) { }


  async presentLoading(message:string) {
     const loading =  await this.loadingController.create({
      message
    });
    return loading
  
  }

  presentAlertConfirm(header:string,message:string,textTrue:string = 'Opa!',textFalse:string = 'Não!'):Promise<Boolean> {

    return new Promise((resolve, reject) => {
      
      this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: textFalse,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(false)
              this.popoverController.dismiss();
            }
          }, {
            text: textTrue,
            handler: () => {
              resolve(true)
              this.popoverController.dismiss();
            }
          }
        ]
      })
      .then((res)=>{
        res.present();

      })
      .catch((err)=>{
        console.log('Falha ao abrir alert ');
        resolve(false)
      })
      


    })


    
  }

  async presentToast(message:string,color:string,duration:number,confirmObrigatorio?:boolean) {
    

    

    if (this.plataforma.is('hybrid')) {

      if(!confirmObrigatorio)
      {
        confirmObrigatorio = false;
      }


      if(confirmObrigatorio)
      {
        const toast = await this.toastCOntroller.create({
          header: 'Alerta',
          message,
          color,
          position: 'bottom',
          cssClass:'tostGeral',
          buttons: [
            {
              side: 'end',
              text: 'OK!',
              handler: () => {
                console.log('OK clicked');
              }
            }
          ]
        });
        toast.present()
      }
      else
      {
        const toast = await this.toastCOntroller.create({
          message,
          color,
          duration,
          position:'bottom',
          cssClass:'tostGeral'
        });
        toast.present();
      }

      
    }
    else
    {
      //WEB
      if(!confirmObrigatorio)
      {
        confirmObrigatorio = false;
      }

      if(confirmObrigatorio)
      {
        const toast = await this.toastCOntroller.create({
          header: 'Alerta',
          message,
          color,
          position: 'middle',
          cssClass:'tostGeral',
          buttons: [
            {
              side: 'end',
              text: 'OK!',
              handler: () => {
                console.log('OK clicked');
              }
            }
          ]
        });
        toast.present()
      }
      else
      {
        const toast = await this.toastCOntroller.create({
        
          message,
          position: 'top',
          duration,
          cssClass:'tostGeral',
          color
        
        });
        toast.present()
      }

    
    }
    
  }


  async notificacaoConversa(message:string) {
    
    const toast = await this.toastCOntroller.create({
        
      message,
      position:'top' ,
      duration:2000,
      color:'secundary',
      cssClass:'toastNotConversa'
    
    });
    toast.present()
    
    
  }
}
