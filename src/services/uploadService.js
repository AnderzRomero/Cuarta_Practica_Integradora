import multer from "multer";
import __dirname from "../utils.js";

// const storage = multer.diskStorage({

//     // Aqui va el QUE, el COMO y el DONDE se guarda
//     destination: function (req, file, callback) {
//         return callback(null, `${__dirname}/public/img`);
//     },
//     filename: function (req, file, callback) {
//         return callback(null, `${Date.now()}-${file.originalname}`);
//     }
// })

const storage = multer.memoryStorage();

// ya tengo el almacenamiento, ahora si, el uploader (cargador)

const uploader = multer({storage});

export default uploader;