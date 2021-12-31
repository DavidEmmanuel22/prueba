import axios from 'axios'

const url = "http://www.omdbapi.com/"
const clave = "d489d640"
const petitionImage = (name) =>{
    return axios({
      method: 'get',
      url: `${url}`,
      params: {
          s: name,
          apiKey: clave
      }
    })
  }

export default {
    petitionImage,
    
}