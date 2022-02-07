const express = require('express');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();
var ObjectId = require('mongodb').ObjectId; 
const {logger,insertlog,deletelog} = require('../logging/logging');
const Event = require('../events/events');
const {validate} = require('../schema/users');
const event = new Event();
const database = require('../db/database');

const crud = new database();

module.exports = function(client)
{
  router.get('/',[auth,admin],async (req, res,next) => {
    try{
      const result =await crud.getRequest();
      res.send(result);
    }
  catch(e)
  {
    next(e);
  }
  });
  
  router.post('/', [auth,admin],async (req, res,next) => {
    
      try
      {
      const { error } = validate(req.body);   
      if (error) return res.status(400).send(error);
      const user=await crud.postRequest(req);
      if(user===409)
      res.status(409).send("Email already registered!");
      event.on('userinserted',(user)=>
      {
        insertlog.info(`user inserted: id:${user._id}, name:${user.name}, email:${user.email}, contact:${user.contact}, isAdmin:${user.isAdmin}`);
      }
      );
      event.insert(user);
      res.status(201).send(user);
    }
  catch(e)
  {
    next(e);
  }
  }
  );
  
  router.put('/:id',[auth,admin],async(req,res,next)=>
  {
    try{
      const { error } = validate(req.body);   
      if (error) return res.status(400).send(error);
      const result = await crud.updateRequest(req);
      logger.info(`user with the id:${ObjectId(req.params.id)}is updated`);
      res.send(result);
    }
    catch(e)
    {
      next(e);
    }
  }
  );
  
  router.delete('/:id',[auth,admin],async (req, res,next) => {
    try
    {
      var query = {"_id":ObjectId(req.params.id)};
      const user = await crud.findOne(query);
      if(user)
      {
        event.on('userdeleted',(user)=>
        {
          logger.warn(`user with id:${user._id}is deleted`);
          deletelog.warn(`user deleted: id:${user._id}, name:${user.name}, email:${user.email}, contact:${user.contact}, isAdmin:${user.isAdmin}`);
        }
        );
        event.delete(user);
        const response = await crud.deleteOne(query);
        res.send(user);
      }
      else
      res.status(404).send("No user found with the given id");
    }
    catch(e)
    {
      next(e);
    }
  });
  
  router.get('/me',auth,async(req,res,next)=>
  {
    try
    {
      var query = {"email":req.user.email};
      const result = await crud.findOne(query);
      if(!result)
      return res.status(404).send('Resource not found');
      logger.info(`Individual details of mail:${req.user.email} is called`);
      res.send(result);
    }
    catch(e)
    {
      next(e);
    }
  }
  );
  
  router.get('/:id', [auth,admin] ,async (req, res,next) => {
    try
    {
      var query = {"_id":ObjectId(req.params.id)};
      const result = await crud.findOne(query);
      if(!result)
      return res.status(404).send('Resource not found');
      logger.info(`GET request of id:${ObjectId(req.params.id)} is called`);
      res.send(result);
    }
    catch(e)
    {
      next(e);
    }
  });
  return router;
}


//module.exports = router;