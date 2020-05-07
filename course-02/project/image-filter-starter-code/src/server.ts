import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", 
    async (req , res) => {
      const imageUrl = req.query.image_url
      console.log(imageUrl);

      if ( !imageUrl ){
        return res.status(400).send('image_url required');
      }else if(!isUrlValid(imageUrl)){
        return res.status(400).send('image_url is not a valid url');
      }
      const filteredUrl = await filterImageFromURL(imageUrl);
      
      res.status(200).sendFile(filteredUrl);
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );

  function isUrlValid(url : string) : boolean {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
})();