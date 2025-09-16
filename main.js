// Generate a unique device fingerprint
function generateDeviceFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

const DEVICE_ID = generateDeviceFingerprint();

// Album tracks configuration
const ALBUM_TRACKS = [
  {
    id: 1,
    name: "Faster Faster",
    file: "./assets/track1_fasterfaster.wav",
    duration: "3:10"
  },
  {
    id: 2,
    name: "Sonora",
    file: "./assets/track2_sonora.wav",
    duration: "4:51"
  },
  {
    id: 3,
    name: "Shame",
    file: "./assets/track3_shame.wav",
    duration: "1:48"
  },
  {
    id: 4,
    name: "Hey Beautiful",
    file: "./assets/track4_heybeautiful.wav",
    duration: "3:15"
  },
  {
    id: 5,
    name: "No Fair",
    file: "./assets/track5_nofair.wav",
    duration: "3:17"
  },
  {
    id: 6,
    name: "Creeping",
    file: "./assets/track6_creeping.wav",
    duration: "3:24"
  },
  {
    id: 7,
    name: "Cinema",
    file: "./assets/track7_cinema.wav",
    duration: "3:15"
  },
  {
    id: 8,
    name: "Teenage Stars in Horror Movies",
    file: "./assets/track8_teenagestars.wav",
    duration: "4:00"
  },
  {
    id: 9,
    name: "Rainbow Basin",
    file: "./assets/track9_rainbowbasin.wav",
    duration: "3:28"
  },
  {
    id: 10,
    name: "Wanna Be Seen",
    file: "./assets/track10_wannabeseen.wav",
    duration: "3:47"
  },
  {
    id: 11,
    name: "Tattoos",
    file: "./assets/track11_tattoos.wav",
    duration: "3:12"
  },
  {
    id: 12,
    name: "We Are",
    file: "./assets/track12_weare.wav",
    duration: "3:06"
  },
  {
    id: 13,
    name: "Matter of the Heart",
    file: "./assets/track13_matteroftheheart.wav",
    duration: "2:43"
  },
  {
    id: 14,
    name: "Gun Shy",
    file: "./assets/track14_gunshy.wav",
    duration: "2:25"
  },
  {
    id: 15,
    name: "Everything is Easy",
    file: "./assets/track15_everythingiseasy.wav",
    duration: "2:28"
  }
];

// Application state
let currentTrack = null;
let isPlaying = false;
let playedTracks = new Set();
let chamberTrack = null; // Track currently in the play chamber
let audioPlayer = null;
let playPauseBtn = null;
let progressFill = null;
let currentTimeEl = null;
let durationEl = null;
let currentTrackEl = null;
let trackStatusEl = null;
let chamberSlot = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupEventListeners();
  renderTracklist();
  loadStoredPlayHistory();
});

function initializeElements() {
  audioPlayer = document.getElementById('audioPlayer');
  playPauseBtn = document.getElementById('playPauseBtn');
  progressFill = document.getElementById('progressFill');
  currentTimeEl = document.getElementById('currentTime');
  durationEl = document.getElementById('duration');
  currentTrackEl = document.getElementById('currentTrack');
  trackStatusEl = document.getElementById('trackStatus');
  chamberSlot = document.getElementById('chamberSlot');
}

function setupEventListeners() {
  // Play/Pause button
  playPauseBtn.addEventListener('click', togglePlayPause);
  
  // Audio player events
  audioPlayer.addEventListener('loadedmetadata', onAudioLoaded);
  audioPlayer.addEventListener('timeupdate', onTimeUpdate);
  audioPlayer.addEventListener('ended', onTrackEnded);
  audioPlayer.addEventListener('error', onAudioError);
  
  // Prevent context menu and keyboard shortcuts that could bypass restrictions
  document.addEventListener('contextmenu', preventContextMenu);
  document.addEventListener('keydown', preventKeyboardShortcuts);
  
  // Prevent refresh and navigation
  window.addEventListener('beforeunload', preventRefresh);
  
  // Prevent developer tools (basic deterrent)
  document.addEventListener('keydown', preventDevTools);
}

