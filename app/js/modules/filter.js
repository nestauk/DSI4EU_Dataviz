function Filter(){
	var self = this;
	self.createList = createFilterList;
	self.currentFieldSelection = null;

	function createFilterList(field){
		var data = _(APP.dataset.fields[field]).filter('active').take(3).value();

		var section = "#filter-"+field;
		if($(section).length <= 0) return;

		var filterList = d3.select(section)
			.select(".tags-list")
			.selectAll("li")
			.data(data)
		
		var filterEl = filterList.enter()
			.append("li")
			.on("click", function(d){
				d.active = false;
				d3.select(this).remove()
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

		var addFilter = d3.select(section)
			.select('.add-tags')
			.on("click", function(){
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

}