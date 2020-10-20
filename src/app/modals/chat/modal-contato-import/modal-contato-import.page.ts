import { ProcessosService } from 'src/app/services/design/processos.service';
import { GruposService } from 'src/app/services/chat/grupos.service';
import { ContatosService } from 'src/app/services/chat/contatos.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Contatos } from 'src/app/interface/chat/contatos';

@Component({
  selector: 'app-modal-contato-import',
  templateUrl: './modal-contato-import.page.html',
  styleUrls: ['./modal-contato-import.page.scss'],
})
export class ModalContatoImportPage implements OnInit {
  @Input() dadosImportar: any;

  public items = [];
  public grupos = [];
  public dadosContato: Contatos = {};
  constructor(
    private ctrlModal:ModalController,
    private srvcontato:ContatosService,
    private srvGrupo:GruposService,
    private design:ProcessosService

  ) { }

  ngOnInit() {

    if(this.dadosImportar)
    {
      console.log('Existen dados ')

      const dadosRecebidos  = <any>JSON.parse(this.dadosImportar)
      let cont = 0;
      dadosRecebidos.forEach(element => {
        
        //CHECAR GRUUPO

        let grupo = '';
        let subgrupo = '';

        if(element.grupo[0]!== undefined)
        {
          grupo = element.grupo[0]
        }

        if(element.grupo[1]!== undefined)
        {
          subgrupo = element.grupo[1]
        }

        if(grupo != '')
        {
          let checkGrupo = this.grupos.reduce( function( cur, val, index ){

              if( val === grupo.toUpperCase()  && cur === -1 ) {
                  return index;
              }
              return cur;
          
          }, -1 );
          if(checkGrupo == -1)
          {
            this.grupos.push(grupo.toUpperCase())
          }
        }
        
        if(subgrupo != '')
        {
          let subGrupo = this.grupos.reduce( function( cur, val, index ){

              if( val === subgrupo.toUpperCase()  && cur === -1 ) {
                  return index;
              }
              return cur;
          
          }, -1 );
          if(subGrupo == -1)
          {
            this.grupos.push(grupo.toUpperCase())
          }
        }
        
        const item = {cont,situacao:'Pronto',...element}
        
        this.items.push(item)
        cont++;
      });


      console.log(this.grupos)
      
    }
    else
    {
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

          if(elem.grupo[0] !== undefined )
          {
            grupo = elem.grupo[0].trim()
          }

          if(elem.grupo[1] !== undefined )
          {
            subgrupo = elem.grupo[1].trim()
          }
          
         




          const contatos = {
            canal:'whatsapp',
            nome:elem.nome,
            origem:elem.telefone,
            grupo,
            subgrupo,
            favorito:false,
            livechat:false,
            nomeClienteVinculado:'',
            uidClienteVinculado:'',
            notas:'Importação por arquivo',
            emmassa:true,
            dataNascimento:elem.dataNascimento,
            dtNascimentoMes:elem.dtNascimentoMes,
            dtNascimentoAno:elem.dtNascimentoAno,
            dtNascimentoDia:elem.dtNascimentoDia
          }
          

         console.log("->>"+ JSON.stringify(contatos))
          
          
        


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
  closeModal(){
    this.ctrlModal.dismiss();
  }

}
