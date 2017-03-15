function loaderState(){

	return {
		enter: function(option){
			console.log('loaderState :: enter');
		},
		leave: function(option){
			console.log('loaderState :: leave');			
		}
	}

}
