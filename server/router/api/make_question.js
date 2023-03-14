const api = {
    path: "/make_question",
    superior: null,
    isDev: false,
    methods: {
        get: (req, res) => {
            const {
                baseModel
            } = req.query;
            res.send({answer: baseModel});
        },
        post: (req, res) => {
            const {
                baseModel
            } = req.body;
            res.send({ answer: baseModel});
        }
    }
}

module.exports = api;