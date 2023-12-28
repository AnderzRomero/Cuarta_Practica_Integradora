import BaseRouter from './BaseRouter.js';
import productsControllers from '../controllers/products.controllers.js';
import uploader from "../services/uploadService.js";

class ProductsRouter extends BaseRouter {
  init() {
    // EndPoint para traer todos los productos
    this.get('/', ['PUBLIC'], productsControllers.getproducts);
    // EndPoint para traer producto por ID
    this.get("/:pid", ['PUBLIC'], productsControllers.getProductBy);
    // EndPoint para crear producto 
    this.post("/", ['ADMIN'], uploader.array('thumbnail'), productsControllers.createProduct);
    // EndPoint para Actualizar producto por ID
    this.put("/:pid", ['ADMIN'], productsControllers.updateProductBy);
    // EndPoint para eliminar producto por ID
    this.delete("/:pid", ['ADMIN'], productsControllers.deleteProductBy);
  }
}

const productsRouter = new ProductsRouter();

export default productsRouter.getRouter();
