import { Ituserlogin } from './../../../interface/seguranca/ituserlogin';
import { Component, OnInit, Inject, Injectable, ViewChild, ElementRef } from '@angular/core';
import { AnalyticsService } from 'src/app/services/google/analytics.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AuthService } from 'src/app/services/seguranca/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  @ViewChild('loginBackground', {static: false}) loginBackground : ElementRef;
  public userDados: Ituserlogin = {};
  public platform: string;

  constructor(
    private glAnalytics:AnalyticsService,
    private designProccess:ProcessosService,
    private authService:AuthService,
    private router: Router,
    private plataforma : Platform
    
  ) { 
    try
    {
      this.glAnalytics.set();
      this.glAnalytics.gravarPagina('login');
    }
    catch(err)
    {
      console.log(err);
    }
    

  }

  ngOnInit() {
    console.log(this.plataforma);
    if(this.plataforma.is('hybrid')) {
      this.platform = 'mobile';
    } else {
      this.platform = 'web';
    }
  }
  criarConta()
  {
    this.router.navigateByUrl('/cadastro')
  }

  enterLogin(event : any){
    if(event.keyCode == 13){
      this.login();
    }
  }

  async login(){
    // console.log('...')
    // console.log(this.userDados)

    if(this.userDados.email  && this.userDados.senha)
    {
      console.log('Login...');
      await this.designProccess.presentLoading("Aguarde...")
      .then((res)=>{
      res.present(); 
          this.authService.FazerLogin(this.userDados)
          .then( (res2)=>{
            const dadosAddOnline = {
              createAt: new Date().getTime(),
              email:this.userDados.email,
              plataforma:this.platform,
              nome:res2.user.displayName,
              departamento:'',
              empresaUid:''
              

            }

            res.dismiss();
            
            
          })
          .catch((err2)=>{
            this.designProccess.presentToast(
              'Problema: '+err2,
              'danger',
              3000,
              true
            );
            res.dismiss();
            console.log('Falha ao logar '+err2);

          })
      })
      .catch((err)=>{
        
        console.log('ERRO '+err);
      })
    }
    else
    {
      this.designProccess.presentToast(
        'Informe usuario e senha',
        'secondary',
        4000
      )
    }


   


  }

}
