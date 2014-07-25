window.onload = function() {
	FMEServer.init({
		server : "http://bd-lkdesktop",
		token : "3d07f91c1bfa88ed0c94c2a36dda209fa4634c4c"
	});
	//createAccordion('TESTING');
};

function showResults( json ) {
	// The following is to write out the full return object
	// for visualization of the example
	var hr = document.createElement( "hr" );
	var div = document.createElement( "div" );
	div.innerHTML = "<h4>Return Object:</h4><pre>"+JSON.stringify(json, undefined, 4)+"</pre>";
	document.body.appendChild( hr );
	document.body.appendChild( div );
}

function showFiles( json ){
	console.log(json);
	var div = document.createElement('div');
	for (var i = 0; i < json.contents.length; i++){
		var file = json.contents[i];
		if (file.type == 'FILE'){
			var fileName = document.createElement('input');
			fileName.type = 'checkbox';
			fileName.value = file.path + file.name;
			fileName.name = file.name;
			//fileName.innerHTML = file.name;
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
				getDetails('/' + this.innerHTML);
			}
			div.appendChild(dirLink);
		}
	}
	document.body.appendChild(div);
};

function createAccordion(folder){
	var accordGroup = document.createElement('div');
	accordGroup.className = 'accordion-group';
	var accordHeading = document.createElement('div');
	accordHeading.className = 'accordion-heading';
	var link = document.createElement('a');
	link.className = 'accordion-toggle';
	link.setAttribute('data-toggle','collapse');
	link.setAttribute('data-parent','#accordion2');
	link.setAttribute('href','#collapseFour');
	link.innerHTML = 'folder';
	accordHeading.appendChild(link);
	var accordBody = document.createElement('div');
	accordBody.className = 'accordion-body collapse in';
	accordBody.setAttribute('id','collapseFour');
	var accordInner = document.createElement('div');
	accordInner.className = 'accordion-inner';
	accordInner.innerHTML = 'This is a test';
	accordBody.appendChild(accordInner);

	accordGroup.appendChild(accordHeading);
	accordGroup.appendChild(accordBody);
	document.body.appendChild(accordGroup);
}

function getResources() {
	// Ask FME Server for a list of shared resources
	FMEServer.getResources( showResults );
}

function getDetails(path) {
	var resource = 'FME_SHAREDRESOURCE_DATA';
	path = path || '/';
	// Ask FME Server for a list of shared resources
	FMEServer.getResourceDetails( resource, path, showFiles );
}
