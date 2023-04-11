const api = {
    path: "/now_question",
    superior: null,
    isDev: false,
    methods: {
        get: (req, res) => {
            const {
                uuid
            } = req.query;
            if(api.superior.statusCache[uuid]?.now_question) {
                res.send({
                    question: api.superior.statusCache[uuid].now_question
                });
            } else {
                res.send({
                    question: null,
                });
            }
            
        },
        post: async (req, res) => {
            const {
                uuid,
                question
            } = req.body;

            //驗證question是否為正常的question

            api.superior.statusCache[uuid].now_question = question;

            res.send({
                question: api.superior.statusCache[uuid].now_question
            });
        }
    }
}

module.exports = api;
