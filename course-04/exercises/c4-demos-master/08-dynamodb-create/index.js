'use strict'

const AWS = require('aws-sdk')
const uuid = require('uuid')

const docClient = new AWS.DynamoDB.DocumentClient()
const groupsTable = process.env.GROUP_TABLE

exports.handler = async (event) => {
  const parsedBody = JSON.parse(event.body);
  const item = {
    id: uuid.v4(),
    ...parsedBody
  }
  
  var params = {
    TableName : groupsTable,
    Item: item
  };
  
  await docClient.put(params).promise();

  const response = {
      statusCode: 201,
      headers:{
        "Access-Control-Allow-Origin":"*"
      },
      body: JSON.stringify(item),
  };
  return response;
};

