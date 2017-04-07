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
        tw += '&text=' + encodeURIComponent(txt)

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
    var code = '<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class="embed-container"><iframe src='+link+' style="border:0"></iframe></div>';
    $("#share-embed input")
      .attr("value", code)

    $("#share-embed button").click(function(){
      $("#share-embed input").select();
      document.execCommand('copy');
    });
  }

}