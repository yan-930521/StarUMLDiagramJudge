const DiagramJudge = require("./DiagramJudge");
const config = require("./config");

exports.init = () => {
    const diagramJudge = new DiagramJudge(config);
    const commands = diagramJudge.loadCommands();
    // const events = diagramJudge.loadeEvents();
    for(const command in commands) {
        app.commands.register(`${diagramJudge.id}:${command}`, commands[command].function);
    }

    /*
    for(const event in events) {
        
    }*/

    app.diagramJudge = diagramJudge;
}