import { db } from '../index';
const fetch = require("node-fetch");
const Lara = {
    async ProcessarTexto(params: any) {
        try{
            console.log(params);
            const token = params.empresaUid;
            const usuarioUid = params.data.usuarioUid;
            const context = JSON.parse( params.data.contexto);
            const mensagemUid = params.data.id;

            const apikey = 'apikey:l1wwpPbPxKL6pFuc8hm2j7xjoBqJ5B1kNuKAgXPPlka-';
            const workId = 'aa382d84-c6c5-4e31-9a9a-30ea00e3f316';
            const version = '2019-02-28';;
            
            let json = {};
            if(context === '')
            {
                json = {
                    input: { text: params.data.textoProcessar}
                }
            }
            else
            {
                json = {
                    input: { text: params.data.textoProcessar},
                    context: context,
                };

                console.log('JSON formatado para envio -> '+JSON.stringify(json));
            }
            
            console.log(json);
            const url = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${workId}/message?version=${version}`;
            const options = {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${Buffer.from(apikey).toString('base64')}`
            }
            };
            const response = await fetch(url,options);
            const data = await response.json();
            console.log(data);
            if(data.hasOwnProperty('context')) {
                let mensagem = data.output.text.join('\n');
                mensagem = mensagem.split('||').join('\n');
                console.log('Mensagem de retorno '+mensagem)
                //ADICIONAR AO CONTADOR DE CONSUMO
                const dadosConsumo = {
                    createAt:new Date().getTime(),
                    tipo:'Interacao Lara',
                    codetipo:1,
                    usuarioUid
                }
                try
                {
                    await db.collection(token).doc('dados').collection('consumo').add(dadosConsumo);

                    //ATUALIZAR DADOS DE RESPOSTA
                    const dadosMensagem = {
                        textReturn:mensagem,
                        contexto:JSON.stringify(data.context) 
                    }
                    try{
                        await db.collection('lara').doc(usuarioUid).collection('dialogos').doc(mensagemUid).set(dadosMensagem, {merge: true});
                        return {situacao:'suc',code:0,msg:`Mensagem atualizada com sucesso`};
                    }
                    catch(err)
                    {   console.log(JSON.stringify(err) )
                        return {situacao:'err',code:0,msg:`Falha ao atualizar dados da mensagem ${usuarioUid} `};
                    }
                    
                }
                catch(err)
                {
                    return {situacao:'err',code:0,msg:`Falha ao adicionar dados de consumo`};
                }
                

                
            }
            else{

                return {situacao:'err',code:0,msg:`Nao existe contexto`};
            }
            
        }
        catch(err)
        {
            return {situacao:'err',code:0,msg:`procMensagem: ${err.message}`};
        }
        

    }
}
export default Lara;