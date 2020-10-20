
import Log from '../src/model/log';
export default {
    key:'registrationMensagem',
   
     handle({data}){
        const { dados } = data;
         Log.registrar(
            '',
            '',
            'fila/registrationMensagem',
            0,
            'Processo incluido a fila '+data.name ,
            0

        )
        console.log('Verificar aqui '+dados)
    }
}