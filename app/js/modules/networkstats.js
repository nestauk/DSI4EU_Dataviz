function NetworkStats() {
	var self = this;
	self.create = createStats;
	self.delete = deleteStats;


	function createStats() {
		var connections = APP.dataset.getNetworkStats();
		var orgConnRatio = Math.round((connections.totalLinkedOrgs/APP.dataset.orgs.length)*100);
		var prjShareRatio = Math.round((connections.totalSharedPrjs/APP.dataset.prjs.length)*100);
		$(".network-stats-orgs .stats-caption").html("Networked organisations: "+orgConnRatio+"%");
		$(".network-stats-orgs .stats-bar .color").transition({width: orgConnRatio+"%"}, 2000);
		$(".network-stats-prjs .stats-caption").html("Shared projects: "+prjShareRatio+"%");
		$(".network-stats-prjs .stats-bar .color").transition({width: prjShareRatio+"%"}, 2000);

	}


	function deleteStats() {
		
	}

}