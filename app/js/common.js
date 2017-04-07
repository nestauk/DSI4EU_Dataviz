;(function(window, $, undefined){

	FastClick.attach(document.body);

	$('html').addClass('js');

	if(window.isMobile){
		$('html').addClass('mobile');
	}else{
		$('html').addClass('desktop');
	}

	if ('ontouchstart' in window) {
     	$('html').addClass('touch')
    }else{
     	$('html').addClass('mouse')
    }

    $(window).on('resize', function(){
        if($(window).width()>$(window).height()){
            $('html').addClass('landscape').removeClass('portrait')
        }else{
            $('html').addClass('portrait').removeClass('landscape')
        }
    })
    

	var styles = window.getComputedStyle(document.documentElement, '')
	var pre = (Array.prototype.slice
	      .call(styles)
	      .join('') 
	      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
	    )[1]
	var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
	pre = (pre == 'webkit' && bowser.blink) ? 'blink' : pre
	$('html').addClass(pre);
	$('html').addClass(bowser.name.toLowerCase());
	if(bowser.ios) $('html').addClass('ios');
	  
	$('[fouc]').css('visibility', 'visible')

	if(window.isMobile){
		$('[pressable]').on('touchstart', function(){
			$(this).addClass('pressed')
		})
		$('[pressable]').on('touchend', function(){
			$(this).removeClass('pressed')
		})
	}

	Date.prototype.yyyymmdd = function() {
    	var yyyy = this.getFullYear().toString()
    	var mm = (this.getMonth()+1).toString()
    	var dd  = this.getDate().toString()
    	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0])
    };



})(window, window.jQuery)