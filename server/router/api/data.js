const api = {
    path: "/data",
    superior: null,
    isDev: false,
    methods: {
        get: async (req, res) => {
            const {
                dataName
            } = req.query;

            let respond = {
                data: null,
                error: false
            }
            respond.data =  await api.superior.fetchData(dataName).catch(err => {
                respond.error = true;
            });
            res.send(respond);
        }
    }
}

module.exports = api;