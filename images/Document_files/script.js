

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
  $jukebox.addEventListener('ended', function(){
    myJukeBox.next();
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
    myJukeBox.displayTime();
  });
  $jukebox.addEventListener('ended',function(){
    console.log("song ended");
    myJukeBox.resetPlayer();
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
  };
  this.next = function(){
    var userPlaylist = this.userPlaylist;
    if(this.userPlaylist.length===0){
      if(this.src_index == songs.length-1){
        this.src_index = 0;
        this.src = songs[this.src_index];
        this.jukebox.setAttribute('src',this.src);
        this.play();
      }
      else{
        this.src_index++;
        this.src = songs[this.src_index];
        this.jukebox.setAttribute('src',this.src);
        this.play();
      }
    }
    else{
      console.log("TYLER");
      console.log(this.userPlaylist.length);
      playUserPlaylist(this.userPlaylist);
    }

  };
  this.next1 = function(track){
    this.src_index = parseInt(track)-1;
    this.src = songs[this.src_index];
    this.jukebox.setAttribute('src',this.src);
    this.play();
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
  this.displayTime = function(){
     timer = setInterval(checkIfPaused, 1000);
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
        console.log(userPlaylist.length);
        if(jukebox.paused){
          playUserPlaylist(userPlaylist);
        }
      }
    });
  };
  this.resetPlayer = function(){
    $('#songProgress').removeProperty('right');
    $('#songProgress').animate({left: '0px'},'fast');
  };
  playUserPlaylist = function(userPlaylist){
    console.log("yeet");
    if(userPlaylist.length!==0){
      var nextSong = userPlaylist.pop();
      this.src = nextSong.url;
      document.getElementById('songNumber').innerHTML = nextSong.name;
      this.jukebox.setAttribute('src',this.src);
      this.jukebox.play();
      startSongProgress();
      setInterval(function(){
        $('#userPlaylist li').last().remove();
      },30000);

      console.log(this.jukebox);
    }
  };
  checkIfPaused = function(){
    console.log(this.jukebox.paused);
    if(this.jukebox.paused){
      console.log("yeeet");
      clearInterval(timer);
    }
    Totalseconds = Math.ceil(this.jukebox.currentTime);
    seconds = Totalseconds%60;
    minutes = Math.floor(Totalseconds/60);
    console.log(minutes+":"+seconds);
    console.log(Totalseconds);
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
    $('#songProgress').animate({right: '0px'}, seconds);
  };

}
