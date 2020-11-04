const Amis = function() {
  return {
    env: {
      fetcher(arg) {
        return $util.fetch({}).then(evt => {
          let data = evt.data
          return evt
        })
      }
    }
  }
}