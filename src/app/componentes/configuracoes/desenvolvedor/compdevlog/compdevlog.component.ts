import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { DesenvolvedorserviceService } from 'src/app/services/desenvolvedor/desenvolvedorservice.service';

@Component({
  selector: 'app-compdevlog',
  templateUrl: './compdevlog.component.html',
  styleUrls: ['./compdevlog.component.scss'],
})
export class CompdevlogComponent implements OnInit {
  public itemsLog = []
  constructor(
    private eventEmitterService: ProvEmitterEventService,
    private srvDesenvolvedor:DesenvolvedorserviceService
  ) { }
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  ngOnInit() {

    this.srvDesenvolvedor.getAllLog().subscribe(dados=>{
      this.itemsLog = dados
    })
  }

}
