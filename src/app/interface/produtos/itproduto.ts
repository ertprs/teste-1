export interface Itproduto {
    id?:string;
    createAt?:number;
    codigo?:string;
    sku?:string;
    ean?:string;
    ncm?:string;
    photo?:string;
    photoURL?:string;
    liberadoUso?:boolean;
    tipoFabricacao?:string;
    descricaoCurta?:string;
    descricaoLonga?:string;
    descricaoFiscal?:string;
    ObservacoesGeral?:string;

    qtdDisponivel?:number;
    vrCompra?:number;
    vrVenda?:number;

    usuarioUid?:string;
    

}
