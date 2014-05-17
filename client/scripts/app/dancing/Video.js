define(["controller/Mediator", "data/Videos", "players/Players", "dancing/Thumbs"], function(Mediator, Videos, Players, Thumbs){
	var videoContainer = $("#VideoArena");

	var videoPlayer = videoContainer.find("video");
	var videoPlayerSource = videoContainer.find("source");

	var Dancers = {
		"A" : "Elijah",
		"B" : "Paulie",
		"C" : "Manolo",
	}

	var VoteLevel = {
		"-3" : "hate",
		"-2" : "hate",
		"-1" : "dislike",
		"0" : "like",
		"1" : "like",
		"2" : "love",
		"3" : "love",
	}

	function playVideo(url, bpm, videoBPM){
		//make a new video and source. 
		var newVid = $("<video>").appendTo(videoContainer);
		var newSource = $("<source>").appendTo(newVid);
		//set the source and attributes
		newSource[0].src = "../videos/" + url;
		newVid[0].load();
		newVid[0].playbackRate = bpm/videoBPM;
		newVid[0].loop = true;
		newVid[0].play();
		//fade it in
		newVid.fadeTo(1000, 1, function(){
			//set the video to the old one
			videoPlayer.remove();
			videoPlayer = newVid;
		});
		//fade out the old one
		videoContainer.fadeTo(0, 1000);
		//make it visible
		videoContainer.find("video").addClass("Visible");
	}

	function findVideo(dj, dancer, genre, likeLevel){
		for (var i = 0; i < Videos.length; i++){
			var vid = Videos[i];
			if (vid.avatars[1] === dancer && vid.avatars[0] === dj && vid.genre === genre){
				return vid;
			}
		}
		//otherwise pick a random video, there was no match
		return randomVideo();
	}

	function randomVideo (){
		console.log("returning random video");
		var index = parseInt(Math.random() * Videos.length, 10);
		return Videos[index];
	}

	Mediator.route("dancing/Song/clicked", function(song){
		var likeLevel = VoteLevel[Thumbs.getVote()];
		var dj = Dancers[Players.getDJ()];
		var dancer = Dancers[Players.getDancer()];
		var video = findVideo(dj, dancer, song.genre, likeLevel);
		playVideo(video.url, song.bpm, video.bpm);
	});

	Mediator.route("reset", function(){
		videoPlayer.pause();
		videoPlayerSource.src = "";
		videoContainer.find("video").removeClass("Visible");
	});
});