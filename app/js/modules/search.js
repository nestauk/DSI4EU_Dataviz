function Search() {
	var self = this;
	self.reset = resetSearch;

	console.log('Search', $('#search-input'))

	$('#search-input').keydown(_.debounce(createResultsList, 250));

	function createResultsList() {
		var query = $('#search-input').val();
		$('#search-results').empty();
		if(query == '') return;
		if (APP.state == 'map') var target = APP.dataset.orgs
		else var target = APP.dataset.orgs.concat(APP.dataset.prjs)

		var results = _.filter(target, function(o) {
			return _.includes(o.name.toLowerCase(), query.toLowerCase())
		})

		if (_.isEmpty(results)) {
			$('#search-list').append('<li class="notfound">No results found.</li>');
		}
		_.each(results, function(r, id) {
			var org_links = ''
			if ((r.linked_prjs && r.linked_orgs) && (r.linked_orgs.length > 0)) org_links = '<span class="search-linked-orgs"><strong>' + r.linked_orgs.length + '</strong> '+_('partner').pluralize(r.linked_orgs.length)+'</span>'
			if (APP.state == 'map') {
				var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-linked-prjs"><strong>' + r.linked_prjs.length + '</strong> ' + _('project').pluralize(r.linked_prjs.length) + '</span>'+ org_links +'</p></li>');
			} else {
				if(r.hasOwnProperty('organisation_type')){
					var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-result-type org">ORG</span><span class="search-linked-prjs"><strong>' + r.linked_prjs.length + '</strong> ' + _('project').pluralize(r.linked_prjs.length) + '</span><span class="search-linked-orgs"><strong>' + r.linked_prjs.length + '</strong> partners</span></p></li>')
				} else {
					var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-result-type prj">PRJ</span><span class="search-linked-prjs"><strong>' + r.linked_orgs.length + '</strong> ' + _('organisation').pluralize(r.linked_orgs.length) + ' involved</p></li>')
				}
			}
			result.find('.search-result-name').highlight(query)
			$('#search-results').append(result);
			addListener(result, r);
		})
	}

	function addListener(result, r){
		switch(APP.state){
			case 'map':
				result.click(function(){
					APP.map.focus(r);
					APP.ui.closeUIPanels();
				})
			break;
			case 'network':
				result.click(function(){
					APP.network.focus(r);
					APP.ui.closeUIPanels();
				})
			break;
			default:
			break;
		}
	}

	function resetSearch(){
		$('#search-results').empty();
		$('#search-input').val('')
	}
}