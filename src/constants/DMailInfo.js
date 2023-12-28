import __dirname from '../utils.js';

export default {
    welcome: {
        subject: '¡Bienvenido!',
        attachments: [
            {
                filename: 'banner.jpg',
                path: `${__dirname}/public/img/HeroSystems.jpg`,
                cid: 'banner'
            }
        ]
    },
    passwordrestore: {
        subjet: 'Restablecimiento de contraseña',
        attachments: [
            {
                filename: 'banner.jpg',
                path: `${__dirname}/public/img/HeroSystems.jpg`,
                cid: 'banner'
            }
        ]
    }
}