const Server = require("./Server");
const config = require("./config");

const server = new Server(config);

server.init();

/** 
 * 加入api版本
 */