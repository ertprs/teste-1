import { ProcessosService } from 'src/app/services/design/processos.service';
import { Component, OnInit, Input } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

@Component({
  selector: 'app-viewimage',
  templateUrl: './viewimage.page.html',
  styleUrls: ['./viewimage.page.scss'],
})

export class ViewimagePage implements OnInit {
 
  @Input() urlData: string;
  uploadText:any;
  downloadText:any;
  FileTransfer:FileTransferObject;




  constructor(
    private transfer: FileTransfer, 
    private file: File,
    private filePath:FilePath,
    private fileChooser:FileChooser,
    private plataform:Platform,
    private androidPermissions:AndroidPermissions,
    private design:ProcessosService

  ) { 
    this.uploadText = '';
    this.downloadText = '';
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((res)=>{
      console.log('Verificando permissao ');
      if(!res.hasPermission)
      {
        console.log('Pedir permissão ');
        this.checkPermissions();
      }
      else
      {
        console.log('Permissão liberada ');
      }
    })
    .catch((err)=>{
      console.log('[ Erro solicitação de permissão ] ');
      console.log(err);
    })
  }
  
  ngOnInit() {
  }
  checkPermissions(){
    this.androidPermissions.requestPermissions(
       [
         this.androidPermissions.PERMISSION.CAMERA,  
         this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
         this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
         this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
         this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE
       ]
    );
}
async getPermission() {
  await this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    .then(status => {
      if (!status.hasPermission) {
        return this.androidPermissions.requestPermissions([
         
            this.androidPermissions.PERMISSION.CAMERA,  
            this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE
        
         

        ]);
     }
     else{
       this.Download();
     }
     
    });
}


  async Download()
  {
    let url =  encodeURI(this.urlData);
    let dataAtual = new Date().getTime();
    let filename = 'laraimg'+dataAtual+url.split("/").pop();
    let dir_name = 'Download'
    let path = this.file.externalRootDirectory;
    const fileTransfer: FileTransferObject = this.transfer.create();
    let result = this.file.createDir(this.file.externalRootDirectory, dir_name, true);
    result.then((resp)=>{
      path = resp.toURL();
      console.log(path);
      fileTransfer.download(
        url,
        path+filename,
        true,
        {}
      )
      .then((entry)=>{
        console.log('download complete: ' + entry.toURL());
        this.design.presentToast(
          'Download realizado com sucesso! '+entry.toURL(),
          'success',
          3000

        )
        //alert('Suc)'+JSON.stringify(entry))
        //if(this.plataform.is('ios'))
        
        
  
      })
      .catch((err)=>{
        //alert('Err)'+JSON.stringify(err))
        this.design.presentToast(
          'Falha ao salvar arquivo '+err,
          'danger',
          4000

        )
      })
    })
  
  


    
    
  

    


    
    
   
  }
}
