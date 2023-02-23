const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = 3000;

const routerDir = path.join(__dirname, "./router");
const routersFiles = fs.readdirSync(routerDir);

for (const file of routersFiles)
    app.use("/api", require(path.join(routerDir, file)));

app.listen(port, () => {
    console.log(`sever listen on port:${port}`);
});