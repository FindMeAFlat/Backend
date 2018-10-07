import {Router, Request, Response} from 'express';

class MapRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetMap(req: Request, res: Response): void {
        console.log(req.body.params);
    }

    routes() {
        this.router.post('/', this.GetMap);
    }
}

const mapRouter = new MapRouter();
mapRouter.routes();

export default mapRouter.router;