function Permalink(){
	var self = this;
	self.viewSettings = {};
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
		console.log(APP.ui)
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

		APP.ui.updateViewFunction()
	}

	function go(){
		var params = {}
		_.keys(APP.dataset.fields).forEach(function(k){
			var field = APP.dataset.fields[k];
			var active = _.map(_.filter(field, 'active'), function(f){
				return f.id
			});
			if(!_.isEmpty(active)) params['f'+APP.filter_fields.indexOf(k)] = active.join(',')
		})
		console.log(self.viewSettings)
		_.keys(self.viewSettings).forEach(function(k){
			var value = self.viewSettings[k];
			console.log(k, value)
			params[k] = value
			if(!_.isNaN(+value)) params[k] = Math.round(params[k]*1000)/1000
		})
 		APP.stator.go(APP.stator.current.name, {param: params})
	}

}