import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command();
program.option('-m, --mode <mode>', 'Modo de trabajo', 'production')
    .option('-p <port>', 'Puerto del servidor', 8080)

program.parse();

dotenv.config({
    path: program.opts().mode === "dev" ? './.env.dev' : './.env.prod'
})

export default {
    app: {
        PORT: process.env.PORT || 8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
        LOGGER: process.env.LOGGER || 'development'
    },
    mongo: {
        URL: process.env.MONGO_URL || 'localhost:27017',
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DBNAME: process.env.DBNAME
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },
    google: {
        CLIENT: process.env.GOOGLE_CLIENT,
        SECRET: process.env.GOOGLE_SECRET,
        KEY_FILE: process.env.GOOGLE_KEY_FILE,
        BUCKET_NAME: process.env.GOOGLE_BUCKET_NAME
    },
    mailer: {
        USER: process.env.NODE_MAILER_USER,
        PWD: process.env.NODE_MAILER_PASSWORD
    }
}