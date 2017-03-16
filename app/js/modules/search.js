function Search() {
	var self = this;
	self.reset = resetSearch;

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
			var prj_label = 'project'
			if (r.linked_prjs && r.linked_prjs.length > 1) prj_label = 'projects'
			var org_label = 'organisation'
			if (r.linked_orgs && r.linked_orgs.length > 1) prj_label = 'organisations'
			if (APP.state == 'map') {
				var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-linked-prjs"><strong>' + r.linked_prjs.length + '</strong> ' + prj_label + '</span><span class="search-linked-orgs"><strong>' + r.linked_prjs.length + '</strong> partners</span></p></li>')
			} else {
				if(r.hasOwnProperty('organisation_type')){
					var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-result-type org">ORG</span><span class="search-linked-prjs"><strong>' + r.linked_prjs.length + '</strong> ' + prj_label + '</span><span class="search-linked-orgs"><strong>' + r.linked_prjs.length + '</strong> partners</span></p></li>')
				} else {
					var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-result-type prj">PRJ</span><span class="search-linked-prjs"><strong>' + r.linked_orgs.length + '</strong> ' + org_label + ' involved</p></li>')
				}
			}
			result.find('.search-result-name').highlight(query)
			$('#search-results').append(result);
			// addListener(clip, 'search', query, id);
		})
	}

	function resetSearch(){
		$('#search-results').empty();
		$('#search-input').val('')
	}
}