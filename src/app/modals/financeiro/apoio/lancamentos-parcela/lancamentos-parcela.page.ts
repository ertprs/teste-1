import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { LancamentoService } from 'src/app/services/financeiro/lancamento.service';

@Component({
  selector: 'app-lancamentos-parcela',
  templateUrl: './lancamentos-parcela.page.html',
  styleUrls: ['./lancamentos-parcela.page.scss'],
})
export class LancamentosParcelaPage implements OnInit {
  @Input() pedidoUid: string;


  private pedidoVinculado:string
  private dadosParcela = {
    nParcela:0,
    parcela:0,
    vencimento:'',
    valor:'',
    vencimentoInt:0,
    dataEnotas:''
  }
  private listParcelas = []
  constructor(
    private ctrlModal:ModalController,
    private srvLancamento:LancamentoService,
    private design:ProcessosService

  ) { }

  ngOnInit() {

    if(this.pedidoUid)
    {
      this.pedidoVinculado = this.pedidoUid
      this.listParcelas = []
      this.listarParcelas()
    }
  }
  pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
  }
  gerarParcela()
  {
    console.log('Inicio parcelas ')
    let qtdParcelas = Number(this.dadosParcela.parcela)
    console.log('Qtd parcelas '+qtdParcelas)
    let i = 0
    let parcelaNumero = 1
    for (i; i < qtdParcelas; i++) {
      parcelaNumero++ ;
      const dadosParcela = {
        nParcela:this.pad(i+1,3),
        vencimento:"",
        valor:0.00
      }
      console.log(dadosParcela)
    }
  }
  listarParcelas()
  {

    this.srvLancamento.parcelaGetAll(this.pedidoVinculado).subscribe(element=>{
      this.listParcelas = []
      element.docs.forEach(elemRet=>{
        if(elemRet.exists)
        {
          const data = elemRet.data()
          const id = elemRet.id
          data.vencimentoInt = Number(data.vencimentoInt ) * 1000
          const dadosAdd ={
            id,
            ... data
          }
          this.listParcelas.push(dadosAdd)
        }

      })

    })
  }
  deletar(uidParcela:string)
  {
    this.design.presentAlertConfirm(
      'Excluir?',
      'Confirma excluir este lançam,ento de parcela?'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.srvLancamento.parcelaDelete(this.pedidoVinculado,uidParcela)
        .then(resDelete=>{
          this.design.presentToast(
            'Deletado com sucesso',
            'success',
            3000
          )
          this.listarParcelas()
        })
      }
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao excluir parcela',
        'danger',
        0,
        true
      )
    })

  }
  adicionarParcela2()
  {
    let dataPadrao = this.dadosParcela.vencimento
    let dataDividida = dataPadrao.split('-')
    let dataInt = new Date(Number(dataDividida[0]),Number(dataDividida[1])-1,Number(dataDividida[2]))
    this.dadosParcela.vencimentoInt = Number(dataInt)
    //"vencimento": "2020-11-29T02:00:00Z"
    let dataE = dataDividida[0]+"-"+dataDividida[1]+"-"+dataDividida[2]+"T02:00:00Z"
    this.dadosParcela.dataEnotas = dataE

    console.log(this.dadosParcela)
  }
  adicionarParcela()
  {
    let dataPadrao = this.dadosParcela.vencimento
    let dataDividida = dataPadrao.split('-')
    let dataInt = new Date(Number(dataDividida[0]),Number(dataDividida[1])-1,Number(dataDividida[2]))
    this.dadosParcela.vencimentoInt = Number(dataInt)
    //"vencimento": "2020-11-29T02:00:00Z"
    let dataE = dataDividida[0]+"-"+dataDividida[1]+"-"+dataDividida[2]+"T02:00:00Z"
    this.dadosParcela.dataEnotas = dataE

    
    this.design.presentLoading('Adicionando...')
    .then(resLoading=>{
      resLoading.present()

      this.srvLancamento.parcelaAdd(this.pedidoVinculado,this.dadosParcela)
      .then(resAdd=>{
        this.listarParcelas()
      })
      .catch(errAdd=>{
        console.log(errAdd)
        this.design.presentToast(
          'Falha ao adicionar parcela',
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
  closeModel()
  {
    this.ctrlModal.dismiss()
  }

}
