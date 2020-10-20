import Queue from 'bull'
import registrationMensagem from '../jobs/registrationMensagem'

const mensagemQueue = new Queue(registrationMensagem.key,{redis:{host:'10.159.253.43',port:6379}})
export default mensagemQueue