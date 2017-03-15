function Filter(){
	var self = this;
	self.createList = createFilterList

	function createFilterList(field, section){
		var data = APP.dataset.fields[field];
		console.log(field, data)
		var filterList = d3.select(section)
		.select(".tags-list")
		.selectAll("li")
		.data(data)
		.enter()
		.append("li")
		.text(function(d){
			return d.name;
		})
		.each(createListeners)
	}

	function createListeners(){

	}
}