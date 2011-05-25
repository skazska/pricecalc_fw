var dataVersion = 0;



//var xhrVersion = new Xhr('');




function isDataChanged() {
	return true;
}

function getCurrentAppMode() {
	return 'calc';
}


function getJSONData (url, callback) {
		//menudata
		Xhr.load(url,
			{
				spinner: 'spinner',
				onSuccess: 
					function(request) {
						var data = request.responseJSON;
						callback(data);
					},
				onComplete: //dummy helper to use when work without app server
					function(request, rqt){
						if ((request.status == 0) && (rqt.readyState == 4)) {
							var data = JSON.parse(request.responseText);
							//var data = eval('('+request.responseText+')');
							callback(data);
						}
				}
			}
		);
		
}

function getHTMLData (url, callback) {
		//menudata
		Xhr.load(url,
			{
				spinner: 'spinner',
				onSuccess: 
					function(request) {
						data = request.responseText;
						callback(data);
					},
				onComplete: //dummy helper to use when work without app server
					function(request, rqt){
						if ((request.status == 0) && (rqt.readyState == 4)) {
							var data = request.responseText;
							callback(data);
						}
				}
			}
		);
		
}


function getPlateBody () {

}
