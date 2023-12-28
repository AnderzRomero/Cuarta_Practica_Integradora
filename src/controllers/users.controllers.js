import jwt from 'jsonwebtoken';
import { productsService } from "../services/index.js";
import { getValidFilters } from "../utils.js"
import config from '../config/config.js';

const login = async (req, res) => {
    req.logger.info("Se redirecciona a la vista de logeó");
    res.render('login')
}
const register = async (req, res) => {
    req.logger.info("Se redirecciona a la vista de registrar");
    res.render('register')
}
const profile = async (req, res) => {
    req.logger.info("Se redirecciona a la vista de perfil");
    res.render('Profile');
}
const getproducts = async (req, res) => {
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
}

const passwordRestore = async (req, res) => {
    const { token } = req.query;
    if (!token) return res.render('RestorePasswordError', { error: 'Ruta inválida, favor de solicitar un nuevo link de restablecimiento' });
    //El hecho de que me pase un token, NO SIGNIFICA QUE YA SEA VÁLIDO, falta corroborar:
    //1. ¿El token está expirado?
    //2. ¿El token siquiera es válido?
    try {
        jwt.verify(token, config.jwt.SECRET);
        res.render('PasswordRestore');
    } catch (error) {
        req.logger.error("Link inválido o corrupto, favor debe solicitar un nuevo correo");
        req.logger.info(Object.keys(error));
        if (error.expiredAt) {
            return res.render('RestorePasswordError', { error: "El link de este correo expiró, favor de solicitar un nuevo correo" });
        }
        res.render('RestorePasswordError', { error: 'Link inválido o corrupto, favor de solicitar un nuevo correo' });
    }
}

const productCreator = async (req, res, next) => {
    try {
        return res.render('productCreator', {
            css: 'productsCreater'
        });
    } catch (error) {
        req.logger.error("No se pudo Actualizar el producto en el carrito", error);
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
    login,
    passwordRestore,
    register,
    profile,
    getproducts,
    productCreator
}