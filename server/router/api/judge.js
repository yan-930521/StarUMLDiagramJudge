const api = {
    path: "/judge",
    superior: null,
    isDev: false,
    methods: {
        get: (req, res) => {
            const {
                baseModel
            } = req.query;
            res.send({ answer: baseModel});
        },
        post: (req, res) => {
            const {
                baseModel
            } = req.body;
            abstractedResult = _abstractFromStudentAnswer(baseModel);
            res.send({ answer: abstractedResult});
        }
    }
}

module.exports = api;