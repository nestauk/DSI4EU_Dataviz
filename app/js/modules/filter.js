function Filter() {
	var self = this;
	self.createList = createFilterList;
	self.createViewSettings = createViewSettings;
	self.createLabel = createFilterLabel;
	self.currentFieldSelection = null;
	self.activeFilters = [];
	self.resetFilters = resetAllFilters;
	self.init = init;
	self.update = updateFilters

	var tagsLimit = 3

	function init() {
		self.prjs = APP.dataset.prjs
		self.orgs = APP.dataset.orgs
	}

	function createFilterList(field) {
		updateFilters();
		if (_.isEmpty(self.activeFilters)) $('#clear-all-filters').hide();
		else $('#clear-all-filters').show();
		var selected = _(APP.dataset.fields[field]).filter('active');
		var selected_trim = selected.take(tagsLimit).value();
		var section = "#filter-" + field;
		if ($(section).length <= 0) return;

		var filterList = d3.select(section)
			.select(".tags-list")
			.selectAll("li")
			.data(selected_trim, function(d){
				return d.name
			})

		var filterEl = filterList
			.enter()
			.append("li")
			.on("click", null)
			.on("click", function(d) {
				d.active = false;
				APP.permalink.go();
				if(!window.isMobile) APP.ui.updateView()
			})

		filterEl
			.append("span")
			.merge(filterEl)
			.text(function(d) {
				return d.name;
			})

		filterEl.insert("div", ":first-child")
			.append('img')
			.attr("class", "icon-remove")
			.attr("src", "img/ui/icon-remove-white.svg")

		filterList.exit()
			.remove()

		if (selected.value().length > tagsLimit) $(section + " .tags-list").addClass('showmore')
		else $(section + " .tags-list").removeClass('showmore')

		$(section + " .filters-count").html('<strong>' + selected.value().length + '</strong> of <strong>' + APP.dataset.fields[field].length + '</strong>')

		$(section + " .add-tags").off().click(function(e) {
			e.stopPropagation();
			createSelectionList(field, '#filter-select-list');
			APP.ui.openSelection();
		})
	}

	function updateFilters() {
		self.activeFilters = [];
		APP.filter_fields.forEach(function(f) {
			var field = {
				field: f,
				values: []
			};
			APP.dataset.fields[f].forEach(function(d) {
				if (d.active) field.values.push(d.id);
			})
			if (!_.isEmpty(field.values)) self.activeFilters.push(field);
		})

		self.prjs = APP.dataset.prjs
		self.orgs = APP.dataset.orgs

		if (!_.isEmpty(self.activeFilters)) {
			self.activeFilters.forEach(function(currentField) {
				self.prjs = _.filter(self.prjs, function(p) {
					return _.some(currentField.values, function(f) {
						if (!p[currentField.field]) return true;
						return _.includes(flattenFieldIds(p[currentField.field]), f);
					})
				})
				self.orgs = _.filter(self.orgs, function(o) {
					return _.some(currentField.values, function(f) {
						if (!o[currentField.field]) return true;
						return _.includes(flattenFieldIds(o[currentField.field]), f);
					})
				})
			})
		}
		// if(!window.isMobile && APP.ui.updateViewFunction) APP.ui.updateViewFunction()
	}

	function flattenFieldIds(field){
		return _.map(field, function(f){
			return parseInt(f.id);
		})
	}

	function resetAllFilters() {
		APP.filter_fields.forEach(function(f) {
			APP.dataset.fields[f].forEach(function(d) {
				d.active = false;
			})
		})
		APP.permalink.go();
		if(!window.isMobile) APP.ui.updateView();
	}

	function createSelectionList(field, el) {
		self.currentFieldSelection = field;
		var data = APP.dataset.fields[field];
		var filterList = d3.select(el)
			.selectAll("li")
			.data(data)

		var filterEl = filterList.enter()
			.append("li")
			.attr("class", function(d) {
				if (d.active) return "active"
			})
			.on("click", function(d) {
				d.active = !d.active
				$(this).toggleClass("active")
			})

		filterEl.append('span')
			.text(function(d) {
				return d.name;
			})
		filterEl
			.insert("div", ":first-child")
			.append("img")
			.attr("class", "icon-check")
			.attr("src", "img/ui/icon-check-green.svg")

		$('#clear-selection').off().click(function() {
			clearSelectedField(field)
		})
	}

	function clearSelectedField(field) {
		APP.dataset.fields[field].forEach(function(f) {
			f.active = false;
		})
		APP.ui.closeSelection()
		APP.filter.currentFieldSelection = null;
	}

	function createFilterLabel() {
		var label
		APP.state==='cluster' ? label = 'group and filter' : label = 'filter'
		var count = _.sumBy(self.activeFilters, function(field) {
			return field.values.length;
		})
		if (count > 0) label = '<strong>' + count + '</strong> active ' + _.pluralize('filters', count);
		// if(APP.state === 'cluster' && APP.cluster.subdivide_field != 'none') label += ' - divide by <strong>'+APP.dataset.fields.names_map[APP.cluster.subdivide_field]+'</strong>'
		return label;
	}

	function resetMap(){
		
	}

	function createViewSettings() {
		$('.settings-panel').hide();
		$('#settings-' + APP.state).show();
		switch (APP.state) {
			case "map":
				if(APP.map.showLinks) $('#map-show-connections').addClass('active')
				$('#map-show-connections').off()
				$('#map-show-connections').click(function() {
					APP.map.showLinks = !APP.map.showLinks
					APP.permalink.go()
					if(!window.isMobile) APP.ui.updateView();
					$('#map-show-connections').toggleClass('active')
				})
				break;
			case "network":
				if(!APP.network.showLinkedOnly) $('#network-linked-only').addClass('active')
				$('#network-linked-only').off()
				$('#network-linked-only').click(function() {
					APP.network.showLinkedOnly = !APP.network.showLinkedOnly
					APP.permalink.go()
					if(!window.isMobile) APP.ui.updateView();
					$('#network-linked-only').toggleClass('active')
				})
				break;
			case "cluster":
				$('#cluster-group-by, #cluster-subdivide-by').off();
				$('#cluster-group-by option[value="'+APP.cluster.cluster_field+'"]').attr("selected",true);
				$('#cluster-subdivide-by option[value="'+APP.cluster.subdivide_field+'"]').attr("selected",true);
				// Disable subdivide by field when is = group by field
				$('#cluster-subdivide-by option[value="'+APP.cluster.cluster_field+'"]').attr("disabled",true);
				$('#cluster-group-by').change(function() {
					var group_by = $('#cluster-group-by').val()
					APP.cluster.cluster_field = group_by
					// when group by changes deselect current subdivide by option
					$('#cluster-subdivide-by option').attr("selected", false);
					// and set it to none
					$($('#cluster-subdivide-by option')[0]).attr("selected", true);
					var subdivide_by = $('#cluster-subdivide-by').val()
					APP.cluster.subdivide_field = subdivide_by
					// then reload the state
					APP.permalink.go()
					// On update state
					// Enable again all subdivide by options
					$('#cluster-subdivide-by option').attr("disabled", false);
					// Disable subdivide by field when is = group by field
					$('#cluster-subdivide-by option[value="'+APP.cluster.cluster_field+'"]').attr("disabled",true);	
					if(!window.isMobile) APP.ui.updateView();
					APP.ui.closeUIPanels();
				});
				$('#cluster-subdivide-by').change(function() {
					var subdivide_by = $('#cluster-subdivide-by').val()
					APP.cluster.subdivide_field = subdivide_by
					APP.permalink.go()
					if(!window.isMobile) APP.ui.updateView();
					APP.ui.closeUIPanels();
				});
				break;
		}
	}

}
