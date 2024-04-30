import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import * as cors from "cors"
require('dotenv').config();

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
          if (typeof route.controller[route.action] === 'function') {
            const result = route.controller[route.action](req, res, next);
            if (result instanceof Promise) {
              result.then(result => {
                if (result !== null && result !== undefined) {
                  // Only return necessary data
                  res.json({
                    id: result.id,
                    username: result.username,
                    // other necessary properties...
                  });
                }
              });
            } else if (result !== null && result !== undefined) {
              // Only return necessary data
              res.json({
                id: result.id,
                username: result.username,
                // other necessary properties...
              });
            }
          } else {
            console.error(`Method ${route.action} not found on controller ${route.controller.constructor.name}`);
          }
        });
      });

    // setup express app here
    // ...

    // start express server
    app.listen(3000)

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))