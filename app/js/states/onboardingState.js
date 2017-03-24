function onboardingState(){

	var cont = $('#onboarding-view')
	var frag = ['one', 'two', 'three', 'four', 'five']
	var step = 0

	var canvas = cont.find('canvas').get(0)
	canvas.width = cont.width()
	canvas.height = cont.height()

	var on_canvas = new OnBoardingCanvas(canvas, APP)

	frag.forEach(function(d, i){
		cont.find('.' + d).css({opacity:0})
	})

	function showFrag(sel){
		cont.find(sel).css({y:30}).transition({opacity:1, y:0}, 1000, 'easeInOutQuint')
	}
	function hideFrag(sel){
		cont.find(sel).transition({opacity:0, y:-30}, 750, 'easeInOutQuint')
	}

	cont.on('click', onSubStateClick)

	function onSubStateClick(){
		step++;
		if(step>=frag.length){
			APP.stator.go('map')
		}else{
			APP.stator.go('onboarding.' + frag[step])
		}
	}

	var obj = {
		enter: function(option){
			console.log('onboardingState :: enter')

			on_canvas.init()
			
			cont.css({opacity:1}).show();
			cont.find('#skip').on('click', function(){
				cont.off('click', onSubStateClick)
				APP.stator.go('map')
			})
		},

		leave: function(option){
			console.log('onboardingState :: leave')

			cont.transition({opacity:0, complete:function(){
				on_canvas.stop()
				cont.hide()
			}}, 750, 'easeInOutQuint')

			//cont.hide();

			//filter tab open in desktop enivronment
			// if (!window.isMobile) {
			// 	APP.ui.openFilterTab();
			// }

		},

		one: {
			enter: function(option){
				showFrag('.one')
				on_canvas.one()
			},
			leave: function(option){
				hideFrag('.one')
			}
		},

		two: {
			enter: function(option){
				showFrag('.two')
				on_canvas.two()
			},
			leave: function(option){
				hideFrag('.two')
			}
		},

		three: {
			enter: function(option){
				showFrag('.three')
				on_canvas.three()
			},
			leave: function(option){
				hideFrag('.three')
			}
		},

		four: {
			enter: function(option){
				showFrag('.four')
				on_canvas.four()
			},
			leave: function(option){
				hideFrag('.four')
			}
		},

		five: {
			enter: function(option){
				showFrag('.five')
				on_canvas.five()
			},
			leave: function(option){
				hideFrag('.five')
			}
		}

	}



	return obj

}