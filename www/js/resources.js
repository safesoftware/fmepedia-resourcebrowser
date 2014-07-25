window.onload = function() {

	resources.init({
		host : "http://bd-lkdesktop",
		token : "3d07f91c1bfa88ed0c94c2a36dda209fa4634c4c"
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

	function clickedFile(row){
		//higlight selected row
		//get path to file on server
		console.log('file: ' + row.innerHTML);
		console.log(row.getAttribute('path'));
	}

	function clickedFolder(row){
		//may want to test if folder is open, then close it
		//if folder is closed, then open it
			//use attribute for that?
		//or maybe just update whole table with contents of folder and include
		//a back button.
		var html = row.innerHTML;
		var newHtml = html.replace('glyphicon-folder-close', 'glyphicon-folder-open');
		console.log(newHtml);
		resources.getDetails('/' + row.getAttribute('path'));
	}


	//TODO: click to select a row
	function displayFiles(json, element){
		for (var i = 0; i < json.contents.length; i++){
			var row = document.createElement('tr');
			var file = json.contents[i];
			if (file.type === 'FILE'){
				row.setAttribute('path', file.path + file.name);
				var fileName = document.createElement('td');
				fileName.innerHTML = '<span class="glyphicon glyphicon-file"></span> ' + file.name;
				row.appendChild(fileName);
				var fileSize = document.createElement('td');
				fileSize.innerHTML = file.size;
				row.appendChild(fileSize);
				var fileDate = document.createElement('td');
				fileDate.innerHTML = file.date;
				row.appendChild(fileDate);
				row.onclick = function(){clickedFile(this)};
			}
			//TODO: click on a folder name to display list of what is inside
			else if (file.type === 'DIR'){
				row.setAttribute('path', file.path + file.name);
				var folderName = document.createElement('td');
				folderName.innerHTML = '<span class="glyphicon glyphicon-folder-close"></span> ' + file.name;
				row.appendChild(folderName);
				var folderSize = document.createElement('td');
				folderSize.innerHTML = '-';
				row.appendChild(folderSize);
				var folderDate = document.createElement('td');
				folderDate.innerHTML = file.date;
				row.appendChild(folderDate);
				row.onclick = function(){clickedFolder(this)};
			}
			var table = document.getElementById(element);
			table.appendChild(row);
		}

	}

	function showFiles( json ){
		console.log(json);
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

			self.getDetails();
		},

		getDetails : function(path){
			var resource = 'FME_SHAREDRESOURCE_DATA';
			path = path || '/';
			// Ask FME Server for a list of shared resources
			FMEServer.getResourceDetails( resource, path, showFiles );
		}

	};
}());

