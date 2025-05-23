const os = require("os");

// console.log(os.cpus());
// console.log(os.getPriority());
// console.log(os.hostname());
console.log(os.freemem());

const fs = require("fs");
fs.writeFileSync("text.txt", "Hello World");
fs.appendFileSync("text.txt", " Hello Jubayer");
// const data = fs.readFileSync("text.txt") // synchronus way
fs.readFile("text.txt", (err, data) => {
  // async way
  console.log(data.toString());
});
// console.log(data.toString());
