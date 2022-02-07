const {logger} = require('../logging/logging');

module.exports = function(err,req,res,next)
{
    if(err.message==="jwt expired")
    {
    logger.error("Session expired");
    return res.status(408).send('Your session expired! Login again');
    }
    logger.error(err.message);
    res.status(500).send(err);
}