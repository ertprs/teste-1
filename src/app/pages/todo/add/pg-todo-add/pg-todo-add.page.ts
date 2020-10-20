import { ProcessosService } from 'src/app/services/design/processos.service';
import { Ittodo } from 'src/app/interface/todo/ittodo';
import { ServTodoService } from './../../../../services/todo/serv-todo.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pg-todo-add',
  templateUrl: './pg-todo-add.page.html',
  styleUrls: ['./pg-todo-add.page.scss'],
})
export class PgTodoAddPage implements OnInit {

  public dadosTarefa: Ittodo = {};

  @Input() tarefaUid: string;
  @Input() dadosConversa: any;
  constructor(
    private ctrlModal:ModalController,
    private serviceToDo:ServTodoService,
    private design:ProcessosService
  ) { }

  ngOnInit() {

    if(this.tarefaUid)
    {
      this.loadDados();
      
    }
    else
    {
      let data = new Date();
      let dia = data.toTimeString()
      console.log(dia)
      this.dadosTarefa.lembreteData = new Date().getTime().toString();
    }

    if(this.dadosConversa)
    {
      console.log(this.dadosConversa)
      this.dadosTarefa.descriaco = 'Entrar em contato com '+this.dadosConversa.contatoNome+', telefone '+this.dadosConversa.contatoOrigem
      this.dadosTarefa.titulo = 'Lembrete de contato '+this.dadosConversa.contatoNome
    }

  }

  closeModal(){
    this.ctrlModal.dismiss();
  }
  delete(){
    this.design.presentAlertConfirm(
      'Deletar?',
      'Você quer mesmo deletar esta tarefa?',
      'Tenho!',
      'Não'
    )
    .then(res=>{
      if(res)
      {

        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()
          this.serviceToDo.deleteCron(this.tarefaUid,this.dadosTarefa)
          .then(resDeleteCron=>{
            console.log('Cron deletado ')
            this.serviceToDo.delete(this.tarefaUid)
            .then(()=>{
              this.ctrlModal.dismiss({acao:'delete',uid:this.tarefaUid});
              this.design.presentToast(
                'Tarefa deletada',
                'secondary',
                1000
              )
            })
            .catch(err=>{
              console.log(err)
              this.design.presentToast(
                'Falha ao tentar deletar tarefa',
                'danger',
                0,
                true
              )
            })
            .finally(()=>{
              resLoading.dismiss();
            })
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Falha ao excluir cron',
              'danger',
              0,
              true
            )
          })
        })


       
      }
    })
    .catch(err=>{
      console.log(err)
      this.design.presentToast(
        'Falha ao iniciar delete',
        'danger',
        0,
        true
      )
    })
  }
  loadDados()
  {
    this.serviceToDo.get(this.tarefaUid).subscribe(dados=>{
      this.dadosTarefa = dados;
    })
  }
  add()
  {
    this.design.presentLoading('Incluindo...')
    .then(resLoading=>{
      resLoading.present();
    
      this.serviceToDo.add(this.dadosTarefa,this.dadosConversa)
      .then((res)=>{

       

        this.ctrlModal.dismiss();
        this.design.presentToast(
          'Tarefa incluida',
          'success',
          3000
        )
      })
      .catch(err=>{
        this.dadosTarefa.gerarLembrete = false;
        console.log(err)
        this.design.presentToast(
          err,
          'danger',
          0,
          true
        )

      })
      .finally(()=>{
        resLoading.dismiss();
      })
    })
    .catch(err=>{

    })
    
  }

  alarmDelete(tarefaUid:any,dados:Ittodo)
  {
    this.design.presentAlertConfirm(
      'Excluir alerta',
      'Confirma excluir alerta?',
      'Pode!',
      'Não'
    )
    .then(resConfirm=>{
      if(resConfirm)
      {
        this.design.presentLoading('Excluindo...')
        .then(resLoading=>{
          resLoading.present()
          this.serviceToDo.deleteCron(tarefaUid,dados)
          .then(()=>{
            this.design.presentToast(
              'Alarme removiso com sucesso!',
              'success',
              3000
            )
          })
          .catch(err=>{
            console.log(err)
            this.design.presentToast(
              'Não foi possível excluir alarme',
              'danger',
              0,
              true
            )
          })
          .finally(()=>{
            resLoading.dismiss();
          })
        })
        
      }
    })
  }
}
