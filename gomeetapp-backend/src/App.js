import 'dotenv/config';
import './Database';
import 'express-async-errors';

import * as Sentry from '@sentry/node';
import Youch from 'youch';
import Cors from 'cors';
import Express from 'express';
import { resolve } from 'path';

import Routes from './Routes';
import sentryConfig from './Config/Sentry';

class App {
  constructor() {
    this.Server = Express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.Server.use(Sentry.Handlers.requestHandler());
    this.Server.use(Cors());
    this.Server.use(Express.json());
    this.Server.use(
      '/files',
      Express.static(resolve(__dirname, '..', 'tmp', 'Uploads'))
    );
  }

  routes() {
    this.Server.use(Routes);
    this.Server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.Server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal Server error' });
    });
  }
}

export default new App().Server;
