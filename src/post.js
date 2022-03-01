const container = document.getElementById('container');

displayContent();

function displayContent() {
	const postElement = document.createElement('div');
	postElement.classList.add('block-content');
	const videos = ["Aki1Xn36eJ8", "hXaPGlkd5do", "niG3YMU6jFk", "wycjnCCgUes", "2EIeUlvHAiM"];
	var randomVideo = videos[Math.floor(Math.random()*videos.length)];
	console.log(randomVideo);
	
	postElement.innerHTML = `
		<iframe id="ytplayer" type="text/html" width="540" height="303.75" style="border-radius: 5px;"
					src="https://www.youtube.com/embed/` + randomVideo +`?autoplay=1&mute=1&fs=0&loop=1&modestbranding=1&showinfo=0&autohide=1&playsinline=1&color=white&iv_load_policy=3"
					frameborder="0" allowfullscreen data-autoplay data-keepplaying></iframe>
		<p class="text" style="margin-bottom: -5px; text-align: center;">
				Set the vibe in a flash. This site is currently under construction.
				<br>
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