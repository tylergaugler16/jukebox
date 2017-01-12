

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
  document.querySelector('#playlist ul').addEventListener('click',function(e){
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

});

function JukeBox(jukebox, songs, src){
  this.jukebox    = jukebox;
  this.songs      = songs;
  this.src_index  = src;
  this.src        = songs[src];

  this.jukebox.setAttribute('src',this.src);

  this.play = function(){
    this.jukebox.play();
    document.getElementById('songNumber').innerHTML = this.src_index+1;
    startSongProgress();
  };
  this.pause = function(){
    this.jukebox.pause();
    document.getElementById('songProgress').addClass('paused');
  };
  this.next = function(){
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
    var seconds = Math.round(this.jukebox.duration)*1000;
    console.log(seconds);
    $('#songProgress').animate({right: '70%'}, seconds);
  };
}
