function Dataset(){
	var self = this;
	self.loadData = loadData;
	self.fields = {}

	var organisations_path = 'data/organisations.json';
	var projects_path = 'data/projects.json';
	var map_path = 'data/world50m.json';
	var countries_path = 'data/iso_3166_2_countries.csv';
	var net_dump = 'data/net_dump.json';

	// loads the .csv file and returns the data
	function loadData(callback){
		d3.queue()
		  .defer(d3.json, organisations_path)
		  .defer(d3.json, projects_path)
		  .defer(d3.json, map_path)
		  .defer(d3.csv, countries_path)
		  .defer(d3.json, net_dump)
		  .await(function(error, orgData, prjData, mapData, countriesData, netDumpData){
		  	if(error) {
		  		console.log(error);
		  		return;
		  	}
		  	prepareData({orgs: orgData, prjs: prjData, map: mapData, countries: countriesData, netDump:netDumpData});
		  	if(callback) callback();
		  });
	}

	// cleans up the data and adds additional fields to the records
	function prepareData(data){
		self.orgs = data.orgs;
		self.prjs = data.prjs;
		self.maptopo = addCountryNames(data.map, data.countries);
		self.prjs = cleanFieldValues(self.prjs, 'support_tags', 9)
		self.prjs = cleanFieldValues(self.prjs, 'technology', 15)
		self.netDump = data.netDump;
		createFieldList(self.prjs, 'focus')
		addLinkedFields();
		createFieldList(self.orgs, 'organisation_type')
		cleanOrganisationData()
		cleanProjectData()
		createFieldList(self.prjs, 'countries')
		createFieldList(self.orgs, 'networkTags')
		console.log(self)
	}

	function addCountryNames(map, countries){
		map.objects.countries.geometries.forEach(function(c){
			var country = _.find(countries, function(country){
				return _.padStart(country['ISO 3166-1 Number'], 3, '0') == c.id;
			})
			if(country) c.properties = {name: country['Common Name']}
		})
		return map;
	}

	// remove unneeded fields from orgs
	function cleanOrganisationData(){
		self.orgs.forEach(function(o){
			o.id = o.organisation_id
			o.name = o.organisation_name
			o.type = 'org'
			o.url = 'https://digitalsocial.eu/org/'+o.id
			if(!o.linked_prjs) o.linked_prjs = []

			if(!o.linked_orgs) o.linked_orgs = []
			else o.linked_orgs = _.uniq(o.linked_orgs)
			
			o.shared_prjs = o.linked_prjs.filter(function (p) {
				return p.linked_orgs.length > 1;
			})
			o.organisation_type = replaceOrganisationType(o.organisation_type)
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
			p.type = 'prj'
			p.url = 'https://digitalsocial.eu/project/'+p.id
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
			if(Array.isArray(c[field])){
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
			} else {
				var match = list.filter(function(f){ return f.name === c[field] });
				if ( _.isEmpty(match) && !_.isEmpty(c[field])) {
					list.push({
						name: c[field],
						count: 1
					});
				}
			}
		})
		list.sort(function(a,b) {
		  return b.count - a.count;
		});
		if(countValueTh) {
			var slicedList = list.slice(0, countValueTh)
			slicedList.push({name: 'Others', count: 0})
		}	else {
			var slicedList = list.slice(0);
		}
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

	function replaceOrganisationType(org_type){
		if(org_type.toLowerCase() == 'Social enterprise, charity, foundation or other non-profit'.toLowerCase()) return 'Non-Profit';
		if(org_type.toLowerCase() == 'Academia/Research organisation'.toLowerCase()) return 'Research';
		if(org_type.toLowerCase() == 'For-profit business'.toLowerCase()) return 'For-profit Business';
		if(org_type.toLowerCase() == 'Grassroots organisation or community network'.toLowerCase()) return 'Citizens organisation';
		if(org_type.toLowerCase() == 'Government/Public Sector'.toLowerCase()) return 'Public Sector';
	}

	function cleanFieldValues(data, field, limitCount){
		var slicedValues = [];
		if(!self.fields[field]) createFieldList(data, field, limitCount)
		self.fields[field].forEach(function (d) {
			slicedValues.push(d.name);
		})
		data.forEach(function (c) {
			c[field].forEach(function(e, i) {
				if(!slicedValues.includes(e)) {
					c[field][i] = 'Others'
					// c[field] = _.without(c[field], e);
				}
			})
			c[field] = _.uniq(c[field], 'name');
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
				if(!o.linked_orgs) o.linked_orgs = []
				o.linked_orgs = o.linked_orgs.concat(_.without(p.linked_orgs, o));
			})
		})
	}
}