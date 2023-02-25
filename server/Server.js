const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const test_data = {
    "acc1": "pwd1",
    "acc2": "pwd2"
}

module.exports = class Server {
    constructor(config) {
        this.Types = require("./utils/Types");

        for(let c in config)
            this[c] = config[c];
    }

    /**
     * 初始化server
     */
    init = () => {
        this.app = express();

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use('/', express.static(__dirname + '/public'));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.loadRouters();

        this.app.listen(this.port, () => {
            console.log(`sever listen on port:${this.port}`);
        });
    }

    /**
     * 封裝路由模組，可靜態讀取
     */
    static packageRouter = (api) => {
        const router = express.Router();
        
        for(let m in api.methods)
            router[m](api.path, api.methods[m]);

            return router;
    }

    /**
     * 載入路由
     */
    loadRouters = () => {
        const routersDir = path.join(__dirname, "./router");
        const routerFolders = fs.readdirSync(routersDir);
        
        for (const folder of routerFolders) {
            const folderPath = path.join(routersDir, folder);
            const routerFolder = fs.readdirSync(folderPath);
            for (const routerFile of routerFolder) {
                const router = require(path.join(folderPath, routerFile));
                router.superior = this;
                this.app.use(`/${folder}`, Server.packageRouter(router));
            }
        }
    }

    /**
     * 檢查用戶的登錄狀態
     */
    checkLogin = (acc, pwd) => {    
        let status = false;
    
        if (test_data[acc] && pwd == test_data[acc]) {
            status = true;
        }
    
        return status;
    }
}