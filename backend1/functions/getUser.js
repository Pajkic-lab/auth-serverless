'use strict';

const connectToDatabase = require('../db')
const User = require('../models/User')
const middy = require('middy')
const { cors } = require('middy/middlewares')

const { getUserFromToken } = require('../heavyLiftingFunctions/auth')


const getUser = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false 
    const userObj = await getUserFromToken(event.headers.Authorization)
    connectToDatabase()
    const user = await User.findById(userObj.user.id).select('-password')
    //const body = JSON.parse(event.body)

    return {
        statusCode: 203,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify(user)
    };
    
};

const handler = middy(getUser)
  .use(cors())

  module.exports = { handler }