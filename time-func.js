window.addEventListener('load', function() {
	var timeBtn = document.getElementById('btn-time');
	var timeView = document.getElementById('time-from-func');
	
	timeBtn.addEventListener('click', function() {
		timeView.innerHTML = '1';
		
		getJSON('https://wt-47ad9a43ae907917aa3e730731e5d8c2-0.run.webtask.io/function1',
			function(err, data) {
			  if (err !== null) {
				alert('Something went wrong: ' + err);
			  } else {
				timeView.innerHTML = data.time;
			  }
			}
		);
		
	});
	
	var getJSON = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
		  var status = xhr.status;
		  if (status === 200) {
			callback(null, xhr.response);
		  } else {
			callback(status, xhr.response);
		  }
		};
		xhr.send();
	};
	
});