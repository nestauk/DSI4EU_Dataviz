function CoachMarks() {
	var self = this;
	self.show = showCoachMarks;
	self.place = placeCoachMark;

	$('#coachmarks').hide();

	function init() {
		
	}

	function showCoachMarks() {
		if (APP.state === "network") $('#coachmarks').show();
	}

	function placeCoachMark(target) {
		var targetPos = target.position();
		var targetW = target.width();
		var targetH = target.height();

		$(".view.coachmarks .mark").css("top", targetPos.top + targetH);
		$(".view.coachmarks .mark").css("left", targetPos.left + targetW/2);
	}

}