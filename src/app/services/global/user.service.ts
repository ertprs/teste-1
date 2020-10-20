import { Itseguserlogado } from './../../interface/seguranca/itseguserlogado';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Conversas } from 'src/app/interface/chat/conversas';







@Injectable({
  providedIn: 'root'
})
export class UserService {
 

  public dadosLogado:Itseguserlogado;
  //public dadosUsuario = new Subject<Itseguserlogado>();


  public conversas = new Array<Conversas>();

  public notificacoes = [];
  public notificacoesQtd:number = 0;

  public conversaUidAtiva:string;
  public urlHistory:string = 'home'


  public msgDigitando = new Array()
  private UFsBase = '{"UF":[{"nome":"Acre","sigla":"AC"},{"nome":"Alagoas","sigla":"AL"},{"nome":"Amapá","sigla":"AP"},{"nome":"Amazonas","sigla":"AM"},{"nome":"Bahia","sigla":"BA"},{"nome":"Ceará","sigla":"CE"},{"nome":"Distrito Federal","sigla":"DF"},{"nome":"Espírito Santo","sigla":"ES"},{"nome":"Goiás","sigla":"GO"},{"nome":"Maranhão","sigla":"MA"},{"nome":"Mato Grosso","sigla":"MT"},{"nome":"Mato Grosso do Sul","sigla":"MS"},{"nome":"Minas Gerais","sigla":"MG"},{"nome":"Pará","sigla":"PA"},{"nome":"Paraíba","sigla":"PB"},{"nome":"Paraná","sigla":"PR"},{"nome":"Pernambuco","sigla":"PE"},{"nome":"Piauí","sigla":"PI"},{"nome":"Rio de Janeiro","sigla":"RJ"},{"nome":"Rio Grande do Norte","sigla":"RN"},{"nome":"Rio Grande do Sul","sigla":"RS"},{"nome":"Rondônia","sigla":"RO"},{"nome":"Roraima","sigla":"RR"},{"nome":"Santa Catarina","sigla":"SC"},{"nome":"São Paulo","sigla":"SP"},{"nome":"Sergipe","sigla":"SE"},{"nome":"Tocantins","sigla":"TO"}]}'
  private LogradouroBase = '[{"ide":"A","nome":"area","sigla":"are"},{"ide":"AC","nome":"Acesso","sigla":"Ace"},{"ide":"ACA","nome":"Acampamento","sigla":"Aca"},{"ide":"ACL","nome":"Acesso Local","sigla":"Ace"},{"ide":"AD","nome":"Adro","sigla":"Adr"},{"ide":"AE","nome":"Área Especial","sigla":"Áre"},{"ide":"AER","nome":"Aeroporto","sigla":"Aer"},{"ide":"AL","nome":"Alameda","sigla":"Ala"},{"ide":"AMD","nome":"Avenida","sigla":"Ave"},{"ide":"AN","nome":"Anel Viário","sigla":"Ane"},{"ide":"ANT","nome":"Antiga Estrada","sigla":"Ant"},{"ide":"ART","nome":"Artéria","sigla":"Art"},{"ide":"AT","nome":"Alto","sigla":"Alt"},{"ide":"ATL","nome":"Atalho","sigla":"Ata"},{"ide":"A V","nome":"Área Verde","sigla":"Áre"},{"ide":"BAL","nome":"Balneário","sigla":"Bal"},{"ide":"BC","nome":"Beco","sigla":"Bec"},{"ide":"BCO","nome":"Buraco","sigla":"Bur"},{"ide":"BEL","nome":"Belvedere","sigla":"Bel"},{"ide":"BL","nome":"Bloco","sigla":"Blo"},{"ide":"BLO","nome":"Balão","sigla":"Bal"},{"ide":"BLS","nome":"Blocos","sigla":"Blo"},{"ide":"BLV","nome":"Bulevar","sigla":"Bul"},{"ide":"BSQ","nome":"Bosque","sigla":"Bos"},{"ide":"BVD","nome":"Boulevard","sigla":"Bou"},{"ide":"BX","nome":"Baixa","sigla":"Bai"},{"ide":"C","nome":"Cais","sigla":"Cai"},{"ide":"CAL","nome":"Calçada","sigla":"Cal"},{"ide":"CAM","nome":"Caminho","sigla":"Cam"},{"ide":"CAN","nome":"Canal","sigla":"Can"},{"ide":"CH","nome":"Chácara","sigla":"Chá"},{"ide":"CHA","nome":"Chapadão","sigla":"Cha"},{"ide":"CIC","nome":"Ciclovia","sigla":"Cic"},{"ide":"CIR","nome":"Circular","sigla":"Cir"},{"ide":"CJ","nome":"Conjunto","sigla":"Con"},{"ide":"CJM","nome":"Conjunto Mutirão","sigla":"Con"},{"ide":"CMP","nome":"Complexo Viário","sigla":"Com"},{"ide":"COL","nome":"Colônia","sigla":"Col"},{"ide":"COM","nome":"Comunidade","sigla":"Com"},{"ide":"CON","nome":"Condomínio","sigla":"Con"},{"ide":"COR","nome":"Corredor","sigla":"Cor"},{"ide":"CPO","nome":"Campo","sigla":"Cam"},{"ide":"CRG","nome":"Córrego","sigla":"Cór"},{"ide":"CTN","nome":"Contorno","sigla":"Con"},{"ide":"DSC","nome":"Descida","sigla":"Des"},{"ide":"DSV","nome":"Desvio","sigla":"Des"},{"ide":"DT","nome":"Distrito","sigla":"Dis"},{"ide":"EB","nome":"Entre Bloco","sigla":"Ent"},{"ide":"EIM","nome":"Estrada Intermunicipal","sigla":"Est"},{"ide":"ENS","nome":"Enseada","sigla":"Ens"},{"ide":"ENT","nome":"Entrada Particular","sigla":"Ent"},{"ide":"EQ","nome":"Entre Quadra","sigla":"Ent"},{"ide":"ESC","nome":"Escada","sigla":"Esc"},{"ide":"ESD","nome":"Escadaria","sigla":"Esc"},{"ide":"ESE","nome":"Estrada Estadual","sigla":"Est"},{"ide":"ESI","nome":"Estrada Vicinal","sigla":"Est"},{"ide":"ESL","nome":"Estrada de Ligação","sigla":"Est"},{"ide":"ESM","nome":"Estrada Municipal","sigla":"Est"},{"ide":"ESP","nome":"Esplanada","sigla":"Esp"},{"ide":"ESS","nome":"Estrada de Servidão","sigla":"Est"},{"ide":"EST","nome":"Estrada","sigla":"Est"},{"ide":"ESV","nome":"Estrada Velha","sigla":"Est"},{"ide":"ETA","nome":"Estrada Antiga","sigla":"Est"},{"ide":"ETC","nome":"Estação","sigla":"Est"},{"ide":"ETD","nome":"Estádio","sigla":"Est"},{"ide":"ETN","nome":"Estância","sigla":"Est"},{"ide":"ETP","nome":"Estrada Particular","sigla":"Est"},{"ide":"ETT","nome":"Estacionamento","sigla":"Est"},{"ide":"EVA","nome":"Evangélica","sigla":"Eva"},{"ide":"EVD","nome":"Elevada","sigla":"Ele"},{"ide":"EX","nome":"Eixo Industrial","sigla":"Eix"},{"ide":"FAV","nome":"Favela","sigla":"Fav"},{"ide":"FAZ","nome":"Fazenda","sigla":"Faz"},{"ide":"FER","nome":"Ferrovia","sigla":"Fer"},{"ide":"FNT","nome":"Fonte","sigla":"Fon"},{"ide":"FRA","nome":"Feira","sigla":"Fei"},{"ide":"FTE","nome":"Forte","sigla":"For"},{"ide":"GAL","nome":"Galeria","sigla":"Gal"},{"ide":"GJA","nome":"Granja","sigla":"Gra"},{"ide":"HAB","nome":"Núcleo Habitacional","sigla":"Núc"},{"ide":"IA","nome":"Ilha","sigla":"Ilh"},{"ide":"IND","nome":"Indeterminado","sigla":"Ind"},{"ide":"IOA","nome":"Ilhota","sigla":"Ilh"},{"ide":"JD","nome":"Jardim","sigla":"Jar"},{"ide":"JDE","nome":"Jardinete","sigla":"Jar"},{"ide":"LD","nome":"Ladeira","sigla":"Lad"},{"ide":"LGA","nome":"Lagoa","sigla":"Lag"},{"ide":"LGO","nome":"Lago","sigla":"Lag"},{"ide":"LOT","nome":"Loteamento","sigla":"Lot"},{"ide":"LRG","nome":"Largo","sigla":"Lar"},{"ide":"LT","nome":"Lote","sigla":"Lot"},{"ide":"MER","nome":"Mercado","sigla":"Mer"},{"ide":"MNA","nome":"Marina","sigla":"Mar"},{"ide":"MOD","nome":"Modulo","sigla":"Mod"},{"ide":"MRG","nome":"Projeção","sigla":"Pro"},{"ide":"MRO","nome":"Morro","sigla":"Mor"},{"ide":"MTE","nome":"Monte","sigla":"Mon"},{"ide":"NUC","nome":"Núcleo","sigla":"Núc"},{"ide":"NUR","nome":"Núcleo Rural","sigla":"Núc"},{"ide":"OUT","nome":"Outeiro","sigla":"Out"},{"ide":"PAR","nome":"Paralela","sigla":"Par"},{"ide":"PAS","nome":"Passeio","sigla":"Pas"},{"ide":"PAT","nome":"Pátio","sigla":"Pát"},{"ide":"PC","nome":"Praça","sigla":"Pra"},{"ide":"PCE","nome":"Praça de Esportes","sigla":"Pra"},{"ide":"PDA","nome":"Parada","sigla":"Par"},{"ide":"PDO","nome":"Paradouro","sigla":"Par"},{"ide":"PNT","nome":"Ponta","sigla":"Pon"},{"ide":"PR","nome":"Praia","sigla":"Pra"},{"ide":"PRL","nome":"Prolongamento","sigla":"Pro"},{"ide":"PRM","nome":"Parque Municipal","sigla":"Par"},{"ide":"PRQ","nome":"Parque","sigla":"Par"},{"ide":"PRR","nome":"Parque Residencial","sigla":"Par"},{"ide":"PSA","nome":"Passarela","sigla":"Pas"},{"ide":"PSG","nome":"Passagem","sigla":"Pas"},{"ide":"PSP","nome":"Passagem de Pedestre","sigla":"Pas"},{"ide":"PSS","nome":"Passagem Subterrânea","sigla":"Pas"},{"ide":"PTE","nome":"Ponte","sigla":"Pon"},{"ide":"PTO","nome":"Porto","sigla":"Por"},{"ide":"Q","nome":"Quadra","sigla":"Qua"},{"ide":"QTA","nome":"Quinta","sigla":"Qui"},{"ide":"QTS","nome":"Quintas","sigla":"Qui"},{"ide":"R","nome":"Rua","sigla":"Rua"},{"ide":"R I","nome":"Rua Integração","sigla":"Rua"},{"ide":"R L","nome":"Rua de Ligação","sigla":"Rua"},{"ide":"R P","nome":"Rua Particular","sigla":"Rua"},{"ide":"R V","nome":"Rua Velha","sigla":"Rua"},{"ide":"RAM","nome":"Ramal","sigla":"Ram"},{"ide":"RCR","nome":"Recreio","sigla":"Rec"},{"ide":"REC","nome":"Recanto","sigla":"Rec"},{"ide":"RER","nome":"Retiro","sigla":"Ret"},{"ide":"RES","nome":"Residencial","sigla":"Res"},{"ide":"RET","nome":"Reta","sigla":"Ret"},{"ide":"RLA","nome":"Ruela","sigla":"Rue"},{"ide":"RMP","nome":"Rampa","sigla":"Ram"},{"ide":"ROA","nome":"Rodo Anel","sigla":"Rod"},{"ide":"ROD","nome":"Rodovia","sigla":"Rod"},{"ide":"ROT","nome":"Rotula","sigla":"Rot"},{"ide":"RPE","nome":"Rua de Pedestre","sigla":"Rua"},{"ide":"RPR","nome":"Margem","sigla":"Mar"},{"ide":"RTN","nome":"Retorno","sigla":"Ret"},{"ide":"RTT","nome":"Rotatória","sigla":"Rot"},{"ide":"SEG","nome":"Segunda Avenida","sigla":"Seg"},{"ide":"SIT","nome":"Sitio","sigla":"Sit"},{"ide":"SRV","nome":"Servidão","sigla":"Ser"},{"ide":"ST","nome":"Setor","sigla":"Set"},{"ide":"SUB","nome":"Subida","sigla":"Sub"},{"ide":"TCH","nome":"Trincheira","sigla":"Tri"},{"ide":"TER","nome":"Terminal","sigla":"Ter"},{"ide":"TR","nome":"Trecho","sigla":"Tre"},{"ide":"TRV","nome":"Trevo","sigla":"Tre"},{"ide":"TUN","nome":"Túnel","sigla":"Tún"},{"ide":"TV","nome":"Travessa","sigla":"Tra"},{"ide":"TVP","nome":"Travessa Particular","sigla":"Tra"},{"ide":"TVV","nome":"Travessa Velha","sigla":"Tra"},{"ide":"UNI","nome":"Unidade","sigla":"Uni"},{"ide":"V","nome":"Via","sigla":"Via"},{"ide":"V C","nome":"Via Coletora","sigla":"Via"},{"ide":"V L","nome":"Via Local","sigla":"Via"},{"ide":"VAC","nome":"Via de Acesso","sigla":"Via"},{"ide":"VAL","nome":"Vala","sigla":"Val"},{"ide":"VCO","nome":"Via Costeira","sigla":"Via"},{"ide":"VD","nome":"Viaduto","sigla":"Via"},{"ide":"V-E","nome":"Via Expressa","sigla":"Via"},{"ide":"VER","nome":"Vereda","sigla":"Ver"},{"ide":"VEV","nome":"Via Elevado","sigla":"Via"},{"ide":"VL","nome":"Vila","sigla":"Vil"},{"ide":"VLA","nome":"Viela","sigla":"Vie"},{"ide":"VLE","nome":"Vale","sigla":"Val"},{"ide":"VLT","nome":"Via Litorânea","sigla":"Via"},{"ide":"VPE","nome":"Via de Pedestre","sigla":"Via"},{"ide":"VRT","nome":"Variante","sigla":"Var"},{"ide":"ZIG","nome":"Zigue-Zague","sigla":"Zig"}]'
  public Logradouros = []
  public UFs = []
  //CONSULTA DE CONTATOS
  public contatosList = []


  constructor() { 
    const ajustandoBaseUF = JSON.parse(this.UFsBase)
    this.UFs = ajustandoBaseUF.UF

    //LOGRADOUROS
    const ajustandoBaseLogradouro = JSON.parse(this.LogradouroBase)
    this.Logradouros = ajustandoBaseLogradouro
 
  }
  PrencherInfosUsuario(value: Itseguserlogado) {
    this.dadosLogado = value;
    console.log('Updata data user active '+value)




  
   // this.dadosUsuario.next(value); 
  }




  
}
