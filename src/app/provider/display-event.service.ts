import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayEventService {

  //CONTAINERS VARIAVEIS
  public leftContainer : string = 'block';
  public rightSize : number = 9;

  constructor() { }

  fullscreenMode(){
    if (this.leftContainer == 'block') {
      this.leftContainer = 'none';
      this.rightSize = 12;
    }
    else {
      this.leftContainer = 'block';
      this.rightSize = 9;
    }
  }
}
