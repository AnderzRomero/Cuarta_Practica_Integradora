
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import sessionsControllers from '../controllers/sessions.controllers.js';


class SessionsRouter extends BaseRouter {
    init() {
        // EndPoint para crear un usuario y almacenarlo en la Base de Datos
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'LOCALS' }), sessionsControllers.createUser);
        // EndPoint para logearse con el usuario
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'LOCALS' }), sessionsControllers.Login);
        // EndPoint para obtener la informacion del usuario
        this.get('/current', ['AUTH'], sessionsControllers.infoUser);
        // EndPoint para autenticacion de terceros con GitHub
        this.get('/github', ['NO_AUTH'], passportCall('github', { strategyType: 'LOCALS' }), async (req, res) => { });   //Trigger de mi estartegia de passport
        this.get('/githubcallback', ['NO_AUTH'], passportCall('github', { strategyType: 'LOCALS' }), sessionsControllers.loginTercerosGitHub);
        // EndPoint para autenticacion de terceros con Google
        this.get('/google', ['NO_AUTH'], passportCall('google', { scope: ['profile', 'email'], strategyType: 'LOCALS' }), async (req, res) => { });   //Trigger de mi estartegia de passport
        this.get('/googlecallback', ['NO_AUTH'], passportCall('google', { strategyType: 'LOCALS' }), sessionsControllers.loginTercerosGoogle);
        // EndPoint para la redirigir a la vista para la restauracion de contraseña
        this.post('/passwordRestoreRequest', ['NO_AUTH'], sessionsControllers.passwordRestoreRequest);
        // Endpoint para realizar la restauracion de contraseña
        this.put('/password-restore', ['NO_AUTH'], sessionsControllers.passwordRestore);
        // EndPoint para Finalizar la session
        this.get('/logout', ['AUTH'], sessionsControllers.logout);
    }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();