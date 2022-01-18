const uuid = require('uuid')
const path = require('path')

const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {

    async create(req, res, next) {
        try {
            const {name, price, brandId, typeId} = req.body
            const {img} = req.files
            let {info} = req.body
            let fileName = uuid.v4() + '.jpg'

            await img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const device = await Device.create({name, price, brandId, typeId, img: fileName})

            if (info) {
                info = JSON.parse(info)
                info.forEach( i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                })
            }

            return res.json(device)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        let devices
        let offset

        page = page || 1
        limit = limit || 10
        offset = page * limit - limit

        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }

        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }

        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }

        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {brandId, typeId}, limit, offset})
        }

        return await res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne({
            where: {id},
            include: [{
                model: DeviceInfo, as: 'info'
            }]
        })
        return res.json(device)
    }
}

module.exports = new DeviceController()