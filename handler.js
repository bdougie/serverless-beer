'use strict';

var AWS = require('aws-sdk');
var uuid = require('uuid');

// Your first function handler
module.exports.hello = (event, context, cb) => cb(null,
  { message: 'Go Serverless v1.0! Your function executed successfully!', event }
);

// You can add more handlers here, and reference them
module.exports.addRating = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var Item = {
      id: uuid.v4(),
      beer: event.body.beer,
      rating: Number(event.body.rating)
  };


  docClient.put({TableName: 'slsbeer', Item: Item}, (err, data) => {
      if (err) {
        callback(err);
      }
      callback(null, { data: data });
  });
}


module.exports.getRating = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'slsbeer',
    FilterExpression : 'beer = :beer_name',
    ExpressionAttributeValues : {':beer_name' : event.query.beer}
  }

  docClient.scan(params, (err, data) => {
    if (err) {
      callback(err);
    }

    var sum = data.Items.reduce((accumulated, current) => {
      return accumulated + current.rating}
    , 0);

    var avarage = sum/data.Items.length;

    callback(null, { avarageRating: avarage });
  });
}
