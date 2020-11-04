function Util() {
  return {
    debounce(fun, delay) {
      let time = null
      return function() {
        let args = arguments
        clearTimeout(time)
        time = setTimeout(() => {
          fun.apply(this, args)
        }, delay)
      }
    },
    throttle(fun, delay) {
      let time = false
      return function() {
        let args = arguments
        if (time) {
          setTimeout(() => {
            time = false
          }, delay)
        } else {
          time = true
          fun.apply(this, args)
        }
      }
    }
  }
}