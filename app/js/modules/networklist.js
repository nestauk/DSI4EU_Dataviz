function NetworkList() {
	var self = this;
	self.fillHeader = fillHeader;
	self.drawList = drawList;
	self.deleteNetworkListItems = deleteNetworkListItems;

	function fillHeader(selectedNetwork) {
		console.log(selectedNetwork)
		var totLinkedOrgs, totLinkedPrjs;

		totLinkedOrgs = d3.sum(selectedNetwork, function (e) {
			console.log(e)
			return e.linked_orgs.length;
		})
		totLinkedPrjs = d3.sum(selectedNetwork, function (e) {
			return e.linked_prjs.length;
		})

		$(".network-list-subtitle").text(totLinkedOrgs+" Organisations, "+totLinkedPrjs+" Projects");
	}

	function drawList(selectedNetwork) {

	}

	function deleteNetworkListItems() {
		
	}

}