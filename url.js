function getUrlParams() {
  let search = location.search + (location.hash && '&' + location.hash.split('?')[1]), params = {}, datas = search ? search.split('?').pop().split('&') : []
  for (let i = 0; i < datas.length; i++) {
    let tempData = datas[i].split('=')
    params[tempData[0]] = tempData[1]
  }
  return params
}