const express = require("express");
const path = require("path");

const app = express();

const port = 3030;

app.use('/', express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("home page.");
});

app.get('/loginPage', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(port, () => {
    console.log(`sever listen on port:${port}`)
})