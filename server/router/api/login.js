const { packageRouter } = require("../../Server.js");

const statusCache = {}

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
                account: statusCache[uuid] ? statusCache[uuid].account : null,
                statusCode: statusCache[uuid] ? statusCache[uuid].statusCode : api.superior.Types.STATUS["USERNOTFOUND"],
            });
        },
        post: async (req, res) => {
            const {
                uuid,
                account,
                password
            } = req.body;

            let success = await api.superior.checkLogin(account, password);

            statusCache[uuid] = {
                account: account,
                statusCode: api.superior.Types.STATUS[success ? "ONLINE" : "OFFLINE"],
            }

            res.send(statusCache[uuid]);
        },
        delete: (req, res) => {
            const {
                uuid
            } = req.query;

            if (statusCache[uuid]) {
                statusCache[uuid].statusCode = api.superior.Types.STATUS["OFFLINE"];
            }

            res.send({
                account: statusCache[uuid] ? statusCache[uuid].account : null,
                statusCode: api.superior.Types.STATUS[statusCache[uuid] ? "OFFLINE" : "USERNOTFOUND"],
            });
        }
    }
}

module.exports = api;
