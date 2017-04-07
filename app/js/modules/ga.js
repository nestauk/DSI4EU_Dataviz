function GoogleA() {

    var self = this

    var loc = window.location.pathname

    if(APP.stator.current){
        var v = loc + APP.stator.current.name

        if(!window.ga) return

        ga('set', 'page', v);
        ga('send', 'pageview', v);
    }

    APP.stator.on('begin', function (e) {
        var v = loc + e.path.substr(1)

        if(!window.ga) return
        
        ga('set', 'page', v);
        ga('send', 'pageview', v);
    })


    $('[track]').on('click', function(){
        var t = $(this).attr('track')
        var parts = t.split('__')

        if(!window.ga) return

        ga('send', 'event', loc + parts[0], parts[1]);
    })

    
        
    return self
}
