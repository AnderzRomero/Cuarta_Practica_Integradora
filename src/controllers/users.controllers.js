import jwt from 'jsonwebtoken';
import { productsService } from "../services/index.js";
import { usersService } from '../services/index.js';
import UserDTO from '../dto/User.js';
import { getValidFilters } from "../utils.js"
import config from '../config/config.js';
import uploader from '../services/uploadService.js';

const home = async (req, res, next) => {
    try {
        return res.render("home", {
            css: 'home'
        });
    } catch (error) {
        req.logger.error(error);
    }
}

const contact = async (req, res, next) => {
    try {
        return res.render("contact", {
            css: 'contact'
        });
    } catch (error) {
        req.logger.error(error);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await usersService.getUsers();
        const usersInfo = users.map((user) => UserDTO.getTokenDTOFrom(user));
        req.logger.info("Usuarios recibidos correctamente", usersInfo);
        return res.send({ status: "success", payload: usersInfo });
    } catch (error) {
        req.logger.error("No se pudo Obtener los usuarios", error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const getUserBy = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUser({ _id: uid });
        if (!user)
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        return res.send({ status: "success", payload: user });
    } catch (error) {
        req.logger.error(error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUser({ _id: uid });
        if (!user)
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        const result = await usersService.updateUser(uid, req.body);
        req.logger.info("Usuario actualizado correctamente", { uid });
        return res.send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error("No se pudo realizar la actualizacion", error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUser({ _id: uid });
        if (!user) return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        await usersService.deleteUser(uid);
        req.logger.info("Usuario eliminado correctamente", { uid });
        return res.send({ status: "success", message: "User deleted successfully" });
    } catch (error) {
        req.logger.error("No fue posible eliminar el usuario", error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const upgradeUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const usersInfo = await usersService.getUser({ _id: uid });
        const user = UserDTO.getTokenDTOFrom(usersInfo);

        if (!user) {
            return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
        }
        if (user.role === "premium") {
            return res.status(400).send({ status: "error", message: "Usuario ya actualizado" });
        }
        if (user.role === "user" && user.isPremium === true) {
            await usersService.updateUser({ _id: uid }, { role: "premium" });
            const tokenizedUser = UserDTO.getTokenDTOFromPremium({ ...user, role: "premium" });
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: "1d" });
            res.cookie(config.jwt.COOKIE, token);
            req.logger.info("Usuario actualizado");

            const usersInfoUpdate = await usersService.getUser({ _id: uid });
            const infoUpdateUser = UserDTO.getTokenDTOFrom(usersInfoUpdate);

            return res.status(200).send({ status: "success", message: "Usuario actualizado correctamente", payload: infoUpdateUser });
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        req.logger.error("Error al actualizar usuario", error);
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const uploadDocuments = async (req, res, next) => {
    try {
        // Acceder a los archivos cargados
        const profile = req.files["profile"][0];
        const frontDni = req.files["frontDni"][0];
        const backDni = req.files["backDni"][0];
        const addressProof = req.files["addressProof"][0];
        const bankStatement = req.files["bankStatement"][0];

        // Crear un array de objetos con la información de los archivos cargados
        const documents = [
            { name: profile.filename, reference: profile.path },
            { name: frontDni.filename, reference: frontDni.path },
            { name: backDni.filename, reference: backDni.path },
            { name: addressProof.filename, reference: addressProof.path },
            { name: bankStatement.filename, reference: bankStatement.path },
        ];
        // Actualizar el usuario con los archivos cargados
        const user = await usersService.updateUser(
            { _id: req.user.id },
            { documents }
        );

        // Enviar la respuesta
        return res.sendSuccess({ status: "success", message: "Documentos subidos correctamente" });
    } catch (error) {
        uploader(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                req.logger.error(error);
                const customError = new Error();
                const knownError = ErrorsDictionary[error.name];

                if (knownError) {
                    customError.name = knownError,
                        customError.message = error.message,
                        customError.code = errorCodes[knownError];
                    next(customError);
                } else {
                    next(error);
                }
            } else {
                req.logger.error(error);
                const customError = new Error();
                const knownError = ErrorsDictionary[error.name];

                if (knownError) {
                    customError.name = knownError,
                        customError.message = error.message,
                        customError.code = errorCodes[knownError];
                    next(customError);
                } else {
                    next(error);
                }
            }
        });
    }
};

const login = async (req, res, next) => {
    try {
        req.logger.info("Se redirecciona a la vista de login");
        res.render('login', {
            css: 'login'
        })
    } catch (error) {
        req.logger.error("No se logro redireccionar a la vista de login", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}
const register = async (req, res, next) => {
    try {
        req.logger.info("Se redirecciona a la vista de registrar");
        res.render('register', {
            css: 'register'
        })
    } catch (error) {
        req.logger.error("No se logro redireccionar a la vista de registrar", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }

}
const profile = async (req, res, next) => {
    try {
        req.logger.info("Se redirecciona a la vista de perfil");
        return res.render('Profile', {
            css: 'profile'
        });
    } catch (error) {
        req.logger.error("No se logro redireccionar a la vista de perfil", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}
const getproducts = async (req, res, next) => {
    try {
        let { page = 1, limit = 4, sort, ...filters } = req.query;
        const cleanFilters = getValidFilters(filters, 'product')

        // Añadir lógica de ordenación por precio
        const sortOptions = {};
        if (sort === 'asc') {
            sortOptions.price = 1; // Orden ascendente por precio
        } else if (sort === 'desc') {
            sortOptions.price = -1; // Orden descendente por precio
        }

        const pagination = await productsService.paginateProducts(cleanFilters, { page, lean: true, limit, sort: sortOptions });
        res.render('Products', {
            css: 'products',
            user: req.user,
            products: pagination.docs,
            page: pagination.page,
            hasPrevPage: pagination.hasPrevPage,
            hasNextPage: pagination.hasNextPage,
            prevPage: pagination.prevPage,
            nextPage: pagination.nextPage,
            totalPages: pagination.totalPages
        });
    } catch (error) {
        req.logger.error("No se logro Obtener la vista de productos", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

const passwordRestore = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return res.render('RestorePasswordError', { error: 'Ruta inválida, favor de solicitar un nuevo link de restablecimiento' });
        //El hecho de que me pase un token, NO SIGNIFICA QUE YA SEA VÁLIDO, falta corroborar:
        //1. ¿El token está expirado?
        //2. ¿El token siquiera es válido?
        try {
            jwt.verify(token, config.jwt.SECRET);
            res.render('PasswordRestore', {
                css: 'restore'
            });
        } catch (error) {
            req.logger.error("Link inválido o corrupto, favor debe solicitar un nuevo correo");
            req.logger.info(Object.keys(error));
            if (error.expiredAt) {
                return res.render('RestorePasswordError', { error: "El link de este correo expiró, favor de solicitar un nuevo correo" });
            }
            res.render('RestorePasswordError', { error: 'Link inválido o corrupto, favor de solicitar un nuevo correo' });
        }
    } catch (error) {
        req.logger.error("No se logro redireccionar a la vista de restauracion de password", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }

}

const productCreator = async (req, res, next) => {
    try {
        return res.render('productCreator', {
            css: 'productsCreater'
        });
    } catch (error) {
        req.logger.error("No se logro redireccionar a la vista de creacion de productos", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

const premium = async (req, res, next) => {
    try {
        return res.render('premium', {
            css: 'premium'
        });
    } catch (error) {
        req.logger.error("No se logro redireccionar a la vista de Premium", error)
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
};

export default {
    home,
    contact,
    getUsers,
    getUserBy,
    updateUser,
    deleteUser,
    upgradeUser,
    uploadDocuments,
    login,
    passwordRestore,
    register,
    profile,
    getproducts,
    productCreator,
    premium
}