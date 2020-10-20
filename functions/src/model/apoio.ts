import * as fs from 'fs';
const axios = require('axios');
const Apoio = {
  acionarWebHook(docUid:string,dados:any):Promise<any>
  {
    return new Promise((resolve, reject) => {
      let urlEndPoint = 'https://southamerica-east1-lara2-3b332.cloudfunctions.net/api/'+dados.empresaUid+'/fin/boleto/consulta?ident='+docUid
      let url = dados.url
      const dadosChamada = {
        dadosConf:{
          identInterno:dados.identInterno
        },
        EndPoint:urlEndPoint,
        method:'POST'
      }
      const axiosOpcao =  {
                
        withCredentials: true,
       
        
        headers: { 
        
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      axios.post(url,JSON.stringify(dadosChamada),axiosOpcao)
      
      
     
      .then(function(response:any){
        resolve(response)
      })
      .catch(function(err:any){
        reject(err)
      })

    })
   

  },
  mask(value:string, pattern:string) {
    let i = 0;
    const v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
  },
  pad(num:Number, size:Number) {
      let s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  },
  gera_id(size:any){
	
		let randomized = Math.ceil(Math.random() * Math.pow(10,size));//Cria um número aleatório do tamanho definido em size.
		var digito = Math.ceil(Math.log(randomized));//Cria o dígito verificador inicial
		while(digito > 10){//Pega o digito inicial e vai refinando até ele ficar menor que dez
			digito = Math.ceil(Math.log(digito));
		}
		var id = randomized + '-' + digito;//Cria a ID
		return id
	},
  date(date:number) {
    let dt = new Date();
    if(date !== 0) {
      dt = new Date(date);
    }
    return `${dt.getDate() < 10 ? '0'+dt.getDate() : dt.getDate()}/${(dt.getMonth() + 1) < 10 ? '0'+(dt.getMonth() + 1) : (dt.getMonth() + 1)}/${dt.getFullYear()}`;
  },

  jsNumberFormat(num:any, decPlaces:number, thouSeparator:string, decSeparator:string) {
    const decPlace = isNaN(Math.abs(decPlaces)) ? 0 : decPlaces;
    const decSep = decSeparator === undefined ? "," : decSeparator;
    const thouSep = thouSeparator === undefined ? "." : thouSeparator;
    const sign = num < 0 ? "-" : "";
    const i:any = parseInt(Math.abs(+num || 0).toFixed(decPlace)) + "";
    const j:number = i.length > 3 ? i.length % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSep : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSep) + (decPlace ? decSep + Math.abs(num - i).toFixed(decPlace).slice(2) : "");
  },

  removeHtml(htmlText:string) {
    return htmlText.replace(/<(.|\n)*?>/g, '\n');
  },

  sleep(ms:number) { 
    const sec = ms * 1000;
    return new Promise((resolve) => {
      setTimeout(resolve, sec);
    });
  },

  deleteTmpFolder(path:string) {
    try {
      console.log(path);
      if( fs.existsSync(path) ) {
        console.log('EXISTE');
        console.log(fs.readdirSync(path));
        console.log(fs.readdirSync(path).length);
        fs.readdirSync(path).forEach((file,index) => {
          const curPath = path + "/" + file;
          console.log(curPath);
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            Apoio.deleteTmpFolder(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
      return {situacao:'suc',code:0,msg:`arquivos deletados`}
    } catch(err) {
      return {situacao:'err',code:0,msg:`deleteTmpFolder: ${err.message}`}
    }
  },

  extractHashtags(string:string) {
    return string.match(/#[a-z0-9_]+/gi);
  }

}

export default Apoio;