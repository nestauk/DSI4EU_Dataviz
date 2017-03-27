function NetworkStats() {
	var self = this;
	self.create = createStats;
	self.delete = deleteStats;


	function createStats() {
		var connections = APP.dataset.getNetworkStats();
		var orgConnRatio = Math.round((connections.totalLinkedOrgs/APP.dataset.orgs.length)*100);
		var prjShareRatio = Math.round((connections.totalSharedPrjs/APP.dataset.prjs.length)*100);
		$(".network-stats-orgs .stats-caption").html("Networked organisations: "+orgConnRatio+"%");
		$(".network-stats-orgs .stats-bar").transition({width: orgConnRatio+"%"}, 2000);
		$(".network-stats-prjs .stats-caption").html("Shared projects: "+prjShareRatio+"%");
		$(".network-stats-prjs .stats-bar").transition({width: prjShareRatio+"%"}, 2000);

	}


	function getNetwork(org){
		var network_orgs = []
		var network_prjs = []
		network_orgs.push(org)

		getOrgNetwork(org)
		function getOrgNetwork(org){
			var prjs = _.difference(org.shared_prjs, network_prjs);
			network_prjs = network_prjs.concat(prjs)
				prjs.forEach(function(p){
					var orgs = _.difference(p.linked_orgs, network_orgs);
					network_orgs = network_orgs.concat(orgs)
						orgs.forEach(function(o){
							getOrgNetwork(o)
						})
				})
		}
		return {
			prjs: network_prjs,
			orgs: network_orgs
		}
	}


	function deleteStats() {
		
	}

}