function renderTracklist() {
  const trackList = document.getElementById('trackList');
  trackList.innerHTML = '';
  
  ALBUM_TRACKS.forEach(track => {
    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.dataset.trackId = track.id;
    
    const isPlayed = playedTracks.has(track.id);
    const isInChamber = chamberTrack && chamberTrack.id === track.id;
    const isCurrentTrack = currentTrack && currentTrack.id === track.id;
    
    if (isPlayed) {
      trackItem.classList.add('played');
    }
    
    if (isInChamber) {
      trackItem.classList.add('empty-slot');
    }
    
    if (isCurrentTrack && isPlaying) {
      trackItem.classList.add('playing');
    }
    
    if (!isInChamber) {
      trackItem.innerHTML = `
        <div class="track-info">
          <div class="track-name">${track.name}</div>
          <div class="track-duration">${track.duration}</div>
        </div>
        <div class="track-status ${isPlayed ? 'played' : (isCurrentTrack && isPlaying ? 'playing' : '')}">
          ${isPlayed ? 'But only once' : (isCurrentTrack && isPlaying ? 'Playing' : 'Free to play')}
        </div>
      `;
    }
    
    // Add click listener only if track hasn't been played and is not in chamber
    if (!isPlayed && !isInChamber) {
      trackItem.addEventListener('click', () => selectTrack(track));
    }
    
    trackList.appendChild(trackItem);
  });
}

function selectTrack(track) {
  // Check if track has already been played
  if (playedTracks.has(track.id)) {
    showNotification('This track has already been played and cannot be played again.');
    return;
  }
  
  // Stop current track if playing
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayPauseIcon();
  }
  
  // If there's already a track in the chamber, return it to the tracklist
  if (chamberTrack && chamberTrack.id !== track.id) {
    returnTrackToTracklist(chamberTrack);
  }
  
  // Move the selected track to the chamber
  moveTrackToChamber(track);
}

function togglePlayPause() {
  if (!chamberTrack) {
    showNotification('Please select a track first.');
    return;
  }
  
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    trackStatusEl.textContent = 'Paused';
    updatePlayPauseIcon();
  } else {
    audioPlayer.play()
      .then(() => {
        isPlaying = true;
        trackStatusEl.textContent = 'Playing';
        updatePlayPauseIcon();
        
        // Mark track as played immediately when it starts
        playedTracks.add(chamberTrack.id);
        savePlayHistory();
        renderTracklist();
      })
      .catch(error => {
        console.error('Playback failed:', error);
        showNotification('Playback failed. Please try again.');
        updatePlayPauseIcon();
      });
  }
}

function updatePlayPauseIcon() {
  const playIcon = playPauseBtn.querySelector('.play-icon');
  const pauseIcon = playPauseBtn.querySelector('.pause-icon');
  
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline-block';
  } else {
    playIcon.style.display = 'inline-block';
    pauseIcon.style.display = 'none';
  }
}

function onAudioLoaded() {
  const duration = audioPlayer.duration;
  durationEl.textContent = formatTime(duration);
}

function onTimeUpdate() {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  
  if (duration) {
    const progress = (currentTime / duration) * 100;
    progressFill.style.width = progress + '%';
  }
  
  currentTimeEl.textContent = formatTime(currentTime);
}

function onTrackEnded() {
  isPlaying = false;
  updatePlayPauseIcon();
  
  // Reset progress
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  
  // Update status
  trackStatusEl.textContent = 'Track completed';
  
  // Clear the chamber since the track is finished
  clearChamber();
  
  // Update tracklist display
  renderTracklist();
  
  showNotification('Track finished. You cannot replay this track.');
}

