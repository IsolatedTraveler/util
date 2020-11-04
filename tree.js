const Tree = function() {
  return {
    formatTreeData(data, pid, id, fun) {
      var result = [],  map = {}
      id = id || 'id'
      pid = pid || 'sjid'
      if (Array.isArray(data)) {
        data.forEach(it => {
          map[it[id]] = it
        })
        data.forEach(it => {
          var p = map[it[pid]]
          if (p) {
            (p.children || (p.children = [])).push(it)
            fun && fun(p)
          } else {
            result.push(it)
          }
        })
      }
      return { result, map }
    }
  }
}