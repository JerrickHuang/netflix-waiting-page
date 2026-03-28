# Netflix Waiting Page

A Netflix-style server maintenance waiting page built with HTML, CSS, and JavaScript.

## Project Purpose

Simulates a streaming platform downtime experience with Netflix's visual identity, turning an otherwise frustrating wait into something interactive and entertaining.

## Features

### Visual
- Netflix-style dark UI with floating red particle background
- NETFLIX logo with pulsing red glow animation
- Animated bouncing popcorn row
- Scan-line overlay for a cinematic feel

### Countdown
- Flip-card style countdown timer (MM:SS)
- Rotating humorous server status messages every 12 seconds
- Auto-reloads the page when the countdown reaches zero

### Loading Progress
- Animated progress bar that fills over 60 seconds

### Interactions
- **Popcorn row**: Click any 🍿 to make it explode 💥
- **Mini runner game**: Click the game canvas or press `Space` to make the server jump over obstacles — speed increases over time
- **Easter egg button**: Click "🔍 找找彩蛋" to reveal rotating hidden messages
- **Konami Code**: Type ↑ ↑ ↓ ↓ ← → ← → B A for a secret effect
- **Next Episode button**: Click to trigger a loading response
- **Toast notifications**: Pop-up feedback for all interactive events

### Message System
- Typewriter-style rotating status messages every 5 seconds
- 9 humorous messages in the rotation pool

## Technologies Used

- HTML5 (Canvas API for particles and game)
- CSS3 (keyframe animations, transitions)
- Vanilla JavaScript (no dependencies)

## File Structure
```
netflix-waiting-page/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

Open `index.html` in any modern browser — no build step or server required.

## Author

Created for Web Frontend Assignment