'use strict';

const validator = require('validator')
const connectToDatabase = require('../db')
const User = require('../models/User')
const middy = require('middy')
const { cors } = require('middy/middlewares')

const { checkPassword, signToken } = require('../heavyLiftingFunctions/auth')


const loginUser = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
    const body = JSON.parse(event.body)
    let { email, password } = body
    
    //check if username ex and email is email and password is pas
    if(!password || validator.isEmail(email)!==true) {
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
        let user
        connectToDatabase()
        user = await User.findOne({ email })

        //check if user exist
        if(!user) {
            return {
              statusCode: 400,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'Authorization'
              },
              body: JSON.stringify({msg: "INVALID CREDENTIALS!!!"})
          }
          }

          //decode password
          const isMatch = await checkPassword(password, user)
          if(!isMatch) {
            return {
                statusCode: 401,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                  'Access-Control-Allow-Headers': 'Authorization'
                },
                body: JSON.stringify({msg: "INVALID CREDENTIALS!!!"})
            }
          }

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
          statusCode: 405,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify(err)
      };
    }

  
};

const handler = middy(loginUser)
  .use(cors())

  module.exports = { handler }