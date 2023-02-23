const command = {
    name: "test2",
    superior: null,
    function: async () => {

        const { superior: diagramJudge } = command;

        const api = diagramJudge.getLoginApi();

        app.dialogs.showInputDialog("Enter question.").then(function ({ buttonId, returnValue }) {
            if (buttonId === 'ok') {
                fetch("http://localhost:3000/api/add?" + returnValue, {
                    headers: {
                        'user-agent': 'Mozilla/4.0 MDN Example',
                        'content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*"
                    },
                    method: "get"
                }).then((res) => {
                    return res.json();
                }).then((data) => {
                    console.log(data);
                    app.dialogs.showInfoDialog(data.answer);
                }).catch(err => {
                    console.log(err);
                })
            } else {
                console.log("User canceled")
            }
        })



    }
}

module.exports = command;