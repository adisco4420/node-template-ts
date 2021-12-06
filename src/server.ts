import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as helmet from 'helmet'
import errorHandler = require("errorhandler");
import { dbConfig } from './models/_config';
import { routes } from './routes/index.route';
import { morgan } from './utilities/logger.util'


/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {

    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    dbConfig()
    routes(this.app);
  }
  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  
  public config() {    
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({extended: true }));

    this.app.use(helmet())
    this.app.use(morgan)

    //cors error allow
    this.app.options("*", cors());
    this.app.use(cors());

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }


  
}