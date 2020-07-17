import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import errorHandler = require("errorhandler");
import mongoose = require("mongoose"); 
import env from './env';

//routes
import UserRoute from './routes/user.route';
import chalk = require('chalk');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  private connection: mongoose.Connection;
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

    //add routes
    this.routes();

    this.runners(this.connection);
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

    //cors error allow
    this.app.options("*", cors());
    this.app.use(cors());

    // Mongose => fix all deprecation warnings
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);

    // Connect to MongoDB
    mongoose.connect(env.MONGODB_URI)
    .then(() => {
      console.log('✌🏾 Successfully connected to MongoDB');
    })
    .catch(err => {      
      console.log(chalk.default.red.bgBlack.bold('An error occured while conencting to MongoDB'));
    });

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    console.log(chalk.default.yellow.bgBlack.bold("Loading user routes"));
    UserRoute.loadRoutes('/user', router); 

    //use router middleware
    this.app.use(router);

    this.app.all('*', (req, res)=> {
      return res.status(404).json({ status: 404, error: 'not found' });
    });
  }
  

  private runners(connection: mongoose.Connection): any {
    //register and fire scheduled job runner classes
  }
}