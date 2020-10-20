import { Component, OnInit } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-compatendimentodetalhe',
  templateUrl: './compatendimentodetalhe.component.html',
  styleUrls: ['./compatendimentodetalhe.component.scss'],
})
export class CompatendimentodetalheComponent implements OnInit {

  constructor(
    private eventEmitterService: ProvEmitterEventService
  ) { }

  ngOnInit() {}
  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }
  
}
