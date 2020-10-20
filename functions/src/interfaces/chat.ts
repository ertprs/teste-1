export interface Conversas {
  contatoNome?:string;
  contatoUid?:string;
  contatoOrigem?:string;
  createAt?:number;
  photo?:string;
  situacao?:number;
  canal?:string;
  nomeClienteVinculado?:string;
  uidClienteVinculado?:string;
  usuarioNome?:string;
  usuarioUid?:string;
  qtdA?:number
  intencao?:string;
  id?:string
  favorito?:boolean;
  comercialUrlOrcamento?:string; //URL DE DOWNLOAD DO ORCAMENTO
  comercialUidOrcamento?:string; //UID COMERCIAL
  encaminharAUtorizado?:boolean;
  slaAlerta?:boolean;
  slaPainel?:boolean;
  slaAgAtendimento?:boolean;
  interesse?:number;
  valor?:number;
  conversao?:number;
  context?:string;
  tempoResposta?:number;
}
            
