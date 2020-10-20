import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import EmojiButton from '@joeattardi/emoji-button';
import { NavParams } from '@ionic/angular';
import { ChatMessageService } from 'src/app/provider/chat-message.service';

@Component({
  selector: 'app-popoveremoji',
  templateUrl: './popoveremoji.page.html',
  styleUrls: ['./popoveremoji.page.scss'],
})
export class PopoveremojiPage implements OnInit {

  @ViewChild('pickerArea', {static: false}) pickerAreaElement: HTMLElement;
  @ViewChild('msgBox', {static: false}) textBox : HTMLElement;
  // @ViewChild('pickerarea', {static: false}) emojiWrapper: HTMLElement;
  private conversaTextBox : any;
  private picker = new EmojiButton({ position: 'auto', autoFocusSearch: false, autoHide: false });
  private pickerVisibility : boolean = false;
  constructor(
    private chatMsgService : ChatMessageService,
    private navParams : NavParams
  ) 
  { 
  }

  ngOnInit() {
    this.conversaTextBox = this.navParams.get('textarea');

    if (this.pickerVisibility == true) {
      this.pickerVisibility = false
      this.picker.hidePicker();
    }
    else {
      this.pickerVisibility = false;
      this.picker.showPicker(this.pickerAreaElement);
    }

    this.picker.on('emoji', emoji => {
      this.chatMsgService.updateCurrentMessage(emoji, this.conversaTextBox);
      return;
    });
  }


  ngAfterViewInit(){

  }

  ngOnDestroy(){
    this.pickerVisibility = false;
    this.picker.hidePicker();
  }
}
