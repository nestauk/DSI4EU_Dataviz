function Permalink(){
	var self = this;
	self.viewSettings = {};
	self.createUrl = createUrl
	self.parseUrlParameters = parseUrlParameters
	self.go = go

	function parseUrlParameters(params){
		if(_.isEmpty(params)) {
			var filters = []
		} else {
		filterFields = _.filter(_.keys(params), function(p){
			return p[0] == 'f';
		})
		var filters = _.map(filterFields, function(p){
			return {
				key: parseInt(p[1]),
				values: _.map(params[p].split(','), function(f){
					return parseInt(f);
				})
			}
		});
		}
		setActiveFilters(filters)
	}

	function setActiveFilters(filters){
		filters.forEach(function(f){
			var field = APP.filter_fields[f.key];
			f.values.forEach(function(v){
				var filter = _.find(APP.dataset.fields[field], {id: v});
				filter.active = true;
			})
			APP.filter.createList(field)
		})

		if(_.isEmpty(filters)) APP.filter_fields.forEach(function(f){
			APP.filter.createList(f);
		})
	}

	function go(){
		var params = {}

		params = getViewSettings(params);
		_.keys(APP.dataset.fields).forEach(function(k){
			var field = APP.dataset.fields[k];
			var active = _.map(_.filter(field, 'active'), function(f){
				return f.id
			});
			if(!_.isEmpty(active)) params['f'+APP.filter_fields.indexOf(k)] = active.join(',')
		})
		_.keys(self.viewSettings).forEach(function(k){
			var value = self.viewSettings[k];
			params[k] = value
			if(!_.isNaN(+value)) params[k] = Math.round(params[k]*1000)/1000
		})
		if (APP.stator.current.name) {
			var url = '#' + APP.stator.encode(APP.stator.current.name, params)
			window.history.replaceState({}, '', url)
		}
 		APP.stator.go(APP.stator.current.name, {param: params})
 		APP.share.embedLink(createUrl(params));
	}

	function createUrl(params){
		if(!params) var params = APP.stator.param
 		params.e = 1
 		var currentUrl = window.location.origin + '/#' + APP.stator.encode( APP.stator.current.name, params )
 		return currentUrl
	}

	function getViewSettings(params){
		switch(APP.state){
			case 'map':
				params.l = +APP.map.showLinks
			break;
			case 'network':
				params.l = +APP.network.showLinkedOnly
			break;
			case 'cluster':
				params.g = APP.cluster.cluster_field
				params.s = APP.cluster.subdivide_field
			break;
		}
		params.e = APP.embed
		return params
	}

}
