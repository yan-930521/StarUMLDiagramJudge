const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const mysql = require('mysql');

const test_data = {
    "acc1": "pwd1",
    "acc2": "pwd2"
}

module.exports = class Server {
    constructor(config) {
        this.Types = require("./utils/Types");
        this.DiagramJudgeStrategy = require("./utils/diagramJudgeStrategy");

        this.connection = {
            database1: null,
            database2: null
        };

        for (let c in config)
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

        this.connection.database1 = this.handelSqlConnection(this.sql1);
        this.connection.database2 = this.handelSqlConnection(this.sql2);

        this.djs = new this.DiagramJudgeStrategy(this.connection.database2);
    }

    handelSqlConnection = (db_config) => {
        let connect = mysql.createConnection(db_config);

        const reconnect = (connection) => {
            if (connection) connection.destroy();
            connection = mysql.createConnection(db_config);
            connection.connect((err) => {
                if (err) {
                    setTimeout(reconnect, 2000);
                } else {
                    return connection;
                }
            });
        }

        connect.on('error', function (err) {
            if (err.code === "PROTOCOL_CONNECTION_LOST") {
                console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                connect = reconnect(connect);
            }

            else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
                console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                connect = reconnect(connect);
            }

            else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
                console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                connect = reconnect(connect);
            }

            else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
                console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
            }

            else {
                console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                connect = reconnect(connect);
            }

        });

        connect.connect((err) => {
            if (err) {
                connect = reconnect(connect);
            }
        });

        return connect;
    }

    /**
     * 封裝路由模組，可靜態讀取
     */
    static packageRouter = (api) => {
        const router = express.Router();

        for (let m in api.methods)
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
     * 訪問OOP database
     * @param {} cmd SQL指令
     * @returns 
     */
    query1 = (cmd) => {
        return new Promise((res, rej) => {
            this.connection.database1.query(cmd, (err, result) => {
                if (err) {
                    console.log('[ERROR] - ', err.message);
                    rej();
                }
                else res(result);
            });
        })
    }

    /**
     * 訪問UML database
     * @param {} cmd SQL指令
     * @returns 
     */
    query2 = (cmd) => {
        return new Promise((res, rej) => {
            this.connection.database2.query(cmd, (err, result) => {
                if (err) {
                    console.log('[ERROR] - ', err.message);
                    rej();
                }
                else res(result);
            });
        })
    }

    /**
     * 檢查用戶的登錄狀態
     */
    checkLogin = async (acc, pwd) => {
        let status = false;

        let results = await this.query1(`SELECT * FROM users WHERE login_id = '${acc}' AND password = '${pwd}'`).catch(err => {
            console.log(err)
        });

        if (results.length > 0) {
            status = true;
        }

        return status;
    }

    /**
     * 取得題目
     */
    fetchData = (type) => {
        switch (type) {
            case "questions":
                return this.query2("SELECT * FROM uml_judge_questions");
            default:
                throw new Error("type not define.");
        }
    }
}