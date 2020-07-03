# cloud-developer
content for Udacity's cloud developer nanodegree

# Course 02 - Full Stack Apps on AWS
In this course the Udagram app is built using:
- **Frontend:** A basic Ionic client web application which consumes the RestAPI Backend.
- **RestAPI Backend:** A Node-Express server which handles the request to the frontend, uses a RDBMS in AWS to store user records and an S3 Bucket to store images.
- **Image Filtering Microservice:** A Node-Express application which runs a simple script to filter images uploaded to the S3 bucket. 

For the deployment of Node-Express servers **AWS Elastic Beanstalk** is used so the EB CLI is required, to install it refer to [EB CLI Install](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)

To create the S3 Bucket and the Database AWS-CLI will be used
```
sudo apt-get install awscli
```


## Deployment

### RestAPI Backend

### Frontend
- Set `apiHost` in src/environments/environment.prod.ts

```
npm install -g ionic

npm install
ionic serve

ionic build --prod
```
Upload www folder to S3 Bucket



# Course 04 - Develop & Deploy Serverless App
In this course the Serverless framework is used to deploy two apps to AWS infrastructure 
- **Udagram:** Built throughout the lessons (not the same as Course2). Allow the user to upload images to the app
- **Project:** Users can create TODO item in the app, add information about their TODO and also an image

## Deploy Project

It is required to create an account and an app in [Auth0](https://auth0.com/)

### Backend
```
# Install serverless
npm install -g serverless

# Install backend dependencies
npm install
```
#### Run locally
Open `serverless.yml`
- Check that `provider.environment.IS_OFFLINE` is set to `true`
- Add `provider.environment._X_AMZN_TRACE_ID: 1`

```
# Install dynamodb local server
sls dynamodb install
# Start local dynamodb
sls dynamodb start

# Run serverless app offline
sls offline
```
#### Run on AWS
- Create IAM User (preferred) to deploy the app
- Set aws keys in `~/.aws/credentials`

Open `serverless.yml`
- Check that `provider.environment.IS_OFFLINE` is set to `false`
- Remove `provider.environment._X_AMZN_TRACE_ID`

```
[AWS_PROFILE]
aws_access_key_id=ACCESS_KEY
aws_secret_access_key=SECRET_ACCESS_KEY
```
- Go to backend folder and deploy app
```
sls deploy -v --aws-profile AWS_PROFILE --stage=prod
```
- To remove deployment
```
sls remove -v --aws-profile AWS_PROFILE --stage=prod
```
### Client
```
# Install client dependencies
npm install

# Start client
npm start
```
#### Configure client configs
- `apiEndpoint`: Serverless root url 
    - **Local:** [http://localhost:3003/dev](http://localhost:3003/dev)
    - **AWS:** [https://apiId.execute-api.us-east-1.amazonaws.com/prod](https://apiId.execute-api.us-east-1.amazonaws.com/prod)
- `domain`: auth0 domainname for the app
- `clientId`: auth0 clientId for the app