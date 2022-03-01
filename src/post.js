const container = document.getElementById('container');

displayContent();

function displayContent() {
	const postElement = document.createElement('div');
	postElement.classList.add('block-content');
	
	postElement.innerHTML = `
		<p class="text">
				<iframe id="ytplayer" type="text/html" width="540" height="303.75"
					src="https://www.youtube.com/embed/hXaPGlkd5do?autoplay=1&fs=0&loop=1&modestbranding=1&playsinline=1&color=white&iv_load_policy=3"
					frameborder="0" allowfullscreen />
				
				Set the vibe in a flash.
				<br><br>
				This site is currently under construction.
				<br><br>
				
				Created by Hunter Cook and Garrett Haines.
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