const {client} = require('./userdb');
const {logger,insertlog,deletelog} = require('../logging/logging');
const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId; 

class database
{
    async getRequest()
    {
        const result = await client.db("Exercise").collection("users").find({}).toArray();
        logger.log('info', 'Get request', { message: 'someone called get' });
        return result;
    }
    async postRequest(req)
    {
        const payload={
            name:req.body.name,
            email:req.body.email,
            contact:req.body.contact,
            password:req.body.password,
            isAdmin:req.body.isAdmin
          }
          let user = await client.db("Exercise").collection("users").findOne({"email":payload.email});
          if(user)
          {
              return 409;
          }
          const salt = await bcrypt.genSalt(10);
          payload.password = await bcrypt.hash(payload.password, salt);
         
          const result = await client.db("Exercise").collection("users").insertOne(payload);
          user = await client.db("Exercise").collection("users").findOne({"email":payload.email});
          return user;
    }
    async updateRequest(req)
    {
        var query = {"_id":ObjectId(req.params.id)};
        const payload ={
          email:req.body.email,
          password:req.body.password,
          contact:req.body.contact,
          isAdmin:req.body.isAdmin
        }
        const result = await client.db("Exercise").collection("users").updateOne(query, { $set: payload });
        return result;
    }
    async findOne(query)
    {
        const result = await client.db("Exercise").collection("users").findOne(query); 
        return result;
    }

    async deleteOne(query)
    {
        const response = await client.db("Exercise").collection("users").deleteOne(query);
        return;
    }
}

module.exports=database;