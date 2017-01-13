

$(document).ready(function(){
  var $jukebox = document.getElementById('jukebox');
  var songs = ["audio/audio1.mp3","audio/audio2.mp3","audio/audio3.mp3","audio/audio4.mp3","audio/audio5.mp3",
                "audio/audio6.mp3","audio/audio7.mp3","audio/audio8.mp3","audio/audio9.mp3","audio/audio10.mp3"];
  var myJukeBox = new JukeBox($jukebox, songs, 0);
  document.getElementById('playButton').addEventListener('click',function(){
    myJukeBox.play();
  });
  document.getElementById('pauseButton').addEventListener('click',function(){
    myJukeBox.pause();
  });
  $jukebox.addEventListener('ended', function(e){
    console.log(e.target.src);
    e.preventDefault();
    myJukeBox.next();
    var songJustFinished = e.target.src;
    myJukeBox.resetPlayer(songJustFinished);
  });
  document.getElementById('next').addEventListener('click',function(){
    myJukeBox.next();
  });
  document.getElementById('back').addEventListener('click',function(){
    myJukeBox.back();
  });
  document.querySelector('#playlist #defaultPlaylist').addEventListener('click',function(e){
    myJukeBox.next1(e.target.id);
  });
  document.getElementById('playlistButton').addEventListener('click',function(){
    playlist = document.getElementById('playlist');
    if(playlist.style.display == 'block'){
        playlist.style.display = 'none';
    }
    else{
      playlist.style.display = 'block';
    }
  });
  $jukebox.addEventListener('playing', function(){
    var timer;
    myJukeBox.displayTime(timer);
  });

  document.getElementById('addToPlaylist').addEventListener('click', function(){
    var track = prompt('Name of the song you would like to add: ');
    myJukeBox.addToUserPlaylist(track);
  });

});

function JukeBox(jukebox, songs, src){
  this.jukebox      = jukebox;
  this.songs        = songs;
  this.src_index    = src;
  this.src          = songs[src];
  this.userPlaylist = [];

  this.jukebox.setAttribute('src',this.src);

  this.play = function(){
    this.jukebox.play();
    if(this.userPlaylist.length===0){
      document.getElementById('songNumber').innerHTML = this.src_index+1;
    }
    startSongProgress();
  };
  this.pause = function(){
    this.jukebox.pause();
    $('#songProgress').addClass('paused');
    // checkIfPaused();
  };
  this.next = function(){
    console.log("in next() function");
    var userPlaylist = this.userPlaylist;
    if(this.userPlaylist.length===0){
      if(this.src_index == songs.length-1){
        this.src_index = 0;
        this.src = songs[this.src_index];
        this.jukebox.setAttribute('src',this.src);
        this.play();
        startSongProgress();
      }
      else{
        this.src_index++;
        this.src = songs[this.src_index];
        this.jukebox.setAttribute('src',this.src);
        this.play();
        startSongProgress();
      }
    }
    else{
      playUserPlaylist(this.userPlaylist);
    }

  };
  this.next1 = function(track){
    this.src_index = parseInt(track)-1;
    this.src = songs[this.src_index];
    this.jukebox.setAttribute('src',this.src);
    this.play();
    startSongProgress();
  };
  this.back = function(){
    if(this.src_index === 0){
      this.src_index = this.songs.length-1;
    }
    else{
      this.src_index--;
    }
    this.src = songs[this.src_index];
    this.jukebox.setAttribute('src',this.src);
    this.play();
  };

  this.displayTime = function(timer){
     timer = setInterval(function(){
       checkIfPaused(timer);
     }, 1000);
  };
  this.addToUserPlaylist = function(track){
    var userPlaylist = this.userPlaylist;
    var jukebox = this.jukebox;
    $.ajax({
      url: "https://api.spotify.com/v1/search",
      data: {
        q: track,
        type: 'track'
      },
      success: function(response){
        console.log(userPlaylist);
        var preview_url = response.tracks.items[0].preview_url;
        var name = response.tracks.items[0].name;
        $('#userPlaylist').prepend("<li id=\'"+preview_url+"\'>"+name+"</li>");

        userPlaylist.push({url: preview_url, name: name});
        // console.log(userPlaylist.length);
        if(jukebox.paused){
          playUserPlaylist(userPlaylist);
        }
      }
    });
  };
  this.resetPlayer = function(songJustFinished){
    $('#userPlaylist li').last().remove();
    $('#songProgress').removeClass('paused');
    // $('#songProgress').css('left','');
    document.getElementById('songProgress').setAttribute('style','left:0px');
    $('#songProgress').animate({left: '0px'},'fast');
    // console.log("yup, i resetted");
    // this.next();
  };
  playUserPlaylist = function(userPlaylist){
    // console.log("yeet");
    if(userPlaylist.length!==0){
      var nextSong = userPlaylist.pop();
      this.src = nextSong.url;
      document.getElementById('songNumber').innerHTML = nextSong.name;
      this.jukebox.setAttribute('src',this.src);
      this.jukebox.play();
      startSongProgress();
    }
  };
  checkIfPaused = function(timer){
    // console.log("checking to see if paused");
    if(this.jukebox.paused){
      console.log("yeeet");
      clearInterval(timer);
    }
    Totalseconds = Math.ceil(this.jukebox.currentTime);
    seconds = Totalseconds%60;
    minutes = Math.floor(Totalseconds/60);
    // console.log(minutes+":"+seconds);
    // console.log(Totalseconds);
    document.getElementById('currentTime').innerHTML = "0"+minutes+":"+seconds;
  };
  startSongProgress = function(){
    console.log(this.jukebox.duration*1000);
    var seconds;
    if(this.jukebox.duration){
      seconds = Math.round(this.jukebox.duration)*1000;
    }
    else{
      seconds = 30000;
    }
    console.log("DURATION:: "+seconds);

    console.log(seconds);
    $('#songProgress').removeProp('left');
    $('#songProgress').animate({left: '400px'}, seconds);
  };

}
