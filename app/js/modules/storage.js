function Storage() {
  var self = this
  var localStorage = window.localStorage
  
  self.set = _set

  function _set(key, val) {
    try {
      localStorage.setItem(key, val)
    } catch (error) {
      return console.error(error)
    }
  }

  return self
}
