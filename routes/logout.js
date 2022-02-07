const express = require('express');
const router = express.Router();
const {client} = require('../db/userdb');
const {logger} = require('../logging/logging');
const config = require('config');
const jwt = require('jsonwebtoken');

module.exports=function(client)
{
router.post('/', async (req, res,next) => 
{
  try
  {
  const token = req.header('x-auth-token');
  if(!token)
  return res.status(401).send('Login first to logout');

  const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
  req.user= decoded;
  let user = await client.db("Exercise").collection("blacklist").findOne({"token":token});
  if(user)
    return res.status(204).send("You logged out already!");
  const result = await client.db("Exercise").collection("blacklist").insertOne({token});
  if(result)
  {
    res.send("You logged out successfully");
    logger.info(`User with email ${req.user.email} is logged out`);
  }
}
  catch(e)
  {
      next(e);
  }
});
return router;
}

//module.exports = router;