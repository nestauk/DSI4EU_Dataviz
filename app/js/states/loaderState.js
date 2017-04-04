function loaderState(){

  var body = $('#loader-view')
	return {
		enter: function(option){
			console.log('loaderState :: enter');
      body.show()
      body.transition({ y: '0%', delay: 500 }, 1200, 'easeOutQuart')
    },
    leave: function(option){
      console.log('loaderState :: leave');
      body.transition({ y: '-100%', delay: 500, complete: function() { body.hide() } }, 1200, 'easeOutQuart')
		}
	}

}
