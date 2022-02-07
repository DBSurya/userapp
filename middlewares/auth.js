const jwt = require('jsonwebtoken');
const {client} = require('../db/userdb');
const config = require('config');
const connection = require('../db/userdb');
connection.connection();

module.exports = async function(req,res,next)
{
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. Login first to use the site');
    try{
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user= decoded;
        let user = await client.db("Exercise").collection("blacklist").findOne({"token":token});
        if(user)
            return res.status(401).send("Your session expired! Login again");
        next();
    }
    catch(ex)
    {
        next(ex);
    }
}