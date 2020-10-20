import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Plugins,CameraResultType,CameraSource,FilesystemDirectory, FilesystemEncoding } from '@capacitor/core'
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../seguranca/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class UploadstorageService {
  public uploadpercent:Observable<number>;
  public downloadUrlSet:Observable<string>;
  // Upload Task 
  task: AngularFireUploadTask;
  // Progress in percentage
  percentage: Observable<number>;
  // Snapshot of uploading file
  private snapshot: Observable<any>;
  private downloadURL : any;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  private currentUser:any;
  private idCliente:string;
  
  constructor(
    public fileIO: File,
    public FilePath:FilePath,
    public fileChooser:FileChooser,
    public afStorage:AngularFireStorage,
    private fire : AngularFirestore,
    public androidPermissions: AndroidPermissions,
    private auth:AuthService,
    private chooser: Chooser
  ) 
  { 
    try
    {
      this.currentUser = this.auth.getCUrrentUser();
      this.idCliente = this.currentUser['idCliente'];
    }
    catch(err)
    {
      console.log('Access nivel 1');
    }
  }

  AjustarPermissao(){
    this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.CAMERA,  
        this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.READ_CALENDAR,
        this.androidPermissions.PERMISSION.READ_CONTACTS,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
    ]);
  }
  async getPermission() {
    await this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (!status.hasPermission) {
          return this.androidPermissions.requestPermissions(
            [
              this.androidPermissions.PERMISSION.CAMERA,  
              this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
              this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
              this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE,
              this.androidPermissions.PERMISSION.READ_CALENDAR,
              this.androidPermissions.PERMISSION.READ_CONTACTS,
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
              this.androidPermissions.PERMISSION.RECORD_AUDIO
            ]
  
          );
        }

      });
  }

  enviarArquivo(id : string, dadosEnvio:any,blob:any,pasta?:string):Promise<string>
  {
    return new Promise((resolve, reject) => {

      let id_cliente = id;
      if(!pasta) pasta = 'docmensagens';

      if (id_cliente != "" && id_cliente != undefined) {
        console.log('Inicio upload');
          const ref = this.afStorage.ref(id_cliente+"/"+pasta+"/"+dadosEnvio.randonName);
          const customMetadata = { app: 'Lara Inteligencia Artificial' };

          let task = ref.putString(blob,'base64',{contentType: dadosEnvio.mime });
          
          task.snapshotChanges().pipe(
            finalize(() => {
              this.UploadedFileURL = ref.getDownloadURL();
              console.log(this.UploadedFileURL);
              this.UploadedFileURL.subscribe(resp=>{
                //ADD BANCO DE DADOS 
                
                console.log('Gravar BD '+resp);
                resolve(resp);
              },error=>{
                console.error(error);
              })
            }),
            tap(snap => {
                console.log(snap.totalBytes)
            })
          ).subscribe();
      }
      else {
        console.error("Falha ao gerar arquivo, ID Cliente não definido");
        reject();
      }
    });
  }

  async UploadArquivo(uri:string):Promise<string>{
    const uploadFilesDetails = {
      nome : '',
      path: '',
      mime : '',
      binaryData:'',
      randonName: ''
    }
    const { Filesystem } = Plugins; 
    return new Promise((resolve,reject)=>{
      this.FilePath.resolveNativePath(uri).then(async resolveNative=>{
        await this.fileIO.resolveLocalFilesystemUrl(resolveNative).then( resolveFileSystem=>{
          let files = resolveFileSystem as FileEntry;
          let nativeUrl = files.nativeURL;
          
          files.file(async success => {

            uploadFilesDetails.path = nativeUrl.substring(0, nativeUrl.lastIndexOf('/'));
            uploadFilesDetails.nome = nativeUrl.substring(nativeUrl.lastIndexOf('/'), nativeUrl.length).replace("/", "");
            uploadFilesDetails.mime = success.type;

          
            //PRONTO PARA GERAR BINARY FILE
            let fullName = uploadFilesDetails.path+'/'+uploadFilesDetails.nome;
            await Filesystem.readFile({
              path: fullName
              
            })
            .then(async fileSystemRetorno=>{
              uploadFilesDetails.binaryData = fileSystemRetorno.data;
              console.log('Base64 File gerado ')

              const blob: Blob = new Blob([uploadFilesDetails.binaryData],{ type: uploadFilesDetails.mime})
              
              console.log('Blob gerado ');
              const randomId = Math.random().toString(36).substring(2);
              const nomeArquivo = new Date().getTime()+randomId+uploadFilesDetails.nome;
              uploadFilesDetails.randonName = nomeArquivo

              await this.enviarArquivo('',uploadFilesDetails,uploadFilesDetails.binaryData)
              .then((data)=>{
                console.log('URL download '+data)
                resolve(data)
              })
              .catch((err)=>{
                reject()
                console.log(err);
              })
            })
          })

        })

        
      })
    })
  }

  async SelecionarArquivo(id : string):Promise<string>
  {
    return new Promise((resolve, reject) => {
      const uploadFilesDetails = {
        nome : '', //name
        path: '', //uri
        mime : '', //media type
        binaryData:'',
        randonName: ''
      };

      const { Filesystem } = Plugins; 
      
      this.chooser.getFile()
      .then(async file => {
        console.log(file ? file : 'canceled');

        const randomId = Math.random().toString(36).substring(2);
        const nomeArquivo = new Date().getTime()+randomId+uploadFilesDetails.nome;

        uploadFilesDetails.nome = file.name;
        uploadFilesDetails.path = file.uri;
        uploadFilesDetails.mime = file.mediaType;
        uploadFilesDetails.randonName = nomeArquivo;
        
        await Filesystem.readFile({path: uploadFilesDetails.path })
        .then(async fileSystemRetorno=>{
          uploadFilesDetails.binaryData = fileSystemRetorno.data;
          console.log('Base64 File gerado ')

          const blob: Blob = new Blob([uploadFilesDetails.binaryData],{ type: uploadFilesDetails.mime})
          
          console.log('Blob gerado ');
          const randomId = Math.random().toString(36).substring(2);
          const nomeArquivo = new Date().getTime()+randomId+uploadFilesDetails.nome;
          uploadFilesDetails.randonName = nomeArquivo

          await this.enviarArquivo(id,uploadFilesDetails,uploadFilesDetails.binaryData)
          .then(data => {
            console.log(uploadFilesDetails);
            console.log('URL download '+data)
            resolve(data)
          })
          .catch(err => {
            reject()
            console.log(err);
          })
        });
      })
      .catch((error: any) => console.error(error));
    })
    
  }

  async uploadDrag(files : File[]):Promise<string>
  {
    return new Promise((resolve, reject) => {

    });
  }
}
