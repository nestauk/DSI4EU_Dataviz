function Loader() {
  var loader = {};
  loader.start = function(option) {
      console.log('loaderState :: enter')
      $('#loader-view').show()
      $('#loader-view').transition({
        y: '0%',
      }, 500, 'easeInOutQuint')
    },
    loader.stop = function(option) {
      console.log('loaderState :: leave')
      $('#loader-view').transition({
        y: '-100%',
        delay: 500,
        complete: function() {
          $('#loader-view').hide()
        }
      }, 1250, 'easeInOutQuint')
    }
  return loader;
}