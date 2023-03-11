const api = {
    path: "/judge",
    superior: null,
    isDev: false,
    methods: {
        get: (req, res) => {
            const {
                st_id,
                baseModel,
                p_num
            } = req.query;
            res.send({ answer: api.superior.djs._startJudging(st_id, baseModel, p_num)});
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