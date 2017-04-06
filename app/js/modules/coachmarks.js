function CoachMarks() {
	var self = this;
	self.show = showCoachMarks;
	self.place = placeCoachMark;

	var message

	$('#coachmarks').hide();

	function init() {
		
	}

	function showCoachMarks() {
		$('#coachmarks').show();
	}

	function placeCoachMark(target) {
		var targetPos = target.offset();
		var targetW = target.width();
		var targetH = target.height();

		var callout = $(".view.coachmarks .callout")

		callout.css("top", targetPos.top + targetH + 10);
		callout.css("left", targetPos.left + targetW/2 - (callout.outerWidth())/2);

		if (APP.state==="cluster") {
			message = "Open the panel to filter, group and subdivide projects according to different criteria."
		} else {
			message = "Open the panel to select which types of organisations and projects you want to see."
		}

		$(".view.coachmarks .callout .text").html(message)

		$("body").on("click", function () {
			$('#coachmarks').hide()
			$("body").off("click")
		})
	}

}