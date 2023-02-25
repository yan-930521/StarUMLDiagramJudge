const command = {
    name: "judge",
    superior: null,
    function: async () => {

        const { superior: diagramJudge } = command;

        const api = diagramJudge.getApi("judge");

        let baseModel = null;

        app.elementPickerDialog.showDialog('Select a base model to be judged', null, type.UMLPackage).then(function ({buttonId, returnValue}) {
			if (buttonId === 'ok') 
			{
				base = returnValue
				let c = _abstractFromStudentAnswer(base)
                    fetch(`${api}?baseModel=${a}`, {
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
            }
            else
            {
                console.log("User canceled")
            }
        });
    }
}

module.exports = command;