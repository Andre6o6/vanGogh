window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'vangogh.auth0.com',
    clientID: 'BiQeJ7viXjVqmBI6HkpOK853W25ijwGz',
    responseType: 'token id_token',
    audience: 'https://vangogh.auth0.com/userinfo',
    scope: 'openid profile email phone',
    redirectUri: window.location.href
  });

  var userSpan = document.getElementById('user-name');
  var userNameSpan = document.getElementById('username');
  var userEmailSpan = document.getElementById('email');
  var imageTable = document.getElementById('img-table');
  
  document.getElementById('btn-settings').addEventListener('click', function(e) {
	var access_token = localStorage.getItem('access_token');
	webAuth.client.userInfo(access_token, function(err, user) {
		console.log(JSON.stringify(user));
	});
  });
  
  function displayUserInfo() {
    var access_token = localStorage.getItem('access_token');
	if (access_token !== null) {
		webAuth.client.userInfo(access_token, function(err, user) {
			userSpan.innerHTML = user.name;
			userNameSpan.innerHTML = user.name;
			userEmailSpan.innerHTML = user.nickname;
			
			var json = JSON.stringify({
			  name: user.name
			});
			
			
			//асинк запрос инфо			
			getJSONfromPost('https://us-central1-vangogh-editor.cloudfunctions.net/getUserInfo',
				json,
				function(err, data) {
				  if (err !== null) {
					console.log('Something went wrong: ' + err + ' - ' + data);
				  } else {
					console.log(data);
				  }
				}
			);
			
			//асинк апрос изображений
			getJSONfromPost('https://us-central1-vangogh-editor.cloudfunctions.net/getUserHistory',
				json,
				function(err, data) {
				  if (err !== null) {
					console.log('Something went wrong: ' + err + ' - ' + data);
				  } else {
					console.log(data);				
					data.content.forEach(function (element, index, array) {
						getJSONfromPost('https://us-central1-vangogh-editor.cloudfunctions.net/getImageById',
							JSON.stringify( {id: element} ),
							function(err, data) {
							  if (err !== null) {
								console.log('Something went wrong: ' + err + ' - ' + data);
							  } else {
								console.log(data);
								
								if (data.preview == "none") {
									imageTable.innerHTML = imageTable.innerHTML + '<li> ' + data.name + ': <a href= ' + data.source + ' >No preview</a> </li>';
								} else {
									imageTable.innerHTML = imageTable.innerHTML + '<li> <a href= ' + data.source + ' ><img src=' + data.preview + ' /></a> </li>';
								}
								
							  }
							}
						);		
						
					});
					
				  }
				}
			);
			
			
		});
	} else {
		userNameSpan.innerHTML = 'not defined';
		userEmailSpan.innerHTML = 'not defined';
	}	
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  displayUserInfo();
});

var getJSONfromPost = function(url, body, callback) {
	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.responseType = 'json';
	
	xhr.onload = function() {
	  var status = xhr.status;
	  if (status === 200) {
		callback(null, xhr.response);
	  } else {
		callback(status, xhr.response);
	  }
	};
	
	xhr.send(body);
};