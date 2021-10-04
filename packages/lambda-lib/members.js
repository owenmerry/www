const AWS = require('aws-sdk')
const { config } = require('./config')

AWS.config.update({
  region: config.aws.dynamodb.region
})

async function getMembers () {
  const client = new AWS.DynamoDB.DocumentClient()

  if (!process.env.AWS_USERS_DB_TABLE) {
    throw new Error('No AWS_USERS_DB_TABLE var found in environment')
  }

  const items = await client.scan({
    TableName: process.env.AWS_USERS_DB_TABLE
  }).promise()

  return items.Items
}

module.exports = {
  getMembers
}
