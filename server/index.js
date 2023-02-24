const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', express.static(__dirname + '/public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = 3000;

const routersDir = path.join(__dirname, "./router");
const routerFolders = fs.readdirSync(routersDir);

for (const folder of routerFolders) {
    const folderPath = path.join(routersDir, folder);
    const routerFolder = fs.readdirSync(folderPath);
    for (const routerFile of routerFolder) {
        app.use(`/${folder}`, require(path.join(folderPath, routerFile)));
    }
}

app.listen(port, () => {
    console.log(`sever listen on port:${port}`);
});