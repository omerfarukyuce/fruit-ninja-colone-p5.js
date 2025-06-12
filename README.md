# 🍉 Fruit Ninja Clone 🔪

A vibrant and addictive web-based game, lovingly crafted and inspired by the classic mobile hit, Fruit Ninja! Sharpen your virtual blade, slice through a flurry of fruits, and master the art of avoiding treacherous bombs to set your ultimate high score!

---

## 📖 Table of Contents

-   [✨ Features](#-features)
-   [🎮 How to Play](#-how-to-play)
-   [🚀 Installation](#-installation)
-   [📁 File Structure](#-file-structure)
-   [🛠️ Technologies Used](#%EF%B8%8F-technologies-used)
-   [📸 Screenshots](#-screenshots)
-   [💡 Future Enhancements](#-future-enhancements)
-   [⚖️ License](#%EF%B8%8F-license)
-   [💖 Credits](#-credits)

---

## ✨ Features

-   **🎯 Precision Slicing:** Engage in satisfying fruit-slicing action with a variety of fruits including apples, kiwis, bananas, oranges, watermelons, and grapes!
-   **💣 Explosive Avoidance:** Test your reflexes by strategically dodging perilous bombs that mean instant game over.
-   **📈 High Score Challenge:** Track your current performance and strive to beat your personal best with a persistent high score display.
-   **❤️ Three Lives to Live:** Start with 3 chances; lose a life by letting a fruit fall or by hitting a bomb.
-   **⚡ Dynamic Difficulty:** Feel the adrenaline as the game intelligently speeds up with your increasing score, ensuring a constant challenge!
-   **🖥️ Intuitive Menus:** Seamlessly navigate between the main menu, "How to Play" instructions, and the thrilling gameplay.
-   **🖼️ Stunning Background:** Enjoy a beautifully scaled background image that perfectly fits your canvas.
-   **🔊 Immersive Sound Effects:** Dive into the action with crisp sound effects for every slice, explosion, and game event.

---

## 🎮 How to Play

1.  **Start Your Journey:**
    -   From the main menu, **slice the vibrant watermelon** to leap into the game.
    -   Want to brush up on the rules? **Slice the juicy apple** to enter the "How to Play" guide.
2.  **Unleash Your Blade:**
    -   Simply **drag your mouse** across the screen to perform swift slices through incoming objects.
3.  **Master the Art:**
    -   **Your goal: Slice fruits** to rack up points!
    -   **Your challenge: AVOID BOMBS** at all costs – touching one spells instant doom!
    -   **Beware of gravity:** Don't let precious fruits fall off the bottom of the screen, or you'll lose a life!
4.  **Score & Lives:**
    -   Each perfectly sliced fruit adds **1 point** to your score.
    -   You begin with **3 lives**, visually represented by 'X' marks at the top right.
    -   Losing all lives leads to the "GAME OVER" screen.
5.  **Re-enter the Fray:**
    -   Once "GAME OVER" flashes, a simple **click anywhere on the screen** will reset your score and lives, throwing you back into the slicing frenzy!

---
## 📁 File Structure

The project is meticulously organized into modular JavaScript files, ensuring crystal-clear readability and effortless maintenance.
fruit-ninja-clone/

├── index.html # The web page that hosts our game 🌐

├── sketch.js # The heart of the game: main logic, setup, and draw loop ❤️

├── fruit.js # Defines the Fruit class - how fruits behave and look 🍎

├── fruitHalf.js # Defines the FruitHalf class - the magic behind sliced fruits 🔪

├── bomb.js # Defines the Bomb class - what to avoid at all costs! 💣

├── gameStates.js # Handles the visual presentation of game screens (menu, how-to-play, game-over) 🎨

├── utilities.js # Provides handy functions like drawing the epic slice trail and lives display ✨

├── fruit_ninja_background.png # The beautiful backdrop for our slicing adventures 🏞️

├── swis_sound.mp3 # The satisfying sound of a perfect slice! 🌬️

├── bomb.mp3 # The ominous boom of a bomb explosion 💥

├── nasty-knife.wav # An additional, sharp knife sound effect 🗡️

├── watah.wav # A cool background or intro sound 💧

├── fail.wav # The sound of a fruit hitting the floor... 😞

├── throw.wav # The whoosh of a fruit soaring into view! 🚀

├── fire-fuse.mp4 # The menacing sizzle of a bomb's fuse 🔥

└── README.md # You're reading it! Project overview and guide 📝


---
## 🛠️ Technologies Used

This project leverages the power and simplicity of modern web technologies:

-   **p5.js:** A phenomenal JavaScript library for creative coding, bringing all the visual magic and animation to life. 🎨
-   **p5.sound.js:** An essential p5.js add-on, empowering our game with rich and engaging audio experiences. 🎧
-   **HTML5:** The fundamental language for structuring the web page, providing the canvas for our game. 💻

---
