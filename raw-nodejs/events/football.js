const EventEmitter = require("events");
class Game extends EventEmitter {
  startGame() {
    console.log("GAME STARTS");

    // raise an event
    setTimeout(() => {
      this.emit("football", {
        name: "Pedri",
        trait: "Ball controller",
      });
    }, 2000);
  }
}

module.exports = Game;
