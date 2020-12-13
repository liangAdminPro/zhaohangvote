import Vue from 'vue'
import axios from 'axios'
import QS from 'qs'
import Cookies from 'js-cookie'
Vue.prototype.$ajax = axios
Vue.use(QS)
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.request.use(config => {
  config.headers.Authorization = `token ${Cookies.get('jtoken') || ''}`;
  return config;
}, err => {
  return Promise.reject(err);
})
//响应拦截器
axios.interceptors.response.use(response => {
  return response;
}, err => {
  return Promise.reject(err);
})

// 封装get方法
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    })
  })
}

// 封装post方法
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    });
  })
}

export function upload(formData) {
  return new Promise((resolve, reject) => {
    axios.post('/voteSrv/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    });
  })
}

export function plupload(formData) {
  return new Promise((resolve, reject) => {
    axios.post('/voteSrv/api/plupload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err)
    });
  })
}