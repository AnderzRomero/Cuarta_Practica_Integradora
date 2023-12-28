import BaseRouter from "./BaseRouter.js";
import cartsControllers from "../controllers/carts.controllers.js";

class CartsRouter extends BaseRouter {
  init() {
    // Endpoint para obtener carrito
    this.get("/", ['USER', 'ADMIN'], cartsControllers.getCart);
    // Endpoint para obtener carrito para compra
    this.get("/:cid",['USER'], cartsControllers.getCartCompra);    
    // Endpoint para crear carrito
    this.post("/", ['ADMIN'], cartsControllers.createCart);
    // Endpoint para crear tickets
    this.post("/:cid/purchase", ['USER'], cartsControllers.purchaseCart);
    // Endpoint para actualizar o agregar producto al carrito sin iniciar session
    this.put('/:cid/products/:pid', ['NO_AUTH'], cartsControllers.updateProductInCartNO_AUTH);
    // Endpoint para actualizar o agregar producto al carrito Autenticado
    this.put('/products/:pid', ['USER'], cartsControllers.updateProductInCart);
    // Endpoint para eliminar producto del carrito
    this.delete('/products/:pid', ['USER'], cartsControllers.deleteProductInCart);    
    // Endpoint para vaciar Totalmente el carrito
    this.delete('/products', ['USER'], cartsControllers.deleteAllProductsInCart);
  }
}

const cartsRouter = new CartsRouter();

export default cartsRouter.getRouter();
