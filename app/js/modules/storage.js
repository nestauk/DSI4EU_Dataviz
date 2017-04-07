function Storage() {
  var self = this
  var localStorage = window.localStorage
  
  self.set = _set
  self.get = _get

  function _set(key, val) {
    val = JSON.stringify(val)
    try {
      localStorage.setItem(key, val)
    } catch (error) {
      return console.error(error)
    }
  }

  function _get(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
  }

  return self
}
