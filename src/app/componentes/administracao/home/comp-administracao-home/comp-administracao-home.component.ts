import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { AdministracaoService } from 'src/app/services/administracao/administracao.service';
import { Subscription } from 'rxjs';
import { ItEmpControle } from 'src/app/interface/administracao/itempcontrole';

@Component({
  selector: 'app-comp-administracao-home',
  templateUrl: './comp-administracao-home.component.html',
  styleUrls: ['./comp-administracao-home.component.scss'],
})
export class CompAdministracaoHomeComponent implements OnInit {

  private administracaoSubscription:Subscription;

  private dadosEmpControle = new Array<ItEmpControle>();
  public filtered : any[] = [];
  private queryResult : string = 'none';
  private scrollAuto = false;

  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private design : ProcessosService,
    private administracaoService:AdministracaoService
  ) { 
    this.administracaoSubscription = new Subscription;
  }

  ngOnInit() {    
    this.load();
  }

  ngOnDestroy() {
    
  }

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  load(){
    this.scrollAuto = false;
    this.administracaoSubscription = this.administracaoService.getAll().subscribe(data => {
      this.dadosEmpControle = data;

      this.administracaoSubscription.unsubscribe();
    });
  }

  sendEmpresas(){
    this.administracaoService.updateAll(this.dadosEmpControle);
  }

  async search(event:any)
  {
    this.queryResult = 'loading';
    this.design.presentLoading('Carregando...').then(async resloading => {
      resloading.present();
      if(event == '')
      {
        this.load();
        resloading.dismiss();
      }
      else
      {
        this.scrollAuto = false;
  
        this.dadosEmpControle = [];
        this.filtered = [];
  
        const query = event.toLowerCase();
  
        this.administracaoService.getFilter(query).forEach(elem=>{
          if (!elem.empty) {
            this.queryResult = 'none';
            elem.docs.forEach(elemdoc=>{
              const id = elemdoc.id;
              const data = elemdoc.data() as ItEmpControle;
              const dataRetorno =  {id, ... data,elemdoc}
    
              this.dadosEmpControle.push(dataRetorno);
            });
          }
        }).then(() => {
          this.dadosEmpControle.length <= 0 ? this.queryResult = 'noresults' : this.queryResult = 'none';
          // this.filtered = this.dadosEmpControle;
        });
        resloading.dismiss();
      }
    });


  }

  excluirEmpresa(dadosEmpresa:ItEmpControle) {
    console.log(dadosEmpresa);
  }

  teste(){
    this.administracaoService.updateAll(this.dadosEmpControle);
  }
}
