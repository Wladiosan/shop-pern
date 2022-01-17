class UserController {

    async registration(req, res) {

    }

    async login(req, res) {

    }

    async check(req, res) {
        const query = req.query
        res.status(200).json(query)
    }
}

module.exports = new UserController()