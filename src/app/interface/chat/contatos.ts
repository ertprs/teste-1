export interface Contatos {
    id?:string,
    createAt?:number;
    favorito?:boolean;
    livechat?:boolean;
    nome?:string;
    nomeClienteVinculado?:string;
    notas?:string;
    origem?:string;
    photo?:string;
    situacao?:number;
    uidClienteVinculado?:string;
    canal?:string;
    contatoAt?:number;
    usuarioUid?:string;
    usuarioNome?:string;
    conversaUid?:string;
    updateInterno?:boolean;
    contatosVinculados?:any;

    //Filtros Lista de Transmisão
    dataNascimento? : string;
    grupo? : string;
    subgrupo? : string;
    cidade? : string;
    estado? : string;
    canalFiltro?:string;

    //Notificações
    administracao? : boolean;
    atendimento? : boolean;
    cadastro? : boolean;
    comercial? : boolean;
    financeiro? : boolean;
    fiscal? : boolean;
    supervisao? : boolean;
    suporte? : boolean;
    emmassa?:boolean

    selecionado?:boolean
   

}
