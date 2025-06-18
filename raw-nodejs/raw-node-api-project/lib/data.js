// deps
const fs = require("fs");
const path = require("path");

// scaffolding
const lib = {};

// base dir of data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// create file
lib.create = function (dir, file, data, callback) {
  // open file for writing
  fs.open(
    `${lib.baseDir + dir}/${file}.json`,
    "wx", // fails creating same file if exists(file system flags)
    (openErr, fileDescriptor) => {
      if (!openErr && fileDescriptor) {
        // convert data to string
        const strData = JSON.stringify(data);
        // writefile
        fs.writeFile(fileDescriptor, strData, (writeErr) => {
          if (!writeErr) {
            fs.close(fileDescriptor, (closeErr) => {
              if (!closeErr) {
                callback(false);
              } else {
                callback("Error Closing the new File");
              }
            });
          } else {
            callback("Error writing new File");
          }
        });
      } else {
        callback(openErr);
      }
    }
  );
};

// read file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, "utf-8", (err, data) => {
    // console.log("data", data);
    // console.log("err", err);

    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert to str
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fileDescriptor, (truncateError) => {
        if (!truncateError) {
          fs.writeFile(fileDescriptor, stringData, (writeErr) => {
            if (!writeErr) {
              fs.close(fileDescriptor, (closeErr) => {
                if (!closeErr) {
                  callback(false);
                } else {
                  callback("Error closing file");
                }
              });
            } else {
              callback("Error updating file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Error Updating file");
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error Deleting File");
    }
  });
};

module.exports = lib;
