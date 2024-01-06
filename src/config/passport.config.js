import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import UsersDao from "../dao/mongo/usersDao.js";
import GithubStrategy from 'passport-github2';
import CartsDao from "../dao/mongo/cartsDao.js";
import auth from "../services/auth.js";
import config from "./config.js";

const usersServices = new UsersDao();
const cartsServices = new CartsDao();

const initializeStrategies = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email', session: false },
        async (req, email, password, done) => {
            try {
                const { firstName, lastName, age } = req.body;
                if (!firstName || !lastName || !age) return done(null, false, { message: "Valores incompletos" })
                //Coroborar que el usuario no exista.
                const exists = await usersServices.getBy({ email });
                if (exists) return done(null, false, { message: "Usuario ya registrado." });

                const hasedPassword = await auth.createHash(password);
                const newUser = { firstName, lastName, email, age, password: hasedPassword }

                //Revisar la librería temporal
                let cart;

                if (req.cookies['cart']) {//Obtener la que ya está de la cookie
                    cart = req.cookies['cart'];
                } else { //Crear una nueva librería en la base de datos
                    cartResult = await cartsServices.create();
                    cart = cartResult._id
                }
                newUser.cart = cart;

                const result = await usersServices.create(newUser);
                return done(null, result);
            } catch (error) {
                req.logger.erro("Hubo un error al regustrar el usuario", error);
                return done(error);
            }
        }));

    passport.use('login', new LocalStrategy({ usernameField: 'email', session: false }, async (email, password, done) => {
        try {
            if (!email || !password) return done(null, false, { message: "Valores incompletos" });
            if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {
                const adminUser = {
                    role: 'admin',
                    id: '0',
                    firstName: 'admin'
                }
                return done(null, adminUser);
            }

            //Aquí el usuario sí debería existir, corroborar primero.
            const user = await usersServices.getBy({ email });
            if (!user) return done(null, false, { message: "Credenciales Incorrectas" });
            //Ahora toca validar su contraseña, ¿es equivalente?
            const isValidPassword = await auth.validatePassword(password, user.password);
            if (!isValidPassword) return done(null, false, { message: "Credenciales Incorrectas" });
            return done(null, user);
        } catch (error) {
            req.logger.error("Ocurrio algun error al logearse", error);
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        session: false,
        clientID: 'Iv1.47994dddd59e9f0e',
        clientSecret: 'c07df5b4bf34171576817394190b1424b2f3b45b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile._json;

        const user = await usersServices.getBy({ email });
        if (!user) {
            let cart;

            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const cartResult = await cartsServices.create();
            cart = cartResult._id

            newUser.cart = cart;

            const result = await usersServices.create(newUser);
            done(null, result);
        } else {
            done(null, user);
        }
    }))

    passport.use('google', new GoogleStrategy({
        clientID: config.google.CLIENT,
        clientSecret: config.google.SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/googlecallback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        const { _json } = profile;
        const user = await usersServices.getBy({ email: _json.email });
        if (user) {
            return done(null, user);
        } else {
            const newUser = {
                firstName: _json.given_name,
                lastName: _json.family_name,
                email: _json.email
            }
            //Revisar la librería temporal
            let cart;

            if (req.cookies['cart']) {//Obtener la que ya está de la cookie
                cart = req.cookies['cart'];
            } else { //Crear una nueva librería en la base de datos
                cartResult = await cartsServices.create();
                cart = cartResult._id
            }
            newUser.cart = cart;

            const result = await usersServices.create(newUser);
            done(null, result);
        }
    }))



    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([auth.cookieExtractor]),
        secretOrKey: config.jwt.SECRET
    }, async (payload, done) => {
        return done(null, payload);
    }))
}

export default initializeStrategies;