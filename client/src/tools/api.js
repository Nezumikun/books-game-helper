import axios from 'axios'
const defaultConfig = {
  baseURL: 'http://localhost:8080/api/'
}

const apiCall = function (url, method = 'post', data = {}, config = {}) {
  return axios({
    method: method,
    url: url,
    data: data,
    ...defaultConfig,
    ...config
  })
}

export default apiCall
