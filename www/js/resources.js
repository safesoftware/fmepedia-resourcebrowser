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

	//TODO: click to select a row
	function displayFiles(json, element){
		for (var i = 0; i < json.contents.length; i++){
			var row = document.createElement('tr');
			var file = json.contents[i];
			if (file.type === 'FILE'){
				var fileName = document.createElement('td');
				fileName.innerHTML = '<span class="glyphicon glyphicon-file"></span> ' + file.name;
				row.appendChild(fileName);
				var fileSize = document.createElement('td');
				fileSize.innerHTML = file.size;
				row.appendChild(fileSize);
				var fileDate = document.createElement('td');
				fileDate.innerHTML = file.date;
				row.appendChild(fileDate);
			}
			//TODO: click on a folder name to display list of what is inside
			else if (file.type === 'DIR'){
				var folderName = document.createElement('td');
				folderName.innerHTML = '<span class="glyphicon glyphicon-folder-open"></span> ' + file.name;
				row.appendChild(folderName);
				var folderSize = document.createElement('td');
				folderSize.innerHTML = '-';
				row.appendChild(folderSize);
				var folderDate = document.createElement('td');
				folderDate.innerHTML = file.date;
				row.appendChild(folderDate);
			}
			var table = document.getElementById(element);
			table.appendChild(row);
		}

	}

	function showFiles( json ){
		console.log(json);
		displayFiles(json, 'tableBody');
/*		var div = document.createElement('div');
		for (var i = 0; i < json.contents.length; i++){
			var file = json.contents[i];
			if (file.type == 'FILE'){
				var fileName = document.createElement('input');
				fileName.type = 'checkbox';
				fileName.value = file.path + file.name;
				fileName.name = file.name;
				div.appendChild(fileName);
				var caption = document.createElement('label');
				caption.innerHTML = file.name;
				div.appendChild(caption);
			}
			else if (file.type == 'DIR'){
				var dirLink = document.createElement('button');
				dirLink.type = 'button';
				dirLink.innerHTML = file.name;
				dirLink.onclick = function(){
					var temp = file.name;
					resources.getDetails('/' + this.innerHTML);
				}
				div.appendChild(dirLink);
			}
		}
		document.body.appendChild(div);*/
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

