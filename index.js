const container = document.getElementById('container');
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