function onAudioError(e) {
  console.error('Audio error:', e);
  showNotification('Audio file could not be loaded. Please check if the file exists.');
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Security and restriction functions
function preventContextMenu(e) {
  e.preventDefault();
  return false;
}

function preventKeyboardShortcuts(e) {
  // Prevent common browser shortcuts that could bypass restrictions
  if (
    e.keyCode === 123 || // F12
    (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
    (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
    (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
    (e.ctrlKey && e.keyCode === 82) || // Ctrl+R (refresh)
    (e.keyCode === 116) || // F5 (refresh)
    (e.ctrlKey && e.keyCode === 87) || // Ctrl+W (close tab)
    (e.ctrlKey && e.keyCode === 78) || // Ctrl+N (new window)
    (e.ctrlKey && e.keyCode === 84) // Ctrl+T (new tab)
  ) {
    e.preventDefault();
    showNotification('This action is not allowed.');
    return false;
  }
}

function preventRefresh(e) {
  if (playedTracks.size > 0) {
    e.preventDefault();
    e.returnValue = 'If you refresh or leave this page, you will lose access to tracks you haven\'t played yet.';
    return e.returnValue;
  }
}

function preventDevTools(e) {
  if (e.keyCode === 123) {
    e.preventDefault();
    showNotification('Developer tools are disabled.');
    return false;
  }
}

// Local storage functions for play history
function savePlayHistory() {
  try {
    const playHistory = Array.from(playedTracks);
    const data = JSON.stringify(playHistory);
    const deviceData = JSON.stringify({ deviceId: DEVICE_ID, playHistory });
    
    // Store in multiple places for persistence
    localStorage.setItem('albumPlayHistory', data);
    localStorage.setItem('albumPlayHistory_device', deviceData);
    sessionStorage.setItem('albumPlayHistory', data);
    
    // Create a persistent cookie (lasts 1 year)
    document.cookie = `albumPlayHistory=${encodeURIComponent(data)};max-age=31536000;path=/`;
    document.cookie = `albumDeviceId=${DEVICE_ID};max-age=31536000;path=/`;
    
    console.log('Play history saved for device:', DEVICE_ID);
  } catch (error) {
    console.error('Could not save play history:', error);
  }
}

function loadStoredPlayHistory() {
  try {
    let playHistory = null;
    
    // Try multiple storage sources
    const sources = [
      localStorage.getItem('albumPlayHistory'),
      sessionStorage.getItem('albumPlayHistory'),
      getCookie('albumPlayHistory')
    ];
    
    // Use the first available source
    for (const source of sources) {
      if (source) {
        try {
          playHistory = JSON.parse(decodeURIComponent(source));
          break;
        } catch (e) {
          continue;
        }
      }
    }
    
    // Check device consistency
    const storedDeviceId = getCookie('albumDeviceId');
    if (storedDeviceId && storedDeviceId !== DEVICE_ID) {
      console.log('Device mismatch detected, keeping play history');
      // Keep the play history even if device changed
    }
    
    if (playHistory) {
      playedTracks = new Set(playHistory);
      renderTracklist();
      console.log('Loaded play history for device:', DEVICE_ID);
    }
  } catch (error) {
    console.error('Could not load play history:', error);
  }
}

// Helper function to get cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Additional security measures
(function() {
  // Disable common debugging methods
  const devtools = {
    open: false,
    orientation: null
  };
  
  const threshold = 160;
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        showNotification('Please close developer tools to continue.');
      }
    } else {
      devtools.open = false;
    }
  }, 500);
})();

// Disable drag and drop
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
});

// Disable text selection
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
});

