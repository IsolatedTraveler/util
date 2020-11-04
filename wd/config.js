import '../storage.js'
import '../fetch.js'
function getConfig() {
  if (!config) {
    let c = sessionGet('util-config')
    if (c) {
      config = c
      return Promise.resolve(c)
    } else {
      return this.fetch(location.href.split(/(\/web\/|\/index.html)/)[0] + '/public/data/config.json?version=' + Math.random()).then(evt => {
        config = evt.data
        sessionSet('util-config',config)
        return config
      })
    }
  } else {
    return Promise.resolve(config)
  }
}



{
  getConfig
}