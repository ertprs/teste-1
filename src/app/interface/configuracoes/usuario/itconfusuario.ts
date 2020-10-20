export interface Itconfusuario {
    id?:string;
    createAt?:number;
    photoURL? : string;
    userNome?:string;
    userUid?:string
    nome?:string;
    email?:string
    perfilUid?:string;
    dataNascimento?:number;
    telefoneCelular?:number;
    primeiroAcesso?:boolean;
    userEmail?:string;
    empresaUid?:string;
    departamento?:string;
    recepcao?:boolean;
    atdDom?:boolean;
    atdDomHrFim?:string;
    atdDomHrIni?:string;
    atdQua?:boolean;
    atdQuaHrFim?:string;
    atdQuaHrIni?:string;
    atdQui?:boolean;
    atdQuiHrFim?:string;
    atdQuiHrIni?:string;
    atdSab?:boolean;
    atdSabHrFim?:string;
    atdSabHrIni?:string;
    atdSeg?:boolean;
    atdSegHrFim?:string;
    atdSegHrIni?:string;
    atdSex?:boolean;
    atdSexHrFim?:string;
    atdSexHrIni?:string;
    atdTer?:boolean;
    atdTerHrFim?:string;
    atdTerHrIni?:string;

    //Notificações
    administracao? : boolean;
    atendimento? : boolean;
    cadastro? : boolean;
    comercial? : boolean;
    financeiro? : boolean;
    fiscal? : boolean;
    supervisao? : boolean;
    suporte? : boolean;

    //API
    apiKey?:boolean
    apiKeyToken?:string
}
