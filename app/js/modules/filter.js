function Filter(){
	var self = this;
	self.createList = createFilterList;
	self.createViewSettings = createViewSettings;
	self.currentFieldSelection = null;
	var tagsLimit = 3

	function createFilterList(field){
		var selected = _(APP.dataset.fields[field]).filter('active');
		var selected_trim = selected.take(tagsLimit).value();
		var section = "#filter-"+field;
		if($(section).length <= 0) return;

		var filterList = d3.select(section)
			.select(".tags-list")
			.selectAll("li")
			.data(selected_trim)
		
		var filterEl = filterList.enter()
			.append("li")
			.on("click", function(d){
				d.active = false;
				$(this).remove();
				createFilterList(field)
			})

		filterEl.append("span")
			.text(function(d){
				return d.name;
			})

		filterEl.insert("div", ":first-child")
			.append('svg')
			.attr("class","icon-remove")
			.append('use')
			.attr("x‌​link:href","#icon-remove")

		filterList.exit()
			.remove()

		if(selected.value().length > tagsLimit)	$(section+" .tags-list").addClass('showmore')
		else $(section+" .tags-list").removeClass('showmore')

		$(section+" .filters-count").html('<strong>'+selected.value().length+'</strong> of <strong>'+APP.dataset.fields[field].length+'</strong>')

		$(section+" .add-tags").click(function(e){
			e.stopPropagation();
			createSelectionList(field, '#filter-select-list');
			APP.ui.openSelection();
		})
	}

	function createSelectionList(field, el){
		self.currentFieldSelection = field;
		var data = APP.dataset.fields[field];
		var filterList = d3.select(el)
		.selectAll("li")
		.data(data)

		var filterEl = filterList.enter()
		.append("li")
		.attr("class", function(d){
			if(d.active) return "active"
		})
		.on("click", function(d){
			d.active = !d.active
			$(this).toggleClass("active")
		})

		filterEl.append('span')
		.text(function(d){
			return d.name;
		})
		filterEl
		.insert("div", ":first-child")
		.append("svg")
		.attr("class","icon-check")
		.append('use')
		.attr("x‌​link:href","#icon-check")
		
		$('#clear-selection').off().click(function(){
			clearSelectedField(field)
		})
	}

	function clearSelectedField(field){
		APP.dataset.fields[field].forEach(function(f){
			f.active = false;
		})
		APP.ui.closeSelection()
		APP.filter.currentFieldSelection = null;
	}

	function createViewSettings(){
		$('.settings-panel').hide();
		$('#settings-'+APP.state).show();
		switch(APP.state){
			case "map":
				$('#map-show-connections').click(function(){
					APP.map.showConnections = !APP.map.showConnections
					$(this).toggleClass('active')
				})
			break;
			case "network":
				$('#network-linked-only').click(function(){
					APP.network.showLinkedOnly = !APP.network.showLinkedOnly
					$(this).toggleClass('active')
				})
			break;
			case "cluster":
			break;
		}
	}

}