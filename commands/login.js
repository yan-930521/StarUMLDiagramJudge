const { shell, ipcRenderer } = require('electron');

const DIALOG_BTN_OK = "登陸完畢";
const DIALOG_BTN_CANCEL = "cancel";

const command = {
    name: "login",
    superior: null,
    isDev: false,
    function: async () => {
        /**
         * step
         * 1. 製造一組屬於這台電腦的uuid
         * 2. 開啟網頁，登陸，把uuid傳進伺服器
         * 3. 登陸成功後，伺服器更新資料: [uuid] : "LOGIN"
         * 4. 套件偵測到網頁被關閉，再次跟伺服器要資料，發現[uuid] : "LOGIN"
         */

        // app.dialogs.showInfoDialog("login");

        const { superior: diagramJudge} = command;
        let loginUrl = diagramJudge.getPage("login");
        console.log("loginUrl: ", loginUrl);
        shell.openExternal(loginUrl);

        const showCostomDialogs = (message) => {
            const result = ipcRenderer.sendSync('show-message-box', {
                type: 'info',
                title: 'Information',
                message: message,
                buttons: [ DIALOG_BTN_OK ]
            })
            switch (result) {
                case 0: // 登錄完畢，check status
                    return DIALOG_BTN_OK
                default:
                    return DIALOG_BTN_CANCEL
            }
        }

        let buttonId = await showCostomDialogs("please login to Diagram Judge.");
        if(buttonId == "登陸完畢") {
            let checkInterval = null;
            const callback = async () => {
                let status = await diagramJudge.checkStatus().catch(err => {
                    if(err) {
                        // 登陸失敗
                        console.log(err)
                        app.dialogs.showInfoDialog("登陸失敗，請於稍後重新登錄");
                        if(checkInterval) clearInterval(checkInterval);
                    }
                });
                console.log("status: ", status);
                if(status.statusCode == diagramJudge.setting.Types.STATUS["ONLINE"]) {
                    if(checkInterval) clearInterval(checkInterval);
                    // 登陸成功，渲染頁面
                    let question = await diagramJudge.fetchData("read_question", {
                        chapterId: '1',
                        questionId: '1'
                    }).catch(error => {
                        console.error(error);
                    })
                    console.log(question)
                    // diagramJudge.renderPage(question.data);
                }
            }
            callback();
            checkInterval = setInterval(callback, diagramJudge.setting.checkLoginInterval * 1000);
        }
    }
}

module.exports = command;