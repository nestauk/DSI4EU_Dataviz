function CoachMarks() {
	var self = this;
	self.show = showCoachMarks
	self.place = placeCoachMark
	self.showFiltersCoachmark = showFiltersCoachmark

	var message

	$('#coachmarks').hide();

	function showFiltersCoachmark() {
		var timeout = setTimeout(function(){	
			showCoachMarks()
			placeCoachMark($("#filter-tab"))
		}, 500)
		APP.views[APP.state].shown = true;
	}

	function showCoachMarks() {
		$('#coachmarks').fadeIn();
	}

	function placeCoachMark(target) {
		var targetPos = target.offset();
		var targetW = target.width();
		var targetH = target.height();

		var callout = $(".view.coachmarks .callout")

		callout.css("top", targetPos.top + targetH + 10);
		callout.css("left", targetPos.left + targetW/2 - (callout.outerWidth())/2);

		if (APP.state==="cluster") {
			message = "This panel lets you filter, group and subdivide projects according to different criteria."
		} else {
			message = "This panel lets you select which types of organisations you want to see."
		}

		$(".view.coachmarks .callout .text").html(message)

		$("body").on("click", function () {
			$('#coachmarks').hide()
			$("body").off("click")
		})
	}

}