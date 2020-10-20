import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class ModalParceiroAddPage implements OnInit {

  public currentUser:any;
  public parceiroId : string = null;

  public dadosParceiro: Itaddparceiro = {};
  public parceiroSubscription: Subscription;
  public parceirosItems = new Array<Itaddparceiro>();
  private parceirosItemsSubscription: Subscription;
  
  public prceiroNome : string = '';
  public parceiroDocumento : string = '';
  public parceiroDocSituacao : string = null;
  public toUpdate : boolean = false;

  public recover  : any = {};
  private fGroup : FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private nav:NavParams,
    private design:ProcessosService,
    private parceiroService : ParceirosService,
    private activatedRoute: ActivatedRoute,
    private navCtrl : NavController,
    private modalCtrl:ModalController,
  ) { 

    this.fGroup = this.formBuilder.group({
      'nome': ['', Validators.compose([
        Validators.required,
      ])],
      'apelido': ['', Validators.compose([
        Validators.required,
      ])],
      'documento': ['', Validators.compose([
      ])],
      'ie': ['', Validators.compose([
      ])],
      'im': ['', Validators.compose([
      ])],
      'logradouro': ['', Validators.compose([
      ])],
      'numero': ['', Validators.compose([
      ])],
      'bairro': ['', Validators.compose([
      ])],
      'cep': ['', Validators.compose([
      ])],
      'complemento': ['', Validators.compose([
      ])],
      'estado': ['', Validators.compose([
      ])],
      'cidadeNome': ['', Validators.compose([
      ])],
    });


  }

  ngOnInit() {
    this.recover = this.nav.get('parceiroId');
    this.parceiroId = this.recover.parceiroId;

    if (this.parceiroId) {
      this.toUpdate = true;
      console.log('Abrindo dados de Parceiro');
      this.loadParceiro().then(res=>{
        if(res)
        {
          this.fGroup.get('nome').setValue(this.dadosParceiro.nome);
          this.fGroup.get('apelido').setValue(this.dadosParceiro.apelido);
          this.fGroup.get('documento').setValue(this.dadosParceiro.documento);
          this.fGroup.get('ie').setValue(this.dadosParceiro.ie);
          this.fGroup.get('im').setValue(this.dadosParceiro.im);
          this.fGroup.get('logradouro').setValue(this.dadosParceiro.logradouro);
          this.fGroup.get('numero').setValue(this.dadosParceiro.numero);
          this.fGroup.get('bairro').setValue(this.dadosParceiro.bairro);
          this.fGroup.get('cep').setValue(this.dadosParceiro.cep);
          this.fGroup.get('complemento').setValue(this.dadosParceiro.complemento);
          this.fGroup.get('estado').setValue(this.dadosParceiro.estado);
          this.fGroup.get('cidadeNome').setValue(this.dadosParceiro.cidadeNome);
        }
        else
        {
          console.error('Falha ao carregar dados do contato ');
        }
      })
      .catch((err)=>{
        console.error('Falha ao carregar dados do contado')
      })
      
    }
    else {
      console.log('Cadastrar parceiro');
    }
  }

  loadParceiro(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Abrir dados do contato');
        this.parceiroSubscription = this.parceiroService.get(this.parceiroId).subscribe(data => {
          this.dadosParceiro = data;
          resolve(true);  
        });
      } 
      catch (error) {
        console.error('Falha ao registrar subscribe de parceiros');
        reject();
      }
    });

  }

  loadParceiros() : Promise<Boolean> {
    return new Promise((resolve, reject) => {
      try {
        
        this.parceirosItemsSubscription = this.parceiroService.getAll().subscribe(data => {
          let encontrado = false;

          data.forEach(empresa => {
            if(empresa.documento == this.dadosParceiro.documento){
              encontrado = true;
            }
          });

          resolve(encontrado);
        });
      } 
      catch (error) {
        console.error('Falha ao carregar parceiros');
        reject(error);
      }
    });
  }


  async add(){

    this.dadosParceiro = this.fGroup.value;
    this.dadosParceiro.photo = this.generateColor();
    console.log(this.dadosParceiro.documento);
    
    this.loadParceiros().then((dados) => {

      if(this.dadosParceiro.documento == '' || this.dadosParceiro.documento == null){
        this.design.presentToast(
          'Preencha o campo de CNPJ para continuar!',
          'secondary',
          4000,
          true
        );
      }
      else if (dados == true) {

        this.design.presentToast(
          'CNPJ já cadastrado!',
          'secondary',
          4000,
          true
        );
      }
      else {
        this.design.presentLoading('Cadastrando...')
        .then((res)=>{
          res.present();
          this.parceiroService.add(this.dadosParceiro)
          .then(()=>{
            this.design.presentToast(
              'Parceiro cadastrado com sucesso',
              'success',
              3000
            );
            this.modalCtrl.dismiss();
          })
          .catch((err)=>{
            this.design.presentToast(
              'Falha: '+err,
              'danger',
              4000
            )
          })
          .finally(()=>{
            res.dismiss();
          })
        });
      }
    });



  }

  async update(){
    this.dadosParceiro = this.fGroup.value;
    this.dadosParceiro.photo = this.generateColor();
    console.log(this.fGroup.value);
    console.log(this.dadosParceiro);

    if (this.parceiroId) {

      this.dadosParceiro = this.fGroup.value;

      this.design.presentLoading('Atualizando...')
      .then((res)=>
      {
        res.present();
        this.parceiroService.update(this.parceiroId, this.dadosParceiro)
        .then((res)=>{
          this.design.presentToast(
            'Parceiro atualizado com sucesso',
            'success',
            3000
          );
          this.modalCtrl.dismiss();
        })
        .catch((err)=>{
          this.design.presentToast(
            'Falha ao atualizar parceiro '+err,
            'danger',
            4000
          )
        })
        .finally(()=>{
          res.dismiss();
        });
      }); 
    }
  }

  async delete(){
    if (this.parceiroId) {


      this.design.presentLoading('Excluindo...')
      .then((res)=>
      {
        res.present();
        this.parceiroService.delete(this.parceiroId)
        .then(res => {
          this.design.presentToast(
            'Parceiro excluído com sucesso',
            'success',
            3000
          );
          this.modalCtrl.dismiss();
        })
        .catch(err => {
          this.design.presentToast(
            'Falha ao excluir parceiro '+err,
            'danger',
            4000
          );
        })
        .finally(() => {
          res.dismiss();
        });
      }); 
    }
  }


  closeModal(){
    // this.parceirosItemsSubscription.unsubscribe();
    this.modalCtrl.dismiss();
  }

  generateColor(){
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
}
