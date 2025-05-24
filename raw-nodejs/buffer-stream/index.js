const fs = require("fs");
const http = require("http");

// const readStream = fs.createReadStream(`./bigdata.txt`);
// const writeStream = fs.createWriteStream(`./output.txt`);

// readStream.on("data", (chunk) => {
//   writeStream.write(chunk);
// });

// readStream.pipe(writeStream); // shortcut way

const server = http.createServer((req, res) => {
  const readStream = fs.createReadStream("./bigdata.txt", "utf-8");

  readStream.pipe(res);
});

server.listen(3000);
