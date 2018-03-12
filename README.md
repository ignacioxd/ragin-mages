# Offline-first JavaScript Game

This is a [Phaser 3](https://phaser.io/) game that is being collaboratively built as part of the 2018 Grow with Google Scholarship: Mobile Web Udacity course.


## Game

This is a small MOBA (multiplayer online battle arena), with a single-player component. There are different types of characters, each with different skills, but they all have some general stats (e.g., health). When the game begins, a player is allowed to chose a character type and a player name/handle. If the user is offline, only the single-player mode will be enabled. If the game is online, it will offer both single-player mode and multiplayer mode.

### Multiplayer Mode

In multiplayer mode, every character is controlled by a human player. Players control a character on a 2D map and try to defeat other players by “shooting” at them as long as they are in range. Each player will keep a score of how many enemies it has defeated on a single “life”, and we can add both a local high-score and a server-side global high-score.

This mode requires a [server component](server).

### Single-player Mode

In single-player mode, enemies will spawn and attempt to attack the player when in range. Enemies will spawn faster and faster as time progresses. High scores will be saved locally for this mode (IndexedDB).

This mode only requires [the game](game).