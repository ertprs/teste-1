import Contatos from './contato';
import { db } from '../index';

import * as fs from 'fs';

const request = require('request');

const processotemporario = {
    async importarContatos(params:any)
    {
        const documentoUid = params.documentoUid;
        console.log('Documento '+documentoUid)
        const data = params.data;

        const arrLink = data.url.split('?').shift();
        const ext = arrLink.split('.').pop();
        const filename = `${Math.random().toString(16).slice(2)}.${ext}`;
        const dest = `/tmp/${filename}`;

      
        const getTranscrit = new Promise<string>(async (resolve:any,reject:any) => {
            
            await request(data.url).pipe(fs.createWriteStream(dest)).on('close', async () => {

                const file = fs.readFileSync(dest);
              
                resolve(file.toString())
            })
        })
        const dadosArquivo= await getTranscrit;
        const dadosArquivo2 = await getTranscrit;
        const arrayLinha = dadosArquivo.split('\n');
        const json = []

        if(data.tipo == 'contato-import')
        {
            for(const linha of arrayLinha)
            {
                const row = linha.split(';')
    
                let nome            = '';
                let telefone        = '';
                let grupo           = '';
                let cidade          = '';
                let estado          = '';
                let dtNascimento:any = '';
                let dtNascimentoMes:number = 0
                let dtNascimentoDia:number = 0 
                let dtNascimentoAno:number = 0;


       
                const jsonGrupo    = [];
    
                if(row[0] !== undefined )
                {
                    nome = row[0].replace('\r','')
                }
    
                
                if(row[2] !== undefined )
                {
                    grupo = row[2].replace('\r','')
                    const grupos = grupo.split(',')
                    for(const dados of grupos)
                    {
                        jsonGrupo.push(dados.replace('\r',''))
                    }
                }
                if(row[4] !== undefined )
                {
                    cidade = row[4].replace('\r','')
                }
                if(row[5] !== undefined )
                {
                    estado = row[5].replace('\r','')
                }
                if(row[6] !== undefined )
                {
                    //DT NASCIMENTO
                    let dtNascimento1 = row[6].replace('\r','')
                    let dtNascimento2 = dtNascimento1.split('/')
                    dtNascimentoDia = Number(dtNascimento2[0])
                    dtNascimentoMes = Number(dtNascimento2[1])
                    dtNascimentoAno = Number(dtNascimento2[2])
                    //dtNascimento = new Date(dtNascimentoAno,dtNascimentoMes-1,dtNascimentoDia+1).getTime()
                    dtNascimento = dtNascimento2[2]+"-"+dtNascimento2[1]+"-"+dtNascimento2[0]

               




                }
               
    
                //TELFONES
                if(row[1] !== undefined )
                {
                    
                    telefone = row[1].replace('\r','');
                    const telefones = telefone.split(',')
                    for(let dados of telefones)
                    {
                        dados = dados.replace('\r','')
                        dados = dados.trim()
                        .split('-').join('')
                        .split(' ').join('')
                        .split('(').join('')
                        .split(')').join('')
                        .split('+').join('')
                        let valido = false;
    
                        if(dados.length == 12 || dados.length == 13)
                        {
                            valido = true;  
                        }
    
                        
    
    
                        const dadosContato = {
                            nome:nome,
                            telefone:dados,
                            valido,
                            grupo:jsonGrupo,
                            subgrupo:'',
                            cidade,
                            estado,
                            dtNascimentoMes,
                            dtNascimentoAno,
                            dtNascimentoDia,
                            dataNascimento:dtNascimento
                        }
                        json.push(dadosContato)
    
    
    
                    }
                }
    
                
            }

            const dadosAtualizar = {
                createAt:data.createAt,
                dados:JSON.stringify(json),
                tipo:data.tipo,
                situacao:2,
                url:data.url
            }
            await db.collection('prodTemporario').doc(documentoUid).set(dadosAtualizar)
        }
        else if(data.tipo == 'backup')
        {
           
            const dadosAtualizar = {
                createAt:data.createAt,
                dados:dadosArquivo2,
                tipo:data.tipo,
                situacao:2,
                url:data.url
            }
            await db.collection('prodTemporario').doc(documentoUid).set(dadosAtualizar)
        
        }
        else
        {
            for(const linha of arrayLinha)
            {
                const row = linha.split(';')
    
                let nome            = '';
                let telefone        = '';
                let grupo           = '';
                let cidade          = '';
                let estado          = '';
       
                const jsonGrupo    = [];
    
                if(row[0] !== undefined )
                {
                    nome = row[0].replace('\r','')
                }
    
                
                if(row[2] !== undefined )
                {
                    grupo = row[2].replace('\r','')
                    const grupos = grupo.split(',')
                    for(const dados of grupos)
                    {
                        jsonGrupo.push(dados.replace('\r',''))
                    }
                }
                if(row[4] !== undefined )
                {
                    cidade = row[4].replace('\r','')
                }
                if(row[5] !== undefined )
                {
                    estado = row[5].replace('\r','')
                }
               
    
                //TELFONES
                if(row[1] !== undefined )
                {
                    
                    telefone = row[1].replace('\r','');
                    const telefones = telefone.split(',')
                    for(let dados of telefones)
                    {
                        dados = dados.replace('\r','')
                        dados = dados.trim()
                        .split('-').join('')
                        .split(' ').join('')
                        .split('(').join('')
                        .split(')').join('')
                        .split('+').join('')
                        let valido = false;
    
                        if(dados.length == 12 || dados.length == 13)
                        {
                            valido = true;  
                        }
    
                        
    
    
                        const dadosContato = {
                            nome:nome,
                            telefone:dados,
                            valido,
                            grupo:jsonGrupo,
                            subgrupo:'',
                            cidade,
                            estado
                        }
                        json.push(dadosContato)
    
    
    
                    }
                }
    
                
            }

            const dadosAtualizar = {
                createAt:data.createAt,
                dados:JSON.stringify(json),
                tipo:data.tipo,
                situacao:2,
                url:data.url
            }
            await db.collection('prodTemporario').doc(documentoUid).set(dadosAtualizar)
        }

       
      
        
       
           
        return {situacao:'suc',code:0,msg:'Arquivo lido com sucesso '};
        
    },
    async receberMigracaoConversas(params:any)
    {
        const token = params.token;
        const body = params.body;
        const dadosContato = params.dadosContato
        
        for (const conversas  of body.contatos.conversas) {

            

            for(const msgData of conversas.mensagens)
            {


                const dt = Date.parse(msgData.data);
        

              
                const addMensagem = {
                    autorNome:'Lara migração',
                    autorUid:'',
                    canal:'whatsapp',
                    contatoOrigem:dadosContato.uid,
                    conversaUid:'',
                    createAt:dt,
                    enviadoData:dt,
                    entregueData:dt,
                    entregueTag:1,
                    es:msgData.e_s,
                    mensagem:msgData.mensagem,
                    tipo:msgData.tipo,
                    usuarioNome:'Lara teste',
                    usuarioUid:'99999',
                    migracaoMsg:true

                }
                const AddMensagens = await db.collection(token).doc('chat').collection('conversas').doc(dadosContato.uid).collection('mensagens').add(addMensagem);
                console.log('Adicionado '+AddMensagens.id)
               


               
            
                
            }
            
            
        }
        return {situacao:'suc',code:0,msg:'('+token+')Conversas foram processadas  '+JSON.stringify(dadosContato)+' | '+JSON.stringify(body)};
    },
    async receberdadosMigracao(params:any)
    {

        const token = params.token;
        const body = params.body

        if(body.tipo == 'contatos')
        {

            const dadosContato = body.contatos;

            
    
            const checkContato: any = await Contatos.contatoSelect({token,canal:dadosContato.canal,origem:dadosContato.telefone})
            if(checkContato.situacao === 'nocach')
            {
                
                //NAO EXISTE CONTATO
                
                const corPhotoCheck: any = await Contatos.getRandomColor();
                //CADSTRAR NOVO CONTATO 
                const contatoDataAdd = {
                    createAt: new Date().getTime(),
                    livechat: false,
                    situacao: false,
                    uidClienteVinculado: '',
                    nomeClienteVinculado: '',
                    photo: corPhotoCheck,
                    nome: dadosContato.nome,
                    canal: dadosContato.canal,
                    favorito: dadosContato.favorito,
                    origem: dadosContato.telefone,
                    grupo:dadosContato.grupo,
                    subgrupo:dadosContato.subgrupo,
                    usuarioUid: '',
                    usuarioNome: '',
                    tempoResposta: 0,
                    migrado:true
                  };
          
                  const iContato: any = await Contatos.contatoInsert({ token, data: contatoDataAdd });
                  if (iContato.situacao === 'suc') {
                    const dadosGerais = {
                        uid: iContato.id,
                        ...contatoDataAdd
                    }

                    return {situacao:'suc',code:0,dados:dadosGerais,msg:'Arquivo lido com sucesso '+JSON.stringify(dadosGerais)};
                  }
                  else
                  {
                    return {situacao:'err',code:0,msg:'Falha ao tentar inserir contato'};
                  }
                
            }
            else if (checkContato.situacao === 'suc') {

                const dadosRecuperados = checkContato.dados;
                return {situacao:'suc',code:0,dados:dadosRecuperados,msg:'Cadastro recuperado com sucesso'+JSON.stringify(dadosRecuperados)};
            }
            else{
                //CONTATO JA EXISTE
                return {situacao:'err',code:0,msg:'Este contato já existe . Processo abortado '+token+' | '+JSON.stringify(body)};
            }
            

            
        }
        else
        {
            return {situacao:'suc',code:0,msg:'Falha ao processar '};
        }

        
        
    }
}
export default processotemporario;