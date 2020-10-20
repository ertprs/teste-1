import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { ParceirosService } from 'src/app/services/parceiros/parceiros.service';

@Component({
  selector: 'app-modalapoioconsultacidade',
  templateUrl: './modalapoioconsultacidade.page.html',
  styleUrls: ['./modalapoioconsultacidade.page.scss'],
})
export class ModalapoioconsultacidadePage implements OnInit {


  @Input() uf: string;
  private items = []
  constructor(
    private srvParceiro:ParceirosService,
    private design:ProcessosService,
    private ctrlModal:ModalController,
  ) { }

  ngOnInit() {
    this.gerarConsultaCidades()
  }
  selecionarCidade(dados:any)
  {

    this.ctrlModal.dismiss({
      codigo:dados.id,
      nome:dados.nome
    })
  }
  closeModal()
  {
    this.ctrlModal.dismiss()
  }
  gerarConsultaCidades()
  {

    this.design.presentLoading('Carregando cidades, aguarde ...')
    .then(resLoading=>{
      resLoading.present()
      this.srvParceiro.checkCidade(this.uf).then(resCidades=>{
        const data = resCidades.data
        this.items = data
      })
      .catch(err=>{
        this.design.presentToast(
          'Falha ao carregar cidades. Tente novamente mais tarde.',
          'danger',
          0,
          true
        )
      })
      .finally(()=>{
        resLoading.dismiss()
      })
    })

    
  }

}
