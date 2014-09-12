window.onload = function() {

	resources.init({
		host : "http://bd-lkdesktop",
		token : "2f0a71936bdf6b7d0efaa2e4b8dc0044fd972163"
	});
	
};

var resources = (function() {
	//private
	var host, token;

	function showResults( json ) {
		// The following is to write out the full return object
		// for visualization of the example
		var hr = document.createElement( "hr" );
		var div = document.createElement( "div" );
		div.innerHTML = "<h4>Return Object:</h4><pre>"+JSON.stringify(json, undefined, 4)+"</pre>";
		document.body.appendChild( hr );
		document.body.appendChild( div );
	}

	function clearSelection(){
		var selected = document.getElementsByClassName('success');
		var selRow = selected[0];
		if (selRow != undefined){selRow.removeAttribute('class');}
	}

	function clickedFile(row){
		//get path to file on server
		clearSelection();
		row.className = 'success';
		console.log(row.getAttribute('path'));
	}

	function clickedBreadCrumb(crumb){
		clearSelection();
		resources.getDetails(crumb.getAttribute('path'));
		var breadcrumbs = document.getElementById('breadcrumb');
		while (breadcrumbs.lastChild != crumb){
			breadcrumbs.removeChild(breadcrumbs.lastChild);
		}
		if (breadcrumbs.childElementCount != 1){
			breadcrumbs.removeChild(breadcrumbs.lastChild);
		}
	}

	function createBreadCrumb(path, name){
		var breadcrumbs = document.getElementById('breadcrumb');
		var newBC = document.createElement("li");
		newBC.setAttribute('path', path);
		newBC.innerHTML = '<a href="#">' + name + '</a><span class="divider">/</span>';
		newBC.onclick = function(){clickedBreadCrumb(this)};
		breadcrumbs.appendChild(newBC);
	}

	function clickedFolder(row){
		var curPath, name;
		clearSelection();
		if (row == null) {
			createBreadCrumb('/', 'Home')
			resources.getDetails('/')
		}
		else{
			curPath = row.getAttribute('path');
			var array = curPath.split('/');
			var name = array[array.length-2];
			var path = curPath.replace(/[^/]*$/, "");
			if (name != ""){
				createBreadCrumb(path, name);
			}
			resources.getDetails('/' + row.getAttribute('path'));
		}			
	}


	function displayFiles(json, element){
		//clear table
		var table = document.getElementById(element);
		table.innerHTML = '';

		for (var i = 0; i < json.contents.length; i++){
			var row = document.createElement('tr');
			var file = json.contents[i];
			if (file.type === 'FILE'){
				row.setAttribute('path', file.path + file.name);
				var fileName = document.createElement('td');
				fileName.innerHTML = '<span class="glyphicon icon-file"></span> ' + file.name;
				row.appendChild(fileName);
				var fileSize = document.createElement('td');
				fileSize.innerHTML = file.size;
				row.appendChild(fileSize);
				var fileDate = document.createElement('td');
				fileDate.innerHTML = file.date;
				row.appendChild(fileDate);
				row.onclick = function(){clickedFile(this)};
			}
			else if (file.type === 'DIR'){
				row.setAttribute('path', file.path + file.name);
				var folderName = document.createElement('td');
				folderName.innerHTML = '<span class="glyphicon icon-folder-close"></span> ' + file.name;
				row.appendChild(folderName);
				var folderSize = document.createElement('td');
				folderSize.innerHTML = '-';
				row.appendChild(folderSize);
				var folderDate = document.createElement('td');
				folderDate.innerHTML = file.date;
				row.appendChild(folderDate);
				row.onclick = function(){clickedFolder(this)};
			}
			table.appendChild(row);
		}

	}

	function showFiles( json ){
		displayFiles(json, 'tableBody');
	}

	function getResources() {
		// Ask FME Server for a list of shared resources
		FMEServer.getResources( showResults );
	}


	//public
	return {

		init : function(params) {
			var self = this;
            host = params.host;
            token = params.token;

			FMEServer.init ({
				server : host, 
				token : token
			});

			clickedFolder(null);
			//self.getDetails();
		},

		getDetails : function(path){
			var resource = 'FME_SHAREDRESOURCE_DATA';
			path = path || '/';
			// Ask FME Server for a list of shared resources
			FMEServer.getResourceDetails( resource, path, showFiles );
		}

	};
}());

