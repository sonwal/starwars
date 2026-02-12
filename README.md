# ⭐ Star Wars Galaxy Game ⭐

A thrilling HTML5 canvas-based space shooter game where you pilot a spaceship through a galaxy filled with hostile alien ships. Destroy enemies, dodge obstacles, and survive as long as possible!

![Star Wars Game](https://github.com/user-attachments/assets/e72b3b0a-5030-4c7e-ae91-49b3949eb2b6)

## 🎮 Game Features

- **Classic Space Shooter Gameplay**: Navigate your ship through waves of alien enemies
- **Shooting Mechanics**: Fire green laser beams to destroy alien ships
- **Progressive Difficulty**: Game gets harder as you advance through levels
- **Score System**: Earn points for survival time and destroying enemies
- **Smooth Controls**: Use keyboard arrows or mouse to control your ship
- **Visual Effects**: Explosion animations when destroying enemies
- **Game Over & Restart**: Clean game over screen with final statistics and easy restart

## 🚀 How to Play

### Controls

- **Arrow Keys** (← →) or **Mouse Movement**: Move your ship left and right
- **SPACEBAR** or **Mouse Click**: Fire laser beams at alien ships
- **Any Key/Click**: Start game from intro screen
- **SPACE/Click on Game Over**: Restart the game

### Objective

1. Survive as long as possible while avoiding alien ships
2. Shoot down alien ships to increase your score
3. Progress through levels as difficulty increases
4. Try to achieve the highest score!

### Scoring

- **Survival**: Points increase over time
- **Destroying Aliens**: +100 points per alien destroyed
- **Level Progression**: Unlock higher levels at 10,000 point intervals

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

### Player Ship
- White triangular spacecraft with thrusters
- Located at the bottom of the screen
- Fires green laser beams upward

### Alien Ships
- Red diamond-shaped enemy spacecraft
- Cyan cockpit windows
- Move downward toward the player
- Destroyed on contact with laser beams

### Visual Effects
- Green laser beams with glow effects
- Explosion animations (red, orange, yellow)
- Star Wars themed color palette (gold, white, red)
- Dark space background

## 🎯 Game Mechanics

- **Collision Detection**: Advanced circular collision detection for ship, aliens, and bullets
- **Difficulty Scaling**: Speed and enemy count increase with each level
- **Smooth Animation**: 60 FPS game loop for fluid gameplay
- **Responsive Movement**: Mouse tracking for precise ship control
- **Enemy Spawning**: Dynamic enemy generation with no overlapping

## 🏆 Tips & Strategy

1. **Keep Moving**: Stay mobile to avoid alien ships
2. **Shoot Frequently**: More shots mean more hits
3. **Positioning**: Try to align with aliens before shooting
4. **Survival First**: Dodging is sometimes better than shooting
5. **Watch the Edges**: Don't get cornered at screen boundaries

## 🐛 Known Limitations

- Game is designed for desktop browsers with keyboard/mouse input
- Mobile touch controls are not implemented
- No sound effects or background music
- Single player only

## 🔮 Future Enhancements

Potential features for future versions:
- Sound effects and background music
- Power-ups (shields, multi-shot, speed boost)
- Different types of enemy ships
- Boss battles at end of levels
- High score persistence (localStorage)
- Mobile touch controls
- Particle effects for enhanced visuals
- Multiple difficulty settings

## 📝 License

This is a personal project. Feel free to fork, modify, and use it for learning purposes.

## 👨‍💻 Author

Built as a fun HTML5 Canvas game project demonstrating JavaScript game development fundamentals.

## 🙏 Acknowledgments

- Star Wars franchise for inspiration
- jQuery and jCanvas libraries for making canvas manipulation easier

---

**Enjoy the game and may the Force be with you!** ⭐🚀
