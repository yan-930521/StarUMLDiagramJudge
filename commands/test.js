const command = {
    name: "test",
    superior: null,
    isDev: true,
    function: async () => {
        
        const { superior: diagramJudge} = command;

        fetch("http://localhost:3000/api/add?a=字串1&b=字串2", {
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
}

module.exports = command;