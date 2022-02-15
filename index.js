const container = document.getElementById('container');

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4L71q-5qsAD2RbzYkPI8S66t1-gPmLlc",
  authDomain: "milkywaymedium.firebaseapp.com",
  databaseURL: "https://milkywaymedium-default-rtdb.firebaseio.com",
  projectId: "milkywaymedium",
  storageBucket: "milkywaymedium.appspot.com",
  messagingSenderId: "165659589186",
  appId: "1:165659589186:web:14f35c3010b2e5600c0bdb",
  measurementId: "G-WGKXQT89RQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


displayContent();

function displayContent() {
	const postElement = document.createElement('div');
	postElement.classList.add('block-content');
	
	postElement.innerHTML = `
		<h2 class="title">Welcome to the Milky Way Medium</h2>
		<p class="text">
				Set the vibe in a flash.
				<br><br>
				
				This site is currently under construction.
				<br><br>
				
				Created by Hunter Cook and Garrett Haines.
				<br>
				A division of Cook Labs.
		</p>
		
	`;
	
	container.appendChild(postElement);
}


function getRandomNr() {
	return Math.floor(Math.random() * 100) + 1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}