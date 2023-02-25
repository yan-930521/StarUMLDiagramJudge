const api = {
    path: "/add",
    superior: null,
    isDev: true,
    methods: {
        get: (req, res) => {
            const {
                a, b
            } = req.query;
            res.send({ answer: a + b});
        },
        post: (req, res) => {
            const {
                a, b
            } = req.body;
           
            res.send({ answer: a + b });
        }
    }
}


module.exports = api;

