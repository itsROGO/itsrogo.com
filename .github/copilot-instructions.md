<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Album Player Website - Copilot Instructions

This project is a specialized album release website with restricted audio playback functionality. Please keep the following context in mind when providing assistance:

## Project Purpose
- One-time album listening experience
- Restricted audio controls (play/pause only)
- Each track can only be played once
- No rewinding, fast-forwarding, or replaying
- Looping background video

## Key Restrictions to Maintain
- Users cannot replay tracks once they've been played
- No seeking/scrubbing functionality
- Prevent refresh/reload to bypass restrictions
- Disable developer tools access
- No right-click context menu
- Track play state persists in localStorage

## Technical Stack
- Vanilla JavaScript (ES6+)
- HTML5 Audio API
- CSS3 with modern features
- Vite for development server
- Local storage for play history persistence

## Security Considerations
- Multiple layers of restriction enforcement
- Keyboard shortcut prevention
- Context menu disabled
- Basic developer tools deterrents
- Play state tracking and persistence

## Code Style Guidelines
- Use modern JavaScript features
- Maintain clean, readable code
- Include comprehensive error handling
- Follow accessibility best practices where possible
- Keep security restrictions intact

When making suggestions or modifications, always consider the restrictive nature of this application and ensure that any changes maintain the one-time play limitation.
