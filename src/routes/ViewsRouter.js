import BaseRouter from "./BaseRouter.js";
import usersControllers from "../controllers/users.controllers.js";
import productsControllers from "../controllers/products.controllers.js";

class ViewsRouter extends BaseRouter {
  init() {
    // EndPoint para iniciar session
    this.get('/login', ['NO_AUTH'], usersControllers.login);
    // EndPoint para registrarse en la base de datos
    this.get('/register', ['NO_AUTH'], usersControllers.register);
    // EndPoint para ver datos del perfil
    this.get('/profile', ['AUTH'], usersControllers.profile);
    // EndPoint para traer todos los productos
    this.get('/', ['PUBLIC'], usersControllers.getproducts);
    //Endpoint para el Mocking de productos
    this.get('/mockingproducts', ['PUBLIC'], productsControllers.mockProducts);
    // Endpoint para la validacion de la restauracion de contraseña
    this.get('/password-restore',['PUBLIC'], usersControllers.passwordRestore);

    this.get('/productCreator',["ADMIN", "PREMIUM"], usersControllers.productCreator);
  }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();