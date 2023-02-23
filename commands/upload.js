const command = {
    name: "upload",
    superior: null,
    function: async () => {
        /**
         * step
         * 1. 
         */

        const { superior: diagramJudge} = command;
        
        const project = app.repository.select("@Project");

        console.log(app)
        console.log(project);

        // 要記得調整stack的maxsize
    }
}

module.exports = command;