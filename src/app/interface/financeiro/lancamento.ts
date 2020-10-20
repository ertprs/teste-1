export interface Itlancamento {
  createAt?:number;
  c_d?:string;//c ou d
  sequencial?:string;
  tipoLancamentoCod?:number; //1 imposto 2 despesas
  tipoLancamentoNome?:string; 
  classificacaoUid?:string; //dados tipo imposto / categoria
  classificacaoNome?:string;
  classificacaoDreFiltro?:number;
  classificacaoEsfera?:string;
  parceiroUid?:string; //Parceiro
  parceiroNome?:string;
  valor_principal?:number; 
  valor_desconto?:number; //CRON
  valor_juros?:number; //CRON
  vencimento?:string;
  bancoUid?:string; // dados banco
  bancoNome?:string;
  isPago?:boolean;
  isPagoData?:string;
  // isPagoData.data
  // isPagoData.valor?:string;
  // isPagoData.juros?:string;
  // isPagoData.desconto?:string;
  // isPagoData.metodoUid?:string; // dados cond pagamento
  // isPagoData.autorizacao?:string;  
  isBoleto?:boolean;
  isBoletoData?:string;
  // isBoletoData.linha_digitavel?:string;
  // isBoletoData.bancoUid?:string;
  // isBoletoData.bancoNome?:string;
  tipoRegistroCod?:number; // 1 individual 2 recorrente
  tipoRegistroNome?:string;
  situacaoCod?:number; // 1 ativo 2 pago 3 cancelado 4 vencido 5 ag autorizacao 6 recusado 7 processando
  situacaoNome?:string; 
  isCartao?:boolean;
  isCartaoData?:string;
  // isCartaoData.assinaturaToken?:string;
  isIntegracoes?:boolean;
  isIntegracoesData?:string;
  // isIntegracoesData.acaoCod?:string;
  // isIntegracoesData.acaoNome?:string;
  // isIntegracoesData.identificacao?:string;
  // isIntegracoesData.endPoint?:string;
  moeda?:boolean;
  moedaData?:string;
  // moedaData.origemCod?:string;
  // moedaData.origemNome?:string;
  // moedaData.finalCod?:string;
  // moedaData.finalNome?:string;
  // moedaData.valorConversao?:string;
  // moedaData.dataConversao?:string;
  libBoleto?:boolean;
  libCartao?:boolean;
}
