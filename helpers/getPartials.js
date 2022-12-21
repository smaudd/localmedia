const fs = require("fs");
const path = require("path");

module.exports = function () {
  const dir = fs.readdirSync(path.join(__dirname, "../", "views", "partials"));
  const partials = {};
  for (let file of dir) {
    const [name] = path.basename(file).match(/([^.]+)/);
    partials[name] = path.join("views", "partials", file);
  }
  return partials;
};
