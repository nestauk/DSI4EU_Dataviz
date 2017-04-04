;(function (window, $, _OnBoardingCanvas, _OnBoardingSvg) {
  function init () {
    var body = $('#loader-view')
    return {
      enter: function (option) {
        console.log('loaderState :: enter')
        body.show()
      },
      leave: function (option) {
        console.log('loaderState :: leave')
        body.transition({ y: '-100%', delay: 500, complete: function () { body.hide() } }, 1250, 'easeInOutQuint')
      }
    }
  }
  window.loaderState = init
})(window, window.jQuery)
