import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let UsersDao; 
        let CartsDao; 
        let ProductsDao;
        let MessagesDao;
        let TicketsDao;

        switch (config.app.PERSISTENCE) {
            case "FS": {
                UsersDao = (await import('./filesystem/usersDao.js')).default;
                ProductsDao = (await import('./filesystem/productsDao.js')).default;
                CartsDao = (await import('./filesystem/cartsDao.js')).default;
                MessagesDao = (await import('./filesystem/messagesDao.js')).default;
                TicketsDao = (await import('./filesystem/ticketsDao.js')).default;
                break;
            }
            case "MONGO": {
                UsersDao = (await import('./mongo/usersDao.js')).default;
                ProductsDao = (await import('./mongo/productsDao.js')).default;
                CartsDao = (await import('./mongo/cartsDao.js')).default;
                MessagesDao = (await import('./mongo/messagesDao.js')).default;
                TicketsDao = (await import('./mongo/ticketsDao.js')).default;
                break;
            }
        }
        return {
            UsersDao,
            CartsDao,
            ProductsDao,
            MessagesDao,
            TicketsDao
        }
    }
}