import __dirname from '../utils.js';

export default {
    welcome: {
        subject: '¡Bienvenido!',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/HeroSystems.png`,
                cid: 'banner'
            }
        ]
    },
    passwordrestore: {
        subject: 'Restablecimiento de contraseña',
        attachments: [
            {
                filename: 'banner.png',
                path: `${__dirname}/public/img/HeroSystems.png`,
                cid: 'banner'
            }
        ]
    },
    purchase: {
        subject: "Gracias por tu compra",
        attachments: [
            {
                filename: "banner.png",
                path: `${__dirname}/public/img/HeroSystems.png`,
                cid: "banner"
            }
        ]
    }
}