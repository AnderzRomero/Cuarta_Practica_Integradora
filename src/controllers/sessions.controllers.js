import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import ErrorsDictionary from "../dictionaries/errors.js";
import MailerService from '../services/MailerService.js';
import DMailTemplates from '../constants/DMailTemplates.js';
import UserDTO from '../dto/User.js';
import auth from '../services/auth.js';
import { usersService } from '../services/index.js';

const createUser = async (req, res, next) => {
    try {
        try {
            //Enviar un correo de bienvenida
            const mailerService = new MailerService();
            const result = await mailerService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user, });
        } catch (error) {
            req.logger.error(`Falló el envío de correo para ${req.user.email}`, error);
        }
        res.clearCookie('cart');
        req.logger.info("Usuario registrado correctamente");
        return res.sendSuccess('Usuario registrado correctamente');
    } catch (error) {
        req.logger.error("No se pudo realizar el registro de usuario");
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

const Login = async (req, res, next) => {
    try {
        if (!req.user) {
            req.logger.error("No se pudo autentinticar");
            return res.status(403).sendError("No se pudo autenticar");
        } else if (req.user.role === "admin") {
            const tokenizedUser = UserDTO.getTokenDTOadmin(req.user);
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            req.logger.info("Se realiza la autenticacion correctamente y se redirecciona a productos");
            return res.status(200).send({ status: "success", message: 'logeado correctamente', payload: req.user });
        } else {
            const tokenizedUser = UserDTO.getTokenDTOFrom(req.user);
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            req.logger.info("Se realiza la autenticacion correctamente y se redirecciona a productos");
            return res.status(200).send({ status: "success", message: 'logeado correctamente', payload: req.user });
        }
    } catch (error) {
        req.logger.error("No se encuentra registrado, porfavor realizar el registro!!");
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

const infoUser = async (req, res, next) => {
    try {
        if (!req.user) {
            req.logger.error("Usuario no autenticado");
            return res.status(403).sendError("Usuario no autenticado");
        } else {
            res.sendSuccessWithPayload(req.user);
        }
    } catch (error) {
        req.logger.error("No se puedo obtener la informacion del usuario");
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

const loginTercerosGitHub = async (req, res, next) => {
    try {
        try {
            //Enviar un correo de bienvenida
            const mailerService = new MailerService();
            const result = await mailerService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user });
        } catch (error) {
            req.logger.error(`Falló el envío de correo para ${req.user.email}`, error);
        }
        if (!req.user) {
            req.logger.error("No se pudo autentinticar");
            return res.status(403).sendError("No se pudo autenticar");
        } else {
            const tokenizedUser = UserDTO.getTokenDTOFromTerceros(req.user);
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            req.logger.info("Se realiza la autenticacion correctamente y se redirecciona a productos");
            return res.redirect('/api/products');
        }
    } catch (error) {
        req.logger.error("No se pudo realizar la autenticacion con Github");
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

const loginTercerosGoogle = async (req, res, next) => {
    try {
        try {
            //Enviar un correo de bienvenida
            const mailerService = new MailerService();
            const result = await mailerService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user });
        } catch (error) {
            req.logger.error(`Falló el envío de correo para ${req.user.email}`, error);
        }
        if (!req.user) {
            req.logger.error("No se pudo realizar la autentintacion");
            return res.status(403).sendError("No se pudo autenticar");
        } else {
            // Guardamos el usuario en la base de datos si no existe
            const tokenizedUser = UserDTO.getTokenDTOFromTerceros(req.user);
            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1h' });
            res.cookie(config.jwt.COOKIE, token);
            res.clearCookie('cart');
            req.logger.info("Se realiza la autenticacion correctamente y se redirecciona a productos");
            return res.redirect('/api/products');
        }
    } catch (error) {
        req.logger.error("No se pudo la autenticacion con Google");
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

const passwordRestoreRequest = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await usersService.getUser({ email });
        if (!user) return res.sendBadRequest("Usuario no existe");
        const token = jwt.sign({ email }, config.jwt.SECRET, { expiresIn: '1h' });
        const mailerService = new MailerService();
        const result = await mailerService.sendMail([email], DMailTemplates.PWD_RESTORE, { token });
        res.sendSuccess("Correo Enviado!!");
    } catch (error) {
        req.logger.error("No se pudo enviar el correo");
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
        const { newPassword, token } = req.body;
        if (!newPassword || !token) return res.sendBadRequest('Valores Incompletos');
        try {
            //El token es válido?
            const { email } = jwt.verify(token, config.jwt.SECRET);
            //El usuario sí está en la base?
            const user = await usersService.getUser({ email });
            if (!user) return res.sendBadRequest("Usuario no existe");
            //¿No será la misma contraseña que ya tiene?
            const isSamePassword = await auth.validatePassword(newPassword, user.password);
            if (isSamePassword) return res.sendBadRequest("La nueva contraseña no puede ser igual o alguna de las anteriores contraseñas");
            //Hashear mi nuevo password
            const hashNewPassword = await auth.createHash(newPassword);
            await usersService.updateUser(user._id, { password: hashNewPassword });
            res.sendSuccess();

        } catch (error) {
            req.logger.error("El token es invalido");
            res.sendBadRequest('Invalid token');
        }
    } catch (error) {
        req.logger.error("No se pudo realizar el cambio de contraseña");
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

const logout = async (req, res, next) => {
    try {
        res.clearCookie('authCookie'); // Elimina la cookie del token
        req.logger.info("Finalizo correctamente");
        return res.redirect('/');
    } catch (error) {
        req.logger.error("No se pudo realizar el cierre de session");
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

export default {
    createUser,
    Login,
    infoUser,
    loginTercerosGitHub,
    loginTercerosGoogle,
    passwordRestoreRequest,
    passwordRestore,
    logout
}

