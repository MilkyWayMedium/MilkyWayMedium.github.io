import { initializeApp } from 'firebase/app'
import {
	getAuth, signInWithEmailAndPassword
} from 'firebase/auth'
import {
	getFirestore, collection, getDocs
} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4L71q-5qsAD2RbzYkPI8S66t1-gPmLlc",
  authDomain: "milkywaymedium.firebaseapp.com",
  databaseURL: "https://milkywaymedium-default-rtdb.firebaseio.com",
  projectId: "milkywaymedium",
  storageBucket: "milkywaymedium.appspot.com",
  messagingSenderId: "165659589186",
  appId: "1:165659589186:web:14f35c3010b2e5600c0bdb",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth();
const user = auth.currentUser;

if(user) {
	console.log(user);
}
else {
	console.log("Not signed in. Attempting to sign in.")
	signInWithEmailAndPassword(auth, 'garrettmhainesspam@gmail.com', 'asdfasdf').then(cred => {
		console.log(cred.user);
		console.log("Signed in.");
	});
}

// Initialize Firestore
const db = getFirestore();
//const colRef = collection(db, 'books')
//getDocs(colRef)
//	.then((snapshot) => {
//		console.log(snapshot.docs)
//	})