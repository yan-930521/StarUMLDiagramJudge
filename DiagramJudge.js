const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = class DiagramJudge {
    constructor(config = {}) {
        this.id = "DiagramJudge";
        this.uuid = this._uuid();
        this.commands = null;

        if (!config.url) config.url = "http://localhost:3000/";

        this.setting = config;

        this.connection = this.initSql();
    }

    /**
     * 載入所有指令
     */
    loadCommands = () => {
        console.log("loading commands...");
        const commandsDir = path.join(__dirname, "./commands");
        const commandsFiles = fs.readdirSync(commandsDir);
        const commands = {};
        for (const file of commandsFiles) {
            const command = require(path.join(commandsDir, file));
            command.superior = this;
            commands[command.name] = command;
        }
        this.commands = commands;
        return commands;
    }

    /**
     * 載入所有常駐監聽器
     */
    loadeEvents = () => {
        console.log("loading events...");
        const eventsDir = path.join(__dirname, "./events");
        const eventsFiles = fs.readdirSync(eventsDir);
        const events = {};
        for (const file of eventsFiles) {
            const event = require(path.join(eventsDir, file));
            event.superior = this;
            events[event.name] = event;
        }
        this.events = events;
        return events;
    }

    initSql = () => {
        const {
            user,
            password,
            database,
        } = this.setting.spl;
    }



    getLoginUrl = () => {
       return path.join(this.setting.url, "/login", this.uuid);
    }

    getStatusUrl = () => {
        return path.join(this.setting.url, "/status", this.uuid);
    }

    /**
     * 取得使用者登陸狀態
     * @returns online or offline
     */
    checkStatus = () => {
        return new Promise(async (res, rej) => {
            const respond = await axios.get(this.getStatusUrl()).catch(err => {
                rej(err);
            });
            res(respond.data);
        });
    }

    _uuid = () => {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}