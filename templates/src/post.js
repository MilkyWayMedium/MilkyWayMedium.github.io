const container = document.getElementById('container');

displayContent();

function displayContent() {
	//const postElement = document.getElementById('ytplayer');
//	const videos = ["Aki1Xn36eJ8", "hXaPGlkd5do", "niG3YMU6jFk", "wycjnCCgUes", "2EIeUlvHAiM", "hXaPGlkd5do"];
//	var randomVideo = videos[Math.floor(Math.random() * videos.length)];
	//console.log(randomVideo);
//
//	postElement.src = "https://www.youtube.com/embed/` + randomVideo +`?autoplay=1&mute=1&fs=0&loop=1&modestbranding=1&showinfo=0&autohide=1&playsinline=1&color=white&iv_load_policy=3"

}


function getRandomNr() {
	return Math.floor(Math.random() * 100) + 1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}