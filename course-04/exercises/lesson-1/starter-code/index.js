const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  // TODO: Use these variables to record metric values
  let endTime
  let requestWasSuccessful
  let startTime;
  try {
  
    startTime = timeInMs();
    await axios.get(url);
    endTime = timeInMs();
  
    requestWasSuccessful = true;
  } catch (error) {
    endTime = timeInMs();
    requestWasSuccessful = false;
  }

  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Latency',
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Milliseconds', 
        Value: endTime-startTime // Total value
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()

  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Successful', 
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Count', 
        Value: 1 // Total value
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()


}

function timeInMs() {
  return new Date().getTime()
}
