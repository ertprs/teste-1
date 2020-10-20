import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalController, IonRouterOutlet, PopoverController, NavController } from '@ionic/angular';
import { iCategorias } from 'src/app/interface/financeiro/configuracoes/categorias';
import { CategoriasService } from 'src/app/services/financeiro/configuracoes/categorias.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public dadosCategoria: iCategorias = {};
  public currentUser:any;
  public categoriaId: string = null;
  public categoriaSubscription: Subscription;
  public toUpdate : boolean = false;

  public fGroup: FormGroup;


  constructor(
    private fbuilder:FormBuilder,
    private categoriaService:CategoriasService,
    private designProccess:ProcessosService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public popoverController: PopoverController,
    private navCtrl:NavController
  ) 
  {
    this.categoriaId = this.activatedRoute.snapshot.params['uid']; 

    this.fGroup = this.fbuilder.group({
      'nome':['' ,Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]
    });

    if (this.categoriaId){
      this.toUpdate = true;
      this.loadCategoria().then(res=>{
        if(res)
        {
          this.fGroup.get('nome').setValue(this.dadosCategoria.nome);

        }
        else
        {
          console.log('Falha ao carregar dados da categoria');
        }
      })
      .catch((err)=>{
        console.log('Falha ao carregar dados da categoria');
      });
    };
  }

  ngOnInit() {

  }

  async delete(){
    await this.designProccess.presentAlertConfirm(
      'Excluir!',
      'Posso excluir este contato?',
      "Pode!",
      "Nem pensar..."
    )
    .then((resp)=>
    {
      
      if(resp)
      {
        // this.categoriaService.delete('teste')
        // .then(()=>{
        //   this.designProccess.presentToast(
        //     'Contato deletado com sucesso ',
        //     'success',
        //     3000
        //   )
        //   this.router.navigate(['chat/contatos'])
        // })
        // .catch((err)=>{
        //   this.designProccess.presentToast(
        //     'Falha ao deletar contato '+err,
        //     'success',
        //     3000
        //   )
        // });

        console.log('excluido com sucesso');
      }

    })
    .catch(()=>{

    })
  }

  add(){
    this.dadosCategoria = this.fGroup.value;

      this.designProccess.presentLoading('Gravando...')
      .then((res)=>
      {
        res.present();
        this.categoriaService.add(this.dadosCategoria)
        .then((res)=>{
          this.designProccess.presentToast(
            'Gravado com sucesso',
            'success',
            3000
          )
          this.navCtrl.back();
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao gravar categoria '+err,
            'danger',
            4000
          )
        })
        .finally(()=>{
          res.dismiss();
        });
      });
  }

  update(){
    if (this.categoriaId) {

      this.dadosCategoria = this.fGroup.value;

      this.designProccess.presentLoading('Atualizando...')
      .then((res)=>
      {
        res.present();
        this.categoriaService.update(this.categoriaId, this.dadosCategoria)
        .then((res)=>{
          console.log(this.dadosCategoria);
          this.designProccess.presentToast(
            'Atualizado com sucesso',
            'success',
            3000
          )
          this.navCtrl.back();
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao atualizar categoria '+err,
            'danger',
            4000
          )
        })
        .finally(()=>{
          res.dismiss();
        });
      }); 
    }
    else {
      console.log('falha ao validar categoriaId');
    }

  }

  loadCategoria(): Promise<Boolean> {

    return new Promise((resolve, reject) => {
      try
      {
        this.categoriaSubscription = this.categoriaService.get(this.categoriaId).subscribe(data => {
          this.dadosCategoria = data;
          resolve(true);
        });
      }
      catch(err)
      {
        reject();
      }
      
    });
  }
}
