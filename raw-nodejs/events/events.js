const Game = require("./football.js");

const game = new Game();
// register a listener for football event
game.on("football", ({ name, trait }) => {
  console.log(`${name} is a good ${trait}`);
});

game.startGame();
