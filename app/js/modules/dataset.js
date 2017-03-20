function Dataset(){
	var self = this;
	self.loadData = loadData;
	self.fields = {}

	var organisations_path = 'data/organisations.json';
	var projects_path = 'data/projects.json';

	// loads the .csv file and returns the data
	function loadData(callback){
		d3.queue()
		  .defer(d3.json, organisations_path)
		  .defer(d3.json, projects_path)
		  .await(function(error, orgData, prjData){
		  	if(error) {
		  		console.log(error);
		  		return;
		  	}
		  	prepareData({orgs: orgData, prjs: prjData});
		  	if(callback) callback();
		  });
	}

	// cleans up the data and adds additional fields to the records
	function prepareData(data){
		self.orgs = data.orgs;
		self.prjs = data.prjs;
		self.prjs = cleanFieldValues(self.prjs, 'support_tags', 9)
		self.prjs = cleanFieldValues(self.prjs, 'technology', 15)
		createFieldList(self.prjs, 'focus')
		addLinkedFields();
		cleanOrganisationData()
		cleanProjectData()
		createFieldList(self.prjs, 'countries')
		console.log(self)
	}

	// remove unneeded fields from orgs
	function cleanOrganisationData(){
		self.orgs.forEach(function(o){
			o.id = o.organisation_id
			o.name = o.organisation_name
			if(!o.linked_prjs) o.linked_prjs = []
			if(!o.linked_orgs) o.linked_orgs = []
			delete o.address
			delete o.size
			delete o.created
			delete o.long_description
			delete o.organisation_id
			delete o.organisation_name
			delete o.organisation_size
			delete o.startDate
			delete o.tags
			delete o.website
			delete o.linked_project_ids
		})
	}

	// remove unneeded fields from prjs
	function cleanProjectData(){
		self.prjs.forEach(function(p){
			p.id = p.project_id
			p.name = p.project_name
			if(!p.linked_orgs) p.linked_orgs = []
			delete p.country
			delete p.creation_date
			delete p.start_date
			delete p.end_date
			delete p.long_description
			delete p.project_id
			delete p.project_name
			delete p.social_impact
			delete p.website
			delete p.latitude
			delete p.longitude
			delete p.who_we_help_tags
			delete p.linked_organisation_ids
		})
	}

	function createFieldList(data, field, limitCount){
		var list = [];
		var countValueTh = limitCount || false;
		var modData = data.slice();
		modData.forEach(function (c) {
			c[field].forEach(function (e) {
				var match = list.filter(function(f){ return f.name === e });
	  		if ( _.isEmpty(match) ) {
	  			list.push({
	  				name: e,
	  				count: 1
	  			});
	  		} else {
	  			var index = _.findKey(list, function(o) { return o.name===e; });
	  			list[index].count++;
	  		}
			})
		})
		list.sort(function(a,b) {
		  return b.count - a.count;
		});
		if(countValueTh) var slicedList = list.slice(0, countValueTh)
		else var slicedList = list.slice(0);
		if(!self.fields[field]) {
			self.fields[field] = _.map(slicedList, function(f){
				return {
					name: f.name,
					id: idEncode(f.name),
					active: false
				}
			});
		}
	}

	function cleanFieldValues(data, field, limitCount){
		var slicedValues = [];
		if(!self.fields[field]) createFieldList(data, field, limitCount)
		self.fields[field].forEach(function (d) {
			slicedValues.push(d.name);
		})
		data.forEach(function (c) {
			c[field].forEach(function (e) {
				if(!slicedValues.includes(e)) {
					c[field] = _.without(c[field], e);
				}
			})
		})
		return data;
	}

	function addLinkedFields(){
		self.prjs.forEach(function(p){
			p.countries = [];
			p.linked_organisation_ids.forEach(function(id){
				var org = _.find(self.orgs, function(o){return o.organisation_id == id});
				if(org){
					if(org.country != '') p.countries.push(org.country);
					if(!p.linked_orgs) p.linked_orgs = []
					if(!org.linked_prjs) org.linked_prjs = []
					org.linked_prjs.push(p)
					p.linked_orgs.push(org)
				} 
			})
			p.countries = _.uniq(p.countries);
			if(!p.linked_orgs) p.linked_orgs = []
			p.linked_orgs.forEach(function(o){
				o.linked_orgs = _.without(p.linked_orgs, o);
			})
		})
	}
}