import routes from './routes.js';
import CompraControllers from '../controllers/compra.controllers.js';

export default class CompraRoutes extends routes {

        constructor() {
            super();
            this.controller = new CompraControllers();
            this.getRoutes();
        }

        getRoutes() {
            this.router
            .get('/', this.controller.getAllCompras)
            .get('/:id', this.controller.getCompraById)
            .post('/', this.controller.createCompra)
            .put('/', this.controller.updateCompra)
            .delete('/:id', this.controller.deleteCompra)
            .delete('/', this.controller.deleteAllCompras)
        }




}
