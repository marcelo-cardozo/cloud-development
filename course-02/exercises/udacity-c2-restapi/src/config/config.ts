export const config = {
  "dev": {
    "db":{
      "username": process.env.CLOUD2_DEV_DB_USERNAME,
      "password": process.env.CLOUD2_DEV_DB_PASSWORD,
      "database": process.env.CLOUD2_DEV_DB_DATABASE,
      "host": process.env.CLOUD2_DEV_DB_HOST,
      "dialect": "postgres",
    },
    "aws":{
      "region": process.env.CLOUD2_DEV_AWS_REGION,
      "profile": "default",
      "media_bucket": process.env.CLOUD2_DEV_AWS_MEDIA_BUCKET,
    },
    "jwt":{
      "secret":"helloworld"
    }
  },
  "prod": {
    "db":{
      "username": "",
      "password": "",
      "database": "udagram_prod",
      "host": "",
      "dialect": "postgres"
    },
    "aws":{
    }
  }
}
