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
  var profileBtn = document.getElementById('btn-profile');
 

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
  
  function displayButtons() {
    if (isAuthenticated()) {
	  profileBtn.style.display = 'inline-block';
	  
	  webAuth.client.userInfo( localStorage.getItem('access_token') , function(err, user) {
		userSpan.innerHTML = user.name;
	  });
		
    } else {
	  userSpan.innerHTML = '';
	  profileBtn.style.display = 'none';
    }
  }

  displayButtons();
});