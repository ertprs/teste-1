import { ParceirosService } from './../../../services/parceiros/parceiros.service';
import { ProcessosService } from 'src/app/services/design/processos.service';

import { Component, OnInit } from '@angular/core';
import { Itaddparceiro } from 'src/app/interface/parceiros/add/itaddparceiro';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public currentUser:any;
  public parceiroId: string = null;
  public parceiroSubscription: Subscription;

  public dadosParceiro: Itaddparceiro = {};
  public prceiroNome : string = '';
  public parceiroDocumento : string = '';
  public parceiroDocSituacao : string = null;
  public numericPattern : RegExp = /^[0-9]+$/;
  public toUpdate : boolean = false;
  public fGroup : FormGroup;

  constructor(
    private design:ProcessosService,
    private parceiroService : ParceirosService,
    private activatedRoute: ActivatedRoute,
    private formBuilder : FormBuilder,
    private navCtrl : NavController

  ) { 
    this.parceiroId = this.activatedRoute.snapshot.params['parceiroUid']; 

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
          console.log('Falha ao carregar dados do contato ');
        }
      })
      .catch((err)=>{
        console.log('Falha ao carregar dados do contado')
      })
      
    }

  }

  ngOnInit() {
  }

  ngOnDestroy(){

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
        console.log('Falha ao registrar subscribe de parceiros');
        reject();
      }
    });

  }

  generateColor(){
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  async add(){
    this.dadosParceiro = this.fGroup.value;
    this.dadosParceiro.photo = this.generateColor();

    await this.design.presentLoading('Cadastrando...')
    .then((res)=>{
      res.present();
      this.parceiroService.add(this.dadosParceiro)
      .then(()=>{
        this.design.presentToast(
          'Parceiro cadastrado com sucesso',
          'success',
          3000
        );
        this.navCtrl.back();
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
    })
  }

  async update(){
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
          this.navCtrl.back();
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

  validarDocumento(event : any){
    this.parceiroDocumento = event.target.value;

    if(this.parceiroDocumento.length == 11) {
      let cpf : any = this.parceiroDocumento;
          if ( !cpf || cpf.length != 11
                  || cpf == "00000000000"
                  || cpf == "11111111111"
                  || cpf == "22222222222" 
                  || cpf == "33333333333" 
                  || cpf == "44444444444" 
                  || cpf == "55555555555" 
                  || cpf == "66666666666"
                  || cpf == "77777777777"
                  || cpf == "88888888888" 
                  || cpf == "99999999999" ) 
          {
            this.parceiroDocSituacao = 'cpf invalido';
            console.warn(this.parceiroDocSituacao);
            return null;
          }
              
          let soma = 0;
          let resto;

          for (var i = 1; i <= 9; i++) 
              soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
          resto = (soma * 10) % 11
          if ((resto == 10) || (resto == 11))  resto = 0
          if (resto != parseInt(cpf.substring(9, 10)) ) return null;
          soma = 0;

          for (var i = 1; i <= 10; i++) 
              soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
          resto = (soma * 10) % 11
          if ((resto == 10) || (resto == 11))  resto = 0;
          if (resto != parseInt(cpf.substring(10, 11) ) ) {
            this.parceiroDocSituacao = 'cpf invalido';
            console.warn(this.parceiroDocSituacao);
            return false;
          }
          console.log('cpf válido');
          this.parceiroDocSituacao = 'cpf valido';
          return true;
    }

    else if(this.parceiroDocumento.length == 14) {
        let cnpj : any = this.parceiroDocumento;
        
            if ( !cnpj || cnpj.length != 14
                    || cnpj == "00000000000000" 
                    || cnpj == "11111111111111" 
                    || cnpj == "22222222222222" 
                    || cnpj == "33333333333333" 
                    || cnpj == "44444444444444" 
                    || cnpj == "55555555555555" 
                    || cnpj == "66666666666666" 
                    || cnpj == "77777777777777" 
                    || cnpj == "88888888888888" 
                    || cnpj == "99999999999999")
            {
              this.parceiroDocSituacao = 'cnpj invalido';
              console.warn(this.parceiroDocSituacao);
              return false;
            }
                
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0,tamanho);
            let digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2) pos = 9;
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0)) {
              this.parceiroDocSituacao = 'cnpj invalido';
              console.warn(this.parceiroDocSituacao);
              return false;
            }

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) pos = 9;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
            if (resultado != digitos.charAt(1)) {
              this.parceiroDocSituacao = 'cnpj invalido';
              console.warn(this.parceiroDocSituacao);
              return false;
            }
            this.parceiroDocSituacao = 'cnpj valido';
            console.warn(this.parceiroDocSituacao);
            return true;
    }

    else {
      this.parceiroDocSituacao = null;
      console.warn(this.parceiroDocSituacao);
      return false;
    }
  }

}