// Chamber system functions
function moveTrackToChamber(track) {
  const trackItem = document.querySelector(`[data-track-id="${track.id}"]`);
  if (!trackItem) return;
  
  // Get positions for animation
  const trackRect = trackItem.getBoundingClientRect();
  const chamberRect = chamberSlot.getBoundingClientRect();
  
  // Clone the track element for animation
  const movingTrack = trackItem.cloneNode(true);
  movingTrack.classList.add('moving');
  movingTrack.style.position = 'fixed';
  movingTrack.style.top = trackRect.top + 'px';
  movingTrack.style.left = trackRect.left + 'px';
  movingTrack.style.width = trackRect.width + 'px';
  movingTrack.style.height = '60px';
  movingTrack.style.zIndex = '1000';
  
  // Add to body for animation
  document.body.appendChild(movingTrack);
  
  // Animate to chamber
  setTimeout(() => {
    movingTrack.style.top = chamberRect.top + 'px';
    movingTrack.style.left = chamberRect.left + 'px';
    movingTrack.style.width = chamberRect.width + 'px';
    movingTrack.style.height = '60px';
    movingTrack.style.borderRadius = '15px';
  }, 50);
  
  // Complete the move after animation
  setTimeout(() => {
    // Set chamber state
    chamberTrack = track;
    currentTrack = track;
    
    // Setup audio
    audioPlayer.src = track.file;
    
    // Update UI
    currentTrackEl.textContent = track.name;
    trackStatusEl.textContent = 'Free to play';
    playPauseBtn.disabled = false;
    
    // Update chamber UI
    chamberSlot.classList.add('has-track');
    chamberSlot.innerHTML = `
      <div class="track-info">
        <div class="track-name">${track.name}</div>
        <div class="track-duration">${track.duration}</div>
      </div>
    `;
    
    // Remove moving element
    movingTrack.remove();
    
    // Update tracklist
    renderTracklist();
    updatePlayPauseIcon();
  }, 650);
}

function returnTrackToTracklist(track) {
  const chamberRect = chamberSlot.getBoundingClientRect();
  const targetTrackItem = document.querySelector(`[data-track-id="${track.id}"]`);
  
  if (!targetTrackItem) return;
  
  const targetRect = targetTrackItem.getBoundingClientRect();
  
  // Create moving element from chamber
  const movingTrack = document.createElement('div');
  movingTrack.className = 'track-item moving';
  movingTrack.innerHTML = `
    <div class="track-info">
      <div class="track-name">${track.name}</div>
      <div class="track-duration">${track.duration}</div>
    </div>
    <div class="track-status">Free to play</div>
  `;
  
  movingTrack.style.position = 'fixed';
  movingTrack.style.top = chamberRect.top + 'px';
  movingTrack.style.left = chamberRect.left + 'px';
  movingTrack.style.width = chamberRect.width + 'px';
  movingTrack.style.height = '60px';
  movingTrack.style.zIndex = '1000';
  
  document.body.appendChild(movingTrack);
  
  // Animate back to tracklist
  setTimeout(() => {
    movingTrack.style.top = targetRect.top + 'px';
    movingTrack.style.left = targetRect.left + 'px';
    movingTrack.style.width = targetRect.width + 'px';
    movingTrack.style.height = '60px';
    movingTrack.style.borderRadius = '10px';
  }, 50);
  
  // Complete the return
  setTimeout(() => {
    movingTrack.remove();
    renderTracklist();
  }, 650);
}

function clearChamber() {
  chamberTrack = null;
  currentTrack = null;
  
  // Reset chamber UI
  chamberSlot.classList.remove('has-track');
  chamberSlot.innerHTML = '<div class="chamber-placeholder">Click a track to load it here</div>';
  
  // Reset player UI
  currentTrackEl.textContent = 'Select a track to play';
  trackStatusEl.textContent = 'Free to play';
  playPauseBtn.disabled = true;
  
  // Clear audio
  audioPlayer.src = '';
}

// Export for potential testing (remove in production)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ALBUM_TRACKS,
    selectTrack,
    togglePlayPause,
    formatTime,
    moveTrackToChamber,
    returnTrackToTracklist,
    clearChamber
  };
}
