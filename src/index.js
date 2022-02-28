/***************** Firebase SDK Imports, Configuration, and Initialization *****************/
import { 
	initializeApp
} 	from 'firebase/app';
import {
	getAuth, onAuthStateChanged, signInWithEmailAndPassword
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
    const uid = user.uid;
	console.log(user, uid);
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
		
		signInWithEmailAndPassword(auth, identification, password).then()
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
catch {
}


/***************** Firestore Methods *****************/
//const colRef = collection(db, 'books')
//getDocs(colRef)
//	.then((snapshot) => {
//		console.log(snapshot.docs)
//	})