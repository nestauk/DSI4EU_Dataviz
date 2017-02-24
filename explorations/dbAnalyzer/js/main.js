$( document ).ready(function() {

	projects();

	d3.select("#selectEntity").on("change", function () {
		var selectedIndex = d3.select(this).property("selectedIndex");
		console.log(selectedIndex);
		selectedIndex===0 ? projects() : organisations();
	})

});