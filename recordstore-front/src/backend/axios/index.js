import axios from 'axios'

const API_URL = 'http://localhost:3000'

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json'
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json'
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase();
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': localStorage.csrf
    }
  }

  return config
})

plainAxiosInstance.interceptors.request.use(null, error => {
  if (error.responce && error.responce.config && error.responce.status === 401) {
    return plainAxiosInstance.post('refresh', {}, {headers: {'X-CSRF-TOKEN': localStorage.csrf}})
    .then(responce => {
      localStorage.csrf = responce.data.csrf
      localStorage.signedIn = true

      let retryConfig = error.responce.config
      retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
      return plainAxiosInstance.request(retryConfig)
    }).catch(error => {
      delete localStorage.csrf
      delete localStorage.signedIn

      location.replace('/')
      return Promise.reject(error)
    })
  } else {
    return Promise.reject(error)
  }
})

export {securedAxiosInstance, plainAxiosInstance}
