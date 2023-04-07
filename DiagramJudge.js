const fs = require("fs");
const path = require("path");

let url = '';

module.exports = class DiagramJudge {
    constructor(config = {}) {
        this.id = "DiagramJudge";
        this.uuid = this._uuid();
        this.commands = null;

        this.setting = config;

        this.user = null;
        this.isLogin = false;

        this.fetchData("questions").then((questions) => {
            this.renderPage(questions.data);
        });
        
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
                url = new URL("/page/" + page, this.setting.server.url);
                url.search = new URLSearchParams({
                    uuid: this.uuid,
                    apiUrl: this.getApi("login")
                });
                return url.href;
            case "test1":
                url = new URL("/page/" + page, this.setting.server.url);
                return url.href;
            case "test2":
                url = new URL("/page/" + page, this.setting.server.url);
                return url.href;
            case "test3":
                url = new URL("/page/" + page, this.setting.server.url);
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
            case "data":
                return new URL("/api/data", this.setting.server.url).href;
            default:
                return new URL("/api", this.setting.server.url).href;
        }
    }

    ping = () => {
        let checkInterval = setInterval(async () => {
            let status = await this.checkStatus().catch(err => {
                if(err) {
                    console.log(err)
                    if(checkInterval) clearInterval(checkInterval);
                    this.logout(true);
                }
            });
            if(
                status.statusCode != this.setting.Types.STATUS["ONLINE"] ||
                status.uuid != this.uuid ||
                status.account != this.user) {
                if(checkInterval) clearInterval(checkInterval);
                this.logout(true);
            }
        }, this.setting.checkLoginInterval * 1000)
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
            const respond = await fetch(url.href, {
                headers: {
                    'user-agent': 'Mozilla/4.0 MDN Example',
                    'content-type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                },
                method: 'get'
            }).then((res) => {
                return res.json();
            }).catch(err => {
                rej(err);
            });

            if (respond.statusCode == this.setting.Types.STATUS["ONLINE"]) {
                this.isLogin = true;
                this.user = respond.account;
            } else {
                this.logout(true);
                rej(new Error("登陸失敗"));
            }
            res(respond);
        });
    }

    /**
     * 登出
     */
    logout = (local = false) => {
        app.dialogs.showInfoDialog("已登出，請重新登錄");
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
            
            const respond = await fetch(url.href, {
                headers: {
                    'user-agent': 'Mozilla/4.0 MDN Example',
                    'content-type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                },
                method: 'delete'
            }).then((res) => {
                return res.json();
            }).catch(err => {
                rej(err);
            });
            if (respond.statusCode != this.setting.Types.STATUS["ONLINE"]) {
                this.isLogin = false;
                this.user = null;

                this.uuid = this._uuid();
            }
            res(respond);
        });
    }

    fetchData = (type, _arguments) => {
        _arguments = JSON.stringify(_arguments);
        switch(type) {
            case "questions":
                return new Promise(async (res, rej) => {
                    let url = new URL(this.getApi("data"));
                    url.search = new URLSearchParams({
                        dataName: "questions",
                        arguments: null
                    });
                    
                    const respond = await fetch(url.href, {
                        headers: {
                            'user-agent': 'Mozilla/4.0 MDN Example',
                            'content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*"
                        },
                        method: 'get'
                    }).then((res) => {
                        return res.json();
                    }).catch(err => {
                        rej(err);
                    });

                    res(respond);
                });
            case "read_question":
                return new Promise(async (res, rej) => {
                    let url = new URL(this.getApi("data"));
                    url.search = new URLSearchParams({
                        dataName: "read_question",
                        arguments: _arguments
                    });
                    
                    const respond = await fetch(url.href, {
                        headers: {
                            'user-agent': 'Mozilla/4.0 MDN Example',
                            'content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*"
                        },
                        method: 'get'
                    }).then((res) => {
                        return res.json();
                    }).catch(err => {
                        rej(err);
                    });

                    res(respond);
                });
            default:
                throw new Error("type not define.");
        }
    }

    /**
     * 渲染看題目的頁面
     */
    renderPage = (questions = []) => {
        console.log(questions);

        this.nowQuestion = {
            question: questions[0],
            index: 0
        }
        
        let content = document.querySelector(".content");
        let questionPage = document.querySelector(".questionPage");
        let htmlQuestions = `
            <div id="questions" style="width: 30%; height: 100%; display: inline-block;">
                $QUESTIONS
            </div>
            <div id="real-question" style="position:relative; right:0px; top: 0px; width: 70%; height: 100%; display: inline-block; float: right;">
            </div>`;
        let htmlQuestion = `
            <div class="question" style="user-select:none; width: 100%; background-color: white;font-size: xx-large" onmouseover="this.style.backgroundColor='#ffcc00';this.style.boxShadow='0 0 20px #ffcc00';" onmouseout="this.style.backgroundColor='white';this.style.boxShadow='none';" onclick="window.focusQuestion($QINDEX)">
                $NO. $QUESTION
            </div>`;

        window.focusQuestion = (index) => {
            let realQuestion = document.querySelector("#real-question");
            if(!realQuestion) return;
            this.nowQuestion.index = index;
            this.nowQuestion.question = questions[index];
            realQuestion.innerHTML = this.nowQuestion.question.question_describtion;
        }

        document.querySelector("#toolbar").style.zIndex = 3;

        if(!questionPage) {
            let htmlqs = "";
            for(let i in questions) {
                htmlqs += htmlQuestion.replace("$NO", Number(i)+1).replace("$QUESTION", questions[i].question_title).replace("$QINDEX", i)
            }
            let questionPageWrapper = document.createElement("div");
            questionPageWrapper.className = "questionPageWrapper";
            let questionPageString = fs.readFileSync(path.join(__dirname, "./insert.html"), "utf-8");
            questionPageWrapper.innerHTML = questionPageString.replace(
                "$QUESTIONPAGE",
                htmlQuestions.replace("$QUESTIONS", htmlqs)
            );
            content.appendChild(questionPageWrapper);
        } else {

        }
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