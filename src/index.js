/***************** Firebase SDK Imports, Configuration, and Initialization *****************/
//
// Modules have been bundled with Webpack
import { 
	initializeApp
} 	from 'firebase/app';
import {
	createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} 	from 'firebase/auth';
import {
	getFirestore, collection, getDocs, query, where
} 	from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4L71q-5qsAD2RbzYkPI8S66t1-gPmLlc",
  authDomain: "milkywaymedium.firebaseapp.com",
  databaseURL: "https://milkywaymedium.firebaseio.com",
  projectId: "milkywaymedium",
  storageBucket: "milkywaymedium.appspot.com",
  messagingSenderId: "165659589186",
  appId: "1:165659589186:web:14f35c3010b2e5600c0bdb",
};

// Initialize Firebase App
initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth();

// Initialize Firebase Firestore
const db = getFirestore();



/***************** Auth Methods *****************/
//
// Check user login status
onAuthStateChanged(auth, (user) => {									
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
	try {
		// Update navigation bar IF on User page
		const userContent = document.getElementById("user-content");
		const navRight = document.getElementById("navRight");
		navRight.innerHTML = `<a id="logout" href=".">LOG OUT</a><a href="https://github.com/MilkyWayMedium/MilkyWayMedium.github.io/releases">ABOUT</a><a href="https://milkywaymedium.com/user" style="opacity:.5">MY ACCOUNT</a>`;
		
		userContent.innerHTML = `<h2 class="title">MY ACCOUNT</h2><h4 class="text">You are currently signed in.<br>Medium is currently studying the position of the stars. Please check back later for additional features.</h4>`;
		
		const logout = document.getElementById("logout");
		logout.addEventListener('click', (e) => {
			e.preventDefault();
			signOut(auth).then(() => {
				console.log('You have signed out.');
				navRight.innerHTML = `<a href="https://milkywaymedium.com/login/">LOG IN</a><a href="https://milkywaymedium.com/register/">CREATE &nbsp;ACCOUNT</a><a href="about/">ABOUT</a>`;
			});
		});
		
		const uid = user.uid;
		console.log(user, uid);
	}
	catch {
		try {
			// Update navigation bar ELSE
			const navRight = document.getElementById("navRight");
			navRight.innerHTML = `<a id="logout" href=".">LOG OUT</a><a href="https://github.com/MilkyWayMedium/MilkyWayMedium.github.io/releases">ABOUT</a><a href="https://milkywaymedium.com/user">MY ACCOUNT</a>`;
			
			const logout = document.getElementById("logout");
			logout.addEventListener('click', (e) => {
				e.preventDefault();
				signOut(auth).then(() => {
					console.log('You have signed out.');
					navRight.innerHTML = `<a href="https://milkywaymedium.com/login/">LOG IN</a><a href="https://milkywaymedium.com/register/">CREATE &nbsp;ACCOUNT</a><a href="about/">ABOUT</a>`;
				});
			});
			
			const uid = user.uid;
			console.log(user, uid);
		}
		catch { }
	}
  } else {
    // User is signed out
	console.log("You are not currently signed in.")
  }
});

// Login page auth methods
try {
  	const loginForm = document.querySelector("#login-form");
	const loginButton = document.getElementById("login-button");
	
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		var success = true;
		var identification = loginForm['identification'].value
		var password = loginForm['password'].value;
		
		signInWithEmailAndPassword(auth, identification, password)
			.then((userCredential) => {
				// Signed in 
				const user = userCredential.user;
				location.href = '../';
			  })
			  .catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				success = false;
			  });		

		if(success) {
			console.log("You have logged in successfully.");
		}
	})


}
catch { }

// Registration page auth methods
try {
	const registerForm = document.querySelector('#register-form');
	const continueButton = document.getElementById("continueButton");
	var email = "";
	var username ="";
	var alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
	
	function passCreds() {
		console.log("Passing credentials to next form...");
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
				button1.innerHTML = `<button class="button-login" style="width: 100%; height: 55px;" type="submit">COMPLETE REGISTRATION</button>`;
				console.log("Credentials passed...");
		}
		else {
			console.log("Your credentials do not meet the necessary standards required to create an account.");
			email = "";
			username = "";
		}
	}
		
	continueButton.addEventListener('click', (e) => {
		passCreds();
	});

	registerForm.addEventListener('submit', (e) => {
		// Create an account
		e.preventDefault();
		var password = registerForm['password'].value;
		var confirmPassword = registerForm['confirmPassword'].value;
		console.log("Registration form submitted.");
		
		if(password == confirmPassword &&
		   password.length) {
			   
			   console.log("Your passwords match.");
		
			createUserWithEmailAndPassword(auth, email, password)
			  .then((userCredential) => {
				// Signed in 
				console.log("Your account was created successfully.");
				location.href = '../user/';
			  })
			  .catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
			  });
		  
		 }
		 else {
			password = "";
			confirmPassword = "";
		 }
	});
}
catch { }



/***************** Firestore Methods *****************/
//const querySnapshot = await getDocs(collection(db, "songs"));

//try {
//	querySnapshot.forEach((doc) => {
	  // doc.data() is never undefined for query doc snapshots
//	  console.log(doc.id, " => ", doc.data());
//	});
//}
//catch {
//	console.log("Missing or insufficient permissions.");
//}