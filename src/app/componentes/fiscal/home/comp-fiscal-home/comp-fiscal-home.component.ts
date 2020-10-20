import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-fiscal-home',
  templateUrl: './comp-fiscal-home.component.html',
  styleUrls: ['./comp-fiscal-home.component.scss'],
})
export class CompFiscalHomeComponent implements OnInit {

  constructor(
    private eventEmitterService:ProvEmitterEventService
  ) { }

  ngOnInit() {}
  functionExecute(functionName:string,params:any)
  {
    console.log('preparando '+functionName);
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }


}
