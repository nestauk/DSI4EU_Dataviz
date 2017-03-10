'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

  	ga: {
	    files: [{
	      expand: true,
	      cwd: options.folders.dist,
	      src: '**/*.html',
	      dest: options.folders.dist
	    }],
	    options: {
	      replacements: [{
	        pattern: /<!-- ganalytics:(.*) -->/g,
	        replacement: function(match, p){
	        	return  "<script>"+
						"	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){"+
						"	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),"+
						"	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)"+
						"	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');"+
						"	  ga('create', '"+p+"', 'auto');"+
						"	  ga('send', 'pageview');"+
						"</script>"
	        }
	      }]
	    }
	},

  	dist: {
	    files: [{
	      expand: true,
	      cwd: options.folders.dist,
	      src: '**/*.html',
	      dest: options.folders.dist
	    }],
	    options: {
	      replacements: [{
	        pattern: /<img src="(.*?)" alt="">/g,
	        replacement: function(match, p){
	        	return '<img class="lazy" src="/blog/assets/placeholder.png" data-original="'+p+'" /><noscript><img src="'+p+'" /></noscript>'
	        }
	      }]
	    }
	  }

  };

};
