function Search() {
	var self = this;
	self.reset = resetSearch;

	$('#search-input').keydown(_.debounce(createResultsList, 250));

	function createResultsList() {
		var query = $('#search-input').val();
		$('#search-results').empty();
		if (query == '') return;
		if (APP.state == 'map') var target = APP.filter.orgs
		else if (APP.state == 'network') var target = APP.filter.orgs.concat(APP.filter.prjs)
		else if (APP.state == 'cluster') var target = APP.cluster.getClusters()

		var results = _.filter(target, function(o) {
			if (APP.state != 'cluster') return _.includes(o.name.toLowerCase(), query.toLowerCase())
			else return _.includes(o.key.toLowerCase(), query.toLowerCase())
		})

		if (_.isEmpty(results)) {
			$('#search-results').append('<li class="notfound">No results found.</li>');
		} else {
			createResults(results, query)
		}

	}

	function createResults(results, query) {
		_.each(results, function(r, id) {
			var org_links = ''
			if ((r.linked_prjs && r.linked_orgs) && (r.linked_orgs.length > 0) && APP.state != 'cluster') org_links = '<span class="search-linked-orgs"><strong>' + r.linked_orgs.length + '</strong> ' + _('partner').pluralize(r.linked_orgs.length) + '</span>'
			if (APP.state == 'map') {
				var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-linked-prjs"><strong>' + r.linked_prjs.length + '</strong> ' + _('project').pluralize(r.linked_prjs.length) + '</span>' + org_links + '</p></li>');
			} else if (APP.state == 'network') {
				if (r.hasOwnProperty('organisation_type')) {
					var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-result-type org">ORG</span><span class="search-linked-prjs"><strong>' + r.linked_prjs.length + '</strong> ' + _('project').pluralize(r.linked_prjs.length) + '</span><span class="search-linked-orgs"><strong>' + r.linked_prjs.length + '</strong> partners</span></p></li>')
				} else {
					var result = $('<li><p class="search-result-name">' + r.name + '</p><p class="search-result-info"><span class="search-result-type prj">PRJ</span><span class="search-linked-prjs"><strong>' + r.linked_orgs.length + '</strong> ' + _('organisation').pluralize(r.linked_orgs.length) + ' involved</p></li>')
				}
			} else if (APP.state == 'cluster') {
				if (!_.isArray(r.values[0].values)) var size = r.values.length;
				else {
					var size = _.sumBy(r.values, function(s) {
						return s.values.length
					})
				}
				var result = $('<li><p class="search-result-name">' + r.key + '</p><p class="search-result-info"><span class="search-linked-prjs"><strong>' + size + '</strong> ' + _('project').pluralize(size) + '</p></li>')
			}
			result.find('.search-result-name').highlight(query)
			$('#search-results').append(result);
			if(APP.state != 'map' || (_.isNumber(r.latitude) && _.isNumber(r.longitude))) addListener(result, r);
			else result.find('.search-result-info').prepend('<span class="search-no-coords">Not on map</span>')
		})
	}

	function addListener(result, r) {
		switch (APP.state) {
			case 'map':
				result.click(function() {
					APP.map.focus(r);
					APP.ui.closeUIPanels();
				})
				break;
			case 'network':
				result.click(function() {
					APP.network.focus(r);
					APP.ui.closeUIPanels();
				})
				break;
			case 'cluster':
				result.click(function() {
					APP.cluster.focus(r);
					APP.ui.closeUIPanels();
				})
			break;
			default:
				break;
		}
	}

	function resetSearch() {
		$('#search-results').empty();
		$('#search-input').val('')
	}
}