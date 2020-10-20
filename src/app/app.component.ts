import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public emitter:ProvEmitterEventService

  ) {
  
    this.initializeApp();
  }

  backAction(nameComponent?:string)
  {
    try
    {
      console.log('Voltar para '+nameComponent)
      const param = {
        function:'home',
        data:{}
      }
      this.emitter.onFirstComponentButtonClick(param)
    }
    catch(err)
    {
      console.log('Falha ao tentar BackAction');
      console.log(err)
    }
    
  }
  initializeApp() {

    this.platform.ready().then(() => {
      if(this.platform.is('iphone'))
      {

      }
      else
      {
        //ANDROID 
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.statusBar.styleDefault();
      }

      
      //this.statusBar.styleDefault();
      
      // let status bar overlay webview
      
      //this.statusBar.styleLightContent();
      //this.statusBar.styleBlackTranslucent();
      //this.statusBar.styleBlackOpaque();
      // set status bar to white
      //this.statusBar.styleLightContent();
      
      this.splashScreen.hide();
    });
  }
}
