const Server = require('./src/server');

const server = new Server();

const run = async () => {
  await server.listen();
}

run();

process.on('unhandledRejection', (err) => {
  console.log("unhandledRejection", err);
})

process.on('unhandledException', (err) => {
  console.log("unhandledException", err);
})
