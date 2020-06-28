# cloud-developer
content for Udacity's cloud developer nanodegree

# Course 02 - Full Stack Apps on AWS


# Course 04 - Develop & Deploy Serverless App
In this course Serverless framework is used to deploy two apps to AWS infrastructure 
- Udagram: Built throughout the lessons. Allow the user to upload images to the app
- Project: Users can create TODO item in the app, add information about their TODO and also an image

## Install locally
### Backend
```
npm install -g serverless
npm install

sls dynamodb install
sls dynamodb start

sls offline
```
### Client
```
npm install
```
#### Configure client configs
`apiEndpoint`: Serverless root url
`domain`: auth0 domainname for the app
`clientId`: auth0 clientId for the app