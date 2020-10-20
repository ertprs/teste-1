import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {

  public desktopMsg : string = '';
  public cursorPosition : number = 0;

  constructor() { }

  updateCurrentMessage(emojiParams : any, myField : any){
    if (emojiParams != '') {
      const message = this.desktopMsg;
      const emoji = emojiParams;
      const position = this.cursorPosition;
      const result = [message.slice(0, position), emoji, message.slice(position)].join('');

      this.desktopMsg = result;
    }
    else {
      this.desktopMsg = this.desktopMsg;
    }
  }

}
