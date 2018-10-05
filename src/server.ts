import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import CityRouter from './routes/cities';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config() {
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'jade');
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    public routes(): void {
        const router = express.Router();
        this.app.use('/', router);
        this.app.use('/api/cities', CityRouter);
    }
}

export default new Server().app;