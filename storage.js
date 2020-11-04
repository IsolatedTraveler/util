const localSet = function(name, val) {
    localStorage.setItem(name, JSON.stringify(val || ''))
  },
  localGet = function(name) {
    const v = localStorage.getItem(name)
    return v ? JSON.parse(v) : null
  },
  sessionSet = function(name, val) {
    sessionStorage.setItem(name, JSON.stringify(val || ''))
  },
  sessionGet = function(name) {
    const v = sessionStorage.getItem(name)
    return v ? JSON.parse(v) : null
  }


  
{
  localSet,
  localGet,
  sessionGet,
  sessionSet
}