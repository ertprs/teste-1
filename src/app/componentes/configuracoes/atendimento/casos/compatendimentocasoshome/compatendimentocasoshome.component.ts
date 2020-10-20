import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compatendimentocasoshome',
  templateUrl: './compatendimentocasoshome.component.html',
  styleUrls: ['./compatendimentocasoshome.component.scss'],
})
export class CompatendimentocasoshomeComponent implements OnInit {

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
