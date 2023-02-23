const express = require("express");
const path = require("path");
// 模擬用 server.
const app = express();

const port = 3000;

const status = {}
const statusType = {
    online: "ONLINE"
}

app.use('/', express.static(__dirname + '/public'));
app.use(express.json());
app.get('/', (req, res) => {
    res.send("home page.");
});

app.get('/login/:uuid', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.post('/login/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    console.log(`uuid: ${uuid} login to system.`);
    console.log(req.body);
    status[uuid] = statusType.online;
    
    // 假設登陸成功

    res.send(status[uuid]);
});

app.get('/status/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    console.log(`uuid: ${uuid} 's status: ${status[uuid]}`);
    res.send(status[uuid]);
});

app.listen(port, () => {
  console.log(`sever listen on port:${port}`)
})
