# cloud-developer
content for Udacity's cloud developer nanodegree

# Course 02 - Full Stack Apps on AWS


# Course 04 - Develop & Deploy Serverless App
In this course Serverless framework is used to deploy two apps to AWS infrastructure 
- Udagram: Built throughout the lessons. Allow the user to upload images to the app
- Project: Users can create TODO item in the app, add information about their TODO and also an image

## Deploy Project
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