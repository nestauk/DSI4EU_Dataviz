function onboardingState(){

	var cont = $('#onboarding-view')
	var frag = ['one', 'two', 'three', 'four', 'five']
	var step = 0

	cont.find('p').css({opacity:0})

	var on_canvas = new OnBoardingCanvas()

	function showFrag(sel){
		cont.find(sel).each(function(i, e){
			$(this).css({y:30}).transition({opacity:1, delay:2200 + i*150, y:0}, 2000, 'easeInOutQuint')
		})
	}
	function hideFrag(sel){
		cont.find(sel).transition({opacity:0}, 750, 'easeInOutQuint')
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


			//filter tab open in desktop enivronment
			// if (!window.isMobile) {
			// 	APP.ui.openFilterTab();
			// }

		},

		one: {
			enter: function(option){
				showFrag('.one p')

				on_canvas.one()
			},
			leave: function(option){
				hideFrag('.one')
			}
		},

		two: {
			enter: function(option){
				showFrag('.two p')

				on_canvas.two()
			},
			leave: function(option){
				hideFrag('.two')
			}
		},

		three: {
			enter: function(option){
				showFrag('.three p')

				on_canvas.three()
			},
			leave: function(option){
				hideFrag('.three')
			}
		},

		four: {
			enter: function(option){
				showFrag('.four p')
				//on_canvas.four()
			},
			leave: function(option){
				hideFrag('.four')
			}
		},

		five: {
			enter: function(option){
				showFrag('.five p')
				//on_canvas.five()
			},
			leave: function(option){
				hideFrag('.five')
			}
		}

	}



	return obj

}