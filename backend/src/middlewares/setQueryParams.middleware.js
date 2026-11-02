
const setQueryParams = (name, value) => async(req, res, next) =>{
    req.query[name] = value
    next()
}

module.exports = setQueryParams