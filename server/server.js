import express, { urlencoded } from 'express';
import UsersRoutes from '../routes/user.routes.js';
import CompraRoutes from '../routes/compra.routes.js';

export default class Server {

    static app = express();

    static middlewares() {
        Server.app.use(express.static('public'));
        Server.app.use(express.json());
        Server.app.use(urlencoded({ extended: true }));
        Server.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
        Server.app.use(express.static('public', {
            setHeaders: (res, path) => {
                if (path.endsWith('.css')) {
                    res.header('Content-Type', 'text/css');
                }
            }
        }));
    }

    static runServer(port) {
        Server.app.listen(port, () =>
            console.log(`Server corriendo en el puerto ${port}`));
    }

    static routes() {
        const users = new UsersRoutes();
        const compras = new CompraRoutes();
        Server.app.use('/usuarios', users.router);
        Server.app.use('/compras', compras.router);
    }

    static run(port) {
        Server.middlewares();
        Server.routes();
        Server.runServer(port);
    }




}


