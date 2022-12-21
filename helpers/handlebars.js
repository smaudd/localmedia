const path = require("path");
const Handlebars = require("handlebars");

module.exports = function registerHBShelpers() {
  Handlebars.registerHelper("concatURI", function () {
    const [string, uri] = arguments;
    return string + encodeURIComponent(uri);
  });
  Handlebars.registerHelper("concatURIParsedPath", function () {
    const [string, uri] = arguments;
    const location = uri.replace(process.env.MEDIA_PATH, "");
    return string + encodeURIComponent(location.replaceAll(path.sep, "/"));
  });
  Handlebars.registerHelper("stringify", function () {
    return JSON.stringify(arguments[0]);
  });
  Handlebars.registerHelper("isArray", function () {
    return Array.isArray(arguments[0]);
  });
  Handlebars.registerHelper("isImage", function () {
    return ["jpeg", "jpg", "png", "webp"].find((item) =>
      arguments[0].includes(item)
    );
  });
};
