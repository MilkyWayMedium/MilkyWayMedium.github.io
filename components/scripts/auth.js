//import * as firebase from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js'
//const firebase = require('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
//import 'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js'
//import 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'

//Rather, do this:
require.config({
    paths: {
       'firebase': 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app',
        //'auth': 'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth',
        //'firestore': 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore'
    }
});

require(['firebase', 'auth'], function (firebase, auth) {
			const registerForm = document.querySelector('#register-form');
			const continueButton = document.getElementById("continueButton");
			var email = "";
			var username ="";
			var alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;

			const firebaseConfig = {
					  apiKey: "AIzaSyB4L71q-5qsAD2RbzYkPI8S66t1-gPmLlc",
					  authDomain: "milkywaymedium.firebaseapp.com",
					  databaseURL: "https://milkywaymedium.firebaseio.com",
					  projectId: "milkywaymedium",
					  storageBucket: "milkywaymedium.appspot.com",
					  messagingSenderId: "165659589186",
					  appId: "1:165659589186:web:14f35c3010b2e5600c0bdb",
					  measurementId: "G-WGKXQT89RQ"
					};

					// Initialize Firebase
					const app = firebase.initializeApp(firebaseConfig);
					//const autho = firebase.auth;
					//const db = firebase.default.firestore;

			function passCreds() {
				console.log("Passing credentials...");
				email = document.getElementById("email").value;
				username = document.getElementById("username").value;
					
				if (email != "" &&
					email.includes("@") &&
					email.includes(".") &&
					email.length > 5 &&
					!email.includes(" ") &&
					username != "" &&
					username.length > 2 &&
					username.match(alphaNumeric)) {
						
						console.log("Requirements met...");
						
						const labelEmail = document.getElementById("label-email");
						const labelUsername = document.getElementById("label-username");
						const captionEmail = document.getElementById("caption-email");
						const captionUsername = document.getElementById("caption-username");
						const box1 = document.getElementById("box1");
						const box2 = document.getElementById("box2");
						const button1 = document.getElementById("button1");
						
						labelEmail.innerHTML = "<b>Password</b>";
						labelUsername.innerHTML = "<b>Confirm Password</b>";
						captionEmail.innerHTML = "Please enter a password that includes a number or symbol with at least eight characters...";
						captionUsername.innerHTML = "Please retype your password to confirm it is correct...";
						box1.innerHTML = `<input type="password" placeholder="Example: Andr0meda" id="password" name="password" required>`;
						box2.innerHTML = `<input type="password" placeholder="Example: Andromed@" id="confirmPassword" name="confirmPassword" required>`;
						button1.innerHTML = `<button class="button-login" style="width: 100%; height: 55px;" type="submit">CONTINUE</button>`;
						console.log("Credentials passed...");
				}
				
				else {
					console.log("Your credentials do not meet the standards.");
					email = "";
					username ="";
				}
			}

			continueButton.addEventListener('click', (e) => {
				passCreds();
				});

			registerForm.addEventListener('submit', (e) => {
				// Create account
				e.preventDefault();
				const password = registerForm['password'].value;
				const confirmPassword = registerForm['confirmPassword'].value;
				console.log(email, username, password, confirmPassword);
				auth.createUserWithEmailAndPassword(email, password).then(cred => {
				console.log(cred);
				});
			});
		});
