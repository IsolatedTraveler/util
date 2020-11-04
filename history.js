if (!history.reWrite) {
  history.reWrite = true
  const go = history.go, go1 = function(v) {
    if (this.beforeSkip && typeof this.beforeSkip === 'function') {
      this.beforeSkip(v) && go.call(this, v)
    } else {
      go.call(this, v)
    }
  }
  history.back = function() {
    go1.call(this, -1)
  }
  history.forward = function() {
    go1.call(this, 1)
  }
  history.go = function(v) {
    go1.call(this, v)
  }
}
history.beforeSkip = function() {
  let i = 0
  return function(v) {
    // 判断关闭窗口条件
    if (v < 0 && location.pathname === '/') {
      if (i > 0) {
        closeWindow()
      } else {
        i++
        setTimeout(() => {
          i = 0
        }, 2000)
      }
    } else {
      return true
    }
  }
}()
closeWindow = function() {
  // 关闭chrome浏览器窗口
  window.opener = null
  window.close()
  // 关闭手机微信浏览器窗口
  wx.closeWindow() // 依赖于微信jssdk
  WeixinJSBridge.invoke('closeWindow') // 不依赖于微信jssdk，兼容性不可知
  WeixinJSBridge.call('closeWindow')  // 不依赖于微信jssdk，兼容性不可知
}