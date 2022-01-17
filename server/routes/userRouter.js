const Router = require('express')

const router = new Router()

router.post('/registration', )
router.post('/login', )
router.get('/auth', (req, res) => {
    res.status(201).json({
        body: 'working!!!'
    })
})

module.exports = router