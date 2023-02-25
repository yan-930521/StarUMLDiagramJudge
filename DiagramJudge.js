const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = class DiagramJudge {
    constructor(config = {}) {
        this.id = "DiagramJudge";
        this.uuid = this._uuid();
        this.commands = null;

        this.setting = config;

        this.user = null;
        this.isLogin = false;

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

    getPage = (page) => {
        switch (page) {
            case "login":
                let url = new URL("/page/" + page, this.setting.server.url);
                url.search = new URLSearchParams({
                    uuid: this.uuid,
                    apiUrl: this.getApi("login")
                });
                return url.href;
            default:
                return new URL("/page", this.setting.server.url).href;
        }
    }

    getApi = (router) => {
        switch (router) {
            case "login":
                return new URL("/api/login", this.setting.server.url).href;
            case "judge":
                return new URL("/api/judge", this.setting.server.url).href;
            default:
                return new URL("/api", this.setting.server.url).href;
        }
    }

    /**
     * 取得使用者登陸狀態
     * @returns online or offline
     */
    checkStatus = () => {
        return new Promise(async (res, rej) => {
            let url = new URL(this.getApi("login"));
            url.search = new URLSearchParams({
                uuid: this.uuid
            });
            const respond = await axios.get(url.href).catch(err => {
                rej(err);
            });
            if (respond.data.statusCode == diagramJudge.setting.types.STATUS["ONLINE"] && this.user == respond.data.account) {
                this.isLogin = true;
                this.user = respond.data.account;
            } else {
                this.logout(true)
                rej(new Error("登陸失敗"));
            }
            res(respond.data);
        });
    }

    /**
     * 登出
     */
    logout = (local = false) => {
        if (local) {
            this.isLogin = false;
            this.user = null;

            this.uuid = this._uuid();
            return;
        }
        return new Promise(async (res, rej) => {
            let url = new URL(this.getApi("login"));
            url.search = new URLSearchParams({
                uuid: this.uuid
            });
            const respond = await axios.delete(url.href).catch(err => {
                rej(err);
            });
            if (respond.data.statusCode != this.setting.types.STATUS["ONLINE"]) {
                this.isLogin = false;
                this.user = null;

                this.uuid = this._uuid();
            }
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