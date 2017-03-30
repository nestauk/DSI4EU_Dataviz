function Share() {
	var self = this;
	self.social = setSocialActions;
	self.embedLink = embedPermalink;
	
	function setSocialActions(txt, link){
    var i = 575
      var n = 350
      var r = screen.width / 2 - i / 2
      var s = screen.height / 2 - n / 2

    var tw = 'https://twitter.com/intent/tweet?'
        tw += 'url=' + encodeURIComponent(link)
        tw += '&text=' + encodeURIComponent('#dsi4eu ' + txt)

        var fb = 'https://www.facebook.com/sharer/sharer.php?'
        fb += 'u=' + encodeURIComponent(link)

        $('#twitter-icon').on('click', function(e){
	      window.open(tw,
		            "_blank",
		            "height=" + n + ",width=" + i + ",top=" + s + ",left=" + r)
		     e.preventDefault()
	    })
    	$('#facebook-icon').on('click', function(e){
	      window.open(fb,
	            "_blank",
	            "height=" + n + ",width=" + i + ",top=" + s + ",left=" + r)
	      e.preventDefault()
    })
  }

  function embedPermalink(link){
    $("#share-embed input").attr("value", link);
  }

}