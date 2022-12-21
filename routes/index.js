const fs = require("fs");
const path = require("path");
const dirTree = require("directory-tree");

const mimeTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".txt": "text/plain",
};

module.exports = function (fastify, opts, done) {
  /**
   * Show all files and directories
   */
  fastify.get("/", async (_, reply) => {
    const tree = dirTree(process.env.MEDIA_PATH);
    function sortTreeByFoldersFirst(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          arr[i].children = arr[i].children.sort((a) => {
            if (!a.path.includes(".")) {
              return -1;
            }
            return 1;
          });
          arr[i].children = sortTreeByFoldersFirst(arr[i].children);
        }
      }
      return arr;
    }
    const arr = sortTreeByFoldersFirst(tree.children);
    return reply.view("/views/pages/index.hbs", { tree });
  });
  /**
   * Show specific file as buffer with correct mimetype
   */
  fastify.get("/file/:path", async (request, reply) => {
    const ext = path.extname(request.params.path);
    const contents = await fs.promises.readFile(request.params.path);
    return reply
      .code(200)
      .header("Content-Type", mimeTypes[ext])
      .send(contents);
  });
  /**
   * Upload files on specific location
   */
  fastify.post("/upload", async (request, reply) => {
    let { file: files } = request.raw.files;
    files = Array.isArray(files) ? files : [files];
    for await (let file of files) {
      try {
        await file.mv(path.join(request.body.location, file.name));
      } catch (err) {
        return reply.code(500).send(err);
      }
    }
    reply.send({
      message: "Uploaded files",
      names: files.map((file) => file.name),
    });
  });
  /**
   * Create folder on specific location
   */
  fastify.post("/folder", async (request, reply) => {
    let { name, location } = request.body;

    await fs.promises.mkdir(path.join(location, name));
    reply.send({
      message: "Folder created",
    });
  });
  /**
   * Delete folder of specific location
   */
  fastify.delete("/folder/:location", async (request, reply) => {
    let { location } = request.params;
    await fs.promises.rmdir(path.join(location), { recursive: true });
    reply.send({
      message: "Folder created",
    });
  });
  /**
   * Delete folder on specific location
   */
  fastify.delete("/item/:location", async (request, reply) => {
    let { location } = request.params;
    await fs.promises.unlink(path.join(location));
    reply.send({
      message: "Folder created",
    });
  });
  done();
};
