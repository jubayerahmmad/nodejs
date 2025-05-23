const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Hello World");
    res.write("  Hello World 2.0");
    res.end();
  } else if (req.url === "/about") {
    res.write("This is about us page");
    res.end();
  } else {
    res.write("Not Found");
    res.end();
  }
});

server.listen(3000);
console.log("Server is running on Port 3000");
