const express = require('express');
const router = express.Router();
const {logger} = require('../logging/logging');
const {validate} = require('../schema/users');
const {client} = require('../db/userdb');
const connection = require('../db/userdb');
connection.connection();
const bcrypt = require('bcrypt');
const database = require('../db/database');

const crud = new database();

module.exports = function(client)
{
router.post('/', async (req, res,next) => {
  try
  {
    const { error } = validate(req.body);   
    if (error) return res.status(400).send(error);
    const user=await crud.postRequest(req);
    if(user===409)
    res.status(409).send("Email already registered!");
    const result = await crud.findOne({"email":user.email});
    logger.info(`New user with id:${result._id} is registered`);
    res.status(201).send(user);
 }
  catch(e)
  {
    next(e);
  }
});
return router;
}


//module.exports = router;