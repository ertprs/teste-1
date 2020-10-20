import { async } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultaPage } from './../../../../modals/parceiros/consulta/consulta.page';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Contatos } from './../../../../interface/chat/contatos';
import { ContatosService } from './../../../../services/chat/contatos.service';
import { ProcessosService } from 'src/app/services/design/processos.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ModalController, PopoverController, IonContent, NavController } from '@ionic/angular';
import { PopovercontatoaddPage } from 'src/app/popover/popovercontatoadd/popovercontatoadd.page';
import { ProvEmitterEventService } from 'src/app/provider/prov-emitter-event.service';
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {


  @Input() contatoUid: string;
  public currentUser:any;
  public contatoId: string = null;
  public contatoSubscription: Subscription;



  public dadosContato: Contatos = {};
  public nomeOrigem = 'Telefone';
  public tipoOrigem = 'number';
  public typecampo:string = 'text';
  public origemInicial : string = '00000000000000';
  public placeholderOrigem = '55 (00) 0.0000-0000';
  public actualMask : string = '0000-0000 000 0000';
  public iconOrigem:string = 'call-outline';
  
  public favoritoIsChecked = false;
  public liveChatIsChecked = false;


  public fGroup: FormGroup
  

  constructor(
    private contatoService:ContatosService,
    private designProccess:ProcessosService,
    private activatedRoute: ActivatedRoute,
    private fbuilder:FormBuilder,
    private router:Router,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private navCtrl:NavController,
    private eventEmitterService: ProvEmitterEventService
  ) { 

  
    //AJUSTANDO BIND de dados
    this.fGroup = this.fbuilder.group({
      'nome':[null,Validators.compose([Validators.required,Validators.minLength(3)])],
      'origem':[null, Validators.compose([Validators.required])],
      'canal':[null,Validators.compose([Validators.required])],
      'notas':[null],
    });

    
  }

  functionExecute(functionName:string,params:any)
  {
    const param = {
      function:functionName,
      data:params
    }
    console.log('Active Click');
    console.log(param)
  
    this.eventEmitterService.onFirstComponentButtonClick(param); 
  }

  closeModal()
  {
    this.modalController.dismiss();
  }

  editarContato(){
    console.log('teste');
    this.closeModal();
    this.functionExecute('compContatoAdd',{contatoUid: this.contatoUid});
  }

  ngOnInit(){
    
  }

  parceiroSelect(){

  }
  
  ionViewDidEnter(){
    if (this.contatoUid){
      console.log('Abrindo dados de contato '+this.contatoUid);
      


      this.loadContato().then(res=>{
        if(res)
        {
          this.fGroup.get('nome').setValue(this.dadosContato.nome);
          this.fGroup.get('canal').setValue(this.dadosContato.canal);
          this.fGroup.get('notas').setValue(this.dadosContato.notas);
          this.setMask();

        }
        else
        {
          console.log('Falha ao carregar dados do contato ');
        }
      })
      .catch((err)=>{
        console.log('Falha ao carregar dados do contado')
      })
    }
    else
    {
      console.log('Novo contato '+this.contatoUid);
    }
  }
  setMask(){
    let canal = this.fGroup.value.canal;

    if (canal == 'email') {
      console.log('Tirar mascara para tipo de e-mail');
      this.typecampo = 'text';
      this.placeholderOrigem = 'email@email.com.br';
      this.actualMask ='A*@A*.S*.A*';
      this.iconOrigem = 'mail-outline'
      
    }
    if (canal == 'whatsapp') {
      console.log('Ajustar campo para number');
      this.typecampo = 'text';
      this.iconOrigem = 'call-outline'
      this.actualMask = '+00 (00) 00000-0000';
      this.placeholderOrigem = '';
      this.fGroup.get('origem').setValue(this.dadosContato.origem);

    }
    if (canal == 'whatsappdirect') {
      console.log('Ajustar campo para number');
      this.typecampo = 'text';
      this.iconOrigem = 'call-outline'
      this.actualMask = '+00 (00) 00000-0000';
      this.placeholderOrigem = '';
      this.fGroup.get('origem').setValue(this.dadosContato.origem);
    }
    if (canal == 'telfixo') {
      console.log('Ajustar campo para number');
      this.typecampo = 'text';
      this.placeholderOrigem = '';
      this.actualMask = '+00 (00) 0000-0000';
      this.fGroup.get('origem').setValue(this.dadosContato.origem);
      this.iconOrigem = 'call-outline'

    }
    if (canal == 'telegram') {
      console.log('Ajustar campo para number');
      this.typecampo = 'text';
      this.placeholderOrigem = '';
      this.actualMask = '000000000000000000000';
      this.iconOrigem = 'keypad-outline'
      this.fGroup.get('origem').setValue(this.dadosContato.origem);
      
    }
    if (canal == 'facebook') {
      console.log('Ajustar campo para number');
      this.typecampo = 'text';
      this.placeholderOrigem = '';
      this.actualMask = '000000000000000000000';
      this.iconOrigem = 'keypad-outline'
      this.fGroup.get('origem').setValue(this.dadosContato.origem);
    
    }



    console.log('switched to '+canal);
  }

  checkFavorito(ev)
  {
    var isChecked = ev.currentTarget.checked;
    if(!isChecked)
    {
      this.favoritoIsChecked = true;
    

      console.log('Checado');
    }
    else
    {
      this.favoritoIsChecked = false;
      console.log('Nao checado');
    }
    console.log(isChecked);//undefined
  }

  liveChatFavorito(ev)
  {
    var isChecked = ev.currentTarget.checked;
    if(!isChecked)
    {
      this.liveChatIsChecked = true;
    

      console.log('Checado');
    }
    else
    {
      this.liveChatIsChecked = false;
      console.log('Nao checado');
    }
    console.log(isChecked);//undefined
  }

  submitForm()
  {
   

    this.dadosContato = this.fGroup.value;
   
    if(this.liveChatIsChecked)
    {
      console.log('Live Chat Ativo');
      this.dadosContato.livechat = true;
    }
    else
    {
      console.log('Live Chat Desligado');
      this.dadosContato.livechat = false;
    }
    if(this.favoritoIsChecked)
    {
      console.log('Favorito Ativo');
      this.dadosContato.favorito = true;
    }
    else
    {
      console.log('Favorito Desligado');
      this.dadosContato.favorito = false;
    }
    
    if(!this.dadosContato.favorito){ this.dadosContato.favorito = false; }
    if(!this.dadosContato.livechat){ this.dadosContato.livechat = false; }
   

    if(this.dadosContato.canal == 'whatsapp' || this.dadosContato.canal == 'whatsappdirect')
    {
      let dadosOrigem = this.dadosContato.origem;
      dadosOrigem = dadosOrigem.replace("+","")
      dadosOrigem = dadosOrigem.replace("(","")
      dadosOrigem = dadosOrigem.replace(")","")
      dadosOrigem = dadosOrigem.replace("-","")
      dadosOrigem = dadosOrigem.replace(" ","")
      dadosOrigem = dadosOrigem.replace(" ","")
      console.log('Numero higienizado '+dadosOrigem);
      this.dadosContato.origem = dadosOrigem
    }

    if (!this.contatoUid) {
      console.log('Setar Empresa nova');
      this.dadosContato.uidClienteVinculado = '';
      this.dadosContato.nomeClienteVinculado = '';
    }


    console.log(this.dadosContato)
    this.add();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopovercontatoaddPage,
      event: ev,
      translucent: true
    });

    return await popover.present();
  }

  loadContato(): Promise<Boolean> {

    return new Promise((resolve, reject) => {
      try
      {
        console.log('Abrir dados do contato');
        this.contatoSubscription = this.contatoService.get(this.contatoUid).subscribe(data => {
          this.favoritoIsChecked = data.favorito;
          this.liveChatIsChecked = data.livechat;
          this.dadosContato = data;
          resolve(true)  
        });
        
      }
      catch(err)
      {
        console.log('Falha ao registrar subscribe de contatos ');
        reject();
      }
      
    })
    

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ConsultaPage,
      componentProps: {
        'contatoUid': this.contatoUid,
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    return await modal.present();
  }

  async delete()
  {

    await this.designProccess.presentAlertConfirm(
      'Excluir!',
      'Posso excluir este contato?',
      "Pode!",
      "Nem pensar..."
    )
    .then((resp)=>
    {
      
      if(resp)
      {
        //OK
        this.contatoService.delete(this.contatoUid)
        .then(()=>{
          this.designProccess.presentToast(
            'Contato deletado com sucesso ',
            'success',
            3000
          )
          this.modalController.dismiss();
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao deletar contato '+err,
            'success',
            3000
          )
        })
      }

    })
    .catch(()=>{

    })
  }

  add()
  {

    if (this.contatoUid) {
      //ATUALIZAR DADOS
      this.designProccess.presentLoading('Atualizando...')
      .then((res)=>
      {
        console.log(this.dadosContato);
        res.present();
        this.contatoService.update(this.contatoUid,this.dadosContato)
        .then(()=>{
          this.designProccess.presentToast(
            'Alterado com sucesso',
            'success',
            3000
            )
        })
        .catch((err)=>{
          this.designProccess.presentToast(
            'Falha ao atualizar contato '+err,
            'danger',
            4000
          )
        })
        .finally(()=>{
          res.dismiss();
         this.modalController.dismiss();
        })
      })

    }
    else
    {
      //ADICIONAR NOVO 
      console.log('Iniciando cadastro de contato');
      console.log(this.dadosContato)
      //this.dadosContato.favorito = this.favorito_checkbox;
      this.contatoService.add(this.dadosContato)
      .then(()=>{
        this.designProccess.presentToast(
          'Cadastrado com sucesso!',
          'success',
          3000
        )
        this.modalController.dismiss()
       
        
      })
      .catch((err)=>{
        console.log(err)
        if(err.code == 1)
        { 
          this.designProccess.presentToast(
            err.msg,
            'warning',
            0,
            true
          )
          
        }
        else
        { 
          this.designProccess.presentToast(
            'Falha ao cadastrar '+err,
            'danger',
            4000,
            true
          )
        }
       
      })
    }
    
  }

  toggleFavorito(){
     // this.favorito_checkbox == 2 ? this.favorito_checkbox = 1 : this.favorito_checkbox = 2;
  }
  
}
