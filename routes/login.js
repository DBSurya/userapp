const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {client} = require('../db/userdb');
const {logger} = require('../logging/logging');
const {generateAuthToken} = require('../schema/users');
const database = require('../db/database');

const crud = new database();

module.exports = function(client)
{
router.post('/', async (req, res,next) => {
  try{
    const payload={
      email:req.body.email,
      password:req.body.password
    }
    var query = {"email":payload.email};
    const result = await crud.findOne(query);
    if(!result)
      return res.status(401).send('You have not registered yet!');
    const validPassword = await bcrypt.compare(payload.password,result.password);
    if(!validPassword)
    return res.status(401).send('Invalid password');
    const token = generateAuthToken(result);
    logger.info(`user with email: ${payload.email} is logged in`);
    res.header('x-auth-token',token).send(token);
  }
catch(e)
{
  next(e);
}});
return router;
}

//module.exports = router;