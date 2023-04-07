const api = {
    path: "/login",
    superior: null,
    isDev: false,
    methods: {
        get: (req, res) => {
            const {
                uuid
            } = req.query;

            res.send({
                account: api.superior.statusCache[uuid] ? api.superior.statusCache[uuid].account : null,
                statusCode: api.superior.statusCache[uuid] ? api.superior.statusCache[uuid].statusCode : api.superior.Types.STATUS["USERNOTFOUND"],
            });
        },
        post: async (req, res) => {
            const {
                uuid,
                account,
                password
            } = req.body;

            let success = await api.superior.checkLogin(account, password);

            api.superior.statusCache[uuid] = {
                account: account,
                statusCode: api.superior.Types.STATUS[success ? "ONLINE" : "OFFLINE"],
            }

            res.send(api.superior.statusCache[uuid]);
        },
        delete: (req, res) => {
            const {
                uuid
            } = req.query;

            if (api.superior.statusCache[uuid]) {
                api.superior.statusCache[uuid].statusCode = api.superior.Types.STATUS["OFFLINE"];
            }

            res.send({
                account: api.superior.statusCache[uuid] ? api.superior.statusCache[uuid].account : null,
                statusCode: api.superior.Types.STATUS[api.superior.statusCache[uuid] ? "OFFLINE" : "USERNOTFOUND"],
            });
        }
    }
}

module.exports = api;
