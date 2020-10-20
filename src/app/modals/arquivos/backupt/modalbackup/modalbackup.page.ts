import { ProcessosService } from 'src/app/services/design/processos.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';

@Component({
  selector: 'app-modalbackup',
  templateUrl: './modalbackup.page.html',
  styleUrls: ['./modalbackup.page.scss'],
})
export class ModalbackupPage implements OnInit {
  
  @Input() dadosImportar: any;



  public items = [];
  public grupos =[];
  public dataProcesso:number = new Date().getTime();
  public tipoarquivo:string

  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvcontato:ContatosService,
    private srvGrupo:GruposService,
  ) { }

  ngOnInit() {
    if(this.dadosImportar)
    {
      console.log('Existen dados  2')

      const dadosRecebidos  = <any>JSON.parse(this.dadosImportar)
      console.log(dadosRecebidos)
      if(dadosRecebidos.tipo == 'contatos')
      {
        this.tipoarquivo = 'Contatos BKP'
        
       
         
          let cont = 0;
          dadosRecebidos.contatos.forEach(element => {
            cont++;


            if(element.grupo !== '')
            {
              let checkGrupo = this.grupos.reduce( function( cur, val, index ){
    
                  if( val === element.grupo  && cur === -1 ) {
                      return index;
                  }
                  return cur;
              
              }, -1 );
              if(checkGrupo == -1)
              {
                this.grupos.push(element.grupo)
              }
            }
            
            if(element.subgrupo !== '')
            {
              let subGrupo = this.grupos.reduce( function( cur, val, index ){
    
                  if( val === element.subgrupo  && cur === -1 ) {
                      return index;
                  }
                  return cur;
              
              }, -1 );
              if(subGrupo == -1)
              {
                this.grupos.push(element.subgrupo)
              }
            }



            const it = {
              id:cont,
              situacao:'',
              ...
              element
            }
    
            this.items.push(it)
          })


        
       
        
      }
      else
      {
        this.design.presentToast(
          'Falha ao processar arquivo',
          'danger',
          0,
          true
        )
        console.log(dadosRecebidos.msg)
      }

    
      
   
    }
    else
    {
      this.design.presentToast(
        'Não existem dados a serem visualizados',
        'warning',
        0,
        true
      )
      console.log('Nào existem dados ')
    }
  }

  async importar()
  {
    if(this.dadosImportar)
    {

     //CADASTRAR GRUPOS
     this.grupos.forEach(nomem=>{

      this.srvGrupo.checkCadastro(nomem)
      .then(res=>{
        if(res == 0)
        {
          this.srvGrupo.add({nome:nomem})
          .then(res=>{
            console.log('GRUPO '+nomem+" cadstrado ")
          })
        }
      })
      
     })

     let qtdItens = this.items.length;
     let contadorImport = 0;
      this.items.forEach(async elem=>{
        contadorImport++;
        elem.situacao = 'Processando...';
      
        if(elem.valido)
        {
          let grupo = '';
          let subgrupo = '';

         
          const contatos = {
            canal:'whatsapp',
            nome:elem.nome,
            origem:elem.telefone,
            grupo:elem.grupo,
            subgrupo:elem.subgrupo,
            favorito:false,
            livechat:false,
            nomeClienteVinculado:'',
            uidClienteVinculado:'',
            notas:'Importação por arquivo',
            emmassa:true,
          }
          

         
          
          
        


          await this.srvcontato.add(contatos)
          .then(res=>{
         
            elem.situacao = 'Importado';
            if(qtdItens === contadorImport)
            {
              this.design.presentToast(
                'Processo finalizado',
                'secondary',
                0,
                true
              )
            }
          })
          .catch(err=>{
            if(err.situacao == 'suc')
            {
              elem.situacao = 'Importado';
            }
            else
            {
              elem.situacao = 'Falha '+err.msg;
            }
          
          })
          
        }
        else
        {
          elem.situacao = 'Não processado'
        }
       
        
      })
    }
  }

  closeModal()
  {
    this.design.presentAlertConfirm(
      'Sair',
      'Confirma sair da visualização de backup?',
      'Sim',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.ctrlModal.dismiss();
      }
    })
  }

}
