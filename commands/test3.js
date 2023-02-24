

const command = {
    name: "test3",
    superior: null,
    isDev: true,
    function: async () => {

        const { superior: diagramJudge } = command;

        let a = null, b = null;

        app.dialogs.showInputDialog("Enter a = ?").then(function ({ buttonId, returnValue }) {
            if (buttonId === 'ok') {
                a = returnValue;
                app.dialogs.showInputDialog("a = " + a + " ( Enter b = ? )").then(function ({ buttonId, returnValue }) {
                    if (buttonId === 'ok') {
                        b = returnValue;
                        fetch("http://localhost:3000/api/add?" + `a=${a}&b=${b}`, {
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
                });
            } else {
                console.log("User canceled")
            }
        });







    }
}

module.exports = command;