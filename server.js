// Require the framework and instantiate it
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const fastify = require("fastify")({
  logger: true,
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, "keys", "server.key")),
  //     cert: fs.readFileSync(path.join(__dirname, "keys", "server.crt")),
  //   },
});
const fileUpload = require("fastify-file-upload");

const getPartials = require("./helpers/getPartials");
const registerHBShelpers = require("./helpers/handlebars");

registerHBShelpers();
/**
 * Ideally we shouldn’t be exposing information of our service that we use to the public as this could make yourselfs vunerable to security treats or attacks. Therefore we want to hide the server information such as version, technology and procals. Helmet does all this out of the box for us, so lets add it to our code.
 */
// const helmet = require("@fastify/helmet");
// fastify.register(
//   helmet // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
//   //   { contentSecurityPolicy: false }
// );

fastify.register(fileUpload);

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  host: "0.0.0.0",
  decorateReply: false,
  prefix: "/", // optional: default '/'
});

fastify.register(require("@fastify/static"), {
  root: process.env.MEDIA_PATH,
  host: "0.0.0.0",
  decorateReply: false,
  prefix: "/data", // optional: default '/'
});

fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
  layout: "/views/layouts/main.hbs",
  includeViewExtension: true,
  options: {
    partials: getPartials(),
  },
});

fastify.register(require("./routes/index"));

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
