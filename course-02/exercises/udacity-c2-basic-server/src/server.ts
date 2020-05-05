import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';
import { request } from 'http';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express applicaiton
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // GET a list of cars, filterable by make with a query paramater
  app.get("/cars",
    (req: Request, res: Response) => {
      let { make } = req.query;
      
      var result:Car[] = null;

      if ( make ) {
        result = [];
        for (let index = 0; index < cars.length; index++) {
          const car = cars[index];
          if(car.make === make){
            result.push(car);
          }
        }
      } else {
        result = cars;
      }

      return res.status(200).send(result);
    });


  // endpoint to get a specific car, requires id, fails gracefully if no matching car is found
  app.get("/cars/:id",
    (req: Request, res: Response) => {
      const { id } = req.params;
      if ( !id ) {
        return res.status(400).send("id is required");
      }
      
      var carPos : number = -1;

      for (let index = 0; index < cars.length; index++) {
        const car = cars[index];
        if(car.id == id){
          carPos = index;
        }
      }

      if ( carPos != -1 ){
        return res.status(200).send(cars[carPos]);
      }else{
        return res.status(404).send("The car was not found");
      }
    });

  /// endpoint to post a new car to our list, requires id, type, model, and cost
  app.post("/cars",
    async ( req: Request, res: Response ) => {
      const { id, type, model, cost, make } = req.body;
      
      var error : string = null;
      if ( !id ) {
        error = "id is required";
      } else if ( !type ) {
        error = "type is required";
      } else if ( !model ) {
        error = "model is required";
      } else if ( !cost ) {
        error = "cost is required";
      }
      if ( error ){
        return res.status(400).send(error);
      }

      let newCar : Car = { id:id, type: type, model: model, cost: cost, make: make}; 
      cars.push(newCar);

      return res.status(201).send(newCar);
    } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();