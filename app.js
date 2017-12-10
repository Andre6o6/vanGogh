window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'vangogh.auth0.com',
    clientID: 'BiQeJ7viXjVqmBI6HkpOK853W25ijwGz',
    responseType: 'token id_token',
    audience: 'https://vangogh.auth0.com/userinfo',
    scope: 'openid profile email phone',
    redirectUri: window.location.href
  });
 
  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');

  // buttons and event listeners
  var loginBtn = document.getElementById('btn-login');
  var logoutBtn = document.getElementById('btn-logout');
  
  var profileBtn = document.getElementById('btn-profile');
  var userSpan = document.getElementById('user-name');
  
  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.addEventListener('click', logout);

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.style.display = 'none';
        homeView.style.display = 'inline-block';
				
		webAuth.client.userInfo(authResult.accessToken, function(err, user) {
			//handle user information
			var name = user.name;
			var nick = user.nickname;
			
			userSpan.innerHTML = name;
			
			//send data to db
			var json = JSON.stringify({
			  name: name,
			  email: nick
			});	
			
			console.log(json);
			
			getJSON('https://us-central1-vangogh-editor.cloudfunctions.net/helloWorld',
				function(err, data) {
				  if (err !== null) {
					console.log('Something went wrong: ' + err + ' - ' + data);
				  } else {
					console.log(data);
				  }
				}
			);
			
			postJSON('https://us-central1-vangogh-editor.cloudfunctions.net/createUser',
				json,
				function(err, data) {
				  if (err !== null) {
					console.log('Something went wrong: ' + err + ' - ' + data);
				  } else {
					console.log(data);
				  }
				}
			);			
			
		});
		
      } else if (err) {
        homeView.style.display = 'inline-block';
        console.log(err);
      }
	  displayButtons();
    });
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
	
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      loginStatus.innerHTML = 'You are logged in!';
	  profileBtn.style.display = 'inline-block';
	  
	  webAuth.client.userInfo( localStorage.getItem('access_token') , function(err, user) {
		userSpan.innerHTML = user.name;
	  });
		
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! Please log in to continue.';
		
	  userSpan.innerHTML = '';
	  profileBtn.style.display = 'none';
    }
  }

  handleAuthentication();
});

var postJSON = function(url, body, callback) {
	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');	
	//xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://vangogh-editor.firebaseapp.com');	
	//xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');	
	xhr.responseType = 'text';
	
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

var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	//xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://vangogh-editor.firebaseapp.com');	
	//xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
	xhr.responseType = 'text';
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