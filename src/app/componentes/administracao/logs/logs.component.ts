import { Component, OnInit, NgModule } from '@angular/core';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})

export class LogsComponent implements OnInit {

  constructor(private eventEmitterService: ProvEmitterEventService) { }

  ngOnInit() {}

  functionExecute(functionName:string,params:any) {
    const param = {
      function:functionName,
      data:params
    }
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

}
