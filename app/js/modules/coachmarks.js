function CoachMarks() {
	var self = this;
	self.show = showCoachMarks;
	self.place = placeCoachMark;

	$('#coachmarks').hide();

	function init() {
		
	}

	function showCoachMarks() {
		$('#coachmarks').show();
	}

	function placeCoachMark(target) {
		var targetPos = target.position();
		var targetW = target.width();
		var targetH = target.height();

		var callout = $(".view.coachmarks .callout")

		callout.css("top", targetPos.top + targetH + 20);
		callout.css("left", targetPos.left + targetW/2 - (callout.width())/2);

		$(".view.coachmarks .callout .text").html("This is a coachmark for " + APP.state + "state!")

		$("body").on("click", function () {
			$('#coachmarks').hide()
		})
	}

}