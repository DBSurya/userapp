const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/Exercise";
const client = new MongoClient(uri);
const db = client.db("Exercise");
const {userSchema} = require('../schema/users');
const {logger} = require('../logging/logging');

client.connect();

async function connection(){
    try{
       const result = await db.command({ listCollections: 1 });
       const collectionsList = result.cursor.firstBatch;
       var collectionExist = false;
       collectionsList.forEach(collection => 
          {
             if(collection.name==="users")
             {
             collectionExist = true;
             }
          }
          );
       if(!collectionExist)
       await db.createCollection("users",userSchema);
    }
    catch(e)
    {
    logger.error(e);
    }
 }

 module.exports.connection = connection;
 module.exports.client = client;