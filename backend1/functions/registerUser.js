'use strict';

const validator = require('validator')
const connectToDatabase = require('../db')
const User = require('../models/User')
const middy = require('middy')
const { cors } = require('middy/middlewares')

const {
  hashPassword,
  signToken
 } = require('../heavyLiftingFunctions/auth');


const registerUser = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
    const body = JSON.parse(event.body)
    let { name, email, password } = body
    
    //check if username ex and email is email and password is pas
    if(!name || !email || !password || validator.isEmail(email)!==true) {
      return {
        statusCode: 422,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({msg : "invalid input"})
    };
    }

    try {

      //check if user alredy exist
      let user
      connectToDatabase()
      user = await User.findOne({ email: email })
      if(user) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify({msg: "USER ALREDY EXISTS!!!"})
      }
      }

      //create user
      password = await hashPassword(password)
      connectToDatabase()
      user = new User({ name, email, password })
      await user.save()
     
      //create jwt
      const payload = { user: { id: user.id }}
      const token = await signToken(payload)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify(token)
    };
    } catch (err) {
      console.log(err)
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify(err)
    };
    }

  
};

const handler = middy(registerUser)
  .use(cors())

  module.exports = { handler }