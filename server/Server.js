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

        this.statusCache = {}

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

        this.djs = new this.DiagramJudgeStrategy(this.sql2, this.getSqlConnection);
    }

    getSqlConnection = (db_config) => {
        return new Promise(async (res, rej) => {
            let connect = mysql.createConnection(db_config);
            const reconnect = (connection) => {
                return new Promise((_res, _rej) => {
                    if (connection) connection.destroy();
                    connection = mysql.createConnection(db_config);
                    connection.connect((err) => {
                        if (err) {
                            setTimeout(reconnect, 2000);
                        }
                    });
                    _res(connection);
                })
            }

            connect.on('error', async (err) => {
                if (err.code === "PROTOCOL_CONNECTION_LOST") {
                    console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                    connect = await reconnect(connect);
                    res(connect);
                }

                else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
                    console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                    connect = await reconnect(connect);
                    res(connect);
                }

                else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
                    console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                    connect = await reconnect(connect);
                    res(connect);
                }

                else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
                    console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                }

                else {
                    console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
                    connect = await reconnect(connect);
                    res(connect);
                }

            });

            connect.connect(async (err) => {
                if (err) {
                    connect = await reconnect(connect);
                    res(connect);
                }
            });
            res(connect);
        });
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
        return new Promise(async (res, rej) => {
            let connection = await this.getSqlConnection(this.sql1);
            connection.query(cmd, (err, result) => {
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
        return new Promise(async (res, rej) => {
            let connection = await this.getSqlConnection(this.sql2);
            connection.query(cmd, (err, result) => {
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
    fetchData = (type, _arguments) => {
        switch (type) {
            case "questions":
                return this.query2("SELECT * FROM uml_judge_questions");
            case "search_question":
                const {
                    chapterNo
                } = _arguments;
                if(!chapterNo) {
                    throw new Error("missing required parameter, chapterId.");
                }
                return this.query2(`SELECT * FROM uml_judge_questions WHERE chapter_number = '${chapterNo}';`);
            case "read_question":
                const {
                    chapterId,
                    questionId
                } = _arguments;
                if(!chapterId || !questionId) {
                    throw new Error("missing required parameter, chapterId or questionId.");
                }
                return this.query2(`SELECT * FROM uml_judge_questions WHERE chapter_number = '${chapterId}' AND question_order = '${questionId}';`);
            case "read_requirements":
                const {
                    question_number
                } = _arguments;
                if(!question_number) {
                    throw new Error("missing required parameter, questionId.");
                }
                return this.query2(`SELECT * FROM uml_question_requirement WHERE question_number = '${question_number}';`);
                //return this.query2(`SELECT * FROM uml_question_requirement WHERE question_number = '${p_num}';`);
            default:
                throw new Error("type not defined.");
        }
    }
}