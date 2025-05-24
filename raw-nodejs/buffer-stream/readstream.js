const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write(
      `<html><head> <title>BIGDATA </title> </head> <body>
      <form method="POST" action="/process"><input name="message"/></form>
      </body> </html>`
    );
    res.end();
  } else if (req.url === "/process") {
    const body = [];
    req.on("data", (chunk) => {
      // console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      console.log("Stream Finished");
      const parsedBody = Buffer.concat(body).toString();
      console.log("parsedbody", parsedBody);
      res.write(parsedBody.toString());
      res.end();
    });
  } else {
    res.write("Not Found");
    res.end();
  }
});

server.listen(3000);
