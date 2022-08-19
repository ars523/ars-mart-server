const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500
    console.log(err.message)
    res.status(statusCode)
    res.json({
        message: err.message
    })
}
module.exports = {errorHandler}