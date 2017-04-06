function idEncode(str, separator) {
	if (!separator) separator = '_';
	str = _.deburr(str)
	str = str.split("\"").join('').split('\'').join('').split(',').join('');
	str = str.toLowerCase().split(' ').join(separator);
	str = str.replace(/[ÀÁÂÃÄÅàáâãäåĀāąĄ]/g, "a");
	str = str.replace(/[ÈÉÊËèéêëěĚĒēęĘ]/g, "e");
	str = str.replace(/[ÌÍÎÏìíîïĪī]/g, "i");
	str = str.replace(/[ÒÓÔÕÕÖØòóôõöøŌō]/g, "o");
	str = str.replace(/[ÙÚÛÜùúûüůŮŪū]/g, "u");

	return str;
}

function rgbToHex(rgb) {
	var hex = "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase()
	return hex;
}

function intToHex(int) {
	var hexStr = int.toString(16).toUpperCase()
	while (hexStr.length < 6) {
		hexStr = '0' + hexStr;
	}
	hexStr = '#' + hexStr;

	return hexStr;
}

var orientMQ = window.matchMedia("screen and (min-width: 769px)")
function handleOrientationChanges () {
  function _getOrientation () {
    // if orientation is 0 or 180 we are in portrait mode
    if (_.isUndefined(window.orientation)) {
      // window.orientation is undefined on desktop so check on media query
      if (!orientMQ.matches) {
        return 'portrait'
      } else {
        return 'landscape'
      }
    }
    else if (window.orientation == 0 || window.orientation == 180) {
      return 'portrait'
    } else {
      return 'landscape'
    }
  }
  function _writeOrientationAttr (orientation) {
    $('html').attr('orientation', orientation)
  }

  function _needReload (orientation) {
    return orientation === 'landscape' && orientMQ.matches
  }

  // get the current orientation
  var orientation = _getOrientation()
  _writeOrientationAttr(orientation)

  var reloadCheck = _needReload(orientation)
  // support both onorientationchange and resize event
  var supportsOrientationChange = 'onorientationchange' in window
  var orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize'
  // hard refresh when orientation changes
  $(window).on(orientationEvent, function (event) {
    _writeOrientationAttr(orientation)
    var temp = _getOrientation()
    if (temp !== orientation) {
      orientation = temp
      APP.stator.emit('orientationchange')
      // only in desktop-like view refresh objects init
      if (reloadCheck || _needReload(orientation)) {
        APP.loader.start()
        // add timeout to fix reload issue on firefox
        setTimeout(function() {
          window.location.reload()
        }, 500);
      }
    }
  })
}
