import { ProcessosService } from './../../../../services/design/processos.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modalatfiltrosdata',
  templateUrl: './modalatfiltrosdata.page.html',
  styleUrls: ['./modalatfiltrosdata.page.scss'],
})
export class ModalatfiltrosdataPage implements OnInit {

  public filtro = {
    dataIni:'',
    horaInit:'00:00',
    dataFim:'',
    horaFim:'23:59'
  }
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService
  ) { }
  closeModal(){
    this.ctrlModal.dismiss();
  }
  ngOnInit() {

  }
  executarFiltro()
  {
    try
    {
     
      let dataIniExplod = this.filtro.dataIni.split('-')
      let HoraIniExplod = this.filtro.horaInit.split(':')

      let dataFimExplod = this.filtro.dataFim.split('-')
      let HoraFimExplod = this.filtro.horaFim.split(':')

      let dataIni = new Date(Number(dataIniExplod[0]),Number(dataIniExplod[1])-1,Number(dataIniExplod[2]),Number(HoraIniExplod[0]),Number(HoraIniExplod[1]),0)
      let dataFim = new Date(Number(dataFimExplod[0]),Number(dataFimExplod[1])-1,Number(dataFimExplod[2]),Number(HoraFimExplod[0]),Number(HoraFimExplod[1]),0)
      
      if(dataFim < dataIni)
      {
        this.design.presentToast(
          'Intervalo de data invalido',
          'warning',
          0,
          true
        )
      }
      else
      {
        const retornoAcao = {
          acao:'filtrar',
          filtro:{
            dataIni:dataIni.getTime(),
            dataFim:dataFim.getTime(),
            dataIniString:this.filtro.dataIni+' '+this.filtro.horaInit,
            dataFimString:this.filtro.dataFim+' '+this.filtro.horaFim
          }
        }
        this.ctrlModal.dismiss(retornoAcao)
      }
    }
    catch(err)
    {
      this.design.presentToast(
        'Verifique se informou as datas corretamente',
        'warning',
        0,
        true
      )
    }
    
    
   
  }
}
