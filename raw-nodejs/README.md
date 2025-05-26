# ⚙️ Raw Node.js Fundamentals

This folder contains my foundational learning of **Node.js without frameworks** — focusing on understanding how Node.js works under the hood using built-in core modules only.

---

## 📚 Core Concepts & Notes

### 📦 Module System

Node.js has built-in modules like:

- `fs`: File System — read, write, update files.
- `os`: Operating System — system info like memory, CPU, etc.
- `path`: Helps handle and transform file paths.
- `url`: Parses URLs into readable objects.

```js
const fs = require("fs");
const os = require("os");
const url = require("url");
```

---

### 🌐 HTTP Module

- Allows creating web servers with `http.createServer()`.
- Basic routing can be done using `req.url`.
- Response is handled through `res.write()` and `res.end()`.

🧠 _Think of it as a very low-level version of Express._

```js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Home Page");
    res.end();
  } else if (req.url === "/about") {
    res.write("About Page");
    res.end();
  } else {
    res.write("404 Not Found");
    res.end();
  }
});

server.listen(3000);
```

---

### Events Module

- Based on the **Observer Pattern**.
- The `EventEmitter` class lets you define custom events and listeners.
- Node.js core (like streams, HTTP, etc.) uses events internally.

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("greet", () => {
  console.log("Hello!");
});

emitter.emit("greet");
```

---

### Buffer & Stream

- **Buffer**: Temporary memory chunk — useful for binary data.
- **Stream**: Way of handling data piece by piece (great for large files).

Four types of streams:

1. Readable
2. Writable
3. Duplex (both)
4. Transform (modify data while streaming)

```js
const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  const readStream = fs.createReadStream("./bigdata.txt", "utf-8");

  readStream.pipe(res);
});
```

---

> 🧠 This README acts as a **cheat sheet** + **learning log** for my raw Node.js journey.
