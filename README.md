# ⭐ Star Wars Galaxy Game ⭐

An advanced HTML5 canvas-based space shooter game featuring multiple difficulty levels, power-ups, enemy types, and progressive ship upgrades. Battle through waves of hostile aliens, collect power-ups, and survive as long as possible in this action-packed space adventure!

![Star Wars Game](https://github.com/user-attachments/assets/e72b3b0a-5030-4c7e-ae91-49b3949eb2b6)

## 🎮 Game Features

### Core Gameplay
- **4 Difficulty Levels**: Easy, Normal, Hard, and Expert modes with adjustable enemy counts and shooting frequencies
- **25 Progressive Levels**: Increasing challenge with faster enemies and more aggressive waves
- **Lives System**: Start with 3 lives, earn up to 5 lives with power-ups
- **Smooth Controls**: Enhanced mouse interpolation for fluid movement
- **Pause Functionality**: Press 'P' to pause/resume the game anytime

### Enemy Types & Obstacles
- **Basic Red Alien Ships** (Type 1): Standard enemies that chase you down
- **Advanced Green Alien Ships** (Type 2): Can shoot projectiles at your ship
- **Elite Purple Alien Ships** (Type 3): Faster movement, triple-shot attacks
- **Solid Planets**: Various colored planets that block bullets (brown, blue, red, gold, gray)

### Combat & Weapons
- **Standard Laser**: Single green laser beam
- **Burst Mode**: Fire 3 bullets in quick succession
- **Multi-Directional Gun**: Spread fire in 5 directions simultaneously
- **Enemy Fire**: Advanced aliens shoot back with single and spread patterns

### Power-Ups
- **1UP (Green)**: Extra life (max 5 lives)
- **Burst Mode (Purple)**: 10 seconds of triple-shot
- **Multi-Gun (Cyan)**: 15 seconds of 5-way spread fire
- **Shield (Yellow)**: 8 seconds of invincibility
- **Speed Boost (Orange)**: 12 seconds of faster movement
- Power-ups worth +500 points each

### Ship Progression
- **Level 1-7**: Basic white triangular fighter
- **Level 8-14**: Advanced blue pentagon spacecraft
- **Level 15+**: Elite golden hexagonal battleship

### Scoring & Persistence
- **Survival Points**: Continuous score increase over time
- **Enemy Kills**: +100 points per alien destroyed
- **Power-Up Bonus**: +500 points per power-up collected
- **High Score**: Automatically saved to browser localStorage
- **Level Progression**: New level every 10,000 points

## 🚀 How to Play

### Controls

- **Arrow Keys** (← →) or **Mouse Movement**: Move your ship left and right
- **SPACEBAR** or **Mouse Click**: Fire laser beams at alien ships
- **P Key**: Pause/Resume the game
- **1-4 Keys** (on intro screen): Select difficulty (1=Easy, 2=Normal, 3=Hard, 4=Expert)
- **SPACE/Click**: Start game or restart after game over

### Objective

1. **Survive** as long as possible while avoiding aliens and enemy fire
2. **Destroy** alien ships to increase your score and clear the path
3. **Collect** power-ups to enhance your abilities
4. **Progress** through 25 levels with increasing difficulty
5. **Achieve** the highest score and save it for future sessions

### Scoring Strategy

- **Survival Focus**: Stay alive to accumulate continuous points
- **Aggressive Play**: Hunt aliens for +100 point bonuses
- **Power-Up Collection**: Grab all power-ups for +500 points and enhanced abilities
- **Shield Usage**: Protect your lives with shield power-ups during intense moments
- **Level Milestones**: Reach higher levels for ship upgrades and bragging rights

## 📦 Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Setup Instructions

1. **Clone or download this repository**:
   ```bash
   git clone https://github.com/sonwal/starwars.git
   cd starwars
   ```

2. **That's it!** The game uses vanilla JavaScript and requires no build process or dependencies to install.

## 🎯 How to Run

### Method 1: Direct File Opening
Simply double-click `space.html` in your file browser, and it will open in your default web browser.

### Method 2: Using a Local Web Server (Recommended)

Using a local web server ensures all resources load correctly.

**Python 3** (if installed):
```bash
python -m http.server 8080
```
Then open your browser and navigate to: `http://localhost:8080/space.html`

**Python 2** (if installed):
```bash
python -m SimpleHTTPServer 8080
```
Then open your browser and navigate to: `http://localhost:8080/space.html`

**Node.js** (if installed):
```bash
npx http-server -p 8080
```
Then open your browser and navigate to: `http://localhost:8080/space.html`

**PHP** (if installed):
```bash
php -S localhost:8080
```
Then open your browser and navigate to: `http://localhost:8080/space.html`

## 🛠️ Technologies Used

- **HTML5**: Structure and canvas element
- **JavaScript (ES5)**: Game logic and mechanics
- **jQuery 3.2.1**: DOM manipulation and event handling
- **jCanvas**: Canvas drawing library for easy graphics rendering
- **HTML5 Canvas API**: 2D graphics rendering

## 📁 Project Structure

```
starwars/
│
├── space.html              # Main HTML file
├── space.js                # Game logic and mechanics
├── jquery-3.2.1.min.js     # jQuery library
├── jcanvas.min.js          # jCanvas library
└── README.md               # This file
```

## 🎨 Game Elements

### Player Ships (3 Types)
- **Type 1** (Levels 1-7): White triangular fighter with thrusters
- **Type 2** (Levels 8-14): Blue pentagon spacecraft with enhanced thrusters
- **Type 3** (Levels 15+): Golden hexagonal elite battleship

### Alien Ships (3 Types)
- **Type 1 (Red Diamond)**: Basic enemy, moves straight down
- **Type 2 (Green Pentagon)**: Advanced enemy with single-shot capability
- **Type 3 (Purple Hexagon)**: Elite enemy with triple-shot spread attack

### Solid Planets (5 Types)
- Brown, Blue, Red, Gold, and Gray planets that block projectiles
- Add strategic obstacles to gameplay
- Cannot be destroyed by player bullets

### Power-Ups (5 Types)
- **1UP (Green circle with +)**: Extra life
- **Burst (Purple circle with B)**: Triple-shot mode
- **Multi (Cyan circle with M)**: 5-way spread gun
- **Shield (Yellow circle with S)**: Temporary invincibility
- **Speed (Orange circle with V)**: Movement boost

### Visual Effects
- Green laser beams with glow effects for player
- Red projectiles for enemy fire
- Multi-colored explosion animations (red, orange, yellow)
- Level-up notifications
- Life lost warnings
- Pause screen overlay
- Star Wars themed color palette

## 🎯 Game Mechanics

- **Collision Detection**: Advanced circular collision detection for all entities
- **Difficulty Scaling**: 4 difficulty presets affecting speed, enemy count, and fire rate
- **Progressive Difficulty**: Speed and enemy waves increase with each level
- **Smooth Animation**: 60 FPS game loop for fluid gameplay
- **Smooth Mouse Movement**: Interpolated mouse tracking for precise control
- **Enemy AI**: Shooting aliens track player position and fire at intervals
- **Power-Up System**: Timed power-ups with visual indicators
- **Lives System**: Respawn with temporary invincibility after taking damage
- **Enemy Spawning**: Dynamic generation with collision prevention
- **High Score Persistence**: Saves to browser localStorage automatically

## 🏆 Tips & Strategy

### Beginner Tips
1. **Start on Easy**: Learn the mechanics before ramping up difficulty
2. **Keep Moving**: Constant motion makes you harder to hit
3. **Collect Power-Ups**: Always prioritize green (1UP) power-ups
4. **Use Shield Wisely**: Save shield power-ups for dense enemy waves

### Advanced Strategies
1. **Burst Mode Timing**: Use burst mode when multiple enemies are lined up
2. **Multi-Gun Usage**: Best for clearing large waves quickly
3. **Planet Cover**: Use solid planets as shields against enemy fire
4. **Level Awareness**: Know when your ship upgrades (levels 8 and 15)
5. **Score Maximization**: Balance survival with aggressive alien hunting

### Expert Mode
1. **Anticipate Fire**: Elite enemies shoot spread patterns - dodge early
2. **Power-Up Chaining**: Stack multiple power-ups for maximum effect
3. **Edge Control**: Master edge movements to avoid getting cornered
4. **Bullet Management**: Don't spam - make every shot count
5. **Marathon Play**: Game balanced for 2+ hours of continuous gameplay

## 🎯 System Requirements

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Minimum screen resolution: 1024x768
- Keyboard and mouse/trackpad for controls
- ~5MB of free disk space for localStorage

## 🔮 Implemented Features

All major features from the enhancement request have been successfully implemented:

✅ **Difficulty Levels**: 4 difficulty settings (Easy, Normal, Hard, Expert)
✅ **Speed Increases**: Progressive speed scaling up to level 25
✅ **Solid Planets**: 5 types of indestructible planet obstacles
✅ **Multiple Alien Types**: 3 different alien ships with unique behaviors
✅ **Enemy Shooting**: Type 2 and Type 3 aliens can fire at the player
✅ **Power-Ups**: 5 different power-ups including 1UP, Burst, Multi-gun, Shield, and Speed
✅ **Burst Mode**: Triple-shot firing capability
✅ **Multi-Directional Gun**: 5-way spread fire
✅ **Lives System**: 3 starting lives, collectible 1UPs up to 5 lives
✅ **Respawn System**: Continue from same position with temporary invincibility
✅ **Ship Progression**: 3 different ship designs at levels 1, 8, and 15
✅ **Smooth Mouse Movement**: Interpolated mouse tracking for fluid control
✅ **High Score**: Persistent high score saved in localStorage
✅ **Pause Functionality**: Press P to pause/resume gameplay
✅ **Professional Polish**: 2+ hours of balanced gameplay

## 📝 Game Balance

The game has been carefully balanced for extended play sessions:

- **Easy Mode**: Perfect for learning, slower enemies, less shooting (0.7x multiplier)
- **Normal Mode**: Balanced gameplay for casual players (1.0x baseline)
- **Hard Mode**: Challenging with faster enemies and more aggression (1.3x multiplier)
- **Expert Mode**: Maximum difficulty for skilled players (1.6x multiplier)

Level progression is designed to provide 2+ hours of engaging gameplay with gradual difficulty increases every 10,000 points.

## 📝 License

This is a personal project. Feel free to fork, modify, and use it for learning purposes.

## 📝 License

This is a personal project. Feel free to fork, modify, and use it for learning purposes.

## 👨‍💻 Author

Built as a fun HTML5 Canvas game project demonstrating JavaScript game development fundamentals.

## 🙏 Acknowledgments

- Star Wars franchise for inspiration
- jQuery and jCanvas libraries for making canvas manipulation easier

---

**Enjoy the game and may the Force be with you!** ⭐🚀
