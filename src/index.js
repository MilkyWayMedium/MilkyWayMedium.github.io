/***************** Firebase SDK Imports, Configuration, and Initialization *****************/
import { 
	initializeApp
} 	from 'firebase/app';
import {
	createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} 	from 'firebase/auth';
import {
	getFirestore, collection, getDocs
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
onAuthStateChanged(auth, (user) => {									// Check user login status
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
	try {
		const navRight = document.getElementById("navRight");
		navRight.innerHTML = `<a id="logout" href=".">LOG OUT</a><a href="../about/">ABOUT</a>`;
		
		const logout = document.getElementById("logout");
		logout.addEventListener('click', (e) => {
			e.preventDefault();
			signOut(auth).then(() => {
				console.log('You have signed out.');
				navRight.innerHTML = `<a href="login/">LOG IN</a><a href="register/">CREATE &nbsp;ACCOUNT</a><a href="about/">ABOUT</a>`;
			});
		});
		
		const uid = user.uid;
		console.log(user, uid);
	}
	catch { }
  } else {
    // User is signed out
	console.log("You are not currently signed in.")
  }
});


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
			console.log("Logged in...");
		}
	})


}
catch { }

try {
	const registerForm = document.querySelector('#register-form');
	const continueButton = document.getElementById("continueButton");
	var email = "";
	var username ="";
	var alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
	
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
		// Create account
		e.preventDefault();
		var password = registerForm['password'].value;
		var confirmPassword = registerForm['confirmPassword'].value;
		console.log("Form submitted.");
		
		if(password == confirmPassword &&
		   password.length) {
			   
			   console.log("Passwords match.");
		
			createUserWithEmailAndPassword(auth, email, password)
			  .then((userCredential) => {
				// Signed in 
				console.log("Account created.");
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
catch {
	console.log("Error.");
}


/***************** Firestore Methods *****************/
//const colRef = collection(db, 'books')
//getDocs(colRef)
//	.then((snapshot) => {
//		console.log(snapshot.docs)
//	})