const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema =
 {
    validator: {
       $jsonSchema: {
          bsonType: "object",
          required: [ "name", "email", "password", "contact","isAdmin" ],
          properties: {
             name: {
                bsonType: "string",
                description: "must be a string and is required"
             },
             email: {
                bsonType: "string",
                description: "must be a string and is required"
             },
             password: {
                bsonType:"string",
                description: "must be a string and is required"
             },
             contact: {
                bsonType: "string",
                description: "must be a string and is required"
             },
             isAdmin:
             {
               bsonType:"bool",
               description:"must be a boolean and is required"
             }
          }
       }
    }
 };


function validateuser(user){
   const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(3).required().email(),
      password: Joi.string().min(3).required(),
      contact: Joi.string().min(10).max(10).required(),
      isAdmin: Joi.boolean().required()
   })
   return schema.validate(user);
}

function generateAuthToken(result)
{
    const token = jwt.sign({email:result.email,isAdmin:result.isAdmin},config.get('jwtPrivateKey'),{
      expiresIn: '1h'
 });
    return token;
}

module.exports.userSchema = userSchema;
module.exports.validate = validateuser;
module.exports.generateAuthToken = generateAuthToken;