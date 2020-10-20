import { Component, OnInit } from '@angular/core';
import { iCategorias } from 'src/app/interface/financeiro/configuracoes/categorias';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConversasService } from 'src/app/services/chat/conversas.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ComercialService } from 'src/app/services/comercial/comercial.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CategoriasService } from 'src/app/services/financeiro/configuracoes/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  public items = new Array<iCategorias>();
  private itemsSubscription: Subscription;
  public filtered:any[] = [];
  private categoriaUid: string = null;
  public queryText : string = '';
  private indexCount: number = 0;
  private carregado : Boolean = false;


  constructor(
    private categoriasService : CategoriasService,
    private design:ProcessosService,
    private router:Router,
    private conversasService:ConversasService,
    private afa:AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private comercialService:ComercialService,
    private navCtrl:NavController,
  ) 
  { 
    try
    {

    }
    catch(err)
    {
      this.design.presentToast(
        err,
        'danger',
        3000
      )
      this.router.navigate(['/empresaselect'])
    }
  }
  

  ngOnInit() {
    this.itemsSubscription = this.categoriasService.getAll().subscribe(data=>{
      this.carregado = true;
      this.indexCount = 0;

      data.forEach(elem => 
        this.indexCount++
      );

      this.items = data;
      this.filtered = this.items;
    });
  }

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
  }

  editar(categoriaId:string)
  {
    this.router.navigate(['financeiro/categorias/add/'+categoriaId]);
  }

  deletar(categoriaId:string) {
    this.design.presentAlertConfirm(
      'Excluir',
      'Confirma excluir a categoria?',
      'Sim',
      'Não'
    ).then(res=>{
      if(res) {
        this.categoriasService.delete(categoriaId).then(()=>{
          this.design.presentToast(
            'Excluido com sucesso',
            'success',
            3000
          )
        }).catch((err)=>{
          console.log(err)
          this.design.presentToast(
            'Falha ao excluir categoria',
            'danger',
            4000
          )
        })
      }
    }).catch(err=>{
      console.log(err);
      this.design.presentToast(
        'Falha ao tentar confirmação de exclusão',
        'danger',
        4000
      )
    })
  }

  categoriaSearch(event : any) {
    this.queryText = event.target.value;
    if (this.queryText == "") {
      this.filtered = this.items; // Original array with food elements can be [] also
    }
    else{
      const filter = this.queryText.toUpperCase();

      this.filtered = this.items.filter((categoria) => {
        for (let i = 0; i < categoria.nome.length; i++) {
          let categoriaNome = categoria.nome;
        
          if (categoriaNome.toUpperCase().indexOf(filter) > -1) {
            return categoria.nome;
          }
        }
      });
    }
  }

}
