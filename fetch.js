import './wd/config.js'

const Fetch = function() {
  const fetch = function (arg, data) {
    if (data) {
      arg.data = data
      arg.transformRequest = [(data) => {
        return Qs.stringify(data)
      }]
    }
    return axios(arg)
  }, upload = function(data, url = config.uploadURL) {
    let formData = new FormData()
    formData.append('file', data)
    return axios.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(evt => {
      return evt.data
    })
  }, get = function(url, data) {
    if (data) {
      let keys = Object.keys(data)
      keys.map(key => {
        return key += `=${data[key]}` 
      })
      url += `?${keys.join('&')}`
    }
    return fetch({url, method: 'get'}).then(evt => {
      return evt.data
    })
  }
  return {
    fetch,
    fetchBase(url, data, method = 'post') {
      url = config.baseURL + url
      if (method === 'get') {
        return get(url, data)
      } else {
        data = JSON.stringify(data || {})
        let param = {data}
        if (jse && sha256) {
          param.sstoken = JSON.stringify({sign: jse.encrypt(sha256(data)), certno: config.jmxx.sn})
        }
        return fetch({url, method: method}, param).then(evt => {
          return evt.data
        })
      }
    },
    get,
    upload,
    uploadPath(data, path) {
      return upload(data, config.uploadPathURL + btoa(path))
    }
  }
}
Promise.all([loadModule('axios', '/lib/axios.min.js'), loadModule('Qs', '/lib/qs.js')])

// 需要自定已config