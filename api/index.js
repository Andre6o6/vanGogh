const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const cors = require('cors')({origin: true});

// Automatically allow cross-origin requests
//let app = express();
//app.use(express.cors());

var hashCode = function(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCyb7ILtE49lTqgxclEHWCIkYBr0LMbR74",
    authDomain: "vangogh-editor.firebaseapp.com",
    databaseURL: "https://vangogh-editor.firebaseio.com",
    storageBucket: "vangogh-editor.appspot.com"
};	//?
firebase.initializeApp(functions.config().firebase);

// Get a reference to the database service
var database = firebase.database();

exports.helloWorld = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		response.status(200).send("Hello there");
	});
});

exports.getUserInfo = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		var name = request.body.name || "none";
		if (name == "none")	{
			return response.status(499).send("Invalid request");
		}
		
		var userId = hashCode(name);
		
		firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
			response.status(200).send({
				name: snapshot.val().name,
				email: snapshot.val().email
			});
		});
	});
});

exports.getUserInfoById = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		var userId = request.body.id || "none";
		if (userId == "none")	{
			return response.status(499).send("Invalid request");
		}
		
		firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
			response.status(200).send({
				name: snapshot.val().name,
				email: snapshot.val().email
			});
		});
	});	
});

exports.getImageById = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		var idImage = request.body.id || "none";
		if (idImage == "none")	{
			return response.status(499).send("Invalid request");
		}
		
		firebase.database().ref('/images/' + idImage).once('value').then(function(snapshot) {		
			response.status(200).send({
				name: snapshot.val().name,
				preview: snapshot.val().preview,
				source: snapshot.val().source
			});
		});	
	});
});

exports.getUserHistory = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		var name = request.body.name || "none";
		if (name == "none")	{
			return response.status(499).send("Invalid request");
		}
		var userId = hashCode(name);
		
		firebase.database().ref('/users/' + userId + '/history').once('value').then(function(snapshot) {
			
			var images = [];
			snapshot.forEach(function (childSnapshot) {
				images.push(childSnapshot.key);
			});
			
			response.status(200).send({
				content: images
			});
		});	
	});
});

exports.createUser = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		var username = request.body.name || "none";
		if (username == "none")	{
			return response.status(499).send("Invalid request");
		}
		
		var userId = hashCode(username);
		var email = request.body.email || "none";
		
		firebase.database().ref('users/' + userId).set({
			name: username,
			email: email
		});
		
		response.status(200).send("User added");
	});	
});

exports.createImage = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		var username = request.body.username || "none";
		var imagename = request.body.imagename || "none";
		
		if (username == "none" || imagename == "none")	{
			return response.status(499).send("Invalid request");
		}
		
		var source = request.body.source;
		var preview = request.body.preview || "none";
		
		var userId = hashCode(username);
		var imageId = hashCode(imagename);
			
		firebase.database().ref('users/' + userId + '/history/' + imageId).set(imageId);
		firebase.database().ref('images/' + imageId).set({
			name: imagename,
			preview: preview,
			source: source
		});
		
		response.status(200).send("Image added");
	});
});

