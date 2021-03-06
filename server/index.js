require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const sequelize = require('./db')
const router = require('./routes/index')
const models = require('./models/models')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Error handler. Should be the last line!
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Server started on port: ', PORT))
    } catch (e) {
        console.log(e)
    }
}

start()