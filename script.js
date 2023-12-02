function loadVideo() {
  var videoUrl = document.getElementById("videoUrl").value;
  var HLS = document.getElementById("HLS");
  var DASH = document.getElementById("DASH");
  var videoPlayer = document.getElementById("videoPlayer");
  if (videoUrl.trim() === "") {
    alert("Please enter a valid video URL.");
    return;
  }
  if (HLS.checked) {
    var video = document.createElement("video");
    video.className = "video video-js";
    video.controls = true;
    video.width = "100%";
    video.height = "100%";
    videoPlayer.innerHTML = "";
    videoPlayer.appendChild(video);

    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    }
  } else if (DASH.checked) {
    videoPlayer.innerHTML = `
    <video class="video video-js vjs-default-skin" controls width="100%" height="100%">
        <source src="${videoUrl}" type="application/dash+xml">
    </video>`;
    var player = videojs(videoPlayer.querySelector("video"));
    player.ready(function () {
      var playerInstance = this;
      dashjs.MediaPlayer().create().initialize(playerInstance, videoUrl, true);
    });
  } else if (videoUrl.search("youtube")!==-1) {
    const videoId = getYouTubeVideoId(videoUrl);
    console.log(videoId);
    videoPlayer.innerHTML = `
      <iframe class="video" width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  } else if (videoUrl.search("drive.google")!==-1) {
    var videoId = videoUrl.split("/").slice(-2, -1)[0];
    videoPlayer.innerHTML = `
      <iframe class="video" width="100%" height="100%" src="https://drive.google.com/file/d/${videoId}/preview" frameborder="0" allowfullscreen></iframe>`;
  } else {
    videoPlayer.innerHTML = `
      <video class="video" width="100%" height="100%" controls>
        <source src="${videoUrl}" type="video/mp4">
        <source src="${videoUrl}" type="video/webm">
        Your browser does not support HTML video.
      </video>`;
  }
}

function getYouTubeVideoId(url) {
  const queryString = url.split('?')[1];
  const queryParams = new URLSearchParams(queryString);
  const videoId = queryParams.get('v');
  return videoId;
}