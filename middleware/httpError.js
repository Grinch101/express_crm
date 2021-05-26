const { jsonify } = require('../utility/utils')


const httpError = function (err,req, res, next){
    jsonify('ERROR', null, err.message, 500, res, client)
    next(err)
}

module.exports = httpError