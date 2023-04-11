const callFetchDataApi = (dataName, _arguments) => {
    return new Promise(async (res, rej) => {
        let respond = {
            data: null,
            error: false,
            errorMsg: true
        }
        respond.data = await api.superior.fetchData(dataName, JSON.parse(_arguments)).catch(err => {
            if(err) {
                respond.error = true;
                respond.errorMsg = err.toString()
            }
            console.log(err);
        });
        res(respond);
    })
    

    
}
const api = {
    path: "/data",
    superior: null,
    isDev: false,
    methods: {
        get: async (req, res) => {
            const {
                dataName,
                arguments: _arguments
            } = req.query;

            let respond = await callFetchDataApi(dataName, _arguments);
            res.send(respond);
        }
    }
}

module.exports = api;