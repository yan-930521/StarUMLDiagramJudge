const command = {
    name: "logout",
    superior: null,
    isDev: false,
    function: async () => {
        const { superior: diagramJudge} = command;
        await diagramJudge.logout();
    }
}

module.exports = command;