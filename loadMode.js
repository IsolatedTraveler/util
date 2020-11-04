 const loadModule = function() {
  const scriptUrl =  d.getElementsByTagName('script')[0].getAttribute('src').split(/\/[a-zA-Z]/)[0]
  return function(name, url) {
    return new Promise((resolve, reject) => {
      if (!w[name]) {
        let elem = d.createElement('script')
        elem.setAttribute('type', 'text/javascript')
        elem.setAttribute('charset', 'utf-8')
        elem.setAttribute('src', scriptUrl + url)
        elem.async = false
        d.head.insertBefore(elem, d.getElementsByTagName('script')[0])
        elem.onload = resolve
        elem.onerror = reject
      } else {
        resolve()
      }
    }).catch(e => {
      console.error(name + '模块加载错误')
    })
  }
}()