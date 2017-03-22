function Filter() {
	var self = this;
	self.createList = createFilterList;
	self.createViewSettings = createViewSettings;
	self.registerViewUpdate = registerViewUpdate;
	self.removeViewUpdate = removeViewUpdate;
	self.createLabel = createFilterLabel;
	self.currentFieldSelection = null;
	self.activeFilters = [];
	self.resetFilters = resetAllFilters;
	self.init = init;

	var updateViewFunction = null;
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
			.data(selected_trim)

		var filterEl = filterList.enter()
			.append("li")
			.on("click", function(d) {
				d.active = false;
				$(this).remove();
				createFilterList(field)
			})

		filterEl.append("span")
			.text(function(d) {
				return d.name;
			})

		filterEl.insert("div", ":first-child")
			.append('svg')
			.attr("class", "icon-remove")
			.append('use')
			.attr("x‌​link:href", "#icon-remove")

		filterList.exit()
			.remove()

		if (selected.value().length > tagsLimit) $(section + " .tags-list").addClass('showmore')
		else $(section + " .tags-list").removeClass('showmore')

		$(section + " .filters-count").html('<strong>' + selected.value().length + '</strong> of <strong>' + APP.dataset.fields[field].length + '</strong>')

		$(section + " .add-tags").click(function(e) {
			e.stopPropagation();
			createSelectionList(field, '#filter-select-list');
			APP.ui.openSelection();
		})
	}

	function updateFilters() {
		self.activeFilters = [];
		APP.filter_fields.forEach(function(f) {
			var field = [];
			APP.dataset.fields[f].forEach(function(d) {
				if (d.active) field.push({
					field: f,
					value: d.name
				});
			})
			if (!_.isEmpty(field)) self.activeFilters.push(field);
		})

		self.prjs = APP.dataset.prjs
		self.orgs = APP.dataset.orgs

		if (!_.isEmpty(self.activeFilters)) {
			self.activeFilters.forEach(function(currentField) {
				self.prjs = _.filter(self.prjs, function(p) {
					return _.some(currentField, function(f) {
						if (!p[f.field]) return true;
						else return p[f.field] == f.value
					})
				})
				self.orgs = _.filter(self.orgs, function(o) {
					return _.some(currentField, function(f) {
						if (!o[f.field]) return true;
						else return o[f.field] == f.value
					})
				})
			})
		}

		if (updateViewFunction) updateViewFunction()
	}

	function resetAllFilters() {
		APP.filter_fields.forEach(function(f) {
			APP.dataset.fields[f].forEach(function(d) {
				d.active = false;
			})
		})
		createFilterList()
	}

	function registerViewUpdate(update) {
		updateViewFunction = update;
	}

	function removeViewUpdate(update) {
		updateViewFunction = null
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
			.append("svg")
			.attr("class", "icon-check")
			.append('use')
			.attr("x‌​link:href", "#icon-check")

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
		var label = 'filters'
		var count = _.sumBy(self.activeFilters, function(field) {
			return field.length;
		})

		if (count > 0) label = '<strong>' + count + '</strong> active ' + _.pluralize('filters', count);
		return label;
	}

	function createViewSettings() {
		$('.settings-panel').hide();
		$('#settings-' + APP.state).show();
		switch (APP.state) {
			case "map":
				$('#map-show-connections').off()
				$('#map-show-connections').click(function() {
					APP.map.showConnections = !APP.map.showConnections
					$('#map-show-connections').toggleClass('active')
				})
				break;
			case "network":
				$('#network-linked-only').off()
				$('#network-linked-only').click(function() {
					APP.network.showLinkedOnly = !APP.network.showLinkedOnly
					APP.network.create();
					$('#network-linked-only').toggleClass('active')
				})
				break;
			case "cluster":
				$('#cluster-group-by, #cluster-subdivide-by').off();
				$('#cluster-group-by, #cluster-subdivide-by').change(function() {
					var group_by = $('#cluster-group-by').val()
					var subdivide_by = $('#cluster-subdivide-by').val()
					APP.cluster.create(group_by, subdivide_by)
					APP.closeUIPanels();
					console.log(group_by)
				});
				break;
		}
	}

}