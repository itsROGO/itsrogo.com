# Album Player Website

A specialized web application for album releases with restricted playback functionality. Each track can only be played once, with no rewinding, fast-forwarding, or replaying capabilities.

## Features

### 🎵 Restricted Audio Player
- **One-time playback**: Each track can only be played once
- **Play/Pause only**: No seeking, scrubbing, or timeline control
- **No replay**: Once a track is finished, it cannot be played again
- **Persistent state**: Play history is saved and survives page refresh attempts

### 🎬 Visual Experience
- **Looping background video**: Atmospheric video background
- **Responsive design**: Works on desktop and mobile devices
- **Modern UI**: Clean, album-focused interface
- **Real-time progress**: Shows playback progress without user control

### 🔒 Security & Restrictions
- **Anti-refresh protection**: Warns users about losing unplayed tracks
- **Disabled developer tools**: Basic protection against tampering
- **No right-click**: Context menu disabled
- **Keyboard shortcuts blocked**: Prevents common bypass attempts

## Project Structure

```
album-player-website/
├── index.html          # Main HTML structure
├── style.css           # All styling and responsive design
├── main.js            # Core application logic
├── vite.config.js     # Vite configuration
├── package.json       # Dependencies and scripts
├── assets/            # Media files directory
│   ├── track1.mp3     # Audio track files
│   ├── track2.mp3     # (Replace with your tracks)
│   ├── track3.mp3
│   ├── track4.mp3
│   ├── track5.mp3
│   ├── background-video.mp4  # Background video
│   └── README.md      # Assets instructions
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Media Files
Replace the placeholder files in the `assets/` directory:
- Add your audio tracks as `track1.mp3`, `track2.mp3`, etc.
- Add your background video as `background-video.mp4`

### 3. Customize Track Information
Edit the `ALBUM_TRACKS` array in `main.js` to match your actual tracks:
```javascript
const ALBUM_TRACKS = [
  {
    id: 1,
    name: "Your Track Name",
    file: "./assets/track1.mp3",
    duration: "3:45"
  },
  // ... more tracks
];
```

### 4. Update Album Information
In `index.html`, update the album title and artist name:
```html
<h1 class="album-title">Your Album Title</h1>
<p class="album-artist">Artist Name</p>
```

## Development

### Start Development Server
```bash
npm run dev
```
Opens the application at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Creates optimized production files in the `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## File Format Requirements

### Audio Files
- **Format**: MP3 (recommended for best browser compatibility)
- **Quality**: 320kbps or lower for web delivery
- **Naming**: `track1.mp3`, `track2.mp3`, etc.

### Video File
- **Format**: MP4 with H.264 codec
- **Resolution**: 1920x1080 or lower
- **Compression**: Optimized for web streaming
- **Naming**: `background-video.mp4`

## Technical Details

### Browser Compatibility
- Modern browsers with HTML5 audio/video support
- JavaScript ES6+ features required
- Local storage for play history persistence

### Security Features
- Multiple layers of playback restrictions
- Basic developer tools deterrents
- Keyboard shortcut prevention
- Context menu disabled
- Play state persistence

### Restrictions Implementation
- **Local Storage**: Tracks play history for persistence
- **Audio API**: Controls playback without user timeline access
- **Event Prevention**: Blocks common bypass attempts
- **UI States**: Visual feedback for played/available tracks

## Customization

### Styling
The `style.css` file contains all styling. Key areas to customize:
- **Colors**: Update the gradient colors and theme
- **Fonts**: Change font families and sizes
- **Layout**: Modify responsive breakpoints
- **Animations**: Adjust transition effects

### Track Configuration
The `main.js` file contains the track configuration. You can:
- Add/remove tracks from the `ALBUM_TRACKS` array
- Modify track names and durations
- Update file paths if needed

### Security Level
You can adjust the restriction level by modifying:
- Keyboard shortcut prevention in `preventKeyboardShortcuts()`
- Developer tools detection sensitivity
- Context menu behavior
- Refresh prevention logic

## Deployment

### Static Hosting
This application can be deployed to any static hosting service:
- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Deploy from the `dist/` folder
- **Any web server**: Upload the `dist/` contents

### Domain Setup
For a custom domain:
1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your web server
3. Ensure proper MIME types for audio/video files
4. Configure HTTPS for security

## Troubleshooting

### Audio Not Playing
- Check if audio files are in the correct format (MP3)
- Verify file paths in the `ALBUM_TRACKS` array
- Ensure files are properly uploaded to the `assets/` directory

### Video Not Loading
- Confirm video file is named `background-video.mp4`
- Check video codec compatibility (H.264 recommended)
- Verify file size isn't too large for web delivery

### Restrictions Not Working
- Ensure JavaScript is enabled in the browser
- Check browser console for any errors
- Verify local storage is working properly

## License

This project is designed for album release purposes. Modify and distribute according to your needs.

## Support

For technical issues or customization help, refer to the code comments and the `.github/copilot-instructions.md` file for development guidelines.
