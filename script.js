document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const audioPlayer = document.getElementById('audio-player');
    const playPauseIcon = document.getElementById('play-pause');
    const progressBar = document.getElementById('progress-bar');
    const shuffleButton = document.getElementById('shuffle');
    const previousButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const repeatButton = document.getElementById('repeat');
    
    let songIndex = 0;
    let isRepeat = false;
    let isShuffle = false;
    let songList = [];
    let shuffleList = [];
  
    // Initialize song list
    cards.forEach((card, index) => {
      songList.push({
        song: card.getAttribute('data-song'),
        title: card.getAttribute('data-title'),
        artist: card.getAttribute('data-artist'),
        card: card
      });
    });
  
    const playSong = (index) => {
      const song = songList[index];
      playerTitle.textContent = song.title;
      playerArtist.textContent = song.artist;
      audioPlayer.src = song.song;
      audioPlayer.play();
      playPauseIcon.textContent = 'pause';
    };
  
    const generateShuffleList = () => {
      shuffleList = [...songList];
      for (let i = shuffleList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleList[i], shuffleList[j]] = [shuffleList[j], shuffleList[i]];
      }
    };
  
    const getNextSongIndex = () => {
      if (isShuffle) {
        return songList.indexOf(shuffleList[(shuffleList.indexOf(songList[songIndex]) + 1) % shuffleList.length]);
      } else {
        return (songIndex + 1) % songList.length;
      }
    };
  
    const getPreviousSongIndex = () => {
      if (isShuffle) {
        return songList.indexOf(shuffleList[(shuffleList.indexOf(songList[songIndex]) - 1 + shuffleList.length) % shuffleList.length]);
      } else {
        return (songIndex - 1 + songList.length) % songList.length;
      }
    };
  
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        songIndex = index;
        playSong(songIndex);
      });
    });
  
    playPauseIcon.addEventListener('click', () => {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseIcon.textContent = 'pause';
      } else {
        audioPlayer.pause();
        playPauseIcon.textContent = 'play_arrow';
      }
    });
  
    audioPlayer.addEventListener('timeupdate', () => {
      progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    });
  
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const width = rect.width;
      const percent = offsetX / width;
      audioPlayer.currentTime = percent * audioPlayer.duration;
    });
  
    shuffleButton.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleButton.classList.toggle('active', isShuffle);
      shuffleButton.style.color = isShuffle ? 'red' : 'black';
      if (isShuffle) {
        generateShuffleList();
      }
    });
  
    previousButton.addEventListener('click', () => {
      songIndex = getPreviousSongIndex();
      playSong(songIndex);
    });
  
    nextButton.addEventListener('click', () => {
      songIndex = getNextSongIndex();
      playSong(songIndex);
    });
  
    repeatButton.addEventListener('click', () => {
      isRepeat = !isRepeat;
      repeatButton.style.color = isRepeat ? 'red' : 'black';
      repeatButton.classList.toggle('active', isRepeat);
    });
  
    audioPlayer.addEventListener('ended', () => {
      if (isRepeat) {
        playSong(songIndex);
      } else {
        songIndex = getNextSongIndex();
        playSong(songIndex);
      }
    });
  });