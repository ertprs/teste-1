import { ProcessosService } from './../../../../services/design/processos.service';
import { AprendizadoService } from './../../../../services/lara/aprendizado.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Aprendizado } from 'src/app/interface/lara/aprendizado';
import { ActivatedRoute } from '@angular/router';
import { Exemploia } from 'src/app/interface/lara/aprendizado/exemploia';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {



  public dadosAprendizado: Aprendizado = {};
  public dadosAprendizadoExemplo: Exemploia = {};
  public aprendizadoId: string = null;
  public aprendizadoSubscription: Subscription;

  public exemplos = new Array<Exemploia>();
  public  exemplosSubscription: Subscription;

  constructor(
    public serviceAprendizado:AprendizadoService,
    public activatedRoute: ActivatedRoute,
    public design:ProcessosService
    
  ) { 
    this.aprendizadoId = this.activatedRoute.snapshot.params['aprendizadoUid']; 

    

    if (this.aprendizadoId) {
      this.loadDados();
      //this.loadDadosExemplo();
    }
    else
    {
      this.aprendizadoId = null;
      console.log('Novo treinamento....'+this.aprendizadoId)
    } 
  }

  ngOnInit() {
  }
  loadDadosExemplo()
  {
    console.log('Abrindo exemplos de '+this.aprendizadoId);
    this.aprendizadoSubscription = this.serviceAprendizado.getAllExemplos(this.aprendizadoId).subscribe(data => {
     
      this.exemplos = data;
      
      
    })
  }
  loadDados(){
    console.log('Abrindo dados do aprendizado');
    this.aprendizadoSubscription = this.serviceAprendizado.get(this.aprendizadoId).subscribe(data => {
     
      this.dadosAprendizado = data;
      
      this.loadDadosExemplo();
     
    })
  }
  submitForm()
  {
    console.log(this.dadosAprendizado)
    this.serviceAprendizado.add(this.dadosAprendizado)
    .then((res)=>{
      this.aprendizadoId = res.id;
      this.loadDadosExemplo();
      console.log(res);
      this.design.presentToast(
        'Ensinamento incluido com sucesso',
        'success',
        3000
      )
    })
  }
  addExemplo()
  {
    console.log(this.dadosAprendizadoExemplo);
    const add = this.serviceAprendizado.addExemplo(this.aprendizadoId,this.dadosAprendizadoExemplo);
    add.then((res)=>{
      
      this.design.presentToast(
        "Exemplo adicionado ",
        "success",
        2000
        )
        this.dadosAprendizadoExemplo.exemplo = '';
    })
    .catch((err)=>{
      console.log(err)
      this.design.presentToast(
        "Falha ao excluir exemplo ",
        "danger",
        4000
        )
    })
  }
  delete(id:string)
  {
    this.design.presentAlertConfirm(
      "Excluir",
      "Confirma excluir este exemplo?",
      "Pode!",
      "Nem pensar..."
    )
    .then((res)=>{
      if(res)
      {
        this.serviceAprendizado.deleteExemplo(this.aprendizadoId,id)
        .then(()=>{
          this.design.presentToast(
            "Deletado com sucesso",
            "success",
            2000
          )
        })
        .catch((err)=>{
          console.log(err);
          this.design.presentToast("Falha ao excluir exemplo","danger",4000);
        })
      }
    })
  }
  ngOnDestroy()
  {
    this.exemplosSubscription.unsubscribe();
    this.aprendizadoSubscription.unsubscribe();
  }
}
