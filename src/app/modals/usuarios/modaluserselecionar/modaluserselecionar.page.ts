import { Itconfusuario } from './../../../interface/configuracoes/usuario/itconfusuario';
import { UsuariosService } from './../../../services/seguranca/usuarios.service';
import { ProcessosService } from './../../../services/design/processos.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modaluserselecionar',
  templateUrl: './modaluserselecionar.page.html',
  styleUrls: ['./modaluserselecionar.page.scss'],
})
export class ModaluserselecionarPage implements OnInit {

  @Input() origem: string;
  public usuarios = new Array<Itconfusuario>()
  public listaGrupos = [];
  constructor(
    private ctrlModal:ModalController,
    private design:ProcessosService,
    private srvUsuarios:UsuariosService
  ) { }

  ngOnInit() {
    this.srvUsuarios.getUserEmpresaAll().forEach(dados=>{
    
      this.usuarios = dados
    })


  }

  closeModal(){
    this.ctrlModal.dismiss();
  }
  selection(usuarioUid:string,usuarioNome:string)
  {
    if(this.origem == 'homeatendimento')
    {
      this.ctrlModal.dismiss({acao:'filtrar',usuarioUid})
    }

    else if(this.origem == 'transferir')
    {
      this.ctrlModal.dismiss({acao:'transferir',usuarioUid,usuarioNome})
    }
    else{
      this.ctrlModal.dismiss({acao:this.origem,usuarioUid,usuarioNome})
    }
    
  }

}
